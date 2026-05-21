// ═══════════════════════════════════════════════════════════════
// Staff Management — merged with Employee Profiles (May 2026)
// ───────────────────────────────────────────────────────────────
// One canonical employee list combining the old admin CRUD page with
// the richer profile drawer (photo header, contact, employment,
// attachments, compliance documents). The HR sidebar Employee Profiles
// link now redirects here.
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import {
  Eye, UserCog, Clock3, Plus, Download, Pause, Play, UserMinus,
  FileText, Phone, Mail, MapPin, Briefcase, Users, Calendar, ShieldCheck,
  Building, Award, User,
} from 'lucide-react';

export const StaffManagement = () => {
  const { state, addItem, updateItem, removeItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const [tab, setTab] = useState('all');

  const dataset = tab === 'all' ? state.staff : state.staff.filter(s => {
    if (tab === 'employees') return s.type === 'Employee';
    if (tab === 'tl') return s.type === 'Team Leader';
    if (tab === 'sm') return s.type === 'Sales Manager';
    if (tab === 'sd') return s.type === 'Sales Director';
    return true;
  });

  const { q, setQ, filterVals, setFilter, filtered } = useTableState(dataset, {
    searchKeys: ['name', 'id', 'email', 'title', 'department'],
    filters: { status: 'status', department: 'department' },
  });

  const today = () => new Date().toISOString().split('T')[0];
  const counts = {
    all:       state.staff.length,
    employees: state.staff.filter(s => s.type === 'Employee').length,
    tl:        state.staff.filter(s => s.type === 'Team Leader').length,
    sm:        state.staff.filter(s => s.type === 'Sales Manager').length,
    sd:        state.staff.filter(s => s.type === 'Sales Director').length,
  };

  const initials = (name) => name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();

  // ─── Create / Edit modal (admin) ──────────────────────────────
  const openForm = (existing) => openModal({
    title: existing ? `Edit Staff — ${existing.name}` : 'Add Staff',
    size: 'lg',
    submitLabel: existing ? 'Save changes' : 'Create staff',
    body: (
      <>
        <FieldRow>
          <Field label="Full Name" name="name" required defaultValue={existing?.name} />
          <Field label="Email" name="email" type="email" required defaultValue={existing?.email} />
        </FieldRow>
        <FieldRow>
          <Field label="Phone" name="phone" defaultValue={existing?.phone} />
          <Field label="Type" name="type" type="select" required options={['Employee','Team Leader','Sales Manager','Sales Director']} defaultValue={existing?.type || 'Employee'} />
        </FieldRow>
        <FieldRow>
          <Field label="Department" name="department" type="select" required options={state.departments.map(d => d.name)} defaultValue={existing?.department} />
          <Field label="Title" name="title" required defaultValue={existing?.title} />
        </FieldRow>
        <FieldRow>
          <Field label="Branch" name="branch" type="select" required options={state.branches.map(b => b.name)} defaultValue={existing?.branch} />
          <Field label="Manager" name="manager" defaultValue={existing?.manager} />
        </FieldRow>
        <Field label="Status" name="status" type="select" options={['Active','Pending','Suspended']} defaultValue={existing?.status || 'Active'} />
      </>
    ),
    onSubmit: (data) => {
      if (existing) {
        updateItem('staff', existing.id, data, { action: 'Staff Updated', module: 'HR', target: existing.id });
        toast('Staff updated');
      } else {
        const c = addItem('staff', { ...data, joinDate: today() }, 'A', { action: 'Staff Created', module: 'HR', detail: data.name });
        toast(`Created ${c.id}`);
      }
    },
  });

  // ─── Lifecycle actions ────────────────────────────────────────
  const toggleStatus = (s) => {
    const next = s.status === 'Active' ? 'Suspended' : 'Active';
    openConfirm({
      title: `${next === 'Active' ? 'Reactivate' : 'Suspend'} ${s.name}?`,
      message: `${s.name} (${s.id}) will be ${next.toLowerCase()}. ${next === 'Suspended' ? 'Access will be blocked across federated systems.' : ''}`,
      danger: next === 'Suspended',
      onConfirm: () => {
        updateItem('staff', s.id, { status: next }, { action: `Staff ${next}`, module: 'HR', target: s.id });
        toast(`${s.name} ${next.toLowerCase()}`);
      },
    });
  };

  const remove = (s) => openConfirm({
    title: 'Delete staff record?',
    message: `Permanently remove ${s.name}. This is irreversible — system credentials, lead assignments, and audit cross-references are NOT automatically reassigned.`,
    danger: true, confirmLabel: 'Delete',
    onConfirm: () => {
      removeItem('staff', s.id, { action: 'Staff Deleted', module: 'HR', target: s.id });
      toast(`${s.name} removed`, 'warning');
    },
  });

  // ─── Rich profile drawer (from former Employee Profiles) ─────
  const view = (s) => openDrawer({
    title: s.name,
    subtitle: `${s.id} · ${s.title}`,
    content: (
      <div>
        {/* Photo header */}
        <div style={{display:'flex', alignItems:'center', gap:14, padding:'16px', borderRadius:12, background:'linear-gradient(135deg, var(--brand-tint), #fff)', marginBottom:16, border:'1px solid var(--border)'}}>
          {s.photoDataUrl ? (
            <img src={s.photoDataUrl} alt="" style={{width:72, height:72, borderRadius:'50%', objectFit:'cover', border:'3px solid #fff', boxShadow:'0 4px 12px rgba(0,0,0,.12)', flexShrink:0}}/>
          ) : (
            <div style={{width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:24, flexShrink:0}}>
              {initials(s.name)}
            </div>
          )}
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:18, fontWeight:800, color:'var(--text-primary)'}}>{s.name}</div>
            <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:4, display:'flex', alignItems:'center', gap:6, flexWrap:'wrap'}}>
              <Briefcase size={12}/> {s.title} · {s.department}
            </div>
            <div style={{display:'flex', gap:6, marginTop:8, flexWrap:'wrap'}}>
              <span className={`badge ${s.status === 'Active' ? 'badge-success' : s.status === 'Suspended' ? 'badge-danger' : 'badge-warning'}`}>{s.status}</span>
              <span style={{fontSize:10, fontWeight:700, color:'var(--brand)', background:'#fff', padding:'2px 8px', borderRadius:999, border:'1px solid var(--brand)'}}>{s.type}</span>
            </div>
          </div>
        </div>

        {/* Section: Contact */}
        <Section title="Contact" icon={<Phone size={13}/>}>
          <Row icon={<Mail size={12}/>}  label="Email" value={s.email || '—'}/>
          <Row icon={<Phone size={12}/>} label="Phone" value={s.phone || '—'}/>
        </Section>

        {/* Section: Role */}
        <Section title="Role & assignment" icon={<Briefcase size={13}/>}>
          <Row icon={<Building size={12}/>}  label="Department" value={s.department}/>
          <Row icon={<MapPin size={12}/>}    label="Branch"     value={s.branch}/>
          <Row icon={<Users size={12}/>}     label="Manager"    value={s.manager}/>
          <Row icon={<Award size={12}/>}     label="Type"       value={s.type}/>
        </Section>

        {/* Section: Employment */}
        <Section title="Employment" icon={<ShieldCheck size={13}/>}>
          <Row icon={<Calendar size={12}/>}    label="Join date"     value={s.joinDate}/>
          <Row icon={<FileText size={12}/>}    label="Contract"      value={s.contractType || '—'}/>
          <Row icon={<User size={12}/>}        label="National ID"   value={s.nationalId || '—'}/>
          <Row icon={<MapPin size={12}/>}      label="Nationality"   value={s.nationalityCountry || '—'}/>
          <Row icon={<Users size={12}/>}       label="Hiring source" value={s.source || '—'}/>
        </Section>

        {/* Attachments */}
        <div style={{marginTop:18}}>
          <div style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>Attachments</div>
          {s.resumeName ? (
            <a
              href={s.resumeDataUrl || '#'}
              download={s.resumeName}
              onClick={(e) => { if (!s.resumeDataUrl) { e.preventDefault(); toast('CV not available — older record', 'info'); } }}
              style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:12.5, color:'var(--text-primary)', textDecoration:'none', background:'#fafbfc'}}>
              <FileText size={16} color="var(--brand)"/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{s.resumeName}</div>
                <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:1}}>Resume / CV · click to download</div>
              </div>
              <Download size={14} color="var(--text-tertiary)"/>
            </a>
          ) : (
            <div style={{padding:'10px 12px', border:'1px dashed var(--border)', borderRadius:8, fontSize:11, color:'var(--text-tertiary)', textAlign:'center'}}>
              No CV on file
            </div>
          )}
        </div>

        <EmployeeDocs employeeName={s.name} documents={state.documents}/>

        {/* Admin actions */}
        <div style={{marginTop:18, paddingTop:14, borderTop:'1px solid var(--border)', display:'flex', gap:8, flexWrap:'wrap'}}>
          <button className="btn btn-primary" onClick={() => openForm(s)}><UserCog size={14}/> Edit</button>
          <button className="btn btn-outline" onClick={() => toggleStatus(s)}>
            {s.status === 'Active' ? <><Pause size={14}/> Suspend</> : <><Play size={14}/> Reactivate</>}
          </button>
          <button className="btn btn-danger" onClick={() => remove(s)}><UserMinus size={14}/> Delete</button>
        </div>
      </div>
    ),
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <p className="page-subtitle">All staff records · photo · CV · compliance documents · admin actions (suspend / reactivate / delete)</p>
      </div>

      <div className="tabs">
        {[
          ['all',       'All Staff',       counts.all],
          ['employees', 'Employees',       counts.employees],
          ['tl',        'Team Leaders',    counts.tl],
          ['sm',        'Sales Managers',  counts.sm],
          ['sd',        'Sales Director',  counts.sd],
        ].map(([k, l, n]) => (
          <button key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l} ({n})</button>
        ))}
      </div>

      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search by name, email, ID, title…" value={q} onChange={e => setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e => setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>
              <option>Active</option><option>Pending</option><option>Suspended</option>
            </select>
            <select className="data-select" value={filterVals.department} onChange={e => setFilter('department', e.target.value)}>
              <option value="">All departments</option>
              {[...new Set(state.staff.map(s => s.department))].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button className="btn btn-outline" onClick={() => { exportCSV(`staff_${today()}`, filtered); toast(`Exported ${filtered.length}`); writeAudit('Export', 'Staff CSV', 'HR', `${filtered.length} rows`); }}>
              <Download size={14}/> Export
            </button>
            <button className="btn btn-primary" onClick={() => openForm(null)}><Plus size={14}/> Add Staff</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Employee</th><th>Department</th><th>Title</th><th>Branch</th><th>Manager</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="muted">{s.id}</td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      {s.photoDataUrl ? (
                        <img src={s.photoDataUrl} alt="" style={{width:34, height:34, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'1px solid var(--border)'}}/>
                      ) : (
                        <div style={{width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0}}>
                          {initials(s.name)}
                        </div>
                      )}
                      <div style={{minWidth:0}}>
                        <div className="bold">{s.name}</div>
                        <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:2, display:'flex', alignItems:'center', gap:8}}>
                          {s.email && <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:160}}>{s.email}</span>}
                          {s.resumeName && (
                            <span style={{display:'inline-flex', alignItems:'center', gap:3, color:'var(--brand)', fontWeight:600}}>
                              <FileText size={10}/> CV
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{s.department}</td>
                  <td>{s.title}</td>
                  <td>{s.branch}</td>
                  <td>{s.manager}</td>
                  <td><span className={`badge ${s.status === 'Active' ? 'badge-success' : s.status === 'Suspended' ? 'badge-danger' : 'badge-warning'}`}>{s.status}</span></td>
                  <td><div className="action-icons" style={{justifyContent:'flex-end'}}>
                    <span className="action-icon" title="View profile" onClick={() => view(s)}><Eye size={16}/></span>
                    <span className="action-icon" title="Edit" onClick={() => openForm(s)}><UserCog size={16}/></span>
                    <span className="action-icon" title={s.status === 'Active' ? 'Suspend' : 'Reactivate'} onClick={() => toggleStatus(s)}><Clock3 size={16}/></span>
                    <span className="action-icon" title="Delete" onClick={() => remove(s)}><UserMinus size={16}/></span>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <Empty />}
        </div>
      </div>
    </div>
  );
};

