// ═══════════════════════════════════════════════════════════════
// Careers — public-facing job vacancies surface.
// Stakeholder ask (13 May 2026):
//   "the job vacancy and career url not implemented into the cycle
//   of marketplace as career url must be found with very good design"
//
// This page exposes the JOBS seed (managed inside Backoffice →
// Recruitment) to the public marketplace so candidates can browse
// open roles and apply directly. Successful applications push into
// the CANDIDATES pipeline (consumed by HR Recruiter on the
// Recruitment Pipeline page).
// ═══════════════════════════════════════════════════════════════
import { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Users, Clock, CalendarDays,
  CheckCircle2, ArrowRight, ArrowLeft, Building2, Sparkles,
  GraduationCap, ShieldCheck, Heart, ChevronRight, Send, X,
} from 'lucide-react';
import { JOBS, CANDIDATES } from '../../data/staticData';

// ═══════════════════════════════════════════════════════════════
// Shared style tokens
// ═══════════════════════════════════════════════════════════════
const BRAND       = 'var(--brand)';
const BRAND_TINT  = 'var(--brand-tint)';
const TEXT_PRIM   = '#0f172a';
const TEXT_SEC    = '#475569';
const TEXT_TERT   = '#94a3b8';
const BORDER      = '#e2e8f0';
const SURFACE     = '#ffffff';

// Persisted candidate submissions (in-memory; lives for the
// session — HR sees these on the Recruitment Pipeline page).
let _runtimeApplications = [];
const submitApplication = (payload) => {
  const id = `CAN-${Date.now()}`;
  const rec = {
    id, name: payload.name, job: payload.jobTitle, stage: 'Applied',
    score: null, source: 'Careers Page',
    applied: new Date().toISOString().slice(0, 10),
    interviewer: null,
    email: payload.email, phone: payload.phone,
    coverLetter: payload.coverLetter,
    // Both attachments are kept as data URLs (base64) so they survive a
    // page reload during the demo session. HR sees the photo in the row
    // avatar + can download the CV from the candidate drawer.
    photoDataUrl: payload.photoDataUrl || null,
    photoName:    payload.photoName    || null,
    resumeDataUrl: payload.resumeDataUrl || null,
    resumeName:    payload.resumeName    || null,
    jobId: payload.jobId,
  };
  _runtimeApplications.push(rec);
  CANDIDATES.unshift(rec); // HR Recruitment Pipeline will see this
  return id;
};

// Read a File into a data URL (base64) — used for both the photo and CV.
const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  if (!file) return resolve(null);
  const fr = new FileReader();
  fr.onload  = () => resolve(fr.result);
  fr.onerror = () => reject(fr.error);
  fr.readAsDataURL(file);
});

