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

  // Helpers to round-trip array fields through the textarea (one item per
  // line). Empty lines are stripped. Strings are kept as-is.
  const listToText = (arr) => Array.isArray(arr) ? arr.join('\n') : '';
  const textToList = (txt) => (txt || '').split('\n').map(s => s.trim()).filter(Boolean);

  const openForm = (existing) => openModal({
    title: existing ? `Edit Vacancy — ${existing.title}` : 'Create Vacancy',
    subtitle: 'Same template that renders on homes.com.eg/careers · all sections populate the public job card',
    size: 'lg',
    submitLabel: existing ? 'Save changes' : 'Create as Draft',
    body: (
      <>
        {/* Headline */}
        <div style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6}}>Role headline</div>
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
        <FieldRow>
          <Field label="Hiring Manager" name="hiringManager" type="select" required options={managers} defaultValue={existing?.hiringManager} />
          <Field label="Experience (years)" name="experienceYears" placeholder="e.g. 3-6" defaultValue={existing?.experienceYears} />
        </FieldRow>
        <FieldRow>
          <Field label="Application Deadline" name="deadline" type="date" defaultValue={existing?.deadline} />
          <Field label="Status" name="status" type="select" options={JOB_STATUS} defaultValue={existing?.status || 'Draft'} />
        </FieldRow>

        {/* Marketing copy */}
        <div style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginTop:18, marginBottom:6}}>Public-facing description</div>
        <Field label="Summary" name="summary" type="textarea" rows={3} placeholder="2-3 sentence pitch — what the role is about and why it's exciting." defaultValue={existing?.summary} />
        <Field label="Responsibilities (one per line)" name="responsibilities" type="textarea" rows={5} placeholder="Manage a personal pipeline of 30-50 active leads on the Homes CRM&#10;Qualify inbound leads within SLA&#10;…" defaultValue={listToText(existing?.responsibilities)} />
        <Field label="Requirements (one per line)" name="requirements" type="textarea" rows={5} placeholder="Bachelor's degree (any field)&#10;3-6 years real estate sales experience in Egypt&#10;Active RERA license or willing to obtain within 30 days&#10;…" defaultValue={listToText(existing?.requirements)} />
        <Field label="Benefits (one per line)" name="benefits" type="textarea" rows={4} placeholder="Competitive base salary + uncapped commission&#10;Health insurance for employee + family&#10;…" defaultValue={listToText(existing?.benefits)} />

        {/* Salary band — HR-internal, governs offer creation */}
        <div style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginTop:18, marginBottom:6}}>Salary band (HR-internal · governs offers)</div>
        <FieldRow>
          <Field label="Min (EGP / month)" name="salaryMin" type="number" placeholder="e.g. 18000" defaultValue={existing?.salaryBand?.min} />
          <Field label="Max (EGP / month)" name="salaryMax" type="number" placeholder="e.g. 28000" defaultValue={existing?.salaryBand?.max} />
        </FieldRow>
        <Field label="Commission structure (free text)" name="salaryCommission" type="textarea" rows={2} placeholder="e.g. Uncapped — 0.5-1.2% of deal value · Homes Advance at 5% collection trigger" defaultValue={existing?.salaryBand?.commission} />
      </>
    ),
    onSubmit: (data) => {
      const min = data.salaryMin ? Number(data.salaryMin) : null;
      const max = data.salaryMax ? Number(data.salaryMax) : null;
      const salaryBand = (min || max || data.salaryCommission)
        ? { min, max, currency: 'EGP', period: 'monthly', commission: data.salaryCommission || null }
        : null;
      const patch = {
        title: data.title, department: data.department, location: data.location,
        type: data.type, mode: data.mode,
        headcount: Number(data.headcount),
        hiringManager: data.hiringManager,
        experienceYears: data.experienceYears || null,
        deadline: data.deadline || null,
        summary: data.summary || '',
        responsibilities: textToList(data.responsibilities),
        requirements:    textToList(data.requirements),
        benefits:        textToList(data.benefits),
        salaryBand,
        applicants: existing?.applicants || 0,
        status: data.status || existing?.status || 'Draft',
      };
      if (existing) {
        updateItem('jobs', existing.id, patch, { action: 'Vacancy Updated', module: 'Recruitment', target: existing.id });
        toast('Vacancy updated');
      } else {
        const c = addItem('jobs', { ...patch, created: today() }, 'JOB', { action: 'Vacancy Created', module: 'Recruitment', detail: `${data.title} (${patch.status})` });
        toast(`Vacancy ${c.id} created (${patch.status})`);
      }
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
    title: j.title,
    subtitle: `${j.id} · ${j.department} · ${j.location}`,
    content: (
      <>
        {/* Headline + key facts (same as the public Careers card top) */}
        <div className="detail-grid">
          {[
            ['ID',              j.id],
            ['Department',      j.department],
            ['Location',        j.location],
            ['Type',            j.type],
            ['Mode',            j.mode],
            ['Headcount',       j.headcount],
            ['Applicants',      j.applicants],
            ['Hiring Manager',  j.hiringManager],
            ['Experience',      j.experienceYears || '—'],
            ['Deadline',        j.deadline || '—'],
            ['Status',          j.status],
            ['Created',         j.created],
          ].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>
          ))}
        </div>

        {/* Marketing copy — matches the public Career detail layout */}
        {j.summary && (
          <div style={{marginTop:18}}>
            <h4 style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6}}>Summary</h4>
            <p style={{fontSize:13, color:'var(--text-primary)', lineHeight:1.6, padding:'10px 12px', background:'#fafbfc', borderRadius:8, border:'1px solid var(--border)'}}>{j.summary}</p>
          </div>
        )}

        {Array.isArray(j.responsibilities) && j.responsibilities.length > 0 && (
          <ListBlock title="Responsibilities" items={j.responsibilities}/>
        )}
        {Array.isArray(j.requirements) && j.requirements.length > 0 && (
          <ListBlock title="Requirements" items={j.requirements}/>
        )}
        {Array.isArray(j.benefits) && j.benefits.length > 0 && (
          <ListBlock title="What we offer" items={j.benefits}/>
        )}

        {/* Salary band — HR-internal */}
        {j.salaryBand && (j.salaryBand.min || j.salaryBand.max || j.salaryBand.commission) && (
          <div style={{marginTop:18, padding:'12px 14px', background:'var(--brand-tint)', border:'1px solid var(--border)', borderRadius:8}}>
            <h4 style={{fontSize:11, fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>Salary band · HR-internal</h4>
            {(j.salaryBand.min || j.salaryBand.max) && (
              <div style={{fontSize:13, fontWeight:700, color:'var(--text-primary)'}}>
                EGP {(j.salaryBand.min || 0).toLocaleString()}{' – '}{(j.salaryBand.max || 0).toLocaleString()} <span style={{fontSize:11, fontWeight:500, color:'var(--text-tertiary)'}}>/ month</span>
              </div>
            )}
            {j.salaryBand.commission && (
              <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:6}}>{j.salaryBand.commission}</div>
            )}
          </div>
        )}

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

// Reusable list block — used by the drawer to render Responsibilities,
// Requirements, and Benefits in the same style as the public Career card.
const ListBlock = ({ title, items }) => (
  <div style={{marginTop:18}}>
    <h4 style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>{title}</h4>
    <ul style={{margin:0, paddingLeft:0, listStyle:'none', display:'flex', flexDirection:'column', gap:6}}>
      {items.map((it, i) => (
        <li key={i} style={{display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'var(--text-primary)', lineHeight:1.55}}>
          <span style={{flexShrink:0, marginTop:6, width:5, height:5, borderRadius:'50%', background:'var(--brand)'}}/>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  </div>
);
