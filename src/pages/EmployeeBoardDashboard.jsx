import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Target, Building2, GraduationCap, ShieldCheck, FileCheck2, BellRing, User, ChevronRight, KeyRound, Award, UsersRound, CalendarClock, Mail } from 'lucide-react';

// Role → which federated systems are accessible (BRD §6 / §11 entitlements).
// Note: the public Marketplace (homes.com.eg) is consumer-facing; the Marketplace
// Dashboard (admin + analytics) is exclusively accessible by the Marketplace
// Dashboard Admin role — no other persona, including agents and Super Admin,
// has access to its modules.
const ROLE_ACCESS = {
  backofficeAdmin:  ['backoffice','crm','matrix'],
  salesManager:     ['crm'],
  salesDirector:    ['crm','backoffice'],
  hrRecruiter:      ['backoffice'],
  financeOfficer:   ['backoffice'],
  marketplaceAdmin: ['marketplaceDash'],   // EXCLUSIVE access to Marketplace Dashboard
  executive:        ['backoffice'],
  systemAdmin:      ['backoffice'],
  agent:            ['crm','matrix'],      // Agents explicitly do NOT see marketplaceDash
  agentActive:      ['crm','matrix'],      // Same scope as agent — but with onboarding complete (CRM unlocked)
  teamLeader:       ['crm','matrix'],
};

