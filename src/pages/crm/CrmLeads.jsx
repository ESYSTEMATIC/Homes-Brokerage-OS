import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search, Plus, Edit, Trash2, Eye, X, Download, AlertTriangle, Lock,
  ShieldCheck, History, ChevronRight, UserCog,
} from 'lucide-react';
import {
  HIERARCHY, canSeeLead, canAssign, assignableStaff, leadAgeDays,
  slaForStage, isManualLockActive, isReadOnly, personaOwnerName,
} from '../../data/crmAccess';

const STAGES = ['New','Contacted','Qualified','Tour Scheduled','Negotiation','Reservation','Contracting','Closed Won','Closed Lost'];
const PRIORITIES = ['Hot','Warm','Cold'];
const SOURCES = ['Marketplace','Referral','Walk-in','Campaign','Social Media'];
const stageColor = s => s==='New'?'badge-info':s==='Qualified'||s==='Tour Scheduled'?'badge-success':s==='Negotiation'||s==='Reservation'?'badge-warning':s==='Closed Won'?'badge-success':s==='Closed Lost'?'badge-danger':'badge-gray';
const prioColor = p => p==='Hot'?'badge-danger':p==='Warm'?'badge-warning':'badge-gray';

// Tiny SLA pill — colored by level.
const SlaBadge = ({ stage, created }) => {
  const age = leadAgeDays(created);
  const sla = slaForStage(stage, age);
  const cls = sla.level === 'breach' ? 'badge-danger' : sla.level === 'warn' ? 'badge-warning' : 'badge-gray';
  return <span className={`badge ${cls}`} title={sla.message}>{age}d · {sla.level === 'breach' ? 'breach' : sla.level === 'warn' ? 'near SLA' : 'on track'}</span>;
};

