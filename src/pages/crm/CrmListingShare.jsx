import React, { useState, useMemo } from 'react';
import { SHARE_CHANNELS, SHARE_RESPONSES } from '../../data/staticData';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Mail, Phone, Smartphone, Search, Eye, Send, Plus, X } from 'lucide-react';

const channelIcon = ch => ch==='WhatsApp'?<MessageSquare size={14} color="#25d366"/>:ch==='Email'?<Mail size={14} color="#3b82f6"/>:ch==='Call'?<Phone size={14} color="var(--brand)"/>:<Smartphone size={14} color="#8b5cf6"/>;
const channelColor = ch => ch==='WhatsApp'?'#25d366':ch==='Email'?'#3b82f6':ch==='Call'?'var(--brand)':'#8b5cf6';
const responseColor = r => r==='Interested'?'badge-success':r==='Viewed'?'badge-info':'badge-gray';

export const CrmListingShare = () => {
  const { state, addItem, toast, openDrawer } = useApp();
  const [search, setSearch] = useState('');
  const [fChannel, setFChannel] = useState('All');
  const [fResponse, setFResponse] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({property:'', leadName:'', channel:'WhatsApp'});

  const listingShares = state.listingShares || [];
  const filtered = useMemo(()=>listingShares.filter(s=>{
    if(search && !s.leadName.toLowerCase().includes(search.toLowerCase()) && !s.property.toLowerCase().includes(search.toLowerCase())) return false;
    if(fChannel!=='All' && s.channel!==fChannel) return false;
    if(fResponse!=='All' && s.response!==fResponse) return false;
    return true;
  }),[search,fChannel,fResponse]);

  const totalShares = listingShares.length;
  const whatsappPct = totalShares ? ((listingShares.filter(s=>s.channel==='WhatsApp').length/totalShares)*100).toFixed(0) : 0;
  const responseRate = totalShares ? ((listingShares.filter(s=>s.response!=='No Response').length/totalShares)*100).toFixed(0) : 0;
  const interestedRate = totalShares ? ((listingShares.filter(s=>s.response==='Interested').length/totalShares)*100).toFixed(0) : 0;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Listing Share Tracking</h1><p className="page-subtitle">Track property shares via WhatsApp, Email, Call, and SMS with response analytics</p></div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[['Total Shares',totalShares,'var(--info)'],['WhatsApp Share',whatsappPct+'%','#25d366'],['Response Rate',responseRate+'%','var(--brand)'],['Interested',interestedRate+'%','var(--success)']].map(([l,v,c])=>(
          <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'16px 20px',borderTop:`3px solid ${c}`}}><div style={{fontSize:12,color:'var(--text-secondary)',fontWeight:600}}>{l}</div><div style={{fontSize:24,fontWeight:800,marginTop:4}}>{v}</div></div>
        ))}
      </div>

      {/* Channel Breakdown */}
      <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:20,marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Channel Breakdown</div>
        <div style={{display:'flex',gap:20}}>
          {SHARE_CHANNELS.map(ch=>{const count=listingShares.filter(s=>s.channel===ch).length;const pct=totalShares?((count/totalShares)*100).toFixed(0):0;return(
            <div key={ch} style={{flex:1,display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'#f8fafc',borderRadius:10,border:'1px solid var(--border)'}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${channelColor(ch)}15`,display:'flex',alignItems:'center',justifyContent:'center'}}>{channelIcon(ch)}</div>
              <div><div style={{fontSize:13,fontWeight:700}}>{ch}</div><div style={{fontSize:11,color:'var(--text-secondary)'}}>{count} shares · {pct}%</div></div>
            </div>
          );})}
        </div>
      </div>

      <div style={{display:'flex',gap:12,marginBottom:20,alignItems:'center',flexWrap:'wrap'}}>
        <div className="search-box" style={{flex:'1 1 200px'}}><Search size={16}/><input type="text" placeholder="Search by lead or property…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <select className="filter-select" value={fChannel} onChange={e=>setFChannel(e.target.value)}><option value="All">All Channels</option>{SHARE_CHANNELS.map(c=><option key={c}>{c}</option>)}</select>
        <select className="filter-select" value={fResponse} onChange={e=>setFResponse(e.target.value)}><option value="All">All Responses</option>{SHARE_RESPONSES.map(r=><option key={r}>{r}</option>)}</select>
        <button className="btn btn-brand" onClick={()=>setShowAdd(true)}><Send size={16}/> Share Listing</button>
      </div>

      <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Listing</th><th>Lead</th><th>Channel</th><th>Agent</th><th>Timestamp</th><th>Response</th></tr></thead>
        <tbody>{filtered.map(s=>(
          <tr key={s.id}>
            <td className="muted" style={{fontSize:11}}>{s.id}</td>
            <td className="bold" style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.property}</td>
            <td className="bold">{s.leadName}</td>
            <td><span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:600,color:channelColor(s.channel)}}>{channelIcon(s.channel)} {s.channel}</span></td>
            <td className="muted">{s.agent}</td>
            <td className="muted" style={{fontSize:11}}>{s.timestamp}</td>
            <td><span className={`badge ${responseColor(s.response)}`}>{s.response}</span></td>
          </tr>
        ))}</tbody></table></div></div>

      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}><div className="modal-header"><h3>Share Listing</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
        <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="form-group"><label>Select Listing</label><select value={form.property} onChange={e=>setForm({...form,property:e.target.value})}><option value="">Choose listing…</option><option>Palm Hills V101 — EGP 12.5M</option><option>ZED East A205 — EGP 8.2M</option><option>Hyde Park TH-B304 — EGP 11.2M</option><option>Madinaty APT-C110 — EGP 5.2M</option></select></div>
          <div className="form-group"><label>Select Lead</label><select value={form.leadName} onChange={e=>setForm({...form,leadName:e.target.value})}><option value="">Choose lead…</option>{state.leads?.map(l=><option key={l.id} value={l.name}>{l.name}</option>)}</select></div>
          <div className="form-group"><label>Channel</label>
            <div style={{display:'flex',gap:8}}>{SHARE_CHANNELS.map(ch=>(
              <label key={ch} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',border:'1px solid var(--border)',borderRadius:8,cursor:'pointer',fontSize:12,fontWeight:600,background:form.channel===ch?`${channelColor(ch)}15`:'#fff',borderColor:form.channel===ch?channelColor(ch):'var(--border)'}}>
                {channelIcon(ch)} {ch} <input type="radio" name="channel" checked={form.channel===ch} onChange={()=>setForm({...form,channel:ch})} style={{display:'none'}}/>
              </label>
            ))}</div>
          </div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{if(!form.property||!form.leadName){toast('Select listing and lead','error');return;} addItem('listingShares',{listingId:'L-NEW',property:form.property,leadId:'LD-NEW',leadName:form.leadName,channel:form.channel,agent:'Fatma Ibrahim',timestamp:new Date().toLocaleString('en-EG'),response:'No Response'},'SHR'); toast('Listing shared via '+form.channel,'success');setShowAdd(false);}}><Send size={14}/> Send</button></div></div></div>}
    </div>
  );
};
