import React from 'react';
const fmt = v => 'EGP ' + v.toLocaleString();

const DEALS_REV = [
  { id:'DL001',unit:'PH-BAD-A101',developer:'Palm Hills',agent:'Ahmed Hassan',price:4500000,revenue:90000,status:'Approved' },
  { id:'DL002',unit:'EM-VIL-B205',developer:'SODIC',agent:'Fatma Ibrahim',price:6200000,revenue:124000,status:'Pending' },
  { id:'DL003',unit:'MV-IC-C310',developer:'Mountain View',agent:'Mohamed Ali',price:3800000,revenue:76000,status:'Paid' },
  { id:'DL004',unit:'ORA-ZED-D102',developer:'Ora Developers',agent:'Sara Nabil',price:5100000,revenue:102000,status:'Approved' },
  { id:'DL005',unit:'CE-NC-E201',developer:'City Edge',agent:'Dina Samir',price:2900000,revenue:58000,status:'Pending' },
  { id:'DL006',unit:'TM-OW-F305',developer:'Ora Developers',agent:'Ahmed Hassan',price:7800000,revenue:156000,status:'Paid' },
  { id:'DL007',unit:'SD-EST-G110',developer:'SODIC',agent:'Mohamed Ali',price:9200000,revenue:184000,status:'Approved' },
];
const COMM_ENGINE = [
  { deal:'PH-BAD-A101',agent:'Ahmed Hassan',pool:135000,agentShare:45000,tlShare:13500,companyShare:76500,status:'Approved' },
  { deal:'EM-VIL-B205',agent:'Fatma Ibrahim',pool:186000,agentShare:62000,tlShare:18600,companyShare:105400,status:'Pending' },
  { deal:'MV-IC-C310',agent:'Mohamed Ali',pool:114000,agentShare:38000,tlShare:11400,companyShare:64600,status:'Paid' },
  { deal:'ORA-ZED-D102',agent:'Sara Nabil',pool:153000,agentShare:51000,tlShare:15300,companyShare:86700,status:'Approved' },
  { deal:'CE-NC-E201',agent:'Dina Samir',pool:87000,agentShare:29000,tlShare:8700,companyShare:49300,status:'Pending' },
  { deal:'TM-OW-F305',agent:'Ahmed Hassan',pool:234000,agentShare:78000,tlShare:23400,companyShare:132600,status:'Paid' },
  { deal:'SD-EST-G110',agent:'Mohamed Ali',pool:276000,agentShare:92000,tlShare:27600,companyShare:156400,status:'Approved' },
];
const AGENT_DUES = [
  { agent:'Ahmed Hassan',totalEarned:123000,paid:78000,pending:45000,status:'Partial' },
  { agent:'Fatma Ibrahim',totalEarned:62000,paid:0,pending:62000,status:'Unpaid' },
  { agent:'Mohamed Ali',totalEarned:130000,paid:38000,pending:92000,status:'Partial' },
  { agent:'Sara Nabil',totalEarned:51000,paid:51000,pending:0,status:'Cleared' },
  { agent:'Dina Samir',totalEarned:29000,paid:0,pending:29000,status:'Unpaid' },
  { agent:'Hana Mahmoud',totalEarned:0,paid:0,pending:0,status:'No Deals' },
];
const statusBadge = s => s==='Approved'?'badge-success':s==='Pending'?'badge-warning':s==='Paid'?'badge-info':s==='Cleared'?'badge-success':s==='Unpaid'?'badge-danger':s==='Partial'?'badge-warning':'badge-gray';

