// ═══════════════════════════════════════════════════════════════════════
// RoleDashboard — operational dashboard for non-sales-track personas
// ───────────────────────────────────────────────────────────────────────
// The Employee Board originally only had content for sales-track agents
// (onboarding journey OR operations KPIs). Every other persona landed on
// an empty page. This component fills that gap — it dispatches on
// personaKey and renders a role-specific cockpit (KPIs · Today's Focus ·
// Activity · Quick Actions) for:
//   • marketing
//   • salesManager        (team rollup)
//   • salesDirector       (cross-team rollup)
//   • hrRecruiter
//   • financeOfficer
//   • marketplaceAdmin
//   • executive
//   • systemAdmin
//   • backofficeAdmin     (Super Admin)
// ═══════════════════════════════════════════════════════════════════════
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Activity, ArrowUpRight, Award, BarChart3, Bell, Building2, CheckCircle2,
  ChevronRight, Clock, Database, DollarSign, FileText, GraduationCap, Layers,
  ListChecks, Megaphone, Phone, PieChart, ShieldCheck, Sparkles, Target,
  TrendingUp, UserCog, Users, UsersRound, AlertTriangle, Globe, KanbanSquare,
} from 'lucide-react';

const fmt   = (n) => new Intl.NumberFormat('en-EG').format(n || 0);
const fmtEGP = (n) => `EGP ${fmt(n)}`;
const fmtM   = (n) => `EGP ${((n || 0) / 1e6).toFixed(1)}M`;

const today = () => new Date().toISOString().slice(0, 10);
const last30 = () => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0,10); };

// ───────────────── Shared building blocks ─────────────────

const KpiCard = ({ label, value, icon: Icon, color, footer, onClick, delta }) => {
  const deltaPositive = delta && delta.dir === 'up';
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
            flexShrink:0,
          }}>
            <Icon size={17}/>
          </div>
          <div style={{fontSize:10, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.06em', lineHeight:1.2}}>{label}</div>
        </div>
        {delta && (
          <span style={{
            display:'inline-flex', alignItems:'center', gap:3,
            fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:999,
            background: deltaPositive ? '#ecfdf5' : '#fef2f2',
            color: deltaPositive ? '#059669' : '#dc2626',
            border: `1px solid ${deltaPositive ? '#a7f3d0' : '#fecaca'}`,
          }}>
            {deltaPositive ? '▲' : '▼'} {delta.value}
          </span>
        )}
      </div>
      <div style={{fontSize:28, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em', lineHeight:1}}>
        {value}
      </div>
      {footer && <div style={{fontSize:11, color:'var(--text-tertiary)', marginTop:'auto'}}>{footer}</div>}
    </div>
  );
};

const FocusCard = ({ title, subtitle, icon: Icon }) => (
  <div style={{
    background:'#fff', border:'1px solid var(--border)', borderRadius:14, padding:'18px 22px',
  }}>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
      <Icon size={18} color="var(--brand)"/>
      <div>
        <h3 style={{fontSize:14, fontWeight:800, color:'var(--text-primary)'}}>{title}</h3>
        {subtitle && <p style={{fontSize:11, color:'var(--text-tertiary)', marginTop:2}}>{subtitle}</p>}
      </div>
    </div>
    {/* Caller fills slot via children — handled by ListPanel below */}
  </div>
);

const ListPanel = ({ title, subtitle, icon: Icon, items, emptyText, onItemClick, onSeeAll, seeAllLabel = 'View all' }) => (
  <div style={{background:'#fff', border:'1px solid var(--border)', borderRadius:14, padding:'18px 22px'}}>
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:14,gap:10}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <Icon size={18} color="var(--brand)"/>
        <div>
          <h3 style={{fontSize:14, fontWeight:800, color:'var(--text-primary)'}}>{title}</h3>
          {subtitle && <p style={{fontSize:11, color:'var(--text-tertiary)', marginTop:2}}>{subtitle}</p>}
        </div>
      </div>
      {onSeeAll && <button className="btn btn-outline btn-sm" onClick={onSeeAll}>{seeAllLabel} <ChevronRight size={11}/></button>}
    </div>
    {items.length === 0 ? (
      <div style={{fontSize:12, color:'var(--text-tertiary)', padding:'12px 0', textAlign:'center'}}>{emptyText}</div>
    ) : (
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {items.map((it, i) => (
          <div
            key={it.key || i}
            onClick={() => onItemClick && onItemClick(it)}
            style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'10px 12px', borderRadius:8,
              background: it.urgent ? '#fef2f2' : '#fafbfc',
              border:'1px solid ' + (it.urgent ? '#fecaca' : 'var(--border)'),
              cursor: onItemClick ? 'pointer' : 'default',
              transition:'background .12s',
            }}
            onMouseEnter={onItemClick ? e => e.currentTarget.style.background = it.urgent ? '#fee2e2' : '#f1f5f9' : undefined}
            onMouseLeave={onItemClick ? e => e.currentTarget.style.background = it.urgent ? '#fef2f2' : '#fafbfc' : undefined}
          >
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
            {onItemClick && <ChevronRight size={13} color="var(--text-tertiary)" style={{flexShrink:0}}/>}
          </div>
        ))}
      </div>
    )}
  </div>
);

