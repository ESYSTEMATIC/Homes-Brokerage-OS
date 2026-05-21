// ═══════════════════════════════════════════════════════════════════════
// VacancyCandidates — candidate pipeline embedded inside a Job Vacancy
// ───────────────────────────────────────────────────────────────────────
// Business-team feedback (May 2026):
//   1. Candidate pipeline must live inside the vacancy detail page
//   2. Candidate source = vacancy ID (no separate "Careers Page / LinkedIn"
//      source — the source IS the vacancy the candidate applied to)
//   3. Stage transitions = select dropdown, not auto-advance "Next Step"
//
// This component renders the per-vacancy candidate table with photo, stage
// dropdown, and view/reject actions. Drop it into any vacancy detail
// surface and it self-filters by vacancyId.
// ═══════════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Field, FieldRow } from './UI';
import { Plus, Eye, X, FileText, Users, Download, Filter } from 'lucide-react';
import { CANDIDATE_STAGES } from '../data/staticData';
import { CandidatePipelinePanel } from './PipelineNotes';

// Shared styling for the Advanced filters panel.
const vcAdvLabel = { display:'block', fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4 };
const vcAdvInput = { padding:'6px 10px', border:'1px solid var(--border)', borderRadius:7, fontSize:12, fontFamily:'inherit', outline:'none', minWidth:140 };

const stageColor = (s) =>
  s === 'Offer' ? 'badge-success'
  : s === 'Rejected' ? 'badge-danger'
  : s === 'Interview' ? 'badge-info'
  : s === 'Screening' ? 'badge-warning'
  : 'badge-gray';

// Stage <select> with brand-aware colors — replaces the old "Next Step" button.
const StageSelect = ({ value, onChange, disabled }) => {
  const tone =
    value === 'Offer' ? { bg:'#dcfce7', fg:'#166534', border:'#86efac' }
    : value === 'Rejected' ? { bg:'#fee2e2', fg:'#991b1b', border:'#fca5a5' }
    : value === 'Interview' ? { bg:'#dbeafe', fg:'#1e40af', border:'#93c5fd' }
    : value === 'Screening' ? { bg:'#fef3c7', fg:'#92400e', border:'#fcd34d' }
    : { bg:'#f1f5f9', fg:'#475569', border:'#cbd5e1' };
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        appearance:'none',
        padding:'5px 26px 5px 10px',
        fontSize:11, fontWeight:700,
        background: `${tone.bg} url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23${tone.fg.slice(1)}' stroke-width='3'><polyline points='6 9 12 15 18 9'/></svg>") right 8px center / 10px no-repeat`,
        color: tone.fg,
        border: `1px solid ${tone.border}`,
        borderRadius: 999,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .6 : 1,
        outline:'none',
      }}
      title="Move candidate to a different stage"
    >
      {CANDIDATE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
};

