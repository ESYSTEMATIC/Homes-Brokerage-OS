import React from 'react';
import { MARKETPLACE_STATS, PROJECTS } from '../data/staticData';
const fmt = v => v>=1000?(v/1000).toFixed(1)+'K':v;

export const MarketplaceDashboard = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Marketplace Dashboard</span></div>
      <h1 className="page-title">Marketplace Dashboard</h1>
      <p className="page-subtitle">Traffic, inquiry, source, and project performance — BRD 8.8</p>
    </div>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Total Visitors</div><div className="kpi-value">{fmt(MARKETPLACE_STATS.totalVisitors)}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>🌐</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Inquiries</div><div className="kpi-value">{fmt(MARKETPLACE_STATS.inquiries)}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>📩</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Tour Requests</div><div className="kpi-value">{fmt(MARKETPLACE_STATS.tourRequests)}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>🏠</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Conversion Rate</div><div className="kpi-value">{MARKETPLACE_STATS.conversionRate}%</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>📈</span></div></div>
    </div>
    <div className="grid-equal-2">
      <div>
        <h2 className="section-title">Source Contribution</h2>
        <div className="data-panel">
          <table className="data-table"><thead><tr><th>Source</th><th>Leads</th><th>Share</th><th>Bar</th></tr></thead>
            <tbody>{MARKETPLACE_STATS.topSources.map(s=>(<tr key={s.name}><td className="bold">{s.name}</td><td>{s.leads}</td><td>{s.pct}%</td><td><div className="progress-bar" style={{width:120}}><div className="progress-fill blue" style={{width:`${s.pct}%`}}></div></div></td></tr>))}</tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="section-title">Top Projects</h2>
        <div className="data-panel">
          <table className="data-table"><thead><tr><th>Project</th><th>Inquiries</th><th>Tours</th><th>Deals</th></tr></thead>
            <tbody>{MARKETPLACE_STATS.topProjects.map(p=>(<tr key={p.name}><td className="bold">{p.name}</td><td>{p.inquiries}</td><td>{p.tours}</td><td className="bold">{p.deals}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
    <h2 className="section-title" style={{marginTop:24}}>Published Projects</h2>
    <div className="data-panel">
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Project</th><th>Developer</th><th>Location</th><th>Units</th><th>Available</th><th>Type</th><th>Delivery</th><th>Price From</th><th>Status</th></tr></thead>
          <tbody>{PROJECTS.map(p=>(<tr key={p.id}><td className="muted">{p.id}</td><td className="bold">{p.name}</td><td>{p.developer}</td><td>{p.location}</td><td>{p.units}</td><td className="bold">{p.available}</td><td>{p.type}</td><td>{p.delivery}</td><td>EGP {(p.priceFrom/1e6).toFixed(1)}M</td><td><span className={`badge ${p.status==='Published'?'badge-success':'badge-gray'}`}>{p.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>
);
