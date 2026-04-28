import React, { useState } from 'react';
import { LEADS } from '../data/staticData';
import { Eye, UserPlus, GitMerge, FileEdit, Phone, Mail } from 'lucide-react';

const fmt = v => new Intl.NumberFormat('en-EG',{style:'currency',currency:'EGP',maximumFractionDigits:0}).format(v);
const badgeFor = s => s==='Hot'?'badge-danger':s==='Warm'?'badge-warning':'badge-info';
const stageFor = s => ['New','Contacted'].includes(s)?'badge-info':s==='Qualified'?'badge-warning':['Tour Scheduled','Negotiation','Reservation'].includes(s)?'badge-success':'badge-gray';

export const CRMLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');

  const uniqueStages = [...new Set(LEADS.map(l => l.stage))];
  const uniqueSources = [...new Set(LEADS.map(l => l.source))];
  const uniquePriorities = [...new Set(LEADS.map(l => l.priority))];

  const filteredLeads = LEADS.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.id.toLowerCase().includes(searchTerm.toLowerCase()) || l.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All Stages' || l.stage === stageFilter;
    const matchesSource = sourceFilter === 'All Sources' || l.source === sourceFilter;
    const matchesPriority = priorityFilter === 'All Priorities' || l.priority === priorityFilter;
    return matchesSearch && matchesStage && matchesSource && matchesPriority;
  });

  const handleAction = (action, name) => {
    alert(`${action} triggered for ${name}`);
  };

  return (
    <div>
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Lead Management</span></div>
          <h1 className="page-title">Lead Management</h1>
          <p className="page-subtitle">CRM lead workspace — duplicate control, hierarchy assignment, qualification</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleAction('Create Lead', 'New Lead')}>+ New Lead</button>
      </div>
      <div className="kpi-grid kpi-grid-5">
        <div className="kpi-card"><div><div className="kpi-label">Total Leads</div><div className="kpi-value">{LEADS.length}</div></div><div className="kpi-icon blue"><Eye size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Unassigned</div><div className="kpi-value">{LEADS.filter(l=>!l.owner).length}</div></div><div className="kpi-icon red"><UserPlus size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Hot Leads</div><div className="kpi-value">{LEADS.filter(l=>l.priority==='Hot').length}</div></div><div className="kpi-icon amber"><Eye size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Duplicate Review</div><div className="kpi-value">{LEADS.filter(l=>l.duplicate==='Review').length}</div></div><div className="kpi-icon amber"><GitMerge size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pipeline Value</div><div className="kpi-value" style={{fontSize:18}}>{fmt(LEADS.reduce((s,l)=>s+l.budget,0))}</div></div><div className="kpi-icon green"><Eye size={20}/></div></div>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search leads by name, ID, project..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
            <select className="data-select" value={stageFilter} onChange={e=>setStageFilter(e.target.value)}>
              <option>All Stages</option>
              {uniqueStages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="data-select" value={sourceFilter} onChange={e=>setSourceFilter(e.target.value)}>
              <option>All Sources</option>
              {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="data-select" value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)}>
              <option>All Priorities</option>
              {uniquePriorities.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{fontSize:13,color:'var(--text-secondary)', fontWeight: 600}}>{filteredLeads.length} lead(s)</div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Source</th><th>Project</th><th>Developer</th><th>Budget</th><th>Stage</th><th>Priority</th><th>Owner</th><th>Duplicate</th><th style={{textAlign: 'right'}}>Actions</th></tr></thead>
            <tbody>
              {filteredLeads.length > 0 ? filteredLeads.map(l=>(
                <tr key={l.id}>
                  <td className="muted">{l.id}</td>
                  <td className="bold">{l.name}</td>
                  <td>{l.source}</td>
                  <td>{l.project}</td>
                  <td className="muted">{l.developer}</td>
                  <td>{fmt(l.budget)}</td>
                  <td><span className={`badge ${stageFor(l.stage)}`}>{l.stage}</span></td>
                  <td><span className={`badge ${badgeFor(l.priority)}`}>{l.priority}</span></td>
                  <td>{l.owner||<span style={{color:'var(--danger)',fontWeight:600}}>Unassigned</span>}</td>
                  <td><span className={`badge ${l.duplicate==='Clear'?'badge-success':'badge-warning'}`}>{l.duplicate}</span></td>
                  <td>
                    <div className="action-icons" style={{justifyContent: 'flex-end'}}>
                      <span className="action-icon" onClick={() => handleAction('View Details', l.name)}><Eye size={16}/></span>
                      <span className="action-icon" onClick={() => handleAction('Edit Lead', l.name)}><FileEdit size={16}/></span>
                      <span className="action-icon" onClick={() => handleAction('Call', l.name)}><Phone size={16}/></span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="11" style={{textAlign: 'center', padding: '24px', color: 'var(--text-secondary)'}}>
                    No leads found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
