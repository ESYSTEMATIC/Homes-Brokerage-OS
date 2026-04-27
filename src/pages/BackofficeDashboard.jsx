import React from 'react';
import { Users, UserCheck, FileText, TrendingUp, DollarSign, Clock, Wallet, ReceiptText, Building, ArrowRight, FileWarning, ShieldAlert } from 'lucide-react';

export const BackofficeDashboard = () => (
  <div>
    <div className="page-header">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Homes Brokerage — Backoffice Control Cockpit</p>
    </div>

    <div className="filter-bar">
      <select><option>This Month</option></select>
      <select><option>All Developers</option></select>
      <select><option>All Projects</option></select>
      <select><option>All Branches</option></select>
    </div>

    <div className="kpi-grid kpi-grid-5">
      <div className="kpi-card"><div><div className="kpi-label">Total Agents</div><div className="kpi-value">12</div></div><div className="kpi-icon gray"><Users size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Active Agents</div><div className="kpi-value">9</div><div className="kpi-change up">↑ +2 this month</div></div><div className="kpi-icon green"><UserCheck size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Pending Applications</div><div className="kpi-value">5</div></div><div className="kpi-icon amber"><FileText size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Total Sales</div><div className="kpi-value" style={{fontSize:22}}>EGP 39,500,000</div></div><div className="kpi-icon blue"><TrendingUp size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Company Revenue</div><div className="kpi-value" style={{fontSize:22}}>EGP 790,000</div><div className="kpi-change up">↑ +12% vs last month</div></div><div className="kpi-icon green"><DollarSign size={20}/></div></div>
    </div>

    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Pending Commissions</div><div className="kpi-value" style={{fontSize:22}}>EGP 273,000</div></div><div className="kpi-icon amber"><Clock size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Paid Commissions</div><div className="kpi-value" style={{fontSize:22}}>EGP 348,000</div><div className="kpi-change" style={{color:'var(--text-secondary)'}}>vs Unpaid</div></div><div className="kpi-icon green"><Wallet size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Total Expenses</div><div className="kpi-value" style={{fontSize:22}}>EGP 293,000</div></div><div className="kpi-icon red"><ReceiptText size={20}/></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Net Result</div><div className="kpi-value" style={{fontSize:22}}>EGP 497,000</div><div className="kpi-change up">↑ Profitable</div></div><div className="kpi-icon green"><Building size={20}/></div></div>
    </div>

    <div className="grid-2col" style={{marginTop:8}}>
      <div>
        <h2 className="section-title">Operational Queues</h2>
        <div className="grid-equal-2">
          <div className="queue-card"><div className="queue-card-left"><div className="kpi-icon amber"><FileText size={18}/></div><div className="queue-card-info"><h4>Pending Onboarding</h4><div className="queue-card-value">2</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
          <div className="queue-card"><div className="queue-card-left"><div className="kpi-icon red"><FileWarning size={18}/></div><div className="queue-card-info"><h4>Missing Documents</h4><div className="queue-card-value">3</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
          <div className="queue-card"><div className="queue-card-left"><div className="kpi-icon amber"><Clock size={18}/></div><div className="queue-card-info"><h4>Training Incomplete</h4><div className="queue-card-value">4</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
          <div className="queue-card"><div className="queue-card-left"><div className="kpi-icon red"><ShieldAlert size={18}/></div><div className="queue-card-info"><h4>Access Blocked</h4><div className="queue-card-value">2</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
          <div className="queue-card"><div className="queue-card-left"><div className="kpi-icon blue"><Wallet size={18}/></div><div className="queue-card-info"><h4>Pending Payouts</h4><div className="queue-card-value">3</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
        </div>
      </div>
      <div>
        <h2 className="section-title">Active Alerts</h2>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="alert-card critical"><span className="alert-card-text">Critical: Unauthorized discount on North Edge deal</span><span className="alert-card-action">View</span></div>
          <div className="alert-card warning"><span className="alert-card-text">3 agents have overdue training modules</span><span className="alert-card-action">View</span></div>
          <div className="alert-card warning"><span className="alert-card-text">Commission dispute pending resolution</span><span className="alert-card-action">View</span></div>
        </div>
      </div>
    </div>
  </div>
);