// ═══════════════════════════════════════════════════════════════
// Careers — list page
// ═══════════════════════════════════════════════════════════════
export const Careers = () => {
  const navigate = useNavigate();
  const [q, setQ]                 = useState('');
  const [department, setDept]     = useState('All');
  const [location, setLoc]        = useState('All');
  const [type, setType]           = useState('All');

  // Departments / locations / types derived live from the JOBS seed
  // so the filter chips reflect whatever Backoffice has published.
  const departments = useMemo(
    () => ['All', ...Array.from(new Set(JOBS.map(j => j.department)))],
    []
  );
  const locations = useMemo(
    () => ['All', ...Array.from(new Set(JOBS.map(j => j.location)))],
    []
  );
  const types = useMemo(
    () => ['All', ...Array.from(new Set(JOBS.map(j => j.type)))],
    []
  );

  // Closed jobs surface in a separate, dimmed section — don't pollute
  // the active list. Filters apply to active only.
  const publishedJobs = JOBS.filter(j => j.status === 'Published');
  const closedJobs    = JOBS.filter(j => j.status === 'Closed');

  const filtered = publishedJobs.filter(j => {
    if (department !== 'All' && j.department !== department) return false;
    if (location   !== 'All' && j.location   !== location)   return false;
    if (type       !== 'All' && j.type       !== type)       return false;
    if (q) {
      const hay = `${j.title} ${j.department} ${j.summary || ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const totalApplicants = publishedJobs.reduce((s, j) => s + (j.applicants || 0), 0);
  const totalHeadcount  = publishedJobs.reduce((s, j) => s + (j.headcount  || 0), 0);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0f172a 100%)',
        color: '#fff', padding: '64px 28px 80px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blurred discs — recurring brand pattern. */}
        <div style={{position:'absolute',top:-80,right:-80,width:360,height:360,borderRadius:'50%',background:'radial-gradient(circle, rgba(229,9,20,0.22), transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-100,left:-60,width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)',pointerEvents:'none'}}/>

        <div style={{maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:999, background:'rgba(255,255,255,0.08)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.15)', fontSize:12, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase'}}>
            <Sparkles size={14}/>  Now Hiring · {publishedJobs.length} Open Roles
          </div>
          <h1 style={{fontSize:54, fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1, marginTop:18}}>
            Build the future of <span style={{color:'#fca5a5'}}>real estate</span><br/>
            <span style={{color:'#fff'}}>in Egypt — with us.</span>
          </h1>
          <p style={{marginTop:18, fontSize:16, color:'#cbd5e1', maxWidth:680, lineHeight:1.65}}>
            Homes is the operating system for Egypt's largest real-estate brokerages.
            Join a team where sales, marketing, HR and finance teams work on a single
            platform — and where your career path is wired into the product itself.
          </p>

          {/* Quick stats row */}
          <div style={{marginTop:34, display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, maxWidth:880}}>
            {[
              { label: 'Open roles',     value: publishedJobs.length, icon: <Briefcase size={20}/> },
              { label: 'Total hires',    value: totalHeadcount,        icon: <Users size={20}/>     },
              { label: 'Applicants',     value: totalApplicants,       icon: <Heart size={20}/>     },
              { label: 'Departments',    value: departments.length-1,  icon: <Building2 size={20}/> },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.06)', backdropFilter:'blur(10px)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14,
                padding: '16px 18px', display:'flex', alignItems:'center', gap:12,
              }}>
                <div style={{width:40,height:40,borderRadius:10,background:'rgba(252,165,165,0.18)',color:'#fca5a5',display:'flex',alignItems:'center',justifyContent:'center'}}>{s.icon}</div>
                <div>
                  <div style={{fontSize:24, fontWeight:800, lineHeight:1}}>{s.value}</div>
                  <div style={{fontSize:11, color:'#cbd5e1', textTransform:'uppercase', letterSpacing:'.05em', marginTop:4}}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div style={{marginTop:32, display:'flex', gap:12, flexWrap:'wrap'}}>
            <button
              onClick={() => document.getElementById('careers-list')?.scrollIntoView({behavior:'smooth'})}
              style={{
                background: BRAND, color: '#fff', border: 'none',
                padding: '12px 22px', borderRadius: 10, fontWeight: 700,
                fontSize: 14, cursor: 'pointer', display: 'inline-flex',
                alignItems: 'center', gap: 8,
                boxShadow: '0 6px 18px rgba(229,9,20,0.35)',
              }}>
              Browse Open Roles <ArrowRight size={16}/>
            </button>
            <button
              onClick={() => document.getElementById('careers-why')?.scrollIntoView({behavior:'smooth'})}
              style={{
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '12px 22px', borderRadius: 10, fontWeight: 600,
                fontSize: 14, cursor: 'pointer', backdropFilter:'blur(8px)',
              }}>
              Why work at Homes?
            </button>
          </div>
        </div>
      </section>

      {/* ─── Why work at Homes? value props ─────────────────────── */}
      <section id="careers-why" style={{maxWidth:1200, margin:'0 auto', padding:'70px 28px 20px'}}>
        <div style={{textAlign:'center', maxWidth:680, margin:'0 auto'}}>
          <h2 style={{fontSize:32, fontWeight:800, letterSpacing:'-.02em', color: TEXT_PRIM}}>Why Homes</h2>
          <p style={{marginTop:10, color: TEXT_SEC, lineHeight:1.6}}>
            We're a fast-growing brokerage tech company building the platform Egypt's
            real-estate industry runs on. Here's what you get when you join the team.
          </p>
        </div>

        <div style={{marginTop:38, display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:18}}>
          {[
            {
              icon: <GraduationCap size={22}/>,
              title: 'Homes Academy',
              body: 'Structured onboarding, mentorship from senior agents, and ongoing learning paths — all built in to your CRM.',
            },
            {
              icon: <Sparkles size={22}/>,
              title: 'Uncapped earning',
              body: 'Competitive base + uncapped commission. Homes Advance releases commission at the developer\'s 5% collection trigger.',
            },
            {
              icon: <ShieldCheck size={22}/>,
              title: 'Health & benefits',
              body: 'Health insurance for you and your family, M365 licence, transport allowance, and annual top-performer trips.',
            },
            {
              icon: <Heart size={22}/>,
              title: 'A platform that loves agents',
              body: 'You\'re not chasing spreadsheets — every lead, listing, tour and deal lives in a CRM purpose-built for Egyptian real estate.',
            },
          ].map(v => (
            <div key={v.title} style={{
              background: SURFACE, border: `1px solid ${BORDER}`,
              borderRadius: 14, padding: '22px 22px 20px',
              transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(15,23,42,.08)';}}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='';}}
            >
              <div style={{width:44, height:44, borderRadius:10, background: BRAND_TINT, color: BRAND, display:'flex',alignItems:'center',justifyContent:'center'}}>{v.icon}</div>
              <h3 style={{marginTop:14, fontSize:16, fontWeight:700, color: TEXT_PRIM}}>{v.title}</h3>
              <p style={{marginTop:8, fontSize:13, color: TEXT_SEC, lineHeight:1.6}}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Filters + list ─────────────────────────────────────── */}
      <section id="careers-list" style={{maxWidth:1200, margin:'0 auto', padding:'60px 28px 80px'}}>
        <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, flexWrap:'wrap', marginBottom:24}}>
          <div>
            <h2 style={{fontSize:28, fontWeight:800, letterSpacing:'-.02em', color: TEXT_PRIM}}>Open Roles</h2>
            <p style={{marginTop:6, color: TEXT_SEC, fontSize:14}}>
              {filtered.length} of {publishedJobs.length} role{publishedJobs.length===1?'':'s'} match your filters
            </p>
          </div>
          {/* Search */}
          <div style={{position:'relative', width:320, maxWidth:'100%'}}>
            <Search size={15} color={TEXT_TERT} style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)'}}/>
            <input
              type="text"
              placeholder="Search by title, team, keyword…"
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{
                width:'100%', height:42, padding:'0 14px 0 36px',
                border:`1px solid ${BORDER}`, borderRadius:10,
                background:'#fff', fontSize:13, outline:'none',
              }}
            />
          </div>
        </div>

        {/* Filter chip rows */}
        <div style={{display:'flex', flexDirection:'column', gap:10, marginBottom:28}}>
          <ChipRow label="Department" value={department} onChange={setDept} options={departments}/>
          <ChipRow label="Location"   value={location}   onChange={setLoc}  options={locations}/>
          <ChipRow label="Type"       value={type}       onChange={setType} options={types}/>
        </div>

        {/* Job grid */}
        {filtered.length === 0 ? (
          <div style={{
            background: SURFACE, border: `1px dashed ${BORDER}`,
            borderRadius: 14, padding: '60px 28px', textAlign: 'center',
          }}>
            <div style={{width:60,height:60,margin:'0 auto 16px',borderRadius:'50%',background: BRAND_TINT, color: BRAND, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <Briefcase size={26}/>
            </div>
            <h3 style={{fontSize:18, fontWeight:700, color: TEXT_PRIM}}>No roles match those filters</h3>
            <p style={{marginTop:6, color: TEXT_SEC, fontSize:13}}>
              Try clearing a filter or widening your search.
            </p>
            <button onClick={() => { setQ(''); setDept('All'); setLoc('All'); setType('All'); }} style={{
              marginTop: 18, background: BRAND, color: '#fff', border: 'none',
              padding: '10px 18px', borderRadius: 8, fontWeight: 600,
              fontSize: 13, cursor: 'pointer',
            }}>Clear all filters</button>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:18}}>
            {filtered.map(job => (
              <JobCard key={job.id} job={job} onClick={() => navigate(`/marketplace/careers/${job.id}`)}/>
            ))}
          </div>
        )}

        {/* Closed roles (collapsed informational note) */}
        {closedJobs.length > 0 && (
          <div style={{marginTop:48, paddingTop:24, borderTop: `1px dashed ${BORDER}`}}>
            <h3 style={{fontSize:14, fontWeight:700, color: TEXT_SEC, textTransform:'uppercase', letterSpacing:'.06em'}}>Recently closed</h3>
            <div style={{marginTop:14, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:14}}>
              {closedJobs.map(j => (
                <div key={j.id} style={{
                  background: '#f8fafc', border: `1px solid ${BORDER}`,
                  borderRadius: 12, padding: '14px 16px', opacity: 0.75,
                }}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:999, background:'#e2e8f0', color:'#475569', textTransform:'uppercase', letterSpacing:'.05em'}}>Closed</span>
                    <div style={{fontWeight:700, fontSize:14, color: TEXT_PRIM}}>{j.title}</div>
                  </div>
                  <div style={{marginTop:6, fontSize:12, color: TEXT_SEC}}>{j.department} · {j.location}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── Don't see your role? CTA banner ─────────────────────── */}
      <section style={{maxWidth:1200, margin:'0 auto', padding:'0 28px 80px'}}>
        <div style={{
          background: `linear-gradient(135deg, ${BRAND} 0%, #b91c1c 100%)`,
          color: '#fff', borderRadius: 18, padding: '36px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
          boxShadow: '0 18px 40px rgba(229,9,20,0.25)',
        }}>
          <div style={{maxWidth: 560}}>
            <h3 style={{fontSize:22, fontWeight:800, letterSpacing:'-.01em'}}>Don't see your role?</h3>
            <p style={{marginTop:6, fontSize:14, opacity:.9, lineHeight:1.6}}>
              We're always interested in talent. Send your CV to <b>careers@homes.com.eg</b> and
              our HR team will keep you on file for future openings.
            </p>
          </div>
          <a href="mailto:careers@homes.com.eg" style={{
            background: '#fff', color: BRAND, padding: '12px 22px',
            borderRadius: 10, fontWeight: 700, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            textDecoration: 'none',
          }}>
            <Send size={15}/> Email HR
          </a>
        </div>
      </section>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// JobCard — used inside the list grid
// ═══════════════════════════════════════════════════════════════
const JobCard = ({ job, onClick }) => {
  const daysToDeadline = (() => {
    if (!job.deadline) return null;
    const d = (new Date(job.deadline) - new Date()) / 86400000;
    return Math.ceil(d);
  })();
  const urgent = daysToDeadline !== null && daysToDeadline <= 14 && daysToDeadline > 0;
  return (
    <div onClick={onClick} style={{
      background: SURFACE, border: `1px solid ${BORDER}`,
      borderRadius: 16, padding: '22px', cursor: 'pointer',
      transition: 'transform .15s, box-shadow .15s, border-color .15s',
      display: 'flex', flexDirection: 'column', gap: 14, minHeight: 240,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 14px 32px rgba(15,23,42,.10)'; e.currentTarget.style.borderColor=BRAND;}}
    onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor=BORDER;}}
    >
      <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12}}>
        <div>
          <div style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, color: BRAND, textTransform:'uppercase', letterSpacing:'.06em', background: BRAND_TINT, padding:'4px 10px', borderRadius:999}}>
            <Briefcase size={11}/> {job.department}
          </div>
          <h3 style={{marginTop:10, fontSize:19, fontWeight:700, color: TEXT_PRIM, letterSpacing:'-.01em'}}>{job.title}</h3>
        </div>
        {urgent && (
          <span style={{fontSize:10, fontWeight:700, padding:'4px 9px', borderRadius:999, background:'#fef3c7', color:'#92400e', textTransform:'uppercase', letterSpacing:'.05em', whiteSpace:'nowrap'}}>
            <Clock size={9} style={{verticalAlign:'-1px', marginRight:3}}/>{daysToDeadline}d left
          </span>
        )}
      </div>

      <p style={{fontSize:13, color: TEXT_SEC, lineHeight:1.55, flex:1, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden'}}>
        {job.summary}
      </p>

      <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
        <Meta icon={<MapPin size={12}/>}      label={job.location}/>
        <Meta icon={<Briefcase size={12}/>}   label={job.type}/>
        <Meta icon={<Building2 size={12}/>}   label={job.mode}/>
        {job.experienceYears && <Meta icon={<Users size={12}/>} label={`${job.experienceYears} yrs`}/>}
      </div>

      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:`1px solid ${BORDER}`}}>
        <div style={{fontSize:12, color: TEXT_TERT}}>
          <Users size={11} style={{verticalAlign:'-1px', marginRight:4}}/>
          {job.headcount} hire{job.headcount===1?'':'s'} · {job.applicants} applicant{job.applicants===1?'':'s'}
        </div>
        <span style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color: BRAND}}>
          View details <ChevronRight size={14}/>
        </span>
      </div>
    </div>
  );
};

