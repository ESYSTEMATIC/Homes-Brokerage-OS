import React from 'react';
import { useApp } from '../context/AppContext';
import { TRAINING } from '../data/staticData';
import { Users, FileText, GraduationCap, FileCheck2, HelpCircle, ExternalLink, Lock } from 'lucide-react';

export const AgentPortalDashboard = () => {
  const { persona } = useApp();
  const completed = TRAINING.filter(c=>c.status==='Completed'&&c.required).length;
  const total = TRAINING.filter(c=>c.required).length;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div><h1 style={{fontSize:28,fontWeight:800,color:'var(--text-primary)'}}>Welcome back, {persona.label.split(' ')[0]}</h1><p style={{color:'var(--text-secondary)',marginTop:4}}>{persona.role||'Licensed Agent'} · {persona.scope} · MLS ID: {persona.mls||'EGMLS-287451'}</p></div>
        <span className="badge badge-success" style={{fontSize:13,padding:'6px 14px'}}>● Approved Agent</span>
      </div>

      <div className="kpi-grid kpi-grid-5" style={{marginBottom:24}}>
        {[['ONBOARDING','78%','in-progress','amber'],['TRAINING',`${completed}/${total} done`,'in-progress','amber'],['CRM','Pending','pending','gray'],['MATRIX EGMLS','Pending','pending','gray'],['AGREEMENT','Signed','completed','green'],['PROFILE','85%','in-progress','amber']].slice(0,5).map(([label,value,status,color])=>(
          <div key={label} style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,padding:'16px 20px',textAlign:'center'}}>
            <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
            <div style={{fontSize:22,fontWeight:800,marginTop:6}}>{value}</div>
            <span className={`badge badge-${color==='green'?'success':color==='amber'?'warning':'gray'}`} style={{marginTop:6}}>{status}</span>
          </div>
        ))}
      </div>

      <div className="journey-bar">
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:20}}>Onboarding Journey</h3>
        <div className="journey-steps">
          {[['Application',true],['Documents',true],['Agreement',true],['Training',false,true],['MLS Access',false],['Go Live',false]].map(([label,done,current],i,arr)=>(
            <React.Fragment key={label}>
              <div className="journey-step">
                <div className={`journey-step-circle ${done?'done':current?'current':''}`}>{done?'✓':i+1}</div>
                <div className="journey-step-label">{label}</div>
              </div>
              {i<arr.length-1&&<div className={`journey-line ${done?'done':''}`}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>Quick Access</h3>
      <div className="quick-grid">
        {[
          {icon:<Users size={20}/>,title:'CRM Portal',desc:'Manage leads, contacts, and deal pipeline',status:'CRM access will be granted once all required training courses are completed.',locked:true},
          {icon:<FileText size={20}/>,title:'Matrix EGMLS',desc:'MLS listings, market data, and property search',status:'Your MLS ID is pending verification by EGMLS. Estimated: 2-3 business days.',locked:true},
          {icon:<GraduationCap size={20}/>,title:'Viva Learning',desc:'Required training courses and certifications',status:'3 courses remaining',locked:false},
          {icon:<FileCheck2 size={20}/>,title:'Documents',desc:'Upload and manage required documents',status:'7 of 9 uploaded',locked:false},
          {icon:<HelpCircle size={20}/>,title:'Support Center',desc:'Help desk, FAQs, and onboarding guides',status:'1 open ticket',locked:false},
        ].map(card=>(
          <div className="quick-card" key={card.title}>
            <div className="quick-card-header">
              <div className="quick-card-icon">{card.icon}</div>
              {card.locked?<Lock size={14} color="var(--text-tertiary)"/>:<ExternalLink size={14} color="var(--text-tertiary)"/>}
            </div>
            <h4>{card.title}</h4>
            <p>{card.desc}</p>
            <div className={`status-text ${card.locked?'locked':'ok'}`}>{card.status}</div>
          </div>
        ))}
      </div>

      <h3 style={{fontSize:16,fontWeight:700,marginBottom:16,marginTop:24}}>Performance Snapshot</h3>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Active Leads</div><div className="kpi-value">0</div></div><div className="kpi-icon gray"><span style={{fontSize:20}}>📋</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Tasks Due Today</div><div className="kpi-value">0</div></div><div className="kpi-icon gray"><span style={{fontSize:20}}>📅</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Deals in Pipeline</div><div className="kpi-value">0</div></div><div className="kpi-icon gray"><span style={{fontSize:20}}>💼</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Commission YTD</div><div className="kpi-value">EGP 0</div></div><div className="kpi-icon gray"><span style={{fontSize:20}}>💰</span></div></div>
      </div>
    </div>
  );
};
