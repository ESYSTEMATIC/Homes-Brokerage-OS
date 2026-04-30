import { Donut, VBar, LineChart, HorizontalFunnel } from './Charts';
import { TRAFFIC_KPIS, TRAFFIC_BY_SOURCE, DEVICE_BREAKDOWN, PEAK_HOURS, VISITOR_TREND_12M, CONVERSION_FUNNEL, TOP_PAGES, REFERRAL_SOURCES, GEO_TRAFFIC } from '../../data/marketplaceData';

export const Traffic = () => (
  <div>
    <div className="mp-page-head">
      <div><h1>Traffic</h1><p>Comprehensive traffic analytics and business health</p></div>
    </div>

    <div className="mp-kpi-grid cols-4">
      <div className="mp-kpi-card"><div className="mp-kpi-label">Total Visitors</div><div className="mp-kpi-value">{(TRAFFIC_KPIS.totalVisitors/1000).toFixed(1)}K</div></div>
      <div className="mp-kpi-card"><div className="mp-kpi-label">Total Page Views</div><div className="mp-kpi-value">{(TRAFFIC_KPIS.totalPageViews/1000).toFixed(1)}K</div></div>
      <div className="mp-kpi-card"><div className="mp-kpi-label">Unique Sessions</div><div className="mp-kpi-value">{(TRAFFIC_KPIS.uniqueSessions/1000).toFixed(1)}K</div></div>
      <div className="mp-kpi-card"><div className="mp-kpi-label">Avg. Session Duration</div><div className="mp-kpi-value sm">{TRAFFIC_KPIS.avgSessionDuration}</div></div>
    </div>
    <div className="mp-kpi-grid cols-2">
      <div className="mp-kpi-card"><div className="mp-kpi-label">Bounce Rate</div><div className="mp-kpi-value">{TRAFFIC_KPIS.bounceRate}</div></div>
      <div className="mp-kpi-card"><div className="mp-kpi-label">Pages / Session</div><div className="mp-kpi-value">{TRAFFIC_KPIS.pagesPerSession}</div></div>
    </div>

    <div className="mp-grid-2">
      <div className="mp-chart-card">
        <div className="mp-card-title">Traffic By Source</div>
        <Donut data={TRAFFIC_BY_SOURCE.map(s => ({ ...s, label: s.name }))} size={220} />
      </div>
      <div className="mp-chart-card">
        <div className="mp-card-title">Device Breakdown</div>
        <Donut data={DEVICE_BREAKDOWN.map(s => ({ ...s, label: s.name }))} size={220} />
      </div>
    </div>

    <div className="mp-grid-2" style={{ marginTop: 0 }}>
      <div className="mp-chart-card">
        <div className="mp-card-title">Peak Hours</div>
        <VBar data={PEAK_HOURS.map((v, i) => ({ name: i % 3 === 0 ? `${String(i).padStart(2,'0')}:00` : '', value: v }))} max={Math.max(...PEAK_HOURS)} />
      </div>
      <div className="mp-chart-card">
        <div className="mp-card-title">Geographic Traffic</div>
        <table className="mp-table"><thead><tr><th>Country</th><th>Sessions</th><th>%</th></tr></thead>
          <tbody>{GEO_TRAFFIC.map(g => (<tr key={g.country}><td>{g.country}</td><td>{g.sessions.toLocaleString()}</td><td>{g.pct}%</td></tr>))}</tbody>
        </table>
      </div>
    </div>

    <div className="mp-grid-2">
      <div className="mp-chart-card">
        <div className="mp-card-title">Visitor Trend (12 Months)</div>
        <LineChart data={VISITOR_TREND_12M.map(v => v * 1000)} />
      </div>
      <div className="mp-chart-card">
        <div className="mp-card-title">Conversion Funnel</div>
        <HorizontalFunnel data={CONVERSION_FUNNEL} />
      </div>
    </div>

    <div className="mp-card" style={{ marginTop: 14 }}>
      <div className="mp-card-title">Top Pages</div>
      <table className="mp-table">
        <thead><tr><th>Page</th><th>Views</th><th>Unique</th><th>Avg. Time</th><th>Bounce %</th></tr></thead>
        <tbody>{TOP_PAGES.map(p => (
          <tr key={p.page}><td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.page}</td><td>{p.views.toLocaleString()}</td><td>{p.unique.toLocaleString()}</td><td>{p.avgTime}</td><td>{p.bounce}</td></tr>
        ))}</tbody>
      </table>
    </div>

    <div className="mp-card" style={{ marginTop: 14 }}>
      <div className="mp-card-title">Referral Sources</div>
      <table className="mp-table">
        <thead><tr><th>Source</th><th>Sessions</th><th>Leads</th><th>Conv. Rate</th></tr></thead>
        <tbody>{REFERRAL_SOURCES.map(r => (
          <tr key={r.source}><td>{r.source}</td><td>{r.sessions.toLocaleString()}</td><td>{r.leads}</td><td>{r.convRate}</td></tr>
        ))}</tbody>
      </table>
    </div>
  </div>
);
