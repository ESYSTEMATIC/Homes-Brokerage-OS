// ═══════════════════════════════════════════════════════════════════════
// Offers — dedicated page for employment-offer management
// ───────────────────────────────────────────────────────────────────────
// Split out of the Recruitment Pipeline into its own route + sidebar link
// (May 2026). Offers are still DRAFTED from the candidate pipeline (advance
// a candidate to the Offer stage); this page is where HR / the Sales
// Director approve, send, and record the candidate's response.
//
//   HR drafts → Sales Director approves → Sent → Accepted / Declined
// ═══════════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Field } from '../components/UI';
import { FileText, Eye, CheckCircle2, Send, Award, Users, Info } from 'lucide-react';

const offerStageColor = s => s==='Accepted'?'badge-success':s==='Declined'||s==='Withdrawn'?'badge-danger':s==='Sent'?'badge-info':s==='Approved'?'badge-info':s==='Pending Approval'?'badge-warning':'badge-gray';

export const Offers = () => {
  const { state, personaKey, addItem, updateItem, openModal, openDrawer, openConfirm, toast } = useApp();
  const isSalesDirector = personaKey === 'salesDirector';
  const navigate = useNavigate();

  const [q, setQ] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  const allOffers = state.offers || [];
  const stageOptions = [...new Set(allOffers.map(o => o.stage))];
  const offers = allOffers.filter(o => {
    if (stageFilter && o.stage !== stageFilter) return false;
    if (q) {
      const hay = `${o.candidateName || ''} ${o.jobTitle || ''} ${o.id || ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const counts = {
    'Pending Approval': allOffers.filter(o => o.stage === 'Pending Approval').length,
    'Approved':         allOffers.filter(o => o.stage === 'Approved').length,
    'Sent':             allOffers.filter(o => o.stage === 'Sent').length,
    'Accepted':         allOffers.filter(o => ['Accepted', 'Onboarded'].includes(o.stage)).length,
  };

  // ─── Offer workflow handlers ──────────────────────────────────────────
  const approveOffer = (offer) => openModal({
    title: `Approve offer — ${offer.candidateName}`,
    subtitle: `${offer.jobTitle} · EGP ${offer.salaryMonthly.toLocaleString()}/mo${offer.outOfBand ? ' · OUT OF BAND' : ''}`,
    submitLabel: 'Approve',
    body: (
      <>
        {offer.outOfBand && (
          <div style={{padding:'10px 12px', background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:8, fontSize:12, color:'#92400e', marginBottom:12}}>
            Salary is outside the published band. Approval requires justification.
          </div>
        )}
        <Field label={offer.outOfBand ? 'Justification (required)' : 'Approval note (optional)'} name="note" type="textarea" required={offer.outOfBand} />
      </>
    ),
    onSubmit: ({ note }) => {
      updateItem('offers', offer.id, {
        stage: 'Approved',
        approvedBy: 'Sales Director',
        approvedAt: new Date().toISOString().slice(0,10),
        approvalNote: note,
      }, { action: 'Offer Approved', module: 'Recruitment', target: offer.id, detail: note || `${offer.candidateName} approved` });
      toast(`Offer ${offer.id} approved`);
    },
  });

  const sendOffer = (offer) => openConfirm({
    title: `Send offer to ${offer.candidateName}?`,
    message: `An offer email will be sent. The candidate has 7 days to respond.`,
    confirmLabel: 'Send offer',
    onConfirm: () => {
      const expires = new Date(); expires.setDate(expires.getDate() + 7);
      updateItem('offers', offer.id, {
        stage: 'Sent',
        sentAt: new Date().toISOString().slice(0,10),
        expiresAt: expires.toISOString().slice(0,10),
      }, { action: 'Offer Sent', module: 'Recruitment', target: offer.id, detail: offer.candidateName });
      toast(`Offer sent to ${offer.candidateName}`);
    },
  });

  const candidateResponse = (offer, response) => openConfirm({
    title: `Mark offer as ${response}?`,
    message: response === 'Accepted'
      ? `${offer.candidateName} will move to Onboarding queue.`
      : `${offer.candidateName} will be marked as declined.`,
    confirmLabel: response,
    danger: response !== 'Accepted',
    onConfirm: () => {
      updateItem('offers', offer.id, { stage: response, respondedAt: new Date().toISOString().slice(0,10) },
        { action: `Offer ${response}`, module: 'Recruitment', target: offer.id, detail: offer.candidateName });
      if (response === 'Accepted') {
        updateItem('candidates', offer.candidateId, { stage: 'Offer' });
        const cand = state.candidates.find(c => c.id === offer.candidateId);
        const job  = state.jobs.find(j => j.id === offer.jobId);
        const now  = new Date().toISOString();
        const today = now.slice(0, 10);

        // 1) Create the employee (staff) record IMMEDIATELY on offer accept,
        //    with status='Pending Onboarding'. The hire is committed the
        //    moment the offer is accepted — onboarding just gates the flip
        //    to 'Active'.
        const emp = addItem('staff', {
          name: offer.candidateName,
          department: job?.department || 'Sales',
          title: offer.jobTitle || 'Sales Agent',
          branch: job?.location || 'New Cairo',
          manager: offer.reportingTo || job?.hiringManager || 'Sales Manager',
          status: 'Pending Onboarding',
          type: 'Employee',
          email: cand?.email || `${offer.candidateName.toLowerCase().replace(/\s+/g,'.')}@homesbrokerage.eg`,
          phone: cand?.phone || '',
          joinDate: offer.startDate || today,
          photoDataUrl: cand?.photoDataUrl || offer.photoDataUrl || null,
          photoName: cand?.photoName || offer.photoName || null,
          linkedOfferId: offer.id,
          linkedCandidateId: offer.candidateId,
        }, 'A', {
          action: 'Employee Created (Pending Onboarding)',
          module: 'Backoffice',
          target: offer.candidateId,
          detail: `${offer.candidateName} · from accepted offer ${offer.id}`,
        });

        // 2) Spawn an onboarding application linked to the new employee.
        const newApp = addItem('onboarding', {
          applicant: offer.candidateName,
          type: 'Agent',
          date: today,
          status: 'Submitted',
          department: job?.department || 'Sales',
          branch: job?.location || 'New Cairo',
          photoDataUrl: cand?.photoDataUrl || offer.photoDataUrl || null,
          photoName:    cand?.photoName    || offer.photoName    || null,
          resumeName:   cand?.resumeName   || null,
          resumeDataUrl:cand?.resumeDataUrl|| null,
          phone: cand?.phone || '',
          email: cand?.email || '',
          requestedRole: offer.jobTitle,
          targetStartDate: offer.startDate,
          hiringManager: offer.reportingTo || job?.hiringManager || 'TBD',
          source: cand?.vacancyId || offer.jobId || 'Careers Page',
          linkedCandidateId: offer.candidateId,
          linkedOfferId: offer.id,
          employeeId: emp.id,
          statusHistory: [
            { stage: 'Submitted', at: now, by: `Auto · Offer accepted (${offer.id})`, note: `Spawned from accepted offer for ${offer.jobTitle} · employee ${emp.id} created in Pending Onboarding status` },
          ],
          notes: `Salary: EGP ${offer.salaryMonthly?.toLocaleString()}/mo · Start ${offer.startDate}`,
        }, 'APP', {
          action: 'Onboarding Application Created',
          module: 'Backoffice',
          target: offer.candidateId,
          detail: `Auto-spawned from accepted offer ${offer.id} · employee ${emp.id}`,
        });

        // 3) Auto-spawn the intro call (manager owns it, T+3 days @ 10:30).
        const ownerName = (offer.reportingTo || job?.hiringManager || 'TBD').replace(/\s*\(.*\)\s*$/, '');
        const callAt = (() => {
          const d = new Date(); d.setDate(d.getDate() + 3); d.setHours(10, 30, 0, 0);
          return d.toISOString().slice(0, 16);
        })();
        const introCall = addItem('introCalls', {
          applicantId: newApp.id,
          candidateName: offer.candidateName,
          owner: ownerName,
          salesManager: (job?.department === 'Sales') ? 'Nour El-Din' : null,
          location: 'Microsoft Teams',
          scheduledAt: callAt,
          durationMinutes: 30,
          status: 'Scheduled',
          notes: 'Walk through CRM, MLS access, KPIs, and first-week plan.',
          createdAt: now,
          createdBy: `Auto · Offer accepted (${offer.id})`,
          completedAt: null,
          history: [
            { at: now, actor: 'System', action: `Auto-scheduled from accepted offer ${offer.id}` },
          ],
        }, 'IC', {
          action: 'Intro Call Scheduled',
          module: 'Backoffice',
          target: offer.candidateId,
          detail: `${ownerName} · ${callAt.replace('T', ' ')}`,
        });

        toast(`${offer.candidateName} accepted — Employee ${emp.id} (Pending Onboarding) · Onboarding ${newApp.id} · Intro call ${introCall.id} (${ownerName})`);
      } else {
        toast(`${offer.candidateName} declined the offer`, 'warning');
      }
    },
  });

  const previewOffer = (offer) => openDrawer({
    title: `Offer Letter · ${offer.id}`,
    subtitle: `${offer.candidateName} · ${offer.jobTitle}`,
    content: <OfferLetterPreview offer={offer} />,
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Offers</span></div>
        <h1 className="page-title">Offers</h1>
        <p className="page-subtitle">Employment offers — HR drafts → Sales Director approves → Sent → Accepted</p>
      </div>

      {/* Where offers come from */}
      <div style={{padding:'12px 16px', background:'var(--brand-tint)', border:'1px solid #fed7aa', borderRadius:10, marginBottom:16, display:'flex', alignItems:'center', gap:12}}>
        <Info size={18} color="#9a3412" style={{flexShrink:0}}/>
        <div style={{fontSize:12, color:'#7c2d12', lineHeight:1.5, flex:1}}>
          Offers are <b>drafted from the Candidate Pipeline</b> — advance a candidate to the <b>Offer</b> stage to create one. This page is where they are approved, sent, and resolved.
        </div>
        <button className="btn btn-sm btn-outline" onClick={() => navigate('/backoffice/recruitment')}>
          <Users size={13}/> Candidate Pipeline
        </button>
      </div>

      {/* KPI strip */}
      <div className="kpi-grid kpi-grid-5" style={{marginBottom:18}}>
        {[
          ['Pending Approval', counts['Pending Approval'], 'amber'],
          ['Approved',         counts['Approved'],         'blue'],
          ['Sent',             counts['Sent'],             'blue'],
          ['Accepted',         counts['Accepted'],         'green'],
        ].map(([label, value, tone]) => (
          <div className="kpi-card" key={label}>
            <div><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div></div>
            <div className={`kpi-icon ${tone}`}><FileText size={18}/></div>
          </div>
        ))}
      </div>

      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder="Search by candidate, role, ID…" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="data-select" value={stageFilter} onChange={e=>setStageFilter(e.target.value)}>
              <option value="">All stages</option>
              {stageOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:8}}>
            {state.salaryBands && (
              <button className="btn btn-outline" onClick={() => openDrawer({
                title: 'Salary Band Reference',
                subtitle: `${state.salaryBands.length} bands · governance matrix`,
                content: <SalaryBandReference bands={state.salaryBands}/>,
              })}><Award size={14}/> Salary bands</button>
            )}
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr>
              <th>ID</th><th>Candidate</th><th>Role</th><th>Salary (EGP)</th>
              <th>Stage</th><th>Drafted By</th><th>Approved By</th><th>Sent</th>
              <th style={{textAlign:'right'}}>Actions</th>
            </tr></thead>
            <tbody>
              {offers.map(o => (
                <tr key={o.id}>
                  <td className="muted">{o.id}</td>
                  <td className="bold">
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      {o.photoDataUrl ? (
                        <img src={o.photoDataUrl} alt="" style={{width:30, height:30, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'1px solid var(--border)'}}/>
                      ) : (
                        <div style={{width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0}}>
                          {(o.candidateName || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                        </div>
                      )}
                      <span>{o.candidateName}</span>
                    </div>
                  </td>
                  <td>{o.jobTitle}</td>
                  <td className="bold">
                    {o.salaryMonthly?.toLocaleString()} / mo
                    {o.outOfBand && <span className="badge badge-warning" style={{marginLeft:6}}>OUT OF BAND</span>}
                  </td>
                  <td><span className={`badge ${offerStageColor(o.stage)}`}>{o.stage}</span></td>
                  <td className="muted">{o.draftedBy}</td>
                  <td className="muted">{o.approvedBy || '—'}</td>
                  <td className="muted">{o.sentAt || '—'}</td>
                  <td style={{textAlign:'right'}}><div className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => previewOffer(o)}><Eye size={13}/> Preview</button>
                    {o.stage === 'Pending Approval' && isSalesDirector && (
                      <button className="btn btn-primary btn-sm" onClick={() => approveOffer(o)}><CheckCircle2 size={13}/> Approve</button>
                    )}
                    {o.stage === 'Pending Approval' && !isSalesDirector && (
                      <span style={{fontSize:11, color:'var(--text-tertiary)', fontStyle:'italic'}}>Awaiting Director</span>
                    )}
                    {o.stage === 'Approved' && (
                      <button className="btn btn-primary btn-sm" onClick={() => sendOffer(o)}><Send size={13}/> Send</button>
                    )}
                    {o.stage === 'Sent' && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => candidateResponse(o, 'Accepted')}>Mark Accepted</button>
                        <button className="btn btn-danger btn-sm" onClick={() => candidateResponse(o, 'Declined')}>Mark Declined</button>
                      </>
                    )}
                  </div></td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr><td colSpan={9} style={{textAlign:'center', padding:24, color:'var(--text-tertiary)'}}>
                  {allOffers.length === 0
                    ? 'No offers yet — advance a candidate to the Offer stage in the Candidate Pipeline to draft one.'
                    : 'No offers match the current search or filter.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// OfferLetterPreview — printable offer letter
// ═══════════════════════════════════════════════════════════════
const OfferLetterPreview = ({ offer }) => {
  const printLetter = () => {
    const w = window.open('', '_blank', 'width=820,height=900');
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Offer Letter — ${offer.candidateName}</title>
      <style>
        body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width:760px; margin:40px auto; padding:0 40px; color:#0f172a; line-height:1.65;}
        h1{font-size:22px; color:#e50914; margin:0 0 4px;}
        h2{font-size:14px; color:#64748b; font-weight:600; margin:0 0 30px; letter-spacing:.04em; text-transform:uppercase;}
        h3{font-size:14px; margin:24px 0 8px; color:#0f172a; border-bottom:1px solid #e2e8f0; padding-bottom:4px;}
        p{margin:8px 0; font-size:13px;}
        table{width:100%; border-collapse:collapse; margin-top:8px; font-size:13px;}
        td{padding:6px 0; border-bottom:1px solid #f1f5f9; vertical-align:top;}
        td:first-child{color:#64748b; width:38%;}
        ul{margin:8px 0; padding-left:20px; font-size:13px;}
        .sig{margin-top:60px; display:flex; justify-content:space-between;}
        .sig div{width:46%; border-top:1px solid #94a3b8; padding-top:8px; font-size:12px; color:#475569;}
        @media print { body{margin:0;} button{display:none!important;} }
      </style></head><body>
      <button onclick="window.print()" style="position:fixed;top:20px;right:20px;background:#e50914;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:700;cursor:pointer;">Print / Save PDF</button>
      <h1>Homes Brokerage</h1>
      <h2>Offer of Employment</h2>
      <p>Dear ${offer.candidateName},</p>
      <p>We are pleased to extend the following offer of employment to you for the position of <b>${offer.jobTitle}</b> at Homes Brokerage.</p>
      <h3>Compensation</h3>
      <table>
        <tr><td>Base salary</td><td><b>EGP ${offer.salaryMonthly?.toLocaleString()} / month</b></td></tr>
        <tr><td>Commission</td><td>${offer.commission || '—'}</td></tr>
        <tr><td>Bonus / Sign-on</td><td>${offer.bonus || '—'}</td></tr>
      </table>
      <h3>Role & Schedule</h3>
      <table>
        <tr><td>Reports to</td><td>${offer.reportingTo || '—'}</td></tr>
        <tr><td>Work schedule</td><td>${offer.workSchedule || '—'}</td></tr>
        <tr><td>Start date</td><td>${offer.startDate || '—'}</td></tr>
        <tr><td>Probation</td><td>${offer.probationMonths || 3} months</td></tr>
        <tr><td>Contract type</td><td>${offer.contractType || 'Full-time, indefinite'}</td></tr>
      </table>
      <h3>Benefits</h3>
      <ul>${(offer.benefits || []).map(b => `<li>${b}</li>`).join('')}</ul>
      <h3>Response Deadline</h3>
      <p>This offer expires on <b>${offer.expiresAt || '— (not sent yet)'}</b>. Please respond by replying to careers@homes.com.eg or signing this letter electronically.</p>
      <div class="sig">
        <div>Sales Director, Homes Brokerage<br/>${offer.approvedBy || '________________'}</div>
        <div>Candidate signature<br/>${offer.candidateName}</div>
      </div>
      </body></html>`);
    w.document.close();
  };

  const f = (v) => v || '—';
  return (
    <div>
      {/* Candidate header card */}
      <div style={{display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:12, background:'linear-gradient(135deg, var(--brand-tint), #fff)', marginBottom:14, border:'1px solid var(--border)'}}>
        {offer.photoDataUrl ? (
          <img src={offer.photoDataUrl} alt="" style={{width:60, height:60, borderRadius:'50%', objectFit:'cover', border:'3px solid #fff', boxShadow:'0 4px 12px rgba(0,0,0,.12)', flexShrink:0}}/>
        ) : (
          <div style={{width:60, height:60, borderRadius:'50%', background:'linear-gradient(135deg, var(--brand), #b91c1c)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:20, flexShrink:0}}>
            {(offer.candidateName || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
          </div>
        )}
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:16, fontWeight:800, color:'var(--text-primary)'}}>{offer.candidateName}</div>
          <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:3}}>{offer.jobTitle}</div>
        </div>
      </div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:10, background:'var(--brand-tint)', marginBottom:14}}>
        <div>
          <div style={{fontSize:11, fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'.06em'}}>{offer.stage}</div>
          <div style={{fontSize:14, fontWeight:700, marginTop:2}}>EGP {offer.salaryMonthly?.toLocaleString()} / month {offer.outOfBand && <span style={{color:'#92400e', fontSize:11, marginLeft:6}}>· OUT OF BAND</span>}</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={printLetter}><FileText size={13}/> Print / Save PDF</button>
      </div>

      <div className="detail-grid">
        {[
          ['Job', offer.jobTitle],
          ['Start date', offer.startDate],
          ['Probation', `${offer.probationMonths || 3} months`],
          ['Reports to', offer.reportingTo],
          ['Schedule', offer.workSchedule],
          ['Drafted by', offer.draftedBy],
          ['Approved by', f(offer.approvedBy)],
          ['Sent', f(offer.sentAt)],
          ['Expires', f(offer.expiresAt)],
        ].map(([k,v])=>(
          <div key={k}><label>{k}</label><div className="v">{v}</div></div>
        ))}
      </div>

      <div style={{marginTop:14}}>
        <div style={{fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:6}}>Commission</div>
        <div style={{fontSize:13}}>{f(offer.commission)}</div>
      </div>
      <div style={{marginTop:12}}>
        <div style={{fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:6}}>Bonus / Sign-on</div>
        <div style={{fontSize:13}}>{f(offer.bonus)}</div>
      </div>
      <div style={{marginTop:12}}>
        <div style={{fontSize:12, fontWeight:600, color:'var(--text-secondary)', marginBottom:6}}>Benefits</div>
        <ul style={{margin:0, paddingLeft:18, fontSize:13, lineHeight:1.7}}>
          {(offer.benefits || []).map(b => <li key={b}>{b}</li>)}
        </ul>
      </div>
      {offer.notes && (
        <div style={{marginTop:14, padding:'10px 12px', background:'#f8fafc', borderRadius:8, fontSize:12, color:'var(--text-secondary)'}}>
          <b>HR notes:</b> {offer.notes}
        </div>
      )}
      {offer.approvalNote && (
        <div style={{marginTop:8, padding:'10px 12px', background:'#ecfdf5', borderRadius:8, fontSize:12, color:'#047857'}}>
          <b>Director approval:</b> {offer.approvalNote}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SalaryBandReference — governance matrix shown in a drawer
// ═══════════════════════════════════════════════════════════════
const SalaryBandReference = ({ bands }) => (
  <div>
    <p style={{fontSize:12, color:'var(--text-secondary)', marginBottom:12}}>
      Governance matrix — any offer outside these bands requires Sales Director justification.
    </p>
    <table className="data-table">
      <thead><tr><th>Family</th><th>Level</th><th style={{textAlign:'right'}}>Min</th><th style={{textAlign:'right'}}>Max</th></tr></thead>
      <tbody>
        {bands.map(b => (
          <tr key={b.id}>
            <td className="bold">{b.family}</td>
            <td>{b.level}</td>
            <td style={{textAlign:'right'}}>EGP {b.min.toLocaleString()}</td>
            <td style={{textAlign:'right'}}>EGP {b.max.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
