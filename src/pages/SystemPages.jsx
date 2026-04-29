import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Plus, Download, Eye, Pencil, CheckCircle2 } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

const sevBadge = s => s==='Critical'?'badge-danger':s==='High'?'badge-warning':s==='Medium'?'badge-info':'badge-gray';
const statusBadge = s => s==='Open'?'badge-danger':s==='Pending'?'badge-warning':'badge-success';

export const ExceptionsIssues = () => {
  const { state, addItem, updateItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.exceptions, {
    searchKeys:['type','title','reporter','assignee','id'],
    filters:{ severity:'severity', status:'status' },
  });

  const newException = () => openModal({
    title:'New Exception', subtitle:'BRD §10.4 — operational issue tracking',
    submitLabel:'Create exception',
    body: (
      <>
        <FieldRow>
          <Field label="Type" name="type" type="select" required options={['Commission Dispute','Training Overdue','Document Missing','Access Violation','Data Quality','SLA Breach']} />
          <Field label="Severity" name="severity" type="select" required options={['Low','Medium','High','Critical']} />
        </FieldRow>
        <Field label="Title" name="title" required />
        <FieldRow>
          <Field label="Reporter" name="reporter" defaultValue="System" />
          <Field label="Assignee" name="assignee" required />
        </FieldRow>
      </>
    ),
    onSubmit: (data) => { const c = addItem('exceptions', { ...data, status: 'Open', created: today() }, 'EXC', { action: 'Exception Raised', module: 'System', detail: data.title }); toast(`Exception ${c.id} created`,'warning'); },
  });

  const resolve = (e) => openConfirm({
    title: `Mark ${e.id} as resolved?`, message: e.title,
    onConfirm: () => { updateItem('exceptions', e.id, { status: 'Resolved' }, { action: 'Exception Resolved', module: 'System', target: e.id }); toast(`${e.id} resolved`); },
  });
  const setPending = (e) => { updateItem('exceptions', e.id, { status: 'Pending' }, { action: 'Exception Updated', module: 'System', target: e.id, detail: 'Set to Pending' }); toast(`${e.id} → Pending`); };
  const view = (e) => openDrawer({
    title: e.title, subtitle: `${e.id} · ${e.severity}`,
    content: (<div className="detail-grid">
      {[['ID',e.id],['Type',e.type],['Severity',e.severity],['Reporter',e.reporter],['Assignee',e.assignee],['Created',e.created],['Status',e.status]].map(([k,v])=>(
        <div key={k}><label>{k}</label><div className="v">{v}</div></div>))}
    </div>),
  });

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Exceptions & Issues</span></div><h1 className="page-title">Exceptions & Issues</h1><p className="page-subtitle">Track and resolve operational exceptions — BRD 10.4</p></div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Open</div><div className="kpi-value">{state.exceptions.filter(e=>e.status==='Open').length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>🔴</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pending</div><div className="kpi-value">{state.exceptions.filter(e=>e.status==='Pending').length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>🟡</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Resolved</div><div className="kpi-value">{state.exceptions.filter(e=>e.status==='Resolved').length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>🟢</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Critical</div><div className="kpi-value">{state.exceptions.filter(e=>e.severity==='Critical').length}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>⚠️</span></div></div>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search exceptions..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.severity} onChange={e=>setFilter('severity', e.target.value)}>
              <option value="">All Severities</option>{['Critical','High','Medium','Low'].map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>{['Open','Pending','Resolved'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`exceptions_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Exceptions CSV','System');}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={newException}><Plus size={14}/> New Exception</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Type</th><th>Title</th><th>Severity</th><th>Reporter</th><th>Assignee</th><th>Created</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(e=>(
              <tr key={e.id}>
                <td className="muted">{e.id}</td>
                <td>{e.type}</td>
                <td className="bold">{e.title}</td>
                <td><span className={`badge ${sevBadge(e.severity)}`}>{e.severity}</span></td>
                <td>{e.reporter}</td>
                <td>{e.assignee}</td>
                <td className="muted">{e.created}</td>
                <td><span className={`badge ${statusBadge(e.status)}`}>{e.status}</span></td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(e)}><Eye size={13}/></button>
                  {e.status==='Open' && <button className="btn btn-outline btn-sm" onClick={()=>setPending(e)}>Pending</button>}
                  {e.status!=='Resolved' && <button className="btn btn-success btn-sm" onClick={()=>resolve(e)}><CheckCircle2 size={13}/> Resolve</button>}
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

const SETTING_GROUPS = [
  { key:'general', title:'General', desc:'Company name, timezone, locale settings', items:[['Company','company'],['Timezone','timezone'],['Language','language'],['Currency','currency']] },
  { key:'auth',    title:'Authentication', desc:'SSO and security configuration', items:[['Provider','sso'],['SSO Mode','ssoMode'],['Session Timeout','sessionTimeout'],['MFA','mfa']] },
  { key:'notif',   title:'Notifications', desc:'Email and in-app notification settings', items:[['Lead Assignment','notifLead'],['Task Reminders','notifTask'],['Training Alerts','notifTraining'],['Commission Updates','notifCommission']] },
  { key:'integ',   title:'Integration', desc:'External system connections', items:[['Matrix EGMLS','integMatrix'],['Viva Learning','integViva'],['WhatsApp Business','integWhatsapp'],['Email SMTP','integSmtp']] },
  { key:'data',    title:'Data & Privacy', desc:'Data retention and privacy settings', items:[['Audit Log Retention','auditRetention'],['Data Backup','backup'],['GDPR Compliance','gdpr'],['Export Restrictions','exportRule']] },
  { key:'brand',   title:'Branding', desc:'Logo, colors, and white-label settings', items:[['Primary Color','primaryColor'],['Tagline','tagline'],['Favicon','favicon']] },
];

export const Settings = () => {
  const { state, openModal, updateSettings, toast } = useApp();

  const editGroup = (group) => openModal({
    title: `Edit ${group.title}`, subtitle: group.desc, size: 'lg',
    submitLabel: 'Save settings',
    body: (
      <>
        {group.items.map(([label, key]) => (
          <Field key={key} label={label} name={key} defaultValue={state.settings[key]} />
        ))}
      </>
    ),
    onSubmit: (data) => { updateSettings(data); toast(`${group.title} settings saved`); },
  });

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Settings</span></div><h1 className="page-title">Settings</h1><p className="page-subtitle">Platform configuration and system preferences</p></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {SETTING_GROUPS.map(g=>(
          <div key={g.key} className="settings-card">
            <h3 style={{fontWeight:700,fontSize:15,marginBottom:4}}>{g.title}</h3>
            <p style={{fontSize:12,color:'var(--text-secondary)',marginBottom:12}}>{g.desc}</p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {g.items.map(([label, key])=> (
                <div key={key} style={{fontSize:13,padding:'6px 0',borderBottom:'1px solid #f3f4f6',display:'flex',justifyContent:'space-between',gap:8}}>
                  <span style={{color:'var(--text-secondary)'}}>{label}:</span><span style={{fontWeight:500}}>{state.settings[key]}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-sm" style={{marginTop:12}} onClick={()=>editGroup(g)}><Pencil size={13}/> Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};
