import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, X, List, CalendarDays, Clock, Phone, MessageSquare, MapPin, FileText, DollarSign, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { HIERARCHY, isReadOnly, personaOwnerName, assignableStaff } from '../../data/crmAccess';

const TASK_TYPES = ['Call','Tour','WhatsApp','Meeting','Contract','Finance','Follow-up'];
const TASK_STATUS = ['Pending','In Progress','Completed','Overdue'];
const PRIOS = ['High','Medium','Low'];
const typeIcon = {Call:<Phone size={13}/>,Tour:<MapPin size={13}/>,WhatsApp:<MessageSquare size={13}/>,Meeting:<CalendarDays size={13}/>,Contract:<FileText size={13}/>,Finance:<DollarSign size={13}/>,'Follow-up':<Clock size={13}/>};
const typeColor = {Call:'#3b82f6',Tour:'#10b981',WhatsApp:'#22c55e',Meeting:'#8b5cf6',Contract:'#f59e0b',Finance:'#E8672A','Follow-up':'#64748b'};

// Tasks visibility — Sales Agent: own only · Team Leader/Manager: all owners
// they can assign to · Director: all · Audit: all (read).
const canSeeTask = (personaKey, t, ownerSet) => {
  const h = HIERARCHY[personaKey];
  if (!h || h.scope === 'none') return false;
  if (h.scope === 'all' || h.scope === 'audit') return true;
  if (h.scope === 'self') return t.owner === personaOwnerName(personaKey);
  return ownerSet.has(t.owner);
};

const isOverdue = (due, status) => {
  if (!due || status === 'Completed') return false;
  return new Date(due) < new Date(new Date().toDateString());
};

