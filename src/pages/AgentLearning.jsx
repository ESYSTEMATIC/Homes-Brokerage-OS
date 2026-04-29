import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Play, Lock, ExternalLink } from 'lucide-react';

export const AgentLearning = () => {
  const { state, updateItem, openConfirm, openModal, toast, writeAudit } = useApp();
  const required = state.training.filter(c=>c.required);
  const optional = state.training.filter(c=>!c.required);
  const completed = required.filter(c=>c.status==='Completed').length;

  const launchViva = (c) => {
    toast(`Opening ${c.title} in Viva Learning…`, 'info');
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
    title: `Start "${c.title}"?`, message: 'You will be redirected to Microsoft Viva Learning. Progress will sync back automatically.',
    onConfirm: () => launchViva(c),
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Learning Center</h1>
          <p className="page-subtitle">Track your training progress and certifications via Microsoft Viva.</p>
        </div>
        <div className="kpi-card" style={{ padding: '12px 24px', minWidth: 200 }}>
          <div style={{ flex: 1 }}>
            <div className="kpi-label">Required Courses</div>
            <div className="kpi-value" style={{ fontSize: 24 }}>{completed}/{required.length}</div>
          </div>
          <div className="kpi-icon green">
            <GraduationCap size={20} />
          </div>
        </div>
      </div>

      <div className="section-header" style={{ marginBottom: 16 }}>
        <h3 className="section-title">Required Courses</h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Mandatory for CRM & MLS activation</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {required.map(c => (
          <div className="course-card" key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#fff', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
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
              {c.status==='Completed'?<span className="badge badge-success">Completed</span>:
               c.status==='Locked'?<span style={{fontSize:13,color:'var(--text-tertiary)'}}>Locked</span>:
               <button className="btn btn-outline btn-sm" onClick={()=>launchViva(c)}><ExternalLink size={14}/>Continue in Viva</button>}
            </div>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ marginBottom: 16 }}>
        <h3 className="section-title">Professional Development</h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Optional growth courses</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {optional.map(c => (
          <div className="course-card" key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#fff', borderRadius: 16, border: '1px solid var(--card-border)', opacity: 0.9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--content-bg)', color: 'var(--text-secondary)' }}>
                <Play size={20} fill="currentColor" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                  <div className="progress-bar" style={{ width: 100, height: 4 }}><div className="progress-fill blue" style={{ width: `${c.progress}%` }}></div></div>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{c.progress}% complete</span>
                </div>
              </div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={()=>c.progress>0 ? launchViva(c) : startCourse(c)}>{c.progress>0?'Continue':'Start'}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

