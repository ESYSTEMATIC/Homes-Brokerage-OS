import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Empty } from '../components/UI';
import { Eye, UserCog, Wallet, Download, GraduationCap, FileCheck2, UsersRound, Award, ClipboardList } from 'lucide-react';

// ── Per-agent onboarding profile (Backoffice mirror of the Employee Board view) ──
// Sales hierarchy access (per meeting 8-4-2026, lines 60–62):
//   TL → sees what their agents see · SM → sees teams underneath · Director → sees managers
//   Plus HR/Backoffice — full visibility, including learning progress (line 18).
const AgentProfileDrawer = ({ a, state, onWallet, onToggle, onEdit }) => {
  const isApproved = a.status === 'Active';
  const isSuspended = a.status === 'Suspended';
  const isPending = a.status === 'Pending';

  // Derive training progress for this agent (deterministic seed from name).
  const seed = a.name.split('').reduce((s,c)=>s+c.charCodeAt(0),0);
  const trainingPct = isApproved && !isPending ? Math.min(100, 60 + (seed % 41))
                       : isPending ? Math.min(85, 30 + (seed % 41))
                       : 100;
  const trainingDone = trainingPct === 100;
  const required = state.training.filter(t=>t.required);
  const reqDone = trainingDone ? required.length : Math.floor(required.length * trainingPct / 100);

  // Derive document state (count this agent's docs from state.documents).
  const agentDocs = state.documents.filter(d => d.agent === a.name);
  const docsApproved = agentDocs.filter(d=>d.status==='Approved').length;
  const docsTotal = Math.max(agentDocs.length, 5);
  const docsDone = docsApproved >= 4;

  // Score (Platform §2.3) — same weighting as the agent's view.
  const trainingAvg = Math.round(60 + ((seed * 3) % 35));
  const interviewScore = isApproved ? 88 : 78;
  const score = Math.round(trainingAvg * 0.6 + interviewScore * 0.4);

  // Onboarding journey state.
  const journeySteps = isApproved && !isPending && !isSuspended ? [
    { label: 'Application', done: true },
    { label: 'Documents', done: true },
    { label: 'Agreement', done: true },
    { label: 'Training', done: true },
    { label: 'MLS Access', done: true },
    { label: 'Go Live', done: true },
  ] : [
    { label: 'Application', done: true },
    { label: 'Documents', done: docsDone, current: !docsDone },
    { label: 'Agreement', done: docsDone, current: docsDone && !trainingDone },
    { label: 'Training', done: trainingDone, current: docsDone && !trainingDone },
    { label: 'MLS Access', done: false, current: trainingDone },
    { label: 'Go Live', done: false },
  ];

  return (
    <>
      <div className="detail-grid">
        {[['ID',a.id],['Email',a.email||'—'],['Phone',a.phone||'—'],['Title',a.title],['Branch',a.branch],['Team',a.department],['Manager',a.manager],['Status',a.status],['Joined',a.joinDate||'—']].map(([k,v])=>(
          <div key={k}><label>{k}</label><div className="v">{v}</div></div>
        ))}
      </div>

      {/* Onboarding journey — mirrors agent's Employee Board view */}
      <div style={{marginTop:22,padding:'18px 20px',background:'#fff',border:'1px solid var(--border)',borderRadius:12}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <ClipboardList size={16} color="var(--brand)"/>
          <div style={{fontSize:13,fontWeight:700}}>Onboarding Journey</div>
          <span className="badge badge-info" style={{marginLeft:'auto',fontSize:9}}>Platform §2</span>
        </div>
        <div className="journey-steps" style={{margin:0}}>
          {journeySteps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="journey-step">
                <div className={`journey-step-circle ${step.done?'done':step.current?'current':''}`}>{step.done ? '✓' : i+1}</div>
                <div className="journey-step-label" style={{fontSize:10}}>{step.label}</div>
              </div>
              {i < journeySteps.length - 1 && <div className={`journey-line ${step.done?'done':''}`}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Score + Training (HR / SD / TL view per meeting line 18) */}
      <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div style={{padding:'14px 16px',background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <Award size={14} color="var(--brand)"/>
            <div style={{fontSize:12,fontWeight:700}}>Agent Score</div>
          </div>
          <div style={{fontSize:24,fontWeight:800,color:score>=85?'var(--success)':score>=70?'var(--warning)':'var(--danger)'}}>{score}/100</div>
          <div style={{fontSize:10,color:'var(--text-secondary)',marginTop:6,lineHeight:1.5}}>
            Training {trainingAvg}% · Interview {interviewScore}%<br/>
            <span style={{color:'var(--text-tertiary)'}}>Used for team allocation (Platform §2.3)</span>
          </div>
        </div>
        <div style={{padding:'14px 16px',background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <GraduationCap size={14} color="var(--brand)"/>
            <div style={{fontSize:12,fontWeight:700}}>Training Progress</div>
          </div>
          <div style={{fontSize:24,fontWeight:800}}>{reqDone}/{required.length}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}>
            <div className="progress-bar" style={{flex:1}}><div className={`progress-fill ${trainingDone?'green':'amber'}`} style={{width:`${trainingPct}%`}}/></div>
            <span style={{fontSize:11,fontWeight:600}}>{trainingPct}%</span>
          </div>
        </div>
      </div>

      {/* Documents (Backoffice review queue mirror) */}
      <div style={{marginTop:14,padding:'14px 16px',background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <FileCheck2 size={14} color="var(--brand)"/>
          <div style={{fontSize:12,fontWeight:700,flex:1}}>Documents</div>
          <span style={{fontSize:11,color:'var(--text-secondary)'}}>{docsApproved} approved · {agentDocs.filter(d=>d.status==='Pending Review').length} pending · {agentDocs.filter(d=>d.status==='Missing'||d.status==='Rejected').length} missing/rejected</span>
        </div>
        {agentDocs.length === 0 ? (
          <div style={{fontSize:11,color:'var(--text-tertiary)',padding:'8px 0'}}>No documents on file yet.</div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {agentDocs.map(d => (
              <div key={d.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12,padding:'6px 8px',background:'#fafbfc',borderRadius:6,border:'1px solid var(--border)'}}>
                <span><b>{d.doc}</b> <span style={{color:'var(--text-tertiary)'}}>· {d.type}</span></span>
                <span className={`badge ${d.status==='Approved'?'badge-success':d.status==='Rejected'||d.status==='Missing'?'badge-danger':'badge-warning'}`}>{d.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Assignment (Platform §2.4) */}
      <div style={{marginTop:14,padding:'14px 16px',background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <UsersRound size={14} color="var(--brand)"/>
          <div style={{fontSize:12,fontWeight:700}}>Team & Hierarchy</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:12}}>
          {[['Team',a.department||'Alpha'],['Branch',a.branch],['Reports to',a.manager],['Hierarchy','Director → SM → TL → Agent']].map(([k,v])=>(
            <div key={k}><div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>{k}</div><div style={{marginTop:2}}>{v}</div></div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{marginTop:18,display:'flex',gap:8,flexWrap:'wrap'}}>
        <button className="btn btn-primary" onClick={onEdit}><UserCog size={14}/> Edit Profile</button>
        <button className="btn btn-outline" onClick={onWallet}><Wallet size={14}/> View Wallet</button>
        <button className="btn btn-outline" onClick={onToggle}>{isSuspended ? 'Reactivate' : 'Suspend'}</button>
      </div>
    </>
  );
};

export const AgentsList = () => {
  const { state, openDrawer, openConfirm, updateItem, toast, writeAudit } = useApp();
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.staff, {
    searchKeys: ['name', 'id', 'branch', 'manager'],
    filters: { status: 'status' },
  });

  const showWallet = (a) => openDrawer({
    title: `${a.name} — Wallet`, subtitle: 'Commission balances',
    content: (
      <div className="detail-grid">
        {[['YTD Earned','EGP 230,000'],['Paid','EGP 150,000'],['Pending','EGP 80,000'],['Last Payout','2024-01-15'],['Next Cycle','2024-02-01']].map(([k,v])=>(
          <div key={k}><label>{k}</label><div className="v">{v}</div></div>
        ))}
      </div>
    ),
  });

  const toggleStatus = (a) => openConfirm({
    title: `${a.status === 'Active' ? 'Suspend' : 'Reactivate'} ${a.name}?`,
    message: `${a.name} (${a.id}) will be ${a.status === 'Active' ? 'suspended (access blocked across federated systems)' : 'reactivated'}.`,
    danger: a.status === 'Active',
    onConfirm: () => { updateItem('staff', a.id, { status: a.status==='Active' ? 'Suspended':'Active' }, { action: 'Status Toggled', module: 'HR', target: a.id }); toast('Status updated'); },
  });

  const view = (a) => openDrawer({
    title: a.name,
    subtitle: `${a.id} · ${a.title} · ${a.branch}`,
    content: <AgentProfileDrawer
      a={a} state={state}
      onWallet={()=>showWallet(a)}
      onToggle={()=>toggleStatus(a)}
      onEdit={()=>{ toast(`Edit form for ${a.name} would open here`,'info'); }}
    />,
  });

  const today = () => new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Agents</span></div>
        <h1 className="page-title">Agents</h1>
        <p className="page-subtitle">External agent registry — agents are employees once approved</p>
      </div>
      <div className="info-banner">Click any row to open the agent's full onboarding profile — same view that HR, Sales Director, Sales Manager, and Team Leader see (per their hierarchy scope, meeting lines 60–62). Mirrors the agent's own Employee Board view.</div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search agents by name or ID..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option><option>Active</option><option>Suspended</option><option>Pending</option>
            </select>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontSize:13,color:'var(--text-secondary)'}}>{filtered.length} agent(s)</span>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`agents_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Agents CSV','HR');}}><Download size={14}/> Export</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Branch</th><th>Team</th><th>Manager</th><th>Title</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id} className="clickable" onClick={()=>view(a)}>
                  <td className="muted">{a.id}</td>
                  <td className="bold">{a.name}</td>
                  <td>{a.branch}</td>
                  <td>{a.department}</td>
                  <td>{a.manager}</td>
                  <td>{a.title}</td>
                  <td><span className={`badge ${a.status==='Active'?'badge-success':a.status==='Suspended'?'badge-danger':'badge-warning'}`}>{a.status}</span></td>
                  <td onClick={e=>e.stopPropagation()}><div className="action-icons" style={{justifyContent:'flex-end'}}>
                    <span className="action-icon" title="View profile" onClick={()=>view(a)}><Eye size={16}/></span>
                    <span className="action-icon" title="Toggle status" onClick={()=>toggleStatus(a)}><UserCog size={16}/></span>
                    <span className="action-icon" title="Wallet" onClick={()=>showWallet(a)}><Wallet size={16}/></span>
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
