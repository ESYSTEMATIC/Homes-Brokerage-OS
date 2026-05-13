import React, { useState } from 'react';
import { STAGES } from '../../data/staticData';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, Users, MapPin, Calendar, Share2, Target, AlertTriangle } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-EG').format(n);

export const CrmReports = () => {
  const { state } = useApp();
  const [activeReport, setActiveReport] = useState('funnel');

  const { leads = [], deals = [], tours = [], listingShares = [] } = state;

  // Funnel data
  const funnelStages = ['New','Contacted','Qualified','Tour Scheduled','Negotiation','Reservation','Contracting','Closed Won'];
  const funnelData = funnelStages.map(s => ({ stage: s, count: leads.filter(l=>l.stage===s).length + (s==='Closed Won'?1:0) + (s==='Negotiation'?1:0) }));
  const maxFunnel = Math.max(...funnelData.map(f=>f.count),1);

  // Source ROI
  const sources = ['Marketplace','Referral','Walk-in','Campaign'];
  const sourceData = sources.map(s => {
    const lds = leads.filter(l=>l.source===s).length;
    const dls = deals.filter(d=>leads.find(l=>l.name===d.leadName&&l.source===s)).length;
    const revenue = deals.filter(d=>leads.find(l=>l.name===d.leadName&&l.source===s)).reduce((sum,d)=>sum+d.value,0);
    return { source:s, leads:lds, deals:dls, revenue, conversion: lds?((dls/lds)*100).toFixed(1):0 };
  });

  // Agent Leaderboard
  const agents = ['Ahmed Hassan','Fatma Ibrahim','Hana Mahmoud','Omar Sherif'];
  const agentData = agents.map(a => {
    const lds = leads.filter(l=>l.owner===a).length;
    const dls = deals.filter(d=>d.owner===a&&d.status==='Active').length;
    const revenue = deals.filter(d=>d.owner===a).reduce((sum,d)=>sum+d.value,0);
    const trs = tours.filter(t=>t.agent===a).length;
    const shares = listingShares.filter(s=>s.agent===a).length;
    return { agent:a, leads:lds, deals:dls, revenue, tours:trs, shares, conversion: lds?((dls/lds)*100).toFixed(0):0 };
  }).sort((a,b)=>b.revenue-a.revenue);

  // Tour Analytics
  const tourStats = {
    total: tours.length,
    completed: tours.filter(t=>t.status==='Completed').length,
    scheduled: tours.filter(t=>t.status==='Scheduled').length,
    noShow: tours.filter(t=>t.status==='No-Show').length,
    cancelled: tours.filter(t=>t.status==='Cancelled').length,
    avgRating: (tours.filter(t=>t.rating).reduce((s,t)=>s+t.rating,0)/(tours.filter(t=>t.rating).length||1)).toFixed(1),
    completionRate: tours.length ? ((tours.filter(t=>t.status==='Completed').length/tours.length)*100).toFixed(0) : 0,
    noShowRate: tours.length ? ((tours.filter(t=>t.status==='No-Show').length/tours.length)*100).toFixed(0) : 0,
  };

  // Listing Performance
  const listingPerf = [...new Set(listingShares.map(s=>s.property))].map(p=>{
    const shares = listingShares.filter(s=>s.property===p);
    return { property:p, shares:shares.length, interested:shares.filter(s=>s.response==='Interested').length, viewed:shares.filter(s=>s.response==='Viewed').length };
  }).sort((a,b)=>b.shares-a.shares);

  // 11-May meeting (42:00-42:54): apply a 2-3 month KPI evaluation to each
  // team. Teams with zero deals during the window get a warning so managers
  // can act before the gap widens. Window = 60 days from "today" (demo data
  // is dated 2024-01 so we use a relative cutoff of 60 days back from now).
  const sixtyDaysAgo = new Date(Date.now() - 60 * 86_400_000).toISOString().slice(0,10);
  const teams = [...new Set(leads.map(l => l.team).filter(Boolean))];
  const teamPerformance = teams.map(team => {
    const teamLeads = leads.filter(l => l.team === team);
    const teamDeals = deals.filter(d => d.team === team);
    const dealsInWindow = teamDeals.filter(d => (d.created || '') >= sixtyDaysAgo);
    const closedWonInWindow = dealsInWindow.filter(d => d.status === 'Closed Won' || d.stage === 'Standard Collection (10%)' || d.stage === 'Contract Signed & Payment').length;
    const pipelineActive = teamDeals.filter(d => d.status === 'Active' || d.status === undefined).reduce((s,d) => s + (d.value || 0), 0);
    const dealsInWindowCount = dealsInWindow.length;
    let status;
    if (dealsInWindowCount === 0) status = 'critical';
    else if (closedWonInWindow === 0 && dealsInWindowCount < 3) status = 'warning';
    else status = 'ok';
    return {
      team,
      leadsCount: teamLeads.length,
      dealsInWindow: dealsInWindowCount,
      closedWonInWindow,
      pipelineActive,
      status,
    };
  }).sort((a,b) => (a.status === 'critical' ? -1 : a.status === 'warning' ? 0 : 1) - (b.status === 'critical' ? -1 : b.status === 'warning' ? 0 : 1));

  const warningCount = teamPerformance.filter(t => t.status !== 'ok').length;

  const reports = [
    {id:'warnings',label:`Team Warnings${warningCount > 0 ? ` (${warningCount})` : ''}`,icon:<AlertTriangle size={16}/>},
    {id:'funnel',label:'Conversion Funnel',icon:<Target size={16}/>},
    {id:'source',label:'Source ROI',icon:<TrendingUp size={16}/>},
    {id:'agents',label:'Agent Leaderboard',icon:<Users size={16}/>},
    {id:'tours',label:'Tour Analytics',icon:<Calendar size={16}/>},
    {id:'listings',label:'Listing Performance',icon:<Share2 size={16}/>},
  ];

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Reports</span></div><h1 className="page-title">Reports & Analytics</h1><p className="page-subtitle">Comprehensive performance insights, conversion metrics, and ROI analysis</p></div>

      {/* Report Tabs */}
      <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
        {reports.map(r=>(
          <button key={r.id} className={`btn ${activeReport===r.id?'btn-brand':'btn-outline'}`} onClick={()=>setActiveReport(r.id)} style={{display:'flex',alignItems:'center',gap:6}}>
            {r.icon} {r.label}
          </button>
        ))}
      </div>

      {/* Funnel */}
      {/* 11-May meeting: KPI warnings — teams with zero deals in last 60d
          get flagged for manager action. */}
      {activeReport==='warnings'&&(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="data-panel" style={{padding:'18px 22px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6,gap:14,flexWrap:'wrap'}}>
              <div>
                <h3 style={{fontSize:16,fontWeight:800,display:'flex',alignItems:'center',gap:8}}><AlertTriangle size={18} color={warningCount > 0 ? '#dc2626' : '#16a34a'}/> Team Performance Warnings</h3>
                <p style={{fontSize:12,color:'var(--text-secondary)',marginTop:4}}>Rolling 60-day evaluation window. Teams with zero deals in the window are flagged for manager intervention (BRD §6.1.5 — escalation pattern extended to team level per 11-May review).</p>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11,color:'var(--text-tertiary)'}}>Window cutoff</div>
                <div style={{fontSize:13,fontWeight:700,fontFamily:'monospace'}}>{sixtyDaysAgo} → today</div>
              </div>
            </div>
          </div>

          {teamPerformance.length === 0 ? (
            <div className="data-panel" style={{padding:40,textAlign:'center',color:'var(--text-tertiary)'}}>No teams in scope.</div>
          ) : teamPerformance.map(t => {
            const tone = t.status === 'critical' ? { bg:'#fef2f2', border:'#fecaca', color:'#dc2626', label:'CRITICAL', advice:'Recommend immediate review with the Team Leader and a refreshed lead source mix. Consider reassigning a senior agent.' }
                        : t.status === 'warning' ? { bg:'#fef3c7', border:'#fcd34d', color:'#b45309', label:'WARNING', advice:'Team is active but not closing. Review pipeline quality and time-to-respond on assigned leads.' }
                        : { bg:'#f0fdf4', border:'#86efac', color:'#166534', label:'ON TRACK', advice:'No action required. Maintain cadence.' };
            return (
              <div key={t.team} style={{background:tone.bg,border:`1px solid ${tone.border}`,borderRadius:12,padding:'16px 20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12,gap:14}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <h4 style={{fontSize:16,fontWeight:800}}>Team {t.team}</h4>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:'.05em',padding:'3px 8px',background:tone.color,color:'#fff',borderRadius:4}}>{tone.label}</span>
                    </div>
                    <p style={{fontSize:12,color:'var(--text-secondary)',marginTop:4,lineHeight:1.5}}>{tone.advice}</p>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                  {[
                    ['Leads owned',          t.leadsCount],
                    ['Deals last 60 days',   t.dealsInWindow],
                    ['Closed Won last 60 days', t.closedWonInWindow],
                    ['Active pipeline (EGP)', `${(t.pipelineActive / 1e6).toFixed(1)}M`],
                  ].map(([k,v]) => (
                    <div key={k} style={{padding:'10px 12px',background:'#fff',borderRadius:8,border:'1px solid var(--border)'}}>
                      <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>{k}</div>
                      <div style={{fontSize:18,fontWeight:800,marginTop:2,color: t.status === 'critical' && (k === 'Deals last 60 days' || k === 'Closed Won last 60 days') ? tone.color : 'var(--text-primary)'}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeReport==='funnel'&&(
        <div className="data-panel" style={{padding:28}}>
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:20}}>Lead Conversion Funnel</h3>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {funnelData.map((f,i)=>(
              <div key={f.stage} style={{display:'flex',alignItems:'center',gap:16}}>
                <div style={{width:140,fontSize:12,fontWeight:600,textAlign:'right',color:i<3?'var(--text-primary)':i<6?'var(--brand)':'var(--success)'}}>{f.stage}</div>
                <div style={{flex:1,height:32,background:'#f1f5f9',borderRadius:8,overflow:'hidden',position:'relative'}}>
                  <div style={{width:`${(f.count/maxFunnel)*100}%`,height:'100%',background:`linear-gradient(90deg,${i<3?'var(--info)':i<6?'var(--brand)':'var(--success)'},${i<3?'#60a5fa':i<6?'#f59e0b':'#34d399'})`,borderRadius:8,transition:'width .5s ease',minWidth:f.count>0?30:0,display:'flex',alignItems:'center',paddingLeft:10}}>
                    <span style={{fontSize:12,fontWeight:800,color:'#fff'}}>{f.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:20,padding:16,background:'#f8fafc',borderRadius:10,border:'1px solid var(--border)',display:'flex',gap:24,fontSize:12}}>
            <div><span style={{fontWeight:700}}>Total Leads:</span> {leads.length}</div>
            <div><span style={{fontWeight:700}}>Active Deals:</span> {deals.filter(d=>d.status==='Active').length}</div>
            <div><span style={{fontWeight:700}}>Overall Conversion:</span> {leads.length?((deals.filter(d=>d.status==='Active').length/leads.length)*100).toFixed(1):0}%</div>
          </div>
        </div>
      )}

      {/* Source ROI */}
      {activeReport==='source'&&(
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>Source</th><th>Leads</th><th>Deals</th><th>Revenue</th><th>Conversion %</th><th>Performance</th></tr></thead>
          <tbody>{sourceData.map(s=>(
            <tr key={s.source}>
              <td className="bold">{s.source}</td>
              <td>{s.leads}</td>
              <td>{s.deals}</td>
              <td className="bold">EGP {fmt(s.revenue)}</td>
              <td>{s.conversion}%</td>
              <td><div style={{width:80,height:6,background:'#f1f5f9',borderRadius:4,overflow:'hidden'}}><div style={{width:`${Math.min(s.conversion*2,100)}%`,height:'100%',background:'var(--brand)',borderRadius:4}}/></div></td>
            </tr>
          ))}</tbody></table></div></div>
      )}

      {/* Agent Leaderboard */}
      {activeReport==='agents'&&(
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>#</th><th>Agent</th><th>Leads</th><th>Deals</th><th>Revenue</th><th>Tours</th><th>Shares</th><th>Conversion</th></tr></thead>
          <tbody>{agentData.map((a,i)=>(
            <tr key={a.agent}>
              <td><span style={{width:24,height:24,borderRadius:'50%',background:i===0?'#f59e0b':i===1?'#94a3b8':i===2?'#cd7c32':'#e2e8f0',color:'#fff',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800}}>{i+1}</span></td>
              <td className="bold">{a.agent}</td>
              <td>{a.leads}</td>
              <td>{a.deals}</td>
              <td className="bold">EGP {fmt(a.revenue)}</td>
              <td>{a.tours}</td>
              <td>{a.shares}</td>
              <td><span className={`badge ${Number(a.conversion)>=50?'badge-success':Number(a.conversion)>=25?'badge-warning':'badge-info'}`}>{a.conversion}%</span></td>
            </tr>
          ))}</tbody></table></div></div>
      )}

      {/* Tour Analytics */}
      {activeReport==='tours'&&(
        <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
            {[['Completion Rate',tourStats.completionRate+'%','var(--success)'],['No-Show Rate',tourStats.noShowRate+'%','var(--danger)'],['Avg Rating',tourStats.avgRating+' ★','#f59e0b'],['Total Tours',tourStats.total,'var(--info)']].map(([l,v,c])=>(
              <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'16px 20px',borderTop:`3px solid ${c}`}}><div style={{fontSize:12,color:'var(--text-secondary)',fontWeight:600}}>{l}</div><div style={{fontSize:22,fontWeight:800,marginTop:4}}>{v}</div></div>
            ))}
          </div>
          <div className="data-panel" style={{padding:24}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Tour Status Distribution</h3>
            <div style={{display:'flex',gap:8,marginBottom:20}}>
              {[['Completed',tourStats.completed,'var(--success)'],['Scheduled',tourStats.scheduled,'var(--brand)'],['No-Show',tourStats.noShow,'var(--danger)'],['Cancelled',tourStats.cancelled,'var(--text-tertiary)']].map(([l,v,c])=>(
                <div key={l} style={{flex:1,padding:'12px 16px',background:`${c}10`,borderRadius:10,borderLeft:`3px solid ${c}`}}>
                  <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Listing Performance */}
      {activeReport==='listings'&&(
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>Property</th><th>Total Shares</th><th>Interested</th><th>Viewed</th><th>Interest Rate</th><th>Performance</th></tr></thead>
          <tbody>{listingPerf.map(l=>{const rate=l.shares?((l.interested/l.shares)*100).toFixed(0):0;return(
            <tr key={l.property}>
              <td className="bold" style={{maxWidth:220,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.property}</td>
              <td>{l.shares}</td>
              <td><span className="badge badge-success">{l.interested}</span></td>
              <td><span className="badge badge-info">{l.viewed}</span></td>
              <td>{rate}%</td>
              <td><div style={{width:80,height:6,background:'#f1f5f9',borderRadius:4,overflow:'hidden'}}><div style={{width:`${rate}%`,height:'100%',background:'var(--success)',borderRadius:4}}/></div></td>
            </tr>
          );})}</tbody></table></div></div>
      )}
    </div>
  );
};
