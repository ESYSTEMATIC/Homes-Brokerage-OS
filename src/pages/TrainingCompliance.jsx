import React, { useState } from 'react';
import { STAFF } from '../data/staticData';
import { Search, Filter, Mail, CheckCircle, Eye, Bell } from 'lucide-react';

export const TrainingCompliance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const handleAction = (action, name) => {
    alert(`${action} triggered for ${name}`);
  };

  const filteredStaff = STAFF.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Simulate status logic based on random progress in the UI
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Training Compliance</span></div>
        <h1 className="page-title">Training Compliance</h1>
        <p className="page-subtitle">Training gates and readiness status</p>
      </div>

      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card">
          <div><div className="kpi-label">Employees Tracked</div><div className="kpi-value">{STAFF.length}</div></div>
          <div className="kpi-icon blue"><span style={{fontSize:20}}>👥</span></div>
        </div>
        <div className="kpi-card">
          <div><div className="kpi-label">Fully Compliant</div><div className="kpi-value">4</div><div className="kpi-change up">50% of staff</div></div>
          <div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div>
        </div>
        <div className="kpi-card">
          <div><div className="kpi-label">Training In Progress</div><div className="kpi-value">3</div></div>
          <div className="kpi-icon amber"><span style={{fontSize:20}}>📖</span></div>
        </div>
        <div className="kpi-card">
          <div><div className="kpi-label">Access Blocked</div><div className="kpi-value">1</div></div>
          <div className="kpi-icon red"><span style={{fontSize:20}}>🔒</span></div>
        </div>
      </div>

      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search employee..." 
                style={{ paddingLeft: 44 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="data-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Fully Compliant</option>
              <option>In Progress</option>
              <option>Not Started</option>
              <option>Access Blocked</option>
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => handleAction('Run Report', 'Global Compliance')}>
            <Filter size={14} /> Export Report
          </button>
        </div>

        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Title</th>
                <th>Department</th>
                <th>Required Courses</th>
                <th>Completed</th>
                <th>Progress</th>
                <th>Access Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(s => {
                const pct = Math.floor(Math.random() * 60) + 40;
                const comp = pct >= 90;
                return (
                  <tr key={s.id}>
                    <td className="bold">{s.name}</td>
                    <td>{s.title}</td>
                    <td>{s.department}</td>
                    <td style={{ textAlign: 'center' }}>5</td>
                    <td style={{ textAlign: 'center' }}>{comp ? 5 : Math.floor(pct / 20)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="progress-bar" style={{ width: 100 }}>
                          <div className={`progress-fill ${comp ? 'green' : pct > 60 ? 'blue' : 'amber'}`} style={{ width: `${pct}%` }}></div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${comp ? 'badge-success' : s.status === 'Suspended' ? 'badge-danger' : 'badge-warning'}`}>
                        {comp ? 'Active' : s.status === 'Suspended' ? 'Blocked' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="action-icons" style={{ justifyContent: 'flex-end' }}>
                        <span className="action-icon" onClick={() => handleAction('View Progress', s.name)} title="View Progress"><Eye size={16} /></span>
                        <span className="action-icon" onClick={() => handleAction('Send Reminder', s.name)} title="Send Reminder"><Bell size={16} /></span>
                        <span className="action-icon" onClick={() => handleAction('Review Documents', s.name)} title="Review Documents"><CheckCircle size={16} /></span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
