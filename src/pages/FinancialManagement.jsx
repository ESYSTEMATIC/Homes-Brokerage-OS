import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Field, FieldRow, exportCSV } from '../components/UI';
import { COMMISSION_SPLIT_DEFAULT } from '../data/staticData';
import { Plus, Download, Pencil, Zap, History, Sliders } from 'lucide-react';

// Controlled split editor — the Company % is computed live as (100 - sum
// of the other 4) so the form can never get out of balance. If the four
// agent-side percentages exceed 100, we show an inline warning and the
// Company input goes negative (so the validation in onSubmit can catch it
// before save). Renders four editable number inputs + a read-only
// Company display + a total bar so the System Admin sees the maths add up.
const SplitEditor = ({ initial }) => {
  const seed = initial || COMMISSION_SPLIT_DEFAULT;
  const [agent, setAgent]       = useState(String(seed.agent));
  const [tl, setTl]             = useState(String(seed.tl));
  const [manager, setManager]   = useState(String(seed.manager));
  const [director, setDirector] = useState(String(seed.director));

  const n = (v) => {
    const num = Number(v);
    return Number.isFinite(num) ? num : 0;
  };
  const sumOthers = n(agent) + n(tl) + n(manager) + n(director);
  const company = Math.round((100 - sumOthers) * 100) / 100;
  const valid = company >= 0;

  return (
    <>
      <FieldRow>
        <div className="ui-field">
          <label>Agent %<span className="ui-required">*</span></label>
          <input type="number" name="splitAgent" step="0.01" min="0" max="100" required value={agent} onChange={e => setAgent(e.target.value)} placeholder="33.33"/>
        </div>
        <div className="ui-field">
          <label>Team Leader %<span className="ui-required">*</span></label>
          <input type="number" name="splitTl" step="0.01" min="0" max="100" required value={tl} onChange={e => setTl(e.target.value)} placeholder="10"/>
        </div>
      </FieldRow>
      <FieldRow>
        <div className="ui-field">
          <label>Sales Manager %<span className="ui-required">*</span></label>
          <input type="number" name="splitManager" step="0.01" min="0" max="100" required value={manager} onChange={e => setManager(e.target.value)} placeholder="5"/>
        </div>
        <div className="ui-field">
          <label>Sales Director %<span className="ui-required">*</span></label>
          <input type="number" name="splitDirector" step="0.01" min="0" max="100" required value={director} onChange={e => setDirector(e.target.value)} placeholder="3"/>
        </div>
      </FieldRow>
      <FieldRow>
        <div className="ui-field">
          <label>Company % <span style={{fontWeight:500,color:'var(--text-tertiary)',fontSize:11}}>(auto-balanced)</span></label>
          <input type="number" name="splitCompany" readOnly tabIndex={-1} value={company} style={{background:'#f8fafc',color: valid ? 'var(--text-primary)' : 'var(--danger)'}}/>
        </div>
        <div className="ui-field">
          <label>Total</label>
          <div style={{
            padding:'9px 12px',
            border:`1px solid ${valid ? '#86efac' : '#fca5a5'}`,
            background: valid ? '#dcfce7' : '#fee2e2',
            color: valid ? '#166534' : '#991b1b',
            borderRadius:8,
            fontSize:13,
            fontWeight:700,
            fontFamily:'ui-monospace,monospace',
          }}>
            {(sumOthers + company).toFixed(2)}% {valid ? '✓' : '· over 100'}
          </div>
        </div>
      </FieldRow>
      {!valid && (
        <div style={{fontSize:11,color:'#b45309',marginTop:6}}>
          Agent + TL + Manager + Director total {sumOthers.toFixed(2)}% — must be ≤ 100% so the Company share stays non-negative. Reduce one of the persona shares.
        </div>
      )}
    </>
  );
};

const fmt = v => new Intl.NumberFormat('en-EG',{style:'currency',currency:'EGP',maximumFractionDigits:0}).format(v||0);
// One-line pretty-printer for a split row — used in audit-log details and
// the toast confirmation.
const splitStr = (s) => `Agent ${s.agent}% · TL ${s.tl}% · Mgr ${s.manager}% · Dir ${s.director}% · Co ${s.company}%`;

