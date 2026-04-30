import { useState } from 'react';
import { Search, ArrowDownUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StackedBar } from './Charts';
import { useMarketplaceTable, Pager } from './useMarketplaceTable';
import { MP_LEADS, LEAD_TYPE_TREND, LEAD_FLOW_BY_OFFICE } from '../../data/marketplaceData';

const TAB_TYPES = [
  { key: 'all',      label: 'All Leads', filter: () => true },
  { key: 'inquiry',  label: 'Inquiry',   filter: r => r.type === 'inquiry' },
  { key: 'viewing',  label: 'Viewing',   filter: r => r.type === 'viewing' },
  { key: 'mortgage', label: 'Mortgage',  filter: r => r.type === 'mortgage' },
  { key: 'sell',     label: 'Sell',      filter: r => r.type === 'sell' },
];

const STACK_COLORS = { inquiries: '#f4978e', viewings: '#9ca3af', mortgages: '#80c8a8', sell: '#fcd34d' };

export const LeadsRequests = () => {
  const { openDrawer } = useApp();
  const [showCharts, setShowCharts] = useState(true);
  const [tab, setTab] = useState('all');

  const filtered = MP_LEADS.filter(TAB_TYPES.find(t => t.key === tab).filter);
  const t = useMarketplaceTable(filtered, {
    searchKeys: ['id','user','contact','details','mlsId','office'],
    pageSize: 8,
  });

  const totalLeads = MP_LEADS.length;
  const inq = MP_LEADS.filter(l => l.type === 'inquiry').length;
  const vw = MP_LEADS.filter(l => l.type === 'viewing').length;
  const mtg = MP_LEADS.filter(l => l.type === 'mortgage').length;
  const sell = MP_LEADS.filter(l => l.type === 'sell').length;

  const view = (l) => openDrawer({
    title: 'Actions View', subtitle: 'End-to-end request management queue.',
    content: (
      <>
        <div className="mp-field"><div className="mp-field-label">Request ID</div><div className="mp-field-value">{l.id}</div></div>
        <div className="mp-field"><div className="mp-field-label">Type</div><div className="mp-field-value">{l.type}</div></div>
        <div className="mp-field"><div className="mp-field-label">User</div><div className="mp-field-value">{l.user}</div></div>
        <div className="mp-field"><div className="mp-field-label">Contact</div><div className="mp-field-value">{l.contact}</div></div>
        <div className="mp-field"><div className="mp-field-label">Details</div><div className="mp-field-value">{l.details}</div></div>
        <div className="mp-field"><div className="mp-field-label">Date</div><div className="mp-field-value">{l.date}</div></div>
        <div className="mp-field"><div className="mp-field-label">MLS ID</div><div className="mp-field-value">{l.mlsId}</div></div>
        <div className="mp-field"><div className="mp-field-label">Compound</div><div className="mp-field-value">{l.compound}</div></div>
        <div className="mp-field"><div className="mp-field-label">Listing Office</div><div className="mp-field-value">{l.office}</div></div>
        {l.preferredSlots && (
          <div className="mp-field">
            <div className="mp-field-label">Preferred Viewing Slots</div>
            <div>{l.preferredSlots.map((s, i) => <span key={i} className="mp-slot">{s}</span>)}</div>
          </div>
        )}
        {l.occupation && <>
          <div className="mp-field"><div className="mp-field-label">Occupation</div><div className="mp-field-value">{l.occupation}</div></div>
          <div className="mp-field"><div className="mp-field-label">Monthly Income</div><div className="mp-field-value">{l.monthlyIncome}</div></div>
          <div className="mp-field"><div className="mp-field-label">Loan Amount</div><div className="mp-field-value">{l.loanAmount}</div></div>
        </>}
      </>
    ),
  });

  return (
    <div>
      <div className="mp-page-head">
        <div>
          <h1>Leads & Requests</h1>
          <p>End-to-end request management queue.</p>
        </div>
        <button className={`mp-toggle ${showCharts?'on':''}`} onClick={()=>setShowCharts(s=>!s)}>
          <span className="sw"></span>{showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      {showCharts && (
        <>
          <div className="mp-kpi-grid cols-4">
            {[['TOTAL LEADS', totalLeads],['INQUIRIES', inq],['VIEWINGS', vw],['MORTGAGE APPS', mtg]].map(([l,v])=>(
              <div className="mp-kpi-card" key={l}><div className="mp-kpi-label">{l}</div><div className="mp-kpi-value">{v}</div></div>
            ))}
          </div>
          <div className="mp-kpi-grid cols-3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="mp-kpi-card"><div className="mp-kpi-label">SELL SUBMISSIONS</div><div className="mp-kpi-value">{sell}</div></div>
            <div className="mp-kpi-card"><div className="mp-kpi-label">SELL SUBMISSIONS (GUEST)</div><div className="mp-kpi-value">{Math.round(sell * 0.6)}</div></div>
            <div></div>
          </div>
          <div className="mp-grid-21">
            <div className="mp-chart-card">
              <div className="mp-card-title">Lead Type Trend
                <select className="mp-select" defaultValue="2026"><option>2026</option><option>2025</option></select>
              </div>
              <StackedBar data={LEAD_TYPE_TREND} keys={['inquiries','viewings','mortgages','sell']} colors={STACK_COLORS} />
            </div>
            <div className="mp-chart-card">
              <div className="mp-card-title">Lead Flow By Office</div>
              <table className="mp-table" style={{ marginTop: -6 }}>
                <thead><tr><th>Office</th><th>Total</th><th>Inq</th><th>View</th><th>Mtg</th></tr></thead>
                <tbody>{LEAD_FLOW_BY_OFFICE.map(r => (
                  <tr key={r.office}><td style={{ fontSize: 12 }}>{r.office.length > 26 ? r.office.slice(0,25)+'…' : r.office}</td><td>{r.total}</td><td>{r.inq}</td><td>{r.view}</td><td>{r.mtg}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="mp-tabs">
        {TAB_TYPES.map(x => (
          <button key={x.key} className={`mp-tab ${tab === x.key ? 'active' : ''}`} onClick={()=>{setTab(x.key); t.setPage(1);}}>{x.label}</button>
        ))}
      </div>

      <div className="mp-table-wrap">
        <div className="mp-table-toolbar">
          <div className="mp-search"><Search size={14} color="#9ca3af"/><input placeholder="Search…" value={t.q} onChange={e=>t.setQ(e.target.value)} /></div>
          <button className="mp-icon-pill"><ArrowDownUp size={14}/></button>
        </div>
        <table className="mp-table">
          <thead><tr><th>Request ID</th><th>Type</th><th>User</th><th>Contact</th><th>Details</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{t.slice.map(l => (
            <tr key={l.id} className="clickable" onClick={()=>view(l)}>
              <td>{l.id}</td>
              <td>{l.type}</td>
              <td>{l.user}</td>
              <td>{l.contact}</td>
              <td>{l.details}</td>
              <td>{new Date(l.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</td>
              <td><span className="mp-link" onClick={(e)=>{e.stopPropagation(); view(l);}}>View Details</span></td>
            </tr>
          ))}</tbody>
        </table>
        <Pager page={t.page} totalPages={t.totalPages} setPage={t.setPage} />
      </div>
    </div>
  );
};
