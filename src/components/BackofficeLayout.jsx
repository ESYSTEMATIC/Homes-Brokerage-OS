import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HomesLogoFull } from './HomesLogo';
import { LayoutDashboard, Users, UsersRound, ShieldCheck, BadgeDollarSign, UserSquare2, Database, ChevronDown, Bell, Building2, ScrollText, Settings, Briefcase, AlertTriangle, KeyRound, LogOut, ArrowLeft, Inbox, FileText } from 'lucide-react';

const Sub = ({ label, icon, open, toggle, children }) => (
  <>
    <button className="sidebar-link" onClick={toggle}>{icon}<span>{label}</span><ChevronDown size={14} className={`sidebar-chevron ${open?'open':''}`}/></button>
    {open && <div className="sidebar-sub">{children}</div>}
  </>
);
const Link = ({ to, children }) => <NavLink to={to} className={({isActive})=>`sidebar-link ${isActive?'active':''}`}>{children}</NavLink>;

const SystemHeader = ({ label, sub }) => (
  <div style={{padding:'14px 12px 4px',display:'flex',alignItems:'center',gap:6}}>
    <div style={{flex:1}}>
      <div style={{fontSize:9,fontWeight:800,color:'#E8672A',textTransform:'uppercase',letterSpacing:'.1em'}}>{label}</div>
      {sub && <div style={{fontSize:9,color:'#475569',marginTop:1}}>{sub}</div>}
    </div>
    <KeyRound size={11} color="#E8672A" />
  </div>
);

