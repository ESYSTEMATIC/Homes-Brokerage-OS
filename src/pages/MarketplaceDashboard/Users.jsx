import { useState } from 'react';
import { Search, FileSpreadsheet, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VBar } from './Charts';
import { useMarketplaceTable, Pager } from './useMarketplaceTable';
import { B2C_USER_LIST, REGISTRATION_TREND } from '../../data/marketplaceData';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const Users = () => {
  const { openDrawer, toast, writeAudit } = useApp();
  const [showCharts, setShowCharts] = useState(true);
  const t = useMarketplaceTable(B2C_USER_LIST, {
    searchKeys: ['name','email','phone'],
    pageSize: 9,
  });

  const view = (u) => openDrawer({
    title: u.name, subtitle: 'B2C User profile',
    content: (
      <div className="detail-grid">
        {[
          ['ID', u.id], ['Email', u.email], ['Phone', u.phone],
          ['Registered', u.registered], ['Last Active', u.lastActive],
          ['Visits', u.visits], ['Actions', u.actions], ['Interest', u.interest],
        ].map(([k,v]) => <div key={k}><label>{k}</label><div className="v">{v}</div></div>)}
      </div>
    ),
  });

  const exportXLS = () => { toast(`Exported ${t.filtered.length} users to XLS`, 'success'); writeAudit('Export', 'B2C Users XLS', 'Marketplace', `${t.filtered.length} rows`); };

  return (
    <div>
      <div className="mp-page-head">
        <div><h1>Users</h1><p>Registered users and behavioral profiles</p></div>
        <button className={`mp-toggle ${showCharts?'on':''}`} onClick={()=>setShowCharts(s=>!s)}>
          <span className="sw"></span>{showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      {showCharts && (
        <>
          <div className="mp-kpi-grid cols-4">
            <div className="mp-kpi-card"><div className="mp-kpi-label">Total Users</div><div className="mp-kpi-value">{B2C_USER_LIST.length}</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">New This Month</div><div className="mp-kpi-value">{Math.round(B2C_USER_LIST.length * 0.4)}</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Active This Week</div><div className="mp-kpi-value">{Math.round(B2C_USER_LIST.length * 0.6)}</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">Avg. Actions/User</div><div className="mp-kpi-value">{Math.round(B2C_USER_LIST.reduce((s,u)=>s+u.actions,0) / B2C_USER_LIST.length)}</div></div>
          </div>
          <div className="mp-chart-card" style={{ marginBottom: 14 }}>
            <div className="mp-card-title">Registration Trend</div>
            <VBar data={MONTHS.map((m, i) => ({ name: m, value: REGISTRATION_TREND[i] }))} />
          </div>
        </>
      )}

      <div className="mp-table-wrap">
        <div className="mp-table-toolbar">
          <div className="mp-search"><Search size={14} color="#9ca3af"/><input placeholder="Search…" value={t.q} onChange={e=>t.setQ(e.target.value)}/></div>
          <select className="mp-select" value={t.filters.interest||''} onChange={e=>t.setFilter('interest', e.target.value)}><option value="">Interest</option><option>Hot</option><option>Warm</option><option>Cold</option></select>
          <button className="mp-icon-pill" onClick={t.clear} title="Clear filters"><X size={14}/></button>
          <button className="mp-icon-pill" onClick={exportXLS} title="Export XLS" style={{ background: 'rgba(34,197,94,.10)', color: '#16a34a', borderColor: 'rgba(34,197,94,.20)' }}><FileSpreadsheet size={14}/></button>
        </div>
        <table className="mp-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Registered</th><th>Last Active</th><th>Visits</th><th>Actions</th><th>Interest</th><th>Profile</th></tr></thead>
          <tbody>{t.slice.map(u => (
            <tr key={u.id} className="clickable" onClick={()=>view(u)}>
              <td style={{ fontWeight: 600 }}>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.registered}</td>
              <td>{u.lastActive}</td>
              <td>{u.visits}</td>
              <td>{u.actions}</td>
              <td><span className={`mp-pill ${u.interest.toLowerCase()}`}>{u.interest}</span></td>
              <td><span className="mp-link">View</span></td>
            </tr>
          ))}</tbody>
        </table>
        <Pager page={t.page} totalPages={t.totalPages} setPage={t.setPage} />
      </div>
    </div>
  );
};