// ─── Drawer helpers (lifted from former EmployeeProfiles) ─────
const Section = ({ title, icon, children }) => (
  <div style={{marginBottom:14}}>
    <div style={{display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>
      {icon} {title}
    </div>
    <div style={{display:'flex', flexDirection:'column', gap:6, padding:'10px 12px', background:'#fafbfc', borderRadius:8, border:'1px solid var(--border)'}}>
      {children}
    </div>
  </div>
);

const Row = ({ icon, label, value }) => (
  <div style={{display:'flex', alignItems:'center', gap:8, fontSize:12.5}}>
    {icon && <span style={{color:'var(--text-tertiary)', flexShrink:0}}>{icon}</span>}
    <span style={{color:'var(--text-tertiary)', minWidth:110}}>{label}</span>
    <span style={{fontWeight:600, color:'var(--text-primary)'}}>{value}</span>
  </div>
);

const EmployeeDocs = ({ employeeName, documents }) => {
  const docs = (documents || []).filter(d => d.agent === employeeName);
  if (!docs.length) return null;
  return (
    <div style={{marginTop:14}}>
      <div style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>Compliance documents</div>
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        {docs.map(d => (
          <div key={d.id} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:8, border:'1px solid var(--border)', fontSize:12, background:'#fff'}}>
            <FileText size={14} color={d.status === 'Approved' ? '#10b981' : d.status === 'Missing' ? '#dc2626' : '#f59e0b'}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{d.doc}</div>
              <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:1}}>
                {d.type} · {d.date}{d.expires ? ` · expires ${d.expires}` : ''}
              </div>
            </div>
            <span className={`badge ${d.status === 'Approved' ? 'badge-success' : d.status === 'Missing' ? 'badge-danger' : 'badge-warning'}`} style={{fontSize:9}}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
