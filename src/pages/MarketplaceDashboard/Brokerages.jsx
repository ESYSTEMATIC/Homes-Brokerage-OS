import { useState } from 'react';
import { Search, ArrowDownUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StackedBar, VBar } from './Charts';
import { useMarketplaceTable, Pager } from './useMarketplaceTable';
import { MP_BROKERAGES, LEAD_TYPE_TREND, TOP_10_DEVELOPERS } from '../../data/marketplaceData';

const fmt = v => 'EGP ' + (v / 1e6).toFixed(1) + 'M';
const STACK_COLORS = { inquiries: '#f4978e', viewings: '#9ca3af', mortgages: '#80c8a8', sell: '#fcd34d' };

export const Brokerages = () => {
  const { openDrawer } = useApp();
  const [showCharts, setShowCharts] = useState(true);
  const t = useMarketplaceTable(MP_BROKERAGES, { searchKeys: ['name','mlsId'], pageSize: 10 });

  const view = (b) => openDrawer({
    title: b.name, subtitle: `${b.mlsId} · Office profile`,
    content: (
      <div className="detail-grid">
        {[
          ['Office Name', b.name],
          ['MLS ID', b.mlsId],
          ['Properties', b.properties],
          ['Active Leads', b.leads],
          ['Avg. Price', fmt(b.avgPrice)],
        ].map(([k,v]) => <div key={k}><label>{k}</label><div className="v">{v}</div></div>)}
      </div>
    ),
  });

  return (
    <div>
      <div className="mp-page-head">
        <div><h1>Brokerages</h1><p>Office performance and listing distribution</p></div>
        <button className={`mp-toggle ${showCharts?'on':''}`} onClick={()=>setShowCharts(s=>!s)}>
          <span className="sw"></span>{showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      {showCharts && (
        <>
          <div className="mp-kpi-grid cols-4">
            <div className="mp-kpi-card"><div className="mp-kpi-label">Total Offices</div><div className="mp-kpi-value">{MP_BROKERAGES.length}</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Total Listings</div><div className="mp-kpi-value">120</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Most Active Office</div><div className="mp-kpi-value sm">{MP_BROKERAGES[0].name.split(' ').slice(0,2).join(' ')}</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Avg. Listings/Office</div><div className="mp-kpi-value">30</div></div>
          </div>
          <div className="mp-grid-2">
            <div className="mp-chart-card">
              <div className="mp-card-title">Lead Type Trend</div>
              <StackedBar data={LEAD_TYPE_TREND.slice(0, 4).map(d => ({ ...d, m: d.m }))} keys={['inquiries','viewings','mortgages','sell']} colors={STACK_COLORS} />
            </div>
            <div className="mp-chart-card">
              <div className="mp-card-title">Top 10 Developers By Unit Count</div>
              <VBar data={TOP_10_DEVELOPERS.map(d => ({ name: d.name, value: d.count }))} max={8} />
            </div>
          </div>
        </>
      )}

      <div className="mp-table-wrap">
        <div className="mp-table-toolbar">
          <div className="mp-search"><Search size={14} color="#9ca3af"/><input placeholder="Search…" value={t.q} onChange={e=>t.setQ(e.target.value)} /></div>
          <button className="mp-icon-pill"><ArrowDownUp size={14}/></button>
        </div>
        <table className="mp-table">
          <thead><tr><th>Office Name</th><th>MLS ID</th><th>Properties</th><th>Leads</th><th>Avg. Price</th><th>Actions</th></tr></thead>
          <tbody>{t.slice.map(b => (
            <tr key={b.id} className="clickable" onClick={()=>view(b)}>
              <td style={{ fontWeight: 600 }}>{b.name}</td>
              <td>{b.mlsId}…</td>
              <td>{b.properties}</td>
              <td>{b.leads}</td>
              <td>{fmt(b.avgPrice)}</td>
              <td><span className="mp-link">View Details</span></td>
            </tr>
          ))}</tbody>
        </table>
        <Pager page={t.page} totalPages={t.totalPages} setPage={t.setPage} />
      </div>
    </div>
  );
};
