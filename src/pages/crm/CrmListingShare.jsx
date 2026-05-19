import React, { useState, useMemo } from 'react';
import { SHARE_CHANNELS, SHARE_RESPONSES } from '../../data/staticData';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Mail, Phone, Smartphone, Search, Send, X, Copy, ExternalLink, Eye } from 'lucide-react';

// Channel meta — colors, icons, deep-link builders, and the message
// template that pre-fills the input. Each channel ends up as a "Send via X"
// button in the share modal; clicking it (a) builds the right URL with the
// listing + agent contact pre-encoded, (b) opens the native app via window.open
// (or location.href for tel:/sms:/mailto: schemes), and (c) auto-records the
// share so tracking + analytics stay accurate without a separate "log" step.
const channelMeta = {
  WhatsApp: { color: '#25d366', icon: MessageSquare, label: 'WhatsApp', actionLabel: 'Open WhatsApp' },
  Email:    { color: '#3b82f6', icon: Mail,          label: 'Email',    actionLabel: 'Open email client' },
  Call:     { color: 'var(--brand)', icon: Phone,    label: 'Call',     actionLabel: 'Start dialer' },
  SMS:      { color: '#8b5cf6', icon: Smartphone,    label: 'SMS',      actionLabel: 'Open SMS app' },
};
const channelIcon = ch => { const M = channelMeta[ch]?.icon || MessageSquare; return <M size={14} color={channelMeta[ch]?.color || '#666'}/>; };
const channelColor = ch => channelMeta[ch]?.color || '#666';
const responseColor = r => r==='Interested'?'badge-success':r==='Viewed'?'badge-info':'badge-gray';

// Normalise an Egyptian phone number for WhatsApp / SMS / tel: schemes.
// WhatsApp expects digits only with the country code (no +).
const cleanPhone = (raw) => (raw || '').replace(/[^0-9]/g, '');

// Build the default message template — listing name, agent name, contact link.
const buildMessage = ({ listingLabel, leadName, agentName, agentPhone }) => {
  const greeting = leadName ? `Hi ${leadName.split(' ')[0]},` : 'Hi,';
  return `${greeting}

I have a listing I think matches what you're looking for — ${listingLabel || 'a property'}.

Can I share more details and arrange a viewing?

— ${agentName || 'Your Homes agent'}${agentPhone ? `\n${agentPhone}` : ''}`;
};

