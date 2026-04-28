import React, { useState } from 'react';
import { STAFF } from '../data/staticData';
import { Eye, UserCog, Wallet } from 'lucide-react';

export const AgentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filteredStaff = STAFF.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action, name) => {
    alert(`${action} triggered for ${name}`);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Agents</span></div>
        <h1 className="page-title">Agents</h1>
        <p className="page-subtitle">External agent registry — agents are employees once approved</p>
      </div>
      <div className="info-banner">Agents access the <b>Agent Portal Platform</b> for their day-to-day operations. This section manages their records from the backoffice perspective.</div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input 
              className="data-search" 
              placeholder="Search agents by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="data-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
          </div>
          <div style={{fontSize:13,color:'var(--text-secondary)'}}>{filteredStaff.length} agent(s)</div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Branch</th><th>Team</th><th>Manager</th><th>Title</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filteredStaff.length > 0 ? filteredStaff.map(a=>(
                <tr key={a.id}>
                  <td className="muted">{a.id}</td>
                  <td className="bold">{a.name}</td>
                  <td>{a.branch}</td>
                  <td>{a.department}</td>
                  <td>{a.manager}</td>
                  <td>{a.title}</td>
                  <td><span className={`badge ${a.status==='Active'?'badge-success':a.status==='Suspended'?'badge-danger':a.status==='Pending'?'badge-warning':'badge-gray'}`}>{a.status}</span></td>
                  <td>
                    <div className="action-icons" style={{justifyContent:'flex-end'}}>
                      <span className="action-icon" onClick={() => handleAction('View Profile', a.name)}><Eye size={16}/></span>
                      <span className="action-icon" onClick={() => handleAction('Manage Access', a.name)}><UserCog size={16}/></span>
                      <span className="action-icon" onClick={() => handleAction('View Commissions', a.name)}><Wallet size={16}/></span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '24px', color: 'var(--text-secondary)'}}>
                    No agents found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
