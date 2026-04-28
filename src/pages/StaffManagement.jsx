import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Eye, UserCog, Clock3, Plus, Download, Pause, Play, UserMinus } from 'lucide-react';

export const StaffManagement = () => {
  const { state, addItem, updateItem, removeItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const [tab, setTab] = useState('all');

  const dataset = tab === 'all' ? state.staff : state.staff.filter(s => {
    if (tab === 'employees') return s.type === 'Employee';
    if (tab === 'tl') return s.type === 'Team Leader';
    if (tab === 'sm') return s.type === 'Sales Manager';
    return true;
  });

  const { q, setQ, filterVals, setFilter, filtered } = useTableState(dataset, {
    searchKeys: ['name', 'id', 'email', 'title', 'department'],
    filters: { status: 'status' },
  });

  const today = () => new Date().toISOString().split('T')[0];
  const counts = { all: state.staff.length, employees: state.staff.filter(s=>s.type==='Employee').length, tl: state.staff.filter(s=>s.type==='Team Leader').length, sm: state.staff.filter(s=>s.type==='Sales Manager').length };

  const openForm = (existing) => openModal({
    title: existing ? `Edit Staff — ${existing.name}` : 'Add Staff', size: 'lg',
    submitLabel: existing ? 'Save changes' : 'Create staff',
    body: (
      <>
        <FieldRow>
          <Field label="Full Name" name="name" required defaultValue={existing?.name} />
          <Field label="Email" name="email" type="email" required defaultValue={existing?.email} />
        </FieldRow>
        <FieldRow>
          <Field label="Phone" name="phone" defaultValue={existing?.phone} />
          <Field label="Type" name="type" type="select" required options={['Employee','Team Leader','Sales Manager']} defaultValue={existing?.type || 'Employee'} />
        </FieldRow>
        <FieldRow>
          <Field label="Department" name="department" type="select" required options={state.departments.map(d=>d.name)} defaultValue={existing?.department} />
          <Field label="Title" name="title" required defaultValue={existing?.title} />
        </FieldRow>
        <FieldRow>
          <Field label="Branch" name="branch" type="select" required options={state.branches.map(b=>b.name)} defaultValue={existing?.branch} />
          <Field label="Manager" name="manager" defaultValue={existing?.manager} />
        </FieldRow>
        <Field label="Status" name="status" type="select" options={['Active','Pending','Suspended']} defaultValue={existing?.status || 'Active'} />
      </>
    ),
    onSubmit: (data) => {
      if (existing) { updateItem('staff', existing.id, data, { action: 'Staff Updated', module: 'HR' }); toast('Staff updated'); }
      else { const c = addItem('staff', { ...data, joinDate: today() }, 'A', { action: 'Staff Created', module: 'HR', detail: data.name }); toast(`Created ${c.id}`); }
    },
  });

  const toggleStatus = (s) => {
    const next = s.status === 'Active' ? 'Suspended' : 'Active';
    openConfirm({
      title: `${next === 'Active' ? 'Reactivate' : 'Suspend'} ${s.name}?`,
      message: `${s.name} (${s.id}) will be ${next.toLowerCase()}. ${next === 'Suspended' ? 'Access will be blocked across federated systems.' : ''}`,
      danger: next === 'Suspended',
      onConfirm: () => { updateItem('staff', s.id, { status: next }, { action: `Staff ${next}`, module: 'HR', target: s.id }); toast(`${s.name} ${next.toLowerCase()}`); },
    });
  };

  const remove = (s) => openConfirm({
    title: 'Delete staff record?', message: `Permanently remove ${s.name}.`, danger: true, confirmLabel: 'Delete',
    onConfirm: () => { removeItem('staff', s.id, { action: 'Staff Deleted', module: 'HR' }); toast('Staff removed', 'warning'); },
  });

  const view = (s) => openDrawer({
    title: s.name, subtitle: `${s.id} · ${s.title} · ${s.department}`,
    content: (
      <>
        <div className="detail-grid">
          {[['ID',s.id],['Email',s.email],['Phone',s.phone],['Department',s.department],['Title',s.title],['Type',s.type],['Branch',s.branch],['Manager',s.manager],['Join Date',s.joinDate],['Status',s.status]].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>
          ))}
        </div>
        <div style={{marginTop:18,display:'flex',gap:8,flexWrap:'wrap'}}>
          <button className="btn btn-primary" onClick={()=>openForm(s)}>Edit</button>
          <button className="btn btn-outline" onClick={()=>toggleStatus(s)}>{s.status==='Active' ? <><Pause size={14}/> Suspend</> : <><Play size={14}/> Reactivate</>}</button>
        </div>
      </>
    ),
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Staff Management</span></div>
        <h1 className="page-title">Staff Management</h1>
        <p className="page-subtitle">Manage internal portal users — employees, team leaders, and managers</p>
      </div>
      <div className="tabs">
        {[['all','All Staff'],['employees','Employees'],['tl','Team Leaders'],['sm','Sales Managers']].map(([k,l])=>(
          <button key={k} className={`tab ${tab===k?'active':''}`} onClick={()=>setTab(k)}>{l} ({counts[k]})</button>
        ))}
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search by name, email or ID..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option><option>Active</option><option>Pending</option><option>Suspended</option>
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`staff_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Staff CSV','HR',`${filtered.length} rows`);}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={()=>openForm(null)}><Plus size={14}/> Add Staff</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Title</th><th>Branch</th><th>Manager</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id}>
                  <td className="muted">{s.id}</td>
                  <td className="bold">{s.name}</td>
                  <td>{s.department}</td>
                  <td>{s.title}</td>
                  <td>{s.branch}</td>
                  <td>{s.manager}</td>
                  <td><span className={`badge ${s.status==='Active'?'badge-success':s.status==='Suspended'?'badge-danger':'badge-warning'}`}>{s.status}</span></td>
                  <td><div className="action-icons" style={{justifyContent:'flex-end'}}>
                    <span className="action-icon" title="View" onClick={()=>view(s)}><Eye size={16}/></span>
                    <span className="action-icon" title="Edit" onClick={()=>openForm(s)}><UserCog size={16}/></span>
                    <span className="action-icon" title={s.status==='Active'?'Suspend':'Reactivate'} onClick={()=>toggleStatus(s)}><Clock3 size={16}/></span>
                    <span className="action-icon" title="Delete" onClick={()=>remove(s)}><UserMinus size={16}/></span>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <Empty />}
        </div>
      </div>
    </div>
  );
};
