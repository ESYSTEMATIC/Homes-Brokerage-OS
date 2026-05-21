import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { CandidatePipelinePanel } from '../components/PipelineNotes';
import { Plus, Download, Eye, ChevronRight, X, FileText, Award, Briefcase, Info, Filter } from 'lucide-react';
import { CANDIDATE_STAGES } from '../data/staticData';

// Stage <select> — business-team feedback (May 2026): HR moves candidates
// between stages via dropdown, not via "Next Step" auto-advance.
const stageBadgeTone = (v) =>
  v === 'Offer' ? { bg:'#dcfce7', fg:'#166534', border:'#86efac' }
  : v === 'Rejected' ? { bg:'#fee2e2', fg:'#991b1b', border:'#fca5a5' }
  : v === 'Interview' ? { bg:'#dbeafe', fg:'#1e40af', border:'#93c5fd' }
  : v === 'Screening' ? { bg:'#fef3c7', fg:'#92400e', border:'#fcd34d' }
  : { bg:'#f1f5f9', fg:'#475569', border:'#cbd5e1' };

const StageSelectInline = ({ value, onChange }) => {
  const t = stageBadgeTone(value);
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        appearance:'none',
        padding:'5px 26px 5px 10px',
        fontSize:11, fontWeight:700,
        background: `${t.bg} url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23${t.fg.slice(1)}' stroke-width='3'><polyline points='6 9 12 15 18 9'/></svg>") right 8px center / 10px no-repeat`,
        color: t.fg,
        border: `1px solid ${t.border}`,
        borderRadius: 999,
        cursor:'pointer',
        outline:'none',
      }}
      title="Move candidate to a different stage"
    >
      {CANDIDATE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
};

const stageColor = s => s==='Offer'?'badge-success':s==='Rejected'?'badge-danger':s==='Interview'?'badge-info':s==='Screening'?'badge-warning':'badge-gray';

// Shared styling for the Advanced filters panel.
const advLabel = { display:'block', fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4 };
const advInput = { padding:'6px 10px', border:'1px solid var(--border)', borderRadius:7, fontSize:12, fontFamily:'inherit', outline:'none', minWidth:150 };

