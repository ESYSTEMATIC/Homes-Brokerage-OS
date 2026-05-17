import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Plus, Download, Eye, Pencil, Trash2, Table as TableIcon, Network, ChevronDown, ChevronRight, GripVertical, Users } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

export const Departments = () => {
  const { state, addItem, updateItem, removeItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const { q, setQ, filtered } = useTableState(state.departments, { searchKeys: ['name','head','id'] });
  const [view, setView] = useState('table'); // 'table' | 'chart'

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
          <Field label="Parent" name="parentId" type="select" options={['(none — root)', ...state.departments.filter(d => d.id !== existing?.id).map(d => `${d.id} · ${d.name}`)]} defaultValue={existing?.parentId ? `${existing.parentId} · ${state.departments.find(x => x.id === existing.parentId)?.name}` : '(none — root)'} />
          <Field label="Status" name="status" type="select" options={['Active','Inactive']} defaultValue={existing?.status||'Active'} />
        </FieldRow>
        <FieldRow>
          <Field label="Teams" name="teams" type="number" defaultValue={existing?.teams||0} />
          <Field label="Employees" name="employees" type="number" defaultValue={existing?.employees||0} />
        </FieldRow>
      </>
    ),
    onSubmit: (data) => {
      const parentId = data.parentId === '(none — root)' ? null : data.parentId.split(' · ')[0];
      const patch = { ...data, teams:Number(data.teams), employees:Number(data.employees), parentId };
      if (existing) { updateItem('departments', existing.id, patch, { action: 'Department Updated', module: 'Backoffice', target: existing.id }); toast('Department updated'); }
      else { const c = addItem('departments', patch, 'DEP', { action: 'Department Created', module: 'Backoffice', detail: data.name }); toast(`Created ${c.id}`); }
    },
  });

  const drawerView = (d) => openDrawer({ title: d.name, subtitle: d.id,
    content: (<div className="detail-grid">
      {[['ID',d.id],['Name',d.name],['Head',d.head],['Parent', d.parentId ? state.departments.find(x => x.id === d.parentId)?.name : '— (root)'],['Teams',d.teams],['Employees',d.employees],['Status',d.status]].map(([k,v])=>(
        <div key={k}><label>{k}</label><div className="v">{v||'—'}</div></div>))}
    </div>),
  });

  const remove = (d) => {
    const hasChildren = state.departments.some(x => x.parentId === d.id);
    if (hasChildren) {
      toast('Cannot delete — reparent or remove children first', 'warning');
      return;
    }
    openConfirm({
      title: 'Delete department?', message: `Permanently remove ${d.name}.`, danger:true, confirmLabel:'Delete',
      onConfirm: () => { removeItem('departments', d.id, { action: 'Department Deleted', module: 'Backoffice' }); toast(`${d.name} removed`,'warning'); },
    });
  };

  // ─────────────────────────────────────────────────────────────
  // Drag-drop reparenting handler.
  // Validates: no self-drop, no cyclic-drop (can't drop on a descendant).
  // ─────────────────────────────────────────────────────────────
  const isDescendant = (candidateAncestorId, candidateDescendantId) => {
    let n = state.departments.find(d => d.id === candidateDescendantId);
    while (n && n.parentId) {
      if (n.parentId === candidateAncestorId) return true;
      n = state.departments.find(d => d.id === n.parentId);
    }
    return false;
  };
  const reparent = (childId, newParentId) => {
    if (childId === newParentId) return;
    if (newParentId && isDescendant(childId, newParentId)) {
      toast('Invalid drop — would create a cycle', 'warning');
      return;
    }
    const child  = state.departments.find(d => d.id === childId);
    const parent = newParentId ? state.departments.find(d => d.id === newParentId) : null;
    updateItem('departments', childId, { parentId: newParentId }, {
      action: 'Department Reparented', module: 'Backoffice',
      target: childId,
      detail: parent ? `${child?.name} → ${parent.name}` : `${child?.name} → (root)`,
    });
    toast(`${child?.name} moved to ${parent ? parent.name : 'root'}`);
  };

  return (
    <div>
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:14,flexWrap:'wrap'}}>
        <div>
          <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Departments</span></div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Organizational hierarchy · drag to reparent</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{display:'inline-flex', border:'1px solid var(--border)', borderRadius:8, overflow:'hidden'}}>
            <button
              onClick={() => setView('table')}
              style={{
                padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer',
                background: view==='table' ? 'var(--brand)' : '#fff',
                color: view==='table' ? '#fff' : 'var(--text-secondary)',
                border:'none', display:'inline-flex', alignItems:'center', gap:6,
              }}>
              <TableIcon size={13}/> Table
            </button>
            <button
              onClick={() => setView('chart')}
              style={{
                padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer',
                background: view==='chart' ? 'var(--brand)' : '#fff',
                color: view==='chart' ? '#fff' : 'var(--text-secondary)',
                border:'none', display:'inline-flex', alignItems:'center', gap:6,
              }}>
              <Network size={13}/> Org Chart
            </button>
          </div>
          <button className="btn btn-outline btn-sm" onClick={()=>{exportCSV(`departments_${today()}`,state.departments); toast(`Exported ${state.departments.length}`); writeAudit('Export','Departments CSV','Backoffice');}}><Download size={13}/> Export</button>
          <button className="btn btn-primary btn-sm" onClick={()=>openForm(null)}><Plus size={13}/> Add</button>
        </div>
      </div>

      {view === 'table' ? (
        <div className="data-panel">
          <div className="data-toolbar">
            <div className="data-toolbar-left">
              <input className="data-search" placeholder="Search departments..." value={q} onChange={e=>setQ(e.target.value)} />
            </div>
          </div>
          <div className="data-scroll">
            <table className="data-table">
              <thead><tr><th>ID</th><th>Department</th><th>Head</th><th>Parent</th><th>Teams</th><th>Employees</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
              <tbody>{filtered.map(d=>(
                <tr key={d.id}>
                  <td className="muted">{d.id}</td>
                  <td className="bold">{d.name}</td>
                  <td>{d.head}</td>
                  <td className="muted">{d.parentId ? state.departments.find(x => x.id === d.parentId)?.name : '—'}</td>
                  <td className="bold">{d.teams}</td>
                  <td>{d.employees}</td>
                  <td><span className="badge badge-success">{d.status}</span></td>
                  <td style={{textAlign:'right'}}><div className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={()=>drawerView(d)}><Eye size={13}/></button>
                    <button className="btn btn-outline btn-sm" onClick={()=>openForm(d)}><Pencil size={13}/></button>
                    <button className="btn btn-danger btn-sm" onClick={()=>remove(d)}><Trash2 size={13}/></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
            {filtered.length===0 && <Empty />}
          </div>
        </div>
      ) : (
        <OrgChartView
          departments={state.departments}
          onReparent={reparent}
          onEdit={openForm}
          onRemove={remove}
          onView={drawerView}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// OrgChartView — drag-and-drop hierarchy editor.
// HTML5 native drag-drop, no library dependency.
// ═══════════════════════════════════════════════════════════════
const OrgChartView = ({ departments, onReparent, onEdit, onRemove, onView }) => {
  // Build children map keyed by parentId.
  const childrenOf = useMemo(() => {
    const map = {};
    departments.forEach(d => {
      const k = d.parentId || '__root__';
      (map[k] = map[k] || []).push(d);
    });
    return map;
  }, [departments]);

  const roots = childrenOf['__root__'] || [];

  return (
    <div style={{
      background:'#fff', border:'1px solid var(--border)', borderRadius:14,
      padding:'24px 18px',
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:10, marginBottom:16,
        padding:'10px 14px', background:'var(--brand-tint)', borderRadius:8,
        fontSize:12, color:'var(--text-secondary)',
      }}>
        <GripVertical size={14} color="var(--brand)"/>
        <b style={{color:'var(--text-primary)'}}>Drag any node onto another</b> to move it (reparent). Drop on the <b>Root</b> zone to make it a top-level department.
      </div>

      {/* Root drop zone */}
      <RootDropZone onReparent={onReparent}/>

      {/* Tree */}
      <div style={{marginTop:8}}>
        {roots.map(root => (
          <TreeNode
            key={root.id}
            node={root}
            childrenOf={childrenOf}
            depth={0}
            onReparent={onReparent}
            onEdit={onEdit}
            onRemove={onRemove}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
};

const RootDropZone = ({ onReparent }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onDragOver={e => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={e => {
        e.preventDefault();
        setHover(false);
        const id = e.dataTransfer.getData('text/department-id');
        if (id) onReparent(id, null);
      }}
      style={{
        padding:'12px 16px', borderRadius:10,
        border: hover ? '2px dashed var(--brand)' : '2px dashed #cbd5e1',
        background: hover ? 'var(--brand-tint)' : '#f8fafc',
        color: hover ? 'var(--brand)' : 'var(--text-tertiary)',
        fontSize:12, fontWeight:600, textAlign:'center',
        transition:'all .15s',
      }}>
      Drop here to make root-level
    </div>
  );
};

const TreeNode = ({ node, childrenOf, depth, onReparent, onEdit, onRemove, onView }) => {
  const [open, setOpen] = useState(true);
  const [dropTarget, setDropTarget] = useState(false);
  const children = childrenOf[node.id] || [];
  const hasKids = children.length > 0;

  return (
    <div style={{marginLeft: depth === 0 ? 0 : 24, marginTop:6}}>
      <div
        draggable
        onDragStart={e => { e.dataTransfer.setData('text/department-id', node.id); e.dataTransfer.effectAllowed = 'move'; }}
        onDragOver={e => { e.preventDefault(); setDropTarget(true); }}
        onDragLeave={() => setDropTarget(false)}
        onDrop={e => {
          e.preventDefault();
          setDropTarget(false);
          const id = e.dataTransfer.getData('text/department-id');
          if (id && id !== node.id) onReparent(id, node.id);
        }}
        style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 14px', borderRadius:10,
          background: dropTarget ? 'var(--brand-tint)' : '#fff',
          border: `1px solid ${dropTarget ? 'var(--brand)' : 'var(--border)'}`,
          boxShadow: dropTarget ? '0 0 0 1px var(--brand) inset' : 'none',
          cursor:'grab',
          transition:'all .12s',
        }}>
        <GripVertical size={14} color="var(--text-tertiary)" style={{flexShrink:0}}/>

        {hasKids ? (
          <button
            onClick={() => setOpen(v => !v)}
            style={{background:'none', border:'none', cursor:'pointer', padding:0, color:'var(--text-tertiary)', display:'inline-flex'}}>
            {open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
          </button>
        ) : <span style={{width:14, display:'inline-block'}}/>}

        <div style={{
          width:34, height:34, borderRadius:9,
          background: depth === 0 ? 'var(--brand)' : 'var(--brand-tint)',
          color: depth === 0 ? '#fff' : 'var(--brand)',
          display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0,
        }}>
          <Users size={16}/>
        </div>

        <div style={{flex:1, minWidth:0}}>
          <div style={{fontWeight:700, fontSize:13, color:'var(--text-primary)', display:'flex', alignItems:'center', gap:8}}>
            {node.name}
            <span style={{fontSize:10, color:'var(--text-tertiary)', fontWeight:500}}>· {node.id}</span>
          </div>
          <div style={{fontSize:11, color:'var(--text-secondary)', marginTop:2}}>
            {node.head} · {node.employees} employees · {node.teams} team{node.teams === 1 ? '' : 's'}
          </div>
        </div>

        <div style={{display:'flex', gap:4}}>
          <button className="btn btn-outline btn-sm" onClick={() => onView(node)} style={{padding:'4px 8px'}}><Eye size={12}/></button>
          <button className="btn btn-outline btn-sm" onClick={() => onEdit(node)} style={{padding:'4px 8px'}}><Pencil size={12}/></button>
          <button className="btn btn-danger btn-sm" onClick={() => onRemove(node)} style={{padding:'4px 8px'}}><Trash2 size={12}/></button>
        </div>
      </div>

      {hasKids && open && (
        <div style={{borderLeft:'1px dashed #cbd5e1', marginLeft:18, paddingLeft:6}}>
          {children.map(c => (
            <TreeNode
              key={c.id}
              node={c}
              childrenOf={childrenOf}
              depth={depth + 1}
              onReparent={onReparent}
              onEdit={onEdit}
              onRemove={onRemove}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
