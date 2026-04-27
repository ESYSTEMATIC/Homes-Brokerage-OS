import React from 'react';
import { LEADS } from '../data/staticData';
import { Eye, UserPlus, GitMerge } from 'lucide-react';

const fmt = v => new Intl.NumberFormat('en-EG',{style:'currency',currency:'EGP',maximumFractionDigits:0}).format(v);
const badgeFor = s => s==='Hot'?'badge-danger':s==='Warm'?'badge-warning':'badge-info';
const stageFor = s => ['New','Contacted'].includes(s)?'badge-info':s==='Qualified'?'badge-warning':['Tour Scheduled','Negotiation','Reservation'].includes(s)?'badge-success':'badge-gray';

export const CRMLeads = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Lead Management</span></div>
      <h1 className="page-title">Lead Management</h1>
      <p className="page-subtitle">CRM lead workspace — duplicate control, hierarchy assignment, qualification — BRD 8.2</p>
    </div>
    <div className="kpi-grid kpi-grid-5">
      <div className="kpi-card"><div><div className="kpi-label">Total Leads</div><div className="kpi-value">{LEADS.length}</div></div><div className="kpi-icon blue"><Eye size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Unassigned</div><div className="kpi-value">{LEADS.filter(l=>!l.owner).length}</div></div><div className="kpi-icon red"><UserPlus size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Hot Leads</div><div className="kpi-value">{LEADS.filter(l=>l.priority==='Hot').length}</div></div><div className="kpi-icon amber"><Eye size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Duplicate Review</div><div className="kpi-value">{LEADS.filter(l=>l.duplicate==='Review').length}</div></div><div className="kpi-icon amber"><GitMerge size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Pipeline Value</div><div className="kpi-value" style={{fontSize:18}}>{fmt(LEADS.reduce((s,l)=>s+l.budget,0))}</div></div><div className="kpi-icon green"><Eye size={20}/></div></div>
    </div>
    <div className="data-panel">
      <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search leads..." /><select className="data-select"><option>All Stages</option></select><select className="data-select"><option>All Sources</option></select><select className="data-select"><option>All Priorities</option></select></div></div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Name</th><th>Source</th><th>Project</th><th>Developer</th><th>Budget</th><th>Stage</th><th>Priority</th><th>Owner</th><th>Duplicate</th></tr></thead>
          <tbody>{LEADS.map(l=>(<tr key={l.id}><td className="muted">{l.id}</td><td className="bold">{l.name}</td><td>{l.source}</td><td>{l.project}</td><td className="muted">{l.developer}</td><td>{fmt(l.budget)}</td><td><span className={`badge ${stageFor(l.stage)}`}>{l.stage}</span></td><td><span className={`badge ${badgeFor(l.priority)}`}>{l.priority}</span></td><td>{l.owner||<span style={{color:'var(--danger)',fontWeight:600}}>Unassigned</span>}</td><td><span className={`badge ${l.duplicate==='Clear'?'badge-success':'badge-warning'}`}>{l.duplicate}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