const QuickActions = ({ actions }) => (
  <div style={{
    background:'#fff', border:'1px solid var(--border)', borderRadius:14, padding:'18px 22px',
  }}>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
      <Sparkles size={18} color="var(--brand)"/>
      <h3 style={{fontSize:14, fontWeight:800, color:'var(--text-primary)'}}>Quick Actions</h3>
    </div>
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:10}}>
      {actions.map(a => (
        <button
          key={a.label}
          onClick={a.onClick}
          style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 14px',
            background:`${a.color || 'var(--brand)'}10`,
            border: `1px solid ${a.color || 'var(--brand)'}33`,
            color: a.color || 'var(--brand)',
            borderRadius:10, cursor:'pointer',
            fontSize:12, fontWeight:600, textAlign:'left',
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${a.color || 'var(--brand)'}1a`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${a.color || 'var(--brand)'}10`; e.currentTarget.style.transform = ''; }}
        >
          <a.icon size={14}/>
          <span style={{flex:1}}>{a.label}</span>
          <ArrowUpRight size={12}/>
        </button>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// RoleDashboard — top-level dispatcher
// ═══════════════════════════════════════════════════════════════════════
export const RoleDashboard = () => {
  const { personaKey } = useApp();
  switch (personaKey) {
    case 'marketing':        return <MarketingDashboard/>;
    case 'salesManager':     return <SalesManagerDashboard/>;
    case 'salesDirector':    return <SalesDirectorDashboard/>;
    case 'hrRecruiter':      return <HrRecruiterDashboard/>;
    case 'financeOfficer':   return <FinanceOfficerDashboard/>;
    case 'marketplaceAdmin': return <MarketplaceAdminDashboard/>;
    case 'executive':        return <ExecutiveDashboard/>;
    case 'systemAdmin':      return <SystemAdminDashboard/>;
    case 'backofficeAdmin':  return <SuperAdminDashboard/>;
    default: return null;
  }
};

// ───────────────────────── Marketing ─────────────────────────
const MarketingDashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const agencies = state.marketingAgencies || [];
  // Leads sourced from campaigns over the last 30 days.
  const campaignLeads = (state.leads || []).filter(l => (l.source || '').toLowerCase().includes('campaign') || (l.source || '').toLowerCase().includes('marketplace'));
  const recentLeads = campaignLeads.slice(0, 5);

  return (
    <RoleShell title="Marketing Cockpit" subtitle="Campaigns · Outsourced agencies · Cold-call lists">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Active campaigns"     value={6}                          icon={Megaphone}  color="#E8672A" footer="Across 4 channels" onClick={() => navigate('/system/crm/campaigns')}/>
        <KpiCard label="Leads from campaigns" value={campaignLeads.length}        icon={Phone}      color="#3b82f6" footer="last 30 days" onClick={() => navigate('/system/crm/leads')}/>
        <KpiCard label="Outsourced agencies"  value={agencies.length}            icon={Building2}  color="#8b5cf6" footer="Tracking URLs active"/>
        <KpiCard label="Cold-call batches"    value={(state.coldCallBatches || []).length} icon={Layers} color="#0ea5e9" footer="Imported · assigned to agents" onClick={() => navigate('/system/crm/cold-calls')}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Recent campaign leads"
          subtitle="Most recent inbound from your campaign channels"
          icon={Phone}
          items={recentLeads.map(l => ({
            key: l.id, title: l.name,
            subtitle: `${l.id} · ${l.source} · ${l.project || '—'} · ${l.stage}`,
            meta: l.priority, metaColor: l.priority === 'High' ? '#dc2626' : 'var(--text-secondary)',
            icon: <Phone size={14}/>,
          }))}
          emptyText="No campaign leads yet — once a campaign goes live, leads will appear here."
          onItemClick={(it) => navigate(`/system/crm/leads/${it.key}`)}
          onSeeAll={() => navigate('/system/crm/leads')}
        />
        <ListPanel
          title="Outsourced agencies"
          subtitle="Custom tracking URLs · attribution per click"
          icon={Building2}
          items={agencies.slice(0, 5).map(a => ({
            key: a.id, title: a.name,
            subtitle: `${a.contactName || 'Agency'} · token ${a.token || a.id}`,
            meta: a.status || 'Active', metaColor: '#10b981',
            icon: <Building2 size={14}/>,
          }))}
          emptyText="No agencies registered."
          onSeeAll={() => navigate('/system/crm/campaigns')}
        />
      </div>

      <QuickActions actions={[
        { label:'New campaign',    icon: Megaphone,   color:'#E8672A', onClick: () => navigate('/system/crm/campaigns') },
        { label:'Import cold list',icon: Layers,      color:'#0ea5e9', onClick: () => navigate('/system/crm/cold-calls') },
        { label:'Agencies',        icon: Building2,   color:'#8b5cf6', onClick: () => navigate('/system/crm/campaigns') },
      ]}/>
    </RoleShell>
  );
};

