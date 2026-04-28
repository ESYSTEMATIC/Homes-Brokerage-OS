import React, { useState } from 'react';
import { DEALS } from '../data/staticData';
const fmt = v => new Intl.NumberFormat('en-EG',{style:'currency',currency:'EGP',maximumFractionDigits:0}).format(v);
const stages = ['Qualified','Tour Scheduled','Negotiation','Reservation','Contracting','Closed Won','Closed Lost'];
const stageColor = s => s==='Closed Won'?'badge-success':s==='Closed Lost'?'badge-danger':['Reservation','Contracting'].includes(s)?'badge-info':'badge-warning';

export const DealsPipeline = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All Stages');

  const filteredDeals = DEALS.filter(d => {
    const matchesSearch = d.lead.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase()) || d.project.toLowerCase().includes(searchTerm.toLowerCase()) || d.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All Stages' || d.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Deals Pipeline</span></div>
        <h1 className="page-title">Deals Pipeline</h1>
        <p className="page-subtitle">Transaction progression — qualification to closing</p>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Active Deals</div><div className="kpi-value">{DEALS.filter(d=>d.status==='Active').length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20,fontWeight:800}}>📊</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pipeline Value</div><div className="kpi-value" style={{fontSize:20}}>{fmt(DEALS.filter(d=>d.status==='Active').reduce((s,d)=>s+d.value,0))}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💰</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Avg Commission</div><div className="kpi-value">{(DEALS.reduce((s,d)=>s+d.commission,0)/DEALS.length).toFixed(1)}%</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>📈</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Closed Lost</div><div className="kpi-value">{DEALS.filter(d=>d.stage==='Closed Lost').length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>❌</span></div></div>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search deals by ID, Lead, Owner..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
            <select className="data-select" value={stageFilter} onChange={e=>setStageFilter(e.target.value)}>
              <option>All Stages</option>
              {stages.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{fontSize:13,color:'var(--text-secondary)'}}>{filteredDeals.length} deal(s)</div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Lead</th><th>Owner</th><th>Project</th><th>Developer</th><th>Value</th><th>Commission</th><th>Stage</th><th>Status</th></tr></thead>
            <tbody>
              {filteredDeals.length > 0 ? filteredDeals.map(d=>(
                <tr key={d.id}>
                  <td className="muted">{d.id}</td>
                  <td className="bold">{d.lead}</td>
                  <td>{d.owner}</td>
                  <td>{d.project}</td>
                  <td className="muted">{d.developer}</td>
                  <td className="bold">{fmt(d.value)}</td>
                  <td>{d.commission}%</td>
                  <td><span className={`badge ${stageColor(d.stage)}`}>{d.stage}</span></td>
                  <td><span className={`badge ${d.status==='Active'?'badge-success':'badge-gray'}`}>{d.status}</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" style={{textAlign: 'center', padding: '24px', color: 'var(--text-secondary)'}}>
                    No deals found matching the current filters.
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
