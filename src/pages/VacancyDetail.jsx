// ═══════════════════════════════════════════════════════════════════════
// VacancyDetail — dedicated page for a single vacancy
// ───────────────────────────────────────────────────────────────────────
// Business-team feedback (May 2026): the side-drawer view wasn't
// convenient — too much content for a 520px panel. Promoted to a full
// page at /backoffice/jobs/:id with the candidate pipeline embedded.
// ═══════════════════════════════════════════════════════════════════════
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Pencil, Globe, Archive, Briefcase, MapPin, Users, Calendar, Layers, Award } from 'lucide-react';
import { VacancyCandidates } from '../components/VacancyCandidates';

const statusColor = s => {
  if (s === 'Published') return 'badge-success';
  if (s === 'Draft') return 'badge-gray';
  if (s === 'Closed') return 'badge-danger';
  return 'badge-info';
};

const ListBlock = ({ title, items, accent = 'var(--brand)' }) => (
  <div style={{marginTop:20}}>
    <h3 style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:10}}>{title}</h3>
    <ul style={{margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:8}}>
      {items.map((item, i) => (
        <li key={i} style={{display:'flex', gap:10, alignItems:'flex-start', padding:'10px 14px', background:'#fafbfc', borderLeft:`3px solid ${accent}`, borderRadius:'0 8px 8px 0'}}>
          <span style={{width:18, height:18, borderRadius:'50%', background:accent, color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1}}>{i + 1}</span>
          <span style={{fontSize:13, color:'var(--text-primary)', lineHeight:1.5}}>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const VacancyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, updateItem, openConfirm, toast } = useApp();

  const job = (state.jobs || []).find(j => j.id === id);

  if (!job) {
    return (
      <div style={{padding:60, textAlign:'center'}}>
        <Briefcase size={48} color="var(--text-tertiary)" style={{margin:'0 auto 16px'}}/>
        <h2 style={{fontSize:18, fontWeight:700, color:'var(--text-primary)'}}>Vacancy not found</h2>
        <p style={{marginTop:6, fontSize:13, color:'var(--text-secondary)'}}>The vacancy <b>{id}</b> doesn't exist or has been removed.</p>
        <button className="btn btn-brand" style={{marginTop:18}} onClick={() => navigate('/backoffice/jobs')}>
          <ArrowLeft size={14}/> Back to Job Vacancies
        </button>
      </div>
    );
  }

  // Headcount accounting — matches the badge logic in the list page.
  const acceptedOffers = (state.offers || []).filter(o => o.jobId === job.id && o.stage === 'Accepted').length;
  const isFilled = job.headcount > 0 && acceptedOffers >= job.headcount;
  const filledRatio = job.headcount > 0 ? acceptedOffers / job.headcount : 0;

  const publish = () => openConfirm({
    title: `Publish ${job.title}?`,
    message: 'The vacancy will go live on the public careers page.',
    onConfirm: () => {
      updateItem('jobs', job.id, { status: 'Published' }, { action: 'Vacancy Published', module: 'Recruitment', target: job.id, detail: 'Published to careers page' });
      toast(`${job.title} published`);
    },
  });

  const close = () => openConfirm({
    title: 'Close vacancy?',
    message: `${job.title} will be archived. Existing applications remain visible.`,
    danger: true,
    onConfirm: () => {
      updateItem('jobs', job.id, { status: 'Closed' }, { action: 'Vacancy Closed', module: 'Recruitment', target: job.id });
      toast(`${job.title} closed`, 'warning');
    },
  });

  return (
    <div>
      {/* Back navigation */}
      <div style={{marginBottom:14}}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/backoffice/jobs')}>
          <ArrowLeft size={14}/> Back to Job Vacancies
        </button>
      </div>

      {/* Hero card */}
      <div style={{
        background:'linear-gradient(135deg, #0f172a, #1e3a5f)',
        color:'#fff',
        borderRadius:14,
        padding:'24px 28px',
        marginBottom:20,
      }}>
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:18, flexWrap:'wrap'}}>
          <div style={{minWidth:0, flex:1}}>
            <div className="page-breadcrumb" style={{color:'rgba(255,255,255,.7)', fontSize:11, marginBottom:8}}>
              <span style={{color:'rgba(255,255,255,.85)'}}>Backoffice</span>
              <span style={{margin:'0 6px'}}>›</span>
              <span style={{color:'rgba(255,255,255,.85)'}}>Job Vacancies</span>
              <span style={{margin:'0 6px'}}>›</span>
              <span>{job.id}</span>
            </div>
            <h1 style={{fontSize:26, fontWeight:800, letterSpacing:'-.01em', margin:0}}>{job.title}</h1>
            <div style={{marginTop:10, display:'flex', gap:14, flexWrap:'wrap', fontSize:13, color:'rgba(255,255,255,.8)'}}>
              <span style={{display:'inline-flex', alignItems:'center', gap:5}}><Layers size={13}/> {job.department}</span>
              <span style={{display:'inline-flex', alignItems:'center', gap:5}}><MapPin size={13}/> {job.location}</span>
              <span style={{display:'inline-flex', alignItems:'center', gap:5}}><Briefcase size={13}/> {job.type} · {job.mode}</span>
              {job.experienceYears && <span style={{display:'inline-flex', alignItems:'center', gap:5}}><Award size={13}/> {job.experienceYears}y experience</span>}
              {job.deadline && <span style={{display:'inline-flex', alignItems:'center', gap:5}}><Calendar size={13}/> Deadline {job.deadline}</span>}
            </div>
            <div style={{marginTop:12, display:'flex', gap:8, alignItems:'center'}}>
              <span className={`badge ${statusColor(job.status)}`} style={{padding:'4px 10px'}}>{job.status}</span>
              <span style={{fontSize:11, color:'rgba(255,255,255,.7)'}}>ID: <b style={{color:'#fff', fontFamily:'monospace'}}>{job.id}</b></span>
            </div>
          </div>

          {/* Headcount card */}
          <div style={{
            background:'rgba(255,255,255,0.08)',
            border:'1px solid rgba(255,255,255,0.18)',
            borderRadius:12,
            padding:'14px 18px',
            minWidth:200,
          }}>
            <div style={{fontSize:10, fontWeight:700, color:'rgba(255,255,255,.7)', textTransform:'uppercase', letterSpacing:'.08em'}}>Headcount filled</div>
            <div style={{fontSize:26, fontWeight:800, marginTop:4, display:'flex', alignItems:'center', gap:8}}>
              {acceptedOffers}<span style={{fontSize:14, fontWeight:600, color:'rgba(255,255,255,.5)'}}>/ {job.headcount}</span>
              {isFilled && <span style={{fontSize:9, fontWeight:800, padding:'2px 7px', borderRadius:4, background:'#10b981', color:'#fff', letterSpacing:'.05em'}}>FILLED</span>}
              {!isFilled && filledRatio >= 0.7 && <span style={{fontSize:9, fontWeight:800, padding:'2px 7px', borderRadius:4, background:'#f59e0b', color:'#fff', letterSpacing:'.05em'}}>NEARLY</span>}
            </div>
            <div style={{height:5, background:'rgba(255,255,255,.15)', borderRadius:3, marginTop:8, overflow:'hidden'}}>
              <div style={{
                width:`${Math.min(100, Math.round(filledRatio * 100))}%`,
                height:'100%',
                background: isFilled ? '#10b981' : filledRatio >= 0.7 ? '#f59e0b' : 'var(--brand)',
              }}/>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{marginTop:18, display:'flex', gap:8, flexWrap:'wrap'}}>
          <button className="btn btn-brand btn-sm" onClick={() => navigate(`/backoffice/jobs?edit=${job.id}`)}>
            <Pencil size={13}/> Edit vacancy
          </button>
          {job.status === 'Draft' && (
            <button className="btn btn-success btn-sm" onClick={publish}>
              <Globe size={13}/> Publish
            </button>
          )}
          {job.status === 'Published' && (
            <button className="btn btn-danger btn-sm" onClick={close}>
              <Archive size={13}/> Close
            </button>
          )}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{display:'grid', gridTemplateColumns:'minmax(0, 1fr) 320px', gap:22, alignItems:'flex-start'}}>
        {/* Main column */}
        <div>
          {job.summary && (
            <div className="data-panel" style={{padding:'18px 22px'}}>
              <h3 style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8}}>Summary</h3>
              <p style={{fontSize:14, color:'var(--text-primary)', lineHeight:1.65, margin:0}}>{job.summary}</p>
            </div>
          )}

          {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
            <div className="data-panel" style={{padding:'18px 22px', marginTop:14}}>
              <ListBlock title="Responsibilities" items={job.responsibilities} accent="#3b82f6"/>
            </div>
          )}
          {Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <div className="data-panel" style={{padding:'18px 22px', marginTop:14}}>
              <ListBlock title="Requirements" items={job.requirements} accent="#f59e0b"/>
            </div>
          )}
          {Array.isArray(job.benefits) && job.benefits.length > 0 && (
            <div className="data-panel" style={{padding:'18px 22px', marginTop:14}}>
              <ListBlock title="What we offer" items={job.benefits} accent="#10b981"/>
            </div>
          )}

          {/* Candidate pipeline — embedded inside the page per business
              review (May 2026). All candidate controls are driven from
              here. */}
          <div className="data-panel" style={{padding:'18px 22px', marginTop:14}}>
            <VacancyCandidates vacancy={job} showAnalytics={true}/>
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{display:'flex', flexDirection:'column', gap:14, position:'sticky', top:20}}>
          {/* Role at a glance */}
          <div className="data-panel" style={{padding:'18px 20px'}}>
            <h3 style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:12}}>Role at a glance</h3>
            <div style={{display:'flex', flexDirection:'column', gap:10, fontSize:13}}>
              {[
                ['Department', job.department],
                ['Location', job.location],
                ['Type', job.type],
                ['Mode', job.mode],
                ['Experience', job.experienceYears ? `${job.experienceYears} years` : '—'],
                ['Posted', job.created || '—'],
                ['Deadline', job.deadline || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--border)', paddingBottom:6, fontSize:12}}>
                  <span style={{color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em', fontSize:10, fontWeight:700}}>{k}</span>
                  <span style={{fontWeight:600, color:'var(--text-primary)'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Salary band — HR-internal */}
          {job.salaryBand && (job.salaryBand.min || job.salaryBand.max || job.salaryBand.commission) && (
            <div style={{padding:'14px 18px', background:'var(--brand-tint)', border:'1px solid #fed7aa', borderRadius:12}}>
              <h3 style={{fontSize:11, fontWeight:700, color:'#9a3412', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8, display:'flex', alignItems:'center', gap:6}}>
                <Award size={12}/> Salary band · HR-internal
              </h3>
              {(job.salaryBand.min || job.salaryBand.max) && (
                <div style={{fontSize:14, fontWeight:700, color:'var(--text-primary)'}}>
                  EGP {(job.salaryBand.min || 0).toLocaleString()}{' – '}{(job.salaryBand.max || 0).toLocaleString()} <span style={{fontSize:11, fontWeight:500, color:'var(--text-tertiary)'}}>/ month</span>
                </div>
              )}
              {job.salaryBand.commission && (
                <div style={{fontSize:12, color:'#7c2d12', marginTop:8, lineHeight:1.5}}>{job.salaryBand.commission}</div>
              )}
            </div>
          )}

          {/* Public link hint */}
          {job.status === 'Published' && (
            <div style={{padding:'12px 14px', background:'#f0fdf4', border:'1px solid #86efac', borderRadius:10, fontSize:11, color:'#166534'}}>
              <b>Live on careers page.</b> Public URL: <span style={{fontFamily:'monospace'}}>/careers/{job.id}</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