// ───────────────────────── Sales Manager ─────────────────────────
const SalesManagerDashboard = () => {
  const { state, openDrawer, updateItem, addItem, toast, writeAudit, persona } = useApp();
  const navigate = useNavigate();
  const LEAD_STAGES = ['New','Contacted','Qualified','Tour Scheduled','Negotiation','Reservation','Contracting','Closed Won','Nurturing','Closed Lost'];

  // Audit-finding fix (May 2026): clicking a stalled lead used to hard-nav
  // to the Lead detail page. Now opens an inline drawer with stage-select
  // and quick-task actions so the manager can intervene without losing the
  // dashboard context. Hard-navigation is still available as a button.
  const openStalledLeadDrawer = (lead) => openDrawer({
    title: lead.name,
    subtitle: `${lead.id} · ${lead.stage} · owner ${lead.owner || '—'}`,
    content: (
      <StalledLeadActions
        lead={lead}
        stages={LEAD_STAGES}
        onChangeStage={(stage) => {
          updateItem('leads', lead.id, { stage });
          writeAudit('Lead Stage Change', `${lead.name}: ${lead.stage} → ${stage}`, 'CRM', `Via SLA drawer by ${persona?.label}`);
          toast(`Stage updated → ${stage}`, 'success');
        }}
        onQuickTask={(title, type) => {
          const id = `T-${Date.now().toString().slice(-6)}`;
          const due = new Date(Date.now() + 2*86400000).toISOString().slice(0,10);
          addItem('tasks', { id, title, type, owner: lead.owner, lead: lead.id, due, priority:'High', status:'Pending', created: new Date().toISOString().slice(0,10) });
          writeAudit('Task Created', `${title} → ${lead.owner}`, 'CRM', `Quick-task from SLA drawer`);
          toast('Task added (due in 2 days)', 'success');
        }}
        onOpenDetail={() => navigate(`/system/crm/leads/${lead.id}`)}
      />
    ),
  });

  // Identify the signed-in Sales Manager in the staff roster. For the demo
  // persona we fall back to 'Nour El-Din' (the canonical Alpha-team manager).
  const myName = (state.staff || []).find(s => s.type === 'Sales Manager' && s.team === 'Alpha')?.name || 'Nour El-Din';
  // Direct + transitive reports (TLs + their agents).
  const myReports = getReports(myName, state.staff || []);

  const leads = state.leads || [];
  const deals = state.deals || [];
  const activePipeline = deals.filter(d => d.status === 'Active' || d.status === undefined).reduce((s,d) => s + (d.value || 0), 0);
  const overrideQueue = (state.commEngine || []).filter(c => c.status === 'Pending').length;
  const openLeads = leads.filter(l => !['Closed Won','Closed Lost','Nurturing'].includes(l.stage)).length;
  const slaBreaches = leads.filter(l => l.priority === 'High' && !['Closed Won','Closed Lost'].includes(l.stage)).length;
  const teamSize = (state.staff || []).filter(s => s.type === 'Sales Agent' || s.type === 'Employee').length;

  // Top performers — by closed deals (rough)
  const closedByAgent = {};
  deals.filter(d => d.stage === 'Standard Collection (10%)' || d.stage === 'Contract Signed & Payment').forEach(d => {
    closedByAgent[d.owner] = (closedByAgent[d.owner] || 0) + (d.value || 0);
  });
  const topPerformers = Object.entries(closedByAgent).sort((a,b) => b[1] - a[1]).slice(0,5);
  // Photo lookup by staff name so top-performer + stalled-lead rows can
  // render the person's avatar.
  const photoByName = (state.staff || []).reduce((map, s) => { map[s.name] = s.photoDataUrl; return map; }, {});

  return (
    <RoleShell title="Sales Manager Cockpit" subtitle="Team-level pipeline rollup · override queue · performers">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Team pipeline" value={fmtM(activePipeline)} icon={KanbanSquare} color="#E8672A" footer={`${deals.length} deals`} onClick={() => navigate('/system/crm/deals')}/>
        <KpiCard label="Open leads"    value={openLeads}              icon={Phone}        color="#3b82f6" footer={`${leads.length} total · ${slaBreaches} high priority`} onClick={() => navigate('/system/crm/leads')}/>
        <KpiCard label="Override queue" value={overrideQueue}         icon={ShieldCheck}  color="#f59e0b" footer="Commission overrides awaiting your review"/>
        <KpiCard label="Team size"     value={teamSize}               icon={UsersRound}   color="#8b5cf6" footer="Active agents reporting to you"/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Top performers"
          subtitle="Revenue closed this period"
          icon={Award}
          items={topPerformers.map(([name, value]) => ({
            key: name, title: name,
            subtitle: 'Closed deals',
            meta: fmtM(value), metaColor: '#10b981',
            photoDataUrl: photoByName[name],
            initials: (name || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase(),
          }))}
          emptyText="No closed deals yet this period."
        />
        <ListPanel
          title="Stalled leads"
          subtitle="High-priority leads needing intervention · click to act inline"
          icon={AlertTriangle}
          items={leads.filter(l => l.priority === 'High' && !['Closed Won','Closed Lost'].includes(l.stage)).slice(0,5).map(l => ({
            key: l.id, title: l.name,
            subtitle: `${l.id} · ${l.stage} · owner ${l.owner || '—'}`,
            meta: 'High', metaColor: '#dc2626',
            urgent: true,
            photoDataUrl: photoByName[l.owner],
            initials: (l.owner || l.name).split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase(),
            _lead: l,
          }))}
          emptyText="All high-priority leads are progressing."
          onItemClick={(it) => openStalledLeadDrawer(it._lead)}
        />
      </div>

      <QuickActions actions={[
        { label:'CRM Reports',    icon: BarChart3,   color:'#8b5cf6', onClick: () => navigate('/system/crm/reports') },
        { label:'Deals pipeline', icon: KanbanSquare,color:'#E8672A', onClick: () => navigate('/system/crm/deals') },
        { label:'Open leads',     icon: Phone,       color:'#3b82f6', onClick: () => navigate('/system/crm/leads') },
        { label:'Cold calls',     icon: Layers,      color:'#0ea5e9', onClick: () => navigate('/system/crm/cold-calls') },
      ]}/>
      {/* The My Team panel was moved into the CRM (/system/crm/team) so it
          lives where managers actually work. The sidebar link is exposed
          for Director / Manager / TL personas via CrmLayout. */}
    </RoleShell>
  );
};

// ───────────────────────── Sales Director ─────────────────────────
const SalesDirectorDashboard = () => {
  const { state, openDrawer } = useApp();
  const navigate = useNavigate();

  // Sales Director's reports = all sales staff in the hierarchy under them.
  // Tarek Amin is the canonical Sales Director in the staff roster.
  const myName = (state.staff || []).find(s => s.type === 'Sales Director')?.name || 'Tarek Amin';
  const myReports = getReports(myName, state.staff || []);

  const deals = state.deals || [];
  const totalSales = deals.reduce((s,d) => s + (d.value || 0), 0);
  const revenue = totalSales * 0.02;
  const offerApprovalQueue = (state.offers || []).filter(o => o.stage === 'Pending Approval').length;
  const overrideQueue = (state.commEngine || []).filter(c => c.status === 'Pending').length;
  const finalApproval = (state.onboarding || []).filter(a => a.status === 'Final Approval').length;

  return (
    <RoleShell title="Sales Director Cockpit" subtitle="Cross-team rollup · final approvals · revenue">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Total sales"      value={fmtM(totalSales)}   icon={TrendingUp}   color="#10b981" footer={`${deals.length} deals across teams`}/>
        <KpiCard label="Company revenue"  value={fmtM(revenue)}       icon={DollarSign}   color="#E8672A" footer="2% commission on sales"/>
        <KpiCard label="Offer approvals"  value={offerApprovalQueue}  icon={FileText}     color="#f59e0b" footer="HR offers awaiting your sign-off" onClick={() => navigate('/backoffice/recruitment')}/>
        <KpiCard label="Final approvals"  value={finalApproval}       icon={CheckCircle2} color="#0ea5e9" footer="Applicants ready for director sign-off" onClick={() => navigate('/backoffice/onboarding')}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Top deals"
          subtitle="Highest-value active deals across all teams"
          icon={KanbanSquare}
          items={[...deals].sort((a,b) => (b.value||0) - (a.value||0)).slice(0,5).map(d => ({
            key: d.id, title: `${d.leadName || d.lead} · ${d.project}`,
            subtitle: `${d.id} · Off Plan · ${d.stage} · ${d.owner || '—'}`,
            meta: fmtM(d.value), metaColor: '#10b981',
            icon: <KanbanSquare size={14}/>,
          }))}
          emptyText="No deals."
          onSeeAll={() => navigate('/system/crm/deals')}
        />
        <ListPanel
          title="Commission overrides"
          subtitle="Override requests awaiting your decision"
          icon={ShieldCheck}
          items={(state.commEngine || []).filter(c => c.status === 'Pending').slice(0,5).map(c => ({
            key: c.id, title: `${c.id} · ${c.developer || '—'}`,
            subtitle: `Pool ${fmtEGP(c.pool)} · requested by ${c.requestedBy || '—'}`,
            meta: 'Pending', metaColor:'#f59e0b',
            urgent: true,
            icon: <ShieldCheck size={14}/>,
          }))}
          emptyText="No override requests pending."
          onSeeAll={() => navigate('/backoffice/finance/commission')}
        />
      </div>

      <QuickActions actions={[
        { label:'CRM Reports',          icon: BarChart3, color:'#8b5cf6', onClick: () => navigate('/system/crm/reports') },
        { label:'Final approvals',      icon: CheckCircle2, color:'#0ea5e9', onClick: () => navigate('/backoffice/onboarding') },
        { label:'Commission engine',    icon: ShieldCheck, color:'#f59e0b', onClick: () => navigate('/backoffice/finance/commission') },
        { label:'Executive dashboard',  icon: PieChart, color:'#E8672A', onClick: () => navigate('/backoffice/executive') },
      ]}/>
      {/* Team org-chart for the director was moved into the CRM
          (/system/crm/team). The Employee Board stays focused on KPIs +
          approval queues. */}
    </RoleShell>
  );
};

// ───────────────────────── HR Recruiter ─────────────────────────
const HrRecruiterDashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const candidates = state.candidates || [];
  const offers = state.offers || [];
  const onboarding = state.onboarding || [];
  const openVacancies = (state.jobs || []).filter(j => j.status === 'Published').length;
  const candidatesActive = candidates.filter(c => c.stage !== 'Rejected').length;
  const offersPending = offers.filter(o => o.stage === 'Pending Approval' || o.stage === 'Approved' || o.stage === 'Sent').length;
  const onboardingActive = onboarding.filter(a => !['Activated','Withdrawn'].includes(a.status)).length;

  return (
    <RoleShell title="HR Recruiter Cockpit" subtitle="Vacancies · candidates · offers · onboarding">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Open vacancies"   value={openVacancies}     icon={FileText}     color="#3b82f6" footer="Published roles on Careers"     onClick={() => navigate('/backoffice/jobs')}/>
        <KpiCard label="Candidates"       value={candidatesActive}  icon={Users}        color="#8b5cf6" footer={`${candidates.length} total · pipeline`} onClick={() => navigate('/backoffice/recruitment')}/>
        <KpiCard label="Offers in flight" value={offersPending}     icon={FileText}     color="#f59e0b" footer="Pending Approval · Approved · Sent" onClick={() => navigate('/backoffice/recruitment')}/>
        <KpiCard label="Onboarding"       value={onboardingActive}  icon={ListChecks}   color="#10b981" footer="Active applicants in pipeline"   onClick={() => navigate('/backoffice/onboarding')}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Recent applications"
          subtitle="Latest onboarding pipeline activity"
          icon={ListChecks}
          items={[...onboarding].sort((a,b) => (b.date || '').localeCompare(a.date || '')).slice(0,5).map(a => ({
            key: a.id, title: a.applicant,
            subtitle: `${a.id} · ${a.requestedRole || a.type} · ${a.status}`,
            meta: a.source || '—', metaColor:'var(--text-secondary)',
            urgent: ['Documents Pending','Final Approval'].includes(a.status),
            icon: <ListChecks size={14}/>,
          }))}
          emptyText="No applications."
          onItemClick={() => navigate('/backoffice/onboarding')}
        />
        <ListPanel
          title="Offer queue"
          subtitle="Offers in approval or response window"
          icon={FileText}
          items={offers.filter(o => !['Accepted','Declined','Withdrawn'].includes(o.stage)).slice(0,5).map(o => ({
            key: o.id, title: o.candidateName,
            subtitle: `${o.id} · ${o.jobTitle} · ${o.stage}`,
            meta: fmtEGP(o.salaryMonthly) + '/mo', metaColor:'#10b981',
            urgent: o.outOfBand,
            icon: <FileText size={14}/>,
          }))}
          emptyText="No active offers."
          onItemClick={() => navigate('/backoffice/recruitment')}
        />
      </div>

      <QuickActions actions={[
        { label:'Recruitment',         icon: Users,      color:'#8b5cf6', onClick: () => navigate('/backoffice/recruitment') },
        { label:'Onboarding pipeline', icon: ListChecks, color:'#10b981', onClick: () => navigate('/backoffice/onboarding') },
        { label:'Job vacancies',       icon: FileText,   color:'#3b82f6', onClick: () => navigate('/backoffice/jobs') },
        { label:'Employee profiles',   icon: UserCog,    color:'#0ea5e9', onClick: () => navigate('/backoffice/hr/profiles') },
      ]}/>
    </RoleShell>
  );
};

