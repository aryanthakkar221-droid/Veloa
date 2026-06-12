// veloa-portals.jsx — Volunteer Space (admin portal lives in veloa-admin.jsx)

// ---------- VOLUNTEER PORTAL ----------
// Each signal is the exact filtered report the student approved on the
// "Check before it goes" screen — place and group details kept, names removed.
const VP_SIGNALS = [
  { id:1, issue:'Repeated interruptions', kind:'Group meeting', where:'Weekly project meeting, Room S-204', time:'Today, 09:41',
    what:'A team member is repeatedly talked over and cannot finish presenting.',
    focus:'Remind the group about equal speaking space and letting people finish.' },
  { id:2, issue:'Idea re-attribution', kind:'Seminar group', where:'Research group seminar, Thursdays', time:'Today, 08:15',
    what:"A student's suggestion was ignored, then praised when repeated by someone else.",
    focus:'Encourage the group to acknowledge ideas the first time they are said.' },
  { id:3, issue:'Sexist humour', kind:'Lab group', where:'Student lab, lunch break group', time:'Yesterday, 13:02',
    what:'Demeaning jokes about women are being normalised in the group.',
    focus:'A gentle reset on respectful humour — addressed to everyone, blaming no one.' },
  { id:4, issue:'Overlooked for leadership', kind:'Council team', where:'Student council, science fair team', time:'May 30, 17:24', guided:true,
    what:'Lead roles are being assigned without open discussion or equal consideration.',
    focus:'Encourage a fair, transparent selection conversation for team roles.' },
  { id:5, issue:'Possible pay inequality', kind:'Work team', where:'Library, student assistant team', time:'May 28, 11:48', guided:true,
    what:'Equal work may not be receiving equal pay.',
    focus:'This topic should be guided toward the supervising office — volunteers do not handle pay matters directly.' },
];

function VolunteerStat({ value, label, caption }) {
  return (
    <div className="card" style={{ padding:'13px 12px', borderRadius:12 }}>
      <div className="serif" style={{ fontSize:'1.6rem', color:'var(--dusk)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, fontWeight:600, color:'var(--ink-soft)', marginTop:6, lineHeight:1.3 }}>{label}</div>
      {caption && <div style={{ fontSize:9.5, color:'var(--ink-soft)', opacity:.85, marginTop:3, lineHeight:1.3 }}>{caption}</div>}
    </div>
  );
}

function SignalCard({ s, guided, onGuide }) {
  return (
    <div className="card" style={{ borderLeft:'4px solid var(--coral)', borderRadius:'6px 18px 18px 6px', padding:'16px 18px', opacity: guided ? 0.72 : 1, transition:'opacity .3s' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:13 }}>
        <span style={{ fontWeight:700, color:'var(--dusk)', fontSize:'1.02rem' }}>{s.issue}</span>
        <span style={{ background:'var(--haze)', color:'var(--violet)', fontSize:11.5, fontWeight:600, padding:'4px 11px', borderRadius:999, whiteSpace:'nowrap' }}>{s.kind}</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <FilteredRow label="Where" value={s.where} />
        <FilteredRow label="What's happening" value={s.what} />
        <FilteredRow label="Suggested focus" value={s.focus} />
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:14, marginTop:14 }}>
        <span style={{ fontSize:12, color:'var(--ink-soft)' }}>{s.time}</span>
        {guided
          ? <span style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--green-fg)', fontSize:13.5, fontWeight:600 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              Guided
            </span>
          : <button className="btn btn-ghost" style={{ padding:'8px 16px', fontSize:13 }} onClick={onGuide}>Mark as guided</button>}
      </div>
    </div>
  );
}

function VolunteerPortal() {
  const nav = useNav();
  const [guided, setGuided] = useState(() => {
    const g = {}; VP_SIGNALS.forEach(s => { if (s.guided) g[s.id] = true; }); return g;
  });
  const openCount = VP_SIGNALS.filter(s => !guided[s.id]).length;

  return (
    <div className="veloa-col fade-up" style={{ paddingBottom:40 }}>
      <TopBar onBack={() => nav('chat')} />

      {/* Header band */}
      <div style={{ background:'#26215C', borderRadius:'14px 14px 26px 26px', padding:'22px 20px 24px',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'1.65rem', color:'#fff' }}>Volunteer Space</h1>
          <p className="serif" style={{ margin:'5px 0 0', fontStyle:'italic', color:'#b9b2e6', fontSize:'1.02rem' }}>Quiet signals. Fair rooms.</p>
        </div>
        <span style={{ background:'var(--coral)', color:'#fff', fontSize:12, fontWeight:700, padding:'7px 14px', borderRadius:999, whiteSpace:'nowrap' }}>Level 2 · Handler</span>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, margin:'14px 0 22px' }}>
        <VolunteerStat value={openCount} label="Open signals" />
        <VolunteerStat value="12" label="Sessions guided" />
        <VolunteerStat value="98%" label="Rooms improved" caption="self-reported after sessions" />
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', margin:'0 2px 12px' }}>
        <h2 style={{ fontSize:'1.05rem', margin:0 }}>Incoming signals</h2>
        <span style={{ fontSize:12.5, color:'var(--ink-soft)' }}>Newest first</span>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {VP_SIGNALS.map(s => (
          <SignalCard key={s.id} s={s} guided={!!guided[s.id]} onGuide={() => setGuided(g => ({ ...g, [s.id]: true }))} />
        ))}
      </div>

      {/* Reminder */}
      <div style={{ background:'var(--haze)', border:'1.5px solid rgba(83,74,183,0.4)', borderRadius:18, padding:'15px 17px',
        display:'flex', gap:11, alignItems:'flex-start', marginTop:18 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:2 }}><rect x="5" y="11" width="14" height="9" rx="2.4" stroke="var(--violet)" strokeWidth="1.8"></rect><path d="M8 11V8a4 4 0 018 0v3" stroke="var(--violet)" strokeWidth="1.8" strokeLinecap="round"></path><circle cx="12" cy="15.5" r="1.4" fill="var(--violet)"></circle></svg>
        <span style={{ fontSize:13.5, color:'var(--ink)', lineHeight:1.55 }}>
          You never see names. You never assign blame. You guide the room — that's the whole job.
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { VolunteerPortal });
