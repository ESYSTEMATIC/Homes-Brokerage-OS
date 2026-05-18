import { Link } from 'react-router-dom';
import { Donut, VBar } from './Charts';
import { MP_LISTINGS, MP_BROKERAGES, MP_DEVELOPERS, MP_LEADS, B2C_USER_LIST, SUB_TYPE_DONUT, LISTINGS_BY_MONTH } from '../../data/marketplaceData';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const Overview = () => {
  const portfolioValue = MP_LISTINGS.reduce((s, l) => s + l.price, 0);
  const avgPrice = portfolioValue / MP_LISTINGS.length;
  const recent = MP_LEADS.slice(0, 3);
  // Engagement metrics — synthetic but plausible numbers for the demo.
  // Audit-finding fix: surface saves + conversion alongside the existing views.
  const totalViews = 187_240;
  const totalSaves = 12_460;
  const inquiries = MP_LEADS.length * 12;
  const conversionRate = ((inquiries / totalViews) * 100).toFixed(1);

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

      {/* Audit-finding fix: User engagement widget — surfaces views, saves,
          inquiries, and the conversion ratio for the marketplace. */}
      <div className="mp-card" style={{ marginTop: 14, padding: 0 }}>
        <div className="mp-card-title" style={{ padding: '14px 18px' }}>
          User Engagement
          <Link to="/marketplace/traffic" className="mp-link">See More…</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, padding:'8px 18px 18px' }}>
          {[
            ['Total Views',         totalViews.toLocaleString(),                 '+18%', '#3b82f6'],
            ['Saved Properties',    totalSaves.toLocaleString(),                 '+22%', '#10b981'],
            ['Inquiries (30d)',     inquiries.toLocaleString(),                  '+14%', '#f59e0b'],
            ['Conversion Rate',     `${conversionRate}%`,                        '+0.4%','#E8672A'],
          ].map(([l,v,delta,c]) => (
            <div key={l} style={{padding:'12px 14px', background:'#fff', border:`1px solid ${c}33`, borderTop:`3px solid ${c}`, borderRadius:10}}>
              <div style={{fontSize:10, color:'#64748b', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em'}}>{l}</div>
              <div style={{fontSize:22, fontWeight:800, color:'#0f172a', marginTop:3}}>{v}</div>
              <div style={{fontSize:11, color:'#16a34a', fontWeight:600, marginTop:2}}>↑ {delta}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mp-card" style={{ marginTop: 14 }}>
        <div className="mp-card-title">
          Recent Leads
          {/* Audit-finding fix (May 2026): wired See More → /marketplace/leads */}
          <Link to="/marketplace/leads" className="mp-link">See More…</Link>
        </div>
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
