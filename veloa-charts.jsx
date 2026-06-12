// veloa-charts.jsx — theme-aware SVG charts for the admin dashboard

// Area + line chart with gradient fill, gridlines, dots, x-axis labels
function AreaLine({ data, labels, color = 'var(--violet)', peakColor, id = 'a', height = 150 }) {
  const pk = peakColor || color;
  const W = 340, H = height, pl = 10, pr = 10, pt = 16, pb = 26;
  const max = Math.max(...data) * 1.18, min = 0;
  const iw = W - pl - pr, ih = H - pt - pb;
  const xs = i => pl + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const ys = v => pt + ih - ((v - min) / (max - min)) * ih;
  const pts = data.map((v, i) => `${xs(i).toFixed(1)},${ys(v).toFixed(1)}`);
  const line = 'M' + pts.join(' L');
  const area = `M${xs(0)},${pt + ih} L` + pts.join(' L') + ` L${xs(data.length - 1)},${pt + ih} Z`;
  const gid = 'grad-' + id;
  const peak = data.indexOf(Math.max(...data));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.33, 0.66, 1].map((g, i) => (
        <line key={i} x1={pl} x2={W - pr} y1={pt + ih * g} y2={pt + ih * g} stroke="var(--line)" strokeWidth="1" />
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={xs(i)} cy={ys(v)} r={i === peak ? 4.2 : 3} fill={i === peak ? pk : 'var(--card)'} stroke={i === peak ? pk : color} strokeWidth="2" />
      ))}
      {/* peak value label */}
      <text x={xs(peak)} y={ys(data[peak]) - 10} fontSize="11" fontWeight="700" textAnchor="middle" fill={pk} fontFamily="var(--sans)">{data[peak]}</text>
      {labels.map((l, i) => (
        <text key={i} x={xs(i)} y={H - 8} fontSize="9.5" textAnchor="middle" fill="var(--ink-soft)" fontFamily="var(--sans)">{l}</text>
      ))}
    </svg>
  );
}

// Donut with center total + side legend
function Donut({ segments, size = 156, thickness = 24, center }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = (size - thickness) / 2, C = 2 * Math.PI * r, cx = size / 2, cy = size / 2;
  let acc = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const len = (s.value / total) * C;
            const seg = (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
                strokeDasharray={`${len - 1.5} ${C - len + 1.5}`} strokeDashoffset={-acc}
                transform={`rotate(-90 ${cx} ${cy})`} />
            );
            acc += len; return seg;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            <div className="serif" style={{ fontSize: '1.8rem', color: 'var(--dusk)', lineHeight: 1 }}>{center ? center.value : total}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.08em', marginTop: 2 }}>{center ? center.label : 'REPORTS'}</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.85rem' }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ flex: 1, color: 'var(--ink)', lineHeight: 1.3 }}>{s.label}</span>
            <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>{Math.round(s.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { AreaLine, Donut });