// ───────────────────────── Finance Officer ─────────────────────────
const FinanceOfficerDashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const deals = state.deals || [];
  const revenueMTD = deals.filter(d => d.revenueRecognised).reduce((s,d) => s + (d.value || 0), 0) * 0.02;
  const pendingComm = (state.commEngine || []).filter(c => c.status === 'Pending').reduce((s,c) => s + (c.pool || 0), 0);
  const paidComm    = (state.commEngine || []).filter(c => c.status === 'Paid').reduce((s,c) => s + (c.pool || 0), 0);
  const closedThisMonth = deals.filter(d => d.revenueRecognised).length;

  return (
    <RoleShell title="Finance Cockpit" subtitle="Revenue · commissions · payouts">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Revenue MTD"       value={fmtM(revenueMTD)} icon={DollarSign}  color="#10b981" footer={`${closedThisMonth} closed deals recognised`}/>
        <KpiCard label="Pending commissions" value={fmtM(pendingComm)} icon={Clock}      color="#f59e0b" footer="Awaiting payout cycle"  onClick={() => navigate('/backoffice/finance/commission')}/>
        <KpiCard label="Paid (MTD)"        value={fmtM(paidComm)}   icon={CheckCircle2} color="#3b82f6" footer="Cleared payout cycles"/>
        <KpiCard label="Deals recognised"  value={closedThisMonth}  icon={KanbanSquare} color="#8b5cf6" footer="Standard Collection (10%) trigger"/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Recent commissions"
          subtitle="Latest entries in the commission engine"
          icon={ShieldCheck}
          items={(state.commEngine || []).slice(0,5).map(c => ({
            key: c.id, title: `${c.id} · ${c.developer || '—'}`,
            subtitle: `${c.project || ''} · ${c.status}`,
            meta: fmtEGP(c.pool), metaColor: c.status === 'Pending' ? '#f59e0b' : '#10b981',
            icon: <ShieldCheck size={14}/>,
          }))}
          emptyText="No commission entries yet."
          onSeeAll={() => navigate('/backoffice/finance/commission')}
        />
        <ListPanel
          title="Closed deals (revenue recognised)"
          subtitle="Deals at Standard Collection or Contract Signed & Payment"
          icon={TrendingUp}
          items={deals.filter(d => d.revenueRecognised).slice(0,5).map(d => ({
            key: d.id, title: `${d.leadName || d.lead} · ${d.project}`,
            subtitle: `${d.id} · ${d.stage}`,
            meta: fmtM(d.value), metaColor:'#10b981',
            icon: <TrendingUp size={14}/>,
          }))}
          emptyText="No deals recognised yet."
          onSeeAll={() => navigate('/backoffice/finance/deals-revenue')}
        />
      </div>

      <QuickActions actions={[
        { label:'Finance overview',  icon: PieChart,    color:'#E8672A', onClick: () => navigate('/backoffice/finance/overview') },
        { label:'Deals & revenue',   icon: TrendingUp,  color:'#10b981', onClick: () => navigate('/backoffice/finance/deals-revenue') },
        { label:'Commission engine', icon: ShieldCheck, color:'#f59e0b', onClick: () => navigate('/backoffice/finance/commission') },
      ]}/>
    </RoleShell>
  );
};

// ───────────────────────── Marketplace Admin ─────────────────────────
const MarketplaceAdminDashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const listings = state.listings || [];
  const inbound = (state.leads || []).filter(l => (l.source || '').toLowerCase().includes('marketplace'));

  return (
    <RoleShell title="Marketplace Cockpit" subtitle="Listings · inbound requests · brokerages on platform">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Listings"     value={listings.length} icon={Building2} color="#E8672A" footer={`${listings.filter(l => l.status === 'Available').length} available`} onClick={() => navigate('/system/marketplace-dashboard/listings')}/>
        <KpiCard label="Inbound leads (30d)" value={inbound.length}  icon={Phone}     color="#3b82f6" footer="From homes.com.eg traffic"/>
        <KpiCard label="Brokerages"   value={12}              icon={UsersRound} color="#8b5cf6" footer="Active partner offices"/>
        <KpiCard label="Page views (mock)" value="48.2K"       icon={Globe}      color="#0ea5e9" footer="Last 30 days" delta={{ dir:'up', value:'+12%' }}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Recent inbound requests"
          subtitle="Leads from the public marketplace"
          icon={Phone}
          items={inbound.slice(0,5).map(l => ({
            key: l.id, title: l.name,
            subtitle: `${l.id} · ${l.project || '—'} · ${l.stage}`,
            meta: l.priority, metaColor: l.priority === 'High' ? '#dc2626' : 'var(--text-secondary)',
            icon: <Phone size={14}/>,
          }))}
          emptyText="No marketplace-sourced leads yet."
          onSeeAll={() => navigate('/system/marketplace-dashboard/leads')}
        />
        <ListPanel
          title="Recently listed"
          subtitle="Newest listings on the marketplace"
          icon={Building2}
          items={listings.slice(0,5).map(l => ({
            key: l.id, title: `${l.project} · ${l.unitCode}`,
            subtitle: `${l.developer} · ${l.unitType} · ${l.bedrooms}BD · ${l.area} m²`,
            meta: fmtM(l.price), metaColor: '#E8672A',
            icon: <Building2 size={14}/>,
          }))}
          emptyText="No listings."
          onSeeAll={() => navigate('/system/marketplace-dashboard/listings')}
        />
      </div>

      <QuickActions actions={[
        { label:'Marketplace Dashboard', icon: PieChart,   color:'#E8672A', onClick: () => navigate('/system/marketplace-dashboard') },
        { label:'Listings',              icon: Building2,  color:'#8b5cf6', onClick: () => navigate('/system/marketplace-dashboard/listings') },
        { label:'Leads & requests',      icon: Phone,      color:'#3b82f6', onClick: () => navigate('/system/marketplace-dashboard/leads') },
        { label:'Brokerages',            icon: UsersRound, color:'#0ea5e9', onClick: () => navigate('/system/marketplace-dashboard/brokerages') },
      ]}/>
    </RoleShell>
  );
};

