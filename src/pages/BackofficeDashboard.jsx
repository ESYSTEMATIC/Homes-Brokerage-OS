// ═══════════════════════════════════════════════════════════════
// Backoffice Dashboard — role-customized cockpit
// ───────────────────────────────────────────────────────────────
// Each Backoffice persona lands on a tailored view:
//   • Super Admin    → broad operational overview (legacy generic)
//   • Sales Director → cross-team rollup + approvals
//   • HR Recruiter   → recruitment funnel, candidates, offers, onboarding
//   • Finance Officer→ revenue + commissions + payouts
//   • Executive/CEO  → strategic KPIs + top deals + funnel
//   • System Admin   → users, roles, master data, audit
// All variants use the same visual building blocks (KpiCard, ListPanel)
// so the dashboard feels coherent across roles.
// ═══════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, FileText, TrendingUp, DollarSign, Clock, ReceiptText,
  Building, ArrowRight, FileWarning, ShieldAlert, Award, CheckCircle2, ListChecks,
  AlertTriangle, Briefcase, Database, ShieldCheck, KanbanSquare, PieChart, Activity,
  UsersRound, UserCog, Sparkles, ArrowUpRight, Megaphone, BarChart3,
} from 'lucide-react';

const fmt    = (n) => 'EGP ' + (n || 0).toLocaleString();
const fmtM   = (n) => `EGP ${((n || 0) / 1e6).toFixed(1)}M`;
const today  = () => new Date().toISOString().slice(0, 10);

// ═══════════════════════════════════════════════════════════════
// Top-level dispatcher
// ═══════════════════════════════════════════════════════════════
export const BackofficeDashboard = () => {
  const { personaKey } = useApp();
  switch (personaKey) {
    case 'hrRecruiter':    return <HrDashboard/>;
    case 'financeOfficer': return <FinanceDashboard/>;
    case 'executive':      return <ExecutiveOverview/>;
    case 'systemAdmin':    return <SystemAdminOverview/>;
    case 'salesDirector':  return <SalesDirectorOverview/>;
    default:               return <SuperAdminDashboard/>;
  }
};

