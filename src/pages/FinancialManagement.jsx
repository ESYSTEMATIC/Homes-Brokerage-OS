import React from 'react';
import { COMMISSION_POLICIES, DEALS } from '../data/staticData';
const fmt = v => new Intl.NumberFormat('en-EG',{style:'currency',currency:'EGP',maximumFractionDigits:0}).format(v);

export const FinancialManagement = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Financial Management</span></div>
      <h1 className="page-title">Financial Management</h1>
      <p className="page-subtitle">Commission policies, overrides, and forecasts</p>
    </div>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Total Commission Due</div><div className="kpi-value" style={{fontSize:20}}>{fmt(621000)}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>💰</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Pending Approval</div><div className="kpi-value" style={{fontSize:20}}>{fmt(273000)}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Overrides Active</div><div className="kpi-value">{COMMISSION_POLICIES.filter(p=>p.override).length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>⚡</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Active Policies</div><div className="kpi-value">{COMMISSION_POLICIES.length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>📋</span></div></div>
    </div>
    <h2 className="section-title">Commission Policies</h2>
    <div className="data-panel" style={{marginBottom:24}}>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Developer</th><th>Project</th><th>Rate</th><th>Override</th><th>Override Reason</th><th>Approver</th><th>Status</th></tr></thead>
          <tbody>{COMMISSION_POLICIES.map(p=>(<tr key={p.id}><td className="muted">{p.id}</td><td className="bold">{p.developer}</td><td>{p.project}</td><td className="bold">{p.rate}%</td><td>{p.override?<span className="badge badge-warning">Yes</span>:<span className="badge badge-gray">No</span>}</td><td className="muted">{p.overrideReason||'—'}</td><td>{p.approver||'—'}</td><td><span className="badge badge-success">{p.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
    <h2 className="section-title">Deal Commission Drafts</h2>
    <div className="data-panel">
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>Deal</th><th>Lead</th><th>Project</th><th>Value</th><th>Rate</th><th>Commission Amount</th><th>Status</th></tr></thead>
          <tbody>{DEALS.filter(d=>d.status==='Active').map(d=>(<tr key={d.id}><td className="muted">{d.id}</td><td className="bold">{d.lead}</td><td>{d.project}</td><td>{fmt(d.value)}</td><td>{d.commission}%</td><td className="bold">{fmt(d.value*d.commission/100)}</td><td><span className="badge badge-warning">Pending</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
