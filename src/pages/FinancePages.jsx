import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, Field, FieldRow, Empty } from '../components/UI';
import { ExportMenu } from '../components/ExportMenu';
import { findCommissionPolicy, computeSplit, COMMISSION_SPLIT_DEFAULT } from '../data/staticData';
import { Eye, CheckCircle2, DollarSign, SlidersHorizontal, X, Calendar, Settings, Receipt } from 'lucide-react';

const fmt = v => 'EGP ' + (v||0).toLocaleString();
const statusBadge = s => s==='Approved'?'badge-success':s==='Pending'?'badge-warning':s==='Collected'?'badge-success':s==='Paid'?'badge-info':s==='Cleared'?'badge-success':s==='Unpaid'?'badge-danger':s==='Partial'?'badge-warning':'badge-gray';

export const FinanceOverview = () => {
  const { state } = useApp();
  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Financial Mgmt</span><span>&gt;</span><span className="current">Overview</span></div>
        <h1 className="page-title">Financial Overview</h1>
        <p className="page-subtitle">Revenue, commissions, and financial health</p>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Total Revenue</div><div className="kpi-value" style={{fontSize:20}}>{fmt(790000)}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💰</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Total Commission Pool</div><div className="kpi-value" style={{fontSize:20}}>{fmt(1185000)}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📊</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pending Payouts</div><div className="kpi-value" style={{fontSize:20}}>{fmt(state.agentDues.reduce((s,a)=>s+a.pending,0))}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Net Result</div><div className="kpi-value" style={{fontSize:20}}>{fmt(497000)}</div><div className="kpi-change up">↑ Profitable</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>📈</span></div></div>
      </div>
      <div className="grid-equal-2">
        <div className="chart-placeholder"><div className="chart-title">Monthly Revenue Trend</div>
          <div className="chart-bars">{[45,58,72,65,78,90].map((v,i)=><div key={i} className="chart-bar" style={{background:'rgba(232,103,42,0.2)',height:`${v}%`,borderTop:'3px solid #E8672A'}}/>)}</div>
        </div>
        <div className="chart-placeholder"><div className="chart-title">Commission Distribution</div>
          <div style={{display:'flex',flexDirection:'column',gap:12,flex:1,justifyContent:'center'}}>
            {[['Agent Share',35],['TL Share',10],['Company Share',55]].map(([l,p])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{width:100,fontSize:12,color:'var(--text-secondary)',textAlign:'right'}}>{l}</span>
                <div className="progress-bar" style={{flex:1}}><div className="progress-fill blue" style={{width:`${p}%`}}/></div>
                <span style={{fontSize:12,fontWeight:600}}>{p}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DealsRevenue = () => {
  const { state, openDrawer } = useApp();
  const { q, setQ, filterVals, setFilter, filtered: baseFiltered } = useTableState(state.dealsRev, {
    searchKeys:['unit','developer','agent','id'], filters:{ status:'status' },
  });

  // ─── Advanced filter (May 2026) ───────────────────────────────────
  // Collapsible panel covering developer / agent / unit / price-range /
  // revenue-range so finance can drill into a slice without scrolling.
  const [showAdv, setShowAdv] = useState(false);
  const [adv, setAdv] = useState({
    developer: '',
    agent: '',
    unit: '',
    minPrice: '',
    maxPrice: '',
    minRevenue: '',
    maxRevenue: '',
  });
  const resetAdv = () => setAdv({ developer: '', agent: '', unit: '', minPrice: '', maxPrice: '', minRevenue: '', maxRevenue: '' });
  const advCount =
    (adv.developer ? 1 : 0) + (adv.agent ? 1 : 0) + (adv.unit ? 1 : 0) +
    (adv.minPrice ? 1 : 0) + (adv.maxPrice ? 1 : 0) +
    (adv.minRevenue ? 1 : 0) + (adv.maxRevenue ? 1 : 0);

  const developerOptions = useMemo(() => Array.from(new Set((state.dealsRev || []).map(d => d.developer).filter(Boolean))).sort(), [state.dealsRev]);
  const agentOptions     = useMemo(() => Array.from(new Set((state.dealsRev || []).map(d => d.agent).filter(Boolean))).sort(), [state.dealsRev]);

  const filtered = useMemo(() => baseFiltered.filter(d => {
    if (adv.developer && d.developer !== adv.developer) return false;
    if (adv.agent && d.agent !== adv.agent) return false;
    if (adv.unit && !(d.unit || '').toLowerCase().includes(adv.unit.toLowerCase())) return false;
    if (adv.minPrice && (d.price || 0) < Number(adv.minPrice)) return false;
    if (adv.maxPrice && (d.price || 0) > Number(adv.maxPrice)) return false;
    if (adv.minRevenue && (d.revenue || 0) < Number(adv.minRevenue)) return false;
    if (adv.maxRevenue && (d.revenue || 0) > Number(adv.maxRevenue)) return false;
    return true;
  }), [baseFiltered, adv]);

  const view = (d) => openDrawer({
    title: `Deal ${d.id}`, subtitle: `${d.unit} · ${d.agent}`,
    content: (<div className="detail-grid">
      {[['ID',d.id],['Unit',d.unit],['Developer',d.developer],['Agent',d.agent],['Unit Price',fmt(d.price)],['Company Revenue',fmt(d.revenue)],['Status',d.status]].map(([k,v])=>(
        <div key={k}><label>{k}</label><div className="v">{v}</div></div>
      ))}
    </div>),
  });

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Financial Mgmt</span><span>&gt;</span><span className="current">Deals & Revenue</span></div><h1 className="page-title">Deals & Revenue</h1><p className="page-subtitle">Revenue, commissions, and agent dues</p></div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search by deal ID, unit, developer, agent…" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>{['Approved','Pending','Paid'].map(s=><option key={s}>{s}</option>)}
            </select>
            <button
              type="button"
              className={`btn btn-sm ${advCount > 0 || showAdv ? 'btn-brand' : 'btn-outline'}`}
              onClick={() => setShowAdv(s => !s)}
              title="Developer / agent / unit / price & revenue ranges"
            >
              <SlidersHorizontal size={13}/> Advanced{advCount > 0 ? ` · ${advCount}` : ''}
            </button>
          </div>
          <ExportMenu
            rows={filtered}
            columns={[
              { key: 'id',        label: 'Deal ID' },
              { key: 'unit',      label: 'Unit' },
              { key: 'developer', label: 'Developer' },
              { key: 'agent',     label: 'Agent' },
              { key: 'price',     label: 'Unit Price (EGP)',     format: v => fmt(v) },
              { key: 'revenue',   label: 'Company Revenue (EGP)',format: v => fmt(v) },
              { key: 'status',    label: 'Status' },
            ]}
            filename="deals_revenue"
            title="Deals & Revenue Export"
            subtitle={`Filtered view · ${filtered.length} deal${filtered.length === 1 ? '' : 's'}`}
          />
        </div>

        {/* Advanced filter panel — collapses by default. Mirrors the layout
            of the Commission Engine panel so finance officers get a
            consistent UX across the slice. */}
        {showAdv && (
          <div style={{padding:'14px 16px',background:'#fafbfc',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:12}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>
                <SlidersHorizontal size={13}/> Advanced filter
              </div>
              {advCount > 0 && (
                <button type="button" className="btn btn-outline btn-sm" onClick={resetAdv} style={{padding:'4px 10px',fontSize:11,color:'var(--danger)'}}>
                  <X size={11}/> Reset
                </button>
              )}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:10}}>
              <div className="form-group" style={{margin:0}}>
                <label>Developer</label>
                <select value={adv.developer} onChange={e=>setAdv({...adv, developer: e.target.value})}>
                  <option value="">All developers</option>
                  {developerOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Agent</label>
                <select value={adv.agent} onChange={e=>setAdv({...adv, agent: e.target.value})}>
                  <option value="">All agents</option>
                  {agentOptions.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Unit code</label>
                <input type="text" placeholder="e.g. PH-BAD or A101" value={adv.unit} onChange={e=>setAdv({...adv, unit: e.target.value})}/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Min price (EGP)</label>
                <input type="number" value={adv.minPrice} onChange={e=>setAdv({...adv, minPrice: e.target.value})} placeholder="—"/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Max price (EGP)</label>
                <input type="number" value={adv.maxPrice} onChange={e=>setAdv({...adv, maxPrice: e.target.value})} placeholder="—"/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Min revenue (EGP)</label>
                <input type="number" value={adv.minRevenue} onChange={e=>setAdv({...adv, minRevenue: e.target.value})} placeholder="—"/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Max revenue (EGP)</label>
                <input type="number" value={adv.maxRevenue} onChange={e=>setAdv({...adv, maxRevenue: e.target.value})} placeholder="—"/>
              </div>
            </div>
            <div style={{fontSize:11,color:'var(--text-tertiary)'}}>{filtered.length} of {baseFiltered.length} match · status filter applied first, then advanced.</div>
          </div>
        )}

        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>Deal ID</th><th>Unit</th><th>Developer</th><th>Agent</th><th>Unit Price</th><th>Company Revenue</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(d=>(
              <tr key={d.id}>
                <td className="muted">{d.id}</td>
                <td className="bold">{d.unit}</td>
                <td>{d.developer}</td>
                <td>{d.agent}</td>
                <td>{fmt(d.price)}</td>
                <td className="bold">{fmt(d.revenue)}</td>
                <td><span className={`badge ${statusBadge(d.status)}`}>{d.status}</span></td>
                <td style={{textAlign:'right'}}><button className="btn btn-outline btn-sm" onClick={()=>view(d)}><Eye size={13}/> View</button></td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length===0 && <Empty />}
        </div>
      </div>
    </div>
  );
};

export const CommissionEngine = () => {
  const { state, updateItem, openConfirm, openModal, openDrawer, toast, persona } = useApp();
  const { q, setQ, filterVals, setFilter, filtered: baseFiltered } = useTableState(state.commEngine, {
    // Search across the deal context (label, deal ID, unit, project, developer)
    // so finance officers can find a row by any one of them.
    searchKeys:['deal','agent','id','dealId','unit','project','developer'], filters:{ status:'status' },
  });

  // ─── Advanced filters (May 2026) ──────────────────────────────────
  // Date-range pickers + pool min/max + agent filter sit in a collapsible
  // panel so the toolbar stays clean. Quick-range presets jump the date
  // window to common audit periods (This month / Last month / Q1 / etc).
  const [showAdv, setShowAdv] = useState(false);
  const [adv, setAdv] = useState({
    dateField: 'createdAt', // createdAt | approvedAt | paidAt
    dateFrom: '',
    dateTo: '',
    minPool: '',
    maxPool: '',
    agent: '',
  });
  const resetAdv = () => setAdv({ dateField: 'createdAt', dateFrom: '', dateTo: '', minPool: '', maxPool: '', agent: '' });
  const applyQuickRange = (kind) => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const iso = (d) => d.toISOString().slice(0, 10);
    let from = '', to = '';
    if (kind === 'thisMonth')   { from = iso(new Date(y, m, 1));        to = iso(today); }
    if (kind === 'lastMonth')   { from = iso(new Date(y, m - 1, 1));    to = iso(new Date(y, m, 0)); }
    if (kind === 'last30')      { const d = new Date(); d.setDate(d.getDate() - 30); from = iso(d); to = iso(today); }
    if (kind === 'last90')      { const d = new Date(); d.setDate(d.getDate() - 90); from = iso(d); to = iso(today); }
    if (kind === 'q1')          { from = `${y}-01-01`; to = `${y}-03-31`; }
    if (kind === 'q2')          { from = `${y}-04-01`; to = `${y}-06-30`; }
    if (kind === 'ytd')         { from = `${y}-01-01`; to = iso(today); }
    setAdv({ ...adv, dateFrom: from, dateTo: to });
  };

  const agentsInScope = useMemo(() => Array.from(new Set((state.commEngine || []).map(c => c.agent))).sort(), [state.commEngine]);

  const filtered = useMemo(() => baseFiltered.filter(c => {
    if (adv.dateFrom || adv.dateTo) {
      const v = (c[adv.dateField] || '').slice(0, 10);
      if (!v) return false;
      if (adv.dateFrom && v < adv.dateFrom) return false;
      if (adv.dateTo && v > adv.dateTo) return false;
    }
    if (adv.minPool && (c.pool || 0) < Number(adv.minPool)) return false;
    if (adv.maxPool && (c.pool || 0) > Number(adv.maxPool)) return false;
    if (adv.agent && c.agent !== adv.agent) return false;
    return true;
  }), [baseFiltered, adv]);

  const advCount =
    (adv.dateFrom ? 1 : 0) + (adv.dateTo ? 1 : 0) +
    (adv.minPool ? 1 : 0) + (adv.maxPool ? 1 : 0) +
    (adv.agent ? 1 : 0);

  // Append a transaction entry to the commission record's history array.
  // Every state change on a commission row (approve, mark paid, reject,
  // override) writes one of these entries IN ADDITION to the global
  // audit log — auditors get a per-record timeline they can read at a
  // glance without cross-joining the audit slice.
  const appendCommHistory = (c, entry) => {
    const stamped = {
      at: new Date().toISOString(),
      actor: persona?.label || 'Finance Officer',
      ...entry,
    };
    return [...(c.history || []), stamped];
  };

  const splitLine = (c) => `Agent ${fmt(c.agentShare)} · TL ${fmt(c.tlShare)} · Mgr ${fmt(c.managerShare)} · Dir ${fmt(c.directorShare)} · Co ${fmt(c.companyShare)}`;

  // Approve — captures the claim / reference number (SME finance review,
  // May 2026): after approval the finance officer records the claim no.
  const approve = (c) => openModal({
    title: `Approve commission · ${c.deal}`,
    subtitle: `Lock pool of ${fmt(c.pool)} · ${splitLine(c)}`,
    submitLabel: 'Approve commission',
    body: (
      <Field label="Claim / reference number" name="referenceNo" required placeholder="e.g. CLM-2026-0142" />
    ),
    onSubmit: ({ referenceNo }) => {
      const ref = (referenceNo || '').trim();
      const history = appendCommHistory(c, {
        action: 'Approved',
        fromStatus: c.status,
        toStatus: 'Approved',
        amount: c.pool,
        detail: `Pool locked at ${fmt(c.pool)} — ${splitLine(c)} · claim ${ref}`,
      });
      updateItem('commEngine', c.id, { status: 'Approved', approvedAt: new Date().toISOString(), approvedBy: persona?.label, referenceNo: ref, history }, { action: 'Commission Approved', module: 'Finance', target: c.deal, detail: `${fmt(c.pool)} · claim ${ref} · by ${persona?.label}` });
      toast(`${c.deal} approved · claim ${ref}`);
    },
  });
  const markPaid = (c) => openConfirm({
    title: `Mark ${c.deal} as collected?`,
    message: `Commission collected & settled — funds released to ${c.agent} and the management chain. This is irreversible.`,
    onConfirm: () => {
      const history = appendCommHistory(c, {
        action: 'Collected',
        fromStatus: c.status,
        toStatus: 'Collected',
        amount: c.pool,
        detail: `Disbursed ${fmt(c.agentShare)} → ${c.agent} · ${fmt(c.tlShare)} → ${c.teamLeader} · ${fmt(c.managerShare)} → ${c.manager} · ${fmt(c.directorShare)} → ${c.director} · ${fmt(c.companyShare)} → Company`,
      });
      updateItem('commEngine', c.id, { status: 'Collected', paidAt: new Date().toISOString(), paidBy: persona?.label, history }, { action: 'Commission Collected', module: 'Finance', target: c.deal, detail: `${fmt(c.pool)} · by ${persona?.label}` });
      toast(`${c.deal} collected`);
    },
  });
  const view = (c) => {
    // Resolve the linked deal (if any) so the drawer can show live status
    // from the deals slice — value, stage, etc. — in addition to the
    // commission-row context.
    const linkedDeal = c.dealId ? (state.deals || []).find(d => d.id === c.dealId) : null;
    return openDrawer({ title: `Commission · ${c.deal}`, subtitle: `${c.agent} · ${c.developer || '—'} · ${c.project || '—'}`,
    content: (
      <div style={{display:'flex', flexDirection:'column', gap:18}}>
        {/* Deal context block — surfaces the linked Deal ID + Unit + Developer
            + Project so the finance officer can see the source of truth
            for this commission at a glance and jump to the deal record. */}
        <div style={{
          padding:'12px 14px', borderRadius:10,
          background:'linear-gradient(135deg, var(--brand-tint), #fff)',
          border:'1px solid rgba(232,103,42,.25)',
          display:'flex', flexDirection:'column', gap:8,
        }}>
          <div style={{fontSize:10, fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'.06em', display:'inline-flex', alignItems:'center', gap:6}}>
            <Receipt size={12}/> Deal context
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:10, fontSize:12}}>
            <div>
              <div style={{fontSize:10, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Deal ID</div>
              <div style={{fontWeight:700, fontFamily:'ui-monospace, monospace', marginTop:2}}>
                {c.dealId ? (
                  <a href={`#/system/crm/deals`} onClick={(e) => { e.preventDefault(); window.location.hash = `#/system/crm/deals?focus=${encodeURIComponent(c.dealId)}`; }} style={{color:'var(--brand)', textDecoration:'none'}} title="Open the linked deal">
                    {c.dealId}
                  </a>
                ) : <span style={{color:'var(--text-tertiary)', fontStyle:'italic'}}>not linked</span>}
              </div>
            </div>
            <div>
              <div style={{fontSize:10, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Unit</div>
              <div style={{fontWeight:700, fontFamily:'ui-monospace, monospace', marginTop:2}}>{c.unit || c.deal || '—'}</div>
            </div>
            <div>
              <div style={{fontSize:10, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Project</div>
              <div style={{fontWeight:700, marginTop:2}}>{c.project || '—'}</div>
            </div>
            <div>
              <div style={{fontSize:10, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Developer</div>
              <div style={{fontWeight:700, marginTop:2}}>{c.developer || '—'}</div>
            </div>
          </div>
          {linkedDeal && (
            <div style={{marginTop:4, paddingTop:8, borderTop:'1px dashed rgba(232,103,42,.25)', fontSize:11, color:'var(--text-secondary)', display:'flex', gap:12, flexWrap:'wrap'}}>
              <span><b>Stage:</b> {linkedDeal.stage}</span>
              <span><b>Deal value:</b> {fmt(linkedDeal.value)}</span>
              <span><b>Lead:</b> {linkedDeal.leadName || linkedDeal.lead}</span>
              <span><b>Owner:</b> {linkedDeal.owner}</span>
            </div>
          )}
        </div>

        <div className="detail-grid">
          {[
            ['Commission ID', c.id],
            ['Deal label', c.deal],
            ['Pool', fmt(c.pool)],
            ['VAT (14%)', fmt(c.vat)],
            ['Collection Due Date', c.dueDate || '—'],
            ['Claim / Ref #', c.referenceNo || '—'],
            ['Created', c.createdAt || '—'],
            ['Status', c.status],
            ['Approved by', c.approvedBy || (c.status === 'Approved' || c.status === 'Collected' ? '—' : 'pending')],
            ['Collected by', c.paidBy || (c.status === 'Collected' ? '—' : 'pending')],
          ].map(([k,v])=>(<div key={k}><label>{k}</label><div className="v">{v}</div></div>))}
        </div>

        {/* Four-persona breakdown — every commission row now splits across
            Agent / Team Leader / Sales Manager / Sales Director with the
            company share as the remainder. The percentages come from the
            active Commission Policy (developer × project); fallback to the
            system default when no policy matches. */}
        {(() => {
          // Resolve which policy governs this commission row by looking up
          // the deal → project (via state.deals) → policy. If the deal isn't
          // found we surface the system default with an explanation so the
          // auditor never sees a 'unknown source' on a split.
          const deal = (state.deals || []).find(d => d.id === c.deal || d.unitCode === c.deal || (d.leadName && d.project));
          const policy = deal ? findCommissionPolicy(state.commissionPolicies || [], deal.developer, deal.project) : null;
          const policyOrDefault = policy?.split || COMMISSION_SPLIT_DEFAULT;
          return (
            <div style={{padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,fontSize:11,display:'flex',gap:8,alignItems:'flex-start'}}>
              <Settings size={12} color="var(--text-secondary)" style={{marginTop:2,flexShrink:0}}/>
              <div>
                <b>Split source:</b> {policy ? `${policy.id} · ${policy.developer} / ${policy.project}` : 'System default (no matching policy)'}
                <div style={{color:'var(--text-tertiary)',marginTop:2,fontFamily:'ui-monospace,monospace'}}>
                  Agent {policyOrDefault.agent}% · TL {policyOrDefault.tl}% · Mgr {policyOrDefault.manager}% · Dir {policyOrDefault.director}% · Co {policyOrDefault.company}%
                </div>
              </div>
            </div>
          );
        })()}

        <div>
          <div style={{fontSize:10,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Commission split</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {[
              { who: c.agent,      role: 'Sales Agent',    amount: c.agentShare,    pct: c.pool ? (c.agentShare    / c.pool * 100).toFixed(1) : '0', color: 'var(--brand)' },
              { who: c.teamLeader, role: 'Team Leader',    amount: c.tlShare,       pct: c.pool ? (c.tlShare       / c.pool * 100).toFixed(1) : '0', color: '#3b82f6' },
              { who: c.manager,    role: 'Sales Manager',  amount: c.managerShare,  pct: c.pool ? (c.managerShare  / c.pool * 100).toFixed(1) : '0', color: '#8b5cf6' },
              { who: c.director,   role: 'Sales Director', amount: c.directorShare, pct: c.pool ? (c.directorShare / c.pool * 100).toFixed(1) : '0', color: '#10b981' },
              { who: 'Homes Brokerage', role: 'Company', amount: c.companyShare, pct: c.pool ? (c.companyShare / c.pool * 100).toFixed(1) : '0', color: '#64748b' },
            ].map((row) => (
              <div key={row.role} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8}}>
                <div style={{width:6,alignSelf:'stretch',background:row.color,borderRadius:2}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)'}}>{row.who || <i style={{color:'var(--text-tertiary)'}}>—</i>}</div>
                  <div style={{fontSize:10,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.05em',marginTop:1}}>{row.role}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:13,fontWeight:700}}>{fmt(row.amount)}</div>
                  <div style={{fontSize:10,color:'var(--text-tertiary)'}}>{row.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-record transaction history — every state change appends
            an entry here so auditors can read the timeline at a glance. */}
        <div>
          <div style={{fontSize:10,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Action log · {(c.history || []).length} entr{(c.history || []).length === 1 ? 'y' : 'ies'}</div>
          {Array.isArray(c.history) && c.history.length > 0 ? (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[...c.history].reverse().map((h, i) => (
                <div key={i} style={{display:'flex',gap:10,padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,borderLeft:`3px solid ${h.action === 'Collected' ? '#10b981' : h.action === 'Approved' ? 'var(--brand)' : h.action === 'Rejected' ? '#ef4444' : '#94a3b8'}`,fontSize:12,lineHeight:1.5}}>
                  <div style={{minWidth:140}}>
                    <div style={{fontWeight:700,color:'var(--text-primary)'}}>{h.action}</div>
                    <div style={{fontSize:10,color:'var(--text-tertiary)',fontFamily:'ui-monospace,monospace'}}>{(h.at || '').slice(0,16).replace('T',' ')}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div><b>{h.actor}</b>{h.fromStatus && h.toStatus ? ` · ${h.fromStatus} → ${h.toStatus}` : ''}{h.amount ? ` · ${fmt(h.amount)}` : ''}</div>
                    {h.detail && <div style={{color:'var(--text-secondary)',marginTop:2}}>{h.detail}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{padding:'14px 16px',background:'#fafbfc',border:'1px dashed var(--border)',borderRadius:8,fontSize:12,color:'var(--text-tertiary)'}}>No transactions recorded yet. Approving or paying this commission will start the log.</div>
          )}
        </div>
      </div>
    ),
  });
  };

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Financial Mgmt</span><span>&gt;</span><span className="current">Commission Engine</span></div><h1 className="page-title">Commission Engine</h1><p className="page-subtitle">Revenue, commissions, and agent dues</p></div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search by Deal ID, unit, project, developer, agent…" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>{['Pending','Approved','Collected','Rejected'].map(s=><option key={s}>{s}</option>)}
            </select>
            <button
              type="button"
              className={`btn btn-sm ${advCount > 0 || showAdv ? 'btn-brand' : 'btn-outline'}`}
              onClick={() => setShowAdv(s => !s)}
              title="Date range, pool size, agent filters"
            >
              <SlidersHorizontal size={13}/> Advanced{advCount > 0 ? ` · ${advCount}` : ''}
            </button>
          </div>
          <ExportMenu
            rows={filtered}
            columns={[
              { key: 'id',            label: 'ID' },
              { key: 'dealId',        label: 'Deal ID',             format: v => v || '—' },
              { key: 'unit',          label: 'Unit',                format: (v, r) => v || r.deal || '—' },
              { key: 'project',       label: 'Project',             format: v => v || '—' },
              { key: 'developer',     label: 'Developer',           format: v => v || '—' },
              { key: 'deal',          label: 'Deal label' },
              { key: 'agent',         label: 'Agent' },
              { key: 'teamLeader',    label: 'Team Leader' },
              { key: 'manager',       label: 'Sales Manager' },
              { key: 'director',      label: 'Sales Director' },
              { key: 'pool',          label: 'Pool (EGP)',         format: v => fmt(v) },
              { key: 'vat',           label: 'VAT 14% (EGP)',      format: v => fmt(v) },
              { key: 'dueDate',       label: 'Collection Due Date', format: v => v || '—' },
              { key: 'referenceNo',   label: 'Claim / Ref #',       format: v => v || '—' },
              { key: 'agentShare',    label: 'Agent share',         format: v => fmt(v) },
              { key: 'tlShare',       label: 'TL share',            format: v => fmt(v) },
              { key: 'managerShare',  label: 'Manager share',       format: v => fmt(v) },
              { key: 'directorShare', label: 'Director share',      format: v => fmt(v) },
              { key: 'companyShare',  label: 'Company share',       format: v => fmt(v) },
              { key: 'status',        label: 'Status' },
              { key: 'createdAt',     label: 'Created' },
              { key: 'approvedAt',    label: 'Approved at' },
              { key: 'paidAt',        label: 'Collected at' },
            ]}
            filename="commission_engine"
            title="Commission Engine Export"
            subtitle={`Filtered view · ${filtered.length} commission${filtered.length === 1 ? '' : 's'}`}
          />
        </div>

        {/* Advanced filter panel — collapses by default, surfaces when the
            user clicks 'Advanced'. Date-range presets + custom from/to
            + agent + pool min/max. */}
        {showAdv && (
          <div style={{padding:'14px 16px',background:'#fafbfc',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:12}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>
                <Calendar size={13}/> Advanced filter
              </div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {[
                  ['thisMonth','This month'],['lastMonth','Last month'],
                  ['last30','Last 30d'],['last90','Last 90d'],
                  ['q1','Q1'],['q2','Q2'],['ytd','YTD'],
                ].map(([k,label]) => (
                  <button key={k} type="button" className="btn btn-outline btn-sm" onClick={()=>applyQuickRange(k)} style={{padding:'4px 10px',fontSize:11}}>
                    {label}
                  </button>
                ))}
                {advCount > 0 && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={resetAdv} style={{padding:'4px 10px',fontSize:11,color:'var(--danger)'}}>
                    <X size={11}/> Reset
                  </button>
                )}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:10}}>
              <div className="form-group" style={{margin:0}}>
                <label>Date field</label>
                <select value={adv.dateField} onChange={e=>setAdv({...adv, dateField: e.target.value})}>
                  <option value="createdAt">Created</option>
                  <option value="approvedAt">Approved</option>
                  <option value="paidAt">Paid</option>
                </select>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>From</label>
                <input type="date" value={adv.dateFrom} onChange={e=>setAdv({...adv, dateFrom: e.target.value})}/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>To</label>
                <input type="date" value={adv.dateTo} onChange={e=>setAdv({...adv, dateTo: e.target.value})}/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Agent</label>
                <select value={adv.agent} onChange={e=>setAdv({...adv, agent: e.target.value})}>
                  <option value="">All agents</option>
                  {agentsInScope.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Min pool (EGP)</label>
                <input type="number" value={adv.minPool} onChange={e=>setAdv({...adv, minPool: e.target.value})} placeholder="—"/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Max pool (EGP)</label>
                <input type="number" value={adv.maxPool} onChange={e=>setAdv({...adv, maxPool: e.target.value})} placeholder="—"/>
              </div>
            </div>
            <div style={{fontSize:11,color:'var(--text-tertiary)'}}>{filtered.length} of {baseFiltered.length} match · status filter applied first, then advanced.</div>
          </div>
        )}

        <div className="data-scroll">
          <table className="data-table">
            <thead><tr>
              <th>Deal ID</th>
              <th>Unit</th>
              <th>Developer / Project</th>
              <th>Agent</th>
              <th>Pool</th>
              <th>VAT 14%</th>
              <th>Agent</th><th>TL</th><th>Mgr</th><th>Dir</th><th>Co</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Created</th>
              <th style={{textAlign:'right'}}>Actions</th>
            </tr></thead>
            <tbody>{filtered.map(c=>(
              <tr key={c.id}>
                {/* Deal ID — clickable when linked, opens the CRM deal */}
                <td className="bold" style={{fontFamily:'ui-monospace, monospace', fontSize:12}}>
                  {c.dealId ? (
                    <a
                      href={`#/system/crm/deals?focus=${encodeURIComponent(c.dealId)}`}
                      onClick={(e) => { e.stopPropagation(); }}
                      style={{color:'var(--brand)', textDecoration:'none', fontWeight:700}}
                      title={`Open deal ${c.dealId}`}
                    >
                      {c.dealId}
                    </a>
                  ) : (
                    <span style={{color:'var(--text-tertiary)', fontStyle:'italic', fontSize:11}}>not linked</span>
                  )}
                </td>
                {/* Unit code — the human reference (TH-B304, A-110, etc.) */}
                <td style={{fontFamily:'ui-monospace, monospace', fontSize:12, fontWeight:600}}>
                  {c.unit || c.deal || '—'}
                </td>
                {/* Developer / Project pair — stacked so the column stays compact */}
                <td>
                  <div style={{fontWeight:700, fontSize:12}}>{c.developer || '—'}</div>
                  <div style={{fontSize:11, color:'var(--text-tertiary)', marginTop:2}}>{c.project || '—'}</div>
                </td>
                <td>{c.agent}</td>
                <td className="bold">{fmt(c.pool)}</td>
                <td className="muted">{fmt(c.vat)}</td>
                <td>{fmt(c.agentShare)}</td>
                <td>{fmt(c.tlShare)}</td>
                <td>{fmt(c.managerShare)}</td>
                <td>{fmt(c.directorShare)}</td>
                <td>{fmt(c.companyShare)}</td>
                <td><span className={`badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                <td className="muted" style={{fontSize:11,fontFamily:'ui-monospace,monospace'}}>{c.dueDate || '—'}</td>
                <td className="muted" style={{fontSize:11,fontFamily:'ui-monospace,monospace'}}>{c.createdAt || '—'}</td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(c)}><Eye size={13}/></button>
                  {c.status==='Pending' && <button className="btn btn-primary btn-sm" onClick={()=>approve(c)}>Approve</button>}
                  {c.status==='Approved' && <button className="btn btn-success btn-sm" onClick={()=>markPaid(c)}><CheckCircle2 size={13}/> Mark Collected</button>}
                  {c.status==='Collected' && <span style={{color:'var(--success)',fontWeight:600,fontSize:12}}>Collected ✓</span>}
                  {c.status==='Rejected' && <span style={{color:'var(--danger)',fontWeight:600,fontSize:12}}>Rejected</span>}
                </div></td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length===0 && <Empty />}
        </div>
      </div>
    </div>
  );
};

export const AgentDues = () => {
  const { state, updateItem, openModal, openDrawer, toast, persona } = useApp();
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.agentDues, {
    searchKeys:['agent','id'], filters:{ status:'status' },
  });

  const processPayment = (a) => openModal({
    title: `Process Payment — ${a.agent}`, subtitle: `Outstanding: ${fmt(a.pending)}`,
    submitLabel: 'Process payment',
    body: (
      <>
        <FieldRow>
          <Field label="Amount (EGP)" name="amount" type="number" required defaultValue={a.pending} />
          <Field label="Method" name="method" type="select" options={['Bank Transfer','Cash','Cheque']} required />
        </FieldRow>
        <Field label="Reference" name="ref" placeholder="e.g. Wire reference / Cheque #" />
      </>
    ),
    onSubmit: ({ amount, method, ref }) => {
      const amt = Number(amount);
      const newPaid = a.paid + amt;
      const newPending = Math.max(0, a.pending - amt);
      const newStatus = newPending === 0 ? 'Cleared' : 'Partial';
      // Append a transaction entry to the agent dues record so each
      // payment is visible on the per-record action log, not only on
      // the global audit log.
      const entry = {
        at: new Date().toISOString(),
        actor: persona?.label || 'Finance Officer',
        action: 'Payment',
        amount: amt,
        method,
        reference: ref || null,
        balanceBefore: a.pending,
        balanceAfter: newPending,
        fromStatus: a.status,
        toStatus: newStatus,
      };
      const history = [...(a.history || []), entry];
      updateItem('agentDues', a.id, { paid: newPaid, pending: newPending, status: newStatus, history, lastPaidAt: entry.at, lastPaidBy: entry.actor }, { action: 'Payment Processed', module: 'Finance', target: a.agent, detail: `${fmt(amt)} via ${method}${ref ? ' · ref ' + ref : ''}` });
      toast(`Paid ${fmt(amt)} → ${a.agent}`);
    },
  });

  // Drawer surface for an agent dues row — shows the same per-record
  // history so a finance officer can audit every payment to that agent.
  const view = (a) => openDrawer({
    title: `Agent dues · ${a.agent}`, subtitle: `${fmt(a.pending)} outstanding · ${fmt(a.paid)} paid`,
    content: (
      <div style={{display:'flex', flexDirection:'column', gap:18}}>
        <div className="detail-grid">
          {[['Agent',a.agent],['Paid', fmt(a.paid)],['Pending', fmt(a.pending)],['Status', a.status],['Last paid by', a.lastPaidBy || '—'],['Last paid at', a.lastPaidAt ? a.lastPaidAt.slice(0,16).replace('T',' ') : '—']].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>))}
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Action log · {(a.history || []).length} payment{(a.history || []).length === 1 ? '' : 's'}</div>
          {Array.isArray(a.history) && a.history.length > 0 ? (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[...a.history].reverse().map((h, i) => (
                <div key={i} style={{display:'flex',gap:10,padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,borderLeft:`3px solid ${h.toStatus === 'Cleared' ? '#10b981' : 'var(--brand)'}`,fontSize:12,lineHeight:1.5}}>
                  <div style={{minWidth:140}}>
                    <div style={{fontWeight:700,color:'var(--text-primary)'}}>{h.action} · {fmt(h.amount)}</div>
                    <div style={{fontSize:10,color:'var(--text-tertiary)',fontFamily:'ui-monospace,monospace'}}>{(h.at || '').slice(0,16).replace('T',' ')}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div><b>{h.actor}</b> · {h.method}{h.reference ? ` · ref ${h.reference}` : ''}</div>
                    <div style={{color:'var(--text-secondary)',marginTop:2}}>{fmt(h.balanceBefore)} → {fmt(h.balanceAfter)} ({h.fromStatus} → {h.toStatus})</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{padding:'14px 16px',background:'#fafbfc',border:'1px dashed var(--border)',borderRadius:8,fontSize:12,color:'var(--text-tertiary)'}}>No payments processed yet.</div>
          )}
        </div>
      </div>
    ),
  });

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Financial Mgmt</span><span>&gt;</span><span className="current">Agent Dues</span></div><h1 className="page-title">Agent Dues</h1><p className="page-subtitle">Outstanding agent payments and settlement tracking</p></div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search agent…" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>{['Cleared','Partial','Unpaid','No Deals'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>Agent</th><th>Total Earned</th><th>Paid</th><th>Pending</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(a=>(
              <tr key={a.id}>
                <td className="bold">{a.agent}</td>
                <td>{fmt(a.totalEarned)}</td>
                <td className="muted">{fmt(a.paid)}</td>
                <td className="bold">{fmt(a.pending)}</td>
                <td><span className={`badge ${statusBadge(a.status)}`}>{a.status}</span></td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(a)} title="View action log"><Eye size={13}/></button>
                  {a.pending>0 && <button className="btn btn-primary btn-sm" onClick={()=>processPayment(a)}><DollarSign size={13}/> Process Payment</button>}
                </div></td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length===0 && <Empty />}
        </div>
      </div>
    </div>
  );
};