// ───────────────────────── Executive ─────────────────────────
const ExecutiveDashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const deals = state.deals || [];
  const totalSales = deals.reduce((s,d) => s + (d.value || 0), 0);
  const revenue = totalSales * 0.02;
  const activeAgents = (state.staff || []).filter(s => s.status === 'Active').length;
  const candidates = (state.candidates || []).filter(c => c.stage !== 'Rejected').length;

  return (
    <RoleShell title="Executive Cockpit" subtitle="Corporate visibility across sales · HR · marketplace">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Total sales (MTD)" value={fmtM(totalSales)} icon={TrendingUp}  color="#10b981" footer={`${deals.length} deals`}                        onClick={() => navigate('/backoffice/executive')}/>
        <KpiCard label="Revenue"           value={fmtM(revenue)}    icon={DollarSign}  color="#E8672A" footer="2% on closed sales"                            onClick={() => navigate('/backoffice/finance/overview')}/>
        <KpiCard label="Active agents"     value={`${activeAgents} / ${(state.staff || []).length}`} icon={UsersRound} color="#3b82f6" footer="Working pipeline" onClick={() => navigate('/backoffice/agents')}/>
        <KpiCard label="Hiring pipeline"   value={candidates}        icon={Users}      color="#8b5cf6" footer="Candidates active across stages"               onClick={() => navigate('/backoffice/recruitment')}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Top deals"
          subtitle="Highest-value deals across all teams"
          icon={KanbanSquare}
          items={[...deals].sort((a,b) => (b.value||0) - (a.value||0)).slice(0,5).map(d => ({
            key: d.id, title: `${d.leadName || d.lead} · ${d.project}`,
            subtitle: `${d.id} · ${d.owner || '—'} · ${d.stage}`,
            meta: fmtM(d.value), metaColor:'#10b981',
            icon: <KanbanSquare size={14}/>,
          }))}
          emptyText="No deals."
          onSeeAll={() => navigate('/backoffice/finance/deals-revenue')}
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

      <QuickActions actions={[
        { label:'Executive Dashboard', icon: PieChart,  color:'#E8672A', onClick: () => navigate('/backoffice/executive') },
        { label:'Finance overview',    icon: DollarSign,color:'#10b981', onClick: () => navigate('/backoffice/finance/overview') },
        { label:'Recruitment',         icon: Users,     color:'#8b5cf6', onClick: () => navigate('/backoffice/recruitment') },
        { label:'Audit logs',          icon: ShieldCheck,color:'#0ea5e9',onClick: () => navigate('/backoffice/audit') },
      ]}/>
    </RoleShell>
  );
};

// ───────────────────────── System Admin ─────────────────────────
const SystemAdminDashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const masterEntities =
    (state.developers || []).length +
    (state.compounds || []).length +
    (state.projects || []).length +
    (state.branches || []).length +
    (state.teams || []).length;

  const roleEvents = (state.audit || []).filter(a => (a.module || '').toLowerCase().includes('role') || (a.action || '').toLowerCase().includes('role'));
  const recentAudit = (state.audit || []).slice(0,5);

  return (
    <RoleShell title="System Admin Cockpit" subtitle="Users · master data · roles · audit">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Total users"        value={(state.staff || []).length}            icon={Users}      color="#3b82f6" footer="Across all departments"        onClick={() => navigate('/backoffice/agents')}/>
        <KpiCard label="Roles"              value={(state.roles || []).length}            icon={UserCog}    color="#8b5cf6" footer="Permission roles defined"      onClick={() => navigate('/backoffice/roles')}/>
        <KpiCard label="Master data records" value={masterEntities}                       icon={Database}   color="#0ea5e9" footer="Developers · Compounds · Branches · Teams"/>
        <KpiCard label="Audit events"       value={(state.audit || []).length}            icon={ShieldCheck} color="#10b981" footer={`${roleEvents.length} role-related`} onClick={() => navigate('/backoffice/audit')}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Recent audit events"
          subtitle="System-wide activity log"
          icon={ShieldCheck}
          items={recentAudit.map(a => ({
            key: a.id || `${a.timestamp}-${a.action}`, title: a.action,
            subtitle: `${a.target || a.detail || '—'} · ${a.actor || '—'}`,
            meta: a.module, metaColor:'var(--text-secondary)',
            icon: <Activity size={14}/>,
          }))}
          emptyText="No audit events."
          onSeeAll={() => navigate('/backoffice/audit')}
        />
        <ListPanel
          title="Departments"
          subtitle="Organizational hierarchy"
          icon={Building2}
          items={(state.departments || []).slice(0,5).map(d => ({
            key: d.id, title: d.name,
            subtitle: `${d.head} · ${d.employees} employees · ${d.teams} teams`,
            meta: d.status, metaColor: d.status === 'Active' ? '#10b981' : '#94a3b8',
            icon: <Building2 size={14}/>,
          }))}
          emptyText="No departments."
          onSeeAll={() => navigate('/backoffice/departments')}
        />
      </div>

      <QuickActions actions={[
        { label:'Settings',              icon: UserCog,    color:'#8b5cf6', onClick: () => navigate('/backoffice/settings') },
        { label:'Roles & permissions',   icon: ShieldCheck, color:'#0ea5e9',onClick: () => navigate('/backoffice/roles') },
        { label:'Departments',           icon: Building2,  color:'#E8672A', onClick: () => navigate('/backoffice/departments') },
        { label:'Audit logs',            icon: Activity,   color:'#10b981', onClick: () => navigate('/backoffice/audit') },
      ]}/>
    </RoleShell>
  );
};