export const CrmTasks = () => {
  const { state, addItem, updateItem, removeItem, toast, persona, personaKey, writeAudit } = useApp();
  const allTasks = state.tasks || [];
  const readOnly = isReadOnly(personaKey);
  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };
  const ownerSet = useMemo(() => new Set((assignableStaff(personaKey, state.staff || [])).map(s => s.name)), [personaKey, state.staff]);

  const tasks = useMemo(() => allTasks.filter(t => canSeeTask(personaKey, t, ownerSet)), [allTasks, personaKey, ownerSet]);

  const [view, setView] = useState('list');
  const [fStatus, setFStatus] = useState('All');
  const [fType, setFType] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const def = {title:'',type:'Call',lead:'',owner: personaOwnerName(personaKey) || 'Fatma Ibrahim',due:'',priority:'Medium',status:'Pending',notes:''};
  const [form, setForm] = useState(def);

  const filtered = useMemo(()=>tasks.filter(t=>{
    if(fStatus!=='All'&&t.status!==fStatus)return false;
    if(fType!=='All'&&t.type!==fType)return false;
    return true;
  }),[tasks,fStatus,fType]);

  const openAdd2=()=>{setForm({...def, owner: personaOwnerName(personaKey) || def.owner});setEditTask(null);setShowAdd(true);};
  const openEdit=t=>{setForm({title:t.title,type:t.type||'Call',lead:t.lead||'',owner:t.owner||'',due:t.due||'',priority:t.priority||'Medium',status:t.status||'Pending',notes:t.notes||''});setEditTask(t);setShowAdd(true);};
  const handleSubmit=e=>{
    e.preventDefault();
    if(!form.title.trim()){toast('Title required','error');return;}
    if(editTask){
      updateItem('tasks',editTask.id,form);
      writeAudit('Task Updated', `${form.title}`, 'CRM');
      toast('Task updated','success');
    }else{
      addItem('tasks',{...form,created:new Date().toISOString().split('T')[0]},'TSK');
      writeAudit('Task Created', `${form.title} → ${form.owner}`, 'CRM');
      toast('Task created','success');
    }
    setShowAdd(false);
  };
  const handleDel=id=>{removeItem('tasks',id);writeAudit('Task Deleted', id, 'CRM');toast('Task deleted','success');};
  const toggleComplete=t=>{
    const next = t.status==='Completed'?'Pending':'Completed';
    updateItem('tasks',t.id,{status:next});
    writeAudit('Task Status Changed', `${t.title}: ${t.status} → ${next}`, 'CRM');
    toast(next === 'Completed' ? 'Completed' : 'Marked pending','success');
  };
  // Auto-promote Pending tasks past their due date to Overdue (visual hint).
  // Doesn't mutate state — only used for badge rendering below.
  const stageOf = t => isOverdue(t.due, t.status) && t.status !== 'Overdue' ? 'Overdue' : t.status;

  // Calendar data
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const monthName = today.toLocaleString('en',{month:'long',year:'numeric'});
  const calDays = [];
  for(let i=0;i<firstDay;i++) calDays.push(null);
  for(let d=1;d<=daysInMonth;d++) calDays.push(d);

  const tasksByDate = useMemo(()=>{
    const m = {};
    tasks.forEach(t=>{if(t.due){const d=new Date(t.due).getDate();if(!m[d])m[d]=[];m[d].push(t);}});
    return m;
  },[tasks]);

  const stats = {total:tasks.length,pending:tasks.filter(t=>t.status==='Pending').length,overdue:tasks.filter(t=>t.status==='Overdue').length,completed:tasks.filter(t=>t.status==='Completed').length};

  const roleScopeLabel = h.scope === 'self' ? 'Own tasks only' : h.scope === 'team' ? `Team ${h.team}` : h.scope === 'cross' ? `Teams ${h.teams?.join(' + ')}` : h.scope === 'all' ? 'All teams' : h.scope === 'audit' ? 'Audit-only' : 'No access';
  const overdueCount = tasks.filter(t => isOverdue(t.due, t.status)).length;

  return (
    <div className="crm-page">
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Tasks</span></div><h1 className="page-title">Tasks & Calendar</h1><p className="page-subtitle">Manage tasks, schedule follow-ups, and track team activities · BRD V1.4 §6.5</p></div>

      <div className="crm-role-banner">
        <div className="ico"><ShieldCheck size={18}/></div>
        <div className="meat">
          <div className="title">{persona.label} · {h.role}</div>
          <div className="line">
            <span className="kv"><b>Visibility:</b> {roleScopeLabel}</span>
            <span className="kv"><b>Assign tasks:</b> {readOnly ? 'Read-only' : h.scope === 'self' ? 'Self only' : 'Hierarchy-scoped'}</span>
            <span className="kv"><b>Overdue:</b> {overdueCount}{overdueCount > 0 && ' · auto-escalates to TL'}</span>
          </div>
        </div>
        <div className="kpis">
          <div><div className="num">{stats.total}</div><div className="lbl">Visible</div></div>
          <div><div className="num">{stats.pending}</div><div className="lbl">Pending</div></div>
          <div><div className="num">{stats.completed}</div><div className="lbl">Completed</div></div>
        </div>
      </div>

      {/* Mini KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[['Total',stats.total,'var(--info)'],['Pending',stats.pending,'var(--warning)'],['Overdue',stats.overdue,'var(--danger)'],['Completed',stats.completed,'var(--success)']].map(([l,v,c])=>(
          <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'16px 20px',borderTop:`3px solid ${c}`}}>
            <div style={{fontSize:12,color:'var(--text-secondary)',fontWeight:600}}>{l}</div>
            <div style={{fontSize:24,fontWeight:800,color:'var(--text-primary)',marginTop:4}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',gap:12,marginBottom:20,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{display:'flex',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden'}}>
          <button className={`btn btn-sm ${view==='list'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('list')}><List size={14}/> List</button>
          <button className={`btn btn-sm ${view==='calendar'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('calendar')}><CalendarDays size={14}/> Calendar</button>
        </div>
        {view==='list'&&<><select className="filter-select" value={fStatus} onChange={e=>setFStatus(e.target.value)}><option value="All">All Status</option>{TASK_STATUS.map(s=><option key={s}>{s}</option>)}</select>
        <select className="filter-select" value={fType} onChange={e=>setFType(e.target.value)}><option value="All">All Types</option>{TASK_TYPES.map(t=><option key={t}>{t}</option>)}</select></>}
        <div style={{flex:1}}/>
        {!readOnly && <button className="btn btn-brand" onClick={openAdd2}><Plus size={16}/> Add Task</button>}
        {readOnly && <span className="badge badge-warning">Read-only · audit role</span>}
      </div>

      {view==='list' ? (
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th style={{width:36}}></th><th>Title</th><th>Type</th><th>Lead</th><th>Owner</th><th>Due Date</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{filtered.length===0?<tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'var(--text-tertiary)'}}>No tasks found</td></tr>:filtered.map(t=>(
            <tr key={t.id} style={{opacity:t.status==='Completed'?.6:1}}>
              <td><button className="btn-icon" disabled={readOnly} onClick={()=>!readOnly && toggleComplete(t)} style={{color:t.status==='Completed'?'var(--success)':'var(--text-tertiary)'}}><CheckCircle2 size={16}/></button></td>
              <td className="bold" style={{textDecoration:t.status==='Completed'?'line-through':'none'}}>{t.title}{isOverdue(t.due, t.status) && <span title="Overdue — escalates to Team Leader" style={{marginLeft:6}}><AlertTriangle size={12} color="var(--danger)"/></span>}</td>
              <td><span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:12,color:typeColor[t.type]||'#64748b',fontWeight:600}}>{typeIcon[t.type]||<Clock size={13}/>}{t.type}</span></td>
              <td className="muted">{t.lead||'—'}</td>
              <td className="muted">{t.owner}</td>
              <td className="muted">{t.due||'—'}</td>
              <td><span className={`badge ${t.priority==='High'?'badge-danger':t.priority==='Medium'?'badge-warning':'badge-gray'}`}>{t.priority}</span></td>
              <td><span className={`badge ${stageOf(t)==='Completed'?'badge-success':stageOf(t)==='Overdue'?'badge-danger':stageOf(t)==='In Progress'?'badge-info':'badge-warning'}`}>{stageOf(t)}</span></td>
              <td>
                <div style={{display:'flex',gap:4}}>
                  {!readOnly && <button className="btn-icon" onClick={()=>openEdit(t)} title="Edit"><Edit size={14}/></button>}
                  {!readOnly && <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDel(t.id)} title="Delete"><Trash2 size={14}/></button>}
                </div>
              </td>
            </tr>
          ))}</tbody></table></div></div>
      ) : (
        <div className="data-panel">
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>{monthName}</h3>
          <div className="crm-calendar">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="crm-calendar-head">{d}</div>)}
            {calDays.map((day,i)=>(
              <div key={i} className={`crm-calendar-day ${day===today.getDate()?'today':''} ${!day?'empty':''}`}>
                {day&&<>
                  <span className="crm-calendar-date">{day}</span>
                  {tasksByDate[day]&&<div className="crm-calendar-dots">
                    {tasksByDate[day].slice(0,3).map((t,j)=>(
                      <div key={j} className="crm-calendar-event" style={{background:`${typeColor[t.type]||'#64748b'}18`,color:typeColor[t.type]||'#64748b',borderLeft:`3px solid ${typeColor[t.type]||'#64748b'}`}} title={t.title}>
                        <span style={{fontSize:10,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</span>
                      </div>
                    ))}
                    {tasksByDate[day].length>3&&<span style={{fontSize:10,color:'var(--text-tertiary)'}}>+{tasksByDate[day].length-3} more</span>}
                  </div>}
                </>}
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}><div className="modal-header"><h3>{editTask?'Edit Task':'Add New Task'}</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
        <form onSubmit={handleSubmit}><div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Title *</label><input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="form-group"><label>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{TASK_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="form-group"><label>Lead</label><input type="text" value={form.lead} onChange={e=>setForm({...form,lead:e.target.value})}/></div>
          <div className="form-group"><label>Owner</label>
            <select value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})} disabled={h.scope === 'self'}>
              <option value="">Unassigned</option>
              {assignableStaff(personaKey, state.staff || []).map(s => <option key={s.id || s.name} value={s.name}>{s.name}{s.team ? ` — ${s.team}` : ''}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Due Date</label><input type="date" value={form.due} onChange={e=>setForm({...form,due:e.target.value})}/></div>
          <div className="form-group"><label>Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{PRIOS.map(p=><option key={p}>{p}</option>)}</select></div>
          <div className="form-group"><label>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{TASK_STATUS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Notes</label><textarea rows={2} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
        </div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-brand">{editTask?'Update':'Create'} Task</button></div></form></div></div>}
    </div>
  );
};
