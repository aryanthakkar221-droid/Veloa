// veloa-shared.jsx — design-system primitives shared across screens
const { useState, useEffect, useRef, createContext, useContext } = React;

// ---- Navigation context ----
const NavContext = createContext(() => {});
const useNav = () => useContext(NavContext);

// ---- The breathing companion orb (living particle cloud) ----
// variant: 'glow' (violet), 'sunrise' (violet→coral), 'rings' (pale ringed)
function Orb({ size = 132, variant = 'glow', speaking = false }) {
  const canvasRef = useRef(null);
  const propsRef = useRef({ size, variant, speaking });
  propsRef.current = { size, variant, speaking };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf, t0 = performance.now(), running = true;

    // Build a Fibonacci sphere of points (stable across renders)
    const N = 460;
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;          // -1..1
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push({
        x: Math.cos(th) * r, y, z: Math.sin(th) * r,
        seed: Math.random() * Math.PI * 2,
      });
    }

    function frame(now) {
      if (!running) return;
      const { size, variant, speaking } = propsRef.current;
      const px = Math.round(size * dpr);
      if (canvas.width !== px) { canvas.width = px; canvas.height = px; }
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';

      const t = (now - t0) / 1000;
      const breathe = 1 + (speaking ? 0.06 : 0.045) * Math.sin(t * (speaking ? 1.5 : 1.0));
      const rotY = t * (speaking ? 0.34 : 0.20);
      const tilt = 0.42; // fixed gentle tilt
      const cx = px / 2, cy = px / 2;
      const baseR = px * 0.34 * breathe;

      ctx.clearRect(0, 0, px, px);

      // soft inner glow
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.1, cx, cy, baseR * 1.7);
      const gcol = variant === 'sunrise' ? '216,120,70' : '120,110,210';
      glow.addColorStop(0, `rgba(${gcol},0.30)`);
      glow.addColorStop(1, `rgba(${gcol},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, px, px);

      ctx.globalCompositeOperation = 'lighter';
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt);

      for (const p of pts) {
        // rotate around Y
        let x = p.x * cosY + p.z * sinY;
        let z = -p.x * sinY + p.z * cosY;
        let y = p.y;
        // tilt around X
        let y2 = y * cosT - z * sinT;
        let z2 = y * sinT + z * cosT;
        // gentle individual shimmer (breathing pixels)
        const wob = 1 + 0.05 * Math.sin(t * 1.6 + p.seed);

        const sx = cx + x * baseR * wob;
        const sy = cy + y2 * baseR * wob;
        const depth = (z2 + 1) / 2;             // 0 back .. 1 front
        const pr = (0.5 + depth * 1.7) * dpr;
        const alpha = 0.12 + depth * 0.7;

        ctx.fillStyle = particleColor(variant, x, depth, alpha);
        ctx.beginPath();
        ctx.arc(sx, sy, pr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { running = false; cancelAnimationFrame(raf); };
  }, []);

  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'grid', placeItems: 'center' }} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

function particleColor(variant, x, depth, alpha) {
  // base palettes
  let r, g, b;
  if (variant === 'sunrise') {
    // blend violet (left) -> coral (right) by x
    const m = (x + 1) / 2;
    r = Math.round(120 + m * 96);   // 120..216
    g = Math.round(110 - m * 20);   // 110..90
    b = Math.round(210 - m * 160);  // 210..50
  } else if (variant === 'rings') {
    r = 150; g = 142; b = 230;
  } else { // glow / violet
    r = 130; g = 120; b = 224;
  }
  // front particles lighter
  const lift = depth * 60;
  r = Math.min(255, r + lift); g = Math.min(255, g + lift); b = Math.min(255, b + lift);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ---- The brand wave mark: a voice traveling outward + the coral spark ----
// Per the VELOA design guide: a smooth sound-wave curve in violet with a
// coral spark dot at its leading edge — "the moment she speaks."
function WaveMark({ h = 28, play = false, spark = true, color = 'var(--violet)' }) {
  // Base state is fully drawn/visible (see CSS). The `.draw`/`.pop` classes add
  // fill:none entrance keyframes \u2014 pure enhancement that can't blank the mark.
  const pathCls = 'wave-path' + (play ? ' draw' : '');
  const sparkCls = 'wave-spark';
  return (
    <svg height={h} viewBox="0 0 66 64" fill="none"
      style={{ display:'block', overflow:'visible' }} aria-hidden="true">
      <path
        className={pathCls}
        pathLength="1"
        d="M6 32 Q18 4 30 32 Q42 60 54 32"
        stroke={color} strokeWidth="3.4" strokeLinecap="round" fill="none" />
      {spark && (
        <circle className={sparkCls}
          cx="54" cy="32" r="4.6" fill="var(--coral)" />
      )}
    </svg>
  );
}

// ---- Top bar with wave mark + wordmark ----
function TopBar({ onBack, right, onBrandTap }) {
  const nav = useNav();
  return (
    <header style={{
      width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'20px 2px 14px', gap:12,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
        {onBack && (
          <button onClick={onBack} aria-label="Back" style={backBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
        <div onClick={() => (onBrandTap ? onBrandTap() : nav('landing'))}
          style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer', minWidth:0 }}>
          <WaveMark h={22} />
          <span className="wordmark" style={{ fontSize: 19 }}>VELOA</span>
        </div>
      </div>
      {right}
    </header>
  );
}
const backBtn = {
  width:38, height:38, borderRadius:'50%', border:'1px solid var(--line-strong)',
  background:'var(--glass)', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--dusk)',
};

// ---- Small pill / tag ----
function Tag({ children, tone = 'violet' }) {
  const map = {
    violet: { bg:'var(--haze)', fg:'var(--violet)' },
    coral:  { bg:'var(--tint-coral)', fg:'var(--coral)' },
    dusk:   { bg:'var(--tint-dusk)', fg:'var(--dusk)' },
    green:  { bg:'var(--tint-green)', fg:'var(--green-fg)' },
    grey:   { bg:'var(--tint-grey)', fg:'var(--ink-soft)' },
  }[tone] || {};
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6, fontSize:12.5, fontWeight:600,
      padding:'5px 11px', borderRadius:999, background:map.bg, color:map.fg, letterSpacing:'0.01em',
    }}>{children}</span>
  );
}

// ---- Brand logo: wave mark + wordmark (theme-aware, animates on mount) ----
function VeloaLogo({ size = 1, play = true }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 12 * size, color:'var(--dusk)' }}>
      <WaveMark h={52 * size} play={play} />
      <span style={{
        fontFamily:'var(--serif)', fontWeight:400, fontSize:`${2.55 * size}rem`,
        letterSpacing:'0.17em', lineHeight:1, color:'var(--dusk)', paddingLeft:'0.17em',
      }}>VELOA</span>
    </div>
  );
}

Object.assign(window, { NavContext, useNav, Orb, TopBar, Tag, VeloaLogo, WaveMark });
