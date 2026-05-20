// ═══════════════════════════════════════════════════════════════
// CRM → Commission Override Requests — dedicated page.
// ───────────────────────────────────────────────────────────────
// Previously the queue lived inside a right-side drawer, which was
// cramped for large requests (4-persona breakdown comparison, history,
// reasons). This page surfaces every pending request as a proper
// review card with role-aware filtering:
//   • Sales Manager     → sees only 'Pending Manager' rows
//   • Sales Director    → sees only 'Pending Director' rows
//   • Admin             → sees both
//   • TL / agent        → bounced to deals (they don't approve)
// Tabs allow viewing all-resolved (Approved / Rejected) history too.
// ═══════════════════════════════════════════════════════════════
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { HIERARCHY } from '../../data/crmAccess';
import { Check, X, Percent, Clock, CheckCircle2, XCircle, Filter, Search } from 'lucide-react';

const STATUS_COLORS = {
  'Pending Manager':  { bg:'#fef3c7', fg:'#92400e', border:'#fcd34d' },
  'Pending Director': { bg:'#fef3c7', fg:'#92400e', border:'#fcd34d' },
  'Approved':         { bg:'#dcfce7', fg:'#166534', border:'#86efac' },
  'Rejected':         { bg:'#fee2e2', fg:'#991b1b', border:'#fca5a5' },
};

const fmt = n => new Intl.NumberFormat('en-EG').format(n || 0);

