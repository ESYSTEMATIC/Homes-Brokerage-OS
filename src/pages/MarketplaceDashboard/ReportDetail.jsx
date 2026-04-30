import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Printer } from 'lucide-react';
import { Search, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useMarketplaceTable, Pager } from './useMarketplaceTable';
import { MP_REPORTS, MP_LEADS } from '../../data/marketplaceData';

export const ReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { toast, writeAudit } = useApp();
  const report = MP_REPORTS.find(r => r.id === reportId) || MP_REPORTS[0];
  const t = useMarketplaceTable(MP_LEADS, { searchKeys: ['id','user','contact','office'], pageSize: 9 });

  const generate = () => { toast(`${report.title} report generated`, 'success'); writeAudit('Report Generated', report.title, 'Reporting'); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <button className="mp-icon-btn" onClick={()=>navigate('/system/marketplace-dashboard/reports')}><ArrowLeft size={16}/></button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>{report.title} Report</h1>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{report.desc}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="mp-icon-pill" title="Export PDF"><FileText size={14}/></button>
          <button className="mp-icon-pill" title="Print" style={{ background: 'rgba(232,103,42,.10)', color: 'var(--brand)', borderColor: 'rgba(232,103,42,.18)' }}><Printer size={14}/></button>
        </div>
      </div>

      <div className="mp-kpi-grid cols-5">
        <div className="mp-kpi-card"><div className="mp-kpi-label">Total</div><div className="mp-kpi-value">{MP_LEADS.length}</div></div>
        <div className="mp-kpi-card"><div className="mp-kpi-label">Inquiries</div><div className="mp-kpi-value">{MP_LEADS.filter(l => l.type==='inquiry').length}</div></div>
        <div className="mp-kpi-card"><div className="mp-kpi-label">Viewings</div><div className="mp-kpi-value">{MP_LEADS.filter(l => l.type==='viewing').length}</div></div>
        <div className="mp-kpi-card"><div className="mp-kpi-label">Mortgages</div><div className="mp-kpi-value">{MP_LEADS.filter(l => l.type==='mortgage').length}</div></div>
        <div className="mp-kpi-card"><div className="mp-kpi-label">Sell Submissions</div><div className="mp-kpi-value">{MP_LEADS.filter(l => l.type==='sell').length}</div></div>
      </div>

      <div className="mp-table-wrap">
        <div className="mp-table-toolbar">
          <div className="mp-search"><Search size={14} color="#9ca3af"/><input placeholder="Search…" value={t.q} onChange={e=>t.setQ(e.target.value)}/></div>
          <select className="mp-select"><option>All Types</option><option>inquiry</option><option>viewing</option><option>mortgage</option><option>sell</option></select>
          <select className="mp-select"><option>All Offices</option></select>
          <select className="mp-select"><option>Compound</option></select>
          <div className="mp-select" style={{ display:'flex', alignItems:'center', gap:6 }}><Calendar size={13} color="#9ca3af"/>Last 30 days</div>
          <button className="btn btn-primary" onClick={generate} style={{ marginLeft: 'auto' }}><FileText size={14}/> Generate Report</button>
        </div>
        <table className="mp-table">
          <thead><tr><th>ID</th><th>Type</th><th>User</th><th>Email</th><th>Phone</th><th>Office</th><th>Date</th></tr></thead>
          <tbody>{t.slice.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.type}</td>
              <td>{l.user}</td>
              <td style={{ fontSize: 12 }}>{l.user.toLowerCase().replace(' ', '.')}@email.com</td>
              <td>{l.contact}</td>
              <td style={{ fontSize: 12 }}>{l.office.length > 22 ? l.office.slice(0,21)+'…' : l.office}</td>
              <td>{new Date(l.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</td>
            </tr>
          ))}</tbody>
        </table>
        <Pager page={t.page} totalPages={t.totalPages} setPage={t.setPage} />
      </div>
    </div>
  );
};
