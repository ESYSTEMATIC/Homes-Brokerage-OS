import React from 'react';
import { MARKETPLACE_STATS, PROJECTS } from '../data/staticData';
import { Globe, Mail, Home, TrendingUp, BarChart3, Star, MapPin, Building2 } from 'lucide-react';

const fmt = v => v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v;
const moneyFmt = v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v;

export const MarketplaceDashboard = () => (
  <div className="animate-fade-in">
    <div className="page-header">
      <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Marketplace Insights</span></div>
      <h1 className="page-title">Marketplace Insights</h1>
      <p className="page-subtitle">Platform traffic, inquiry sources, and project conversion performance</p>
    </div>

    <div className="kpi-grid kpi-grid-4" style={{ marginBottom: 24 }}>
      <div className="kpi-card">
        <div><div className="kpi-label">Total Visitors</div><div className="kpi-value">{fmt(MARKETPLACE_STATS.totalVisitors)}</div></div>
        <div className="kpi-icon blue"><Globe size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Active Inquiries</div><div className="kpi-value">{fmt(MARKETPLACE_STATS.inquiries)}</div></div>
        <div className="kpi-icon green"><Mail size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Tour Requests</div><div className="kpi-value">{fmt(MARKETPLACE_STATS.tourRequests)}</div></div>
        <div className="kpi-icon amber"><Home size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Conversion</div><div className="kpi-value">{MARKETPLACE_STATS.conversionRate}%</div></div>
        <div className="kpi-icon green"><TrendingUp size={20} /></div>
      </div>
    </div>

    <div className="grid-equal-2" style={{ marginBottom: 32 }}>
      <div>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart3 size={18} className="orange" /> Source Contribution
        </h2>
        <div className="data-panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Source Channel</th>
                <th>Leads</th>
                <th>Contribution</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {MARKETPLACE_STATS.topSources.map(s => (
                <tr key={s.name}>
                  <td className="bold">{s.name}</td>
                  <td>{s.leads}</td>
                  <td className="muted">{s.pct}%</td>
                  <td>
                    <div className="progress-bar" style={{ width: 120 }}>
                      <div className="progress-fill blue" style={{ width: `${s.pct}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Star size={18} className="orange" /> Top Performing Projects
        </h2>
        <div className="data-panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th style={{ textAlign: 'center' }}>Inquiries</th>
                <th style={{ textAlign: 'center' }}>Tours</th>
                <th style={{ textAlign: 'center' }}>Deals</th>
              </tr>
            </thead>
            <tbody>
              {MARKETPLACE_STATS.topProjects.map(p => (
                <tr key={p.name}>
                  <td className="bold">{p.name}</td>
                  <td style={{ textAlign: 'center' }}>{p.inquiries}</td>
                  <td style={{ textAlign: 'center' }}>{p.tours}</td>
                  <td className="bold" style={{ textAlign: 'center', color: 'var(--accent)' }}>{p.deals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <h2 className="section-title">Published Project Inventory</h2>
      <button className="btn btn-outline btn-sm">Export Report</button>
    </div>
    <div className="data-panel">
      <div className="data-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project</th>
              <th>Developer</th>
              <th>Location</th>
              <th style={{ textAlign: 'center' }}>Units</th>
              <th style={{ textAlign: 'center' }}>Available</th>
              <th>Type</th>
              <th>Delivery</th>
              <th>Price From</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map(p => (
              <tr key={p.id}>
                <td className="muted" style={{ fontSize: 11 }}>{p.id}</td>
                <td className="bold">{p.name}</td>
                <td>{p.developer}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} className="muted" /> {p.location}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>{p.units}</td>
                <td className="bold" style={{ textAlign: 'center', color: 'var(--success)' }}>{p.available}</td>
                <td><span className="badge badge-gray">{p.type}</span></td>
                <td>{p.delivery}</td>
                <td className="bold">EGP {moneyFmt(p.priceFrom)}</td>
                <td><span className={`badge ${p.status === 'Published' ? 'badge-success' : 'badge-gray'}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