const Meta = ({ icon, label }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', gap:5,
    fontSize:11, color: TEXT_SEC,
    background:'#f1f5f9', padding:'4px 10px', borderRadius:999,
    fontWeight:600,
  }}>{icon} {label}</span>
);

// ═══════════════════════════════════════════════════════════════
// ChipRow — labelled row of filter chips
// ═══════════════════════════════════════════════════════════════
const ChipRow = ({ label, value, onChange, options }) => (
  <div style={{display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
    <div style={{width:88, fontSize:11, fontWeight:700, color: TEXT_TERT, textTransform:'uppercase', letterSpacing:'.06em', flexShrink:0}}>{label}</div>
    <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding:'7px 14px', borderRadius:999,
            border: `1px solid ${value === opt ? BRAND : BORDER}`,
            background: value === opt ? BRAND : SURFACE,
            color: value === opt ? '#fff' : TEXT_SEC,
            fontSize: 12, fontWeight: 600, cursor:'pointer',
            transition: 'all .15s',
          }}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// CareerDetail — single job page
// ═══════════════════════════════════════════════════════════════
export const CareerDetail = () => {
  const { jobId } = useParams();
  const navigate  = useNavigate();
  const job       = JOBS.find(j => j.id === jobId);
  const [applyOpen, setApplyOpen] = useState(false);

  if (!job) {
    return (
      <section style={{maxWidth:1000, margin:'0 auto', padding:'80px 28px', textAlign:'center'}}>
        <div style={{width:64, height:64, borderRadius:'50%', background: BRAND_TINT, color: BRAND, display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
          <Briefcase size={26}/>
        </div>
        <h1 style={{marginTop:16, fontSize:24, fontWeight:800}}>Role not found</h1>
        <p style={{marginTop:8, color: TEXT_SEC}}>
          This role may have been closed or removed. Browse all open positions below.
        </p>
        <Link to="/marketplace/careers" style={{display:'inline-flex', alignItems:'center', gap:6, marginTop:18, color: BRAND, fontWeight:600}}>
          <ArrowLeft size={14}/> Back to Careers
        </Link>
      </section>
    );
  }

  const daysToDeadline = (() => {
    if (!job.deadline) return null;
    const d = (new Date(job.deadline) - new Date()) / 86400000;
    return Math.ceil(d);
  })();
  const isClosed = job.status === 'Closed';

  return (
    <>
      {/* ─── Detail hero ─────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
        color: '#fff', padding: '44px 28px 56px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{position:'absolute',top:-60,right:-60,width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle, rgba(229,9,20,0.18), transparent 70%)',pointerEvents:'none'}}/>

        <div style={{maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1}}>
          <button
            onClick={() => navigate('/marketplace/careers')}
            style={{
              background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.18)',
              color:'#fff', padding:'7px 12px', borderRadius:8, fontSize:12, fontWeight:600,
              cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6,
              backdropFilter:'blur(8px)',
            }}>
            <ArrowLeft size={13}/> All open roles
          </button>

          <div style={{marginTop:18, display:'inline-flex', alignItems:'center', gap:8, fontSize:11, fontWeight:700, color:'#fff', textTransform:'uppercase', letterSpacing:'.06em', background:'rgba(229,9,20,0.18)', padding:'5px 12px', borderRadius:999, border:'1px solid rgba(229,9,20,0.35)'}}>
            <Briefcase size={11}/> {job.department}
          </div>

          <h1 style={{marginTop:14, fontSize:42, fontWeight:800, letterSpacing:'-.02em', lineHeight:1.1}}>{job.title}</h1>
          <p style={{marginTop:14, fontSize:15, color:'#cbd5e1', maxWidth:780, lineHeight:1.65}}>{job.summary}</p>

          {/* Quick meta row */}
          <div style={{marginTop:22, display:'flex', flexWrap:'wrap', gap:10}}>
            <HeroMeta icon={<MapPin size={13}/>}      label={job.location}/>
            <HeroMeta icon={<Briefcase size={13}/>}   label={job.type}/>
            <HeroMeta icon={<Building2 size={13}/>}   label={job.mode}/>
            <HeroMeta icon={<Users size={13}/>}       label={`${job.experienceYears || '—'} yrs experience`}/>
            <HeroMeta icon={<Users size={13}/>}       label={`${job.headcount} hire${job.headcount===1?'':'s'} open`}/>
            {job.deadline && (
              <HeroMeta icon={<CalendarDays size={13}/>} label={`Apply by ${job.deadline}`}/>
            )}
          </div>

          <div style={{marginTop:28, display:'flex', gap:12, flexWrap:'wrap'}}>
            <button
              onClick={() => setApplyOpen(true)}
              disabled={isClosed}
              style={{
                background: isClosed ? '#475569' : BRAND,
                color: '#fff', border: 'none',
                padding: '13px 26px', borderRadius: 10, fontWeight: 700,
                fontSize: 14, cursor: isClosed ? 'not-allowed' : 'pointer',
                opacity: isClosed ? 0.6 : 1,
                display: 'inline-flex', alignItems:'center', gap: 8,
                boxShadow: isClosed ? 'none' : '0 6px 18px rgba(229,9,20,0.35)',
              }}>
              {isClosed ? 'Role closed' : 'Apply for this role'} {!isClosed && <ArrowRight size={15}/>}
            </button>
            <a
              href={`mailto:careers@homes.com.eg?subject=Question about ${encodeURIComponent(job.title)}`}
              style={{
                background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)',
                color:'#fff', padding:'13px 26px', borderRadius:10, fontWeight:600,
                fontSize:14, textDecoration:'none', display:'inline-flex',
                alignItems:'center', gap:8, backdropFilter:'blur(8px)',
              }}>
              <Send size={14}/> Ask a question
            </a>
          </div>
        </div>
      </section>

      {/* ─── Detail body ─────────────────────────────────────── */}
      <section style={{maxWidth:1100, margin:'0 auto', padding:'56px 28px 80px'}}>
        <div style={{display:'grid', gridTemplateColumns:'minmax(0, 1fr) 320px', gap:36, alignItems:'flex-start'}}>
          {/* Main column */}
          <div>
            <DetailBlock title="Responsibilities" items={job.responsibilities || []}/>
            <DetailBlock title="Requirements"    items={job.requirements   || []}/>
            <DetailBlock title="What we offer"   items={job.benefits      || []}/>

            <div style={{marginTop:36, padding:'24px 26px', background: BRAND_TINT, border:`1px solid ${BORDER}`, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'space-between', gap:18, flexWrap:'wrap'}}>
              <div>
                <h4 style={{fontSize:16, fontWeight:700, color: TEXT_PRIM}}>Ready to apply?</h4>
                <p style={{marginTop:4, fontSize:13, color: TEXT_SEC}}>
                  It takes 2 minutes — share a CV and our HR team will be in touch within 5 business days.
                </p>
              </div>
              <button
                onClick={() => setApplyOpen(true)}
                disabled={isClosed}
                style={{
                  background: isClosed ? '#94a3b8' : BRAND, color:'#fff', border:'none',
                  padding:'12px 22px', borderRadius:10, fontWeight:700,
                  fontSize:14, cursor: isClosed ? 'not-allowed' : 'pointer',
                  display:'inline-flex', alignItems:'center', gap:8,
                }}>
                Apply now <ArrowRight size={15}/>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{position:'sticky', top:20, display:'flex', flexDirection:'column', gap:16}}>
            <div style={{background: SURFACE, border: `1px solid ${BORDER}`, borderRadius:14, padding:'20px 22px'}}>
              <h4 style={{fontSize:13, fontWeight:700, color: TEXT_TERT, textTransform:'uppercase', letterSpacing:'.06em'}}>Role at a glance</h4>
              <ul style={{marginTop:14, listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:12}}>
                <SideRow label="Department" value={job.department}/>
                <SideRow label="Location"   value={job.location}/>
                <SideRow label="Mode"       value={job.mode}/>
                <SideRow label="Type"       value={job.type}/>
                <SideRow label="Experience" value={job.experienceYears ? `${job.experienceYears} years` : '—'}/>
                <SideRow label="Openings"   value={`${job.headcount} hire${job.headcount===1?'':'s'}`}/>
                <SideRow label="Hiring manager" value={job.hiringManager || '—'}/>
                <SideRow label="Posted"     value={job.created}/>
                <SideRow label="Deadline"   value={job.deadline || '—'} highlight={daysToDeadline !== null && daysToDeadline <= 14 && daysToDeadline > 0}/>
              </ul>
            </div>

            <div style={{background: SURFACE, border: `1px solid ${BORDER}`, borderRadius:14, padding:'20px 22px'}}>
              <h4 style={{fontSize:13, fontWeight:700, color: TEXT_TERT, textTransform:'uppercase', letterSpacing:'.06em'}}>Share this role</h4>
              <div style={{marginTop:12, display:'flex', gap:8, flexWrap:'wrap'}}>
                <ShareBtn label="Copy link" onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Link copied to clipboard');
                }}/>
                <a href={`https://wa.me/?text=${encodeURIComponent(`We're hiring at Homes — ${job.title}. ${window.location.href}`)}`} target="_blank" rel="noopener noreferrer" style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  background:'#f1f5f9', border:`1px solid ${BORDER}`, color: TEXT_PRIM,
                  padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:600,
                  textDecoration:'none',
                }}>WhatsApp</a>
                <a href={`mailto:?subject=${encodeURIComponent(`Job opening at Homes — ${job.title}`)}&body=${encodeURIComponent(`Thought you might be interested:\n\n${job.title}\n${window.location.href}`)}`} style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  background:'#f1f5f9', border:`1px solid ${BORDER}`, color: TEXT_PRIM,
                  padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:600,
                  textDecoration:'none',
                }}>Email</a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── Apply modal ─────────────────────────────────────── */}
      {applyOpen && <ApplyModal job={job} onClose={() => setApplyOpen(false)}/>}
    </>
  );
};

