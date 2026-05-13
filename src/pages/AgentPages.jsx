import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Search, Plus, Download, Upload, X, Filter, User, UsersRound, Award, ChevronRight, BellRing } from 'lucide-react';
import { personaOwnerName } from '../data/crmAccess';

const fmt = v => new Intl.NumberFormat('en-EG',{style:'currency',currency:'EGP',maximumFractionDigits:0}).format(v||0);
const today = () => new Date().toISOString().split('T')[0];

// ─────────── Products & Services ───────────
export const AgentProducts = () => {
  const { state, openDrawer, toast, writeAudit } = useApp();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');

  const projects = state.projects.filter(p =>
    p.status==='Published' &&
    (!q || (p.name + ' ' + p.developer + ' ' + p.location).toLowerCase().includes(q.toLowerCase())) &&
    (!type || p.type === type) &&
    (!city || p.location === city)
  );

  const view = (p) => openDrawer({
    title: p.name, subtitle: `${p.developer} · ${p.location}`,
    content: (
      <>
        <div className="detail-grid">
          {[['ID',p.id],['Developer',p.developer],['Location',p.location],['Type',p.type],['Units',p.units],['Available',p.available],['Delivery',p.delivery],['Price From',fmt(p.priceFrom)]].map(([k,v])=>(
            <div key={k}><label>{k}</label><div className="v">{v}</div></div>))}
        </div>
        <div style={{marginTop:18,display:'flex',gap:8,flexWrap:'wrap'}}>
          <button className="btn btn-primary" onClick={()=>{toast(`Project shared via WhatsApp link`,'success'); writeAudit('Project Shared',p.id,'Marketing','via WhatsApp link');}}>Share Link</button>
          <button className="btn btn-outline" onClick={()=>{toast(`Brochure download started`,'info');}}>Download Brochure</button>
        </div>
      </>
    ),
  });

  return (
    <div>
      <h1 className="page-title">Products & Services</h1>
      <p className="page-subtitle" style={{marginBottom:24}}>Browse available developer inventory — projects and compounds</p>
      <div className="filter-bar">
        <div style={{position:'relative',flex:1,maxWidth:340}}>
          <Search size={14} style={{position:'absolute',left:12,top:11,color:'var(--text-tertiary)'}}/>
          <input className="data-search" placeholder="Search projects, developers…" value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:32, width:'100%'}} />
        </div>
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="">All Types</option>{[...new Set(state.projects.map(p=>p.type))].map(t=><option key={t}>{t}</option>)}
        </select>
        <select value={city} onChange={e=>setCity(e.target.value)}>
          <option value="">All Locations</option>{[...new Set(state.projects.map(p=>p.location))].map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {projects.map(p=>(
          <div key={p.id} style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,overflow:'hidden',boxShadow:'var(--card-shadow)',cursor:'pointer'}} onClick={()=>view(p)}>
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
      {projects.length===0 && <Empty message="No projects match your filters." />}
    </div>
  );
};