// ─── Commission Policies section — shared between Financial Management
//     (deeper finance surface) and the Master Data → Commission Policies
//     route. Single implementation for both so Edit / View History / split
//     editing behave the same wherever the user lands. ───────────────────
export const CommissionPoliciesSection = ({ embedded = false }) => {
  const { state, addItem, updateItem, openModal, openDrawer, toast, writeAudit, persona } = useApp();
  const today = () => new Date().toISOString().split('T')[0];

  // Build a `policyHistory` entry capturing what changed in this save.
  // Compares the old policy against the new one and diffs every field
  // we care about — the rate, the per-persona split, override flag,
  // status. The entry lands on policy.history[] and is rendered in the
  // 'View history' drawer below.
  const buildPolicyHistoryEntry = ({ existing, before, after, action, note }) => {
    const changed = [];
    const splitDiff = (key, label) => {
      const a = before.split?.[key];
      const b = after.split?.[key];
      if (a !== b) changed.push(`${label} ${a}% → ${b}%`);
    };
    if (existing) {
      if (before.rate !== after.rate) changed.push(`Rate ${before.rate}% → ${after.rate}%`);
      if (before.status !== after.status) changed.push(`Status ${before.status} → ${after.status}`);
      if (before.override !== after.override) changed.push(`Override ${before.override ? 'On' : 'Off'} → ${after.override ? 'On' : 'Off'}`);
      splitDiff('agent', 'Agent');
      splitDiff('tl', 'TL');
      splitDiff('manager', 'Mgr');
      splitDiff('director', 'Dir');
      splitDiff('company', 'Co');
    }
    return {
      at: new Date().toISOString(),
      actor: persona?.label || 'System Admin',
      action,
      detail: existing
        ? (changed.length ? `Changed: ${changed.join(' · ')}${note ? ' — ' + note : ''}` : (note || 'No-op save'))
        : `Created · rate ${after.rate}% · ${splitStr(after.split)}${note ? ' — ' + note : ''}`,
      before: existing ? before : null,
      after,
    };
  };

  const openPolicyForm = (existing) => openModal({
    title: existing ? `Edit Policy — ${existing.id}` : 'New Commission Policy',
    subtitle: 'Per developer × project · deal-side rate + internal 4-persona split. Every field is editable and audit-logged.',
    submitLabel: existing ? 'Save changes' : 'Create policy',
    body: (
      <>
        <FieldRow>
          <Field label="Developer" name="developer" required defaultValue={existing?.developer} />
          <Field label="Project" name="project" required defaultValue={existing?.project} />
        </FieldRow>
        <FieldRow>
          <Field label="Deal-side rate %" name="rate" type="number" required defaultValue={existing?.rate || 2.0} placeholder="e.g. 2.0" />
          <Field label="Status" name="status" type="select" options={['Active','Inactive']} defaultValue={existing?.status || 'Active'} />
        </FieldRow>

        <div style={{margin:'14px 0 6px',fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.08em',display:'flex',alignItems:'center',gap:6}}>
          <Sliders size={12}/> Internal commission split — Company % auto-balances
        </div>
        <SplitEditor initial={existing?.split} />
        <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:6}}>
          Existing commission rows are not retroactively re-split. New deals created against this policy will use these percentages automatically.
        </div>
      </>
    ),
    onSubmit: (data) => {
      const agent    = Number(data.splitAgent);
      const tl       = Number(data.splitTl);
      const manager  = Number(data.splitManager);
      const director = Number(data.splitDirector);
      const sumOthers = agent + tl + manager + director;
      // Validate the 4 persona shares are non-negative and don't overflow.
      // The Company share is computed as the remainder so the total always
      // hits exactly 100% — no more 'must total 100%' confusion.
      if ([agent, tl, manager, director].some(n => !Number.isFinite(n) || n < 0)) {
        toast('Each persona % must be a positive number', 'error');
        return false;
      }
      if (sumOthers > 100) {
        toast(`Agent + TL + Manager + Director total ${sumOthers.toFixed(2)}% — reduce one share so Company stays ≥ 0%`, 'error');
        return false;
      }
      const company = Math.round((100 - sumOthers) * 100) / 100;
      const split = { agent, tl, manager, director, company };
      const patch = {
        developer: data.developer,
        project: data.project,
        rate: Number(data.rate),
        status: data.status,
        override: existing?.override || false,
        split,
      };
      if (existing) {
        const entry = buildPolicyHistoryEntry({ existing, before: existing, after: patch, action: 'Updated' });
        const nextHistory = [...(existing.history || []), entry];
        updateItem('commissionPolicies', existing.id, { ...patch, history: nextHistory }, {
          action: 'Policy Updated',
          module: 'Finance',
          target: existing.id,
          detail: entry.detail,
        });
        toast(`Policy ${existing.id} updated`);
      } else {
        const entry = buildPolicyHistoryEntry({ existing: null, before: null, after: patch, action: 'Created' });
        const created = addItem('commissionPolicies', { ...patch, history: [entry] }, 'COM', {
          action: 'Policy Created',
          module: 'Finance',
          detail: entry.detail,
        });
        toast(`Policy ${created.id} created`);
      }
    },
  });

  const requestOverride = (p) => openModal({
    title: `Override — ${p.project}`,
    subtitle: 'DEAL-004: override requires reason and hierarchy approval',
    submitLabel: 'Submit for approval', danger: true,
    body: (
      <>
        <FieldRow>
          <Field label="New Rate %" name="rate" type="number" required defaultValue={p.rate + 0.2} />
          <Field label="Approver" name="approver" type="select" required options={state.staff.filter(s=>s.type.includes('Manager')||s.type==='Sales Director').map(s=>s.name)} />
        </FieldRow>
        <Field label="Reason" name="overrideReason" type="textarea" required placeholder="e.g. Premium launch incentive" />
      </>
    ),
    onSubmit: ({ rate, approver, overrideReason }) => {
      const after = { ...p, rate: Number(rate), override: true, overrideReason, approver };
      const entry = buildPolicyHistoryEntry({ existing: p, before: p, after, action: 'Override', note: `${overrideReason} · approved by ${approver}` });
      updateItem('commissionPolicies', p.id, { rate: Number(rate), override: true, overrideReason, approver, history: [...(p.history || []), entry] }, { action: 'Commission Override', module: 'Finance', target: `${p.id} ${p.project}`, detail: `Rate → ${rate}% — ${overrideReason}` });
      toast(`Override applied to ${p.project}`, 'warning');
    },
  });

  // Per-policy action log drawer — opens from the History icon on every
  // policy row. Renders the policy.history[] timeline so an auditor can
  // see every change (create / update / override / status flip) with
  // actor + diff + timestamp.
  const viewHistory = (p) => openDrawer({
    title: `Policy log · ${p.id}`,
    subtitle: `${p.developer} / ${p.project}`,
    content: (
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <div style={{padding:'10px 12px',background:'#f8fafc',border:'1px solid var(--border)',borderRadius:8,fontSize:12}}>
          <div><b>Current rate:</b> {p.rate}%</div>
          <div style={{marginTop:4}}><b>Current split:</b> {splitStr(p.split || COMMISSION_SPLIT_DEFAULT)}</div>
          {p.override && <div style={{marginTop:4,color:'#b45309'}}><b>Override active:</b> {p.overrideReason} — approver {p.approver}</div>}
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Action log · {(p.history || []).length} entr{(p.history || []).length === 1 ? 'y' : 'ies'}</div>
          {Array.isArray(p.history) && p.history.length > 0 ? (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[...p.history].reverse().map((h, i) => (
                <div key={i} style={{display:'flex',gap:10,padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,borderLeft:`3px solid ${h.action === 'Created' ? '#10b981' : h.action === 'Override' ? '#f59e0b' : 'var(--brand)'}`,fontSize:12,lineHeight:1.5}}>
                  <div style={{minWidth:140}}>
                    <div style={{fontWeight:700,color:'var(--text-primary)'}}>{h.action}</div>
                    <div style={{fontSize:10,color:'var(--text-tertiary)',fontFamily:'ui-monospace,monospace'}}>{(h.at || '').slice(0,16).replace('T',' ')}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div><b>{h.actor}</b></div>
                    <div style={{color:'var(--text-secondary)',marginTop:2}}>{h.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{padding:'14px 16px',background:'#fafbfc',border:'1px dashed var(--border)',borderRadius:8,fontSize:12,color:'var(--text-tertiary)'}}>No changes logged yet.</div>
          )}
        </div>
      </div>
    ),
  });

  return (
    <div>
      {!embedded && (
        <div className="page-header">
          <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Master Data</span><span>&gt;</span><span className="current">Policy</span></div>
          <h1 className="page-title">Commission Policies</h1>
          <p className="page-subtitle">Per developer × project · deal-side rate + internal 4-persona split. Every change is audit-logged.</p>
        </div>
      )}
      <div className="data-panel" style={{marginBottom:24}}>
        <div className="data-toolbar">
          <div className="data-toolbar-left" style={{color:'var(--text-secondary)',fontSize:13}}>{state.commissionPolicies.length} policy / policies configured</div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`commission_policies_${today()}`,state.commissionPolicies); toast('Exported policies'); writeAudit('Export','Commission Policies CSV','Finance');}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={()=>openPolicyForm(null)}><Plus size={14}/> New Policy</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Developer</th><th>Project</th><th>Rate</th><th>Agent</th><th>TL</th><th>Mgr</th><th>Dir</th><th>Co</th><th>Override</th><th>Status</th><th>Log</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{state.commissionPolicies.map(p => {
              const s = p.split || COMMISSION_SPLIT_DEFAULT;
              return (
                <tr key={p.id}>
                  <td className="muted">{p.id}</td>
                  <td className="bold">{p.developer}</td>
                  <td>{p.project}</td>
                  <td className="bold">{p.rate}%</td>
                  <td className="muted">{s.agent}%</td>
                  <td className="muted">{s.tl}%</td>
                  <td className="muted">{s.manager}%</td>
                  <td className="muted">{s.director}%</td>
                  <td className="muted">{s.company}%</td>
                  <td>{p.override
                    ? <span className="badge badge-warning" title={`${p.overrideReason || ''}${p.approver ? ' · approver ' + p.approver : ''}`}>Yes</span>
                    : <span className="badge badge-gray">No</span>}</td>
                  <td><span className="badge badge-success">{p.status}</span></td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={()=>viewHistory(p)} title="Policy action log">
                      <History size={13}/> {(p.history || []).length}
                    </button>
                  </td>
                  <td style={{textAlign:'right'}}><div className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={()=>openPolicyForm(p)}><Pencil size={13}/></button>
                    {!p.override && <button className="btn btn-warning btn-sm" style={{background:'var(--warning-bg)',color:'var(--warning)',border:'1px solid #fde68a'}} onClick={()=>requestOverride(p)}>Override</button>}
                  </div></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Top-level page that wraps the policy section with the broader Financial
// Management chrome — KPI strip + Deal Commission Drafts table below the
// policies.
export const FinancialManagement = () => {
  const { state, updateItem, openConfirm, toast } = useApp();

  const approveDraft = (d) => openConfirm({
    title: `Approve commission for ${d.id}?`,
    message: `Lock commission at ${d.commission}% (${fmt(d.value*d.commission/100)}) for downstream payment processing.`,
    onConfirm: () => { updateItem('deals', d.id, { commissionApproved: true }, { action: 'Commission Approved', module: 'Finance', target: d.id, detail: fmt(d.value*d.commission/100) }); toast(`${d.id} commission approved`); },
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Financial Management</span></div>
        <h1 className="page-title">Financial Management</h1>
        <p className="page-subtitle">Commission policies, overrides, and forecasts</p>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Total Commission Due</div><div className="kpi-value" style={{fontSize:20}}>{fmt(621000)}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>💰</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pending Approval</div><div className="kpi-value" style={{fontSize:20}}>{fmt(273000)}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Overrides Active</div><div className="kpi-value">{state.commissionPolicies.filter(p=>p.override).length}</div></div><div className="kpi-icon red"><Zap size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Active Policies</div><div className="kpi-value">{state.commissionPolicies.length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>📋</span></div></div>
      </div>

      <h2 className="section-title">Commission Policies</h2>
      <CommissionPoliciesSection embedded />

      <h2 className="section-title">Deal Commission Drafts</h2>
      <div className="data-panel">
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>Deal</th><th>Lead</th><th>Project</th><th>Value</th><th>Rate</th><th>Commission Amount</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{state.deals.filter(d=>d.status==='Active').map(d=>(
              <tr key={d.id}>
                <td className="muted">{d.id}</td>
                <td className="bold">{d.lead}</td>
                <td>{d.project}</td>
                <td>{fmt(d.value)}</td>
                <td>{d.commission}%</td>
                <td className="bold">{fmt(d.value*d.commission/100)}</td>
                <td><span className={`badge ${d.commissionApproved?'badge-success':'badge-warning'}`}>{d.commissionApproved?'Approved':'Pending'}</span></td>
                <td style={{textAlign:'right'}}>{!d.commissionApproved && <button className="btn btn-primary btn-sm" onClick={()=>approveDraft(d)}>Approve</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
