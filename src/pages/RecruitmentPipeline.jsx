import React, { useState } from 'react';
import { CANDIDATES, JOBS } from '../data/staticData';
import { Search, UserPlus, FileText, ChevronRight } from 'lucide-react';

const stageColor = s => s==='Offer'?'badge-success':s==='Rejected'?'badge-danger':s==='Interview'?'badge-info':s==='Screening'?'badge-warning':'badge-gray';

export const RecruitmentPipeline = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [jobFilter, setJobFilter] = useState('All Jobs');

  const filtered = CANDIDATES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All Stages' || c.stage === stageFilter;
    const matchesJob = jobFilter === 'All Jobs' || c.job === jobFilter;
    return matchesSearch && matchesStage && matchesJob;
  });

  const uniqueStages = [...new Set(CANDIDATES.map(c => c.stage))];
  const uniqueJobs = [...new Set(JOBS.map(j => j.title))];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Candidate Pipeline</span></div>
        <h1 className="page-title">Candidate Pipeline</h1>
        <p className="page-subtitle">Manage candidates, interviews, and scorecards</p>
      </div>
      <div className="kpi-grid kpi-grid-5">
        {['Applied','Screening','Interview','Offer','Rejected'].map(s=>(
          <div className="kpi-card" key={s}><div><div className="kpi-label">{s}</div><div className="kpi-value">{CANDIDATES.filter(c=>c.stage===s).length}</div></div><div className={`kpi-icon ${s==='Offer'?'green':s==='Rejected'?'red':s==='Interview'?'blue':'amber'}`}><span style={{fontSize:18}}>👤</span></div></div>
        ))}
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search candidates..." 
                style={{ paddingLeft: 44 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="data-select" value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
              <option>All Stages</option>
              {uniqueStages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="data-select" value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
              <option>All Jobs</option>
              {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => alert('Manually adding candidate...')}>
            <UserPlus size={14} /> Add Candidate
          </button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Job</th><th>Stage</th><th>Score</th><th>Source</th><th>Applied</th><th>Interviewer</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id}>
                  <td className="muted">{c.id}</td>
                  <td className="bold">{c.name}</td>
                  <td>{c.job}</td>
                  <td><span className={`badge ${stageColor(c.stage)}`}>{c.stage}</span></td>
                  <td className="bold">{c.score??'—'}</td>
                  <td className="muted">{c.source}</td>
                  <td className="muted">{c.applied}</td>
                  <td>{c.interviewer||'—'}</td>
                  <td style={{textAlign:'right'}}>
                    <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                      <button className="btn btn-outline btn-sm" onClick={() => alert(`Viewing scorecard for ${c.name}`)} title="View Scorecard"><FileText size={14} /></button>
                      {!['Rejected','Offer'].includes(c.stage)&&<button className="btn btn-success btn-sm" onClick={() => alert(`Moving ${c.name} to next stage`)}>Next Step</button>}
                      {c.stage!=='Rejected' && <button className="btn btn-danger btn-sm" onClick={() => alert(`Rejecting ${c.name}`)}>Reject</button>}
                    </div>
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