export const RecruitmentPipeline = () => {
  const { state, addItem, updateItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const interviewers = state.staff.filter(s=>['Sales Manager','Team Leader','HR Recruiter'].includes(s.type) || s.department.startsWith('HR')).map(s=>s.name);

  const navigate = useNavigate();
  // SME ask (May 2026): hired candidates leave the active pipeline view —
  // they've completed the funnel and now live as employees.
  const pipelineCandidates = useMemo(
    () => (state.candidates || []).filter(c => c.stage !== 'Hired'),
    [state.candidates],
  );
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(pipelineCandidates, {
    searchKeys: ['name', 'job', 'vacancyId', 'id'],
    filters: { stage: 'stage', vacancyId: 'vacancyId' },
  });
  const vacancyById = (state.jobs || []).reduce((m, j) => { m[j.id] = j; return m; }, {});

  // ─── Advanced filters — applied-date range, interviewer, CV-on-file ──
  const [showAdv, setShowAdv] = useState(false);
  const [adv, setAdv] = useState({ appliedFrom: '', appliedTo: '', interviewer: '', hasCv: '' });
  const advActive = !!(adv.appliedFrom || adv.appliedTo || adv.interviewer || adv.hasCv);
  const clearAdv = () => setAdv({ appliedFrom: '', appliedTo: '', interviewer: '', hasCv: '' });
  const finalFiltered = useMemo(() => filtered.filter(c => {
    if (adv.appliedFrom && (c.applied || '') < adv.appliedFrom) return false;
    if (adv.appliedTo   && (c.applied || '') > adv.appliedTo)   return false;
    if (adv.interviewer && c.interviewer !== adv.interviewer)   return false;
    if (adv.hasCv === 'yes' && !c.resumeName) return false;
    if (adv.hasCv === 'no'  &&  c.resumeName) return false;
    return true;
  }), [filtered, adv]);

  const today = () => new Date().toISOString().split('T')[0];

  // File→dataURL helper used to persist photo + CV as base64 in the
  // candidate record (so they survive a session without a backend).
  const readDataUrl = (file) => new Promise((resolve) => {
    if (!file || !(file instanceof File) || file.size === 0) return resolve(null);
    const fr = new FileReader();
    fr.onload  = () => resolve(fr.result);
    fr.onerror = () => resolve(null);
    fr.readAsDataURL(file);
  });

  // Business-team feedback (May 2026): there is no separate "source"
  // dropdown — the source IS the vacancy. Intake therefore requires a
  // vacancyId, and `source` is no longer stored. `score` was also removed
  // from the hiring flow per the same review.
  const newCandidate = () => openModal({
    title: 'Add Candidate', subtitle: 'Recruitment intake · photo + CV required',
    submitLabel: 'Add candidate',
    body: (
      <>
        <FieldRow>
          <Field label="Full Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
        </FieldRow>
        <FieldRow>
          <Field label="Phone" name="phone" placeholder="+20 100 ..." required />
          <Field label="Vacancy (source)" name="vacancyId" type="select" required
            options={(state.jobs || []).map(j => ({ value: j.id, label: `${j.id} · ${j.title}` }))} />
        </FieldRow>
        <FieldRow>
          <Field label="Initial stage" name="stage" type="select" required options={CANDIDATE_STAGES.filter(s => s !== 'Rejected')} defaultValue="Applied" />
        </FieldRow>
        <FieldRow>
          <Field label="Profile photo" required>
            <input type="file" name="photo" accept="image/png,image/jpeg,image/jpg,image/webp" required style={{padding:'8px 4px', fontSize:12}}/>
          </Field>
          <Field label="Resume / CV" required>
            <input type="file" name="resume" accept=".pdf,.doc,.docx" required style={{padding:'8px 4px', fontSize:12}}/>
          </Field>
        </FieldRow>
      </>
    ),
    onSubmit: async (data) => {
      const [photoDataUrl, resumeDataUrl] = await Promise.all([
        readDataUrl(data.photo),
        readDataUrl(data.resume),
      ]);
      const photoName  = data.photo  instanceof File ? data.photo.name  : null;
      const resumeName = data.resume instanceof File ? data.resume.name : null;
      const vac = vacancyById[data.vacancyId];
      const c = addItem('candidates', {
        name: data.name, email: data.email, phone: data.phone,
        vacancyId: data.vacancyId,
        job: vac?.title || '—',
        stage: data.stage,
        photoDataUrl, photoName,
        resumeDataUrl, resumeName,
        applied: today(), interviewer: null,
      }, 'CAN', {
        action: 'Candidate Added', module: 'Recruitment',
        target: data.vacancyId,
        detail: `${data.name} for ${vac?.title || data.vacancyId} · photo + CV attached`,
      });
      toast(`Candidate ${c.id} added to ${data.vacancyId}`);
    },
  });

  // ───────────────────────────────────────────────────────────────
  // Hire a candidate. "Offer" is just a pipeline stage now — there is no
  // standalone offer entity. Moving a candidate to "Hired" commits the
  // hire and auto-spawns their Onboarding application (linked to the
  // candidate + vacancy). The Employee record is created later, when HR
  // activates that onboarding. No employee record or intro call is created
  // here — the flow is intentionally kept simple.
  // ───────────────────────────────────────────────────────────────
  const hireCandidate = (c) => {
    const vac = c.vacancyId ? vacancyById[c.vacancyId] : (state.jobs || []).find(j => j.title === c.job);
    const existing = (state.onboarding || []).find(a => a.linkedCandidateId === c.id);
    openConfirm({
      title: `Hire ${c.name}?`,
      message: existing
        ? `${c.name} moves to Hired. An onboarding application (${existing.id}) already exists and stays linked.`
        : `${c.name} moves to Hired and an Onboarding application is created automatically. The Employee record is created when HR activates that onboarding.`,
      confirmLabel: 'Confirm hire',
      onConfirm: () => {
        updateItem('candidates', c.id, { stage: 'Hired', hiredAt: today() }, {
          action: 'Candidate Hired', module: 'Recruitment', target: c.id,
          detail: `${c.stage} → Hired`,
        });
        if (existing) { toast(`${c.name} → Hired`); return; }
        const now = new Date().toISOString();
        const app = addItem('onboarding', {
          applicant: c.name, type: 'Agent', date: today(), status: 'Submitted',
          department: vac?.department || 'Sales',
          branch: vac?.location || 'New Cairo',
          photoDataUrl: c.photoDataUrl || null, photoName: c.photoName || null,
          resumeName: c.resumeName || null, resumeDataUrl: c.resumeDataUrl || null,
          phone: c.phone || '', email: c.email || '',
          requestedRole: c.job || vac?.title || 'Sales Agent',
          targetStartDate: null,
          hiringManager: vac?.hiringManager || 'TBD',
          source: c.vacancyId || vac?.id || 'Recruitment',
          linkedCandidateId: c.id, employeeId: null,
          statusHistory: [
            { stage: 'Submitted', at: now, by: `Auto · Candidate hired (${c.id})`, note: `Spawned when ${c.name} was moved to the Hired stage` },
          ],
          notes: '',
        }, 'APP', {
          action: 'Onboarding Application Created', module: 'Backoffice', target: c.id,
          detail: `Auto-spawned when ${c.name} was hired`,
        });
        toast(`${c.name} hired · onboarding ${app.id} created`);
      },
    });
  };

  // Business-team feedback (May 2026): HR moves candidates via stage
  // dropdown, not auto-advance. The function now accepts an arbitrary
  // target stage. Interview prompts for an interviewer; Hired confirms the
  // hire + spawns onboarding; Rejected prompts for a reason; everything
  // else (incl. the Offer stage) is a direct write to the audit log.
  const changeStage = (c, newStage) => {
    if (newStage === c.stage) return;

    if (newStage === 'Rejected') {
      openModal({
        title: `Reject — ${c.name}`, submitLabel: 'Reject', danger: true,
        body: <Field label="Reason" name="reason" type="textarea" required placeholder="Visible in audit trail" />,
        onSubmit: ({ reason }) => {
          updateItem('candidates', c.id, { stage: 'Rejected', rejectionReason: reason }, { action: 'Candidate Rejected', module: 'Recruitment', target: c.id, detail: reason });
          toast(`${c.name} rejected`, 'warning');
        },
      });
      return;
    }

    if (newStage === 'Interview' && c.stage !== 'Interview') {
      openModal({
        title: `Schedule interview — ${c.name}`,
        // Note: no scoring — business team removed score attribute from the
        // hiring flow. We schedule the interview and capture interviewer
        // + notes only.
        subtitle: 'Capture interviewer + date · notes optional',
        submitLabel: 'Schedule & move stage',
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
      return;
    }

    if (newStage === 'Hired' && c.stage !== 'Hired') {
      hireCandidate(c);
      return;
    }

    // Offer is a plain pipeline stage — no offer entity — but the move is
    // captured with a mandatory-friendly note so the offer decision stays
    // logged in the candidate audit trail.
    if (newStage === 'Offer' && c.stage !== 'Offer') {
      openModal({
        title: `Move ${c.name} to Offer`,
        subtitle: 'Add a note for the audit trail — offer terms, salary band, start date, etc.',
        submitLabel: 'Move to Offer',
        body: <Field label="Offer note" name="note" type="textarea" placeholder="Logged in the candidate audit trail (optional)" />,
        onSubmit: ({ note }) => {
          const n = (note || '').trim();
          updateItem('candidates', c.id, { stage: 'Offer' }, {
            action: 'Candidate Stage Change', module: 'Recruitment', target: c.id,
            detail: `${c.stage} → Offer${n ? ` · ${n}` : ''}`,
          });
          toast(`${c.name} → Offer`);
        },
      });
      return;
    }

    updateItem('candidates', c.id, { stage: newStage }, { action: 'Candidate Stage Change', module: 'Recruitment', target: c.id, detail: `${c.stage} → ${newStage} (HR direct)` });
    toast(`${c.name} → ${newStage}`);
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
        {/* Header card with photo */}
        <div style={{display:'flex', alignItems:'center', gap:14, padding:'14px', borderRadius:10, background:'var(--brand-tint)', marginBottom:14}}>
          {c.photoDataUrl ? (
            <img src={c.photoDataUrl} alt="" style={{width:64, height:64, borderRadius:'50%', objectFit:'cover', border:'3px solid #fff', boxShadow:'0 2px 8px rgba(0,0,0,.1)', flexShrink:0}}/>
          ) : (
            <div style={{width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:22, flexShrink:0}}>
              {c.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
            </div>
          )}
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:16, fontWeight:800, color:'var(--text-primary)'}}>{c.name}</div>
            <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:3}}>{c.email || '—'} · {c.phone || '—'}</div>
          </div>
        </div>

        {/* Stage as dropdown (HR-direct change) lives here too so the
            drawer mirrors the row control. Score field removed per business
            review — no scoring is conducted in the hiring flow. */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em', display:'block', marginBottom:6}}>Stage</label>
          <StageSelectInline value={c.stage} onChange={(s) => changeStage(c, s)}/>
        </div>
        <div className="detail-grid">
          {[
            ['ID', c.id],
            ['Vacancy (source)', c.vacancyId ? `${c.vacancyId} (${vacancyById[c.vacancyId]?.title || c.job || '—'})` : (c.job || '—')],
            ['Applied', c.applied],
            ['Interviewer', c.interviewer || '—'],
          ].map(([k, v]) => (
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>
          ))}
        </div>

        {/* Attachments */}
        <div style={{marginTop:18, display:'flex', flexDirection:'column', gap:8}}>
          <div style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em'}}>Attachments</div>
          {c.resumeName ? (
            <a
              href={c.resumeDataUrl || '#'}
              download={c.resumeName}
              onClick={(e) => { if (!c.resumeDataUrl) { e.preventDefault(); toast('CV not available — older record', 'info'); } }}
              style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:12.5, color:'var(--text-primary)', textDecoration:'none', background:'#fafbfc'}}>
              <FileText size={16} color="var(--brand)"/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{c.resumeName}</div>
                <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:1}}>Resume / CV · click to download</div>
              </div>
              <Download size={14} color="var(--text-tertiary)"/>
            </a>
          ) : (
            <div style={{padding:'10px 12px', border:'1px dashed var(--border)', borderRadius:8, fontSize:11, color:'var(--text-tertiary)', textAlign:'center'}}>
              No CV on file
            </div>
          )}
          {!c.photoDataUrl && (
            <div style={{padding:'10px 12px', border:'1px dashed var(--border)', borderRadius:8, fontSize:11, color:'var(--text-tertiary)', textAlign:'center'}}>
              No photo on file
            </div>
          )}
        </div>

        {/* Cross-flow lifecycle chain — shows the full Hire journey
            Candidate → Offer → Onboarding → Employee, with clickable
            pills that jump to each linked record. Renders for every
            candidate so the recruiter can spot which step they're at. */}
        {(() => {
          const linkedOnboarding = (state.onboarding || []).find(a => a.linkedCandidateId === c.id);
          const linkedEmployee  = linkedOnboarding?.employeeId
            ? (state.staff || []).find(s => s.id === linkedOnboarding.employeeId)
            : null;
          return (
            <div style={{marginTop:18, padding:'12px 14px', borderRadius:10, background:'#eff6ff', border:'1px solid #bfdbfe', display:'flex', flexDirection:'column', gap:8}}>
              <div style={{fontSize:10, fontWeight:700, color:'#1e3a8a', textTransform:'uppercase', letterSpacing:'.06em'}}>
                Hire lifecycle chain
              </div>
              <div style={{display:'flex', flexWrap:'wrap', gap:6, alignItems:'center', fontSize:12}}>
                <span style={{padding:'5px 10px', background:'var(--brand-tint)', border:'1px solid rgba(232,103,42,.25)', borderRadius:999, color:'var(--brand)', fontWeight:700}}>
                  Candidate · {c.id} ({c.stage})
                </span>
                <ChevronRight size={12} color="#94a3b8"/>
                {linkedOnboarding ? (
                  <a href="#/backoffice/onboarding" onClick={(e) => { e.preventDefault(); navigate(`/backoffice/onboarding?stage=${encodeURIComponent(linkedOnboarding.status)}`); }} style={{padding:'5px 10px', background:'#fff', border:'1px solid #bfdbfe', borderRadius:999, color:'#1e40af', textDecoration:'none', fontWeight:600}} title="Open in Onboarding pipeline">
                    Onboarding · {linkedOnboarding.id} ({linkedOnboarding.status})
                  </a>
                ) : (
                  <span style={{padding:'5px 10px', color:'var(--text-tertiary)', fontSize:11, fontStyle:'italic'}}>Onboarding · not started</span>
                )}
                <ChevronRight size={12} color="#94a3b8"/>
                {linkedEmployee ? (
                  <a href="#/backoffice/staff" onClick={(e) => { e.preventDefault(); navigate('/backoffice/staff'); }} style={{padding:'5px 10px', background:'#dcfce7', border:'1px solid #86efac', borderRadius:999, color:'#166534', textDecoration:'none', fontWeight:700}} title="Open employee record in Staff Management">
                    Employee · {linkedEmployee.id} ✓
                  </a>
                ) : (
                  <span style={{padding:'5px 10px', color:'var(--text-tertiary)', fontSize:11, fontStyle:'italic'}}>Employee · pending</span>
                )}
              </div>
            </div>
          );
        })()}

        {/* Stage-tagged notes thread + audit activity (SME ask, May 2026) */}
        <CandidatePipelinePanel candidateId={c.id}/>

        {/* Stage transitions are now handled by the dropdown above. The
            Reject button is kept as a quick action because it captures a
            mandatory reason that the stage-change handler routes through. */}
        <div style={{marginTop:18, display:'flex', gap:8, flexWrap:'wrap'}}>
          {c.vacancyId && (
            <button className="btn btn-outline" onClick={() => navigate(`/backoffice/jobs?openVacancy=${c.vacancyId}`)}>
              <Briefcase size={14}/> Open vacancy {c.vacancyId}
            </button>
          )}
          {c.stage !== 'Rejected' && c.stage !== 'Hired' && (
            <button className="btn btn-danger" onClick={() => changeStage(c, 'Rejected')}><X size={14}/> Reject</button>
          )}
        </div>
      </>
    ),
  });

  // ─────────────────────────────────────────────────────────────
  // Recruitment funnel analytics — surfaces conversion, time-to-fill,
  // source-of-hire ROI, and diversity for the HR Recruiter.
  // ─────────────────────────────────────────────────────────────
  const funnelStats = (() => {
    const stages = CANDIDATE_STAGES;
    const counts = Object.fromEntries(stages.map(s => [s, state.candidates.filter(c => c.stage === s).length]));
    const total = state.candidates.length;
    return { stages, counts, total };
  })();
  const conversionPct = funnelStats.total === 0 ? 0 : Math.round(((funnelStats.counts['Offer'] || 0) / funnelStats.total) * 100);

  // Source / Vacancy-of-Hire ROI was removed per business review (May 2026).
  // Since the vacancy IS the source, grouping candidates by vacancy only
  // restates information already visible on the vacancy detail page (the
  // X/Y FILLED badge and per-stage KPI strip). Funnel + time-to-fill are
  // the analytics that add value here.

  // Time-to-fill: average days from applied → hired per role.
  const timeToFill = (() => {
    const out = {};
    (state.jobs || []).forEach(j => {
      const hired = (state.candidates || []).filter(c =>
        c.stage === 'Hired' && (c.vacancyId === j.id || c.job === j.title));
      if (!hired.length) return;
      const days = hired.map(c => {
        if (!c.applied || !c.hiredAt) return null;
        const a = new Date(c.applied), b = new Date(c.hiredAt);
        return Math.max(0, Math.round((b - a) / 86400000));
      }).filter(d => d !== null);
      if (!days.length) return;
      out[j.title] = Math.round(days.reduce((s, d) => s + d, 0) / days.length);
    });
    return out;
  })();

  // Diversity breakdown — gender and age band.
  const diversity = (() => {
    const gender = {}, ageBand = {};
    state.candidates.forEach(c => {
      if (c.gender)  gender[c.gender]   = (gender[c.gender]   || 0) + 1;
      if (c.ageBand) ageBand[c.ageBand] = (ageBand[c.ageBand] || 0) + 1;
    });
    return { gender, ageBand };
  })();

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Candidate Pipeline</span></div>
        <h1 className="page-title">Candidate Pipeline</h1>
        <p className="page-subtitle">Cross-vacancy overview · for per-vacancy management, open the vacancy detail</p>
      </div>

      {/* Business-team feedback (May 2026): the canonical place to manage
          candidates is inside each Job Vacancy. This page remains as a
          cross-vacancy overview so HR can scan everything at once. */}
      <div style={{padding:'12px 16px', background:'var(--brand-tint)', border:'1px solid #fed7aa', borderRadius:10, marginBottom:16, display:'flex', alignItems:'center', gap:12}}>
        <Info size={18} color="#9a3412" style={{flexShrink:0}}/>
        <div style={{fontSize:12, color:'#7c2d12', lineHeight:1.5, flex:1}}>
          <b>Per-vacancy management is the canonical workflow.</b> Add Candidate, stage transitions, and rejections live inside each <b>Job Vacancy</b> detail page so the candidate stays scoped to the vacancy they applied to. This page is an HR-wide overview for funnel + time-to-fill analytics only.
        </div>
        <button className="btn btn-sm btn-outline" onClick={() => navigate('/backoffice/jobs')}>
          <Briefcase size={13}/> Go to Job Vacancies
        </button>
      </div>

      {/* ── Funnel Analytics ─────────────────────────────────── */}
      <RecruitmentAnalytics
        funnel={funnelStats}
        conversionPct={conversionPct}
        timeToFill={timeToFill}
        diversity={diversity}
      />

      <div className="kpi-grid kpi-grid-5">
        {CANDIDATE_STAGES.filter(s=>s!=='Hired').map(s=>(
          <div className="kpi-card" key={s}><div><div className="kpi-label">{s}</div><div className="kpi-value">{pipelineCandidates.filter(c=>c.stage===s).length}</div></div><div className={`kpi-icon ${s==='Offer'?'green':s==='Rejected'?'red':s==='Interview'?'blue':'amber'}`}><span style={{fontSize:18}}>👤</span></div></div>
        ))}
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search candidates..." value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={filterVals.stage} onChange={e=>setFilter('stage', e.target.value)}>
              <option value="">All Stages</option>{CANDIDATE_STAGES.filter(s=>s!=='Hired').map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="data-select" value={filterVals.vacancyId} onChange={e=>setFilter('vacancyId', e.target.value)}>
              <option value="">All Vacancies</option>
              {(state.jobs || []).map(j => <option key={j.id} value={j.id}>{j.id} · {j.title}</option>)}
            </select>
            <button
              className="btn btn-outline"
              onClick={()=>setShowAdv(v=>!v)}
              style={advActive ? {borderColor:'var(--brand)', color:'var(--brand)'} : undefined}
            >
              <Filter size={14}/> Advanced{advActive ? ' · on' : ''}
            </button>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`candidates_${today()}`,finalFiltered); toast(`Exported ${finalFiltered.length}`); writeAudit('Export','Candidates CSV','Recruitment');}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={newCandidate}><Plus size={14}/> Add Candidate</button>
          </div>
        </div>

        {/* Advanced filters panel — applied-date range, interviewer, CV */}
        {showAdv && (
          <div style={{padding:'14px 18px', background:'#fafbfc', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', display:'flex', flexWrap:'wrap', gap:14, alignItems:'flex-end'}}>
            <div>
              <label style={advLabel}>Applied from</label>
              <input type="date" value={adv.appliedFrom} onChange={e=>setAdv(a=>({...a,appliedFrom:e.target.value}))} style={advInput}/>
            </div>
            <div>
              <label style={advLabel}>Applied to</label>
              <input type="date" value={adv.appliedTo} onChange={e=>setAdv(a=>({...a,appliedTo:e.target.value}))} style={advInput}/>
            </div>
            <div>
              <label style={advLabel}>Interviewer</label>
              <select value={adv.interviewer} onChange={e=>setAdv(a=>({...a,interviewer:e.target.value}))} style={advInput}>
                <option value="">Any</option>
                {interviewers.map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={advLabel}>CV on file</label>
              <select value={adv.hasCv} onChange={e=>setAdv(a=>({...a,hasCv:e.target.value}))} style={advInput}>
                <option value="">Any</option><option value="yes">Has CV</option><option value="no">No CV</option>
              </select>
            </div>
            <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:10}}>
              <span style={{fontSize:11, color:'var(--text-tertiary)'}}>{finalFiltered.length} of {filtered.length} shown</span>
              {advActive && <button className="btn btn-outline btn-sm" onClick={clearAdv}>Clear filters</button>}
            </div>
          </div>
        )}
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Vacancy (source)</th><th>Stage</th><th>Applied</th><th>Interviewer</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{finalFiltered.map(c=>{
              const vac = c.vacancyId ? vacancyById[c.vacancyId] : null;
              return (
              <tr key={c.id}>
                <td className="muted">{c.id}</td>
                <td className="bold">
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    {c.photoDataUrl ? (
                      <img src={c.photoDataUrl} alt="" style={{width:32, height:32, borderRadius:'50%', objectFit:'cover', flexShrink:0}}/>
                    ) : (
                      <div style={{width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0}}>
                        {c.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                    )}
                    <div style={{minWidth:0}}>
                      <div>{c.name}</div>
                      {c.resumeName && (
                        <div style={{fontSize:10, color:'var(--text-tertiary)', fontWeight:500, display:'inline-flex', alignItems:'center', gap:3, marginTop:2}}>
                          <FileText size={10}/> CV
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  {vac ? (
                    <div>
                      <div style={{fontWeight:700, fontSize:12}}>{vac.id}</div>
                      <div style={{fontSize:11, color:'var(--text-secondary)'}}>{vac.title}</div>
                    </div>
                  ) : c.vacancyId ? (
                    <span className="muted" style={{fontSize:11}}>{c.vacancyId} (vacancy not found)</span>
                  ) : (
                    <span className="muted" style={{fontSize:11}}>{c.job || '—'}</span>
                  )}
                </td>
                <td><StageSelectInline value={c.stage} onChange={(s) => changeStage(c, s)}/></td>
                <td className="muted">{c.applied}</td>
                <td>{c.interviewer||'—'}</td>
                <td style={{textAlign:'right'}}><div className="row-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>view(c)}><Eye size={13}/> View</button>
                  {c.vacancyId && (
                    <button className="btn btn-outline btn-sm" title="Open vacancy detail" onClick={() => navigate(`/backoffice/jobs?openVacancy=${c.vacancyId}`)}><Briefcase size={13}/></button>
                  )}
                </div></td>
              </tr>
            );})}</tbody>
          </table>
          {finalFiltered.length===0 && <Empty />}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// RecruitmentAnalytics — funnel chart, time-to-fill, diversity stats.
// All client-side derived from state.candidates + state.jobs.
// ═══════════════════════════════════════════════════════════════
const stageColors = {
  Applied:   '#3b82f6',
  Screening: '#f59e0b',
  Interview: '#0ea5e9',
  Offer:     '#10b981',
  Rejected:  '#94a3b8',
};

const RecruitmentAnalytics = ({ funnel, conversionPct, timeToFill, diversity }) => {
  const maxFunnel = Math.max(...Object.values(funnel.counts), 1);
  return (
    <div style={{
      background:'#fff', border:'1px solid var(--border)', borderRadius:14,
      padding:'18px 22px', marginBottom:18,
    }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between', marginBottom:14, gap:14, flexWrap:'wrap'}}>
        <div>
          <h3 style={{fontSize:16, fontWeight:800, color:'var(--text-primary)', display:'flex', alignItems:'center', gap:8}}>
            <Award size={18} color="var(--brand)"/> Recruitment Funnel Analytics
          </h3>
          <p style={{fontSize:11, color:'var(--text-tertiary)', marginTop:4}}>
            Funnel · time-to-fill · diversity — derived from the live candidate pool.
          </p>
        </div>
        <div style={{display:'flex', gap:18, alignItems:'center'}}>
          <Metric label="Total Candidates" value={funnel.total}/>
          <Metric label="Conversion" value={`${conversionPct}%`} color="#10b981"/>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:18}}>
        {/* Funnel bars */}
        <div>
          <h4 style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10}}>Funnel</h4>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {funnel.stages.map(s => {
              const n = funnel.counts[s] || 0;
              const w = Math.round((n / maxFunnel) * 100);
              return (
                <div key={s} style={{display:'grid', gridTemplateColumns:'90px 1fr 32px', alignItems:'center', gap:8, fontSize:11}}>
                  <span style={{color:'var(--text-secondary)', fontWeight:600}}>{s}</span>
                  <div style={{height:18, background:'#f1f5f9', borderRadius:3, overflow:'hidden'}}>
                    <div style={{width:`${w}%`, height:'100%', background: stageColors[s] || '#94a3b8', transition:'width .3s'}}/>
                  </div>
                  <span style={{fontWeight:700, textAlign:'right'}}>{n}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source / Vacancy-of-Hire ROI panel removed (May 2026 review).
            Since the vacancy IS the source, grouping candidates by vacancy
            duplicated information already on the vacancy detail page
            (X/Y FILLED + per-stage KPI strip). */}

        {/* Time to fill + Diversity */}
        <div>
          <h4 style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10}}>Time to Fill (days)</h4>
          {Object.keys(timeToFill).length ? (
            <div style={{display:'flex', flexDirection:'column', gap:5, marginBottom:14}}>
              {Object.entries(timeToFill).map(([role, days]) => (
                <div key={role} style={{display:'flex', justifyContent:'space-between', fontSize:11}}>
                  <span style={{color:'var(--text-secondary)'}}>{role}</span>
                  <span style={{fontWeight:700, color: days > 30 ? '#dc2626' : days > 14 ? '#f59e0b' : '#10b981'}}>{days} days</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{fontSize:11, color:'var(--text-tertiary)', fontStyle:'italic', marginBottom:14}}>No hires yet — move candidates to the Hired stage.</p>
          )}

          <h4 style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>Diversity</h4>
          <div style={{display:'flex', gap:14, fontSize:11, flexWrap:'wrap'}}>
            <DiversityBar label="Gender" data={diversity.gender}/>
            <DiversityBar label="Age band" data={diversity.ageBand}/>
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value, color }) => (
  <div style={{textAlign:'right'}}>
    <div style={{fontSize:10, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', fontWeight:700}}>{label}</div>
    <div style={{fontSize:22, fontWeight:800, color: color || 'var(--text-primary)', marginTop:2, lineHeight:1}}>{value}</div>
  </div>
);

const DiversityBar = ({ label, data }) => {
  const total = Object.values(data).reduce((s, n) => s + n, 0) || 1;
  const palette = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#94a3b8'];
  return (
    <div style={{flex:1, minWidth:120}}>
      <div style={{color:'var(--text-secondary)', fontWeight:600, marginBottom:5}}>{label}</div>
      <div style={{height:10, background:'#f1f5f9', borderRadius:3, overflow:'hidden', display:'flex'}}>
        {Object.entries(data).map(([k, n], i) => {
          const pct = Math.round((n / total) * 100);
          return <div key={k} title={`${k}: ${n} (${pct}%)`} style={{width:`${pct}%`, height:'100%', background: palette[i % palette.length]}}/>;
        })}
      </div>
      <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:4, lineHeight:1.4}}>
        {Object.entries(data).map(([k, n], i) => (
          <span key={k} style={{marginRight:8}}>
            <span style={{display:'inline-block', width:7, height:7, borderRadius:'50%', background: palette[i % palette.length], marginRight:3, verticalAlign:'middle'}}/>
            {k}: {n}
          </span>
        ))}
      </div>
    </div>
  );
};
