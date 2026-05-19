import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Plus, Download, Eye, ChevronRight, X, FileText, CheckCircle2, Send, Award, AlertCircle, Briefcase, Info } from 'lucide-react';
import { CANDIDATE_STAGES, OFFER_STAGES } from '../data/staticData';

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
const offerStageColor = s => s==='Accepted'?'badge-success':s==='Declined'||s==='Withdrawn'?'badge-danger':s==='Sent'?'badge-info':s==='Approved'?'badge-info':s==='Pending Approval'?'badge-warning':'badge-gray';

export const RecruitmentPipeline = () => {
  const { state, personaKey, addItem, updateItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const isSalesDirector = personaKey === 'salesDirector';
  const interviewers = state.staff.filter(s=>['Sales Manager','Team Leader','HR Recruiter'].includes(s.type) || s.department.startsWith('HR')).map(s=>s.name);

  const navigate = useNavigate();
  const { q, setQ, filterVals, setFilter, filtered } = useTableState(state.candidates, {
    searchKeys: ['name', 'job', 'vacancyId', 'id'],
    filters: { stage: 'stage', vacancyId: 'vacancyId' },
  });
  const vacancyById = (state.jobs || []).reduce((m, j) => { m[j.id] = j; return m; }, {});

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
  // Offer workflow (HR drafts → Sales Director approves → Sent → Accepted)
  // Salary stays in this HR-internal surface — never on the agent profile.
  // ───────────────────────────────────────────────────────────────
  const matchingBand = (jobTitle) => {
    const j = state.jobs.find(x => x.title === jobTitle);
    return j?.salaryBand || null;
  };

  const draftOffer = (c) => {
    const band = matchingBand(c.job);
    const midpoint = band ? Math.round((band.min + band.max) / 2) : 15000;
    openModal({
      title: `Draft Offer Letter — ${c.name}`,
      subtitle: band ? `Band: EGP ${band.min.toLocaleString()}–${band.max.toLocaleString()} / month` : 'No salary band on file',
      submitLabel: 'Save draft + send for approval',
      body: (
        <>
          <FieldRow>
            <Field label="Job Title" name="jobTitle" defaultValue={c.job} required />
            <Field label="Start date" name="startDate" type="date" defaultValue={(() => { const d = new Date(); d.setDate(d.getDate() + 21); return d.toISOString().slice(0,10); })()} required />
          </FieldRow>
          <FieldRow>
            <Field label="Salary (EGP / month)" name="salaryMonthly" type="number" defaultValue={midpoint} required />
            <Field label="Probation (months)" name="probationMonths" type="number" defaultValue={3} required />
          </FieldRow>
          <Field label="Commission structure" name="commission" type="textarea" placeholder="e.g. Uncapped, 0.5% of deal value at Standard Collection (10%)" defaultValue={band?.commission || ''} />
          <Field label="Sign-on / bonuses" name="bonus" type="textarea" placeholder="e.g. EGP 5,000 sign-on after probation" />
          <FieldRow>
            <Field label="Work schedule" name="workSchedule" defaultValue="Sun–Thu, 9am–6pm" />
            <Field label="Reports to" name="reportingTo" defaultValue={state.staff.find(s => s.type === 'Sales Manager')?.name || ''} />
          </FieldRow>
          <Field label="HR Notes" name="notes" type="textarea" placeholder="Reasoning for salary placement, fast-track flags, etc." />
        </>
      ),
      onSubmit: (data) => {
        const sal = Number(data.salaryMonthly);
        const outOfBand = band && (sal < band.min || sal > band.max);
        const offer = addItem('offers', {
          candidateId: c.id, candidateName: c.name,
          // Carry the candidate's photo through to the offer so HR, the
          // Director, and the offer-letter preview all show the same person.
          photoDataUrl: c.photoDataUrl || null, photoName: c.photoName || null,
          jobId: state.jobs.find(j => j.title === c.job)?.id,
          jobTitle: data.jobTitle, salaryMonthly: sal, currency: 'EGP',
          commission: data.commission, bonus: data.bonus,
          benefits: ["Health insurance", "Microsoft 365", "Homes Academy"],
          startDate: data.startDate, probationMonths: Number(data.probationMonths),
          workSchedule: data.workSchedule, reportingTo: data.reportingTo,
          contractType: 'Full-time, indefinite',
          stage: 'Pending Approval',
          draftedBy: 'HR Recruiter',
          approvedBy: null, approvedAt: null, sentAt: null, expiresAt: null,
          outOfBand,
          notes: data.notes,
        }, 'OFR', {
          action: 'Offer Drafted', module: 'Recruitment', target: c.id,
          detail: `${data.jobTitle} · EGP ${sal.toLocaleString()}/mo · pending Sales Director approval${outOfBand ? ' · OUT OF BAND' : ''}`
        });
        updateItem('candidates', c.id, { stage: 'Offer' });
        toast(`Offer ${offer.id} drafted${outOfBand ? ' (out-of-band — director must justify)' : ''}`, outOfBand ? 'warning' : 'success');
      },
    });
  };

  const approveOffer = (offer) => openModal({
    title: `Approve offer — ${offer.candidateName}`,
    subtitle: `${offer.jobTitle} · EGP ${offer.salaryMonthly.toLocaleString()}/mo${offer.outOfBand ? ' · OUT OF BAND' : ''}`,
    submitLabel: 'Approve',
    body: (
      <>
        {offer.outOfBand && (
          <div style={{padding:'10px 12px', background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:8, fontSize:12, color:'#92400e', marginBottom:12}}>
            <AlertCircle size={13} style={{verticalAlign:'-2px', marginRight:6}}/>
            Salary is outside the published band. Approval requires justification.
          </div>
        )}
        <Field label={offer.outOfBand ? 'Justification (required)' : 'Approval note (optional)'} name="note" type="textarea" required={offer.outOfBand} />
      </>
    ),
    onSubmit: ({ note }) => {
      updateItem('offers', offer.id, {
        stage: 'Approved',
        approvedBy: 'Sales Director',
        approvedAt: new Date().toISOString().slice(0,10),
        approvalNote: note,
      }, { action: 'Offer Approved', module: 'Recruitment', target: offer.id, detail: note || `${offer.candidateName} approved` });
      toast(`Offer ${offer.id} approved`);
    },
  });

  const sendOffer = (offer) => openConfirm({
    title: `Send offer to ${offer.candidateName}?`,
    message: `An offer email will be sent. The candidate has 7 days to respond.`,
    confirmLabel: 'Send offer',
    onConfirm: () => {
      const expires = new Date(); expires.setDate(expires.getDate() + 7);
      updateItem('offers', offer.id, {
        stage: 'Sent',
        sentAt: new Date().toISOString().slice(0,10),
        expiresAt: expires.toISOString().slice(0,10),
      }, { action: 'Offer Sent', module: 'Recruitment', target: offer.id, detail: offer.candidateName });
      toast(`Offer sent to ${offer.candidateName}`);
    },
  });

  const candidateResponse = (offer, response) => openConfirm({
    title: `Mark offer as ${response}?`,
    message: response === 'Accepted'
      ? `${offer.candidateName} will move to Onboarding queue.`
      : `${offer.candidateName} will be marked as declined.`,
    confirmLabel: response,
    danger: response !== 'Accepted',
    onConfirm: () => {
      updateItem('offers', offer.id, { stage: response, respondedAt: new Date().toISOString().slice(0,10) },
        { action: `Offer ${response}`, module: 'Recruitment', target: offer.id, detail: offer.candidateName });
      if (response === 'Accepted') {
        updateItem('candidates', offer.candidateId, { stage: 'Offer' });
        // Spawn an onboarding application pre-filled from the candidate + offer.
        const cand = state.candidates.find(c => c.id === offer.candidateId);
        const job  = state.jobs.find(j => j.id === offer.jobId);
        const now  = new Date().toISOString();
        const today = now.slice(0, 10);
        const newApp = addItem('onboarding', {
          applicant: offer.candidateName,
          type: 'Agent',
          date: today,
          status: 'Submitted',
          department: job?.department || 'Sales',
          branch: job?.location || 'New Cairo',
          // Carry photo + CV through from candidate (or fall back to offer).
          photoDataUrl: cand?.photoDataUrl || offer.photoDataUrl || null,
          photoName:    cand?.photoName    || offer.photoName    || null,
          resumeName:   cand?.resumeName   || null,
          resumeDataUrl:cand?.resumeDataUrl|| null,
          phone: cand?.phone || '',
          email: cand?.email || '',
          requestedRole: offer.jobTitle,
          targetStartDate: offer.startDate,
          hiringManager: offer.reportingTo || job?.hiringManager || 'TBD',
          source: cand?.source || 'Careers Page',
          linkedCandidateId: offer.candidateId,
          linkedOfferId: offer.id,
          employeeId: null,
          statusHistory: [
            { stage: 'Submitted', at: now, by: `Auto · Offer accepted (${offer.id})`, note: `Spawned from accepted offer for ${offer.jobTitle}` },
          ],
          notes: `Salary: EGP ${offer.salaryMonthly?.toLocaleString()}/mo · Start ${offer.startDate}`,
        }, 'APP', {
          action: 'Onboarding Application Created',
          module: 'Backoffice',
          target: offer.candidateId,
          detail: `Auto-spawned from accepted offer ${offer.id}`,
        });
        toast(`${offer.candidateName} accepted — Onboarding application ${newApp.id} created`);
      } else {
        toast(`${offer.candidateName} declined the offer`, 'warning');
      }
    },
  });

  const previewOffer = (offer) => openDrawer({
    title: `Offer Letter · ${offer.id}`,
    subtitle: `${offer.candidateName} · ${offer.jobTitle}`,
    content: <OfferLetterPreview offer={offer} />,
  });

  // Business-team feedback (May 2026): HR moves candidates via stage
  // dropdown, not auto-advance. The function now accepts an arbitrary
  // target stage. Interview prompts for an interviewer; Offer launches the
  // draft-offer flow; Rejected prompts for a reason; everything else is a
  // direct write to the audit log.
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

    if (newStage === 'Offer' && c.stage !== 'Offer') {
      draftOffer(c);
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

        {/* Stage transitions are now handled by the dropdown above. The
            Reject button is kept as a quick action because it captures a
            mandatory reason that the stage-change handler routes through. */}
        <div style={{marginTop:18, display:'flex', gap:8, flexWrap:'wrap'}}>
          {c.vacancyId && (
            <button className="btn btn-outline" onClick={() => navigate(`/backoffice/jobs?openVacancy=${c.vacancyId}`)}>
              <Briefcase size={14}/> Open vacancy {c.vacancyId}
            </button>
          )}
          {c.stage !== 'Rejected' && (
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

  // Time-to-fill: average days from applied → offer per role.
  const timeToFill = (() => {
    const out = {};
    state.jobs.forEach(j => {
      const offered = (state.offers || []).filter(o => o.jobId === j.id && ['Approved','Sent','Accepted'].includes(o.stage));
      if (!offered.length) return;
      const days = offered.map(o => {
        const cand = state.candidates.find(c => c.id === o.candidateId);
        if (!cand) return 0;
        const a = new Date(cand.applied), b = new Date(o.approvedAt || o.sentAt || new Date());
        return Math.max(0, Math.round((b - a) / 86400000));
      });
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
            <select className="data-select" value={filterVals.vacancyId} onChange={e=>setFilter('vacancyId', e.target.value)}>
              <option value="">All Vacancies</option>
              {(state.jobs || []).map(j => <option key={j.id} value={j.id}>{j.id} · {j.title}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`candidates_${today()}`,filtered); toast(`Exported ${filtered.length}`); writeAudit('Export','Candidates CSV','Recruitment');}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={newCandidate}><Plus size={14}/> Add Candidate</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Vacancy (source)</th><th>Stage</th><th>Applied</th><th>Interviewer</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>{filtered.map(c=>{
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
          {filtered.length===0 && <Empty />}
        </div>
      </div>

      {/* ─── OFFERS PANEL ─────────────────────────────────────────── */}
      <div className="data-panel" style={{marginTop:24}}>
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:'var(--brand-tint)',color:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <FileText size={18}/>
              </div>
              <div>
                <div style={{fontWeight:700, fontSize:15, color:'var(--text-primary)'}}>Offers</div>
                <div style={{fontSize:12, color:'var(--text-secondary)'}}>HR drafts → Sales Director approves → Sent → Accepted</div>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            {state.salaryBands && (
              <button className="btn btn-outline" onClick={() => openDrawer({
                title: 'Salary Band Reference',
                subtitle: `${state.salaryBands.length} bands · governance matrix`,
                content: <SalaryBandReference bands={state.salaryBands}/>,
              })}><Award size={14}/> Salary bands</button>
            )}
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr>
              <th>ID</th><th>Candidate</th><th>Role</th><th>Salary (EGP)</th>
              <th>Stage</th><th>Drafted By</th><th>Approved By</th><th>Sent</th>
              <th style={{textAlign:'right'}}>Actions</th>
            </tr></thead>
            <tbody>
              {(state.offers || []).map(o => (
                <tr key={o.id}>
                  <td className="muted">{o.id}</td>
                  <td className="bold">
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      {o.photoDataUrl ? (
                        <img src={o.photoDataUrl} alt="" style={{width:30, height:30, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'1px solid var(--border)'}}/>
                      ) : (
                        <div style={{width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0}}>
                          {(o.candidateName || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                        </div>
                      )}
                      <span>{o.candidateName}</span>
                    </div>
                  </td>
                  <td>{o.jobTitle}</td>
                  <td className="bold">
                    {o.salaryMonthly?.toLocaleString()} / mo
                    {o.outOfBand && <span className="badge badge-warning" style={{marginLeft:6}}>OUT OF BAND</span>}
                  </td>
                  <td><span className={`badge ${offerStageColor(o.stage)}`}>{o.stage}</span></td>
                  <td className="muted">{o.draftedBy}</td>
                  <td className="muted">{o.approvedBy || '—'}</td>
                  <td className="muted">{o.sentAt || '—'}</td>
                  <td style={{textAlign:'right'}}><div className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => previewOffer(o)}><Eye size={13}/> Preview</button>
                    {o.stage === 'Pending Approval' && isSalesDirector && (
                      <button className="btn btn-primary btn-sm" onClick={() => approveOffer(o)}><CheckCircle2 size={13}/> Approve</button>
                    )}
                    {o.stage === 'Pending Approval' && !isSalesDirector && (
                      <span style={{fontSize:11, color:'var(--text-tertiary)', fontStyle:'italic'}}>Awaiting Director</span>
                    )}
                    {o.stage === 'Approved' && (
                      <button className="btn btn-primary btn-sm" onClick={() => sendOffer(o)}><Send size={13}/> Send</button>
                    )}
                    {o.stage === 'Sent' && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => candidateResponse(o, 'Accepted')}>Mark Accepted</button>
                        <button className="btn btn-danger btn-sm" onClick={() => candidateResponse(o, 'Declined')}>Mark Declined</button>
                      </>
                    )}
                  </div></td>
                </tr>
              ))}
              {!(state.offers || []).length && (
                <tr><td colSpan={9} style={{textAlign:'center', padding:24, color:'var(--text-tertiary)'}}>
                  No offers yet — advance a candidate to Offer to draft one.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// OfferLetterPreview — printable offer letter
// ═══════════════════════════════════════════════════════════════
const OfferLetterPreview = ({ offer }) => {
  const printLetter = () => {
    const w = window.open('', '_blank', 'width=820,height=900');
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Offer Letter — ${offer.candidateName}</title>
      <style>
        body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width:760px; margin:40px auto; padding:0 40px; color:#0f172a; line-height:1.65;}
        h1{font-size:22px; color:#e50914; margin:0 0 4px;}
        h2{font-size:14px; color:#64748b; font-weight:600; margin:0 0 30px; letter-spacing:.04em; text-transform:uppercase;}
        h3{font-size:14px; margin:24px 0 8px; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:4px;}
        p{margin:8px 0; font-size:13px;}
        table{width:100%; border-collapse:collapse; margin-top:8px; font-size:13px;}
        td{padding:6px 0; border-bottom:1px solid #f1f5f9; vertical-align:top;}
        td:first-child{color:#64748b; width:38%;}
        ul{margin:8px 0; padding-left:20px; font-size:13px;}
        .sig{margin-top:60px; display:flex; justify-content:space-between;}
        .sig div{width:46%; border-top:1px solid #94a3b8; padding-top:8px; font-size:12px; color:#475569;}
        @media print { body{margin:0;} button{display:none!important;} }
      </style></head><body>
      <button onclick="window.print()" style="position:fixed;top:20px;right:20px;background:#e50914;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:700;cursor:pointer;">Print / Save PDF</button>
      <h1>Homes Brokerage</h1>
      <h2>Offer of Employment</h2>
      <p>Dear ${offer.candidateName},</p>
      <p>We are pleased to extend the following offer of employment to you for the position of <b>${offer.jobTitle}</b> at Homes Brokerage.</p>
      <h3>Compensation</h3>
      <table>
        <tr><td>Base salary</td><td><b>EGP ${offer.salaryMonthly?.toLocaleString()} / month</b></td></tr>
        <tr><td>Commission</td><td>${offer.commission || '—'}</td></tr>
        <tr><td>Bonus / Sign-on</td><td>${offer.bonus || '—'}</td></tr>
      </table>
      <h3>Role & Schedule</h3>
      <table>
        <tr><td>Reports to</td><td>${offer.reportingTo || '—'}</td></tr>
        <tr><td>Work schedule</td><td>${offer.workSchedule || '—'}</td></tr>
        <tr><td>Start date</td><td>${offer.startDate || '—'}</td></tr>
        <tr><td>Probation</td><td>${offer.probationMonths || 3} months</td></tr>
        <tr><td>Contract type</td><td>${offer.contractType || 'Full-time, indefinite'}</td></tr>
      </table>
      <h3>Benefits</h3>
      <ul>${(offer.benefits || []).map(b => `<li>${b}</li>`).join('')}</ul>
      <h3>Response Deadline</h3>
      <p>This offer expires on <b>${offer.expiresAt || '— (not sent yet)'}</b>. Please respond by replying to careers@homes.com.eg or signing this letter electronically.</p>
      <div class="sig">
        <div>Sales Director, Homes Brokerage<br/>${offer.approvedBy || '________________'}</div>
        <div>Candidate signature<br/>${offer.candidateName}</div>
      </div>
      </body></html>`);
    w.document.close();
  };

  const f = (v) => v || '—';
  return (
    <div>
      {/* Candidate header card */}
      <div style={{display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:12, background:'linear-gradient(135deg, var(--brand-tint), #fff)', marginBottom:14, border:'1px solid var(--border)'}}>
        {offer.photoDataUrl ? (
          <img src={offer.photoDataUrl} alt="" style={{width:60, height:60, borderRadius:'50%', objectFit:'cover', border:'3px solid #fff', boxShadow:'0 4px 12px rgba(0,0,0,.12)', flexShrink:0}}/>
        ) : (
          <div style={{width:60, height:60, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:20, flexShrink:0}}>
            {(offer.candidateName || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
          </div>
        )}
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:16, fontWeight:800, color:'var(--text-primary)'}}>{offer.candidateName}</div>
          <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:3}}>{offer.jobTitle}</div>
        </div>
      </div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:10, background:'var(--brand-tint)', marginBottom:14}}>
        <div>
          <div style={{fontSize:11, fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'.06em'}}>{offer.stage}</div>
          <div style={{fontSize:14, fontWeight:700, marginTop:2}}>EGP {offer.salaryMonthly?.toLocaleString()} / month {offer.outOfBand && <span style={{color:'#92400e', fontSize:11, marginLeft:6}}>· OUT OF BAND</span>}</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={printLetter}><FileText size={13}/> Print / Save PDF</button>
      </div>

      <div className="detail-grid">
        {[
          ['Job', offer.jobTitle],
          ['Start date', offer.startDate],
          ['Probation', `${offer.probationMonths || 3} months`],
          ['Reports to', offer.reportingTo],
          ['Schedule', offer.workSchedule],
          ['Drafted by', offer.draftedBy],
          ['Approved by', f(offer.approvedBy)],
          ['Sent', f(offer.sentAt)],
          ['Expires', f(offer.expiresAt)],
        ].map(([k,v])=>(
          <div key={k}><label>{k}</label><div className="v">{v}</div></div>
        ))}
      </div>

      <div style={{marginTop:14}}>
        <div style={{fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:6}}>Commission</div>
        <div style={{fontSize:13}}>{f(offer.commission)}</div>
      </div>
      <div style={{marginTop:12}}>
        <div style={{fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:6}}>Bonus / Sign-on</div>
        <div style={{fontSize:13}}>{f(offer.bonus)}</div>
      </div>
      <div style={{marginTop:12}}>
        <div style={{fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:6}}>Benefits</div>
        <ul style={{margin:0, paddingLeft:18, fontSize:13, lineHeight:1.7}}>
          {(offer.benefits || []).map(b => <li key={b}>{b}</li>)}
        </ul>
      </div>
      {offer.notes && (
        <div style={{marginTop:14, padding:'10px 12px', background:'#f8fafc', borderRadius:8, fontSize:12, color:'var(--text-secondary)'}}>
          <b>HR notes:</b> {offer.notes}
        </div>
      )}
      {offer.approvalNote && (
        <div style={{marginTop:8, padding:'10px 12px', background:'#ecfdf5', borderRadius:8, fontSize:12, color:'#047857'}}>
          <b>Director approval:</b> {offer.approvalNote}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// RecruitmentAnalytics — funnel chart, source ROI, time-to-fill,
// diversity stats. All client-side derived from state.candidates +
// state.offers + state.jobs.
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
            <p style={{fontSize:11, color:'var(--text-tertiary)', fontStyle:'italic', marginBottom:14}}>No offers yet — advance candidates to Offer stage.</p>
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

const SalaryBandReference = ({ bands }) => (
  <div>
    <p style={{fontSize:12, color:'var(--text-secondary)', marginBottom:12}}>
      Governance matrix — any offer outside these bands requires Sales Director justification.
    </p>
    <table className="data-table">
      <thead><tr><th>Family</th><th>Level</th><th style={{textAlign:'right'}}>Min</th><th style={{textAlign:'right'}}>Max</th></tr></thead>
      <tbody>
        {bands.map(b => (
          <tr key={b.id}>
            <td className="bold">{b.family}</td>
            <td>{b.level}</td>
            <td style={{textAlign:'right'}}>EGP {b.min.toLocaleString()}</td>
            <td style={{textAlign:'right'}}>EGP {b.max.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
