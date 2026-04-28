import React, { useState } from 'react';
import { ONBOARDING } from '../data/staticData';
import { FileText, Clock, CheckCircle, XCircle, Search } from 'lucide-react';

const badgeFor = s => s.includes('Approved') ? 'badge-success' : s.includes('Rejected') ? 'badge-danger' : s.includes('Review') || s.includes('Submitted') ? 'badge-info' : 'badge-warning';

export const Onboarding = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = ONBOARDING.filter(a => {
    const matchesSearch = a.applicant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = [...new Set(ONBOARDING.map(a => a.status))];

  const counts = { 
    submitted: ONBOARDING.filter(a=>a.status==='Submitted').length, 
    review: ONBOARDING.filter(a=>a.status==='Under Review').length, 
    approved: ONBOARDING.filter(a=>a.status==='Approved').length, 
    rejected: ONBOARDING.filter(a=>a.status==='Rejected').length 
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Onboarding</span></div>
        <h1 className="page-title">Onboarding & Applications</h1>
        <p className="page-subtitle">Review and process agent onboarding applications</p>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Submitted</div><div className="kpi-value">{counts.submitted}</div></div><div className="kpi-icon blue"><FileText size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Under Review</div><div className="kpi-value">{counts.review}</div></div><div className="kpi-icon amber"><Clock size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Approved</div><div className="kpi-value">{counts.approved}</div></div><div className="kpi-icon green"><CheckCircle size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Rejected</div><div className="kpi-value">{counts.rejected}</div></div><div className="kpi-icon red"><XCircle size={20}/></div></div>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search applicant..." 
                style={{ paddingLeft: 44 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="data-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Applicant</th><th>Type</th><th>Department</th><th>Branch</th><th>Submitted</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id}>
                  <td className="muted">{a.id}</td>
                  <td className="bold">{a.applicant}</td>
                  <td>{a.type}</td>
                  <td>{a.department}</td>
                  <td>{a.branch}</td>
                  <td className="muted">{a.date}</td>
                  <td><span className={`badge ${badgeFor(a.status)}`}>{a.status}</span></td>
                  <td style={{textAlign:'right'}}>
                    <button className="btn btn-outline btn-sm" onClick={() => alert(`Reviewing ${a.applicant}`)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
