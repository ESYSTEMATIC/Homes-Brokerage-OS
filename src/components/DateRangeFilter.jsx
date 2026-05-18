// ═══════════════════════════════════════════════════════════════════════
// DateRangeFilter — small picker with presets + custom range
// ───────────────────────────────────────────────────────────────────────
// Audit-finding fix (May 2026): cross-cutting horizontal applied to
// Reports / Finance / Executive / Marketplace dashboards. Returns an
// inclusive {from, to} ISO date pair to the parent.
//
// Usage:
//   const [range, setRange] = useState(presetRange('30d'));
//   <DateRangeFilter value={range} onChange={setRange} />
// ═══════════════════════════════════════════════════════════════════════
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

const today = () => new Date();
const isoDate = (d) => d.toISOString().slice(0, 10);
const minus = (days) => { const d = today(); d.setDate(d.getDate() - days); return d; };
const startOfMonth = () => { const d = today(); d.setDate(1); return d; };
const startOfQuarter = () => { const d = today(); d.setMonth(Math.floor(d.getMonth() / 3) * 3, 1); return d; };
const startOfYear = () => { const d = today(); d.setMonth(0, 1); return d; };

export const PRESETS = {
  '7d':  { label: 'Last 7 days',   range: () => ({ from: isoDate(minus(7)),     to: isoDate(today()) }) },
  '30d': { label: 'Last 30 days',  range: () => ({ from: isoDate(minus(30)),    to: isoDate(today()) }) },
  '90d': { label: 'Last 90 days',  range: () => ({ from: isoDate(minus(90)),    to: isoDate(today()) }) },
  'mtd': { label: 'Month-to-date', range: () => ({ from: isoDate(startOfMonth()),   to: isoDate(today()) }) },
  'qtd': { label: 'Quarter-to-date', range: () => ({ from: isoDate(startOfQuarter()), to: isoDate(today()) }) },
  'ytd': { label: 'Year-to-date',  range: () => ({ from: isoDate(startOfYear()),   to: isoDate(today()) }) },
  'all': { label: 'All time',      range: () => ({ from: '', to: '' }) },
};

export const presetRange = (key) => ({ key, ...(PRESETS[key]?.range() || PRESETS['30d'].range()) });

// Pure filter helper — pass any record with an ISO-style date field and a
// {from, to} range. Empty range returns all.
export const inRange = (dateStr, range) => {
  if (!range || !range.from || !range.to) return true;
  if (!dateStr) return false;
  const d = String(dateStr).slice(0, 10);
  return d >= range.from && d <= range.to;
};

export const DateRangeFilter = ({ value, onChange, label = 'Date range' }) => {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(value?.from || '');
  const [to, setTo] = useState(value?.to || '');
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => { setFrom(value?.from || ''); setTo(value?.to || ''); }, [value]);

  const applyPreset = (key) => {
    const r = presetRange(key);
    onChange(r);
    setOpen(false);
  };

  const applyCustom = () => {
    onChange({ key: 'custom', from, to });
    setOpen(false);
  };

  const display = value?.key && PRESETS[value.key]
    ? PRESETS[value.key].label
    : value?.from && value?.to
      ? `${value.from} → ${value.to}`
      : 'All time';

  return (
    <div ref={ref} style={{position:'relative', display:'inline-block'}}>
      <button
        className="btn btn-sm btn-outline"
        onClick={() => setOpen(o => !o)}
        title={label}
      >
        <Calendar size={13}/> {display} <ChevronDown size={11}/>
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', right:0, zIndex:50,
          background:'#fff', border:'1px solid var(--border)', borderRadius:10,
          boxShadow:'0 10px 30px rgba(15,23,42,0.14)', minWidth:300, padding:14,
        }}>
          <div style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:8}}>Presets</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:14}}>
            {Object.entries(PRESETS).map(([k, p]) => (
              <button
                key={k}
                onClick={() => applyPreset(k)}
                style={{
                  padding:'8px 10px', fontSize:12, fontWeight:600, cursor:'pointer',
                  border:`1px solid ${value?.key === k ? 'var(--brand)' : 'var(--border)'}`,
                  background: value?.key === k ? 'var(--brand-tint)' : '#fff',
                  color: value?.key === k ? 'var(--brand)' : 'var(--text-primary)',
                  borderRadius:6,
                }}>{p.label}</button>
            ))}
          </div>
          <div style={{fontSize:11, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:8}}>Custom range</div>
          <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:10}}>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={{flex:1, padding:'7px 10px', border:'1px solid var(--border)', borderRadius:6, fontSize:12}}/>
            <span style={{fontSize:11, color:'var(--text-tertiary)'}}>→</span>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} style={{flex:1, padding:'7px 10px', border:'1px solid var(--border)', borderRadius:6, fontSize:12}}/>
          </div>
          <div style={{display:'flex', gap:6, justifyContent:'flex-end'}}>
            <button className="btn btn-sm btn-outline" onClick={() => { setFrom(''); setTo(''); onChange({ key:'all', from:'', to:'' }); setOpen(false); }}><X size={11}/> Clear</button>
            <button className="btn btn-sm btn-brand" onClick={applyCustom} disabled={!from || !to}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};
