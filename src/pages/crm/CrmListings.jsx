import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { LISTING_STATUS, PROPERTY_TYPES } from '../../data/staticData';
import { Search, Plus, Edit, Trash2, Eye, X, LayoutGrid, List, Home, Bed, Bath, Maximize, Share2, Building, Upload, MapPin } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-EG').format(n);
const statusColor = s => s==='Available'?'badge-success':s==='Reserved'?'badge-warning':'badge-danger';

// Multi-select Lead picker + channel selector for the Share modal.
// Uses local component state because the Modal's submit collects FormData,
// and we need a set + a string (not flat form fields).
const ShareBody = ({ leads, channels, onLeadsChange, onChannelChange }) => {
  const [picked, setPicked] = useState(() => new Set());
  const [channel, setChannel] = useState(channels[0]);
  const [q, setQ] = useState('');

  const filtered = leads.filter(l =>
    !q || l.name.toLowerCase().includes(q.toLowerCase()) || l.phone?.includes(q) || l.id.toLowerCase().includes(q.toLowerCase())
  );

  const toggle = (id) => {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setPicked(next);
    onLeadsChange(next);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div>
        <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Channel</label>
        <div style={{display:'flex',gap:8}}>
          {channels.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => { setChannel(c); onChannelChange(c); }}
              style={{
                padding:'8px 14px', borderRadius:8, cursor:'pointer',
                fontSize:12, fontWeight:600,
                border: channel === c ? '1px solid var(--brand)' : '1px solid var(--border)',
                background: channel === c ? 'var(--brand-tint)' : '#fff',
                color: channel === c ? 'var(--brand)' : 'var(--text-primary)',
              }}
            >{c}</button>
          ))}
        </div>
      </div>

      <div>
        <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'flex',justifyContent:'space-between',marginBottom:6}}>
          <span>Leads ({picked.size} selected)</span>
          <span style={{fontWeight:500,color:'var(--text-tertiary)'}}>Multi-select supported</span>
        </label>
        <input
          placeholder="Search lead by name, phone, ID…"
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={{width:'100%',padding:'9px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'inherit',marginBottom:8}}
        />
        <div style={{maxHeight:280,overflowY:'auto',border:'1px solid var(--border)',borderRadius:8}}>
          {filtered.map(l => (
            <label
              key={l.id}
              style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',cursor:'pointer',borderBottom:'1px solid var(--border)',background: picked.has(l.id) ? 'var(--brand-tint)' : '#fff'}}
            >
              <input type="checkbox" checked={picked.has(l.id)} onChange={()=>toggle(l.id)} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{l.name}</div>
                <div style={{fontSize:11,color:'var(--text-tertiary)'}}>{l.id} · {l.phone} · {l.stage}</div>
              </div>
            </label>
          ))}
          {filtered.length === 0 && <div style={{padding:'20px',textAlign:'center',color:'var(--text-tertiary)',fontSize:12}}>No leads match.</div>}
        </div>
      </div>
    </div>
  );
};

// ─── Map view (Leaflet + Google tiles) ─────────────────────────
// 11-May meeting (1:35-1:36): "Nawy-style maps are powerful — other
// brokerages use them." Visualise the agent's inventory geographically so
// they can answer "what do you have in [area]?" during a live call.
const STATUS_PIN_COLOR = { Available:'#16a34a', Reserved:'#f59e0b', Sold:'#ef4444' };

