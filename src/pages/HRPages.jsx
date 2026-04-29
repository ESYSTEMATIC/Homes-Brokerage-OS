import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Empty } from '../components/UI';
import { Eye, Download, CheckCircle2 } from 'lucide-react';

const fmt = v => 'EGP ' + (v||0).toLocaleString();
const statusBadge = s => s==='Approved'?'badge-success':s==='Draft'?'badge-gray':'badge-info';

export const EmployeeProfiles = () => {
  const { state, openDrawer, toast, writeAudit } = useApp();
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.staff, {
    searchKeys:['name','id','email','title'], filters:{ department:'department' },
  });
  const today = () => new Date().toISOString().split('T')[0];

  const view = (s) => openDrawer({
    title: s.name, subtitle: `${s.id} · ${s.title}`,
    content: (<div className="detail-grid">
      {[['ID',s.id],['Email',s.email],['Phone',s.phone],['Department',s.department],['Title',s.title],['Branch',s.branch],['Manager',s.manager],['Type',s.type],['Status',s.status],['Joined',s.joinDate]].map(([k,v])=>(
        <div key={k}><label>{k}</label><div className="v">{v}</div></div>))}
    </div>),
  });

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>HR</span><span>&gt;</span><span className="current">Employee Profiles</span></div><h1 className="page-title">Employee Profiles</h1><p className="page-subtitle">Employee management and records</p></div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search employees…" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.department} onChange={e=>setFilter('department', e.target.value)}>
              <option value="">All Departments</option>{[...new Set(state.staff.map(s=>s.department))].map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <button className="btn btn-outline" onClick={()=>{exportCSV(`employees_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Employees CSV','HR');}}><Download size={14}/> Export</button>
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
                <td style={{textAlign:'right'}}><button className="btn btn-outline btn-sm" onClick={()=>view(s)}><Eye size={13}/> View Profile</button></td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length===0 && <Empty />}
        </div>
      </div>
    </div>
  );
};

// Payroll module removed — business decision: no money/transaction surfaces in the platform.
