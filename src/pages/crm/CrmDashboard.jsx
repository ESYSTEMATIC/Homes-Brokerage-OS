// ═══════════════════════════════════════════════════════════════
// CRM Dashboard — role-aware data-driven landing
// ───────────────────────────────────────────────────────────────
// Single source of truth: every KPI / list / chart on this page derives
// from state.leads / state.deals / state.tasks / state.coldCalls /
// state.targets / state.audit — filtered by canSeeLead(persona). No
// hardcoded deltas, no stale stage names.
//
// Layout (top → bottom):
//   1. Hero header with role context + key pending counts
//   2. KPI strip (4 cards · clickable drill-down to drawer)
//   3. Today's Focus row — actionable items (SLA breaches · overdue tasks ·
//      override queue · cold calls awaiting review)
//   4. Targets card · monthly progress against state.targets[persona]
//   5. Pipeline Summary (Off Plan only — Resale retired May 2026)
//   6. Lead Sources (donut · hidden for individual-contributor agents)
//   7. Recent Leads + Recent Activity (2-col)
//   8. Top Performers (visible to TL+) · Upcoming Tasks
// ═══════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Users, KanbanSquare, TrendingUp, Target, ArrowUpRight, ArrowDownRight, UserPlus, Briefcase,
  CheckCircle2, Phone, ShieldCheck, AlertTriangle, Clock, Percent, ChevronRight,
  Award, PhoneCall, Megaphone, Sparkles, DollarSign,
} from 'lucide-react';
import { HIERARCHY, canSeeLead, slaForStage, leadAgeDays } from '../../data/crmAccess';
import { DEAL_STAGES_OFFPLAN } from '../../data/staticData';
import { Tooltip } from '../../components/UI';

const fmtN = (n) => new Intl.NumberFormat('en-EG').format(n || 0);
const fmtM = (n) => n >= 1e6 ? `EGP ${(n/1e6).toFixed(1)}M` : `EGP ${fmtN(n)}`;

