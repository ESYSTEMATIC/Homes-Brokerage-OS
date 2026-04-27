import React from 'react';
import { AUDIT_LOGS } from '../data/staticData';

export const AuditLogs = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Audit Logs</span></div>
      <h1 className="page-title">Audit Logs</h1>
      <p className="page-subtitle">Immutable trail of sensitive actions — BRD 10.3</p>
    </div>
    <div className="data-panel">
      <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search audit logs..." /><select className="data-select"><option>All Modules</option><option>CRM</option><option>Finance</option><option>HR</option><option>Backoffice</option><option>Security</option><option>Recruitment</option></select><select className="data-select"><option>All Actions</option></select></div></div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Action</th><th>Actor</th><th>Target</th><th>Module</th><th>Timestamp</th><th>Detail</th></tr></thead>
          <tbody>{AUDIT_LOGS.map(a=>(<tr key={a.id}><td className="muted">{a.id}</td><td className="bold">{a.action}</td><td>{a.actor}</td><td>{a.target}</td><td><span className="badge badge-info">{a.module}</span></td><td className="muted">{a.timestamp}</td><td style={{maxWidth:260,fontSize:12,color:'var(--text-secondary)'}}>{a.detail}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
