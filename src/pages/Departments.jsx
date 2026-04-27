import React from 'react';
import { DEPARTMENTS } from '../data/staticData';

export const Departments = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Departments</span></div>
      <h1 className="page-title">Departments</h1>
      <p className="page-subtitle">Organizational containers — BRD 6.2</p>
    </div>
    <div className="data-panel">
      <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search departments..." /></div><button className="btn btn-primary">+ Add Department</button></div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Department</th><th>Head</th><th>Teams</th><th>Employees</th><th>Status</th></tr></thead>
          <tbody>{DEPARTMENTS.map(d=>(<tr key={d.id}><td className="muted">{d.id}</td><td className="bold">{d.name}</td><td>{d.head}</td><td className="bold">{d.teams}</td><td>{d.employees}</td><td><span className="badge badge-success">{d.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
