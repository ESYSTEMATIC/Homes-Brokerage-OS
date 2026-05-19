import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LISTING_STATUS, PROPERTY_TYPES } from '../../data/staticData';
import { Search, Eye, X, LayoutGrid, List, Home, Bed, Bath, Maximize, Share2, Building, MapPin, Sliders, Filter, ChevronDown, Database } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('en-EG').format(n);
const statusColor = s => s==='Available'?'badge-success':s==='Reserved'?'badge-warning':'badge-danger';

// Phone normalisation for deep links — wa.me / sms: / tel: schemes want
// digits-only (with country code, no '+').
const cleanPhone = (raw) => (raw || '').replace(/[^0-9]/g, '');

// Default message template used by every channel — uses {firstName} as a
// placeholder so the same message can be personalized per recipient when
// sending to multiple leads at once. Substituted at send time.
const buildShareMessage = ({ listingLabel, agentName }) =>
  `Hi {firstName},

I have a listing that might match what you're looking for — ${listingLabel}.

Can I share more details and arrange a viewing?

— ${agentName || 'Your Homes agent'}`;

// Per-recipient personalization — swap {firstName} for the lead's first name
// (or "there" if we don't have a name). Called once per lead when the deep
// link is built for WhatsApp / SMS / Email / Call.
const personalize = (template, lead) => {
  const first = lead?.name ? lead.name.split(' ')[0] : 'there';
  return (template || '').replace(/\{firstName\}/g, first);
};

