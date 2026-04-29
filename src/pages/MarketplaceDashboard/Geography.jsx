import { useState } from 'react';
import { VBar } from './Charts';
import { useMarketplaceTable, Pager } from './useMarketplaceTable';
import { MP_GEO_GOV, MP_GEO_AREAS, GOV_DENSITY, AREA_DENSITY } from '../../data/marketplaceData';

const fmt = v => 'EGP ' + (v / 1e6).toFixed(1) + 'M';

export const Geography = () => {
  const [showCharts, setShowCharts] = useState(true);
  const govT = useMarketplaceTable(MP_GEO_GOV, { searchKeys: ['gov'], pageSize: 6 });
  const areaT = useMarketplaceTable(MP_GEO_AREAS, { searchKeys: ['area','gov'], pageSize: 8 });

  return (
    <div>
      <div className="mp-page-head">
        <div><h1>Geography</h1><p>Location-based inventory analytics</p></div>
        <button className={`mp-toggle ${showCharts?'on':''}`} onClick={()=>setShowCharts(s=>!s)}>
          <span className="sw"></span>{showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      {showCharts && (
        <div className="mp-grid-2">
          <div className="mp-chart-card">
            <div className="mp-card-title">Governorate Density Ranking</div>
            <VBar data={GOV_DENSITY} max={320} />
          </div>
          <div className="mp-chart-card">
            <div className="mp-card-title">Area/City Density Ranking</div>
            <VBar data={AREA_DENSITY} max={320} />
          </div>
        </div>
      )}

      <div className="mp-card" style={{ marginTop: 14 }}>
        <div className="mp-card-title">By Governorate</div>
        <table className="mp-table">
          <thead><tr><th>Governorate</th><th>Areas/Cities</th><th>Compound</th><th>Listings</th>{!showCharts && <th>Avg. Price</th>}<th>% of Total</th></tr></thead>
          <tbody>{govT.slice.map(r => (
            <tr key={r.gov}>
              <td style={{ fontWeight: 600 }}>{r.gov}</td>
              <td>{r.areas}</td>
              <td>{r.compound}</td>
              <td>{r.listings}</td>
              {!showCharts && <td>{fmt(r.avgPrice)}</td>}
              <td>{r.share}%</td>
            </tr>
          ))}</tbody>
        </table>
        <Pager page={govT.page} totalPages={govT.totalPages} setPage={govT.setPage} />
      </div>

      <div className="mp-card" style={{ marginTop: 14 }}>
        <div className="mp-card-title">By Area / City</div>
        <table className="mp-table">
          <thead><tr><th>Area/City</th><th>Governorate</th><th>Compound</th><th>Listings</th><th>Avg. Price</th><th>Dominant Type</th><th>% of Gov.</th></tr></thead>
          <tbody>{areaT.slice.map(r => (
            <tr key={r.area + r.gov}>
              <td style={{ fontWeight: 600 }}>{r.area}</td>
              <td>{r.gov}</td>
              <td>{r.compound}</td>
              <td>{r.listings}</td>
              <td>{fmt(r.avgPrice)}</td>
              <td>{r.dominant}</td>
              <td>{r.share}%</td>
            </tr>
          ))}</tbody>
        </table>
        <Pager page={areaT.page} totalPages={areaT.totalPages} setPage={areaT.setPage} />
      </div>
    </div>
  );
};
