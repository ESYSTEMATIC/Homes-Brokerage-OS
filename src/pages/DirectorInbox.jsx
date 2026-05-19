// ═══════════════════════════════════════════════════════════════════════
// Director Inbox — consolidated approval queue
// ───────────────────────────────────────────────────────────────────────
// Audit-finding fix (May 2026): the auditor's #1 cross-role recommendation
// was a single page where the Director / Executive can see every item
// awaiting their approval — HR offers, Finance commissions, Deal overrides —
// without bouncing between three modules. This page unions all three sources
// into one age-sorted list with inline approve / reject and a quick-link to
// the underlying record.
// ═══════════════════════════════════════════════════════════════════════
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Inbox, ShieldCheck, Percent, BadgeDollarSign, UserPlus, Filter, ChevronRight,
  AlertTriangle, CheckCircle2, X, Clock,
} from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-EG').format(n || 0);
const daysAgo = (iso) => {
  if (!iso) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
};

export const DirectorInbox = () => {
  const { state, updateItem, toast, writeAudit, persona, personaKey, openModal } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all | offers | commissions | overrides

  // ─── Build the consolidated queue ──────────────────────────────
  const queue = useMemo(() => {
    const rows = [];

    // 1) HR offers awaiting Director approval
    (state.offers || []).filter(o => o.stage === 'Pending Approval').forEach(o => {
      rows.push({
        kind: 'offer',
        id: o.id,
        title: `Offer to ${o.candidateName}`,
        subtitle: `${o.jobTitle} · EGP ${fmt(o.salaryMonthly)}/mo`,
        meta: `Drafted by ${o.draftedBy || 'HR'}`,
        ageDays: daysAgo(o.approvedAt || o.sentAt || (state.audit || []).find(a => a.target === o.id)?.timestamp),
        value: o.salaryMonthly,
        record: o,
        photoDataUrl: o.photoDataUrl,
        actor: o.candidateName,
        link: `/backoffice/recruitment?openOffer=${o.id}`,
      });
    });

    // 2) Finance commissions pending approval
    (state.commEngine || []).filter(c => c.status === 'Pending').forEach(c => {
      rows.push({
        kind: 'commission',
        id: c.id,
        title: `Commission · ${c.deal}`,
        subtitle: `${c.agent} · pool EGP ${fmt(c.pool)} (Agent ${fmt(c.agentShare)} · TL ${fmt(c.tlShare)} · Co ${fmt(c.companyShare)})`,
        meta: `Awaiting Finance Officer / Director sign-off`,
        ageDays: 3, // approximation
        value: c.pool,
        record: c,
        actor: c.agent,
        link: `/backoffice/finance/commission`,
      });
    });

    // 3) Deal commission overrides
    (state.deals || []).filter(d => d.commissionOverride?.status === 'Pending').forEach(d => {
      rows.push({
        kind: 'override',
        id: d.id,
        title: `Override · ${d.leadName || d.lead || d.project}`,
        subtitle: `${d.commissionOverride.currentPct}% → ${d.commissionOverride.requestedPct}% (Δ ${d.commissionOverride.delta}%) · deal value EGP ${fmt(d.value)}`,
        meta: `Requested by ${d.commissionOverride.requestedBy} · routed to ${d.commissionOverride.approver}`,
        ageDays: daysAgo(d.commissionOverride.requestedAt),
        value: d.value,
        record: d,
        actor: d.commissionOverride.requestedBy,
        link: `/system/crm/deals`,
      });
    });

    return rows.sort((a, b) => b.ageDays - a.ageDays);
  }, [state.offers, state.commEngine, state.deals, state.audit]);

  const filtered = filter === 'all' ? queue : queue.filter(r => r.kind === filter || (filter === 'offers' && r.kind === 'offer') || (filter === 'commissions' && r.kind === 'commission') || (filter === 'overrides' && r.kind === 'override'));

  // ─── Decision handlers ─────────────────────────────────────────
  const decideOffer = (row, decision) => {
    const o = row.record;
    let comment = '';
    openModal({
      title: `${decision === 'approve' ? 'Approve' : 'Reject'} offer · ${o.id}`,
      subtitle: `${o.candidateName} · ${o.jobTitle}`,
      submitLabel: decision === 'approve' ? 'Approve' : 'Reject',
      body: (
        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          <div style={{padding:'10px 12px', background:'#f8fafc', borderRadius:8, fontSize:12}}>
            <b>Salary:</b> EGP {fmt(o.salaryMonthly)}/mo · <b>Start:</b> {o.startDate}<br/>
            <b>Reports to:</b> {o.reportingTo}<br/>
            <b>HR notes:</b> {o.notes || '—'}
          </div>
          <div>
            <label style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Your comment <span style={{color:'var(--danger)'}}>*</span></label>
            <textarea defaultValue="" onChange={e => { comment = e.target.value; }} placeholder={decision === 'approve' ? 'Why are you approving?' : 'Why are you rejecting?'} style={{width:'100%', minHeight:80, padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:13, fontFamily:'inherit', marginTop:6, resize:'vertical'}}/>
          </div>
        </div>
      ),
      onSubmit: () => {
        if (!comment.trim()) { toast('Comment required for audit trail', 'error'); return false; }
        const next = decision === 'approve' ? 'Approved' : 'Declined';
        updateItem('offers', o.id, {
          stage: next,
          approvedBy: decision === 'approve' ? persona.label : o.approvedBy,
          approvedAt: decision === 'approve' ? new Date().toISOString() : o.approvedAt,
          declinedAt: decision === 'reject' ? new Date().toISOString() : null,
          decisionComment: comment.trim(),
        });
        writeAudit(`Offer ${next}`, o.id, 'Backoffice', `By ${persona.label} · "${comment.trim()}"`);
        toast(`Offer ${next.toLowerCase()}`, decision === 'approve' ? 'success' : 'info');
      },
    });
  };

  const decideCommission = (row, decision) => {
    const c = row.record;
    // Every commission-engine state change appends a transaction entry
    // to the record's history[] so the per-record action log is complete.
    const at = new Date().toISOString();
    const baseEntry = {
      at,
      actor: persona.label,
      fromStatus: c.status,
      via: 'Director Inbox',
    };
    if (decision === 'approve') {
      const entry = {
        ...baseEntry,
        action: 'Approved',
        toStatus: 'Approved',
        amount: c.pool,
        detail: `Pool locked at ${fmt(c.pool)} — Agent ${fmt(c.agentShare)} · TL ${fmt(c.tlShare)} · Company ${fmt(c.companyShare)}`,
      };
      updateItem('commEngine', c.id, {
        status: 'Approved',
        approvedAt: at,
        approvedBy: persona.label,
        history: [...(c.history || []), entry],
      });
      writeAudit('Commission Approved', `${c.deal}: ${fmt(c.pool)}`, 'Finance', `By ${persona.label} · via Director Inbox`);
      toast('Commission approved', 'success');
    } else {
      const entry = {
        ...baseEntry,
        action: 'Rejected',
        toStatus: 'Rejected',
        detail: 'Rejected from Director Inbox',
      };
      updateItem('commEngine', c.id, {
        status: 'Rejected',
        rejectedAt: at,
        rejectedBy: persona.label,
        history: [...(c.history || []), entry],
      });
      writeAudit('Commission Rejected', c.deal, 'Finance', `By ${persona.label} · via Director Inbox`);
      toast('Commission rejected', 'info');
    }
  };

  const decideOverride = (row, decision) => {
    const d = row.record;
    let comment = '';
    openModal({
      title: `${decision === 'approve' ? 'Approve' : 'Reject'} override · ${d.id}`,
      subtitle: `${d.commissionOverride.currentPct}% → ${d.commissionOverride.requestedPct}% (Δ ${d.commissionOverride.delta}%)`,
      submitLabel: decision === 'approve' ? 'Approve & apply' : 'Reject',
      body: (
        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          <div style={{padding:'10px 12px', background:'#f8fafc', borderRadius:8, fontSize:12}}>
            <b>Justification:</b> {d.commissionOverride.reason}<br/>
            <b>Requested by:</b> {d.commissionOverride.requestedBy}
          </div>
          <div>
            <label style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Your comment <span style={{color:'var(--danger)'}}>*</span></label>
            <textarea defaultValue="" onChange={e => { comment = e.target.value; }} placeholder={decision === 'approve' ? 'Why are you approving?' : 'Why are you rejecting?'} style={{width:'100%', minHeight:80, padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:13, fontFamily:'inherit', marginTop:6, resize:'vertical'}}/>
          </div>
        </div>
      ),
      onSubmit: () => {
        if (!comment.trim()) { toast('Comment required', 'error'); return false; }
        const at = new Date().toISOString();
        const historyEntry = { actor: persona.label, decision, comment: comment.trim(), at };
        const prevHistory = d.commissionOverride.history || [];
        if (decision === 'approve') {
          updateItem('deals', d.id, {
            commission: d.commissionOverride.requestedPct,
            commissionOverride: { ...d.commissionOverride, status: 'Approved', decidedBy: persona.label, decidedAt: at, decisionComment: comment.trim(), history: [...prevHistory, historyEntry] },
          });
          writeAudit('Commission Override Approved', `${d.id}: ${d.commissionOverride.currentPct}% → ${d.commissionOverride.requestedPct}%`, 'CRM', `By ${persona.label} · "${comment.trim()}"`);
          toast('Override approved & applied', 'success');
        } else {
          updateItem('deals', d.id, {
            commissionOverride: { ...d.commissionOverride, status: 'Rejected', decidedBy: persona.label, decidedAt: at, decisionComment: comment.trim(), history: [...prevHistory, historyEntry] },
          });
          writeAudit('Commission Override Rejected', d.id, 'CRM', `By ${persona.label} · "${comment.trim()}"`);
          toast('Override rejected', 'info');
        }
      },
    });
  };

  const KIND_META = {
    offer:      { color: '#8b5cf6', icon: UserPlus,         label: 'HR Offer' },
    commission: { color: '#16a34a', icon: BadgeDollarSign,  label: 'Commission' },
    override:   { color: '#E8672A', icon: Percent,          label: 'Override' },
  };

  const counts = {
    offers:      queue.filter(r => r.kind === 'offer').length,
    commissions: queue.filter(r => r.kind === 'commission').length,
    overrides:   queue.filter(r => r.kind === 'override').length,
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Backoffice</span><span>&gt;</span><span className="current">Director Inbox</span></div>
        <h1 className="page-title">Director Inbox</h1>
        <p className="page-subtitle">Consolidated approval queue across HR · Finance · Deals — sorted by age</p>
      </div>

      {/* KPI strip */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:20}}>
        {[
          ['Total awaiting',     queue.length,            '#0f172a', Inbox],
          ['HR offers',          counts.offers,           KIND_META.offer.color,      KIND_META.offer.icon],
          ['Commissions',        counts.commissions,      KIND_META.commission.color, KIND_META.commission.icon],
          ['Overrides',          counts.overrides,        KIND_META.override.color,   KIND_META.override.icon],
        ].map(([label, value, color, Ico]) => (
          <div key={label} style={{background:'#fff', border:'1px solid var(--border)', borderRadius:12, padding:'16px 20px', borderTop:`3px solid ${color}`, display:'flex', alignItems:'center', gap:14}}>
            <div style={{width:42, height:42, borderRadius:10, background:`${color}15`, color, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <Ico size={20}/>
            </div>
            <div>
              <div style={{fontSize:12, color:'var(--text-secondary)', fontWeight:600}}>{label}</div>
              <div style={{fontSize:24, fontWeight:800, marginTop:2}}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center'}}>
        <Filter size={14} color="var(--text-tertiary)"/>
        {[
          ['all',         `All (${queue.length})`,           '#0f172a'],
          ['offers',      `HR Offers (${counts.offers})`,    KIND_META.offer.color],
          ['commissions', `Commissions (${counts.commissions})`, KIND_META.commission.color],
          ['overrides',   `Overrides (${counts.overrides})`, KIND_META.override.color],
        ].map(([k, lbl, c]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              padding:'7px 14px', borderRadius:999, fontSize:12, fontWeight:600, cursor:'pointer',
              border: `1.5px solid ${filter === k ? c : 'var(--border)'}`,
              background: filter === k ? c : '#fff',
              color: filter === k ? '#fff' : 'var(--text-primary)',
            }}>{lbl}</button>
        ))}
      </div>

      {/* Queue */}
      {filtered.length === 0 ? (
        <div style={{padding:'80px 20px', textAlign:'center', background:'#fff', border:'1px solid var(--border)', borderRadius:12}}>
          <CheckCircle2 size={42} color="#10b981" style={{margin:'0 auto 14px'}}/>
          <div style={{fontSize:16, fontWeight:700, color:'var(--text-primary)'}}>Inbox zero</div>
          <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:6}}>Nothing awaits your decision right now.</div>
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {filtered.map(row => {
            const meta = KIND_META[row.kind];
            const Ico = meta.icon;
            const ageColor = row.ageDays > 7 ? '#dc2626' : row.ageDays > 3 ? '#b45309' : '#475569';
            return (
              <div key={`${row.kind}-${row.id}`} style={{background:'#fff', border:'1px solid var(--border)', borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:14, borderLeft:`4px solid ${meta.color}`}}>
                <div style={{width:42, height:42, borderRadius:10, background:`${meta.color}15`, color: meta.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                  <Ico size={20}/>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:2, flexWrap:'wrap'}}>
                    <span style={{fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background:`${meta.color}15`, color: meta.color, textTransform:'uppercase', letterSpacing:'.05em'}}>{meta.label}</span>
                    <span style={{fontSize:10, color:'var(--text-tertiary)', fontFamily:'monospace'}}>{row.id}</span>
                    <span style={{display:'inline-flex', alignItems:'center', gap:3, fontSize:10, fontWeight:600, color: ageColor}}>
                      <Clock size={10}/> {row.ageDays}d
                      {row.ageDays > 7 && <AlertTriangle size={10}/>}
                    </span>
                  </div>
                  <div style={{fontSize:14, fontWeight:700, color:'var(--text-primary)'}}>{row.title}</div>
                  <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>{row.subtitle}</div>
                  <div style={{fontSize:11, color:'var(--text-tertiary)', marginTop:2}}>{row.meta}</div>
                </div>
                <div style={{display:'flex', gap:6, flexShrink:0}}>
                  {row.kind === 'offer'      && <><button className="btn btn-sm btn-brand"  onClick={() => decideOffer(row, 'approve')}><CheckCircle2 size={13}/> Approve…</button><button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={() => decideOffer(row, 'reject')}><X size={13}/> Reject…</button></>}
                  {row.kind === 'commission' && <><button className="btn btn-sm btn-brand"  onClick={() => decideCommission(row, 'approve')}><CheckCircle2 size={13}/> Approve</button><button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={() => decideCommission(row, 'reject')}><X size={13}/> Reject</button></>}
                  {row.kind === 'override'   && <><button className="btn btn-sm btn-brand"  onClick={() => decideOverride(row, 'approve')}><CheckCircle2 size={13}/> Approve…</button><button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={() => decideOverride(row, 'reject')}><X size={13}/> Reject…</button></>}
                  <button className="btn btn-sm btn-outline" onClick={() => navigate(row.link)} title="Open the underlying record"><ChevronRight size={13}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