// Multi-select Lead picker + editable message + per-channel send buttons.
// The channel buttons ARE the action: each one opens the right native app
// (WhatsApp Web, SMS, email client, dialer) with the message pre-filled
// AND writes one listingShares row per (listing × lead) so tracking and
// analytics still work without a separate "log" step.
const ShareBody = ({ listing, leads, agentName, onSent }) => {
  const [picked, setPicked] = useState(() => new Set());
  const [q, setQ] = useState('');
  const listingLabel = `${listing.project}${listing.unitCode ? ' · ' + listing.unitCode : ''}${listing.price ? ' — EGP ' + (listing.price/1e6).toFixed(1) + 'M' : ''}`;
  // Template uses {firstName} placeholder — personalized per-recipient at
  // send time. No re-rendering needed when the picked set changes; the
  // same template works for 1 lead or 10.
  const [message, setMessage] = useState(() => buildShareMessage({ listingLabel, agentName }));
  const [subject, setSubject] = useState(`Listing: ${listingLabel}`);

  const filtered = leads.filter(l =>
    !q || l.name.toLowerCase().includes(q.toLowerCase()) || l.phone?.includes(q) || l.id.toLowerCase().includes(q.toLowerCase())
  );
  const toggle = (id) => {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setPicked(next);
  };

  // Resolve the selected leads to their records — used by the channel
  // handlers to look up phone / email per lead.
  const selectedLeads = Array.from(picked).map(id => leads.find(l => l.id === id)).filter(Boolean);
  const someoneSelected = selectedLeads.length > 0;
  const missingPhone   = selectedLeads.filter(l => !cleanPhone(l.phone)).length;
  const missingEmail   = selectedLeads.filter(l => !l.email).length;

  // Each channel handler loops the picked leads, opens the native app
  // per lead (or once for email/SMS where comma-list works), and calls
  // onSent so the parent can record each share row + close the modal.
  const sendWhatsApp = () => {
    if (!someoneSelected) return;
    const withPhone = selectedLeads.filter(l => cleanPhone(l.phone));
    if (withPhone.length === 0) { onSent('error', 'Selected leads have no phone numbers on file'); return; }
    // One wa.me tab per lead with the message PERSONALIZED for that lead
    // (the {firstName} placeholder gets replaced with the lead's first name).
    // Tabs are staggered 150ms apart so popup blockers don't swallow them.
    withPhone.forEach((l, i) => {
      const text = personalize(message, l);
      const url = `https://wa.me/${cleanPhone(l.phone)}?text=${encodeURIComponent(text)}`;
      setTimeout(() => window.open(url, '_blank', 'noopener'), i * 150);
    });
    onSent('WhatsApp', { leads: withPhone, message, skipped: selectedLeads.length - withPhone.length });
  };
  const sendSMS = () => {
    if (!someoneSelected) return;
    const withPhone = selectedLeads.filter(l => cleanPhone(l.phone));
    if (withPhone.length === 0) { onSent('error', 'Selected leads have no phone numbers on file'); return; }
    if (withPhone.length === 1) {
      // Single recipient — personalize the body.
      const l = withPhone[0];
      window.location.href = `sms:+${cleanPhone(l.phone)}?body=${encodeURIComponent(personalize(message, l))}`;
    } else {
      // Multiple recipients — sms: with comma-joined recipients can't carry
      // a personalized body. Open ONE sms: per lead, staggered, each
      // personalized. Falls back gracefully if the device opens only the
      // first one (mobile native behaviour).
      withPhone.forEach((l, i) => {
        const url = `sms:+${cleanPhone(l.phone)}?body=${encodeURIComponent(personalize(message, l))}`;
        setTimeout(() => { window.location.href = url; }, i * 200);
      });
    }
    onSent('SMS', { leads: withPhone, message, skipped: selectedLeads.length - withPhone.length });
  };
  const sendEmail = () => {
    if (!someoneSelected) return;
    const withEmail = selectedLeads.filter(l => l.email);
    if (withEmail.length === 0) { onSent('error', 'Selected leads have no email on file'); return; }
    if (withEmail.length === 1) {
      // Single recipient — personalize.
      const l = withEmail[0];
      window.location.href = `mailto:${l.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(personalize(message, l))}`;
    } else {
      // Multiple recipients — open ONE mailto: per lead so each one is
      // personalized. The agent sends each draft.
      withEmail.forEach((l, i) => {
        const url = `mailto:${l.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(personalize(message, l))}`;
        setTimeout(() => { window.location.href = url; }, i * 250);
      });
    }
    onSent('Email', { leads: withEmail, message, subject, skipped: selectedLeads.length - withEmail.length });
  };
  const startCall = () => {
    if (selectedLeads.length !== 1) { onSent('error', 'Call is one-lead-at-a-time. Pick exactly one lead.'); return; }
    const l = selectedLeads[0];
    const phone = cleanPhone(l.phone);
    if (!phone) { onSent('error', 'This lead has no phone number on file'); return; }
    try { navigator.clipboard?.writeText(personalize(message, l)); } catch (e) { void e; }
    window.location.href = `tel:+${phone}`;
    onSent('Call', { leads: [l], message });
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{padding:'10px 12px',background:'#f8fafc',border:'1px solid var(--border)',borderRadius:8,fontSize:12}}>
        <b>Listing:</b> {listingLabel}
      </div>

      <div>
        <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'flex',justifyContent:'space-between',marginBottom:6}}>
          <span>Leads ({picked.size} selected)</span>
          <span style={{fontWeight:500,color:'var(--text-tertiary)'}}>Multi-select supported</span>
        </label>
        <input
          placeholder="Search lead by name, phone, ID…"
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={{width:'100%',padding:'9px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'inherit',marginBottom:8}}
        />
        <div style={{maxHeight:200,overflowY:'auto',border:'1px solid var(--border)',borderRadius:8}}>
          {filtered.map(l => (
            <label
              key={l.id}
              style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',cursor:'pointer',borderBottom:'1px solid var(--border)',background: picked.has(l.id) ? 'var(--brand-tint)' : '#fff'}}
            >
              <input type="checkbox" checked={picked.has(l.id)} onChange={()=>toggle(l.id)} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{l.name}</div>
                <div style={{fontSize:11,color:'var(--text-tertiary)'}}>{l.id} · {l.phone || <i>no phone</i>} · {l.email || <i>no email</i>} · {l.stage}</div>
              </div>
            </label>
          ))}
          {filtered.length === 0 && <div style={{padding:'20px',textAlign:'center',color:'var(--text-tertiary)',fontSize:12}}>No leads match.</div>}
        </div>
        {someoneSelected && (missingPhone > 0 || missingEmail > 0) && (
          <div style={{marginTop:6,fontSize:11,color:'#b45309'}}>
            {missingPhone > 0 && <span>{missingPhone} selected lead{missingPhone===1?'':'s'} have no phone (WhatsApp/SMS/Call will skip them). </span>}
            {missingEmail > 0 && <span>{missingEmail} selected lead{missingEmail===1?'':'s'} have no email (Email will skip them).</span>}
          </div>
        )}
      </div>

      <div>
        <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Email subject</label>
        <input
          type="text"
          value={subject}
          onChange={e=>setSubject(e.target.value)}
          style={{width:'100%',padding:'9px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'inherit'}}
        />
      </div>

      <div>
        <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Message / talking points</label>
        <textarea
          rows={6}
          value={message}
          onChange={e=>setMessage(e.target.value)}
          style={{width:'100%',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'inherit',lineHeight:1.5,resize:'vertical'}}
        />
        <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4,display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
          <span><b>Tip:</b> use <code style={{padding:'1px 5px',background:'#f1f5f9',borderRadius:3,fontFamily:'ui-monospace,monospace'}}>{`{firstName}`}</code> — it gets replaced per recipient.</span>
          {someoneSelected && (
            <span style={{color:'var(--brand)',fontWeight:600}}>· will be sent to {selectedLeads.length} lead{selectedLeads.length===1?'':'s'}, each personalized</span>
          )}
        </div>
      </div>

      {/* Channel CTAs — each one is the real action. */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',paddingTop:8,borderTop:'1px solid var(--border)'}}>
        <button type="button" className="btn btn-sm" onClick={sendWhatsApp} disabled={!someoneSelected} style={{background:'#25d366',color:'#fff',border:'1px solid #25d366'}}>
          WhatsApp <span style={{opacity:.85,fontSize:10}}>↗</span>
        </button>
        <button type="button" className="btn btn-sm" onClick={sendSMS} disabled={!someoneSelected} style={{background:'#8b5cf6',color:'#fff',border:'1px solid #8b5cf6'}}>
          SMS <span style={{opacity:.85,fontSize:10}}>↗</span>
        </button>
        <button type="button" className="btn btn-sm" onClick={sendEmail} disabled={!someoneSelected} style={{background:'#3b82f6',color:'#fff',border:'1px solid #3b82f6'}}>
          Email <span style={{opacity:.85,fontSize:10}}>↗</span>
        </button>
        <button type="button" className="btn btn-sm" onClick={startCall} disabled={selectedLeads.length !== 1} title={selectedLeads.length !== 1 ? 'Call is one lead at a time' : 'Start dialer'} style={{background:'var(--brand)',color:'#fff',border:'1px solid var(--brand)'}}>
          Call <span style={{opacity:.85,fontSize:10}}>↗</span>
        </button>
      </div>
    </div>
  );
};

// ─── Map view (Leaflet + Google tiles) ─────────────────────────
// 11-May meeting (1:35-1:36): "Nawy-style maps are powerful — other
// brokerages use them." Visualise the agent's inventory geographically so
// they can answer "what do you have in [area]?" during a live call.
const STATUS_PIN_COLOR = { Available:'#16a34a', Reserved:'#f59e0b', Sold:'#ef4444' };

const ListingsMap = ({ listings, onMarkerClick }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  // Drop listings without coordinates (fallback safety).
  const geoListings = useMemo(() => listings.filter(l => typeof l.lat === 'number' && typeof l.lng === 'number'), [listings]);

  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || !window.L || !containerRef.current || mapRef.current) return;
      const map = window.L.map(containerRef.current, { center: [30.05, 31.45], zoom: 9, zoomControl: true, scrollWheelZoom: true });
      window.L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20, subdomains: ['mt0','mt1','mt2','mt3'], attribution: '© Google',
      }).addTo(map);
      mapRef.current = { map, markers: [] };
    };
    if (window.L) { init(); }
    else if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'leaflet-css'; css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      const js = document.createElement('script');
      js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      js.async = true; js.onload = init;
      document.body.appendChild(js);
    } else {
      const wait = setInterval(() => { if (window.L) { clearInterval(wait); init(); } }, 80);
      return () => clearInterval(wait);
    }
    return () => { cancelled = true; if (mapRef.current?.map) { mapRef.current.map.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    const ref = mapRef.current;
    if (!ref || !window.L) return;
    ref.markers.forEach(m => m.remove());
    ref.markers = geoListings.map(l => {
      const color = STATUS_PIN_COLOR[l.status] || '#64748b';
      const html = `<div style="background:${color};color:#fff;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.25);white-space:nowrap;">EGP ${(l.price/1e6).toFixed(1)}M</div>`;
      const icon = window.L.divIcon({ className: 'crm-map-pin', html, iconSize: [70, 26], iconAnchor: [35, 13] });
      const m = window.L.marker([l.lat, l.lng], { icon })
        .addTo(ref.map)
        .bindPopup(`
          <div style="font-family:inherit;min-width:200px;">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${l.project} · ${l.unitCode}</div>
            <div style="font-size:11px;color:#64748b;margin-bottom:6px;">${l.developer} · ${l.unitType} · ${l.bedrooms}BD · ${l.area}m²</div>
            <div style="font-weight:800;color:#E8672A;font-size:13px;margin-bottom:6px;">EGP ${l.price.toLocaleString()}</div>
            <span style="display:inline-block;padding:2px 8px;border-radius:4px;background:${color}1a;color:${color};font-size:10px;font-weight:700;text-transform:uppercase;">${l.status}</span>
          </div>
        `);
      m.on('click', () => onMarkerClick?.(l));
      return m;
    });
    if (geoListings.length && !ref.fittedFor || (ref.fittedFor !== geoListings.length)) {
      const bounds = window.L.latLngBounds(geoListings.map(l => [l.lat, l.lng]));
      ref.map.fitBounds(bounds.pad(0.25), { animate: false });
      ref.fittedFor = geoListings.length;
    }
  }, [geoListings, onMarkerClick]);

  return (
    <div className="data-panel" style={{padding:0,overflow:'hidden'}}>
      <div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:14,flexWrap:'wrap'}}>
        <div style={{fontSize:13,fontWeight:700}}>Geographic view · {geoListings.length} listing{geoListings.length===1?'':'s'} mapped</div>
        <div style={{display:'flex',gap:12,fontSize:11,color:'var(--text-secondary)'}}>
          {Object.entries(STATUS_PIN_COLOR).map(([s,c]) => (
            <div key={s} style={{display:'flex',alignItems:'center',gap:5}}>
              <span style={{width:10,height:10,borderRadius:5,background:c,display:'inline-block'}}/>
              {s}
            </div>
          ))}
        </div>
      </div>
      <div ref={containerRef} style={{height: 520, width:'100%', background:'#e2e8f0'}}/>
    </div>
  );
};

