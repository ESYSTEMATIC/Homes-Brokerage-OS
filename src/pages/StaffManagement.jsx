import React, { useState } from 'react';
import { STAFF } from '../data/staticData';
import { Eye, UserCog, Clock3 } from 'lucide-react';

export const StaffManagement = () => {
  const [tab, setTab] = useState('all');
  const filtered = tab === 'all' ? STAFF : STAFF.filter(s => {
    if (tab === 'employees') return s.type === 'Employee';
    if (tab === 'tl') return s.type === 'Team Leader';
    if (tab === 'sm') return s.type === 'Sales Manager';
    return true;
  });
  const counts = { all: STAFF.length, employees: STAFF.filter(s=>s.type==='Employee').length, tl: STAFF.filter(s=>s.type==='Team Leader').length, sm: STAFF.filter(s=>s.type==='Sales Manager').length };

  return (
    <div>
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
            <input className="data-search" placeholder="Search by name or ID..." />
            <select className="data-select"><option>All Statuses</option></select>
          </div>
          <button className="btn btn-primary">+ Add Staff</button>
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
                  <td><div className="action-icons" style={{justifyContent:'flex-end'}}><span className="action-icon"><Eye size={16}/></span><span className="action-icon"><UserCog size={16}/></span><span className="action-icon"><Clock3 size={16}/></span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
