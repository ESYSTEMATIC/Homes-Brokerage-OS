import React, { useState } from 'react';
import { LISTINGS } from '../../data/staticData';
import { useApp } from '../../context/AppContext';
import { Globe, QrCode, Eye, Settings, ToggleLeft, ToggleRight, Copy, ExternalLink, Home, Bed, Bath, Maximize, User } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-EG').format(n);

export const CrmMiniSite = () => {
  const { persona, toast } = useApp();
  const [active, setActive] = useState(true);
  const [slug, setSlug] = useState('sarah-elmasry');
  const featured = LISTINGS.filter(l => l.status === 'Available').slice(0, 4);

  const stats = { views: 1243, inquiries: 38, listingsViewed: 87, conversionRate: '3.1%' };

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Mini-Site</span></div><h1 className="page-title">Agent Mini-Site (Microsite)</h1><p className="page-subtitle">Your personal listing page — share with clients via link or QR code</p></div>

      {/* Controls */}
      <div style={{display:'flex',gap:16,marginBottom:24,flexWrap:'wrap'}}>
        <div style={{flex:'1 1 300px',background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:20}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700}}>Site Status</div>
            <button onClick={()=>{setActive(!active);toast(active?'Mini-site deactivated':'Mini-site activated',active?'info':'success');}} style={{background:'none',border:'none',cursor:'pointer'}}>
              {active?<ToggleRight size={32} color="var(--success)"/>:<ToggleLeft size={32} color="var(--text-tertiary)"/>}
            </button>
          </div>
          <div className="form-group"><label>Custom URL Slug</label>
            <div style={{display:'flex',gap:8}}>
              <div style={{fontSize:12,color:'var(--text-secondary)',padding:'8px 12px',background:'#f1f5f9',borderRadius:8,border:'1px solid var(--border)',whiteSpace:'nowrap'}}>homes.com.eg/agents/</div>
              <input type="text" value={slug} onChange={e=>setSlug(e.target.value)} style={{flex:1}}/>
            </div>
          </div>
          <button className="btn btn-outline" style={{marginTop:8}} onClick={()=>{navigator.clipboard?.writeText?.(`homes.com.eg/agents/${slug}`);toast('Link copied!','success');}}><Copy size={14}/> Copy Link</button>
        </div>

        <div style={{flex:'0 0 200px',background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:20,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12}}>
          <div style={{width:120,height:120,borderRadius:12,background:'linear-gradient(135deg,#f8fafc,#eef2ff)',border:'2px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <QrCode size={72} color="var(--brand)" strokeWidth={1}/>
          </div>
          <div style={{fontSize:11,color:'var(--text-secondary)',textAlign:'center'}}>Scan to visit mini-site</div>
        </div>

        <div style={{flex:'1 1 300px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {[['Page Views',stats.views,'var(--info)'],['Inquiries',stats.inquiries,'var(--brand)'],['Listings Viewed',stats.listingsViewed,'var(--success)'],['Conversion',stats.conversionRate,'#8b5cf6']].map(([l,v,c])=>(
            <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'14px 18px',borderLeft:`3px solid ${c}`}}><div style={{fontSize:11,color:'var(--text-secondary)',fontWeight:600}}>{l}</div><div style={{fontSize:20,fontWeight:800,marginTop:4}}>{v}</div></div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
        <div style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)',padding:'24px 32px',color:'#fff',display:'flex',alignItems:'center',gap:8}}>
          <Globe size={16}/><span style={{fontSize:13,fontWeight:600}}>Mini-Site Preview</span>
          <div style={{flex:1}}/>
          <span style={{fontSize:11,color:'rgba(255,255,255,.5)'}}>homes.com.eg/agents/{slug}</span>
        </div>

        <div style={{padding:32}}>
          {/* Agent Header */}
          <div style={{display:'flex',alignItems:'center',gap:24,marginBottom:32,paddingBottom:24,borderBottom:'1px solid var(--border)'}}>
            <div style={{width:80,height:80,borderRadius:'50%',background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:800,color:'#fff'}}>{persona.label.substring(0,2).toUpperCase()}</div>
            <div>
              <div style={{fontSize:22,fontWeight:800}}>{persona.label}</div>
              <div style={{fontSize:14,color:'var(--text-secondary)',marginTop:4}}>Licensed Real Estate Agent · {persona.scope}</div>
              <div style={{fontSize:13,color:'var(--text-tertiary)',marginTop:4}}>{persona.email} · Homes Brokerage</div>
            </div>
            <div style={{marginLeft:'auto'}}>
              <button className="btn btn-brand"><User size={14}/> Contact Me</button>
            </div>
          </div>

          {/* Featured Listings */}
          <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Featured Listings</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
            {featured.map(l=>(
              <div key={l.id} className="listing-card" style={{cursor:'pointer'}}>
                <div
                  className="listing-card-img"
                  style={l.image ? { backgroundImage:`url(${l.image})`, backgroundSize:'cover', backgroundPosition:'center', height:160 } : { height:160 }}
                >
                  {!l.image && <Home size={36} color="var(--brand)"/>}
                </div>
                <div style={{padding:'14px 16px'}}>
                  <div style={{fontSize:14,fontWeight:700}}>{l.project}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>{l.developer} · {l.unitCode}</div>
                  <div style={{fontSize:16,fontWeight:800,color:'var(--brand)',marginTop:8}}>EGP {fmt(l.price)}</div>
                  <div style={{display:'flex',gap:12,fontSize:11,color:'var(--text-tertiary)',marginTop:8}}>
                    <span style={{display:'flex',alignItems:'center',gap:3}}><Bed size={12}/>{l.bedrooms} BD</span>
                    <span style={{display:'flex',alignItems:'center',gap:3}}><Bath size={12}/>{l.bathrooms} BA</span>
                    <span style={{display:'flex',alignItems:'center',gap:3}}><Maximize size={12}/>{l.area}m²</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div style={{marginTop:32,padding:24,background:'#f8fafc',borderRadius:12,border:'1px solid var(--border)'}}>
            <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Send an Inquiry</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <input type="text" placeholder="Full Name" style={{padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13}}/>
              <input type="tel" placeholder="Phone Number" style={{padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13}}/>
              <input type="email" placeholder="Email Address" style={{padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13}}/>
              <select style={{padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13}}><option>Interested in…</option>{featured.map(l=><option key={l.id}>{l.project}</option>)}</select>
            </div>
            <textarea placeholder="Message (optional)…" rows={3} style={{width:'100%',marginTop:12,padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,resize:'vertical'}}/>
            <button className="btn btn-brand" style={{marginTop:12,width:'100%'}} onClick={()=>toast('Inquiry submitted (demo)','success')}>Submit Inquiry</button>
          </div>
        </div>
      </div>
    </div>
  );
};
