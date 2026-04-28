import React, { useState } from 'react';
import { DEPARTMENTS } from '../data/staticData';
import { Search, Building, Users, MoreVertical } from 'lucide-react';

export const Departments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = DEPARTMENTS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Departments</span></div>
        <h1 className="page-title">Departments</h1>
        <p className="page-subtitle">Organization structure and hierarchy</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search departments..." 
                style={{ paddingLeft: 44 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => alert('Opening Department Wizard...')}>
            + Add Department
          </button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Department</th><th>Head</th><th>Teams</th><th>Employees</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(d=>(
                <tr key={d.id}>
                  <td className="muted">{d.id}</td>
                  <td className="bold">{d.name}</td>
                  <td>{d.head}</td>
                  <td className="bold">{d.teams}</td>
                  <td>{d.employees}</td>
                  <td><span className="badge badge-success">{d.status}</span></td>
                  <td style={{textAlign:'right'}}>
                    <div className="action-icons" style={{justifyContent:'flex-end'}}>
                      <span className="action-icon" onClick={() => alert(`Viewing ${d.name} structure`)} title="View Hierarchy"><Building size={16}/></span>
                      <span className="action-icon" onClick={() => alert(`Viewing members of ${d.name}`)} title="View Members"><Users size={16}/></span>
                      <span className="action-icon" onClick={() => alert(`Options for ${d.name}`)} title="More"><MoreVertical size={16}/></span>
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
