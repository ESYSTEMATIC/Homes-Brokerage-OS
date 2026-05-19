import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Eye, Pencil, Trash2, Plus, Download, KeyRound, Users, Building2, ShieldCheck, BadgeDollarSign, Globe, Briefcase, Check } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

// Permissions catalog — grouped by module, with brand tone + icon for the
// edit-form redesign (May 2026 business review). Each group is rendered as
// a self-contained card with its own select-all toggle and count chip.
const PERMISSION_CATALOG = {
  'CRM (federated)': {
    icon: Users,        color: '#3b82f6',
    perms: ['View Leads','Create Leads','Assign Leads','Reassign Leads','Approve Override','View Deals','Edit Deals','Approve Commission'],
  },
  'Marketplace (federated)': {
    icon: Globe,        color: '#10b981',
    perms: ['Publish Project','Edit Inventory','Manage Source Mapping','View Marketplace Dashboard'],
  },
  'Backoffice': {
    icon: Building2,    color: '#E8672A',
    perms: ['Manage Departments','Manage Branches','Manage Roles','Approve Onboarding','Review Documents','View Audit Logs'],
  },
  'HR / Recruitment': {
    icon: Briefcase,    color: '#8b5cf6',
    perms: ['Publish Vacancy','Manage Candidates','Schedule Interviews','Process Onboarding','View Payroll'],
  },
  'Finance': {
    icon: BadgeDollarSign, color: '#16a34a',
    perms: ['Manage Commission Policy','Approve Commission','Process Agent Dues','View Financial Reports'],
  },
  'System': {
    icon: ShieldCheck,  color: '#0f172a',
    perms: ['Manage SSO','Manage Integrations','Manage Settings','Configure Audit Retention'],
  },
};
const PERM_TOTAL = Object.values(PERMISSION_CATALOG).reduce((s, g) => s + g.perms.length, 0);

