export const Pager = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return (
    <div className="mp-pagination">
      <span>Previous</span>
      <span><span className="page active">1</span></span>
      <span>Next</span>
    </div>
  );
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, '…', totalPages - 1, totalPages);
  }
  return (
    <div className="mp-pagination">
      <span style={{ cursor: 'pointer' }} onClick={() => setPage(Math.max(1, page - 1))}>← Previous</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {pages.map((p, i) => p === '…'
          ? <span key={i}>…</span>
          : <span key={i} className={`page ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</span>
        )}
      </div>
      <span style={{ cursor: 'pointer' }} onClick={() => setPage(Math.min(totalPages, page + 1))}>Next →</span>
    </div>
  );
};