// ───────────────────────── Super Admin (Backoffice Admin) ─────────────────────────
const SuperAdminDashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  const apps = (state.onboarding || []).filter(a => !['Activated','Withdrawn'].includes(a.status)).length;
  const docs = (state.documents || []).filter(d => d.status === 'Pending Review' || d.status === 'Missing').length;
  const audit = (state.audit || []).length;
  const offers = (state.offers || []).filter(o => o.stage === 'Pending Approval').length;

  return (
    <RoleShell title="Super Admin Cockpit" subtitle="Aggregate operational visibility across the platform">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14, marginBottom:18}}>
        <KpiCard label="Active applications"  value={apps}   icon={ListChecks}  color="#3b82f6" footer="In onboarding pipeline"        onClick={() => navigate('/backoffice/onboarding?tab=active')}/>
        <KpiCard label="Documents to review"  value={docs}   icon={FileText}    color="#f59e0b" footer="Pending or missing"             onClick={() => navigate('/backoffice/documents?status=pending')}/>
        <KpiCard label="Offers pending"       value={offers} icon={ShieldCheck} color="#8b5cf6" footer="Awaiting director approval"    onClick={() => navigate('/backoffice/recruitment?stage=offer')}/>
        <KpiCard label="Audit events"         value={audit}  icon={Activity}    color="#10b981" footer="System-wide activity log"     onClick={() => navigate('/backoffice/audit')}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18}}>
        <ListPanel
          title="Stalled applications"
          subtitle="Onboarding applicants past SLA"
          icon={AlertTriangle}
          items={(state.onboarding || []).filter(a => !['Activated','Withdrawn'].includes(a.status)).slice(0,5).map(a => ({
            key: a.id, title: a.applicant,
            subtitle: `${a.id} · ${a.requestedRole || a.type} · ${a.status}`,
            meta: a.department, metaColor:'var(--text-secondary)',
            urgent: a.status === 'Documents Pending',
            icon: <ListChecks size={14}/>,
          }))}
          emptyText="No stalled applications."
          /* Audit-finding fix: clicking the panel or See all now jumps to
             the Onboarding pipeline pre-filtered on the Stalled tab. */
          onItemClick={() => navigate('/backoffice/onboarding?tab=stalled')}
          onSeeAll={() => navigate('/backoffice/onboarding?tab=stalled')}
        />
        <ListPanel
          title="Recent audit"
          subtitle="Latest system events"
          icon={Activity}
          items={(state.audit || []).slice(0,5).map(a => ({
            key: a.id || `${a.timestamp}-${a.action}`, title: a.action,
            subtitle: `${a.target || a.detail || '—'} · ${a.actor || '—'}`,
            meta: a.module, metaColor:'var(--text-secondary)',
            icon: <Activity size={14}/>,
          }))}
          emptyText="No audit events."
          onSeeAll={() => navigate('/backoffice/audit')}
        />
      </div>

      <QuickActions actions={[
        /* Audit-finding fix: pass category filter via query string so the
           target page lands on the right tab / filter, not the default view. */
        { label:'Stalled applications', icon: AlertTriangle, color:'#dc2626', onClick: () => navigate('/backoffice/onboarding?tab=stalled') },
        { label:'Onboarding',           icon: ListChecks,    color:'#3b82f6', onClick: () => navigate('/backoffice/onboarding?tab=active') },
        { label:'Documents to review',  icon: FileText,      color:'#f59e0b', onClick: () => navigate('/backoffice/documents?status=pending') },
        { label:'Recruitment',          icon: Users,         color:'#8b5cf6', onClick: () => navigate('/backoffice/recruitment?stage=offer') },
        { label:'Audit logs',           icon: ShieldCheck,   color:'#0ea5e9', onClick: () => navigate('/backoffice/audit') },
        { label:'Executive view',       icon: PieChart,      color:'#E8672A', onClick: () => navigate('/backoffice/executive') },
      ]}/>
    </RoleShell>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// TeamPanel — management role hierarchy view
// ───────────────────────────────────────────────────────────────────────
// Renders the subordinates a manager leads (direct + indirect) as
// expandable cards. Each card shows photo, role, branch, plus KPIs
// derived from the live state (open leads, pipeline value, closed deals).
// Used by Sales Director, Sales Manager, and Team Leader views.
// Exported so the Employee Board (sales-track operations view) can also
// surface a team panel for the Team Leader persona.
// ═══════════════════════════════════════════════════════════════════════
export const getReports = (rootName, staff) => {
  // Direct + transitive reports.
  const direct = staff.filter(s => s.manager === rootName);
  const all = [...direct];
  direct.forEach(d => { all.push(...getReports(d.name, staff)); });
  return all;
};

const computeAgentKpis = (agentName, leads, deals, tasks, targets, personaKey) => {
  const myLeads = leads.filter(l => l.owner === agentName);
  const openLeads = myLeads.filter(l => !['Closed Won','Closed Lost','Nurturing'].includes(l.stage)).length;
  const myDeals = deals.filter(d => d.owner === agentName);
  const pipeline = myDeals.filter(d => d.status === 'Active' || d.status === undefined).reduce((s, d) => s + (d.value || 0), 0);
  const closed = myDeals.filter(d => d.revenueRecognised).length;
  const closedValue = myDeals.filter(d => d.revenueRecognised).reduce((s, d) => s + (d.value || 0), 0);
  const overdueTasks = tasks.filter(t => t.owner === agentName && t.status !== 'Completed' && t.due && t.due < new Date().toISOString().slice(0,10)).length;
  return { openLeads, totalLeads: myLeads.length, myDeals: myDeals.length, pipeline, closed, closedValue, overdueTasks };
};

// Org-chart node — recursive component. Renders a person's card and,
// below it, a row of their direct reports connected by lines. Children
// recurse the same way so the entire tree is drawn naturally.
const tierOf = (m) => {
  if (m?.type === 'Sales Director') return { rank: 0, label: 'Sales Director', color: '#dc2626' };
  if (m?.type === 'Sales Manager')  return { rank: 1, label: 'Sales Manager',  color: '#8b5cf6' };
  if (m?.type === 'Team Leader')    return { rank: 2, label: 'Team Leader',    color: '#0ea5e9' };
  return { rank: 3, label: m?.title || 'Sales Agent', color: '#10b981' };
};