export const RolesPermissions = () => {
  const { state, addItem, updateItem, removeItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const { q, setQ, filtered } = useTableState(state.roles, { searchKeys: ['name','department','desc','id'] });

  // Track selected permissions across renders — the modal's submitter only
  // sees the form-data, so we lift the perm-set into closure state and
  // resolve it on submit.
  const openForm = (existing) => {
    const selected = new Set(existing?.permissionKeys || []);
    openModal({
      title: existing ? `Edit Role — ${existing.name}` : 'Create Role',
      subtitle: 'Roles are permission templates assigned to users in a department / team',
      size: 'lg',
      submitLabel: existing ? 'Save changes' : 'Create role',
      body: (
        <RolePermissionForm
          existing={existing}
          departments={state.departments}
          selected={selected}
        />
      ),
      onSubmit: (data) => {
        const permsCount = selected.size;
        const patch = {
          name: data.name,
          department: data.department,
          desc: data.desc,
          status: data.status,
          permissions: permsCount,
          permissionKeys: Array.from(selected),
          users: existing?.users ?? 0,
        };
        if (existing) {
          updateItem('roles', existing.id, patch, { action: 'Role Updated', module: 'System', target: existing.id, detail: `${permsCount} permission(s)` });
          toast(`Role updated · ${permsCount} permission${permsCount === 1 ? '' : 's'}`);
        } else {
          const c = addItem('roles', patch, 'ROLE', { action: 'Role Created', module: 'System', detail: `${data.name} · ${permsCount} permission(s)` });
          toast(`Role created · ${c.id}`);
        }
      },
    });
  };

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
        <p className="page-subtitle">Custom role creation and permission catalog</p>
      </div>
      <div className="info-banner" style={{display:'flex',alignItems:'center',gap:10}}><KeyRound size={16}/>Roles control access across the Backoffice and federated systems (CRM, Marketplace, Marketplace Dashboard). All access is SSO-only via Microsoft Entra.</div>
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

// ═══════════════════════════════════════════════════════════════════════
// RolePermissionForm — redesigned create/edit form for Roles & Permissions
// ───────────────────────────────────────────────────────────────────────
// Business-team review (May 2026): the original form was a flat checkbox
// grid inside a 240px scroll box. Hard to scan, no per-group totals, no
// select-all, no visual grouping. New design:
//   • Header KPI strip — total selected / total available / coverage %.
//   • One card per permission GROUP with brand-tone band, icon, count
//     chip, and a 'Select all' toggle per group.
//   • Each permission is a clickable card (not a bare checkbox) with a
//     check-mark and tinted background when selected.
//   • Full-width 2-col grid up to 1100px, single column below.
// ═══════════════════════════════════════════════════════════════════════
const RolePermissionForm = ({ existing, departments, selected }) => {
  const [, force] = useState(0);
  const refresh = () => force(x => x + 1);

  const keyOf = (group, perm) => `${group}::${perm}`;
  const isOn = (group, perm) => selected.has(keyOf(group, perm));
  const toggle = (group, perm) => {
    const k = keyOf(group, perm);
    if (selected.has(k)) selected.delete(k); else selected.add(k);
    refresh();
  };
  const groupChecked = (group, perms) => perms.every(p => selected.has(keyOf(group, p)));
  const groupCount = (group, perms) => perms.filter(p => selected.has(keyOf(group, p))).length;
  const toggleGroup = (group, perms) => {
    const allOn = groupChecked(group, perms);
    if (allOn) perms.forEach(p => selected.delete(keyOf(group, p)));
    else perms.forEach(p => selected.add(keyOf(group, p)));
    refresh();
  };
  const selectAll = () => {
    Object.entries(PERMISSION_CATALOG).forEach(([g, { perms }]) => {
      perms.forEach(p => selected.add(keyOf(g, p)));
    });
    refresh();
  };
  const clearAll = () => { selected.clear(); refresh(); };

  const totalSel = selected.size;
  const coverage = Math.round((totalSel / PERM_TOTAL) * 100);

  return (
    <>
      {/* Identity / metadata */}
      <FieldRow>
        <Field label="Role Name" name="name" required defaultValue={existing?.name} placeholder="e.g. Branch Manager"/>
        <Field label="Department" name="department" type="select" required options={departments.map(d => d.name)} defaultValue={existing?.department} />
      </FieldRow>
      <Field label="Description" name="desc" type="textarea" defaultValue={existing?.desc} placeholder="What this role is responsible for — visible to admins assigning users."/>
      <FieldRow>
        <Field label="Status" name="status" type="select" options={['Active','Inactive']} defaultValue={existing?.status || 'Active'} />
        <div/>
      </FieldRow>

      {/* Permissions header */}
      <div style={{
        marginTop:18, marginBottom:12,
        padding:'14px 16px',
        background:'linear-gradient(135deg, var(--brand-tint), #fff)',
        border:'1px solid var(--border)', borderRadius:12,
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap',
      }}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:38, height:38, borderRadius:10, background:'var(--brand)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <KeyRound size={18}/>
          </div>
          <div>
            <div style={{fontSize:13, fontWeight:800, color:'var(--text-primary)'}}>Permissions</div>
            <div style={{fontSize:11, color:'var(--text-secondary)', marginTop:2}}>
              Tick the actions this role can perform. Group titles act as select-all toggles.
            </div>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:22, fontWeight:800, color:'var(--brand)', lineHeight:1}}>{totalSel}<span style={{fontSize:13, fontWeight:600, color:'var(--text-tertiary)'}}> / {PERM_TOTAL}</span></div>
            <div style={{fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em', marginTop:2}}>{coverage}% coverage</div>
          </div>
          <div style={{display:'flex', gap:6}}>
            <button type="button" onClick={selectAll}  className="btn btn-sm btn-outline" style={{fontSize:11}}>Select all</button>
            <button type="button" onClick={clearAll}   className="btn btn-sm btn-outline" style={{fontSize:11}}>Clear all</button>
          </div>
        </div>
      </div>

      {/* Permission groups — 2-col responsive grid */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit, minmax(360px, 1fr))',
        gap:14,
        maxHeight: 460, overflowY:'auto',
        padding: 4,
      }}>
        {Object.entries(PERMISSION_CATALOG).map(([group, { perms, color, icon: Icon }]) => {
          const all = groupChecked(group, perms);
          const some = groupCount(group, perms) > 0 && !all;
          const count = groupCount(group, perms);
          return (
            <div key={group} style={{
              background:'#fff',
              border:'1px solid var(--border)',
              borderTop: `3px solid ${color}`,
              borderRadius:12,
              overflow:'hidden',
              display:'flex', flexDirection:'column',
            }}>
              {/* Group header — clickable for select-all */}
              <button
                type="button"
                onClick={() => toggleGroup(group, perms)}
                title={all ? 'Deselect all in this group' : 'Select all in this group'}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px 14px',
                  background: all ? `${color}10` : some ? `${color}06` : '#fafbfc',
                  borderBottom:'1px solid var(--border)',
                  border:'none', cursor:'pointer', textAlign:'left', width:'100%',
                }}>
                <div style={{
                  width:32, height:32, borderRadius:8,
                  background: `${color}18`, color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0,
                }}>
                  <Icon size={15}/>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:12, fontWeight:800, color:'var(--text-primary)'}}>{group}</div>
                  <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:2}}>{count}/{perms.length} selected</div>
                </div>
                <div style={{
                  width:22, height:22, borderRadius:6,
                  border: `2px solid ${all || some ? color : 'var(--border)'}`,
                  background: all ? color : some ? `${color}22` : '#fff',
                  color:'#fff',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  {all && <Check size={14} strokeWidth={3}/>}
                  {some && <span style={{width:10, height:2, background: color}}/>}
                </div>
              </button>

              {/* Permission tiles */}
              <div style={{padding:10, display:'flex', flexDirection:'column', gap:5}}>
                {perms.map(p => {
                  const on = isOn(group, p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggle(group, p)}
                      style={{
                        display:'flex', alignItems:'center', gap:9,
                        padding:'8px 11px',
                        background: on ? `${color}10` : '#fff',
                        border: `1.5px solid ${on ? color : 'var(--border)'}`,
                        borderRadius:8,
                        cursor:'pointer', textAlign:'left',
                        transition:'border-color .12s, background .12s',
                      }}>
                      <div style={{
                        width:18, height:18, borderRadius:5,
                        border: `2px solid ${on ? color : 'var(--text-tertiary)'}`,
                        background: on ? color : '#fff',
                        color:'#fff',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        flexShrink:0,
                      }}>
                        {on && <Check size={11} strokeWidth={3.5}/>}
                      </div>
                      <span style={{
                        fontSize:12,
                        fontWeight: on ? 700 : 500,
                        color: on ? color : 'var(--text-primary)',
                      }}>{p}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
