// ═══════════════════════════════════════════════════════════════════════
// Onboarding & Applications — full rebuild (Wave J, May 2026)
// ───────────────────────────────────────────────────────────────────────
// Replaces the thin original page with:
//   • Pipeline funnel (clickable stages with counts).
//   • Enriched KPI strip (active · time-to-activate · stalled · activated · rate).
//   • View tabs (All / Active / Stalled / Activated recent / Withdrawn).
//   • Smart filter chips (missing docs · training incomplete · ready to activate).
//   • Bulk actions (activate · withdraw · remind) via row checkboxes.
//   • Drawer with 3 tabs (Overview / Timeline / Checklist).
//   • Auto-progression banner when checklist hits 100 %.
//   • Employee record ACTIVATION on Activate (candidate was approved upstream).
//   • Candidate→Onboarding linkage banner.
// ═══════════════════════════════════════════════════════════════════════
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Field, FieldRow, Empty } from '../components/UI';
import { ExportMenu } from '../components/ExportMenu';
import { StageNotesThread } from '../components/PipelineNotes';

const ONBOARDING_COLUMNS = [
  { key: 'id',             label: 'ID' },
  { key: 'applicant',      label: 'Applicant' },
  { key: 'requestedRole',  label: 'Role', format: (v, r) => v || r.type },
  { key: 'department',     label: 'Department' },
  { key: 'branch',         label: 'Branch' },
  { key: 'status',         label: 'Stage' },
  { key: 'source',         label: 'Source' },
  { key: 'date',           label: 'Submitted' },
  { key: 'targetStartDate',label: 'Target Start' },
  { key: 'hiringManager',  label: 'Hiring Manager' },
  { key: 'directHire',     label: 'Direct hire', format: v => v ? 'Yes' : 'No' },
  { key: 'linkedOfferId',  label: 'Offer ID', format: v => v || '—' },
];
import {
  FileText, Clock, CheckCircle, XCircle, Plus, Download, Eye, ChevronRight,
  ListChecks, Mail, Bell, GraduationCap, ShieldCheck, KeyRound, Briefcase,
  AlertTriangle, Phone, Calendar, User, Link2, Sparkles, Filter, MessageSquare,
  Users, BarChart3, RefreshCw, CheckSquare,
} from 'lucide-react';
import { APPLICATION_STATUS, APPLICATION_STAGE_META } from '../data/staticData';

// ───────────────── helpers ─────────────────
const today = () => new Date().toISOString().split('T')[0];
const nowISO = () => new Date().toISOString();

