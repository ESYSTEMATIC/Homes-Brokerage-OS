import React from 'react';
import { STAFF } from '../data/staticData';
import { Eye, UserCog, Wallet } from 'lucide-react';

export const AgentsList = () => (
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
          <input className="data-search" placeholder="Search agents by name or ID..." />
          <select className="data-select"><option>All Statuses</option><option>Active</option><option>Suspended</option></select>
        </div>
        <div style={{fontSize:13,color:'var(--text-secondary)'}}>{STAFF.length} agent(s)</div>
      </div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Name</th><th>Branch</th><th>Team</th><th>Manager</th><th>Title</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
          <tbody>
            {STAFF.map(a=>(
              <tr key={a.id}>
                <td className="muted">{a.id}</td>
                <td className="bold">{a.name}</td>
                <td>{a.branch}</td>
                <td>{a.department}</td>
                <td>{a.manager}</td>
                <td>{a.title}</td>
                <td><span className={`badge ${a.status==='Active'?'badge-success':a.status==='Suspended'?'badge-danger':'badge-warning'}`}>{a.status}</span></td>
                <td><div className="action-icons" style={{justifyContent:'flex-end'}}><span className="action-icon"><Eye size={16}/></span><span className="action-icon"><UserCog size={16}/></span><span className="action-icon"><Wallet size={16}/></span></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