export const CrmDashboard = () => {
  const { state, persona, personaKey, openDrawer } = useApp();
  const navigate = useNavigate();
  // pipelineTab kept as const for legacy references in the JSX below;
  // Resale tab removed, so only Off Plan remains.
  const pipelineTab = 'OffPlan';

  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };
  const isAgentScope = h.scope === 'self';
  const isManagerOrAbove = ['cross','all','audit'].includes(h.scope);

  // Role-scoped slices
  const leads = useMemo(() => (state.leads || []).filter(l => canSeeLead(personaKey, l)), [state.leads, personaKey]);
  const deals = useMemo(() => (state.deals || []).filter(d => canSeeLead(personaKey, d)), [state.deals, personaKey]);
  const tasks = state.tasks || [];
  const coldCalls = state.coldCalls || [];

  // Derived metrics
  const totalLeads = leads.length;
  const openLeads = leads.filter(l => !['Closed Won','Closed Lost','Nurturing'].includes(l.stage)).length;
  const activeDeals = deals.filter(d => d.status === 'Active' || d.status === undefined).length;
  const pipelineValue = deals.filter(d => d.status === 'Active' || d.status === undefined).reduce((s,d) => s + (d.value||0), 0);
  const closedWonCount = deals.filter(d => d.status === 'Closed' || d.status === 'Closed Won' || d.stage === 'Standard Collection (10%)' || d.stage === 'Contract Signed & Payment').length;
  const conversionRate = totalLeads ? Math.round((closedWonCount / totalLeads) * 100) : 0;
  const slaBreaches = leads.filter(l => slaForStage(l.stage, leadAgeDays(l.created)).level === 'breach').length;
  const slaWarnings = leads.filter(l => slaForStage(l.stage, leadAgeDays(l.created)).level === 'warn').length;
  const overrideQueue = deals.filter(d => d.commissionOverride?.status === 'Pending').length;
  const closedWonRevenue = deals.filter(d => d.revenueRecognised).reduce((s,d) => s + ((d.value||0) * (d.commission||0) / 100), 0);
  const homesAdvanceReady = deals.filter(d => d.homesAdvanceAvailable && !d.revenueRecognised).length;
  const nurturingCount = leads.filter(l => l.stage === 'Nurturing').length;
  const newUnassigned = leads.filter(l => l.stage === 'New' && !l.owner).length;
  const coldCallsAwaitingReview = coldCalls.filter(c => c.status === 'Called').length;

  // Today's task slice
  const todayIso = new Date().toISOString().slice(0,10);
  const myTasks = tasks.filter(t => t.status !== 'Completed' && (h.scope === 'all' || h.scope === 'audit' || h.scope === 'cross' || (h.scope === 'self' && t.owner === persona.label) || (h.scope === 'team')));
  const tasksDueToday = myTasks.filter(t => t.due === todayIso).length;
  const tasksOverdue = myTasks.filter(t => t.due < todayIso).length;

  // Targets
  const myTarget = state.targets?.[personaKey];
  const targetProgress = myTarget ? [
    { key:'leads',    label:'Leads',          actual: totalLeads,                                       target: myTarget.leadsTarget },
    { key:'deals',    label:'Deals',          actual: deals.length,                                     target: myTarget.dealsTarget },
    { key:'pipeline', label:'Pipeline value', actual: pipelineValue, fmt: v => fmtM(v),                 target: myTarget.pipelineTarget, targetFmt: v => `EGP ${(v/1e6).toFixed(0)}M` },
    { key:'closed',   label:'Closed Won',     actual: closedWonCount,                                   target: myTarget.closedWonTarget },
  ].map(t => ({ ...t, pct: Math.min(100, Math.round((Number(t.actual) / Math.max(1, t.target)) * 100)) })) : null;

  // Pipeline (Off Plan only — Resale retired May 2026)
  const offPlanDeals = deals.filter(d => d.type === 'OffPlan');
  const pipelineStages = DEAL_STAGES_OFFPLAN;
  const pipelineDeals = offPlanDeals;
  const stageCounts = pipelineStages.map(s => ({ stage: s, count: pipelineDeals.filter(d => d.stage === s).length, value: pipelineDeals.filter(d => d.stage === s).reduce((sum,d) => sum + (d.value||0), 0) }));
  const maxStage = Math.max(...stageCounts.map(s => s.count), 1);

  // Lead source distribution
  const SOURCE_COLORS = { 'Marketplace':'#3b82f6', 'Referral':'#10b981', 'Walk-in':'#f59e0b', 'Campaign':'#8b5cf6', 'Cold Calls':'#E8672A' };
  const sourceList = ['Marketplace','Referral','Walk-in','Campaign','Cold Calls'];
  const sourceCounts = sourceList.map(s => ({ source: s, count: leads.filter(l => l.source === s).length }));
  const sourceTotal = sourceCounts.reduce((s,r) => s + r.count, 0) || 1;

  // Top performers — by closed-won deals + revenue
  const perfMap = {};
  deals.forEach(d => {
    if (!d.owner) return;
    const p = perfMap[d.owner] || { agent: d.owner, deals: 0, closed: 0, revenue: 0 };
    p.deals += 1;
    if (d.revenueRecognised) {
      p.closed += 1;
      p.revenue += (d.value || 0) * (d.commission || 0) / 100;
    } else if (d.status === 'Closed' || d.status === 'Closed Won' || d.stage === 'Contract Signed' || d.stage === 'Standard Collection (10%)' || d.stage === 'Contract Signed & Payment') {
      p.closed += 1;
    }
    perfMap[d.owner] = p;
  });
  const topAgents = Object.values(perfMap).sort((a,b) => (b.revenue - a.revenue) || (b.deals - a.deals)).slice(0, 4);

  const activityIcon = { lead: <UserPlus size={14}/>, deal: <Briefcase size={14}/>, task: <CheckCircle2 size={14}/>, coldcall: <PhoneCall size={14}/>, share: <Megaphone size={14}/> };
  const activityColor = { lead: '#3b82f6', deal: '#10b981', task: '#E8672A', coldcall: '#8b5cf6', share: '#f59e0b' };

  // Build the activity feed from the audit log filtered STRICTLY to CRM
  // modules — Leads / Deals / Tasks / Cold Calls / Campaigns / Listing Shares.
  // Login events, Backoffice CRUD, External redirects and HR actions are
  // excluded — they belong to the Employee Board / Backoffice activity feeds.
  const CRM_MODULES = new Set(['CRM','Leads','Deals','Tasks','Cold Calls','Campaigns','Listing Shares']);
  const visibleLeadIds = new Set(leads.map(l => l.id));
  const visibleLeadNames = new Set(leads.map(l => l.name));
  const visibleDealIds = new Set(deals.map(d => d.id));

  const recentActivity = (state.audit || [])
    .filter(a => CRM_MODULES.has(a.module))
    // Role-scope: agents only see entries that reference one of their own
    // leads / deals. Managers + audit roles see everything within CRM.
    .filter(a => {
      if (h.scope === 'all' || h.scope === 'audit' || h.scope === 'cross') return true;
      const target = a.target || '';
      const detail = a.detail || '';
      // Match own lead/deal IDs explicitly, or persona's own name in the detail
      if (visibleLeadIds.has(target) || visibleDealIds.has(target)) return true;
      const blob = `${target} ${detail}`;
      for (const id of visibleLeadIds) if (blob.includes(id)) return true;
      for (const id of visibleDealIds) if (blob.includes(id)) return true;
      for (const name of visibleLeadNames) if (blob.includes(name)) return true;
      return false;
    })
    .slice(0, 8)
    .map(a => {
      const m = (a.module || '').toLowerCase();
      const act = (a.action || '').toLowerCase();
      const type =
        m.includes('cold call') || act.includes('cold call') ? 'coldcall' :
        m.includes('deal')      || act.includes('deal')      ? 'deal' :
        m.includes('lead')      || act.includes('lead')      ? 'lead' :
        m.includes('share')     || act.includes('share')     ? 'share' :
        'task';
      return {
        id: a.id || `${a.timestamp}-${a.action}`,
        type,
        action: a.action,
        detail: a.target || a.detail || '—',
        time: a.timestamp,
      };
    });

  const roleScopeLabel =
    h.scope === 'self'  ? 'Own scope only' :
    h.scope === 'team'  ? `Team ${h.team}` :
    h.scope === 'cross' ? `Teams ${h.teams?.join(' + ')}` :
    h.scope === 'all'   ? 'All teams (full hierarchy)' :
    h.scope === 'audit' ? 'Audit-only (read)' : 'No access';

  // ── Reusable helpers ──
  const openLeadDrawer = (filtered, title, subtitle) => openDrawer({
    title, subtitle: subtitle || `${filtered.length} lead${filtered.length===1?'':'s'}`,
    content: (
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {filtered.length === 0 ? <div style={{padding:20,color:'var(--text-tertiary)'}}>Nothing matches.</div> :
          filtered.map(l => (
            <div key={l.id} onClick={()=>navigate(`/system/crm/leads/${l.id}`)} style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,cursor:'pointer',background:'#fafbfc'}}>
              <div style={{fontWeight:700,fontSize:13}}>{l.name}</div>
              <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>{l.id} · {l.project || '—'} · {l.stage} · {l.priority}</div>
            </div>
          ))}
      </div>
    ),
  });
  const openDealsDrawer = (filtered, title, subtitle) => openDrawer({
    title, subtitle: subtitle || `${filtered.length} deal${filtered.length===1?'':'s'}`,
    content: (
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {filtered.length === 0 ? <div style={{padding:20,color:'var(--text-tertiary)'}}>No deals.</div> :
          filtered.map(d => (
            <div key={d.id} onClick={()=>navigate('/system/crm/deals')} style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,cursor:'pointer',background:'#fafbfc'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                <div style={{fontWeight:700,fontSize:13}}>{d.leadName || d.lead} · {d.project}</div>
                <div style={{fontSize:13,fontWeight:800,color:'var(--brand)',whiteSpace:'nowrap'}}>{fmtM(d.value)}</div>
              </div>
              <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>{d.id} · Off Plan · {d.stage}{d.commissionLocked ? ' · 🔒' : ''}{d.revenueRecognised ? ' · ✅' : ''}</div>
            </div>
          ))}
      </div>
    ),
  });

  // ── KPI definitions (role-aware) ──
  const kpis = [
    {
      label: 'Open Leads', value: openLeads, sub: `${totalLeads} total`,
      icon: Users, color: '#3b82f6',
      tip: 'Leads in any active stage (not Closed Won/Lost/Nurturing). Includes New, Contacted, Qualified, Reservation, Negotiation.',
      onClick: () => openLeadDrawer(leads.filter(l => !['Closed Won','Closed Lost','Nurturing'].includes(l.stage)), 'Open Leads'),
    },
    {
      label: 'Active Deals', value: activeDeals, sub: fmtM(pipelineValue) + ' pipeline',
      icon: KanbanSquare, color: '#10b981',
      tip: 'Deals currently in the Off Plan pipeline. Pipeline value shows total weighted deal value.',
      onClick: () => openDealsDrawer(deals.filter(d => d.status === 'Active' || d.status === undefined), 'Active Deals'),
    },
    {
      label: 'Revenue Recognised', value: fmtM(closedWonRevenue), sub: `${closedWonCount} closed won`,
      icon: DollarSign, color: '#E8672A',
      tip: 'Recognised at Standard Collection (10%) for Off Plan deals.',
      onClick: () => openDealsDrawer(deals.filter(d => d.revenueRecognised), 'Revenue Recognised'),
    },
    {
      label: 'Conversion Rate', value: `${conversionRate}%`, sub: `${closedWonCount}/${totalLeads} → closed`,
      icon: Target, color: '#8b5cf6',
      tip: 'Percentage of leads that converted to Closed Won deals over the current window. Industry benchmark: 8-12%.',
      onClick: () => navigate('/system/crm/reports'),
    },
  ];

  // ── Today's Focus tiles (only relevant items shown) ──
  const focusItems = [
    slaBreaches > 0 && {
      key: 'sla', icon: AlertTriangle, color: '#dc2626', label: 'SLA Breaches', value: slaBreaches,
      desc: `${slaBreaches} lead${slaBreaches===1?'':'s'} past SLA · auto-escalates to TL`,
      onClick: () => openLeadDrawer(leads.filter(l => slaForStage(l.stage, leadAgeDays(l.created)).level === 'breach'), 'SLA Breaches'),
    },
    tasksOverdue > 0 && {
      key: 'overdue', icon: Clock, color: '#f59e0b', label: 'Overdue Tasks', value: tasksOverdue,
      desc: `${tasksOverdue} task${tasksOverdue===1?'':'s'} past due · ${tasksDueToday} due today`,
      onClick: () => navigate('/system/crm/tasks'),
    },
    overrideQueue > 0 && {
      key: 'override', icon: Percent, color: '#E8672A', label: 'Override Queue', value: overrideQueue,
      desc: `${overrideQueue} commission override${overrideQueue===1?'':'s'} pending approval`,
      onClick: () => navigate('/system/crm/deals'),
    },
    newUnassigned > 0 && isManagerOrAbove && {
      key: 'unassigned', icon: UserPlus, color: '#3b82f6', label: 'Unassigned Leads', value: newUnassigned,
      desc: `${newUnassigned} new lead${newUnassigned===1?'':'s'} awaiting agent assignment`,
      onClick: () => openLeadDrawer(leads.filter(l => l.stage === 'New' && !l.owner), 'Unassigned New Leads'),
    },
    coldCallsAwaitingReview > 0 && isManagerOrAbove && {
      key: 'cc', icon: PhoneCall, color: '#8b5cf6', label: 'Cold Calls — Review', value: coldCallsAwaitingReview,
      desc: `${coldCallsAwaitingReview} called record${coldCallsAwaitingReview===1?'':'s'} awaiting Convert / Not-Lead decision`,
      onClick: () => navigate('/system/crm/cold-calls'),
    },
    homesAdvanceReady > 0 && {
      key: 'advance', icon: Sparkles, color: '#1e40af', label: 'Homes Advance Ready', value: homesAdvanceReady,
      desc: `${homesAdvanceReady} deal${homesAdvanceReady===1?'':'s'} eligible to request commission advance`,
      onClick: () => openDealsDrawer(deals.filter(d => d.homesAdvanceAvailable && !d.revenueRecognised), 'Homes Advance Eligible'),
    },
    nurturingCount > 0 && {
      key: 'nurturing', icon: Award, color: '#94a3b8', label: 'Nurturing', value: nurturingCount,
      desc: `${nurturingCount} lead${nurturingCount===1?'':'s'} kept warm for future re-engagement`,
      onClick: () => openLeadDrawer(leads.filter(l => l.stage === 'Nurturing'), 'Nurturing Leads'),
    },
  ].filter(Boolean);

  return (
    <div className="crm-page">
      {/* ── Hero header ── */}
      <div style={{
        background:'linear-gradient(135deg,#0f172a 0%,#1e293b 55%,#312e81 100%)',
        borderRadius:16, padding:'22px 26px', marginBottom:20, color:'#fff', position:'relative', overflow:'hidden',
        boxShadow:'0 12px 28px rgba(15,23,42,.18)',
      }}>
        <div style={{position:'absolute',right:-60,top:-60,width:260,height:260,borderRadius:'50%',background:'radial-gradient(circle,rgba(232,103,42,.22),rgba(232,103,42,0))'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:18,flexWrap:'wrap',position:'relative'}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:'.05em',color:'rgba(255,255,255,.55)',textTransform:'uppercase'}}>CRM · Sales Operations</div>
            <h1 style={{fontSize:26,fontWeight:800,margin:0,marginTop:4,color:'#fff'}}>Welcome, {persona.label.split(' ')[0]}</h1>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10,alignItems:'center'}}>
              <span style={{padding:'4px 10px',background:'rgba(255,255,255,.12)',borderRadius:999,fontSize:11,fontWeight:600}}>{h.role}</span>
              <span style={{padding:'4px 10px',background:'rgba(232,103,42,.18)',borderRadius:999,fontSize:11,fontWeight:600,color:'#FBBF24'}}><ShieldCheck size={11} style={{verticalAlign:'middle',marginRight:4}}/>{roleScopeLabel}</span>
              {overrideQueue > 0 && <span style={{padding:'4px 10px',background:'rgba(232,103,42,.22)',borderRadius:999,fontSize:11,fontWeight:700,color:'#FBBF24'}}>● {overrideQueue} override{overrideQueue===1?'':'s'} pending</span>}
              {slaBreaches > 0 && <span style={{padding:'4px 10px',background:'rgba(220,38,38,.22)',borderRadius:999,fontSize:11,fontWeight:700,color:'#FCA5A5'}}>● {slaBreaches} SLA breach{slaBreaches===1?'':'es'}</span>}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,auto)',gap:18,textAlign:'right'}}>
            {[
              ['Visible leads', totalLeads],
              ['Active deals', activeDeals],
              ['Pipeline', fmtM(pipelineValue)],
            ].map(([l,v]) => (
              <div key={l}>
                <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,.55)',textTransform:'uppercase',letterSpacing:'.06em'}}>{l}</div>
                <div style={{fontSize:20,fontWeight:800,color:'#fff',marginTop:2}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:18}}>
        {kpis.map(k => (
          <div
            key={k.label}
            onClick={k.onClick}
            style={{
              background:'#fff', border:'1px solid var(--card-border)', borderRadius:12, padding:'16px 18px',
              display:'flex', gap:14, alignItems:'center', cursor:'pointer',
              transition:'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 16px rgba(0,0,0,.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
          >
            <div style={{width:44,height:44,borderRadius:11,background:`${k.color}1a`,color:k.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <k.icon size={20}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em',display:'flex',alignItems:'center',gap:5}}>
                {k.label}
                {k.tip && <span onClick={e => e.stopPropagation()}><Tooltip text={k.tip}/></span>}
              </div>
              <div style={{fontSize:22,fontWeight:800,marginTop:2}}>{k.value}</div>
              <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:2}}>{k.sub}</div>
            </div>
            <ChevronRight size={14} color="var(--text-tertiary)"/>
          </div>
        ))}
      </div>

      {/* ── Today's Focus ── */}
      {focusItems.length > 0 && (
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'16px 20px',marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:14}}>
            <div>
              <h3 style={{fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:8}}><AlertTriangle size={16} color="#E8672A"/> Today's Focus</h3>
              <p style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>Items that need attention right now — click to act.</p>
            </div>
            <span style={{fontSize:11,color:'var(--text-secondary)'}}>{focusItems.length} item{focusItems.length===1?'':'s'}</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:`repeat(auto-fill,minmax(220px,1fr))`,gap:10}}>
            {focusItems.map(f => (
              <div
                key={f.key}
                onClick={f.onClick}
                style={{padding:'12px 14px',border:`1px solid ${f.color}33`,background:`${f.color}0d`,borderLeft:`4px solid ${f.color}`,borderRadius:10,cursor:'pointer',transition:'transform .15s'}}
                onMouseEnter={e => { e.currentTarget.style.transform='translateX(2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; }}
              >
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                  <f.icon size={14} color={f.color}/>
                  <span style={{fontSize:11,fontWeight:700,color:f.color,letterSpacing:'.04em',textTransform:'uppercase'}}>{f.label}</span>
                  <span style={{marginLeft:'auto',fontSize:18,fontWeight:800,color:f.color}}>{f.value}</span>
                </div>
                <div style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.45}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Targets · monthly progress ── */}
      {targetProgress && (
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px',marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:14,gap:14,flexWrap:'wrap'}}>
            <div>
              <h3 style={{fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:8}}><TrendingUp size={16} color="var(--brand)"/> My Targets · {myTarget.period}</h3>
              <p style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>{h.scope === 'self' ? 'Personal monthly target' : h.scope === 'team' ? 'Team aggregate target' : 'Multi-team aggregate target'} · {h.role}</p>
            </div>
            <div style={{fontSize:12,color:'var(--text-secondary)'}}>Revenue recognised: <b style={{color:'var(--brand)'}}>{fmtM(closedWonRevenue)}</b></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
            {targetProgress.map(t => (
              <div key={t.key} style={{padding:'14px 16px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:10}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>{t.label}</span>
                  <span style={{fontSize:11,fontWeight:800,color: t.pct >= 100 ? '#16a34a' : t.pct >= 60 ? 'var(--brand)' : '#f59e0b'}}>{t.pct}%</span>
                </div>
                <div style={{fontSize:18,fontWeight:800}}>{t.fmt ? t.fmt(t.actual) : t.actual}</div>
                <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>of {t.targetFmt ? t.targetFmt(t.target) : t.target}</div>
                <div style={{height:5,background:'#f1f5f9',borderRadius:3,overflow:'hidden',marginTop:10}}>
                  <div style={{width:`${t.pct}%`,height:'100%',background: t.pct >= 100 ? '#16a34a' : t.pct >= 60 ? 'var(--brand)' : '#f59e0b',transition:'width .4s'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Pipeline Summary + Lead Sources ── */}
      <div style={{display:'grid',gridTemplateColumns: isAgentScope ? '1fr' : '1.6fr 1fr',gap:18,marginBottom:18}}>
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:14,gap:12,flexWrap:'wrap'}}>
            <div>
              <h3 style={{fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:8}}><KanbanSquare size={16} color="var(--brand)"/> Pipeline Summary</h3>
              <p style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>Stage distribution across the Off Plan pipeline ({offPlanDeals.length} deals · Deal Stages.docx · 11-May)</p>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {stageCounts.map(s => (
              <div key={s.stage} style={{display:'flex',alignItems:'center',gap:14}}>
                <span style={{width:200,fontSize:12,fontWeight:600,color:'var(--text-secondary)',flexShrink:0}}>{s.stage}</span>
                <div style={{flex:1,height:24,background:'#f1f5f9',borderRadius:8,overflow:'hidden',position:'relative'}}>
                  <div style={{height:'100%',width:`${(s.count/maxStage)*100}%`,background:'linear-gradient(90deg,var(--brand),#F89357)',borderRadius:8,minWidth:s.count?32:0,display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:10,transition:'width .5s'}}>
                    <span style={{fontSize:11,fontWeight:800,color:'#fff'}}>{s.count}</span>
                  </div>
                </div>
                <span style={{minWidth:90,textAlign:'right',fontSize:11,fontWeight:700,color:'var(--text-primary)'}}>{fmtM(s.value)}</span>
              </div>
            ))}
            {stageCounts.every(s => s.count === 0) && (
              <div style={{padding:'20px 0',textAlign:'center',color:'var(--text-tertiary)',fontSize:13}}>No Off Plan deals in your visibility scope.</div>
            )}
          </div>
          <button className="btn btn-outline btn-sm" style={{marginTop:14}} onClick={()=>navigate('/system/crm/deals')}>View Pipeline <ChevronRight size={12}/></button>
        </div>

        {/* Lead Sources — hidden for individual-contributor agents */}
        {!isAgentScope && (
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px'}}>
            <h3 style={{fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:8,marginBottom:14}}><Megaphone size={16} color="var(--brand)"/> Lead Sources</h3>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {sourceCounts.map(s => {
                const pct = (s.count / sourceTotal) * 100;
                return (
                  <div key={s.source}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:4}}>
                      <span style={{fontWeight:600,color:'var(--text-primary)'}}>{s.source}</span>
                      <span style={{color:'var(--text-secondary)'}}><b>{s.count}</b> · {pct.toFixed(0)}%</span>
                    </div>
                    <div style={{height:6,background:'#f1f5f9',borderRadius:3,overflow:'hidden'}}>
                      <div style={{width:`${pct}%`,height:'100%',background:SOURCE_COLORS[s.source] || 'var(--brand)',transition:'width .4s'}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Recent Leads + Recent Activity ── */}
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:18,marginBottom:18}}>
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:8}}><Users size={16} color="var(--brand)"/> Recent Leads</h3>
            <button className="btn btn-sm btn-outline" onClick={()=>navigate('/system/crm/leads')}>View All</button>
          </div>
          <div className="data-scroll">
            <table className="data-table">
              <thead><tr><th>Name</th><th>{isAgentScope ? 'Assigned By' : 'Source'}</th><th>Project</th><th>Stage</th><th>Priority</th></tr></thead>
              <tbody>
                {leads.slice(0,6).map(l => {
                  const assignedBy = (state.staff || []).find(s => s.name === l.owner)?.manager || 'Sales Manager';
                  return (
                    <tr key={l.id} style={{cursor:'pointer'}} onClick={()=>navigate(`/system/crm/leads/${l.id}`)}>
                      <td className="bold">{l.name}</td>
                      <td className="muted">{isAgentScope ? (l.owner ? assignedBy : '—') : l.source}</td>
                      <td className="muted">{l.project}</td>
                      <td><span className={`badge ${l.stage==='New'?'badge-info':l.stage==='Qualified'?'badge-success':l.stage==='Negotiation'?'badge-warning':l.stage==='Nurturing'?'badge-gray':'badge-gray'}`}>{l.stage}</span></td>
                      <td><span className={`badge ${l.priority==='Hot'?'badge-danger':l.priority==='Warm'?'badge-warning':'badge-gray'}`}>{l.priority}</span></td>
                    </tr>
                  );
                })}
                {leads.length === 0 && (
                  <tr><td colSpan={5} style={{textAlign:'center',padding:'30px 0',color:'var(--text-tertiary)'}}>No leads in your visibility scope.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px'}}>
          <h3 style={{fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:8,marginBottom:14}}><Clock size={16} color="var(--brand)"/> Recent Activity</h3>
          <div style={{display:'flex',flexDirection:'column',gap:10,maxHeight:340,overflowY:'auto'}}>
            {recentActivity.length === 0 ? (
              <div style={{padding:20,textAlign:'center',color:'var(--text-tertiary)',fontSize:12}}>No activity yet.</div>
            ) : recentActivity.map(a => (
              <div key={a.id} style={{display:'flex',gap:10,paddingBottom:10,borderBottom:'1px solid var(--border)'}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${activityColor[a.type]}15`,color:activityColor[a.type],display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {activityIcon[a.type]}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--text-primary)'}}>{a.action}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.detail}</div>
                </div>
                <div style={{fontSize:10,color:'var(--text-tertiary)',whiteSpace:'nowrap'}}>{a.time?.split(' ')[1] || ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Performers (visible to TL+) + Upcoming Tasks ── */}
      <div style={{display:'grid',gridTemplateColumns: topAgents.length > 0 && !isAgentScope ? '1fr 1fr' : '1fr',gap:18}}>
        {topAgents.length > 0 && !isAgentScope && (
          <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px'}}>
            <h3 style={{fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:8,marginBottom:14}}><Award size={16} color="var(--brand)"/> Top Performers</h3>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {topAgents.map((a, i) => (
                <div key={a.agent} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background: i===0?'var(--brand)':i===1?'#3b82f6':i===2?'#10b981':'#94a3b8',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.agent}</div>
                    <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>{a.deals} deals · {a.closed} closed{a.revenue ? ` · ${fmtM(a.revenue)} revenue` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'18px 22px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:8}}><CheckCircle2 size={16} color="var(--brand)"/> Upcoming Tasks</h3>
            <button className="btn btn-sm btn-outline" onClick={()=>navigate('/system/crm/tasks')}>View All</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {tasks.filter(t=>t.status!=='Completed').slice(0,4).map(t => {
              const overdue = t.due < todayIso;
              const dueToday = t.due === todayIso;
              return (
                <div key={t.id} onClick={()=>navigate('/system/crm/tasks')} style={{padding:'12px 14px',background: overdue?'#fef2f2':dueToday?'#fef3c7':'#fafbfc',border:'1px solid var(--border)',borderRadius:10,borderLeft:`4px solid ${overdue?'var(--danger)':dueToday?'#f59e0b':t.priority==='High'?'var(--brand)':'var(--info)'}`,cursor:'pointer'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:700}}>{t.title}</span>
                    {overdue && <span style={{fontSize:9,fontWeight:700,letterSpacing:'.04em',padding:'2px 6px',background:'#dc2626',color:'#fff',borderRadius:4}}>OVERDUE</span>}
                  </div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',display:'flex',gap:10,alignItems:'center'}}>
                    <span><Phone size={10} style={{verticalAlign:'middle',marginRight:3}}/>{t.type}</span>
                    <span>Due {t.due}</span>
                    <span style={{padding:'1px 6px',background: t.priority==='High'?'#fef3c7':'#f1f5f9',color: t.priority==='High'?'#92400e':'var(--text-secondary)',borderRadius:3,fontSize:10,fontWeight:600}}>{t.priority}</span>
                  </div>
                </div>
              );
            })}
            {tasks.filter(t=>t.status!=='Completed').length === 0 && (
              <div style={{padding:20,textAlign:'center',color:'var(--text-tertiary)',fontSize:12}}>No pending tasks.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
