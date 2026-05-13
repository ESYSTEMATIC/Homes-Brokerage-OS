import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Play, Lock, ExternalLink, GraduationCap } from 'lucide-react';

// "Homes Academy" — formerly branded Microsoft Viva. The catalog is split into
// Mandatory (required:true) and Optional (required:false) tabs per the 08-May
// stakeholder review. Course progression still drives the BRD §6.1 training
// gates that unlock CRM and Matrix EGMLS for agents.
export const AgentLearning = () => {
  const { state, updateItem, openConfirm, toast, writeAudit } = useApp();
  const [tab, setTab] = useState('mandatory'); // mandatory | optional
  const required = state.training.filter(c=>c.required);
  const optional = state.training.filter(c=>!c.required);
  const completed = required.filter(c=>c.status==='Completed').length;
  const optCompleted = optional.filter(c=>c.status==='Completed').length;
  const courses = tab === 'mandatory' ? required : optional;

  const launchCourse = (c) => {
    toast(`Opening ${c.title} in Homes Academy…`, 'info');
    writeAudit('Course Opened', c.id, 'Training', c.title);
    // simulate progress bump
    if (c.progress < 100) {
      setTimeout(() => {
        const newProgress = Math.min(100, c.progress + 15);
        const newStatus = newProgress >= 100 ? 'Completed' : 'In Progress';
        updateItem('training', c.id, { progress: newProgress, status: newStatus, score: newStatus === 'Completed' ? 90 : c.score }, { action: 'Course Progress', module: 'Training', target: c.id, detail: `${c.progress}% → ${newProgress}%` });
        toast(`${c.title} → ${newProgress}%`);
      }, 800);
    }
  };

  const startCourse = (c) => openConfirm({
    title: `Start "${c.title}"?`, message: 'You will open Homes Academy in this workspace. Progress and quiz scores sync back to your training record.',
    onConfirm: () => launchCourse(c),
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Homes Academy</h1>
          <p className="page-subtitle">Mandatory and optional courses. Completion of mandatory training gates CRM access (BRD §6.1).</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <div className="kpi-card" style={{ padding: '10px 18px', minWidth: 160 }}>
            <div style={{ flex: 1 }}>
              <div className="kpi-label">Mandatory</div>
              <div className="kpi-value" style={{ fontSize: 22 }}>{completed}/{required.length}</div>
            </div>
            <div className="kpi-icon green"><GraduationCap size={18} /></div>
          </div>
          <div className="kpi-card" style={{ padding: '10px 18px', minWidth: 160 }}>
            <div style={{ flex: 1 }}>
              <div className="kpi-label">Optional</div>
              <div className="kpi-value" style={{ fontSize: 22 }}>{optCompleted}/{optional.length}</div>
            </div>
            <div className="kpi-icon blue"><GraduationCap size={18} /></div>
          </div>
        </div>
      </div>

      {/* Tabs: Mandatory · Optional */}
      <div style={{display:'flex',gap:6,marginBottom:20,borderBottom:'1px solid var(--border)'}}>
        {[
          { key: 'mandatory', label: 'Mandatory', count: required.length },
          { key: 'optional',  label: 'Optional',  count: optional.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700,
              color: tab === t.key ? 'var(--brand)' : 'var(--text-secondary)',
              borderBottom: tab === t.key ? '2px solid var(--brand)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {t.label} <span style={{fontSize:11,fontWeight:600,opacity:.7,marginLeft:4}}>({t.count})</span>
          </button>
        ))}
      </div>

      {tab === 'mandatory' && (
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Required for CRM &amp; MLS activation. Complete all mandatory courses to unlock federated systems.</p>
      )}
      {tab === 'optional' && (
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Professional development — recommended but not required for system access.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {courses.map(c => (
          <div className="course-card" key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#fff', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: tab==='mandatory' ? 'var(--card-shadow)' : 'none', opacity: tab==='optional' ? 0.95 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div className={`course-card-icon ${c.status === 'Completed' ? 'done' : c.status === 'Locked' ? 'locked' : 'progress'}`} style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.status === 'Completed' ? 'var(--success-light)' : c.status === 'Locked' ? 'var(--content-bg)' : 'var(--accent-light)', color: c.status === 'Completed' ? 'var(--success)' : c.status === 'Locked' ? 'var(--text-tertiary)' : 'var(--accent)' }}>
                {c.status === 'Completed' ? <CheckCircle size={20} /> : c.status === 'Locked' ? <Lock size={20} /> : <Play size={20} fill="currentColor" />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{c.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
                  <div className="progress-bar" style={{ width: 120, height: 6 }}><div className={`progress-fill ${c.status === 'Completed' ? 'green' : 'blue'}`} style={{ width: `${c.progress}%` }}></div></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{c.progress}%</span>
                  {c.score && <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>Score: {c.score}%</span>}
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Due: {c.due}</span>
                </div>
              </div>
            </div>
            <div>
              {c.status==='Completed' ? <span className="badge badge-success">Completed</span>
               : c.status==='Locked' ? <span style={{fontSize:13,color:'var(--text-tertiary)'}}>Locked</span>
               : c.progress > 0
                 ? <button className="btn btn-outline btn-sm" onClick={()=>launchCourse(c)}><ExternalLink size={14}/> Continue</button>
                 : <button className="btn btn-primary btn-sm" onClick={()=>startCourse(c)}><Play size={13}/> Start</button>}
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div style={{padding:'32px 20px',textAlign:'center',color:'var(--text-tertiary)',fontSize:13}}>No {tab} courses assigned.</div>
        )}
      </div>
    </div>
  );
};

