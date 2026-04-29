import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Plus, Download, Eye, ChevronRight, X } from 'lucide-react';
import { CANDIDATE_STAGES } from '../data/staticData';

const stageColor = s => s==='Offer'?'badge-success':s==='Rejected'?'badge-danger':s==='Interview'?'badge-info':s==='Screening'?'badge-warning':'badge-gray';

export const RecruitmentPipeline = () => {
  const { state, addItem, updateItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const interviewers = state.staff.filter(s=>['Sales Manager','Team Leader','HR Recruiter'].includes(s.type) || s.department.startsWith('HR')).map(s=>s.name);

  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.candidates, {
    searchKeys: ['name', 'job', 'source', 'id'],
    filters: { stage: 'stage', job: 'job' },
  });

  const today = () => new Date().toISOString().split('T')[0];

  const newCandidate = () => openModal({
    title: 'Add Candidate', subtitle: 'BRD §8.10 — recruitment intake',
    submitLabel: 'Add candidate',
    body: (
      <>
        <FieldRow>
          <Field label="Full Name" name="name" required />
          <Field label="Source" name="source" type="select" required options={['Careers Page','Referral','LinkedIn','Direct','Recruiter']} />
        </FieldRow>
        <FieldRow>
          <Field label="Job" name="job" type="select" required options={state.jobs.map(j=>j.title)} />
          <Field label="Stage" name="stage" type="select" required options={CANDIDATE_STAGES} defaultValue="Applied" />
        </FieldRow>
      </>
    ),
    onSubmit: (data) => {
      const c = addItem('candidates', { ...data, applied: today(), score: null, interviewer: null }, 'CAN', { action: 'Candidate Added', module: 'Recruitment', detail: `${data.name} for ${data.job}` });
      toast(`Candidate ${c.id} added`);
    },
  });

  const advance = (c) => {
    const idx = CANDIDATE_STAGES.indexOf(c.stage);
    const next = CANDIDATE_STAGES[Math.min(idx+1, CANDIDATE_STAGES.length-2)]; // skip Rejected
    if (next === 'Interview') return openModal({
      title: `Schedule interview — ${c.name}`, subtitle: 'BRD §8.10 — multi-interviewer scoring',
      submitLabel: 'Schedule',
      body: (
        <>
          <FieldRow>
            <Field label="Interviewer" name="interviewer" type="select" required options={interviewers} />
            <Field label="Date" name="date" type="date" defaultValue={today()} required />
          </FieldRow>
          <Field label="Notes" name="notes" type="textarea" placeholder="Agenda, focus areas…" />
        </>
      ),
      onSubmit: ({ interviewer }) => {
        updateItem('candidates', c.id, { stage: 'Interview', interviewer }, { action: 'Interview Scheduled', module: 'Recruitment', target: c.id, detail: `with ${interviewer}` });
        toast(`${c.name} → Interview · ${interviewer}`);
      },
    });
    if (next === 'Offer') return openModal({
      title: `Make offer — ${c.name}`, submitLabel: 'Send offer',
      body: (
        <>
          <FieldRow>
            <Field label="Score" name="score" type="number" defaultValue={c.score || 80} required />
            <Field label="Salary Band (EGP)" name="band" type="select" options={['10–15k','15–25k','25–40k','40k+']} required />
          </FieldRow>
        </>
      ),
      onSubmit: ({ score }) => {
        updateItem('candidates', c.id, { stage: 'Offer', score: Number(score) }, { action: 'Offer Sent', module: 'Recruitment', target: c.id });
        toast(`Offer sent to ${c.name}`);
      },
    });
    updateItem('candidates', c.id, { stage: next }, { action: 'Candidate Advanced', module: 'Recruitment', target: `${c.id} → ${next}` });
    toast(`${c.name} → ${next}`);
  };

  const reject = (c) => openModal({
    title: `Reject — ${c.name}`, submitLabel: 'Reject', danger: true,
    body: <Field label="Reason" name="reason" type="textarea" required placeholder="Visible in audit trail" />,
    onSubmit: ({ reason }) => { updateItem('candidates', c.id, { stage: 'Rejected' }, { action: 'Candidate Rejected', module: 'Recruitment', target: c.id, detail: reason }); toast(`${c.name} rejected`,'warning'); },
  });

  const view = (c) => openDrawer({
    title: c.name, subtitle: `${c.id} · ${c.job}`,
    content: (
      <>
        <div className="detail-grid">
          {[['ID',c.id],['Job',c.job],['Stage',c.stage],['Score',c.score??'—'],['Source',c.source],['Applied',c.applied],['Interviewer',c.interviewer||'—']].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>
          ))}
        </div>
        <div style={{marginTop:18,display:'flex',gap:8,flexWrap:'wrap'}}>
          {!['Rejected','Offer'].includes(c.stage) && <button className="btn btn-primary" onClick={()=>advance(c)}><ChevronRight size={14}/> Advance Stage</button>}
          {c.stage!=='Rejected' && <button className="btn btn-danger" onClick={()=>reject(c)}><X size={14}/> Reject</button>}
        </div>
      </>
    ),
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Candidate Pipeline</span></div>
        <h1 className="page-title">Candidate Pipeline</h1>
        <p className="page-subtitle">Manage candidates, interviews, and scorecards — BRD 8.10</p>
      </div>
      <div className="kpi-grid kpi-grid-5">
        {CANDIDATE_STAGES.map(s=>(
          <div className="kpi-card" key={s}><div><div className="kpi-label">{s}</div><div className="kpi-value">{state.candidates.filter(c=>c.stage===s).length}</div></div><div className={`kpi-icon ${s==='Offer'?'green':s==='Rejected'?'red':s==='Interview'?'blue':'amber'}`}><span style={{fontSize:18}}>👤</span></div></div>
        ))}
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search candidates..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.stage} onChange={e=>setFilter('stage', e.target.value)}>
              <option value="">All Stages</option>{CANDIDATE_STAGES.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="data-select" value={filterVals.job} onChange={e=>setFilter('job', e.target.value)}>
              <option value="">All Jobs</option>{[...new Set(state.candidates.map(c=>c.job))].map(j=><option key={j}>{j}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`candidates_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Candidates CSV','Recruitment');}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={newCandidate}><Plus size={14}/> Add Candidate</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Job</th><th>Stage</th><th>Score</th><th>Source</th><th>Applied</th><th>Interviewer</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(c=>(
              <tr key={c.id}>
                <td className="muted">{c.id}</td>
                <td className="bold">{c.name}</td>
                <td>{c.job}</td>
                <td><span className={`badge ${stageColor(c.stage)}`}>{c.stage}</span></td>
                <td className="bold">{c.score??'—'}</td>
                <td className="muted">{c.source}</td>
                <td className="muted">{c.applied}</td>
                <td>{c.interviewer||'—'}</td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(c)}><Eye size={13}/> View</button>
                  {!['Rejected','Offer'].includes(c.stage) && <button className="btn btn-primary btn-sm" onClick={()=>advance(c)}>Next Step</button>}
                  {c.stage!=='Rejected' && <button className="btn btn-danger btn-sm" onClick={()=>reject(c)}>Reject</button>}
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
