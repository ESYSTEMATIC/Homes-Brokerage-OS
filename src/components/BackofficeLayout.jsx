import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HomesLogoFull } from './HomesLogo';
import { LayoutDashboard, Users, UsersRound, ShieldCheck, BadgeDollarSign, UserSquare2, Database, ChevronDown, Bell, Building2, ScrollText, Settings, Briefcase, AlertTriangle, KeyRound, LogOut, ArrowLeft } from 'lucide-react';

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
  const accessMatrix = {
    backofficeAdmin: 'ALL',
    salesManager:    ['dashboard', 'operations', 'recruitment'],
    salesDirector:   ['dashboard', 'operations', 'recruitment', 'data'],
    hrRecruiter:     ['dashboard', 'operations', 'compliance', 'hr', 'recruitment'],
    financeOfficer:  ['dashboard', 'finance', 'hr', 'data'],
    // Marketplace Dashboard Admin only operates inside the Marketplace Dashboard
    // federated system — not the Backoffice Admin Portal.
    marketplaceAdmin: [],
    executive:       ['dashboard', 'data', 'finance', 'hr'],
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
              <Link to="/backoffice/staff"><UsersRound size={16}/>Staff Management</Link>
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
                  <Link to="/backoffice/finance/agent-dues">Agent Dues</Link>
                </Sub>
              )}
              {hasAccess('hr') && (
                <Sub label="HR" icon={<UserSquare2 size={16}/>} open={hrOpen} toggle={()=>setHrOpen(!hrOpen)}>
                  <Link to="/backoffice/hr/profiles">Employee Profiles</Link>
                </Sub>
              )}
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
              <div style={{fontSize:9,fontWeight:700,color:'var(--sidebar-section)',textTransform:'uppercase',padding:'8px 10px 3px',letterSpacing:'.08em'}}>Property</div>
              <Link to="/backoffice/master/developers">Developers</Link>
              <Link to="/backoffice/master/projects">Projects</Link>
              <Link to="/backoffice/master/compounds">Compounds</Link>
              <Link to="/backoffice/master/unit-types">Unit Types</Link>
              <div style={{fontSize:9,fontWeight:700,color:'var(--sidebar-section)',textTransform:'uppercase',padding:'8px 10px 3px',letterSpacing:'.08em'}}>Location</div>
              <Link to="/backoffice/master/cities">Cities</Link>
              <Link to="/backoffice/master/areas">Areas / Districts</Link>
              <div style={{fontSize:9,fontWeight:700,color:'var(--sidebar-section)',textTransform:'uppercase',padding:'8px 10px 3px',letterSpacing:'.08em'}}>Organization</div>
              <Link to="/backoffice/master/branches">Branches</Link>
              <Link to="/backoffice/master/teams">Teams</Link>
              <Link to="/backoffice/master/emp-categories">Employment Categories</Link>
              <div style={{fontSize:9,fontWeight:700,color:'var(--sidebar-section)',textTransform:'uppercase',padding:'8px 10px 3px',letterSpacing:'.08em'}}>Finance & Sales</div>
              <Link to="/backoffice/master/comm-policies">Commission Policies</Link>
              <Link to="/backoffice/master/payout-cycles">Payout Cycles</Link>
              <Link to="/backoffice/master/expense-categories">Expense Categories</Link>
              <div style={{fontSize:9,fontWeight:700,color:'var(--sidebar-section)',textTransform:'uppercase',padding:'8px 10px 3px',letterSpacing:'.08em'}}>Other</div>
              <Link to="/backoffice/master/lead-sources">Lead Sources</Link>
            </Sub>
          )}

          {hasAccess('data') && (
            <>
              <Link to="/backoffice/exceptions"><AlertTriangle size={16}/>Exceptions & Issues</Link>
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
          <button className="sidebar-link" onClick={() => logout()} style={{ color: 'var(--text-tertiary)' }}>
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
            <button className="topbar-action" onClick={()=>{toast('Signing out…','info'); writeAudit('SSO Logout', persona.label, 'Security'); setTimeout(()=>signOut(),350);}}><LogOut size={13}/> Sign Out</button>
          </div>
        </header>
        <div className="page-content"><div className="page-inner animate-fade-in" key={location.pathname}>{children}</div></div>
      </main>
    </div>
  );
};