// ─────────── Performance (own-data only) ───────────
// Per stakeholder review: Performance shows ONLY the signed-in agent's own
// sales metrics — no team, peer, or company aggregates, and no onboarding /
// HR score (those live on the Profile page now). All numbers are derived
// from live CRM state filtered by the agent's ownership.
export const AgentPerformance = () => {
  const { persona, personaKey, state } = useApp();
  const onboardingComplete = persona.onboardingComplete === true;
  const ownerName = personaOwnerName(personaKey);

  // ── Sales analytics — sourced from real CRM state for THIS agent ──
  const myLeads = (state.leads || []).filter(l => l.owner === ownerName);
  const myDeals = (state.deals || []).filter(d => d.owner === ownerName);
  const myTours = (state.tours || []).filter(t => t.agent === ownerName);

  const leadsCount = myLeads.length;
  const toursCompleted = myTours.filter(t => t.status === 'Completed').length;
  const dealsClosed = myDeals.filter(d => d.status === 'Closed Won' || d.stage === 'Standard Collection (10%)' || d.stage === 'Contract Signed & Payment').length;
  const conversion = leadsCount ? Math.round((dealsClosed / leadsCount) * 100) : 0;
  const myActivePipeline = myDeals.filter(d => d.status === 'Active' || d.status === undefined).reduce((s,d) => s + (d.value || 0), 0);
  const revenueRecognised = myDeals.filter(d => d.revenueRecognised).reduce((s,d) => s + ((d.value || 0) * (d.commission || 0) / 100), 0);

  // Average days from lead creation to first deal — own data only.
  const dealsWithLead = myDeals.filter(d => d.created);
  const conversionDays = dealsWithLead.length ? Math.round(dealsWithLead.reduce((sum, d) => {
    const lead = myLeads.find(l => l.name === (d.leadName || d.lead));
    if (!lead || !lead.created) return sum;
    return sum + Math.max(0, Math.ceil((new Date(d.created) - new Date(lead.created)) / 86_400_000));
  }, 0) / dealsWithLead.length) : 0;

  // ── Personal targets ──────────────────────────────────────────────
  const myTarget = state.targets?.[personaKey];
  const targetProgress = myTarget ? [
    { key:'leads',    label:'Leads',          actual: leadsCount,      target: myTarget.leadsTarget },
    { key:'deals',    label:'Deals',          actual: myDeals.length,  target: myTarget.dealsTarget },
    { key:'pipeline', label:'Pipeline value', actual: myActivePipeline, target: myTarget.pipelineTarget, fmt: v => `EGP ${(v/1e6).toFixed(1)}M`, targetFmt: v => `EGP ${(v/1e6).toFixed(0)}M` },
    { key:'closed',   label:'Closed Won',     actual: dealsClosed,     target: myTarget.closedWonTarget },
  ].map(t => ({ ...t, pct: Math.min(100, Math.round((Number(t.actual) / Math.max(1, t.target)) * 100)) })) : null;

  return (
    <div>
      <h1 className="page-title">Performance</h1>
      <p className="page-subtitle" style={{marginBottom:24}}>{persona.label}'s own sales metrics and target progress. No team or company aggregates. Onboarding & HR score live on your Profile.</p>

      <h3 style={{fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--text-secondary)',marginBottom:12}}>My Sales Analytics</h3>
      <div className="kpi-grid kpi-grid-4" style={{marginBottom:16}}>
        <div className="kpi-card"><div><div className="kpi-label">My Leads</div><div className="kpi-value">{leadsCount}</div><div className="kpi-change">owned by you</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📋</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Tours Completed</div><div className="kpi-value">{toursCompleted}</div><div className="kpi-change">{myTours.length} scheduled</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>🏠</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Deals Closed</div><div className="kpi-value">{dealsClosed}</div><div className="kpi-change">{myDeals.length} total</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💼</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Conversion Rate</div><div className="kpi-value">{conversion}%</div><div className="kpi-change">deals / leads</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>📈</span></div></div>
      </div>
      <div className="kpi-grid kpi-grid-3" style={{marginBottom:24}}>
        <div className="kpi-card"><div><div className="kpi-label">Active Pipeline</div><div className="kpi-value" style={{fontSize:20}}>EGP {(myActivePipeline/1e6).toFixed(1)}M</div><div className="kpi-change">deals in flight</div></div><div className="kpi-icon orange"><span style={{fontSize:20}}>📊</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Revenue Recognised</div><div className="kpi-value" style={{fontSize:20}}>EGP {revenueRecognised.toLocaleString()}</div><div className="kpi-change">commission released</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💰</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Avg Conversion Time</div><div className="kpi-value" style={{fontSize:20}}>{conversionDays || '—'}{conversionDays ? ' d' : ''}</div><div className="kpi-change">lead → deal</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>⏱️</span></div></div>
      </div>

      {targetProgress && (
        <>
          <h3 style={{fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--text-secondary)',marginBottom:12}}>My Target Progress · {myTarget.period}</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
            {targetProgress.map(t => (
              <div key={t.key} style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,padding:'14px 16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>{t.label}</span>
                  <span style={{fontSize:11,fontWeight:800,color: t.pct >= 100 ? '#16a34a' : t.pct >= 60 ? 'var(--brand)' : '#f59e0b'}}>{t.pct}%</span>
                </div>
                <div style={{fontSize:18,fontWeight:800,color:'var(--text-primary)'}}>{t.fmt ? t.fmt(t.actual) : t.actual}</div>
                <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>of {t.targetFmt ? t.targetFmt(t.target) : t.target}</div>
                <div style={{height:5,background:'#f1f5f9',borderRadius:3,overflow:'hidden',marginTop:10}}>
                  <div style={{width:`${t.pct}%`,height:'100%',background: t.pct >= 100 ? '#16a34a' : t.pct >= 60 ? 'var(--brand)' : '#f59e0b',transition:'width .4s'}}/>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!onboardingComplete && <div className="info-banner" style={{marginTop:16}}>Sales analytics populate once your onboarding is complete and CRM access is provisioned. Onboarding score is already final.</div>}
    </div>
  );
};

// ─────────── Profile ───────────
// ─────────── Profile (premium layout · personal + HR + team + scoring) ───────────
// 11-May stakeholder ask: scoring moves from Performance into Profile, and
// Profile shows richer employee data. Strictly non-financial — no salary,
// no commission rate, no payout info.
export const AgentProfile = () => {
  const { persona, personaKey, state, openModal, toast } = useApp();
  const staff = (state.staff || []).find(s => s.name === persona.label) || {};

  const personal = {
    name: persona.label,
    email: persona.email,
    phone: staff.phone || '+20 100 123 4567',
    branch: staff.branch || (persona.scope?.includes('6th October') ? '6th October' : 'New Cairo'),
    dob: personaKey === 'agentActive' ? '1992-08-14' : personaKey === 'teamLeader' ? '1985-03-22' : '1995-11-05',
    nationality: 'Egyptian',
    maritalStatus: personaKey === 'teamLeader' ? 'Married · 2 children' : personaKey === 'agentActive' ? 'Married' : 'Single',
    languages: 'Arabic (native), English (fluent)',
    nationalId: personaKey === 'agentActive' ? '29208140101234' : personaKey === 'teamLeader' ? '28503220101567' : '29511050101890',
    address: `${staff.branch || 'New Cairo'}, Cairo Governorate`,
  };

  const hr = {
    employeeId: staff.id || (personaKey === 'agent' ? 'A009' : personaKey === 'agentActive' ? 'A002' : 'A008'),
    department: staff.department || 'Sales',
    title: persona.role || staff.title || 'Licensed Agent',
    type: staff.type || 'Employee',
    joinDate: staff.joinDate || '2024-01-01',
    employmentStatus: staff.status || 'Active',
    contractType: 'Permanent · Full-time',
    contractEnds: '2026-12-31',
    workSchedule: 'Sun–Thu · 09:00 — 17:00',
    nextReview: '2026-07-15',
    education: personaKey === 'teamLeader' ? 'BSc Civil Engineering, Cairo University' : personaKey === 'agentActive' ? 'BA Marketing, AUC' : 'BBA Business Admin, GUC',
    rera: persona.mls ? `RERA-${persona.mls.split('-')[1]}` : 'Pending registration',
  };

  const teamLabel = personaKey === 'teamLeader' ? 'Alpha (Lead)' : 'Alpha';
  const tlName = personaKey === 'teamLeader' ? '— (you are the TL)' : 'Omar Sherif';
  const teamMembers = (state.staff || []).filter(s => s.manager === 'Omar Sherif' || s.name === 'Omar Sherif');
  const team = {
    team: teamLabel,
    teamLeader: tlName,
    salesManager: 'Nour El-Din',
    salesDirector: 'Tarek Amin',
    branch: personal.branch,
    headcount: teamMembers.length || 4,
  };

  const emergency = {
    name: personaKey === 'agentActive' ? 'Mahmoud Ibrahim' : personaKey === 'teamLeader' ? 'Heba Sherif' : 'Mona El-Masry',
    relation: personaKey === 'agentActive' ? 'Spouse' : personaKey === 'teamLeader' ? 'Spouse' : 'Mother',
    phone: '+20 100 888 ' + (personaKey === 'agentActive' ? '4422' : personaKey === 'teamLeader' ? '5533' : '6644'),
  };

  // Onboarding score — moved here from Performance per 11-May stakeholder ask.
  const onboardingComplete = persona.onboardingComplete === true;
  const trainingCompleted = state.training.filter(c=>c.required && c.status==='Completed').length;
  const trainingTotal = state.training.filter(c=>c.required).length;
  const trainingAvg = Math.round(
    state.training.filter(c=>c.required && c.score).reduce((s,c)=>s+c.score,0)
    / Math.max(1, state.training.filter(c=>c.required && c.score).length)
  );
  const interviewScore = onboardingComplete ? 88 : 82;
  const agentScore = Math.round(trainingAvg * 0.6 + interviewScore * 0.4);

  const editProfile = () => openModal({
    title:'Edit Profile', submitLabel:'Save changes',
    body:(
      <>
        <FieldRow>
          <Field label="Full Name" name="name" defaultValue={personal.name} required />
          <Field label="Email" name="email" type="email" defaultValue={personal.email} required />
        </FieldRow>
        <FieldRow>
          <Field label="Phone" name="phone" defaultValue={personal.phone} />
          <Field label="Branch" name="branch" defaultValue={personal.branch} />
        </FieldRow>
        <FieldRow>
          <Field label="Address" name="address" defaultValue={personal.address} />
          <Field label="Languages" name="languages" defaultValue={personal.languages} />
        </FieldRow>
      </>
    ),
    onSubmit:()=>{ toast('Profile saved'); },
  });

  // ── Reusable section card ──
  const Section = ({ title, icon, accent='var(--brand)', children }) => (
    <div style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:14,padding:'18px 22px',boxShadow:'0 1px 2px rgba(15,23,42,.04)'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14,paddingBottom:10,borderBottom:'1px solid var(--border)'}}>
        <div style={{width:28,height:28,borderRadius:8,background:`${accent}1a`,color:accent,display:'flex',alignItems:'center',justifyContent:'center'}}>{icon}</div>
        <h3 style={{fontSize:13,fontWeight:800,color:'var(--text-primary)',textTransform:'uppercase',letterSpacing:'.06em'}}>{title}</h3>
      </div>
      {children}
    </div>
  );
  const Field2 = ({ label, value, mono }) => (
    <div>
      <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:4}}>{label}</div>
      <div style={{fontWeight:500,fontSize:13,color:'var(--text-primary)',fontFamily: mono ? 'monospace' : 'inherit'}}>{value || '—'}</div>
    </div>
  );

  const initials = persona.label.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  const scoreColor = agentScore >= 85 ? '#16a34a' : agentScore >= 70 ? '#E8672A' : '#f59e0b';

  return (
    <div>
      {/* ── Hero card · gradient + avatar + role chips ── */}
      <div style={{
        background:'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#312e81 100%)',
        borderRadius:18, padding:'28px 32px', marginBottom:24, color:'#fff',
        position:'relative', overflow:'hidden',
        boxShadow:'0 16px 40px rgba(15,23,42,.2)',
      }}>
        <div style={{position:'absolute',right:-80,top:-80,width:320,height:320,borderRadius:'50%',background:'radial-gradient(circle,rgba(232,103,42,.22),rgba(232,103,42,0))'}}/>
        <div style={{position:'absolute',left:-40,bottom:-60,width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,.18),rgba(99,102,241,0))'}}/>

        <div style={{display:'flex',alignItems:'center',gap:22,position:'relative',flexWrap:'wrap'}}>
          {/* Avatar */}
          <div style={{
            width:84, height:84, borderRadius:22, flexShrink:0,
            background:'linear-gradient(135deg,#E8672A,#F89357)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontWeight:800, fontSize:30, color:'#fff',
            boxShadow:'0 10px 24px rgba(232,103,42,.4)',
            border:'3px solid rgba(255,255,255,.12)',
            position:'relative',
          }}>
            {initials}
            <span style={{position:'absolute',bottom:-2,right:-2,width:20,height:20,borderRadius:'50%',background: hr.employmentStatus === 'Active' ? '#10b981' : '#f59e0b',border:'3px solid #1e293b'}}/>
          </div>

          {/* Identity */}
          <div style={{flex:1,minWidth:240}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.55)',fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase'}}>Employee Profile</div>
            <h1 style={{fontSize:28,fontWeight:800,color:'#fff',margin:0,marginTop:4,lineHeight:1.15}}>{personal.name}</h1>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10,alignItems:'center'}}>
              <span style={{padding:'4px 10px',background:'rgba(255,255,255,.12)',borderRadius:999,fontSize:11,fontWeight:600}}>{hr.title}</span>
              <span style={{padding:'4px 10px',background:'rgba(232,103,42,.18)',borderRadius:999,fontSize:11,fontWeight:600,color:'#FBBF24'}}>{hr.department} · {team.team}</span>
              <span style={{padding:'4px 10px',background:'rgba(255,255,255,.08)',borderRadius:999,fontSize:11,fontWeight:600,color:'rgba(255,255,255,.85)'}}>📍 {personal.branch}</span>
              {persona.mls && persona.mls !== 'Pending' && (
                <span style={{padding:'4px 10px',background:'rgba(255,255,255,.08)',borderRadius:999,fontSize:11,fontWeight:600,fontFamily:'monospace',color:'rgba(255,255,255,.85)'}}>MLS {persona.mls}</span>
              )}
              <span style={{padding:'4px 10px',background: hr.employmentStatus === 'Active' ? 'rgba(16,185,129,.2)' : 'rgba(245,158,11,.2)',color: hr.employmentStatus === 'Active' ? '#86efac' : '#fbbf24',borderRadius:999,fontSize:11,fontWeight:700}}>● {hr.employmentStatus}</span>
            </div>
            <div style={{display:'flex',gap:18,marginTop:14,fontSize:12,color:'rgba(255,255,255,.7)',flexWrap:'wrap'}}>
              <span style={{display:'flex',alignItems:'center',gap:6}}>📧 {personal.email}</span>
              <span style={{display:'flex',alignItems:'center',gap:6}}>📱 {personal.phone}</span>
              <span style={{display:'flex',alignItems:'center',gap:6}}>🆔 {hr.employeeId}</span>
              <span style={{display:'flex',alignItems:'center',gap:6}}>📅 Joined {hr.joinDate}</span>
            </div>
          </div>

          {/* Score chip */}
          <div style={{textAlign:'center',padding:'14px 22px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',borderRadius:14,minWidth:130,position:'relative'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.08em',color:'rgba(255,255,255,.55)',textTransform:'uppercase'}}>Onboarding Score</div>
            <div style={{fontSize:32,fontWeight:800,marginTop:4,color: scoreColor === '#16a34a' ? '#86efac' : scoreColor === '#E8672A' ? '#FBBF24' : '#fde68a'}}>{agentScore}<span style={{fontSize:14,fontWeight:600,opacity:.6}}>/100</span></div>
            <div style={{fontSize:10,color:'rgba(255,255,255,.55)',marginTop:2}}>Training {trainingAvg}% · Interview {interviewScore}%</div>
          </div>

          <button onClick={editProfile} style={{padding:'9px 18px',background:'#fff',color:'#0f172a',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>Edit Profile</button>
        </div>
      </div>

      {/* ── Onboarding & Performance Score card ── */}
      <Section title="Onboarding & HR Score" icon={<Award size={14}/>} accent="#8b5cf6">
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
          {[
            { label:'Total Score',     value:`${agentScore}/100`, sub:'Used for team allocation', color: scoreColor },
            { label:'Training Avg',    value:`${trainingAvg}%`,   sub:`${trainingCompleted}/${trainingTotal} required courses`, color:'#3b82f6' },
            { label:'Interview Score', value:`${interviewScore}%`,sub:'HR-recorded',            color:'#16a34a' },
            { label:'Weight',          value:'60% / 40%',          sub:'Training / Interview',   color:'#94a3b8' },
          ].map(s => (
            <div key={s.label} style={{padding:'14px 16px',background:'#fafbfc',borderRadius:10,border:'1px solid var(--border)'}}>
              <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>{s.label}</div>
              <div style={{fontSize:22,fontWeight:800,color:s.color,marginTop:4}}>{s.value}</div>
              <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:4}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </Section>

      <div style={{height:18}}/>

      {/* ── Personal + Employment (2-col) ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:18}}>
        <Section title="Personal Information" icon={<User size={14}/>} accent="#3b82f6">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field2 label="Full Name"      value={personal.name}/>
            <Field2 label="Email"          value={personal.email}/>
            <Field2 label="Phone"          value={personal.phone}/>
            <Field2 label="National ID"    value={personal.nationalId} mono/>
            <Field2 label="Date of Birth"  value={personal.dob}/>
            <Field2 label="Nationality"    value={personal.nationality}/>
            <Field2 label="Marital Status" value={personal.maritalStatus}/>
            <Field2 label="Languages"      value={personal.languages}/>
            <Field2 label="Address"        value={personal.address}/>
            <Field2 label="Education"      value={hr.education}/>
          </div>
        </Section>

        <Section title="Employment & HR" icon={<UsersRound size={14}/>} accent="#10b981">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field2 label="Employee ID"   value={hr.employeeId} mono/>
            <Field2 label="Department"    value={hr.department}/>
            <Field2 label="Job Title"     value={hr.title}/>
            <Field2 label="Branch"        value={personal.branch}/>
            <Field2 label="Contract Type" value={hr.contractType}/>
            <Field2 label="Employment Type" value={hr.type}/>
            <Field2 label="Work Schedule" value={hr.workSchedule}/>
            <Field2 label="Status"        value={hr.employmentStatus}/>
            <Field2 label="Join Date"     value={hr.joinDate}/>
            <Field2 label="Contract Ends" value={hr.contractEnds}/>
            <Field2 label="Next Review"   value={hr.nextReview}/>
            <Field2 label="RERA"          value={hr.rera} mono/>
          </div>
        </Section>
      </div>

      {/* ── Team + Hierarchy (2-col) ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:18}}>
        <Section title="Team Data" icon={<UsersRound size={14}/>} accent="#E8672A">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Field2 label="Team"          value={team.team}/>
            <Field2 label="Branch"        value={team.branch}/>
            <Field2 label="Headcount"     value={String(team.headcount)}/>
            <Field2 label="Team Leader"   value={team.teamLeader}/>
          </div>
        </Section>

        <Section title="Reporting Hierarchy" icon={<ChevronRight size={14}/>} accent="#8b5cf6">
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              { role:'Sales Director', name: team.salesDirector,  level: 0 },
              { role:'Sales Manager',  name: team.salesManager,   level: 1 },
              { role:'Team Leader',    name: team.teamLeader,     level: 2 },
              { role:'You',            name: persona.label,        level: 3, self: true },
            ].map((r,i,arr) => (
              <div key={r.role} style={{display:'flex',alignItems:'center',gap:12,paddingLeft: r.level * 14}}>
                <div style={{width:8,height:8,borderRadius:4,background: r.self ? 'var(--brand)' : '#cbd5e1',flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>{r.role}</div>
                  <div style={{fontSize:13,fontWeight: r.self ? 800 : 500,color: r.self ? 'var(--brand)' : 'var(--text-primary)'}}>{r.name}</div>
                </div>
                {i < arr.length - 1 && <ChevronRight size={14} color="var(--text-tertiary)"/>}
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── Emergency Contact ── */}
      <Section title="Emergency Contact" icon={<BellRing size={14}/>} accent="#dc2626">
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          <Field2 label="Name"     value={emergency.name}/>
          <Field2 label="Relation" value={emergency.relation}/>
          <Field2 label="Phone"    value={emergency.phone}/>
        </div>
      </Section>
    </div>
  );
};

// ─────────── Documents (agent self-service) ───────────
export const AgentDocuments = () => {
  const { state, updateItem, openModal, toast, writeAudit } = useApp();

  const upload = (d) => openModal({
    title: `Upload — ${d.doc}`, subtitle: 'Accepted: PDF, JPG, PNG · Max 10MB',
    submitLabel: 'Upload',
    body: (
      <>
        <Field label="File">
          <div style={{padding:24,border:'2px dashed var(--border)',borderRadius:8,textAlign:'center',background:'#fafbfc',color:'var(--text-secondary)'}}>
            <Upload size={20} /> <div style={{marginTop:6,fontSize:12}}>Drag & drop or click to select<br/><span style={{fontSize:10,color:'var(--text-tertiary)'}}>(simulation — file is not actually uploaded)</span></div>
          </div>
        </Field>
        <Field label="Notes" name="notes" type="textarea" placeholder="Optional notes for backoffice review…" />
      </>
    ),
    onSubmit: () => {
      updateItem('agentDocs', d.id, { status: 'Pending', date: today() }, { action: 'Document Uploaded', module: 'Agent Self-Service', target: d.id });
      toast(`${d.doc} uploaded — pending backoffice review`);
    },
  });

  return (
    <div>
      <h1 className="page-title">Documents</h1>
      <p className="page-subtitle" style={{marginBottom:24}}>Upload and manage your required documents</p>
      <div className="kpi-grid kpi-grid-4" style={{marginBottom:24}}>
        <div className="kpi-card"><div><div className="kpi-label">Approved</div><div className="kpi-value">{state.agentDocs.filter(d=>d.status==='Approved').length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pending</div><div className="kpi-value">{state.agentDocs.filter(d=>d.status==='Pending').length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Expiring (≤30d)</div><div className="kpi-value">{state.agentDocs.filter(d=>{if(!d.expires) return false; const days=Math.ceil((new Date(d.expires)-new Date())/86_400_000); return days>=0 && days<30;}).length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏰</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Total Required</div><div className="kpi-value">{state.agentDocs.length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📄</span></div></div>
      </div>
      <div className="data-panel">
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>Document</th><th>Type</th><th>Status</th><th>Upload Date</th><th>Expires</th><th style={{textAlign:'right'}}>Action</th></tr></thead>
            <tbody>
              {state.agentDocs.map(d => {
                let expLabel = '—', expColor = 'var(--text-tertiary)', expWeight = 400;
                if (d.expires) {
                  const days = Math.ceil((new Date(d.expires) - new Date()) / 86_400_000);
                  if (days < 0)       { expLabel = `${d.expires} · expired`; expColor = 'var(--danger)';  expWeight = 600; }
                  else if (days < 30) { expLabel = `${d.expires} · in ${days}d`; expColor = 'var(--warning)'; expWeight = 600; }
                  else                { expLabel = d.expires; expColor = 'var(--text-primary)'; }
                }
                return (
                  <tr key={d.id}>
                    <td className="bold">{d.doc}</td>
                    <td>{d.type}</td>
                    <td><span className={`badge ${d.status==='Approved'?'badge-success':'badge-warning'}`}>{d.status}</span></td>
                    <td className="muted">{d.date}</td>
                    <td style={{color: expColor, fontWeight: expWeight}}>{expLabel}</td>
                    <td style={{textAlign:'right'}}>{d.status==='Pending' && <button className="btn btn-primary btn-sm" onClick={()=>upload(d)}><Upload size={13}/> Upload</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 32 }}>Request Information Update</button>
      </div>
    </div>
  );
};

// ─────────── Notifications (Employee Board — non-CRM feeds only) ───────────
// 11-May stakeholder ask: the Employee Board notifications drawer must NOT
// surface CRM-related events (tasks, lead reassignments, override approvals)
// — those live inside the CRM module. Employee Board keeps Documents / HR /
// Department / New Feature / Training / System Alert categories.
const CRM_CATEGORIES = new Set(['task','lead','approval']);
const CAT_META = {
  document:   { label: 'Documents',      icon: '📄', tint: '#fef3c7',            color: '#92400e' },
  hr:         { label: 'HR',             icon: '🧑‍💼', tint: '#dbeafe',            color: '#1e40af' },
  department: { label: 'Department',     icon: '🏢', tint: '#e0f2fe',            color: '#075985' },
  feature:    { label: 'New Features',   icon: '✨', tint: '#dcfce7',            color: '#166534' },
  training:   { label: 'Training',       icon: '🎓', tint: 'var(--warning-bg)',  color: 'var(--warning)' },
  system:     { label: 'System Alerts',  icon: '🛡️', tint: '#f3f4f6',            color: 'var(--text-secondary)' },
};
// Categorize each notification — fall back to keyword sniffing if not provided.
const categorize = (n) => {
  if (n.category) return n.category;
  const t = (n.text || '').toLowerCase();
  if (t.includes('expires') || t.includes('document') || t.includes('upload')) return 'document';
  if (t.includes('overdue') || t.includes('task')      || t.includes('due'))    return 'task';
  if (t.includes('approve') || t.includes('approval')  || t.includes('override')) return 'approval';
  if (t.includes('lead')    || t.includes('deal')      || t.includes('reassign')) return 'lead';
  if (t.includes('review')  || t.includes('salary')    || t.includes('leave'))   return 'hr';
  if (t.includes('meeting') || t.includes('briefing')  || t.includes('working hours') || t.includes('launch')) return 'department';
  if (t.includes('new ·')   || t.includes('update ·')) return 'feature';
  if (t.includes('training')) return 'training';
  return 'system';
};

export const AgentNotifications = () => {
  const { state, removeItem, toast } = useApp();
  const [activeCat, setActiveCat] = useState('all');

  const dismiss = (n) => { removeItem('agentNotifications', n.id, { action: 'Notification Dismissed', module: 'Agent', target: n.id }); toast('Notification dismissed','info'); };
  const dismissAll = () => { state.agentNotifications.forEach(n => removeItem('agentNotifications', n.id)); toast('All notifications cleared','info'); };

  // 11-May ask: CRM-related notifications (tasks / leads / approvals) are
  // suppressed on the Employee Board — they belong inside the CRM module.
  const merged = state.agentNotifications
    .map(n => ({ ...n, category: categorize(n) }))
    .filter(n => !CRM_CATEGORIES.has(n.category));

  const counts = merged.reduce((a,n)=>{a[n.category]=(a[n.category]||0)+1; return a;},{});
  const filtered = activeCat === 'all' ? merged : merged.filter(n=>n.category===activeCat);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Tasks · Leads · Approvals · Documents · HR · Department · New Features</p>
        </div>
        {state.agentNotifications.length > 0 && <button className="btn btn-outline btn-sm" onClick={dismissAll}>Clear All</button>}
      </div>

      <div className="tabs" style={{marginBottom:18}}>
        <button className={`tab ${activeCat==='all'?'active':''}`} onClick={()=>setActiveCat('all')}>All ({merged.length})</button>
        {Object.entries(CAT_META).map(([k,m])=>(
          <button key={k} className={`tab ${activeCat===k?'active':''}`} onClick={()=>setActiveCat(k)}>{m.icon} {m.label} ({counts[k]||0})</button>
        ))}
      </div>

      {filtered.length === 0 && <div className="empty-state">No notifications in this category.</div>}
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {filtered.map(n=>{
          const meta = CAT_META[n.category];
          return (
            <div key={n.id} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:10,padding:'14px 16px',display:'flex',gap:12,alignItems:'flex-start',borderLeft:`4px solid ${meta.color}`}}>
              <div style={{width:32,height:32,borderRadius:8,background:meta.tint,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:14}}>{meta.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'flex-start'}}>
                  <div style={{fontSize:11,fontWeight:800,color:meta.color,textTransform:'uppercase',letterSpacing:'.06em'}}>{meta.label}</div>
                  <span style={{fontSize:11,color:'var(--text-tertiary)'}}>{n.time}</span>
                </div>
                <div style={{fontSize:13.5,color:'var(--text-primary)',marginTop:4}}>{n.text}</div>
                <div style={{marginTop:8,display:'flex',gap:8}}>
                  {n.category === 'approval' && <button className="btn btn-primary btn-sm" onClick={()=>{toast('Approval recorded','success'); !n.id.startsWith('syn-') && dismiss(n);}}>Approve</button>}
                  {n.category === 'task' && <button className="btn btn-outline btn-sm" onClick={()=>{toast('Task acknowledged','info');}}>Acknowledge</button>}
                  {!n.id.startsWith('syn-') && <button className="btn btn-outline btn-sm" onClick={()=>dismiss(n)}><X size={12}/> Dismiss</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────── Help & Support ───────────
export const AgentHelp = () => {
  const { state, addItem, openModal, toast } = useApp();
  const [openFaq, setOpenFaq] = useState(null);

  const newTicket = () => openModal({
    title: 'New Support Ticket', submitLabel: 'Submit ticket',
    body: (
      <>
        <FieldRow>
          <Field label="Subject" name="subject" required />
          <Field label="Category" name="category" type="select" required options={['Operations','IT Support','Finance','HR','Other']} />
        </FieldRow>
        <Field label="Priority" name="priority" type="select" required options={['Low','Medium','High']} defaultValue="Medium" />
        <Field label="Description" name="desc" type="textarea" rows={4} placeholder="Describe the issue…" required />
      </>
    ),
    onSubmit: (data) => {
      const c = addItem('supportTickets', { ...data, status: 'Open', created: today() }, 'TKT', { action: 'Ticket Opened', module: 'Support', detail: data.subject });
      toast(`Ticket ${c.id} opened`);
    },
  });

  const faqs = [
    { q: 'How do I request CRM access?', a: 'CRM access is automatically granted once all required training courses are completed and your background check is approved by HR.' },
    { q: 'When are commissions paid?', a: 'Commissions are processed in two cycles: the 10th and 25th of each month, provided the developer has cleared the payment.' },
    { q: 'Who do I contact for MLS ID issues?', a: 'Please open a support ticket from this page and route it to the "Operations" department.' },
    { q: 'How do I update my bank details?', a: 'Go to Profile → Edit Profile → Bank Details. Updates require HR approval before taking effect on your next payout.' },
  ];

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div>
          <h1 className="page-title">Help & Support</h1>
          <p className="page-subtitle">FAQs, onboarding guides, and ticket management</p>
        </div>
        <button className="btn btn-primary" onClick={newTicket}><Plus size={14}/> New Ticket</button>
      </div>
      <div className="kpi-grid kpi-grid-3" style={{marginBottom:24}}>
        <div className="kpi-card"><div><div className="kpi-label">Open Tickets</div><div className="kpi-value">{state.supportTickets.filter(t=>t.status==='Open').length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>🎫</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Resolved Tickets</div><div className="kpi-value">{state.supportTickets.filter(t=>t.status==='Resolved').length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Avg Response Time</div><div className="kpi-value">2h</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>⏱️</span></div></div>
      </div>

      <h3 style={{fontSize:15,fontWeight:700,marginBottom:12}}>My Tickets</h3>
      <div className="data-panel" style={{marginBottom:24}}>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Subject</th><th>Category</th><th>Priority</th><th>Created</th><th>Status</th></tr></thead>
            <tbody>{state.supportTickets.map(t=>(
              <tr key={t.id}>
                <td className="muted">{t.id}</td>
                <td className="bold">{t.subject}</td>
                <td>{t.category}</td>
                <td><span className={`badge ${t.priority==='High'?'badge-danger':t.priority==='Medium'?'badge-warning':'badge-info'}`}>{t.priority}</span></td>
                <td className="muted">{t.created}</td>
                <td><span className={`badge ${t.status==='Open'?'badge-warning':'badge-success'}`}>{t.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      <h3 style={{fontSize:15,fontWeight:700,marginBottom:12}}>Frequently Asked Questions</h3>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {faqs.map((f,i) => (
          <div key={i} style={{padding:'14px 18px',background:'#fff',border:'1px solid var(--border)',borderRadius:8,cursor:'pointer'}} onClick={()=>setOpenFaq(openFaq === i ? null : i)}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontWeight:600,fontSize:13.5}}>{f.q}</div>
              <span style={{fontSize:18,color:'var(--text-tertiary)'}}>{openFaq===i ? '−' : '+'}</span>
            </div>
            {openFaq===i && <div style={{marginTop:10,fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
