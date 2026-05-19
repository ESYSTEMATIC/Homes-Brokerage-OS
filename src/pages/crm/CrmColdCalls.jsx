// ═══════════════════════════════════════════════════════════════
// Cold Calls — multi-role module
// Stakeholder ask 08-May (item 10). Flow:
//   1. Marketing OR Sales Director imports a batch of cold-call contacts.
//   2. Sales Director assigns each record to a sales Agent.
//   3. Agent dials the number, logs outcome + comment.
//   4. Sales Director reviews "Called" records and decides:
//        Convert to Lead → auto-creates a Lead, auto-assigns to an Agent.
//        Not Lead         → closes the record with the rejection reason.
//
// Three role views are rendered from this single page:
//   • Marketing      → import-only view of their batches.
//   • Agent / TL     → "My Assignments" view (Log Call action).
//   • Mgr / Director → full module (Import, Assign, Review, Convert).
// ═══════════════════════════════════════════════════════════════
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Field, FieldRow } from '../../components/UI';
import {
  canImportColdCalls, canManageColdCalls, canSeeCrmModule, HIERARCHY, personaOwnerName,
} from '../../data/crmAccess';
import {
  PhoneCall, Upload, UserPlus, CheckCircle2, XCircle, Eye, Megaphone, Phone, Users, ArrowRight, ClipboardCheck,
} from 'lucide-react';
import { COLD_CALL_SOURCES } from '../../data/staticData';

const STATUS_COLOR = {
  New:       { bg:'#e2e8f0', fg:'#475569' },
  Assigned:  { bg:'#dbeafe', fg:'#1e40af' },
  Called:    { bg:'#fef3c7', fg:'#92400e' },
  Converted: { bg:'#dcfce7', fg:'#166534' },
  NotLead:   { bg:'#fee2e2', fg:'#991b1b' },
};
const StatusPill = ({ status }) => {
  const t = STATUS_COLOR[status] || STATUS_COLOR.New;
  return <span style={{display:'inline-block',padding:'3px 10px',borderRadius:999,background:t.bg,color:t.fg,fontSize:10,fontWeight:700,letterSpacing:'.04em',textTransform:'uppercase'}}>{status === 'NotLead' ? 'Not Lead' : status}</span>;
};

const CALL_OUTCOMES = ['Interested','Callback Later','Not Interested','Wrong Number','No Answer','Voicemail'];

// Pick the agent who receives an auto-assigned converted lead.
// Strategy: prefer the original cold-call agent (they did the work) →
// else round-robin within Team Alpha agents from the staff seed.
const pickConvertAgent = (call, staff = []) => {
  if (call.assignedAgent) return call.assignedAgent;
  const alphaAgents = staff.filter(s => s.department === 'Sales' && s.title?.includes('Sales Agent'));
  if (alphaAgents.length === 0) return 'Fatma Ibrahim';
  return alphaAgents[(call.id.charCodeAt(call.id.length-1) || 0) % alphaAgents.length].name;
};

