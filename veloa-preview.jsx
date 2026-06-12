// veloa-preview.jsx — "Check before it goes": consent step before anything is sent.
// Inserted between the chat options and the volunteer / administration result screens.

const VELOA_GOBACK_MSG = "No problem — nothing was sent. It stays between us. You can choose again anytime.";

// Anonymized view of the current scenario. Chip scenarios carry a curated
// `filtered` block; typed scenarios fall back to their type/setting/anon text.
// Place and group details stay — only the identities are removed.
function veloaFiltered(sc) {
  const s = sc || {};
  if (s.filtered) return s.filtered;
  return {
    issue: s.type || 'A difficult moment',
    where: s.setting || 'Group setting',
    what: s.anon || 'A student shared a difficult moment in a group setting.',
    focus: 'Remind the group about fairness and respect — addressed to everyone, blaming no one.',
  };
}

function veloaGoBack(nav) {
  const thread = window.__veloaThread || [];
  window.__veloaResume = [...thread, { from:'ai', text: VELOA_GOBACK_MSG }];
  nav('chat');
}

// One labelled row inside the filtered card: small-caps muted label, Deep Dusk value
function FilteredRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'0.1em', color:'var(--ink-soft)', textTransform:'uppercase', marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:'0.96rem', color:'var(--dusk)', lineHeight:1.5 }}>{value}</div>
    </div>
  );
}

// The anonymized report body — the IDENTICAL card shown on the preview, the
// confirmation, and (per item) in the volunteer portal. Pass `f` to render a
// specific report; otherwise it reads the current scenario. No names anywhere.
function FilteredBody({ from, f }) {
  const d = f || veloaFiltered(currentScenario());
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
      {from && <FilteredRow label="From" value={from} />}
      <FilteredRow label="Issue" value={d.issue} />
      <FilteredRow label="Where" value={d.where} />
      <FilteredRow label="What's happening" value={d.what} />
      <FilteredRow label="Suggested focus" value={d.focus} />
    </div>
  );
}

function FilteredCard({ from, label, tone='violet' }) {
  return (
    <div style={{
      background:'var(--card)', borderRadius:18, padding:'17px 18px',
      border:'1.5px solid rgba(83,74,183,0.42)', boxShadow:'var(--shadow-soft)',
    }}>
      {label && (
        <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'0.08em', color: tone==='dusk' ? 'var(--dusk)' : 'var(--violet)', textTransform:'uppercase', marginBottom:11 }}>{label}</div>
      )}
      <FilteredBody from={from} />
    </div>
  );
}

