import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Empty } from '../components/UI';
import { Download } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

export const AuditLogs = () => {
  const { state, toast, writeAudit } = useApp();
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.audit, {
    searchKeys:['action','actor','target','detail','id'],
    filters:{ module:'module', action:'action' },
  });

  const modules = [...new Set(state.audit.map(a=>a.module))];
  const actions = [...new Set(state.audit.map(a=>a.action))];

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Audit Logs</span></div>
        <h1 className="page-title">Audit Logs</h1>
        <p className="page-subtitle">Immutable trail of sensitive actions — BRD 10.3</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search audit logs..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.module} onChange={e=>setFilter('module', e.target.value)}>
              <option value="">All Modules</option>{modules.map(m=><option key={m}>{m}</option>)}
            </select>
            <select className="data-select" value={filterVals.action} onChange={e=>setFilter('action', e.target.value)}>
              <option value="">All Actions</option>{actions.map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
          <button className="btn btn-outline" onClick={()=>{exportCSV(`audit_${today()}`,filtered); toast(`Exported ${filtered.length} logs`); writeAudit('Export','Audit CSV','Security');}}><Download size={14}/> Export</button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Action</th><th>Actor</th><th>Target</th><th>Module</th><th>Timestamp</th><th>Detail</th></tr></thead>
            <tbody>{filtered.map(a=>(
              <tr key={a.id}>
                <td className="muted">{a.id}</td>
                <td className="bold">{a.action}</td>
                <td>{a.actor}</td>
                <td>{a.target}</td>
                <td><span className="badge badge-info">{a.module}</span></td>
                <td className="muted">{a.timestamp}</td>
                <td style={{maxWidth:280,fontSize:12,color:'var(--text-secondary)'}}>{a.detail}</td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length===0 && <Empty message="No audit entries match your filters." />}
        </div>
      </div>
    </div>
  );
};