const ListingsMap = ({ listings, onMarkerClick }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  // Drop listings without coordinates (fallback safety).
  const geoListings = useMemo(() => listings.filter(l => typeof l.lat === 'number' && typeof l.lng === 'number'), [listings]);

  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || !window.L || !containerRef.current || mapRef.current) return;
      const map = window.L.map(containerRef.current, { center: [30.05, 31.45], zoom: 9, zoomControl: true, scrollWheelZoom: true });
      window.L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20, subdomains: ['mt0','mt1','mt2','mt3'], attribution: '© Google',
      }).addTo(map);
      mapRef.current = { map, markers: [] };
    };
    if (window.L) { init(); }
    else if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'leaflet-css'; css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      const js = document.createElement('script');
      js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      js.async = true; js.onload = init;
      document.body.appendChild(js);
    } else {
      const wait = setInterval(() => { if (window.L) { clearInterval(wait); init(); } }, 80);
      return () => clearInterval(wait);
    }
    return () => { cancelled = true; if (mapRef.current?.map) { mapRef.current.map.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    const ref = mapRef.current;
    if (!ref || !window.L) return;
    ref.markers.forEach(m => m.remove());
    ref.markers = geoListings.map(l => {
      const color = STATUS_PIN_COLOR[l.status] || '#64748b';
      const html = `<div style="background:${color};color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.25);white-space:nowrap;">EGP ${(l.price/1e6).toFixed(1)}M</div>`;
      const icon = window.L.divIcon({ className: 'crm-map-pin', html, iconSize: [70, 26], iconAnchor: [35, 13] });
      const m = window.L.marker([l.lat, l.lng], { icon })
        .addTo(ref.map)
        .bindPopup(`
          <div style="font-family:inherit;min-width:200px;">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${l.project} · ${l.unitCode}</div>
            <div style="font-size:11px;color:#64748b;margin-bottom:6px;">${l.developer} · ${l.unitType} · ${l.bedrooms}BD · ${l.area}m²</div>
            <div style="font-weight:800;color:#E8672A;font-size:13px;margin-bottom:6px;">EGP ${l.price.toLocaleString()}</div>
            <span style="display:inline-block;padding:2px 8px;border-radius:4px;background:${color}1a;color:${color};font-size:10px;font-weight:700;text-transform:uppercase;">${l.status}</span>
          </div>
        `);
      m.on('click', () => onMarkerClick?.(l));
      return m;
    });
    if (geoListings.length && !ref.fittedFor || (ref.fittedFor !== geoListings.length)) {
      const bounds = window.L.latLngBounds(geoListings.map(l => [l.lat, l.lng]));
      ref.map.fitBounds(bounds.pad(0.25), { animate: false });
      ref.fittedFor = geoListings.length;
    }
  }, [geoListings, onMarkerClick]);

  return (
    <div className="data-panel" style={{padding:0,overflow:'hidden'}}>
      <div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:14,flexWrap:'wrap'}}>
        <div style={{fontSize:13,fontWeight:700}}>Geographic view · {geoListings.length} listing{geoListings.length===1?'':'s'} mapped</div>
        <div style={{display:'flex',gap:12,fontSize:11,color:'var(--text-secondary)'}}>
          {Object.entries(STATUS_PIN_COLOR).map(([s,c]) => (
            <div key={s} style={{display:'flex',alignItems:'center',gap:5}}>
              <span style={{width:10,height:10,borderRadius:5,background:c,display:'inline-block'}}/>
              {s}
            </div>
          ))}
        </div>
      </div>
      <div ref={containerRef} style={{height: 520, width:'100%', background:'#e2e8f0'}}/>
    </div>
  );
};

