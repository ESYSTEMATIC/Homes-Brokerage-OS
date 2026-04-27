import React from 'react';
import { ROLES } from '../data/staticData';

export const RolesPermissions = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Roles & Permissions</span></div>
      <h1 className="page-title">Roles & Permissions</h1>
      <p className="page-subtitle">Custom role creation and permission catalog — BRD 6.3</p>
    </div>
    <div className="data-panel">
      <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search roles..." /></div><button className="btn btn-primary">+ Create Role</button></div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Role Name</th><th>Department</th><th>Permissions</th><th>Assigned Users</th><th>Description</th><th>Status</th></tr></thead>
          <tbody>{ROLES.map(r=>(<tr key={r.id}><td className="muted">{r.id}</td><td className="bold">{r.name}</td><td>{r.department}</td><td className="bold">{r.permissions}</td><td>{r.users}</td><td style={{maxWidth:220,fontSize:12,color:'var(--text-secondary)'}}>{r.desc}</td><td><span className="badge badge-success">{r.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
