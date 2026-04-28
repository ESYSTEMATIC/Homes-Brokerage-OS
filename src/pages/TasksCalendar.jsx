import React, { useState } from 'react';
import { TASKS } from '../data/staticData';
import { Search, Calendar, CheckSquare, Plus } from 'lucide-react';

const prioColor = p => p==='High'?'badge-danger':p==='Medium'?'badge-warning':'badge-info';
const statusColor = s => s==='Completed'?'badge-success':s==='Overdue'?'badge-danger':'badge-warning';

export const TasksCalendar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = TASKS.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.owner && t.owner.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'All Types' || t.type === typeFilter;
    const matchesStatus = statusFilter === 'All Statuses' || t.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const uniqueTypes = [...new Set(TASKS.map(t => t.type))];
  const uniqueStatuses = [...new Set(TASKS.map(t => t.status))];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Tasks & Calendar</span></div>
        <h1 className="page-title">Tasks & Calendar</h1>
        <p className="page-subtitle">Unified task list — every lead, tour, and deal has a next action</p>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Total Tasks</div><div className="kpi-value">{TASKS.length}</div></div><div className="kpi-icon blue"><Calendar size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pending</div><div className="kpi-value">{TASKS.filter(t=>t.status==='Pending').length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Overdue</div><div className="kpi-value">{TASKS.filter(t=>t.status==='Overdue').length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>⚠️</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Completed</div><div className="kpi-value">{TASKS.filter(t=>t.status==='Completed').length}</div></div><div className="kpi-icon green"><CheckSquare size={20}/></div></div>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search tasks..." 
                style={{ paddingLeft: 44 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="data-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option>All Types</option>
              {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select className="data-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Statuses</option>
              {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => alert('Opening Task Creator...')}>
            <Plus size={14} /> New Task
          </button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Owner</th><th>Lead</th><th>Due Date</th><th>Priority</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(t=>(
                <tr key={t.id}>
                  <td className="muted">{t.id}</td>
                  <td className="bold">{t.title}</td>
                  <td>{t.type}</td>
                  <td>{t.owner||<span style={{color:'var(--danger)',fontWeight:600}}>Unassigned</span>}</td>
                  <td className="muted">{t.lead}</td>
                  <td className="muted" style={{fontSize:12}}>{t.due}</td>
                  <td><span className={`badge ${prioColor(t.priority)}`}>{t.priority}</span></td>
                  <td><span className={`badge ${statusColor(t.status)}`}>{t.status}</span></td>
                  <td style={{textAlign:'right'}}>
                    <button className="btn btn-outline btn-sm" onClick={() => alert(`Opening task ${t.id}`)}>View</button>
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
