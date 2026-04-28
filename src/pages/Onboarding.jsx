import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { FileText, Clock, CheckCircle, XCircle, Plus, Download, Eye, ChevronRight } from 'lucide-react';
import { APPLICATION_STATUS } from '../data/staticData';

const badgeFor = s => s.includes('Approved') ? 'badge-success' : s.includes('Rejected') ? 'badge-danger' : s.includes('Review') || s.includes('Submitted') ? 'badge-info' : 'badge-warning';

export const Onboarding = () => {
  const { state, addItem, updateItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();

  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.onboarding, {
    searchKeys: ['applicant', 'department', 'branch', 'id'],
    filters: { status: 'status', type: 'type' },
  });

  const today = () => new Date().toISOString().split('T')[0];

  const counts = {
    submitted: state.onboarding.filter(a=>a.status==='Submitted').length,
    review: state.onboarding.filter(a=>a.status==='Under Review').length,
    approved: state.onboarding.filter(a=>a.status==='Approved').length,
    rejected: state.onboarding.filter(a=>a.status==='Rejected').length,
  };

  const newApplication = () => openModal({
    title: 'New Application', subtitle: 'BRD §8.9 — onboarding intake',
    submitLabel: 'Submit application',
    body: (
      <>
        <FieldRow>
          <Field label="Applicant Name" name="applicant" required />
          <Field label="Type" name="type" type="select" required options={['Agent','Employee']} />
        </FieldRow>
        <FieldRow>
          <Field label="Department" name="department" type="select" required options={state.departments.map(d=>d.name)} />
          <Field label="Branch" name="branch" type="select" required options={state.branches.map(b=>b.name)} />
        </FieldRow>
      </>
    ),
    onSubmit: (data) => {
      const c = addItem('onboarding', { ...data, date: today(), status: 'Submitted' }, 'APP', { action: 'Application Submitted', module: 'Backoffice', detail: `${data.applicant} for ${data.department}` });
      toast(`Application ${c.id} created`);
    },
  });

  const approve = (a) => openConfirm({
    title: 'Approve application?', message: `${a.applicant} (${a.id}) will move to Approved status. An employee record will be initialized.`,
    onConfirm: () => {
      updateItem('onboarding', a.id, { status: 'Approved' }, { action: 'Application Approved', module: 'Backoffice', target: a.id });
      toast(`${a.applicant} approved`);
    },
  });
  const reject = (a) => openModal({
    title: 'Reject application', subtitle: a.applicant,
    submitLabel: 'Reject', danger: true,
    body: <Field label="Rejection Reason" name="reason" type="textarea" required placeholder="Visible in audit trail…" />,
    onSubmit: ({ reason }) => {
      updateItem('onboarding', a.id, { status: 'Rejected' }, { action: 'Application Rejected', module: 'Backoffice', target: a.id, detail: reason });
      toast(`${a.applicant} rejected`, 'warning');
    },
  });
  const setStatus = (a, status) => {
    updateItem('onboarding', a.id, { status }, { action: 'Application Status Changed', module: 'Backoffice', target: `${a.id} → ${status}` });
    toast(`${a.applicant} → ${status}`);
  };

  const view = (a) => openDrawer({
    title: a.applicant, subtitle: `${a.id} · ${a.type} · ${a.status}`,
    content: (
      <>
        <div className="detail-grid">
          {[['ID',a.id],['Type',a.type],['Department',a.department],['Branch',a.branch],['Submitted',a.date],['Status',a.status]].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>
          ))}
        </div>
        <div style={{marginTop:18}}>
          <h4 style={{fontSize:13,fontWeight:700,marginBottom:10}}>Onboarding Stages</h4>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {APPLICATION_STATUS.filter(s=>s!=='Rejected').map(s => (
              <button key={s} className="btn btn-outline btn-sm" style={{justifyContent:'space-between'}} onClick={()=>setStatus(a,s)}>
                <span>{s}</span>{a.status===s ? '✓' : <ChevronRight size={14}/>}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginTop:18,display:'flex',gap:8}}>
          <button className="btn btn-success" onClick={()=>approve(a)}>Approve</button>
          <button className="btn btn-danger" onClick={()=>reject(a)}>Reject</button>
        </div>
      </>
    ),
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Onboarding</span></div>
        <h1 className="page-title">Onboarding & Applications</h1>
        <p className="page-subtitle">Review and process agent onboarding applications — BRD 8.9</p>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Submitted</div><div className="kpi-value">{counts.submitted}</div></div><div className="kpi-icon blue"><FileText size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Under Review</div><div className="kpi-value">{counts.review}</div></div><div className="kpi-icon amber"><Clock size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Approved</div><div className="kpi-value">{counts.approved}</div></div><div className="kpi-icon green"><CheckCircle size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Rejected</div><div className="kpi-value">{counts.rejected}</div></div><div className="kpi-icon red"><XCircle size={20}/></div></div>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search applicant..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>{APPLICATION_STATUS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="data-select" value={filterVals.type} onChange={e=>setFilter('type', e.target.value)}>
              <option value="">All Types</option><option>Agent</option><option>Employee</option>
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`onboarding_${today()}`, filtered); toast(`Exported ${filtered.length} rows`); writeAudit('Export','Onboarding CSV','Backoffice',`${filtered.length} rows`);}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={newApplication}><Plus size={14}/> New Application</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Applicant</th><th>Type</th><th>Department</th><th>Branch</th><th>Submitted</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(a=>(
              <tr key={a.id}>
                <td className="muted">{a.id}</td>
                <td className="bold">{a.applicant}</td>
                <td>{a.type}</td>
                <td>{a.department}</td>
                <td>{a.branch}</td>
                <td className="muted">{a.date}</td>
                <td><span className={`badge ${badgeFor(a.status)}`}>{a.status}</span></td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(a)}><Eye size={13}/> View</button>
                  {!['Approved','Rejected'].includes(a.status) && (<>
                    <button className="btn btn-success btn-sm" onClick={()=>approve(a)}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>reject(a)}>Reject</button>
                  </>)}
                </div></td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length === 0 && <Empty />}
        </div>
      </div>
    </div>
  );
};
