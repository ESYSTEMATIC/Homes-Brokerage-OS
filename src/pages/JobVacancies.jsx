import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Plus, Download, Eye, Pencil, Globe, Archive } from 'lucide-react';
import { JOB_STATUS } from '../data/staticData';

const statusColor = s => {
  if (s === 'Published') return 'badge-success';
  if (s === 'Draft') return 'badge-gray';
  if (s === 'Closed') return 'badge-danger';
  return 'badge-info';
};

export const JobVacancies = () => {
  const { state, addItem, updateItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const managers = state.staff.filter(s=>['Sales Manager','Team Leader','Sales Director'].includes(s.type) || s.title.toLowerCase().includes('manager')).map(s=>s.name);

  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.jobs, {
    searchKeys: ['title', 'department', 'location', 'id'],
    filters: { status: 'status', department: 'department' },
  });

  const today = () => new Date().toISOString().split('T')[0];

  const openForm = (existing) => openModal({
    title: existing ? `Edit Vacancy — ${existing.title}` : 'Create Vacancy',
    subtitle: 'Standardized vacancy template; will publish to homes.com.eg/careers',
    size: 'lg',
    submitLabel: existing ? 'Save changes' : 'Create as Draft',
    body: (
      <>
        <FieldRow>
          <Field label="Job Title" name="title" required defaultValue={existing?.title} />
          <Field label="Department" name="department" type="select" required options={state.departments.map(d=>d.name)} defaultValue={existing?.department} />
        </FieldRow>
        <FieldRow>
          <Field label="Location" name="location" type="select" required options={state.branches.map(b=>b.name)} defaultValue={existing?.location} />
          <Field label="Type" name="type" type="select" options={['Full-time','Part-time','Contract','Internship']} defaultValue={existing?.type || 'Full-time'} />
        </FieldRow>
        <FieldRow>
          <Field label="Mode" name="mode" type="select" options={['On-site','Hybrid','Remote']} defaultValue={existing?.mode || 'On-site'} />
          <Field label="Headcount" name="headcount" type="number" required defaultValue={existing?.headcount || 1} />
        </FieldRow>
        <Field label="Hiring Manager" name="hiringManager" type="select" required options={managers} defaultValue={existing?.hiringManager} />
      </>
    ),
    onSubmit: (data) => {
      const patch = { ...data, headcount: Number(data.headcount), applicants: existing?.applicants || 0, status: existing?.status || 'Draft' };
      if (existing) { updateItem('jobs', existing.id, patch, { action: 'Vacancy Updated', module: 'Recruitment', target: existing.id }); toast('Vacancy updated'); }
      else { const c = addItem('jobs', { ...patch, created: today() }, 'JOB', { action: 'Vacancy Created', module: 'Recruitment', detail: `${data.title} (Draft)` }); toast(`Vacancy ${c.id} created (Draft)`); }
    },
  });

  const publish = (j) => openConfirm({
    title: `Publish vacancy?`,
    message: `${j.title} (${j.id}) will be published to homes.com.eg/careers and become visible to candidates.`,
    onConfirm: () => { updateItem('jobs', j.id, { status: 'Published' }, { action: 'Vacancy Published', module: 'Recruitment', target: j.id, detail: 'Published to careers page' }); toast(`${j.title} published`); },
  });
  const close = (j) => openConfirm({
    title: `Close vacancy?`, message: `${j.title} will be archived. Existing applications remain visible.`, danger: true,
    onConfirm: () => { updateItem('jobs', j.id, { status: 'Closed' }, { action: 'Vacancy Closed', module: 'Recruitment', target: j.id }); toast(`${j.title} closed`,'warning'); },
  });
  const view = (j) => openDrawer({
    title: j.title, subtitle: `${j.id} · ${j.department} · ${j.location}`,
    content: (
      <>
        <div className="detail-grid">
          {[['ID',j.id],['Department',j.department],['Location',j.location],['Type',j.type],['Mode',j.mode],['Headcount',j.headcount],['Applicants',j.applicants],['Hiring Manager',j.hiringManager],['Status',j.status],['Created',j.created]].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>
          ))}
        </div>
        <div style={{marginTop:18,display:'flex',gap:8,flexWrap:'wrap'}}>
          <button className="btn btn-primary" onClick={()=>openForm(j)}><Pencil size={14}/> Edit</button>
          {j.status==='Draft' && <button className="btn btn-success" onClick={()=>publish(j)}><Globe size={14}/> Publish</button>}
          {j.status==='Published' && <button className="btn btn-danger" onClick={()=>close(j)}><Archive size={14}/> Close</button>}
        </div>
      </>
    ),
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Job Vacancies</span></div>
        <h1 className="page-title">Job Vacancies</h1>
        <p className="page-subtitle">Standardized vacancy template and careers publish</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search jobs..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>{JOB_STATUS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="data-select" value={filterVals.department} onChange={e=>setFilter('department', e.target.value)}>
              <option value="">All Departments</option>{[...new Set(state.jobs.map(j=>j.department))].map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`jobs_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Jobs CSV','Recruitment');}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={()=>openForm(null)}><Plus size={14}/> Create Vacancy</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Mode</th><th>Headcount</th><th>Applicants</th><th>Hiring Manager</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(j=>(
              <tr key={j.id}>
                <td className="muted">{j.id}</td>
                <td className="bold">{j.title}</td>
                <td>{j.department}</td>
                <td>{j.location}</td>
                <td>{j.type}</td>
                <td>{j.mode}</td>
                <td className="bold">{j.headcount}</td>
                <td className="bold">{j.applicants}</td>
                <td>{j.hiringManager}</td>
                <td><span className={`badge ${statusColor(j.status)}`}>{j.status}</span></td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(j)}><Eye size={13}/> View</button>
                  <button className="btn btn-outline btn-sm" onClick={()=>openForm(j)}><Pencil size={13}/></button>
                  {j.status==='Draft' && <button className="btn btn-primary btn-sm" onClick={()=>publish(j)}>Publish</button>}
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
