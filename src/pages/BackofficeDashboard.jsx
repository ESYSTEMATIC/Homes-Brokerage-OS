import React, { useState, useEffect } from 'react';
import { Users, UserCheck, FileText, TrendingUp, DollarSign, Clock, Wallet, ReceiptText, Building, ArrowRight, FileWarning, ShieldAlert } from 'lucide-react';

export const BackofficeDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [developerFilter, setDeveloperFilter] = useState('All Developers');
  const [projectFilter, setProjectFilter] = useState('All Projects');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  
  // Simulated dynamic data based on filters
  const [data, setData] = useState({
    totalAgents: 12,
    activeAgents: 9,
    pendingApps: 5,
    totalSales: 39500000,
    revenue: 790000,
    pendingComm: 273000,
    paidComm: 348000,
    expenses: 293000,
    net: 497000
  });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => {
      // Logic to vary data based on filters
      const multiplier = timeFilter === 'This Year' ? 12 : timeFilter === 'Last Month' ? 0.9 : 1;
      const devMod = developerFilter === 'All Developers' ? 1 : 0.4;
      
      setData({
        totalAgents: Math.floor(12 * multiplier * devMod),
        activeAgents: Math.floor(9 * multiplier * devMod),
        pendingApps: Math.floor(5 * devMod),
        totalSales: Math.floor(39500000 * multiplier * devMod),
        revenue: Math.floor(790000 * multiplier * devMod),
        pendingComm: Math.floor(273000 * multiplier),
        paidComm: Math.floor(348000 * multiplier),
        expenses: Math.floor(293000 * multiplier),
        net: Math.floor(497000 * multiplier)
      });
      setIsUpdating(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [timeFilter, developerFilter, projectFilter, branchFilter]);

  const fmt = v => new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(v);

  const handleAction = (message) => {
    alert(message);
  };

  return (
    <div className={`animate-fade-in ${isUpdating ? 'updating-fade' : ''}`}>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Homes Brokerage — Backoffice Control Cockpit</p>
      </div>

      <div className="data-toolbar" style={{marginBottom: 24, background: 'transparent', padding: 0, border: 'none'}}>
        <div className="data-toolbar-left">
          <select className="data-select" value={timeFilter} onChange={e => setTimeFilter(e.target.value)}>
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <select className="data-select" value={developerFilter} onChange={e => setDeveloperFilter(e.target.value)}>
            <option>All Developers</option>
            <option>Palm Hills</option>
            <option>Ora</option>
            <option>Sodic</option>
          </select>
          <select className="data-select" value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
            <option>All Projects</option>
            <option>ZED East</option>
            <option>Hacienda Bay</option>
          </select>
          <select className="data-select" value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
            <option>All Branches</option>
            <option>New Cairo</option>
            <option>6th October</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid kpi-grid-5">
        <div className="kpi-card"><div><div className="kpi-label">Total Agents</div><div className="kpi-value">{data.totalAgents}</div></div><div className="kpi-icon gray"><Users size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Active Agents</div><div className="kpi-value">{data.activeAgents}</div><div className="kpi-change up">↑ +2 this month</div></div><div className="kpi-icon green"><UserCheck size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pending Applications</div><div className="kpi-value">{data.pendingApps}</div></div><div className="kpi-icon amber"><FileText size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Total Sales</div><div className="kpi-value" style={{fontSize:18}}>{fmt(data.totalSales)}</div></div><div className="kpi-icon blue"><TrendingUp size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Company Revenue</div><div className="kpi-value" style={{fontSize:18}}>{fmt(data.revenue)}</div><div className="kpi-change up">↑ +12% vs last month</div></div><div className="kpi-icon green"><DollarSign size={20}/></div></div>
      </div>

      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Pending Commissions</div><div className="kpi-value" style={{fontSize:18}}>{fmt(data.pendingComm)}</div></div><div className="kpi-icon amber"><Clock size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Paid Commissions</div><div className="kpi-value" style={{fontSize:18}}>{fmt(data.paidComm)}</div><div className="kpi-change" style={{color:'var(--text-secondary)'}}>vs Unpaid</div></div><div className="kpi-icon green"><Wallet size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Total Expenses</div><div className="kpi-value" style={{fontSize:18}}>{fmt(data.expenses)}</div></div><div className="kpi-icon red"><ReceiptText size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Net Result</div><div className="kpi-value" style={{fontSize:18}}>{fmt(data.net)}</div><div className="kpi-change up">↑ Profitable</div></div><div className="kpi-icon green"><Building size={20}/></div></div>
      </div>

      <div className="grid-2col" style={{marginTop:8}}>
        <div>
          <h2 className="section-title">Operational Queues</h2>
          <div className="grid-equal-2">
            <div className="queue-card" onClick={() => handleAction('Navigating to Onboarding Queue...')}><div className="queue-card-left"><div className="kpi-icon amber"><FileText size={18}/></div><div className="queue-card-info"><h4>Pending Onboarding</h4><div className="queue-card-value">2</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
            <div className="queue-card" onClick={() => handleAction('Navigating to Documents Review...')}><div className="queue-card-left"><div className="kpi-icon red"><FileWarning size={18}/></div><div className="queue-card-info"><h4>Missing Documents</h4><div className="queue-card-value">3</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
            <div className="queue-card" onClick={() => handleAction('Navigating to Training Compliance...')}><div className="queue-card-left"><div className="kpi-icon amber"><Clock size={18}/></div><div className="queue-card-info"><h4>Training Incomplete</h4><div className="queue-card-value">4</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
            <div className="queue-card" onClick={() => handleAction('Viewing Blocked Access Logs...')}><div className="queue-card-left"><div className="kpi-icon red"><ShieldAlert size={18}/></div><div className="queue-card-info"><h4>Access Blocked</h4><div className="queue-card-value">2</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
            <div className="queue-card" onClick={() => handleAction('Navigating to Finance Module...')}><div className="queue-card-left"><div className="kpi-icon blue"><Wallet size={18}/></div><div className="queue-card-info"><h4>Pending Payouts</h4><div className="queue-card-value">3</div></div></div><ArrowRight size={16} color="#9ca3af"/></div>
          </div>
        </div>
        <div>
          <h2 className="section-title">Active Alerts</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div className="alert-card critical"><span className="alert-card-text">Critical: Unauthorized discount on North Edge deal</span><span className="alert-card-action" onClick={() => handleAction('Viewing Deal D-502...')}>View</span></div>
            <div className="alert-card warning"><span className="alert-card-text">3 agents have overdue training modules</span><span className="alert-card-action" onClick={() => handleAction('Filtering agents by overdue training...')}>View</span></div>
            <div className="alert-card warning"><span className="alert-card-text">Commission dispute pending resolution</span><span className="alert-card-action" onClick={() => handleAction('Opening dispute #4421...')}>View</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