function PreviewFrame({ subtitle, sendLabel, onSend, children }) {
  const nav = useNav();
  const [sealing, setSealing] = useState(false);
  const [sealed, setSealed] = useState(false);

  // The lock-seal beat: same rhythm as login (~2.3s), then continue to the
  // result screen. “Sealing your identity…” → “Locked and secured.”
  function startSeal() {
    setSealing(true);
    setTimeout(() => setSealed(true), 1650);
    setTimeout(() => onSend(), 2300);
  }

  if (sealing) {
    return (
      <div className="veloa-col" style={{ alignItems:'center', justifyContent:'center', textAlign:'center' }}>
        <div className="fade-up" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:36 }}>
          <SealAnimation done={sealed} />
          <div style={{ position:'relative', height:'2.2em', width:'min(86vw,360px)' }}>
            {['Sealing your identity…', 'Locked and secured.'].map((s, i) => (
              <span key={i} className="serif" style={{
                position:'absolute', left:0, right:0, top:0, textAlign:'center',
                fontStyle:'italic', fontSize:'1.28rem', color:'var(--dusk)', lineHeight:1.35,
                opacity: (sealed ? 1 : 0) === i ? 1 : 0,
                transform: (sealed ? 1 : 0) === i ? 'translateY(0)' : (i === 0 ? 'translateY(-8px)' : 'translateY(8px)'),
                transition:'opacity .55s ease, transform .55s ease',
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="veloa-col fade-up" style={{ paddingBottom:34 }}>
      <TopBar onBack={() => veloaGoBack(nav)} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:18, paddingTop:6 }}>
        <div style={{ textAlign:'center' }}>
          <h1 style={{ fontSize:'1.95rem', margin:'0 0 8px' }}>Check before it goes</h1>
          <p style={{ margin:'0 auto', maxWidth:340, fontSize:'0.94rem', color:'var(--ink-soft)', lineHeight:1.55 }}>{subtitle}</p>
        </div>
        {children}
        <div style={{ display:'flex', flexDirection:'column', gap:4, marginTop:2 }}>
          <button className="btn btn-coral btn-block" onClick={startSeal}>{sendLabel}</button>
          <button onClick={() => veloaGoBack(nav)} style={{
            background:'none', border:'none', cursor:'pointer', padding:'12px 8px',
            color:'var(--dusk)', fontFamily:'var(--sans)', fontSize:14.5, fontWeight:600,
          }}>Go back — don't send</button>
          <p style={{ fontSize:11, color:'var(--ink-soft)', textAlign:'center', margin:0 }}>Nothing is ever sent without your approval.</p>
        </div>
      </div>
    </div>
  );
}

// ── Flow A — before alerting a volunteer ──
function VolunteerPreview() {
  const nav = useNav();
  return (
    <PreviewFrame
      subtitle="This is exactly what the volunteer will receive — word for word. Nothing more."
      sendLabel="Send to volunteer"
      onSend={() => nav('volunteer-sent')}>
      <FilteredCard label="What the volunteer receives" />
    </PreviewFrame>
  );
}

// ── Flow B — before telling the administration ──
// The name-reveal choice is asked FIRST; the report card updates live.
function veloaRevealName() {
  const m = /\bI['\u2019]m\s+([A-Z][a-z]+)/.exec(window.__veloaUserStory || '');
  return m ? m[1] : 'Your verified name';
}

function VeloaRevealOption({ selected, onClick, tone, title, sub }) {
  const c = tone === 'coral' ? 'var(--coral)' : 'var(--violet)';
  const bg = tone === 'coral' ? 'var(--tint-coral)' : 'var(--haze)';
  return (
    <button onClick={onClick} style={{
      textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:12, width:'100%',
      padding:'13px 15px', borderRadius:14, fontFamily:'var(--sans)',
      background: selected ? bg : 'var(--card)',
      border: `1.6px solid ${selected ? c : 'var(--line-strong)'}`,
      transition:'all .2s',
    }}>
      <span style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, display:'grid', placeItems:'center',
        border:`2px solid ${selected ? c : 'rgba(38,33,92,0.25)'}` }}>
        {selected && <span style={{ width:10, height:10, borderRadius:'50%', background:c }}></span>}
      </span>
      <span>
        <span style={{ display:'block', fontWeight:600, fontSize:'0.97rem', color:'var(--dusk)' }}>{title}</span>
        <span style={{ display:'block', fontSize:12.5, color:'var(--ink-soft)', lineHeight:1.4 }}>{sub}</span>
      </span>
    </button>
  );
}

function AuthorityPreview() {
  const nav = useNav();
  const [reveal, setReveal] = useState(false);
  const code = window.PRIVATE_ID || 'VL-8X42-QR91';
  const name = veloaRevealName();
  const from = reveal ? 'Name: ' + name : code + ' (anonymous verified student)';
  return (
    <PreviewFrame
      subtitle="This is exactly what the administration will receive — word for word."
      sendLabel="Send to administration"
      onSend={() => { window.__veloaReveal = reveal; window.__veloaRevealName = name; nav('authority-sent'); }}>

      {/* Step 1 — the choice, asked first */}
      <div>
        <h2 style={{ fontSize:'1.22rem', margin:'0 0 12px', textAlign:'center' }}>Do you want to share your name with the administration?</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <VeloaRevealOption selected={!reveal} onClick={() => setReveal(false)} tone="violet"
            title="Stay anonymous" sub={'You appear only as your code ' + code + '.'} />
          <VeloaRevealOption selected={reveal} onClick={() => setReveal(true)} tone="coral"
            title="Reveal my name" sub="Only the administration will see it. Volunteers never do." />
        </div>
      </div>

      {/* Step 2 — the identical report card, updating live */}
      <FilteredCard tone="dusk" label="What the administration receives" from={from} />
    </PreviewFrame>
  );
}

Object.assign(window, { VolunteerPreview, AuthorityPreview, veloaFiltered, FilteredRow, FilteredBody, VELOA_GOBACK_MSG });
