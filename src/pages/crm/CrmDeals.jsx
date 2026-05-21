// ═══════════════════════════════════════════════════════════════
// CRM Deals — Off Plan pipeline (canonical)
// ───────────────────────────────────────────────────────────────
// Driven by Deal Stages.docx (business team, 08-May), simplified
// May 2026 to a single Off Plan pipeline:
//   Lead Qualified → Reservation → Contract Signed →
//   Early Collection (5%) → Standard Collection (10%)
//
// Pipeline lifecycle rules (auto-applied on stage transition):
//   • Contract Signed locks the commission and writes Closed-Won.
//   • Early Collection Trigger flips the Homes Advance flag.
//   • Standard Collection (10%) marks revenue recognised + Closed.
//
// Resale pipeline retired May 2026 — every historical Resale deal
// was migrated to its closest Off Plan stage (Property Viewed →
// Lead Qualified · Offer Made → Reservation · Offer Accepted →
// Contract Signed · Contract Signed & Payment → Standard Collection).
//
// Commission override approval chain (BRD §6.2.4) preserved:
//   Δ ≤ 0.5% → Team Leader   ·   Δ ≤ 1.0% → Sales Manager
//   Δ > 1.0% → Sales Director (final)
// ═══════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, Eye, X, LayoutGrid, List, GripVertical, ShieldCheck, Percent, Check, Paperclip, Home, Lock, Sparkles, CheckCircle2, Search, SlidersHorizontal, Calendar, Ban } from 'lucide-react';
import { HIERARCHY, canSeeLead, isReadOnly, personaOwnerName, assignableStaff } from '../../data/crmAccess';
import { DEAL_STAGES_OFFPLAN } from '../../data/staticData';
import { ExportMenu } from '../../components/ExportMenu';
import { SplitEditor } from '../FinancialManagement';

const DEALS_EXPORT_COLUMNS = [
  { key: 'id',         label: 'ID' },
  { key: 'type',       label: 'Type' },
  { key: 'leadName',   label: 'Lead', format: (v, r) => v || r.lead || '—' },
  { key: 'project',    label: 'Project' },
  { key: 'developer',  label: 'Developer' },
  { key: 'value',      label: 'Value (EGP)', format: v => (v || 0).toLocaleString('en-EG') },
  { key: 'commission', label: 'Commission %' },
  { key: 'stage',      label: 'Stage' },
  { key: 'owner',      label: 'Owner' },
  { key: 'team',       label: 'Team' },
  { key: 'status',     label: 'Status' },
  { key: 'created',    label: 'Created' },
  { key: 'commissionLocked',   label: 'Comm. locked',   format: v => v ? 'Yes' : 'No' },
  { key: 'revenueRecognised',  label: 'Revenue recognised', format: v => v ? 'Yes' : 'No' },
];

const fmt = n => new Intl.NumberFormat('en-EG').format(n || 0);

// Off Plan pipeline colors. Resale legacy stages kept here only to
// keep already-archived rows readable until they're migrated.
const STAGE_COLORS = {
  'Lead Qualified':                  '#3b82f6',
  'Reservation':                     '#E8672A',
  'Contract Signed':                 '#8b5cf6',
  'Early Collection Trigger (5%)':   '#06b6d4',
  'Standard Collection (10%)':       '#10b981',
};
const stageColor = (s) => STAGE_COLORS[s] || '#64748b';

// Override approval chain (BRD §6.2.4, revised May 2026):
//   TL requests  →  Sales Manager accepts  →  Sales Director final-approves
// The chain runs always — no delta-based short-circuit — so every override
// gets two human eyes before it touches the deal's commission. Director
// can also bypass the chain with a Direct Override that applies immediately
// AND optionally overrides the per-deal commission split.
//
// Override status state machine:
//   'Pending Manager'   — TL requested, Sales Manager next
//   'Pending Director'  — Manager accepted, Sales Director next
//   'Approved'          — Director approved, deal.commission patched
//   'Rejected'          — rejected at any stage; deal.commission unchanged
//
// Persona gates by stage:
const canActOnOverride = (personaKey, status) => {
  if (personaKey === 'systemAdmin' || personaKey === 'backofficeAdmin') return true; // admin override always allowed
  if (status === 'Pending Manager')  return personaKey === 'salesManager' || personaKey === 'salesDirector';
  if (status === 'Pending Director') return personaKey === 'salesDirector';
  return false;
};
// Who is allowed to INITIATE an override request? TL is the canonical
// initiator; Manager can also initiate (their request just short-circuits
// the first stage since they're the manager-stage approver themselves).
// SME finance review (May 2026): the Sales Director NEVER initiates an
// override — no direct % change is allowed without the approval chain.
// The Director's only override actions are Approve / Reject.
const canRequestOverride = (personaKey) => ['teamLeader','salesManager','backofficeAdmin','systemAdmin'].includes(personaKey);
// Cancel / write-off requests are approved by the Sales Director (SME
// finance review, May 2026); admins can also action them.
const canDecideCancel = (personaKey) => ['salesDirector','systemAdmin','backofficeAdmin'].includes(personaKey);
// Which override-stage rows does this persona see in the queue? Sales
// Manager only sees rows awaiting their action; Sales Director only sees
// rows that already cleared the Manager stage. Admins see everything.
const visibleOverrideStatuses = (personaKey) => {
  if (personaKey === 'salesManager')  return ['Pending Manager'];
  if (personaKey === 'salesDirector') return ['Pending Director'];
  if (personaKey === 'systemAdmin' || personaKey === 'backofficeAdmin') return ['Pending Manager','Pending Director'];
  // TLs + others see only rows they originated (filtered separately by owner).
  return ['Pending Manager','Pending Director'];
};

// Apply lifecycle side-effects when a deal moves to a stage.
const lifecyclePatch = (deal, newStage) => {
  const patch = { stage: newStage };
  if (deal.type === 'OffPlan') {
    if (newStage === 'Contract Signed') {
      patch.commissionLocked = true;
      patch.status = 'Closed';
    }
    if (newStage === 'Early Collection Trigger (5%)') {
      patch.homesAdvanceAvailable = true;
      if (!deal.collectionPercent) patch.collectionPercent = 5;
    }
    if (newStage === 'Standard Collection (10%)') {
      patch.homesAdvanceAvailable = true;
      patch.revenueRecognised = true;
      patch.status = 'Closed';
      if (!deal.collectionPercent || deal.collectionPercent < 10) patch.collectionPercent = 10;
    }
  }
  return patch;
};