export const VacancyCandidates = ({ vacancy, showAnalytics = false, compact = false }) => {
  const { state, addItem, updateItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [showAdv, setShowAdv] = useState(false);
  const [adv, setAdv] = useState({ appliedFrom: '', appliedTo: '', interviewer: '', hasCv: '' });

  // Match candidates by vacancyId (canonical) with legacy fallback to job
  // title. SME ask (May 2026): hired candidates leave the active pipeline.
  const candidates = (state.candidates || [])
    .filter(c => {
      if (c.vacancyId) return c.vacancyId === vacancy.id;
      if (c.job && vacancy.title) return c.job === vacancy.title;
      return false;
    })
    .filter(c => c.stage !== 'Hired');

  const pipelineStages = CANDIDATE_STAGES.filter(s => s !== 'Hired');
  const interviewerOptions = [...new Set(candidates.map(c => c.interviewer).filter(Boolean))];
  const advActive = !!(adv.appliedFrom || adv.appliedTo || adv.interviewer || adv.hasCv);
  const clearAdv = () => setAdv({ appliedFrom: '', appliedTo: '', interviewer: '', hasCv: '' });

  const filtered = candidates.filter(c => {
    if (search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (stageFilter && c.stage !== stageFilter) return false;
    if (adv.appliedFrom && (c.applied || '') < adv.appliedFrom) return false;
    if (adv.appliedTo   && (c.applied || '') > adv.appliedTo)   return false;
    if (adv.interviewer && c.interviewer !== adv.interviewer)   return false;
    if (adv.hasCv === 'yes' && !c.resumeName) return false;
    if (adv.hasCv === 'no'  &&  c.resumeName) return false;
    return true;
  });

  const counts = pipelineStages.reduce((m, s) => {
    m[s] = candidates.filter(c => c.stage === s).length;
    return m;
  }, {});

  // File→dataURL helper used to persist photo + CV as base64.
  const readDataUrl = (file) => new Promise((resolve) => {
    if (!file || !(file instanceof File) || file.size === 0) return resolve(null);
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => resolve(null);
    fr.readAsDataURL(file);
  });

  // ─── New candidate (per-vacancy) ───────────────────────────────
  // Note: NO source field — the source IS this vacancy (vacancyId).
  const newCandidate = () => openModal({
    title: `Add Candidate · ${vacancy.title}`,
    subtitle: `Application sourced to ${vacancy.id} · photo + CV required`,
    submitLabel: 'Add candidate',
    body: (
      <>
        <FieldRow>
          <Field label="Full Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
        </FieldRow>
        <FieldRow>
          <Field label="Phone" name="phone" placeholder="+20 100 ..." required />
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
        <div style={{padding:'10px 12px', background:'var(--brand-tint)', border:'1px solid #fed7aa', borderRadius:8, fontSize:11, color:'#9a3412', marginTop:8}}>
          <b>Source:</b> {vacancy.id} · {vacancy.title} · {vacancy.location}<br/>
          <span style={{color:'#7c2d12'}}>Application is automatically linked to this vacancy. There is no separate "source" field — the vacancy is the source.</span>
        </div>
      </>
    ),
    onSubmit: async (data) => {
      const [photoDataUrl, resumeDataUrl] = await Promise.all([
        readDataUrl(data.photo),
        readDataUrl(data.resume),
      ]);
      const photoName  = data.photo  instanceof File ? data.photo.name  : null;
      const resumeName = data.resume instanceof File ? data.resume.name : null;
      const c = addItem('candidates', {
        name: data.name, email: data.email, phone: data.phone,
        vacancyId: vacancy.id,
        job: vacancy.title,
        stage: data.stage || 'Applied',
        photoDataUrl, photoName,
        resumeDataUrl, resumeName,
        applied: new Date().toISOString().slice(0,10),
        interviewer: null,
      }, 'CAN', {
        action: 'Candidate Added', module: 'Recruitment',
        target: vacancy.id,
        detail: `${data.name} for ${vacancy.title} (${vacancy.id}) · photo + CV attached`,
      });
      toast(`Candidate ${c.id} added to ${vacancy.id}`);
    },
  });

  // ─── Draft offer flow ──────────────────────────────────────────
  // Re-activated (May 2026): moving a candidate INTO the Offer stage opens
  // the Draft Offer Letter modal and creates an offer record (stage
  // 'Pending Approval'). The offer then flows through the Recruitment
  // Pipeline → Offers panel (HR drafts → Sales Director approves → Sent →
  // Accepted). The salary band comes from this vacancy.
  const draftOffer = (c) => {
    const band = vacancy.salaryBand || null;
    const hasBand = !!(band && (band.min || band.max));
    const midpoint = hasBand ? Math.round(((band.min || 0) + (band.max || 0)) / 2) : 15000;
    openModal({
      title: `Draft Offer Letter — ${c.name}`,
      subtitle: hasBand
        ? `Band: EGP ${(band.min || 0).toLocaleString()}–${(band.max || 0).toLocaleString()} / month`
        : 'No salary band on file for this vacancy',
      submitLabel: 'Save draft + send for approval',
      body: (
        <>
          <FieldRow>
            <Field label="Job Title" name="jobTitle" defaultValue={vacancy.title} required />
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
        const outOfBand = hasBand && ((band.min && sal < band.min) || (band.max && sal > band.max));
        const offer = addItem('offers', {
          candidateId: c.id, candidateName: c.name,
          // Carry the candidate's photo through so HR, the Director, and the
          // offer-letter preview all show the same person.
          photoDataUrl: c.photoDataUrl || null, photoName: c.photoName || null,
          jobId: vacancy.id,
          jobTitle: data.jobTitle, salaryMonthly: sal, currency: 'EGP',
          commission: data.commission, bonus: data.bonus,
          benefits: ["Health insurance", "Microsoft 365", "Homes Academy"],
          startDate: data.startDate, probationMonths: Number(data.probationMonths),
          workSchedule: data.workSchedule, reportingTo: data.reportingTo,
          contractType: 'Full-time, indefinite',
          stage: 'Pending Approval',
          draftedBy: 'HR Recruiter',
          approvedBy: null, approvedAt: null, sentAt: null, expiresAt: null,
          outOfBand: !!outOfBand,
          notes: data.notes,
        }, 'OFR', {
          action: 'Offer Drafted', module: 'Recruitment', target: c.id,
          detail: `${data.jobTitle} · EGP ${sal.toLocaleString()}/mo · pending Sales Director approval${outOfBand ? ' · OUT OF BAND' : ''}`,
        });
        updateItem('candidates', c.id, { stage: 'Offer' });
        toast(`Offer ${offer.id} drafted${outOfBand ? ' (out-of-band — director must justify)' : ''}`, outOfBand ? 'warning' : 'success');
      },
    });
  };

  // ─── Stage change via dropdown ─────────────────────────────────
  // Auto-prompts for an interviewer when moving INTO Interview; auto-spawns
  // an offer draft when moving INTO Offer.
  const changeStage = (c, newStage) => {
    if (newStage === c.stage) return;

    if (newStage === 'Rejected') {
      openModal({
        title: `Reject ${c.name}`,
        submitLabel: 'Reject',
        danger: true,
        body: <Field label="Reason" name="reason" type="textarea" required placeholder="Visible in audit trail" />,
        onSubmit: ({ reason }) => {
          updateItem('candidates', c.id, { stage: 'Rejected', rejectionReason: reason }, { action: 'Candidate Rejected', module: 'Recruitment', target: c.id, detail: reason });
          toast(`${c.name} rejected`, 'warning');
        },
      });
      return;
    }

    if (newStage === 'Interview' && c.stage !== 'Interview') {
      const interviewers = state.staff.filter(s => ['Sales Manager','Team Leader','HR Recruiter'].includes(s.type) || (s.department || '').startsWith('HR')).map(s => s.name);
      openModal({
        title: `Schedule interview · ${c.name}`,
        subtitle: `Vacancy ${vacancy.id} · ${vacancy.title}`,
        submitLabel: 'Schedule & move stage',
        body: (
          <>
            <FieldRow>
              <Field label="Interviewer" name="interviewer" type="select" required options={interviewers} />
              <Field label="Date" name="date" type="date" defaultValue={new Date().toISOString().slice(0,10)} required />
            </FieldRow>
            <Field label="Notes" name="notes" type="textarea" placeholder="Agenda, focus areas…"/>
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

    // All other transitions — straight stage update, audited.
    updateItem('candidates', c.id, { stage: newStage }, { action: 'Candidate Stage Change', module: 'Recruitment', target: c.id, detail: `${c.stage} → ${newStage} (HR direct)` });
    toast(`${c.name} → ${newStage}`);
  };

  // ─── View candidate drawer ─────────────────────────────────────
  const view = (c) => openDrawer({
    title: c.name,
    subtitle: `${c.id} · ${vacancy.id} ${vacancy.title}`,
    content: (
      <>
        <div style={{display:'flex', alignItems:'center', gap:14, padding:14, borderRadius:10, background:'var(--brand-tint)', marginBottom:14}}>
          {c.photoDataUrl ? (
            <img src={c.photoDataUrl} alt="" style={{width:64, height:64, borderRadius:'50%', objectFit:'cover', border:'3px solid #fff', boxShadow:'0 2px 8px rgba(0,0,0,.1)', flexShrink:0}}/>
          ) : (
            <div style={{width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:22, flexShrink:0}}>
              {c.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
            </div>
          )}
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:16, fontWeight:800}}>{c.name}</div>
            <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:3}}>{c.email || '—'} · {c.phone || '—'}</div>
            <div style={{marginTop:8}}>
              <StageSelect value={c.stage} onChange={(s) => changeStage(c, s)}/>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          {[
            ['ID', c.id],
            ['Source', `${vacancy.id} (${vacancy.title})`],
            ['Stage', c.stage],
            ['Applied', c.applied],
            ['Interviewer', c.interviewer || '—'],
          ].map(([k, v]) => (
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>
          ))}
        </div>

        {/* CV / Photo attachments */}
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
            <div style={{padding:'10px 12px', border:'1px dashed var(--border)', borderRadius:8, fontSize:11, color:'var(--text-tertiary)', textAlign:'center'}}>No CV on file</div>
          )}
        </div>

        {c.rejectionReason && (
          <div style={{marginTop:14, padding:'10px 12px', background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, fontSize:12, color:'#991b1b'}}>
            <b>Rejected:</b> {c.rejectionReason}
          </div>
        )}

        {/* Stage-tagged notes thread + audit activity (SME ask, May 2026) */}
        <CandidatePipelinePanel candidateId={c.id}/>
      </>
    ),
  });

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div id="vacancy-candidates" style={{marginTop: compact ? 14 : 20, scrollMarginTop: 90}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:10, flexWrap:'wrap'}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:36, height:36, borderRadius:10, background:'var(--brand-tint)', color:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Users size={18}/>
          </div>
          <div>
            <div style={{fontSize:14, fontWeight:800}}>Candidates for this vacancy</div>
            <div style={{fontSize:11, color:'var(--text-secondary)'}}>
              {candidates.length} application{candidates.length === 1 ? '' : 's'}
              {showAnalytics && Object.entries(counts).filter(([,n]) => n > 0).length > 0 &&
                ` · ${Object.entries(counts).filter(([,n]) => n > 0).map(([s, n]) => `${n} ${s}`).join(' · ')}`
              }
            </div>
          </div>
        </div>
        <div style={{display:'flex', gap:6, alignItems:'center'}}>
          <input
            placeholder="Search by name or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{padding:'7px 10px', border:'1px solid var(--border)', borderRadius:8, fontSize:12, minWidth:160}}
          />
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowAdv(v => !v)}
            style={(advActive || stageFilter) ? {borderColor:'var(--brand)', color:'var(--brand)'} : undefined}
            title="Advanced filters"
          >
            <Filter size={13}/> Advanced
          </button>
          <button className="btn btn-primary btn-sm" onClick={newCandidate}>
            <Plus size={13}/> Add Candidate
          </button>
        </div>
      </div>

      {/* Advanced filters — stage, applied-date range, interviewer, CV */}
      {showAdv && (
        <div style={{padding:'12px 14px', background:'#fafbfc', border:'1px solid var(--border)', borderRadius:10, marginBottom:12, display:'flex', flexWrap:'wrap', gap:12, alignItems:'flex-end'}}>
          <div>
            <label style={vcAdvLabel}>Stage</label>
            <select value={stageFilter} onChange={e=>setStageFilter(e.target.value)} style={vcAdvInput}>
              <option value="">Any stage</option>
              {pipelineStages.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={vcAdvLabel}>Applied from</label>
            <input type="date" value={adv.appliedFrom} onChange={e=>setAdv(a=>({...a,appliedFrom:e.target.value}))} style={vcAdvInput}/>
          </div>
          <div>
            <label style={vcAdvLabel}>Applied to</label>
            <input type="date" value={adv.appliedTo} onChange={e=>setAdv(a=>({...a,appliedTo:e.target.value}))} style={vcAdvInput}/>
          </div>
          <div>
            <label style={vcAdvLabel}>Interviewer</label>
            <select value={adv.interviewer} onChange={e=>setAdv(a=>({...a,interviewer:e.target.value}))} style={vcAdvInput}>
              <option value="">Any</option>
              {interviewerOptions.map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label style={vcAdvLabel}>CV on file</label>
            <select value={adv.hasCv} onChange={e=>setAdv(a=>({...a,hasCv:e.target.value}))} style={vcAdvInput}>
              <option value="">Any</option><option value="yes">Has CV</option><option value="no">No CV</option>
            </select>
          </div>
          <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:10}}>
            <span style={{fontSize:11, color:'var(--text-tertiary)'}}>{filtered.length} of {candidates.length} shown</span>
            {(advActive || stageFilter) && (
              <button className="btn btn-outline btn-sm" onClick={()=>{clearAdv(); setStageFilter('');}}>Clear filters</button>
            )}
          </div>
        </div>
      )}

      {/* Per-stage KPI strip */}
      {showAnalytics && candidates.length > 0 && (
        <div style={{display:'grid', gridTemplateColumns:`repeat(${pipelineStages.length}, 1fr)`, gap:6, marginBottom:12}}>
          {pipelineStages.map(s => {
            const active = stageFilter === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStageFilter(active ? '' : s)}
                title={active ? 'Clear stage filter' : `Show only ${s} candidates`}
                style={{
                  padding:'8px 10px', borderRadius:8, cursor:'pointer',
                  border:`1px solid ${active ? 'var(--brand)' : counts[s] > 0 ? 'var(--border)' : '#f1f5f9'}`,
                  background: active ? 'var(--brand-tint)' : counts[s] > 0 ? '#fff' : '#fafbfc',
                  textAlign:'center',
                }}
              >
                <div style={{fontSize:9, fontWeight:700, color: active ? 'var(--brand)' : 'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em'}}>{s}</div>
                <div style={{fontSize:16, fontWeight:800, color: active ? 'var(--brand)' : counts[s] > 0 ? 'var(--text-primary)' : 'var(--text-tertiary)', marginTop:2}}>{counts[s]}</div>
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{padding:'30px 14px', textAlign:'center', background:'#fafbfc', border:'1px dashed var(--border)', borderRadius:10, color:'var(--text-tertiary)', fontSize:12}}>
          {candidates.length === 0
            ? <>No candidates have applied to <b>{vacancy.id}</b> yet. Use Add Candidate to record an application.</>
            : 'No candidates match the current search or filters.'}
        </div>
      ) : (
        <div style={{border:'1px solid var(--border)', borderRadius:10, overflow:'hidden'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:12.5}}>
            <thead>
              <tr style={{background:'#f8fafc'}}>
                <th style={{textAlign:'left', padding:'10px 12px', fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Candidate</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Applied</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Interviewer</th>
                <th style={{textAlign:'left', padding:'10px 12px', fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Stage (change to move)</th>
                <th style={{textAlign:'right', padding:'10px 12px', fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{borderTop:'1px solid var(--border)'}}>
                  <td style={{padding:'10px 12px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      {c.photoDataUrl ? (
                        <img src={c.photoDataUrl} alt="" style={{width:32, height:32, borderRadius:'50%', objectFit:'cover', flexShrink:0}}/>
                      ) : (
                        <div style={{width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0}}>
                          {c.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                        </div>
                      )}
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:700, color:'var(--text-primary)'}}>{c.name}</div>
                        <div style={{fontSize:10, color:'var(--text-tertiary)', display:'flex', alignItems:'center', gap:6, marginTop:2}}>
                          <span>{c.id}</span>
                          {c.resumeName && <span style={{display:'inline-flex', alignItems:'center', gap:3, color:'var(--brand)', fontWeight:600}}><FileText size={9}/> CV</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'10px 12px', color:'var(--text-secondary)'}}>{c.applied}</td>
                  <td style={{padding:'10px 12px', color:'var(--text-secondary)'}}>{c.interviewer || '—'}</td>
                  <td style={{padding:'10px 12px'}}>
                    <StageSelect value={c.stage} onChange={(s) => changeStage(c, s)}/>
                  </td>
                  <td style={{padding:'10px 12px', textAlign:'right'}}>
                    <button className="btn btn-outline btn-sm" onClick={() => view(c)} style={{marginLeft:6}}>
                      <Eye size={12}/> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
