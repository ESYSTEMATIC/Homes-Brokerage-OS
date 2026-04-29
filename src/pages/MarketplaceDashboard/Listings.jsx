import { useState } from 'react';
import { Search, X, ArrowDownUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Donut, VBar } from './Charts';
import { useMarketplaceTable, Pager } from './useMarketplaceTable';
import { MP_LISTINGS, MP_DEVELOPERS, SUB_TYPE_DONUT, LISTINGS_BY_MONTH } from '../../data/marketplaceData';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmt = v => 'EGP ' + (v / 1e6).toFixed(1) + 'M';

export const Listings = () => {
  const { openDrawer } = useApp();
  const [showCharts, setShowCharts] = useState(true);
  const t = useMarketplaceTable(MP_LISTINGS, {
    searchKeys: ['id','subType','compound','governorate','city','office','developer'],
    pageSize: 10,
  });

  const view = (l) => openDrawer({
    title: `Listing ${l.id}`, subtitle: `${l.subType} · ${l.compound}`,
    content: (
      <>
        <div className="detail-grid">
          {[
            ['MLS ID', l.id], ['Type', l.type], ['Sub-Type', l.subType],
            ['Compound', l.compound], ['Governorate', l.governorate], ['City/Area', l.city],
            ['Price', fmt(l.price)], ['Office', l.office], ['Developer', l.developer],
            ['Bedrooms', l.bedrooms], ['Bathrooms', l.bathrooms], ['Area', l.area + ' sqm'],
          ].map(([k,v]) => <div key={k}><label>{k}</label><div className="v">{v}</div></div>)}
        </div>
      </>
    ),
  });

  const totals = {
    listings: MP_LISTINGS.length,
    avgPrice: MP_LISTINGS.reduce((s,l)=>s+l.price,0) / MP_LISTINGS.length,
    devs: MP_DEVELOPERS.length,
    compounds: 38,
  };

  return (
    <div>
      <div className="mp-page-head">
        <div>
          <h1>Listings</h1>
          <p>{MP_LISTINGS.length} total active listings</p>
        </div>
        <button className={`mp-toggle ${showCharts?'on':''}`} onClick={()=>setShowCharts(s=>!s)}>
          <span className="sw"></span>{showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      {showCharts && (
        <>
          <div className="mp-kpi-grid cols-4">
            <div className="mp-kpi-card"><div className="mp-kpi-label">Total Listings</div><div className="mp-kpi-value">{totals.listings}</div><div className="mp-kpi-up">↑ 12%</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Avg. Listing Price</div><div className="mp-kpi-value sm">{fmt(totals.avgPrice)}</div><div className="mp-kpi-up">↑ 8%</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Total Developers</div><div className="mp-kpi-value">{totals.devs}</div><div className="mp-kpi-up">↑ 3%</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Total Compound</div><div className="mp-kpi-value">{totals.compounds}</div><div className="mp-kpi-up">↑ 12%</div></div>
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
              <VBar data={MONTHS.map((m,i) => ({ name: m, value: LISTINGS_BY_MONTH[i] }))} />
            </div>
          </div>
        </>
      )}

      <div className="mp-table-wrap">
        <div className="mp-table-toolbar">
          <div className="mp-search"><Search size={14} color="#9ca3af"/><input placeholder="Search…" value={t.q} onChange={e=>t.setQ(e.target.value)} /></div>
          <select className="mp-select" value={t.filters.type||''} onChange={e=>t.setFilter('type', e.target.value)}><option value="">All Types</option><option>Residential</option><option>Commercial</option></select>
          <select className="mp-select" value={t.filters.subType||''} onChange={e=>t.setFilter('subType', e.target.value)}><option value="">All Sub-Types</option>{['Apartment','Villa','Townhouse','Twinhouse','Duplex','Penthouse','Chalet'].map(s=><option key={s}>{s}</option>)}</select>
          {showCharts && <select className="mp-select" value={t.filters.compound||''} onChange={e=>t.setFilter('compound', e.target.value)}><option value="">Compound</option>{[...new Set(MP_LISTINGS.map(l=>l.compound))].map(c=><option key={c}>{c}</option>)}</select>}
          {showCharts && <select className="mp-select" value={t.filters.city||''} onChange={e=>t.setFilter('city', e.target.value)}><option value="">City</option>{[...new Set(MP_LISTINGS.map(l=>l.city))].map(c=><option key={c}>{c}</option>)}</select>}
          {showCharts && <select className="mp-select" value={t.filters.office||''} onChange={e=>t.setFilter('office', e.target.value)}><option value="">Office</option>{[...new Set(MP_LISTINGS.map(l=>l.office))].map(o=><option key={o}>{o}</option>)}</select>}
          <select className="mp-select" value={t.filters.governorate||''} onChange={e=>t.setFilter('governorate', e.target.value)}><option value="">All Governorates</option>{[...new Set(MP_LISTINGS.map(l=>l.governorate))].map(g=><option key={g}>{g}</option>)}</select>
          <button className="mp-icon-pill" onClick={t.clear} title="Clear filters"><X size={14}/></button>
          <button className="mp-icon-pill" title="Sort"><ArrowDownUp size={14}/></button>
        </div>

        {t.slice.length === 0 ? (
          <div className="mp-empty">
            <div className="ico"><Search size={22}/></div>
            <h4>No Results Found</h4>
            We couldn't find any results matching your search.<br/>Please try again with different keywords or filters.
            <div><button className="mp-clear-btn" onClick={t.clear}><X size={13}/> Clear Filter</button></div>
          </div>
        ) : (
          <>
            <table className="mp-table">
              <thead>
                <tr>
                  <th>{showCharts ? 'MLS ID' : 'ID'}</th>
                  <th>Property Type</th>
                  <th>Sub-Type</th>
                  {!showCharts && <th>Compound</th>}
                  <th>Governorate</th>
                  <th>City/Area</th>
                  <th>Price</th>
                  <th>Office</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>{t.slice.map(l => (
                <tr key={l.id} className="clickable" onClick={()=>view(l)}>
                  <td>{l.id}</td>
                  <td><span className={`mp-pill ${l.type === 'Commercial' ? 'commercial' : 'residential'}`}>{l.type}</span></td>
                  <td style={{ fontWeight: 700 }}>{l.subType}</td>
                  {!showCharts && <td>{l.compound}</td>}
                  <td>{l.governorate}</td>
                  <td>{l.city}</td>
                  <td>{fmt(l.price)}</td>
                  <td>{l.office.length > 22 ? l.office.slice(0,21) + '…' : l.office}</td>
                  <td><span className="mp-link" onClick={(e)=>{e.stopPropagation(); view(l);}}>View Details</span></td>
                </tr>
              ))}</tbody>
            </table>
            <Pager page={t.page} totalPages={t.totalPages} setPage={t.setPage} />
          </>
        )}
      </div>
    </div>
  );
};
