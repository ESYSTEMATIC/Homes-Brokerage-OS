import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, Eye, X, LayoutGrid, List, GripVertical } from 'lucide-react';

const DEAL_STAGES = ['Qualified','Negotiation','Reservation','Contracting','Closed Won','Closed Lost'];
const stageColors = {'Qualified':'#3b82f6','Negotiation':'#f59e0b','Reservation':'#E8672A','Contracting':'#8b5cf6','Closed Won':'#10b981','Closed Lost':'#ef4444'};
const fmt = n => new Intl.NumberFormat('en-EG').format(n);

export const CrmDeals = () => {
  const { state, addItem, updateItem, removeItem, toast, openDrawer } = useApp();
  const deals = state.deals;
  const [view, setView] = useState('kanban');
  const [showAdd, setShowAdd] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const def = {title:'',leadName:'',project:'',value:'',stage:'Qualified',owner:'Fatma Ibrahim',commission:3,status:'Active'};
  const [form, setForm] = useState(def);

  const grouped = useMemo(()=>{
    const g = {};
    DEAL_STAGES.forEach(s=>g[s]=[]);
    deals.forEach(d=>{if(g[d.stage])g[d.stage].push(d);});
    return g;
  },[deals]);

  const totalPipeline = deals.filter(d=>d.status==='Active').reduce((s,d)=>s+d.value,0);
  const openAdd2=()=>{setForm(def);setEditDeal(null);setShowAdd(true);};
  const openEdit=d=>{setForm({title:d.title||'',leadName:d.leadName||'',project:d.project||'',value:d.value||'',stage:d.stage||'Qualified',owner:d.owner||'',commission:d.commission||3,status:d.status||'Active'});setEditDeal(d);setShowAdd(true);};
  const handleSubmit=e=>{e.preventDefault();if(!form.title.trim()){toast('Title is required','error');return;}if(editDeal){updateItem('deals',editDeal.id,{...form,value:Number(form.value)||0,commission:Number(form.commission)||0});toast('Deal updated','success');}else{addItem('deals',{...form,value:Number(form.value)||0,commission:Number(form.commission)||0,created:new Date().toISOString().split('T')[0]});toast('Deal created','success');}setShowAdd(false);};
  const handleDel=id=>{removeItem('deals',id);toast('Deal deleted','success');};
  const moveStage=(d,newStage)=>{updateItem('deals',d.id,{stage:newStage,status:newStage==='Closed Lost'?'Lost':newStage==='Closed Won'?'Won':'Active'});toast(`Moved to ${newStage}`,'success');};

  const viewDetail = d => openDrawer({title:d.title,subtitle:`Deal · ${d.id}`,content:(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {[['Lead',d.leadName],['Project',d.project],['Value',`EGP ${fmt(d.value)}`],['Commission',`${d.commission}%`],['Est. Commission',`EGP ${fmt(d.value*d.commission/100)}`],['Owner',d.owner],['Created',d.created||'—']].map(([k,v])=>(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v||'—'}</div></div>))}
        <div><div className="drawer-label">Stage</div><span className="badge" style={{background:`${stageColors[d.stage]}20`,color:stageColors[d.stage]}}>{d.stage}</span></div>
        <div><div className="drawer-label">Status</div><span className={`badge ${d.status==='Active'?'badge-success':d.status==='Won'?'badge-info':'badge-danger'}`}>{d.status}</span></div>
      </div>
      <div style={{borderTop:'1px solid var(--border)',paddingTop:16}}>
        <div className="drawer-label" style={{marginBottom:8}}>Move to Stage</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{DEAL_STAGES.filter(s=>s!==d.stage).map(s=><button key={s} className="btn btn-sm btn-outline" onClick={()=>moveStage(d,s)} style={{fontSize:11}}>{s}</button>)}</div>
      </div>
      <div style={{display:'flex',gap:8}}><button className="btn btn-sm btn-brand" onClick={()=>openEdit(d)}><Edit size={13}/> Edit</button><button className="btn btn-sm btn-outline" style={{color:'var(--danger)'}} onClick={()=>handleDel(d.id)}><Trash2 size={13}/> Delete</button></div>
    </div>
  )});

  return (
    <div>
      <div className="page-header"><div className="page-breadcrumb"><span>CRM</span><span>&gt;</span><span className="current">Deals</span></div><h1 className="page-title">Deals Pipeline</h1><p className="page-subtitle">Track and manage your sales pipeline · Total pipeline: <strong>EGP {fmt(totalPipeline)}</strong></p></div>
      <div style={{display:'flex',gap:12,marginBottom:20,alignItems:'center'}}>
        <div style={{display:'flex',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden'}}>
          <button className={`btn btn-sm ${view==='kanban'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('kanban')}><LayoutGrid size={14}/> Board</button>
          <button className={`btn btn-sm ${view==='table'?'btn-brand':'btn-outline'}`} style={{borderRadius:0,border:0}} onClick={()=>setView('table')}><List size={14}/> Table</button>
        </div>
        <div style={{flex:1}}/>
        <button className="btn btn-brand" onClick={openAdd2}><Plus size={16}/> Add Deal</button>
      </div>

      {view==='kanban' ? (
        <div className="crm-kanban">
          {DEAL_STAGES.map(stage=>(
            <div className="crm-kanban-column" key={stage}>
              <div className="crm-kanban-header">
                <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:'50%',background:stageColors[stage]}}/><span style={{fontWeight:700,fontSize:13}}>{stage}</span></div>
                <span style={{fontSize:12,fontWeight:700,color:'var(--text-secondary)',background:'#f4f7fe',padding:'2px 8px',borderRadius:10}}>{grouped[stage].length}</span>
              </div>
              <div className="crm-kanban-cards">
                {grouped[stage].length===0 ? <div style={{padding:'24px 0',textAlign:'center',fontSize:12,color:'var(--text-tertiary)'}}>No deals</div> :
                grouped[stage].map(d=>(
                  <div className="crm-kanban-card" key={d.id} onClick={()=>viewDetail(d)}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                      <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.title}</div>
                      <GripVertical size={14} style={{color:'var(--text-tertiary)',flexShrink:0}}/>
                    </div>
                    <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:6}}>{d.leadName || '—'} · {d.project}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:14,fontWeight:800,color:'var(--brand)'}}>EGP {fmt(d.value)}</span>
                      <span style={{fontSize:11,color:'var(--text-tertiary)'}}>{d.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Title</th><th>Lead</th><th>Project</th><th>Value</th><th>Stage</th><th>Commission</th><th>Owner</th><th>Actions</th></tr></thead>
          <tbody>{deals.map(d=>(
            <tr key={d.id}>
              <td className="muted" style={{fontSize:11}}>{d.id}</td>
              <td className="bold clickable" onClick={()=>viewDetail(d)}>{d.title}</td>
              <td className="muted">{d.leadName||'—'}</td>
              <td className="muted">{d.project}</td>
              <td className="bold">EGP {fmt(d.value)}</td>
              <td><span className="badge" style={{background:`${stageColors[d.stage]}20`,color:stageColors[d.stage]}}>{d.stage}</span></td>
              <td className="muted">{d.commission}%</td>
              <td className="muted">{d.owner}</td>
              <td><div style={{display:'flex',gap:6}}><button className="btn-icon" onClick={()=>viewDetail(d)}><Eye size={14}/></button><button className="btn-icon" onClick={()=>openEdit(d)}><Edit size={14}/></button><button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>handleDel(d.id)}><Trash2 size={14}/></button></div></td>
            </tr>
          ))}</tbody></table></div></div>
      )}

      {showAdd&&<div className="modal-overlay" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}><div className="modal-header"><h3>{editDeal?'Edit Deal':'Add New Deal'}</h3><button className="btn-icon" onClick={()=>setShowAdd(false)}><X size={18}/></button></div>
        <form onSubmit={handleSubmit}><div className="modal-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="form-group" style={{gridColumn:'span 2'}}><label>Deal Title *</label><input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="form-group"><label>Lead Name</label><input type="text" value={form.leadName} onChange={e=>setForm({...form,leadName:e.target.value})}/></div>
          <div className="form-group"><label>Project</label><input type="text" value={form.project} onChange={e=>setForm({...form,project:e.target.value})}/></div>
          <div className="form-group"><label>Value (EGP)</label><input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/></div>
          <div className="form-group"><label>Commission %</label><input type="number" value={form.commission} onChange={e=>setForm({...form,commission:e.target.value})} step="0.5"/></div>
          <div className="form-group"><label>Stage</label><select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>{DEAL_STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="form-group"><label>Owner</label><input type="text" value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})}/></div>
        </div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-brand">{editDeal?'Update':'Create'} Deal</button></div></form></div></div>}
    </div>
  );
};