export const CrmLeads = () => {
  const { state, addItem, updateItem, removeItem, toast, openDrawer, persona, personaKey, writeAudit } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [fStage, setFStage] = useState('All');
  const [fPrio, setFPrio] = useState('All');
  const [fSrc, setFSrc] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [reassignLead, setReassignLead] = useState(null);
  const [reassignTo, setReassignTo] = useState('');
  const [sel, setSel] = useState([]);
  const def = {name:'',phone:'',email:'',source:'Walk-in',project:'',developer:'',budget:'',stage:'New',priority:'Warm',owner:personaOwnerName(personaKey) || 'Fatma Ibrahim',notes:'',createdManually:true};
  const [form, setForm] = useState(def);
  const allLeads = state.leads || [];
  const readOnly = isReadOnly(personaKey);
  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };

  // Role-scoped visibility (BRD §6 / §11) — agents see only their own,
  // team leaders see their team, managers see their cross-team scope, etc.
  const visible = useMemo(() => allLeads.filter(l => canSeeLead(personaKey, l)), [allLeads, personaKey]);

  const filtered = useMemo(()=> visible.filter(l=>{
    if(search && !l.name.toLowerCase().includes(search.toLowerCase()) && !(l.phone||'').includes(search) && !(l.project||'').toLowerCase().includes(search.toLowerCase())) return false;
    if(fStage!=='All' && l.stage!==fStage) return false;
    if(fPrio!=='All' && l.priority!==fPrio) return false;
    if(fSrc!=='All' && l.source!==fSrc) return false;
    return true;
  }),[visible,search,fStage,fPrio,fSrc]);

  const openAdd2 = ()=>{setForm({...def, owner: personaOwnerName(personaKey) || def.owner});setEditLead(null);setShowAdd(true);};
  const openEdit = l=>{setForm({name:l.name,phone:l.phone||'',email:l.email||'',source:l.source||'Walk-in',project:l.project||'',developer:l.developer||'',budget:l.budget||'',stage:l.stage||'New',priority:l.priority||'Warm',owner:l.owner||'',notes:l.notes||'',createdManually:!!l.createdManually});setEditLead(l);setShowAdd(true);};
  const handleSubmit = e=>{
    e.preventDefault();
    if(!form.name.trim()){toast('Name is required','error');return;}
    if(editLead){
      updateItem('leads',editLead.id,{...form,budget:form.budget?Number(form.budget):0});
      writeAudit('CRM Lead Updated', `${form.name} (${editLead.id})`, 'CRM');
      toast('Lead updated','success');
    }else{
      addItem('leads',{...form,budget:form.budget?Number(form.budget):0,created:new Date().toISOString().split('T')[0],team: h.team || 'Alpha'},'L');
      writeAudit('CRM Lead Created', `${form.name} (manual entry — protected 6 months)`, 'CRM');
      toast('Lead created — protected from reassignment for 6 months','success');
    }
    setShowAdd(false);
  };
  const handleDel = id=>{removeItem('leads',id);writeAudit('CRM Lead Deleted', id, 'CRM');toast('Lead deleted','success');};
  const toggleSel = id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const openReassign = l => { setReassignLead(l); setReassignTo(l.owner || ''); };
  const submitReassign = () => {
    if (!reassignTo) { toast('Pick a new owner', 'error'); return; }
    const before = reassignLead.owner || 'Unassigned';
    updateItem('leads', reassignLead.id, { owner: reassignTo, reassignedAt: new Date().toISOString() });
    writeAudit('CRM Lead Reassigned', `${reassignLead.name}: ${before} → ${reassignTo}`, 'CRM', `Acted by ${persona.label} (${h.role})`);
    toast(`Lead reassigned to ${reassignTo}`, 'success');
    setReassignLead(null);
  };

  const viewDetail = l => openDrawer({title:l.name,subtitle:`Lead · ${l.id}`,content:(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      {/* Lifecycle stepper */}
      <div className="crm-lifecycle">
        {['New','Contacted','Qualified','Tour Scheduled','Negotiation','Reservation','Closed Won'].map((s, i, arr) => {
          const stageIx = arr.indexOf(l.stage);
          const cur = arr.indexOf(s);
          const cls = cur < stageIx ? 'done' : cur === stageIx ? 'current' : '';
          return (
            <React.Fragment key={s}>
              <div className={`crm-lifecycle-step ${cls}`}>
                <div className="dot">{cur < stageIx ? '✓' : cur + 1}</div>
                <div className="lbl">{s}</div>
              </div>
              {i < arr.length - 1 && <div className={`crm-lifecycle-line ${cur < stageIx ? 'done' : ''}`} />}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {[['Phone',l.phone],['Email',l.email],['Source',l.source],['Project',l.project],['Developer',l.developer],['Budget',l.budget?`EGP ${Number(l.budget).toLocaleString()}`:'—'],['Team', l.team || '—'],['Owner', l.owner || 'Unassigned']].map(([k,v])=>(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v||'—'}</div></div>))}
        <div><div className="drawer-label">Stage</div><span className={`badge ${stageColor(l.stage)}`}>{l.stage}</span></div>
        <div><div className="drawer-label">Priority</div><span className={`badge ${prioColor(l.priority)}`}>{l.priority}</span></div>
        <div><div className="drawer-label">SLA</div><SlaBadge stage={l.stage} created={l.created} /></div>
        <div><div className="drawer-label">Created</div><div className="drawer-value">{l.created||'—'} ({leadAgeDays(l.created)}d ago)</div></div>
      </div>

      {isManualLockActive(l) && (
        <div style={{padding:'10px 12px',background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:8,fontSize:12,display:'flex',alignItems:'center',gap:8}}>
          <Lock size={14} color="#b45309"/>
          <span><b>6-month protection:</b> manual lead — only Sales Director can reassign for the next {180 - leadAgeDays(l.created)} days.</span>
        </div>
      )}

      {l.notes && <div><div className="drawer-label">Notes</div><div className="drawer-value">{l.notes}</div></div>}

      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {!readOnly && <button className="btn btn-sm btn-brand" onClick={()=>openEdit(l)}><Edit size={13}/> Edit</button>}
        {canAssign(personaKey, l) && <button className="btn btn-sm btn-outline" onClick={()=>openReassign(l)}><UserCog size={13}/> Reassign</button>}
        {!readOnly && <button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>handleDel(l.id)}><Trash2 size={13}/> Delete</button>}
        <button className="btn btn-sm btn-outline" onClick={()=>navigate(`/system/crm/leads/${l.id}`)}>Open detail page <ChevronRight size={13}/></button>
      </div>
    </div>
  )});

  const exportCSV = ()=>{const head=['ID','Name','Phone','Source','Project','Stage','Priority','Team','Owner','Age (d)'];const rows=filtered.map(l=>[l.id,l.name,l.phone,l.source,l.project,l.stage,l.priority,l.team,l.owner||'Unassigned',leadAgeDays(l.created)]);const c=[head,...rows].map(r=>r.join(',')).join('\n');const b=new Blob([c],{type:'text/csv'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='crm-leads.csv';a.click();toast('Exported','success');};

  const assignable = assignableStaff(personaKey, state.staff || []);

  // Role banner copy
  const roleScopeLabel = h.scope === 'self' ? 'Own leads only' : h.scope === 'team' ? `Team ${h.team}` : h.scope === 'cross' ? `Teams ${h.teams?.join(' + ')}` : h.scope === 'all' ? 'All teams (full hierarchy)' : h.scope === 'audit' ? 'Audit-only (read)' : 'No access';

  return (
    <div className="crm-page">
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Leads</span></div><h1 className="page-title">Lead Management</h1><p className="page-subtitle">Manage incoming leads, track stage progression, and assign ownership · BRD V1.4 §6 (Lead Lifecycle) + §11 (RBAC)</p></div>

      {/* ─── Role context banner — surfaces what THIS user can do ─── */}
      <div className="crm-role-banner">
        <div className="ico"><ShieldCheck size={18}/></div>
        <div className="meat">
          <div className="title">{persona.label} · {h.role}</div>
          <div className="line">
            <span className="kv"><b>Visibility:</b> {roleScopeLabel}</span>
            <span className="kv"><b>Reassign:</b> {h.scope === 'all' ? 'Any lead, any team' : h.scope === 'cross' ? 'Within managed teams' : h.scope === 'team' ? 'Within own team' : 'Not allowed'}</span>
            <span className="kv"><b>Manual lock:</b> Director-only override (180d)</span>
          </div>
        </div>
        <div className="kpis">
          <div><div className="num">{visible.length}</div><div className="lbl">Visible</div></div>
          <div><div className="num">{visible.filter(l => slaForStage(l.stage, leadAgeDays(l.created)).level === 'breach').length}</div><div className="lbl">SLA breach</div></div>
          <div><div className="num">{visible.filter(l => !l.owner).length}</div><div className="lbl">Unassigned</div></div>
        </div>
      </div>

      <div className="data-panel" style={{marginBottom:16}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'center'}}>
          <div className="search-box" style={{flex:'1 1 220px'}}><Search size={16}/><input type="text" placeholder="Search leads (name, phone, project)…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <select className="filter-select" value={fStage} onChange={e=>setFStage(e.target.value)}><option value="All">All Stages</option>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
          <select className="filter-select" value={fPrio} onChange={e=>setFPrio(e.target.value)}><option value="All">All Priorities</option>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select>
          <select className="filter-select" value={fSrc} onChange={e=>setFSrc(e.target.value)}><option value="All">All Sources</option>{SOURCES.map(s=><option key={s}>{s}</option>)}</select>
          {/* Export Leads removed for individual-contributor agents per 08-May
              stakeholder review. TL / Manager / Director / audit roles keep it. */}
          {h.scope !== 'self' && (
            <button className="btn btn-sm btn-outline" onClick={exportCSV}><Download size={14}/> Export</button>
          )}
          <button className="btn btn-sm btn-outline" onClick={() => openDrawer({ title: 'Reassignment Audit Trail', subtitle: 'Last 50 reassignments', content: (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {(state.audit || []).filter(a => a.action?.includes('Reassigned') || a.action?.includes('Lead')).slice(0, 50).map(a => (
                <div key={a.id || `${a.timestamp}-${a.action}`} className="crm-audit-row">
                  <div className="ico"><History size={13}/></div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>{a.action}</div>
                    <div style={{fontSize:11,color:'var(--text-secondary)'}}>{a.target} · {a.detail || '—'}</div>
                    <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:2}}>{a.timestamp} · by {a.actor}</div>
                  </div>
                </div>
              ))}
              {(state.audit || []).filter(a => a.action?.includes('Reassigned')).length === 0 && <div style={{fontSize:13,color:'var(--text-secondary)'}}>No reassignments logged yet.</div>}
            </div>
          )})}><History size={14}/> Audit trail</button>
          {!readOnly && <button className="btn btn-brand" onClick={openAdd2}><Plus size={16}/> Add Lead</button>}
          {readOnly && <span className="badge badge-warning">Read-only · audit role</span>}
        </div>
        <div style={{marginTop:8,fontSize:12,color:'var(--text-tertiary)'}}>Showing {filtered.length} of {visible.length} leads</div>
      </div>

      <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th style={{width:36}}><input type="checkbox" checked={sel.length===filtered.length&&filtered.length>0} onChange={()=>setSel(sel.length===filtered.length?[]:filtered.map(l=>l.id))}/></th><th>ID</th><th>Name</th><th>Source</th><th>Project</th><th>Stage</th><th>Priority</th><th>Team</th><th>Owner</th><th>SLA</th><th>Actions</th></tr></thead>
        <tbody>{filtered.length===0?<tr><td colSpan={11} style={{textAlign:'center',padding:40,color:'var(--text-tertiary)'}}>No leads match your filters or visibility scope.</td></tr>:filtered.map(l=>{
          const locked = isManualLockActive(l);
          return (
          <tr key={l.id} className={sel.includes(l.id)?'row-selected':''}>
            <td><input type="checkbox" checked={sel.includes(l.id)} onChange={()=>toggleSel(l.id)}/></td>
            <td className="muted" style={{fontSize:11}}>{l.id}</td>
            <td className="bold clickable" onClick={()=>navigate(`/system/crm/leads/${l.id}`)}>
              {l.name}
              {l.duplicate==='Review' && <span title="Possible duplicate" style={{marginLeft:6}}><AlertTriangle size={12} color="var(--warning)"/></span>}
              {locked && <span title="Manual lead — 6-month protection" style={{marginLeft:6}}><Lock size={12} color="#b45309"/></span>}
            </td>
            <td className="muted">{l.source}</td>
            <td className="muted">{l.project||'—'}</td>
            <td><span className={`badge ${stageColor(l.stage)}`}>{l.stage}</span></td>
            <td><span className={`badge ${prioColor(l.priority)}`}>{l.priority}</span></td>
            <td className="muted">{l.team || '—'}</td>
            <td className="muted">{l.owner || <span style={{color:'var(--warning)',fontWeight:600}}>Unassigned</span>}</td>
            <td><SlaBadge stage={l.stage} created={l.created}/></td>
            <td>
              <div style={{display:'flex',gap:4}}>
                <button className="btn-icon" title="View" onClick={()=>viewDetail(l)}><Eye size={14}/></button>
                {!readOnly && <button className="btn-icon" title="Edit" onClick={()=>openEdit(l)}><Edit size={14}/></button>}
                {canAssign(personaKey, l) && <button className="btn-icon" title="Reassign" onClick={()=>openReassign(l)}><UserCog size={14}/></button>}
                {!readOnly && <button className="btn-icon" title="Delete" style={{color:'var(--danger)'}} onClick={()=>handleDel(l.id)}><Trash2 size={14}/></button>}
              </div>
            </td>
          </tr>
        );})}</tbody></table></div></div>

      {/* ─── Add / Edit modal ─── */}
      {showAdd && <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:640}}>
          <div className="modal-header"><h3>{editLead?'Edit Lead':'Add New Lead'}</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div className="form-group" style={{gridColumn:'span 2'}}><label>Full Name *</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
              <div className="form-group"><label>Phone</label><input type="text" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
              <div className="form-group"><label>Source</label><select value={form.source} onChange={e=>setForm({...form,source:e.target.value})}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label>Project</label><select value={form.project} onChange={e=>setForm({...form,project:e.target.value})}><option value="">None</option>{state.projects?.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
              <div className="form-group"><label>Developer</label><select value={form.developer} onChange={e=>setForm({...form,developer:e.target.value})}><option value="">None</option>{state.developers?.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
              <div className="form-group"><label>Budget (EGP)</label><input type="number" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}/></div>
              <div className="form-group"><label>Stage</label><select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label>Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select></div>
              <div className="form-group"><label>Owner (hierarchy-scoped)</label>
                <select value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})} disabled={h.scope === 'self'}>
                  <option value="">Unassigned</option>
                  {assignable.map(s=><option key={s.id || s.name} value={s.name}>{s.name}{s.role ? ` — ${s.role}` : ''}</option>)}
                </select>
                <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:4}}>{h.scope === 'self' ? 'Agents can only own self-created leads.' : h.scope === 'team' ? `Limited to Team ${h.team}.` : h.scope === 'cross' ? `Limited to Teams ${h.teams?.join(' + ')}.` : 'Director scope — any owner.'}</div>
              </div>
              <div className="form-group" style={{gridColumn:'span 2'}}><label>Notes</label><textarea rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
              {!editLead && (
                <div style={{gridColumn:'span 2',padding:'10px 12px',background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:8,fontSize:12,display:'flex',alignItems:'center',gap:8}}>
                  <Lock size={13} color="#b45309"/>
                  <span>Manual leads are locked to the creator for <b>180 days</b> (BRD §6.1.4). Only Sales Director can override.</span>
                </div>
              )}
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-brand">{editLead?'Update':'Create'} Lead</button></div>
          </form>
        </div>
      </div>}

      {/* ─── Reassign modal — hierarchy-aware ─── */}
      {reassignLead && <div className="modal-overlay" onClick={()=>setReassignLead(null)}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
          <div className="modal-header"><h3>Reassign Lead</h3><button className="btn-icon" onClick={()=>setReassignLead(null)}><X size={18}/></button></div>
          <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{padding:12,background:'#f8fafc',borderRadius:8,fontSize:13}}>
              <div><b>{reassignLead.name}</b> · {reassignLead.id}</div>
              <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>Current owner: <b>{reassignLead.owner || 'Unassigned'}</b> · Team {reassignLead.team || '—'}</div>
            </div>
            <div className="form-group"><label>Reassign to</label>
              <select value={reassignTo} onChange={e=>setReassignTo(e.target.value)}>
                <option value="">Pick agent…</option>
                {assignable.map(s=><option key={s.id || s.name} value={s.name}>{s.name}{s.team ? ` — ${s.team}` : ''}{s.role ? ` (${s.role})` : ''}</option>)}
              </select>
              <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:6}}>Acting as <b>{persona.label}</b> ({h.role}). This action will be logged in the audit trail.</div>
            </div>
          </div>
          <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setReassignLead(null)}>Cancel</button><button className="btn btn-brand" onClick={submitReassign}><UserCog size={14}/> Reassign & log</button></div>
        </div>
      </div>}
    </div>
  );
};
