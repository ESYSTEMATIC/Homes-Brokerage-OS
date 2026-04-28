import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ShoppingBag, GraduationCap, BarChart3, User, FileText, BellRing, HelpCircle, LogOut, Bell } from 'lucide-react';
import { HomesLogoAgent } from './HomesLogo';

export const AgentLayout = ({ children }) => {
  const { persona, personaKey, login, logout, PERSONAS } = useApp();

  return (
    <div className="app-shell">
      <aside className="sidebar agent-sidebar">
        <div className="sidebar-brand"><HomesLogoAgent /></div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Main</div>
          <NavLink to="/agent/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={16} />Dashboard
          </NavLink>
          <NavLink to="/agent/products" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={16} />Products & Services
          </NavLink>
          <NavLink to="/agent/learning" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <GraduationCap size={16} />Learning
          </NavLink>
          <NavLink to="/agent/performance" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <BarChart3 size={16} />Performance
          </NavLink>

          <div className="sidebar-section">Account</div>
          <NavLink to="/agent/profile" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <User size={16} />Profile
          </NavLink>
          <NavLink to="/agent/documents" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={16} />Documents
          </NavLink>
          <NavLink to="/agent/notifications" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <BellRing size={16} />Notifications
          </NavLink>
          <NavLink to="/agent/help" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <HelpCircle size={16} />Help
          </NavLink>
        </nav>
        <div style={{padding:'16px 12px',borderTop:'1px solid rgba(255,255,255,.06)'}}>
          <button className="sidebar-link" style={{color:'#94a3b8'}} onClick={() => logout()}><LogOut size={16} />Sign Out</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div></div>
          <div className="topbar-right">
            <NavLink to="/agent/notifications" className="topbar-bell">
              <Bell size={18}/><span className="topbar-bell-badge">2</span>
            </NavLink>
            <div className="topbar-user">
              <div className="topbar-user-info">
                <div className="topbar-user-name">{persona.label}</div>
                <div className="topbar-user-email">{persona.role || 'Agent'}</div>
              </div>
              <NavLink to="/agent/profile" className="topbar-avatar" style={{ background: 'var(--gold)' }}>
                {persona.label.substring(0, 2).toUpperCase()}
              </NavLink>
            </div>
          </div>
        </header>
        <div className="page-content"><div className="page-inner animate-fade-in">{children}</div></div>
      </main>

      <div className="persona-switcher">
        <label>Simulate Persona</label>
        <select value={personaKey} onChange={e => login(e.target.value)}>
          {Object.entries(PERSONAS).map(([k,p]) => <option key={k} value={k}>{p.label} ({p.hub})</option>)}
        </select>
        <div className="scope">{persona.scope}</div>
      </div>
    </div>
  );
};
