import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Eye, Download, Plus } from 'lucide-react';
import { DOC_STATUS } from '../data/staticData';

const badgeFor = s => s==='Approved' ? 'badge-success' : s==='Rejected' || s==='Missing' ? 'badge-danger' : 'badge-warning';

export const DocumentsReview = () => {
  const { state, addItem, updateItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();

  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.documents, {
    searchKeys: ['doc', 'agent', 'type', 'id'],
    filters: { status: 'status', type: 'type' },
  });

  const today = () => new Date().toISOString().split('T')[0];

  const approve = (d) => openConfirm({
    title: 'Approve document?', message: `${d.doc} for ${d.agent} will be marked Approved.`,
    onConfirm: () => { updateItem('documents', d.id, { status: 'Approved', date: today() }, { action: 'Document Approved', module: 'Backoffice', target: d.id }); toast('Document approved'); },
  });
  const reject = (d) => openModal({
    title: `Reject — ${d.doc}`, subtitle: d.agent,
    submitLabel: 'Reject', danger: true,
    body: <Field label="Rejection reason" name="reason" type="textarea" required placeholder="e.g. image quality insufficient" />,
    onSubmit: ({ reason }) => { updateItem('documents', d.id, { status: 'Rejected' }, { action: 'Document Rejected', module: 'Backoffice', target: d.id, detail: reason }); toast('Document rejected', 'warning'); },
  });
  const requestUpload = (d) => {
    updateItem('documents', d.id, { status: 'Pending Review' }, { action: 'Document Requested', module: 'Backoffice', target: d.id, detail: 'Upload reminder sent to agent' });
    toast(`Reminder sent to ${d.agent}`, 'info');
  };
  const view = (d) => openDrawer({
    title: d.doc, subtitle: `${d.id} · ${d.type} · ${d.agent}`,
    content: (
      <>
        <div className="detail-grid">
          {[['ID',d.id],['Document',d.doc],['Type',d.type],['Agent',d.agent],['Upload Date',d.date],['Status',d.status]].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>
          ))}
        </div>
        <div style={{marginTop:18,padding:16,background:'#fafbfc',border:'1px dashed var(--border)',borderRadius:8,textAlign:'center',color:'var(--text-secondary)',fontSize:12}}>
          Document preview placeholder · would render PDF/image preview in production
        </div>
        <div style={{marginTop:18,display:'flex',gap:8,flexWrap:'wrap'}}>
          {d.status === 'Pending Review' && <>
            <button className="btn btn-success" onClick={()=>approve(d)}>Approve</button>
            <button className="btn btn-danger" onClick={()=>reject(d)}>Reject</button>
          </>}
          {(d.status === 'Missing' || d.status === 'Rejected') && <button className="btn btn-primary" onClick={()=>requestUpload(d)}>Request Upload</button>}
        </div>
      </>
    ),
  });

  const requestNew = () => openModal({
    title: 'Request new document', subtitle: 'Backoffice document collection',
    submitLabel: 'Send request',
    body: (
      <>
        <FieldRow>
          <Field label="Document" name="doc" required placeholder="e.g. Brokerage Agreement" />
          <Field label="Type" name="type" type="select" required options={['Identity','Financial','Legal','Regulatory']} />
        </FieldRow>
        <Field label="Agent" name="agent" type="select" required options={state.staff.map(s=>s.name)} />
      </>
    ),
    onSubmit: (data) => {
      const c = addItem('documents', { ...data, date: '—', status: 'Missing' }, 'DOC', { action: 'Document Requested', module: 'Backoffice', detail: `${data.doc} from ${data.agent}` });
      toast(`Request created · ${c.id}`);
    },
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Documents Review</span></div>
        <h1 className="page-title">Documents Review</h1>
        <p className="page-subtitle">Review and approve agent documentation</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search by agent or document..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>{DOC_STATUS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="data-select" value={filterVals.type} onChange={e=>setFilter('type', e.target.value)}>
              <option value="">All Types</option>{['Identity','Financial','Legal','Regulatory'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`documents_${today()}`, filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Documents CSV','Backoffice',`${filtered.length} rows`);}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={requestNew}><Plus size={14}/> Request Document</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Document</th><th>Type</th><th>Agent</th><th>Upload Date</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(d=>(
              <tr key={d.id}>
                <td className="muted">{d.id}</td>
                <td className="bold">{d.doc}</td>
                <td>{d.type}</td>
                <td>{d.agent}</td>
                <td className="muted">{d.date}</td>
                <td><span className={`badge ${badgeFor(d.status)}`}>{d.status}</span></td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(d)}><Eye size={13}/> View</button>
                  {d.status==='Pending Review' && <>
                    <button className="btn btn-success btn-sm" onClick={()=>approve(d)}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>reject(d)}>Reject</button>
                  </>}
                  {d.status==='Missing' && <button className="btn btn-outline btn-sm" onClick={()=>requestUpload(d)}>Request Upload</button>}
                  {d.status==='Rejected' && <button className="btn btn-outline btn-sm" onClick={()=>requestUpload(d)}>Request Resubmission</button>}
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
