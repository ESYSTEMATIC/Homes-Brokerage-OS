// ═══════════════════════════════════════════════════════════════════════
// ExportMenu — reusable button + dropdown for CSV / PDF export.
// ───────────────────────────────────────────────────────────────────────
// Drop onto any data table toolbar:
//   <ExportMenu rows={filtered} columns={EXPORT_COLUMNS} filename="leads"
//               title="CRM Leads Export" subtitle="Filtered view" />
// ═══════════════════════════════════════════════════════════════════════
import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { exportCsv, exportPdf } from '../lib/export';

export const ExportMenu = ({ rows = [], columns = [], filename = 'export', title, subtitle, disabled = false, size = 'sm' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const safeFilename = `${filename}_${new Date().toISOString().slice(0,10)}`;
  const empty = rows.length === 0;

  return (
    <div ref={ref} style={{position:'relative', display:'inline-block'}}>
      <button
        className={`btn ${size === 'sm' ? 'btn-sm' : ''} btn-outline`}
        onClick={() => setOpen(o => !o)}
        disabled={disabled || empty}
        title={empty ? 'Nothing to export' : `Export ${rows.length} record${rows.length === 1 ? '' : 's'}`}
      >
        <Download size={size === 'sm' ? 13 : 15}/> Export
        {!empty && <span style={{fontSize:10, fontWeight:600, marginLeft:4, opacity:.7}}>({rows.length})</span>}
        <ChevronDown size={11} style={{marginLeft:2}}/>
      </button>
      {open && !empty && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', right:0, zIndex:50,
          background:'#fff', border:'1px solid var(--border)', borderRadius:8,
          boxShadow:'0 10px 30px rgba(15,23,42,0.14)', minWidth:200, overflow:'hidden',
        }}>
          <button
            onClick={() => { exportCsv(safeFilename, rows, columns); setOpen(false); }}
            style={{display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'#fff', border:'none', cursor:'pointer', fontSize:13, color:'var(--text-primary)', textAlign:'left'}}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <FileSpreadsheet size={14} color="#16a34a"/>
            <div>
              <div style={{fontWeight:700}}>CSV (Excel)</div>
              <div style={{fontSize:10, color:'var(--text-tertiary)'}}>Spreadsheet-friendly export</div>
            </div>
          </button>
          <div style={{borderTop:'1px solid var(--border)'}}/>
          <button
            onClick={() => { exportPdf(safeFilename, rows, columns, { title: title || filename, subtitle }); setOpen(false); }}
            style={{display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'#fff', border:'none', cursor:'pointer', fontSize:13, color:'var(--text-primary)', textAlign:'left'}}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <FileText size={14} color="#dc2626"/>
            <div>
              <div style={{fontWeight:700}}>PDF</div>
              <div style={{fontSize:10, color:'var(--text-tertiary)'}}>Printable, branded report</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
