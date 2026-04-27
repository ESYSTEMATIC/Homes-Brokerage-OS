import React from 'react';
import { ONBOARDING } from '../data/staticData';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const badgeFor = s => s.includes('Approved') ? 'badge-success' : s.includes('Rejected') ? 'badge-danger' : s.includes('Review') || s.includes('Submitted') ? 'badge-info' : 'badge-warning';

export const Onboarding = () => {
  const counts = { submitted: ONBOARDING.filter(a=>a.status==='Submitted').length, review: ONBOARDING.filter(a=>a.status==='Under Review').length, approved: ONBOARDING.filter(a=>a.status==='Approved').length, rejected: ONBOARDING.filter(a=>a.status==='Rejected').length };
  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Onboarding</span></div>
        <h1 className="page-title">Onboarding & Applications</h1>
        <p className="page-subtitle">Review and process agent onboarding applications — BRD 8.9</p>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Submitted</div><div className="kpi-value">{counts.submitted}</div></div><div className="kpi-icon blue"><FileText size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Under Review</div><div className="kpi-value">{counts.review}</div></div><div className="kpi-icon amber"><Clock size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Approved</div><div className="kpi-value">{counts.approved}</div></div><div className="kpi-icon green"><CheckCircle size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Rejected</div><div className="kpi-value">{counts.rejected}</div></div><div className="kpi-icon red"><XCircle size={20}/></div></div>
      </div>
      <div className="data-panel">
        <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search applicant..." /><select className="data-select"><option>All Statuses</option></select></div></div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Applicant</th><th>Type</th><th>Department</th><th>Branch</th><th>Submitted</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{ONBOARDING.map(a=>(<tr key={a.id}><td className="muted">{a.id}</td><td className="bold">{a.applicant}</td><td>{a.type}</td><td>{a.department}</td><td>{a.branch}</td><td className="muted">{a.date}</td><td><span className={`badge ${badgeFor(a.status)}`}>{a.status}</span></td><td style={{textAlign:'right'}}><button className="btn btn-outline btn-sm">View Details</button></td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