export const EmployeeBoardDashboard = () => {
  const { persona, personaKey, state, toast, writeAudit } = useApp();
  const navigate = useNavigate();
  const [splash, setSplash] = useState(null);

  const allowed = ROLE_ACCESS[personaKey] || [];
  const isAgent = persona.hub === 'agent'; // agent or teamLeader
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
  // Weighted: training avg 60% + interview/HR score 40%. For demo, derive from completed courses.
  const trainingAvg = state.training.filter(c=>c.required && c.score).reduce((s,c)=>s+c.score,0)
    / Math.max(1, state.training.filter(c=>c.required && c.score).length);
  const interviewScore = onboardingComplete ? 88 : 82;
  const agentScore = Math.round((trainingAvg || 0) * 0.6 + interviewScore * 0.4);

  // Team Assignment (Platform §2.4) — derive from persona context.
  const teamAssignment = isAgent ? {
    team: personaKey === 'teamLeader' ? 'Alpha (Lead)' : 'Alpha',
    teamLeader: personaKey === 'teamLeader' ? '— (you are the TL)' : 'Omar Sherif',
    salesManager: 'Sales Manager',
    salesDirector: 'Tarek Amin',
    branch: persona.scope.includes('New Cairo') ? 'New Cairo' : '6th October',
    introCall: onboardingComplete ? 'Completed 2024-01-12' : 'Scheduled · Tomorrow 10:30 AM',
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

  // For agent personas, gate CRM/Matrix access on onboarding completion (BRD §6.1 training gates).
  const isLockedForAgent = (key) => {
    if (!isAgent) return false;
    if (onboardingComplete) return false;
    return ['crm','matrix'].includes(key);
  };

  const launchSSO = (system, target) => {
    setSplash(system);
    writeAudit('SSO Launch', `${system} (federated)`, 'Security', `Token issued from Employee Board`);
    setTimeout(() => {
      setSplash(null);
      toast(`Connected to ${system} via Microsoft Entra SSO`);
      if (target) navigate(target);
    }, 900);
  };

  // Federated systems only (those launched via SSO from the Employee Board).
  const ssoTiles = [
    {
      key: 'crm',
      icon: <Target size={22}/>,
      title: 'CRM',
      desc: 'Lead management, deals pipeline, tasks, calendar. Federated system.',
      onClick: () => launchSSO('CRM', '/system/crm'),
    },
    {
      key: 'marketplaceDash',
      icon: <Building2 size={22}/>,
      title: 'Marketplace Dashboard',
      desc: 'Internal admin & analytics for the public homes.com.eg marketplace — inventory publishing, source mapping, funnel KPIs.',
      onClick: () => launchSSO('Marketplace Dashboard', '/system/marketplace-dashboard'),
    },
    {
      key: 'backoffice',
      icon: <ShieldCheck size={22}/>,
      title: 'Backoffice Admin Portal',
      desc: 'Governance, HR, finance, audit, role-based entitlements.',
      onClick: () => launchSSO('Backoffice Admin Portal', '/backoffice/dashboard'),
    },
    {
      key: 'matrix',
      icon: <KeyRound size={22}/>,
      title: 'Matrix EGMLS',
      desc: 'Egyptian MLS — listings, market data, property search.',
      onClick: () => launchSSO('Matrix EGMLS'),
    },
  ];

  // Internal Employee Board workspaces.
  // Viva Learning is agent-only (training gates BRD §6.1 / §8.11 are scoped to agents).
  const internalTiles = [
    ...(isAgent ? [{
      key: 'learning',
      icon: <GraduationCap size={22}/>,
      title: 'Viva Learning',
      desc: 'Required training and certifications. Linked to access gates per BRD §6.1.',
      onClick: () => navigate('/board/learning'),
    }] : []),
    {
      key: 'docs',
      icon: <FileCheck2 size={22}/>,
      title: 'My Documents',
      desc: 'Upload and track your required compliance documents.',
      onClick: () => navigate('/board/documents'),
    },
  ];

  if (splash) {
    return (
      <div className="sso-splash">
        <div className="ring" />
        <h2>Launching {splash}…</h2>
        <p>Establishing federated session via Microsoft Entra</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24,gap:24}}>
        <div>
          <h1 style={{fontSize:28,fontWeight:800,color:'var(--text-primary)'}}>Welcome back, {persona.label.split(' ')[0]}</h1>
          <p style={{color:'var(--text-secondary)',marginTop:4,fontSize:14}}>
            {isAgent ? `${persona.role || 'Licensed Agent'} · ${persona.scope}${persona.mls ? ` · MLS ID: ${persona.mls}` : ''}` : `${persona.label} · ${persona.scope}`}
          </p>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <span className="badge badge-success" style={{padding:'6px 12px'}}>● {isAgent ? 'Approved Agent' : 'Signed in'}</span>
          <span style={{fontSize:11,color:'var(--text-tertiary)'}}>{persona.email}</span>
        </div>
      </div>

      {/* ── Agent-only onboarding journey + status (BRD §8.9) ── */}
      {isAgent && (
        <>
          <div className="kpi-grid kpi-grid-5" style={{marginBottom:18}}>
            {(onboardingComplete ? [
              ['ONBOARDING','100%','complete','green'],
              ['TRAINING','All done','complete','green'],
              ['DOCUMENTS', `${docsTotal}/${docsTotal}`,'complete','green'],
              ['AGREEMENT','Signed','complete','green'],
              ['MLS ACCESS', persona.mls || 'Active','active','green'],
            ] : [
              ['ONBOARDING', `${Math.round(((docsApproved/docsTotal)*0.4 + (completedReqTraining/totalReqTraining)*0.4 + 0.2) * 100)}%`, 'in-progress', 'amber'],
              ['TRAINING', `${completedReqTraining}/${totalReqTraining} done`, trainingDone ? 'completed' : 'in-progress', trainingDone ? 'green' : 'amber'],
              ['DOCUMENTS', `${docsApproved}/${docsTotal}`, docsDone ? 'completed' : 'in-progress', docsDone ? 'green' : 'amber'],
              ['AGREEMENT', 'Signed', 'completed', 'green'],
              ['MLS ACCESS', 'Pending', 'pending', 'gray'],
            ]).map(([label,value,status,color])=>(
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
              <div style={{marginTop:14,padding:'10px 12px',background:'var(--brand-tint)',borderRadius:8,display:'flex',alignItems:'center',gap:8,fontSize:12}}>
                <CalendarClock size={14} color="var(--brand)"/>
                <span><b>Intro call:</b> {teamAssignment.introCall}</span>
              </div>
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
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>Interview Score</div>
                  <div style={{fontWeight:500,marginTop:2}}>{interviewScore}%</div>
                </div>
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

      <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px',marginBottom:28,display:'flex',gap:14,alignItems:'center'}}>
        <div style={{width:42,height:42,borderRadius:10,background:'var(--brand-tint)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <KeyRound size={20} color="var(--brand)"/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)'}}>
            {isAgent && !onboardingComplete
              ? `${ssoTiles.filter(t=>allowed.includes(t.key) && !isLockedForAgent(t.key)).length} of ${ssoTiles.filter(t=>allowed.includes(t.key)).length} systems unlocked — finish onboarding to unlock the rest`
              : `You have access to ${ssoTiles.filter(t=>allowed.includes(t.key)).length} of ${ssoTiles.length} federated systems`}
          </div>
          <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>
            {isAgent && !onboardingComplete
              ? 'CRM and Matrix EGMLS unlock once your training and document gates are cleared by Backoffice (BRD §6.1).'
              : isAgent
                ? `All systems active — onboarding complete.`
                : `Access is governed by your role (${persona.label}). Internal Employee Board workspaces are always available.`}
          </div>
        </div>
      </div>

      <h3 style={{fontSize:14,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:14}}>Federated Systems · SSO</h3>
      <div className="launcher-grid" style={{marginBottom:32}}>
        {ssoTiles.map(t => {
          const has = allowed.includes(t.key);
          const trainingLocked = isLockedForAgent(t.key);
          const isLocked = !has || trainingLocked;
          return (
            <div
              key={t.key}
              className={`launcher-tile ${isLocked ? 'locked' : ''}`}
              onClick={isLocked ? undefined : t.onClick}
              title={trainingLocked ? 'Unlocks once your onboarding steps are complete' : (has ? '' : 'Not available for your role')}
            >
              <div className="launcher-tile-icon">{t.icon}</div>
              <h3>
                {t.title}
                {!has && <span style={{fontSize:10,fontWeight:700,color:'var(--text-tertiary)',background:'#f3f4f6',padding:'2px 6px',borderRadius:4}}>NO ACCESS</span>}
                {has && trainingLocked && <span style={{fontSize:10,fontWeight:700,color:'var(--warning)',background:'var(--warning-bg)',padding:'2px 6px',borderRadius:4}}>LOCKED</span>}
              </h3>
              <p>{trainingLocked ? 'Locked until your training and document gates are cleared by Backoffice.' : t.desc}</p>
              <div className="meta">
                <span>Federated · launched via Microsoft Entra SSO</span>
                {!isLocked && <span className="sso-tag">SSO</span>}
              </div>
            </div>
          );
        })}
      </div>

      <h3 style={{fontSize:14,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:14}}>Employee Board · Internal Workspaces</h3>
      <div className="launcher-grid">
        {internalTiles.map(t => (
          <div key={t.key} className="launcher-tile" onClick={t.onClick}>
            <div className="launcher-tile-icon">{t.icon}</div>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
            <div className="meta">
              <span>Internal · always available</span>
              <span className="internal-tag">Internal</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:28,padding:18,background:'#fff',border:'1px solid var(--border)',borderRadius:12,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:18}}>
        <div onClick={()=>navigate('/board/profile')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
          <User size={18} color="var(--text-secondary)"/>
          <div><div style={{fontSize:13,fontWeight:600}}>Profile</div><div style={{fontSize:11,color:'var(--text-tertiary)'}}>Personal & employment info</div></div>
        </div>
        <div onClick={()=>navigate('/board/notifications')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
          <BellRing size={18} color="var(--text-secondary)"/>
          <div><div style={{fontSize:13,fontWeight:600}}>Notifications</div><div style={{fontSize:11,color:'var(--text-tertiary)'}}>Onboarding & task updates</div></div>
        </div>
        <div onClick={()=>navigate('/board/performance')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
          <ChevronRight size={18} color="var(--text-secondary)"/>
          <div><div style={{fontSize:13,fontWeight:600}}>Performance</div><div style={{fontSize:11,color:'var(--text-tertiary)'}}>Sales metrics & productivity</div></div>
        </div>
      </div>
    </div>
  );
};
