import React from 'react';
import { STAFF, TRAINING } from '../data/staticData';

export const TrainingCompliance = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Training Compliance</span></div>
      <h1 className="page-title">Training Compliance</h1>
      <p className="page-subtitle">Training gates and readiness status — BRD 8.11</p>
    </div>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Employees Tracked</div><div className="kpi-value">{STAFF.length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>👥</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Fully Compliant</div><div className="kpi-value">4</div><div className="kpi-change up">50% of staff</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Training In Progress</div><div className="kpi-value">3</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>📖</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Access Blocked</div><div className="kpi-value">1</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>🔒</span></div></div>
    </div>
    <div className="data-panel">
      <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search employee..." /><select className="data-select"><option>All Status</option></select></div></div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>Employee</th><th>Title</th><th>Department</th><th>Required Courses</th><th>Completed</th><th>Progress</th><th>Access Status</th></tr></thead>
          <tbody>
            {STAFF.map(s=>{const pct=Math.floor(Math.random()*60)+40;const comp=pct>=90;return(
              <tr key={s.id}><td className="bold">{s.name}</td><td>{s.title}</td><td>{s.department}</td><td>5</td><td>{comp?5:Math.floor(pct/20)}</td><td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="progress-bar" style={{width:100}}><div className={`progress-fill ${comp?'green':pct>60?'blue':'amber'}`} style={{width:`${pct}%`}}></div></div><span style={{fontSize:12,fontWeight:600}}>{pct}%</span></div></td><td><span className={`badge ${comp?'badge-success':s.status==='Suspended'?'badge-danger':'badge-warning'}`}>{comp?'Active':s.status==='Suspended'?'Blocked':'Pending'}</span></td></tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