export const CrmDeals = () => {
  const { state, addItem, updateItem, removeItem, toast, openDrawer, closeDrawer, openModal, persona, personaKey, writeAudit } = useApp();
  const navigate = useNavigate();
  const allDeals = state.deals || [];
  const listings = state.listings || [];
  const readOnly = isReadOnly(personaKey);
  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };

  // Role-scoped visibility — same rule as leads.
  const dealsAll = useMemo(() => allDeals.filter(d => canSeeLead(personaKey, d)), [allDeals, personaKey]);

  // Off Plan is the canonical pipeline now (Resale retired May 2026).
  // 'pipeline' is left as a const for any legacy references but is no
  // longer user-switchable from the toolbar.
  const pipeline = 'OffPlan';
  const [view, setView] = useState('kanban');
  // Owner / team-member filter for management roles — narrows pipeline view
  // to one team member without leaving the page.
  const [fOwner, setFOwner] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [overrideFor, setOverrideFor] = useState(null);
  const [overrideForm, setOverrideForm] = useState({ requestedPct: '', reason: '' });
  // Approval/rejection modal state — replaces the closure-based modal
  // that wasn't reliably submitting comments.
  const [decisionFor, setDecisionFor] = useState(null); // { deal, decision }
  const [decisionComment, setDecisionComment] = useState('');
  // Cancel / write-off request modal state.
  const [cancelFor, setCancelFor] = useState(null);
  const [cancelForm, setCancelForm] = useState({ kind: 'Cancel', note: '' });

  // ─── Search & Advanced filter (May 2026) ──────────────────────────
  // Lightweight free-text search bar + a collapsible Advanced Search
  // panel covering: stage(s), status, developer/project/unit text,
  // owner+team, value min/max, and created-date range. Filters compose
  // with the pipeline tab and the owner dropdown so finance can drill
  // into a slice in one shot ("Off Plan · Emaar · Marassi · value > 15M
  // · created last 30 days · owned by Fatma").
  const [q, setQ] = useState('');
  const [showAdv, setShowAdv] = useState(false);
  const [adv, setAdv] = useState({
    stages: [],          // empty = all
    status: '',          // Active | Closed | Closed Lost
    developer: '',
    project: '',
    unit: '',            // searched against propertyId / unitCode
    owner: '',           // any owner name string (separate from the top-bar dropdown)
    team: '',
    minValue: '',
    maxValue: '',
    dateFrom: '',
    dateTo: '',
  });
  const resetAdv = () => setAdv({ stages: [], status: '', developer: '', project: '', unit: '', owner: '', team: '', minValue: '', maxValue: '', dateFrom: '', dateTo: '' });
  const toggleStageFilter = (s) => setAdv(a => ({ ...a, stages: a.stages.includes(s) ? a.stages.filter(x => x !== s) : [...a.stages, s] }));
  const advCount =
    (adv.stages.length ? 1 : 0) +
    (adv.status ? 1 : 0) +
    (adv.developer ? 1 : 0) + (adv.project ? 1 : 0) + (adv.unit ? 1 : 0) +
    (adv.owner ? 1 : 0) + (adv.team ? 1 : 0) +
    (adv.minValue ? 1 : 0) + (adv.maxValue ? 1 : 0) +
    (adv.dateFrom ? 1 : 0) + (adv.dateTo ? 1 : 0);

  // Distinct values for the dropdowns — taken from the full visible scope
  // so the user can target a developer/project even if the current filter
  // hides every matching deal.
  const developerOptions = useMemo(() => Array.from(new Set(dealsAll.map(d => d.developer).filter(Boolean))).sort(), [dealsAll]);
  const projectOptions   = useMemo(() => Array.from(new Set(dealsAll.map(d => d.project).filter(Boolean))).sort(), [dealsAll]);
  const teamOptions      = useMemo(() => Array.from(new Set(dealsAll.map(d => d.team).filter(Boolean))).sort(), [dealsAll]);
  const ownerOptions     = useMemo(() => Array.from(new Set(dealsAll.map(d => d.owner).filter(Boolean))).sort(), [dealsAll]);
  const statusOptions    = useMemo(() => Array.from(new Set(dealsAll.map(d => d.status).filter(Boolean))).sort(), [dealsAll]);

  const defForm = (type='OffPlan') => ({
    type: 'OffPlan', // Off Plan is the only pipeline now; ignore caller-supplied type
    lead:'', leadName:'', project:'', developer:'', propertyId:'',
    value:'', commission: 2, owner: personaOwnerName(personaKey) || 'Fatma Ibrahim',
    team: h.team || 'Alpha',
    stage: 'Lead Qualified',
    reservationDeposit: 0, paymentPlan: '', collectionDueDate: '',
    status: 'Active',
  });
  const [form, setForm] = useState(defForm('OffPlan'));

  const deals = useMemo(() => dealsAll.filter(d => {
    if (d.type !== pipeline) return false;
    if (fOwner !== 'All') {
      if (fOwner === '__UNASSIGNED__') { if (d.owner) return false; }
      else if (d.owner !== fOwner) return false;
    }
    // Free-text search — matches across every column the user might type into.
    if (q) {
      const hay = `${d.id} ${d.leadName || d.lead || ''} ${d.project || ''} ${d.developer || ''} ${d.propertyId || ''} ${d.owner || ''} ${d.team || ''} ${d.stage || ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    // Advanced filters — every condition is AND with the rest. Empty values
    // mean 'no constraint on this dimension'.
    if (adv.stages.length && !adv.stages.includes(d.stage)) return false;
    if (adv.status && d.status !== adv.status) return false;
    if (adv.developer && d.developer !== adv.developer) return false;
    if (adv.project && d.project !== adv.project) return false;
    if (adv.unit) {
      const u = adv.unit.toLowerCase();
      if (!(d.propertyId || '').toLowerCase().includes(u)) return false;
    }
    if (adv.owner && d.owner !== adv.owner) return false;
    if (adv.team && d.team !== adv.team) return false;
    if (adv.minValue && (d.value || 0) < Number(adv.minValue)) return false;
    if (adv.maxValue && (d.value || 0) > Number(adv.maxValue)) return false;
    if (adv.dateFrom && (d.created || '') < adv.dateFrom) return false;
    if (adv.dateTo && (d.created || '') > adv.dateTo) return false;
    return true;
  }), [dealsAll, pipeline, fOwner, q, adv]);
  const stages = DEAL_STAGES_OFFPLAN;

  // Team-member list available to this persona — drives the Owner filter.
  const assignable = useMemo(() => assignableStaff(personaKey, state.staff || []), [personaKey, state.staff]);

  const grouped = useMemo(() => {
    const g = {};
    stages.forEach(s => g[s] = []);
    deals.forEach(d => { if (g[d.stage]) g[d.stage].push(d); });
    return g;
  }, [deals, stages]);

  const totalPipeline = dealsAll.filter(d => d.status === 'Active').reduce((s,d) => s + (d.value||0), 0);
  const pendingOverrides = useMemo(() => {
    const allowed = visibleOverrideStatuses(personaKey);
    return dealsAll.filter(d => allowed.includes(d.commissionOverride?.status));
  }, [dealsAll, personaKey]);
  const revenueRecognised = dealsAll.filter(d => d.revenueRecognised).reduce((s,d) => s + ((d.value||0) * (d.commission||0) / 100), 0);
  const homesAdvanceEligible = dealsAll.filter(d => d.homesAdvanceAvailable && !d.revenueRecognised).length;

  const openAdd = (type) => { setForm(defForm(type)); setEditDeal(null); setShowAdd(true); };
  const openEdit = (d) => {
    // Edit can be triggered from inside the deal drawer — close that
    // drawer first so the modal isn't obscured behind it. The drawer
    // and our local edit modal are independent layers; without this
    // call the UX issue is "click Edit, nothing happens" because the
    // modal renders below the drawer's z-index.
    closeDrawer();
    setForm({
      type: 'OffPlan', // Resale retired — every deal is OffPlan now
      lead: d.lead || '', leadName: d.leadName || d.lead || '', project: d.project || '', developer: d.developer || '',
      propertyId: d.propertyId || '', value: d.value || '', commission: d.commission || 2, owner: d.owner || '',
      team: d.team || 'Alpha',
      stage: d.stage || 'Lead Qualified',
      reservationDeposit: d.reservationDeposit || 0, paymentPlan: d.paymentPlan || '',
      collectionDueDate: d.collectionDueDate || '',
      status: d.status || 'Active',
    });
    setEditDeal(d);
    setShowAdd(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.leadName.trim()) { toast('Lead name is required','error'); return; }
    if (!form.project.trim())  { toast('Project is required','error'); return; }
    const payload = {
      ...form,
      value: Number(form.value) || 0,
      commission: Number(form.commission) || 0,
      reservationDeposit: Number(form.reservationDeposit) || 0,
    };
    if (editDeal) {
      updateItem('deals', editDeal.id, payload, { action: 'Deal Updated', module: 'CRM', target: editDeal.id });
      toast('Deal updated','success');
    } else {
      // Apply lifecycle defaults — new deals at "Lead Qualified" don't yet
      // have commission locked or revenue recognised.
      addItem('deals', {
        ...payload,
        commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false,
        collectionPercent: 0, attachments: [],
        created: new Date().toISOString().slice(0,10),
      }, 'D', { action: 'Deal Created', module: 'CRM', detail: `${payload.type} · ${payload.leadName}` });
      toast('Deal created','success');
    }
    setShowAdd(false);
  };
  const handleDel = (id) => { removeItem('deals', id, { action: 'Deal Deleted', module: 'CRM', target: id }); toast('Deal deleted','success'); };

  // ─── Cancel / Write-off (SME finance review, May 2026) ───────────
  // An agent requests a cancellation or write-off with a mandatory note.
  // The deal carries a `cancellation` record at 'Pending Approval' until
  // the Sales Director approves (deal closed Cancelled / Written Off) or
  // rejects (request cleared, the deal stays active).
  const openCancel = (d) => { closeDrawer?.(); setCancelForm({ kind: 'Cancel', note: '' }); setCancelFor(d); };
  const submitCancel = () => {
    if (!cancelFor) return;
    const note = cancelForm.note.trim();
    if (!note) { toast('A note explaining the request is required', 'error'); return; }
    const at = new Date().toISOString();
    updateItem('deals', cancelFor.id, {
      cancellation: {
        kind: cancelForm.kind, note,
        requestedBy: persona.label, requestedAt: at,
        status: 'Pending Approval', approver: 'Sales Director',
        decidedBy: null, decidedAt: null,
      },
    }, { action: `Deal ${cancelForm.kind} Requested`, module: 'CRM', target: cancelFor.id, detail: `By ${persona.label} · "${note}"` });
    toast(`${cancelForm.kind} request submitted — awaiting Sales Director`, 'success');
    setCancelFor(null);
  };
  const decideCancel = (d, decision) => {
    if (!canDecideCancel(personaKey)) { toast('Only the Sales Director can approve a cancellation', 'error'); return; }
    const c = d.cancellation || {};
    const at = new Date().toISOString();
    if (decision === 'approve') {
      const newStatus = c.kind === 'Write-off' ? 'Written Off' : 'Cancelled';
      updateItem('deals', d.id, {
        status: newStatus,
        cancellation: { ...c, status: 'Approved', decidedBy: persona.label, decidedAt: at },
      }, { action: `Deal ${c.kind} Approved`, module: 'CRM', target: d.id, detail: `${d.leadName || d.lead} · ${d.project}` });
      toast(`Deal ${newStatus.toLowerCase()}`, 'success');
    } else {
      updateItem('deals', d.id, {
        cancellation: { ...c, status: 'Rejected', decidedBy: persona.label, decidedAt: at },
      }, { action: `Deal ${c.kind} Rejected`, module: 'CRM', target: d.id });
      toast(`${c.kind} request rejected — deal stays active`, 'info');
    }
    closeDrawer?.();
  };

  // Stage transition with lifecycle side-effects.
  const moveStage = (d, newStage) => {
    const patch = lifecyclePatch(d, newStage);
    updateItem('deals', d.id, patch, { action: 'Deal Stage Changed', module: 'CRM', target: d.id, detail: `${d.stage} → ${newStage}` });
    if (patch.commissionLocked && !d.commissionLocked) {
      toast(`Commission locked at ${d.commission}% — Contract Signed`, 'success');
    } else if (patch.homesAdvanceAvailable && !d.homesAdvanceAvailable) {
      toast(`Homes Advance now available for this deal`, 'info');
    } else if (patch.revenueRecognised && !d.revenueRecognised) {
      toast(`Revenue recognised · EGP ${fmt(d.value * d.commission / 100)} commission`, 'success');
    } else {
      toast(`Moved to ${newStage}`, 'success');
    }
  };

  // Attachments — demo only (no real upload).
  const addAttachment = (d) => {
    const name = window.prompt('Attachment file name (demo):', 'SPA_draft.pdf');
    if (!name) return;
    const att = { id: `ATT-${String(Math.floor(Math.random()*900)+100)}`, name, size: '—', uploadedAt: new Date().toISOString().slice(0,10) };
    updateItem('deals', d.id, { attachments: [...(d.attachments || []), att] }, { action: 'Deal Attachment', module: 'CRM', target: d.id, detail: name });
    toast(`Attached ${name}`,'success');
  };
  const removeAttachment = (d, attId) => {
    updateItem('deals', d.id, { attachments: (d.attachments || []).filter(a => a.id !== attId) }, { action: 'Deal Attachment Removed', module: 'CRM', target: d.id });
    toast(`Attachment removed`,'info');
  };

  // Commission override flow (BRD §6.2.4).
  const openOverride = (d) => {
    if (!canRequestOverride(personaKey)) { toast('Only Team Leader and above can request a commission override', 'error'); return; }
    // Close any side drawer behind the modal so we never have a centered
    // modal stacked on top of a right-side drawer (UX feedback May 2026).
    closeDrawer?.();
    setOverrideFor(d);
    setOverrideForm({ requestedPct: String(d.commission || ''), reason: '' });
  };
  // submitOverride reads only the requested 4-persona split from the form
  // — the deal-side rate is FIXED at the deal's current rate (overrides
  // can't change what the developer pays; they only change how the pool
  // is split internally).
  const submitOverride = (formData) => {
    if (!overrideFor) return;
    // Rate is fixed at current — overrides don't touch it.
    const requestedPct = Number(overrideFor.commission);
    const reason = (formData?.reason ?? overrideForm.reason ?? '').toString();
    if (!reason.trim()) { toast('Reason required', 'error'); return false; }

    // Resolve the per-persona split — supplied by the SplitEditor.
    const a  = Number(formData?.splitAgent    || 0);
    const t  = Number(formData?.splitTl       || 0);
    const m  = Number(formData?.splitManager  || 0);
    const dr = Number(formData?.splitDirector || 0);
    if ([a, t, m, dr].some(n => !Number.isFinite(n) || n < 0)) { toast('Each persona % must be a positive number', 'error'); return false; }
    const sum = a + t + m + dr;
    if (sum > 100) { toast(`Agent + TL + Manager + Director total ${sum.toFixed(2)}% — must stay ≤ 100`, 'error'); return false; }
    const requestedSplit = { agent: a, tl: t, manager: m, director: dr, company: Number((100 - sum).toFixed(2)) };

    // No-op guard: since the rate is locked, the split MUST differ from
    // the active policy split. Otherwise the request is empty.
    const activePolicy = (state.commissionPolicies || []).find(
      p => p.developer === overrideFor.developer && p.project === overrideFor.project && p.status === 'Active'
    );
    const policySplit = activePolicy?.split || null;
    const splitChanged = policySplit
      ? ['agent','tl','manager','director','company'].some(k => Number(policySplit[k] || 0) !== Number(requestedSplit[k]))
      : true; // if no policy split, any explicit split counts as a change
    if (!splitChanged) {
      toast('Change at least one persona % — the breakdown is identical to the policy.', 'error');
      return false;
    }

    const at = new Date().toISOString();
    // TL starts at the bottom of the chain; Sales Manager skips their own
    // review and goes straight to Director. Sales Director shouldn't be
    // here (they have a Direct Override button instead).
    const initialStatus = personaKey === 'salesManager' ? 'Pending Director' : 'Pending Manager';
    const nextActor      = initialStatus === 'Pending Manager' ? 'Sales Manager' : 'Sales Director';
    const delta = requestedPct - overrideFor.commission;
    updateItem('deals', overrideFor.id, {
      commissionOverride: {
        requestedPct,
        currentPct: overrideFor.commission,
        delta: Number(delta.toFixed(2)),
        requestedSplit,
        reason,
        requestedBy: persona.label,
        requestedAt: at,
        status: initialStatus,
        history: [{
          at,
          actor: persona.label,
          action: 'Requested',
          stage: initialStatus,
          comment: reason,
          requestedPct,
          requestedSplit,
        }],
      },
    });
    writeAudit('Commission Override Requested', `${overrideFor.id}: ${overrideFor.commission}% → ${requestedPct}% · split A${a}/T${t}/M${m}/D${dr}/C${requestedSplit.company}`, 'CRM', `By ${persona.label} · awaiting ${nextActor} · "${reason}"`);
    toast(`Override submitted — awaiting ${nextActor} review`, 'success');
    setOverrideFor(null);
  };
  // Open the approve/reject modal that captures the required decision comment
  // and appends an entry to commissionOverride.history[].
  // Two-stage approval (revised May 2026):
  //   'Pending Manager'  → Manager accepts → 'Pending Director'  OR  rejects → 'Rejected'
  //   'Pending Director' → Director approves → 'Approved' (deal patched)  OR  rejects → 'Rejected'
  // Open the dedicated decision modal — this is a self-contained component
  // with its own React state, so the comment textarea is fully controlled
  // and never gets lost in closure / re-render races.
  const openOverrideDecision = (d, decision) => {
    const status = d.commissionOverride.status;
    if (!canActOnOverride(personaKey, status)) {
      const need = status === 'Pending Manager' ? 'Sales Manager' : 'Sales Director';
      toast(`Only ${need} can ${decision} this override (currently ${status})`, 'error');
      return;
    }
    closeDrawer?.(); // dismiss the queue drawer if it's open behind us
    setDecisionComment('');
    setDecisionFor({ deal: d, decision });
  };

  // Submit the decision — called by the modal's form onSubmit handler.
  // Comment lives in React state so it's bulletproof.
  const submitDecision = () => {
    if (!decisionFor) return;
    const { deal: d, decision } = decisionFor;
    const comment = decisionComment.trim();
    if (!comment) { toast('Comment is required for audit trail', 'error'); return; }
    const at = new Date().toISOString();
    const prevHistory = d.commissionOverride.history || [];
    const currentStatus = d.commissionOverride.status;
    if (decision === 'approve') {
      if (currentStatus === 'Pending Manager') {
        const entry = { at, actor: persona.label, action: 'Manager Accepted', stage: 'Pending Director', decision: 'approve', comment };
        updateItem('deals', d.id, {
          commissionOverride: {
            ...d.commissionOverride,
            status: 'Pending Director',
            managerAcceptedBy: persona.label,
            managerAcceptedAt: at,
            managerComment: comment,
            history: [...prevHistory, entry],
          },
        });
        writeAudit('Commission Override · Manager Accepted', `${d.id}: ${d.commissionOverride.currentPct}% → ${d.commissionOverride.requestedPct}%`, 'CRM', `By ${persona.label} · forwarded to Sales Director · "${comment}"`);
        toast('Accepted — forwarded to Sales Director for final approval', 'success');
      } else {
        // Director final approve — patch the deal.
        const entry = { at, actor: persona.label, action: 'Director Approved', stage: 'Approved', decision: 'approve', comment };
        updateItem('deals', d.id, {
          commission: d.commissionOverride.requestedPct,
          commissionOverride: {
            ...d.commissionOverride,
            status: 'Approved',
            splitOverride: d.commissionOverride.requestedSplit || d.commissionOverride.splitOverride || null,
            decidedBy: persona.label,
            decidedAt: at,
            decisionComment: comment,
            history: [...prevHistory, entry],
          },
        });
        writeAudit('Commission Override Approved', `${d.id}: ${d.commissionOverride.currentPct}% → ${d.commissionOverride.requestedPct}%`, 'CRM', `Final approval by ${persona.label} · "${comment}"`);
        toast('Override approved & applied to the deal', 'success');
      }
    } else {
      updateItem('deals', d.id, {
        commissionOverride: {
          ...d.commissionOverride,
          status: 'Rejected',
          rejectedBy: persona.label,
          rejectedAt: at,
          rejectionComment: comment,
          decidedBy: persona.label,
          decidedAt: at,
          decisionComment: comment,
          history: [...prevHistory, { at, actor: persona.label, action: 'Rejected', stage: 'Rejected', decision: 'reject', comment, fromStage: currentStatus }],
        },
      });
      writeAudit('Commission Override Rejected', d.id, 'CRM', `Rejected at ${currentStatus} by ${persona.label} · "${comment}"`);
      toast('Override rejected', 'info');
    }
    setDecisionFor(null);
    setDecisionComment('');
  };

  // Legacy alias — keeps existing call sites working but routes through the
  // new modal that captures the comment.
  const approveOverride = (d, decision) => openOverrideDecision(d, decision);

  // Lookups
  const listingFor = (id) => listings.find(l => l.id === id);

  const viewDetail = (d) => {
    const list = listingFor(d.propertyId);
    // Off Plan is the only pipeline now (Resale retired May 2026).
    const stageList = DEAL_STAGES_OFFPLAN;
    openDrawer({
      title: `${d.leadName || d.lead || 'Deal'} · ${d.project}`,
      subtitle: `${d.type} · ${d.id}`,
      content: (
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          {/* Hero */}
          <div style={{padding:14,background:'#fafbfc',borderRadius:10,border:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:14}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>{d.type} Pipeline</div>
              <span className="badge" style={{background:`${stageColor(d.stage)}20`,color:stageColor(d.stage),marginTop:6}}>{d.stage}</span>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>Value</div>
              <div style={{fontSize:18,fontWeight:800,color:'var(--brand)'}}>EGP {fmt(d.value)}</div>
            </div>
          </div>

          {/* Core facts */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {[
              ['Lead', d.leadName || d.lead || '—'],
              ['Project', d.project],
              ['Developer', d.developer],
              ['Owner', d.owner],
              ['Team', d.team || '—'],
              ['Commission', `${d.commission}% ${d.commissionLocked ? '· LOCKED 🔒' : ''}`],
              ['Est. Commission', `EGP ${fmt((d.value || 0) * (d.commission || 0) / 100)}`],
              ['Created', d.created || '—'],
            ].map(([k,v])=>(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>))}
            <div><div className="drawer-label">Status</div><span className={`badge ${d.status==='Active'?'badge-success':(d.status==='Closed'||d.status==='Closed Won')?'badge-info':'badge-danger'}`}>{d.status==='Closed Won'?'Closed':d.status}</span></div>
          </div>

          {/* Linked Property */}
          <div style={{padding:14,background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <Home size={14} color="var(--brand)"/>
              <div style={{fontSize:12,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>Linked Property</div>
            </div>
            {list ? (
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                {list.image && <div style={{width:64,height:64,borderRadius:8,backgroundImage:`url(${list.image})`,backgroundSize:'cover',backgroundPosition:'center'}}/>}
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>{list.project} · {list.unitCode}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>{list.unitType} · {list.bedrooms}BD · {list.area}m² · EGP {fmt(list.price)}</div>
                </div>
              </div>
            ) : (
              <div style={{fontSize:12,color:'var(--text-tertiary)'}}>No property linked. {!readOnly && 'Edit deal to set a propertyId from Listings.'}</div>
            )}
          </div>

          {/* Pipeline-specific fields */}
          {d.type === 'OffPlan' && (
            <div style={{padding:14,background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Off Plan — Payment & Collection</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {[
                  ['Reservation Deposit', d.reservationDeposit ? `EGP ${fmt(d.reservationDeposit)}` : '—'],
                  ['Payment Plan', d.paymentPlan || '—'],
                  ['Collection Due Date', d.collectionDueDate || '—'],
                  ['Developer Collection', d.collectionPercent ? `${d.collectionPercent}%` : '0%'],
                  ['Homes Advance', d.homesAdvanceAvailable ? '✅ Available' : '—'],
                  ['Revenue Recognised', d.revenueRecognised ? '✅ Recognised' : '—'],
                ].map(([k,v]) => <div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>)}
              </div>
              {d.homesAdvanceAvailable && !d.revenueRecognised && (
                <div style={{marginTop:10,padding:'10px 12px',background:'#dbeafe',color:'#1e40af',fontSize:12,borderRadius:6,display:'flex',alignItems:'center',gap:8}}>
                  <Sparkles size={14}/> Homes Advance can be requested at this stage.
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          <div style={{padding:14,background:'#fff',border:'1px solid var(--border)',borderRadius:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <Paperclip size={14} color="var(--brand)"/>
                <div style={{fontSize:12,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>Attachments ({(d.attachments||[]).length})</div>
              </div>
              {!readOnly && <button className="btn btn-sm btn-outline" onClick={()=>addAttachment(d)}><Plus size={12}/> Add</button>}
            </div>
            {(d.attachments || []).length === 0 ? (
              <div style={{fontSize:12,color:'var(--text-tertiary)'}}>No attachments yet.</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {d.attachments.map(a => (
                  <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 10px',background:'#fafbfc',borderRadius:6,fontSize:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
                      <Paperclip size={12} color="var(--text-tertiary)"/>
                      <span style={{fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.name}</span>
                      <span style={{color:'var(--text-tertiary)',fontSize:11}}>· {a.size} · {a.uploadedAt}</span>
                    </div>
                    {!readOnly && <button className="btn-icon" onClick={()=>removeAttachment(d,a.id)} title="Remove" style={{color:'var(--danger)'}}><X size={12}/></button>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Commission override panel */}
          {d.commissionOverride && (
            <div style={{padding:14,background:d.commissionOverride.status==='Pending'?'#fef3c7':d.commissionOverride.status==='Approved'?'#dcfce7':'#fee2e2',border:`1px solid ${d.commissionOverride.status==='Pending'?'#fcd34d':d.commissionOverride.status==='Approved'?'#86efac':'#fca5a5'}`,borderRadius:10}}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:6, display:'flex', justifyContent:'space-between'}}>
                <span>Commission Override · {d.commissionOverride.status}</span>
                {(d.commissionOverride.history || []).length > 0 && <span style={{fontSize:10, color:'var(--text-tertiary)', fontWeight:500}}>{d.commissionOverride.history.length} decision{d.commissionOverride.history.length === 1 ? '' : 's'} logged</span>}
              </div>
              <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>
                {d.commissionOverride.currentPct}% → {d.commissionOverride.requestedPct}% (Δ {d.commissionOverride.delta}%)<br/>
                Requested by <b>{d.commissionOverride.requestedBy}</b> · routed to <b>{d.commissionOverride.approver}</b><br/>
                <i>{d.commissionOverride.reason}</i>
                {d.commissionOverride.decidedBy && <><br/>Decided by <b>{d.commissionOverride.decidedBy}</b> at {new Date(d.commissionOverride.decidedAt).toLocaleString()}</>}
                {d.commissionOverride.decisionComment && <><br/><b>Decision note:</b> <i>"{d.commissionOverride.decisionComment}"</i></>}
              </div>

              {/* Decision history — surfaces every prior decide-action with comment */}
              {(d.commissionOverride.history || []).length > 0 && (
                <div style={{marginTop:10, paddingTop:10, borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                  <div style={{fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6}}>Audit trail</div>
                  <div style={{display:'flex', flexDirection:'column', gap:5}}>
                    {d.commissionOverride.history.map((h, i) => (
                      <div key={i} style={{fontSize:11, padding:'6px 8px', background: 'rgba(255,255,255,0.65)', borderRadius:5, borderLeft:`3px solid ${h.decision === 'approve' ? '#16a34a' : '#dc2626'}`}}>
                        <b>{h.decision === 'approve' ? '✓ Approved' : '✗ Rejected'}</b> by {h.actor} · {new Date(h.at).toLocaleDateString()}
                        {h.comment && <div style={{fontStyle:'italic', color:'var(--text-secondary)', marginTop:2}}>"{h.comment}"</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(d.commissionOverride.status === 'Pending Manager' || d.commissionOverride.status === 'Pending Director') && canActOnOverride(personaKey, d.commissionOverride.status) && (
                <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
                  {d.commissionOverride.status === 'Pending Manager' ? (
                    <>
                      <button className="btn btn-sm btn-brand" onClick={()=>approveOverride(d, 'approve')}><Check size={13}/> Accept · forward to Director</button>
                      <button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>approveOverride(d, 'reject')}><X size={13}/> Reject</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-sm btn-brand" onClick={()=>approveOverride(d, 'approve')}><Check size={13}/> Final approve & apply</button>
                      <button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>approveOverride(d, 'reject')}><X size={13}/> Reject</button>
                    </>
                  )}
                </div>
              )}
              {(d.commissionOverride.status === 'Pending Manager' || d.commissionOverride.status === 'Pending Director') && !canActOnOverride(personaKey, d.commissionOverride.status) && (
                <div style={{marginTop:10,fontSize:11,color:'var(--text-tertiary)'}}>
                  Awaiting {d.commissionOverride.status === 'Pending Manager' ? 'Sales Manager' : 'Sales Director'} review.
                </div>
              )}
            </div>
          )}

          {/* Cancellation / Write-off request (SME finance review, May 2026) */}
          {d.cancellation && (
            <div style={{padding:14,background:d.cancellation.status==='Pending Approval'?'#fef3c7':d.cancellation.status==='Approved'?'#fee2e2':'#f1f5f9',border:`1px solid ${d.cancellation.status==='Pending Approval'?'#fcd34d':d.cancellation.status==='Approved'?'#fca5a5':'var(--border)'}`,borderRadius:10}}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>Deal {d.cancellation.kind} · {d.cancellation.status}</div>
              <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>
                Requested by <b>{d.cancellation.requestedBy}</b> · routed to <b>{d.cancellation.approver}</b><br/>
                <i>"{d.cancellation.note}"</i>
                {d.cancellation.decidedBy && <><br/>Decided by <b>{d.cancellation.decidedBy}</b> at {new Date(d.cancellation.decidedAt).toLocaleString()}</>}
              </div>
              {d.cancellation.status === 'Pending Approval' && canDecideCancel(personaKey) && (
                <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
                  <button className="btn btn-sm btn-brand" onClick={()=>decideCancel(d,'approve')}><Check size={13}/> Approve {d.cancellation.kind}</button>
                  <button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>decideCancel(d,'reject')}><X size={13}/> Reject</button>
                </div>
              )}
              {d.cancellation.status === 'Pending Approval' && !canDecideCancel(personaKey) && (
                <div style={{marginTop:10,fontSize:11,color:'var(--text-tertiary)'}}>Awaiting Sales Director approval.</div>
              )}
            </div>
          )}

          {/* Stage transitions */}
          <div style={{borderTop:'1px solid var(--border)',paddingTop:14}}>
            <div className="drawer-label" style={{marginBottom:8}}>Move to Stage</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {stageList.filter(s => s !== d.stage).map(s => (
                <button key={s} className="btn btn-sm btn-outline" onClick={()=>moveStage(d,s)} style={{fontSize:11}}>{s}</button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {!readOnly && <button className="btn btn-sm btn-brand" onClick={()=>openEdit(d)}><Edit size={13}/> Edit</button>}
            {/* Request override — visible whenever there isn't an active
                override already in flight. Stage-independent (a TL can ask
                for an exception at any pre-final stage). Commission lock
                doesn't block the REQUEST anymore — only the final apply. */}
            {!readOnly && canRequestOverride(personaKey) && (!d.commissionOverride || d.commissionOverride.status === 'Rejected') && (
              <button className="btn btn-sm btn-outline" onClick={()=>openOverride(d)}><Percent size={13}/> Request commission override</button>
            )}
            {/* When an override is in flight, show a status pill instead
                of the request button so the TL sees what's happening. */}
            {!readOnly && d.commissionOverride && (d.commissionOverride.status === 'Pending Manager' || d.commissionOverride.status === 'Pending Director') && (
              <span className="badge badge-warning" title={`Requested by ${d.commissionOverride.requestedBy} · ${d.commissionOverride.currentPct}% → ${d.commissionOverride.requestedPct}%`} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 10px'}}>
                <Percent size={11}/> Override in review · {d.commissionOverride.status}
              </span>
            )}
            {!readOnly && d.commissionOverride && d.commissionOverride.status === 'Approved' && (
              <span className="badge badge-success" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 10px'}} title={d.commissionOverride.bypassedApproval ? 'Director direct override' : `Approved · ${d.commissionOverride.requestedPct}%`}>
                <Percent size={11}/> Override applied{d.commissionOverride.bypassedApproval ? ' (Direct)' : ''}
              </span>
            )}
            {!readOnly && d.status === 'Active' && (!d.cancellation || d.cancellation.status === 'Rejected') && (
              <button className="btn btn-sm btn-outline" style={{color:'#b45309'}} onClick={()=>openCancel(d)}><Ban size={13}/> Cancel / Write-off</button>
            )}
            {!readOnly && <button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>handleDel(d.id)}><Trash2 size={13}/> Delete</button>}
          </div>
        </div>
      ),
    });
  };

  const roleScopeLabel = h.scope === 'self' ? 'Own deals only' : h.scope === 'team' ? `Team ${h.team}` : h.scope === 'cross' ? `Teams ${h.teams?.join(' + ')}` : h.scope === 'all' ? 'All teams (full hierarchy)' : h.scope === 'audit' ? 'Audit-only (read)' : 'No access';

  return (
    <div className="crm-page">
      <div className="page-header">
        <h1 className="page-title">Deals Pipeline</h1>
        <p className="page-subtitle">Off Plan pipeline from <b>Deal Stages.docx</b>. Total active pipeline: <strong>EGP {fmt(totalPipeline)}</strong> · Revenue recognised this period: <strong>EGP {fmt(revenueRecognised)}</strong>.</p>
      </div>

      {/* Role banner */}
      <div className="crm-role-banner">
        <div className="ico"><ShieldCheck size={18}/></div>
        <div className="meat">
          <div className="title">{persona.label} · {h.role}</div>
          <div className="line">
            <span className="kv"><b>Visibility:</b> {roleScopeLabel}</span>
            <span className="kv"><b>Stage moves:</b> {readOnly ? 'Read-only' : 'Allowed'}</span>
            <span className="kv"><b>Override approval:</b> {h.scope === 'all' ? 'All tiers' : h.scope === 'cross' ? 'TL + Manager' : h.scope === 'team' ? 'TL only' : 'Request only'}</span>
          </div>
        </div>
        <div className="kpis">
          <div><div className="num">{dealsAll.length}</div><div className="lbl">Visible</div></div>
          <div><div className="num">{pendingOverrides.length}</div><div className="lbl">Override pending</div></div>
          <div><div className="num">{homesAdvanceEligible}</div><div className="lbl">Homes Advance ready</div></div>
        </div>
      </div>

      {/* Search + Advanced row — primary scoping controls for the Off Plan
          pipeline (Resale retired May 2026). */}
      <div style={{display:'flex',gap:8,marginBottom:10,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{position:'relative',flex:'1 1 280px',maxWidth:480}}>
          <Search size={14} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-tertiary)',pointerEvents:'none'}}/>
          <input
            type="text"
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Search by deal ID, lead, project, developer, unit, owner…"
            style={{
              width:'100%', padding:'9px 30px 9px 32px',
              borderRadius:8, border:'1px solid var(--border)',
              fontSize:13, background:'#fff',
            }}
          />
          {q && (
            <button onClick={()=>setQ('')} style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',background:'transparent',border:0,padding:4,cursor:'pointer',color:'var(--text-tertiary)'}} title="Clear search">
              <X size={12}/>
            </button>
          )}
        </div>
        <button
          type="button"
          className={`btn btn-sm ${(advCount > 0 || showAdv) ? 'btn-brand' : 'btn-outline'}`}
          onClick={() => setShowAdv(s => !s)}
          title="Stage, status, developer/project/unit, owner/team, value & date filters"
        >
          <SlidersHorizontal size={13}/> Advanced{advCount > 0 ? ` · ${advCount}` : ''}
        </button>
        {advCount > 0 && (
          <button type="button" className="btn btn-sm btn-outline" onClick={resetAdv} title="Clear all advanced filters" style={{color:'var(--danger)'}}>
            <X size={12}/> Clear
          </button>
        )}
        <div style={{fontSize:11,color:'var(--text-tertiary)',marginLeft:'auto'}}>
          {deals.length} match{deals.length === 1 ? '' : 'es'}
        </div>
      </div>

      {/* Advanced filter panel — collapses by default, opens when the user
          clicks Advanced. Each row groups related dimensions: stage+status,
          developer+project+unit, owner+team, value range, date range. */}
      {showAdv && (
        <div style={{
          padding:'14px 16px', marginBottom:12,
          background:'#fafbfc', border:'1px solid var(--border)', borderRadius:10,
          display:'flex', flexDirection:'column', gap:14,
        }}>
          <div style={{display:'flex',alignItems:'center',gap:8,fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>
            <SlidersHorizontal size={13}/> Advanced search
          </div>

          {/* Stage chips — pick one or more stages within the current pipeline */}
          <div>
            <label style={{fontSize:10,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.05em',display:'block',marginBottom:6}}>Stage (Off Plan pipeline)</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {stages.map(s => {
                const active = adv.stages.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleStageFilter(s)}
                    style={{
                      padding:'5px 12px', borderRadius:999, fontSize:11, fontWeight:600, cursor:'pointer',
                      background: active ? `${stageColor(s)}20` : '#fff',
                      border: `1px solid ${active ? stageColor(s) : 'var(--border)'}`,
                      color: active ? stageColor(s) : 'var(--text-secondary)',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-column grid — every filter dimension goes here */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10}}>
            <div className="form-group" style={{margin:0}}>
              <label>Status</label>
              <select value={adv.status} onChange={e=>setAdv({...adv, status: e.target.value})}>
                <option value="">All statuses</option>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Developer</label>
              <select value={adv.developer} onChange={e=>setAdv({...adv, developer: e.target.value})}>
                <option value="">All developers</option>
                {developerOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Project</label>
              <select value={adv.project} onChange={e=>setAdv({...adv, project: e.target.value})}>
                <option value="">All projects</option>
                {projectOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Unit (listing ref)</label>
              <input type="text" placeholder="e.g. LST-002 or partial" value={adv.unit} onChange={e=>setAdv({...adv, unit: e.target.value})}/>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Owner / Agent</label>
              <select value={adv.owner} onChange={e=>setAdv({...adv, owner: e.target.value})}>
                <option value="">Any owner</option>
                {ownerOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Team</label>
              <select value={adv.team} onChange={e=>setAdv({...adv, team: e.target.value})}>
                <option value="">All teams</option>
                {teamOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Min value (EGP)</label>
              <input type="number" placeholder="—" value={adv.minValue} onChange={e=>setAdv({...adv, minValue: e.target.value})}/>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Max value (EGP)</label>
              <input type="number" placeholder="—" value={adv.maxValue} onChange={e=>setAdv({...adv, maxValue: e.target.value})}/>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label><Calendar size={11} style={{display:'inline',marginRight:4}}/> Created from</label>
              <input type="date" value={adv.dateFrom} onChange={e=>setAdv({...adv, dateFrom: e.target.value})}/>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label><Calendar size={11} style={{display:'inline',marginRight:4}}/> Created to</label>
              <input type="date" value={adv.dateTo} onChange={e=>setAdv({...adv, dateTo: e.target.value})}/>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:10,paddingTop:6,borderTop:'1px dashed var(--border)'}}>
            <div style={{fontSize:11,color:'var(--text-tertiary)',flex:1}}>
              Filters apply within the Off Plan pipeline and stack with the Owner dropdown above.
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={resetAdv} disabled={advCount === 0}>Reset</button>
            <button type="button" className="btn btn-brand btn-sm" onClick={() => setShowAdv(false)}>Done</button>
          </div>
        </div>
      )}

      {/* Applied-filters chip strip — visible whenever any advanced filter
          is set, so the user can see WHY the result count is what it is
          and pop individual filters off without opening the panel. */}
      {advCount > 0 && (
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:12,alignItems:'center'}}>
          <span style={{fontSize:11,color:'var(--text-tertiary)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginRight:4}}>Filters:</span>
          {adv.stages.map(s => (
            <span key={`stage-${s}`} style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 8px',borderRadius:999,background:`${stageColor(s)}15`,color:stageColor(s),fontSize:11,fontWeight:700,border:`1px solid ${stageColor(s)}55`}}>
              {s}
              <button onClick={() => toggleStageFilter(s)} style={{background:'transparent',border:0,padding:0,cursor:'pointer',color:'inherit',display:'inline-flex'}} title="Remove"><X size={10}/></button>
            </span>
          ))}
          {[
            ['status', adv.status],
            ['developer', adv.developer],
            ['project', adv.project],
            ['unit', adv.unit],
            ['owner', adv.owner],
            ['team', adv.team],
            ['minValue', adv.minValue && `≥ ${fmt(adv.minValue)} EGP`],
            ['maxValue', adv.maxValue && `≤ ${fmt(adv.maxValue)} EGP`],
            ['dateFrom', adv.dateFrom && `from ${adv.dateFrom}`],
            ['dateTo',   adv.dateTo   && `to ${adv.dateTo}`],
          ].filter(([, v]) => v).map(([k, label]) => (
            <span key={k} style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 8px',borderRadius:999,background:'#eff6ff',color:'#1e40af',fontSize:11,fontWeight:600,border:'1px solid #bfdbfe'}}>
              {label}
              <button onClick={() => setAdv({...adv, [k]: k === 'minValue' || k === 'maxValue' ? '' : ''})} style={{background:'transparent',border:0,padding:0,cursor:'pointer',color:'inherit',display:'inline-flex'}} title="Remove"><X size={10}/></button>
            </span>
          ))}
          <button type="button" onClick={resetAdv} style={{background:'transparent',border:'1px solid var(--border)',padding:'3px 8px',borderRadius:999,fontSize:11,fontWeight:600,cursor:'pointer',color:'var(--danger)'}}>Clear all</button>
        </div>
      )}

      {/* Toolbar: Owner filter + view toggle + override queue.
          (Resale pipeline tab retired May 2026 — Off Plan only.) */}
      <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
        {/* Owner filter — visible only to roles that can see more than self. */}
        {h.scope !== 'self' && h.scope !== 'none' && (
          <select
            className="filter-select"
            value={fOwner}
            onChange={e=>setFOwner(e.target.value)}
            title="Filter pipeline by deal owner (team member)"
            style={{marginLeft:'auto'}}
          >
            <option value="All">All Owners ({assignable.length})</option>
            <option value="__UNASSIGNED__">— Unassigned —</option>
            {assignable.map(s => (
              <option key={s.id || s.name} value={s.name}>
                {s.name}{s.team ? ` · ${s.team}` : ''}
              </option>
            ))}
          </select>
        )}
        <div style={{display:'flex',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden', ...(h.scope === 'self' || h.scope === 'none' ? {marginLeft:'auto'} : {})}}>
          <button className={`btn btn-sm ${view==='kanban'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('kanban')}><LayoutGrid size={14}/> Board</button>
          <button className={`btn btn-sm ${view==='table'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('table')}><List size={14}/> Table</button>
        </div>
        {pendingOverrides.length > 0 && (
          <button className="btn btn-sm btn-outline" onClick={()=>navigate('/system/crm/overrides')}>
            <Percent size={13}/> Override queue ({pendingOverrides.length})
          </button>
        )}
        {/* The legacy in-drawer queue is no longer used — moved to a
            dedicated page at /system/crm/overrides for better UX with
            big request payloads. The block below is dead code kept
            only to avoid a sweeping diff; React tree-shakes it out at
            render time since the button above already navigates away. */}
        {false && (
          <button className="btn btn-sm btn-outline" onClick={()=>openDrawer({ title: 'Pending Commission Overrides', subtitle: `${pendingOverrides.length} awaiting approval`, content: (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {pendingOverrides.map(d => {
                const ov = d.commissionOverride || {};
                const rateChanged = Number(ov.currentPct) !== Number(ov.requestedPct);
                const reqSplit = ov.requestedSplit;
                // Resolve the policy split for this deal so the side-by-side
                // comparison can show 'current policy → requested'.
                const pol = (state.commissionPolicies || []).find(p =>
                  p.developer === d.developer && p.project === d.project && p.status === 'Active'
                );
                const polSplit = pol?.split || null;
                const rows = [
                  { key: 'rate',     label: 'Deal-side rate',   from: ov.currentPct,        to: ov.requestedPct,       suffix: '%' },
                  { key: 'agent',    label: 'Agent share',      from: polSplit?.agent,      to: reqSplit?.agent,       suffix: '%' },
                  { key: 'tl',       label: 'Team Leader share',from: polSplit?.tl,         to: reqSplit?.tl,          suffix: '%' },
                  { key: 'manager',  label: 'Sales Manager',    from: polSplit?.manager,    to: reqSplit?.manager,     suffix: '%' },
                  { key: 'director', label: 'Sales Director',   from: polSplit?.director,   to: reqSplit?.director,    suffix: '%' },
                  { key: 'company',  label: 'Company',          from: polSplit?.company,    to: reqSplit?.company,     suffix: '%' },
                ];
                const anyChange = rows.some(r => r.from != null && r.to != null && Number(r.from) !== Number(r.to));
                // Pretty 'when' label: relative time + absolute.
                const requestedWhen = ov.requestedAt
                  ? `${new Date(ov.requestedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}`
                  : '—';
                // Pool preview at requested rate, if the deal carries a value.
                const reqPool = d.value && ov.requestedPct ? Math.round((d.value || 0) * (ov.requestedPct || 0) / 100) : null;
                const curPool = d.value && ov.currentPct   ? Math.round((d.value || 0) * (ov.currentPct   || 0) / 100) : null;
                return (
                  <div key={d.id} style={{padding:14,border:'1px solid var(--border)',borderRadius:10,background:'#fff'}}>
                    {/* Header — deal + status */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:8}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{d.leadName || d.lead} · {d.project}</div>
                        <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>{d.id} · {d.developer || '—'} · EGP {(d.value || 0).toLocaleString('en-EG')}</div>
                      </div>
                      <span className="badge badge-warning" style={{fontSize:10}}>{ov.status}</span>
                    </div>

                    {/* Requestor strip */}
                    <div style={{padding:'8px 10px',background:'#f8fafc',border:'1px solid var(--border)',borderRadius:6,fontSize:11,marginBottom:8}}>
                      <b>Requested by</b> {ov.requestedBy || '—'}
                      <span style={{color:'var(--text-tertiary)'}}> · {requestedWhen}</span>
                      {pol && <span style={{color:'var(--text-tertiary)'}}> · against policy {pol.id}</span>}
                    </div>

                    {/* Reason — prominent, in its own block. */}
                    {ov.reason && (
                      <div style={{padding:'8px 12px',background:'var(--brand-tint)',border:'1px solid rgba(232,103,42,.25)',borderLeft:'3px solid var(--brand)',borderRadius:6,fontSize:12,lineHeight:1.5,marginBottom:8}}>
                        <div style={{fontSize:10,fontWeight:700,color:'var(--brand)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>Business justification</div>
                        <div style={{whiteSpace:'pre-wrap'}}>{ov.reason}</div>
                      </div>
                    )}

                    {/* Side-by-side current vs requested. Each row tinted when
                        it's a real change so reviewers see at a glance what
                        actually moves. */}
                    <div style={{border:'1px solid var(--border)',borderRadius:6,overflow:'hidden',marginBottom:8}}>
                      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',gap:0,fontSize:11,fontWeight:700,background:'#f1f5f9',padding:'6px 10px',color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.04em'}}>
                        <div>Field</div><div style={{textAlign:'right'}}>Current</div><div style={{textAlign:'right'}}>Requested</div>
                      </div>
                      {rows.map(r => {
                        const fromVal = r.from == null ? '—' : `${r.from}${r.suffix}`;
                        const toVal   = r.to   == null ? '—' : `${r.to}${r.suffix}`;
                        const changed = r.from != null && r.to != null && Number(r.from) !== Number(r.to);
                        return (
                          <div key={r.key} style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',gap:0,fontSize:11,padding:'6px 10px',background: changed ? '#fff7ed' : '#fff',borderTop:'1px solid var(--border)'}}>
                            <div style={{color:'var(--text-secondary)'}}>{r.label}</div>
                            <div style={{textAlign:'right',fontFamily:'ui-monospace,monospace',color:'var(--text-tertiary)'}}>{fromVal}</div>
                            <div style={{textAlign:'right',fontFamily:'ui-monospace,monospace',fontWeight:changed ? 700 : 500,color: changed ? 'var(--brand)' : 'var(--text-primary)'}}>{toVal}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pool impact preview (rate change × deal value). Skip
                        if both pools are null/equal. */}
                    {curPool != null && reqPool != null && curPool !== reqPool && (
                      <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:8}}>
                        <b>Pool impact:</b> EGP {curPool.toLocaleString('en-EG')} → <b style={{color:'var(--brand)'}}>EGP {reqPool.toLocaleString('en-EG')}</b> ({reqPool > curPool ? '+' : ''}{(reqPool - curPool).toLocaleString('en-EG')})
                      </div>
                    )}

                    {!anyChange && (
                      <div style={{fontSize:11,color:'#b45309',padding:'6px 10px',background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:6,marginBottom:8}}>
                        Request carries no rate or split changes — likely submitted in error. Reject and ask the requestor to resubmit.
                      </div>
                    )}

                    {canActOnOverride(personaKey, ov.status) && (
                      <div style={{display:'flex',gap:6,marginTop:8}}>
                        <button className="btn btn-sm btn-brand" onClick={()=>approveOverride(d, 'approve')}>
                          <Check size={13}/> {ov.status === 'Pending Manager' ? 'Accept · forward to Director' : 'Final approve & apply'}
                        </button>
                        <button className="btn btn-sm btn-outline" onClick={()=>approveOverride(d, 'reject')}>Reject</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )})}><Percent size={13}/> Override queue ({pendingOverrides.length})</button>
        )}
        <ExportMenu
          rows={deals}
          columns={DEALS_EXPORT_COLUMNS}
          filename={`deals_${pipeline.toLowerCase()}`}
          title="Off Plan Deal Pipeline Export"
          subtitle={`${deals.length} deal${deals.length === 1 ? '' : 's'} · scope ${h.role}`}
          size="md"
        />
        {!readOnly && <button className="btn btn-brand" onClick={()=>openAdd('OffPlan')}><Plus size={16}/> Add Deal</button>}
      </div>

      {/* Kanban / Table */}
      {view === 'kanban' ? (
        <div className="crm-kanban" style={{gridTemplateColumns:`repeat(${stages.length},minmax(220px,1fr))`}}>
          {stages.map(stage => (
            <div className="crm-kanban-column" key={stage}>
              <div className="crm-kanban-header">
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:stageColor(stage)}}/>
                  <span style={{fontWeight:700,fontSize:12}}>{stage}</span>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',background:'#f4f7fe',padding:'2px 8px',borderRadius:10}}>{grouped[stage].length}</span>
              </div>
              <div className="crm-kanban-cards">
                {grouped[stage].length === 0 ? <div style={{padding:'24px 0',textAlign:'center',fontSize:12,color:'var(--text-tertiary)'}}>No deals</div> :
                  grouped[stage].map(d => (
                    <div className="crm-kanban-card" key={d.id} onClick={()=>viewDetail(d)}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                        <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.leadName || d.lead || '—'}</div>
                        <GripVertical size={14} style={{color:'var(--text-tertiary)',flexShrink:0}}/>
                      </div>
                      <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:8,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.project} · {d.developer}</div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <span style={{fontSize:14,fontWeight:800,color:'var(--brand)'}}>EGP {fmt(d.value)}</span>
                        <span style={{fontSize:11,color:'var(--text-tertiary)'}}>{d.owner}</span>
                      </div>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {d.commissionLocked && <span style={{fontSize:10,fontWeight:700,color:'#475569',background:'#e2e8f0',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><Lock size={9}/> Locked</span>}
                        {d.homesAdvanceAvailable && !d.revenueRecognised && <span style={{fontSize:10,fontWeight:700,color:'#1e40af',background:'#dbeafe',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><Sparkles size={9}/> Advance</span>}
                        {d.revenueRecognised && <span style={{fontSize:10,fontWeight:700,color:'#166534',background:'#dcfce7',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><CheckCircle2 size={9}/> Revenue</span>}
                        {(d.attachments || []).length > 0 && <span style={{fontSize:10,fontWeight:700,color:'#64748b',background:'#f1f5f9',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><Paperclip size={9}/> {d.attachments.length}</span>}
                        {d.commissionOverride?.status === 'Pending' && <span style={{fontSize:10,fontWeight:700,color:'#92400e',background:'#fef3c7',padding:'2px 6px',borderRadius:4,display:'inline-flex',alignItems:'center',gap:3}}><Percent size={9}/> Override</span>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Type</th><th>Lead</th><th>Project</th><th>Value</th><th>Stage</th><th>Comm.</th><th>Flags</th><th>Owner</th><th>Actions</th></tr></thead>
          <tbody>{deals.length === 0 ? <tr><td colSpan={10} style={{textAlign:'center',padding:40,color:'var(--text-tertiary)'}}>No deals match your filters or visibility scope.</td></tr> : deals.map(d=>(
            <tr key={d.id}>
              <td className="muted" style={{fontSize:11}}>{d.id}</td>
              <td>Off Plan</td>
              <td className="bold clickable" onClick={()=>viewDetail(d)}>{d.leadName || d.lead}</td>
              <td className="muted">{d.project}</td>
              <td className="bold">EGP {fmt(d.value)}</td>
              <td><span className="badge" style={{background:`${stageColor(d.stage)}20`,color:stageColor(d.stage)}}>{d.stage}</span></td>
              <td className="muted">{d.commission}%{d.commissionLocked && ' 🔒'}</td>
              <td>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {d.homesAdvanceAvailable && <span style={{fontSize:10,color:'#1e40af',fontWeight:700}}>ADV</span>}
                  {d.revenueRecognised && <span style={{fontSize:10,color:'#166534',fontWeight:700}}>REV</span>}
                  {(d.attachments || []).length > 0 && <span style={{fontSize:10,color:'#64748b',fontWeight:700}}>{d.attachments.length}📎</span>}
                </div>
              </td>
              <td className="muted">{d.owner}</td>
              <td>
                <div style={{display:'flex',gap:4}}>
                  <button className="btn-icon" onClick={()=>viewDetail(d)} title="View"><Eye size={14}/></button>
                  {!readOnly && <button className="btn-icon" onClick={()=>openEdit(d)} title="Edit"><Edit size={14}/></button>}
                  {!readOnly && !d.commissionLocked && <button className="btn-icon" onClick={()=>openOverride(d)} title="Commission override"><Percent size={14}/></button>}
                  {!readOnly && <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDel(d.id)} title="Delete"><Trash2 size={14}/></button>}
                </div>
              </td>
            </tr>
          ))}</tbody></table></div></div>
      )}

      {/* ─── Add / Edit modal ─── */}
      {showAdd && <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>
          <div className="modal-header"><h3>{editDeal?'Edit Deal':'Add New Deal'}</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {/* Type selector retired May 2026 — Off Plan is the only pipeline. */}
              <div className="form-group"><label>Lead Name *</label><input type="text" value={form.leadName} onChange={e=>setForm({...form,leadName:e.target.value})} required/></div>
              <div className="form-group"><label>Project *</label><input type="text" value={form.project} onChange={e=>setForm({...form,project:e.target.value})} required/></div>
              <div className="form-group"><label>Developer</label><input type="text" value={form.developer} onChange={e=>setForm({...form,developer:e.target.value})}/></div>
              <div className="form-group"><label>Linked Property (Listing ID)</label>
                <select value={form.propertyId} onChange={e=>setForm({...form,propertyId:e.target.value})}>
                  <option value="">— None —</option>
                  {listings.map(l => <option key={l.id} value={l.id}>{l.id} · {l.project} {l.unitCode}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Value (EGP)</label><input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/></div>
              <div className="form-group"><label>Commission %</label><input type="number" value={form.commission} onChange={e=>setForm({...form,commission:e.target.value})} step="0.1"/></div>
              <div className="form-group"><label>Stage</label>
                <select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>
                  {DEAL_STAGES_OFFPLAN.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Owner</label><input type="text" value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})}/></div>

              {/* Off Plan payment block — the only type now. */}
              <div className="form-group" style={{gridColumn:'span 2',borderTop:'1px solid var(--border)',paddingTop:14,marginTop:4}}>
                <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Off Plan — Payment</div>
              </div>
              <div className="form-group"><label>Reservation Deposit (EGP)</label><input type="number" value={form.reservationDeposit} onChange={e=>setForm({...form,reservationDeposit:e.target.value})}/></div>
              <div className="form-group"><label>Payment Plan</label><input type="text" value={form.paymentPlan} onChange={e=>setForm({...form,paymentPlan:e.target.value})} placeholder="e.g. 10% down · 8y installments"/></div>
              <div className="form-group"><label>Commission Collection Due Date</label><input type="date" value={form.collectionDueDate} onChange={e=>setForm({...form,collectionDueDate:e.target.value})}/></div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-brand">{editDeal?'Save changes':'Create deal'}</button>
            </div>
          </form>
        </div>
      </div>}

      {/* ─── Override request modal ─── */}
      {/* TL/Manager fills in the requested 4-persona split (Agent / TL /
          Mgr / Dir % — Company auto-balances) plus the requested deal-side
          rate and a reason. On submit, an override request is created in
          status 'Pending Manager' (or 'Pending Director' if a Manager
          initiated). The deal's commission + split don't change until a
          Director final-approves through the chain. */}
      {overrideFor && (() => {
        // Resolve the active policy split for this deal so the SplitEditor
        // pre-fills with the current configured breakdown — the TL edits
        // away from there.
        const activePolicy = (state.commissionPolicies || []).find(
          p => p.developer === overrideFor.developer && p.project === overrideFor.project && p.status === 'Active'
        );
        const policySplit = activePolicy?.split || null;
        return (
        <div className="modal-overlay" onClick={()=>setOverrideFor(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
            <div className="modal-header"><h3>Request Commission Override · {overrideFor.id}</h3><button className="btn-icon" onClick={()=>setOverrideFor(null)}><X size={18}/></button></div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const data = {};
                fd.forEach((v, k) => { data[k] = v; });
                submitOverride(data);
              }}
            >
              <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
                {/* Context strip — current rate + policy reference. */}
                <div style={{padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,fontSize:12,lineHeight:1.6}}>
                  <div><b>Current rate:</b> {overrideFor.commission}%{activePolicy ? <span style={{color:'var(--text-tertiary)'}}> · policy {activePolicy.id} · {activePolicy.developer} / {activePolicy.project}</span> : ''}</div>
                  {policySplit && (
                    <div style={{marginTop:4,color:'var(--text-secondary)',fontSize:11}}>
                      <b>Policy split:</b> Agent {policySplit.agent}% · TL {policySplit.tl}% · Mgr {policySplit.manager}% · Dir {policySplit.director}% · Co {policySplit.company}%
                    </div>
                  )}
                  <div style={{marginTop:4,color:'var(--text-secondary)',fontSize:11}}>
                    Request will be reviewed by Sales Manager, then final-approved by Sales Director. The deal stays at the current rate until approved.
                  </div>
                </div>

                {/* Rate is FIXED at the deal's current rate — the request
                    only changes the internal 4-persona breakdown. */}
                <div style={{padding:'8px 12px',background:'#f1f5f9',border:'1px solid var(--border)',borderRadius:6,fontSize:12,display:'flex',alignItems:'center',gap:8}}>
                  <Lock size={14} color="var(--text-secondary)"/>
                  <span><b>Deal-side rate stays at {overrideFor.commission}%</b> — overrides change only the internal breakdown, not the rate paid by the developer.</span>
                </div>

                <div style={{margin:'4px 0 -4px',fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.08em'}}>
                  Requested split · 100% breakdown (Company auto-balances)
                </div>
                <SplitEditor initial={policySplit} />

                <div className="form-group">
                  <label>Reason</label>
                  <textarea
                    rows={3} required
                    name="reason"
                    placeholder="Business justification (developer incentive, special launch, VIP retention, etc.)"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={()=>setOverrideFor(null)}>Cancel</button>
                <button type="submit" className="btn btn-brand">Submit override request</button>
              </div>
            </form>
          </div>
        </div>
        );
      })()}

      {/* ─── Cancel / Write-off request modal ─── */}
      {cancelFor && (
        <div className="modal-overlay" onClick={()=>setCancelFor(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
            <div className="modal-header">
              <h3>Cancel / Write-off · {cancelFor.id}</h3>
              <button className="btn-icon" onClick={()=>setCancelFor(null)}><X size={18}/></button>
            </div>
            <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{padding:'10px 12px',background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:8,fontSize:12,lineHeight:1.5,color:'#92400e'}}>
                This submits a request — the deal stays active until the <b>Sales Director</b> approves it.
              </div>
              <div className="form-group">
                <label>Request type</label>
                <select value={cancelForm.kind} onChange={e=>setCancelForm({...cancelForm,kind:e.target.value})}>
                  <option value="Cancel">Cancel deal</option>
                  <option value="Write-off">Write off deal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Note <span style={{color:'var(--danger)'}}>*</span></label>
                <textarea
                  value={cancelForm.note}
                  onChange={e=>setCancelForm({...cancelForm,note:e.target.value})}
                  placeholder="Explain why this deal should be cancelled / written off — visible to the Sales Director and recorded in the audit trail."
                  style={{minHeight:80,resize:'vertical'}}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setCancelFor(null)}>Cancel</button>
              <button className="btn btn-brand" disabled={!cancelForm.note.trim()} onClick={submitCancel}>Submit for approval</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Decision modal (Manager Accept / Director Final Approve / Reject)
            Self-contained controlled component — the comment textarea binds
            to React state, no closures involved. */}
      {decisionFor && (() => {
        const d = decisionFor.deal;
        const decision = decisionFor.decision;
        const ov = d.commissionOverride || {};
        const isApprove = decision === 'approve';
        const isManagerStage = ov.status === 'Pending Manager';
        const headerTitle = isApprove
          ? (isManagerStage ? 'Accept · forward to Director' : 'Final approve & apply')
          : 'Reject override';
        const submitLabel = isApprove
          ? (isManagerStage ? 'Accept & forward' : 'Approve & apply')
          : 'Reject';
        return (
          <div className="modal-overlay" onClick={() => setDecisionFor(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:560}}>
              <div className="modal-header">
                <h3>{headerTitle} · {d.id}</h3>
                <button className="btn-icon" onClick={() => setDecisionFor(null)}><X size={18}/></button>
              </div>
              <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{padding:'10px 12px',background:'#f8fafc',border:'1px solid var(--border)',borderRadius:8,fontSize:12,lineHeight:1.6}}>
                  <div><b>{d.leadName || d.lead} · {d.project}</b></div>
                  <div style={{color:'var(--text-secondary)',marginTop:2}}>
                    Rate: {ov.currentPct}% → {ov.requestedPct}% · Δ {ov.delta}%
                  </div>
                  <div style={{color:'var(--text-tertiary)',marginTop:2,fontSize:11}}>Requested by {ov.requestedBy} · status: {ov.status}</div>
                </div>

                {ov.reason && (
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>Requestor justification</div>
                    <div style={{padding:'10px 12px',background:'#fff',border:'1px solid var(--border)',borderRadius:8,fontSize:13,whiteSpace:'pre-wrap'}}>{ov.reason}</div>
                  </div>
                )}

                {Array.isArray(ov.history) && ov.history.length > 0 && (
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>Decision history</div>
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      {ov.history.map((h, i) => (
                        <div key={i} style={{padding:'6px 10px',background: h.decision === 'reject' ? '#fee2e2' : '#dcfce7',borderRadius:6,fontSize:11,borderLeft:`3px solid ${h.decision === 'reject' ? '#dc2626' : '#16a34a'}`}}>
                          <b>{h.action || (h.decision === 'reject' ? 'Rejected' : 'Approved')}</b> by {h.actor} · {(h.at || '').slice(0,16).replace('T',' ')}
                          {h.comment && <div style={{fontStyle:'italic',color:'var(--text-secondary)',marginTop:2}}>"{h.comment}"</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:4}}>
                    Your comment <span style={{color:'var(--danger)'}}>*</span>
                  </label>
                  <textarea
                    value={decisionComment}
                    onChange={e => setDecisionComment(e.target.value)}
                    placeholder={isApprove
                      ? 'Why are you approving? (e.g. VIP retention, performance-based exception)'
                      : 'Why are you rejecting? (e.g. exceeds policy band, insufficient justification)'}
                    style={{width:'100%',minHeight:90,padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'inherit',resize:'vertical'}}
                    autoFocus
                  />
                  <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:4}}>Required for audit trail</div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setDecisionFor(null)}>Cancel</button>
                <button
                  className={`btn ${isApprove ? 'btn-brand' : 'btn-danger'}`}
                  disabled={!decisionComment.trim()}
                  onClick={submitDecision}
                >
                  {submitLabel}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
