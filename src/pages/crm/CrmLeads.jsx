import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Edit, Trash2, Eye, X, Download } from 'lucide-react';

const STAGES = ['New','Contacted','Qualified','Tour Scheduled','Negotiation','Reservation','Contracting','Closed Won','Closed Lost'];
const PRIORITIES = ['Hot','Warm','Cold'];
const SOURCES = ['Marketplace','Referral','Walk-in','Campaign','Social Media'];
const stageColor = s => s==='New'?'badge-info':s==='Qualified'||s==='Tour Scheduled'?'badge-success':s==='Negotiation'||s==='Reservation'?'badge-warning':s==='Closed Won'?'badge-success':s==='Closed Lost'?'badge-danger':'badge-gray';
const prioColor = p => p==='Hot'?'badge-danger':p==='Warm'?'badge-warning':'badge-gray';

export const CrmLeads = () => {
  const { state, addRecord, updateRecord, deleteRecord, toast, openDrawer } = useApp();
  const [search, setSearch] = useState('');
  const [fStage, setFStage] = useState('All');
  const [fPrio, setFPrio] = useState('All');
  const [fSrc, setFSrc] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [sel, setSel] = useState([]);
  const def = {name:'',phone:'',email:'',source:'Walk-in',project:'',developer:'',budget:'',stage:'New',priority:'Warm',owner:'Fatma Ibrahim',notes:''};
  const [form, setForm] = useState(def);
  const leads = state.leads;

  const filtered = useMemo(()=> leads.filter(l=>{
    if(search && !l.name.toLowerCase().includes(search.toLowerCase()) && !(l.phone||'').includes(search) && !(l.project||'').toLowerCase().includes(search.toLowerCase())) return false;
    if(fStage!=='All' && l.stage!==fStage) return false;
    if(fPrio!=='All' && l.priority!==fPrio) return false;
    if(fSrc!=='All' && l.source!==fSrc) return false;
    return true;
  }),[leads,search,fStage,fPrio,fSrc]);

  const openAdd2 = ()=>{setForm(def);setEditLead(null);setShowAdd(true);};
  const openEdit = l=>{setForm({name:l.name,phone:l.phone||'',email:l.email||'',source:l.source||'Walk-in',project:l.project||'',developer:l.developer||'',budget:l.budget||'',stage:l.stage||'New',priority:l.priority||'Warm',owner:l.owner||'',notes:l.notes||''});setEditLead(l);setShowAdd(true);};
  const handleSubmit = e=>{e.preventDefault();if(!form.name.trim()){toast('Name is required','error');return;}if(editLead){updateRecord('leads',editLead.id,{...form,budget:form.budget?Number(form.budget):0});toast('Lead updated','success');}else{addRecord('leads',{...form,budget:form.budget?Number(form.budget):0,created:new Date().toISOString().split('T')[0]});toast('Lead created','success');}setShowAdd(false);};
  const handleDel = id=>{deleteRecord('leads',id);toast('Lead deleted','success');};
  const toggleSel = id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const viewDetail = l => openDrawer({title:l.name,subtitle:`Lead · ${l.id}`,content:(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {[['Phone',l.phone],['Email',l.email],['Source',l.source],['Project',l.project],['Developer',l.developer],['Budget',l.budget?`EGP ${Number(l.budget).toLocaleString()}`:'—']].map(([k,v])=>(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v||'—'}</div></div>))}
        <div><div className="drawer-label">Stage</div><span className={`badge ${stageColor(l.stage)}`}>{l.stage}</span></div>
        <div><div className="drawer-label">Priority</div><span className={`badge ${prioColor(l.priority)}`}>{l.priority}</span></div>
        <div><div className="drawer-label">Owner</div><div className="drawer-value">{l.owner}</div></div>
        <div><div className="drawer-label">Created</div><div className="drawer-value">{l.created||'—'}</div></div>
      </div>
      {l.notes&&<div><div className="drawer-label">Notes</div><div className="drawer-value">{l.notes}</div></div>}
      <div style={{display:'flex',gap:8}}><button className="btn btn-sm btn-brand" onClick={()=>openEdit(l)}><Edit size={13}/> Edit</button><button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>handleDel(l.id)}><Trash2 size={13}/> Delete</button></div>
    </div>
  )});

  const exportCSV = ()=>{const h=['Name','Phone','Source','Project','Stage','Priority','Owner'];const r=filtered.map(l=>[l.name,l.phone,l.source,l.project,l.stage,l.priority,l.owner]);const c=[h,...r].map(r=>r.join(',')).join('\n');const b=new Blob([c],{type:'text/csv'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='crm-leads.csv';a.click();toast('Exported','success');};

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Leads</span></div><h1 className="page-title">Lead Management</h1><p className="page-subtitle">Manage incoming leads, track stage progression, and assign ownership</p></div>
      <div className="data-panel" style={{marginBottom:20}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'center'}}>
          <div className="search-box" style={{flex:'1 1 200px'}}><Search size={16}/><input type="text" placeholder="Search leads…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <select className="filter-select" value={fStage} onChange={e=>setFStage(e.target.value)}><option value="All">All Stages</option>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
          <select className="filter-select" value={fPrio} onChange={e=>setFPrio(e.target.value)}><option value="All">All Priorities</option>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select>
          <select className="filter-select" value={fSrc} onChange={e=>setFSrc(e.target.value)}><option value="All">All Sources</option>{SOURCES.map(s=><option key={s}>{s}</option>)}</select>
          <button className="btn btn-sm btn-outline" onClick={exportCSV}><Download size={14}/> Export</button>
          <button className="btn btn-brand" onClick={openAdd2}><Plus size={16}/> Add Lead</button>
        </div>
        <div style={{marginTop:10,fontSize:12,color:'var(--text-tertiary)'}}>Showing {filtered.length} of {leads.length} leads</div>
      </div>

      <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th style={{width:36}}><input type="checkbox" checked={sel.length===filtered.length&&filtered.length>0} onChange={()=>setSel(sel.length===filtered.length?[]:filtered.map(l=>l.id))}/></th><th>ID</th><th>Name</th><th>Phone</th><th>Source</th><th>Project</th><th>Stage</th><th>Priority</th><th>Owner</th><th>Actions</th></tr></thead>
        <tbody>{filtered.length===0?<tr><td colSpan={10} style={{textAlign:'center',padding:40,color:'var(--text-tertiary)'}}>No leads found</td></tr>:filtered.map(l=>(
          <tr key={l.id} className={sel.includes(l.id)?'row-selected':''}>
            <td><input type="checkbox" checked={sel.includes(l.id)} onChange={()=>toggleSel(l.id)}/></td>
            <td className="muted" style={{fontSize:11}}>{l.id}</td>
            <td className="bold clickable" onClick={()=>viewDetail(l)}>{l.name}</td>
            <td className="muted">{l.phone||'—'}</td>
            <td className="muted">{l.source}</td>
            <td className="muted">{l.project||'—'}</td>
            <td><span className={`badge ${stageColor(l.stage)}`}>{l.stage}</span></td>
            <td><span className={`badge ${prioColor(l.priority)}`}>{l.priority}</span></td>
            <td className="muted">{l.owner}</td>
            <td><div style={{display:'flex',gap:6}}><button className="btn-icon" onClick={()=>viewDetail(l)}><Eye size={14}/></button><button className="btn-icon" onClick={()=>openEdit(l)}><Edit size={14}/></button><button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDel(l.id)}><Trash2 size={14}/></button></div></td>
          </tr>
        ))}</tbody></table></div></div>

      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:640}}><div className="modal-header"><h3>{editLead?'Edit Lead':'Add New Lead'}</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
        <form onSubmit={handleSubmit}><div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Full Name *</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
          <div className="form-group"><label>Phone</label><input type="text" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div className="form-group"><label>Source</label><select value={form.source} onChange={e=>setForm({...form,source:e.target.value})}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="form-group"><label>Project</label><input type="text" value={form.project} onChange={e=>setForm({...form,project:e.target.value})}/></div>
          <div className="form-group"><label>Developer</label><input type="text" value={form.developer} onChange={e=>setForm({...form,developer:e.target.value})}/></div>
          <div className="form-group"><label>Budget (EGP)</label><input type="number" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}/></div>
          <div className="form-group"><label>Stage</label><select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="form-group"><label>Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select></div>
          <div className="form-group"><label>Owner</label><input type="text" value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})}/></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Notes</label><textarea rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
        </div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-brand">{editLead?'Update':'Create'} Lead</button></div></form></div></div>}
    </div>
  );
};