export const BackofficeLayout = ({ children }) => {
  const { persona, personaKey, signOut, state, openDrawer, toast, writeAudit } = useApp();
  const location = useLocation();
  const [agentsOpen, setAgentsOpen] = useState(true);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const [masterOpen, setMasterOpen] = useState(false);

  // ── Persona access matrix (Backoffice Admin Portal scope only) ──
  // CRM, Marketplace, Marketplace Dashboard are SEPARATE federated systems
  // launched from the Employee Board via SSO and are not part of this portal.
  //
  // 'compliance' = Training Compliance module. Training + agent scoring are
  // sales-track concerns (Homes Academy gates CRM access), so the module is
  // restricted to sales management (Director) + Super Admin (audit). HR no
  // longer surfaces this — onboarding documents are still in HR via 'operations'.
  // Business-team review (May 2026): Finance Officer scope tightened to
  // its minimum needs — Dashboard + Financial Mgmt only. Director Inbox,
  // Audit Logs and Executive Dashboard are cross-functional / governance
  // surfaces and no longer belong to Finance.
  //
  // 'inbox' is a new access key — Director Inbox unions Finance
  // commissions + Deal overrides, so it lives with roles that own
  // cross-functional approval queues (Super Admin, Director, Executive),
  // not with everyone who has 'data' read access.
  const accessMatrix = {
    backofficeAdmin: 'ALL',
    salesManager:    ['dashboard', 'operations', 'recruitment'],
    salesDirector:   ['dashboard', 'operations', 'recruitment', 'data', 'compliance', 'inbox'],
    hrRecruiter:     ['dashboard', 'operations', 'hr', 'recruitment'],
    financeOfficer:  ['dashboard', 'finance'],
    // Marketplace Dashboard Admin only operates inside the Marketplace Dashboard
    // federated system — not the Backoffice Admin Portal.
    marketplaceAdmin: [],
    executive:       ['dashboard', 'data', 'finance', 'hr', 'inbox'],
    systemAdmin:     ['dashboard', 'system', 'master', 'data'],
  };

  const hasAccess = (module) => {
    if (personaKey === 'backofficeAdmin') return true;
    return (accessMatrix[personaKey] || []).includes(module);
  };

  const openNotifications = () => openDrawer({
    title: 'Activity & Audit Feed', subtitle: `${state.audit.length} system events tracked`,
    content: (
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {state.audit.slice(0,15).map(a => (
          <div key={a.id} style={{padding:'12px 14px',border:'1px solid var(--border)',borderRadius:8,background:'#fafbfc'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
              <span style={{fontSize:12,fontWeight:700,color:'var(--text-primary)'}}>{a.action}</span>
              <span className="badge badge-info" style={{fontSize:9}}>{a.module}</span>
            </div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>{a.target}</div>
            <div style={{fontSize:11,color:'var(--text-tertiary)'}}>{a.timestamp} · {a.actor}</div>
          </div>
        ))}
      </div>
    ),
  });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><HomesLogoFull /></div>
        <nav className="sidebar-nav">
          <SystemHeader label="Backoffice Admin Portal" sub="Governance · HR · Finance · Audit" />

          {hasAccess('dashboard') && <Link to="/backoffice/dashboard"><LayoutDashboard size={16}/>Dashboard</Link>}

          {hasAccess('operations') && (
            <>
              <Sub label="Agents" icon={<Users size={16}/>} open={agentsOpen} toggle={()=>setAgentsOpen(!agentsOpen)}>
                <Link to="/backoffice/agents">Agents List</Link>
                <Link to="/backoffice/onboarding">Onboarding</Link>
                <Link to="/backoffice/documents">Documents Review</Link>
              </Sub>
              {/* Employees — was two pages (Staff Management + Employee
                  Profiles); merged into one canonical surface in May 2026. */}
              <Link to="/backoffice/staff"><UsersRound size={16}/>Employees</Link>
            </>
          )}

          {hasAccess('compliance') && (
            <Link to="/backoffice/training"><ShieldCheck size={16}/>Training Compliance</Link>
          )}

          {(hasAccess('finance') || hasAccess('hr')) && (
            <>
              {hasAccess('finance') && (
                <Sub label="Financial Mgmt" icon={<BadgeDollarSign size={16}/>} open={financeOpen} toggle={()=>setFinanceOpen(!financeOpen)}>
                  <Link to="/backoffice/finance/overview">Overview</Link>
                  <Link to="/backoffice/finance/deals-revenue">Deals & Revenue</Link>
                  <Link to="/backoffice/finance/commission">Commission Engine</Link>
                </Sub>
              )}
              {/* The HR submenu used to contain only Employee Profiles, which
                  is now the merged "Employees" link in the Agents group above.
                  HR-specific entry points (Recruitment, Onboarding, Documents)
                  live in their own access groups. */}
            </>
          )}

          {hasAccess('recruitment') && (
            <>
              <Link to="/backoffice/recruitment"><Users size={16}/>Candidate Pipeline</Link>
              <Link to="/backoffice/jobs"><Briefcase size={16}/>Job Vacancies</Link>
            </>
          )}

          {(hasAccess('master') || hasAccess('data')) && (
            <SystemHeader label="Data, Reporting & Master" />
          )}

          {hasAccess('master') && (
            <Sub label="Master Data" icon={<Database size={16}/>} open={masterOpen} toggle={()=>setMasterOpen(!masterOpen)}>
              {/* Property alternatives — used when EGMLS doesn't carry the
                  developer / compound / project, or when the brokerage needs a
                  local override. Listings, unit types, cities and area lookups
                  are sourced from EGMLS and are not maintained here. */}
              <div style={{fontSize:9,fontWeight:700,color:'var(--sidebar-section)',textTransform:'uppercase',padding:'8px 10px 3px',letterSpacing:'.08em'}}>Property Alternatives</div>
              <Link to="/backoffice/master/developers">Developers</Link>
              <Link to="/backoffice/master/projects">Projects</Link>
              <Link to="/backoffice/master/compounds">Compounds</Link>
              <div style={{fontSize:9,fontWeight:700,color:'var(--sidebar-section)',textTransform:'uppercase',padding:'8px 10px 3px',letterSpacing:'.08em'}}>Organization</div>
              <Link to="/backoffice/master/branches">Branches</Link>
              <Link to="/backoffice/master/teams">Teams</Link>
              <Link to="/backoffice/master/emp-categories">Employment Categories</Link>
              <div style={{fontSize:9,fontWeight:700,color:'var(--sidebar-section)',textTransform:'uppercase',padding:'8px 10px 3px',letterSpacing:'.08em'}}>Finance & Sales</div>
              <Link to="/backoffice/master/comm-policies">Commission Policies</Link>
              <div style={{fontSize:9,fontWeight:700,color:'var(--sidebar-section)',textTransform:'uppercase',padding:'8px 10px 3px',letterSpacing:'.08em'}}>Other</div>
              <Link to="/backoffice/master/lead-sources">Lead Sources</Link>
            </Sub>
          )}

          {hasAccess('inbox') && (
            <Link to="/backoffice/inbox"><Inbox size={16}/>Director Inbox</Link>
          )}

          {hasAccess('data') && (
            <>
              <Link to="/backoffice/audit"><ScrollText size={16}/>Audit Logs</Link>
              <Link to="/backoffice/executive"><Building2 size={16}/>Executive Dashboard</Link>
            </>
          )}

          {hasAccess('system') && (
            <>
              <SystemHeader label="System Admin" />
              <Link to="/backoffice/roles"><ShieldCheck size={16}/>Roles & Permissions</Link>
              <Link to="/backoffice/departments"><Building2 size={16}/>Departments</Link>
              <Link to="/backoffice/settings"><Settings size={16}/>Settings</Link>
            </>
          )}

          <div style={{margin:'18px 12px 14px',padding:'12px 14px',background:'rgba(232,103,42,.08)',border:'1px solid rgba(232,103,42,.2)',borderRadius:8}}>
            <div style={{fontSize:9,fontWeight:800,color:'#E8672A',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:6}}>Federated Systems</div>
            <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.5}}>
              CRM, Marketplace, and Matrix EGMLS are independent platforms federated via SSO. All employees launch them from the Employee Board.
            </div>
          </div>
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Sign Out — calls signOut() from useApp(). The previous `logout()`
              reference was undefined which made this button silently crash.
              The redundant topbar Sign Out was also removed in the same
              pass (May 2026 review) — sidebar is the single source of truth. */}
          <button
            className="sidebar-link"
            style={{ color: 'var(--text-tertiary)' }}
            onClick={() => {
              toast('Signing out…', 'info');
              writeAudit('SSO Logout', persona.label, 'Security');
              setTimeout(() => signOut(), 350);
            }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button className="topbar-action" onClick={()=>{ window.location.hash='#/board/dashboard'; }}><ArrowLeft size={13}/> Employee Board</button>
          </div>
          <div className="topbar-right">
            <div className="topbar-status"><div className="topbar-status-dot"></div>SSO via Microsoft Entra · session active</div>
            <div className="topbar-bell" onClick={openNotifications} title="Activity & audit feed"><Bell size={18}/><span className="topbar-bell-badge">{Math.min(state.audit.length, 99)}</span></div>
            <div className="topbar-user">
              <div className="topbar-user-info"><div className="topbar-user-name">{persona.label}</div><div className="topbar-user-email">{persona.scope}</div></div>
              <NavLink to="/backoffice/profile" className="topbar-avatar">{persona.label.substring(0,2).toUpperCase()}</NavLink>
            </div>
            {/* Topbar Sign Out removed (May 2026 review) — the sidebar Sign
                Out is the canonical exit; one button, one place. */}
          </div>
        </header>
        <div className="page-content"><div className="page-inner animate-fade-in" key={location.pathname}>{children}</div></div>
      </main>
    </div>
  );
};