export const CrmOverrides = () => {
  const { state, persona, personaKey, updateItem, writeAudit, toast } = useApp();
  const navigate = useNavigate();

  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };
  // Only management + admin roles land here. TLs and agents get
  // bounced to the deals page; they request from deal detail and watch
  // the per-deal status pill, not a global queue.
  const isManagement = ['salesManager','salesDirector','systemAdmin','backofficeAdmin'].includes(personaKey);
  if (!isManagement) {
    return <Navigate to="/system/crm/deals" replace />;
  }

  // Per-persona stage visibility for pending. Resolved (Approved / Rejected)
  // rows are visible to everyone who's in scope.
  const visiblePendingStatuses = useMemo(() => {
    if (personaKey === 'salesManager')  return ['Pending Manager'];
    if (personaKey === 'salesDirector') return ['Pending Director'];
    return ['Pending Manager','Pending Director']; // admins
  }, [personaKey]);

  const [tab, setTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');

  const allRows = useMemo(() => {
    return (state.deals || []).filter(d => d.commissionOverride);
  }, [state.deals]);

  const filtered = useMemo(() => {
    return allRows.filter(d => {
      const ov = d.commissionOverride;
      // Tab filter
      if (tab === 'pending') {
        if (!visiblePendingStatuses.includes(ov.status)) return false;
      } else if (tab === 'approved') {
        if (ov.status !== 'Approved') return false;
      } else if (tab === 'rejected') {
        if (ov.status !== 'Rejected') return false;
      }
      // Search
      if (search) {
        const needle = search.toLowerCase();
        const hay = `${d.id} ${d.leadName || ''} ${d.lead || ''} ${d.project || ''} ${ov.requestedBy || ''} ${ov.reason || ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      // Project filter
      if (projectFilter !== 'All' && d.project !== projectFilter) return false;
      return true;
    }).sort((a, b) => {
      const aAt = a.commissionOverride.requestedAt || '';
      const bAt = b.commissionOverride.requestedAt || '';
      return bAt.localeCompare(aAt);
    });
  }, [allRows, tab, search, projectFilter, visiblePendingStatuses]);

  const counts = useMemo(() => {
    const pending = allRows.filter(d => visiblePendingStatuses.includes(d.commissionOverride.status)).length;
    const approved = allRows.filter(d => d.commissionOverride.status === 'Approved').length;
    const rejected = allRows.filter(d => d.commissionOverride.status === 'Rejected').length;
    return { pending, approved, rejected, all: allRows.length };
  }, [allRows, visiblePendingStatuses]);

  const projects = useMemo(() => Array.from(new Set(allRows.map(d => d.project).filter(Boolean))).sort(), [allRows]);

  // Approve / reject — kept simple, opens a confirm-style flow via a
  // dedicated inline state. For the comment requirement we use a small
  // prompt-pattern: clicking the action opens an action panel below the
  // card with a comment field + confirm button.
  const [actingOn, setActingOn] = useState(null); // { dealId, decision }
  const [actComment, setActComment] = useState('');

  const startAction = (deal, decision) => {
    setActingOn({ dealId: deal.id, decision });
    setActComment('');
  };
  const cancelAction = () => { setActingOn(null); setActComment(''); };
  const submitAction = () => {
    if (!actingOn) return;
    const d = (state.deals || []).find(x => x.id === actingOn.dealId);
    if (!d) return;
    const decision = actingOn.decision;
    const comment = actComment.trim();
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
        writeAudit('Commission Override · Manager Accepted', `${d.id}`, 'CRM', `By ${persona.label} · "${comment}"`);
        toast('Accepted — forwarded to Sales Director', 'success');
      } else {
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
        writeAudit('Commission Override Approved', `${d.id}`, 'CRM', `Final approval by ${persona.label} · "${comment}"`);
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
    setActingOn(null);
    setActComment('');
  };

  const canActOn = (status) => {
    if (personaKey === 'systemAdmin' || personaKey === 'backofficeAdmin') return true;
    if (status === 'Pending Manager')  return personaKey === 'salesManager';
    if (status === 'Pending Director') return personaKey === 'salesDirector';
    return false;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Commission Override Requests</h1>
        <p className="page-subtitle">
          {h.role} · {visiblePendingStatuses.join(' / ')} pending in your queue · resolved history visible across all roles
        </p>
      </div>

      {/* KPI tabs */}
      <div className="kpi-grid kpi-grid-4" style={{marginBottom:18}}>
        {[
          { id:'pending',  label:'Pending review',  value: counts.pending,  icon: Clock,        color: 'var(--warning)' },
          { id:'approved', label:'Approved',        value: counts.approved, icon: CheckCircle2, color: 'var(--success)' },
          { id:'rejected', label:'Rejected',        value: counts.rejected, icon: XCircle,      color: 'var(--danger)' },
          { id:'all',      label:'All requests',    value: counts.all,      icon: Percent,      color: 'var(--brand)' },
        ].map(t => (
          <div
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background:'#fff',
              border: tab === t.id ? `2px solid ${t.color}` : '1px solid var(--card-border)',
              borderRadius:12,
              padding:'14px 18px',
              cursor:'pointer',
              display:'flex',alignItems:'center',gap:12,
            }}
          >
            <div style={{width:36,height:36,borderRadius:10,background:`${t.color}1a`,color:t.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <t.icon size={18}/>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>{t.label}</div>
              <div style={{fontSize:20,fontWeight:800,marginTop:2}}>{t.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',gap:10,marginBottom:18,alignItems:'center',flexWrap:'wrap'}}>
        <div className="search-box" style={{flex:'1 1 240px'}}>
          <Search size={16}/>
          <input type="text" placeholder="Search by deal · lead · project · requestor · reason…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="filter-select" value={projectFilter} onChange={e=>setProjectFilter(e.target.value)}>
          <option value="All">All projects</option>
          {projects.map(p => <option key={p}>{p}</option>)}
        </select>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--text-tertiary)'}}>
          <Filter size={12}/> Showing {filtered.length} of {allRows.length}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="data-panel" style={{padding:48,textAlign:'center',color:'var(--text-secondary)'}}>
          <Percent size={32} color="var(--text-tertiary)" style={{margin:'0 auto 12px'}}/>
          <div style={{fontSize:14,fontWeight:600}}>No override requests match.</div>
          <div style={{fontSize:12,color:'var(--text-tertiary)',marginTop:4}}>
            {tab === 'pending' ? 'Your queue is clear. New requests will appear here.' : 'Try widening the filters.'}
          </div>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {filtered.map(d => {
            const ov = d.commissionOverride;
            const colors = STATUS_COLORS[ov.status] || STATUS_COLORS['Pending Manager'];
            // Resolve policy split for comparison.
            const pol = (state.commissionPolicies || []).find(p => p.developer === d.developer && p.project === d.project && p.status === 'Active');
            const polSplit = pol?.split || null;
            const reqSplit = ov.requestedSplit;
            const rows = [
              { key:'rate',     label:'Deal-side rate',    from: ov.currentPct,         to: ov.requestedPct },
              { key:'agent',    label:'Agent share',        from: polSplit?.agent,       to: reqSplit?.agent },
              { key:'tl',       label:'Team Leader share',  from: polSplit?.tl,          to: reqSplit?.tl },
              { key:'manager',  label:'Sales Manager',      from: polSplit?.manager,     to: reqSplit?.manager },
              { key:'director', label:'Sales Director',     from: polSplit?.director,    to: reqSplit?.director },
              { key:'company',  label:'Company',            from: polSplit?.company,     to: reqSplit?.company },
            ];
            const requestedWhen = ov.requestedAt
              ? new Date(ov.requestedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
              : '—';
            const isActing = actingOn?.dealId === d.id;
            return (
              <div key={d.id} className="data-panel" style={{padding:18,borderLeft:`4px solid ${colors.border}`}}>
                {/* Header */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,marginBottom:10}}>
                  <div>
                    <div style={{fontSize:15,fontWeight:800}}>
                      <span style={{cursor:'pointer',color:'var(--text-primary)'}} onClick={()=>navigate(`/system/crm/deals`)}>{d.leadName || d.lead}</span>
                      <span style={{color:'var(--text-tertiary)',fontWeight:500}}> · {d.project}</span>
                    </div>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:3}}>
                      {d.id} · {d.developer || '—'} · Value EGP {fmt(d.value)} · Type {d.type}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{
                      padding:'4px 10px',
                      background:colors.bg,
                      color:colors.fg,
                      border:`1px solid ${colors.border}`,
                      borderRadius:999,
                      fontSize:11,
                      fontWeight:700,
                    }}>{ov.status}{ov.bypassedApproval ? ' (Direct)' : ''}</span>
                  </div>
                </div>

                {/* Requestor strip */}
                <div style={{padding:'8px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,fontSize:12,marginBottom:12}}>
                  <b>Requested by {ov.requestedBy || '—'}</b>
                  <span style={{color:'var(--text-tertiary)'}}> · {requestedWhen}</span>
                  {pol && <span style={{color:'var(--text-tertiary)'}}> · against policy {pol.id}</span>}
                  {ov.managerAcceptedBy && <span style={{color:'var(--text-tertiary)'}}> · accepted by {ov.managerAcceptedBy}</span>}
                  {ov.decidedBy && ov.status === 'Approved' && !ov.bypassedApproval && <span style={{color:'var(--text-tertiary)'}}> · final approval {ov.decidedBy}</span>}
                  {ov.rejectedBy && <span style={{color:'var(--text-tertiary)'}}> · rejected by {ov.rejectedBy}</span>}
                </div>

                {/* Reason */}
                {ov.reason && (
                  <div style={{padding:'10px 14px',background:'var(--brand-tint)',border:'1px solid rgba(232,103,42,.25)',borderLeft:'3px solid var(--brand)',borderRadius:8,fontSize:13,lineHeight:1.55,marginBottom:12}}>
                    <div style={{fontSize:10,fontWeight:700,color:'var(--brand)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:3}}>Business justification</div>
                    <div style={{whiteSpace:'pre-wrap'}}>{ov.reason}</div>
                  </div>
                )}

                {/* Comparison */}
                <div style={{border:'1px solid var(--border)',borderRadius:8,overflow:'hidden',marginBottom:12}}>
                  <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',gap:0,fontSize:11,fontWeight:700,background:'#f1f5f9',padding:'7px 12px',color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.04em'}}>
                    <div>Field</div><div style={{textAlign:'right'}}>Current</div><div style={{textAlign:'right'}}>Requested</div>
                  </div>
                  {rows.map(r => {
                    const fromVal = r.from == null ? '—' : `${r.from}%`;
                    const toVal   = r.to   == null ? '—' : `${r.to}%`;
                    const changed = r.from != null && r.to != null && Number(r.from) !== Number(r.to);
                    return (
                      <div key={r.key} style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',gap:0,fontSize:12,padding:'7px 12px',background: changed ? '#fff7ed' : '#fff',borderTop:'1px solid var(--border)'}}>
                        <div style={{color:'var(--text-secondary)'}}>{r.label}</div>
                        <div style={{textAlign:'right',fontFamily:'ui-monospace,monospace',color:'var(--text-tertiary)'}}>{fromVal}</div>
                        <div style={{textAlign:'right',fontFamily:'ui-monospace,monospace',fontWeight:changed ? 700 : 500,color: changed ? 'var(--brand)' : 'var(--text-primary)'}}>{toVal}</div>
                      </div>
                    );
                  })}
                </div>

                {/* History timeline */}
                {Array.isArray(ov.history) && ov.history.length > 0 && (
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Decision history</div>
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      {ov.history.map((entry, i) => (
                        <div key={i} style={{padding:'7px 10px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:6,borderLeft:`3px solid ${entry.decision === 'reject' ? '#dc2626' : '#16a34a'}`,fontSize:12}}>
                          <div style={{display:'flex',justifyContent:'space-between',gap:6}}>
                            <span><b>{entry.action || (entry.decision === 'reject' ? 'Rejected' : 'Approved')}</b> by {entry.actor}</span>
                            <span style={{color:'var(--text-tertiary)',fontFamily:'ui-monospace,monospace',fontSize:11}}>{(entry.at || '').slice(0,16).replace('T',' ')}</span>
                          </div>
                          {entry.comment && <div style={{color:'var(--text-secondary)',fontStyle:'italic',marginTop:3}}>"{entry.comment}"</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action panel — inline comment + buttons, no modal */}
                {(ov.status === 'Pending Manager' || ov.status === 'Pending Director') && canActOn(ov.status) && (
                  isActing ? (
                    <div style={{padding:12,background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8}}>
                      <label style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:4}}>
                        {actingOn.decision === 'approve' ? 'Approval comment' : 'Rejection reason'}
                        <span style={{color:'var(--danger)'}}> *</span>
                      </label>
                      <textarea
                        value={actComment}
                        onChange={e => setActComment(e.target.value)}
                        autoFocus
                        placeholder={actingOn.decision === 'approve' ? 'Why are you approving this?' : 'Why are you rejecting this?'}
                        style={{width:'100%',minHeight:70,padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'inherit',resize:'vertical'}}
                      />
                      <div style={{display:'flex',gap:8,marginTop:8,justifyContent:'flex-end'}}>
                        <button className="btn btn-outline btn-sm" onClick={cancelAction}>Cancel</button>
                        <button
                          className={`btn btn-sm ${actingOn.decision === 'approve' ? 'btn-brand' : 'btn-danger'}`}
                          disabled={!actComment.trim()}
                          onClick={submitAction}
                        >
                          {actingOn.decision === 'approve'
                            ? (ov.status === 'Pending Manager' ? 'Accept & forward to Director' : 'Final approve & apply')
                            : 'Confirm reject'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn btn-brand btn-sm" onClick={() => startAction(d, 'approve')}>
                        <Check size={13}/> {ov.status === 'Pending Manager' ? 'Accept · forward to Director' : 'Final approve & apply'}
                      </button>
                      <button className="btn btn-outline btn-sm" style={{color:'var(--danger)'}} onClick={() => startAction(d, 'reject')}>
                        <X size={13}/> Reject
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
