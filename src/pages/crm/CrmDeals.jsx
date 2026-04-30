import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, Eye, X, LayoutGrid, List, GripVertical, ShieldCheck, Percent, ChevronRight, Check } from 'lucide-react';
import { HIERARCHY, canSeeLead, isReadOnly, personaOwnerName } from '../../data/crmAccess';

const DEAL_STAGES = ['Qualified','Negotiation','Reservation','Contracting','Closed Won','Closed Lost'];
const stageColors = {'Qualified':'#3b82f6','Negotiation':'#f59e0b','Reservation':'#E8672A','Contracting':'#8b5cf6','Closed Won':'#10b981','Closed Lost':'#ef4444'};
const fmt = n => new Intl.NumberFormat('en-EG').format(n);

// Commission override approval chain (BRD §6.2.4):
//   ≤ +0.5%  → Team Leader
//   ≤ +1.0%  → Sales Manager
//   > +1.0%  → Sales Director (final)
const overrideApprover = (delta) => delta <= 0.5 ? 'Team Leader' : delta <= 1.0 ? 'Sales Manager' : 'Sales Director';
const personaCanApprove = (personaKey, approver) => {
  if (personaKey === 'salesDirector') return true; // director can approve at any tier
  if (personaKey === 'salesManager') return approver !== 'Sales Director';
  if (personaKey === 'teamLeader')   return approver === 'Team Leader';
  return false;
};

