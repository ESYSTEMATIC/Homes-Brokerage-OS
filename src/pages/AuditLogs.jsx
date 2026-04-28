import React, { useState } from 'react';
import { AUDIT_LOGS } from '../data/staticData';
import { Search, History, Filter } from 'lucide-react';

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  const [actionFilter, setActionFilter] = useState('All Actions');

  const filtered = AUDIT_LOGS.filter(a => {
    const matchesSearch = a.detail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         a.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         a.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'All Modules' || a.module === moduleFilter;
    const matchesAction = actionFilter === 'All Actions' || a.action === actionFilter;
    return matchesSearch && matchesModule && matchesAction;
  });

  const uniqueActions = [...new Set(AUDIT_LOGS.map(a => a.action))];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Audit Logs</span></div>
        <h1 className="page-title">Audit Logs</h1>
        <p className="page-subtitle">Immutable trail of sensitive actions</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search audit logs..." 
                style={{ paddingLeft: 44 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="data-select" value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
              <option>All Modules</option>
              <option>CRM</option>
              <option>Finance</option>
              <option>HR</option>
              <option>Backoffice</option>
              <option>Security</option>
              <option>Recruitment</option>
            </select>
            <select className="data-select" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
              <option>All Actions</option>
              {uniqueActions.map(act => <option key={act} value={act}>{act}</option>)}
            </select>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => alert('Exporting full audit trail...')}>
            <Filter size={14} /> Export CSV
          </button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Action</th><th>Actor</th><th>Target</th><th>Module</th><th>Timestamp</th><th>Detail</th></tr></thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id}>
                  <td className="muted">{a.id}</td>
                  <td className="bold">{a.action}</td>
                  <td>{a.actor}</td>
                  <td>{a.target}</td>
                  <td><span className="badge badge-info">{a.module}</span></td>
                  <td className="muted" style={{fontSize:11}}>{a.timestamp}</td>
                  <td style={{maxWidth:260,fontSize:12,color:'var(--text-secondary)'}}>{a.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
