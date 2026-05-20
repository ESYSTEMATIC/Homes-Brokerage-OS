import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ChevronRight, Award, UsersRound, CalendarClock, Mail, TrendingUp, Phone, KanbanSquare, Megaphone, CheckCircle2, Clock, Activity } from 'lucide-react';
import { personaOwnerName } from '../data/crmAccess';
import { RoleDashboard } from '../components/RoleDashboard';

// NOTE: persona access is enforced canonically in three places:
//   1. crmAccess.HIERARCHY            — defines scope + crmModules per persona
//   2. App.jsx BACKOFFICE_ROLES /
//      MARKETPLACE_ROLES / CRM_BLOCKED_ROLES  — route guards
//   3. AgentServices.jsx              — Product & Services discovery surface
// The old ROLE_ACCESS map that lived here was display-only and out of sync;
// it was removed on the access-audit pass. See the access matrix comment in
// App.jsx for the authoritative table.

export const EmployeeBoardDashboard = () => {
  const { persona, personaKey, state, toast, openDrawer, openModal, updateItem, writeAudit } = useApp();
  const navigate = useNavigate();

  // Intro call drawer — shows scheduled datetime, owner, location, history.
  // The owner can mark Complete / No-Show / Cancelled. Reschedule opens a
  // mini form. The agent (whose call it is) sees the drawer as read-only.
  const openIntroCallDrawer = (call) => {
    if (!call) return;
    const isOwner = call.owner === persona.label;
    const dt = call.scheduledAt ? new Date(call.scheduledAt) : null;
    const dateLabel = dt ? dt.toLocaleString('en-GB', { weekday:'long', day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'Not yet scheduled';

    const writeStatus = (next, extraNote = '') => {
      if (!call.id) return;
      const nowIso = new Date().toISOString();
      const patch = {
        status: next,
        completedAt: next === 'Completed' ? nowIso : call.completedAt,
        history: [
          ...(call.history || []),
          { at: nowIso, actor: persona.label, action: `Status → ${next}${extraNote ? ` — ${extraNote}` : ''}` },
        ],
      };
      updateItem('introCalls', call.id, patch, { action: `Intro Call ${next}`, module: 'Backoffice', target: call.id, detail: `${call.candidateName} · ${extraNote || ''}`.trim() });
      toast(`Intro call ${next.toLowerCase()}`, next === 'Completed' ? 'success' : next === 'Cancelled' ? 'warning' : 'info');
    };

    const reschedule = () => {
      let newAt = call.scheduledAt || '';
      openModal({
        title: `Reschedule intro call · ${call.candidateName}`,
        subtitle: `Current: ${dateLabel}`,
        submitLabel: 'Reschedule',
        body: (
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <label style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em'}}>New date & time</label>
            <input
              type="datetime-local"
              defaultValue={newAt}
              onChange={e => { newAt = e.target.value; }}
              style={{padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:13, fontFamily:'inherit'}}
            />
            <div style={{fontSize:11, color:'var(--text-tertiary)'}}>Cairo time (Africa/Cairo · UTC+2). The candidate will see the new time on their dashboard.</div>
          </div>
        ),
        onSubmit: () => {
          if (!newAt) { toast('Pick a date & time', 'error'); return false; }
          const nowIso = new Date().toISOString();
          updateItem('introCalls', call.id, {
            scheduledAt: newAt,
            status: 'Scheduled',
            history: [
              ...(call.history || []),
              { at: nowIso, actor: persona.label, action: `Rescheduled to ${newAt.replace('T', ' ')}` },
            ],
          }, { action: 'Intro Call Rescheduled', module: 'Backoffice', target: call.id, detail: `${call.candidateName} → ${newAt.replace('T', ' ')}` });
          toast(`Rescheduled to ${newAt.replace('T', ' ')}`, 'success');
        },
      });
    };

    openDrawer({
      title: `Intro call · ${call.candidateName}`,
      subtitle: call.id ? `${call.id} · owned by ${call.owner}` : `Owned by ${call.owner || '—'}`,
      content: (
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          {/* Scheduled status banner */}
          <div style={{
            padding:'14px 16px',
            background: call.status === 'Completed' ? '#dcfce7'
              : call.status === 'Scheduled' ? 'var(--brand-tint)'
              : call.status === 'Cancelled' || call.status === 'No-Show' ? '#fee2e2'
              : '#f1f5f9',
            border: `1px solid ${call.status === 'Completed' ? '#86efac' : call.status === 'Scheduled' ? 'rgba(232,103,42,0.25)' : '#fca5a5'}`,
            borderRadius:10,
          }}>
            <div style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.08em'}}>{call.status}</div>
            <div style={{fontSize:15, fontWeight:700, marginTop:4}}>{dateLabel}</div>
            {call.durationMinutes && <div style={{fontSize:11, color:'var(--text-tertiary)', marginTop:3}}>{call.durationMinutes} minutes</div>}
          </div>

          {/* Details */}
          <div className="detail-grid">
            {[
              ['Candidate', call.candidateName],
              ['Owner', call.owner || '—'],
              ['Sales Manager', call.salesManager || '—'],
              ['Location', call.location || 'Microsoft Teams'],
              ['Linked onboarding', call.applicantId || '—'],
              ['Created by', call.createdBy || '—'],
            ].map(([k, v]) => (
              <div key={k}><label>{k}</label><div className="v">{v}</div></div>
            ))}
          </div>

          {/* Agenda / notes */}
          {call.notes && (
            <div>
              <div style={{fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6}}>Agenda / notes</div>
              <div style={{padding:'10px 12px', background:'#fafbfc', border:'1px solid var(--border)', borderRadius:8, fontSize:13, lineHeight:1.55, color:'var(--text-primary)'}}>{call.notes}</div>
            </div>
          )}

          {/* Owner actions */}
          {isOwner && call.id && call.status === 'Scheduled' && (
            <div style={{display:'flex', gap:8, flexWrap:'wrap', paddingTop:12, borderTop:'1px solid var(--border)'}}>
              <a className="btn btn-brand btn-sm" href="https://teams.microsoft.com/" target="_blank" rel="noopener noreferrer">
                Join call (Teams)
              </a>
              <button className="btn btn-success btn-sm" onClick={() => writeStatus('Completed')}>Mark Completed</button>
              <button className="btn btn-outline btn-sm" onClick={reschedule}>Reschedule</button>
              <button className="btn btn-outline btn-sm" style={{color:'#b45309'}} onClick={() => writeStatus('No-Show')}>No-show</button>
              <button className="btn btn-outline btn-sm" style={{color:'var(--danger)'}} onClick={() => writeStatus('Cancelled')}>Cancel</button>
            </div>
          )}
          {!isOwner && call.status === 'Scheduled' && call.id && (
            <div style={{display:'flex', gap:8, paddingTop:12, borderTop:'1px solid var(--border)'}}>
              <a className="btn btn-brand btn-sm" href="https://teams.microsoft.com/" target="_blank" rel="noopener noreferrer">Join call (Teams)</a>
              <span style={{fontSize:11, color:'var(--text-tertiary)', alignSelf:'center'}}>Only {call.owner} can reschedule or close this call.</span>
            </div>
          )}

          {/* History */}
          {Array.isArray(call.history) && call.history.length > 0 && (
            <div>
              <div style={{fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6}}>History</div>
              <div style={{display:'flex', flexDirection:'column', gap:6}}>
                {[...call.history].reverse().map((h, i) => (
                  <div key={i} style={{display:'flex', gap:8, alignItems:'flex-start', fontSize:11, padding:'6px 8px', background:'#fafbfc', borderRadius:6, borderLeft:'2px solid var(--brand)'}}>
                    <span style={{color:'var(--text-tertiary)', flexShrink:0, fontFamily:'monospace'}}>{(h.at || '').slice(0,16).replace('T',' ')}</span>
                    <span style={{flex:1}}><b>{h.actor}</b> — {h.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {call.synthetic && (
            <div style={{padding:'10px 12px', background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:8, fontSize:11, color:'#92400e'}}>
              <b>Pending real record:</b> this entry is derived from your onboarding state. A real intro call will be auto-created the moment your offer is accepted in the system. Until then, only your Team Leader can schedule manually.
            </div>
          )}
        </div>
      ),
    });
  };
  // "isAgent" gates the sales-track UI: onboarding journey, training compliance,
  // MLS, team assignment, agent score, Viva Learning, Performance metrics.
  // Marketing has hub='agent' for layout chrome but salesTrack=false so it
  // skips all of these (BRD §8.23).
  const isAgent = persona.hub === 'agent' && persona.salesTrack === true;
  const onboardingComplete = persona.onboardingComplete === true;

  // ── Agent onboarding state (used only for agent personas) ──
  const completedReqTraining = state.training.filter(c=>c.required && c.status==='Completed').length;
  const totalReqTraining = state.training.filter(c=>c.required).length;
  const trainingDone = onboardingComplete || completedReqTraining === totalReqTraining;
  const docsApproved = onboardingComplete ? state.agentDocs.length : state.agentDocs.filter(d=>d.status==='Approved').length;
  const docsTotal = state.agentDocs.length;
  const docsDone = docsApproved === docsTotal;
  const agreementSigned = true;
  const mlsActive = onboardingComplete;
  const liveActive = onboardingComplete;

  // Agent score (Platform §2.3 — used for team allocation & performance benchmarking).
  // Business-team review (May 2026): no interview/HR score is captured.
  // Agent score now equals the training average — the only score in the
  // system is the Homes Academy (training) score.
  const trainingAvg = state.training.filter(c=>c.required && c.score).reduce((s,c)=>s+c.score,0)
    / Math.max(1, state.training.filter(c=>c.required && c.score).length);
  const agentScore = Math.round(trainingAvg || 0);

  // Intro call — real domain record auto-spawned on offer accept. Read
  // by matching the candidate name to the persona label. If no record
  // exists (older personas, demo edge cases), fall back to a synthetic
  // entry derived from onboarding completion so the dashboard never
  // shows an empty slot.
  const myIntroCall = useMemo(() => {
    const real = (state.introCalls || []).find(c => c.candidateName === persona.label);
    if (real) return real;
    return {
      id: null,
      candidateName: persona.label,
      owner: 'Omar Sherif',
      scheduledAt: onboardingComplete ? '2024-01-12T11:00' : null,
      status: onboardingComplete ? 'Completed' : 'Pending schedule',
      synthetic: true,
    };
  }, [state.introCalls, persona.label, onboardingComplete]);

  // Intro calls I OWN (Team Leaders, Sales Managers, Sales Directors,
  // HR Recruiters, Backoffice Admins, etc.) — every record where the
  // persona is the owner. Sorted with Scheduled first (upcoming first),
  // then everything else by most-recent. This is what Omar Sherif sees:
  // IC-001 (Sarah · Scheduled) and IC-002 (Fatma · Completed).
  const myOwnedIntroCalls = useMemo(() => {
    const all = (state.introCalls || []).filter(c => c.owner === persona.label);
    const STATUS_ORDER = { 'Scheduled': 0, 'No-Show': 1, 'Cancelled': 2, 'Completed': 3 };
    return [...all].sort((a, b) => {
      const sa = STATUS_ORDER[a.status] ?? 9;
      const sb = STATUS_ORDER[b.status] ?? 9;
      if (sa !== sb) return sa - sb;
      // Within group: Scheduled → soonest first, others → most recent first
      const ta = a.scheduledAt || '';
      const tb = b.scheduledAt || '';
      if (a.status === 'Scheduled') return ta.localeCompare(tb);
      return tb.localeCompare(ta);
    });
  }, [state.introCalls, persona.label]);

  // Format intro-call summary for the Team Assignment row.
  const formatIntroCall = (c) => {
    if (!c) return '—';
    if (c.status === 'Completed' && c.completedAt) return `Completed ${c.completedAt.slice(0,10)}`;
    if (c.status === 'Completed' && c.scheduledAt) return `Completed ${c.scheduledAt.slice(0,10)}`;
    if (c.status === 'Cancelled') return 'Cancelled — reschedule pending';
    if (c.status === 'No-Show')   return 'No-show — reschedule pending';
    if (c.status === 'Pending schedule' || !c.scheduledAt) return 'Pending schedule';
    // Scheduled in the future
    const dt = new Date(c.scheduledAt);
    const dateStr = dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const timeStr = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `Scheduled · ${dateStr} ${timeStr}`;
  };

  // Team Assignment (Platform §2.4) — derive from persona context.
  const teamAssignment = isAgent ? {
    team: personaKey === 'teamLeader' ? 'Alpha (Lead)' : 'Alpha',
    teamLeader: personaKey === 'teamLeader' ? '— (you are the TL)' : 'Omar Sherif',
    salesManager: 'Sales Manager',
    salesDirector: 'Tarek Amin',
    branch: persona.scope.includes('New Cairo') ? 'New Cairo' : '6th October',
    introCall: formatIntroCall(myIntroCall),
    introCallOwner: myIntroCall?.owner,
    introCallRecord: myIntroCall,
    crmAccount: onboardingComplete ? `${persona.email.split('@')[0]}.crm` : 'Will be issued on activation',
    mlsId: persona.mls === 'Pending' ? 'Pending EGMLS verification (2-3 days)' : persona.mls,
  } : null;

  const journeySteps = onboardingComplete ? [
    { label: 'Application', done: true },
    { label: 'Documents',   done: true },
    { label: 'Agreement',   done: true },
    { label: 'Training',    done: true },
    { label: 'MLS Access',  done: true },
    { label: 'Go Live',     done: true },
  ] : [
    { label: 'Application', done: true },
    { label: 'Documents',   done: docsDone, current: !docsDone },
    { label: 'Agreement',   done: agreementSigned, current: docsDone && !agreementSigned },
    { label: 'Training',    done: trainingDone, current: agreementSigned && !trainingDone },
    { label: 'MLS Access',  done: false, current: trainingDone && !mlsActive },
    { label: 'Go Live',     done: false },
  ];

  // ── Post-onboarding CRM operations data ──
  // When an agent has finished onboarding, the dashboard pivots from "journey"
  // to "operations": live leads / tasks / pipeline KPIs, target progress,
  // recent activity, announcements, and next training reminder.
  // Tours are a lead treatment (May 2026 review) — counted via lead stage,
  // not a separate metric.
  const ownerName = personaOwnerName(personaKey);
  const todayIso = new Date().toISOString().slice(0,10);

  const myLeads = useMemo(() => (state.leads || []).filter(l => l.owner === ownerName), [state.leads, ownerName]);
  const myOpenLeads = myLeads.filter(l => l.stage !== 'Closed Won' && l.stage !== 'Closed Lost');
  const myLeadsAtTour = myLeads.filter(l => l.stage === 'Tour Scheduled').length;
  const myDeals = useMemo(() => (state.deals || []).filter(d => d.owner === ownerName), [state.deals, ownerName]);
  const myActivePipeline = myDeals.filter(d => d.status === 'Active' || d.status === undefined).reduce((s, d) => s + (d.value || 0), 0);
  const myClosedWon = myDeals.filter(d => d.status === 'Closed' || d.status === 'Closed Won' || d.stage === 'Standard Collection (10%)' || d.stage === 'Contract Signed & Payment').length;
  const myTasksDueToday = (state.tasks || []).filter(t => t.owner === ownerName && t.due === todayIso && t.status !== 'Completed').length;
  const myTasksOverdue = (state.tasks || []).filter(t => t.owner === ownerName && t.due < todayIso && t.status !== 'Completed').length;

  const myTarget = state.targets?.[personaKey];
  const targetProgress = myTarget ? {
    leadsPct: Math.min(100, Math.round((myLeads.length / Math.max(1, myTarget.leadsTarget)) * 100)),
    dealsPct: Math.min(100, Math.round((myDeals.length / Math.max(1, myTarget.dealsTarget)) * 100)),
    pipelinePct: Math.min(100, Math.round((myActivePipeline / Math.max(1, myTarget.pipelineTarget)) * 100)),
    closedPct: Math.min(100, Math.round((myClosedWon / Math.max(1, myTarget.closedWonTarget)) * 100)),
  } : null;

  const myActivity = useMemo(() => (state.audit || []).filter(a => a.actor === persona.label || (a.target && (a.target.includes(ownerName) || a.detail?.includes(ownerName)))).slice(0, 5), [state.audit, persona.label, ownerName]);
  const announcements = (state.announcements || []).slice(0, 4);
  const nextTraining = (state.training || []).find(t => t.required && t.status !== 'Completed');

  // The tile launchers (SSO tiles, Internal Workspaces, bottom shortcut row)
  // were removed from the dashboard on 08-May. Discovery lives entirely in
  // Product & Services (/board/services). The SSO splash overlay is still
  // triggered from there via triggerSsoLaunch() when launching CRM etc.

  return (
    <div>
      {/* ── Welcome hero — gradient surface with avatar, role chips, status ── */}
      {(() => {
        const initials = persona.label.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
        const branch = persona.scope?.includes('6th October') ? '6th October' : persona.scope?.includes('New Cairo') ? 'New Cairo' : null;
        const team = persona.scope?.includes('Team Alpha') ? 'Team Alpha' : persona.scope?.includes('Team Leader') ? 'Team Alpha (lead)' : null;
        const role = persona.role || (isAgent ? 'Licensed Agent' : persona.label);
        return (
          <div style={{
            background:'linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#312e81 100%)',
            borderRadius:16, padding:'22px 26px', marginBottom:24, color:'#fff',
            display:'flex', alignItems:'center', gap:18, position:'relative', overflow:'hidden',
            boxShadow:'0 12px 32px rgba(15,23,42,.18)',
          }}>
            {/* Subtle brand-tint highlight */}
            <div style={{position:'absolute',right:-50,top:-50,width:260,height:260,borderRadius:'50%',background:'radial-gradient(circle,rgba(232,103,42,.25),rgba(232,103,42,0))'}}/>
            {/* Avatar — pulls from the signed-in user's staff record */}
            {(() => {
              const staff = (state.staff || []).find(s => s.name === persona.label) || {};
              return (
                <div style={{
                  width:64, height:64, borderRadius:18, flexShrink:0,
                  background: staff.photoDataUrl ? 'transparent' : 'linear-gradient(135deg,#E8672A,#F89357)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontWeight:800, fontSize:22, color:'#fff',
                  boxShadow:'0 8px 18px rgba(232,103,42,.35)',
                  position:'relative', overflow:'hidden',
                }}>
                  {staff.photoDataUrl ? (
                    <img src={staff.photoDataUrl} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                  ) : initials}
                  <span style={{position:'absolute',bottom:-2,right:-2,width:18,height:18,borderRadius:'50%',background:'#10b981',border:'3px solid #1e293b'}}/>
                </div>
              );
            })()}

            <div style={{flex:1,minWidth:0,position:'relative'}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,.6)',fontWeight:500,marginBottom:4}}>Welcome back</div>
              <h1 style={{fontSize:24,fontWeight:800,color:'#fff',margin:0,lineHeight:1.2}}>{persona.label}</h1>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10,alignItems:'center'}}>
                <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',background:'rgba(255,255,255,.12)',borderRadius:999,fontSize:11,fontWeight:600,color:'#fff'}}>
                  {role}
                </span>
                {team && (
                  <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',background:'rgba(232,103,42,.18)',borderRadius:999,fontSize:11,fontWeight:600,color:'#FBBF24'}}>
                    <UsersRound size={11}/> {team}
                  </span>
                )}
                {branch && (
                  <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',background:'rgba(255,255,255,.08)',borderRadius:999,fontSize:11,fontWeight:600,color:'rgba(255,255,255,.85)'}}>
                    📍 {branch}
                  </span>
                )}
                {persona.mls && (
                  <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',background:'rgba(255,255,255,.08)',borderRadius:999,fontSize:11,fontWeight:600,color:'rgba(255,255,255,.85)',fontFamily:'monospace'}}>
                    MLS {persona.mls}
                  </span>
                )}
                <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',background:'rgba(16,185,129,.18)',borderRadius:999,fontSize:11,fontWeight:600,color:'#86efac'}}>
                  ● {isAgent && onboardingComplete ? 'Active' : isAgent ? 'In onboarding' : 'Signed in'}
                </span>
              </div>
            </div>

            <div style={{textAlign:'right',position:'relative'}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,.5)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase'}}>Microsoft 365</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.85)',marginTop:3,fontFamily:'monospace'}}>{persona.email}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,.5)',marginTop:6}}>SSO session active</div>
            </div>
          </div>
        );
      })()}

      {/* ── Intro calls you own (Team Leaders, Managers, HR, Backoffice) ──
          Surfaces every record where the signed-in user is the call owner —
          i.e. the manager who'll run the intro call for a newly-hired agent.
          Hidden when the persona has no owned calls. Each row opens the
          existing intro-call drawer (Join Teams · Reschedule · Mark Done · …). */}
      {myOwnedIntroCalls.length > 0 && (
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px',marginBottom:18}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,gap:10,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:'var(--brand-tint)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <CalendarClock size={18} color="var(--brand)"/>
              </div>
              <div>
                <h3 style={{fontSize:14,fontWeight:700,margin:0}}>Intro calls you own</h3>
                <p style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>
                  {myOwnedIntroCalls.filter(c=>c.status==='Scheduled').length} upcoming · auto-spawned the moment an offer is accepted
                </p>
              </div>
            </div>
            <span className="badge badge-gray" style={{fontFamily:'monospace'}}>{myOwnedIntroCalls.length} total</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {myOwnedIntroCalls.map(call => {
              const dt = call.scheduledAt ? new Date(call.scheduledAt) : null;
              const when = dt ? `${dt.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short'})} · ${dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}` : 'Not scheduled';
              const badgeKind = call.status === 'Completed' ? 'success' : call.status === 'Scheduled' ? 'brand' : 'warning';
              const candidatePhoto = ((state.staff || []).find(s => s.name === call.candidateName) || {}).photoDataUrl;
              const initials = (call.candidateName || '?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
              return (
                <div
                  key={call.id}
                  onClick={() => openIntroCallDrawer(call)}
                  style={{
                    display:'flex',alignItems:'center',gap:12,
                    padding:'12px 14px',
                    background:'#fafbfc',border:'1px solid var(--border)',borderRadius:10,
                    cursor:'pointer',transition:'background .12s, border-color .12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--brand-tint)'; e.currentTarget.style.borderColor='rgba(232,103,42,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='#fafbfc'; e.currentTarget.style.borderColor='var(--border)'; }}
                >
                  <div style={{width:36,height:36,borderRadius:10,background:candidatePhoto?'transparent':'linear-gradient(135deg,#475569,#1e293b)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,overflow:'hidden',flexShrink:0}}>
                    {candidatePhoto ? <img src={candidatePhoto} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                      <span style={{fontWeight:700,fontSize:13}}>{call.candidateName}</span>
                      <span className={`badge badge-${badgeKind}`} style={{fontSize:9}}>{call.status}</span>
                      {call.applicantId && <span style={{fontSize:10,color:'var(--text-tertiary)',fontFamily:'monospace'}}>{call.applicantId}</span>}
                    </div>
                    <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:3,display:'flex',gap:10,flexWrap:'wrap'}}>
                      <span>📅 {when}</span>
                      {call.location && <span>📍 {call.location}</span>}
                      {call.durationMinutes && <span>⏱ {call.durationMinutes}m</span>}
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--text-tertiary)"/>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Agent-only onboarding journey + status (BRD §8.9) ── */}
      {/* Only show the onboarding journey for agents who haven't finished
          onboarding yet. Active agents get the operations dashboard below. */}
      {isAgent && !onboardingComplete && (
        <>
          <div className="kpi-grid kpi-grid-5" style={{marginBottom:18}}>
            {[
              ['ONBOARDING', `${Math.round(((docsApproved/docsTotal)*0.4 + (completedReqTraining/totalReqTraining)*0.4 + 0.2) * 100)}%`, 'in-progress', 'amber'],
              ['TRAINING', `${completedReqTraining}/${totalReqTraining} done`, trainingDone ? 'completed' : 'in-progress', trainingDone ? 'green' : 'amber'],
              ['DOCUMENTS', `${docsApproved}/${docsTotal}`, docsDone ? 'completed' : 'in-progress', docsDone ? 'green' : 'amber'],
              ['AGREEMENT', 'Signed', 'completed', 'green'],
              ['MLS ACCESS', 'Pending', 'pending', 'gray'],
            ].map(([label,value,status,color])=>(
              <div key={label} style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,padding:'16px 20px',textAlign:'center'}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
                <div style={{fontSize:22,fontWeight:800,marginTop:6}}>{value}</div>
                <span className={`badge badge-${color==='green'?'success':color==='amber'?'warning':'gray'}`} style={{marginTop:6}}>{status}</span>
              </div>
            ))}
          </div>

          <div className="journey-bar" style={{marginBottom:28}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:18}}>
              <div>
                <h3 style={{fontSize:16,fontWeight:700}}>Onboarding Journey</h3>
                <p style={{fontSize:12,color:'var(--text-secondary)',marginTop:4}}>Each step gates downstream system access (BRD §6.1 training gates, §8.9 onboarding flow)</p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={()=>navigate('/board/documents')}>Manage steps</button>
            </div>
            <div className="journey-steps">
              {journeySteps.map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className="journey-step">
                    <div className={`journey-step-circle ${step.done?'done':step.current?'current':''}`}>
                      {step.done ? '✓' : i+1}
                    </div>
                    <div className="journey-step-label">{step.label}</div>
                  </div>
                  {i < journeySteps.length - 1 && <div className={`journey-line ${step.done?'done':''}`}></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Team Assignment + Final Confirmation (Platform §2.4–§2.6) ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:28}}>
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'20px 22px'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                <div style={{width:36,height:36,borderRadius:10,background:'var(--brand-tint)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <UsersRound size={18} color="var(--brand)"/>
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>Team Assignment</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)'}}>Platform §2.4 — auto-assigned by capacity, score & location</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,fontSize:12.5}}>
                {[['Team',teamAssignment.team],['Branch',teamAssignment.branch],['Team Leader',teamAssignment.teamLeader],['Sales Manager',teamAssignment.salesManager],['Sales Director',teamAssignment.salesDirector],['Hierarchy','Director → Manager → TL → Agent']].map(([k,v]) => (
                  <div key={k}>
                    <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>{k}</div>
                    <div style={{fontWeight:500,marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => openIntroCallDrawer(teamAssignment.introCallRecord)}
                style={{
                  marginTop:14, padding:'10px 12px',
                  background:'var(--brand-tint)', border:'1px solid rgba(232,103,42,0.18)',
                  borderRadius:8,
                  display:'flex', alignItems:'center', gap:8, fontSize:12,
                  width:'100%', textAlign:'left', cursor:'pointer',
                  transition:'background .12s, border-color .12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,103,42,0.12)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--brand-tint)'; e.currentTarget.style.borderColor = 'rgba(232,103,42,0.18)'; }}
                title="Open intro call details"
              >
                <CalendarClock size={14} color="var(--brand)"/>
                <span style={{flex:1}}>
                  <b>Intro call:</b> {teamAssignment.introCall}
                  {teamAssignment.introCallOwner && (
                    <span style={{color:'var(--text-tertiary)', marginLeft:6}}>· with {teamAssignment.introCallOwner}</span>
                  )}
                </span>
                <ChevronRight size={13} color="var(--text-tertiary)"/>
              </button>
            </div>

            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'20px 22px'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                <div style={{width:36,height:36,borderRadius:10,background:'var(--brand-tint)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Award size={18} color="var(--brand)"/>
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>Evaluation & Access {onboardingComplete && <span className="badge badge-success" style={{marginLeft:6}}>Final Confirmation</span>}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)'}}>Platform §2.3 (score) · §2.5 (access) · §2.6 (final email)</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,fontSize:12.5}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>Agent Score</div>
                  <div style={{fontWeight:800,fontSize:18,marginTop:2,color:agentScore>=85?'var(--success)':agentScore>=70?'var(--warning)':'var(--text-primary)'}}>{agentScore}/100</div>
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>Training Avg</div>
                  <div style={{fontWeight:500,marginTop:2}}>{Math.round(trainingAvg)}%</div>
                </div>
                {/* Interview Score card removed (May 2026 review) — no
                    interview scoring is conducted; training is the only
                    scored surface. */}
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>Used For</div>
                  <div style={{fontWeight:500,marginTop:2,fontSize:11}}>Team allocation & benchmarking</div>
                </div>
              </div>
              <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid var(--border)',display:'grid',gridTemplateColumns:'1fr',gap:8,fontSize:12}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{color:'var(--text-secondary)'}}>CRM account</span>
                  <span style={{fontWeight:600,fontFamily:'monospace',fontSize:11}}>{teamAssignment.crmAccount}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{color:'var(--text-secondary)'}}>MLS ID</span>
                  <span style={{fontWeight:600,fontFamily:'monospace',fontSize:11}}>{teamAssignment.mlsId}</span>
                </div>
                {onboardingComplete && (
                  <button className="btn btn-outline btn-sm" style={{marginTop:6,justifyContent:'center'}} onClick={()=>{toast('Final confirmation email re-sent','info');}}><Mail size={13}/> Resend final confirmation</button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Post-onboarding operations dashboard (active agents + TLs) ── */}
      {/* Replaces the onboarding journey for sales-track personas who have
          completed onboarding. Surfaces live CRM KPIs, target progress,
          recent activity, announcements, and the next training reminder. */}
      {isAgent && onboardingComplete && (
        <>
          <div className="kpi-grid kpi-grid-4" style={{marginBottom:18}}>
            {/* 11-May ask: KPI cards drill down into the underlying records.
                Click → drawer with the actual leads / tasks / deals behind
                the number. Each row in the drawer links to its detail page. */}
            {[
              { label:'OPEN LEADS',         value: myOpenLeads.length, icon: Phone,        color:'#3b82f6', sub: `${myLeads.length} total`,
                onClick: () => openDrawer({
                  title: 'My Open Leads', subtitle: `${myOpenLeads.length} leads · click to open`,
                  content: (
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      {myOpenLeads.length === 0 ? <div style={{padding:20,color:'var(--text-tertiary)'}}>No open leads.</div> :
                        myOpenLeads.map(l => (
                          <div key={l.id} onClick={()=>navigate(`/system/crm/leads/${l.id}`)} style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,cursor:'pointer',background:'#fafbfc'}}>
                            <div style={{fontWeight:700,fontSize:13}}>{l.name}</div>
                            <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>{l.id} · {l.project || '—'} · {l.stage} · {l.priority}</div>
                          </div>
                        ))}
                    </div>
                  ),
                })
              },
              { label:'TASKS DUE TODAY',    value: myTasksDueToday,    icon: Clock,        color:'#f59e0b', sub: myTasksOverdue ? `${myTasksOverdue} overdue` : 'on track',
                onClick: () => {
                  const myTasks = (state.tasks || []).filter(t => t.owner === ownerName && (t.due === todayIso || (t.due < todayIso && t.status !== 'Completed')));
                  openDrawer({
                    title: 'My Tasks · Due today + overdue', subtitle: `${myTasks.length} to action`,
                    content: (
                      <div style={{display:'flex',flexDirection:'column',gap:8}}>
                        {myTasks.length === 0 ? <div style={{padding:20,color:'var(--text-tertiary)'}}>No tasks due today or overdue.</div> :
                          myTasks.map(t => (
                            <div key={t.id} onClick={()=>navigate('/system/crm/tasks')} style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,cursor:'pointer',background: t.due < todayIso ? '#fef2f2' : '#fafbfc'}}>
                              <div style={{fontWeight:700,fontSize:13}}>{t.title}</div>
                              <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>{t.id} · due {t.due} · {t.priority} · {t.status}{t.due < todayIso ? ' · OVERDUE' : ''}</div>
                            </div>
                          ))}
                      </div>
                    ),
                  });
                }
              },
              { label:'ACTIVE PIPELINE',    value: `EGP ${(myActivePipeline/1e6).toFixed(1)}M`, icon: KanbanSquare, color:'#E8672A', sub: `${myDeals.length} deals`,
                onClick: () => openDrawer({
                  title: 'My Deals · Active pipeline', subtitle: `${myDeals.length} deals · EGP ${(myActivePipeline/1e6).toFixed(1)}M total`,
                  content: (
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      {myDeals.length === 0 ? <div style={{padding:20,color:'var(--text-tertiary)'}}>No deals.</div> :
                        myDeals.map(d => (
                          <div key={d.id} onClick={()=>navigate('/system/crm/deals')} style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,cursor:'pointer',background:'#fafbfc'}}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                              <div style={{fontWeight:700,fontSize:13}}>{d.leadName || d.lead} · {d.project}</div>
                              <div style={{fontSize:13,fontWeight:800,color:'var(--brand)',whiteSpace:'nowrap'}}>EGP {(d.value/1e6).toFixed(1)}M</div>
                            </div>
                            <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>{d.id} · Off Plan · {d.stage}{d.commissionLocked ? ' · 🔒 locked' : ''}{d.revenueRecognised ? ' · ✅ revenue recognised' : ''}</div>
                          </div>
                        ))}
                    </div>
                  ),
                })
              },
              { label:'TARGET PROGRESS',    value: targetProgress ? `${targetProgress.dealsPct}%` : '—', icon: TrendingUp, color:'#8b5cf6', sub: myTarget?.period || 'this month',
                onClick: () => navigate('/board/performance')
              },
            ].map(k => (
              <div
                key={k.label}
                onClick={k.onClick}
                style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,padding:'14px 16px',display:'flex',gap:12,alignItems:'center',cursor:'pointer',transition:'transform .15s, box-shadow .15s'}}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 16px rgba(0,0,0,.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
              >
                <div style={{width:38,height:38,borderRadius:10,background:`${k.color}1a`,color:k.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <k.icon size={18}/>
                </div>
                <div style={{minWidth:0,flex:1}}>
                  <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>{k.label}</div>
                  <div style={{fontSize:20,fontWeight:800,marginTop:2}}>{k.value}</div>
                  <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:2}}>{k.sub}</div>
                </div>
                <ChevronRight size={14} color="var(--text-tertiary)"/>
              </div>
            ))}
          </div>

          {/* Targets · Recent Activity · Announcements */}
          <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr 1fr',gap:14,marginBottom:24}}>
            {/* Targets card */}
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <TrendingUp size={16} color="var(--brand)"/>
                  <h3 style={{fontSize:14,fontWeight:700}}>Targets · {myTarget?.period || 'this month'}</h3>
                </div>
                <button className="btn btn-outline btn-sm" onClick={()=>navigate('/system/crm')}>Open CRM <ChevronRight size={12}/></button>
              </div>
              {targetProgress ? (
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  {[
                    { label:'Leads',          actual: myLeads.length,   target: myTarget.leadsTarget,    pct: targetProgress.leadsPct },
                    { label:'Deals',          actual: myDeals.length,   target: myTarget.dealsTarget,    pct: targetProgress.dealsPct },
                    { label:'Pipeline value', actual: `EGP ${(myActivePipeline/1e6).toFixed(1)}M`, target: `EGP ${(myTarget.pipelineTarget/1e6).toFixed(0)}M`, pct: targetProgress.pipelinePct },
                    { label:'Closed Won',     actual: myClosedWon,      target: myTarget.closedWonTarget, pct: targetProgress.closedPct },
                  ].map(t => (
                    <div key={t.label}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                        <span style={{fontWeight:600,color:'var(--text-primary)'}}>{t.label}</span>
                        <span style={{color:'var(--text-secondary)'}}><b>{t.actual}</b> / {t.target}</span>
                      </div>
                      <div style={{height:6,background:'#f1f5f9',borderRadius:3,overflow:'hidden'}}>
                        <div style={{width:`${t.pct}%`,height:'100%',background: t.pct >= 100 ? '#10b981' : t.pct >= 60 ? 'var(--brand)' : '#f59e0b',transition:'width .4s'}}/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{padding:'14px 0',fontSize:12,color:'var(--text-tertiary)'}}>No targets set for this period.</div>
              )}
            </div>

            {/* Recent Activity */}
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <Activity size={16} color="var(--brand)"/>
                <h3 style={{fontSize:14,fontWeight:700}}>Recent Activity</h3>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {myActivity.length === 0 ? (
                  <div style={{fontSize:12,color:'var(--text-tertiary)',padding:'10px 0'}}>No recent activity tracked.</div>
                ) : myActivity.map(a => (
                  <div key={a.id || `${a.timestamp}-${a.action}`} style={{display:'flex',gap:10,fontSize:12,paddingBottom:10,borderBottom:'1px solid var(--border)'}}>
                    <CheckCircle2 size={14} color="var(--brand)" style={{flexShrink:0,marginTop:2}}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontWeight:600,color:'var(--text-primary)'}}>{a.action}</div>
                      <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.target || a.detail || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <Megaphone size={16} color="var(--brand)"/>
                <h3 style={{fontSize:14,fontWeight:700}}>Announcements</h3>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {announcements.map(a => (
                  <div key={a.id} style={{padding:'10px 12px',background: a.read ? '#fafbfc' : 'var(--brand-tint)',border:'1px solid var(--border)',borderRadius:8,fontSize:12,lineHeight:1.5}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:4}}>
                      <span style={{fontWeight:700,color:'var(--text-primary)'}}>{a.title}</span>
                      {a.priority === 'high' && <span style={{fontSize:9,fontWeight:700,color:'#fff',background:'var(--brand)',padding:'2px 6px',borderRadius:4,letterSpacing:'.05em'}}>HIGH</span>}
                    </div>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:4}}>{a.author} · {a.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The My Team panel for Team Leaders moved to the CRM
              (/system/crm/team) so it lives alongside leads + deals. */}

          {/* Upcoming Training reminder */}
          {nextTraining && (
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'14px 20px',marginBottom:24,display:'flex',gap:14,alignItems:'center'}}>
              <div style={{width:40,height:40,borderRadius:10,background:'#fef3c7',color:'#92400e',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <GraduationCap size={18}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>Upcoming Training · {nextTraining.title}</div>
                <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>Due {nextTraining.due} · {nextTraining.progress}% complete · open in Homes Academy</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={()=>navigate('/board/learning')}>Continue learning <ChevronRight size={12}/></button>
            </div>
          )}
        </>
      )}

      {/* ── Non-sales-track role dashboards ────────────────────────────
          Marketing, Sales Manager, Sales Director, HR Recruiter, Finance
          Officer, Marketplace Admin, Executive, System Admin, and Super
          Admin (backofficeAdmin) all get a dedicated cockpit rendered by
          RoleDashboard (KPIs · Today's Focus · Activity · Quick Actions).
          isAgent is false for all of them, so this section fills the gap
          where the page previously rendered only the welcome hero. */}
      {!isAgent && <RoleDashboard />}
    </div>
  );
};