// ═══════════════════════════════════════════════════════════════
// Shared building blocks
// ═══════════════════════════════════════════════════════════════
const KpiCard = ({ label, value, icon: Icon, color, footer, onClick, delta }) => {
  const dp = delta && delta.dir === 'up';
  return (
    <div
      onClick={onClick}
      style={{
        background:'#fff', border:'1px solid var(--border)', borderRadius:14,
        padding:'16px 18px', cursor: onClick ? 'pointer' : 'default',
        position:'relative', overflow:'hidden',
        display:'flex', flexDirection:'column', gap:10, minHeight:118,
        transition:'transform .15s, box-shadow .15s, border-color .15s',
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
      <div style={{position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${color}, ${color}66)`}}/>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10}}>
        <div style={{display:'flex', alignItems:'center', gap:9}}>
          <div style={{
            width:34, height:34, borderRadius:9,
            background:`linear-gradient(135deg, ${color}1a, ${color}26)`,
            color, display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon size={17}/>
          </div>
          <div style={{fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.06em'}}>{label}</div>
        </div>
        {delta && (
          <span style={{
            display:'inline-flex', alignItems:'center', gap:3, fontSize:10, fontWeight:700,
            padding:'2px 7px', borderRadius:999,
            background: dp ? '#ecfdf5' : '#fef2f2',
            color: dp ? '#059669' : '#dc2626',
            border: `1px solid ${dp ? '#a7f3d0' : '#fecaca'}`,
          }}>{dp ? '▲' : '▼'} {delta.value}</span>
        )}
      </div>
      <div style={{fontSize:28, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em', lineHeight:1}}>{value}</div>
      {footer && <div style={{fontSize:11, color:'var(--text-tertiary)', marginTop:'auto'}}>{footer}</div>}
    </div>
  );
};

const ListPanel = ({ title, subtitle, icon: Icon, items, emptyText, onItemClick, onSeeAll }) => (
  <div style={{background:'#fff', border:'1px solid var(--border)', borderRadius:14, padding:'18px 22px'}}>
    <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:14, gap:10}}>
      <div style={{display:'flex', alignItems:'center', gap:10}}>
        <Icon size={18} color="var(--brand)"/>
        <div>
          <h3 style={{fontSize:14, fontWeight:800, color:'var(--text-primary)'}}>{title}</h3>
          {subtitle && <p style={{fontSize:11, color:'var(--text-tertiary)', marginTop:2}}>{subtitle}</p>}
        </div>
      </div>
      {onSeeAll && <button className="btn btn-outline btn-sm" onClick={onSeeAll}>View all <ArrowRight size={11}/></button>}
    </div>
    {items.length === 0 ? (
      <div style={{fontSize:12, color:'var(--text-tertiary)', padding:'14px 0', textAlign:'center'}}>{emptyText}</div>
    ) : (
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {items.map((it, i) => (
          <div
            key={it.key || i}
            onClick={() => onItemClick && onItemClick(it)}
            style={{
              display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
              borderRadius:8, border:`1px solid ${it.urgent ? '#fecaca' : 'var(--border)'}`,
              background: it.urgent ? '#fef2f2' : '#fafbfc',
              cursor: onItemClick ? 'pointer' : 'default',
            }}>
            {it.photoDataUrl ? (
              <img src={it.photoDataUrl} alt="" style={{width:32, height:32, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'1px solid var(--border)'}}/>
            ) : it.initials ? (
              <div style={{width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0}}>{it.initials}</div>
            ) : it.icon ? (
              <div style={{flexShrink:0, color: it.color || 'var(--brand)'}}>{it.icon}</div>
            ) : null}
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:12.5, fontWeight:700, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{it.title}</div>
              <div style={{fontSize:11, color:'var(--text-tertiary)', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{it.subtitle}</div>
            </div>
            {it.meta && <div style={{fontSize:11, fontWeight:700, color: it.metaColor || 'var(--text-primary)', whiteSpace:'nowrap'}}>{it.meta}</div>}
          </div>
        ))}
      </div>
    )}
  </div>
);

const ChartBar = ({ items, max, valueFmt = (n) => n, color = '#0ea5e9' }) => (
  <div style={{display:'flex', flexDirection:'column', gap:8}}>
    {items.map((it, i) => {
      const pct = max ? Math.round((it.value / max) * 100) : 0;
      return (
        <div key={i} style={{display:'grid', gridTemplateColumns:'120px 1fr 60px', alignItems:'center', gap:10, fontSize:12}}>
          <span style={{color:'var(--text-secondary)', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{it.label}</span>
          <div style={{height:14, background:'#f1f5f9', borderRadius:3, overflow:'hidden'}}>
            <div style={{width:`${pct}%`, height:'100%', background: it.color || color}}/>
          </div>
          <span style={{textAlign:'right', fontWeight:700, color:'var(--text-primary)'}}>{valueFmt(it.value)}</span>
        </div>
      );
    })}
  </div>
);

const Header = ({ title, subtitle, role }) => (
  <div className="page-header" style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, flexWrap:'wrap'}}>
    <div>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </div>
    {role && (
      <span style={{
        fontSize:11, fontWeight:700, color:'var(--brand)',
        background:'var(--brand-tint)', padding:'4px 10px', borderRadius:999,
        display:'inline-flex', alignItems:'center', gap:6,
      }}>
        <Sparkles size={12}/> {role}
      </span>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// HR Recruiter dashboard
// ═══════════════════════════════════════════════════════════════
const HrDashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const candidates = state.candidates || [];
  const offers     = state.offers || [];
  const onboarding = state.onboarding || [];
  const jobs       = state.jobs || [];

  const openVacancies = jobs.filter(j => j.status === 'Published');
  const candidatesActive = candidates.filter(c => c.stage !== 'Rejected');
  const offersInFlight   = offers.filter(o => ['Pending Approval','Approved','Sent'].includes(o.stage));
  const offersAccepted   = offers.filter(o => o.stage === 'Accepted').length;
  const onboardingActive = onboarding.filter(a => !['Activated','Withdrawn'].includes(a.status));
  const onboardingStalled = onboardingActive.filter(a => {
    const last = a.statusHistory?.[a.statusHistory.length - 1]?.at || a.date + 'T00:00:00';
    const days = Math.floor((new Date() - new Date(last)) / 86400000);
    return days > 7;
  });
  const hiresThisMonth = onboarding.filter(a => a.status === 'Activated').length;

  // Source breakdown removed (May 2026 review). Candidate `source` no
  // longer exists — the vacancy IS the source. Per-vacancy applicant
  // counts live on the Job Vacancies list and each vacancy detail page.

  // Stage funnel
  const stageOrder = ['Applied','Screening','Interview','Offer','Rejected'];
  const stageCounts = stageOrder.map(s => ({
    label: s, value: candidates.filter(c => c.stage === s).length,
    color: s === 'Offer' ? '#10b981' : s === 'Rejected' ? '#94a3b8' : '#0ea5e9',
  }));
  const maxStage = Math.max(...stageCounts.map(s => s.value), 1);

  return (
    <div>
      <Header
        title="HR & Recruitment Dashboard"
        subtitle="Vacancies · candidates · offers · onboarding pipeline"
        role="HR Recruiter"
      />

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18, marginTop:18}}>
        <KpiCard label="Open vacancies"    value={openVacancies.length}     icon={Briefcase}    color="#3b82f6" footer={`Headcount: ${openVacancies.reduce((s,j) => s + (j.headcount || 0), 0)}`} onClick={() => navigate('/backoffice/jobs')}/>
        <KpiCard label="Candidates"        value={candidatesActive.length}  icon={Users}        color="#8b5cf6" footer={`${candidates.length} total · ${candidates.filter(c => c.stage === 'Interview').length} in interview`} onClick={() => navigate('/backoffice/recruitment')}/>
        <KpiCard label="Offers in flight"  value={offersInFlight.length}    icon={FileText}     color="#f59e0b" footer={`${offers.filter(o => o.stage === 'Pending Approval').length} pending director`} onClick={() => navigate('/backoffice/recruitment')}/>
        <KpiCard label="Hires this month"  value={hiresThisMonth}            icon={CheckCircle2} color="#10b981" footer={`${offersAccepted} offers accepted`}/>
        <KpiCard label="Onboarding stalled" value={onboardingStalled.length} icon={AlertTriangle} color="#dc2626" footer={`${onboardingActive.length} active applicants`} onClick={() => navigate('/backoffice/onboarding')}/>
      </div>

      {/* 'Source of hire' panel removed (May 2026 review) — the vacancy
          IS the source, so per-source counts are not a meaningful metric
          anymore. Candidate funnel takes the full row. */}
      <div style={{marginBottom:18}}>
        <div style={{background:'#fff', border:'1px solid var(--border)', borderRadius:14, padding:'18px 22px'}}>
          <h3 style={{fontSize:14, fontWeight:800, marginBottom:14, display:'flex', alignItems:'center', gap:8}}>
            <BarChart3 size={16} color="var(--brand)"/> Candidate funnel
          </h3>
          <ChartBar items={stageCounts} max={maxStage}/>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Stalled applications"
          subtitle="Onboarding applicants past SLA — need follow-up"
          icon={AlertTriangle}
          items={onboardingStalled.slice(0,5).map(a => ({
            key: a.id, title: a.applicant,
            subtitle: `${a.id} · ${a.requestedRole || a.type} · ${a.status}`,
            meta: a.department, metaColor:'var(--text-secondary)',
            urgent: true,
            photoDataUrl: a.photoDataUrl,
            initials: a.applicant.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase(),
          }))}
          emptyText="No stalled applications."
          onItemClick={() => navigate('/backoffice/onboarding')}
          onSeeAll={() => navigate('/backoffice/onboarding')}
        />
        <ListPanel
          title="Offers queue"
          subtitle="Pending approval · awaiting candidate response"
          icon={FileText}
          items={offersInFlight.slice(0,5).map(o => ({
            key: o.id, title: o.candidateName,
            subtitle: `${o.id} · ${o.jobTitle} · ${o.stage}`,
            meta: `EGP ${o.salaryMonthly?.toLocaleString()}/mo`, metaColor:'#10b981',
            urgent: o.outOfBand,
            photoDataUrl: o.photoDataUrl,
            initials: (o.candidateName || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase(),
          }))}
          emptyText="No offers in flight."
          onSeeAll={() => navigate('/backoffice/recruitment')}
        />
      </div>

      <ListPanel
        title="Recent candidate activity"
        subtitle="Latest pipeline entries"
        icon={Activity}
        items={[...candidates].sort((a,b) => (b.applied || '').localeCompare(a.applied || '')).slice(0,5).map(c => ({
          key: c.id, title: c.name,
          subtitle: `${c.id} · ${c.job} · ${c.stage} · ${c.source || '—'}`,
          meta: c.applied, metaColor: 'var(--text-tertiary)',
          photoDataUrl: c.photoDataUrl,
          initials: (c.name || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase(),
        }))}
        emptyText="No candidates yet."
        onSeeAll={() => navigate('/backoffice/recruitment')}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Finance Officer dashboard
// ═══════════════════════════════════════════════════════════════
const FinanceDashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const deals = state.deals || [];
  const recognised = deals.filter(d => d.revenueRecognised);

  // Company income KPIs — live from the Commission Engine (SME finance
  // review, May 2026): company KPIs, income-focused, no expenses.
  const ce = (state.commEngine || []).filter(c => c.status !== 'Rejected');
  const payoutOf = (c) => (c.agentShare || 0) + (c.tlShare || 0) + (c.managerShare || 0) + (c.directorShare || 0);
  const collected = ce.filter(c => c.status === 'Collected');
  const grossRevenue     = ce.reduce((s, c) => s + (c.pool || 0), 0);          // commission income billed
  const collectedRevenue = collected.reduce((s, c) => s + (c.pool || 0), 0);   // actually realized
  const vatTotal         = ce.reduce((s, c) => s + (c.vat || 0), 0);
  const payoutTotal      = ce.reduce((s, c) => s + payoutOf(c), 0);
  const netRevenue       = grossRevenue - vatTotal;                            // revenue net of VAT
  const netResult        = netRevenue - payoutTotal;                           // company keep after payouts

  // Revenue by developer — commission pool grouped by developer.
  const devRev = {};
  ce.forEach(c => { const k = c.developer || 'Other'; devRev[k] = (devRev[k] || 0) + (c.pool || 0); });
  const devItems = Object.entries(devRev).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  const maxDev = Math.max(...devItems.map(i => i.value), 1);

  return (
    <div>
      <Header
        title="Finance Dashboard"
        subtitle="Company income KPIs · commissions · collections"
        role="Finance Officer"
      />

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18, marginTop:18}}>
        <KpiCard label="Gross Revenue"     value={fmtM(grossRevenue)}     icon={DollarSign}   color="#10b981" footer="Total commission income billed"/>
        <KpiCard label="Collected Revenue" value={fmtM(collectedRevenue)} icon={CheckCircle2} color="#3b82f6" footer={`Actually realized · ${collected.length} deals`} onClick={() => navigate('/backoffice/finance/commission')}/>
        <KpiCard label="Net Revenue"       value={fmtM(netRevenue)}       icon={TrendingUp}   color="#10b981" footer="Gross Revenue − 14% VAT"/>
        <KpiCard label="Net Result"        value={fmtM(netResult)}        icon={TrendingUp}   color="#10b981" footer="After commission payouts"/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <div style={{background:'#fff', border:'1px solid var(--border)', borderRadius:14, padding:'18px 22px'}}>
          <h3 style={{fontSize:14, fontWeight:800, marginBottom:14, display:'flex', alignItems:'center', gap:8}}>
            <BarChart3 size={16} color="var(--brand)"/> Revenue by developer
          </h3>
          <ChartBar items={devItems} max={maxDev} color="#10b981" valueFmt={fmtM}/>
        </div>
        <div style={{background:'#fff', border:'1px solid var(--border)', borderRadius:14, padding:'18px 22px'}}>
          <h3 style={{fontSize:14, fontWeight:800, marginBottom:14, display:'flex', alignItems:'center', gap:8}}>
            <DollarSign size={16} color="var(--brand)"/> Commission status
          </h3>
          <div style={{display:'flex', flexDirection:'column', gap:14, padding:'10px 0'}}>
            {[
              { label: 'Pending',   count: ce.filter(c => c.status === 'Pending').length,  color:'#f59e0b' },
              { label: 'Approved',  count: ce.filter(c => c.status === 'Approved').length, color:'#3b82f6' },
              { label: 'Collected', count: collected.length,                               color:'#10b981' },
            ].map(s => (
              <div key={s.label} style={{display:'flex', alignItems:'center', gap:14}}>
                <div style={{width:12, height:12, borderRadius:'50%', background:s.color}}/>
                <span style={{fontSize:13, color:'var(--text-secondary)', flex:1}}>{s.label}</span>
                <span style={{fontSize:18, fontWeight:800}}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Recently collected commissions"
          subtitle="Commission income realized this period"
          icon={CheckCircle2}
          items={collected.slice(0,5).map(c => ({
            key: c.id, title: `${c.id} · ${c.developer || '—'}`,
            subtitle: `${c.project || ''} · ${c.unit || ''}`,
            meta: fmt(c.pool), metaColor:'#10b981',
            icon: <CheckCircle2 size={14}/>,
          }))}
          emptyText="No commissions collected yet."
          onSeeAll={() => navigate('/backoffice/finance/commission')}
        />
        <ListPanel
          title="Recently recognised deals"
          subtitle="Closed deals contributing to revenue"
          icon={KanbanSquare}
          items={recognised.slice(0,5).map(d => ({
            key: d.id, title: `${d.leadName || d.lead} · ${d.project}`,
            subtitle: `${d.id} · ${d.stage} · ${d.owner || '—'}`,
            meta: fmtM(d.value), metaColor:'#10b981',
            icon: <TrendingUp size={14}/>,
          }))}
          emptyText="No deals recognised this period."
          onSeeAll={() => navigate('/backoffice/finance/deals-revenue')}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Executive overview — same content as the dedicated Executive
// Dashboard page but tightened for the Backoffice dashboard surface.
// ═══════════════════════════════════════════════════════════════
const ExecutiveOverview = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const deals = state.deals || [];
  const totalSales = deals.reduce((s,d) => s + (d.value || 0), 0);
  const revenue = totalSales * 0.02;
  const activeAgents = (state.staff || []).filter(s => s.status === 'Active').length;
  const apprPending = (state.onboarding || []).filter(o => !['Activated','Withdrawn'].includes(o.status)).length;
  const candidates = (state.candidates || []).filter(c => c.stage !== 'Rejected').length;

  return (
    <div>
      <Header
        title="Executive Overview"
        subtitle="Corporate visibility · sales · revenue · talent pipeline"
        role="Executive / CEO"
      />

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18, marginTop:18}}>
        <KpiCard label="Total sales (MTD)" value={fmtM(totalSales)} icon={TrendingUp}  color="#10b981" footer={`${deals.length} deals`}/>
        <KpiCard label="Revenue"           value={fmtM(revenue)}    icon={DollarSign}  color="#E8672A" footer="2% on closed sales"/>
        <KpiCard label="Active agents"     value={`${activeAgents} / ${(state.staff || []).length}`} icon={UsersRound} color="#3b82f6" footer="Working pipeline"/>
        <KpiCard label="Candidates"        value={candidates}        icon={Users}      color="#8b5cf6" footer="Talent pipeline"/>
        <KpiCard label="Apps pending"      value={apprPending}       icon={ListChecks} color="#f59e0b" footer="In onboarding"/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Top deals"
          subtitle="Highest-value active deals"
          icon={KanbanSquare}
          items={[...deals].sort((a,b) => (b.value||0) - (a.value||0)).slice(0,5).map(d => ({
            key: d.id, title: `${d.leadName || d.lead} · ${d.project}`,
            subtitle: `${d.id} · ${d.owner || '—'} · ${d.stage}`,
            meta: fmtM(d.value), metaColor:'#10b981',
            icon: <KanbanSquare size={14}/>,
          }))}
          emptyText="No deals."
        />
        <ListPanel
          title="Announcements"
          subtitle="Company-wide bulletins"
          icon={Megaphone}
          items={(state.announcements || []).slice(0,5).map(a => ({
            key: a.id, title: a.title,
            subtitle: `${a.author} · ${a.date}`,
            meta: a.priority === 'high' ? 'HIGH' : '', metaColor: '#dc2626',
            urgent: a.priority === 'high',
            icon: <Megaphone size={14}/>,
          }))}
          emptyText="No announcements."
        />
      </div>

      <div className="alert-card warning" style={{padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:14, fontWeight:700, color:'var(--text-primary)'}}>Need the full picture?</div>
          <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>Open the dedicated Executive Dashboard with Egypt map, board pack PDF export, and city rankings.</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/backoffice/executive')}>Open Executive Dashboard <ArrowUpRight size={13}/></button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// System Admin overview — users · roles · master data · audit
// ═══════════════════════════════════════════════════════════════
const SystemAdminOverview = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const masterCount =
    (state.developers || []).length +
    (state.compounds || []).length +
    (state.projects || []).length +
    (state.branches || []).length +
    (state.teams || []).length;

  return (
    <div>
      <Header
        title="System Administration"
        subtitle="Users · roles · master data · audit log"
        role="System Admin"
      />

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18, marginTop:18}}>
        <KpiCard label="Total users"           value={(state.staff || []).length}     icon={Users}       color="#3b82f6" footer="Across all departments"     onClick={() => navigate('/backoffice/agents')}/>
        <KpiCard label="Roles defined"         value={(state.roles || []).length}     icon={UserCog}     color="#8b5cf6" footer="Permission roles in system" onClick={() => navigate('/backoffice/roles')}/>
        <KpiCard label="Master data records"   value={masterCount}                    icon={Database}    color="#0ea5e9" footer="Developers · Projects · Branches · Teams"/>
        <KpiCard label="Departments"           value={(state.departments || []).length} icon={Building}  color="#10b981" footer="Org hierarchy" onClick={() => navigate('/backoffice/departments')}/>
        <KpiCard label="Audit events"          value={(state.audit || []).length}     icon={ShieldCheck} color="#dc2626" footer="Logged system activity" onClick={() => navigate('/backoffice/audit')}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Recent audit events"
          subtitle="System-wide activity log"
          icon={ShieldCheck}
          items={(state.audit || []).slice(0,6).map(a => ({
            key: a.id || `${a.timestamp}-${a.action}`, title: a.action,
            subtitle: `${a.target || a.detail || '—'} · ${a.actor || '—'}`,
            meta: a.module, metaColor:'var(--text-secondary)',
            icon: <Activity size={14}/>,
          }))}
          emptyText="No audit events."
          onSeeAll={() => navigate('/backoffice/audit')}
        />
        <ListPanel
          title="Department breakdown"
          subtitle="Headcount per department"
          icon={Building}
          items={(state.departments || []).map(d => ({
            key: d.id, title: d.name,
            subtitle: `${d.head} · ${d.teams} team${d.teams === 1 ? '' : 's'}`,
            meta: `${d.employees}`, metaColor: 'var(--text-secondary)',
            icon: <Building size={14}/>,
          }))}
          emptyText="No departments."
          onSeeAll={() => navigate('/backoffice/departments')}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Sales Director overview — cross-team rollup + approvals
// ═══════════════════════════════════════════════════════════════
const SalesDirectorOverview = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const deals = state.deals || [];
  const totalSales = deals.reduce((s,d) => s + (d.value || 0), 0);
  const revenue = totalSales * 0.02;
  const offerApprovals = (state.offers || []).filter(o => o.stage === 'Pending Approval').length;
  const finalApprovals = (state.onboarding || []).filter(a => a.status === 'Final Approval').length;
  const overrides = (state.commEngine || []).filter(c => c.status === 'Pending').length;

  return (
    <div>
      <Header
        title="Director Cockpit"
        subtitle="Cross-team rollup · final approvals · revenue"
        role="Sales Director"
      />

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18, marginTop:18}}>
        <KpiCard label="Total sales"       value={fmtM(totalSales)}   icon={TrendingUp}   color="#10b981" footer={`${deals.length} deals across teams`}/>
        <KpiCard label="Company revenue"   value={fmtM(revenue)}      icon={DollarSign}   color="#E8672A" footer="2% on closed sales"/>
        <KpiCard label="Offer approvals"   value={offerApprovals}     icon={FileText}     color="#f59e0b" footer="HR offers awaiting sign-off" onClick={() => navigate('/backoffice/recruitment')}/>
        <KpiCard label="Final approvals"   value={finalApprovals}     icon={CheckCircle2} color="#0ea5e9" footer="Onboarding director sign-off" onClick={() => navigate('/backoffice/onboarding')}/>
        <KpiCard label="Commission overrides" value={overrides}       icon={ShieldCheck}  color="#8b5cf6" footer="Pending your review" onClick={() => navigate('/backoffice/finance/commission')}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Offers awaiting approval"
          subtitle="HR-drafted offers ready for your sign-off"
          icon={FileText}
          items={(state.offers || []).filter(o => o.stage === 'Pending Approval').slice(0,5).map(o => ({
            key: o.id, title: o.candidateName,
            subtitle: `${o.id} · ${o.jobTitle} · ${o.stage}`,
            meta: `EGP ${o.salaryMonthly?.toLocaleString()}/mo`, metaColor:'#10b981',
            urgent: o.outOfBand,
            photoDataUrl: o.photoDataUrl,
            initials: (o.candidateName || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase(),
          }))}
          emptyText="No offers awaiting approval."
          onSeeAll={() => navigate('/backoffice/recruitment')}
        />
        <ListPanel
          title="Final onboarding approvals"
          subtitle="Applicants ready for director sign-off"
          icon={CheckCircle2}
          items={(state.onboarding || []).filter(a => a.status === 'Final Approval').slice(0,5).map(a => ({
            key: a.id, title: a.applicant,
            subtitle: `${a.id} · ${a.requestedRole || a.type} · ${a.department}`,
            meta: a.targetStartDate || '—', metaColor:'var(--text-secondary)',
            urgent: true,
            photoDataUrl: a.photoDataUrl,
            initials: (a.applicant || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase(),
          }))}
          emptyText="No final approvals pending."
          onSeeAll={() => navigate('/backoffice/onboarding')}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Super Admin — generic broad overview (legacy view)
// ═══════════════════════════════════════════════════════════════
const SuperAdminDashboard = () => {
  const { state, openDrawer } = useApp();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('This Month');
  const [developer, setDeveloper] = useState('');
  const [project, setProject] = useState('');
  const [branch, setBranch] = useState('');

  const filtered = useMemo(() => state.deals.filter(d =>
    (!developer || d.developer === developer) &&
    (!project || d.project === project)
  ), [state.deals, developer, project]);

  const totalSales = filtered.reduce((s,d)=>s+d.value,0);
  const revenue = totalSales * 0.02;

  const counts = {
    pendingOnboarding: state.onboarding.filter(o=>!['Activated','Withdrawn'].includes(o.status)).length,
    missingDocs: state.documents.filter(d=>d.status==='Missing').length,
    trainingIncomplete: state.staff.filter(s=>s.status==='Pending').length + 3,
    accessBlocked: state.staff.filter(s=>s.status==='Suspended').length,
  };

  const developers = [...new Set(state.deals.map(d=>d.developer))];
  const projects = [...new Set(state.deals.map(d=>d.project))];

  const showQueue = (label, items, render) => openDrawer({
    title: label, subtitle: `${items.length} item(s)`,
    content: items.length === 0 ? <div className="empty-state">Nothing in queue.</div> : (
      <div style={{display:'flex',flexDirection:'column',gap:10}}>{items.map(render)}</div>
    ),
  });

  return (
    <div>
      <Header
        title="Backoffice Control Cockpit"
        subtitle="Operational visibility across HR · finance · governance"
        role="Super Admin"
      />

      <div className="filter-bar" style={{marginTop:18}}>
        <select className="filter-select" value={period} onChange={e=>setPeriod(e.target.value)}>
          <option>This Month</option><option>Last Month</option><option>This Quarter</option><option>YTD</option>
        </select>
        <select className="filter-select" value={developer} onChange={e=>setDeveloper(e.target.value)}>
          <option value="">All Developers</option>{developers.map(d=><option key={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={project} onChange={e=>setProject(e.target.value)}>
          <option value="">All Projects</option>{projects.map(p=><option key={p}>{p}</option>)}
        </select>
        <select className="filter-select" value={branch} onChange={e=>setBranch(e.target.value)}>
          <option value="">All Branches</option>{state.branches.map(b=><option key={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Total agents"          value={state.staff.length}                                 icon={Users}      color="#94a3b8" footer={`${state.staff.filter(s=>s.status==='Active').length} active`}/>
        <KpiCard label="Pending applications"  value={counts.pendingOnboarding}                           icon={FileText}   color="#f59e0b" footer="In onboarding queue" onClick={() => navigate('/backoffice/onboarding')}/>
        <KpiCard label="Missing documents"     value={counts.missingDocs}                                 icon={FileWarning} color="#dc2626" footer="Doc compliance gap" onClick={() => navigate('/backoffice/documents')}/>
        <KpiCard label="Total sales"           value={fmtM(totalSales)}                                   icon={TrendingUp} color="#3b82f6" footer={`${filtered.length} deals`}/>
        <KpiCard label="Company revenue"       value={fmtM(revenue)}                                      icon={DollarSign} color="#10b981" footer="2% commission" delta={{dir:'up', value:'+12%'}}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Pending commissions" value={fmtM(state.commEngine.filter(c=>c.status==='Pending').reduce((s,c)=>s+c.pool,0))} icon={Clock}        color="#f59e0b" footer="Awaiting payout cycle"/>
        <KpiCard label="Paid commissions"    value={fmtM(state.commEngine.filter(c=>c.status==='Paid').reduce((s,c)=>s+c.pool,0))}    icon={CheckCircle2} color="#10b981" footer="Cleared payouts"/>
        <KpiCard label="Total expenses"      value={fmt(293000)}                                                                       icon={ReceiptText}  color="#dc2626" footer="Operating costs"/>
        <KpiCard label="Net result"          value={fmtM(revenue - 293000)}                                                            icon={Building}     color="#10b981" footer="Profitable" delta={{dir:'up', value:'healthy'}}/>
      </div>

      <div className="grid-2col" style={{marginTop:8}}>
        <div>
          <h2 className="section-title">Operational Queues</h2>
          <div className="grid-equal-2">
            <div className="queue-card" onClick={()=>navigate('/backoffice/onboarding')}>
              <div className="queue-card-left"><div className="kpi-icon amber"><FileText size={18}/></div><div className="queue-card-info"><h4>Pending Onboarding</h4><div className="queue-card-value">{counts.pendingOnboarding}</div></div></div>
              <ArrowRight size={16} color="#9ca3af"/>
            </div>
            <div className="queue-card" onClick={()=>navigate('/backoffice/documents')}>
              <div className="queue-card-left"><div className="kpi-icon red"><FileWarning size={18}/></div><div className="queue-card-info"><h4>Missing Documents</h4><div className="queue-card-value">{counts.missingDocs}</div></div></div>
              <ArrowRight size={16} color="#9ca3af"/>
            </div>
            <div className="queue-card" onClick={()=>navigate('/backoffice/training')}>
              <div className="queue-card-left"><div className="kpi-icon amber"><Clock size={18}/></div><div className="queue-card-info"><h4>Training Incomplete</h4><div className="queue-card-value">{counts.trainingIncomplete}</div></div></div>
              <ArrowRight size={16} color="#9ca3af"/>
            </div>
            <div className="queue-card" onClick={()=>showQueue('Access Blocked', state.staff.filter(s=>s.status==='Suspended'), s => (
              <div key={s.id} style={{padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8}}>
                <div style={{fontWeight:600,fontSize:13}}>{s.name}</div>
                <div style={{fontSize:11,color:'var(--text-tertiary)'}}>{s.id} · {s.title} · Suspended</div>
              </div>
            ))}>
              <div className="queue-card-left"><div className="kpi-icon red"><ShieldAlert size={18}/></div><div className="queue-card-info"><h4>Access Blocked</h4><div className="queue-card-value">{counts.accessBlocked}</div></div></div>
              <ArrowRight size={16} color="#9ca3af"/>
            </div>
          </div>
        </div>
        <div>
          <h2 className="section-title">Recent Audit Activity</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {state.audit.slice(0,5).map(a=>(
              <div key={a.id} className="alert-card warning">
                <span className="alert-card-text">{a.action}: {a.target}</span>
                <span className="alert-card-action" onClick={()=>navigate('/backoffice/audit')}>View</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
