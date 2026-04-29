// Inline-SVG chart primitives used across the Marketplace Dashboard.
// Pure SVG, no chart library — keeps the bundle slim.

// Donut chart with side legend.
export const Donut = ({ data, size = 180, label }) => {
  const total = data.reduce((s, d) => s + d.pct, 0) || 1;
  const r = size / 2 - 14;
  const cx = size / 2, cy = size / 2;
  let acc = 0;
  return (
    <div className="mp-donut-wrap">
      <svg width={size} height={size}>
        {data.map((d, i) => {
          const start = (acc / total) * 2 * Math.PI - Math.PI / 2;
          acc += d.pct;
          const end = (acc / total) * 2 * Math.PI - Math.PI / 2;
          const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
          const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
          const large = d.pct / total > 0.5 ? 1 : 0;
          return (
            <path key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={d.color} stroke="#fff" strokeWidth="2"/>
          );
        })}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="#fff" />
        {label && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#6b7280">{label}</text>}
      </svg>
      <div className="mp-donut-legend">
        {data.map(d => (
          <div key={d.label || d.name} className="mp-legend-row">
            <span className="mp-legend-dot" style={{ background: d.color }} />
            <span style={{ color:'#6b7280' }}>{d.label || d.name}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#111827' }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Vertical bar chart with month/category labels.
export const VBar = ({ data, height = 240, color = '#f4978e', max }) => {
  const m = max || Math.max(...data.map(d => d.value || d.count || 0));
  return (
    <svg viewBox={`0 0 ${data.length * 50} ${height + 30}`} style={{ width: '100%', height }}>
      {/* y-axis grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(p => (
        <line key={p} x1="20" x2={data.length * 50} y1={height * (1 - p)} y2={height * (1 - p)} stroke="#f3f4f6" strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const v = d.value || d.count || 0;
        const h = (v / m) * (height - 30);
        const x = 20 + i * 50;
        const y = height - h - 10;
        return (
          <g key={i}>
            <rect x={x} y={y} width="34" height={h} fill={color} rx="3" />
            <text x={x + 17} y={height + 16} textAnchor="middle" fontSize="9" fill="#6b7280" transform={`rotate(${(d.name && d.name.length > 6) ? -30 : 0} ${x + 17} ${height + 16})`}>
              {(d.name || d.m || '').toString().slice(0, 12)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Stacked bar chart (Lead Type Trend).
export const StackedBar = ({ data, keys, colors, height = 220 }) => {
  const max = Math.max(...data.map(d => keys.reduce((s, k) => s + (d[k] || 0), 0))) || 1;
  return (
    <div>
      <svg viewBox={`0 0 ${data.length * 56} ${height + 30}`} style={{ width: '100%', height }}>
        {[0, 0.25, 0.5, 0.75, 1].map(p => (
          <line key={p} x1="20" x2={data.length * 56} y1={height * (1 - p)} y2={height * (1 - p)} stroke="#f3f4f6" strokeWidth="1" />
        ))}
        {data.map((d, i) => {
          let yAcc = height - 10;
          const x = 20 + i * 56;
          return (
            <g key={i}>
              {keys.map(k => {
                const v = d[k] || 0;
                const h = (v / max) * (height - 30);
                yAcc -= h;
                return <rect key={k} x={x} y={yAcc} width="40" height={h} fill={colors[k]} />;
              })}
              <text x={x + 20} y={height + 16} textAnchor="middle" fontSize="10" fill="#6b7280">{d.m}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 6, fontSize: 11, color: '#6b7280' }}>
        {keys.map(k => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: colors[k] }} /> {k}
          </div>
        ))}
      </div>
    </div>
  );
};

// Line chart (Visitor Trend)
export const LineChart = ({ data, height = 220, color = '#f4978e' }) => {
  const max = Math.max(...data) || 1;
  const w = 600, h = height;
  const pts = data.map((v, i) => [20 + (i * (w - 40)) / (data.length - 1), h - 30 - (v / max) * (h - 50)]);
  const path = pts.reduce((p, [x, y], i) => p + `${i === 0 ? 'M' : 'L'} ${x} ${y} `, '');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }}>
      {[0, 0.25, 0.5, 0.75, 1].map(p => (
        <line key={p} x1="20" x2={w - 20} y1={h * (1 - p) - 30} y2={h * (1 - p) - 30} stroke="#f3f4f6" strokeWidth="1" />
      ))}
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />)}
      {pts.map(([x], i) => <text key={`l${i}`} x={x} y={h - 10} textAnchor="middle" fontSize="10" fill="#6b7280">{months[i] || i}</text>)}
    </svg>
  );
};

// Horizontal funnel (conversion)
export const HorizontalFunnel = ({ data }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    {data.map(d => (
      <div key={d.stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 110, fontSize: 12, color: '#6b7280' }}>{d.stage}</div>
        <div style={{ flex: 1, position: 'relative', height: 22, background: '#f9fafb', borderRadius: 6 }}>
          <div style={{ width: `${d.pct}%`, height: '100%', background: '#f4978e', borderRadius: 6 }} />
        </div>
        <div style={{ width: 50, textAlign: 'right', fontSize: 12, fontWeight: 700, color: '#111827' }}>{d.pct}%</div>
      </div>
    ))}
  </div>
);

// Mini KPI sparkline (used in Top Pages bounce indicator etc.)
export const SparkBar = ({ pct, color = '#f4978e' }) => (
  <div style={{ display: 'inline-block', width: 80, height: 6, background: '#f3f4f6', borderRadius: 3, verticalAlign: 'middle', marginRight: 6 }}>
    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
  </div>
);
