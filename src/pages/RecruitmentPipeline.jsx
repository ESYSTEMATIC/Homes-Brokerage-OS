import React from 'react';
import { CANDIDATES, JOBS } from '../data/staticData';

const stageColor = s => s==='Offer'?'badge-success':s==='Rejected'?'badge-danger':s==='Interview'?'badge-info':s==='Screening'?'badge-warning':'badge-gray';

export const RecruitmentPipeline = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Candidate Pipeline</span></div>
      <h1 className="page-title">Candidate Pipeline</h1>
      <p className="page-subtitle">Manage candidates, interviews, and scorecards — BRD 8.10</p>
    </div>
    <div className="kpi-grid kpi-grid-5">
      {['Applied','Screening','Interview','Offer','Rejected'].map(s=>(
        <div className="kpi-card" key={s}><div><div className="kpi-label">{s}</div><div className="kpi-value">{CANDIDATES.filter(c=>c.stage===s).length}</div></div><div className={`kpi-icon ${s==='Offer'?'green':s==='Rejected'?'red':s==='Interview'?'blue':'amber'}`}><span style={{fontSize:18}}>👤</span></div></div>
      ))}
    </div>
    <div className="data-panel">
      <div className="data-toolbar"><div className="data-toolbar-left"><input className="data-search" placeholder="Search candidates..." /><select className="data-select"><option>All Stages</option></select><select className="data-select"><option>All Jobs</option></select></div></div>
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Name</th><th>Job</th><th>Stage</th><th>Score</th><th>Source</th><th>Applied</th><th>Interviewer</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
          <tbody>{CANDIDATES.map(c=>(<tr key={c.id}><td className="muted">{c.id}</td><td className="bold">{c.name}</td><td>{c.job}</td><td><span className={`badge ${stageColor(c.stage)}`}>{c.stage}</span></td><td className="bold">{c.score??'—'}</td><td className="muted">{c.source}</td><td className="muted">{c.applied}</td><td>{c.interviewer||'—'}</td><td style={{textAlign:'right'}}><div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>{!['Rejected','Offer'].includes(c.stage)&&<button className="btn btn-outline btn-sm">Next Step</button>}{c.stage!=='Rejected'&&<button className="btn btn-danger btn-sm">Reject</button>}</div></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
