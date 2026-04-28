import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Eye, Pencil, Trash2, Plus, Download, KeyRound } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

// Permissions catalog (BRD §6.1) — grouped by module.
const PERMISSION_CATALOG = {
  'CRM (federated)': ['View Leads','Create Leads','Assign Leads','Reassign Leads','Approve Override','View Deals','Edit Deals','Approve Commission'],
  'Marketplace (federated)': ['Publish Project','Edit Inventory','Manage Source Mapping','View Marketplace Dashboard'],
  'Backoffice': ['Manage Departments','Manage Branches','Manage Roles','Approve Onboarding','Review Documents','View Audit Logs'],
  'HR / Recruitment': ['Publish Vacancy','Manage Candidates','Schedule Interviews','Score Candidates','Process Onboarding','View Payroll'],
  'Finance': ['Manage Commission Policy','Approve Commission','Process Agent Dues','View Financial Reports'],
  'System': ['Manage SSO','Manage Integrations','Manage Settings','Configure Audit Retention'],
};

export const RolesPermissions = () => {
  const { state, addItem, updateItem, removeItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const { q, setQ, filtered } = useTableState(state.roles, { searchKeys: ['name','department','desc','id'] });

  const openForm = (existing) => openModal({
    title: existing ? `Edit Role — ${existing.name}` : 'Create Role',
    subtitle: 'BRD §6.3 — roles are permission templates assigned to users in a department/team',
    size: 'lg', submitLabel: existing ? 'Save changes' : 'Create role',
    body: (
      <>
        <FieldRow>
          <Field label="Role Name" name="name" required defaultValue={existing?.name} />
          <Field label="Department" name="department" type="select" required options={state.departments.map(d=>d.name)} defaultValue={existing?.department} />
        </FieldRow>
        <Field label="Description" name="desc" type="textarea" defaultValue={existing?.desc} />
        <Field label="Permissions Catalog (preview)">
          <div style={{maxHeight:240,overflowY:'auto',padding:12,border:'1px solid var(--border)',borderRadius:8,background:'#fafbfc'}}>
            {Object.entries(PERMISSION_CATALOG).map(([group, perms]) => (
              <div key={group} style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:800,color:'#E8672A',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{group}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                  {perms.map(p => (
                    <label key={p} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,padding:'4px 6px',border:'1px solid var(--border)',borderRadius:4,background:'#fff'}}>
                      <input type="checkbox" name="permissions" value={`${group}::${p}`} /> {p}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Field>
        <Field label="Status" name="status" type="select" options={['Active','Inactive']} defaultValue={existing?.status || 'Active'} />
      </>
    ),
    onSubmit: (data) => {
      const permsCount = Object.values(PERMISSION_CATALOG).flat().length; // simplified; demo
      const patch = { name: data.name, department: data.department, desc: data.desc, status: data.status, permissions: existing?.permissions ?? Math.min(permsCount, 12), users: existing?.users ?? 0 };
      if (existing) { updateItem('roles', existing.id, patch, { action: 'Role Updated', module: 'System', target: existing.id }); toast('Role updated'); }
      else { const c = addItem('roles', patch, 'ROLE', { action: 'Role Created', module: 'System', detail: data.name }); toast(`Role created · ${c.id}`); }
    },
  });

  const view = (r) => openDrawer({
    title: r.name, subtitle: `${r.id} · ${r.department}`,
    content: (
      <>
        <div className="detail-grid">
          {[['ID',r.id],['Name',r.name],['Department',r.department],['Permissions',r.permissions],['Users',r.users],['Status',r.status]].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>
          ))}
        </div>
        <div style={{marginTop:14,padding:14,background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8}}>
          <div style={{fontSize:12,fontWeight:700,marginBottom:8,color:'var(--text-secondary)'}}>Description</div>
          <div style={{fontSize:13}}>{r.desc}</div>
        </div>
        <div style={{marginTop:18,display:'flex',gap:8}}>
          <button className="btn btn-primary" onClick={()=>openForm(r)}><Pencil size={14}/> Edit</button>
        </div>
      </>
    ),
  });

  const remove = (r) => openConfirm({
    title: `Delete role?`, message: `Permanently remove ${r.name}. ${r.users>0?`${r.users} user(s) currently assigned will lose this role.`:''}`, danger:true, confirmLabel:'Delete',
    onConfirm: () => { removeItem('roles', r.id, { action: 'Role Deleted', module: 'System', detail: r.name }); toast('Role removed','warning'); },
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Roles & Permissions</span></div>
        <h1 className="page-title">Roles & Permissions</h1>
        <p className="page-subtitle">Custom role creation and permission catalog — BRD 6.3</p>
      </div>
      <div className="info-banner" style={{display:'flex',alignItems:'center',gap:10}}><KeyRound size={16}/>Roles control access across the Backoffice and federated systems (CRM, Marketplace, Marketplace Dashboard). All access is SSO-only via Microsoft Entra (BRD §11).</div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search roles..." value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`roles_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Roles CSV','System');}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={()=>openForm(null)}><Plus size={14}/> Create Role</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Role</th><th>Department</th><th>Permissions</th><th>Users</th><th>Description</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(r=>(
              <tr key={r.id}>
                <td className="muted">{r.id}</td>
                <td className="bold">{r.name}</td>
                <td>{r.department}</td>
                <td className="bold">{r.permissions}</td>
                <td>{r.users}</td>
                <td style={{maxWidth:220,fontSize:12,color:'var(--text-secondary)'}}>{r.desc}</td>
                <td><span className="badge badge-success">{r.status}</span></td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(r)}><Eye size={13}/></button>
                  <button className="btn btn-outline btn-sm" onClick={()=>openForm(r)}><Pencil size={13}/></button>
                  <button className="btn btn-danger btn-sm" onClick={()=>remove(r)}><Trash2 size={13}/></button>
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
