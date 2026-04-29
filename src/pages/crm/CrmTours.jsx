import React, { useState, useMemo } from 'react';
import { TOURS, TOUR_STATUS } from '../../data/staticData';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, X, List, CalendarDays, MapPin, Clock, Star, User, Eye } from 'lucide-react';

const statusColor = s => s==='Completed'?'badge-success':s==='Scheduled'?'badge-info':s==='No-Show'?'badge-danger':'badge-gray';

export const CrmTours = () => {
  const { toast, openDrawer } = useApp();
  const [view, setView] = useState('list');
  const [fStatus, setFStatus] = useState('All');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(()=>TOURS.filter(t=>fStatus==='All'||t.status===fStatus),[fStatus]);

  const stats = {total:TOURS.length,scheduled:TOURS.filter(t=>t.status==='Scheduled').length,completed:TOURS.filter(t=>t.status==='Completed').length,noShow:TOURS.filter(t=>t.status==='No-Show').length};
  const avgRating = TOURS.filter(t=>t.rating).reduce((s,t)=>s+t.rating,0) / (TOURS.filter(t=>t.rating).length||1);

  const renderStars = r => r ? '★'.repeat(r)+'☆'.repeat(5-r) : '—';

  const viewDetail = t => openDrawer({title:`Tour — ${t.leadName}`,subtitle:t.property,content:(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[['Lead',t.leadName],['Property',t.property],['Date',t.date],['Time',t.time],['Agent',t.agent],['Status',null]].map(([k,v])=>v!==null?(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>):(<div key={k}><div className="drawer-label">{k}</div><span className={`badge ${statusColor(t.status)}`}>{t.status}</span></div>))}
      </div>
      {t.rating&&<div><div className="drawer-label">Rating</div><div style={{fontSize:20,color:'var(--brand)',letterSpacing:2}}>{renderStars(t.rating)}</div></div>}
      {t.feedback&&<div><div className="drawer-label">Feedback</div><div style={{fontSize:13,color:'var(--text-primary)',background:'#f8fafc',padding:14,borderRadius:10,border:'1px solid var(--border)',lineHeight:1.6}}>{t.feedback}</div></div>}
    </div>
  )});

  // Calendar
  const today = new Date();
  const year = today.getFullYear(); const month = today.getMonth();
  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const monthName = today.toLocaleString('en',{month:'long',year:'numeric'});
  const calDays = []; for(let i=0;i<firstDay;i++) calDays.push(null); for(let d=1;d<=daysInMonth;d++) calDays.push(d);
  const toursByDate = useMemo(()=>{const m={};TOURS.forEach(t=>{const d=new Date(t.date).getDate();if(!m[d])m[d]=[];m[d].push(t);});return m;},[]);

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Tours</span></div><h1 className="page-title">Tour Management</h1><p className="page-subtitle">Schedule property tours, track attendance, and log feedback</p></div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,marginBottom:24}}>
        {[['Total Tours',stats.total,'var(--info)'],['Scheduled',stats.scheduled,'var(--brand)'],['Completed',stats.completed,'var(--success)'],['No-Show',stats.noShow,'var(--danger)'],['Avg Rating',avgRating.toFixed(1)+' ★','#f59e0b']].map(([l,v,c])=>(
          <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'14px 18px',borderTop:`3px solid ${c}`}}><div style={{fontSize:11,color:'var(--text-secondary)',fontWeight:600}}>{l}</div><div style={{fontSize:22,fontWeight:800,marginTop:4}}>{v}</div></div>
        ))}
      </div>

      <div style={{display:'flex',gap:12,marginBottom:20,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{display:'flex',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden'}}>
          <button className={`btn btn-sm ${view==='list'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('list')}><List size={14}/> List</button>
          <button className={`btn btn-sm ${view==='calendar'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('calendar')}><CalendarDays size={14}/> Calendar</button>
        </div>
        {view==='list'&&<select className="filter-select" value={fStatus} onChange={e=>setFStatus(e.target.value)}><option value="All">All Status</option>{TOUR_STATUS.map(s=><option key={s}>{s}</option>)}</select>}
        <div style={{flex:1}}/>
        <button className="btn btn-brand" onClick={()=>setShowAdd(true)}><Plus size={16}/> Schedule Tour</button>
      </div>

      {view==='list' ? (
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Lead</th><th>Property</th><th>Date</th><th>Time</th><th>Agent</th><th>Status</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(t=>(
            <tr key={t.id}>
              <td className="muted" style={{fontSize:11}}>{t.id}</td>
              <td className="bold">{t.leadName}</td>
              <td className="muted" style={{fontSize:12,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.property}</td>
              <td className="muted">{t.date}</td>
              <td className="muted">{t.time}</td>
              <td className="muted">{t.agent}</td>
              <td><span className={`badge ${statusColor(t.status)}`}>{t.status}</span></td>
              <td style={{color:'#f59e0b',fontSize:13}}>{t.rating ? renderStars(t.rating) : '—'}</td>
              <td><button className="btn-icon" onClick={()=>viewDetail(t)}><Eye size={14}/></button></td>
            </tr>
          ))}</tbody></table></div></div>
      ) : (
        <div className="data-panel">
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>{monthName}</h3>
          <div className="crm-calendar">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="crm-calendar-head">{d}</div>)}
            {calDays.map((day,i)=>(
              <div key={i} className={`crm-calendar-day ${day===today.getDate()?'today':''} ${!day?'empty':''}`}>
                {day&&<><span className="crm-calendar-date">{day}</span>
                  {toursByDate[day]&&<div className="crm-calendar-dots">{toursByDate[day].slice(0,2).map((t,j)=>(
                    <div key={j} className="crm-calendar-event" style={{background:t.status==='Completed'?'#dcfce720':t.status==='No-Show'?'#fef2f220':'#eff6ff20',color:t.status==='Completed'?'#10b981':t.status==='No-Show'?'#ef4444':'var(--brand)',borderLeft:`3px solid ${t.status==='Completed'?'#10b981':t.status==='No-Show'?'#ef4444':'var(--brand)'}`}}>
                      <span style={{fontSize:10,fontWeight:600}}>{t.leadName}</span>
                    </div>
                  ))}</div>}
                </>}
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}><div className="modal-header"><h3>Schedule New Tour</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
        <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="form-group"><label>Lead</label><select><option>Select Lead…</option><option>Mohamed Hassan</option><option>Sara Ali</option><option>Nour Ibrahim</option></select></div>
          <div className="form-group"><label>Listing</label><select><option>Select Listing…</option><option>Palm Hills V101</option><option>ZED East A205</option><option>Hyde Park TH-B304</option></select></div>
          <div className="form-group"><label>Date</label><input type="date"/></div>
          <div className="form-group"><label>Time</label><input type="time"/></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Agent</label><select><option>Ahmed Hassan</option><option>Fatma Ibrahim</option><option>Hana Mahmoud</option><option>Omar Sherif</option></select></div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{toast('Tour scheduled','success');setShowAdd(false);}}>Schedule Tour</button></div></div></div>}
    </div>
  );
};
