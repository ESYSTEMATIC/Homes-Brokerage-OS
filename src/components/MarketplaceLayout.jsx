import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutGrid, Building2, ClipboardList, Building, Users2, Map, Activity, FileText, User, ShieldCheck, ChevronsLeft, ChevronsRight, Settings, ArrowLeft } from 'lucide-react';

// Inner sidebar of the Marketplace Dashboard system (mirrors the erep layout
// with Homes brand identity applied — orange accent in place of red).
const NAV = [
  { group: 'CORE OPERATIONS', items: [
    { to: '/system/marketplace-dashboard',          icon: LayoutGrid,   label: 'Overview', exact: true },
    { to: '/system/marketplace-dashboard/listings', icon: Building2,    label: 'Listings' },
    { to: '/system/marketplace-dashboard/leads',    icon: ClipboardList, label: 'Leads & Requests' },
  ]},
  { group: 'NETWORK DIRECTORY', items: [
    { to: '/system/marketplace-dashboard/brokerages', icon: Building,   label: 'Brokerages' },
    { to: '/system/marketplace-dashboard/developers', icon: Users2,     label: 'Developers' },
  ]},
  { group: 'ANALYTICS & DATA', items: [
    { to: '/system/marketplace-dashboard/geography', icon: Map,        label: 'Geography' },
    { to: '/system/marketplace-dashboard/traffic',   icon: Activity,   label: 'Traffic' },
    { to: '/system/marketplace-dashboard/reports',   icon: FileText,   label: 'Reports' },
  ]},
  { group: 'ADMIN', items: [
    { to: '/system/marketplace-dashboard/users',     icon: User,       label: 'Users' },
    { to: '/system/marketplace-dashboard/roles',     icon: ShieldCheck, label: 'Roles & Access' },
  ]},
];

// Only the Marketplace Dashboard Admin role may operate inside this layout.
// Agents and every other role are blocked at the layout level as a defence in
// depth (the route table already enforces the same rule).
const ALLOWED_PERSONA = 'marketplaceAdmin';

export const MarketplaceLayout = ({ children }) => {
  const { persona, personaKey, toast, writeAudit } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Layout-level guard.
  if (personaKey !== ALLOWED_PERSONA) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ maxWidth: 460, background: '#fff', border: '1px solid #f1f3f5', borderRadius: 14, padding: 32, textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,.06)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(232,103,42,.10)', color: 'var(--brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Access restricted</h2>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 18 }}>
            The Marketplace Dashboard is exclusive to the <b>Marketplace Dashboard Admin</b> role. Your current role ({persona.label}) is not entitled to access its modules.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/board/dashboard')}>
            <ArrowLeft size={14} /> Return to Employee Board
          </button>
        </div>
      </div>
    );
  }

  const backToBoard = () => {
    toast('Returning to Employee Board', 'info');
    writeAudit('SSO Return', 'Marketplace Dashboard → Employee Board', 'Security');
    setTimeout(() => navigate('/board/dashboard'), 200);
  };

  return (
    <div className="mp-shell">
      <aside className={`mp-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="mp-brand">
          {collapsed ? (
            // When collapsed, crop to the iconmark only so it fits the 72px width.
            <div className="mp-brand-mark" title="HOMES — Marketplace Dashboard"
                 style={{ backgroundImage: `url(${import.meta.env.BASE_URL}homes-logo-black.png)` }} />
          ) : (
            // Same layout as the Employee Board sidebar — full logo on top,
            // small uppercase subtitle below — but using the black PNG since
            // this sidebar has a white background.
            <div className="mp-brand-stack">
              <img
                src={`${import.meta.env.BASE_URL}homes-logo-black.png`}
                alt="HOMES — Swipe to Your Next Home"
                style={{ height: 30, width: 'auto', display: 'block', maxWidth: '100%' }}
              />
              <div className="mp-brand-stack-sub">Marketplace Dashboard</div>
            </div>
          )}
        </div>
        <nav className="mp-nav">
          {NAV.map(group => (
            <div key={group.group}>
              {!collapsed && <div className="mp-nav-section">{group.group}</div>}
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `mp-nav-link ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={16} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="mp-main">
        <header className="mp-topbar">
          <button className="mp-icon-btn" onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand' : 'Collapse'}>
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
          <button className="mp-back" onClick={backToBoard}><ArrowLeft size={13}/> Employee Board</button>
          <div style={{ flex: 1 }} />
          <button className="mp-icon-btn" title="Settings"><Settings size={16} /></button>
          <div className="mp-user">
            <div className="mp-avatar">{persona.label.substring(0,2).toUpperCase()}</div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Admin</span>
          </div>
        </header>
        <div className="mp-content" key={location.pathname}>
          {children}
        </div>
      </main>
    </div>
  );
};
