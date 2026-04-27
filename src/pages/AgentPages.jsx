import React from 'react';
import { PROJECTS } from '../data/staticData';
const fmt = v => new Intl.NumberFormat('en-EG',{style:'currency',currency:'EGP',maximumFractionDigits:0}).format(v);

export const AgentProducts = () => (
  <div>
    <h1 className="page-title">Products & Services</h1>
    <p className="page-subtitle" style={{marginBottom:24}}>Browse available developer inventory — projects and compounds</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
      {PROJECTS.filter(p=>p.status==='Published').map(p=>(
        <div key={p.id} style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,overflow:'hidden',boxShadow:'var(--card-shadow)'}}>
          <div style={{height:140,background:'linear-gradient(135deg,#1e3a5f,#2563eb)',display:'flex',alignItems:'flex-end',padding:16}}>
            <div><div style={{color:'#fff',fontWeight:700,fontSize:16}}>{p.name}</div><div style={{color:'rgba(255,255,255,.7)',fontSize:12}}>{p.developer} · {p.location}</div></div>
          </div>
          <div style={{padding:16}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
              <div><div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase'}}>Units</div><div style={{fontWeight:700}}>{p.units}</div></div>
              <div><div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase'}}>Available</div><div style={{fontWeight:700,color:'var(--success)'}}>{p.available}</div></div>
              <div><div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase'}}>From</div><div style={{fontWeight:700}}>{fmt(p.priceFrom)}</div></div>
              <div><div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase'}}>Delivery</div><div style={{fontWeight:700}}>{p.delivery}</div></div>
            </div>
            <span className={`badge ${p.type==='Resort'?'badge-info':p.type==='Township'?'badge-success':'badge-warning'}`}>{p.type}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AgentPerformance = () => (
  <div>
    <h1 className="page-title">Performance</h1>
    <p className="page-subtitle" style={{marginBottom:24}}>Your sales metrics and productivity — BRD 8.8</p>
    <div className="kpi-grid kpi-grid-4">
      <div className="kpi-card"><div><div className="kpi-label">Leads Assigned</div><div className="kpi-value">0</div></div><div className="kpi-icon gray"><span style={{fontSize:20}}>📋</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Tours Completed</div><div className="kpi-value">0</div></div><div className="kpi-icon gray"><span style={{fontSize:20}}>🏠</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Deals Closed</div><div className="kpi-value">0</div></div><div className="kpi-icon gray"><span style={{fontSize:20}}>💼</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Conversion Rate</div><div className="kpi-value">0%</div></div><div className="kpi-icon gray"><span style={{fontSize:20}}>📈</span></div></div>
    </div>
    <div className="info-banner">Performance data will populate once CRM access is granted and leads are assigned to your account.</div>
  </div>
);

export const AgentProfile = () => (
  <div>
    <h1 className="page-title">Profile</h1>
    <p className="page-subtitle" style={{marginBottom:24}}>Manage your account and personal information</p>
    <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:24}}>
      <div style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,padding:24,textAlign:'center'}}>
        <div style={{width:80,height:80,borderRadius:'50%',background:'var(--gold)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:800,color:'#fff',margin:'0 auto 16px'}}>SE</div>
        <div style={{fontWeight:700,fontSize:18}}>Sarah El-Masry</div>
        <div style={{color:'var(--text-secondary)',fontSize:13,marginTop:4}}>Licensed Agent · New Cairo Branch</div>
        <span className="badge badge-success" style={{marginTop:12}}>Approved</span>
        <div style={{marginTop:16,fontSize:12,color:'var(--text-tertiary)'}}>MLS ID: EGMLS-287451</div>
      </div>
      <div style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,padding:24}}>
        <h3 style={{fontWeight:700,marginBottom:16}}>Personal Information</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {[['Full Name','Sarah El-Masry'],['Email','sarah@homesbrokerage.eg'],['Phone','+20 100 123 4567'],['Branch','New Cairo'],['Department','Sales'],['Manager','Karim Mostafa'],['Team','Alpha'],['Join Date','2024-01-01']].map(([l,v])=>(
            <div key={l}><div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',marginBottom:4}}>{l}</div><div style={{fontWeight:500}}>{v}</div></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const AgentDocuments = () => (
  <div>
    <h1 className="page-title">Documents</h1>
    <p className="page-subtitle" style={{marginBottom:24}}>Upload and manage your required documents</p>
    <div className="kpi-grid kpi-grid-3" style={{marginBottom:24}}>
      <div className="kpi-card"><div><div className="kpi-label">Uploaded</div><div className="kpi-value">7</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Pending</div><div className="kpi-value">2</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
      <div className="kpi-card"><div><div className="kpi-label">Total Required</div><div className="kpi-value">9</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📄</span></div></div>
    </div>
    <div className="data-panel">
      <div className="data-scroll">
        <table className="data-table">
          <thead><tr><th>Document</th><th>Type</th><th>Status</th><th>Upload Date</th><th style={{textAlign:'right'}}>Action</th></tr></thead>
          <tbody>
            {[['National ID','Identity','Approved','2024-01-14'],['Tax Card','Financial','Approved','2024-01-14'],['RERA License','Regulatory','Approved','2024-01-12'],['Brokerage Agreement','Legal','Approved','2024-01-10'],['Criminal Record','Legal','Approved','2024-01-08'],['Bank Details','Financial','Approved','2024-01-08'],['Profile Photo','Identity','Approved','2024-01-05'],['Proof of Address','Identity','Pending','—'],['Insurance','Financial','Pending','—']].map(([doc,type,status,date])=>(
              <tr key={doc}><td className="bold">{doc}</td><td>{type}</td><td><span className={`badge ${status==='Approved'?'badge-success':'badge-warning'}`}>{status}</span></td><td className="muted">{date}</td><td style={{textAlign:'right'}}>{status==='Pending'&&<button className="btn btn-primary btn-sm">Upload</button>}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const AgentNotifications = () => (
  <div>
    <h1 className="page-title">Notifications</h1>
    <p className="page-subtitle" style={{marginBottom:24}}>Stay updated on your onboarding progress and tasks</p>
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {[
        {text:'Your National ID has been approved',time:'2 hours ago',type:'success'},
        {text:'Training module "Anti-Money Laundering" is due in 3 days',time:'5 hours ago',type:'warning'},
        {text:'Welcome to Homes! Complete your onboarding checklist to get started.',time:'1 day ago',type:'info'},
        {text:'Your MLS ID verification is in progress. Estimated: 2-3 business days.',time:'2 days ago',type:'info'},
        {text:'Please upload your Proof of Address document',time:'3 days ago',type:'warning'},
      ].map((n,i)=>(
        <div key={i} className={`alert-card ${n.type==='warning'?'warning':n.type==='success'?'':'critical'}`} style={{borderLeftColor:n.type==='success'?'var(--success)':n.type==='warning'?'var(--warning)':'var(--accent)'}}>
          <div><div className="alert-card-text">{n.text}</div><div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4}}>{n.time}</div></div>
          <span className="alert-card-action">Dismiss</span>
        </div>
      ))}
    </div>
  </div>
);
