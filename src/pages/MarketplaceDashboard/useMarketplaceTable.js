import { useState, useMemo } from 'react';

// Filter + paginate hook for marketplace tables.
export const useMarketplaceTable = (rows, opts = {}) => {
  const { searchKeys = [], filterKeys = [], pageSize = 10 } = opts;
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const setFilter = (k, v) => { setFilters(s => ({ ...s, [k]: v })); setPage(1); };
  const clear = () => { setFilters({}); setQ(''); setPage(1); };

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (q) {
        const blob = searchKeys.map(k => String(r[k] ?? '').toLowerCase()).join(' ');
        if (!blob.includes(q.toLowerCase())) return false;
      }
      for (const [k, v] of Object.entries(filters)) {
        if (!v) continue;
        if (String(r[k]) !== String(v)) return false;
      }
      return true;
    });
  }, [rows, q, filters, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return { q, setQ, filters, setFilter, clear, filtered, slice, page: safePage, setPage, totalPages, filterKeys };
};

export { Pager } from './Pager.jsx';
