import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Plus, Download, Eye, Pencil, Trash2 } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

export const Departments = () => {
  const { state, addItem, updateItem, removeItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const { q, setQ, filtered } = useTableState(state.departments, { searchKeys: ['name','head','id'] });

  const openForm = (existing) => openModal({
    title: existing ? `Edit Department — ${existing.name}` : 'Add Department',
    submitLabel: existing ? 'Save changes' : 'Create department',
    body: (
      <>
        <FieldRow>
          <Field label="Name" name="name" required defaultValue={existing?.name} />
          <Field label="Department Head" name="head" required defaultValue={existing?.head} />
        </FieldRow>
        <FieldRow>
          <Field label="Teams" name="teams" type="number" defaultValue={existing?.teams||0} />
          <Field label="Employees" name="employees" type="number" defaultValue={existing?.employees||0} />
        </FieldRow>
        <Field label="Status" name="status" type="select" options={['Active','Inactive']} defaultValue={existing?.status||'Active'} />
      </>
    ),
    onSubmit: (data) => {
      const patch = { ...data, teams:Number(data.teams), employees:Number(data.employees) };
      if (existing) { updateItem('departments', existing.id, patch, { action: 'Department Updated', module: 'Backoffice', target: existing.id }); toast('Department updated'); }
      else { const c = addItem('departments', patch, 'DEP', { action: 'Department Created', module: 'Backoffice', detail: data.name }); toast(`Created ${c.id}`); }
    },
  });

  const view = (d) => openDrawer({ title: d.name, subtitle: d.id,
    content: (<div className="detail-grid">
      {[['ID',d.id],['Name',d.name],['Head',d.head],['Teams',d.teams],['Employees',d.employees],['Status',d.status]].map(([k,v])=>(
        <div key={k}><label>{k}</label><div className="v">{v}</div></div>))}
    </div>),
  });

  const remove = (d) => openConfirm({
    title: 'Delete department?', message: `Permanently remove ${d.name}.`, danger:true, confirmLabel:'Delete',
    onConfirm: () => { removeItem('departments', d.id, { action: 'Department Deleted', module: 'Backoffice' }); toast(`${d.name} removed`,'warning'); },
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Departments</span></div>
        <h1 className="page-title">Departments</h1>
        <p className="page-subtitle">Organizational containers — BRD 6.2</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search departments..." value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`departments_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Departments CSV','Backoffice');}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={()=>openForm(null)}><Plus size={14}/> Add Department</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Department</th><th>Head</th><th>Teams</th><th>Employees</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(d=>(
              <tr key={d.id}>
                <td className="muted">{d.id}</td>
                <td className="bold">{d.name}</td>
                <td>{d.head}</td>
                <td className="bold">{d.teams}</td>
                <td>{d.employees}</td>
                <td><span className="badge badge-success">{d.status}</span></td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(d)}><Eye size={13}/></button>
                  <button className="btn btn-outline btn-sm" onClick={()=>openForm(d)}><Pencil size={13}/></button>
                  <button className="btn btn-danger btn-sm" onClick={()=>remove(d)}><Trash2 size={13}/></button>
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
