import React, { useState, useMemo } from 'react';
import { CONTRACT_STAGES } from '../../data/staticData';
import { useApp } from '../../context/AppContext';
import { Plus, X, Eye, FileText, CheckCircle, Clock, AlertCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { HIERARCHY, isReadOnly } from '../../data/crmAccess';

const fmt = n => new Intl.NumberFormat('en-EG').format(n);
const stageColor = s => s==='Registered'?'badge-success':s==='Signed'?'badge-info':s==='Under Review'?'badge-warning':'badge-gray';
const stageIcon = s => s==='Registered'?<CheckCircle size={14} color="#10b981"/>:s==='Signed'?<FileText size={14} color="var(--info)"/>:s==='Under Review'?<Clock size={14} color="var(--warning)"/>:<AlertCircle size={14} color="var(--text-tertiary)"/>;

// Approval gate per BRD §6.4 — only Sales Manager / Director / Backoffice
// can promote a contract to Signed or Registered. Agents/Team Leaders can
// edit drafts and submit for review, but cannot finalize.
const canFinalizeContracts = (personaKey) => ['salesManager','salesDirector','backofficeAdmin','financeOfficer','systemAdmin'].includes(personaKey);

export const CrmContracts = () => {
  const { state, addItem, updateItem, toast, openDrawer, persona, personaKey, writeAudit } = useApp();
  const readOnly = isReadOnly(personaKey);
  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };
  const canFinalize = canFinalizeContracts(personaKey);
  const [fStage, setFStage] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({dealId:'', unitCode:'', value:'', downPct:'', installments:'', lawyer:'', notes:''});

  const contracts = state.contracts || [];
  const filtered = useMemo(()=>contracts.filter(c=>fStage==='All'||c.stage===fStage),[contracts, fStage]);

  const advanceStage = (c, targetStage) => {
    if (!canFinalize && (targetStage === 'Signed' || targetStage === 'Registered')) {
      toast(`Only Sales Manager / Director can move to ${targetStage} (BRD §6.4)`, 'error');
      return;
    }
    updateItem('contracts', c.id, { stage: targetStage, ...(targetStage === 'Signed' ? { signDate: new Date().toISOString().split('T')[0] } : {}) });
    writeAudit('Contract Stage Changed', `${c.id}: ${c.stage} → ${targetStage}`, 'CRM', `By ${persona.label}`);
    toast(`Moved to ${targetStage}`, 'success');
  };

  const stats = {total:contracts.length, draft:contracts.filter(c=>c.stage==='Draft').length, review:contracts.filter(c=>c.stage==='Under Review').length, signed:contracts.filter(c=>c.stage==='Signed').length, registered:contracts.filter(c=>c.stage==='Registered').length};
  const totalValue = contracts.reduce((s,c)=>s+c.value,0);

  const viewDetail = c => openDrawer({title:`Contract ${c.id}`,subtitle:`${c.project} — ${c.unitCode}`,content:(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {/* Stage Progress */}
      <div style={{display:'flex',gap:4,marginBottom:8}}>
        {CONTRACT_STAGES.map((s,i)=>{const active=CONTRACT_STAGES.indexOf(c.stage)>=i;return(
          <div key={s} style={{flex:1,textAlign:'center'}}>
            <div style={{height:4,borderRadius:4,background:active?'var(--brand)':'#e2e8f0',marginBottom:6}}/>
            <div style={{fontSize:10,fontWeight:active?700:400,color:active?'var(--brand)':'var(--text-tertiary)'}}>{s}</div>
          </div>
        );})}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[['Deal ID',c.dealId],['Lead',c.leadName],['Project',c.project],['Unit Code',c.unitCode],['Contract Value',`EGP ${fmt(c.value)}`],['Down Payment',`EGP ${fmt(c.downPayment)} (${c.downPct}%)`],['Installments',`${c.installments} months`],['Monthly',`EGP ${fmt(c.monthlyInstall)}`],['Created',c.createdDate],['Signed',c.signDate||'—'],['Lawyer',c.lawyer||'—'],['Stage',null]].map(([k,v])=>v!==null?(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>):(<div key={k}><div className="drawer-label">{k}</div><span className={`badge ${stageColor(c.stage)}`}>{stageIcon(c.stage)} {c.stage}</span></div>))}
      </div>
      {c.notes&&<div><div className="drawer-label">Notes</div><div style={{fontSize:13,background:'#f8fafc',padding:14,borderRadius:10,border:'1px solid var(--border)',lineHeight:1.6}}>{c.notes}</div></div>}

      {/* Stage-advance actions — gated by role */}
      {!readOnly && (
        <div style={{borderTop:'1px solid var(--border)',paddingTop:14}}>
          <div className="drawer-label" style={{marginBottom:8}}>Advance contract</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {CONTRACT_STAGES.filter(s => s !== c.stage).map(s => {
              const blocked = !canFinalize && (s === 'Signed' || s === 'Registered');
              return (
                <button key={s} className="btn btn-sm btn-outline" disabled={blocked} title={blocked ? `Requires Sales Manager / Director (BRD §6.4)` : ''} onClick={() => advanceStage(c, s)} style={{fontSize:11, opacity: blocked ? 0.5 : 1}}>
                  {stageIcon(s)} {s}
                </button>
              );
            })}
          </div>
          {!canFinalize && (
            <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:8,display:'flex',alignItems:'center',gap:6}}>
              <ChevronRight size={11}/> You can submit drafts for review. Final signature & registration require Sales Manager or Director approval.
            </div>
          )}
        </div>
      )}
      {/* Payment Schedule */}
      <div><div className="drawer-label" style={{marginBottom:8}}>Payment Schedule</div>
        <div style={{background:'#f8fafc',borderRadius:10,border:'1px solid var(--border)',padding:16}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,fontSize:12,fontWeight:600}}>
            <span>Down Payment</span><span style={{color:'var(--brand)'}}>EGP {fmt(c.downPayment)}</span>
          </div>
          <div style={{height:8,background:'#e2e8f0',borderRadius:8,overflow:'hidden',marginBottom:12}}>
            <div style={{width:`${c.downPct}%`,height:'100%',background:'var(--brand)',borderRadius:8}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,fontSize:11,color:'var(--text-secondary)'}}>
            <div><div style={{fontWeight:600}}>Remaining</div>EGP {fmt(c.value-c.downPayment)}</div>
            <div><div style={{fontWeight:600}}>Installments</div>{c.installments} months</div>
            <div><div style={{fontWeight:600}}>Monthly</div>EGP {fmt(c.monthlyInstall)}</div>
          </div>
        </div>
      </div>
    </div>
  )});

  const roleScopeLabel = readOnly ? 'Audit-only' : canFinalize ? 'Full lifecycle (sign + register)' : h.scope === 'self' ? 'Drafts only — submit for review' : 'Edit drafts, submit for review';

  return (
    <div className="crm-page">
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Contracts</span></div><h1 className="page-title">Contracts</h1><p className="page-subtitle">Contract lifecycle management — from draft to registration · BRD V1.4 §6.4</p></div>

      <div className="crm-role-banner">
        <div className="ico"><ShieldCheck size={18}/></div>
        <div className="meat">
          <div className="title">{persona.label} · {h.role}</div>
          <div className="line">
            <span className="kv"><b>Permissions:</b> {roleScopeLabel}</span>
            <span className="kv"><b>Sign / Register:</b> {canFinalize ? 'Allowed' : 'Manager / Director only'}</span>
          </div>
        </div>
        <div className="kpis">
          <div><div className="num">{contracts.filter(c => c.stage === 'Under Review').length}</div><div className="lbl">Awaiting review</div></div>
          <div><div className="num">{contracts.filter(c => c.stage === 'Signed').length}</div><div className="lbl">Signed</div></div>
          <div><div className="num">{contracts.filter(c => c.stage === 'Registered').length}</div><div className="lbl">Registered</div></div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,marginBottom:24}}>
        {[['Total Contracts',stats.total,'var(--info)'],['Draft',stats.draft,'var(--text-tertiary)'],['Under Review',stats.review,'var(--warning)'],['Signed',stats.signed,'var(--info)'],['Registered',stats.registered,'var(--success)']].map(([l,v,c])=>(
          <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'14px 18px',borderTop:`3px solid ${c}`}}><div style={{fontSize:11,color:'var(--text-secondary)',fontWeight:600}}>{l}</div><div style={{fontSize:22,fontWeight:800,marginTop:4}}>{v}</div></div>
        ))}
      </div>

      <div style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)',borderRadius:14,padding:'20px 28px',color:'#fff',marginBottom:20,display:'flex',alignItems:'center',gap:20}}>
        <FileText size={28} color="#E8672A"/>
        <div style={{flex:1}}><div style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>Total Contract Value</div><div style={{fontSize:26,fontWeight:800}}>EGP {fmt(totalValue)}</div></div>
        <div style={{textAlign:'right'}}><div style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>Avg Down Payment</div><div style={{fontSize:18,fontWeight:700}}>{contracts.length?(contracts.reduce((s,c)=>s+c.downPct,0)/contracts.length).toFixed(0):0}%</div></div>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:16,alignItems:'center'}}>
        <select className="filter-select" value={fStage} onChange={e=>setFStage(e.target.value)}><option value="All">All Stages</option>{CONTRACT_STAGES.map(s=><option key={s}>{s}</option>)}</select>
        <div style={{flex:1}}/>
        {!readOnly && <button className="btn btn-brand" onClick={()=>setShowAdd(true)}><Plus size={16}/> New Contract</button>}
        {readOnly && <span className="badge badge-warning">Read-only · audit role</span>}
      </div>

      <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Deal</th><th>Lead</th><th>Project</th><th>Unit</th><th>Value</th><th>Down Payment</th><th>Monthly</th><th>Stage</th><th>Sign Date</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map(c=>(
          <tr key={c.id}>
            <td className="muted" style={{fontSize:11}}>{c.id}</td>
            <td className="muted">{c.dealId}</td>
            <td className="bold">{c.leadName}</td>
            <td className="muted">{c.project}</td>
            <td className="muted" style={{fontSize:11}}>{c.unitCode}</td>
            <td className="bold">EGP {fmt(c.value)}</td>
            <td className="muted">EGP {fmt(c.downPayment)} ({c.downPct}%)</td>
            <td className="muted">EGP {fmt(c.monthlyInstall)}</td>
            <td><span className={`badge ${stageColor(c.stage)}`}>{stageIcon(c.stage)} {c.stage}</span></td>
            <td className="muted">{c.signDate||'—'}</td>
            <td><button className="btn-icon" onClick={()=>viewDetail(c)}><Eye size={14}/></button></td>
          </tr>
        ))}</tbody></table></div></div>

      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}><div className="modal-header"><h3>Create New Contract</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
        <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="form-group"><label>Link to Deal</label><select value={form.dealId} onChange={e=>setForm({...form,dealId:e.target.value})}><option value="">Select Deal…</option>{state.deals?.map(d=><option key={d.id} value={d.id}>{d.id} — {d.leadName}</option>)}</select></div>
          <div className="form-group"><label>Unit Code</label><input type="text" placeholder="e.g. PH-NC-V101" value={form.unitCode} onChange={e=>setForm({...form,unitCode:e.target.value})}/></div>
          <div className="form-group"><label>Contract Value (EGP)</label><input type="number" placeholder="e.g. 8500000" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/></div>
          <div className="form-group"><label>Down Payment %</label><input type="number" placeholder="e.g. 10" value={form.downPct} onChange={e=>setForm({...form,downPct:e.target.value})}/></div>
          <div className="form-group"><label>Installments (months)</label><input type="number" placeholder="e.g. 84" value={form.installments} onChange={e=>setForm({...form,installments:e.target.value})}/></div>
          <div className="form-group"><label>Lawyer</label><input type="text" placeholder="e.g. Mahmoud Samy" value={form.lawyer} onChange={e=>setForm({...form,lawyer:e.target.value})}/></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Notes</label><textarea rows={3} placeholder="Contract notes…" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{
          if(!form.dealId){toast('Select a deal','error');return;}
          const deal=state.deals?.find(d=>d.id===form.dealId);
          const v=Number(form.value)||0;
          const dp=Number(form.downPct)||0;
          const downPayment=v*(dp/100);
          const inst=Number(form.installments)||1;
          const monthlyInstall=(v-downPayment)/inst;
          addItem('contracts',{dealId:form.dealId,leadName:deal?.leadName,project:deal?.project,unitCode:form.unitCode,value:v,downPct:dp,downPayment,installments:inst,monthlyInstall,lawyer:form.lawyer,notes:form.notes,stage:'Draft',createdDate:new Date().toISOString().split('T')[0]},'CNT');
          writeAudit('Contract Created (Draft)', `${deal?.leadName || form.dealId} · EGP ${fmt(v)}`, 'CRM', `By ${persona.label}`);
          toast('Contract created — Draft. Submit for Review when ready.','success');
          setShowAdd(false);
        }}>Create Contract</button></div></div></div>}
    </div>
  );
};
