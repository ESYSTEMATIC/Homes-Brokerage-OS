import React from 'react';
import { TASKS } from '../data/staticData';

const prioColor = p => p==='High'?'badge-danger':p==='Medium'?'badge-warning':'badge-info';
const statusColor = s => s==='Completed'?'badge-success':s==='Overdue'?'badge-danger':'badge-warning';

export const TasksCalendar = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Tasks & Calendar</span></div>
      <h1 className="page-title">Tasks & Calendar</h1>
      <p className="page-subtitle">Unified task list — every lead, tour, and deal has a next action — BRD 8.7</p>
    </div>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Total Tasks</div><div className="kpi-value">{TASKS.length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📋</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Pending</div><div className="kpi-value">{TASKS.filter(t=>t.status==='Pending').length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Overdue</div><div className="kpi-value">{TASKS.filter(t=>t.status==='Overdue').length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>⚠️</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Completed</div><div className="kpi-value">{TASKS.filter(t=>t.status==='Completed').length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
    </div>
    <div className="data-panel">
      <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search tasks..." /><select className="data-select"><option>All Types</option></select><select className="data-select"><option>All Statuses</option></select></div></div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Owner</th><th>Lead</th><th>Due Date</th><th>Priority</th><th>Status</th></tr></thead>
          <tbody>{TASKS.map(t=>(<tr key={t.id}><td className="muted">{t.id}</td><td className="bold">{t.title}</td><td>{t.type}</td><td>{t.owner||<span style={{color:'var(--danger)',fontWeight:600}}>Unassigned</span>}</td><td className="muted">{t.lead}</td><td>{t.due}</td><td><span className={`badge ${prioColor(t.priority)}`}>{t.priority}</span></td><td><span className={`badge ${statusColor(t.status)}`}>{t.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
