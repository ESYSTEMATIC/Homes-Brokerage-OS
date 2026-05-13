import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, GraduationCap, BarChart3, User, FileText, BellRing, LogOut, Bell, KeyRound, ShieldCheck, Loader2, Globe, Grid3x3 } from 'lucide-react';
import { HomesLogoAgent } from './HomesLogo';

// "AgentLayout" is now the Employee Board layout — the universal SSO landing for all roles.
export const AgentLayout = ({ children }) => {
  const { persona, personaKey, signOut, openDrawer, state, toast, writeAudit, PERSONAS, setPersonaKey, ssoSplash, triggerSsoLaunch } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  // 11-May ask: filter CRM-related categories (task / lead / approval) out
  // of the Employee Board notifications drawer — those belong in CRM.
  const CRM_CATS = new Set(['task','lead','approval']);
  const visibleNotifications = state.agentNotifications.filter(n => !CRM_CATS.has(n.category));
  const unread = visibleNotifications.length;

  const openNotifs = () => openDrawer({
    title: 'Notifications', subtitle: `${unread} item${unread===1?'':'s'} · HR / Documents / Department / Features`,
    content: (
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {visibleNotifications.length === 0 ? (
          <div style={{padding:20,color:'var(--text-tertiary)',fontSize:13,textAlign:'center'}}>No notifications.</div>
        ) : visibleNotifications.map(n => (
          <div key={n.id} style={{padding:'12px 14px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,borderLeft:`4px solid ${n.type==='success'?'var(--success)':n.type==='warning'?'var(--warning)':'var(--brand)'}`}}>
            <div style={{fontSize:13,color:'var(--text-primary)'}}>{n.text}</div>
            <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>{n.time}</div>
          </div>
        ))}
      </div>
    ),
  });

  const ROLES_WITH_BACKOFFICE = ['backofficeAdmin','salesDirector','hrRecruiter','financeOfficer','executive','systemAdmin'];
  const canBackoffice = ROLES_WITH_BACKOFFICE.includes(personaKey);
  // Marketplace Dashboard is exclusive to the Marketplace Dashboard Admin role.
  // Hide its sidebar launcher from every other persona (agents, TLs, managers, directors).
  const canMarketplaceDash = personaKey === 'marketplaceAdmin';
  // "isAgent" gates sales-track items (Learning, Performance, Matrix EGMLS).
  // Marketing has hub='agent' but salesTrack=false — they don't get any of these.
  const isAgent = persona.hub === 'agent' && persona.salesTrack === true;
  // Matrix EGMLS — Egyptian MLS for property listings. Marketing doesn't need it.
  const canMatrix = persona.hub === 'agent' ? persona.salesTrack === true : true;

  return (
    <div className="app-shell">
      {/* SSO Splash Overlay (from main) */}
      {ssoSplash && (
        <div className="sso-splash">
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:20,animation:'fadeIn .4s ease'}}>
            <div style={{width:72,height:72,borderRadius:18,background:'rgba(232,103,42,.15)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8}}>
              <KeyRound size={32} color="#E8672A"/>
            </div>
            <h2>Launching {ssoSplash.system}</h2>
            <p>Authenticating via Microsoft Entra ID…</p>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,marginTop:12}}>
              <div className="sso-spinner"/>
              <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-start',fontSize:12}}>
                <div style={{display:'flex',alignItems:'center',gap:8,color:'#10b981'}}><ShieldCheck size={14}/> SSO token issued</div>
                <div style={{display:'flex',alignItems:'center',gap:8,color:'#E8672A'}}><Loader2 size={14} className="spin-icon"/> Establishing session…</div>
                <div style={{display:'flex',alignItems:'center',gap:8,color:'rgba(255,255,255,.4)'}}>● Loading workspace…</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar agent-sidebar">
        <div className="sidebar-brand"><HomesLogoAgent /></div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Employee Board</div>
          <NavLink to="/board/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={16} />Dashboard
          </NavLink>
          <NavLink to="/board/services" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Grid3x3 size={16} />Product & Services
          </NavLink>
          {isAgent && (
            <NavLink to="/board/learning" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GraduationCap size={16} />Homes Academy
            </NavLink>
          )}
          {isAgent && (
            <NavLink to="/board/performance" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BarChart3 size={16} />Performance
            </NavLink>
          )}

          <div className="sidebar-section" style={{marginTop:14}}>Federated Systems · SSO</div>
          {/* CRM → intro placeholder. From there the user clicks Simulate SSO to enter the real CRM V2. */}
          <button className="sidebar-link" onClick={()=>navigate('/system/crm-intro')}><KeyRound size={16}/>CRM <span style={{marginLeft:'auto',fontSize:9,color:'var(--brand)',fontWeight:700}}>SSO</span></button>
          {canMarketplaceDash && <button className="sidebar-link" onClick={()=>triggerSsoLaunch('Marketplace Dashboard','#/system/marketplace-dashboard')}><KeyRound size={16}/>Marketplace Dashboard <span style={{marginLeft:'auto',fontSize:9,color:'var(--brand)',fontWeight:700}}>SSO</span></button>}
          {canMatrix && (
            <button
              className="sidebar-link"
              onClick={() => {
                writeAudit('External redirect', 'Matrix EGMLS', 'External', 'Opened agents.egymls.com');
                toast('Redirecting to Matrix EGMLS — external system', 'info');
                window.open('https://agents.egymls.com/auth/login/', '_blank', 'noopener,noreferrer');
              }}
              title="External system (CoreLogic SSO integration pending)"
            >
              <KeyRound size={16}/>Matrix EGMLS <span style={{marginLeft:'auto',fontSize:9,color:'#94a3b8',fontWeight:700,letterSpacing:'.06em'}}>EXTERNAL</span>
            </button>
          )}
          {canBackoffice && (
            <button className="sidebar-link" onClick={()=>triggerSsoLaunch('Backoffice Admin Portal','#/backoffice/dashboard')}><ShieldCheck size={16}/>Backoffice Admin <span style={{marginLeft:'auto',fontSize:9,color:'var(--brand)',fontWeight:700}}>SSO</span></button>
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
