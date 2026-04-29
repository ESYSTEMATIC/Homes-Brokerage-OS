import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LISTINGS, LISTING_STATUS, PROPERTY_TYPES } from '../../data/staticData';
import { Search, Plus, Edit, Trash2, Eye, X, LayoutGrid, List, Home, Bed, Bath, Maximize, Share2, Building } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-EG').format(n);
const statusColor = s => s==='Available'?'badge-success':s==='Reserved'?'badge-warning':'badge-danger';

export const CrmListings = () => {
  const { toast, openDrawer } = useApp();
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [fDev, setFDev] = useState('All');
  const [fType, setFType] = useState('All');
  const [fStatus, setFStatus] = useState('All');
  const [showAdd, setShowAdd] = useState(false);

  const developers = [...new Set(LISTINGS.map(l=>l.developer))];

  const filtered = useMemo(()=>LISTINGS.filter(l=>{
    if(search && !l.project.toLowerCase().includes(search.toLowerCase()) && !l.unitCode.toLowerCase().includes(search.toLowerCase())) return false;
    if(fDev!=='All' && l.developer!==fDev) return false;
    if(fType!=='All' && l.unitType!==fType) return false;
    if(fStatus!=='All' && l.status!==fStatus) return false;
    return true;
  }),[search,fDev,fType,fStatus]);

  const viewDetail = l => openDrawer({title:l.project,subtitle:`${l.unitType} · ${l.unitCode}`,content:(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{background:'linear-gradient(135deg,#f8fafc,#eef2ff)',borderRadius:12,padding:20,display:'flex',gap:20,alignItems:'center'}}>
        <div style={{width:80,height:80,borderRadius:14,background:'var(--brand-tint)',display:'flex',alignItems:'center',justifyContent:'center'}}><Home size={32} color="var(--brand)"/></div>
        <div><div style={{fontSize:18,fontWeight:800}}>EGP {fmt(l.price)}</div><div style={{fontSize:13,color:'var(--text-secondary)',marginTop:4}}>{l.paymentPlan}</div><span className={`badge ${statusColor(l.status)}`} style={{marginTop:8}}>{l.status}</span></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[['Developer',l.developer],['Unit Code',l.unitCode],['Unit Type',l.unitType],['Area',`${l.area} m²`],['Bedrooms',l.bedrooms],['Bathrooms',l.bathrooms],['Floor',l.floor],['Created',l.created]].map(([k,v])=>(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>))}
      </div>
      <div><div className="drawer-label">Features</div><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{l.features.map(f=><span key={f} style={{padding:'4px 10px',background:'var(--brand-tint)',color:'var(--brand)',borderRadius:20,fontSize:11,fontWeight:600}}>{f}</span>)}</div></div>
      <button className="btn btn-brand" onClick={()=>toast('Share modal would open','info')}><Share2 size={14}/> Share Listing</button>
    </div>
  )});

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Listings</span></div><h1 className="page-title">Listings & Inventory</h1><p className="page-subtitle">Manage property inventory, unit availability, and payment plans</p></div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[['Total Listings',LISTINGS.length,'var(--info)'],['Available',LISTINGS.filter(l=>l.status==='Available').length,'var(--success)'],['Reserved',LISTINGS.filter(l=>l.status==='Reserved').length,'var(--warning)'],['Sold',LISTINGS.filter(l=>l.status==='Sold').length,'var(--brand)']].map(([l,v,c])=>(
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
          </div>
          <button className="btn btn-brand" onClick={()=>setShowAdd(true)}><Plus size={16}/> Add Listing</button>
        </div>
        <div style={{marginTop:10,fontSize:12,color:'var(--text-tertiary)'}}>Showing {filtered.length} listings</div>
      </div>

      {view==='grid' ? (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
          {filtered.map(l=>(
            <div key={l.id} className="listing-card" onClick={()=>viewDetail(l)}>
              <div className="listing-card-img"><Building size={40} color="var(--brand)"/></div>
              <div style={{padding:'16px 20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                  <div><div style={{fontSize:15,fontWeight:700}}>{l.project}</div><div style={{fontSize:12,color:'var(--text-secondary)'}}>{l.developer} · {l.unitCode}</div></div>
                  <span className={`badge ${statusColor(l.status)}`}>{l.status}</span>
                </div>
                <div style={{fontSize:18,fontWeight:800,color:'var(--brand)',marginBottom:10}}>EGP {fmt(l.price)}</div>
                <div style={{display:'flex',gap:16,fontSize:12,color:'var(--text-secondary)',marginBottom:10}}>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Home size={13}/>{l.unitType}</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Bed size={13}/>{l.bedrooms} BD</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Bath size={13}/>{l.bathrooms} BA</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Maximize size={13}/>{l.area}m²</span>
                </div>
                <div style={{fontSize:11,color:'var(--text-tertiary)',padding:'6px 0',borderTop:'1px solid var(--border)'}}>{l.paymentPlan}</div>
              </div>
            </div>
          ))}
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
              <td><div style={{display:'flex',gap:6}}><button className="btn-icon" onClick={()=>viewDetail(l)}><Eye size={14}/></button><button className="btn-icon" onClick={()=>toast('Share','info')}><Share2 size={14}/></button></div></td>
            </tr>
          ))}</tbody></table></div></div>
      )}

      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}><div className="modal-header"><h3>Add New Listing</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
        <div className="modal-body"><p style={{color:'var(--text-secondary)',fontSize:13}}>Listing management will be connected to the Marketplace data feed. For now, listings are synced from the Master Data module.</p></div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowAdd(false)}>Close</button></div></div></div>}
    </div>
  );
};
