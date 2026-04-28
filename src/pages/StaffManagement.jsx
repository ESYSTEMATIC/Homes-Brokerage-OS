import React, { useState } from 'react';
import { STAFF } from '../data/staticData';
import { Eye, UserCog, Clock3, Search, UserPlus } from 'lucide-react';

export const StaffManagement = () => {
  const [tab, setTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = STAFF.filter(s => {
    const matchesTab = tab === 'all' || 
                      (tab === 'employees' && s.type === 'Employee') ||
                      (tab === 'tl' && s.type === 'Team Leader') ||
                      (tab === 'sm' && s.type === 'Sales Manager');
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || s.status === statusFilter;
    
    return matchesTab && matchesSearch && matchesStatus;
  });

  const uniqueStatuses = [...new Set(STAFF.map(s => s.status))];
  const counts = { 
    all: STAFF.length, 
    employees: STAFF.filter(s=>s.type==='Employee').length, 
    tl: STAFF.filter(s=>s.type==='Team Leader').length, 
    sm: STAFF.filter(s=>s.type==='Sales Manager').length 
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Staff Management</span></div>
        <h1 className="page-title">Staff Management</h1>
        <p className="page-subtitle">Manage internal portal users — employees, team leaders, and managers</p>
      </div>
      <div className="tabs">
        {[['all','All Staff'],['employees','Employees'],['tl','Team Leaders'],['sm','Sales Managers']].map(([k,l])=>(
          <button key={k} className={`tab ${tab===k?'active':''}`} onClick={()=>setTab(k)}>{l} ({counts[k]})</button>
        ))}
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search by name or ID..." 
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
          <button className="btn btn-primary btn-sm" onClick={() => alert('Opening Add Staff Form...')}>
            <UserPlus size={14} /> Add Staff
          </button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Title</th><th>Branch</th><th>Manager</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id}>
                  <td className="muted">{s.id}</td>
                  <td className="bold">{s.name}</td>
                  <td>{s.department}</td>
                  <td>{s.title}</td>
                  <td>{s.branch}</td>
                  <td>{s.manager}</td>
                  <td><span className={`badge ${s.status==='Active'?'badge-success':s.status==='Suspended'?'badge-danger':'badge-warning'}`}>{s.status}</span></td>
                  <td>
                    <div className="action-icons" style={{justifyContent:'flex-end'}}>
                      <span className="action-icon" onClick={() => alert(`Viewing profile for ${s.name}`)} title="View Profile"><Eye size={16}/></span>
                      <span className="action-icon" onClick={() => alert(`Managing permissions for ${s.name}`)} title="User Permissions"><UserCog size={16}/></span>
                      <span className="action-icon" onClick={() => alert(`Viewing activity logs for ${s.name}`)} title="Activity Logs"><Clock3 size={16}/></span>
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
