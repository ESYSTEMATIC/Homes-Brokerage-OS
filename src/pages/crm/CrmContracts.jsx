import React, { useState, useMemo } from 'react';
import { CONTRACTS, CONTRACT_STAGES } from '../../data/staticData';
import { useApp } from '../../context/AppContext';
import { Plus, X, Eye, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-EG').format(n);
const stageColor = s => s==='Registered'?'badge-success':s==='Signed'?'badge-info':s==='Under Review'?'badge-warning':'badge-gray';
const stageIcon = s => s==='Registered'?<CheckCircle size={14} color="#10b981"/>:s==='Signed'?<FileText size={14} color="var(--info)"/>:s==='Under Review'?<Clock size={14} color="var(--warning)"/>:<AlertCircle size={14} color="var(--text-tertiary)"/>;

export const CrmContracts = () => {
  const { toast, openDrawer } = useApp();
  const [fStage, setFStage] = useState('All');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(()=>CONTRACTS.filter(c=>fStage==='All'||c.stage===fStage),[fStage]);

  const stats = {total:CONTRACTS.length, draft:CONTRACTS.filter(c=>c.stage==='Draft').length, review:CONTRACTS.filter(c=>c.stage==='Under Review').length, signed:CONTRACTS.filter(c=>c.stage==='Signed').length, registered:CONTRACTS.filter(c=>c.stage==='Registered').length};
  const totalValue = CONTRACTS.reduce((s,c)=>s+c.value,0);

  const viewDetail = c => openDrawer({title:`Contract ${c.id}`,subtitle:`${c.project} — ${c.unitCode}`,content:(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {/* Stage Progress */}
      <div style={{display:'flex',gap:4,marginBottom:8}}>
        {CONTRACT_STAGES.map((s,i)=>{const active=CONTRACT_STAGES.indexOf(c.stage)>=i;return(
          <div key={s} style={{flex:1,textAlign:'center'}}>
            <div style={{height:4,borderRadius:4,background:active?'var(--brand)':'#e2e8f0',marginBottom:6}}/>
            <div style={{fontSize:10,fontWeight:active?700:400,color:active?'var(--brand)':'var(--text-tertiary)'}}>{s}</div>
          </div>
        );})}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[['Deal ID',c.dealId],['Lead',c.leadName],['Project',c.project],['Unit Code',c.unitCode],['Contract Value',`EGP ${fmt(c.value)}`],['Down Payment',`EGP ${fmt(c.downPayment)} (${c.downPct}%)`],['Installments',`${c.installments} months`],['Monthly',`EGP ${fmt(c.monthlyInstall)}`],['Created',c.createdDate],['Signed',c.signDate||'—'],['Lawyer',c.lawyer||'—'],['Stage',null]].map(([k,v])=>v!==null?(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>):(<div key={k}><div className="drawer-label">{k}</div><span className={`badge ${stageColor(c.stage)}`}>{stageIcon(c.stage)} {c.stage}</span></div>))}
      </div>
      {c.notes&&<div><div className="drawer-label">Notes</div><div style={{fontSize:13,background:'#f8fafc',padding:14,borderRadius:10,border:'1px solid var(--border)',lineHeight:1.6}}>{c.notes}</div></div>}
      {/* Payment Schedule */}
      <div><div className="drawer-label" style={{marginBottom:8}}>Payment Schedule</div>
        <div style={{background:'#f8fafc',borderRadius:10,border:'1px solid var(--border)',padding:16}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,fontSize:12,fontWeight:600}}>
            <span>Down Payment</span><span style={{color:'var(--brand)'}}>EGP {fmt(c.downPayment)}</span>
          </div>
          <div style={{height:8,background:'#e2e8f0',borderRadius:8,overflow:'hidden',marginBottom:12}}>
            <div style={{width:`${c.downPct}%`,height:'100%',background:'var(--brand)',borderRadius:8}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,fontSize:11,color:'var(--text-secondary)'}}>
            <div><div style={{fontWeight:600}}>Remaining</div>EGP {fmt(c.value-c.downPayment)}</div>
            <div><div style={{fontWeight:600}}>Installments</div>{c.installments} months</div>
            <div><div style={{fontWeight:600}}>Monthly</div>EGP {fmt(c.monthlyInstall)}</div>
          </div>
        </div>
      </div>
    </div>
  )});

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Contracts</span></div><h1 className="page-title">Contracts</h1><p className="page-subtitle">Contract lifecycle management — from draft to registration</p></div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,marginBottom:24}}>
        {[['Total Contracts',stats.total,'var(--info)'],['Draft',stats.draft,'var(--text-tertiary)'],['Under Review',stats.review,'var(--warning)'],['Signed',stats.signed,'var(--info)'],['Registered',stats.registered,'var(--success)']].map(([l,v,c])=>(
          <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'14px 18px',borderTop:`3px solid ${c}`}}><div style={{fontSize:11,color:'var(--text-secondary)',fontWeight:600}}>{l}</div><div style={{fontSize:22,fontWeight:800,marginTop:4}}>{v}</div></div>
        ))}
      </div>

      <div style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)',borderRadius:14,padding:'20px 28px',color:'#fff',marginBottom:20,display:'flex',alignItems:'center',gap:20}}>
        <FileText size={28} color="#E8672A"/>
        <div style={{flex:1}}><div style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>Total Contract Value</div><div style={{fontSize:26,fontWeight:800}}>EGP {fmt(totalValue)}</div></div>
        <div style={{textAlign:'right'}}><div style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>Avg Down Payment</div><div style={{fontSize:18,fontWeight:700}}>{(CONTRACTS.reduce((s,c)=>s+c.downPct,0)/CONTRACTS.length).toFixed(0)}%</div></div>
      </div>

      <div style={{display:'flex',gap:12,marginBottom:20,alignItems:'center'}}>
        <select className="filter-select" value={fStage} onChange={e=>setFStage(e.target.value)}><option value="All">All Stages</option>{CONTRACT_STAGES.map(s=><option key={s}>{s}</option>)}</select>
        <div style={{flex:1}}/>
        <button className="btn btn-brand" onClick={()=>setShowAdd(true)}><Plus size={16}/> New Contract</button>
      </div>

      <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Deal</th><th>Lead</th><th>Project</th><th>Unit</th><th>Value</th><th>Down Payment</th><th>Monthly</th><th>Stage</th><th>Sign Date</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map(c=>(
          <tr key={c.id}>
            <td className="muted" style={{fontSize:11}}>{c.id}</td>
            <td className="muted">{c.dealId}</td>
            <td className="bold">{c.leadName}</td>
            <td className="muted">{c.project}</td>
            <td className="muted" style={{fontSize:11}}>{c.unitCode}</td>
            <td className="bold">EGP {fmt(c.value)}</td>
            <td className="muted">EGP {fmt(c.downPayment)} ({c.downPct}%)</td>
            <td className="muted">EGP {fmt(c.monthlyInstall)}</td>
            <td><span className={`badge ${stageColor(c.stage)}`}>{stageIcon(c.stage)} {c.stage}</span></td>
            <td className="muted">{c.signDate||'—'}</td>
            <td><button className="btn-icon" onClick={()=>viewDetail(c)}><Eye size={14}/></button></td>
          </tr>
        ))}</tbody></table></div></div>

      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}><div className="modal-header"><h3>Create New Contract</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
        <div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="form-group"><label>Link to Deal</label><select><option>Select Deal…</option><option>D-501 — Sara Ali</option><option>D-504 — Mohamed Hassan</option></select></div>
          <div className="form-group"><label>Unit Code</label><input type="text" placeholder="e.g. PH-NC-V101"/></div>
          <div className="form-group"><label>Contract Value (EGP)</label><input type="number" placeholder="e.g. 8500000"/></div>
          <div className="form-group"><label>Down Payment %</label><input type="number" placeholder="e.g. 10"/></div>
          <div className="form-group"><label>Installments (months)</label><input type="number" placeholder="e.g. 84"/></div>
          <div className="form-group"><label>Lawyer</label><input type="text" placeholder="e.g. Mahmoud Samy"/></div>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Notes</label><textarea rows={3} placeholder="Contract notes…"/></div>
        </div>
        <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-brand" onClick={()=>{toast('Contract created','success');setShowAdd(false);}}>Create Contract</button></div></div></div>}
    </div>
  );
};
