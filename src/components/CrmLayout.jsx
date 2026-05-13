import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Users, KanbanSquare, CalendarCheck2, ArrowLeft, Bell, LogOut, Home, FileText, Globe, BarChart3, Megaphone, PhoneCall } from 'lucide-react';
import { HomesLogoAgent } from './HomesLogo';
import { canSeeCampaigns, canSeeCrmModule } from '../data/crmAccess';
import { SmartSearch } from './SmartSearch';

export const CrmLayout = ({ children }) => {
  const { persona, personaKey, signOut, openDrawer, state, toast, writeAudit } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const unread = state.agentNotifications.length;
  // Marketing persona sees only the Campaigns module — every other CRM
  // surface (Leads, Listings, Deals, Contracts, Tasks, Reports, etc.) is
  // hidden from the sidebar and route guards bounce direct URLs to /campaigns.
  const isMarketing = canSeeCampaigns(personaKey);
  // Reports module is manager-only (Sales Manager + Sales Director) per the
  // 08-May stakeholder review. Team Leader, Agent and audit roles do NOT see
  // the sidebar link or reach the page directly.
  const canSeeReports = personaKey === 'salesManager' || personaKey === 'salesDirector';
  // Cold Calls — full module for Sales Manager+Director, assignment-only view
  // for agents/TL, import-only view for Marketing. Sidebar link visible if any
  // of the three module keys is in the persona's crmModules.
  const canSeeColdCalls =
    canSeeCrmModule(personaKey, 'coldCalls') ||
    canSeeCrmModule(personaKey, 'coldCallsAssigned') ||
    canSeeCrmModule(personaKey, 'coldCallsImport');
  // Contracts module retired entirely on 08-May. Contract lifecycle is tracked
  // through the Deal at Contract Signed (Off Plan) / Contract Signed & Payment
  // (Resale) stages — commission locks and revenue recognition happen there.

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
        <div className="sidebar-brand" style={{display:'flex',flexDirection:'column',gap:4}}>
          <HomesLogoAgent />
          <div style={{fontSize:10,fontWeight:800,letterSpacing:2,color:'rgba(255,255,255,.4)',paddingLeft:4}}>CRM MODULE</div>
        </div>
        <nav className="sidebar-nav">
          {isMarketing ? (
            // Marketing sidebar — Campaigns + Cold Calls (import-only).
            <>
              <div className="sidebar-section">Marketing</div>
              <NavLink to="/system/crm/campaigns" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Megaphone size={16} />Social Campaigns
              </NavLink>
              <NavLink to="/system/crm/cold-calls" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <PhoneCall size={16} />Cold Calls
              </NavLink>
            </>
          ) : (
            <>
              <div className="sidebar-section">CRM</div>
              <NavLink to="/system/crm" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} />Dashboard
              </NavLink>
              <NavLink to="/system/crm/leads" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Users size={16} />Leads
              </NavLink>
              {canSeeColdCalls && (
                <NavLink to="/system/crm/cold-calls" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <PhoneCall size={16} />Cold Calls
                </NavLink>
              )}
              <NavLink to="/system/crm/listings" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Home size={16} />Listings
              </NavLink>
              {/* Tours module merged into Leads on 08-May. Tour scheduling
                  lives inside the Lead detail drawer; tour history surfaces in
                  the lead's activity timeline. */}
              <NavLink to="/system/crm/deals" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <KanbanSquare size={16} />Deals Pipeline
              </NavLink>
              {/* Contracts module retired — contract lifecycle tracked via Deal. */}
              <NavLink to="/system/crm/tasks" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <CalendarCheck2 size={16} />Tasks & Calendar
              </NavLink>

              <div className="sidebar-section" style={{marginTop:10}}>Tools</div>
              {/* Listing Shares rewired on 08-May: the Share button now lives
                  on each Listing card with multi-lead picker. Share history is
                  surfaced inside the Lead Detail timeline + Listing Shares
                  report. The standalone page was removed. */}
              <NavLink to="/system/crm/minisite" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Globe size={16} />Mini-Site
              </NavLink>
              {canSeeReports && (
                <NavLink to="/system/crm/reports" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <BarChart3 size={16} />Reports
                </NavLink>
              )}
            </>
          )}
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
            <button onClick={backToBoard} style={{display:'flex',alignItems:'center',gap:6,background:'#fff',border:'1px solid var(--border)',padding:'6px 12px',borderRadius:6,fontSize:13,fontWeight:600,cursor:'pointer',color:'var(--text-primary)'}}>
              <ArrowLeft size={14} /> Employee Board
            </button>
            <div style={{width:1,height:24,background:'var(--border)',margin:'0 4px'}} />
            <span style={{fontSize:13,color:'var(--text-secondary)',fontWeight:500}}>{isMarketing ? 'Social & Ad Campaigns' : 'Lead Management & Sales Pipeline'}</span>
            {/* Smart Search keyboard hint — full handler lives in SmartSearch.jsx */}
            <button
              onClick={()=>{
                const ev = new KeyboardEvent('keydown', { key:'k', metaKey:true, bubbles:true });
                window.dispatchEvent(ev);
              }}
              title="Press ⌘K (or Ctrl-K) anywhere to open Smart Search"
              style={{display:'flex',alignItems:'center',gap:8,background:'#fafbfc',border:'1px solid var(--border)',padding:'5px 10px',borderRadius:6,fontSize:11,color:'var(--text-secondary)',cursor:'pointer'}}
            >
              <span>Search leads, deals, listings…</span>
              <span style={{padding:'1px 6px',background:'#fff',border:'1px solid var(--border)',borderRadius:4,fontFamily:'monospace',fontSize:10}}>⌘K</span>
            </button>
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

      {/* Global Smart Search — Cmd-K / Ctrl-K toggles (11-May meeting ask). */}
      <SmartSearch />
    </div>
  );
};
