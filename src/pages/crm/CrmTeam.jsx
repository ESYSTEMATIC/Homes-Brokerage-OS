// ═══════════════════════════════════════════════════════════════
// CRM → Team — management-only page
// ───────────────────────────────────────────────────────────────
// Surfaces the same TeamPanel used on the Employee Board, but inside
// the CRM where managers actually work. Visible only to:
//   • Sales Director — sees all sales staff under them
//   • Sales Manager  — sees TLs + agents under them
//   • Team Leader    — sees agents in their team
// Everyone else is bounced back to the CRM dashboard.
//
// Also surfaces "Intro calls you own" — auto-spawned the moment an offer
// is accepted. The owner (Team Leader / Sales Manager) gets a click-able
// row per call with Join Teams / Mark Completed / Reschedule actions.
// ═══════════════════════════════════════════════════════════════
import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { CalendarClock, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeamPanel, TeamMemberSummary, getReports } from '../../components/RoleDashboard';

const MGMT_ROLES = ['salesDirector', 'salesManager', 'teamLeader'];

export const CrmTeam = () => {
  const { state, personaKey, persona, openDrawer, openModal, updateItem, toast } = useApp();

  if (!MGMT_ROLES.includes(personaKey)) {
    return <Navigate to="/system/crm" replace />;
  }

  // Resolve the signed-in user's name in the staff roster.
  // For salesDirector / salesManager / teamLeader the persona.label is set to
  // a real staff name in the seed (Tarek Amin / Nour El-Din / Omar Sherif).
  const directorName = (state.staff || []).find(s => s.type === 'Sales Director')?.name || 'Tarek Amin';
  const managerName  = persona.label === 'Sales Manager'
    ? ((state.staff || []).find(s => s.type === 'Sales Manager' && s.team === 'Alpha')?.name || 'Nour El-Din')
    : persona.label;
  const tlName       = persona.label;

  const myName =
    personaKey === 'salesDirector' ? directorName
    : personaKey === 'salesManager' ? managerName
    : tlName;

  const myReports = getReports(myName, state.staff || []);
  // Root of the org chart — the signed-in manager's own staff record.
  const rootMember = (state.staff || []).find(s => s.name === myName);

  // Intro calls I own — scheduled for new hires entering onboarding.
  // Visible to whichever manager was set as the call's owner (typically the
  // new hire's reporting line / hiring manager).
  const myIntroCalls = useMemo(() => {
    const all = (state.introCalls || []).filter(c => c.owner === myName);
    const STATUS_ORDER = { 'Scheduled': 0, 'No-Show': 1, 'Cancelled': 2, 'Completed': 3 };
    return [...all].sort((a, b) => {
      const sa = STATUS_ORDER[a.status] ?? 9;
      const sb = STATUS_ORDER[b.status] ?? 9;
      if (sa !== sb) return sa - sb;
      const ta = a.scheduledAt || '';
      const tb = b.scheduledAt || '';
      if (a.status === 'Scheduled') return ta.localeCompare(tb);
      return tb.localeCompare(ta);
    });
  }, [state.introCalls, myName]);

  // Open the intro-call drawer (mirrors the Employee Board version).
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
          {call.notes && (
            <div>
              <div style={{fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6}}>Agenda / notes</div>
              <div style={{padding:'10px 12px', background:'#fafbfc', border:'1px solid var(--border)', borderRadius:8, fontSize:13, lineHeight:1.55, color:'var(--text-primary)'}}>{call.notes}</div>
            </div>
          )}
          {isOwner && call.id && call.status === 'Scheduled' && (
            <div style={{display:'flex', gap:8, flexWrap:'wrap', paddingTop:12, borderTop:'1px solid var(--border)'}}>
              <a className="btn btn-brand btn-sm" href="https://teams.microsoft.com/" target="_blank" rel="noopener noreferrer">Join call (Teams)</a>
              <button className="btn btn-success btn-sm" onClick={() => writeStatus('Completed')}>Mark Completed</button>
              <button className="btn btn-outline btn-sm" onClick={reschedule}>Reschedule</button>
              <button className="btn btn-outline btn-sm" style={{color:'#b45309'}} onClick={() => writeStatus('No-Show')}>No-show</button>
              <button className="btn btn-outline btn-sm" style={{color:'var(--danger)'}} onClick={() => writeStatus('Cancelled')}>Cancel</button>
            </div>
          )}
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
        </div>
      ),
    });
  };

  const subtitleByRole = {
    salesDirector: `Org chart of all sales staff under you · click any node for their full picture`,
    salesManager:  `Org chart for ${myName} · Team Leaders + Sales Agents`,
    teamLeader:    `Your team · ${myReports.length} agent${myReports.length === 1 ? '' : 's'} reporting to you`,
  };
  const titleByRole = {
    salesDirector: 'My Organization',
    salesManager:  'My Team',
    teamLeader:    'My Team',
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{titleByRole[personaKey]}</h1>
        <p className="page-subtitle">{subtitleByRole[personaKey]}</p>
      </div>

      <TeamPanel
        title={titleByRole[personaKey]}
        subtitle="Live org chart · KPIs derived from current CRM data"
        root={rootMember}
        members={myReports}
        leads={state.leads || []}
        deals={state.deals || []}
        tasks={state.tasks || []}
        targets={state.targets || {}}
        onMemberClick={(m) => openDrawer({
          title: m.name, subtitle: `${m.id} · ${m.title} · ${m.branch}`,
          content: <TeamMemberSummary member={m} leads={state.leads || []} deals={state.deals || []} tasks={state.tasks || []}/>,
        })}
      />

      {/* Intro Calls panel — scheduled for new hires in onboarding.
          Shows every record where the signed-in manager is the owner. */}
      {myIntroCalls.length > 0 && (
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px',marginTop:24}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,gap:10,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:'var(--brand-tint)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <CalendarClock size={18} color="var(--brand)"/>
              </div>
              <div>
                <h3 style={{fontSize:14,fontWeight:700,margin:0}}>Intro calls you own</h3>
                <p style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>
                  Auto-spawned the moment an offer is accepted · {myIntroCalls.filter(c=>c.status==='Scheduled').length} upcoming
                </p>
              </div>
            </div>
            <span className="badge badge-gray" style={{fontFamily:'monospace'}}>{myIntroCalls.length} total</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {myIntroCalls.map(call => {
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
    </div>
  );
};
