// ═══════════════════════════════════════════════════════════════
// CRM Deals — Off Plan and Resale pipelines
// ───────────────────────────────────────────────────────────────
// Driven by Deal Stages.docx (business team, 08-May):
//   Off Plan:  Lead Qualified → Reservation → Contract Signed →
//              Early Collection (5%) → Standard Collection (10%)
//   Resale:    Lead Qualified → Property Viewed → Offer Made →
//              Offer Accepted → Contract Signed & Payment
//
// Pipeline lifecycle rules (auto-applied on stage transition):
//   • Contract Signed locks the commission and writes a Closed-Won
//     status for Off Plan deals.
//   • Early Collection Trigger flips the Homes Advance flag (Off Plan).
//   • Standard Collection (10%) marks revenue recognised (Off Plan).
//   • Contract Signed & Payment marks revenue recognised (Resale).
//
// Commission override approval chain (BRD §6.2.4) preserved:
//   Δ ≤ 0.5% → Team Leader   ·   Δ ≤ 1.0% → Sales Manager
//   Δ > 1.0% → Sales Director (final)
// ═══════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, Eye, X, LayoutGrid, List, GripVertical, ShieldCheck, Percent, Check, Paperclip, Home, Wallet, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { HIERARCHY, canSeeLead, isReadOnly, personaOwnerName } from '../../data/crmAccess';
import { stagesForDealType, DEAL_STAGES_OFFPLAN, DEAL_STAGES_RESALE } from '../../data/staticData';

const fmt = n => new Intl.NumberFormat('en-EG').format(n || 0);

// Off Plan + Resale colors — shared 'Lead Qualified', different downstream.
const STAGE_COLORS = {
  'Lead Qualified':                  '#3b82f6',
  // Off Plan
  'Reservation':                     '#E8672A',
  'Contract Signed':                 '#8b5cf6',
  'Early Collection Trigger (5%)':   '#06b6d4',
  'Standard Collection (10%)':       '#10b981',
  // Resale
  'Property Viewed':                 '#f59e0b',
  'Offer Made':                      '#E8672A',
  'Offer Accepted':                  '#8b5cf6',
  'Contract Signed & Payment':       '#10b981',
};
const stageColor = (s) => STAGE_COLORS[s] || '#64748b';

// Override approval chain (BRD §6.2.4).
const overrideApprover = (delta) => delta <= 0.5 ? 'Team Leader' : delta <= 1.0 ? 'Sales Manager' : 'Sales Director';
const personaCanApprove = (personaKey, approver) => {
  if (personaKey === 'salesDirector') return true;
  if (personaKey === 'salesManager') return approver !== 'Sales Director';
  if (personaKey === 'teamLeader')   return approver === 'Team Leader';
  return false;
};

// Apply lifecycle side-effects when a deal moves to a stage.
const lifecyclePatch = (deal, newStage) => {
  const patch = { stage: newStage };
  if (deal.type === 'OffPlan') {
    if (newStage === 'Contract Signed') {
      patch.commissionLocked = true;
      patch.status = 'Closed Won';
    }
    if (newStage === 'Early Collection Trigger (5%)') {
      patch.homesAdvanceAvailable = true;
      if (!deal.collectionPercent) patch.collectionPercent = 5;
    }
    if (newStage === 'Standard Collection (10%)') {
      patch.homesAdvanceAvailable = true;
      patch.revenueRecognised = true;
      patch.status = 'Closed Won';
      if (!deal.collectionPercent || deal.collectionPercent < 10) patch.collectionPercent = 10;
    }
  } else if (deal.type === 'Resale') {
    if (newStage === 'Contract Signed & Payment') {
      patch.commissionLocked = true;
      patch.revenueRecognised = true;
      patch.status = 'Closed Won';
    }
  }
  return patch;
};

