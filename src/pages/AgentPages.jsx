import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Search, Plus, Download, Upload, X, Filter } from 'lucide-react';

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

// ─────────── Performance (Platform §2.3 score + §3.9 analytics) ───────────
export const AgentPerformance = () => {
  const { persona, state } = useApp();
  const onboardingComplete = persona.onboardingComplete === true;
  const completed = state.training.filter(c=>c.required && c.status==='Completed').length;
  const total = state.training.filter(c=>c.required).length;
  const trainingAvg = Math.round(
    state.training.filter(c=>c.required && c.score).reduce((s,c)=>s+c.score,0)
    / Math.max(1, state.training.filter(c=>c.required && c.score).length)
  );
  const interviewScore = onboardingComplete ? 88 : 82;
  const agentScore = Math.round(trainingAvg * 0.6 + interviewScore * 0.4);

  // §3.9 Analytics — populated only after onboarding/CRM access.
  const leads = onboardingComplete ? 18 : 0;
  const tours = onboardingComplete ? 7 : 0;
  const deals = onboardingComplete ? 3 : 0;
  const revenue = onboardingComplete ? 285000 : 0;
  const conversionTime = onboardingComplete ? '21 days' : '—';
  const costPerLead = onboardingComplete ? 'EGP 420' : '—';
  const conversion = leads ? Math.round((deals/leads)*100) : 0;

  return (
    <div>
      <h1 className="page-title">Performance</h1>
      <p className="page-subtitle" style={{marginBottom:24}}>Onboarding score + sales analytics — Platform §2.3, §3.9</p>

      <h3 style={{fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--text-secondary)',marginBottom:12}}>Onboarding Score (Platform §2.3)</h3>
      <div className="kpi-grid kpi-grid-4" style={{marginBottom:24}}>
        <div className="kpi-card"><div><div className="kpi-label">Total Score</div><div className="kpi-value" style={{color:agentScore>=85?'var(--success)':'var(--warning)'}}>{agentScore}/100</div><div className="kpi-change up">Used for team allocation</div></div><div className="kpi-icon orange"><span style={{fontSize:20}}>🏆</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Training Avg</div><div className="kpi-value">{trainingAvg}%</div><div className="kpi-change">{completed}/{total} required courses</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>🎓</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Interview Score</div><div className="kpi-value">{interviewScore}%</div><div className="kpi-change">HR-recorded</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>👤</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Score Weight</div><div className="kpi-value" style={{fontSize:18}}>60% / 40%</div><div className="kpi-change">Training / Interview</div></div><div className="kpi-icon gray"><span style={{fontSize:20}}>⚖️</span></div></div>
      </div>

      <h3 style={{fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--text-secondary)',marginBottom:12}}>Sales Analytics (Platform §3.9)</h3>
      <div className="kpi-grid kpi-grid-4" style={{marginBottom:16}}>
        <div className="kpi-card"><div><div className="kpi-label">Number of Leads</div><div className="kpi-value">{leads}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📋</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Tours Completed</div><div className="kpi-value">{tours}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>🏠</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Deals Closed</div><div className="kpi-value">{deals}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💼</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Conversion Rate</div><div className="kpi-value">{conversion}%</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>📈</span></div></div>
      </div>
      <div className="kpi-grid kpi-grid-3">
        <div className="kpi-card"><div><div className="kpi-label">Revenue Generated</div><div className="kpi-value" style={{fontSize:20}}>EGP {revenue.toLocaleString()}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💰</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Conversion Time</div><div className="kpi-value" style={{fontSize:20}}>{conversionTime}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>⏱️</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Cost per Lead</div><div className="kpi-value" style={{fontSize:20}}>{costPerLead}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>📊</span></div></div>
      </div>
      {!onboardingComplete && <div className="info-banner" style={{marginTop:16}}>Sales analytics populate once your onboarding is complete and CRM access is provisioned. Onboarding score is already final.</div>}
    </div>
  );
};

// ─────────── Profile ───────────
export const AgentProfile = () => {
  const { persona, openModal, toast } = useApp();
  const editProfile = () => openModal({
    title:'Edit Profile', submitLabel:'Save changes',
    body:(
      <>
        <FieldRow>
          <Field label="Full Name" name="name" defaultValue="Sarah El-Masry" required />
          <Field label="Email" name="email" type="email" defaultValue="sarah@homesbrokerage.eg" required />
        </FieldRow>
        <FieldRow>
          <Field label="Phone" name="phone" defaultValue="+20 100 123 4567" />
          <Field label="Branch" name="branch" defaultValue="New Cairo" />
        </FieldRow>
      </>
    ),
    onSubmit:(d)=>{ toast('Profile saved'); },
  });
  return (
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
          <button className="btn btn-primary btn-sm" style={{marginTop:14}} onClick={editProfile}>Edit Profile</button>
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
      <div className="kpi-grid kpi-grid-3" style={{marginBottom:24}}>
        <div className="kpi-card"><div><div className="kpi-label">Approved</div><div className="kpi-value">{state.agentDocs.filter(d=>d.status==='Approved').length}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pending</div><div className="kpi-value">{state.agentDocs.filter(d=>d.status==='Pending').length}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Total Required</div><div className="kpi-value">{state.agentDocs.length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📄</span></div></div>
      </div>
      <div className="data-panel">
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr><th>Document</th><th>Type</th><th>Status</th><th>Upload Date</th><th style={{textAlign:'right'}}>Action</th></tr></thead>
            <tbody>
              {state.agentDocs.map(d => (
                <tr key={d.id}>
                  <td className="bold">{d.doc}</td>
                  <td>{d.type}</td>
                  <td><span className={`badge ${d.status==='Approved'?'badge-success':'badge-warning'}`}>{d.status}</span></td>
                  <td className="muted">{d.date}</td>
                  <td style={{textAlign:'right'}}>{d.status==='Pending' && <button className="btn btn-primary btn-sm" onClick={()=>upload(d)}><Upload size={13}/> Upload</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─────────── Notifications (Platform §3.10 — categorized panel) ───────────
// Categories: Tasks · Lead updates · System alerts · Approval requests
// Meeting (line 31): "Notifications will include over due tasks and needed updates"
const CAT_META = {
  task:     { label: 'Tasks',             icon: '📋', tint: 'var(--warning-bg)',  color: 'var(--warning)' },
  lead:     { label: 'Lead Updates',      icon: '🎯', tint: 'var(--info-bg)',     color: 'var(--info)' },
  system:   { label: 'System Alerts',     icon: '🛡️', tint: '#f3f4f6',            color: 'var(--text-secondary)' },
  approval: { label: 'Approval Requests', icon: '✋', tint: 'var(--brand-tint)',   color: 'var(--brand)' },
};
// Categorize each notification — fall back to 'system' if not provided.
const categorize = (n) => {
  if (n.category) return n.category;
  const t = (n.text || '').toLowerCase();
  if (t.includes('overdue') || t.includes('task') || t.includes('due')) return 'task';
  if (t.includes('lead') || t.includes('deal') || t.includes('reassign')) return 'lead';
  if (t.includes('approve') || t.includes('approval') || t.includes('override')) return 'approval';
  return 'system';
};

export const AgentNotifications = () => {
  const { state, removeItem, toast } = useApp();
  const [activeCat, setActiveCat] = useState('all');

  const dismiss = (n) => { removeItem('agentNotifications', n.id, { action: 'Notification Dismissed', module: 'Agent', target: n.id }); toast('Notification dismissed','info'); };
  const dismissAll = () => { state.agentNotifications.forEach(n => removeItem('agentNotifications', n.id)); toast('All notifications cleared','info'); };

  // Demo: synthesize a couple of overdue/approval entries on top of the persisted ones to illustrate categories.
  const synthesized = [
    { id: 'syn-overdue', category: 'task', text: 'Task overdue: Follow up with Mohamed Hassan (L-1001)', time: '15 min ago', type: 'warning' },
    { id: 'syn-deal',    category: 'lead', text: 'Deal D-503 closed — commission queued for finance', time: '1 hour ago', type: 'success' },
    { id: 'syn-approval',category: 'approval', text: 'Commission override for D-503 awaiting Sales Director approval', time: '2 hours ago', type: 'info' },
  ];
  const merged = [...synthesized, ...state.agentNotifications].map(n => ({ ...n, category: categorize(n) }));

  const counts = merged.reduce((a,n)=>{a[n.category]=(a[n.category]||0)+1; return a;},{});
  const filtered = activeCat === 'all' ? merged : merged.filter(n=>n.category===activeCat);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Tasks · Lead updates · System alerts · Approval requests — Platform §3.10</p>
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
