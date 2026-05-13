// ═══════════════════════════════════════════════════════════════
// Product & Services — role-gated discovery surface for every system
// the signed-in user is entitled to. Replaces the inline tiles on the
// Employee Board as the canonical "what can I launch" page.
// Stakeholder ask (08 May 2026, item 2):
//   • Move system feature tiles out of the dashboard.
//   • Users only see items they have permission to access.
//   • Homes Academy is listed here as a service card too.
// ═══════════════════════════════════════════════════════════════
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Target, Building2, ShieldCheck, KeyRound, GraduationCap, Globe, ArrowRight, FileText } from 'lucide-react';

const BACKOFFICE_ROLES = ['backofficeAdmin','salesDirector','hrRecruiter','financeOfficer','executive','systemAdmin'];

export const AgentServices = () => {
  const { persona, personaKey, toast, writeAudit, triggerSsoLaunch } = useApp();
  const navigate = useNavigate();
  const onboardingComplete = persona.onboardingComplete === true;
  const salesTrack = persona.salesTrack === true;
  const isMarketing = personaKey === 'marketing';

  const launchSSO = (system, target) => {
    if (target && target.startsWith('http')) {
      writeAudit('External redirect', system, 'External', `Opened ${target}`);
      toast(`Redirecting to ${system} — external system`, 'info');
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }
    triggerSsoLaunch(system, target ? `#${target}` : undefined);
  };

  // Each card: which personas / persona-features unlock it.
  // `visible` decides whether the card renders at all (permission gate).
  // `enabled` decides whether the user can click it right now (training gate).
  // `group` clusters cards under section headers (11-May stakeholder ask:
  //   employee development content like Scorecard sits under a "My Development"
  //   group inside Products & Services).
  const services = [
    {
      key: 'crm',
      group: 'Systems',
      icon: <Target size={22}/>,
      title: 'CRM',
      desc: 'Lead management, deals pipeline, tasks, calendar.',
      tag: 'Federated · SSO',
      visible: salesTrack || isMarketing || BACKOFFICE_ROLES.includes(personaKey) || personaKey === 'executive',
      enabled: !salesTrack || onboardingComplete,
      onClick: () => launchSSO('CRM', '/system/crm'),
      lockedNote: 'Unlocks after onboarding training is complete.',
    },
    {
      key: 'academy',
      group: 'My Development',
      icon: <GraduationCap size={22}/>,
      title: 'Homes Academy',
      desc: 'Mandatory and optional courses. Tracks your progress and gates CRM access.',
      tag: 'Internal',
      visible: salesTrack,
      enabled: true,
      onClick: () => navigate('/board/learning'),
    },
    // Scorecard tile removed — onboarding & HR score live on the Profile page,
    // sales analytics live on the dedicated Performance page (sidebar link).
    // No reason to surface it as a separate service here.
    {
      key: 'marketplaceDash',
      group: 'Systems',
      icon: <Building2 size={22}/>,
      title: 'Marketplace Dashboard',
      desc: 'Internal admin & analytics for the public homes.com.eg marketplace.',
      tag: 'Federated · SSO',
      visible: personaKey === 'marketplaceAdmin',
      enabled: true,
      onClick: () => launchSSO('Marketplace Dashboard', '/system/marketplace-dashboard'),
    },
    {
      key: 'backoffice',
      group: 'Systems',
      icon: <ShieldCheck size={22}/>,
      title: 'Backoffice Admin Portal',
      desc: 'Governance, HR, finance, audit, master data.',
      tag: 'Federated · SSO',
      visible: BACKOFFICE_ROLES.includes(personaKey),
      enabled: true,
      onClick: () => launchSSO('Backoffice Admin Portal', '/backoffice/dashboard'),
    },
    {
      key: 'matrix',
      group: 'Systems',
      icon: <KeyRound size={22}/>,
      title: 'Matrix EGMLS',
      desc: 'Egyptian MLS — listings, market data, property search. External provider (CoreLogic SSO pending).',
      tag: 'External · Redirect',
      visible: salesTrack || BACKOFFICE_ROLES.includes(personaKey),
      enabled: true,
      onClick: () => launchSSO('Matrix EGMLS', 'https://agents.egymls.com/auth/login/'),
    },
    {
      key: 'marketplace',
      group: 'Public',
      icon: <Globe size={22}/>,
      title: 'Public Marketplace',
      desc: 'Consumer-facing homes.com.eg surface. Always available to every signed-in employee.',
      tag: 'Public',
      visible: true,
      enabled: true,
      onClick: () => navigate('/marketplace'),
    },
    {
      key: 'documents',
      group: 'My Development',
      icon: <FileText size={22}/>,
      title: 'My Documents',
      desc: 'Upload and track your required compliance documents (with expiry tracking).',
      tag: 'Internal',
      visible: true,
      enabled: true,
      onClick: () => navigate('/board/documents'),
    },
  ];

  // 08-May stakeholder ask: agents only see components they can actually use
  // right now — locked items (training-gated, role-gated) are hidden entirely
  // instead of rendering dimmed with a padlock. Once onboarding clears, the
  // newly-unlocked tiles appear automatically.
  const visible = services.filter(s => s.visible && s.enabled);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:24,gap:14,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:26,fontWeight:800}}>Product &amp; Services</h1>
          <p style={{color:'var(--text-secondary)',marginTop:6,fontSize:13}}>Federated systems, internal workspaces, and external providers you can launch.</p>
        </div>
        <span style={{fontSize:12,color:'var(--text-tertiary)'}}>{visible.length} service{visible.length===1?'':'s'} available</span>
      </div>

      {/* Flat grid — no group headers. Cards appear in declaration order. */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
        {visible.map(s => {
          const tagColor =
            s.tag === 'External · Redirect' ? '#94a3b8'
            : s.tag === 'Public'            ? '#0ea5e9'
            : s.tag === 'Internal'          ? '#10b981'
            : 'var(--brand)';
          return (
            <div
              key={s.key}
              onClick={s.enabled ? s.onClick : undefined}
              style={{
                background:'#fff', border:'1px solid var(--border)', borderRadius:14,
                padding:'18px 20px',
                cursor: s.enabled ? 'pointer' : 'not-allowed',
                opacity: s.enabled ? 1 : 0.55,
                transition:'transform .15s, box-shadow .15s',
                display:'flex', flexDirection:'column', gap:10, minHeight:160,
              }}
              onMouseEnter={e => { if (s.enabled) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 16px rgba(0,0,0,.06)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
            >
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:42,height:42,borderRadius:10,background:'var(--brand-tint)',color:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center'}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:'var(--text-primary)'}}>{s.title}</div>
                  <div style={{fontSize:10,fontWeight:700,color:tagColor,textTransform:'uppercase',letterSpacing:'.06em',marginTop:3}}>{s.tag}</div>
                </div>
                {s.enabled && <ArrowRight size={16} color="var(--text-tertiary)"/>}
              </div>
              <p style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.5,flex:1}}>{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
