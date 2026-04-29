import { Donut, VBar } from './Charts';
import { MP_LISTINGS, MP_BROKERAGES, MP_DEVELOPERS, MP_LEADS, B2C_USER_LIST, SUB_TYPE_DONUT, LISTINGS_BY_MONTH } from '../../data/marketplaceData';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const Overview = () => {
  const portfolioValue = MP_LISTINGS.reduce((s, l) => s + l.price, 0);
  const avgPrice = portfolioValue / MP_LISTINGS.length;
  const recent = MP_LEADS.slice(0, 3);

  return (
    <div>
      <div className="mp-page-head">
        <div>
          <h1>Overview</h1>
          <p>Daily summary of the marketplace performance.</p>
        </div>
      </div>

      <div className="mp-kpi-grid cols-4">
        {[
          ['TOTAL LISTINGS', MP_LISTINGS.length, '+12%'],
          ['TOTAL PORTFOLIO VALUE', `${(portfolioValue/1e9).toFixed(1)}B EGP`, '+8%'],
          ['TOTAL DEVELOPERS', MP_DEVELOPERS.length, '+3%'],
          ['TOTAL BROKERAGES', MP_BROKERAGES.length, '+3%'],
        ].map(([l,v,c]) => (
          <div key={l} className="mp-kpi-card">
            <div className="mp-kpi-label">{l}</div>
            <div className="mp-kpi-value">{v}</div>
            <div className="mp-kpi-up">↑ {c}</div>
          </div>
        ))}
      </div>

      <div className="mp-kpi-grid cols-4">
        {[
          ['AVG. LISTING PRICE', `${(avgPrice/1e6).toFixed(1)}M EGP`, '+8%'],
          ['TOTAL COMPOUND', 38, '+12%'],
          ['TOTAL LEADS', MP_LEADS.length, '+3%'],
          ['TOTAL USERS', B2C_USER_LIST.length, '+3%'],
        ].map(([l,v,c]) => (
          <div key={l} className="mp-kpi-card">
            <div className="mp-kpi-label">{l}</div>
            <div className="mp-kpi-value">{v}</div>
            <div className="mp-kpi-up">↑ {c}</div>
          </div>
        ))}
      </div>

      <div className="mp-grid-2">
        <div className="mp-chart-card">
          <div className="mp-card-title">By Property Sub-Type
            <select className="mp-select" defaultValue="Residential"><option>Residential</option><option>Commercial</option></select>
          </div>
          <Donut data={SUB_TYPE_DONUT} size={220} />
        </div>
        <div className="mp-chart-card">
          <div className="mp-card-title">Listings By Years
            <select className="mp-select" defaultValue="2026"><option>2026</option><option>2025</option><option>2024</option></select>
          </div>
          <VBar data={MONTHS.map((m, i) => ({ name: m, value: LISTINGS_BY_MONTH[i] }))} />
        </div>
      </div>

      <div className="mp-card" style={{ marginTop: 14 }}>
        <div className="mp-card-title">Recent Leads <span className="mp-link">See More…</span></div>
        <table className="mp-table">
          <thead><tr><th>Header</th><th>Type</th><th>MLS ID</th><th>Office</th><th>Date</th></tr></thead>
          <tbody>{recent.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.type}</td>
              <td>{r.mlsId}</td>
              <td>{r.office}</td>
              <td>{r.date}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};
