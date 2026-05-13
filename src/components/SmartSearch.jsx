// ═══════════════════════════════════════════════════════════════
// SmartSearch — global Cmd-K / Ctrl-K command palette
// ───────────────────────────────────────────────────────────────
// Stakeholder ask 11-May: agents need a fast lookup during live calls.
// Press Cmd-K (Mac) or Ctrl-K (Windows) anywhere inside the CRM to open
// a search popover. Searches leads, deals and listings by name / phone /
// email / project / unit code / ID. Results are role-scoped via
// canSeeLead — agents see only what they own.
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { canSeeLead } from '../data/crmAccess';
import { Search, Phone, Mail, MapPin, Home, KanbanSquare, User, X } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('en-EG').format(n || 0);

export const SmartSearch = () => {
  const { state, personaKey } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  // Toggle on Cmd-K / Ctrl-K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Autofocus when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQ('');
      setCursor(0);
    }
  }, [open]);

  // Build results
  const results = useMemo(() => {
    if (!q.trim() || q.trim().length < 2) return [];
    const needle = q.trim().toLowerCase();

    const leadMatches = (state.leads || [])
      .filter(l => canSeeLead(personaKey, l))
      .filter(l =>
        l.name?.toLowerCase().includes(needle) ||
        l.phone?.includes(needle) ||
        l.email?.toLowerCase().includes(needle) ||
        l.id?.toLowerCase().includes(needle) ||
        l.project?.toLowerCase().includes(needle)
      )
      .slice(0, 6)
      .map(l => ({
        kind: 'lead',
        id: l.id,
        title: l.name,
        sub: `${l.phone || '—'} · ${l.project || '—'} · ${l.stage}`,
        meta: `EGP ${fmt(l.budget)} · ${l.priority}`,
        icon: User,
        onClick: () => navigate(`/system/crm/leads/${l.id}`),
      }));

    const dealMatches = (state.deals || [])
      .filter(d => canSeeLead(personaKey, d))
      .filter(d =>
        (d.leadName || d.lead)?.toLowerCase().includes(needle) ||
        d.project?.toLowerCase().includes(needle) ||
        d.id?.toLowerCase().includes(needle) ||
        d.developer?.toLowerCase().includes(needle)
      )
      .slice(0, 6)
      .map(d => ({
        kind: 'deal',
        id: d.id,
        title: `${d.leadName || d.lead} · ${d.project}`,
        sub: `${d.type === 'OffPlan' ? 'Off Plan' : 'Resale'} · ${d.stage}${d.commissionLocked ? ' · 🔒 locked' : ''}`,
        meta: `EGP ${fmt(d.value)}`,
        icon: KanbanSquare,
        onClick: () => navigate('/system/crm/deals'),
      }));

    const listingMatches = (state.listings || [])
      .filter(l =>
        l.project?.toLowerCase().includes(needle) ||
        l.unitCode?.toLowerCase().includes(needle) ||
        l.id?.toLowerCase().includes(needle) ||
        l.developer?.toLowerCase().includes(needle)
      )
      .slice(0, 5)
      .map(l => ({
        kind: 'listing',
        id: l.id,
        title: `${l.project} · ${l.unitCode}`,
        sub: `${l.developer} · ${l.unitType} · ${l.bedrooms}BD · ${l.area}m²`,
        meta: `EGP ${fmt(l.price)}`,
        icon: Home,
        onClick: () => navigate('/system/crm/listings'),
      }));

    return [...leadMatches, ...dealMatches, ...listingMatches];
  }, [q, state.leads, state.deals, state.listings, personaKey, navigate]);

  // Keyboard navigation
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter' && results[cursor]) {
      results[cursor].onClick();
      setOpen(false);
    }
  };

  if (!open) return null;

  const kindMeta = {
    lead:    { color:'#3b82f6', label:'LEAD' },
    deal:    { color:'#E8672A', label:'DEAL' },
    listing: { color:'#10b981', label:'LISTING' },
  };

  return (
    <div
      onClick={()=>setOpen(false)}
      style={{position:'fixed',inset:0,background:'rgba(15,23,42,.5)',backdropFilter:'blur(4px)',zIndex:9999,display:'flex',justifyContent:'center',paddingTop:'10vh'}}
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        style={{background:'#fff',width:'90%',maxWidth:640,maxHeight:'70vh',borderRadius:14,boxShadow:'0 24px 60px rgba(0,0,0,.25)',overflow:'hidden',display:'flex',flexDirection:'column'}}
      >
        {/* Search input */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',borderBottom:'1px solid var(--border)'}}>
          <Search size={18} color="var(--text-tertiary)"/>
          <input
            ref={inputRef}
            value={q}
            onChange={(e)=>{setQ(e.target.value); setCursor(0);}}
            onKeyDown={onKeyDown}
            placeholder="Search leads, deals, listings by name, phone, project, ID…"
            style={{flex:1,border:'none',outline:'none',fontSize:15,fontFamily:'inherit',background:'transparent'}}
          />
          <button onClick={()=>setOpen(false)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-tertiary)'}}><X size={16}/></button>
        </div>

        {/* Results */}
        <div style={{flex:1,overflowY:'auto'}}>
          {q.trim().length < 2 ? (
            <div style={{padding:'40px 24px',textAlign:'center',color:'var(--text-tertiary)'}}>
              <Phone size={28} style={{marginBottom:10,opacity:.4}}/>
              <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Smart Search</div>
              <div style={{fontSize:12,lineHeight:1.6}}>Type a name, phone, project, or ID to find a lead, deal, or listing.<br/>Use <kbd style={{padding:'2px 6px',background:'#f1f5f9',borderRadius:4,fontFamily:'monospace',fontSize:11}}>↑↓</kbd> to navigate, <kbd style={{padding:'2px 6px',background:'#f1f5f9',borderRadius:4,fontFamily:'monospace',fontSize:11}}>Enter</kbd> to open, <kbd style={{padding:'2px 6px',background:'#f1f5f9',borderRadius:4,fontFamily:'monospace',fontSize:11}}>Esc</kbd> to close.</div>
            </div>
          ) : results.length === 0 ? (
            <div style={{padding:'40px 24px',textAlign:'center',color:'var(--text-tertiary)',fontSize:13}}>
              No results found for <b>"{q}"</b> in your scope.
            </div>
          ) : (
            results.map((r, i) => {
              const meta = kindMeta[r.kind];
              const isActive = i === cursor;
              return (
                <div
                  key={`${r.kind}-${r.id}`}
                  onMouseEnter={()=>setCursor(i)}
                  onClick={()=>{r.onClick(); setOpen(false);}}
                  style={{
                    display:'flex',alignItems:'center',gap:14,padding:'12px 18px',cursor:'pointer',
                    background: isActive ? 'var(--brand-tint)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--brand)' : '3px solid transparent',
                  }}
                >
                  <div style={{width:36,height:36,borderRadius:8,background:`${meta.color}1a`,color:meta.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <r.icon size={16}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                      <span style={{fontSize:9,fontWeight:700,color:meta.color,letterSpacing:'.06em',padding:'2px 6px',background:`${meta.color}1a`,borderRadius:4}}>{meta.label}</span>
                      <span style={{fontSize:11,color:'var(--text-tertiary)',fontFamily:'monospace'}}>{r.id}</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.title}</div>
                    <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.sub}</div>
                  </div>
                  {r.meta && <div style={{fontSize:11,fontWeight:700,color:'var(--brand)',whiteSpace:'nowrap'}}>{r.meta}</div>}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div style={{padding:'8px 18px',borderTop:'1px solid var(--border)',background:'#fafbfc',fontSize:11,color:'var(--text-tertiary)',display:'flex',justifyContent:'space-between'}}>
          <span>{results.length > 0 && `${results.length} result${results.length===1?'':'s'} · role-scoped to your visibility`}</span>
          <span><kbd style={{padding:'2px 6px',background:'#fff',border:'1px solid var(--border)',borderRadius:4,fontFamily:'monospace',fontSize:10}}>⌘K</kbd> to toggle</span>
        </div>
      </div>
    </div>
  );
};