// Build a CV preview HTML document for an applicant on the fly. Used when
// the seed record has resumeName but resumeDataUrl is null (older records)
// so the recruiter can still preview the candidate's profile inline.
// Returns an object URL the iframe can src to.
const buildCvDataUrl = (a) => {
  const esc = (s) => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const role = esc(a.requestedRole || a.type || 'Candidate');
  const dept = esc(a.department || 'Sales');
  const branch = esc(a.branch || 'Cairo HQ');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>CV — ${esc(a.applicant)}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #fff; line-height: 1.55; }
  .hdr { display:flex; gap:18px; align-items:center; padding-bottom: 18px; border-bottom: 3px solid #E8672A; margin-bottom: 22px; }
  .hdr img { width: 84px; height: 84px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,.1); }
  .hdr-meat h1 { font-size: 26px; font-weight: 800; margin: 0; color: #0f172a; }
  .hdr-meat .role { font-size: 14px; color: #475569; margin-top: 4px; }
  .hdr-meat .contact { font-size: 12px; color: #64748b; margin-top: 6px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: #E8672A; margin: 22px 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  .row { font-size: 13px; padding: 4px 0; }
  .row b { color: #0f172a; font-weight: 600; }
  .row span { color: #475569; }
  .pill { display: inline-block; padding: 3px 10px; border-radius: 999px; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; margin-top: 4px; }
  .stub { background: #fff7ed; border: 1px dashed #fdba74; padding: 10px 14px; border-radius: 8px; color: #9a3412; font-size: 12px; margin-top: 18px; }
  ul { margin: 4px 0 0 18px; padding: 0; font-size: 13px; color: #334155; }
  li { padding: 2px 0; }
</style></head>
<body>
  <div class="hdr">
    ${a.photoDataUrl ? `<img src="${esc(a.photoDataUrl)}" alt=""/>` : ''}
    <div class="hdr-meat">
      <h1>${esc(a.applicant)}</h1>
      <div class="role">${role} · ${dept}</div>
      <div class="contact">${esc(a.email || '—')} · ${esc(a.phone || '—')} · ${branch}</div>
      ${a.directHire ? '<div class="pill">DIRECT HIRE</div>' : a.linkedOfferId ? '<div class="pill" style="background:#dcfce7;color:#166534">OFFER ' + esc(a.linkedOfferId) + '</div>' : ''}
    </div>
  </div>

  <h2>Professional Summary</h2>
  <div class="row"><span>Experienced ${role.toLowerCase()} candidate applying for a position in the ${dept} department at Homes EG. Submitted application on ${esc(a.date || '—')} with a target start date of ${esc(a.targetStartDate || '—')}. Sourced via ${esc(a.source || 'direct')}.</span></div>

  <h2>Application Details</h2>
  <div class="row"><b>Application ID:</b> <span>${esc(a.id)}</span></div>
  <div class="row"><b>Stage:</b> <span>${esc(a.status)}</span></div>
  <div class="row"><b>Requested Role:</b> <span>${role}</span></div>
  <div class="row"><b>Department / Branch:</b> <span>${dept} · ${branch}</span></div>
  <div class="row"><b>Hiring Manager:</b> <span>${esc(a.hiringManager || '—')}</span></div>
  <div class="row"><b>Source:</b> <span>${esc(a.source || '—')}</span></div>
  ${a.linkedCandidateId ? `<div class="row"><b>Candidate ID:</b> <span>${esc(a.linkedCandidateId)}</span></div>` : ''}
  ${a.linkedOfferId    ? `<div class="row"><b>Offer ID:</b>     <span>${esc(a.linkedOfferId)}</span></div>` : ''}

  <h2>Notes from Recruiter</h2>
  <div class="row"><span>${esc(a.notes || 'No recruiter notes recorded yet.')}</span></div>

  ${!a.resumeDataUrl ? '<div class="stub"><b>Note:</b> The original CV file for this candidate was not migrated with the application record. This preview is generated from the structured candidate data on file. To view the original document, contact the HR team for the source file.</div>' : ''}

</body></html>`;
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
};

const daysSince = (iso) => {
  if (!iso) return 0;
  return Math.floor((new Date() - new Date(iso)) / 86400000);
};

const lastStageEntry = (a) => (a.statusHistory && a.statusHistory.length)
  ? a.statusHistory[a.statusHistory.length - 1]
  : { at: a.date + 'T00:00:00', stage: a.status, by: 'System', note: '' };

const stageColor  = (stage) => APPLICATION_STAGE_META[stage]?.color || '#94a3b8';
const stageMeta   = (stage) => APPLICATION_STAGE_META[stage] || { order: 0, slaDays: 0, owner: 'System', help: '' };

const badgeColorForStage = (stage) => {
  if (stage === 'Activated') return 'badge-success';
  if (stage === 'Withdrawn') return 'badge-danger';
  if (stage === 'Documents Pending') return 'badge-warning';
  if (stage === 'Final Approval')    return 'badge-info';
  return 'badge-info';
};

// Required documents + training (same as before for checklist computation).
const REQUIRED_DOCS = ['National ID', 'Education Certificate', 'RERA License', 'Contract Agreement'];
const REQUIRED_TRAINING_IDS = ['CRS-001', 'CRS-002', 'CRS-003', 'CRS-004'];

const computeChecklist = (applicant, documents, training) => {
  const applicantDocs = (documents || []).filter(d => d.agent === applicant.applicant);
  const hasAllRequired = REQUIRED_DOCS.every(t => applicantDocs.some(d => d.doc === t && d.status === 'Approved'));
  const reraDoc = applicantDocs.find(d => d.doc === 'RERA License');
  const reraOk  = reraDoc?.status === 'Approved';

  const completedTraining = (training || []).filter(c => REQUIRED_TRAINING_IDS.includes(c.id) && c.status === 'Completed');
  const trainingPct = Math.round((completedTraining.length / REQUIRED_TRAINING_IDS.length) * 100);

  // Stages further down the funnel imply earlier steps are complete.
  const stageOrder = stageMeta(applicant.status).order;
  const appReviewed = stageOrder >= 2;            // Past Submitted
  const m365Done    = applicant.status === 'Activated';
  const welcomeDone = applicant.status === 'Activated';

  const stateMap = {
    application: appReviewed,
    documents:   hasAllRequired,
    rera:        reraOk,
    training:    trainingPct === 100 || stageOrder >= 5,
    m365:        m365Done,
    welcome:     welcomeDone,
  };
  const done = Object.values(stateMap).filter(Boolean).length;
  return { state: stateMap, done, total: 6, trainingPct };
};

const CHECKLIST_STEPS = [
  { key: 'application', label: 'Application reviewed',         icon: FileText,     owner: 'HR' },
  { key: 'documents',   label: 'Required documents on file',   icon: ShieldCheck,  owner: 'HR' },
  { key: 'rera',        label: 'RERA license verified',        icon: Briefcase,    owner: 'HR' },
  { key: 'training',    label: 'Mandatory training complete',  icon: GraduationCap, owner: 'Academy' },
  { key: 'm365',        label: 'M365 + CRM access provisioned', icon: KeyRound,    owner: 'IT' },
  { key: 'welcome',     label: 'Welcome kit delivered',        icon: Mail,         owner: 'HR' },
];

// Onboarding-record provenance — aligned with the hiring flow (May 2026):
// the SOURCE is the originating vacancy ID, plus two non-vacancy values
// for paths that bypass the careers funnel.
//   • <vacancy ID>      — auto-spawned from an accepted offer on this vacancy
//   • 'Direct Hire'     — HR created the onboarding directly (no offer)
//   • 'Internal Transfer'— moved internally between teams / branches
// The source is read-only when set from offer-accept; HR picks it manually
// only when filing a direct hire / transfer.
const NON_VACANCY_SOURCES = ['Direct Hire', 'Internal Transfer'];

// ═══════════════════════════════════════════════════════════════════════
// Main Onboarding page
// ═══════════════════════════════════════════════════════════════════════
export const Onboarding = () => {
  const { state, addItem, updateItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const applicants = state.onboarding || [];

  // URL-driven deep-link state: ?tab=stalled · ?stage=Documents Pending · ?chip=ready
  // Lets the Super Admin / HR cockpit pre-filter the pipeline when navigating.
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'active';
  const initialChip = searchParams.get('chip') || null;
  const initialQ = searchParams.get('stage') || '';

  const [tab, setTab] = useState(initialTab); // all | active | stalled | activated | withdrawn
  const [q, setQ] = useState(initialQ);
  const [filterType, setFilterType] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [chip, setChip] = useState(initialChip); // missing-docs | training-incomplete | ready
  const [selected, setSelected] = useState(new Set());

  // Sync incoming URL changes (e.g. user navigates from one cockpit link to
  // another) into the state so the pipeline re-filters live.
  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab && newTab !== tab) setTab(newTab);
    const newChip = searchParams.get('chip');
    if (newChip !== chip) setChip(newChip || null);
    const newStage = searchParams.get('stage');
    if (newStage && newStage !== q) setQ(newStage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ─── KPI calculations ─────────────────────────────────────────
  const activeStatuses = ['Submitted','Under Review','Documents Pending','Training In Progress','Final Approval'];

  const activatedAll = applicants.filter(a => a.status === 'Activated');
  const last30 = new Date(); last30.setDate(last30.getDate() - 30);
  const activatedRecent = activatedAll.filter(a => {
    const activatedAt = a.statusHistory?.find(s => s.stage === 'Activated')?.at;
    return activatedAt && new Date(activatedAt) >= last30;
  });

  const avgTimeToActivate = (() => {
    const days = activatedAll
      .map(a => {
        const submitted = a.statusHistory?.find(s => s.stage === 'Submitted')?.at;
        const activated = a.statusHistory?.find(s => s.stage === 'Activated')?.at;
        if (!submitted || !activated) return null;
        return Math.round((new Date(activated) - new Date(submitted)) / 86400000);
      })
      .filter(d => d !== null);
    if (!days.length) return null;
    return Math.round(days.reduce((s,d) => s+d, 0) / days.length);
  })();

  const stalled = applicants.filter(a => {
    if (!activeStatuses.includes(a.status)) return false;
    const last = lastStageEntry(a);
    const sla  = stageMeta(a.status).slaDays;
    return daysSince(last.at) > sla;
  });

  const activationRate = (() => {
    const decisioned = activatedAll.length + applicants.filter(a => a.status === 'Withdrawn').length;
    if (!decisioned) return 0;
    return Math.round((activatedAll.length / decisioned) * 100);
  })();

  // ─── Funnel counts ────────────────────────────────────────────
  const funnel = Object.keys(APPLICATION_STAGE_META)
    .filter(s => s !== 'Withdrawn')
    .sort((a,b) => APPLICATION_STAGE_META[a].order - APPLICATION_STAGE_META[b].order)
    .map(s => ({ stage: s, count: applicants.filter(a => a.status === s).length, meta: APPLICATION_STAGE_META[s] }));

  // ─── Filtering pipeline ───────────────────────────────────────
  const visible = applicants.filter(a => {
    // Tab filter
    if (tab === 'active'    && !activeStatuses.includes(a.status)) return false;
    if (tab === 'stalled'   && !stalled.includes(a)) return false;
    if (tab === 'activated' && !activatedRecent.includes(a)) return false;
    if (tab === 'withdrawn' && a.status !== 'Withdrawn') return false;
    // Smart chip
    if (chip) {
      const cl = computeChecklist(a, state.documents, state.training);
      if (chip === 'missing-docs' && cl.state.documents) return false;
      if (chip === 'training-incomplete' && cl.state.training) return false;
      if (chip === 'ready' && (cl.done < 5 || a.status === 'Activated')) return false;
    }
    // Type/Dept filters
    if (filterType && a.type !== filterType) return false;
    if (filterDept && a.department !== filterDept) return false;
    // Text search
    if (q) {
      const hay = `${a.applicant} ${a.id} ${a.department} ${a.branch} ${a.requestedRole || ''} ${a.email || ''} ${a.phone || ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const allChecked = visible.length > 0 && visible.every(a => selected.has(a.id));
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(visible.map(a => a.id)));
  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  // ─── Workflow handlers ────────────────────────────────────────
  const advanceStage = (a, byUser = 'HR Recruiter') => {
    const next = stageMeta(a.status).next;
    if (!next) { toast('Already at final stage', 'info'); return; }
    pushStatus(a, next, byUser, `Advanced from ${a.status}`);
  };

  const pushStatus = (a, stage, by, note) => {
    const newEntry = { stage, at: nowISO(), by, note };
    const history = [...(a.statusHistory || []), newEntry];
    const patch = { status: stage, statusHistory: history };
    if (stage === 'Activated') {
      // Business rule (May 2026): the employee record is created upstream
      // when the candidate accepts the HR offer (status='Pending Onboarding').
      // 'Activated' here ACTIVATES that record (status → 'Active') — it does
      // NOT approve a candidate. Direct-hire / legacy rows without an
      // employeeId still get a new staff record so the flow stays robust.
      let empId = a.employeeId;
      if (empId) {
        updateItem('staff', empId, { status: 'Active', linkedOnboardingId: a.id, activatedAt: nowISO() }, {
          action: 'Employee Activated',
          module: 'Backoffice',
          target: empId,
          detail: `${a.applicant} · onboarding ${a.id} completed (activated)`,
        });
      } else {
        // Fallback: no upstream employee record (direct hire or legacy seed).
        const fallbackId = `A${String((state.staff || []).length + 1).padStart(3, '0')}`;
        addItem('staff', {
          name: a.applicant,
          department: a.department,
          title: a.requestedRole || 'Sales Agent',
          branch: a.branch,
          manager: a.hiringManager || 'Sales Manager',
          status: 'Active',
          type: 'Employee',
          email: a.email || `${a.applicant.toLowerCase().replace(/\s+/g,'.')}@homesbrokerage.eg`,
          phone: a.phone || '',
          joinDate: today(),
          photoDataUrl: a.photoDataUrl || null,
          photoName: a.photoName || null,
          linkedOnboardingId: a.id,
          linkedOfferId:      a.linkedOfferId || null,
          linkedCandidateId:  a.linkedCandidateId || null,
        }, 'A', {
          action: 'Employee Created',
          module: 'Backoffice',
          target: a.id,
          detail: `${a.applicant} · direct-hire fallback · from onboarding ${a.id}`,
        });
        empId = fallbackId;
        patch.employeeId = empId;
      }

      // 2) Cascade to the linked candidate → 'Hired' so they don't sit at
      //    'Offer' in the recruitment pipeline forever.
      if (a.linkedCandidateId) {
        updateItem('candidates', a.linkedCandidateId, { stage: 'Hired', hiredAt: nowISO(), hiredEmployeeId: empId }, {
          action: 'Candidate Hired',
          module: 'Recruitment',
          target: a.linkedCandidateId,
          detail: `Auto-cascade from onboarding ${a.id} activation · employee ${empId}`,
        });
      }
      // 3) Cascade to the linked offer → 'Onboarded' so the offer record
      //    closes out cleanly and stops appearing in the 'Accepted, awaiting
      //    onboarding' bucket.
      if (a.linkedOfferId) {
        updateItem('offers', a.linkedOfferId, { stage: 'Onboarded', onboardedAt: nowISO(), linkedOnboardingId: a.id, linkedEmployeeId: empId }, {
          action: 'Offer Onboarded',
          module: 'Recruitment',
          target: a.linkedOfferId,
          detail: `Cascade from onboarding ${a.id} · employee ${empId}`,
        });
      }
    } else if (stage === 'Withdrawn' && a.employeeId) {
      // Mirror the activation cancellation on the upstream employee record
      // so it doesn't sit at 'Pending Onboarding' forever.
      updateItem('staff', a.employeeId, { status: 'Withdrawn', withdrawnAt: nowISO(), withdrawnReason: note || 'Onboarding cancelled' }, {
        action: 'Employee Onboarding Withdrawn',
        module: 'Backoffice',
        target: a.employeeId,
        detail: `${a.applicant} · onboarding ${a.id} withdrew before activation`,
      });
    }
    updateItem('onboarding', a.id, patch, {
      action: stage === 'Activated' ? 'Onboarding Activated'
            : stage === 'Withdrawn' ? 'Onboarding Withdrawn'
            : 'Onboarding Advanced',
      module: 'Backoffice', target: a.id,
      detail: note,
    });
    toast(stage === 'Activated'
      ? (a.employeeId
          ? `${a.applicant} activated · employee ${a.employeeId} → Active · candidate → Hired · offer → Onboarded`
          : `${a.applicant} activated · employee created · candidate → Hired · offer → Onboarded`)
      : `${a.applicant} → ${stage}`);
  };

  const activate = (a) => openConfirm({
    title: `Activate ${a.applicant}?`,
    message: a.employeeId
      ? `Employee ${a.employeeId} (currently Pending Onboarding) will be activated (status → Active). The candidate moves to Hired and the offer closes as Onboarded. Audit-logged.`
      : `An Employee record will be created and activated (no upstream offer link — direct-hire fallback). Audit-logged.`,
    confirmLabel: a.employeeId ? 'Activate employee' : 'Create & activate employee',
    onConfirm: () => pushStatus(a, 'Activated', 'HR Recruiter', 'Activated'),
  });

  const withdraw = (a) => openModal({
    title: `Withdraw ${a.applicant}`,
    subtitle: 'Onboarding will close without activation. The candidate was already approved upstream — this only records that activation did not complete.',
    submitLabel: 'Mark withdrawn',
    danger: true,
    body: <Field label="Reason" name="reason" type="textarea" required placeholder="e.g. candidate declined start date, role restructured, failed background check" />,
    onSubmit: ({ reason }) => pushStatus(a, 'Withdrawn', 'HR Recruiter', reason),
  });

  const sendReminder = (a) => {
    const owner = stageMeta(a.status).owner;
    writeAudit('Reminder Sent', a.id, 'Backoffice', `${a.status} · ${owner}`);
    toast(`Reminder sent · ${owner}`);
  };

  // ─── Bulk actions ─────────────────────────────────────────────
  const bulkActivate = () => openConfirm({
    title: `Activate ${selected.size} onboarding${selected.size === 1 ? '' : 's'}?`,
    message: 'Upstream employee records (status=Pending Onboarding) will be flipped to Active. Direct hires with no upstream record get one created.',
    confirmLabel: 'Bulk activate',
    onConfirm: () => {
      Array.from(selected).forEach(id => {
        const a = applicants.find(x => x.id === id);
        if (a && a.status !== 'Activated' && a.status !== 'Withdrawn') pushStatus(a, 'Activated', 'HR Recruiter (bulk)', 'Bulk activated');
      });
      setSelected(new Set());
    },
  });
  const bulkWithdraw = () => openModal({
    title: `Withdraw ${selected.size} onboarding${selected.size === 1 ? '' : 's'}`,
    subtitle: 'Each onboarding closes without activation. Reason applied to all.',
    submitLabel: 'Bulk withdraw',
    danger: true,
    body: <Field label="Reason" name="reason" type="textarea" required placeholder="Applied to all selected" />,
    onSubmit: ({ reason }) => {
      Array.from(selected).forEach(id => {
        const a = applicants.find(x => x.id === id);
        if (a && a.status !== 'Activated' && a.status !== 'Withdrawn') pushStatus(a, 'Withdrawn', 'HR Recruiter (bulk)', reason);
      });
      setSelected(new Set());
    },
  });
  const bulkRemind = () => {
    Array.from(selected).forEach(id => {
      const a = applicants.find(x => x.id === id);
      if (a) sendReminder(a);
    });
    setSelected(new Set());
  };

  // ─── Direct-hire bypass modal ─────────────────────────────────
  // The canonical onboarding entry point is the offer-accept flow on the
  // Recruitment Pipeline (candidate → offer → accepted → onboarding
  // auto-created). This button is a manual bypass for special cases —
  // executive direct hires, internal transfers, partner placements — where
  // there was no public Careers application. The form warns HR before they
  // proceed and writes "Direct hire (bypassed recruitment)" into the
  // statusHistory so the source is auditable.
  const newApplication = () => openModal({
    title: 'Direct Hire · Bypass Recruitment',
    subtitle: 'For special cases only · the normal flow is Candidate → Offer Accepted → auto-spawn onboarding',
    submitLabel: 'Create onboarding (bypass)',
    danger: true,
    body: (
      <>
        <div style={{padding:'10px 12px', background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:8, fontSize:12, color:'#92400e', marginBottom:16, lineHeight:1.5}}>
          <b>Heads up:</b> Onboarding usually begins automatically when a candidate accepts their offer in the Recruitment Pipeline.
          Use this form only for direct hires that didn't go through the public Careers application (executive direct hires, internal transfers, partner placements). The audit log will record "Direct hire (bypassed recruitment)" on the resulting record.
        </div>
        <FieldRow>
          <Field label="Full Name" name="applicant" required />
          <Field label="Type" name="type" type="select" required options={['Agent','Employee']} />
        </FieldRow>
        <FieldRow>
          <Field label="Phone" name="phone" placeholder="+20 100 ..." required />
          <Field label="Email" name="email" type="email" required />
        </FieldRow>
        <FieldRow>
          <Field label="Department" name="department" type="select" required options={state.departments.map(d => d.name)} />
          <Field label="Branch"     name="branch"     type="select" required options={state.branches.map(b => b.name)} />
        </FieldRow>
        <FieldRow>
          <Field label="Requested Role" name="requestedRole" placeholder="e.g. Senior Sales Agent" required />
          <Field label="Hiring Manager" name="hiringManager" required defaultValue={state.staff.find(s => s.type === 'Sales Manager')?.name || ''} />
        </FieldRow>
        <FieldRow>
          <Field
            label="Source (vacancy or path)"
            name="source"
            type="select"
            required
            defaultValue="Direct Hire"
            options={[
              ...(state.jobs || []).filter(j => j.status === 'Published').map(j => ({ value: j.id, label: `${j.id} — ${j.title}` })),
              ...NON_VACANCY_SOURCES.map(s => ({ value: s, label: s })),
            ]}
          />
          <Field label="Target Start Date" name="targetStartDate" type="date" />
        </FieldRow>
        <Field label="Notes" name="notes" type="textarea" placeholder="Anything HR should know — fast track, referral context, etc." />
      </>
    ),
    onSubmit: (data) => {
      const c = addItem('onboarding', {
        ...data,
        date: today(),
        status: 'Submitted',
        linkedCandidateId: null, linkedOfferId: null, employeeId: null,
        directHire: true, // flag so the row can be visually marked as bypass
        statusHistory: [
          { stage: 'Submitted', at: nowISO(), by: 'HR Recruiter', note: 'Direct hire (bypassed recruitment) — no offer accepted in the system' },
        ],
      }, 'APP', {
        action: 'Application Submitted',
        module: 'Backoffice',
        detail: `${data.applicant} · ${data.requestedRole}`,
      });
      toast(`Application ${c.id} created`);
    },
  });

  // ─── Drawer (3 tabs) ──────────────────────────────────────────
  const viewApplicant = (a) => openDrawer({
    title: a.applicant,
    subtitle: `${a.id} · ${a.requestedRole || a.type} · ${a.status}`,
    content: <ApplicantDrawer
      applicant={a}
      documents={state.documents}
      training={state.training}
      candidates={state.candidates}
      offers={state.offers}
      onActivate={() => activate(a)}
      onWithdraw={() => withdraw(a)}
      onAdvance={() => advanceStage(a)}
      onStageChange={(s) => pushStatus(a, s, 'HR Recruiter', `Stage changed to ${s}`)}
      onReminder={() => sendReminder(a)}
      onAutoActivate={() => pushStatus(a, 'Activated', 'HR Recruiter (auto · 100% checklist)', 'Auto-activated · checklist complete')}
    />,
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Onboarding & Applications</h1>
        <p className="page-subtitle">Starts when a candidate accepts their offer · ends when the Employee record is created</p>
      </div>

      {/* ─── Flow explainer banner ────────────────────────────
          Makes the candidate/offer/onboarding boundary explicit so HR doesn't
          conflate the Recruitment Pipeline (no system account yet) with
          Onboarding (account journey begins after offer accepted). */}
      <div style={{
        display:'flex', alignItems:'center', gap:14,
        padding:'14px 18px', marginBottom:18,
        background:'linear-gradient(90deg, #eff6ff, #fafbfc)',
        border:'1px solid #bfdbfe', borderRadius:12,
      }}>
        <div style={{width:38, height:38, borderRadius:10, background:'#3b82f6', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
          <ListChecks size={18}/>
        </div>
        <div style={{flex:1, fontSize:12, color:'#1e3a8a', lineHeight:1.55}}>
          <b>How onboarding starts:</b> a candidate has <b>no system account</b> while they're in the Recruitment Pipeline. Once they accept their offer there, an Employee record is created with <b>status&nbsp;= Pending&nbsp;Onboarding</b> and an onboarding application is spawned here. The final <b>Activate</b> step flips that record to <b>Active</b> (system credentials, CRM access, M365 mailbox provisioned). No re-approval happens here — the candidate decision was already made.
          <span style={{color:'#1e40af', marginLeft:6, fontStyle:'italic'}}>Direct Hire bypass below is reserved for special cases.</span>
        </div>
      </div>

      {/* ─── PIPELINE FUNNEL ──────────────────────────────── */}
      <PipelineFunnel
        funnel={funnel}
        applicants={applicants}
        activeStage={null}
        onClickStage={(stage) => { setTab('all'); setChip(null); setQ(stage); }}
      />

      {/* ─── KPI STRIP ────────────────────────────────────── */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <Kpi
          label="Active applicants"
          value={applicants.filter(a => activeStatuses.includes(a.status)).length}
          icon={Users}
          color="#3b82f6"
          footer={`${applicants.length} total in the pipeline`}
        />
        <Kpi
          label="Time to activate"
          value={avgTimeToActivate !== null ? `${avgTimeToActivate}d` : '—'}
          icon={Clock}
          color="#0ea5e9"
          tip="Average days from Submitted to Activated across all activated applicants."
          footer={avgTimeToActivate !== null ? `Target: ≤ 14 days` : 'No activations yet'}
          delta={avgTimeToActivate !== null && avgTimeToActivate <= 14 ? { dir:'up', value: 'on target' } : avgTimeToActivate !== null ? { dir: 'down', value: 'over target' } : null}
        />
        <Kpi
          label="Stalled"
          value={stalled.length}
          icon={AlertTriangle}
          color="#f59e0b"
          tip="Applicants whose current status exceeds the SLA for that stage."
          onClick={() => setTab('stalled')}
          footer={stalled.length > 0 ? 'Click to view & remind' : 'All on track'}
        />
        <Kpi
          label="Activated (30d)"
          value={activatedRecent.length}
          icon={CheckCircle}
          color="#10b981"
          onClick={() => setTab('activated')}
          footer={`Employees activated this month`}
        />
        <Kpi
          label="Activation rate"
          value={`${activationRate}%`}
          icon={BarChart3}
          color="#8b5cf6"
          tip="Activated / (Activated + Withdrawn) — across all closed onboardings."
          footer={`${activatedAll.length} activated · ${applicants.filter(a => a.status === 'Withdrawn').length} withdrawn`}
          delta={activationRate >= 70 ? { dir: 'up', value: 'healthy' } : activationRate > 0 ? { dir: 'down', value: 'low' } : null}
        />
      </div>

      {/* ─── VIEW TABS ────────────────────────────────────── */}
      <div style={{display:'flex', gap:6, marginBottom:14, flexWrap:'wrap'}}>
        {[
          ['all',       'All',              applicants.length],
          ['active',    'Active',           applicants.filter(a => activeStatuses.includes(a.status)).length],
          ['stalled',   'Stalled',          stalled.length],
          ['activated', 'Activated (30d)',  activatedRecent.length],
          ['withdrawn', 'Withdrawn',        applicants.filter(a => a.status === 'Withdrawn').length],
        ].map(([k, lbl, n]) => (
          <button
            key={k}
            onClick={() => { setTab(k); setChip(null); setSelected(new Set()); }}
            style={{
              padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer',
              border: `1px solid ${tab === k ? 'var(--brand)' : 'var(--border)'}`,
              background: tab === k ? 'var(--brand)' : '#fff',
              color: tab === k ? '#fff' : 'var(--text-secondary)',
            }}>
            {lbl} <span style={{opacity:.7, marginLeft:4}}>· {n}</span>
          </button>
        ))}
      </div>

      {/* ─── SMART CHIPS ──────────────────────────────────── */}
      <div style={{display:'flex', gap:6, marginBottom:14, flexWrap:'wrap', alignItems:'center'}}>
        <span style={{fontSize:11, color:'var(--text-tertiary)', fontWeight:600, marginRight:4}}><Filter size={11} style={{verticalAlign:'-2px'}}/> Quick filters:</span>
        {[
          ['missing-docs',         'Missing documents'],
          ['training-incomplete',  'Training incomplete'],
          ['ready',                'Ready to activate'],
        ].map(([k, lbl]) => (
          <button
            key={k}
            onClick={() => setChip(chip === k ? null : k)}
            style={{
              padding:'5px 12px', borderRadius:999, fontSize:11, fontWeight:600, cursor:'pointer',
              border: `1px solid ${chip === k ? 'var(--brand)' : 'var(--border)'}`,
              background: chip === k ? 'var(--brand-tint)' : '#fff',
              color: chip === k ? 'var(--brand)' : 'var(--text-secondary)',
            }}>
            {lbl}
          </button>
        ))}
        {chip && <button onClick={() => setChip(null)} style={{fontSize:11, color:'var(--text-tertiary)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline'}}>Clear</button>}
      </div>

      {/* ─── DATA PANEL ───────────────────────────────────── */}
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input
              className="data-search"
              placeholder="Search by name, role, email, phone, ID…"
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{minWidth:260}}
            />
            <select className="data-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">All types</option><option>Agent</option><option>Employee</option>
            </select>
            <select className="data-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="">All departments</option>
              {state.departments.map(d => <option key={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div style={{display:'flex', gap:8}}>
            <ExportMenu
              rows={visible}
              columns={ONBOARDING_COLUMNS}
              filename="onboarding_pipeline"
              title="Onboarding Pipeline Export"
              subtitle={`Tab: ${tab} · ${visible.length} applicant${visible.length === 1 ? '' : 's'}`}
              size="md"
            />
            <button
              className="btn btn-outline"
              onClick={newApplication}
              title="Bypass the candidate / offer flow — only for direct executive hires, internal transfers, or partner placements"
              style={{borderStyle:'dashed'}}
            >
              <Plus size={14}/> Direct Hire (bypass)
            </button>
          </div>
        </div>

        {/* Bulk action hint — when nothing selected, give users a clear
            affordance that multi-select bulk actions exist (audit feedback). */}
        {selected.size === 0 && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'8px 18px', background:'#f8fafc', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)',
            fontSize:11, color:'var(--text-tertiary)',
          }}>
            <span style={{display:'inline-flex', alignItems:'center', gap:6}}>
              <CheckSquare size={12}/> <b>Tip:</b> tick rows to enable bulk Remind · Activate · Withdraw
            </span>
            <span style={{fontSize:10}}>Up to {visible.length} applicants selectable</span>
          </div>
        )}

        {/* Bulk action bar — only when rows are selected */}
        {selected.size > 0 && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'10px 18px',
            background:'linear-gradient(135deg, var(--brand-tint), #fff)',
            borderTop:'2px solid var(--brand)', borderBottom:'1px solid var(--border)',
            position:'sticky', top: 0, zIndex: 5,
          }}>
            <div style={{fontSize:12, fontWeight:700, color:'var(--brand)', display:'inline-flex', alignItems:'center', gap:6}}>
              <CheckSquare size={14}/> {selected.size} applicant{selected.size === 1 ? '' : 's'} selected · choose a bulk action →
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn btn-outline btn-sm" onClick={bulkRemind}><Bell size={13}/> Remind</button>
              <button className="btn btn-success btn-sm" onClick={bulkActivate}><CheckCircle size={13}/> Activate</button>
              <button className="btn btn-danger btn-sm" onClick={bulkWithdraw}><XCircle size={13}/> Withdraw</button>
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(new Set())}>Clear</button>
            </div>
          </div>
        )}

        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:36}}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                </th>
                <th>ID</th>
                <th>Applicant</th>
                <th>Role</th>
                <th>Source</th>
                <th>Status</th>
                <th>Time in status</th>
                <th>Checklist</th>
                <th style={{textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(a => {
                const last     = lastStageEntry(a);
                const days     = daysSince(last.at);
                const sla      = stageMeta(a.status).slaDays;
                const breached = sla > 0 && days > sla;
                const checklist = computeChecklist(a, state.documents, state.training);
                const pct = Math.round((checklist.done / checklist.total) * 100);
                return (
                  <tr
                    key={a.id}
                    onClick={() => viewApplicant(a)}
                    style={{cursor:'pointer'}}
                    className="onboarding-row-clickable"
                    title="Open applicant details"
                  >
                    <td onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleOne(a.id)} />
                    </td>
                    <td className="muted">{a.id}</td>
                    <td>
                      <div style={{display:'flex', alignItems:'center', gap:10}}>
                        {a.photoDataUrl ? (
                          <img src={a.photoDataUrl} alt="" style={{width:32, height:32, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${stageColor(a.status)}`}}/>
                        ) : (
                          <div style={{
                            width:32, height:32, borderRadius:'50%',
                            background:`linear-gradient(135deg, ${stageColor(a.status)}, ${stageColor(a.status)}99)`,
                            color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:11, fontWeight:700, flexShrink:0,
                          }}>
                            {a.applicant.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                          </div>
                        )}
                        <div style={{minWidth:0}}>
                          <div className="bold" style={{display:'flex', alignItems:'center', gap:6}}>
                            {a.applicant}
                            {a.directHire && (
                              <span title="Direct hire — bypassed recruitment / offer flow" style={{fontSize:8, fontWeight:700, padding:'1px 5px', borderRadius:4, background:'#fef3c7', color:'#92400e', textTransform:'uppercase', letterSpacing:'.05em'}}>
                                Direct
                              </span>
                            )}
                            {a.linkedOfferId && (
                              <span title={`Spawned from offer ${a.linkedOfferId}`} style={{fontSize:8, fontWeight:700, padding:'1px 5px', borderRadius:4, background:'#ecfdf5', color:'#065f46', textTransform:'uppercase', letterSpacing:'.05em'}}>
                                Offer
                              </span>
                            )}
                          </div>
                          <div style={{fontSize:10, color:'var(--text-tertiary)', display:'flex', alignItems:'center', gap:6}}>
                            <span>{a.email || a.phone || '—'}</span>
                            {a.resumeName && (
                              <span style={{display:'inline-flex', alignItems:'center', gap:3, color:'var(--brand)', fontWeight:600}}>
                                <FileText size={10}/> CV
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{a.requestedRole || a.type}</td>
                    <td className="muted">{a.source || '—'}</td>
                    <td><span className={`badge ${badgeColorForStage(a.status)}`}>{a.status}</span></td>
                    <td>
                      <div style={{display:'flex', alignItems:'center', gap:6}}>
                        <span style={{fontSize:12, fontWeight:600, color: breached ? '#dc2626' : 'var(--text-primary)'}}>{days}d</span>
                        {breached && <span title={`SLA ${sla}d breached`} style={{
                          padding:'2px 6px', borderRadius:4, fontSize:9, fontWeight:700,
                          background:'#fef2f2', color:'#dc2626', textTransform:'uppercase', letterSpacing:'.05em',
                        }}>SLA</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <div style={{flex:1, height:6, background:'#f1f5f9', borderRadius:3, overflow:'hidden', minWidth:60}}>
                          <div style={{width:`${pct}%`, height:'100%', background: pct === 100 ? '#10b981' : 'var(--brand)'}}/>
                        </div>
                        <span style={{fontSize:11, fontWeight:600, color:'var(--text-secondary)', minWidth:32}}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{textAlign:'right'}} onClick={e => e.stopPropagation()}>
                      <div className="row-actions" style={{display:'inline-flex',alignItems:'center',gap:6,flexWrap:'wrap',justifyContent:'flex-end'}}>
                        <button className="btn btn-outline btn-sm" onClick={() => viewApplicant(a)}><Eye size={13}/> View</button>
                        {!['Activated','Withdrawn'].includes(a.status) && (
                          <select
                            value={a.status}
                            onChange={(e) => {
                              const s = e.target.value;
                              if (s === a.status) return;
                              if (s === 'Activated') activate(a);
                              else if (s === 'Withdrawn') withdraw(a);
                              else pushStatus(a, s, 'HR Recruiter', `Stage changed to ${s} (row action)`);
                            }}
                            title="Change stage"
                            style={{
                              padding:'4px 22px 4px 10px',
                              fontSize:11, fontWeight:700,
                              background:`${stageColor(a.status)}15`,
                              color:stageColor(a.status),
                              border:`1px solid ${stageColor(a.status)}55`,
                              borderRadius:6, cursor:'pointer',
                              height:28,
                            }}
                          >
                            {APPLICATION_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 && <Empty message="No applications match this view." />}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PipelineFunnel — connected horizontal stage flow with conversion %
// ───────────────────────────────────────────────────────────────────────
// True pipeline visualization: each stage is a node, arrows between them,
// and the inter-stage drop-off rate is computed from statusHistory so HR
// can see "of those who entered Documents Pending, what % reached Final
// Approval?" at a glance.
// ═══════════════════════════════════════════════════════════════════════
const PipelineFunnel = ({ funnel, applicants, activeStage, onClickStage }) => {
  const totalEver = applicants.length || 1;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
      border: '1px solid var(--border)', borderRadius: 16,
      padding: '20px 22px', marginBottom: 18,
    }}>
      <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:18, flexWrap:'wrap'}}>
        <div style={{
          width:40, height:40, borderRadius:10,
          background:'linear-gradient(135deg, var(--brand), #b91c1c)',
          color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 12px rgba(229,9,20,.25)',
        }}>
          <Sparkles size={18}/>
        </div>
        <div>
          <h3 style={{fontSize:15, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.01em'}}>Application Pipeline</h3>
          <p style={{fontSize:11, color:'var(--text-tertiary)', marginTop:3}}>
            {totalEver} total applications · click a stage to filter below
          </p>
        </div>
      </div>

      {/* Stage row with connectors */}
      <div style={{
        display:'flex', alignItems:'stretch', gap: 0, position:'relative',
        overflowX:'auto', paddingBottom: 6,
      }}>
        {funnel.map((f, i) => {
          const isActive = activeStage === f.stage;
          const next = funnel[i + 1];
          return (
            <React.Fragment key={f.stage}>
              <button
                onClick={() => onClickStage(f.stage)}
                style={{
                  flex: 1, minWidth: 130,
                  display:'flex', flexDirection:'column', alignItems:'center',
                  gap: 8, padding:'14px 10px',
                  background: isActive
                    ? `linear-gradient(180deg, ${f.meta.color}1a 0%, ${f.meta.color}05 100%)`
                    : '#fff',
                  border: `1px solid ${isActive ? f.meta.color : 'var(--border)'}`,
                  borderRadius: 12, cursor:'pointer',
                  boxShadow: isActive ? `0 0 0 1px ${f.meta.color} inset` : 'none',
                  transition: 'all .15s',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = ''; } }}
              >
                {/* Big number */}
                <div style={{
                  width:54, height:54, borderRadius:'50%',
                  background:`linear-gradient(135deg, ${f.meta.color} 0%, ${f.meta.color}cc 100%)`,
                  color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:22, fontWeight:800,
                  boxShadow:`0 4px 12px ${f.meta.color}55`,
                }}>
                  {f.count}
                </div>
                <div style={{fontSize:12, fontWeight:700, color:'var(--text-primary)', textAlign:'center', lineHeight:1.25}}>
                  {f.stage}
                </div>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3}}>
                  <div style={{fontSize:9, color: f.meta.color, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em'}}>
                    {f.meta.owner}
                  </div>
                  {f.meta.slaDays > 0 && (
                    <div style={{fontSize:9, color:'var(--text-tertiary)', display:'inline-flex', alignItems:'center', gap:3}}>
                      <Clock size={9}/>{f.meta.slaDays}d SLA
                    </div>
                  )}
                </div>
              </button>

              {/* Connector arrow between stages */}
              {next && (
                <div style={{
                  display:'flex', alignItems:'center', justifyContent:'center',
                  width: 36, flexShrink: 0,
                }}>
                  <ChevronRight size={20} color="var(--text-tertiary)"/>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════
// Kpi card — redesigned with stronger hierarchy, sparkle accents,
// optional delta indicator and footer context line.
// ═══════════════════════════════════════════════════════════════════════
const Kpi = ({ label, value, icon: Icon, color, tip, onClick, delta, footer }) => {
  const deltaPositive = delta && delta.dir === 'up';
  return (
    <div
      onClick={onClick}
      title={tip}
      style={{
        background:'#fff',
        border:'1px solid var(--border)',
        borderRadius:14,
        padding:'16px 18px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform .15s, box-shadow .15s, border-color .15s',
        position:'relative',
        overflow:'hidden',
        display:'flex', flexDirection:'column', gap:10,
        minHeight: 110,
      }}
      onMouseEnter={onClick ? e => {
        e.currentTarget.style.transform='translateY(-3px)';
        e.currentTarget.style.boxShadow='0 10px 24px rgba(15,23,42,.08)';
        e.currentTarget.style.borderColor = color;
      } : undefined}
      onMouseLeave={onClick ? e => {
        e.currentTarget.style.transform='';
        e.currentTarget.style.boxShadow='';
        e.currentTarget.style.borderColor = 'var(--border)';
      } : undefined}
    >
      {/* Soft tinted accent stripe at the top */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height: 3,
        background: `linear-gradient(90deg, ${color}, ${color}66)`,
      }}/>

      {/* Header row: icon + label + delta pill */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10}}>
        <div style={{display:'flex', alignItems:'center', gap:9}}>
          <div style={{
            width:34, height:34, borderRadius:9,
            background: `linear-gradient(135deg, ${color}1a, ${color}26)`,
            color, display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink:0,
          }}>
            <Icon size={17}/>
          </div>
          <div style={{fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.06em', lineHeight:1.2}}>
            {label}
          </div>
        </div>
        {delta && (
          <span style={{
            display:'inline-flex', alignItems:'center', gap:3,
            fontSize:10, fontWeight:700,
            padding:'2px 7px', borderRadius:999,
            background: deltaPositive ? '#ecfdf5' : '#fef2f2',
            color: deltaPositive ? '#059669' : '#dc2626',
            border: `1px solid ${deltaPositive ? '#a7f3d0' : '#fecaca'}`,
          }}>
            {deltaPositive ? '▲' : '▼'} {delta.value}
          </span>
        )}
      </div>

      {/* Big value */}
      <div style={{fontSize:30, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em', lineHeight:1}}>
        {value}
      </div>

      {/* Footer context */}
      {footer && (
        <div style={{fontSize:11, color:'var(--text-tertiary)', marginTop:'auto'}}>
          {footer}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ApplicantDrawer — 3 tabs (Overview / Timeline / Checklist)
// ═══════════════════════════════════════════════════════════════════════
const ApplicantDrawer = ({ applicant, documents, training, candidates, offers, onActivate, onWithdraw, onAdvance, onStageChange, onReminder, onAutoActivate }) => {
  const { state } = useApp();
  const [tab, setTab] = useState('overview');
  // Re-derive the record from context so the drawer (notes, stage, history)
  // stays live after updates instead of showing the open-time snapshot.
  const a = (state.onboarding || []).find(x => x.id === applicant.id) || applicant;
  const checklist = computeChecklist(a, documents, training);
  const ready = checklist.done === checklist.total && a.status !== 'Activated' && a.status !== 'Withdrawn';
  const linkedCand  = candidates?.find(c => c.id === a.linkedCandidateId);
  const linkedOffer = offers?.find(o => o.id === a.linkedOfferId);

  return (
    <div style={{display:'flex', flexDirection:'column', gap:16}}>
      {/* Status banner */}
      <div style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'12px 16px', borderRadius:10,
        background: `${stageColor(a.status)}10`,
        border: `1px solid ${stageColor(a.status)}33`,
      }}>
        <div style={{width:36, height:36, borderRadius:9, background: stageColor(a.status), color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Sparkles size={18}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:11, fontWeight:700, color: stageColor(a.status), textTransform:'uppercase', letterSpacing:'.05em'}}>
            {a.status}
          </div>
          <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>{stageMeta(a.status).help}</div>
        </div>
      </div>

      {/* Auto-activate banner */}
      {ready && (
        <div style={{
          padding:'12px 16px', borderRadius:10,
          background:'#ecfdf5', border:'1px solid #6ee7b7',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <CheckCircle size={20} color="#10b981"/>
          <div style={{flex:1}}>
            <div style={{fontSize:13, fontWeight:700, color:'#065f46'}}>All checklist items complete</div>
            <div style={{fontSize:11, color:'#065f46', opacity:.85, marginTop:2}}>Ready to activate the Employee record (status → Active).</div>
          </div>
          <button className="btn btn-success btn-sm" onClick={onAutoActivate}><CheckCircle size={13}/> Auto-activate</button>
        </div>
      )}

      {/* Cross-flow lifecycle chain — links to every related record so
          HR / auditors can walk the chain without leaving the page.
          Renders even after activation (employee record link appears
          once the staff record is created upstream at offer-accept). */}
      <div style={{
        padding:'12px 14px', borderRadius:10, background:'#eff6ff', border:'1px solid #bfdbfe',
        display:'flex', flexDirection:'column', gap:8,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:10,fontWeight:700,color:'#1e3a8a',textTransform:'uppercase',letterSpacing:'.06em'}}>
          <Link2 size={12}/> Hire lifecycle chain
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center',fontSize:12}}>
          {linkedCand ? (
            <a
              href={`#/system/crm`}
              onClick={(e) => { e.preventDefault(); window.location.hash = '#/backoffice/jobs'; }}
              style={{padding:'5px 10px',background:'#fff',border:'1px solid #bfdbfe',borderRadius:999,color:'#1e40af',textDecoration:'none',fontWeight:600}}
              title="View linked candidate in Recruitment Pipeline"
            >
              Candidate · {linkedCand.id} ({linkedCand.name}){linkedCand.stage ? ` · ${linkedCand.stage}` : ''}
            </a>
          ) : (
            <span style={{padding:'5px 10px',color:'var(--text-tertiary)',fontSize:11}}>Candidate · — (no link)</span>
          )}
          <ChevronRight size={12} color="#94a3b8"/>
          {linkedOffer ? (
            <a
              href={`#/backoffice/recruitment`}
              onClick={(e) => { e.preventDefault(); window.location.hash = '#/backoffice/recruitment'; }}
              style={{padding:'5px 10px',background:'#fff',border:'1px solid #bfdbfe',borderRadius:999,color:'#1e40af',textDecoration:'none',fontWeight:600}}
              title={`View offer ${linkedOffer.id} in Recruitment Pipeline`}
            >
              Offer · {linkedOffer.id} (EGP {linkedOffer.salaryMonthly?.toLocaleString()}/mo · {linkedOffer.stage})
            </a>
          ) : a.directHire ? (
            <span style={{padding:'5px 10px',background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:999,color:'#92400e',fontSize:11,fontWeight:700}}>
              Direct hire (no offer)
            </span>
          ) : (
            <span style={{padding:'5px 10px',color:'var(--text-tertiary)',fontSize:11}}>Offer · — (no link)</span>
          )}
          <ChevronRight size={12} color="#94a3b8"/>
          <span style={{padding:'5px 10px',background: a.status === 'Activated' ? '#dcfce7' : 'var(--brand-tint)',border:`1px solid ${a.status === 'Activated' ? '#86efac' : 'rgba(232,103,42,.25)'}`,borderRadius:999,color: a.status === 'Activated' ? '#166534' : 'var(--brand)',fontWeight:700,fontSize:12}}>
            Onboarding · {a.id} ({a.status})
          </span>
          <ChevronRight size={12} color="#94a3b8"/>
          {a.employeeId ? (
            <a
              href="#/backoffice/staff"
              onClick={(e) => { e.preventDefault(); window.location.hash = '#/backoffice/staff'; }}
              style={{padding:'5px 10px',background:'#dcfce7',border:'1px solid #86efac',borderRadius:999,color:'#166534',textDecoration:'none',fontWeight:700,fontSize:12}}
              title={`View employee record ${a.employeeId} in Staff Management`}
            >
              Employee · {a.employeeId} ✓
            </a>
          ) : (
            <span style={{padding:'5px 10px',color:'var(--text-tertiary)',fontSize:11,fontStyle:'italic'}}>Employee · pending activation</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex', gap:0, borderBottom:'1px solid var(--border)'}}>
        {[['overview','Overview', User], ['timeline','Timeline', Clock], ['checklist','Checklist', ListChecks], ['notes','Notes', MessageSquare]].map(([k, label, Icon]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding:'10px 14px', fontSize:12, fontWeight:600, cursor:'pointer',
              background:'transparent', border:'none',
              color: tab === k ? 'var(--brand)' : 'var(--text-secondary)',
              borderBottom: tab === k ? '2px solid var(--brand)' : '2px solid transparent',
              marginBottom:-1,
              display:'inline-flex', alignItems:'center', gap:6,
            }}>
            <Icon size={13}/> {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview'  && <OverviewTab a={a}/>}
      {tab === 'timeline'  && <TimelineTab a={a}/>}
      {tab === 'checklist' && <ChecklistTab a={a} checklist={checklist} onReminder={onReminder}/>}
      {tab === 'notes'     && <StageNotesThread slice="onboarding" record={a} stageField="status" module="Backoffice"/>}

      {/* Action bar */}
      {a.status !== 'Activated' && a.status !== 'Withdrawn' && (
        <div style={{display:'flex',flexDirection:'column',gap:10,paddingTop:14,borderTop:'1px solid var(--border)'}}>
          {/* Stage dropdown — HR picks any stage directly (parity with the
              candidate-stage dropdown in RecruitmentPipeline). The 'Advance
              to next' button stays as a one-click shortcut for the
              canonical happy path. */}
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <label style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>Stage</label>
            <select
              value={a.status}
              onChange={e => onStageChange(e.target.value)}
              style={{
                padding:'6px 28px 6px 12px',
                fontSize:12,fontWeight:700,
                background:`${stageColor(a.status)}15`,
                color:stageColor(a.status),
                border:`1px solid ${stageColor(a.status)}55`,
                borderRadius:999,cursor:'pointer',
              }}
              title="Move the application to any stage"
            >
              {APPLICATION_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {stageMeta(a.status).next && (
              <button className="btn btn-outline btn-sm" onClick={onAdvance} title={`Move to ${stageMeta(a.status).next}`}>
                Advance → {stageMeta(a.status).next}
              </button>
            )}
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button className="btn btn-outline" onClick={onReminder}><Bell size={14}/> Remind {stageMeta(a.status).owner}</button>
            <button className="btn btn-success" onClick={onActivate}><CheckCircle size={14}/> Activate</button>
            <button className="btn btn-danger" onClick={onWithdraw}><XCircle size={14}/> Withdraw</button>
          </div>
        </div>
      )}
    </div>
  );
};

const OverviewTab = ({ a }) => {
  // Audit-finding fix (May 2026): the CV link used to silently no-op when
  // resumeDataUrl was null (older seed records). Now we always render an
  // inline CV preview generated from the applicant's structured data, and
  // surface the original CV if the file is actually present.
  const [cvOpen, setCvOpen] = useState(false);
  const cvUrl = a.resumeDataUrl || buildCvDataUrl(a);
  const cvIsGenerated = !a.resumeDataUrl;

  return (
  <div>
    {/* Photo header card */}
    <div style={{display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:12, background:'linear-gradient(135deg, var(--brand-tint), #fff)', marginBottom:16, border:'1px solid var(--border)'}}>
      {a.photoDataUrl ? (
        <img src={a.photoDataUrl} alt="" style={{width:64, height:64, borderRadius:'50%', objectFit:'cover', border:'3px solid #fff', boxShadow:'0 4px 12px rgba(0,0,0,.12)', flexShrink:0}}/>
      ) : (
        <div style={{width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:22, flexShrink:0}}>
          {a.applicant.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
        </div>
      )}
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:16, fontWeight:800, color:'var(--text-primary)'}}>{a.applicant}</div>
        <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:3}}>{a.requestedRole || a.type} · {a.department}</div>
        {a.resumeName && (
          <div style={{display:'flex', gap:6, marginTop:8, flexWrap:'wrap'}}>
            <button
              onClick={() => setCvOpen(o => !o)}
              style={{display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color: cvOpen ? '#fff' : 'var(--brand)', background: cvOpen ? 'var(--brand)' : '#fff', borderRadius:6, border:'1px solid var(--brand)', padding:'4px 10px', cursor:'pointer'}}
              title="Toggle inline CV preview"
            >
              <Eye size={11}/> {cvOpen ? 'Hide preview' : 'Preview CV'}
            </button>
            <a
              href={cvUrl}
              download={a.resumeName}
              style={{display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'var(--text-secondary)', textDecoration:'none', padding:'4px 10px', background:'#f8fafc', borderRadius:6, border:'1px solid var(--border)'}}
              title={cvIsGenerated ? 'Download generated CV summary (original file not on record)' : 'Download original CV'}
            >
              <Download size={11}/> {a.resumeName}
            </a>
            {cvIsGenerated && (
              <span title="Original PDF not migrated with this record" style={{display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600, color:'#92400e', background:'#fef3c7', borderRadius:6, padding:'4px 8px', border:'1px solid #fcd34d'}}>
                Generated summary
              </span>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Inline CV preview iframe */}
    {cvOpen && a.resumeName && (
      <div style={{marginBottom:16, border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', background:'#f8fafc'}}>
        <div style={{padding:'8px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11, color:'var(--text-secondary)', background:'#fff', borderBottom:'1px solid var(--border)'}}>
          <span style={{display:'inline-flex', alignItems:'center', gap:6, fontWeight:600}}>
            <FileText size={12}/> {a.resumeName}
            {cvIsGenerated && <span style={{fontSize:9, color:'#92400e', background:'#fef3c7', padding:'1px 6px', borderRadius:4}}>SUMMARY</span>}
          </span>
          <button
            onClick={() => setCvOpen(false)}
            style={{background:'none', border:'none', cursor:'pointer', color:'var(--text-tertiary)', padding:'2px 6px', fontSize:11}}
          >Close ×</button>
        </div>
        <iframe
          src={cvUrl}
          title={`CV preview — ${a.applicant}`}
          style={{width:'100%', height:420, border:'none', background:'#fff'}}
        />
      </div>
    )}
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
      <Section title="Contact">
        <Row icon={<Phone size={12}/>} label="Phone" value={a.phone || '—'}/>
        <Row icon={<Mail size={12}/>}  label="Email" value={a.email || '—'}/>
      </Section>
      <Section title="Role">
        <Row icon={<Briefcase size={12}/>} label="Requested role" value={a.requestedRole || '—'}/>
        <Row icon={<Users size={12}/>}     label="Hiring manager" value={a.hiringManager || '—'}/>
        <Row icon={<User size={12}/>}      label="Type"           value={a.type}/>
      </Section>
      <Section title="Where">
        <Row label="Department" value={a.department}/>
        <Row label="Branch"     value={a.branch}/>
      </Section>
      <Section title="Timing">
        <Row icon={<Calendar size={12}/>} label="Submitted"    value={a.date}/>
        <Row icon={<Calendar size={12}/>} label="Target start" value={a.targetStartDate || '—'}/>
      </Section>
      <Section title="Source">
        <Row label="Source" value={a.source || '—'}/>
        {a.employeeId && <Row label="Employee record" value={a.employeeId} highlight/>}
      </Section>
      {a.notes && (
        <Section title="Notes" span={2}>
          <div style={{fontSize:13, color:'var(--text-primary)', lineHeight:1.6, padding:'8px 10px', background:'#f8fafc', borderRadius:6}}>
            {a.notes}
          </div>
        </Section>
      )}
    </div>
  </div>
  );
};

const TimelineTab = ({ a }) => {
  const events = [...(a.statusHistory || [])].reverse();
  return (
    <div>
      <h4 style={{fontSize:12, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12}}>
        Activity timeline · {events.length} event{events.length === 1 ? '' : 's'}
      </h4>
      <div style={{position:'relative', paddingLeft:24}}>
        <div style={{position:'absolute', left:9, top:6, bottom:6, width:1, background:'var(--border)'}}/>
        {events.map((e, i) => (
          <div key={i} style={{position:'relative', marginBottom:18}}>
            <div style={{
              position:'absolute', left:-22, top:2,
              width:18, height:18, borderRadius:'50%',
              background: stageColor(e.stage), color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              border:'2px solid #fff', boxShadow:'0 0 0 1px var(--border)',
            }}>
              <Sparkles size={10}/>
            </div>
            <div>
              <div style={{fontSize:13, fontWeight:700, color:'var(--text-primary)'}}>{e.stage}</div>
              <div style={{fontSize:11, color:'var(--text-tertiary)', marginTop:2}}>
                {new Date(e.at).toLocaleString()} · {e.by}
              </div>
              {e.note && <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:4, padding:'6px 10px', background:'#f8fafc', borderRadius:6}}>{e.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChecklistTab = ({ a, checklist, onReminder }) => (
  <div>
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14}}>
      <h4 style={{fontSize:12, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em'}}>
        Cross-functional checklist
      </h4>
      <span style={{fontSize:12, fontWeight:700, color: checklist.done === checklist.total ? '#10b981' : 'var(--text-primary)'}}>
        {checklist.done} / {checklist.total} complete
      </span>
    </div>
    <div style={{height:6, background:'#f1f5f9', borderRadius:3, overflow:'hidden', marginBottom:14}}>
      <div style={{
        width:`${(checklist.done / checklist.total) * 100}%`, height:'100%',
        background: checklist.done === checklist.total ? '#10b981' : 'var(--brand)',
        transition:'width .3s',
      }}/>
    </div>
    <div style={{display:'flex', flexDirection:'column', gap:8}}>
      {CHECKLIST_STEPS.map(step => {
        const done = checklist.state[step.key];
        const Icon = step.icon;
        return (
          <div key={step.key} style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 12px', borderRadius:8,
            background: done ? '#ecfdf5' : '#f8fafc',
            border: `1px solid ${done ? '#a7f3d0' : 'var(--border)'}`,
          }}>
            <div style={{
              width:30, height:30, borderRadius:8,
              background: done ? '#10b981' : '#94a3b8',
              color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              {done ? <CheckCircle size={14}/> : <Icon size={14}/>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13, fontWeight:600, color: done ? '#065f46' : 'var(--text-primary)'}}>{step.label}</div>
              <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:2}}>
                Owner: {step.owner}{step.key === 'training' && !done && ` · ${checklist.trainingPct}%`}
              </div>
            </div>
            {!done && (
              <button className="btn btn-outline btn-sm" style={{padding:'4px 10px', fontSize:11}} onClick={onReminder}>
                <Bell size={11}/> Remind
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const Section = ({ title, children, span }) => (
  <div style={{gridColumn: span ? `span ${span}` : undefined}}>
    <div style={{fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>{title}</div>
    <div style={{display:'flex', flexDirection:'column', gap:6}}>
      {children}
    </div>
  </div>
);

const Row = ({ icon, label, value, highlight }) => (
  <div style={{display:'flex', alignItems:'center', gap:8, fontSize:12}}>
    {icon && <span style={{color:'var(--text-tertiary)'}}>{icon}</span>}
    <span style={{color:'var(--text-tertiary)', minWidth:90}}>{label}</span>
    <span style={{fontWeight:600, color: highlight ? 'var(--brand)' : 'var(--text-primary)'}}>{value}</span>
  </div>
);