const OrgNode = ({ member, allStaff, leads, deals, tasks, targets, onMemberClick, isRoot }) => {
  const children = allStaff.filter(s => s.manager === member.name);
  const k = computeAgentKpis(member.name, leads, deals, tasks, targets);
  const target = targets?.[member.name] || targets?.['agent'];
  const dealPct = target?.dealsTarget ? Math.round((k.myDeals / target.dealsTarget) * 100) : null;
  const meta = tierOf(member);
  const initials = member.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();

  // For non-root nodes, layout is fully owned by .org-tree-child in
  // index.css — inline styles here would override its padding/display
  // and break the connector lines. The root wrapper keeps its inline
  // layout since it has no parent connectors to align with.
  const wrapperStyle = isRoot
    ? {display:'flex', flexDirection:'column', alignItems:'center', position:'relative', padding:'0 8px'}
    : undefined;

  return (
    <div className={isRoot ? undefined : 'org-tree-child'} style={wrapperStyle}>
      {/* Connector lines (horizontal bar + per-child vertical drop) are
          painted by the .org-tree-child pseudo-elements (::before for
          the bar, ::after for the drop). See index.css. */}

      {/* Person card */}
      <div
        onClick={() => onMemberClick && onMemberClick(member)}
        style={{
          background:'#fff', border:`2px solid ${meta.color}33`, borderTop:`4px solid ${meta.color}`,
          borderRadius:12, padding:'12px 14px', minWidth:230, maxWidth:260,
          cursor: onMemberClick ? 'pointer' : 'default',
          transition:'transform .15s, box-shadow .15s, border-color .15s',
          boxShadow:'0 2px 6px rgba(15,23,42,.04)',
          position:'relative', zIndex: 1,
        }}
        onMouseEnter={onMemberClick ? e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 24px rgba(15,23,42,.10)';
          e.currentTarget.style.borderColor = meta.color;
        } : undefined}
        onMouseLeave={onMemberClick ? e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(15,23,42,.04)';
          e.currentTarget.style.borderColor = `${meta.color}33`;
        } : undefined}
      >
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
          {member.photoDataUrl ? (
            <img src={member.photoDataUrl} alt="" style={{width:46, height:46, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${meta.color}`}}/>
          ) : (
            <div style={{width:46, height:46, borderRadius:'50%', background:`linear-gradient(135deg, ${meta.color}, ${meta.color}99)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, flexShrink:0}}>
              {initials}
            </div>
          )}
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:13, fontWeight:700, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{member.name}</div>
            <div style={{fontSize:10, fontWeight:700, color:meta.color, textTransform:'uppercase', letterSpacing:'.05em', marginTop:2}}>{meta.label}</div>
            <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:2}}>{member.branch}{member.team ? ` · ${member.team}` : ''}</div>
          </div>
        </div>

        {/* Mini KPI strip — only show for agents with real activity. For
            managers/TLs show team rollup later via children traversal. */}
        {meta.rank === 3 && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginBottom:6}}>
            <MiniKpi label="Leads" value={k.openLeads}/>
            <MiniKpi label="Pipe" value={fmtM(k.pipeline)} color="#E8672A"/>
            <MiniKpi label="Closed" value={k.closed} color="#10b981"/>
          </div>
        )}
        {meta.rank < 3 && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:6}}>
            <MiniKpi label="Direct" value={children.length} color={meta.color}/>
            <MiniKpi label="Status" value={member.status === 'Active' ? 'OK' : member.status === 'Suspended' ? '⏸' : '⏳'} color={member.status === 'Active' ? '#10b981' : '#f59e0b'}/>
          </div>
        )}
        {dealPct !== null && meta.rank === 3 && (
          <div style={{marginTop:6}}>
            <div style={{height:4, background:'#f1f5f9', borderRadius:2, overflow:'hidden'}}>
              <div style={{width:`${Math.min(dealPct, 100)}%`, height:'100%', background: dealPct >= 100 ? '#10b981' : dealPct >= 60 ? 'var(--brand)' : '#f59e0b'}}/>
            </div>
          </div>
        )}
        {k.overdueTasks > 0 && (
          <div style={{marginTop:6, fontSize:10, color:'#dc2626', fontWeight:600, display:'flex', alignItems:'center', gap:4}}>
            <AlertTriangle size={10}/> {k.overdueTasks} overdue
          </div>
        )}
      </div>

      {/* Children — the children container draws its own vertical drop
          from this card to the row below (via ::before), and each child
          inside the row draws its own half-bar that meets at the
          parent's vertical-drop center. Edge children suppress the
          outward half so the bar terminates exactly under sibling
          centers no matter how many children there are.

          We add the .scroll modifier when there are 4+ children so wide
          fanouts don't overflow the page; otherwise the row stays
          centered for clean alignment. */}
      {children.length > 0 && (
        <div className={`org-tree-children${children.length >= 4 ? ' scroll' : ''}`}>
          {children.map(c => (
            <OrgNode
              key={c.id}
              member={c}
              allStaff={allStaff}
              leads={leads}
              deals={deals}
              tasks={tasks}
              targets={targets}
              onMemberClick={onMemberClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TeamPanel = ({ title, subtitle, members, leads, deals, tasks, targets, onMemberClick, root }) => {
  if (!members.length && !root) {
    return null;
  }

  // Aggregate rollup metrics across everyone (root + reports)
  const everyone = root ? [root, ...members] : members;
  const memberKpis = everyone.map(m => computeAgentKpis(m.name, leads, deals, tasks, targets));
  const teamPipeline = memberKpis.reduce((s, k) => s + k.pipeline, 0);
  const teamOpenLeads = memberKpis.reduce((s, k) => s + k.openLeads, 0);
  const teamClosed = memberKpis.reduce((s, k) => s + k.closed, 0);
  const teamClosedValue = memberKpis.reduce((s, k) => s + k.closedValue, 0);

  // For the org chart we need the full staff list (root + members). All
  // descendants are looked up via the manager field.
  const allStaff = everyone;

  // The root of the visible org chart — if `root` was passed, use it,
  // otherwise pick the highest-ranked member (Sales Manager / TL).
  const visibleRoot = root || members.find(m => m.type === 'Sales Manager') || members.find(m => m.type === 'Team Leader') || members[0];

  return (
    <div style={{
      background:'#fff', border:'1px solid var(--border)', borderRadius:14,
      padding:'18px 22px', marginBottom:18,
    }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14, marginBottom:18, paddingBottom:14, borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:42, height:42, borderRadius:11, background:'var(--brand-tint)', color:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <UsersRound size={20}/>
          </div>
          <div>
            <h2 style={{fontSize:16, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.01em'}}>{title}</h2>
            <p style={{fontSize:11, color:'var(--text-tertiary)', marginTop:3}}>{subtitle}</p>
          </div>
        </div>
        <div style={{display:'flex', gap:14, flexWrap:'wrap'}}>
          <Stat label="Members"    value={everyone.length}/>
          <Stat label="Open leads" value={teamOpenLeads}/>
          <Stat label="Pipeline"   value={fmtM(teamPipeline)} color="#E8672A"/>
          <Stat label="Closed"     value={teamClosed} sub={fmtM(teamClosedValue)} color="#10b981"/>
        </div>
      </div>

      {/* Org-chart canvas — horizontally scrollable for wide hierarchies */}
      <div style={{overflowX:'auto', padding:'4px 0 8px'}}>
        <div style={{display:'flex', justifyContent:'center', minWidth:'min-content'}}>
          {visibleRoot && (
            <OrgNode
              member={visibleRoot}
              allStaff={allStaff}
              leads={leads}
              deals={deals}
              tasks={tasks}
              targets={targets}
              onMemberClick={onMemberClick}
              isRoot
            />
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{marginTop:14, paddingTop:12, borderTop:'1px solid var(--border)', display:'flex', gap:16, flexWrap:'wrap', fontSize:11, color:'var(--text-tertiary)'}}>
        <LegendItem color="#dc2626" label="Sales Director"/>
        <LegendItem color="#8b5cf6" label="Sales Manager"/>
        <LegendItem color="#0ea5e9" label="Team Leader"/>
        <LegendItem color="#10b981" label="Sales Agent"/>
        <span style={{marginLeft:'auto', fontStyle:'italic'}}>Click any node to open the full profile.</span>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <span style={{display:'inline-flex', alignItems:'center', gap:5, fontWeight:600}}>
    <span style={{width:10, height:10, borderRadius:2, background: color}}/>
    {label}
  </span>
);

const Stat = ({ label, value, sub, color }) => (
  <div style={{textAlign:'center'}}>
    <div style={{fontSize:9, color:'var(--text-tertiary)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em'}}>{label}</div>
    <div style={{fontSize:18, fontWeight:800, color: color || 'var(--text-primary)', marginTop:2, lineHeight:1}}>{value}</div>
    {sub && <div style={{fontSize:9, color:'var(--text-tertiary)', marginTop:2}}>{sub}</div>}
  </div>
);

const MiniKpi = ({ label, value, sub, color }) => (
  <div style={{padding:'6px 8px', background:'#f8fafc', borderRadius:6, textAlign:'center'}}>
    <div style={{fontSize:8, color:'var(--text-tertiary)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em'}}>{label}</div>
    <div style={{fontSize:13, fontWeight:800, color: color || 'var(--text-primary)', marginTop:2, lineHeight:1}}>{value}</div>
    {sub && <div style={{fontSize:9, color:'var(--text-tertiary)', marginTop:2}}>{sub}</div>}
  </div>
);

// TeamMemberSummary — drawer body when clicking a team member card.
// Exported for re-use by the Employee Board's Team Leader operations view.
// Shows the full person + their pipeline + a snapshot of their
// open leads and active deals.
export const TeamMemberSummary = ({ member: m, leads, deals, tasks }) => {
  const k = computeAgentKpis(m.name, leads, deals, tasks);
  const myOpenLeads = leads.filter(l => l.owner === m.name && !['Closed Won','Closed Lost','Nurturing'].includes(l.stage)).slice(0,8);
  const myDeals = deals.filter(d => d.owner === m.name).slice(0,8);
  const myOverdueTasks = tasks.filter(t => t.owner === m.name && t.status !== 'Completed' && t.due && t.due < new Date().toISOString().slice(0,10)).slice(0,5);
  return (
    <div style={{display:'flex', flexDirection:'column', gap:14}}>
      {/* Profile header */}
      <div style={{display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:12, background:'linear-gradient(135deg, var(--brand-tint), #fff)', border:'1px solid var(--border)'}}>
        {m.photoDataUrl ? (
          <img src={m.photoDataUrl} alt="" style={{width:64, height:64, borderRadius:'50%', objectFit:'cover', border:'3px solid #fff', boxShadow:'0 4px 12px rgba(0,0,0,.12)', flexShrink:0}}/>
        ) : (
          <div style={{width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:22, flexShrink:0}}>
            {m.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
          </div>
        )}
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:16, fontWeight:800, color:'var(--text-primary)'}}>{m.name}</div>
          <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:3}}>{m.title} · {m.department} · {m.branch}{m.team ? ` · Team ${m.team}` : ''}</div>
          <div style={{display:'flex', gap:14, marginTop:8, fontSize:11, color:'var(--text-tertiary)', flexWrap:'wrap'}}>
            <span>📧 {m.email}</span>
            <span>📱 {m.phone}</span>
            <span>👤 Reports to {m.manager}</span>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(110px, 1fr))', gap:10}}>
        <MiniKpi label="Open leads"   value={k.openLeads} sub={`${k.totalLeads} total`}/>
        <MiniKpi label="Active deals" value={k.myDeals} color="#0ea5e9"/>
        <MiniKpi label="Pipeline"     value={fmtM(k.pipeline)} color="#E8672A"/>
        <MiniKpi label="Closed (€)"   value={fmtM(k.closedValue)} sub={`${k.closed} deal${k.closed === 1 ? '' : 's'}`} color="#10b981"/>
        <MiniKpi label="Overdue"      value={k.overdueTasks} color={k.overdueTasks > 0 ? '#dc2626' : 'var(--text-tertiary)'}/>
      </div>

      {/* Open leads list */}
      {myOpenLeads.length > 0 && (
        <div>
          <div style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>Open leads ({myOpenLeads.length})</div>
          <div style={{display:'flex', flexDirection:'column', gap:6}}>
            {myOpenLeads.map(l => (
              <div key={l.id} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#fafbfc', border:'1px solid var(--border)', borderRadius:6, fontSize:12}}>
                <Phone size={12} color="var(--brand)" style={{flexShrink:0}}/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{l.name}</div>
                  <div style={{fontSize:10, color:'var(--text-tertiary)'}}>{l.id} · {l.stage} · {l.priority}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active deals list */}
      {myDeals.length > 0 && (
        <div>
          <div style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>Deals ({myDeals.length})</div>
          <div style={{display:'flex', flexDirection:'column', gap:6}}>
            {myDeals.map(d => (
              <div key={d.id} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#fafbfc', border:'1px solid var(--border)', borderRadius:6, fontSize:12}}>
                <KanbanSquare size={12} color="var(--brand)" style={{flexShrink:0}}/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{d.leadName || d.lead} · {d.project}</div>
                  <div style={{fontSize:10, color:'var(--text-tertiary)'}}>{d.id} · {d.stage}{d.commissionLocked ? ' · 🔒 locked' : ''}{d.revenueRecognised ? ' · ✅ recognised' : ''}</div>
                </div>
                <span style={{fontSize:12, fontWeight:700, color:'var(--brand)'}}>{fmtM(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overdue tasks */}
      {myOverdueTasks.length > 0 && (
        <div>
          <div style={{fontSize:11, fontWeight:700, color:'#dc2626', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>Overdue tasks ({myOverdueTasks.length})</div>
          <div style={{display:'flex', flexDirection:'column', gap:6}}>
            {myOverdueTasks.map(t => (
              <div key={t.id} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:6, fontSize:12}}>
                <AlertTriangle size={12} color="#dc2626" style={{flexShrink:0}}/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{t.title}</div>
                  <div style={{fontSize:10, color:'var(--text-tertiary)'}}>due {t.due} · {t.priority}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ───────────────────────── Shell wrapper ─────────────────────────
const RoleShell = ({ title, subtitle, children }) => (
  <div>
    <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:18}}>
      <div style={{width:40, height:40, borderRadius:11, background:'var(--brand-tint)', color:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Target size={20}/>
      </div>
      <div>
        <h2 style={{fontSize:18, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.01em'}}>{title}</h2>
        <p style={{fontSize:12, color:'var(--text-tertiary)', marginTop:3}}>{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// StalledLeadActions — inline lead-stage + quick-task panel rendered inside
// the SLA breach drawer on the Sales Manager dashboard.
// Audit-finding fix (May 2026): the manager can act without leaving the
// dashboard.
// ═══════════════════════════════════════════════════════════════════════
const StalledLeadActions = ({ lead, stages, onChangeStage, onQuickTask, onOpenDetail }) => {
  const [stage, setStage] = React.useState(lead.stage);
  const [taskTitle, setTaskTitle] = React.useState(`Follow up with ${lead.name}`);
  const [taskType, setTaskType] = React.useState('Call');

  return (
    <div style={{display:'flex', flexDirection:'column', gap:18}}>
      {/* Snapshot */}
      <div style={{padding:'14px 16px', background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:10}}>
        <div style={{fontSize:11, fontWeight:700, color:'#9a3412', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6}}>High-priority lead</div>
        <div style={{fontSize:14, fontWeight:700}}>{lead.name}</div>
        <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:3, lineHeight:1.5}}>
          {lead.id} · {lead.project} · EGP {(lead.budget || 0).toLocaleString()}<br/>
          Owner: <b>{lead.owner || 'Unassigned'}</b> · Source: {lead.source} · Created: {lead.created}
        </div>
      </div>

      {/* Inline stage change */}
      <div>
        <label style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Move stage</label>
        <div style={{display:'flex', gap:8, marginTop:6}}>
          <select
            value={stage}
            onChange={e => setStage(e.target.value)}
            style={{flex:1, padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:13, background:'#fff'}}
          >
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            className="btn btn-brand"
            disabled={stage === lead.stage}
            onClick={() => { onChangeStage(stage); }}
          >
            Apply
          </button>
        </div>
        <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:6}}>
          Current: <b>{lead.stage}</b>{stage !== lead.stage && <> → <b style={{color:'var(--brand)'}}>{stage}</b></>}
        </div>
      </div>

      {/* Quick task */}
      <div>
        <label style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em'}}>Quick task (due in 2 days)</label>
        <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:6}}>
          <input
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            placeholder="Task title"
            style={{padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:13, fontFamily:'inherit'}}
          />
          <div style={{display:'flex', gap:8}}>
            <select
              value={taskType}
              onChange={e => setTaskType(e.target.value)}
              style={{flex:1, padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:13, background:'#fff'}}
            >
              {['Call','WhatsApp','Tour','Meeting','Follow-up'].map(t => <option key={t}>{t}</option>)}
            </select>
            <button
              className="btn btn-success"
              disabled={!taskTitle.trim()}
              onClick={() => onQuickTask(taskTitle.trim(), taskType)}
            >
              Add task
            </button>
          </div>
        </div>
      </div>

      {/* Open full detail */}
      <div style={{paddingTop:12, borderTop:'1px solid var(--border)'}}>
        <button className="btn btn-outline" onClick={onOpenDetail} style={{width:'100%'}}>
          Open full lead detail →
        </button>
      </div>
    </div>
  );
};
