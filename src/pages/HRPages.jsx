import React, { useState } from 'react';
import { STAFF, DEPARTMENTS } from '../data/staticData';
import { Search, Eye, UserCog, Mail } from 'lucide-react';

const fmt = v => 'EGP ' + v.toLocaleString();

export const EmployeeProfiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');

  const filtered = STAFF.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All Departments' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>HR & Payroll</span><span>&gt;</span><span className="current">Employee Profiles</span></div>
        <h1 className="page-title">Employee Profiles</h1>
        <p className="page-subtitle">Employee management and records</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search employees..." 
                style={{ paddingLeft: 44 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="data-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option>All Departments</option>
              {(DEPARTMENTS.length > 0 ? DEPARTMENTS.map(d => d.name) : ['Sales', 'HR', 'Finance', 'Marketing', 'Backoffice']).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Title</th>
                <th>Branch</th>
                <th>Manager</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="muted">{s.id}</td>
                  <td className="bold">{s.name}</td>
                  <td>{s.department}</td>
                  <td>{s.title}</td>
                  <td>{s.branch}</td>
                  <td>{s.manager}</td>
                  <td>
                    <span className={`badge ${s.status === 'Active' ? 'badge-success' : s.status === 'Suspended' ? 'badge-danger' : 'badge-warning'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-icons" style={{ justifyContent: 'flex-end' }}>
                      <span className="action-icon" onClick={() => alert(`Viewing profile for ${s.name}`)} title="View Profile"><Eye size={16} /></span>
                      <span className="action-icon" onClick={() => alert(`Editing permissions for ${s.name}`)} title="Manage Permissions"><UserCog size={16} /></span>
                      <span className="action-icon" onClick={() => alert(`Emailing ${s.name}`)} title="Contact Employee"><Mail size={16} /></span>
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

export const Payroll = () => (
  <div>
    <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>HR & Payroll</span><span>&gt;</span><span className="current">Payroll</span></div><h1 className="page-title">Payroll</h1><p className="page-subtitle">Employee management and compensation</p></div>
    <div className="kpi-grid kpi-grid-3">
      <div className="kpi-card"><div><div className="kpi-label">Total Employees</div><div className="kpi-value">{PAYROLL.length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>👥</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Total Base Salaries</div><div className="kpi-value" style={{fontSize:20}}>{fmt(127000)}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💰</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Total Payroll (Net)</div><div className="kpi-value" style={{fontSize:20}}>{fmt(425400)}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>📋</span></div></div>
    </div>
    <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>Employee</th><th>Title</th><th>Base Salary</th><th>Variable Commission</th><th>Deductions</th><th>Net Pay</th><th>Period</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>{PAYROLL.map(p=><tr key={p.name}><td className="bold">{p.name}</td><td>{p.title}</td><td>{fmt(p.base)}</td><td>{fmt(p.commission)}</td><td style={{color:'var(--danger)'}}>{fmt(p.deductions)}</td><td className="bold">{fmt(p.net)}</td><td className="muted">{p.period}</td><td><span className={`badge ${statusBadge(p.status)}`}>{p.status}</span></td><td>{p.status==='Draft'?<button className="btn btn-primary btn-sm">Approve</button>:p.status==='Approved'?<button className="btn btn-outline btn-sm">Process</button>:<span style={{color:'var(--success)',fontWeight:600}}>Paid ✓</span>}</td></tr>)}</tbody></table></div></div>
  </div>
);
