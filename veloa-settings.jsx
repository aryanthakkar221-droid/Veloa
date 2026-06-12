// veloa-settings.jsx — Screen 10
const PRIVACY_POINTS = [
  { icon:'vault', text:'Your story and login details are kept in a sealed vault.' },
  { icon:'eye',   text:'VELOA itself cannot read your private information.' },
  { icon:'key',   text:'Only the administration and authorised officials can access the vault — and only in documented, serious situations.' },
  { icon:'you',   text:'Only YOU can choose to reveal your identity. No one else can do it for you.' },
];

function PrivacyIcon({ name }) {
  const c = 'var(--violet)';
  const p = { stroke:c, strokeWidth:1.7, fill:'none', strokeLinecap:'round', strokeLinejoin:'round' };
  return (
    <div style={{ width:40, height:40, borderRadius:12, background:'var(--haze)', display:'grid', placeItems:'center', flexShrink:0 }}>
      <svg width="20" height="20" viewBox="0 0 24 24">
        {name==='vault' && <g {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 10v4M10 12h4"/></g>}
        {name==='eye'   && <g {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.6"/><path d="M4 4l16 16" stroke={c}/></g>}
        {name==='key'   && <g {...p}><circle cx="8" cy="8" r="4"/><path d="M11 11l8 8M16 16l2-2M18 18l2-2"/></g>}
        {name==='you'   && <g {...p}><circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/></g>}
      </svg>
    </div>
  );
}

function Settings() {
  const nav = useNav();
  const [notif, setNotif] = useState(true);
  const [checkins, setCheckins] = useState(true);
  return (
    <div className="veloa-col fade-up" style={{ paddingBottom:40 }}>
      <TopBar onBack={() => nav('dashboard')} />

      <h1 style={{ fontSize:'1.9rem', margin:'4px 0 18px' }}>Your privacy,<br/>your control.</h1>

      {/* Sealed vault visual */}
      <div className="card" style={{ padding:'24px', display:'flex', flexDirection:'column', alignItems:'center', gap:14, marginBottom:18,
        background:'var(--card)' }}>
        <div style={{ width:78, height:78, borderRadius:'50%', background:'var(--haze)', display:'grid', placeItems:'center',
          boxShadow:'0 0 0 10px rgba(238,237,254,0.5)' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2.5" stroke="var(--violet)" strokeWidth="1.8"/><path d="M8 10V7a4 4 0 018 0v3" stroke="var(--violet)" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="15" r="1.5" fill="var(--violet)"/><path d="M12 16.5V18" stroke="var(--violet)" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:13, color:'var(--ink-soft)', marginBottom:4 }}>Your private ID</div>
          <div className="serif" style={{ fontSize:'1.5rem', color:'var(--dusk)', letterSpacing:'0.06em' }}>{PRIVATE_ID}</div>
        </div>
        <Tag tone="violet">Sealed vault · active</Tag>
      </div>

      {/* Privacy promise */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:22 }}>
        {PRIVACY_POINTS.map((p, i) => (
          <div key={i} className="card" style={{ padding:'15px 16px', display:'flex', gap:13, alignItems:'center' }}>
            <PrivacyIcon name={p.icon} />
            <span style={{ fontSize:'0.95rem', color:'var(--ink)', lineHeight:1.5 }}>{p.text}</span>
          </div>
        ))}
      </div>

      {/* Toggles */}
      <h2 style={{ fontSize:'1.05rem', margin:'0 2px 12px' }}>Gentle settings</h2>
      <div className="card" style={{ overflow:'hidden', marginBottom:22 }}>
        <ToggleRow label="Notifications" sub="Updates on your check-ins" on={notif} onClick={() => setNotif(v=>!v)} />
        <ToggleRow label="Gentle check-ins" sub="VELOA may softly check in if a pattern grows" on={checkins} onClick={() => setCheckins(v=>!v)} last />
      </div>

      <p className="serif" style={{ fontStyle:'italic', textAlign:'center', color:'var(--violet)', fontSize:'1.15rem', lineHeight:1.5, margin:'8px 0' }}>
        You are always in control of your story.
      </p>
    </div>
  );
}

function ToggleRow({ label, sub, on, onClick, last }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'15px 16px',
      borderBottom: last ? 'none' : '1px solid var(--line)' }}>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:600, color:'var(--dusk)', fontSize:'0.97rem' }}>{label}</div>
        <div style={{ fontSize:12.5, color:'var(--ink-soft)', marginTop:1 }}>{sub}</div>
      </div>
      <button onClick={onClick} aria-pressed={on} style={{
        width:50, height:29, borderRadius:999, border:'none', cursor:'pointer', position:'relative',
        background: on ? 'var(--violet)' : 'var(--line-strong)', transition:'background .25s', flexShrink:0 }}>
        <span style={{ position:'absolute', top:3, left: on ? 24 : 3, width:23, height:23, borderRadius:'50%',
          background:'#fff', transition:'left .25s', boxShadow:'0 2px 5px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}

window.Settings = Settings;