export const CrmDeals = () => {
  const { state, addItem, updateItem, removeItem, toast, openDrawer, persona, personaKey, writeAudit } = useApp();
  const allDeals = state.deals || [];
  const readOnly = isReadOnly(personaKey);
  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };

  // Role-scoped visibility — same rule as leads.
  const deals = useMemo(() => allDeals.filter(d => canSeeLead(personaKey, d)), [allDeals, personaKey]);

  const [view, setView] = useState('kanban');
  const [showAdd, setShowAdd] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [overrideFor, setOverrideFor] = useState(null);
  const [overrideForm, setOverrideForm] = useState({ requestedPct: '', reason: '' });
  const def = {title:'',leadName:'',project:'',value:'',stage:'Qualified',owner: personaOwnerName(personaKey) || 'Fatma Ibrahim',commission:3,status:'Active',team: h.team || 'Alpha'};
  const [form, setForm] = useState(def);

  const grouped = useMemo(()=>{
    const g = {};
    DEAL_STAGES.forEach(s=>g[s]=[]);
    deals.forEach(d=>{if(g[d.stage])g[d.stage].push(d);});
    return g;
  },[deals]);

  const totalPipeline = deals.filter(d=>d.status==='Active').reduce((s,d)=>s+d.value,0);
  const pendingOverrides = deals.filter(d => d.commissionOverride?.status === 'Pending');

  const openAdd2=()=>{setForm({...def, owner: personaOwnerName(personaKey) || def.owner});setEditDeal(null);setShowAdd(true);};
  const openEdit=d=>{setForm({title:d.title||'',leadName:d.leadName||'',project:d.project||'',value:d.value||'',stage:d.stage||'Qualified',owner:d.owner||'',commission:d.commission||3,status:d.status||'Active',team:d.team||'Alpha'});setEditDeal(d);setShowAdd(true);};
  const handleSubmit=e=>{
    e.preventDefault();
    if(!form.title.trim()){toast('Title is required','error');return;}
    if(editDeal){
      updateItem('deals',editDeal.id,{...form,value:Number(form.value)||0,commission:Number(form.commission)||0});
      writeAudit('Deal Updated', `${form.title} (${editDeal.id})`, 'CRM');
      toast('Deal updated','success');
    }else{
      addItem('deals',{...form,value:Number(form.value)||0,commission:Number(form.commission)||0,created:new Date().toISOString().split('T')[0]},'D');
      writeAudit('Deal Created', form.title, 'CRM');
      toast('Deal created','success');
    }
    setShowAdd(false);
  };
  const handleDel=id=>{removeItem('deals',id);writeAudit('Deal Deleted', id, 'CRM');toast('Deal deleted','success');};
  const moveStage=(d,newStage)=>{
    updateItem('deals',d.id,{stage:newStage,status:newStage==='Closed Lost'?'Lost':newStage==='Closed Won'?'Won':'Active'});
    writeAudit('Deal Stage Changed', `${d.title}: ${d.stage} → ${newStage}`, 'CRM');
    toast(`Moved to ${newStage}`,'success');
  };

  // Commission override flow ──────────────────────────────────────────────
  const openOverride = (d) => { setOverrideFor(d); setOverrideForm({ requestedPct: '', reason: '' }); };
  const submitOverride = () => {
    const requestedPct = Number(overrideForm.requestedPct);
    if (!requestedPct || requestedPct <= overrideFor.commission) {
      toast('Override must be higher than current commission', 'error');
      return;
    }
    if (!overrideForm.reason.trim()) { toast('Reason required', 'error'); return; }
    const delta = requestedPct - overrideFor.commission;
    const approver = overrideApprover(delta);
    updateItem('deals', overrideFor.id, {
      commissionOverride: {
        requestedPct,
        currentPct: overrideFor.commission,
        delta: Number(delta.toFixed(2)),
        reason: overrideForm.reason,
        requestedBy: persona.label,
        requestedAt: new Date().toISOString(),
        approver,
        status: 'Pending',
      },
    });
    writeAudit('Commission Override Requested', `${overrideFor.title}: ${overrideFor.commission}% → ${requestedPct}% (Δ ${delta.toFixed(2)}%)`, 'CRM', `Routed to ${approver}`);
    toast(`Override submitted — pending ${approver} approval`, 'success');
    setOverrideFor(null);
  };
  const approveOverride = (d, decision) => {
    if (!personaCanApprove(personaKey, d.commissionOverride.approver)) {
      toast(`Only ${d.commissionOverride.approver} can ${decision} this override`, 'error');
      return;
    }
    if (decision === 'approve') {
      updateItem('deals', d.id, {
        commission: d.commissionOverride.requestedPct,
        commissionOverride: { ...d.commissionOverride, status: 'Approved', decidedBy: persona.label, decidedAt: new Date().toISOString() },
      });
      writeAudit('Commission Override Approved', `${d.title}: ${d.commissionOverride.currentPct}% → ${d.commissionOverride.requestedPct}%`, 'CRM', `By ${persona.label}`);
      toast('Override approved & applied', 'success');
    } else {
      updateItem('deals', d.id, {
        commissionOverride: { ...d.commissionOverride, status: 'Rejected', decidedBy: persona.label, decidedAt: new Date().toISOString() },
      });
      writeAudit('Commission Override Rejected', `${d.title}`, 'CRM', `By ${persona.label}`);
      toast('Override rejected', 'info');
    }
  };

  const viewDetail = d => openDrawer({title:d.title,subtitle:`Deal · ${d.id}`,content:(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[['Lead',d.leadName],['Project',d.project],['Value',`EGP ${fmt(d.value)}`],['Commission',`${d.commission}%`],['Est. Commission',`EGP ${fmt(d.value*d.commission/100)}`],['Owner',d.owner],['Team', d.team || '—'],['Created',d.created||'—']].map(([k,v])=>(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v||'—'}</div></div>))}
        <div><div className="drawer-label">Stage</div><span className="badge" style={{background:`${stageColors[d.stage]}20`,color:stageColors[d.stage]}}>{d.stage}</span></div>
        <div><div className="drawer-label">Status</div><span className={`badge ${d.status==='Active'?'badge-success':d.status==='Won'?'badge-info':'badge-danger'}`}>{d.status}</span></div>
      </div>

      {/* Commission override status */}
      {d.commissionOverride && (
        <div style={{padding:14,background:d.commissionOverride.status==='Pending'?'#fef3c7':d.commissionOverride.status==='Approved'?'#dcfce7':'#fee2e2',border:`1px solid ${d.commissionOverride.status==='Pending'?'#fcd34d':d.commissionOverride.status==='Approved'?'#86efac':'#fca5a5'}`,borderRadius:10}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>Commission Override · {d.commissionOverride.status}</div>
          <div style={{fontSize:12,color:'var(--text-secondary)'}}>
            {d.commissionOverride.currentPct}% → {d.commissionOverride.requestedPct}% (Δ {d.commissionOverride.delta}%)<br/>
            Requested by <b>{d.commissionOverride.requestedBy}</b> · routed to <b>{d.commissionOverride.approver}</b><br/>
            <i>{d.commissionOverride.reason}</i>
            {d.commissionOverride.decidedBy && <><br/>Decided by <b>{d.commissionOverride.decidedBy}</b> at {new Date(d.commissionOverride.decidedAt).toLocaleString()}</>}
          </div>
          {d.commissionOverride.status === 'Pending' && personaCanApprove(personaKey, d.commissionOverride.approver) && (
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <button className="btn btn-sm btn-brand" onClick={()=>approveOverride(d, 'approve')}><Check size={13}/> Approve</button>
              <button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>approveOverride(d, 'reject')}><X size={13}/> Reject</button>
            </div>
          )}
        </div>
      )}

      <div style={{borderTop:'1px solid var(--border)',paddingTop:14}}>
        <div className="drawer-label" style={{marginBottom:8}}>Move to Stage</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{DEAL_STAGES.filter(s=>s!==d.stage).map(s=><button key={s} className="btn btn-sm btn-outline" onClick={()=>moveStage(d,s)} style={{fontSize:11}}>{s}</button>)}</div>
      </div>

      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {!readOnly && <button className="btn btn-sm btn-brand" onClick={()=>openEdit(d)}><Edit size={13}/> Edit</button>}
        {!readOnly && (!d.commissionOverride || d.commissionOverride.status === 'Rejected') && <button className="btn btn-sm btn-outline" onClick={()=>openOverride(d)}><Percent size={13}/> Request commission override</button>}
        {!readOnly && <button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>handleDel(d.id)}><Trash2 size={13}/> Delete</button>}
      </div>
    </div>
  )});

  const roleScopeLabel = h.scope === 'self' ? 'Own deals only' : h.scope === 'team' ? `Team ${h.team}` : h.scope === 'cross' ? `Teams ${h.teams?.join(' + ')}` : h.scope === 'all' ? 'All teams (full hierarchy)' : h.scope === 'audit' ? 'Audit-only (read)' : 'No access';

  return (
    <div className="crm-page">
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Deals</span></div><h1 className="page-title">Deals Pipeline</h1><p className="page-subtitle">Track and manage your sales pipeline · Total visible: <strong>EGP {fmt(totalPipeline)}</strong> · BRD V1.4 §6.2 (Deal Lifecycle) + §6.2.4 (Override workflow)</p></div>

      {/* Role banner */}
      <div className="crm-role-banner">
        <div className="ico"><ShieldCheck size={18}/></div>
        <div className="meat">
          <div className="title">{persona.label} · {h.role}</div>
          <div className="line">
            <span className="kv"><b>Visibility:</b> {roleScopeLabel}</span>
            <span className="kv"><b>Stage moves:</b> {readOnly ? 'Read-only' : 'Allowed'}</span>
            <span className="kv"><b>Override approval:</b> {h.scope === 'all' ? 'All tiers' : h.scope === 'cross' ? 'TL + Manager' : h.scope === 'team' ? 'TL only' : 'Request only'}</span>
          </div>
        </div>
        <div className="kpis">
          <div><div className="num">{deals.length}</div><div className="lbl">Visible</div></div>
          <div><div className="num">{pendingOverrides.length}</div><div className="lbl">Override pending</div></div>
          <div><div className="num">{deals.filter(d => d.status === 'Won').length}</div><div className="lbl">Won</div></div>
        </div>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:16,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{display:'flex',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden'}}>
          <button className={`btn btn-sm ${view==='kanban'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('kanban')}><LayoutGrid size={14}/> Board</button>
          <button className={`btn btn-sm ${view==='table'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('table')}><List size={14}/> Table</button>
        </div>
        {pendingOverrides.length > 0 && (
          <button className="btn btn-sm btn-outline" onClick={()=>openDrawer({ title: 'Pending Commission Overrides', subtitle: `${pendingOverrides.length} awaiting approval`, content: (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {pendingOverrides.map(d => (
                <div key={d.id} style={{padding:12,border:'1px solid var(--border)',borderRadius:10}}>
                  <div style={{fontWeight:700,fontSize:13}}>{d.title}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>{d.commissionOverride.currentPct}% → {d.commissionOverride.requestedPct}% · approver: {d.commissionOverride.approver}</div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>{d.commissionOverride.reason}</div>
                  {personaCanApprove(personaKey, d.commissionOverride.approver) && (
                    <div style={{display:'flex',gap:6,marginTop:8}}>
                      <button className="btn btn-sm btn-brand" onClick={()=>approveOverride(d, 'approve')}><Check size={13}/> Approve</button>
                      <button className="btn btn-sm btn-outline" onClick={()=>approveOverride(d, 'reject')}>Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )})}><Percent size={13}/> Override queue ({pendingOverrides.length})</button>
        )}
        <div style={{flex:1}}/>
        {!readOnly && <button className="btn btn-brand" onClick={openAdd2}><Plus size={16}/> Add Deal</button>}
      </div>

      {view==='kanban' ? (
        <div className="crm-kanban">
          {DEAL_STAGES.map(stage=>(
            <div className="crm-kanban-column" key={stage}>
              <div className="crm-kanban-header">
                <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:'50%',background:stageColors[stage]}}/><span style={{fontWeight:700,fontSize:13}}>{stage}</span></div>
                <span style={{fontSize:12,fontWeight:700,color:'var(--text-secondary)',background:'#f4f7fe',padding:'2px 8px',borderRadius:10}}>{grouped[stage].length}</span>
              </div>
              <div className="crm-kanban-cards">
                {grouped[stage].length===0 ? <div style={{padding:'24px 0',textAlign:'center',fontSize:12,color:'var(--text-tertiary)'}}>No deals</div> :
                grouped[stage].map(d=>(
                  <div className="crm-kanban-card" key={d.id} onClick={()=>viewDetail(d)}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                      <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.title}</div>
                      <GripVertical size={14} style={{color:'var(--text-tertiary)',flexShrink:0}}/>
                    </div>
                    <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:6}}>{d.leadName || '—'} · {d.project}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:14,fontWeight:800,color:'var(--brand)'}}>EGP {fmt(d.value)}</span>
                      <span style={{fontSize:11,color:'var(--text-tertiary)'}}>{d.owner}</span>
                    </div>
                    {d.commissionOverride?.status === 'Pending' && (
                      <div style={{marginTop:8,padding:'4px 8px',background:'#fef3c7',color:'#92400e',fontSize:10,fontWeight:700,borderRadius:6,display:'inline-flex',alignItems:'center',gap:4}}>
                        <Percent size={10}/> Override pending · {d.commissionOverride.approver}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Title</th><th>Lead</th><th>Project</th><th>Value</th><th>Stage</th><th>Comm.</th><th>Team</th><th>Owner</th><th>Actions</th></tr></thead>
          <tbody>{deals.length === 0 ? <tr><td colSpan={10} style={{textAlign:'center',padding:40,color:'var(--text-tertiary)'}}>No deals match your filters or visibility scope.</td></tr> : deals.map(d=>(
            <tr key={d.id}>
              <td className="muted" style={{fontSize:11}}>{d.id}</td>
              <td className="bold clickable" onClick={()=>viewDetail(d)}>{d.title}{d.commissionOverride?.status === 'Pending' && <Percent size={11} color="#b45309" style={{marginLeft:6}}/>}</td>
              <td className="muted">{d.leadName||'—'}</td>
              <td className="muted">{d.project}</td>
              <td className="bold">EGP {fmt(d.value)}</td>
              <td><span className="badge" style={{background:`${stageColors[d.stage]}20`,color:stageColors[d.stage]}}>{d.stage}</span></td>
              <td className="muted">{d.commission}%</td>
              <td className="muted">{d.team || '—'}</td>
              <td className="muted">{d.owner}</td>
              <td>
                <div style={{display:'flex',gap:4}}>
                  <button className="btn-icon" onClick={()=>viewDetail(d)} title="View"><Eye size={14}/></button>
                  {!readOnly && <button className="btn-icon" onClick={()=>openEdit(d)} title="Edit"><Edit size={14}/></button>}
                  {!readOnly && <button className="btn-icon" onClick={()=>openOverride(d)} title="Commission override"><Percent size={14}/></button>}
                  {!readOnly && <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDel(d.id)} title="Delete"><Trash2 size={14}/></button>}
                </div>
              </td>
            </tr>
          ))}</tbody></table></div></div>
      )}

      {/* ─── Add / Edit modal ─── */}
      {showAdd && <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
          <div className="modal-header"><h3>{editDeal?'Edit Deal':'Add New Deal'}</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
          <form onSubmit={handleSubmit}><div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div className="form-group" style={{gridColumn:'span 2'}}><label>Deal Title *</label><input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
            <div className="form-group"><label>Lead Name</label><input type="text" value={form.leadName} onChange={e=>setForm({...form,leadName:e.target.value})}/></div>
            <div className="form-group"><label>Project</label><input type="text" value={form.project} onChange={e=>setForm({...form,project:e.target.value})}/></div>
            <div className="form-group"><label>Value (EGP)</label><input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/></div>
            <div className="form-group"><label>Commission %</label><input type="number" value={form.commission} onChange={e=>setForm({...form,commission:e.target.value})} step="0.5"/></div>
            <div className="form-group"><label>Stage</label><select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>{DEAL_STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="form-group"><label>Owner</label><input type="text" value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})}/></div>
          </div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-brand">{editDeal?'Update':'Create'} Deal</button></div></form>
        </div>
      </div>}

      {/* ─── Commission override request modal ─── */}
      {overrideFor && <div className="modal-overlay" onClick={()=>setOverrideFor(null)}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
          <div className="modal-header"><h3>Request Commission Override</h3><button className="btn-icon" onClick={()=>setOverrideFor(null)}><X size={18}/></button></div>
          <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{padding:12,background:'#f8fafc',borderRadius:8,fontSize:13}}>
              <div><b>{overrideFor.title}</b> · {overrideFor.id}</div>
              <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>Current commission: <b>{overrideFor.commission}%</b> · Value: EGP {fmt(overrideFor.value)}</div>
            </div>
            <div className="form-group"><label>Requested commission %</label><input type="number" value={overrideForm.requestedPct} onChange={e=>setOverrideForm({...overrideForm,requestedPct:e.target.value})} step="0.5" placeholder={`> ${overrideFor.commission}`}/></div>
            <div className="form-group"><label>Justification *</label><textarea rows={3} value={overrideForm.reason} onChange={e=>setOverrideForm({...overrideForm,reason:e.target.value})} placeholder="Why does this deal warrant a higher commission?"/></div>
            {overrideForm.requestedPct && (
              <div style={{padding:'10px 12px',background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:8,fontSize:12,display:'flex',alignItems:'center',gap:8}}>
                <ChevronRight size={14}/> Routes to <b>{overrideApprover(Number(overrideForm.requestedPct) - overrideFor.commission)}</b> per BRD §6.2.4 (Δ {(Number(overrideForm.requestedPct) - overrideFor.commission).toFixed(2)}%)
              </div>
            )}
          </div>
          <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setOverrideFor(null)}>Cancel</button><button className="btn btn-brand" onClick={submitOverride}><Percent size={14}/> Submit for approval</button></div>
        </div>
      </div>}
    </div>
  );
};
