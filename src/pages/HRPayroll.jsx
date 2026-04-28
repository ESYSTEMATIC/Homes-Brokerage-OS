import React from 'react';
import { STAFF } from '../data/staticData';

export const HRPayroll = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">HR & Payroll</span></div>
      <h1 className="page-title">HR & Payroll</h1>
      <p className="page-subtitle">Employee records and HR operations</p>
    </div>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Total Employees</div><div className="kpi-value">{STAFF.length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>👥</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Active</div><div className="kpi-value">{STAFF.filter(s=>s.status==='Active').length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Suspended</div><div className="kpi-value">{STAFF.filter(s=>s.status==='Suspended').length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>⛔</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Pending</div><div className="kpi-value">{STAFF.filter(s=>s.status==='Pending').length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
    </div>
    <div className="info-banner">Full payroll disbursement is out of Release 1 scope. This section provides HR visibility into employee records, department assignments, and status management.</div>
    <div className="data-panel">
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Title</th><th>Branch</th><th>Manager</th><th>Status</th></tr></thead>
          <tbody>{STAFF.map(s=>(<tr key={s.id}><td className="muted">{s.id}</td><td className="bold">{s.name}</td><td>{s.department}</td><td>{s.title}</td><td>{s.branch}</td><td>{s.manager}</td><td><span className={`badge ${s.status==='Active'?'badge-success':s.status==='Suspended'?'badge-danger':'badge-warning'}`}>{s.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
