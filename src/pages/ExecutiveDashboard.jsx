import React from 'react';

export const ExecutiveDashboard = () => (
  <div>
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Executive Dashboard</span></div>
      <h1 className="page-title">Executive Dashboard</h1>
      <p className="page-subtitle">High-level overview for leadership — BRD Section 9</p>
    </div>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Total Sales</div><div className="kpi-value" style={{fontSize:22}}>EGP 39,500,000</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📈</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Company Revenue</div><div className="kpi-value" style={{fontSize:22}}>EGP 790,000</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💰</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Total Expenses</div><div className="kpi-value" style={{fontSize:22}}>EGP 293,000</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>💸</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Net Operating Result</div><div className="kpi-value" style={{fontSize:22}}>EGP 497,000</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>🏦</span></div></div>
    </div>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Pending Commissions</div><div className="kpi-value" style={{fontSize:22}}>EGP 273,000</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Paid Commissions</div><div className="kpi-value" style={{fontSize:22}}>EGP 348,000</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Active Agents</div><div className="kpi-value">9 / 12</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>👥</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Applications</div><div className="kpi-value">1 approved / 5 pending</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>📋</span></div></div>
    </div>
    <div className="grid-equal-2" style={{marginTop:8}}>
      <div className="chart-placeholder">
        <div className="chart-title">Revenue vs Expenses Trend (Monthly)</div>
        <div className="chart-bars">{[65,72,85,90,88,95].map((v,i)=><div key={i} className="chart-bar" style={{background:'rgba(37,99,235,.2)',height:`${v}%`,borderTop:'3px solid var(--accent)'}}></div>)}{[20,25,22,28,30,26].map((v,i)=><div key={`e${i}`} className="chart-bar" style={{background:'rgba(220,38,38,.15)',height:`${v}%`,borderTop:'3px solid var(--danger)'}}></div>)}</div>
      </div>
      <div className="chart-placeholder">
        <div className="chart-title">Onboarding Funnel</div>
        <div style={{display:'flex',flexDirection:'column',gap:12,flex:1,justifyContent:'center'}}>
          {[['Submitted',90],['Under Review',75],['Docs Complete',85],['Training Done',65],['CRM Ready',40],['Matrix Ready',30]].map(([label,pct])=>(
            <div key={label} style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{width:100,fontSize:12,color:'var(--text-secondary)',textAlign:'right'}}>{label}</span>
              <div className="progress-bar" style={{flex:1}}><div className="progress-fill blue" style={{width:`${pct}%`}}></div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
