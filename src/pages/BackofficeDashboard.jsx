import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, FileText, TrendingUp, DollarSign, Clock, Wallet, ReceiptText, Building, ArrowRight, FileWarning, ShieldAlert } from 'lucide-react';

const fmt = v => 'EGP ' + (v||0).toLocaleString();

export const BackofficeDashboard = () => {
  const { state, openDrawer, toast } = useApp();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('This Month');
  const [developer, setDeveloper] = useState('');
  const [project, setProject] = useState('');
  const [branch, setBranch] = useState('');

  const filtered = useMemo(() => state.deals.filter(d =>
    (!developer || d.developer === developer) &&
    (!project || d.project === project)
  ), [state.deals, developer, project]);

  const totalSales = filtered.reduce((s,d)=>s+d.value,0);
  const revenue = totalSales * 0.02;

  const counts = {
    pendingOnboarding: state.onboarding.filter(o=>!['Approved','Rejected'].includes(o.status)).length,
    missingDocs: state.documents.filter(d=>d.status==='Missing').length,
    trainingIncomplete: state.staff.filter(s=>s.status==='Pending').length + 3,
    accessBlocked: state.staff.filter(s=>s.status==='Suspended').length,
  };

  const developers = [...new Set(state.deals.map(d=>d.developer))];
  const projects = [...new Set(state.deals.map(d=>d.project))];

  const showQueue = (label, items, render) => openDrawer({
    title: label, subtitle: `${items.length} item(s)`,
    content: items.length === 0 ? <div className="empty-state">Nothing in queue.</div> : (
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {items.map(render)}
      </div>
    ),
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Homes Brokerage — Backoffice Control Cockpit</p>
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={period} onChange={e=>setPeriod(e.target.value)}>
          <option>This Month</option><option>Last Month</option><option>This Quarter</option><option>YTD</option>
        </select>
        <select className="filter-select" value={developer} onChange={e=>setDeveloper(e.target.value)}>
          <option value="">All Developers</option>{developers.map(d=><option key={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={project} onChange={e=>setProject(e.target.value)}>
          <option value="">All Projects</option>{projects.map(p=><option key={p}>{p}</option>)}
        </select>
        <select className="filter-select" value={branch} onChange={e=>setBranch(e.target.value)}>
          <option value="">All Branches</option>{state.branches.map(b=><option key={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div className="kpi-grid kpi-grid-5">
        <div className="kpi-card"><div><div className="kpi-label">Total Agents</div><div className="kpi-value">{state.staff.length}</div></div><div className="kpi-icon gray"><Users size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Active Agents</div><div className="kpi-value">{state.staff.filter(s=>s.status==='Active').length}</div><div className="kpi-change up">↑ +2 this month</div></div><div className="kpi-icon green"><UserCheck size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Pending Applications</div><div className="kpi-value">{counts.pendingOnboarding}</div></div><div className="kpi-icon amber"><FileText size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Total Sales</div><div className="kpi-value" style={{fontSize:22}}>{fmt(totalSales)}</div></div><div className="kpi-icon blue"><TrendingUp size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Company Revenue</div><div className="kpi-value" style={{fontSize:22}}>{fmt(revenue)}</div><div className="kpi-change up">↑ +12% vs last month</div></div><div className="kpi-icon green"><DollarSign size={20}/></div></div>
      </div>

      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Pending Commissions</div><div className="kpi-value" style={{fontSize:22}}>{fmt(state.commEngine.filter(c=>c.status==='Pending').reduce((s,c)=>s+c.pool,0))}</div></div><div className="kpi-icon amber"><Clock size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Paid Commissions</div><div className="kpi-value" style={{fontSize:22}}>{fmt(state.commEngine.filter(c=>c.status==='Paid').reduce((s,c)=>s+c.pool,0))}</div></div><div className="kpi-icon green"><Wallet size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Total Expenses</div><div className="kpi-value" style={{fontSize:22}}>{fmt(293000)}</div></div><div className="kpi-icon red"><ReceiptText size={20}/></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Net Result</div><div className="kpi-value" style={{fontSize:22}}>{fmt(revenue - 293000)}</div><div className="kpi-change up">↑ Profitable</div></div><div className="kpi-icon green"><Building size={20}/></div></div>
      </div>

      <div className="grid-2col" style={{marginTop:8}}>
        <div>
          <h2 className="section-title">Operational Queues</h2>
          <div className="grid-equal-2">
            <div className="queue-card" onClick={()=>navigate('/backoffice/onboarding')}>
              <div className="queue-card-left"><div className="kpi-icon amber"><FileText size={18}/></div><div className="queue-card-info"><h4>Pending Onboarding</h4><div className="queue-card-value">{counts.pendingOnboarding}</div></div></div>
              <ArrowRight size={16} color="#9ca3af"/>
            </div>
            <div className="queue-card" onClick={()=>navigate('/backoffice/documents')}>
              <div className="queue-card-left"><div className="kpi-icon red"><FileWarning size={18}/></div><div className="queue-card-info"><h4>Missing Documents</h4><div className="queue-card-value">{counts.missingDocs}</div></div></div>
              <ArrowRight size={16} color="#9ca3af"/>
            </div>
            <div className="queue-card" onClick={()=>navigate('/backoffice/training')}>
              <div className="queue-card-left"><div className="kpi-icon amber"><Clock size={18}/></div><div className="queue-card-info"><h4>Training Incomplete</h4><div className="queue-card-value">{counts.trainingIncomplete}</div></div></div>
              <ArrowRight size={16} color="#9ca3af"/>
            </div>
            <div className="queue-card" onClick={()=>showQueue('Access Blocked', state.staff.filter(s=>s.status==='Suspended'), s => (
              <div key={s.id} style={{padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8}}>
                <div style={{fontWeight:600,fontSize:13}}>{s.name}</div>
                <div style={{fontSize:11,color:'var(--text-tertiary)'}}>{s.id} · {s.title} · Suspended</div>
              </div>
            ))}>
              <div className="queue-card-left"><div className="kpi-icon red"><ShieldAlert size={18}/></div><div className="queue-card-info"><h4>Access Blocked</h4><div className="queue-card-value">{counts.accessBlocked}</div></div></div>
              <ArrowRight size={16} color="#9ca3af"/>
            </div>
          </div>
        </div>
        <div>
          <h2 className="section-title">Recent Audit Activity</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {state.audit.slice(0,3).map(a=>(
              <div key={a.id} className="alert-card warning">
                <span className="alert-card-text">{a.action}: {a.target}</span>
                <span className="alert-card-action" onClick={()=>navigate('/backoffice/audit')}>View</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