export const CrmListings = () => {
  const { state, addItem, toast, openDrawer, openModal, writeAudit, persona } = useApp();
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [fDev, setFDev] = useState('All');
  const [fType, setFType] = useState('All');
  const [fStatus, setFStatus] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const defForm = { mlsId: '', propertyType: 'Apartment', status: 'Active', assignToAgent: 'Myself', agentRole: 'Listing Agent', address: '', area: '', city: '', price: '', bedrooms: '3', bathrooms: '2', sqft: '', commissionSide: 'Buy-side', commissionPercent: '3', description: '' };
  const [form, setForm] = useState(defForm);


  const listings = state.listings || [];
  const staff = state.staff || [];
  const leads = state.leads || [];
  const listingShares = state.listingShares || [];

  const developers = [...new Set(listings.map(l=>l.developer))];

  // ───── Listing Shares (rewired 08-May) ─────
  // Share button on every listing card. Multi-lead picker, multi-channel.
  // Writes one row per (listing × lead) into state.listingShares + an
  // activity entry on each chosen lead via the audit log.
  const shareCountFor = (listingId) => listingShares.filter(s => s.listingId === listingId).length;

  const shareListing = (l) => {
    const SHARE_CHANNELS = ['WhatsApp','Email','SMS','Call'];
    let selectedLeads = new Set();
    let channel = 'WhatsApp';

    const submit = () => {
      const picked = Array.from(selectedLeads);
      if (picked.length === 0) { toast('Pick at least one lead to share with','warning'); return; }
      const ts = new Date().toISOString().slice(0,16).replace('T',' ');
      picked.forEach(leadId => {
        const lead = leads.find(x => x.id === leadId);
        if (!lead) return;
        addItem('listingShares', {
          listingId: l.id,
          property: `${l.project} ${l.unitCode}`,
          leadId: lead.id,
          leadName: lead.name,
          channel,
          agent: persona?.label || 'Fatma Ibrahim',
          timestamp: ts,
          response: 'No Response',
        }, 'SHR', {
          action: 'Listing Shared',
          module: 'CRM',
          target: lead.id,
          detail: `${l.project} ${l.unitCode} → ${lead.name} via ${channel}`,
        });
      });
      toast(`Shared "${l.project} ${l.unitCode}" with ${picked.length} lead${picked.length===1?'':'s'} via ${channel}`,'success');
    };

    openModal({
      title: `Share — ${l.project} ${l.unitCode}`,
      subtitle: `Pick one or more leads and a channel`,
      submitLabel: 'Share',
      body: (
        <ShareBody
          leads={leads}
          channels={SHARE_CHANNELS}
          onLeadsChange={(set) => { selectedLeads = set; }}
          onChannelChange={(ch) => { channel = ch; }}
        />
      ),
      onSubmit: submit,
    });
  };

  const filtered = useMemo(()=>listings.filter(l=>{
    if(search && !l.project.toLowerCase().includes(search.toLowerCase()) && !l.unitCode.toLowerCase().includes(search.toLowerCase())) return false;
    if(fDev!=='All' && l.developer!==fDev) return false;
    if(fType!=='All' && l.unitType!==fType) return false;
    if(fStatus!=='All' && l.status!==fStatus) return false;
    return true;
  }),[listings, search,fDev,fType,fStatus]);

  const viewDetail = l => openDrawer({title:l.project,subtitle:`${l.unitType} · ${l.unitCode}`,content:(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {l.image && (
        <div style={{height:220,borderRadius:12,backgroundImage:`url(${l.image})`,backgroundSize:'cover',backgroundPosition:'center',position:'relative'}}>
          <span className={`badge ${statusColor(l.status)}`} style={{position:'absolute',top:12,left:12}}>{l.status}</span>
        </div>
      )}
      <div style={{background:'linear-gradient(135deg,#f8fafc,#eef2ff)',borderRadius:12,padding:20,display:'flex',gap:20,alignItems:'center'}}>
        <div style={{width:80,height:80,borderRadius:14,background:'var(--brand-tint)',display:'flex',alignItems:'center',justifyContent:'center'}}><Home size={32} color="var(--brand)"/></div>
        <div><div style={{fontSize:18,fontWeight:800}}>EGP {fmt(l.price)}</div><div style={{fontSize:13,color:'var(--text-secondary)',marginTop:4}}>{l.paymentPlan}</div><span className={`badge ${statusColor(l.status)}`} style={{marginTop:8}}>{l.status}</span></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[['Developer',l.developer],['Unit Code',l.unitCode],['Unit Type',l.unitType],['Area',`${l.area} m²`],['Bedrooms',l.bedrooms],['Bathrooms',l.bathrooms],['Floor',l.floor],['Created',l.created]].map(([k,v])=>(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>))}
      </div>
      <div><div className="drawer-label">Features</div><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{l.features.map(f=><span key={f} style={{padding:'4px 10px',background:'var(--brand-tint)',color:'var(--brand)',borderRadius:20,fontSize:11,fontWeight:600}}>{f}</span>)}</div></div>
      <button className="btn btn-brand" onClick={()=>shareListing(l)}><Share2 size={14}/> Share Listing</button>
    </div>
  )});

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Listings</span></div><h1 className="page-title">Listings & Inventory</h1><p className="page-subtitle">Manage property inventory, unit availability, and payment plans</p></div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[['Total Listings',listings.length,'var(--info)'],['Available',listings.filter(l=>l.status==='Available').length,'var(--success)'],['Reserved',listings.filter(l=>l.status==='Reserved').length,'var(--warning)'],['Sold',listings.filter(l=>l.status==='Sold').length,'var(--brand)']].map(([l,v,c])=>(
          <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'16px 20px',borderTop:`3px solid ${c}`}}><div style={{fontSize:12,color:'var(--text-secondary)',fontWeight:600}}>{l}</div><div style={{fontSize:24,fontWeight:800,marginTop:4}}>{v}</div></div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="data-panel" style={{marginBottom:20}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'center'}}>
          <div className="search-box" style={{flex:'1 1 200px'}}><Search size={16}/><input type="text" placeholder="Search by project or unit code…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <select className="filter-select" value={fDev} onChange={e=>setFDev(e.target.value)}><option value="All">All Developers</option>{developers.map(d=><option key={d}>{d}</option>)}</select>
          <select className="filter-select" value={fType} onChange={e=>setFType(e.target.value)}><option value="All">All Types</option>{PROPERTY_TYPES.map(t=><option key={t}>{t}</option>)}</select>
          <select className="filter-select" value={fStatus} onChange={e=>setFStatus(e.target.value)}><option value="All">All Status</option>{LISTING_STATUS.map(s=><option key={s}>{s}</option>)}</select>
          <div style={{display:'flex',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden'}}>
            <button className={`btn btn-sm ${view==='grid'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('grid')}><LayoutGrid size={14}/></button>
            <button className={`btn btn-sm ${view==='table'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('table')}><List size={14}/></button>
            <button className={`btn btn-sm ${view==='map'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('map')}><MapPin size={14}/></button>
          </div>
          <button className="btn btn-brand" onClick={()=>setShowAdd(true)}><Plus size={16}/> Add Listing</button>
        </div>
        <div style={{marginTop:10,fontSize:12,color:'var(--text-tertiary)'}}>Showing {filtered.length} listings</div>
      </div>

      {view==='map' ? (
        <ListingsMap listings={filtered} onMarkerClick={viewDetail}/>
      ) : view==='grid' ? (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
          {filtered.map(l=>{
            const shareCount = shareCountFor(l.id);
            return (
            <div key={l.id} className="listing-card" onClick={()=>viewDetail(l)}>
              <div
                className="listing-card-img"
                style={l.image ? { backgroundImage:`url(${l.image})`, backgroundSize:'cover', backgroundPosition:'center' } : undefined}
              >
                {!l.image && <Building size={40} color="var(--brand)"/>}
                <span className={`badge ${statusColor(l.status)}`} style={{position:'absolute',top:12,left:12}}>{l.status}</span>
                {shareCount > 0 && (
                  <span title={`${shareCount} share${shareCount===1?'':'s'}`} style={{position:'absolute',top:12,right:12,background:'rgba(255,255,255,.95)',color:'var(--brand)',padding:'3px 8px',borderRadius:6,fontSize:11,fontWeight:700,display:'flex',alignItems:'center',gap:4}}>
                    <Share2 size={11}/> {shareCount}
                  </span>
                )}
                <span style={{position:'absolute',bottom:10,right:12,background:'rgba(15,23,42,.78)',color:'#fff',padding:'3px 10px',borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:'.04em'}}>EGYPT MLS</span>
              </div>
              <div style={{padding:'16px 20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8,gap:8}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.project}</div>
                    <div style={{fontSize:12,color:'var(--text-secondary)'}}>{l.developer} · {l.unitCode}</div>
                  </div>
                </div>
                <div style={{fontSize:18,fontWeight:800,color:'var(--brand)',marginBottom:10}}>EGP {fmt(l.price)}</div>
                <div style={{display:'flex',gap:16,fontSize:12,color:'var(--text-secondary)',marginBottom:10,flexWrap:'wrap'}}>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Home size={13}/>{l.unitType}</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Bed size={13}/>{l.bedrooms} BD</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Bath size={13}/>{l.bathrooms} BA</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Maximize size={13}/>{l.area}m²</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0 0',borderTop:'1px solid var(--border)',gap:8}}>
                  <span style={{fontSize:11,color:'var(--text-tertiary)',flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.paymentPlan}</span>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={(e)=>{e.stopPropagation(); shareListing(l);}}
                    title="Share with one or more leads"
                    style={{padding:'5px 10px',fontSize:11}}
                  >
                    <Share2 size={12}/> Share
                  </button>
                </div>
              </div>
            </div>
          );})}
        </div>
      ) : (
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Project</th><th>Developer</th><th>Type</th><th>Code</th><th>Area</th><th>BD</th><th>Price</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(l=>(
            <tr key={l.id}>
              <td className="muted" style={{fontSize:11}}>{l.id}</td>
              <td className="bold clickable" onClick={()=>viewDetail(l)}>{l.project}</td>
              <td className="muted">{l.developer}</td>
              <td className="muted">{l.unitType}</td>
              <td className="muted" style={{fontSize:11}}>{l.unitCode}</td>
              <td className="muted">{l.area}m²</td>
              <td className="muted">{l.bedrooms}</td>
              <td className="bold">EGP {fmt(l.price)}</td>
              <td className="muted" style={{fontSize:11}}>{l.paymentPlan}</td>
              <td><span className={`badge ${statusColor(l.status)}`}>{l.status}</span></td>
              <td><div style={{display:'flex',gap:6,alignItems:'center'}}>
                <button className="btn-icon" onClick={()=>viewDetail(l)} title="View"><Eye size={14}/></button>
                <button className="btn-icon" onClick={()=>shareListing(l)} title="Share with leads"><Share2 size={14}/></button>
                {shareCountFor(l.id) > 0 && <span style={{fontSize:11,color:'var(--brand)',fontWeight:700}}>{shareCountFor(l.id)}</span>}
              </div></td>
            </tr>
          ))}</tbody></table></div></div>
      )}

      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}><div className="modal-header"><div><h3 style={{margin:0,fontSize:18,fontWeight:700}}>Add New Property</h3><p style={{margin:0,marginTop:4,fontSize:12,color:'var(--text-secondary)'}}>Add a new property listing to your portfolio.</p></div><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
        <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* Image Upload Area */}
          <div>
            <label style={{fontSize:12,fontWeight:700,marginBottom:8,display:'block'}}>Property Images</label>
            <div style={{border:'2px dashed var(--border)',borderRadius:8,padding:32,textAlign:'center',background:'#f8fafc',cursor:'pointer'}}>
              <Upload size={24} color="var(--text-secondary)" style={{marginBottom:8}}/>
              <div style={{fontSize:13,fontWeight:600}}>Click to upload images</div>
              <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>PNG, JPG, WEBP up to 10MB each (max 10 images)</div>
            </div>
          </div>

          <div className="form-group"><label>MLS ID Number *</label><input type="text" value={form.mlsId} onChange={e=>setForm({...form,mlsId:e.target.value})} placeholder="A11456789" style={{borderColor:'var(--success)'}}/></div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div className="form-group"><label>Property Type</label><select value={form.propertyType} onChange={e=>setForm({...form,propertyType:e.target.value})}>{PROPERTY_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Active</option><option>Available</option><option>Reserved</option><option>Sold</option></select></div>
            
            <div className="form-group"><label>Assign To Agent</label><select value={form.assignToAgent} onChange={e=>setForm({...form,assignToAgent:e.target.value})}><option>Myself</option>{staff.map(s=><option key={s.id}>{s.name}</option>)}</select></div>
            <div className="form-group"><label>Agent Role on This Deal</label><select value={form.agentRole} onChange={e=>setForm({...form,agentRole:e.target.value})}><option>Listing Agent</option><option>Co-Listing Agent</option></select></div>
          </div>

          <div className="form-group"><label>Address *</label><input type="text" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="123 Street Name"/></div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div className="form-group"><label>Area</label><input type="text" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} placeholder="Brickell"/></div>
            <div className="form-group"><label>City</label><input type="text" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Miami"/></div>
          </div>

          <div className="form-group"><label>Price (EGP) *</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="5000000"/></div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
            <div className="form-group"><label>Bedrooms</label><input type="number" value={form.bedrooms} onChange={e=>setForm({...form,bedrooms:e.target.value})}/></div>
            <div className="form-group"><label>Bathrooms</label><input type="number" value={form.bathrooms} onChange={e=>setForm({...form,bathrooms:e.target.value})}/></div>
            <div className="form-group"><label>Area (m²)</label><input type="number" value={form.sqft} onChange={e=>setForm({...form,sqft:e.target.value})} placeholder="2500"/></div>
          </div>

          <div style={{background:'#f8fafc',border:'1px solid var(--border)',borderRadius:8,padding:16}}>
            <label style={{fontSize:12,fontWeight:700,marginBottom:12,display:'block'}}>Commission Offered</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="form-group"><label>Side</label><select value={form.commissionSide} onChange={e=>setForm({...form,commissionSide:e.target.value})}><option>Buy-side</option><option>Sell-side</option></select></div>
              <div className="form-group"><label>{form.commissionSide} % *</label><input type="number" value={form.commissionPercent} onChange={e=>setForm({...form,commissionPercent:e.target.value})}/></div>
            </div>
            <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:8}}>Used to calculate Gross Commission (GCI) for any deal linked to this listing.</div>
          </div>

          <div className="form-group"><label>Description</label><textarea rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Property description..."/></div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{
          addItem('listings', { project: form.address || form.mlsId, unitCode: form.mlsId, developer: form.city || 'Private', unitType: form.propertyType, status: form.status==='Active'?'Available':form.status, price: Number(form.price)||0, bedrooms: Number(form.bedrooms)||0, bathrooms: Number(form.bathrooms)||0, area: Number(form.sqft)||0, floor: 'N/A', paymentPlan: 'Cash', features: [], created: new Date().toISOString().split('T')[0] }, 'LST');
          toast('Property Listing Created', 'success');
          setShowAdd(false);
          setForm(defForm);
        }}>Create Property</button></div></div></div>}
    </div>
  );
};
