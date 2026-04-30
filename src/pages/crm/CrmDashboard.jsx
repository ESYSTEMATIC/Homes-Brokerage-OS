import React from 'react';
import { useApp } from '../../context/AppContext';
import { CRM_ACTIVITY } from '../../data/staticData';
import { Users, KanbanSquare, TrendingUp, Target, ArrowUpRight, ArrowDownRight, UserPlus, Briefcase, CheckCircle2, Phone, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HIERARCHY, canSeeLead, MODULE_ACCESS, slaForStage, leadAgeDays } from '../../data/crmAccess';

const fmt = (n) => new Intl.NumberFormat('en-EG').format(n);

export const CrmDashboard = () => {
  const { state, persona, personaKey } = useApp();
  const navigate = useNavigate();

  const h = HIERARCHY[personaKey] || { role: 'Visitor', scope: 'none' };

  // Role-scoped slices — agents see only own leads/deals, TLs see team, etc.
  const leads = (state.leads || []).filter(l => canSeeLead(personaKey, l));
  const deals = (state.deals || []).filter(d => canSeeLead(personaKey, d));
  const tasks = state.tasks || [];

  const totalLeads = leads.length;
  const activeDeals = deals.filter(d => d.status === 'Active').length;
  const pipelineValue = deals.filter(d => d.status === 'Active').reduce((s,d) => s + d.value, 0);
  const closedWon = deals.filter(d => d.stage === 'Closed Won' || d.stage === 'Reservation' || d.stage === 'Contracting').length;
  const conversionRate = totalLeads ? Math.round((closedWon / totalLeads) * 100) : 0;
  const slaBreaches = leads.filter(l => slaForStage(l.stage, leadAgeDays(l.created)).level === 'breach').length;
  const overrideQueue = deals.filter(d => d.commissionOverride?.status === 'Pending').length;

  const kpis = [
    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'blue', change: '+12%', up: true },
    { label: 'Active Deals', value: activeDeals, icon: KanbanSquare, color: 'green', change: '+8%', up: true },
    { label: 'Pipeline Value', value: `EGP ${fmt(pipelineValue)}`, icon: TrendingUp, color: 'orange', change: '+15%', up: true },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: Target, color: 'amber', change: '-2%', up: false },
  ];

  // Stage distribution for pipeline chart
  const stages = ['Qualified', 'Negotiation', 'Reservation', 'Contracting'];
  const stageCounts = stages.map(s => ({ stage: s, count: deals.filter(d => d.stage === s).length }));
  const maxStage = Math.max(...stageCounts.map(s => s.count), 1);

  // Source distribution
  const sources = ['Marketplace', 'Referral', 'Walk-in', 'Campaign'];
  const sourceCounts = sources.map(s => ({ source: s, count: leads.filter(l => l.source === s).length }));
  const maxSource = Math.max(...sourceCounts.map(s => s.count), 1);

  // Top performers
  const agentDeals = {};
  deals.forEach(d => { agentDeals[d.owner] = (agentDeals[d.owner] || 0) + 1; });
  const topAgents = Object.entries(agentDeals).sort((a,b) => b[1]-a[1]).slice(0,4);

  const activityIcon = { lead: <UserPlus size={14}/>, deal: <Briefcase size={14}/>, task: <CheckCircle2 size={14}/> };
  const activityColor = { lead: 'var(--info)', deal: 'var(--success)', task: 'var(--brand)' };

  const access = MODULE_ACCESS[personaKey];
  const roleScopeLabel = h.scope === 'self' ? 'Own scope only' : h.scope === 'team' ? `Team ${h.team}` : h.scope === 'cross' ? `Teams ${h.teams?.join(' + ')}` : h.scope === 'all' ? 'All teams' : h.scope === 'audit' ? 'Audit-only' : 'No access';

  return (
    <div className="crm-page">
      <div className="page-header">
        <div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Dashboard</span></div>
        <h1 className="page-title">CRM Dashboard</h1>
        <p className="page-subtitle">Lead management, deals pipeline, and sales performance overview · BRD V1.4 §6 / §11</p>
      </div>

      {/* Role banner — same pattern as Leads / Deals */}
      <div className="crm-role-banner">
        <div className="ico"><ShieldCheck size={18}/></div>
        <div className="meat">
          <div className="title">{persona.label} · {h.role}</div>
          <div className="line">
            <span className="kv"><b>Visibility:</b> {roleScopeLabel}</span>
            <span className="kv"><b>Pending approvals:</b> {overrideQueue}</span>
            <span className="kv"><b>SLA breaches:</b> {slaBreaches}</span>
          </div>
        </div>
        <div className="kpis">
          <div><div className="num">{totalLeads}</div><div className="lbl">Leads</div></div>
          <div><div className="num">{activeDeals}</div><div className="lbl">Active deals</div></div>
        </div>
      </div>

      {/* Module access matrix — what this role can do across CRM */}
      {access && (
        <div className="data-panel" style={{marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <h3 style={{fontSize:14,fontWeight:700}}>Your CRM module access</h3>
            <span style={{fontSize:11,color:'var(--text-tertiary)'}}>From BRD V1.4 §11 entitlement matrix</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:8}}>
            {Object.entries(access).map(([mod, level]) => (
              <div key={mod} style={{padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,fontSize:12}}>
                <div style={{textTransform:'capitalize',fontWeight:700,color:'#0f172a'}}>{mod}</div>
                <div style={{color:'var(--text-secondary)',marginTop:2}}>{level}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="kpi-grid kpi-grid-4">
        {kpis.map(k => (
          <div className="kpi-card" key={k.label}>
            <div>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              <div className={`kpi-change ${k.up ? 'up' : 'down'}`}>
                {k.up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {k.change}
              </div>
            </div>
            <div className={`kpi-icon ${k.color}`}><k.icon size={24}/></div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:24,marginBottom:24}}>
        {/* Pipeline Summary */}
        <div className="data-panel">
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:20}}>Pipeline Summary</h3>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {stageCounts.map(s => (
              <div key={s.stage} style={{display:'flex',alignItems:'center',gap:14}}>
                <span style={{width:100,fontSize:13,fontWeight:600,color:'var(--text-secondary)'}}>{s.stage}</span>
                <div style={{flex:1,height:28,background:'#f4f7fe',borderRadius:8,overflow:'hidden',position:'relative'}}>
                  <div style={{height:'100%',width:`${(s.count/maxStage)*100}%`,background:'linear-gradient(90deg,var(--brand),var(--brand-light))',borderRadius:8,transition:'width .6s ease',minWidth:s.count?32:0,display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:10}}>
                    <span style={{fontSize:12,fontWeight:800,color:'#fff'}}>{s.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-outline" style={{marginTop:16}} onClick={()=>navigate('/system/crm/deals')}>View Pipeline →</button>
        </div>

        {/* Lead Sources */}
        <div className="data-panel">
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:20}}>Lead Sources</h3>
          <div style={{display:'flex',alignItems:'flex-end',gap:16,height:160,paddingBottom:8,borderBottom:'1px solid var(--border)'}}>
            {sourceCounts.map(s => (
              <div key={s.source} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <span style={{fontSize:12,fontWeight:800,color:'var(--text-primary)'}}>{s.count}</span>
                <div style={{width:'100%',height:`${(s.count/maxSource)*120}px`,background:`linear-gradient(180deg,var(--brand),var(--brand-dark))`,borderRadius:'6px 6px 0 0',minHeight:8,transition:'height .6s ease'}}/>
                <span style={{fontSize:10,fontWeight:600,color:'var(--text-secondary)',textAlign:'center'}}>{s.source}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:24}}>
        {/* Recent Leads */}
        <div className="data-panel">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <h3 style={{fontSize:16,fontWeight:700}}>Recent Leads</h3>
            <button className="btn btn-sm btn-outline" onClick={()=>navigate('/system/crm/leads')}>View All</button>
          </div>
          <div className="data-scroll">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Source</th><th>Project</th><th>Stage</th><th>Priority</th></tr></thead>
              <tbody>
                {leads.slice(0,5).map(l => (
                  <tr key={l.id}>
                    <td className="bold">{l.name}</td>
                    <td className="muted">{l.source}</td>
                    <td className="muted">{l.project}</td>
                    <td><span className={`badge ${l.stage==='New'?'badge-info':l.stage==='Qualified'?'badge-success':l.stage==='Negotiation'?'badge-warning':'badge-gray'}`}>{l.stage}</span></td>
                    <td><span className={`badge ${l.priority==='Hot'?'badge-danger':l.priority==='Warm'?'badge-warning':'badge-gray'}`}>{l.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="data-panel">
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>Recent Activity</h3>
          <div className="crm-activity-feed">
            {CRM_ACTIVITY.slice(0,6).map(a => (
              <div key={a.id} className="crm-activity-item">
                <div className="crm-activity-icon" style={{background:`${activityColor[a.type]}15`,color:activityColor[a.type]}}>
                  {activityIcon[a.type]}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{a.action}</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.detail}</div>
                </div>
                <div style={{fontSize:11,color:'var(--text-tertiary)',whiteSpace:'nowrap'}}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      {topAgents.length > 0 && (
        <div className="data-panel" style={{marginTop:24}}>
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>Top Performers</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {topAgents.map(([agent, count], i) => (
              <div key={agent} style={{background:'#fafbfc',border:'1px solid var(--border)',borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:i===0?'var(--brand)':i===1?'var(--info)':i===2?'var(--success)':'var(--text-secondary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800}}>
                  {i+1}
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>{agent}</div>
                  <div style={{fontSize:12,color:'var(--text-secondary)'}}>{count} deals</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Tasks */}
      <div className="data-panel" style={{marginTop:24}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{fontSize:16,fontWeight:700}}>Upcoming Tasks</h3>
          <button className="btn btn-sm btn-outline" onClick={()=>navigate('/system/crm/tasks')}>View All</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
          {tasks.filter(t=>t.status!=='Completed').slice(0,3).map(t => (
            <div key={t.id} style={{background:'#fafbfc',border:'1px solid var(--border)',borderRadius:10,padding:16,borderLeft:`4px solid ${t.status==='Overdue'?'var(--danger)':t.priority==='High'?'var(--brand)':'var(--info)'}`}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{t.title}</div>
              <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:8}}><Phone size={11}/> {t.type} · Due: {t.due}</div>
              <div style={{display:'flex',gap:6}}>
                <span className={`badge ${t.status==='Overdue'?'badge-danger':'badge-info'}`} style={{fontSize:11}}>{t.status}</span>
                <span className={`badge ${t.priority==='High'?'badge-warning':'badge-gray'}`} style={{fontSize:11}}>{t.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
