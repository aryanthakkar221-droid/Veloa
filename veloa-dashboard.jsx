// veloa-dashboard.jsx — Screen 7
function ConfidenceRing({ value = 72 }) {
  const R = 52, C = 2 * Math.PI * R;
  const off = C * (1 - value / 100);
  return (
    <div style={{ position:'relative', width:140, height:140, flexShrink:0 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(83,74,183,0.14)" strokeWidth="12" />
        <circle cx="70" cy="70" r={R} fill="none" stroke="url(#cg)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 70 70)" />
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7d75d6" /><stop offset="100%" stopColor="#534AB7" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center', textAlign:'center' }}>
        <div>
          <div className="serif" style={{ fontSize:'2.1rem', color:'var(--dusk)', lineHeight:1 }}>{value}</div>
          <div style={{ fontSize:11, color:'var(--ink-soft)', letterSpacing:'0.04em', marginTop:2 }}>CONFIDENCE</div>
        </div>
      </div>
    </div>
  );
}

const CHECK_INS = [
  { date: 'May 28', label: 'Talked through being interrupted in a team session', choice: 'volunteer' },
  { date: 'May 14', label: 'A comment that left me uneasy', choice: 'authority' },
  { date: 'May 3',  label: 'My idea was dismissed in a group', choice: 'private' },
  { date: 'Apr 22', label: 'Felt left out of a study group', choice: 'volunteer' },
];
const CHOICE_META = {
  private:   { tone:'violet', text:'Kept private' },
  volunteer: { tone:'coral',  text:'Sent to volunteer' },
  authority: { tone:'dusk',   text:'Sent to administration' },
};

const STATUSES = [
  { kind:'volunteer', title:'Unequal speaking time', setting:'Small team discussion', date:'May 28',
    steps:['Seen by volunteer','In progress','Resolved'], at:1,
    note:'A volunteer is gently guiding the group toward fairer turns.' },
  { kind:'authority', title:'Felt unsafe after a comment', setting:'Shared group space', date:'May 14',
    steps:['Received','Under official review','Action taken'], at:1,
    note:'The administration is reviewing this through its official process.' },
  { kind:'volunteer', title:'Idea dismissed in group', setting:'Collaborative session', date:'Apr 22',
    steps:['Seen by volunteer','In progress','Resolved'], at:2,
    note:'Resolved — the group was guided toward fairer turns. Thank you for speaking up.' },
];

function Sparkline({ points = [54, 58, 61, 59, 66, 72], w = 120, h = 32 }) {
  const min = Math.min(...points), max = Math.max(...points);
  const span = max - min || 1;
  const pad = 4;
  const xs = i => pad + (i / (points.length - 1)) * (w - pad * 2);
  const ys = v => pad + (1 - (v - min) / span) * (h - pad * 2);
  const d = points.map((v, i) => (i ? 'L' : 'M') + xs(i).toFixed(1) + ' ' + ys(v).toFixed(1)).join(' ');
  const li = points.length - 1;
  return (
    <div style={{ marginTop:12 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block' }}>
        <path d={d} fill="none" stroke="var(--violet)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={xs(li)} cy={ys(points[li])} r="3" fill="var(--coral)" />
      </svg>
      <div style={{ fontSize:11, color:'var(--ink-soft)', marginTop:4 }}>Last 6 check-ins</div>
    </div>
  );
}

function Dashboard() {
  const nav = useNav();
  return (
    <div className="veloa-col fade-up" style={{ paddingBottom:40 }}>
      <TopBar onBack={() => nav('chat')} right={
        <button className="btn btn-ghost" style={{ padding:'9px 16px', fontSize:13.5 }} onClick={() => nav('settings')}>Privacy</button>
      } />

      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        {/* Greeting */}
        <div>
          <h1 style={{ fontSize:'1.9rem', margin:'4px 0 6px' }}>Welcome back.<br/>You're growing stronger.</h1>
          <span style={{ fontSize:13, color:'var(--ink-soft)' }}>
            Your private ID · <span style={{ fontFamily:'var(--sans)', fontWeight:600, color:'var(--violet)', letterSpacing:'0.04em' }}>{PRIVATE_ID}</span>
          </span>
        </div>

        {/* Confidence */}
        <div className="card" style={{ padding:'20px', display:'flex', gap:18, alignItems:'center' }}>
          <ConfidenceRing value={72} />
          <div>
            <h3 style={{ margin:'0 0 6px', fontSize:'1.1rem' }}>Your confidence is rising</h3>
            <p style={{ margin:0, color:'var(--ink-soft)', fontSize:'0.95rem', lineHeight:1.5 }}>
              You've spoken up 4 times this month — that takes courage.
            </p>
            <Sparkline />
          </div>
        </div>

        {/* Complaint status */}
        <Section title="Following your steps">
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {STATUSES.map((s, i) => <StatusCard key={i} s={s} />)}
          </div>
        </Section>

        {/* Past check-ins */}
        <Section title="Your past check-ins">
          <div className="card" style={{ overflow:'hidden' }}>
            {CHECK_INS.map((c, i) => {
              const m = CHOICE_META[c.choice];
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
                  borderTop: i ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ width:42, flexShrink:0, fontSize:12, fontWeight:600, color:'var(--ink-soft)' }}>{c.date}</div>
                  <div style={{ flex:1, fontSize:'0.93rem', color:'var(--ink)', lineHeight:1.4 }}>{c.label}</div>
                  <Tag tone={m.tone}>{m.text}</Tag>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Personal details */}
        <Section title="Your details">
          <div className="card" style={{ padding:'18px' }}>
            <Detail k="Private ID" v={PRIVATE_ID} mono />
            <Detail k="University" v="Verified · sealed" />
            <Detail k="Member since" v="February 2026" last />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 style={{ fontSize:'1.05rem', margin:'6px 2px 12px', color:'var(--dusk)', letterSpacing:'0.01em' }}>{title}</h2>
      {children}
    </div>
  );
}

function StatusCard({ s }) {
  const resolved = s.at >= s.steps.length - 1;
  const tone = s.kind === 'volunteer' ? 'coral' : 'dusk';
  const c = tone === 'coral' ? 'var(--coral)' : 'var(--dusk)';
  return (
    <div className="card" style={{ padding:'16px 18px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:14 }}>
        <div>
          <div style={{ fontWeight:600, color:'var(--dusk)', fontSize:'1rem' }}>{s.title}</div>
          <div style={{ fontSize:12.5, color:'var(--ink-soft)', marginTop:2 }}>{s.setting} · {s.date}</div>
        </div>
        <Tag tone={resolved ? 'green' : tone}>{resolved ? 'Resolved' : s.steps[s.at]}</Tag>
      </div>
      {/* Stepper */}
      <div style={{ display:'flex', alignItems:'center' }}>
        {s.steps.map((st, i) => (
          <React.Fragment key={i}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, flexShrink:0, width:0, minWidth:0 }}>
              <span style={{ width:14, height:14, borderRadius:'50%', flexShrink:0,
                background: i <= s.at ? c : 'var(--line-strong)',
                display:'grid', placeItems:'center' }}>
                {i < s.at && <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </span>
            </div>
            {i < s.steps.length - 1 && (
              <div style={{ flex:1, height:3, borderRadius:2, background: i < s.at ? c : 'var(--line)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:7 }}>
        {s.steps.map((st, i) => (
          <span key={i} style={{ fontSize:10.5, color: i <= s.at ? 'var(--dusk)' : 'var(--ink-soft)', flex:1,
            textAlign: i===0?'left':i===s.steps.length-1?'right':'center', fontWeight: i===s.at?600:400 }}>{st}</span>
        ))}
      </div>
      <p style={{ margin:'12px 0 0', fontSize:'0.9rem', color:'var(--ink-soft)', lineHeight:1.5,
        fontStyle: resolved?'normal':'normal', borderTop:'1px solid var(--line)', paddingTop:12 }}>
        {s.note}
      </p>
    </div>
  );
}

function Detail({ k, v, mono, last }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0',
      borderBottom: last ? 'none' : '1px solid var(--line)' }}>
      <span style={{ fontSize:'0.92rem', color:'var(--ink-soft)' }}>{k}</span>
      <span style={{ fontSize:'0.92rem', fontWeight:600, color:'var(--dusk)', letterSpacing: mono?'0.04em':0 }}>{v}</span>
    </div>
  );
}

window.Dashboard = Dashboard;