const HeroMeta = ({ icon, label }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', gap:6,
    fontSize:12, color:'#fff',
    background:'rgba(255,255,255,0.1)', backdropFilter:'blur(6px)',
    padding:'7px 13px', borderRadius:999, fontWeight:600,
    border:'1px solid rgba(255,255,255,0.12)',
  }}>{icon} {label}</span>
);

const DetailBlock = ({ title, items }) => {
  if (!items.length) return null;
  return (
    <div style={{marginBottom:32}}>
      <h2 style={{fontSize:22, fontWeight:800, letterSpacing:'-.01em', color: TEXT_PRIM}}>{title}</h2>
      <ul style={{marginTop:16, listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:10}}>
        {items.map((it, i) => (
          <li key={i} style={{display:'flex', gap:12, alignItems:'flex-start', fontSize:14, color: TEXT_PRIM, lineHeight:1.6}}>
            <span style={{flexShrink:0, marginTop:3, color: BRAND}}>
              <CheckCircle2 size={16}/>
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SideRow = ({ label, value, highlight }) => (
  <li style={{display:'flex', justifyContent:'space-between', gap:10, fontSize:13}}>
    <span style={{color: TEXT_SEC}}>{label}</span>
    <span style={{fontWeight:600, color: highlight ? BRAND : TEXT_PRIM, textAlign:'right'}}>{value}</span>
  </li>
);

const ShareBtn = ({ label, onClick }) => (
  <button onClick={onClick} style={{
    background:'#f1f5f9', border:`1px solid ${BORDER}`, color: TEXT_PRIM,
    padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer',
  }}>{label}</button>
);

// ═══════════════════════════════════════════════════════════════
// ApplyModal — submits a candidate row into CANDIDATES
// ═══════════════════════════════════════════════════════════════
const ApplyModal = ({ job, onClose }) => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', coverLetter: '',
    // Photo + CV attachments — both required now.
    photoName: '', photoDataUrl: '',
    resumeName: '', resumeDataUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState({ photo: false, resume: false });

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { setErrors(prev => ({ ...prev, photoName: 'Image must be under 4 MB' })); return; }
    setUploading(u => ({ ...u, photo: true }));
    const dataUrl = await readFileAsDataUrl(file);
    setForm(f => ({ ...f, photoName: file.name, photoDataUrl: dataUrl }));
    setErrors(prev => ({ ...prev, photoName: undefined }));
    setUploading(u => ({ ...u, photo: false }));
  };
  const handleResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setErrors(prev => ({ ...prev, resumeName: 'CV must be under 8 MB' })); return; }
    setUploading(u => ({ ...u, resume: true }));
    const dataUrl = await readFileAsDataUrl(file);
    setForm(f => ({ ...f, resumeName: file.name, resumeDataUrl: dataUrl }));
    setErrors(prev => ({ ...prev, resumeName: undefined }));
    setUploading(u => ({ ...u, resume: false }));
  };

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim())                    err.name  = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email))   err.email = 'Invalid email';
    if (!/^[\d+\s-]{8,}$/.test(form.phone))   err.phone = 'Enter a valid phone';
    if (!form.photoName.trim())               err.photoName = 'Attach a profile photo';
    if (!form.resumeName.trim())              err.resumeName = 'Attach your CV';
    setErrors(err);
    if (Object.keys(err).length) return;
    submitApplication({
      jobId: job.id, jobTitle: job.title,
      name: form.name, email: form.email, phone: form.phone,
      coverLetter: form.coverLetter,
      photoName: form.photoName, photoDataUrl: form.photoDataUrl,
      resumeName: form.resumeName, resumeDataUrl: form.resumeDataUrl,
    });
    setSubmitted(true);
  };

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,0.55)',
      backdropFilter:'blur(4px)', display:'flex', alignItems:'center',
      justifyContent:'center', padding:20, zIndex:9999,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'#fff', borderRadius:16, width:'100%', maxWidth:520,
        maxHeight:'90vh', overflow:'auto', boxShadow:'0 30px 80px rgba(15,23,42,0.35)',
      }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:`1px solid ${BORDER}`}}>
          <div>
            <div style={{fontSize:11, fontWeight:700, color: BRAND, textTransform:'uppercase', letterSpacing:'.06em'}}>Apply for</div>
            <h3 style={{marginTop:4, fontSize:18, fontWeight:800, color: TEXT_PRIM}}>{job.title}</h3>
          </div>
          <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', color: TEXT_TERT, padding:6}}>
            <X size={18}/>
          </button>
        </div>

        {submitted ? (
          <div style={{padding:'40px 28px', textAlign:'center'}}>
            <div style={{width:60, height:60, borderRadius:'50%', background:'rgba(16,185,129,0.12)', color:'#10b981', display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
              <CheckCircle2 size={28}/>
            </div>
            <h3 style={{marginTop:14, fontSize:20, fontWeight:800, color: TEXT_PRIM}}>
              Application received
            </h3>
            <p style={{marginTop:8, fontSize:13, color: TEXT_SEC, lineHeight:1.6}}>
              Thanks {form.name.split(' ')[0]} — we've logged your application for <b>{job.title}</b>.
              The HR team will review and respond within 5 business days at <b>{form.email}</b>.
            </p>
            <button onClick={onClose} style={{
              marginTop:20, background: BRAND, color:'#fff', border:'none',
              padding:'11px 22px', borderRadius:8, fontWeight:600,
              fontSize:13, cursor:'pointer',
            }}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} style={{padding:'22px 24px'}}>
            <Field label="Full name *" error={errors.name}>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" style={inp}/>
            </Field>
            <Field label="Email *" error={errors.email}>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" style={inp}/>
            </Field>
            <Field label="Phone *" error={errors.phone}>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+20 xxx xxx xxxx" style={inp}/>
            </Field>
            <Field label="Profile photo *" error={errors.photoName}>
              <label style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'10px 14px', border:`1px dashed ${form.photoName ? BRAND : BORDER}`,
                borderRadius:8, fontSize:13, color: form.photoName ? TEXT_PRIM : TEXT_TERT,
                cursor:'pointer', background: form.photoName ? BRAND_TINT : '#fff',
              }}>
                {form.photoDataUrl ? (
                  <img src={form.photoDataUrl} alt="" style={{width:42, height:42, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${BRAND}`}}/>
                ) : (
                  <div style={{width:42, height:42, borderRadius:'50%', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', color: TEXT_TERT, flexShrink:0, fontSize:11, fontWeight:700}}>IMG</div>
                )}
                <span style={{flex:1, minWidth:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                  {uploading.photo ? 'Reading…' : (form.photoName || 'Upload a recent photo (JPG / PNG, ≤ 4MB)')}
                </span>
                <span style={{fontSize:11, color: BRAND, fontWeight:600}}>{form.photoName ? 'Replace' : 'Browse'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  style={{display:'none'}}
                  onChange={handlePhoto}
                />
              </label>
            </Field>
            <Field label="Resume / CV *" error={errors.resumeName}>
              <label style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'10px 14px', border:`1px dashed ${form.resumeName ? BRAND : BORDER}`,
                borderRadius:8, fontSize:13, color: form.resumeName ? TEXT_PRIM : TEXT_TERT,
                cursor:'pointer', background: form.resumeName ? BRAND_TINT : '#fff',
              }}>
                <span>{uploading.resume ? 'Reading…' : (form.resumeName || 'Click to upload (PDF / DOCX, ≤ 8MB)')}</span>
                <span style={{fontSize:11, color: BRAND, fontWeight:600}}>{form.resumeName ? 'Replace' : 'Browse'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{display:'none'}}
                  onChange={handleResume}
                />
              </label>
            </Field>
            <Field label="Why are you a fit? (optional)">
              <textarea
                value={form.coverLetter}
                onChange={e => setForm({...form, coverLetter: e.target.value})}
                placeholder="A short paragraph about why this role excites you…"
                rows={4}
                style={{...inp, resize:'vertical', minHeight:90}}
              />
            </Field>

            <div style={{marginTop:18, display:'flex', gap:10, justifyContent:'flex-end'}}>
              <button type="button" onClick={onClose} style={{
                background:'#fff', color: TEXT_SEC, border:`1px solid ${BORDER}`,
                padding:'10px 18px', borderRadius:8, fontWeight:600,
                fontSize:13, cursor:'pointer',
              }}>Cancel</button>
              <button type="submit" style={{
                background: BRAND, color:'#fff', border:'none',
                padding:'10px 22px', borderRadius:8, fontWeight:700,
                fontSize:13, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6,
              }}>
                Submit application <Send size={13}/>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div style={{marginBottom:14}}>
    <label style={{display:'block', fontSize:12, fontWeight:600, color: TEXT_PRIM, marginBottom:6}}>{label}</label>
    {children}
    {error && <div style={{marginTop:4, fontSize:11, color:'#dc2626', fontWeight:600}}>{error}</div>}
  </div>
);

const inp = {
  width:'100%', height:40, padding:'0 12px',
  border:`1px solid ${BORDER}`, borderRadius:8,
  fontSize:13, outline:'none', background:'#fff',
  boxSizing:'border-box',
};
