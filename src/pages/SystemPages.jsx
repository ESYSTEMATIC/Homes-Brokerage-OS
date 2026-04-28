import React from 'react';

const EXCEPTIONS = [
  { id:'EXC-001',type:'Commission Dispute',title:'Unauthorized discount on North Edge deal',severity:'Critical',reporter:'Nour El-Din',assignee:'Finance Team',status:'Open',created:'2024-01-15' },
  { id:'EXC-002',type:'Training Overdue',title:'3 agents have overdue mandatory training',severity:'High',reporter:'System',assignee:'HR Team',status:'Open',created:'2024-01-14' },
  { id:'EXC-003',type:'Document Missing',title:'Brokerage agreement missing for Yasmin Adel',severity:'Medium',reporter:'Backoffice',assignee:'Yasmin Adel',status:'Pending',created:'2024-01-12' },
  { id:'EXC-004',type:'Access Violation',title:'Attempt to access restricted financial data',severity:'Critical',reporter:'System',assignee:'System Admin',status:'Resolved',created:'2024-01-10' },
  { id:'EXC-005',type:'Data Quality',title:'Duplicate lead flagged for manual review',severity:'Low',reporter:'CRM System',assignee:'Sales Ops',status:'Open',created:'2024-01-16' },
  { id:'EXC-006',type:'SLA Breach',title:'Lead response time exceeded 4-hour SLA',severity:'High',reporter:'System',assignee:'Karim Mostafa',status:'Resolved',created:'2024-01-11' },
];
const sevBadge = s => s==='Critical'?'badge-danger':s==='High'?'badge-warning':s==='Medium'?'badge-info':'badge-gray';
const statusBadge = s => s==='Open'?'badge-danger':s==='Pending'?'badge-warning':'badge-success';

export const ExceptionsIssues = () => (
  <div>
    <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Exceptions & Issues</span></div><h1 className="page-title">Exceptions & Issues</h1><p className="page-subtitle">Track and resolve operational exceptions</p></div>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Open</div><div className="kpi-value">{EXCEPTIONS.filter(e=>e.status==='Open').length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>🔴</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Pending</div><div className="kpi-value">{EXCEPTIONS.filter(e=>e.status==='Pending').length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>🟡</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Resolved</div><div className="kpi-value">{EXCEPTIONS.filter(e=>e.status==='Resolved').length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>🟢</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Critical</div><div className="kpi-value">{EXCEPTIONS.filter(e=>e.severity==='Critical').length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>⚠️</span></div></div>
    </div>
    <div className="data-panel"><div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search exceptions..." /><select className="data-select"><option>All Severities</option></select><select className="data-select"><option>All Statuses</option></select></div></div>
    <div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Type</th><th>Title</th><th>Severity</th><th>Reporter</th><th>Assignee</th><th>Created</th><th>Status</th></tr></thead>
    <tbody>{EXCEPTIONS.map(e=><tr key={e.id}><td className="muted">{e.id}</td><td>{e.type}</td><td className="bold">{e.title}</td><td><span className={`badge ${sevBadge(e.severity)}`}>{e.severity}</span></td><td>{e.reporter}</td><td>{e.assignee}</td><td className="muted">{e.created}</td><td><span className={`badge ${statusBadge(e.status)}`}>{e.status}</span></td></tr>)}</tbody></table></div></div>
  </div>
);

export const Settings = () => (
  <div>
    <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Settings</span></div><h1 className="page-title">Settings</h1><p className="page-subtitle">Platform configuration and system preferences</p></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
      {[
        {title:'General',desc:'Company name, timezone, locale settings',items:['Company Name: Homes Brokerage','Timezone: Africa/Cairo (UTC+2)','Language: English','Currency: EGP']},
        {title:'Authentication',desc:'SSO and security configuration',items:['Provider: Microsoft Entra ID','SSO Mode: Enforced','Session Timeout: 8 hours','MFA: Required for admin']},
        {title:'Notifications',desc:'Email and in-app notification settings',items:['Lead Assignment: Instant','Task Reminders: 1 hour before','Training Alerts: Daily digest','Commission Updates: On change']},
        {title:'Integration',desc:'External system connections',items:['Matrix EGMLS: Connected ✅','Viva Learning: Connected ✅','WhatsApp Business: Configured ✅','Email SMTP: Active ✅']},
        {title:'Data & Privacy',desc:'Data retention and privacy settings',items:['Audit Log Retention: 7 years','Data Backup: Daily automated','GDPR Compliance: Enabled','Export Restrictions: Role-based']},
        {title:'Branding',desc:'Logo, colors, and white-label settings',items:['Primary Color: #E8672A','Logo: HOMES (uploaded)','Tagline: Swipe to Your Next Home','Favicon: Configured']},
      ].map(s=>(
        <div key={s.title} style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,padding:20}}>
          <h3 style={{fontWeight:700,fontSize:15,marginBottom:4}}>{s.title}</h3>
          <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:12}}>{s.desc}</p>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {s.items.map(item=><div key={item} style={{fontSize:13,padding:'6px 0',borderBottom:'1px solid #f3f4f6'}}>{item}</div>)}
          </div>
          <button className="btn btn-outline btn-sm" style={{marginTop:12}}>Edit</button>
        </div>
      ))}
    </div>
  </div>
);
