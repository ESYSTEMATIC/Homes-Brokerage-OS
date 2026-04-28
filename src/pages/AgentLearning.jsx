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
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div><h1 className="page-title">Learning</h1><p className="page-subtitle">Track your training progress from Microsoft Viva Learning.</p></div>
        <div style={{background:'#fff',border:'1px solid var(--card-border)',borderRadius:12,padding:'16px 24px',textAlign:'center'}}>
          <div style={{fontSize:28,fontWeight:800}}>{completed}/{required.length}</div>
          <div className="progress-bar" style={{width:80,margin:'8px auto 4px'}}><div className="progress-fill green" style={{width:`${(completed/required.length)*100}%`}}></div></div>
          <div style={{fontSize:12,color:'var(--text-secondary)'}}>Completed</div>
        </div>
      </div>

      <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Required Courses</div>
      <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
        {required.map(c=>(
          <div className="course-card" key={c.id}>
            <div className="course-card-left">
              <div className={`course-card-icon ${c.status==='Completed'?'done':c.status==='Locked'?'locked':'progress'}`}>
                {c.status==='Completed'?<CheckCircle size={18}/>:c.status==='Locked'?<Lock size={18}/>:<Play size={18}/>}
              </div>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{c.title}</div>
                <div style={{display:'flex',alignItems:'center',gap:12,marginTop:4}}>
                  <div className="progress-bar" style={{width:100}}><div className={`progress-fill ${c.status==='Completed'?'green':c.progress>50?'blue':'amber'}`} style={{width:`${c.progress}%`}}></div></div>
                  <span style={{fontSize:12,color:'var(--text-secondary)'}}>{c.progress}%</span>
                  {c.score&&<span style={{fontSize:12,color:'var(--success)',fontWeight:600}}>Score: {c.score}%</span>}
                  <span style={{fontSize:12,color:'var(--text-tertiary)'}}>Due: {c.due}</span>
                </div>
                {c.status==='Locked'&&<div style={{fontSize:11,color:'var(--warning)',marginTop:4}}>Requires Matrix EGMLS access to unlock.</div>}
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

      <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Optional Courses</div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {optional.map(c=>(
          <div className="course-card" key={c.id}>
            <div className="course-card-left">
              <div className={`course-card-icon ${c.progress>0?'progress':'locked'}`}>{c.progress>0?<Play size={18}/>:<Lock size={18}/>}</div>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{c.title}</div>
                <div style={{display:'flex',alignItems:'center',gap:12,marginTop:4}}>
                  <div className="progress-bar" style={{width:100}}><div className="progress-fill blue" style={{width:`${c.progress}%`}}></div></div>
                  <span style={{fontSize:12,color:'var(--text-secondary)'}}>{c.progress}%</span>
                  <span style={{fontSize:12,color:'var(--text-tertiary)'}}>Due: {c.due}</span>
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
