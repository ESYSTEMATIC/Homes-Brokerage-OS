import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, GraduationCap, BarChart3, User, FileText, BellRing, LogOut, Bell, KeyRound, ShieldCheck, Globe } from 'lucide-react';
import { HomesLogoAgent } from './HomesLogo';

// "AgentLayout" is now the Employee Board layout — the universal SSO landing for all roles.
export const AgentLayout = ({ children }) => {
  const { persona, personaKey, signOut, openDrawer, state, toast, writeAudit, PERSONAS, setPersonaKey } = useApp();
  const location = useLocation();
  const unread = state.agentNotifications.length;

  const ssoLaunch = (system, target) => {
    toast(`Launching ${system} via Microsoft Entra SSO…`, 'info');
    writeAudit('SSO Launch', `${system} (federated)`, 'Security', 'Token issued via Employee Board');
    if (target) setTimeout(() => { window.location.hash = target; }, 250);
  };

  const openNotifs = () => openDrawer({
    title: 'Notifications', subtitle: `${unread} unread`,
    content: (
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {state.agentNotifications.map(n => (
          <div key={n.id} style={{padding:'12px 14px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,borderLeft:`4px solid ${n.type==='success'?'var(--success)':n.type==='warning'?'var(--warning)':'var(--brand)'}`}}>
            <div style={{fontSize:13,color:'var(--text-primary)'}}>{n.text}</div>
            <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>{n.time}</div>
          </div>
        ))}
      </div>
    ),
  });

  // Show Backoffice topbar shortcut only if role has access.
  const ROLES_WITH_BACKOFFICE = ['backofficeAdmin','salesDirector','hrRecruiter','financeOfficer','executive','systemAdmin'];
  const canBackoffice = ROLES_WITH_BACKOFFICE.includes(personaKey);
  const isAgent = persona.hub === 'agent';

  return (
    <div className="app-shell">
      <aside className="sidebar agent-sidebar">
        <div className="sidebar-brand"><HomesLogoAgent /></div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Employee Board</div>
          <NavLink to="/board/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={16} />Dashboard
          </NavLink>
          {isAgent && (
            <NavLink to="/board/learning" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GraduationCap size={16} />Learning (Viva)
            </NavLink>
          )}
          <NavLink to="/board/performance" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <BarChart3 size={16} />Performance
          </NavLink>

          <div className="sidebar-section" style={{marginTop:14}}>Federated Systems · SSO</div>
          <button className="sidebar-link" onClick={()=>ssoLaunch('CRM','#/system/crm')}><KeyRound size={16}/>CRM <span style={{marginLeft:'auto',fontSize:9,color:'var(--brand)',fontWeight:700}}>SSO</span></button>
          <button className="sidebar-link" onClick={()=>ssoLaunch('Marketplace Dashboard','#/system/marketplace-dashboard')}><KeyRound size={16}/>Marketplace Dashboard <span style={{marginLeft:'auto',fontSize:9,color:'var(--brand)',fontWeight:700}}>SSO</span></button>
          <button className="sidebar-link" onClick={()=>ssoLaunch('Matrix EGMLS')}><KeyRound size={16}/>Matrix EGMLS <span style={{marginLeft:'auto',fontSize:9,color:'var(--brand)',fontWeight:700}}>SSO</span></button>
          {canBackoffice && (
            <button className="sidebar-link" onClick={()=>ssoLaunch('Backoffice Admin Portal','#/backoffice/dashboard')}><ShieldCheck size={16}/>Backoffice Admin <span style={{marginLeft:'auto',fontSize:9,color:'var(--brand)',fontWeight:700}}>SSO</span></button>
          )}

          {/* Public Marketplace — consumer-facing homes.com.eg surface, available
              to every signed-in employee regardless of role (BRD §3.1). */}
          <div className="sidebar-section" style={{marginTop:14}}>Public Site</div>
          <NavLink to="/marketplace" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Globe size={16}/>Marketplace
            <span style={{marginLeft:'auto',fontSize:9,color:'#94a3b8',fontWeight:700,letterSpacing:'.06em'}}>PUBLIC</span>
          </NavLink>

          <div className="sidebar-section" style={{marginTop:14}}>Account</div>
          <NavLink to="/board/profile" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <User size={16} />Profile
          </NavLink>
          <NavLink to="/board/documents" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={16} />Documents
          </NavLink>
          <NavLink to="/board/notifications" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <BellRing size={16} />Notifications
          </NavLink>
        </nav>
        <div style={{padding:'14px 12px',borderTop:'1px solid rgba(255,255,255,.06)'}}>
          <button className="sidebar-link" style={{color:'#94a3b8'}} onClick={()=>{toast('Signed out — returning to login','info'); writeAudit('SSO Logout', persona.label, 'Security'); setTimeout(()=>signOut(),350);}}><LogOut size={16} />Sign Out</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div></div>
          <div className="topbar-right">
            <div className="topbar-status"><div className="topbar-status-dot"></div>SSO via Microsoft Entra · session active</div>
            <div className="topbar-bell" onClick={openNotifs}><Bell size={18} /><span className="topbar-bell-badge">{unread}</span></div>
            <div className="topbar-user">
              <div className="topbar-user-info">
                <div className="topbar-user-name">{persona.label}</div>
                <div className="topbar-user-email">{persona.email}</div>
              </div>
              <div className="topbar-avatar" style={{background:'var(--brand)'}}>{persona.label.substring(0,2).toUpperCase()}</div>
            </div>
          </div>
        </header>
        <div className="page-content"><div className="page-inner animate-fade-in" key={location.pathname}>{children}</div></div>
      </main>

      <div className="persona-switcher">
        <label>Switch demo persona</label>
        <select value={personaKey} onChange={e => setPersonaKey(e.target.value)}>
          {Object.entries(PERSONAS).map(([k,p]) => <option key={k} value={k}>{p.label}</option>)}
        </select>
        <div className="scope">{persona.scope}</div>
      </div>
    </div>
  );
};
