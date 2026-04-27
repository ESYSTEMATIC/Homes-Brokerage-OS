import React from 'react';
import { DOCUMENTS } from '../data/staticData';

const badgeFor = s => s==='Approved' ? 'badge-success' : s==='Rejected' || s==='Missing' ? 'badge-danger' : 'badge-warning';

export const DocumentsReview = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Documents Review</span></div>
      <h1 className="page-title">Documents Review</h1>
      <p className="page-subtitle">Review and approve agent documentation — BRD 8.12</p>
    </div>
    <div className="data-panel">
      <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search by agent or document..." /><select className="data-select"><option>All Statuses</option><option>Pending Review</option><option>Approved</option><option>Rejected</option><option>Missing</option></select></div></div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Document</th><th>Type</th><th>Agent</th><th>Upload Date</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
          <tbody>{DOCUMENTS.map(d=>(<tr key={d.id}><td className="muted">{d.id}</td><td className="bold">{d.doc}</td><td>{d.type}</td><td>{d.agent}</td><td className="muted">{d.date}</td><td><span className={`badge ${badgeFor(d.status)}`}>{d.status}</span></td><td style={{textAlign:'right'}}><div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>{d.status==='Pending Review'&&<><button className="btn btn-success btn-sm">Approve</button><button className="btn btn-danger btn-sm">Reject</button></>}{d.status==='Missing'&&<button className="btn btn-outline btn-sm">Request Upload</button>}{d.status==='Rejected'&&<button className="btn btn-outline btn-sm">Request Resubmission</button>}</div></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
