import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Empty } from '../components/UI';
import { Eye, Download } from 'lucide-react';

export const HRPayroll = () => {
  const { state, openDrawer, toast, writeAudit } = useApp();
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.staff, {
    searchKeys:['name','id','department','title'], filters:{ status:'status' },
  });
  const today = () => new Date().toISOString().split('T')[0];

  const view = (s) => openDrawer({
    title: s.name, subtitle: `${s.title}`,
    content: (<div className="detail-grid">
      {[['ID',s.id],['Email',s.email],['Department',s.department],['Title',s.title],['Branch',s.branch],['Manager',s.manager],['Status',s.status],['Joined',s.joinDate]].map(([k,v])=>(
        <div key={k}><label>{k}</label><div className="v">{v}</div></div>))}
    </div>),
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">HR</span></div>
        <h1 className="page-title">HR</h1>
        <p className="page-subtitle">Employee records and HR operations — BRD 8.12</p>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Total Employees</div><div className="kpi-value">{state.staff.length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>👥</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Active</div><div className="kpi-value">{state.staff.filter(s=>s.status==='Active').length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Suspended</div><div className="kpi-value">{state.staff.filter(s=>s.status==='Suspended').length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>⛔</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pending</div><div className="kpi-value">{state.staff.filter(s=>s.status==='Pending').length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
      </div>
      <div className="info-banner">HR visibility into employee records, department assignments, and status management. Salary and payroll details are handled outside this platform.</div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search employees…" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option><option>Active</option><option>Suspended</option><option>Pending</option>
            </select>
          </div>
          <button className="btn btn-outline" onClick={()=>{exportCSV(`hr_payroll_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','HR Payroll CSV','HR');}}><Download size={14}/> Export</button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Title</th><th>Branch</th><th>Manager</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(s=>(
              <tr key={s.id}>
                <td className="muted">{s.id}</td>
                <td className="bold">{s.name}</td>
                <td>{s.department}</td>
                <td>{s.title}</td>
                <td>{s.branch}</td>
                <td>{s.manager}</td>
                <td><span className={`badge ${s.status==='Active'?'badge-success':s.status==='Suspended'?'badge-danger':'badge-warning'}`}>{s.status}</span></td>
                <td style={{textAlign:'right'}}><button className="btn btn-outline btn-sm" onClick={()=>view(s)}><Eye size={13}/> View</button></td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length===0 && <Empty />}
        </div>
      </div>
    </div>
  );
};
