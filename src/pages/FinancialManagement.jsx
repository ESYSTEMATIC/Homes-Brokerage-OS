import React from 'react';
import { useApp } from '../context/AppContext';
import { Field, FieldRow, exportCSV } from '../components/UI';
import { Plus, Download, Pencil, Zap } from 'lucide-react';

const fmt = v => new Intl.NumberFormat('en-EG',{style:'currency',currency:'EGP',maximumFractionDigits:0}).format(v||0);

export const FinancialManagement = () => {
  const { state, addItem, updateItem, openModal, openConfirm, toast, writeAudit } = useApp();
  const today = () => new Date().toISOString().split('T')[0];

  const openPolicyForm = (existing) => openModal({
    title: existing ? `Edit Policy — ${existing.id}` : 'New Commission Policy',
    subtitle: 'Commission policies vary by developer/project; overrides require approval',
    submitLabel: existing ? 'Save changes' : 'Create policy',
    body: (
      <>
        <FieldRow>
          <Field label="Developer" name="developer" required defaultValue={existing?.developer} />
          <Field label="Project" name="project" required defaultValue={existing?.project} />
        </FieldRow>
        <FieldRow>
          <Field label="Rate %" name="rate" type="number" required defaultValue={existing?.rate || 2.0} />
          <Field label="Status" name="status" type="select" options={['Active','Inactive']} defaultValue={existing?.status || 'Active'} />
        </FieldRow>
      </>
    ),
    onSubmit: (data) => {
      const patch = { ...data, rate: Number(data.rate), override: false };
      if (existing) { updateItem('commissionPolicies', existing.id, patch, { action: 'Policy Updated', module: 'Finance', target: existing.id }); toast('Policy updated'); }
      else { const c = addItem('commissionPolicies', patch, 'COM', { action: 'Policy Created', module: 'Finance', detail: `${data.developer} / ${data.project} @ ${data.rate}%` }); toast(`Policy ${c.id} created`); }
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
      updateItem('commissionPolicies', p.id, { rate: Number(rate), override: true, overrideReason, approver }, { action: 'Commission Override', module: 'Finance', target: `${p.id} ${p.project}`, detail: `Rate → ${rate}% — ${overrideReason}` });
      toast(`Override applied to ${p.project}`, 'warning');
    },
  });

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
            <thead><tr><th>ID</th><th>Developer</th><th>Project</th><th>Rate</th><th>Override</th><th>Override Reason</th><th>Approver</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{state.commissionPolicies.map(p=>(
              <tr key={p.id}>
                <td className="muted">{p.id}</td>
                <td className="bold">{p.developer}</td>
                <td>{p.project}</td>
                <td className="bold">{p.rate}%</td>
                <td>{p.override?<span className="badge badge-warning">Yes</span>:<span className="badge badge-gray">No</span>}</td>
                <td className="muted" style={{maxWidth:180}}>{p.overrideReason||'—'}</td>
                <td>{p.approver||'—'}</td>
                <td><span className="badge badge-success">{p.status}</span></td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>openPolicyForm(p)}><Pencil size={13}/></button>
                  {!p.override && <button className="btn btn-warning btn-sm" style={{background:'var(--warning-bg)',color:'var(--warning)',border:'1px solid #fde68a'}} onClick={()=>requestOverride(p)}>Override</button>}
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

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
