import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, Field, FieldRow, Empty } from '../components/UI';
import { ExportMenu } from '../components/ExportMenu';
import { Eye, CheckCircle2, DollarSign } from 'lucide-react';

const fmt = v => 'EGP ' + (v||0).toLocaleString();
const statusBadge = s => s==='Approved'?'badge-success':s==='Pending'?'badge-warning':s==='Paid'?'badge-info':s==='Cleared'?'badge-success':s==='Unpaid'?'badge-danger':s==='Partial'?'badge-warning':'badge-gray';

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
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.dealsRev, {
    searchKeys:['unit','developer','agent','id'], filters:{ status:'status' },
  });

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
            <input className="data-search" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>{['Approved','Pending','Paid'].map(s=><option key={s}>{s}</option>)}
            </select>
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
  const { state, updateItem, openConfirm, openDrawer, toast, persona } = useApp();
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.commEngine, {
    searchKeys:['deal','agent','id'], filters:{ status:'status' },
  });

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

  const approve = (c) => openConfirm({
    title: `Approve commission for ${c.deal}?`, message: `Lock pool of ${fmt(c.pool)} (Agent: ${fmt(c.agentShare)}, TL: ${fmt(c.tlShare)}, Company: ${fmt(c.companyShare)}).`,
    onConfirm: () => {
      const history = appendCommHistory(c, {
        action: 'Approved',
        fromStatus: c.status,
        toStatus: 'Approved',
        amount: c.pool,
        detail: `Pool locked at ${fmt(c.pool)} — Agent ${fmt(c.agentShare)} · TL ${fmt(c.tlShare)} · Company ${fmt(c.companyShare)}`,
      });
      updateItem('commEngine', c.id, { status: 'Approved', approvedAt: new Date().toISOString(), approvedBy: persona?.label, history }, { action: 'Commission Approved', module: 'Finance', target: c.deal, detail: `${fmt(c.pool)} · by ${persona?.label}` });
      toast(`${c.deal} approved`);
    },
  });
  const markPaid = (c) => openConfirm({
    title: `Mark ${c.deal} as paid?`, message: `Funds released to ${c.agent}. This is irreversible.`,
    onConfirm: () => {
      const history = appendCommHistory(c, {
        action: 'Paid',
        fromStatus: c.status,
        toStatus: 'Paid',
        amount: c.agentShare,
        detail: `Disbursed ${fmt(c.agentShare)} to ${c.agent} · TL ${fmt(c.tlShare)} · Company ${fmt(c.companyShare)}`,
      });
      updateItem('commEngine', c.id, { status: 'Paid', paidAt: new Date().toISOString(), paidBy: persona?.label, history }, { action: 'Commission Paid', module: 'Finance', target: c.deal, detail: `${fmt(c.pool)} · by ${persona?.label}` });
      toast(`${c.deal} paid`);
    },
  });
  const view = (c) => openDrawer({ title: `Commission · ${c.deal}`, subtitle: c.agent,
    content: (
      <div style={{display:'flex', flexDirection:'column', gap:18}}>
        <div className="detail-grid">
          {[['Deal',c.deal],['Agent',c.agent],['Pool',fmt(c.pool)],['Agent Share',fmt(c.agentShare)],['TL Share',fmt(c.tlShare)],['Company Share',fmt(c.companyShare)],['Status',c.status],['Approved by', c.approvedBy || (c.status === 'Approved' || c.status === 'Paid' ? '—' : 'pending')],['Paid by', c.paidBy || (c.status === 'Paid' ? '—' : 'pending')]].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>))}
        </div>

        {/* Per-record transaction history — every state change appends
            an entry here so auditors can read the timeline at a glance. */}
        <div>
          <div style={{fontSize:10,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Action log · {(c.history || []).length} entr{(c.history || []).length === 1 ? 'y' : 'ies'}</div>
          {Array.isArray(c.history) && c.history.length > 0 ? (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[...c.history].reverse().map((h, i) => (
                <div key={i} style={{display:'flex',gap:10,padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,borderLeft:`3px solid ${h.action === 'Paid' ? '#10b981' : h.action === 'Approved' ? 'var(--brand)' : h.action === 'Rejected' ? '#ef4444' : '#94a3b8'}`,fontSize:12,lineHeight:1.5}}>
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

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Financial Mgmt</span><span>&gt;</span><span className="current">Commission Engine</span></div><h1 className="page-title">Commission Engine</h1><p className="page-subtitle">Revenue, commissions, and agent dues</p></div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search deal or agent…" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>{['Approved','Pending','Paid'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <ExportMenu
            rows={filtered}
            columns={[
              { key: 'id',           label: 'ID' },
              { key: 'deal',         label: 'Deal' },
              { key: 'agent',        label: 'Agent' },
              { key: 'pool',         label: 'Pool (EGP)',  format: v => fmt(v) },
              { key: 'agentShare',   label: 'Agent share', format: v => fmt(v) },
              { key: 'tlShare',      label: 'TL share',    format: v => fmt(v) },
              { key: 'companyShare', label: 'Company share', format: v => fmt(v) },
              { key: 'status',       label: 'Status' },
            ]}
            filename="commission_engine"
            title="Commission Engine Export"
            subtitle={`Filtered view · ${filtered.length} commission${filtered.length === 1 ? '' : 's'}`}
          />
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>Deal</th><th>Agent</th><th>Pool</th><th>Agent</th><th>TL</th><th>Company</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(c=>(
              <tr key={c.id}>
                <td className="bold">{c.deal}</td>
                <td>{c.agent}</td>
                <td className="bold">{fmt(c.pool)}</td>
                <td>{fmt(c.agentShare)}</td>
                <td>{fmt(c.tlShare)}</td>
                <td>{fmt(c.companyShare)}</td>
                <td><span className={`badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(c)}><Eye size={13}/></button>
                  {c.status==='Pending' && <button className="btn btn-primary btn-sm" onClick={()=>approve(c)}>Approve</button>}
                  {c.status==='Approved' && <button className="btn btn-success btn-sm" onClick={()=>markPaid(c)}><CheckCircle2 size={13}/> Mark Paid</button>}
                  {c.status==='Paid' && <span style={{color:'var(--success)',fontWeight:600,fontSize:12}}>Paid ✓</span>}
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
