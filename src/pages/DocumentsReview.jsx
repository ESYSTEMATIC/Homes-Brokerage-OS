import React, { useState } from 'react';
import { DOCUMENTS } from '../data/staticData';
import { Search } from 'lucide-react';

const badgeFor = s => s==='Approved' ? 'badge-success' : s==='Rejected' || s==='Missing' ? 'badge-danger' : 'badge-warning';

export const DocumentsReview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = DOCUMENTS.filter(d => {
    const matchesSearch = d.doc.toLowerCase().includes(searchTerm.toLowerCase()) || d.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Documents Review</span></div>
        <h1 className="page-title">Documents Review</h1>
        <p className="page-subtitle">Review and approve agent documentation</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search by agent or document..." 
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
              <option>Pending Review</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Missing</option>
            </select>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Document</th><th>Type</th><th>Agent</th><th>Upload Date</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(d=>(
                <tr key={d.id}>
                  <td className="muted">{d.id}</td>
                  <td className="bold">{d.doc}</td>
                  <td>{d.type}</td>
                  <td>{d.agent}</td>
                  <td className="muted">{d.date}</td>
                  <td><span className={`badge ${badgeFor(d.status)}`}>{d.status}</span></td>
                  <td style={{textAlign:'right'}}>
                    <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                      {d.status==='Pending Review' && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => alert(`Approved ${d.doc} for ${d.agent}`)}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => alert(`Rejected ${d.doc} for ${d.agent}`)}>Reject</button>
                        </>
                      )}
                      {d.status==='Missing' && <button className="btn btn-outline btn-sm" onClick={() => alert(`Requesting ${d.doc}`)}>Request Upload</button>}
                      {d.status==='Rejected' && <button className="btn btn-outline btn-sm" onClick={() => alert(`Requesting resubmission for ${d.doc}`)}>Request Resubmission</button>}
                      {d.status==='Approved' && <span style={{color:'var(--success)',fontSize:12,fontWeight:600}}>✓ Verified</span>}
                    </div>
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
