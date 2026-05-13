import React from 'react';
import { useApp } from '../context/AppContext';
import { KeyRound, ExternalLink, Lock, ShieldCheck } from 'lucide-react';

// Shared placeholder for federated external systems (CRM, Marketplace, Marketplace Dashboard).
// These are launched via Microsoft Entra SSO from the Employee Board, not from the Backoffice.
const ExternalSystem = ({ name, brd, description, accessRoles, capabilities, launchTarget }) => {
  const { triggerSsoLaunch } = useApp();
  
  const launch = () => {
    if (launchTarget) {
      triggerSsoLaunch(name, launchTarget);
    } else {
      triggerSsoLaunch(name);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Federated Systems</span><span>&gt;</span><span className="current">{name}</span></div>
        <h1 className="page-title">{name}</h1>
        <p className="page-subtitle">{description} — {brd}</p>
      </div>

      <div style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)',border:'1px solid var(--border)',borderRadius:14,padding:'32px 36px',color:'#fff',marginBottom:20,display:'flex',alignItems:'center',gap:24}}>
        <div style={{width:64,height:64,borderRadius:14,background:'rgba(232,103,42,.18)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <KeyRound size={28} color="#E8672A" />
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:800,color:'#E8672A',textTransform:'uppercase',letterSpacing:'.1em'}}>Federated System · External Workspace</div>
          <h2 style={{fontSize:22,fontWeight:800,marginTop:6}}>{name}</h2>
          <p style={{color:'rgba(255,255,255,.7)',fontSize:14,marginTop:6,maxWidth:560}}>This is an independent system in the Homes ecosystem. Employees access it from the <b style={{color:'#fff'}}>Employee Board</b>, joined via Microsoft Entra SSO. The Backoffice Admin Portal manages governance, audit, and role-based entitlements only.</p>
        </div>
        <button className="btn" style={{background:'#E8672A',color:'#fff',padding:'10px 20px'}} onClick={launch}>
          <ExternalLink size={14}/> Simulate SSO Launch
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:20}}>
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:24}}>
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><ShieldCheck size={16} color="#E8672A"/>Capabilities</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {capabilities.map(c => (
              <div key={c} style={{padding:'8px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:6,fontSize:13}}>{c}</div>
            ))}
          </div>
        </div>
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:24}}>
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><Lock size={16} color="#E8672A"/>Access (Role-Based)</h3>
          <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:12}}>Entitlements granted by the Backoffice Admin Portal. SSO-only login.</p>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {accessRoles.map(r => (
              <div key={r.role} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:6}}>
                <span style={{fontSize:13,fontWeight:600}}>{r.role}</span>
                <span className={`badge ${r.level==='Full'?'badge-success':r.level==='Read-Only'?'badge-info':r.level==='None'?'badge-gray':'badge-warning'}`}>{r.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CRMIntro = () => (
  <ExternalSystem
    name="CRM — Lead Management"
    brd=""
    description="Lead intake, duplicate control, hierarchy assignment, qualification, agent mini-site, and listing-share logging"
    capabilities={[
      'Lead intake & duplicate check','Hierarchy assignment','Buyer preferences',
      'Tasks & calendar','Lead aging & SLA','Reassignment audit','Source attribution','Manager queue',
      'Listing share via WhatsApp / Email / Call (logged)','Agent mini-site (personal listing page)',
      'Manual lead entry by agent (6-month no-reassign protection)','Lead lifecycle (New→Contacted→Qualified→Matched→Closed/Lost)',
    ]}
    accessRoles={[
      { role: 'Sales Agent', level: 'Full' },
      { role: 'Team Leader', level: 'Full + team visibility' },
      { role: 'Sales Manager', level: 'Full + multi-team visibility' },
      { role: 'Sales Director', level: 'Full hierarchy' },
      { role: 'Backoffice Admin', level: 'Audit-only' },
      { role: 'HR / Finance / Marketplace Admin', level: 'None' },
    ]}
    launchTarget="#/system/crm"
  />
);

export const DealsPipeline = () => (
  <ExternalSystem
    name="CRM — Deals Pipeline"
    brd=""
    description="Deal lifecycle, stage progression, commission tracking and revenue recognition (contracts retired — tracked via Deal stages)"
    capabilities={['Pipeline board','All deals table','Linked lead & inventory','Stage management','Reservation & contract status','Commission calculation','Override request workflow','Hierarchy approval']}
    accessRoles={[
      { role: 'Sales Agent', level: 'Full' },
      { role: 'Team Leader', level: 'Full' },
      { role: 'Sales Manager', level: 'Approval' },
      { role: 'Finance Officer', level: 'Approval' },
      { role: 'Backoffice Admin', level: 'Audit-only' },
    ]}
  />
);

export const TasksCalendar = () => (
  <ExternalSystem
    name="CRM — Tasks & Calendar"
    brd=""
    description="Unified task list and calendar — every lead, tour, deal has a next action"
    capabilities={['Unified task list','Calendar events','Tour scheduling','Follow-up reminders','Overdue alerts','Linked records','Role-based visibility','Notification center']}
    accessRoles={[
      { role: 'Sales Agent', level: 'Full' },
      { role: 'Team Leader', level: 'Team scope' },
      { role: 'Sales Manager', level: 'Full' },
      { role: 'Backoffice / Finance', level: 'Read-Only' },
    ]}
  />
);

// Marketplace Dashboard — internal admin & analytics for the public homes.com.eg marketplace.
// (The public Marketplace itself is consumer-facing and lives outside the employee surface.)
const MarketplaceDashboardSystem = () => (
  <ExternalSystem
    name="Marketplace Dashboard"
    brd=""
    description="Internal admin and analytics for the public homes.com.eg marketplace. The Marketplace itself is consumer-facing; employees only access this dashboard via SSO."
    capabilities={[
      'Developer feed ingestion','Project / compound publishing','Unit availability',
      'Pricing & payment plans','Content quality control','Source mapping',
      'Funnel analytics & KPIs','Source contribution','Project performance',
      'Marketplace → CRM handoff','Inventory origin tagging','Conversion drill-down',
    ]}
    accessRoles={[
      { role: 'Marketplace Dashboard Admin', level: 'Full · Exclusive' },
      { role: 'Sales Agent / Team Leader', level: 'None' },
      { role: 'Sales Manager / Director', level: 'None' },
      { role: 'Backoffice Admin / Super Admin', level: 'None' },
      { role: 'HR / Finance / Executive / System Admin', level: 'None' },
    ]}
  />
);

export const MarketplaceDashboard = MarketplaceDashboardSystem;
// Backwards-compatible aliases.
export const MarketplaceAdmin = MarketplaceDashboardSystem;
export const Marketplace = MarketplaceDashboardSystem;
