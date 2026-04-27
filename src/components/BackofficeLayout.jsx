import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HomesLogoFull } from './HomesLogo';
import { LayoutDashboard, Users, UsersRound, ShieldCheck, BadgeDollarSign, UserSquare2, Database, ChevronDown, Bell, Building2, ClipboardList, FileSearch, BarChart3, ScrollText, Settings, Briefcase, Target, AlertTriangle } from 'lucide-react';

const Sub = ({ label, icon, open, toggle, children }) => (
  <>
    <button className="sidebar-link" onClick={toggle}>{icon}<span>{label}</span><ChevronDown size={14} className={`sidebar-chevron ${open?'open':''}`}/></button>
    {open && <div className="sidebar-sub">{children}</div>}
  </>
);
const Link = ({ to, children }) => <NavLink to={to} className={({isActive})=>`sidebar-link ${isActive?'active':''}`}>{children}</NavLink>;

export const BackofficeLayout = ({ children }) => {
  const { persona, personaKey, setPersonaKey, PERSONAS } = useApp();
  const [agentsOpen, setAgentsOpen] = useState(true);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const [masterOpen, setMasterOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><HomesLogoFull /></div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Operations</div>
          <Sub label="Agents" icon={<Users size={16}/>} open={agentsOpen} toggle={()=>setAgentsOpen(!agentsOpen)}>
            <Link to="/backoffice/agents">Agents List</Link>
            <Link to="/backoffice/onboarding">Onboarding</Link>
            <Link to="/backoffice/documents">Documents Review</Link>
          </Sub>
          <Link to="/backoffice/dashboard"><LayoutDashboard size={16}/>Dashboard</Link>
          <Link to="/backoffice/staff"><UsersRound size={16}/>Staff Management</Link>

          <div className="sidebar-section">CRM</div>
          <Link to="/backoffice/crm"><Target size={16}/>Lead Management</Link>
          <Link to="/backoffice/deals"><Briefcase size={16}/>Deals Pipeline</Link>
          <Link to="/backoffice/tasks"><ClipboardList size={16}/>Tasks & Calendar</Link>

          <div className="sidebar-section">Compliance</div>
          <Link to="/backoffice/training"><ShieldCheck size={16}/>Training Compliance</Link>

          <div className="sidebar-section">Finance</div>
          <Sub label="Financial Mgmt" icon={<BadgeDollarSign size={16}/>} open={financeOpen} toggle={()=>setFinanceOpen(!financeOpen)}>
            <Link to="/backoffice/finance/overview">Overview</Link>
            <Link to="/backoffice/finance/deals-revenue">Deals & Revenue</Link>
            <Link to="/backoffice/finance/commission">Commission Engine</Link>
            <Link to="/backoffice/finance/agent-dues">Agent Dues</Link>
          </Sub>
          <Sub label="HR & Payroll" icon={<UserSquare2 size={16}/>} open={hrOpen} toggle={()=>setHrOpen(!hrOpen)}>
            <Link to="/backoffice/hr/profiles">Employee Profiles</Link>
            <Link to="/backoffice/hr/payroll">Payroll</Link>
          </Sub>

          <div className="sidebar-section">Recruitment</div>
          <Link to="/backoffice/recruitment"><Users size={16}/>Candidate Pipeline</Link>
          <Link to="/backoffice/jobs"><Briefcase size={16}/>Job Vacancies</Link>

          <div className="sidebar-section">Data & Reporting</div>
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
          <Link to="/backoffice/exceptions"><AlertTriangle size={16}/>Exceptions & Issues</Link>
          <Link to="/backoffice/marketplace"><BarChart3 size={16}/>Marketplace Dashboard</Link>
          <Link to="/backoffice/audit"><ScrollText size={16}/>Audit Logs</Link>
          <Link to="/backoffice/executive"><Building2 size={16}/>Executive Dashboard</Link>

          <div className="sidebar-section">System</div>
          <Link to="/backoffice/roles"><ShieldCheck size={16}/>Roles & Permissions</Link>
          <Link to="/backoffice/departments"><Building2 size={16}/>Departments</Link>
          <Link to="/backoffice/settings"><Settings size={16}/>Settings</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div></div>
          <div className="topbar-right">
            <div className="topbar-status"><div className="topbar-status-dot"></div>All systems operational</div>
            <div className="topbar-bell"><Bell size={18}/><span className="topbar-bell-badge">4</span></div>
            <div className="topbar-user">
              <div className="topbar-user-info"><div className="topbar-user-name">{persona.label}</div><div className="topbar-user-email">{persona.email}</div></div>
              <div className="topbar-avatar">{persona.label.substring(0,2).toUpperCase()}</div>
            </div>
          </div>
        </header>
        <div className="page-content"><div className="page-inner animate-fade-in">{children}</div></div>
      </main>

      <div className="persona-switcher">
        <label>Simulate Persona</label>
        <select value={personaKey} onChange={e=>setPersonaKey(e.target.value)}>
          {Object.entries(PERSONAS).map(([k,p])=><option key={k} value={k}>{p.label} ({p.hub})</option>)}
        </select>
        <div className="scope">{persona.scope}</div>
      </div>
    </div>
  );
};