export const CrmColdCalls = () => {
  const { state, addItem, updateItem, openModal, openConfirm, openDrawer, toast, writeAudit, persona, personaKey } = useApp();
  const canManage = canManageColdCalls(personaKey);             // Director / Manager / Admins
  const canImport = canImportColdCalls(personaKey);             // Marketing + Manage roles
  const isMarketing = personaKey === 'marketing';
  const isAgentScope = canSeeCrmModule(personaKey, 'coldCallsAssigned') && !canManage;
  const myName = personaOwnerName(personaKey);

  const [tab, setTab] = useState(canManage ? 'All' : isMarketing ? 'My Imports' : 'To Call');
  const [query, setQuery] = useState('');
  // Bulk-assign selection (managers only). Stores cold-call IDs.
  const [selected, setSelected] = useState(() => new Set());
  const toggleSel = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const clearSel = () => setSelected(new Set());

  const all = state.coldCalls || [];

  // Role-scoped slice
  const scoped = useMemo(() => {
    if (isMarketing) return all.filter(c => c.importedBy === (persona?.label || ''));
    if (isAgentScope) return all.filter(c => c.assignedAgent === myName);
    return all; // managers & directors see everything
  }, [all, isMarketing, isAgentScope, persona, myName]);

  const filtered = useMemo(() => scoped.filter(c => {
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.phone.includes(query) && !c.id.toLowerCase().includes(query.toLowerCase())) return false;
    if (tab === 'All' || tab === 'My Imports') return true;
    if (tab === 'To Call') return c.status === 'Assigned' && (isAgentScope ? c.assignedAgent === myName : true);
    if (tab === 'Called (Awaiting Review)') return c.status === 'Called';
    if (tab === 'My Called') return c.status === 'Called' && c.assignedAgent === myName;
    if (tab === 'Awaiting Assignment') return c.status === 'New';
    if (tab === 'Converted') return c.status === 'Converted';
    if (tab === 'Not Lead') return c.status === 'NotLead';
    return true;
  }), [scoped, query, tab, isAgentScope, myName]);

  // ── KPIs (per role) ──
  const kpis = useMemo(() => {
    if (isMarketing) {
      return [
        ['Imports', state.coldCallBatches?.filter(b => b.importedBy === persona?.label).length || 0, Upload],
        ['Records Imported', scoped.length, Phone],
        ['Awaiting Assignment', scoped.filter(c => c.status === 'New').length, ClipboardCheck],
        ['Converted to Lead', scoped.filter(c => c.status === 'Converted').length, CheckCircle2],
      ];
    }
    if (isAgentScope) {
      return [
        ['My Assignments', scoped.length, ClipboardCheck],
        ['To Call', scoped.filter(c => c.status === 'Assigned').length, PhoneCall],
        ['Awaiting Review', scoped.filter(c => c.status === 'Called').length, Eye],
        ['Converted', scoped.filter(c => c.status === 'Converted').length, CheckCircle2],
      ];
    }
    return [
      ['Total', all.length, Phone],
      ['Awaiting Assignment', all.filter(c => c.status === 'New').length, ClipboardCheck],
      ['Assigned (Pending Call)', all.filter(c => c.status === 'Assigned').length, PhoneCall],
      ['Called (Awaiting Review)', all.filter(c => c.status === 'Called').length, Eye],
      ['Converted', all.filter(c => c.status === 'Converted').length, CheckCircle2],
      ['Not Lead', all.filter(c => c.status === 'NotLead').length, XCircle],
    ];
  }, [isMarketing, isAgentScope, all, scoped, state.coldCallBatches, persona]);

  const tabs = canManage
    ? ['All','Awaiting Assignment','Called (Awaiting Review)','Converted','Not Lead']
    : isMarketing
      ? ['My Imports']
      : ['To Call','My Called','Converted'];

  // ── Actions ──
  const importBatch = () => openModal({
    title: 'Import Cold Calls', subtitle: 'Upload a CSV or paste contacts (simulated)',
    submitLabel: 'Import batch',
    body: (
      <>
        <FieldRow>
          <Field label="Source" name="source" type="select" required options={COLD_CALL_SOURCES} defaultValue="Facebook Lead Magnet" />
          <Field label="Records (count)" name="count" type="number" required defaultValue="5" placeholder="e.g. 25" />
        </FieldRow>
        <Field label="Notes" name="notes" type="textarea" rows={2} placeholder="Optional — what audience / segment / campaign tag" />
        <div style={{padding:'12px 14px',background:'#fafbfc',border:'1px dashed var(--border)',borderRadius:8,fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>
          In production, you'd drop a CSV here. For the demo, we'll generate {`{count}`} synthetic records under a new batch ID and add them in status <b>New</b> for the Sales Director to assign.
        </div>
      </>
    ),
    onSubmit: ({ source, count }) => {
      const n = Math.max(1, Math.min(50, Number(count) || 5));
      const batchId = `BATCH-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${(source||'X').split(' ')[0].slice(0,2).toUpperCase()}`;
      const importedBy = persona?.label || 'Marketing';
      const importedAt = new Date().toISOString().slice(0,10);
      writeAudit('Cold-calls imported', batchId, 'Cold Calls', `${n} record(s) from ${source} by ${importedBy}`);
      for (let i = 0; i < n; i++) {
        const id = `CC-${String(100 + (all.length + i + 1)).padStart(3,'0')}`;
        const name = `Imported Lead ${i+1}`;
        const phone = `+20 10${Math.floor(Math.random()*9)} 555 ${String(8000+i).padStart(4,'0')}`;
        addItem('coldCalls', {
          id, name, phone, source, importBatch: batchId, importedBy, importedAt,
          status: 'New', assignedAgent: null, assignedAt: null,
          callOutcome: null, callDuration: null, agentComment: null,
          directorDecision: null, decidedBy: null, decidedAt: null, convertedLeadId: null,
        }, 'CC', { action: 'Cold Call Imported', module: 'Cold Calls', target: id });
      }
      toast(`Imported ${n} cold-call records into ${batchId}`, 'success');
    },
  });

  // Available sales agents — shared by single + bulk assign.
  const salesAgents = (state.staff || []).filter(s => s.department === 'Sales' && (s.title?.includes('Sales Agent') || s.type === 'Employee'));

  const assignCall = (c) => {
    openModal({
      title: `Assign — ${c.name}`,
      subtitle: `${c.id} · ${c.phone} · ${c.source}`,
      submitLabel: 'Assign to agent',
      body: <Field label="Sales Agent" name="agent" type="select" required options={salesAgents.map(s => s.name)} defaultValue={salesAgents[0]?.name || 'Fatma Ibrahim'} />,
      onSubmit: ({ agent }) => {
        const now = new Date().toISOString().slice(0,10);
        updateItem('coldCalls', c.id, { status: 'Assigned', assignedAgent: agent, assignedAt: now }, { action: 'Cold Call Assigned', module: 'Cold Calls', target: c.id, detail: `Assigned to ${agent}` });
        toast(`${c.name} assigned to ${agent}`, 'success');
      },
    });
  };

  // ─── Bulk assign ──────────────────────────────────────────────
  // Two strategies:
  //   • One agent → all selected go to the same person.
  //   • Round-robin → distribute evenly across the agent roster.
  // Only acts on selected records still in status 'New' (the assignable
  // pool); already-assigned records are skipped with a hint.
  const bulkAssign = () => {
    const ids = Array.from(selected);
    const records = (state.coldCalls || []).filter(c => ids.includes(c.id));
    const assignable = records.filter(c => c.status === 'New');
    const skipped = records.length - assignable.length;
    if (assignable.length === 0) {
      toast('No selected records are in New status — nothing to assign', 'warning');
      return;
    }
    let strategy = 'one';
    let agent = salesAgents[0]?.name || 'Fatma Ibrahim';
    openModal({
      title: `Bulk assign — ${assignable.length} record${assignable.length === 1 ? '' : 's'}`,
      subtitle: skipped > 0 ? `${skipped} already-assigned record(s) will be skipped` : `${assignable.length} record(s) in New status will be assigned`,
      submitLabel: 'Assign all',
      body: (
        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          <div>
            <label style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em', display:'block', marginBottom:6}}>Distribution strategy</label>
            <div style={{display:'flex', gap:8}}>
              {[
                ['one', 'Single agent',  'All selected records go to one person'],
                ['rr',  'Round-robin',   `Distribute evenly across ${salesAgents.length} agents`],
              ].map(([k, lbl, desc]) => (
                <label key={k} style={{flex:1, padding:'10px 12px', border:'1.5px solid var(--border)', borderRadius:8, cursor:'pointer', display:'block'}}>
                  <input
                    type="radio" name="strategy" defaultChecked={k === 'one'}
                    onChange={() => { strategy = k; }}
                    style={{marginRight:8}}
                  />
                  <b style={{fontSize:12}}>{lbl}</b>
                  <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:3}}>{desc}</div>
                </label>
              ))}
            </div>
          </div>

          <div id="bulk-assign-agent-picker">
            <label style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em', display:'block', marginBottom:6}}>Target agent (Single agent strategy only)</label>
            <select
              defaultValue={agent}
              onChange={e => { agent = e.target.value; }}
              style={{width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:8, fontSize:13, fontFamily:'inherit'}}
            >
              {salesAgents.map(s => <option key={s.id || s.name} value={s.name}>{s.name}{s.team ? ` · ${s.team}` : ''}</option>)}
            </select>
            <div style={{fontSize:10, color:'var(--text-tertiary)', marginTop:6}}>Ignored when Round-robin is selected.</div>
          </div>

          <div style={{padding:'10px 12px', background:'#f8fafc', border:'1px solid var(--border)', borderRadius:8, fontSize:11, color:'var(--text-secondary)', lineHeight:1.5}}>
            <b style={{color:'var(--text-primary)'}}>Audit:</b> each assignment is written to the audit log individually so the trail mirrors single-record assigns.
          </div>
        </div>
      ),
      onSubmit: () => {
        const now = new Date().toISOString().slice(0,10);
        let assignedCount = 0;
        assignable.forEach((c, i) => {
          const target = strategy === 'rr'
            ? salesAgents[i % salesAgents.length]?.name || agent
            : agent;
          updateItem('coldCalls', c.id, { status: 'Assigned', assignedAgent: target, assignedAt: now }, { action: 'Cold Call Assigned (bulk)', module: 'Cold Calls', target: c.id, detail: `Bulk → ${target}` });
          assignedCount += 1;
        });
        writeAudit('Cold Calls Bulk Assigned', `${assignedCount} record(s)`, 'Cold Calls', strategy === 'rr' ? `Round-robin across ${salesAgents.length} agents` : `All → ${agent}`);
        toast(`Assigned ${assignedCount} cold call${assignedCount === 1 ? '' : 's'}${skipped > 0 ? ` · ${skipped} skipped` : ''}`, 'success');
        clearSel();
      },
    });
  };

  const logCall = (c) => openModal({
    title: `Log Call — ${c.name}`,
    subtitle: `${c.phone} · ${c.source}`,
    submitLabel: 'Submit for review',
    body: (
      <>
        <FieldRow>
          <Field label="Outcome" name="outcome" type="select" required options={CALL_OUTCOMES} defaultValue="Interested" />
          <Field label="Duration" name="duration" placeholder="e.g. 4m 12s" />
        </FieldRow>
        <Field label="Recommendation / Comment" name="comment" type="textarea" rows={3} required placeholder="What did you discuss? Budget, project interest, follow-up needed?" />
      </>
    ),
    onSubmit: ({ outcome, duration, comment }) => {
      updateItem('coldCalls', c.id, {
        status: 'Called',
        callOutcome: outcome,
        callDuration: duration || '—',
        agentComment: comment,
      }, { action: 'Cold Call Logged', module: 'Cold Calls', target: c.id, detail: `${outcome} — submitted for director review` });
      toast(`Call logged for ${c.name} — awaiting director review`, 'success');
    },
  });

  const convertToLead = (c) => openConfirm({
    title: `Convert "${c.name}" to a Lead?`,
    message: `A new Lead will be created and auto-assigned. This action is audited and irreversible.`,
    confirmLabel: 'Convert to Lead',
    onConfirm: () => {
      const assignee = pickConvertAgent(c, state.staff || []);
      const newLeadId = `L-${2000 + (state.leads?.length || 0) + 1}`;
      addItem('leads', {
        id: newLeadId, name: c.name, phone: c.phone, email: '—',
        source: 'Cold Calls', campaign: c.source, project: '—', developer: '—', budget: 0,
        stage: 'New', owner: assignee, team: 'Alpha', duplicate: 'Clear', priority: 'Warm',
        created: new Date().toISOString().slice(0,10), createdManually: false, coldCallId: c.id,
      }, 'L', { action: 'Lead Created (from Cold Call)', module: 'Leads', target: newLeadId, detail: `Converted from ${c.id} · auto-assigned to ${assignee}` });
      updateItem('coldCalls', c.id, {
        status: 'Converted',
        directorDecision: 'Convert to Lead',
        decidedBy: persona?.label || 'Sales Director',
        decidedAt: new Date().toISOString().slice(0,10),
        convertedLeadId: newLeadId,
      }, { action: 'Cold Call Converted', module: 'Cold Calls', target: c.id, detail: `→ ${newLeadId} (owner: ${assignee})` });
      toast(`Converted to ${newLeadId} — assigned to ${assignee}`, 'success');
    },
  });

  const markNotLead = (c) => openModal({
    title: `Mark "${c.name}" as Not Lead`,
    submitLabel: 'Mark Not Lead',
    danger: true,
    body: <Field label="Reason" name="reason" type="textarea" rows={3} required placeholder="Why this contact is not a viable lead (e.g. wrong number, already bought, not in market)." />,
    onSubmit: ({ reason }) => {
      updateItem('coldCalls', c.id, {
        status: 'NotLead',
        directorDecision: 'Not Lead',
        decidedBy: persona?.label || 'Sales Director',
        decidedAt: new Date().toISOString().slice(0,10),
        agentComment: c.agentComment ? `${c.agentComment} | Director: ${reason}` : `Director: ${reason}`,
      }, { action: 'Cold Call Closed (Not Lead)', module: 'Cold Calls', target: c.id, detail: reason });
      toast(`${c.name} closed as Not Lead`, 'info');
    },
  });

  const viewDetail = (c) => {
    openDrawer({
      title: c.name,
      subtitle: `${c.id} · ${c.phone}`,
      content: (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="detail-grid">
            {[['ID',c.id],['Phone',c.phone],['Source',c.source],['Batch',c.importBatch],['Imported by',c.importedBy],['Imported at',c.importedAt],['Status',c.status],['Assigned to',c.assignedAgent||'—'],['Assigned at',c.assignedAt||'—'],['Outcome',c.callOutcome||'—'],['Duration',c.callDuration||'—'],['Decided by',c.decidedBy||'—'],['Decided at',c.decidedAt||'—'],['Converted Lead',c.convertedLeadId||'—']].map(([k,v])=>(
              <div key={k}><label>{k}</label><div className="v">{v}</div></div>
            ))}
          </div>
          {c.agentComment && (
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:6}}>Agent Comment</div>
              <div style={{padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,fontSize:13,lineHeight:1.5}}>{c.agentComment}</div>
            </div>
          )}
        </div>
      ),
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:18,gap:14,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:800}}>Cold Calls</h1>
          <p style={{color:'var(--text-secondary)',marginTop:4,fontSize:13}}>
            {isMarketing ? 'Import and track your cold-call batches. Sales Director assigns and reviews.'
             : isAgentScope ? 'Cold calls assigned to you. Log the outcome and your recommendation.'
             : 'Import contacts, assign to agents, review calls, convert qualified records to leads.'}
          </p>
        </div>
        {canImport && (
          <button onClick={importBatch} style={{display:'flex',alignItems:'center',gap:6,background:'#16a34a',color:'#fff',border:'none',padding:'9px 16px',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>
            <Upload size={14}/> Import Batch
          </button>
        )}
      </div>

      {/* KPI strip */}
      <div style={{display:'grid',gridTemplateColumns:`repeat(${kpis.length},1fr)`,gap:12,marginBottom:18}}>
        {kpis.map(([label, value, Icon]) => (
          <div key={label} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,borderRadius:8,background:'var(--brand-tint)',color:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={16}/></div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</div>
              <div style={{fontSize:20,fontWeight:800,marginTop:2}}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}>
        {tabs.map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{padding:'7px 14px',borderRadius:6,border: tab === t ? '1px solid var(--brand)' : '1px solid var(--border)',background: tab === t ? 'var(--brand)' : '#fff',color: tab === t ? '#fff' : 'var(--text-primary)',fontWeight:600,fontSize:12,cursor:'pointer'}}>
            {t}
          </button>
        ))}
      </div>

      {/* Search + bulk toolbar */}
      <div style={{marginBottom:14, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
        <input
          placeholder="Search by name, phone or ID…"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          style={{padding:'9px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'inherit',flex:'1 1 280px',maxWidth:380}}
        />
        {/* Bulk-assign toolbar (managers only) — surfaces only when at
            least one record is selected. Hidden in agent + marketing views. */}
        {canManage && selected.size > 0 && (
          <div style={{display:'flex', gap:8, alignItems:'center', padding:'8px 14px', background:'var(--brand-tint)', border:'1px solid rgba(232,103,42,.25)', borderRadius:10}}>
            <span style={{fontSize:12, fontWeight:700, color:'var(--brand)'}}>
              {selected.size} selected
            </span>
            <button onClick={bulkAssign} className="btn btn-sm btn-primary">
              <UserPlus size={12}/> Bulk Assign…
            </button>
            <button onClick={clearSel} className="btn btn-sm btn-outline">Clear</button>
          </div>
        )}
        {canManage && selected.size === 0 && filtered.some(c => c.status === 'New') && (
          <div style={{fontSize:11, color:'var(--text-tertiary)', display:'inline-flex', alignItems:'center', gap:6}}>
            <span style={{display:'inline-block', width:13, height:13, border:'1.5px solid var(--text-tertiary)', borderRadius:3}}/>
            Tip: tick rows to enable bulk assign
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
        <table className="data-table" style={{width:'100%'}}>
          <thead>
            <tr>
              {canManage && (
                <th style={{width:32}}>
                  {/* Select-all (filtered + assignable) */}
                  <input
                    type="checkbox"
                    title="Select all New records on this view"
                    checked={(() => {
                      const newOnView = filtered.filter(c => c.status === 'New');
                      return newOnView.length > 0 && newOnView.every(c => selected.has(c.id));
                    })()}
                    onChange={() => {
                      const newOnView = filtered.filter(c => c.status === 'New');
                      const allChecked = newOnView.length > 0 && newOnView.every(c => selected.has(c.id));
                      const next = new Set(selected);
                      if (allChecked) newOnView.forEach(c => next.delete(c.id));
                      else newOnView.forEach(c => next.add(c.id));
                      setSelected(next);
                    }}
                  />
                </th>
              )}
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Source</th>
              {!isMarketing && <th>Assigned</th>}
              <th>Status</th>
              {canManage && <th>Decided By</th>}
              <th style={{textAlign:'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={selected.has(c.id) ? {background:'rgba(232,103,42,.04)'} : undefined}>
                {canManage && (
                  <td style={{width:32}}>
                    {c.status === 'New' ? (
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggleSel(c.id)}
                        title="Select for bulk assign"
                      />
                    ) : (
                      <span style={{display:'inline-block', width:13, height:13}} title="Only New records can be bulk-assigned"/>
                    )}
                  </td>
                )}
                <td style={{fontFamily:'monospace',fontSize:11}}>{c.id}</td>
                <td style={{fontWeight:600}}>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.source}</td>
                {!isMarketing && <td>{c.assignedAgent || '—'}</td>}
                <td>
                  <StatusPill status={c.status}/>
                  {c.convertedLeadId && <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:2,fontFamily:'monospace'}}>→ {c.convertedLeadId}</div>}
                </td>
                {canManage && <td style={{fontSize:12,color:'var(--text-secondary)'}}>{c.decidedBy || '—'}</td>}
                <td style={{textAlign:'right'}}>
                  <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                    <button onClick={()=>viewDetail(c)} className="btn btn-sm btn-outline" title="View"><Eye size={12}/></button>
                    {canManage && c.status === 'New' && (
                      <button onClick={()=>assignCall(c)} className="btn btn-sm btn-primary"><UserPlus size={12}/> Assign</button>
                    )}
                    {isAgentScope && c.status === 'Assigned' && (
                      <button onClick={()=>logCall(c)} className="btn btn-sm btn-primary"><PhoneCall size={12}/> Log Call</button>
                    )}
                    {canManage && c.status === 'Called' && (
                      <>
                        <button onClick={()=>convertToLead(c)} className="btn btn-sm" style={{background:'#16a34a',color:'#fff',border:'none',padding:'5px 10px',borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer'}}><ArrowRight size={12}/> Convert</button>
                        <button onClick={()=>markNotLead(c)} className="btn btn-sm btn-outline" style={{color:'#dc2626',borderColor:'#fecaca'}}><XCircle size={12}/> Not Lead</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={canManage ? 9 : isMarketing ? 6 : 7} style={{textAlign:'center',padding:'30px 0',color:'var(--text-tertiary)'}}>No cold calls match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer hint */}
      <div style={{marginTop:14,padding:'10px 14px',background:'var(--brand-tint)',border:'1px solid rgba(232,103,42,.2)',borderRadius:8,fontSize:11.5,color:'var(--text-secondary)',lineHeight:1.6}}>
        <Megaphone size={13} style={{verticalAlign:'middle',marginRight:6,color:'var(--brand)'}}/>
        <b style={{color:'var(--text-primary)'}}>Flow:</b> {canManage ? 'Import → Assign agent → Agent calls + comments → Review → Convert to Lead (auto-assigns owner) or Mark Not Lead.' : isMarketing ? 'You can import batches. Sales Director assigns records and reviews calls. You can track conversion outcomes here.' : 'Log every call with outcome + recommendation. Sales Director will review and either convert to a Lead (assigned back) or close as Not Lead.'}
      </div>
    </div>
  );
};