export const CrmDeals = () => {
  const { state, addItem, updateItem, removeItem, toast, openDrawer, persona, personaKey, writeAudit } = useApp();
  const allDeals = state.deals || [];
  const listings = state.listings || [];
  const readOnly = isReadOnly(personaKey);
  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };

  // Role-scoped visibility — same rule as leads.
  const dealsAll = useMemo(() => allDeals.filter(d => canSeeLead(personaKey, d)), [allDeals, personaKey]);

  // Pipeline tab — All / OffPlan / Resale
  const [pipeline, setPipeline] = useState('OffPlan');
  const [view, setView] = useState('kanban');
  const [showAdd, setShowAdd] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [overrideFor, setOverrideFor] = useState(null);
  const [overrideForm, setOverrideForm] = useState({ requestedPct: '', reason: '' });

  const defForm = (type='OffPlan') => ({
    type, lead:'', leadName:'', project:'', developer:'', propertyId:'',
    value:'', commission: 2, owner: personaOwnerName(personaKey) || 'Fatma Ibrahim',
    team: h.team || 'Alpha',
    stage: type === 'Resale' ? 'Lead Qualified' : 'Lead Qualified',
    reservationDeposit: 0, paymentPlan: '',
    offerPrice: 0, paymentMethod: 'Cash',
    status: 'Active',
  });
  const [form, setForm] = useState(defForm('OffPlan'));

  const deals = useMemo(() => dealsAll.filter(d => d.type === pipeline), [dealsAll, pipeline]);
  const stages = pipeline === 'Resale' ? DEAL_STAGES_RESALE : DEAL_STAGES_OFFPLAN;

  const grouped = useMemo(() => {
    const g = {};
    stages.forEach(s => g[s] = []);
    deals.forEach(d => { if (g[d.stage]) g[d.stage].push(d); });
    return g;
  }, [deals, stages]);

  const totalPipeline = dealsAll.filter(d => d.status === 'Active').reduce((s,d) => s + (d.value||0), 0);
  const pendingOverrides = dealsAll.filter(d => d.commissionOverride?.status === 'Pending');
  const revenueRecognised = dealsAll.filter(d => d.revenueRecognised).reduce((s,d) => s + ((d.value||0) * (d.commission||0) / 100), 0);
  const homesAdvanceEligible = dealsAll.filter(d => d.homesAdvanceAvailable && !d.revenueRecognised).length;

  const openAdd = (type) => { setForm(defForm(type)); setEditDeal(null); setShowAdd(true); };
  const openEdit = (d) => {
    setForm({
      type: d.type || 'OffPlan',
      lead: d.lead || '', leadName: d.leadName || d.lead || '', project: d.project || '', developer: d.developer || '',
      propertyId: d.propertyId || '', value: d.value || '', commission: d.commission || 2, owner: d.owner || '',
      team: d.team || 'Alpha',
      stage: d.stage || 'Lead Qualified',
      reservationDeposit: d.reservationDeposit || 0, paymentPlan: d.paymentPlan || '',
      offerPrice: d.offerPrice || 0, paymentMethod: d.paymentMethod || 'Cash',
      status: d.status || 'Active',
    });
    setEditDeal(d);
    setShowAdd(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.leadName.trim()) { toast('Lead name is required','error'); return; }
    if (!form.project.trim())  { toast('Project is required','error'); return; }
    const payload = {
      ...form,
      value: Number(form.value) || 0,
      commission: Number(form.commission) || 0,
      reservationDeposit: Number(form.reservationDeposit) || 0,
      offerPrice: Number(form.offerPrice) || 0,
    };
    if (editDeal) {
      updateItem('deals', editDeal.id, payload, { action: 'Deal Updated', module: 'CRM', target: editDeal.id });
      toast('Deal updated','success');
    } else {
      // Apply lifecycle defaults — new deals at "Lead Qualified" don't yet
      // have commission locked or revenue recognised.
      addItem('deals', {
        ...payload,
        commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false,
        collectionPercent: 0, attachments: [],
        created: new Date().toISOString().slice(0,10),
      }, 'D', { action: 'Deal Created', module: 'CRM', detail: `${payload.type} · ${payload.leadName}` });
      toast('Deal created','success');
    }
    setShowAdd(false);
  };
  const handleDel = (id) => { removeItem('deals', id, { action: 'Deal Deleted', module: 'CRM', target: id }); toast('Deal deleted','success'); };

  // Stage transition with lifecycle side-effects.
  const moveStage = (d, newStage) => {
    const patch = lifecyclePatch(d, newStage);
    updateItem('deals', d.id, patch, { action: 'Deal Stage Changed', module: 'CRM', target: d.id, detail: `${d.stage} → ${newStage}` });
    if (patch.commissionLocked && !d.commissionLocked) {
      toast(`Commission locked at ${d.commission}% — Contract Signed`, 'success');
    } else if (patch.homesAdvanceAvailable && !d.homesAdvanceAvailable) {
      toast(`Homes Advance now available for this deal`, 'info');
    } else if (patch.revenueRecognised && !d.revenueRecognised) {
      toast(`Revenue recognised · EGP ${fmt(d.value * d.commission / 100)} commission`, 'success');
    } else {
      toast(`Moved to ${newStage}`, 'success');
    }
  };

  // Attachments — demo only (no real upload).
  const addAttachment = (d) => {
    const name = window.prompt('Attachment file name (demo):', 'SPA_draft.pdf');
    if (!name) return;
    const att = { id: `ATT-${String(Math.floor(Math.random()*900)+100)}`, name, size: '—', uploadedAt: new Date().toISOString().slice(0,10) };
    updateItem('deals', d.id, { attachments: [...(d.attachments || []), att] }, { action: 'Deal Attachment', module: 'CRM', target: d.id, detail: name });
    toast(`Attached ${name}`,'success');
  };
  const removeAttachment = (d, attId) => {
    updateItem('deals', d.id, { attachments: (d.attachments || []).filter(a => a.id !== attId) }, { action: 'Deal Attachment Removed', module: 'CRM', target: d.id });
    toast(`Attachment removed`,'info');
  };

  // Commission override flow (BRD §6.2.4).
  const openOverride = (d) => { setOverrideFor(d); setOverrideForm({ requestedPct: '', reason: '' }); };
  const submitOverride = () => {
    const requestedPct = Number(overrideForm.requestedPct);
    if (!requestedPct || requestedPct <= overrideFor.commission) { toast('Override must be higher than current commission','error'); return; }
    if (!overrideForm.reason.trim()) { toast('Reason required','error'); return; }
    const delta = requestedPct - overrideFor.commission;
    const approver = overrideApprover(delta);
    updateItem('deals', overrideFor.id, {
      commissionOverride: { requestedPct, currentPct: overrideFor.commission, delta: Number(delta.toFixed(2)), reason: overrideForm.reason, requestedBy: persona.label, requestedAt: new Date().toISOString(), approver, status: 'Pending' },
    });
    writeAudit('Commission Override Requested', `${overrideFor.id}: ${overrideFor.commission}% → ${requestedPct}% (Δ ${delta.toFixed(2)}%)`, 'CRM', `Routed to ${approver}`);
    toast(`Override submitted — pending ${approver} approval`,'success');
    setOverrideFor(null);
  };
  const approveOverride = (d, decision) => {
    if (!personaCanApprove(personaKey, d.commissionOverride.approver)) { toast(`Only ${d.commissionOverride.approver} can ${decision} this override`,'error'); return; }
    if (decision === 'approve') {
      updateItem('deals', d.id, {
        commission: d.commissionOverride.requestedPct,
        commissionOverride: { ...d.commissionOverride, status: 'Approved', decidedBy: persona.label, decidedAt: new Date().toISOString() },
      });
      writeAudit('Commission Override Approved', `${d.id}: ${d.commissionOverride.currentPct}% → ${d.commissionOverride.requestedPct}%`, 'CRM', `By ${persona.label}`);
      toast('Override approved & applied','success');
    } else {
      updateItem('deals', d.id, { commissionOverride: { ...d.commissionOverride, status: 'Rejected', decidedBy: persona.label, decidedAt: new Date().toISOString() } });
      writeAudit('Commission Override Rejected', d.id, 'CRM', `By ${persona.label}`);
      toast('Override rejected','info');
    }
  };

  // Lookups
  const listingFor = (id) => listings.find(l => l.id === id);

  const viewDetail = (d) => {
    const list = listingFor(d.propertyId);
    const stageList = stagesForDealType(d.type);
    openDrawer({
      title: `${d.leadName || d.lead || 'Deal'} · ${d.project}`,
      subtitle: `${d.type} · ${d.id}`,
      content: (
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          {/* Hero */}
          <div style={{padding:14,background:'#fafbfc',borderRadius:10,border:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:14}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>{d.type} Pipeline</div>
              <span className="badge" style={{background:`${stageColor(d.stage)}20`,color:stageColor(d.stage),marginTop:6}}>{d.stage}</span>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>Value</div>
              <div style={{fontSize:18,fontWeight:800,color:'var(--brand)'}}>EGP {fmt(d.value)}</div>
            </div>
          </div>

          {/* Core facts */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {[
              ['Lead', d.leadName || d.lead || '—'],
              ['Project', d.project],
              ['Developer', d.developer],
              ['Owner', d.owner],
              ['Team', d.team || '—'],
              ['Commission', `${d.commission}% ${d.commissionLocked ? '· LOCKED 🔒' : ''}`],
              ['Est. Commission', `EGP ${fmt((d.value || 0) * (d.commission || 0) / 100)}`],
              ['Created', d.created || '—'],
            ].map(([k,v])=>(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>))}
            <div><div className="drawer-label">Status</div><span className={`badge ${d.status==='Active'?'badge-success':d.status==='Closed Won'?'badge-info':'badge-danger'}`}>{d.status}</span></div>
          </div>

          {/* Linked Property */}
          <div style={{padding:14,background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <Home size={14} color="var(--brand)"/>
              <div style={{fontSize:12,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>Linked Property</div>
            </div>
            {list ? (
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                {list.image && <div style={{width:64,height:64,borderRadius:8,backgroundImage:`url(${list.image})`,backgroundSize:'cover',backgroundPosition:'center'}}/>}
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>{list.project} · {list.unitCode}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>{list.unitType} · {list.bedrooms}BD · {list.area}m² · EGP {fmt(list.price)}</div>
                </div>
              </div>
            ) : (
              <div style={{fontSize:12,color:'var(--text-tertiary)'}}>No property linked. {!readOnly && 'Edit deal to set a propertyId from Listings.'}</div>
            )}
          </div>

          {/* Pipeline-specific fields */}
          {d.type === 'OffPlan' && (
            <div style={{padding:14,background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Off Plan — Payment & Collection</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {[
                  ['Reservation Deposit', d.reservationDeposit ? `EGP ${fmt(d.reservationDeposit)}` : '—'],
                  ['Payment Plan', d.paymentPlan || '—'],
                  ['Developer Collection', d.collectionPercent ? `${d.collectionPercent}%` : '0%'],
                  ['Homes Advance', d.homesAdvanceAvailable ? '✅ Available' : '—'],
                  ['Revenue Recognised', d.revenueRecognised ? '✅ Recognised' : '—'],
                ].map(([k,v]) => <div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>)}
              </div>
              {d.homesAdvanceAvailable && !d.revenueRecognised && (
                <div style={{marginTop:10,padding:'10px 12px',background:'#dbeafe',color:'#1e40af',fontSize:12,borderRadius:6,display:'flex',alignItems:'center',gap:8}}>
                  <Sparkles size={14}/> Homes Advance can be requested at this stage.
                </div>
              )}
            </div>
          )}

          {d.type === 'Resale' && (
            <div style={{padding:14,background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Resale — Offer & Payment</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {[
                  ['Offer Price', d.offerPrice ? `EGP ${fmt(d.offerPrice)}` : '—'],
                  ['Payment Method', d.paymentMethod || '—'],
                  ['Revenue Recognised', d.revenueRecognised ? '✅ Recognised on contract' : '—'],
                ].map(([k,v]) => <div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>)}
              </div>
            </div>
          )}

          {/* Attachments */}
          <div style={{padding:14,background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <Paperclip size={14} color="var(--brand)"/>
                <div style={{fontSize:12,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>Attachments ({(d.attachments||[]).length})</div>
              </div>
              {!readOnly && <button className="btn btn-sm btn-outline" onClick={()=>addAttachment(d)}><Plus size={12}/> Add</button>}
            </div>
            {(d.attachments || []).length === 0 ? (
              <div style={{fontSize:12,color:'var(--text-tertiary)'}}>No attachments yet.</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {d.attachments.map(a => (
                  <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 10px',background:'#fafbfc',borderRadius:6,fontSize:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
                      <Paperclip size={12} color="var(--text-tertiary)"/>
                      <span style={{fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.name}</span>
                      <span style={{color:'var(--text-tertiary)',fontSize:11}}>· {a.size} · {a.uploadedAt}</span>
                    </div>
                    {!readOnly && <button className="btn-icon" onClick={()=>removeAttachment(d,a.id)} title="Remove" style={{color:'var(--danger)'}}><X size={12}/></button>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Commission override panel */}
          {d.commissionOverride && (
            <div style={{padding:14,background:d.commissionOverride.status==='Pending'?'#fef3c7':d.commissionOverride.status==='Approved'?'#dcfce7':'#fee2e2',border:`1px solid ${d.commissionOverride.status==='Pending'?'#fcd34d':d.commissionOverride.status==='Approved'?'#86efac':'#fca5a5'}`,borderRadius:10}}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>Commission Override · {d.commissionOverride.status}</div>
              <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>
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

          {/* Stage transitions */}
          <div style={{borderTop:'1px solid var(--border)',paddingTop:14}}>
            <div className="drawer-label" style={{marginBottom:8}}>Move to Stage</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {stageList.filter(s => s !== d.stage).map(s => (
                <button key={s} className="btn btn-sm btn-outline" onClick={()=>moveStage(d,s)} style={{fontSize:11}}>{s}</button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {!readOnly && <button className="btn btn-sm btn-brand" onClick={()=>openEdit(d)}><Edit size={13}/> Edit</button>}
            {!readOnly && !d.commissionLocked && (!d.commissionOverride || d.commissionOverride.status === 'Rejected') && <button className="btn btn-sm btn-outline" onClick={()=>openOverride(d)}><Percent size={13}/> Request commission override</button>}
            {!readOnly && <button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>handleDel(d.id)}><Trash2 size={13}/> Delete</button>}
          </div>
        </div>
      ),
    });
  };

  const roleScopeLabel = h.scope === 'self' ? 'Own deals only' : h.scope === 'team' ? `Team ${h.team}` : h.scope === 'cross' ? `Teams ${h.teams?.join(' + ')}` : h.scope === 'all' ? 'All teams (full hierarchy)' : h.scope === 'audit' ? 'Audit-only (read)' : 'No access';

  return (
    <div className="crm-page">
      <div className="page-header">
        <h1 className="page-title">Deals Pipeline</h1>
        <p className="page-subtitle">Off Plan and Resale pipelines from <b>Deal Stages.docx</b>. Total active pipeline: <strong>EGP {fmt(totalPipeline)}</strong> · Revenue recognised this period: <strong>EGP {fmt(revenueRecognised)}</strong>.</p>
      </div>

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
          <div><div className="num">{dealsAll.length}</div><div className="lbl">Visible</div></div>
          <div><div className="num">{pendingOverrides.length}</div><div className="lbl">Override pending</div></div>
          <div><div className="num">{homesAdvanceEligible}</div><div className="lbl">Homes Advance ready</div></div>
        </div>
      </div>

      {/* Pipeline tabs */}
      <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
        {['OffPlan','Resale'].map(p => (
          <button
            key={p}
            onClick={()=>setPipeline(p)}
            style={{
              padding:'9px 18px',borderRadius:8,cursor:'pointer',
              border: pipeline === p ? '1px solid var(--brand)' : '1px solid var(--border)',
              background: pipeline === p ? 'var(--brand)' : '#fff',
              color: pipeline === p ? '#fff' : 'var(--text-primary)',
              fontWeight:700,fontSize:13,
            }}
          >
            {p === 'OffPlan' ? 'Off Plan' : 'Resale'} <span style={{marginLeft:6,fontSize:11,opacity:.8}}>({dealsAll.filter(d=>d.type===p).length})</span>
          </button>
        ))}
        <div style={{display:'flex',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden',marginLeft:'auto'}}>
          <button className={`btn btn-sm ${view==='kanban'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('kanban')}><LayoutGrid size={14}/> Board</button>
          <button className={`btn btn-sm ${view==='table'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('table')}><List size={14}/> Table</button>
        </div>
        {pendingOverrides.length > 0 && (
          <button className="btn btn-sm btn-outline" onClick={()=>openDrawer({ title: 'Pending Commission Overrides', subtitle: `${pendingOverrides.length} awaiting approval`, content: (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {pendingOverrides.map(d => (
                <div key={d.id} style={{padding:12,border:'1px solid var(--border)',borderRadius:10}}>
                  <div style={{fontWeight:700,fontSize:13}}>{d.leadName || d.lead} · {d.project}</div>
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
        {!readOnly && <button className="btn btn-brand" onClick={()=>openAdd(pipeline)}><Plus size={16}/> Add {pipeline === 'OffPlan' ? 'Off Plan' : 'Resale'} Deal</button>}
      </div>

      {/* Kanban / Table */}
      {view === 'kanban' ? (
        <div className="crm-kanban" style={{gridTemplateColumns:`repeat(${stages.length},minmax(220px,1fr))`}}>
          {stages.map(stage => (
            <div className="crm-kanban-column" key={stage}>
              <div className="crm-kanban-header">
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:stageColor(stage)}}/>
                  <span style={{fontWeight:700,fontSize:12}}>{stage}</span>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',background:'#f4f7fe',padding:'2px 8px',borderRadius:10}}>{grouped[stage].length}</span>
              </div>
              <div className="crm-kanban-cards">
                {grouped[stage].length === 0 ? <div style={{padding:'24px 0',textAlign:'center',fontSize:12,color:'var(--text-tertiary)'}}>No deals</div> :
                  grouped[stage].map(d => (
                    <div className="crm-kanban-card" key={d.id} onClick={()=>viewDetail(d)}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                        <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.leadName || d.lead || '—'}</div>
                        <GripVertical size={14} style={{color:'var(--text-tertiary)',flexShrink:0}}/>
                      </div>
                      <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:8,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.project} · {d.developer}</div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <span style={{fontSize:14,fontWeight:800,color:'var(--brand)'}}>EGP {fmt(d.value)}</span>
                        <span style={{fontSize:11,color:'var(--text-tertiary)'}}>{d.owner}</span>
                      </div>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {d.commissionLocked && <span style={{fontSize:10,fontWeight:700,color:'#475569',background:'#e2e8f0',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><Lock size={9}/> Locked</span>}
                        {d.homesAdvanceAvailable && !d.revenueRecognised && <span style={{fontSize:10,fontWeight:700,color:'#1e40af',background:'#dbeafe',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><Sparkles size={9}/> Advance</span>}
                        {d.revenueRecognised && <span style={{fontSize:10,fontWeight:700,color:'#166534',background:'#dcfce7',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><CheckCircle2 size={9}/> Revenue</span>}
                        {(d.attachments || []).length > 0 && <span style={{fontSize:10,fontWeight:700,color:'#64748b',background:'#f1f5f9',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><Paperclip size={9}/> {d.attachments.length}</span>}
                        {d.commissionOverride?.status === 'Pending' && <span style={{fontSize:10,fontWeight:700,color:'#92400e',background:'#fef3c7',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><Percent size={9}/> Override</span>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Type</th><th>Lead</th><th>Project</th><th>Value</th><th>Stage</th><th>Comm.</th><th>Flags</th><th>Owner</th><th>Actions</th></tr></thead>
          <tbody>{deals.length === 0 ? <tr><td colSpan={10} style={{textAlign:'center',padding:40,color:'var(--text-tertiary)'}}>No deals match your filters or visibility scope.</td></tr> : deals.map(d=>(
            <tr key={d.id}>
              <td className="muted" style={{fontSize:11}}>{d.id}</td>
              <td>{d.type === 'OffPlan' ? 'Off Plan' : 'Resale'}</td>
              <td className="bold clickable" onClick={()=>viewDetail(d)}>{d.leadName || d.lead}</td>
              <td className="muted">{d.project}</td>
              <td className="bold">EGP {fmt(d.value)}</td>
              <td><span className="badge" style={{background:`${stageColor(d.stage)}20`,color:stageColor(d.stage)}}>{d.stage}</span></td>
              <td className="muted">{d.commission}%{d.commissionLocked && ' 🔒'}</td>
              <td>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {d.homesAdvanceAvailable && <span style={{fontSize:10,color:'#1e40af',fontWeight:700}}>ADV</span>}
                  {d.revenueRecognised && <span style={{fontSize:10,color:'#166534',fontWeight:700}}>REV</span>}
                  {(d.attachments || []).length > 0 && <span style={{fontSize:10,color:'#64748b',fontWeight:700}}>{d.attachments.length}📎</span>}
                </div>
              </td>
              <td className="muted">{d.owner}</td>
              <td>
                <div style={{display:'flex',gap:4}}>
                  <button className="btn-icon" onClick={()=>viewDetail(d)} title="View"><Eye size={14}/></button>
                  {!readOnly && <button className="btn-icon" onClick={()=>openEdit(d)} title="Edit"><Edit size={14}/></button>}
                  {!readOnly && !d.commissionLocked && <button className="btn-icon" onClick={()=>openOverride(d)} title="Commission override"><Percent size={14}/></button>}
                  {!readOnly && <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDel(d.id)} title="Delete"><Trash2 size={14}/></button>}
                </div>
              </td>
            </tr>
          ))}</tbody></table></div></div>
      )}

      {/* ─── Add / Edit modal ─── */}
      {showAdd && <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>
          <div className="modal-header"><h3>{editDeal?'Edit Deal':'Add New Deal'}</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div className="form-group" style={{gridColumn:'span 2'}}>
                <label>Pipeline Type *</label>
                <div style={{display:'flex',gap:8}}>
                  {['OffPlan','Resale'].map(t => (
                    <button
                      key={t} type="button"
                      onClick={()=>setForm({...form, type: t, stage: 'Lead Qualified'})}
                      style={{
                        flex:1,padding:'10px 14px',borderRadius:8,cursor:'pointer',
                        border: form.type === t ? '1px solid var(--brand)' : '1px solid var(--border)',
                        background: form.type === t ? 'var(--brand-tint)' : '#fff',
                        color: form.type === t ? 'var(--brand)' : 'var(--text-primary)',
                        fontWeight:700,fontSize:13,
                      }}
                    >{t === 'OffPlan' ? 'Off Plan' : 'Resale'}</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Lead Name *</label><input type="text" value={form.leadName} onChange={e=>setForm({...form,leadName:e.target.value})} required/></div>
              <div className="form-group"><label>Project *</label><input type="text" value={form.project} onChange={e=>setForm({...form,project:e.target.value})} required/></div>
              <div className="form-group"><label>Developer</label><input type="text" value={form.developer} onChange={e=>setForm({...form,developer:e.target.value})}/></div>
              <div className="form-group"><label>Linked Property (Listing ID)</label>
                <select value={form.propertyId} onChange={e=>setForm({...form,propertyId:e.target.value})}>
                  <option value="">— None —</option>
                  {listings.map(l => <option key={l.id} value={l.id}>{l.id} · {l.project} {l.unitCode}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Value (EGP)</label><input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/></div>
              <div className="form-group"><label>Commission %</label><input type="number" value={form.commission} onChange={e=>setForm({...form,commission:e.target.value})} step="0.1"/></div>
              <div className="form-group"><label>Stage</label>
                <select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>
                  {stagesForDealType(form.type).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Owner</label><input type="text" value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})}/></div>

              {/* Type-specific fields */}
              {form.type === 'OffPlan' && (
                <>
                  <div className="form-group" style={{gridColumn:'span 2',borderTop:'1px solid var(--border)',paddingTop:14,marginTop:4}}>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Off Plan — Payment</div>
                  </div>
                  <div className="form-group"><label>Reservation Deposit (EGP)</label><input type="number" value={form.reservationDeposit} onChange={e=>setForm({...form,reservationDeposit:e.target.value})}/></div>
                  <div className="form-group"><label>Payment Plan</label><input type="text" value={form.paymentPlan} onChange={e=>setForm({...form,paymentPlan:e.target.value})} placeholder="e.g. 10% down · 8y installments"/></div>
                </>
              )}
              {form.type === 'Resale' && (
                <>
                  <div className="form-group" style={{gridColumn:'span 2',borderTop:'1px solid var(--border)',paddingTop:14,marginTop:4}}>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Resale — Offer</div>
                  </div>
                  <div className="form-group"><label>Offer Price (EGP)</label><input type="number" value={form.offerPrice} onChange={e=>setForm({...form,offerPrice:e.target.value})}/></div>
                  <div className="form-group"><label>Payment Method</label>
                    <select value={form.paymentMethod} onChange={e=>setForm({...form,paymentMethod:e.target.value})}>
                      <option>Cash</option>
                      <option>Mortgage</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-brand">{editDeal?'Save changes':'Create deal'}</button>
            </div>
          </form>
        </div>
      </div>}

      {/* ─── Override modal ─── */}
      {overrideFor && <div className="modal-overlay" onClick={()=>setOverrideFor(null)}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
          <div className="modal-header"><h3>Request Commission Override</h3><button className="btn-icon" onClick={()=>setOverrideFor(null)}><X size={18}/></button></div>
          <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,fontSize:12}}>
              <b>Current:</b> {overrideFor.commission}% · <b>Δ routing:</b> ≤ 0.5% → TL · ≤ 1.0% → Manager · &gt; 1.0% → Director
            </div>
            <div className="form-group"><label>Requested commission %</label><input type="number" step="0.1" value={overrideForm.requestedPct} onChange={e=>setOverrideForm({...overrideForm,requestedPct:e.target.value})}/></div>
            <div className="form-group"><label>Reason</label><textarea rows={3} value={overrideForm.reason} onChange={e=>setOverrideForm({...overrideForm,reason:e.target.value})} placeholder="Business justification (developer incentive, special launch, etc.)"/></div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={()=>setOverrideFor(null)}>Cancel</button>
            <button className="btn btn-brand" onClick={submitOverride}>Submit override request</button>
          </div>
        </div>
      </div>}
    </div>
  );
};
