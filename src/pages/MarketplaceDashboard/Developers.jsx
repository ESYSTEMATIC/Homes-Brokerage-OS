import { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StackedBar, VBar } from './Charts';
import { useMarketplaceTable, Pager } from './useMarketplaceTable';
import { MP_DEVELOPERS, LEAD_TYPE_TREND, TOP_10_DEVELOPERS } from '../../data/marketplaceData';

const STACK_COLORS = { inquiries: '#f4978e', viewings: '#9ca3af', mortgages: '#80c8a8', sell: '#fcd34d' };
const fmtRange = (min, max) => `EGP ${(min/1e6).toFixed(1)}M – EGP ${(max/1e6).toFixed(1)}M`;

export const DevelopersPage = () => {
  const { openDrawer } = useApp();
  const [showCharts, setShowCharts] = useState(true);
  const t = useMarketplaceTable(MP_DEVELOPERS, { searchKeys: ['name'], pageSize: 10 });

  const view = (d) => openDrawer({
    title: d.name, subtitle: 'Developer profile',
    content: (
      <div className="detail-grid">
        {[
          ['Developer', d.name],
          ['Projects', d.projects],
          ['Units', d.units],
          ['Price Range', fmtRange(d.priceMin, d.priceMax)],
          ['Governorates', d.governorates.join(', ')],
        ].map(([k,v]) => <div key={k}><label>{k}</label><div className="v">{v}</div></div>)}
      </div>
    ),
  });

  return (
    <div>
      <div className="mp-page-head">
        <div><h1>Developers</h1><p>Developer pipeline and project distribution</p></div>
        <button className={`mp-toggle ${showCharts?'on':''}`} onClick={()=>setShowCharts(s=>!s)}>
          <span className="sw"></span>{showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      {showCharts && (
        <>
          <div className="mp-kpi-grid cols-4">
            <div className="mp-kpi-card"><div className="mp-kpi-label">Total Developers</div><div className="mp-kpi-value">{MP_DEVELOPERS.length}</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Total Listings</div><div className="mp-kpi-value">120</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Most Active</div><div className="mp-kpi-value">Sodic</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Avg. Units/Developer</div><div className="mp-kpi-value">38</div></div>
          </div>
          <div className="mp-grid-2">
            <div className="mp-chart-card"><div className="mp-card-title">Lead Type Trend</div>
              <StackedBar data={LEAD_TYPE_TREND.slice(0, 10)} keys={['inquiries','viewings','mortgages','sell']} colors={STACK_COLORS} />
            </div>
            <div className="mp-chart-card"><div className="mp-card-title">Top 10 Developers By Unit Count</div>
              <VBar data={TOP_10_DEVELOPERS.map(d => ({ name: d.name, value: d.count }))} max={8} />
            </div>
          </div>
        </>
      )}

      <div className="mp-table-wrap">
        <div className="mp-table-toolbar">
          <div className="mp-search"><Search size={14} color="#9ca3af"/><input placeholder="Search…" value={t.q} onChange={e=>t.setQ(e.target.value)}/></div>
          <select className="mp-select" defaultValue=""><option value="">Developers</option></select>
          <select className="mp-select" defaultValue=""><option value="">All Governorates</option><option>Cairo</option><option>Giza</option><option>Matrouh</option></select>
        </div>
        <table className="mp-table">
          <thead><tr><th>Developer</th><th>Projects</th><th>Units</th><th>Price Range</th><th>Governorates</th><th>Profile</th></tr></thead>
          <tbody>{t.slice.map(d => (
            <tr key={d.id} className="clickable" onClick={()=>view(d)}>
              <td style={{ fontWeight: 600 }}>{d.name}</td>
              <td>{d.projects}</td>
              <td>{d.units}</td>
              <td>{fmtRange(d.priceMin, d.priceMax)}</td>
              <td>{d.governorates.join(', ')}</td>
              <td><span className="mp-link">View</span></td>
            </tr>
          ))}</tbody>
        </table>
        <Pager page={t.page} totalPages={t.totalPages} setPage={t.setPage} />
      </div>
    </div>
  );
};