export const FinanceOverview = () => (
  <div>
    <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Financial Mgmt</span><span>&gt;</span><span className="current">Overview</span></div><h1 className="page-title">Financial Overview</h1><p className="page-subtitle">Revenue, commissions, and financial health — BRD 8.13</p></div>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Total Revenue</div><div className="kpi-value" style={{fontSize:20}}>{fmt(790000)}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💰</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Total Commission Pool</div><div className="kpi-value" style={{fontSize:20}}>{fmt(1185000)}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📊</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Pending Payouts</div><div className="kpi-value" style={{fontSize:20}}>{fmt(273000)}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Net Result</div><div className="kpi-value" style={{fontSize:20}}>{fmt(497000)}</div><div className="kpi-change up">↑ Profitable</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>📈</span></div></div>
    </div>
    <div className="grid-equal-2">
      <div className="chart-placeholder"><div className="chart-title">Monthly Revenue Trend</div><div className="chart-bars">{[45,58,72,65,78,90].map((v,i)=><div key={i} className="chart-bar" style={{background:'rgba(232,103,42,0.2)',height:`${v}%`,borderTop:'3px solid #E8672A'}}/>)}</div></div>
      <div className="chart-placeholder"><div className="chart-title">Commission Distribution</div><div style={{display:'flex',flexDirection:'column',gap:12,flex:1,justifyContent:'center'}}>{[['Agent Share',35],['TL Share',10],['Company Share',55]].map(([l,p])=><div key={l} style={{display:'flex',alignItems:'center',gap:12}}><span style={{width:100,fontSize:12,color:'var(--text-secondary)',textAlign:'right'}}>{l}</span><div className="progress-bar" style={{flex:1}}><div className="progress-fill blue" style={{width:`${p}%`}}/></div><span style={{fontSize:12,fontWeight:600}}>{p}%</span></div>)}</div></div>
    </div>
  </div>
);

export const DealsRevenue = () => (
  <div>
    <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Financial Mgmt</span><span>&gt;</span><span className="current">Deals & Revenue</span></div><h1 className="page-title">Deals & Revenue</h1><p className="page-subtitle">Revenue, commissions, and agent dues</p></div>
    <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>Deal ID</th><th>Unit</th><th>Developer</th><th>Agent</th><th>Unit Price</th><th>Company Revenue</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>{DEALS_REV.map(d=><tr key={d.id}><td className="muted">{d.id}</td><td className="bold">{d.unit}</td><td>{d.developer}</td><td>{d.agent}</td><td>{fmt(d.price)}</td><td className="bold">{fmt(d.revenue)}</td><td><span className={`badge ${statusBadge(d.status)}`}>{d.status}</span></td><td><button className="btn btn-outline btn-sm">View</button></td></tr>)}</tbody></table></div></div>
  </div>
);

export const CommissionEngine = () => (
  <div>
    <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Financial Mgmt</span><span>&gt;</span><span className="current">Commission Engine</span></div><h1 className="page-title">Commission Engine</h1><p className="page-subtitle">Revenue, commissions, and agent dues</p></div>
    <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>Deal</th><th>Agent</th><th>Commission Pool</th><th>Agent Share</th><th>TL Share</th><th>Company Share</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>{COMM_ENGINE.map(c=><tr key={c.deal}><td className="bold">{c.deal}</td><td>{c.agent}</td><td className="bold">{fmt(c.pool)}</td><td>{fmt(c.agentShare)}</td><td>{fmt(c.tlShare)}</td><td>{fmt(c.companyShare)}</td><td><span className={`badge ${statusBadge(c.status)}`}>{c.status}</span></td><td>{c.status==='Pending'?<button className="btn btn-primary btn-sm">Approve</button>:c.status==='Approved'?<button className="btn btn-outline btn-sm">Mark Paid</button>:<span style={{color:'var(--success)',fontWeight:600}}>Paid ✓</span>}</td></tr>)}</tbody></table></div></div>
  </div>
);

export const AgentDues = () => (
  <div>
    <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Financial Mgmt</span><span>&gt;</span><span className="current">Agent Dues</span></div><h1 className="page-title">Agent Dues</h1><p className="page-subtitle">Outstanding agent payments and settlement tracking</p></div>
    <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>Agent</th><th>Total Earned</th><th>Paid</th><th>Pending</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>{AGENT_DUES.map(a=><tr key={a.agent}><td className="bold">{a.agent}</td><td>{fmt(a.totalEarned)}</td><td className="muted">{fmt(a.paid)}</td><td className="bold">{fmt(a.pending)}</td><td><span className={`badge ${statusBadge(a.status)}`}>{a.status}</span></td><td>{a.pending>0&&<button className="btn btn-primary btn-sm">Process Payment</button>}</td></tr>)}</tbody></table></div></div>
  </div>
);
