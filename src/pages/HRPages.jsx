import React from 'react';
import { STAFF } from '../data/staticData';
const fmt = v => 'EGP ' + v.toLocaleString();
const PAYROLL = [
  { name:'Ahmed Hassan',title:'Senior Sales Executive',base:18000,commission:37500,deductions:3200,net:52300,period:'January 2024',status:'Approved' },
  { name:'Mohamed Ali',title:'Team Leader',base:25000,commission:66000,deductions:4500,net:86500,period:'January 2024',status:'Approved' },
  { name:'Nour El-Din',title:'Sales Manager',base:35000,commission:135000,deductions:6200,net:163800,period:'January 2024',status:'Draft' },
  { name:'Omar Sherif',title:'Team Leader',base:22000,commission:54000,deductions:3800,net:72200,period:'January 2024',status:'Approved' },
  { name:'Sara Nabil',title:'Sales Executive',base:15000,commission:28500,deductions:2800,net:40700,period:'January 2024',status:'Paid' },
  { name:'Hana Mahmoud',title:'Junior Sales',base:12000,commission:0,deductions:2100,net:9900,period:'January 2024',status:'Draft' },
];
const statusBadge = s => s==='Approved'?'badge-success':s==='Draft'?'badge-gray':'badge-info';

export const EmployeeProfiles = () => (
  <div>
    <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>HR & Payroll</span><span>&gt;</span><span className="current">Employee Profiles</span></div><h1 className="page-title">Employee Profiles</h1><p className="page-subtitle">Employee management and records</p></div>
    <div className="data-panel"><div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search employees..." /><select className="data-select"><option>All Departments</option></select></div></div>
    <div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Title</th><th>Branch</th><th>Manager</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
    <tbody>{STAFF.map(s=><tr key={s.id}><td className="muted">{s.id}</td><td className="bold">{s.name}</td><td>{s.department}</td><td>{s.title}</td><td>{s.branch}</td><td>{s.manager}</td><td><span className={`badge ${s.status==='Active'?'badge-success':s.status==='Suspended'?'badge-danger':'badge-warning'}`}>{s.status}</span></td><td style={{textAlign:'right'}}><button className="btn btn-outline btn-sm">View Profile</button></td></tr>)}</tbody></table></div></div>
  </div>
);

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
