import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Users, KanbanSquare, CalendarCheck2, ArrowLeft, Bell, LogOut } from 'lucide-react';
import { HomesLogoAgent } from './HomesLogo';

export const CrmLayout = ({ children }) => {
  const { persona, signOut, openDrawer, state, toast, writeAudit } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const unread = state.agentNotifications.length;

  const backToBoard = () => {
    toast('Returning to Employee Board…', 'info');
    navigate('/board/dashboard');
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

  return (
    <div className="app-shell">
      <aside className="sidebar crm-sidebar">
        <div className="sidebar-brand"><HomesLogoAgent /></div>
        <nav className="sidebar-nav">
          {/* Back to board */}
          <button className="sidebar-link crm-back-btn" onClick={backToBoard}>
            <ArrowLeft size={16} />Back to Board
          </button>

          <div className="sidebar-section">CRM</div>
          <NavLink to="/system/crm" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={16} />Dashboard
          </NavLink>
          <NavLink to="/system/crm/leads" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={16} />Leads
          </NavLink>
          <NavLink to="/system/crm/deals" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <KanbanSquare size={16} />Deals Pipeline
          </NavLink>
          <NavLink to="/system/crm/tasks" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <CalendarCheck2 size={16} />Tasks & Calendar
          </NavLink>
        </nav>
        <div style={{padding:'14px 12px',borderTop:'1px solid rgba(255,255,255,.06)'}}>
          <button className="sidebar-link" style={{color:'#94a3b8'}} onClick={()=>{toast('Signed out','info'); writeAudit('SSO Logout', persona.label, 'Security'); setTimeout(()=>signOut(),350);}}>
            <LogOut size={16} />Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:13,fontWeight:700,color:'var(--brand)',background:'var(--brand-tint)',padding:'4px 10px',borderRadius:6,letterSpacing:'.04em'}}>CRM</span>
            <span style={{fontSize:13,color:'var(--text-secondary)',fontWeight:500}}>Lead Management & Sales Pipeline</span>
          </div>
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
    </div>
  );
};
