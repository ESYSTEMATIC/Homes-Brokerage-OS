import React from 'react';
import { TrendingUp, DollarSign, ReceiptText, Building, Clock, CheckCircle2, Users, FileText, BarChart3, PieChart } from 'lucide-react';

export const ExecutiveDashboard = () => (
  <div className="animate-fade-in">
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Executive Overview</span></div>
      <h1 className="page-title">Executive Overview</h1>
      <p className="page-subtitle">Strategic KPI monitoring and high-level platform health</p>
    </div>

    <div className="kpi-grid kpi-grid-4" style={{ marginBottom: 24 }}>
      <div className="kpi-card">
        <div><div className="kpi-label">Total Sales</div><div className="kpi-value" style={{ fontSize: 22 }}>EGP 39.5M</div></div>
        <div className="kpi-icon blue"><TrendingUp size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Company Revenue</div><div className="kpi-value" style={{ fontSize: 22 }}>EGP 790K</div></div>
        <div className="kpi-icon green"><DollarSign size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Total Expenses</div><div className="kpi-value" style={{ fontSize: 22 }}>EGP 293K</div></div>
        <div className="kpi-icon red"><ReceiptText size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Net Result</div><div className="kpi-value" style={{ fontSize: 22 }}>EGP 497K</div></div>
        <div className="kpi-icon green"><Building size={20} /></div>
      </div>
    </div>

    <div className="kpi-grid kpi-grid-4" style={{ marginBottom: 32 }}>
      <div className="kpi-card">
        <div><div className="kpi-label">Pending Comm.</div><div className="kpi-value">EGP 273K</div></div>
        <div className="kpi-icon amber"><Clock size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Paid Comm.</div><div className="kpi-value">EGP 348K</div></div>
        <div className="kpi-icon green"><CheckCircle2 size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Active Agents</div><div className="kpi-value">9 / 12</div></div>
        <div className="kpi-icon blue"><Users size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">App Funnel</div><div className="kpi-value">1 App. / 5 Pend.</div></div>
        <div className="kpi-icon amber"><FileText size={20} /></div>
      </div>
    </div>

    <div className="grid-equal-2" style={{ marginTop: 8, gap: 24 }}>
      <div className="data-panel" style={{ padding: 24 }}>
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <BarChart3 size={18} className="orange" /> Revenue vs Expenses Trend
        </h3>
        <div className="chart-placeholder" style={{ border: 'none', background: 'transparent', padding: 0 }}>
          <div className="chart-bars" style={{ height: 200 }}>
            {[65, 72, 85, 90, 88, 95].map((v, i) => (
              <div key={i} className="chart-bar" style={{ background: 'var(--accent)', height: `${v}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
            ))}
            {[20, 25, 22, 28, 30, 26].map((v, i) => (
              <div key={`e${i}`} className="chart-bar" style={{ background: 'var(--danger)', height: `${v}%`, borderRadius: '4px 4px 0 0', opacity: 0.6 }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, background: 'var(--accent)', borderRadius: 2 }}></div> Revenue</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, background: 'var(--danger)', borderRadius: 2 }}></div> Expenses</div>
          </div>
        </div>
      </div>
      
      <div className="data-panel" style={{ padding: 24 }}>
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <PieChart size={18} className="orange" /> Onboarding Funnel Status
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
          {[
            { label: 'Submitted', pct: 90, color: 'var(--accent)' },
            { label: 'Under Review', pct: 75, color: 'var(--accent)' },
            { label: 'Docs Complete', pct: 85, color: 'var(--accent)' },
            { label: 'Training Done', pct: 65, color: 'var(--accent)' },
            { label: 'CRM Ready', pct: 40, color: 'var(--success)' },
            { label: 'Matrix Ready', pct: 30, color: 'var(--success)' }
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 100, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 500 }}>{item.label}</span>
              <div className="progress-bar" style={{ flex: 1, height: 8 }}>
                <div className="progress-fill" style={{ width: `${item.pct}%`, background: item.color }}></div>
              </div>
              <span style={{ width: 35, fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

