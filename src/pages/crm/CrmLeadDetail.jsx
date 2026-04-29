import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEADS, DEALS, TASKS, TOURS, LISTING_SHARES, CONTRACTS, BUYER_PREFERENCES, SOURCE_HISTORY, DUPLICATE_CANDIDATES, ASSIGNMENT_LOG, STAGES, CRM_ACTIVITY } from '../../data/staticData';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Phone, Mail, MapPin, Edit, UserPlus, Calendar, Share2, FileText, AlertTriangle, CheckCircle, Clock, User, Home, Target, MessageSquare, ChevronRight, Star, X } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-EG').format(n);
const priorityColor = p => p==='Hot'?'badge-danger':p==='Warm'?'badge-warning':'badge-info';

export const CrmLeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useApp();
  const [tab, setTab] = useState('overview');
  const [showReassign, setShowReassign] = useState(false);

  const lead = LEADS.find(l => l.id === id);
  if (!lead) return <div style={{padding:40,textAlign:'center'}}><h2>Lead not found</h2><button className="btn btn-brand" onClick={()=>navigate('/system/crm/leads')}>Back to Leads</button></div>;

  const prefs = BUYER_PREFERENCES.find(p => p.leadId === id);
  const sourceHist = SOURCE_HISTORY.find(s => s.leadId === id);
  const duplicates = DUPLICATE_CANDIDATES.filter(d => d.leadId === id);
  const assignments = ASSIGNMENT_LOG.filter(a => a.leadId === id);
  const linkedDeals = DEALS.filter(d => d.lead === lead.name);
  const linkedTasks = TASKS.filter(t => t.lead === id);
  const linkedTours = TOURS.filter(t => t.leadId === id);
  const linkedShares = LISTING_SHARES.filter(s => s.leadId === id);
  const linkedContracts = CONTRACTS.filter(c => linkedDeals.some(d => d.id === c.dealId));

  const stageIdx = STAGES.indexOf(lead.stage);

  const tabs = [
    { id:'overview', label:'Overview', icon:<User size={14}/> },
    { id:'preferences', label:'Buyer Preferences', icon:<Home size={14}/> },
    { id:'activity', label:'Activity Timeline', icon:<Clock size={14}/> },
    { id:'source', label:'Source History', icon:<Target size={14}/> },
    { id:'linked', label:'Linked Records', icon:<FileText size={14}/> },
    { id:'duplicates', label:`Duplicates${duplicates.length?` (${duplicates.length})`:''}`, icon:<AlertTriangle size={14}/> },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <button className="btn btn-outline btn-sm" onClick={()=>navigate('/system/crm/leads')}><ArrowLeft size={14}/> Back</button>
        <div className="page-breadcrumb" style={{marginBottom:0}}><span>CRM</span><span>&gt;</span><span>Leads</span><span>&gt;</span><span className="current">{lead.name}</span></div>
      </div>

      {/* Lead Header Card */}
      <div style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)',borderRadius:14,padding:'24px 32px',color:'#fff',marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',gap:24}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:800}}>{lead.name.split(' ').map(w=>w[0]).join('')}</div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <h1 style={{fontSize:22,fontWeight:800,margin:0}}>{lead.name}</h1>
              <span className={`badge ${priorityColor(lead.priority)}`}>{lead.priority}</span>
              {lead.duplicate==='Review'&&<span className="badge badge-warning"><AlertTriangle size={10}/> Duplicate Review</span>}
            </div>
            <div style={{display:'flex',gap:20,marginTop:8,fontSize:13,color:'rgba(255,255,255,.7)'}}>
              <span style={{display:'flex',alignItems:'center',gap:4}}><Phone size={13}/>{lead.phone}</span>
              <span style={{display:'flex',alignItems:'center',gap:4}}><Mail size={13}/>{lead.email}</span>
              <span style={{display:'flex',alignItems:'center',gap:4}}><MapPin size={13}/>{lead.project}</span>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline btn-sm" style={{color:'#fff',borderColor:'rgba(255,255,255,.3)'}} onClick={()=>toast('Edit modal would open','info')}><Edit size={14}/> Edit</button>
            <button className="btn btn-outline btn-sm" style={{color:'#fff',borderColor:'rgba(255,255,255,.3)'}} onClick={()=>setShowReassign(true)}><UserPlus size={14}/> Reassign</button>
            <button className="btn btn-brand btn-sm" onClick={()=>toast('Tour scheduling','info')}><Calendar size={14}/> Schedule Tour</button>
          </div>
        </div>

        {/* Stage Progress */}
        <div style={{display:'flex',gap:3,marginTop:20}}>
          {STAGES.filter(s=>s!=='Closed Lost').map((s,i)=>(
            <div key={s} style={{flex:1,textAlign:'center'}}>
              <div style={{height:4,borderRadius:4,background:i<=stageIdx?'var(--brand)':'rgba(255,255,255,.15)',marginBottom:4}}/>
              <div style={{fontSize:9,fontWeight:i<=stageIdx?700:400,color:i<=stageIdx?'var(--brand)':'rgba(255,255,255,.3)'}}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:20,borderBottom:'2px solid var(--border)',paddingBottom:0}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{display:'flex',alignItems:'center',gap:6,padding:'10px 16px',fontSize:13,fontWeight:tab===t.id?700:500,color:tab===t.id?'var(--brand)':'var(--text-secondary)',background:'none',border:'none',borderBottom:tab===t.id?'2px solid var(--brand)':'2px solid transparent',cursor:'pointer',marginBottom:-2,transition:'all .2s'}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab==='overview'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div className="data-panel" style={{padding:20}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>Contact Information</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[['Full Name',lead.name],['Phone',lead.phone],['Email',lead.email],['Source',lead.source],['Campaign',lead.campaign],['Created',lead.created],['Owner',lead.owner||'Unassigned'],['Team',lead.team],['Budget',`EGP ${fmt(lead.budget)}`],['Priority',lead.priority],['Stage',lead.stage],['Duplicate',lead.duplicate]].map(([k,v])=>(
                <div key={k}><div style={{fontSize:11,color:'var(--text-tertiary)',fontWeight:600,marginBottom:2}}>{k}</div><div style={{fontSize:13,fontWeight:500}}>{v}</div></div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <div className="data-panel" style={{padding:20}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>Quick Stats</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[['Deals',linkedDeals.length],['Tasks',linkedTasks.length],['Tours',linkedTours.length],['Shares',linkedShares.length]].map(([k,v])=>(
                  <div key={k} style={{padding:'10px 14px',background:'#f8fafc',borderRadius:8,border:'1px solid var(--border)'}}><div style={{fontSize:11,color:'var(--text-tertiary)'}}>{k}</div><div style={{fontSize:18,fontWeight:800}}>{v}</div></div>
                ))}
              </div>
            </div>
            <div className="data-panel" style={{padding:20}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>Assignment History</h3>
              {assignments.length?assignments.map(a=>(
                <div key={a.id} style={{padding:'10px 14px',background:'#f8fafc',borderRadius:8,border:'1px solid var(--border)',marginBottom:8,fontSize:12}}>
                  <div style={{fontWeight:600}}>{a.fromAgent?`${a.fromAgent} → ${a.toAgent}`:`Assigned to ${a.toAgent}`}</div>
                  <div style={{color:'var(--text-tertiary)',marginTop:2}}>{a.reason} · {a.date} · by {a.approver}</div>
                </div>
              )):<div style={{fontSize:13,color:'var(--text-tertiary)'}}>No assignment history</div>}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Buyer Preferences */}
      {tab==='preferences'&&(
        prefs ? (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div className="data-panel" style={{padding:20}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>Property Requirements</h3>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div><div className="drawer-label">Property Types</div><div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>{prefs.propertyTypes.map(t=><span key={t} style={{padding:'4px 12px',background:'var(--brand-tint)',color:'var(--brand)',borderRadius:20,fontSize:11,fontWeight:600}}>{t}</span>)}</div></div>
                <div><div className="drawer-label">Preferred Locations</div><div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>{prefs.locations.map(l=><span key={l} style={{padding:'4px 12px',background:'#eff6ff',color:'var(--info)',borderRadius:20,fontSize:11,fontWeight:600}}>{l}</span>)}</div></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <div><div className="drawer-label">Bedrooms</div><div className="drawer-value">{prefs.bedrooms}</div></div>
                  <div><div className="drawer-label">Bathrooms</div><div className="drawer-value">{prefs.bathrooms}</div></div>
                </div>
                <div><div className="drawer-label">Budget Range</div><div className="drawer-value">EGP {fmt(prefs.budgetMin)} — {fmt(prefs.budgetMax)}</div>
                  <div style={{height:6,background:'#e2e8f0',borderRadius:4,marginTop:6,overflow:'hidden'}}><div style={{width:'60%',height:'100%',background:'linear-gradient(90deg,var(--brand),#f59e0b)',borderRadius:4}}/></div>
                </div>
                <div><div className="drawer-label">Timeline</div><div className="drawer-value">{prefs.timeline}</div></div>
              </div>
            </div>
            <div className="data-panel" style={{padding:20}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>Preferences</h3>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div><div className="drawer-label">Preferred Developers</div><div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>{prefs.preferredDevelopers.map(d=><span key={d} style={{padding:'4px 12px',background:'#f0fdf4',color:'var(--success)',borderRadius:20,fontSize:11,fontWeight:600}}>{d}</span>)}</div></div>
                <div><div className="drawer-label">Amenities</div><div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>{prefs.amenities.map(a=><span key={a} style={{padding:'4px 12px',background:'#faf5ff',color:'#8b5cf6',borderRadius:20,fontSize:11,fontWeight:600}}>{a}</span>)}</div></div>
                <div><div className="drawer-label">Notes</div><div style={{fontSize:13,background:'#f8fafc',padding:14,borderRadius:10,border:'1px solid var(--border)',lineHeight:1.6,marginTop:4}}>{prefs.notes}</div></div>
              </div>
            </div>
          </div>
        ) : <div className="data-panel" style={{padding:40,textAlign:'center'}}><Home size={32} color="var(--text-tertiary)"/><p style={{color:'var(--text-secondary)',marginTop:12}}>No buyer preferences recorded yet</p><button className="btn btn-brand" onClick={()=>toast('Add preferences modal','info')}>Add Preferences</button></div>
      )}

      {/* Tab: Activity */}
      {tab==='activity'&&(
        <div className="data-panel" style={{padding:20}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Activity Timeline</h3>
          <div style={{display:'flex',flexDirection:'column',gap:0,position:'relative',paddingLeft:24}}>
            <div style={{position:'absolute',left:7,top:0,bottom:0,width:2,background:'var(--border)'}}/>
            {[...assignments.map(a=>({time:a.date,type:'assignment',detail:`${a.fromAgent?`Reassigned from ${a.fromAgent} to`:'Assigned to'} ${a.toAgent}`,sub:a.reason})),
              ...linkedTours.map(t=>({time:`${t.date} ${t.time}`,type:'tour',detail:`Tour: ${t.property}`,sub:t.feedback||t.status})),
              ...linkedShares.map(s=>({time:s.timestamp,type:'share',detail:`${s.channel} share: ${s.property}`,sub:`Response: ${s.response}`})),
            ].sort((a,b)=>b.time.localeCompare(a.time)).map((ev,i)=>(
              <div key={i} style={{padding:'12px 0 12px 20px',position:'relative'}}>
                <div style={{position:'absolute',left:-4,top:16,width:12,height:12,borderRadius:'50%',background:ev.type==='assignment'?'var(--brand)':ev.type==='tour'?'var(--info)':'var(--success)',border:'2px solid #fff'}}/>
                <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:2}}>{ev.time}</div>
                <div style={{fontSize:13,fontWeight:600}}>{ev.detail}</div>
                {ev.sub&&<div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>{ev.sub}</div>}
              </div>
            ))}
            {linkedTours.length===0&&linkedShares.length===0&&assignments.length===0&&<div style={{padding:20,color:'var(--text-tertiary)'}}>No activity recorded yet</div>}
          </div>
        </div>
      )}

      {/* Tab: Source History */}
      {tab==='source'&&(
        <div className="data-panel" style={{padding:20}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Source Attribution Trail</h3>
          {sourceHist ? (
            <div style={{display:'flex',flexDirection:'column',gap:0,position:'relative',paddingLeft:24}}>
              <div style={{position:'absolute',left:7,top:0,bottom:0,width:2,background:'var(--border)'}}/>
              {sourceHist.touchpoints.map((tp,i)=>(
                <div key={i} style={{padding:'14px 0 14px 20px',position:'relative'}}>
                  <div style={{position:'absolute',left:-4,top:18,width:12,height:12,borderRadius:'50%',background:i===0?'var(--brand)':i===sourceHist.touchpoints.length-1?'var(--success)':'var(--info)',border:'2px solid #fff'}}/>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:10,fontWeight:700,textTransform:'uppercase',color:i===0?'var(--brand)':i===sourceHist.touchpoints.length-1?'var(--success)':'var(--info)',letterSpacing:'.05em'}}>{i===0?'First Touch':i===sourceHist.touchpoints.length-1?'Last Touch':`Touch ${i+1}`}</span>
                  </div>
                  <div style={{fontSize:13,fontWeight:600,marginTop:4}}>{tp.channel}{tp.campaign?` — ${tp.campaign}`:''}</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>{tp.detail}</div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>{tp.date}</div>
                </div>
              ))}
            </div>
          ) : <div style={{padding:40,textAlign:'center',color:'var(--text-tertiary)'}}><Target size={32}/><p style={{marginTop:12}}>No source history available</p></div>}
        </div>
      )}

      {/* Tab: Linked Records */}
      {tab==='linked'&&(
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Deals */}
          <div className="data-panel" style={{padding:20}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:12}}>Linked Deals ({linkedDeals.length})</h3>
            {linkedDeals.length?<table className="data-table"><thead><tr><th>ID</th><th>Project</th><th>Stage</th><th>Value</th><th>Status</th></tr></thead>
              <tbody>{linkedDeals.map(d=><tr key={d.id}><td className="muted">{d.id}</td><td className="bold">{d.project}</td><td>{d.stage}</td><td className="bold">EGP {fmt(d.value)}</td><td><span className={`badge ${d.status==='Active'?'badge-success':'badge-gray'}`}>{d.status}</span></td></tr>)}</tbody></table>:<p className="muted">No linked deals</p>}
          </div>
          {/* Tours */}
          <div className="data-panel" style={{padding:20}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:12}}>Linked Tours ({linkedTours.length})</h3>
            {linkedTours.length?<table className="data-table"><thead><tr><th>ID</th><th>Property</th><th>Date</th><th>Status</th><th>Rating</th></tr></thead>
              <tbody>{linkedTours.map(t=><tr key={t.id}><td className="muted">{t.id}</td><td className="bold">{t.property}</td><td>{t.date} {t.time}</td><td><span className={`badge ${t.status==='Completed'?'badge-success':t.status==='Scheduled'?'badge-info':'badge-danger'}`}>{t.status}</span></td><td style={{color:'#f59e0b'}}>{t.rating?'★'.repeat(t.rating):'—'}</td></tr>)}</tbody></table>:<p className="muted">No linked tours</p>}
          </div>
          {/* Listing Shares */}
          <div className="data-panel" style={{padding:20}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:12}}>Listing Shares ({linkedShares.length})</h3>
            {linkedShares.length?<table className="data-table"><thead><tr><th>Property</th><th>Channel</th><th>Timestamp</th><th>Response</th></tr></thead>
              <tbody>{linkedShares.map(s=><tr key={s.id}><td className="bold">{s.property}</td><td>{s.channel}</td><td className="muted">{s.timestamp}</td><td><span className={`badge ${s.response==='Interested'?'badge-success':s.response==='Viewed'?'badge-info':'badge-gray'}`}>{s.response}</span></td></tr>)}</tbody></table>:<p className="muted">No shares</p>}
          </div>
          {/* Contracts */}
          <div className="data-panel" style={{padding:20}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:12}}>Contracts ({linkedContracts.length})</h3>
            {linkedContracts.length?<table className="data-table"><thead><tr><th>ID</th><th>Project</th><th>Value</th><th>Stage</th></tr></thead>
              <tbody>{linkedContracts.map(c=><tr key={c.id}><td className="muted">{c.id}</td><td className="bold">{c.project}</td><td className="bold">EGP {fmt(c.value)}</td><td><span className={`badge ${c.stage==='Signed'||c.stage==='Registered'?'badge-success':c.stage==='Under Review'?'badge-warning':'badge-gray'}`}>{c.stage}</span></td></tr>)}</tbody></table>:<p className="muted">No contracts</p>}
          </div>
        </div>
      )}

      {/* Tab: Duplicates */}
      {tab==='duplicates'&&(
        <div className="data-panel" style={{padding:20}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Duplicate Candidates</h3>
          {duplicates.length ? duplicates.map(d=>(
            <div key={d.id} style={{padding:16,background:'#fff',border:'1px solid var(--border)',borderRadius:10,marginBottom:12,borderLeft:`4px solid ${d.status==='Pending'?'var(--warning)':d.status==='Dismissed'?'var(--text-tertiary)':'var(--success)'}`}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div><div style={{fontSize:14,fontWeight:700}}>Match: {d.matchedName} ({d.matchedLeadId})</div><div style={{fontSize:12,color:'var(--text-secondary)',marginTop:4}}>{d.detail}</div></div>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{textAlign:'center'}}><div style={{fontSize:20,fontWeight:800,color:d.confidence>=70?'var(--warning)':'var(--text-tertiary)'}}>{d.confidence}%</div><div style={{fontSize:10,color:'var(--text-tertiary)'}}>confidence</div></div>
                  <span className={`badge ${d.status==='Pending'?'badge-warning':d.status==='Dismissed'?'badge-gray':'badge-success'}`}>{d.status}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <span style={{padding:'3px 10px',background:'#f1f5f9',borderRadius:16,fontSize:11,fontWeight:600}}>Match Type: {d.matchType}</span>
              </div>
              {d.status==='Pending'&&(
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="btn btn-brand btn-sm" onClick={()=>toast('Merge functionality','info')}>Merge Records</button>
                  <button className="btn btn-outline btn-sm" onClick={()=>toast('Dismissed','info')}>Dismiss</button>
                </div>
              )}
            </div>
          )) : <div style={{padding:40,textAlign:'center',color:'var(--text-tertiary)'}}><CheckCircle size={32}/><p style={{marginTop:12}}>No duplicate candidates found — this lead is clean</p></div>}
        </div>
      )}

      {/* Reassign Modal */}
      {showReassign&&<div className="modal-overlay" onClick={()=>setShowReassign(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}><div className="modal-header"><h3>Reassign Lead</h3><button className="btn-icon" onClick={()=>setShowReassign(false)}><X size={18}/></button></div>
        <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="form-group"><label>Current Owner</label><input type="text" value={lead.owner||'Unassigned'} disabled/></div>
          <div className="form-group"><label>Assign To</label><select><option>Select Agent…</option><option>Ahmed Hassan</option><option>Fatma Ibrahim</option><option>Hana Mahmoud</option><option>Omar Sherif</option></select></div>
          <div className="form-group"><label>Reason</label><select><option>Territory reassignment</option><option>Workload balancing</option><option>Specialization match</option><option>Manager override</option></select></div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowReassign(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{toast('Lead reassigned','success');setShowReassign(false);}}>Reassign</button></div></div></div>}
    </div>
  );
};
