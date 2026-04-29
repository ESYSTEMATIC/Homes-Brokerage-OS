import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, GraduationCap, FileCheck2, HelpCircle, ExternalLink, Lock, Building2 } from 'lucide-react';

export const AgentPortalDashboard = () => {
  const { persona, state, toast, writeAudit, openDrawer } = useApp();
  const navigate = useNavigate();

  const completed = state.training.filter(c=>c.status==='Completed' && c.required).length;
  const total = state.training.filter(c=>c.required).length;
  const trainingDone = completed === total;
  const docsUploaded = state.agentDocs.filter(d=>d.status==='Approved').length;
  const docsTotal = state.agentDocs.length;

  const ssoLaunch = (system) => {
    toast(`Launching ${system} via Microsoft Entra SSO…`, 'info');
    writeAudit('SSO Launch', `${system} (federated)`, 'Security', 'Token issued via Employee Board');
  };

  const lockedView = (msg) => openDrawer({
    title: 'Access locked', subtitle: 'Training gate',
    content: <div style={{padding:14,background:'#fff7ed',border:'1px solid #fde68a',borderRadius:10,color:'#92400e',fontSize:13,lineHeight:1.6}}>{msg}</div>,
  });

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h1 style={{fontSize:28,fontWeight:800,color:'var(--text-primary)'}}>Welcome back, {persona.label.split(' ')[0]}</h1>
          <p style={{color:'var(--text-secondary)',marginTop:4}}>{persona.role||'Licensed Agent'} · {persona.scope} · MLS ID: {persona.mls||'EGMLS-287451'}</p>
        </div>
        <span className="badge badge-success" style={{fontSize:13,padding:'6px 14px'}}>● Approved Agent</span>
      </div>

      <div className="kpi-grid kpi-grid-5" style={{marginBottom:24}}>
        {[['ONBOARDING','78%','in-progress','amber'],['TRAINING',`${completed}/${total} done`,trainingDone?'completed':'in-progress',trainingDone?'green':'amber'],['CRM',trainingDone?'Active':'Pending',trainingDone?'completed':'pending',trainingDone?'green':'gray'],['MATRIX EGMLS','Pending','pending','gray'],['AGREEMENT','Signed','completed','green']].map(([label,value,status,color])=>(
          <div key={label} style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,padding:'16px 20px',textAlign:'center'}}>
            <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
            <div style={{fontSize:22,fontWeight:800,marginTop:6}}>{value}</div>
            <span className={`badge badge-${color==='green'?'success':color==='amber'?'warning':'gray'}`} style={{marginTop:6}}>{status}</span>
          </div>
        ))}
      </div>

      <div className="journey-bar" style={{ marginBottom: 32 }}>
        <h3 className="section-title">Onboarding Journey</h3>
        <div className="journey-steps">
          {[['Application',true],['Documents',true],['Agreement',true],['Training',trainingDone,!trainingDone],['MLS Access',false],['Go Live',false]].map(([label,done,current],i,arr)=>(
            <React.Fragment key={label}>
              <div className="journey-step">
                <div className={`journey-step-circle ${step.done ? 'done' : step.current ? 'current' : ''}`}>
                  {step.done ? '✓' : i + 1}
                </div>
                <div className="journey-step-label" style={{ fontWeight: step.current ? '700' : '500', color: step.current ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {step.label}
                </div>
              </div>
              {i < arr.length - 1 && <div className={`journey-line ${step.done ? 'done' : ''}`}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>Quick Access · Federated Systems</h3>
      <div className="quick-grid">
        {[
          {icon:<Users size={20}/>,title:'CRM Portal',desc:'Manage leads, contacts, and deal pipeline',status:trainingDone?'Ready · launch via SSO':'CRM access will be granted once all required training courses are completed.',locked:!trainingDone, system:'CRM'},
          {icon:<FileText size={20}/>,title:'Matrix EGMLS',desc:'MLS listings, market data, and property search',status:'Your MLS ID is pending verification by EGMLS. Estimated: 2-3 business days.',locked:true, system:'Matrix EGMLS'},
          {icon:<Building2 size={20}/>,title:'Marketplace',desc:'Public inventory and lead capture (homes.com.eg)',status:'Federated · launch via SSO',locked:false, system:'Marketplace'},
          {icon:<GraduationCap size={20}/>,title:'Viva Learning',desc:'Required training courses and certifications',status:`${total-completed} courses remaining`,locked:false, link:'/agent/learning'},
          {icon:<FileCheck2 size={20}/>,title:'Documents',desc:'Upload and manage required documents',status:`${docsUploaded} of ${docsTotal} uploaded`,locked:false, link:'/agent/documents'},
          {icon:<HelpCircle size={20}/>,title:'Support Center',desc:'Help desk, FAQs, and onboarding guides',status:`${state.supportTickets.filter(t=>t.status==='Open').length} open ticket`,locked:false, link:'/agent/help'},
        ].map(card=>(
          <div className="quick-card" key={card.title} onClick={()=>{
            if (card.locked && card.system) return lockedView(card.status);
            if (card.system) return ssoLaunch(card.system);
            if (card.link) navigate(card.link);
          }}>
            <div className="quick-card-header">
              <div className="quick-card-icon" style={{ background: card.locked ? 'var(--content-bg)' : 'var(--accent-light)', color: card.locked ? 'var(--text-secondary)' : 'var(--accent)' }}>
                {card.icon}
              </div>
              {card.locked ? <Lock size={14} className="muted" /> : <ExternalLink size={14} className="muted" />}
            </div>
            <h4 style={{ margin: '12px 0 4px' }}>{card.title}</h4>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{card.desc}</p>
            <div className={`status-text ${card.locked ? 'locked' : 'ok'}`} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {card.status}
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-title">Performance Snapshot</h3>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Active Leads</div><div className="kpi-value">{trainingDone?12:0}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📋</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Tasks Due Today</div><div className="kpi-value">{trainingDone?3:0}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>📅</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Deals in Pipeline</div><div className="kpi-value">{trainingDone?2:0}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💼</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Commission YTD</div><div className="kpi-value">EGP {trainingDone?'45,000':'0'}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💰</span></div></div>
      </div>
    </div>
  );
};