export const CrmListings = () => {
  const { state, addItem, toast, openDrawer, openModal, closeModal, persona } = useApp();
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchCursor, setSearchCursor] = useState(0);
  const searchRef = useRef(null);
  const [fDev, setFDev] = useState('All');
  const [fType, setFType] = useState('All');
  const [fStatus, setFStatus] = useState('All');
  // Advanced search state. `advFilters` accumulates criteria from the modal.
  // The modal lives in `showAdvanced`; chip strip below the search bar lets
  // the user see / remove active criteria without reopening the modal.
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advFilters, setAdvFilters] = useState({
    minPrice: '', maxPrice: '', minArea: '', maxArea: '',
    minBeds: '', minBaths: '', city: '', compound: '', floor: '',
    statuses: [], // multi-select status
    paymentPlan: '', features: [],
  });
  // Saved searches — persist for the session so HR/Director can recall their
  // last cuts of the inventory.
  const [savedSearches, setSavedSearches] = useState([]);

  // Listings inventory is mastered in EGMLS and synced into Homes — there is
  // intentionally NO "Add Listing" CTA on this page. Brokerages do not create
  // listings here; they appear via the EGMLS sync pipeline.

  const listings = state.listings || [];
  const leads = state.leads || [];
  const listingShares = state.listingShares || [];

  const developers = [...new Set(listings.map(l=>l.developer))];

  // ───── Listing Shares (rewired 08-May) ─────
  // Share button on every listing card. Multi-lead picker, multi-channel.
  // Writes one row per (listing × lead) into state.listingShares + an
  // activity entry on each chosen lead via the audit log.
  const shareCountFor = (listingId) => listingShares.filter(s => s.listingId === listingId).length;

  const shareListing = (l) => {
    // onSent fires whenever a channel CTA inside the modal actually opens
    // a native app. It writes one listingShares row per (listing × lead)
    // with the message body persisted, and closes the modal with a
    // confirmation toast. 'error' is a sentinel for missing-contact cases.
    const onSent = (channel, payload) => {
      if (channel === 'error') { toast(payload || 'Could not send', 'error'); return; }
      const { leads: picked, message, subject, skipped = 0 } = payload;
      const ts = new Date().toISOString().slice(0,16).replace('T',' ');
      picked.forEach(lead => {
        addItem('listingShares', {
          listingId: l.id,
          property: `${l.project} ${l.unitCode}`,
          leadId: lead.id,
          leadName: lead.name,
          channel,
          agent: persona?.label || 'Fatma Ibrahim',
          timestamp: ts,
          response: 'No Response',
          message,
          subject: channel === 'Email' ? subject : undefined,
        }, 'SHR', {
          action: 'Listing Shared',
          module: 'CRM',
          target: lead.id,
          detail: `${l.project} ${l.unitCode} → ${lead.name} via ${channel}`,
        });
      });
      const where = channel === 'WhatsApp' ? 'WhatsApp Web'
                  : channel === 'SMS'      ? 'your SMS app'
                  : channel === 'Email'    ? 'your email client'
                  :                          'your dialer';
      toast(
        `Opened ${where} for ${picked.length} lead${picked.length===1?'':'s'} · share logged${skipped > 0 ? ` · ${skipped} skipped (missing contact)` : ''}`,
        'success'
      );
      closeModal();
    };

    openModal({
      title: `Share — ${l.project} ${l.unitCode}`,
      subtitle: `Pick lead(s), edit the message, then choose how to send`,
      // Hide the default Submit — channel CTAs inside the body are the action.
      submitLabel: null,
      body: (
        <ShareBody
          listing={l}
          leads={leads}
          agentName={persona?.label}
          onSent={onSent}
        />
      ),
    });
  };

  // Listings filter — combines quick autocomplete + top toolbar filters +
  // advanced search criteria (price range, area range, beds/baths minimums,
  // multi-status, etc).
  const filtered = useMemo(()=>listings.filter(l=>{
    if (search) {
      const needle = search.toLowerCase();
      const hay = `${l.project} ${l.unitCode} ${l.developer || ''} ${l.city || ''} ${l.unitType || ''} ${l.id || ''}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    if(fDev!=='All' && l.developer!==fDev) return false;
    if(fType!=='All' && l.unitType!==fType) return false;
    if(fStatus!=='All' && l.status!==fStatus) return false;
    // Advanced filters
    const price = Number(l.price) || 0;
    const area  = Number(l.area)  || 0;
    if (advFilters.minPrice && price < Number(advFilters.minPrice)) return false;
    if (advFilters.maxPrice && price > Number(advFilters.maxPrice)) return false;
    if (advFilters.minArea  && area  < Number(advFilters.minArea))  return false;
    if (advFilters.maxArea  && area  > Number(advFilters.maxArea))  return false;
    if (advFilters.minBeds  && Number(l.bedrooms || 0)  < Number(advFilters.minBeds))  return false;
    if (advFilters.minBaths && Number(l.bathrooms || 0) < Number(advFilters.minBaths)) return false;
    if (advFilters.city     && (l.city || '').toLowerCase() !== advFilters.city.toLowerCase()) return false;
    if (advFilters.compound && !(l.project || '').toLowerCase().includes(advFilters.compound.toLowerCase())) return false;
    if (advFilters.floor    && String(l.floor || '') !== String(advFilters.floor)) return false;
    if (advFilters.statuses.length > 0 && !advFilters.statuses.includes(l.status)) return false;
    if (advFilters.paymentPlan && !(l.paymentPlan || '').toLowerCase().includes(advFilters.paymentPlan.toLowerCase())) return false;
    if (advFilters.features.length > 0) {
      const has = advFilters.features.every(f => (l.features || []).includes(f));
      if (!has) return false;
    }
    return true;
  }),[listings, search,fDev,fType,fStatus,advFilters]);

  // Count of active advanced criteria — used to drive the chip count badge.
  const activeAdvCount =
    (advFilters.minPrice  ? 1 : 0) + (advFilters.maxPrice  ? 1 : 0) +
    (advFilters.minArea   ? 1 : 0) + (advFilters.maxArea   ? 1 : 0) +
    (advFilters.minBeds   ? 1 : 0) + (advFilters.minBaths  ? 1 : 0) +
    (advFilters.city      ? 1 : 0) + (advFilters.compound  ? 1 : 0) +
    (advFilters.floor     ? 1 : 0) + (advFilters.statuses.length > 0 ? 1 : 0) +
    (advFilters.paymentPlan ? 1 : 0) + (advFilters.features.length > 0 ? 1 : 0);

  const clearAdvanced = () => setAdvFilters({
    minPrice:'', maxPrice:'', minArea:'', maxArea:'',
    minBeds:'', minBaths:'', city:'', compound:'', floor:'',
    statuses:[], paymentPlan:'', features:[],
  });

  const saveCurrentSearch = () => {
    const label = `Search ${savedSearches.length + 1}`;
    setSavedSearches([...savedSearches, { id: `SS-${Date.now()}`, label, q: search, fDev, fType, fStatus, advFilters: {...advFilters} }]);
    toast('Search saved');
  };
  const applySaved = (s) => {
    setSearch(s.q || '');
    setFDev(s.fDev || 'All');
    setFType(s.fType || 'All');
    setFStatus(s.fStatus || 'All');
    setAdvFilters(s.advFilters || advFilters);
    toast(`Loaded "${s.label}"`);
  };

  // Autocomplete top matches (used by the inline dropdown).
  const autocomplete = useMemo(() => {
    if (!search || search.trim().length < 1) return [];
    const needle = search.toLowerCase();
    return listings
      .filter(l => {
        const hay = `${l.project} ${l.unitCode} ${l.developer || ''} ${l.city || ''} ${l.unitType || ''} ${l.id || ''}`.toLowerCase();
        return hay.includes(needle);
      })
      .slice(0, 8);
  }, [search, listings]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    if (!searchOpen) return;
    const onDoc = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [searchOpen]);

  // Deep-link via ?openListing=L-xxx — used by the global Smart Search.
  const [searchParams, setSearchParams] = useSearchParams();
  const deepLinkId = searchParams.get('openListing');
  useEffect(() => {
    if (!deepLinkId) return;
    const target = listings.find(l => l.id === deepLinkId);
    if (target) {
      // Defer one tick so the drawer mount happens after the route paint.
      setTimeout(() => viewDetail(target), 80);
      // Strip the query param so refresh doesn't re-trigger.
      const next = new URLSearchParams(searchParams);
      next.delete('openListing');
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkId, listings]);

  const viewDetail = l => openDrawer({title:l.project,subtitle:`${l.unitType} · ${l.unitCode}`,content:(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {l.image && (
        <div style={{height:220,borderRadius:12,backgroundImage:`url(${l.image})`,backgroundSize:'cover',backgroundPosition:'center',position:'relative'}}>
          <span className={`badge ${statusColor(l.status)}`} style={{position:'absolute',top:12,left:12}}>{l.status}</span>
        </div>
      )}
      <div style={{background:'linear-gradient(135deg,#f8fafc,#eef2ff)',borderRadius:12,padding:20,display:'flex',gap:20,alignItems:'center'}}>
        <div style={{width:80,height:80,borderRadius:14,background:'var(--brand-tint)',display:'flex',alignItems:'center',justifyContent:'center'}}><Home size={32} color="var(--brand)"/></div>
        <div><div style={{fontSize:18,fontWeight:800}}>EGP {fmt(l.price)}</div><div style={{fontSize:13,color:'var(--text-secondary)',marginTop:4}}>{l.paymentPlan}</div><span className={`badge ${statusColor(l.status)}`} style={{marginTop:8}}>{l.status}</span></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[['Developer',l.developer],['Unit Code',l.unitCode],['Unit Type',l.unitType],['Area',`${l.area} m²`],['Bedrooms',l.bedrooms],['Bathrooms',l.bathrooms],['Floor',l.floor],['Created',l.created]].map(([k,v])=>(<div key={k}><div className="drawer-label">{k}</div><div className="drawer-value">{v}</div></div>))}
      </div>
      <div><div className="drawer-label">Features</div><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{l.features.map(f=><span key={f} style={{padding:'4px 10px',background:'var(--brand-tint)',color:'var(--brand)',borderRadius:20,fontSize:11,fontWeight:600}}>{f}</span>)}</div></div>
      <button className="btn btn-brand" onClick={()=>shareListing(l)}><Share2 size={14}/> Share Listing</button>
    </div>
  )});

  return (
    <div>
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
        <div>
          <h1 className="page-title">Listings & Inventory</h1>
          <p className="page-subtitle">Inventory synced from EGMLS · search, filter, and share with leads</p>
        </div>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'8px 14px', borderRadius:999,
          background:'rgba(16,185,129,0.08)',
          border:'1px solid rgba(16,185,129,0.25)',
          color:'#047857', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
        }} title="Listings are mastered in EGMLS — no manual creation here.">
          <span style={{width:7,height:7,borderRadius:4,background:'#10b981',boxShadow:'0 0 0 3px rgba(16,185,129,0.22)'}}/>
          <Database size={12}/> EGMLS SYNC · LIVE
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[['Total Listings',listings.length,'var(--info)'],['Available',listings.filter(l=>l.status==='Available').length,'var(--success)'],['Reserved',listings.filter(l=>l.status==='Reserved').length,'var(--warning)'],['Sold',listings.filter(l=>l.status==='Sold').length,'var(--brand)']].map(([l,v,c])=>(
          <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'16px 20px',borderTop:`3px solid ${c}`}}><div style={{fontSize:12,color:'var(--text-secondary)',fontWeight:600}}>{l}</div><div style={{fontSize:24,fontWeight:800,marginTop:4}}>{v}</div></div>
        ))}
      </div>

      {/* ─── Search & Filters Hero ───────────────────────────────────
          Redesigned search box: gradient hero, large pill search input
          with inline pre-filters, advanced toggle, and view selector. */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '20px 22px',
        marginBottom: 20,
        boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
      }}>
        {/* Top row: large search + advanced + add */}
        <div style={{display:'flex', alignItems:'center', gap:12, flexWrap:'wrap'}}>
          {/* Big search bar with brand-tinted icon block */}
          <div ref={searchRef} style={{position:'relative', flex:'1 1 320px', minWidth: 240}}>
            <div style={{
              display:'flex',
              alignItems:'center',
              gap:0,
              background:'#fff',
              border:`2px solid ${searchOpen || search ? 'var(--brand)' : 'var(--border)'}`,
              borderRadius:14,
              transition:'border-color .15s, box-shadow .15s',
              boxShadow: searchOpen ? '0 6px 18px rgba(229,9,20,0.10)' : '0 1px 2px rgba(15,23,42,0.04)',
              overflow:'hidden',
            }}>
              {/* Brand-tinted icon block */}
              <div style={{
                width:48, height:48, flexShrink:0,
                background:'linear-gradient(135deg, var(--brand), #b91c1c)',
                color:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Search size={20}/>
              </div>
              <input
                type="text"
                placeholder="Search project, unit code, developer, city, MLS ID…"
                value={search}
                onChange={e => { setSearch(e.target.value); setSearchOpen(true); setSearchCursor(0); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(e) => {
                  if (!autocomplete.length) return;
                  if (e.key === 'ArrowDown') { e.preventDefault(); setSearchCursor(c => Math.min(c + 1, autocomplete.length - 1)); }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); setSearchCursor(c => Math.max(c - 1, 0)); }
                  else if (e.key === 'Enter') {
                    e.preventDefault();
                    const target = autocomplete[searchCursor];
                    if (target) { viewDetail(target); setSearchOpen(false); }
                  }
                  else if (e.key === 'Escape') setSearchOpen(false);
                }}
                style={{
                  flex:1,
                  border:'none',
                  outline:'none',
                  padding:'0 14px',
                  fontSize:14,
                  fontWeight:500,
                  background:'transparent',
                  color:'var(--text-primary)',
                  minWidth:0,
                }}
              />
              {/* Keyboard hint when empty */}
              {!search && (
                <kbd style={{
                  marginRight:10,
                  padding:'3px 8px',
                  background:'#f8fafc',
                  border:'1px solid var(--border)',
                  borderRadius:6,
                  fontFamily:'monospace',
                  fontSize:10,
                  color:'var(--text-tertiary)',
                  fontWeight:600,
                  whiteSpace:'nowrap',
                }}>↑↓ ↵</kbd>
              )}
              {search && (
                <button
                  onClick={() => { setSearch(''); setSearchOpen(false); searchRef.current?.querySelector('input')?.focus(); }}
                  style={{
                    background:'#f1f5f9',
                    border:'none',
                    cursor:'pointer',
                    color:'var(--text-secondary)',
                    padding:'6px 8px',
                    display:'inline-flex',
                    alignItems:'center',
                    borderRadius:6,
                    marginRight:10,
                  }}
                  aria-label="Clear search"
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                ><X size={14}/></button>
              )}
            </div>

            {/* Autocomplete dropdown */}
            {searchOpen && search.trim().length >= 1 && (
              <div style={{
                position:'absolute', top:'calc(100% + 4px)', left:0, right:0,
                background:'#fff', border:'1px solid var(--border)', borderRadius:10,
                boxShadow:'0 12px 32px rgba(15,23,42,0.12)',
                maxHeight:380, overflowY:'auto', zIndex:1000,
              }}>
                {autocomplete.length === 0 ? (
                  <div style={{padding:'16px 18px', fontSize:12, color:'var(--text-tertiary)', textAlign:'center'}}>
                    No listings match <b>"{search}"</b>
                  </div>
                ) : (
                  <>
                    {autocomplete.map((l, i) => {
                      const isActive = i === searchCursor;
                      return (
                        <div
                          key={l.id}
                          onMouseEnter={() => setSearchCursor(i)}
                          onClick={() => { viewDetail(l); setSearchOpen(false); }}
                          style={{
                            display:'flex', alignItems:'center', gap:12,
                            padding:'10px 14px', cursor:'pointer',
                            borderBottom:'1px solid #f1f5f9',
                            background: isActive ? 'var(--brand-tint)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--brand)' : '3px solid transparent',
                          }}>
                          <div style={{
                            width:38, height:38, borderRadius:8, flexShrink:0,
                            background: l.image ? `url(${l.image})` : 'var(--brand-tint)',
                            backgroundSize:'cover', backgroundPosition:'center',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            color:'var(--brand)',
                          }}>
                            {!l.image && <Home size={16}/>}
                          </div>
                          <div style={{flex:1, minWidth:0}}>
                            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:2}}>
                              <span style={{fontSize:9, fontWeight:700, color:'var(--brand)', letterSpacing:'.06em', padding:'2px 6px', background:'var(--brand-tint)', borderRadius:4}}>{l.unitCode}</span>
                              <span style={{fontSize:10, color:'var(--text-tertiary)', fontFamily:'monospace'}}>{l.id}</span>
                              <span className={`badge ${statusColor(l.status)}`} style={{fontSize:9, padding:'1px 6px'}}>{l.status}</span>
                            </div>
                            <div style={{fontSize:13, fontWeight:700, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                              {l.project}
                            </div>
                            <div style={{fontSize:11, color:'var(--text-secondary)', marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                              {l.developer} · {l.unitType} · {l.bedrooms}BD · {l.area} m² · {l.city || '—'}
                            </div>
                          </div>
                          <div style={{fontSize:12, fontWeight:700, color:'var(--brand)', whiteSpace:'nowrap'}}>
                            EGP {fmt(l.price)}
                          </div>
                        </div>
                      );
                    })}
                    <div style={{padding:'8px 14px', fontSize:10, color:'var(--text-tertiary)', background:'#fafbfc', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between'}}>
                      <span>{autocomplete.length} match{autocomplete.length === 1 ? '' : 'es'} · click to open</span>
                      <span><kbd style={{padding:'1px 5px', background:'#fff', border:'1px solid var(--border)', borderRadius:3, fontFamily:'monospace', fontSize:9}}>↑↓</kbd> <kbd style={{padding:'1px 5px', background:'#fff', border:'1px solid var(--border)', borderRadius:3, fontFamily:'monospace', fontSize:9}}>↵</kbd></span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right-aligned action buttons next to the search bar */}
          <button
            onClick={() => setShowAdvanced(true)}
            style={{
              display:'inline-flex',
              alignItems:'center',
              gap:8,
              padding:'12px 16px',
              background: activeAdvCount > 0 ? 'var(--brand-tint)' : '#fff',
              border: `1.5px solid ${activeAdvCount > 0 ? 'var(--brand)' : 'var(--border)'}`,
              borderRadius:12,
              color: activeAdvCount > 0 ? 'var(--brand)' : 'var(--text-primary)',
              fontSize:13,
              fontWeight:600,
              cursor:'pointer',
              position:'relative',
              transition:'all .15s',
              whiteSpace:'nowrap',
            }}
            title="Open advanced search"
            onMouseEnter={e => { if (activeAdvCount === 0) e.currentTarget.style.borderColor = 'var(--brand)'; }}
            onMouseLeave={e => { if (activeAdvCount === 0) e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <Sliders size={15}/> Advanced
            {activeAdvCount > 0 && (
              <span style={{
                marginLeft:2, fontSize:10, fontWeight:800,
                padding:'2px 7px', borderRadius:999,
                background:'var(--brand)', color:'#fff',
                minWidth:18, textAlign:'center',
              }}>{activeAdvCount}</span>
            )}
          </button>
        </div>

        {/* Filter divider */}
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          marginTop:16, paddingTop:14,
          borderTop:'1px dashed var(--border)',
          flexWrap:'wrap',
        }}>
          <span style={{
            fontSize:10, fontWeight:700, color:'var(--text-tertiary)',
            textTransform:'uppercase', letterSpacing:'.08em',
            display:'inline-flex', alignItems:'center', gap:5,
          }}>
            <Filter size={11}/> Quick filters
          </span>
          <FilterSelect label="Developer" value={fDev} onChange={setFDev} options={developers}/>
          <FilterSelect label="Type"      value={fType} onChange={setFType} options={PROPERTY_TYPES}/>
          <FilterSelect label="Status"    value={fStatus} onChange={setFStatus} options={LISTING_STATUS}/>

          {/* Quick clear when any filter is active */}
          {(fDev !== 'All' || fType !== 'All' || fStatus !== 'All' || search) && (
            <button
              onClick={() => { setFDev('All'); setFType('All'); setFStatus('All'); setSearch(''); }}
              style={{
                fontSize:11, fontWeight:600,
                color:'var(--brand)', background:'none',
                border:'none', cursor:'pointer',
                textDecoration:'underline', padding:0,
              }}>
              Reset filters
            </button>
          )}

          {/* View toggle pushed to the right */}
          <div style={{marginLeft:'auto', display:'flex', gap:4, background:'#f1f5f9', padding:3, borderRadius:10}}>
            {[
              { k:'grid',  icon:<LayoutGrid size={14}/>, label:'Grid' },
              { k:'table', icon:<List size={14}/>,       label:'Table' },
              { k:'map',   icon:<MapPin size={14}/>,     label:'Map' },
            ].map(v => (
              <button
                key={v.k}
                onClick={() => setView(v.k)}
                title={`${v.label} view`}
                style={{
                  display:'inline-flex', alignItems:'center', gap:5,
                  padding:'6px 12px',
                  background: view === v.k ? '#fff' : 'transparent',
                  color: view === v.k ? 'var(--brand)' : 'var(--text-secondary)',
                  border:'none',
                  borderRadius:7,
                  fontSize:12,
                  fontWeight:600,
                  cursor:'pointer',
                  boxShadow: view === v.k ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
                  transition:'all .15s',
                }}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>
        {/* Active advanced-criteria chips strip */}
        {(activeAdvCount > 0 || savedSearches.length > 0) && (
          <div style={{marginTop:10, display:'flex', gap:6, flexWrap:'wrap', alignItems:'center'}}>
            {advFilters.minPrice && <Chip label={`Min EGP ${Number(advFilters.minPrice).toLocaleString()}`} onClear={() => setAdvFilters({...advFilters, minPrice:''})}/>}
            {advFilters.maxPrice && <Chip label={`Max EGP ${Number(advFilters.maxPrice).toLocaleString()}`} onClear={() => setAdvFilters({...advFilters, maxPrice:''})}/>}
            {advFilters.minArea  && <Chip label={`Min ${advFilters.minArea} m²`}                            onClear={() => setAdvFilters({...advFilters, minArea:''})}/>}
            {advFilters.maxArea  && <Chip label={`Max ${advFilters.maxArea} m²`}                            onClear={() => setAdvFilters({...advFilters, maxArea:''})}/>}
            {advFilters.minBeds  && <Chip label={`${advFilters.minBeds}+ bd`}                              onClear={() => setAdvFilters({...advFilters, minBeds:''})}/>}
            {advFilters.minBaths && <Chip label={`${advFilters.minBaths}+ ba`}                             onClear={() => setAdvFilters({...advFilters, minBaths:''})}/>}
            {advFilters.city     && <Chip label={`City: ${advFilters.city}`}                                onClear={() => setAdvFilters({...advFilters, city:''})}/>}
            {advFilters.compound && <Chip label={`Compound: ${advFilters.compound}`}                       onClear={() => setAdvFilters({...advFilters, compound:''})}/>}
            {advFilters.floor    && <Chip label={`Floor: ${advFilters.floor}`}                              onClear={() => setAdvFilters({...advFilters, floor:''})}/>}
            {advFilters.statuses.length > 0 && advFilters.statuses.map(s => <Chip key={s} label={`Status: ${s}`} onClear={() => setAdvFilters({...advFilters, statuses: advFilters.statuses.filter(x => x !== s)})}/>)}
            {advFilters.paymentPlan && <Chip label={`Plan: ${advFilters.paymentPlan}`}                      onClear={() => setAdvFilters({...advFilters, paymentPlan:''})}/>}
            {advFilters.features.map(f => <Chip key={f} label={f} onClear={() => setAdvFilters({...advFilters, features: advFilters.features.filter(x => x !== f)})}/>)}
            {activeAdvCount > 0 && <button onClick={clearAdvanced} style={{fontSize:11, color:'var(--brand)', background:'none', border:'none', cursor:'pointer', fontWeight:600}}>Clear all</button>}
            {activeAdvCount > 0 && <button onClick={saveCurrentSearch} style={{fontSize:11, color:'var(--text-secondary)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline'}}>Save search</button>}
            {savedSearches.length > 0 && (
              <select className="filter-select" style={{fontSize:11, marginLeft:8}} onChange={e => { if (!e.target.value) return; applySaved(savedSearches.find(s => s.id === e.target.value)); e.target.value = ''; }}>
                <option value="">Recall saved…</option>
                {savedSearches.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            )}
          </div>
        )}
        <div style={{marginTop:10,fontSize:12,color:'var(--text-tertiary)'}}>Showing {filtered.length} listings</div>
      </div>

      {/* ─── Advanced Search modal ───────────────────────────────── */}
      {showAdvanced && (
        <AdvancedSearchModal
          filters={advFilters}
          setFilters={setAdvFilters}
          onClose={() => setShowAdvanced(false)}
          onClear={clearAdvanced}
          onSave={saveCurrentSearch}
          listings={listings}
        />
      )}

      {view==='map' ? (
        <ListingsMap listings={filtered} onMarkerClick={viewDetail}/>
      ) : view==='grid' ? (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
          {filtered.map(l=>{
            const shareCount = shareCountFor(l.id);
            return (
            <div key={l.id} className="listing-card" onClick={()=>viewDetail(l)}>
              <div
                className="listing-card-img"
                style={l.image ? { backgroundImage:`url(${l.image})`, backgroundSize:'cover', backgroundPosition:'center' } : undefined}
              >
                {!l.image && <Building size={40} color="var(--brand)"/>}
                <span className={`badge ${statusColor(l.status)}`} style={{position:'absolute',top:12,left:12}}>{l.status}</span>
                {shareCount > 0 && (
                  <span title={`${shareCount} share${shareCount===1?'':'s'}`} style={{position:'absolute',top:12,right:12,background:'rgba(255,255,255,.95)',color:'var(--brand)',padding:'3px 8px',borderRadius:6,fontSize:11,fontWeight:700,display:'flex',alignItems:'center',gap:4}}>
                    <Share2 size={11}/> {shareCount}
                  </span>
                )}
                <span style={{position:'absolute',bottom:10,right:12,background:'rgba(15,23,42,.78)',color:'#fff',padding:'3px 10px',borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:'.04em'}}>EGYPT MLS</span>
              </div>
              <div style={{padding:'16px 20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8,gap:8}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.project}</div>
                    <div style={{fontSize:12,color:'var(--text-secondary)'}}>{l.developer} · {l.unitCode}</div>
                  </div>
                </div>
                <div style={{fontSize:18,fontWeight:800,color:'var(--brand)',marginBottom:10}}>EGP {fmt(l.price)}</div>
                <div style={{display:'flex',gap:16,fontSize:12,color:'var(--text-secondary)',marginBottom:10,flexWrap:'wrap'}}>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Home size={13}/>{l.unitType}</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Bed size={13}/>{l.bedrooms} BD</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Bath size={13}/>{l.bathrooms} BA</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Maximize size={13}/>{l.area}m²</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0 0',borderTop:'1px solid var(--border)',gap:8}}>
                  <span style={{fontSize:11,color:'var(--text-tertiary)',flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.paymentPlan}</span>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={(e)=>{e.stopPropagation(); shareListing(l);}}
                    title="Share with one or more leads"
                    style={{padding:'5px 10px',fontSize:11}}
                  >
                    <Share2 size={12}/> Share
                  </button>
                </div>
              </div>
            </div>
          );})}
        </div>
      ) : (
        <div className="data-panel"><div className="data-scroll"><table className="data-table"><thead><tr><th>ID</th><th>Project</th><th>Developer</th><th>Type</th><th>Code</th><th>Area</th><th>BD</th><th>Price</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(l=>(
            <tr key={l.id}>
              <td className="muted" style={{fontSize:11}}>{l.id}</td>
              <td className="bold clickable" onClick={()=>viewDetail(l)}>{l.project}</td>
              <td className="muted">{l.developer}</td>
              <td className="muted">{l.unitType}</td>
              <td className="muted" style={{fontSize:11}}>{l.unitCode}</td>
              <td className="muted">{l.area}m²</td>
              <td className="muted">{l.bedrooms}</td>
              <td className="bold">EGP {fmt(l.price)}</td>
              <td className="muted" style={{fontSize:11}}>{l.paymentPlan}</td>
              <td><span className={`badge ${statusColor(l.status)}`}>{l.status}</span></td>
              <td><div style={{display:'flex',gap:6,alignItems:'center'}}>
                <button className="btn-icon" onClick={()=>viewDetail(l)} title="View"><Eye size={14}/></button>
                <button className="btn-icon" onClick={()=>shareListing(l)} title="Share with leads"><Share2 size={14}/></button>
                {shareCountFor(l.id) > 0 && <span style={{fontSize:11,color:'var(--brand)',fontWeight:700}}>{shareCountFor(l.id)}</span>}
              </div></td>
            </tr>
          ))}</tbody></table></div></div>
      )}

    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FilterSelect — polished native-select wrapper that styles cleanly
// alongside the new search hero. Renders a small label above the
// dropdown when a value is selected, and uses a brand-tinted state.
// ═══════════════════════════════════════════════════════════════
const FilterSelect = ({ label, value, onChange, options }) => {
  const isActive = value && value !== 'All';
  return (
    <div style={{position:'relative', display:'inline-block'}}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance:'none',
          padding:'8px 32px 8px 12px',
          background: isActive ? 'var(--brand-tint)' : '#fff',
          border: `1.5px solid ${isActive ? 'var(--brand)' : 'var(--border)'}`,
          borderRadius:8,
          fontSize:12,
          fontWeight: isActive ? 700 : 500,
          color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
          cursor:'pointer',
          minWidth:130,
          outline:'none',
          transition:'all .15s',
        }}>
        <option value="All">All {label}s</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} style={{
        position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
        pointerEvents:'none', color: isActive ? 'var(--brand)' : 'var(--text-tertiary)',
      }}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Chip — used in the advanced-criteria strip above the listings.
// ═══════════════════════════════════════════════════════════════
const Chip = ({ label, onClear }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', gap:5,
    padding:'4px 10px', borderRadius:999,
    background:'var(--brand-tint)', color:'var(--brand)',
    fontSize:11, fontWeight:600,
    border:'1px solid #fecdd3',
  }}>
    {label}
    <button onClick={onClear} style={{background:'none', border:'none', color:'var(--brand)', cursor:'pointer', padding:0, display:'inline-flex'}}>
      <X size={11}/>
    </button>
  </span>
);

// ═══════════════════════════════════════════════════════════════
// AdvancedSearchModal — multi-criteria filter dialog.
// Price + area ranges, beds/baths minimums, city/compound, multi-status,
// payment plan match, and feature multi-select. Live preview shows the
// count of listings that match the current criteria.
// ═══════════════════════════════════════════════════════════════
const AdvancedSearchModal = ({ filters, setFilters, onClose, onClear, onSave, listings }) => {
  const cities = [...new Set(listings.map(l => l.city).filter(Boolean))];
  const allFeatures = [...new Set(listings.flatMap(l => l.features || []))];

  // Live preview count
  const previewCount = listings.filter(l => {
    const price = Number(l.price) || 0;
    const area  = Number(l.area)  || 0;
    if (filters.minPrice && price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && price > Number(filters.maxPrice)) return false;
    if (filters.minArea  && area  < Number(filters.minArea))  return false;
    if (filters.maxArea  && area  > Number(filters.maxArea))  return false;
    if (filters.minBeds  && Number(l.bedrooms || 0)  < Number(filters.minBeds))  return false;
    if (filters.minBaths && Number(l.bathrooms || 0) < Number(filters.minBaths)) return false;
    if (filters.city     && (l.city || '').toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.compound && !(l.project || '').toLowerCase().includes(filters.compound.toLowerCase())) return false;
    if (filters.floor    && String(l.floor || '') !== String(filters.floor)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(l.status)) return false;
    if (filters.paymentPlan && !(l.paymentPlan || '').toLowerCase().includes(filters.paymentPlan.toLowerCase())) return false;
    if (filters.features.length > 0) {
      const has = filters.features.every(f => (l.features || []).includes(f));
      if (!has) return false;
    }
    return true;
  }).length;

  const STATUS_OPTIONS = ['Available', 'Reserved', 'Sold', 'Under Construction'];

  const setF = (k, v) => setFilters({ ...filters, [k]: v });
  const toggleArr = (k, v) => {
    const arr = filters[k] || [];
    setF(k, arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  };

  return (
    <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(15,23,42,0.55)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, zIndex:9999}}>
      <div onClick={e => e.stopPropagation()} style={{background:'#fff', borderRadius:14, width:'100%', maxWidth:720, maxHeight:'90vh', overflow:'auto', boxShadow:'0 30px 80px rgba(15,23,42,0.35)'}}>
        {/* Header */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:'1px solid var(--border)'}}>
          <div>
            <div style={{fontSize:11, fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'.06em'}}>Advanced Search</div>
            <h3 style={{marginTop:3, fontSize:18, fontWeight:800, color:'var(--text-primary)'}}>Refine Inventory</h3>
            <p style={{marginTop:3, fontSize:11, color:'var(--text-tertiary)'}}>Combine with the quick search and toolbar filters for the sharpest cut.</p>
          </div>
          <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', color:'var(--text-tertiary)', padding:6}}>
            <X size={18}/>
          </button>
        </div>

        <div style={{padding:'18px 22px', display:'flex', flexDirection:'column', gap:18}}>
          {/* Price range */}
          <SectionTitle title="Price (EGP)"/>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <NumberInput label="Min price" value={filters.minPrice} onChange={v => setF('minPrice', v)} placeholder="e.g. 3000000"/>
            <NumberInput label="Max price" value={filters.maxPrice} onChange={v => setF('maxPrice', v)} placeholder="e.g. 15000000"/>
          </div>

          {/* Area range */}
          <SectionTitle title="Built-up area (m²)"/>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <NumberInput label="Min area" value={filters.minArea} onChange={v => setF('minArea', v)} placeholder="e.g. 120"/>
            <NumberInput label="Max area" value={filters.maxArea} onChange={v => setF('maxArea', v)} placeholder="e.g. 350"/>
          </div>

          {/* Rooms */}
          <SectionTitle title="Rooms (minimum)"/>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <PillRow label="Bedrooms" options={['1','2','3','4','5+']} value={filters.minBeds} onChange={v => setF('minBeds', v === filters.minBeds ? '' : v)}/>
            <PillRow label="Bathrooms" options={['1','2','3','4+']} value={filters.minBaths} onChange={v => setF('minBaths', v === filters.minBaths ? '' : v)}/>
          </div>

          {/* Location */}
          <SectionTitle title="Location"/>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <div>
              <Label>City</Label>
              <select value={filters.city} onChange={e => setF('city', e.target.value)} style={inputStyle}>
                <option value="">Any</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Compound / Project name</Label>
              <input value={filters.compound} onChange={e => setF('compound', e.target.value)} placeholder="e.g. Hyde Park" style={inputStyle}/>
            </div>
          </div>

          {/* Status multi-select */}
          <SectionTitle title="Status"/>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => toggleArr('statuses', s)}
                style={{
                  padding:'6px 14px', borderRadius:999, fontSize:11, fontWeight:600, cursor:'pointer',
                  border: `1px solid ${filters.statuses.includes(s) ? 'var(--brand)' : 'var(--border)'}`,
                  background: filters.statuses.includes(s) ? 'var(--brand)' : '#fff',
                  color: filters.statuses.includes(s) ? '#fff' : 'var(--text-secondary)',
                }}>
                {s}
              </button>
            ))}
          </div>

          {/* Payment plan + floor */}
          <SectionTitle title="Payment & floor"/>
          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:10}}>
            <div>
              <Label>Payment plan (text match)</Label>
              <input value={filters.paymentPlan} onChange={e => setF('paymentPlan', e.target.value)} placeholder="e.g. 10% down, 8 years" style={inputStyle}/>
            </div>
            <NumberInput label="Floor" value={filters.floor} onChange={v => setF('floor', v)} placeholder="e.g. 5"/>
          </div>

          {/* Features */}
          {allFeatures.length > 0 && (
            <>
              <SectionTitle title="Required features (all must match)"/>
              <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                {allFeatures.map(f => (
                  <button
                    key={f}
                    onClick={() => toggleArr('features', f)}
                    style={{
                      padding:'5px 12px', borderRadius:999, fontSize:11, fontWeight:600, cursor:'pointer',
                      border: `1px solid ${filters.features.includes(f) ? 'var(--brand)' : 'var(--border)'}`,
                      background: filters.features.includes(f) ? 'var(--brand-tint)' : '#fff',
                      color: filters.features.includes(f) ? 'var(--brand)' : 'var(--text-secondary)',
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{position:'sticky', bottom:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 22px', borderTop:'1px solid var(--border)', background:'#fafbfc'}}>
          <div style={{fontSize:13, fontWeight:700, color:'var(--text-primary)'}}>
            <span style={{fontSize:24, color:'var(--brand)'}}>{previewCount}</span> <span style={{fontSize:12, color:'var(--text-secondary)'}}>listing{previewCount === 1 ? '' : 's'} match</span>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button onClick={onClear} style={{background:'#fff', color:'var(--text-secondary)', border:'1px solid var(--border)', padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer'}}>Clear all</button>
            <button onClick={() => { onSave(); onClose(); }} style={{background:'#fff', color:'var(--brand)', border:'1px solid var(--brand)', padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer'}}>Save & close</button>
            <button onClick={onClose} style={{background:'var(--brand)', color:'#fff', border:'none', padding:'8px 20px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer'}}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal helpers ─────────────────────────────────────────────────
const SectionTitle = ({ title }) => (
  <div style={{fontSize:11, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:-8}}>{title}</div>
);
const Label = ({ children }) => (
  <div style={{fontSize:11, fontWeight:600, color:'var(--text-secondary)', marginBottom:4}}>{children}</div>
);
const inputStyle = {
  width:'100%', padding:'8px 12px', border:'1px solid var(--border)', borderRadius:8,
  fontSize:13, outline:'none', background:'#fff', boxSizing:'border-box',
};
const NumberInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <Label>{label}</Label>
    <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle}/>
  </div>
);
const PillRow = ({ label, options, value, onChange }) => (
  <div>
    <Label>{label}</Label>
    <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(o.replace('+',''))}
          style={{
            padding:'5px 12px', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer',
            border: `1px solid ${value === o.replace('+','') ? 'var(--brand)' : 'var(--border)'}`,
            background: value === o.replace('+','') ? 'var(--brand)' : '#fff',
            color: value === o.replace('+','') ? '#fff' : 'var(--text-secondary)',
          }}>
          {o}
        </button>
      ))}
    </div>
  </div>
);
