import React, { useState } from 'react';
import { ROLES } from '../data/staticData';
import { Search, Shield, Settings, UserCheck } from 'lucide-react';

export const RolesPermissions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = ROLES.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Roles & Permissions</span></div>
        <h1 className="page-title">Roles & Permissions</h1>
        <p className="page-subtitle">Custom role creation and permission catalog</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search roles..." 
                style={{ paddingLeft: 44 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => alert('Opening Role Creator...')}>
            + Create Role
          </button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Role Name</th><th>Department</th><th>Permissions</th><th>Assigned Users</th><th>Description</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(r=>(
                <tr key={r.id}>
                  <td className="muted">{r.id}</td>
                  <td className="bold">{r.name}</td>
                  <td>{r.department}</td>
                  <td className="bold">{r.permissions}</td>
                  <td>{r.users}</td>
                  <td style={{maxWidth:250, fontSize:12, color:'var(--text-secondary)'}}>{r.desc}</td>
                  <td><span className="badge badge-success">{r.status}</span></td>
                  <td style={{textAlign:'right'}}>
                    <div className="action-icons" style={{justifyContent:'flex-end'}}>
                      <span className="action-icon" onClick={() => alert(`Configuring ${r.name}`)} title="Manage Permissions"><Shield size={16}/></span>
                      <span className="action-icon" onClick={() => alert(`Viewing users for ${r.name}`)} title="View Users"><UserCheck size={16}/></span>
                      <span className="action-icon" onClick={() => alert(`Role Settings for ${r.name}`)} title="Settings"><Settings size={16}/></span>
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
