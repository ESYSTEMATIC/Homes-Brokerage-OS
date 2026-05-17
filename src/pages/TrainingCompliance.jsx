import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Empty } from '../components/UI';
import { Download, Bell, ShieldCheck } from 'lucide-react';

// Deterministic per-employee progress (so it doesn't reshuffle on every render).
const seed = (name) => name.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
const derive = (s) => {
  const pct = (seed(s.name) % 60) + 40; // 40..99
  const comp = pct >= 90;
  return { pct, comp };
};

export const TrainingCompliance = () => {
  const { state, openConfirm, toast, writeAudit } = useApp();

  const enriched = useMemo(() => state.staff.map(s => {
    const { pct, comp } = derive(s);
    const access = comp ? 'Active' : s.status === 'Suspended' ? 'Blocked' : 'Pending';
    return { ...s, pct, comp, access };
  }), [state.staff]);

  const { q, setQ, filterVals, setFilter, filtered } = useTableState(enriched, {
    searchKeys: ['name','title','department','id'],
    filters: { access: 'access' },
  });

  const today = () => new Date().toISOString().split('T')[0];

  const remind = (s) => openConfirm({
    title: `Send training reminder?`,
    message: `Notify ${s.name} about ${5 - Math.floor(s.pct/20)} pending course(s).`,
    onConfirm: () => { writeAudit('Training Reminder Sent', s.id, 'HR', `${s.name} via email`); toast(`Reminder sent to ${s.name}`); },
  });

  const counts = {
    compliant: enriched.filter(e=>e.comp).length,
    inProgress: enriched.filter(e=>!e.comp && e.access==='Pending').length,
    blocked: enriched.filter(e=>e.access==='Blocked').length,
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Training Compliance</span></div>
        <h1 className="page-title">Training Compliance</h1>
        <p className="page-subtitle">Training gates and readiness status</p>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Employees Tracked</div><div className="kpi-value">{state.staff.length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>👥</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Fully Compliant</div><div className="kpi-value">{counts.compliant}</div><div className="kpi-change up">{Math.round(counts.compliant/state.staff.length*100)}% of staff</div></div><div className="kpi-icon green"><ShieldCheck size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Training In Progress</div><div className="kpi-value">{counts.inProgress}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>📖</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Access Blocked</div><div className="kpi-value">{counts.blocked}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>🔒</span></div></div>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search employee..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.access} onChange={e=>setFilter('access', e.target.value)}>
              <option value="">All Access</option><option>Active</option><option>Pending</option><option>Blocked</option>
            </select>
          </div>
          <button className="btn btn-outline" onClick={()=>{exportCSV(`training_${today()}`,filtered.map(({pct,comp,access,...r})=>({...r,progress:pct,access}))); toast(`Exported ${filtered.length}`);}}><Download size={14}/> Export</button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>Employee</th><th>Title</th><th>Department</th><th>Required</th><th>Completed</th><th>Progress</th><th>Access</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id}>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      {s.photoDataUrl ? (
                        <img src={s.photoDataUrl} alt="" style={{width:32, height:32, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'1px solid var(--border)'}}/>
                      ) : (
                        <div style={{width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0}}>
                          {s.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                        </div>
                      )}
                      <div className="bold">{s.name}</div>
                    </div>
                  </td>
                  <td>{s.title}</td>
                  <td>{s.department}</td>
                  <td>5</td>
                  <td>{s.comp ? 5 : Math.floor(s.pct/20)}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div className="progress-bar" style={{width:100}}><div className={`progress-fill ${s.comp?'green':s.pct>60?'blue':'amber'}`} style={{width:`${s.pct}%`}}/></div>
                    <span style={{fontSize:12,fontWeight:600}}>{s.pct}%</span>
                  </div></td>
                  <td><span className={`badge ${s.access==='Active'?'badge-success':s.access==='Blocked'?'badge-danger':'badge-warning'}`}>{s.access}</span></td>
                  <td style={{textAlign:'right'}}>{!s.comp && <button className="btn btn-outline btn-sm" onClick={()=>remind(s)}><Bell size={13}/> Remind</button>}</td>
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
