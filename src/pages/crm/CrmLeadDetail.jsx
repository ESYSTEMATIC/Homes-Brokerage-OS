import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STAGES } from '../../data/staticData';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Phone, Mail, MapPin, Edit, UserPlus, Calendar, Share2, FileText, AlertTriangle, CheckCircle, Clock, User, Home, Target, MessageSquare, ChevronRight, Star, X, ShieldCheck, Lock } from 'lucide-react';
import { HIERARCHY, canSeeLead, canAssign, isReadOnly, isManualLockActive, leadAgeDays, slaForStage } from '../../data/crmAccess';

const fmt = n => new Intl.NumberFormat('en-EG').format(n);
const priorityColor = p => p==='Hot'?'badge-danger':p==='Warm'?'badge-warning':'badge-info';

export const CrmLeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, addItem, updateItem, toast, persona, personaKey, writeAudit, closeDrawer } = useApp();
  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };
  const readOnly = isReadOnly(personaKey);
  const [tab, setTab] = useState('overview');
  const [showReassign, setShowReassign] = useState(false);
  const [showTourAdd, setShowTourAdd] = useState(false);
  const [showPrefAdd, setShowPrefAdd] = useState(false);
  // Edit Preferences modal — opens with the existing prefs row pre-loaded.
  // Saving drops `inferred: true` and stamps `confirmedBy / confirmedAt` so
  // the system knows the agent has confirmed the campaign-inferred values.
  const [showPrefEdit, setShowPrefEdit] = useState(false);
  const [prefEditForm, setPrefEditForm] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showActivityAdd, setShowActivityAdd] = useState(false);
  // Triggered when a lead's stage transitions to "Qualified" — business team
  // ask 08-May: auto-prompt to create a Deal at that moment.
  const [createDealPrompt, setCreateDealPrompt] = useState(null); // null | { type }
  const [createDealType, setCreateDealType] = useState('OffPlan');

  const { leads=[], deals=[], tasks=[], tours=[], listingShares=[], buyerPreferences=[], sourceHistory=[], duplicateCandidates=[], assignmentLog=[], activities=[], staff=[], projects=[] } = state;

  const lead = leads.find(l => l.id === id);
  if (!lead) return <div style={{padding:40,textAlign:'center'}}><h2>Lead not found</h2><button className="btn btn-brand" onClick={()=>navigate('/system/crm/leads')}>Back to Leads</button></div>;

  // Role visibility — if the current persona can't see this lead per BRD §11
  // (e.g. an agent opening another agent's lead by URL), block render.
  if (!canSeeLead(personaKey, lead)) return (
    <div style={{padding:40,textAlign:'center'}}>
      <h2>Access denied</h2>
      <p style={{color:'var(--text-secondary)',marginTop:6}}>This lead falls outside your visibility scope ({h.role}).</p>
      <button className="btn btn-brand" style={{marginTop:14}} onClick={()=>navigate('/system/crm/leads')}>Back to Leads</button>
    </div>
  );

  const canReassignThis = canAssign(personaKey, lead);
  const locked = isManualLockActive(lead);
  const age = leadAgeDays(lead.created);
  const sla = slaForStage(lead.stage, age);

  const prefs = buyerPreferences.find(p => p.leadId === id);
  // Who can edit Buyer Preferences:
  //   - The lead owner (the agent working it).
  //   - The Team Leader / Sales Manager / Sales Director above them.
  //   - Backoffice / System Admins for data-fixes (mutate rights).
  // Audit-only personas (Executive / Finance) see it read-only.
  const canEditPrefs = !readOnly && (
    lead.owner === persona.label ||
    h.scope === 'team' || h.scope === 'cross' || h.scope === 'all' ||
    personaKey === 'backofficeAdmin' || personaKey === 'systemAdmin'
  );

  // Open the Edit Preferences modal with the current row pre-loaded.
  // Multi-value fields (propertyTypes / locations / amenities / preferredDevelopers)
  // are joined with ', ' for an easy text input; we split on submit.
  const openEditPrefs = () => {
    if (!prefs) return;
    setPrefEditForm({
      propertyTypes: (prefs.propertyTypes || []).join(', '),
      locations:     (prefs.locations || []).join(', '),
      bedrooms:      prefs.bedrooms || '',
      bathrooms:     prefs.bathrooms || '',
      budgetMin:     prefs.budgetMin || '',
      budgetMax:     prefs.budgetMax || '',
      preferredDevelopers: (prefs.preferredDevelopers || []).join(', '),
      amenities:     (prefs.amenities || []).join(', '),
      timeline:      prefs.timeline || '',
      notes:         prefs.notes || '',
    });
    closeDrawer();
    setShowPrefEdit(true);
  };

  // Save the edited preferences. Drops `inferred:true` because once the
  // agent has touched the values they're no longer inferred — they're
  // captured. Audit-log records the changed field list.
  const submitEditPrefs = () => {
    if (!prefs || !prefEditForm) return;
    const splitCsv = s => (s || '').split(',').map(x => x.trim()).filter(Boolean);
    const patch = {
      propertyTypes:       splitCsv(prefEditForm.propertyTypes),
      locations:           splitCsv(prefEditForm.locations),
      bedrooms:            prefEditForm.bedrooms ? Number(prefEditForm.bedrooms) : null,
      bathrooms:           prefEditForm.bathrooms ? Number(prefEditForm.bathrooms) : null,
      budgetMin:           prefEditForm.budgetMin ? Number(prefEditForm.budgetMin) : 0,
      budgetMax:           prefEditForm.budgetMax ? Number(prefEditForm.budgetMax) : 0,
      preferredDevelopers: splitCsv(prefEditForm.preferredDevelopers),
      amenities:           splitCsv(prefEditForm.amenities),
      timeline:            prefEditForm.timeline,
      notes:               prefEditForm.notes,
      inferred:            false,
      confirmedBy:         persona.label,
      confirmedAt:         new Date().toISOString(),
    };
    // Compute changed field list for the audit detail.
    const changed = Object.keys(patch).filter(k => {
      if (k === 'inferred' || k === 'confirmedBy' || k === 'confirmedAt') return false;
      const before = prefs[k];
      const after  = patch[k];
      if (Array.isArray(before) && Array.isArray(after)) return before.join(',') !== after.join(',');
      return (before ?? '') !== (after ?? '');
    });
    updateItem('buyerPreferences', prefs.id, patch);
    writeAudit('CRM Buyer Preferences Updated', `${lead.name} (${lead.id})`, 'CRM', `By ${persona.label} · changed: ${changed.length ? changed.join(', ') : 'confirmed-as-is'}${prefs.inferred ? ' · was inferred from ' + (prefs.inferredFrom || 'campaign') : ''}`);
    toast(prefs.inferred ? 'Preferences confirmed & refined' : 'Preferences updated', 'success');
    setShowPrefEdit(false);
  };

  // One-click "Confirm as-is" — flips `inferred: false` without touching
  // any other field. Useful when the campaign signal was already accurate
  // and the agent just wants to mark it as confirmed on the call.
  const confirmPrefsAsIs = () => {
    if (!prefs || !prefs.inferred) return;
    updateItem('buyerPreferences', prefs.id, { inferred: false, confirmedBy: persona.label, confirmedAt: new Date().toISOString() });
    writeAudit('CRM Buyer Preferences Confirmed', `${lead.name} (${lead.id})`, 'CRM', `By ${persona.label} · confirmed as-is · was inferred from ${prefs.inferredFrom || 'campaign'}`);
    toast('Preferences confirmed as-is', 'success');
  };

  const sourceHist = sourceHistory.find(s => s.leadId === id);
  const duplicates = duplicateCandidates.filter(d => d.leadId === id);
  const assignments = assignmentLog.filter(a => a.leadId === id);
  const linkedActivities = activities.filter(a => a.leadId === id);
  const linkedDeals = deals.filter(d => d.leadName === lead.name);
  const linkedTasks = tasks.filter(t => t.lead === id);
  const linkedTours = tours.filter(t => t.leadId === id || t.leadName === lead.name);
  const linkedShares = listingShares.filter(s => s.leadId === id || s.leadName === lead.name);
  // Contracts module retired — contract status lives on the Deal directly
  // (commissionLocked flag at Contract Signed stage; revenueRecognised at
  // Standard Collection / Contract Signed & Payment).

  // Nurturing is an alternate (off-funnel) state — show no progress fill so
  // the linear funnel reads as "paused" rather than "completed".
  const stageIdx = lead.stage === 'Nurturing' ? -1 : STAGES.indexOf(lead.stage);

  // Forms
  const [reassignForm, setReassignForm] = useState({toAgent:'Ahmed Hassan', reason:'Territory reassignment'});
  const [tourForm, setTourForm] = useState({property:'', date:'', time:'', agent:'Fatma Ibrahim'});
  const [prefForm, setPrefForm] = useState({propertyTypes:'Apartment', locations:'New Cairo', bedrooms:'3', bathrooms:'2', budgetMin:'5000000', budgetMax:'10000000', timeline:'Within 3 months', notes:''});
  const [editForm, setEditForm] = useState({name:lead.name, phone:lead.phone||'', email:lead.email||'', stage:lead.stage, priority:lead.priority, budget:lead.budget||''});
  // 11-May stakeholder ask: agents should log a structured Action (not just a
  // free-form Note). The Action auto-generates a Note row for the timeline.
  // Visibility is two-tier: 'communication' (everyone on team sees) vs
  // 'private' (Lead Note — only the owner + TL/Manager/Director see it).
  const [activityForm, setActivityForm] = useState({
    action: 'Call Outcome',
    outcome: 'Interested',
    summary: '',
    note: '',
    visibility: 'communication',
  });

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
      </div>

      {/* Lead Header Card */}
      <div style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)',borderRadius:14,padding:'24px 32px',color:'#fff',marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',gap:24}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:800}}>{lead.name.split(' ').map(w=>w[0]).join('')}</div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              <h1 style={{fontSize:22,fontWeight:800,margin:0}}>{lead.name}</h1>
              <span className={`badge ${priorityColor(lead.priority)}`}>{lead.priority}</span>
              {lead.duplicate==='Review' && <span className="badge badge-warning"><AlertTriangle size={10}/> Duplicate Review</span>}
              <span className={`badge ${sla.level==='breach'?'badge-danger':sla.level==='warn'?'badge-warning':'badge-gray'}`} title={sla.message}>{age}d · {sla.level==='breach'?'SLA breach':sla.level==='warn'?'near SLA':'on track'}</span>
              {locked && <span className="badge badge-warning" title="Manual lead — 6-month protection"><Lock size={10}/> Locked {180-age}d</span>}
            </div>
            <div style={{display:'flex',gap:20,marginTop:8,fontSize:13,color:'rgba(255,255,255,.7)',flexWrap:'wrap',alignItems:'center'}}>
              <span style={{display:'flex',alignItems:'center',gap:4}}><Phone size={13}/>{lead.phone}</span>
              <span style={{display:'flex',alignItems:'center',gap:4}}><Mail size={13}/>{lead.email}</span>
              <span style={{display:'flex',alignItems:'center',gap:4}}><MapPin size={13}/>{lead.project}</span>
              {(() => {
                const ownerStaff = (state.staff || []).find(s => s.name === lead.owner);
                if (!lead.owner) return null;
                return (
                  <span style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',background:'rgba(255,255,255,.1)',borderRadius:999,fontSize:11}}>
                    {ownerStaff?.photoDataUrl ? (
                      <img src={ownerStaff.photoDataUrl} alt="" style={{width:20,height:20,borderRadius:'50%',objectFit:'cover'}}/>
                    ) : (
                      <div style={{width:20,height:20,borderRadius:'50%',background:'var(--brand)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700}}>
                        {lead.owner.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                    )}
                    Owner: <b style={{color:'#fff'}}>{lead.owner}</b>
                  </span>
                );
              })()}
            </div>
          </div>
          <div className="lead-hero-actions">
            {!readOnly && (
              <button className="btn btn-hero-ghost btn-sm" onClick={()=>{closeDrawer();setShowEdit(true);}}>
                <Edit size={14}/> Edit
              </button>
            )}
            {canReassignThis && (
              <button className="btn btn-hero-ghost btn-sm" onClick={()=>{closeDrawer();setShowReassign(true);}}>
                <UserPlus size={14}/> Reassign
              </button>
            )}
            {/* 11-May stakeholder ask: agents should park leads in Nurturing
                instead of closing them as Lost prematurely. Hidden when the
                lead is already closed or already in Nurturing. */}
            {!readOnly && !['Nurturing','Closed Won','Closed Lost'].includes(lead.stage) && (
              <button
                className="btn btn-hero-ghost btn-sm"
                onClick={() => {
                  const reason = window.prompt('Why is this lead being moved to Nurturing? (e.g., "budget too low right now", "buying after summer")');
                  if (!reason) return;
                  updateItem('leads', lead.id, { stage: 'Nurturing', notes: (lead.notes || '') + `\n[Nurturing] ${reason}` }, { action: 'Lead → Nurturing', module: 'CRM', target: lead.id, detail: reason });
                  toast(`${lead.name} moved to Nurturing — kept warm for re-engagement`, 'info');
                }}
              >
                <Star size={14}/> Move to Nurturing
              </button>
            )}
            {!readOnly && (
              <button className="btn btn-brand btn-sm" onClick={()=>{closeDrawer();setShowTourAdd(true);}} style={{boxShadow:'0 2px 8px rgba(232,103,42,0.35)'}}>
                <Calendar size={14}/> Schedule Tour
              </button>
            )}
            {readOnly && (
              <span className="badge badge-warning" style={{display:'inline-flex',alignItems:'center',gap:4}}>
                <ShieldCheck size={10}/> Audit-only
              </span>
            )}
          </div>
        </div>

        {/* Stage Progress — linear funnel, excludes alternate states. */}
        {lead.stage === 'Nurturing' && (
          <div style={{marginTop:16,padding:'10px 14px',background:'rgba(255,255,255,.1)',borderRadius:8,fontSize:12,color:'rgba(255,255,255,.9)',display:'flex',alignItems:'center',gap:10}}>
            <Star size={14}/> <span>Lead is in <b>Nurturing</b> — kept warm for re-engagement, SLA paused.</span>
          </div>
        )}
        <div style={{display:'flex',gap:3,marginTop:20}}>
          {STAGES.filter(s => s !== 'Closed Lost' && s !== 'Nurturing').map((s,i)=>(
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
          <>
            {/* 11-May ask: surface campaign inference so the agent knows
                these values came from the lead's source, not a phone call. */}
            {prefs.inferred && (
              <div style={{padding:'12px 16px',background:'var(--brand-tint)',border:'1px solid rgba(232,103,42,.25)',borderRadius:10,marginBottom:16,display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
                <div style={{width:36,height:36,borderRadius:10,background:'#fff',color:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,flexShrink:0}}>✨</div>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)'}}>Auto-filled from campaign signal · <i>{prefs.inferredFrom}</i></div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2,lineHeight:1.4}}>Locations and property types below came from the campaign this lead clicked through. Agent confirms and refines on first call.</div>
                </div>
                {canEditPrefs && (
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn btn-sm btn-brand" onClick={openEditPrefs}><Edit size={13}/> Refine on call</button>
                    <button className="btn btn-sm btn-outline" onClick={confirmPrefsAsIs} title="Mark these inferred values as confirmed without changing them">
                      <CheckCircle size={13}/> Confirm as-is
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Captured-by line — shows when an agent has confirmed/refined
                the preferences. Helps managers spot the agents who are
                actually doing the discovery call vs leaving inferred values. */}
            {!prefs.inferred && prefs.confirmedBy && (
              <div style={{padding:'8px 14px',background:'#f0fdf4',border:'1px solid #86efac',borderRadius:8,marginBottom:16,fontSize:11,color:'#166534',display:'flex',alignItems:'center',gap:8}}>
                <CheckCircle size={13}/>
                <span>Confirmed by <b>{prefs.confirmedBy}</b>{prefs.confirmedAt ? ` · ${prefs.confirmedAt.slice(0,10)}` : ''}{prefs.inferredFrom ? ` · originally inferred from ${prefs.inferredFrom}` : ''}</span>
              </div>
            )}
            {/* Edit button row when there's no inferred banner — keeps the
                action discoverable even after the agent has confirmed. */}
            {canEditPrefs && !prefs.inferred && (
              <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
                <button className="btn btn-sm btn-outline" onClick={openEditPrefs}><Edit size={13}/> Edit preferences</button>
              </div>
            )}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div className="data-panel" style={{padding:20}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
                Property Requirements
                {prefs.inferred && <span style={{fontSize:9,fontWeight:700,color:'var(--brand)',background:'var(--brand-tint)',padding:'2px 6px',borderRadius:4,letterSpacing:'.04em'}}>FROM CAMPAIGN</span>}
              </h3>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div><div className="drawer-label">Property Types</div><div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>{(prefs.propertyTypes || []).map(t=><span key={t} style={{padding:'4px 12px',background:'var(--brand-tint)',color:'var(--brand)',borderRadius:20,fontSize:11,fontWeight:600}}>{t}</span>)}</div></div>
                <div><div className="drawer-label">Preferred Locations</div><div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>{(prefs.locations || []).map(l=><span key={l} style={{padding:'4px 12px',background:'#eff6ff',color:'var(--info)',borderRadius:20,fontSize:11,fontWeight:600}}>{l}</span>)}</div></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <div><div className="drawer-label">Bedrooms</div><div className="drawer-value">{prefs.bedrooms || (prefs.inferred ? <i style={{color:'var(--text-tertiary)'}}>confirm on call</i> : '—')}</div></div>
                  <div><div className="drawer-label">Bathrooms</div><div className="drawer-value">{prefs.bathrooms || (prefs.inferred ? <i style={{color:'var(--text-tertiary)'}}>confirm on call</i> : '—')}</div></div>
                </div>
                <div><div className="drawer-label">Budget Range</div><div className="drawer-value">EGP {fmt(prefs.budgetMin)} — {fmt(prefs.budgetMax)}</div>
                  <div style={{height:6,background:'#e2e8f0',borderRadius:4,marginTop:6,overflow:'hidden'}}><div style={{width:'60%',height:'100%',background:'linear-gradient(90deg,var(--brand),#f59e0b)',borderRadius:4}}/></div>
                </div>
                <div><div className="drawer-label">Timeline</div><div className="drawer-value">{prefs.timeline || (prefs.inferred ? <i style={{color:'var(--text-tertiary)'}}>confirm on call</i> : '—')}</div></div>
              </div>
            </div>
            <div className="data-panel" style={{padding:20}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>Preferences</h3>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div><div className="drawer-label">Preferred Developers</div><div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>{(prefs.preferredDevelopers || []).map(d=><span key={d} style={{padding:'4px 12px',background:'#f0fdf4',color:'var(--success)',borderRadius:20,fontSize:11,fontWeight:600}}>{d}</span>)}{(!prefs.preferredDevelopers || prefs.preferredDevelopers.length===0) && prefs.inferred && <span style={{fontSize:12,color:'var(--text-tertiary)',fontStyle:'italic'}}>Confirm with the buyer on first call</span>}</div></div>
                <div><div className="drawer-label">Amenities</div><div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>{(prefs.amenities || []).map(a=><span key={a} style={{padding:'4px 12px',background:'#faf5ff',color:'#8b5cf6',borderRadius:20,fontSize:11,fontWeight:600}}>{a}</span>)}{(!prefs.amenities || prefs.amenities.length===0) && prefs.inferred && <span style={{fontSize:12,color:'var(--text-tertiary)',fontStyle:'italic'}}>To be captured during qualification call</span>}</div></div>
                <div><div className="drawer-label">Notes</div><div style={{fontSize:13,background:'#f8fafc',padding:14,borderRadius:10,border:'1px solid var(--border)',lineHeight:1.6,marginTop:4,whiteSpace:'pre-wrap'}}>{prefs.notes}</div></div>
              </div>
            </div>
          </div>
          </>
        ) : <div className="data-panel" style={{padding:40,textAlign:'center'}}><Home size={32} color="var(--text-tertiary)"/><p style={{color:'var(--text-secondary)',marginTop:12}}>No buyer preferences recorded yet</p><button className="btn btn-brand" onClick={()=>{closeDrawer();setShowPrefAdd(true);}}>Add Preferences</button></div>
      )}

      {/* Tab: Activity */}
      {tab==='activity'&&(() => {
        // 11-May: filter private Lead Notes — only the owner and managers/
        // directors/audit roles can see them. Communication notes are visible
        // to everyone with access to the lead.
        const canSeePrivate = lead.owner === persona.label || ['salesManager','salesDirector','backofficeAdmin','systemAdmin','executive'].includes(personaKey);
        const visibleActivities = linkedActivities.filter(a => a.visibility !== 'private' || canSeePrivate);
        return (
          <div className="data-panel" style={{padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h3 style={{fontSize:14,fontWeight:700}}>Activity Timeline</h3>
              <button className="btn btn-brand btn-sm" onClick={()=>{closeDrawer();setShowActivityAdd(true);}}>+ Log Action</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:0,position:'relative',paddingLeft:24}}>
              <div style={{position:'absolute',left:7,top:0,bottom:0,width:2,background:'var(--border)'}}/>
              {[...assignments.map(a=>({time:a.date,type:'assignment',detail:`${a.fromAgent?`Reassigned from ${a.fromAgent} to`:'Assigned to'} ${a.toAgent}`,sub:a.reason,visibility:'communication'})),
                ...linkedTours.map(t=>({time:`${t.date} ${t.time}`,type:'tour',detail:`Tour: ${t.property}`,sub:t.feedback||t.status,visibility:'communication'})),
                ...linkedShares.map(s=>({time:s.timestamp,type:'share',detail:`${s.channel} share: ${s.property}`,sub:`Response: ${s.response}`,visibility:'communication'})),
                ...visibleActivities.map(a=>({time:a.date,type:'activity',detail:`${a.type}: ${a.detail}`,sub:a.sub,visibility: a.visibility || 'communication',author: a.author})),
              ].sort((a,b)=>b.time.localeCompare(a.time)).map((ev,i)=>(
                <div key={i} style={{padding:'12px 0 12px 20px',position:'relative'}}>
                  <div style={{position:'absolute',left:-4,top:16,width:12,height:12,borderRadius:'50%',background: ev.visibility === 'private' ? '#92400e' : ev.type==='assignment'?'var(--brand)':ev.type==='tour'?'var(--info)':ev.type==='activity'?'var(--warning)':'var(--success)',border:'2px solid #fff'}}/>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
                    <span>{ev.time}</span>
                    {ev.author && <span>· {ev.author}</span>}
                    {ev.visibility === 'private' && <span style={{fontSize:9,fontWeight:700,padding:'2px 6px',background:'#fef3c7',color:'#92400e',borderRadius:4,letterSpacing:'.04em'}}>🔒 LEAD NOTE</span>}
                    {ev.visibility === 'communication' && ev.type === 'activity' && <span style={{fontSize:9,fontWeight:700,padding:'2px 6px',background:'#dbeafe',color:'#1e40af',borderRadius:4,letterSpacing:'.04em'}}>COMMUNICATION</span>}
                  </div>
                  <div style={{fontSize:13,fontWeight:600}}>{ev.detail}</div>
                  {ev.sub&&<div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2,whiteSpace:'pre-wrap'}}>{ev.sub}</div>}
                </div>
              ))}
              {linkedTours.length===0&&linkedShares.length===0&&assignments.length===0&&visibleActivities.length===0&&<div style={{padding:20,color:'var(--text-tertiary)'}}>No activity recorded yet</div>}
            </div>
          </div>
        );
      })()}

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
          {/* Contracts module retired — contract status surfaces directly on
              the linked Deal at "Contract Signed" / "Contract Signed & Payment". */}
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
                  <button className="btn btn-brand btn-sm" onClick={()=>{updateItem('duplicateCandidates',d.id,{status:'Merged'}); updateItem('leads',lead.id,{duplicate:'Merged',notes:(lead.notes||'')+'\nMerged with candidate '+d.matchedName}); toast('Duplicate merged','success');}}>Merge Records</button>
                  <button className="btn btn-outline btn-sm" onClick={()=>{updateItem('duplicateCandidates',d.id,{status:'Dismissed'}); toast('Duplicate candidate dismissed','success');}}>Dismiss</button>
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
          <div className="form-group"><label>Assign To</label><select value={reassignForm.toAgent} onChange={e=>setReassignForm({...reassignForm,toAgent:e.target.value})}>{staff.filter(s=>s.department==='Sales').map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</select></div>
          <div className="form-group"><label>Reason</label><select value={reassignForm.reason} onChange={e=>setReassignForm({...reassignForm,reason:e.target.value})}><option>Territory reassignment</option><option>Workload balancing</option><option>Specialization match</option><option>Manager override</option></select></div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowReassign(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{updateItem('leads',lead.id,{owner:reassignForm.toAgent}); addItem('assignmentLog',{leadId:lead.id,fromAgent:lead.owner,toAgent:reassignForm.toAgent,date:new Date().toISOString().split('T')[0],reason:reassignForm.reason,approver:'System'},'ASG'); toast('Lead reassigned','success');setShowReassign(false);}}>Reassign</button></div></div></div>}

      {/* Schedule Tour Modal */}
      {showTourAdd&&<div className="modal-overlay" onClick={()=>setShowTourAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}><div className="modal-header"><h3>Schedule Tour</h3><button className="btn-icon" onClick={()=>setShowTourAdd(false)}><X size={18}/></button></div>
        <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="form-group"><label>Lead</label><input type="text" value={lead.name} disabled/></div>
          <div className="form-group"><label>Listing</label><select value={tourForm.property} onChange={e=>setTourForm({...tourForm,property:e.target.value})}><option value="">Select Listing…</option>{projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
          <div className="form-group"><label>Date</label><input type="date" value={tourForm.date} onChange={e=>setTourForm({...tourForm,date:e.target.value})}/></div>
          <div className="form-group"><label>Time</label><input type="time" value={tourForm.time} onChange={e=>setTourForm({...tourForm,time:e.target.value})}/></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Agent</label><select value={tourForm.agent} onChange={e=>setTourForm({...tourForm,agent:e.target.value})}>{staff.filter(s=>s.department==='Sales').map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</select></div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowTourAdd(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{addItem('tours',{leadId:lead.id,leadName:lead.name,property:tourForm.property,date:tourForm.date,time:tourForm.time,agent:tourForm.agent,status:'Scheduled',rating:null,feedback:''},'TR'); toast('Tour scheduled','success');setShowTourAdd(false);}}>Schedule Tour</button></div></div></div>}

      {/* Edit Preferences Modal — pre-filled from the existing prefs row.
          On save, drops the `inferred` flag and writes confirmedBy/At so
          the system knows the agent has captured them on a real call. */}
      {showPrefEdit && prefEditForm && <div className="modal-overlay" onClick={()=>setShowPrefEdit(false)}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:640}}>
          <div className="modal-header">
            <h3>{prefs?.inferred ? 'Refine inferred preferences' : 'Edit Buyer Preferences'}</h3>
            <button className="btn-icon" onClick={()=>setShowPrefEdit(false)}><X size={18}/></button>
          </div>
          <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {prefs?.inferred && (
              <div style={{gridColumn:'span 2',padding:'10px 12px',background:'var(--brand-tint)',border:'1px solid rgba(232,103,42,.25)',borderRadius:8,fontSize:12,lineHeight:1.5,color:'var(--text-secondary)'}}>
                These values came from the <b>{prefs.inferredFrom}</b> campaign. Edit them with what the customer told you on the call — saving will mark them as <b>confirmed</b>.
              </div>
            )}
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label>Property Types (comma-separated)</label>
              <input type="text" value={prefEditForm.propertyTypes} onChange={e=>setPrefEditForm({...prefEditForm, propertyTypes:e.target.value})} placeholder="Apartment, Villa, Townhouse"/>
            </div>
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label>Preferred Locations (comma-separated)</label>
              <input type="text" value={prefEditForm.locations} onChange={e=>setPrefEditForm({...prefEditForm, locations:e.target.value})} placeholder="New Cairo, Sheikh Zayed"/>
            </div>
            <div className="form-group">
              <label>Bedrooms</label>
              <input type="number" value={prefEditForm.bedrooms} onChange={e=>setPrefEditForm({...prefEditForm, bedrooms:e.target.value})}/>
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input type="number" value={prefEditForm.bathrooms} onChange={e=>setPrefEditForm({...prefEditForm, bathrooms:e.target.value})}/>
            </div>
            <div className="form-group">
              <label>Min Budget (EGP)</label>
              <input type="number" value={prefEditForm.budgetMin} onChange={e=>setPrefEditForm({...prefEditForm, budgetMin:e.target.value})}/>
            </div>
            <div className="form-group">
              <label>Max Budget (EGP)</label>
              <input type="number" value={prefEditForm.budgetMax} onChange={e=>setPrefEditForm({...prefEditForm, budgetMax:e.target.value})}/>
            </div>
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label>Preferred Developers (comma-separated)</label>
              <input type="text" value={prefEditForm.preferredDevelopers} onChange={e=>setPrefEditForm({...prefEditForm, preferredDevelopers:e.target.value})} placeholder="Ora, Sodic, Mountain View"/>
            </div>
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label>Amenities (comma-separated)</label>
              <input type="text" value={prefEditForm.amenities} onChange={e=>setPrefEditForm({...prefEditForm, amenities:e.target.value})} placeholder="Club Access, Gym, Park View"/>
            </div>
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label>Timeline</label>
              <input type="text" value={prefEditForm.timeline} onChange={e=>setPrefEditForm({...prefEditForm, timeline:e.target.value})} placeholder="Immediate · 3 months · 6 months"/>
            </div>
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label>Notes</label>
              <textarea rows={3} value={prefEditForm.notes} onChange={e=>setPrefEditForm({...prefEditForm, notes:e.target.value})}/>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={()=>setShowPrefEdit(false)}>Cancel</button>
            <button className="btn btn-brand" onClick={submitEditPrefs}>
              <CheckCircle size={14}/> Save & mark confirmed
            </button>
          </div>
        </div>
      </div>}

      {/* Add Preferences Modal */}
      {showPrefAdd&&<div className="modal-overlay" onClick={()=>setShowPrefAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}><div className="modal-header"><h3>Add Buyer Preferences</h3><button className="btn-icon" onClick={()=>setShowPrefAdd(false)}><X size={18}/></button></div>
        <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="form-group"><label>Property Type</label><input type="text" value={prefForm.propertyTypes} onChange={e=>setPrefForm({...prefForm,propertyTypes:e.target.value})} placeholder="e.g. Apartment, Villa"/></div>
          <div className="form-group"><label>Locations</label><input type="text" value={prefForm.locations} onChange={e=>setPrefForm({...prefForm,locations:e.target.value})} placeholder="e.g. New Cairo"/></div>
          <div className="form-group"><label>Bedrooms</label><input type="number" value={prefForm.bedrooms} onChange={e=>setPrefForm({...prefForm,bedrooms:e.target.value})}/></div>
          <div className="form-group"><label>Bathrooms</label><input type="number" value={prefForm.bathrooms} onChange={e=>setPrefForm({...prefForm,bathrooms:e.target.value})}/></div>
          <div className="form-group"><label>Min Budget</label><input type="number" value={prefForm.budgetMin} onChange={e=>setPrefForm({...prefForm,budgetMin:e.target.value})}/></div>
          <div className="form-group"><label>Max Budget</label><input type="number" value={prefForm.budgetMax} onChange={e=>setPrefForm({...prefForm,budgetMax:e.target.value})}/></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Timeline</label><input type="text" value={prefForm.timeline} onChange={e=>setPrefForm({...prefForm,timeline:e.target.value})}/></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Notes</label><textarea rows={3} value={prefForm.notes} onChange={e=>setPrefForm({...prefForm,notes:e.target.value})}/></div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowPrefAdd(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{addItem('buyerPreferences',{leadId:lead.id,propertyTypes:[prefForm.propertyTypes],locations:[prefForm.locations],bedrooms:Number(prefForm.bedrooms),bathrooms:Number(prefForm.bathrooms),budgetMin:Number(prefForm.budgetMin),budgetMax:Number(prefForm.budgetMax),timeline:prefForm.timeline,preferredDevelopers:[],amenities:[],notes:prefForm.notes},'BP'); toast('Preferences saved','success');setShowPrefAdd(false);}}>Save Preferences</button></div></div></div>}

      {/* Edit Lead Modal */}
      {showEdit&&<div className="modal-overlay" onClick={()=>setShowEdit(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}><div className="modal-header"><h3>Edit Lead</h3><button className="btn-icon" onClick={()=>setShowEdit(false)}><X size={18}/></button></div>
        <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Full Name</label><input type="text" value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})}/></div>
          <div className="form-group"><label>Phone</label><input type="text" value={editForm.phone} onChange={e=>setEditForm({...editForm,phone:e.target.value})}/></div>
          <div className="form-group"><label>Email</label><input type="email" value={editForm.email} onChange={e=>setEditForm({...editForm,email:e.target.value})}/></div>
          <div className="form-group"><label>Stage</label><select value={editForm.stage} onChange={e=>setEditForm({...editForm,stage:e.target.value})}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="form-group"><label>Priority</label><select value={editForm.priority} onChange={e=>setEditForm({...editForm,priority:e.target.value})}><option>Hot</option><option>Warm</option><option>Cold</option></select></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Budget</label><input type="number" value={editForm.budget} onChange={e=>setEditForm({...editForm,budget:e.target.value})}/></div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowEdit(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{
          const wasReservation = lead.stage === 'Reservation';
          const willBeReservation = editForm.stage === 'Reservation';
          updateItem('leads',lead.id,{...editForm,budget:Number(editForm.budget)||0}, { action:'Lead Updated', module:'CRM', target: lead.id });
          toast('Lead updated','success');
          setShowEdit(false);
          // 11-May stakeholder decision: the Deal officially enters the pipeline
          // when the customer formally contracts with the developer and pays
          // the reservation deposit — i.e. when the lead moves to Reservation,
          // not when it qualifies. Commission details are deferred.
          if (!wasReservation && willBeReservation) {
            const existing = deals.find(d => (d.lead === lead.name || d.leadName === lead.name) && (d.status || '') !== 'Closed Lost');
            if (!existing) {
              setCreateDealType('OffPlan');
              setCreateDealPrompt({ leadName: lead.name, project: lead.project, developer: lead.developer, budget: lead.budget, owner: lead.owner, team: lead.team });
            }
          }
        }}>Save Changes</button></div></div></div>}

      {/* ─── Create Deal prompt — triggered when lead moves to Reservation ─── */}
      {/* 11-May stakeholder decision: Deal enters the pipeline at Reservation
          (customer signed with the developer + paid deposit). Commission
          details are deferred and entered later in the deal lifecycle. */}
      {createDealPrompt && (
        <div className="modal-overlay" onClick={()=>setCreateDealPrompt(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
            <div className="modal-header">
              <h3>Create Deal — Reservation entered</h3>
              <button className="btn-icon" onClick={()=>setCreateDealPrompt(null)}><X size={18}/></button>
            </div>
            <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,fontSize:12,lineHeight:1.5}}>
                <b>{createDealPrompt.leadName}</b> just moved to <b>Reservation</b> — the buyer has formally contracted with the developer and paid the reservation deposit. Per the 11-May decision, the Deal officially enters the pipeline now.<br/>
                Project: <b>{createDealPrompt.project}</b> · Budget: <b>EGP {fmt(createDealPrompt.budget || 0)}</b>
              </div>
              <div className="form-group">
                <label>Pipeline Type</label>
                <div style={{display:'flex',gap:8}}>
                  {['OffPlan','Resale'].map(t => (
                    <button
                      key={t} type="button"
                      onClick={()=>setCreateDealType(t)}
                      style={{
                        flex:1,padding:'10px 14px',borderRadius:8,cursor:'pointer',
                        border: createDealType === t ? '1px solid var(--brand)' : '1px solid var(--border)',
                        background: createDealType === t ? 'var(--brand-tint)' : '#fff',
                        color: createDealType === t ? 'var(--brand)' : 'var(--text-primary)',
                        fontWeight:700,fontSize:13,
                      }}
                    >{t === 'OffPlan' ? 'Off Plan' : 'Resale'}</button>
                  ))}
                </div>
              </div>
              <div style={{fontSize:11,color:'var(--text-tertiary)',lineHeight:1.4}}>
                The deal will be created at stage <b>Reservation</b> for Off Plan or <b>Offer Accepted</b> for Resale. Commission details can be filled in later — they are not required at deal creation.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setCreateDealPrompt(null)}>Skip — don't create deal</button>
              <button className="btn btn-brand" onClick={()=>{
                const entryStage = createDealType === 'OffPlan' ? 'Reservation' : 'Offer Accepted';
                const created = addItem('deals', {
                  type: createDealType,
                  lead: createDealPrompt.leadName,
                  leadName: createDealPrompt.leadName,
                  project: createDealPrompt.project || '',
                  developer: createDealPrompt.developer || '',
                  propertyId: '',
                  value: Number(createDealPrompt.budget) || 0,
                  // Commission deferred per 11-May meeting — agent or finance fills in later.
                  commission: 0,
                  owner: createDealPrompt.owner || persona.label,
                  team: createDealPrompt.team || h.team || 'Alpha',
                  stage: entryStage,
                  reservationDeposit: 0, paymentPlan: '',
                  offerPrice: 0, paymentMethod: 'Cash',
                  commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false,
                  collectionPercent: 0, attachments: [],
                  status: 'Active',
                  created: new Date().toISOString().slice(0,10),
                }, 'D', { action: 'Deal Created (from Lead Reservation)', module: 'CRM', target: lead.id, detail: `${createDealType} · ${createDealPrompt.leadName} · entry stage ${entryStage}` });
                toast(`Deal ${created?.id || ''} created at ${entryStage} — commission details deferred`, 'success');
                setCreateDealPrompt(null);
                navigate('/system/crm/deals');
              }}>Create deal</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Log Action modal — structured Action picker + visibility toggle ─── */}
      {/* 11-May stakeholder asks (items 1:26 + 1:27): agent logs an Action
          (not a Note); two-tier visibility — Communication (team-visible) vs
          Lead Note (private to owner + managers). */}
      {showActivityAdd && (() => {
        const ACTION_TYPES = [
          { key:'Call Outcome',         icon:'📞', outcomes:['Interested','Callback Later','Not Interested','No Answer','Wrong Number','Voicemail'] },
          { key:'Scheduled Tour',       icon:'🏠', outcomes:['Confirmed','Pending','Rescheduled'] },
          { key:'Sent Brochure',        icon:'📄', outcomes:['WhatsApp','Email','SMS'] },
          { key:'Sent Quote',           icon:'💼', outcomes:['Standard plan','Custom plan'] },
          { key:'Requested Approval',   icon:'✋', outcomes:['Commission override','Manual lock override','Reassignment'] },
          { key:'Meeting',              icon:'👥', outcomes:['Office','Site visit','Video call'] },
          { key:'WhatsApp',             icon:'💬', outcomes:['Sent message','Voice note','Document'] },
          { key:'Email',                icon:'📧', outcomes:['Outbound','Reply received'] },
        ];
        const currentType = ACTION_TYPES.find(a => a.key === activityForm.action) || ACTION_TYPES[0];
        return (
          <div className="modal-overlay" onClick={()=>setShowActivityAdd(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
              <div className="modal-header">
                <h3>Log Action</h3>
                <button className="btn-icon" onClick={()=>setShowActivityAdd(false)}><X size={18}/></button>
              </div>
              <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="form-group">
                  <label>Action *</label>
                  <select value={activityForm.action} onChange={e=>{const t = ACTION_TYPES.find(x=>x.key===e.target.value); setActivityForm({...activityForm,action:e.target.value,outcome:t?.outcomes[0]||''});}}>
                    {ACTION_TYPES.map(t => <option key={t.key}>{t.icon} {t.key}</option>)}
                  </select>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>Structured action — auto-generates a Note in the timeline. Use Note text below for the conversation context.</div>
                </div>
                <div className="form-group">
                  <label>Outcome / Sub-type</label>
                  <select value={activityForm.outcome} onChange={e=>setActivityForm({...activityForm,outcome:e.target.value})}>
                    {currentType.outcomes.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Summary (one-liner)</label>
                  <input type="text" value={activityForm.summary} onChange={e=>setActivityForm({...activityForm,summary:e.target.value})} placeholder="e.g. Discussed budget constraints"/>
                </div>
                <div className="form-group">
                  <label>Note (full detail)</label>
                  <textarea rows={3} value={activityForm.note} onChange={e=>setActivityForm({...activityForm,note:e.target.value})} placeholder="Conversation context, follow-up needed, observations…"/>
                </div>
                <div className="form-group">
                  <label>Visibility</label>
                  <div style={{display:'flex',gap:8}}>
                    {[
                      { key:'communication', label:'Communication', sub:'Everyone on team sees' },
                      { key:'private',       label:'Lead Note',     sub:'Only owner + managers see' },
                    ].map(v => (
                      <button
                        key={v.key} type="button"
                        onClick={()=>setActivityForm({...activityForm,visibility:v.key})}
                        style={{
                          flex:1,padding:'10px 14px',borderRadius:8,cursor:'pointer',textAlign:'left',
                          border: activityForm.visibility === v.key ? '1px solid var(--brand)' : '1px solid var(--border)',
                          background: activityForm.visibility === v.key ? 'var(--brand-tint)' : '#fff',
                        }}
                      >
                        <div style={{fontSize:13,fontWeight:700,color: activityForm.visibility === v.key ? 'var(--brand)' : 'var(--text-primary)'}}>{v.label}</div>
                        <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:2}}>{v.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={()=>setShowActivityAdd(false)}>Cancel</button>
                <button className="btn btn-brand" onClick={()=>{
                  const detail = `${activityForm.action}: ${activityForm.outcome}${activityForm.summary ? ' — ' + activityForm.summary : ''}`;
                  addItem('activities', {
                    leadId: lead.id,
                    date: new Date().toISOString().replace('T',' ').substring(0,16),
                    type: activityForm.action,
                    outcome: activityForm.outcome,
                    detail,
                    sub: activityForm.note,
                    visibility: activityForm.visibility,
                    author: persona.label,
                  }, 'ACT', { action: `Action Logged · ${activityForm.action}`, module: 'CRM', target: lead.id, detail });
                  toast(`Action logged — ${activityForm.visibility === 'private' ? 'private Lead Note' : 'visible to team'}`, 'success');
                  setShowActivityAdd(false);
                }}>Log Action</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
