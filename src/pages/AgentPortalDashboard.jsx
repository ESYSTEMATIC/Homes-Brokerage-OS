import React from 'react';
import { useApp } from '../context/AppContext';
import { TRAINING } from '../data/staticData';
import { Users, FileText, GraduationCap, FileCheck2, HelpCircle, ExternalLink, Lock, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

export const AgentPortalDashboard = () => {
  const { persona } = useApp();
  const completed = TRAINING.filter(c => c.status === 'Completed' && c.required).length;
  const total = TRAINING.filter(c => c.required).length;

  const handleAction = (title) => {
    alert(`Navigating to ${title}...`);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Welcome back, {persona.label.split(' ')[0]}</h1>
          <p className="page-subtitle">
            {persona.role || 'Licensed Agent'} · {persona.scope} · MLS ID: {persona.mls || 'EGMLS-287451'}
          </p>
        </div>
        <div className="badge badge-success" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> Approved Agent
        </div>
      </div>

      <div className="kpi-grid kpi-grid-5" style={{ marginBottom: 32 }}>
        {[
          { label: 'ONBOARDING', value: '78%', status: 'In Progress', color: 'warning' },
          { label: 'TRAINING', value: `${completed}/${total}`, status: 'In Progress', color: 'warning' },
          { label: 'CRM ACCESS', value: 'Pending', status: 'Locked', color: 'gray' },
          { label: 'MATRIX ID', value: 'Verified', status: 'Active', color: 'success' },
          { label: 'PROFILE', value: '85%', status: 'Excellent', color: 'info' }
        ].map((item) => (
          <div key={item.label} className="kpi-card" style={{ flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', padding: '20px' }}>
            <div className="kpi-label">{item.label}</div>
            <div className="kpi-value" style={{ fontSize: 24, margin: '8px 0' }}>{item.value}</div>
            <span className={`badge badge-${item.color}`}>{item.status}</span>
          </div>
        ))}
      </div>

      <div className="journey-bar" style={{ marginBottom: 32 }}>
        <h3 className="section-title">Onboarding Journey</h3>
        <div className="journey-steps">
          {[
            { label: 'Application', done: true },
            { label: 'Documents', done: true },
            { label: 'Agreement', done: true },
            { label: 'Training', current: true },
            { label: 'MLS Access', locked: true },
            { label: 'Go Live', locked: true }
          ].map((step, i, arr) => (
            <React.Fragment key={step.label}>
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

      <h3 className="section-title">Quick Access</h3>
      <div className="quick-grid" style={{ marginBottom: 32 }}>
        {[
          { icon: <Users size={20} />, title: 'CRM Portal', desc: 'Manage leads, contacts, and deal pipeline', status: 'Training required', locked: true },
          { icon: <FileText size={20} />, title: 'Matrix EGMLS', desc: 'MLS listings and property search', status: 'Verification pending', locked: true },
          { icon: <GraduationCap size={20} />, title: 'Homes Academy', desc: 'Required training and certifications', status: '3 courses remaining', locked: false },
          { icon: <FileCheck2 size={20} />, title: 'Documents', desc: 'Manage your personal and legal files', status: '7 of 9 uploaded', locked: false },
          { icon: <HelpCircle size={20} />, title: 'Support Center', desc: 'FAQs and onboarding guides', status: 'Help desk active', locked: false },
        ].map(card => (
          <div className="quick-card" key={card.title} onClick={() => !card.locked && handleAction(card.title)} style={{ opacity: card.locked ? 0.8 : 1 }}>
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
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Active Leads</div>
            <div className="kpi-value">0</div>
          </div>
          <div className="kpi-icon orange"><Users size={24} /></div>
        </div>
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Tasks Due</div>
            <div className="kpi-value">0</div>
          </div>
          <div className="kpi-icon gray"><FileText size={24} /></div>
        </div>
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Pipeline Value</div>
            <div className="kpi-value">EGP 0</div>
          </div>
          <div className="kpi-icon green"><TrendingUp size={24} /></div>
        </div>
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Earnings YTD</div>
            <div className="kpi-value">EGP 0</div>
          </div>
          <div className="kpi-icon blue"><DollarSign size={24} /></div>
        </div>
      </div>
    </div>
  );
};

