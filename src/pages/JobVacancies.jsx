import React from 'react';
import { JOBS } from '../data/staticData';

const statusColor = s => s==='Published'?'badge-success':s==='Draft'?'badge-gray':'badge-info';

export const JobVacancies = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Job Vacancies</span></div>
      <h1 className="page-title">Job Vacancies</h1>
      <p className="page-subtitle">Standardized vacancy template and careers publish — BRD 8.10.1</p>
    </div>
    <div className="data-panel">
      <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search jobs..." /><select className="data-select"><option>All Statuses</option></select></div><button className="btn btn-primary">+ Create Vacancy</button></div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Mode</th><th>Headcount</th><th>Applicants</th><th>Hiring Manager</th><th>Status</th></tr></thead>
          <tbody>{JOBS.map(j=>(<tr key={j.id}><td className="muted">{j.id}</td><td className="bold">{j.title}</td><td>{j.department}</td><td>{j.location}</td><td>{j.type}</td><td>{j.mode}</td><td className="bold">{j.headcount}</td><td className="bold">{j.applicants}</td><td>{j.hiringManager}</td><td><span className={`badge ${statusColor(j.status)}`}>{j.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
