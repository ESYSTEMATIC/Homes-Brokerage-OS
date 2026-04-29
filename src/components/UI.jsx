import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

// ───────────── Modal ─────────────
export const Modal = () => {
  const { modal, closeModal } = useApp();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (modal) {
      const handler = (e) => { if (e.key === 'Escape') closeModal(); };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [modal, closeModal]);

  if (!modal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modal.onSubmit) {
      setSubmitting(true);
      try {
        const fd = new FormData(e.target);
        const data = {};
        fd.forEach((v, k) => { data[k] = v; });
        await modal.onSubmit(data);
        closeModal();
      } finally {
        setSubmitting(false);
      }
    } else {
      closeModal();
    }
  };

  return (
    <div className="ui-overlay" onClick={closeModal}>
      <div className={`ui-modal ${modal.size === 'lg' ? 'ui-modal-lg' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="ui-modal-header">
          <div>
            <h3>{modal.title}</h3>
            {modal.subtitle && <p>{modal.subtitle}</p>}
          </div>
          <button className="ui-icon-btn" onClick={closeModal} type="button"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="ui-modal-body">{modal.body}</div>
          <div className="ui-modal-footer">
            <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
            {modal.onSubmit && (
              <button type="submit" className={`btn ${modal.danger ? 'btn-danger' : 'btn-primary'}`} disabled={submitting}>
                {submitting ? 'Saving…' : (modal.submitLabel || 'Save')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// ───────────── Drawer ─────────────
export const Drawer = () => {
  const { drawer, closeDrawer } = useApp();
  if (!drawer) return null;
  return (
    <div className="ui-overlay" onClick={closeDrawer}>
      <div className="ui-drawer" onClick={e => e.stopPropagation()}>
        <div className="ui-drawer-header">
          <div>
            <h3>{drawer.title}</h3>
            {drawer.subtitle && <p>{drawer.subtitle}</p>}
          </div>
          <button className="ui-icon-btn" onClick={closeDrawer}><X size={18} /></button>
        </div>
        <div className="ui-drawer-body">{drawer.content}</div>
      </div>
    </div>
  );
};

// ───────────── Confirm ─────────────
export const ConfirmDialog = () => {
  const { confirm, closeConfirm } = useApp();
  if (!confirm) return null;
  const handleOk = async () => {
    if (confirm.onConfirm) await confirm.onConfirm();
    closeConfirm();
  };
  return (
    <div className="ui-overlay" onClick={closeConfirm}>
      <div className="ui-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="ui-modal-header">
          <div>
            <h3>{confirm.title || 'Are you sure?'}</h3>
          </div>
          <button className="ui-icon-btn" onClick={closeConfirm}><X size={18} /></button>
        </div>
        <div className="ui-modal-body" style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {confirm.message}
        </div>
        <div className="ui-modal-footer">
          <button className="btn btn-outline" onClick={closeConfirm}>Cancel</button>
          <button className={`btn ${confirm.danger ? 'btn-danger' : 'btn-primary'}`} onClick={handleOk}>
            {confirm.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ───────────── Toasts ─────────────
const toastIcon = { success: <CheckCircle2 size={16} />, info: <Info size={16} />, warning: <AlertTriangle size={16} />, danger: <AlertTriangle size={16} /> };
export const Toaster = () => {
  const { toasts } = useApp();
  return (
    <div className="ui-toaster">
      {toasts.map(t => (
        <div key={t.id} className={`ui-toast ui-toast-${t.kind}`}>
          {toastIcon[t.kind] || <Check size={16} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

// ───────────── Form Fields ─────────────
export const Field = ({ label, name, type = 'text', defaultValue = '', required, options, placeholder, rows, children }) => {
  if (children) {
    return (
      <div className="ui-field">
        <label>{label}{required && <span className="ui-required">*</span>}</label>
        {children}
      </div>
    );
  }
  return (
    <div className="ui-field">
      <label>{label}{required && <span className="ui-required">*</span>}</label>
      {type === 'select' ? (
        <select name={name} defaultValue={defaultValue} required={required}>
          <option value="">— Select —</option>
          {(options || []).map(o => {
            const v = typeof o === 'string' ? o : o.value;
            const l = typeof o === 'string' ? o : o.label;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} defaultValue={defaultValue} required={required} rows={rows || 3} placeholder={placeholder} />
      ) : (
        <input type={type} name={name} defaultValue={defaultValue} required={required} placeholder={placeholder} />
      )}
    </div>
  );
};

export const FieldRow = ({ children }) => <div className="ui-field-row">{children}</div>;

// ───────────── Empty State ─────────────
export const Empty = ({ message = 'No records match your filters.' }) => (
  <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
    <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>—</div>
    {message}
  </div>
);

// ───────────── Toolbar / Filter helpers ─────────────
export const Toolbar = ({ children }) => <div className="data-toolbar"><div className="data-toolbar-left">{children}</div></div>;

// ───────────── CSV Export ─────────────
export const exportCSV = (filename, rows) => {
  if (!rows || !rows.length) return;
  const cols = Object.keys(rows[0]);
  const escape = v => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = [cols.join(','), ...rows.map(r => cols.map(c => escape(r[c])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename.endsWith('.csv') ? filename : filename + '.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
};

// ───────────── useTableState (search + filters + sort) ─────────────
export const useTableState = (data, opts = {}) => {
  const { searchKeys = [], filters = {} } = opts;
  const [q, setQ] = useState('');
  const [filterVals, setFilterVals] = useState(() => Object.keys(filters).reduce((a, k) => ({ ...a, [k]: '' }), {}));

  const setFilter = (k, v) => setFilterVals(s => ({ ...s, [k]: v }));

  const filtered = (data || []).filter(row => {
    if (q) {
      const blob = searchKeys.map(k => String(row[k] ?? '').toLowerCase()).join(' ');
      if (!blob.includes(q.toLowerCase())) return false;
    }
    for (const [k, v] of Object.entries(filterVals)) {
      if (!v || v === 'all') continue;
      const accessor = filters[k];
      const val = typeof accessor === 'function' ? accessor(row) : row[k];
      if (String(val) !== String(v)) return false;
    }
    return true;
  });

  return { q, setQ, filterVals, setFilter, filtered };
};