export const CrmListingShare = () => {
  const { state, addItem, toast, persona } = useApp();
  const [search, setSearch] = useState('');
  const [fChannel, setFChannel] = useState('All');
  const [fResponse, setFResponse] = useState('All');
  const [shareOpen, setShareOpen] = useState(false);
  const [previewShare, setPreviewShare] = useState(null);
  // Composer state — single source of truth for the share modal. The
  // channel CTAs read from this on click; the agent can edit the message
  // before clicking to override the template.
  const [shareForm, setShareForm] = useState({
    listingId: '',
    listingLabel: '',
    leadId: '',
    leadName: '',
    leadPhone: '',
    leadEmail: '',
    message: '',
    subject: '',
  });

  const listingShares = state.listingShares || [];
  const leads = state.leads || [];
  const listings = state.listings || [];

  const filtered = useMemo(()=>listingShares.filter(s=>{
    if(search && !s.leadName.toLowerCase().includes(search.toLowerCase()) && !s.property.toLowerCase().includes(search.toLowerCase())) return false;
    if(fChannel!=='All' && s.channel!==fChannel) return false;
    if(fResponse!=='All' && s.response!==fResponse) return false;
    return true;
  }),[listingShares,search,fChannel,fResponse]);

  const totalShares = listingShares.length;
  const whatsappPct = totalShares ? ((listingShares.filter(s=>s.channel==='WhatsApp').length/totalShares)*100).toFixed(0) : 0;
  const responseRate = totalShares ? ((listingShares.filter(s=>s.response!=='No Response').length/totalShares)*100).toFixed(0) : 0;
  const interestedRate = totalShares ? ((listingShares.filter(s=>s.response==='Interested').length/totalShares)*100).toFixed(0) : 0;

  // Re-build the message template whenever listing or lead changes.
  const refreshTemplate = (next) => {
    const lead = leads.find(l => l.id === next.leadId);
    const msg = buildMessage({
      listingLabel: next.listingLabel,
      leadName: lead?.name || next.leadName,
      agentName: persona.label,
      agentPhone: '+20 100 111 0000',
    });
    setShareForm({
      ...next,
      leadPhone: lead?.phone || '',
      leadEmail: lead?.email || '',
      message: msg,
      subject: next.listingLabel ? `Listing: ${next.listingLabel}` : 'Listing for you',
    });
  };

  const openShare = (preset = {}) => {
    const next = {
      listingId: preset.listingId || '',
      listingLabel: preset.listingLabel || '',
      leadId: preset.leadId || '',
      leadName: preset.leadName || '',
      leadPhone: preset.leadPhone || '',
      leadEmail: preset.leadEmail || '',
      message: '',
      subject: '',
    };
    refreshTemplate(next);
    setShareOpen(true);
  };

  // ── Actually-do-the-thing handler — one per channel. ─────────────────
  // Each handler: (1) validates the channel-specific contact, (2) opens
  // the native app via a deep link, (3) writes the share record, (4)
  // closes the modal with a confirmation toast.
  const recordShare = (channel) => {
    if (!shareForm.listingLabel) return toast('Pick a listing first', 'error');
    if (!shareForm.leadName) return toast('Pick a lead first', 'error');
    addItem('listingShares', {
      listingId: shareForm.listingId || 'L-NEW',
      property: shareForm.listingLabel,
      leadId: shareForm.leadId || 'LD-NEW',
      leadName: shareForm.leadName,
      channel,
      agent: persona.label,
      timestamp: new Date().toLocaleString('en-EG'),
      response: 'No Response',
      message: shareForm.message,
    }, 'SHR');
  };

  const sendWhatsApp = () => {
    const phone = cleanPhone(shareForm.leadPhone);
    if (!phone) return toast('Lead has no phone number on file', 'error');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(shareForm.message)}`;
    window.open(url, '_blank', 'noopener');
    recordShare('WhatsApp');
    toast('Opened WhatsApp · share logged', 'success');
    setShareOpen(false);
  };

  const sendSMS = () => {
    const phone = cleanPhone(shareForm.leadPhone);
    if (!phone) return toast('Lead has no phone number on file', 'error');
    const url = `sms:+${phone}?body=${encodeURIComponent(shareForm.message)}`;
    window.location.href = url;
    recordShare('SMS');
    toast('Opened SMS app · share logged', 'success');
    setShareOpen(false);
  };

  const sendEmail = () => {
    if (!shareForm.leadEmail) return toast('Lead has no email on file', 'error');
    const url = `mailto:${shareForm.leadEmail}?subject=${encodeURIComponent(shareForm.subject)}&body=${encodeURIComponent(shareForm.message)}`;
    window.location.href = url;
    recordShare('Email');
    toast('Opened email client · share logged', 'success');
    setShareOpen(false);
  };

  const startCall = () => {
    const phone = cleanPhone(shareForm.leadPhone);
    if (!phone) return toast('Lead has no phone number on file', 'error');
    // Copy the talking-points (the message body) so the agent can glance
    // at it during the call. The dialer link starts the actual call.
    try { navigator.clipboard?.writeText(shareForm.message); } catch (e) { /* clipboard might be unavailable */ void e; }
    window.location.href = `tel:+${phone}`;
    recordShare('Call');
    toast('Dialer launched · talking points copied · share logged', 'success');
    setShareOpen(false);
  };

  const copyMessage = () => {
    try {
      navigator.clipboard?.writeText(shareForm.message);
      toast('Message copied to clipboard', 'success');
    } catch (e) { toast('Could not copy — your browser may block clipboard', 'error'); void e; }
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Listing Share Tracking</h1><p className="page-subtitle">Send listings to leads via WhatsApp, SMS, Email, or Call — each share is tracked automatically.</p></div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[['Total Shares',totalShares,'var(--info)'],['WhatsApp Share',whatsappPct+'%','#25d366'],['Response Rate',responseRate+'%','var(--brand)'],['Interested',interestedRate+'%','var(--success)']].map(([l,v,c])=>(
          <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'16px 20px',borderTop:`3px solid ${c}`}}><div style={{fontSize:12,color:'var(--text-secondary)',fontWeight:600}}>{l}</div><div style={{fontSize:24,fontWeight:800,marginTop:4}}>{v}</div></div>
        ))}
      </div>

      {/* Channel Breakdown */}
      <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:20,marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Channel Breakdown</div>
        <div style={{display:'flex',gap:20}}>
          {SHARE_CHANNELS.map(ch=>{const count=listingShares.filter(s=>s.channel===ch).length;const pct=totalShares?((count/totalShares)*100).toFixed(0):0;return(
            <div key={ch} style={{flex:1,display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'#f8fafc',borderRadius:10,border:'1px solid var(--border)'}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${channelColor(ch)}15`,display:'flex',alignItems:'center',justifyContent:'center'}}>{channelIcon(ch)}</div>
              <div><div style={{fontSize:13,fontWeight:700}}>{ch}</div><div style={{fontSize:11,color:'var(--text-secondary)'}}>{count} shares · {pct}%</div></div>
            </div>
          );})}
        </div>
      </div>

      <div style={{display:'flex',gap:12,marginBottom:20,alignItems:'center',flexWrap:'wrap'}}>
        <div className="search-box" style={{flex:'1 1 200px'}}><Search size={16}/><input type="text" placeholder="Search by lead or property…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <select className="filter-select" value={fChannel} onChange={e=>setFChannel(e.target.value)}><option value="All">All Channels</option>{SHARE_CHANNELS.map(c=><option key={c}>{c}</option>)}</select>
        <select className="filter-select" value={fResponse} onChange={e=>setFResponse(e.target.value)}><option value="All">All Responses</option>{SHARE_RESPONSES.map(r=><option key={r}>{r}</option>)}</select>
        <button className="btn btn-brand" onClick={()=>openShare()}><Send size={16}/> New share</button>
      </div>

      <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Listing</th><th>Lead</th><th>Channel</th><th>Agent</th><th>Timestamp</th><th>Response</th><th>Message</th></tr></thead>
        <tbody>{filtered.map(s=>(
          <tr key={s.id}>
            <td className="muted" style={{fontSize:11}}>{s.id}</td>
            <td className="bold" style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.property}</td>
            <td className="bold">{s.leadName}</td>
            <td><span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:600,color:channelColor(s.channel)}}>{channelIcon(s.channel)} {s.channel}</span></td>
            <td className="muted">{s.agent}</td>
            <td className="muted" style={{fontSize:11}}>{s.timestamp}</td>
            <td><span className={`badge ${responseColor(s.response)}`}>{s.response}</span></td>
            <td>{s.message ? <button className="btn-icon" title="View sent message" onClick={()=>setPreviewShare(s)}><Eye size={14}/></button> : <span style={{color:'var(--text-tertiary)',fontSize:11}}>—</span>}</td>
          </tr>
        ))}</tbody></table></div></div>

      {/* ─── New share modal ─────────────────────────────────────────
          One unified composer with the message preview pre-filled from
          the picked listing + lead. The four channel buttons at the
          bottom each open the right native app via deep link AND
          auto-log the share — no separate "track" step. */}
      {shareOpen && (
        <div className="modal-overlay" onClick={()=>setShareOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:640}}>
            <div className="modal-header">
              <h3>Share a listing</h3>
              <button className="btn-icon" onClick={()=>setShareOpen(false)}><X size={18}/></button>
            </div>
            <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{padding:'10px 12px',background:'var(--brand-tint)',border:'1px solid rgba(232,103,42,.25)',borderRadius:8,fontSize:12,color:'var(--text-secondary)'}}>
                Pick a listing + lead, edit the message if you want, then choose how to send. The native app opens with your message pre-filled — you just tap send.
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div className="form-group">
                  <label>Listing</label>
                  <select
                    value={shareForm.listingId}
                    onChange={e => {
                      const id = e.target.value;
                      const lst = listings.find(l => l.id === id);
                      const label = lst ? `${lst.title || lst.name} — EGP ${(lst.price/1e6).toFixed(1)}M` : '';
                      refreshTemplate({ ...shareForm, listingId: id, listingLabel: label });
                    }}
                  >
                    <option value="">Choose listing…</option>
                    {listings.map(l => (
                      <option key={l.id} value={l.id}>
                        {(l.title || l.name)}{l.price ? ` — EGP ${(l.price/1e6).toFixed(1)}M` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Lead</label>
                  <select
                    value={shareForm.leadId}
                    onChange={e => {
                      const id = e.target.value;
                      const ld = leads.find(l => l.id === id);
                      refreshTemplate({ ...shareForm, leadId: id, leadName: ld?.name || '' });
                    }}
                  >
                    <option value="">Choose lead…</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.name}{l.phone ? ` · ${l.phone}` : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact preview — agent can see at a glance what the
                  lead has on file and which channels are usable. */}
              <div style={{display:'flex',gap:10,flexWrap:'wrap',padding:'8px 12px',background:'#f8fafc',border:'1px solid var(--border)',borderRadius:8,fontSize:12}}>
                <span><b>Phone:</b> {shareForm.leadPhone || <i style={{color:'var(--text-tertiary)'}}>none on file</i>}</span>
                <span style={{color:'var(--border)'}}>·</span>
                <span><b>Email:</b> {shareForm.leadEmail || <i style={{color:'var(--text-tertiary)'}}>none on file</i>}</span>
                <span style={{color:'var(--border)'}}>·</span>
                <span><b>Agent:</b> {persona.label}</span>
              </div>

              <div className="form-group">
                <label>Subject (used for email only)</label>
                <input
                  type="text"
                  value={shareForm.subject}
                  onChange={e => setShareForm({...shareForm, subject: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Message / talking points</label>
                <textarea
                  rows={7}
                  value={shareForm.message}
                  onChange={e => setShareForm({...shareForm, message: e.target.value})}
                  style={{fontFamily:'inherit',fontSize:13,lineHeight:1.5}}
                />
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:6,fontSize:11,color:'var(--text-tertiary)'}}>
                  <span>{shareForm.message.length} chars · used as WhatsApp / SMS / Email body, and copied to clipboard before a call.</span>
                  <button type="button" className="btn btn-outline btn-sm" onClick={copyMessage} style={{gap:6}}>
                    <Copy size={12}/> Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Channel CTAs — each one is the real action, not a tracker.
                Disabled state surfaces missing contact info so it's clear
                why a channel can't be used. */}
            <div className="modal-footer" style={{flexWrap:'wrap',gap:8,justifyContent:'flex-start'}}>
              <button
                className="btn btn-sm"
                onClick={sendWhatsApp}
                disabled={!shareForm.listingLabel || !shareForm.leadName || !shareForm.leadPhone}
                style={{background:'#25d366',color:'#fff',border:'1px solid #25d366'}}
                title={!shareForm.leadPhone ? 'No phone on file' : 'Open WhatsApp Web/App'}
              >
                <MessageSquare size={14}/> WhatsApp <ExternalLink size={11}/>
              </button>
              <button
                className="btn btn-sm"
                onClick={sendSMS}
                disabled={!shareForm.listingLabel || !shareForm.leadName || !shareForm.leadPhone}
                style={{background:'#8b5cf6',color:'#fff',border:'1px solid #8b5cf6'}}
                title={!shareForm.leadPhone ? 'No phone on file' : 'Open native SMS app'}
              >
                <Smartphone size={14}/> SMS <ExternalLink size={11}/>
              </button>
              <button
                className="btn btn-sm"
                onClick={sendEmail}
                disabled={!shareForm.listingLabel || !shareForm.leadName || !shareForm.leadEmail}
                style={{background:'#3b82f6',color:'#fff',border:'1px solid #3b82f6'}}
                title={!shareForm.leadEmail ? 'No email on file' : 'Open default email client'}
              >
                <Mail size={14}/> Email <ExternalLink size={11}/>
              </button>
              <button
                className="btn btn-sm"
                onClick={startCall}
                disabled={!shareForm.listingLabel || !shareForm.leadName || !shareForm.leadPhone}
                style={{background:'var(--brand)',color:'#fff',border:'1px solid var(--brand)'}}
                title={!shareForm.leadPhone ? 'No phone on file' : 'Start dialer — talking points copied to clipboard'}
              >
                <Phone size={14}/> Call <ExternalLink size={11}/>
              </button>
              <div style={{flex:1}}/>
              <button className="btn btn-outline btn-sm" onClick={()=>setShareOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Sent-message preview drawer ───────────────────────────── */}
      {previewShare && (
        <div className="modal-overlay" onClick={()=>setPreviewShare(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:540}}>
            <div className="modal-header">
              <h3>Share · {previewShare.id}</h3>
              <button className="btn-icon" onClick={()=>setPreviewShare(null)}><X size={18}/></button>
            </div>
            <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',gap:10,fontSize:12,flexWrap:'wrap'}}>
                <span><b>Channel:</b> <span style={{color:channelColor(previewShare.channel)}}>{previewShare.channel}</span></span>
                <span><b>Listing:</b> {previewShare.property}</span>
                <span><b>Lead:</b> {previewShare.leadName}</span>
                <span><b>Sent:</b> {previewShare.timestamp}</span>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:'var(--text-tertiary)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Message sent</div>
                <div style={{padding:'12px 14px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,fontSize:13,lineHeight:1.5,whiteSpace:'pre-wrap',fontFamily:'inherit'}}>{previewShare.message || '(no message body recorded)'}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setPreviewShare(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
