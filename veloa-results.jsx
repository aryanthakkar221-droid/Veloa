// veloa-results.jsx — Screens 4, 5, 6
const PRIVATE_ID = 'VL-8X42-QR91';
const DEFAULT_SCENARIO = {
  type: 'A difficult moment',
  anon: "A student shared that a recent interaction left them feeling unheard and discouraged. The setting was a group environment.",
  setting: 'Group setting',
};
function currentScenario(){ return window.__veloaScenario || DEFAULT_SCENARIO; }

function ResultIcon({ tone, kind }) {
  const c = { violet:'var(--violet)', coral:'var(--coral)', dusk:'var(--dusk)' }[tone];
  const bg = { violet:'var(--haze)', coral:'var(--tint-coral)', dusk:'var(--tint-dusk)' }[tone];
  return (
    <div className="result-pop" style={{ width:84, height:84, borderRadius:'50%', background:bg, display:'grid', placeItems:'center', boxShadow:`0 0 0 10px ${bg}66` }}>
      {kind === 'lock' && <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2.4" stroke={c} strokeWidth="1.8"/><path d="M8 11V8a4 4 0 018 0v3" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="15.5" r="1.4" fill={c}/></svg>}
      {kind === 'heart' && <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ overflow:'visible', transformOrigin:'center' }}><path d="M19.5 12.572l-7.5 7.428-7.5-7.428a5 5 0 1 1 7.5-6.566 5 5 0 1 1 7.5 6.566z" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      {kind === 'building' && <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M4 21h16M6 21V6l6-3 6 3v15" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/><path d="M10 21v-4h4v4M10 10h0M14 10h0M10 13h0M14 13h0" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>}
    </div>
  );
}

function ResultShell({ tone, icon, title, children, accentText }) {
  const nav = useNav();
  return (
    <div className="veloa-col fade-up" style={{ paddingBottom:34 }}>
      <TopBar onBack={() => nav('chat')} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:22, paddingTop:6 }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:18 }}>
          <ResultIcon tone={tone} kind={icon} />
          <h1 style={{ fontSize:'2rem', margin:0 }}>{title}</h1>
        </div>
        {children}
        <button className="btn btn-violet btn-block" style={{ marginTop:4 }} onClick={() => {
          if (window.openVeloaFeedback) window.openVeloaFeedback(() => nav('dashboard'));
          else nav('dashboard');
        }}>
          Go to my dashboard
        </button>
      </div>
      <style>{`.result-pop{animation:pop .6s cubic-bezier(.2,.8,.3,1.2) both}@keyframes pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

function PreviewCard({ label, children, tone='violet' }) {
  const c = { violet:'var(--violet)', coral:'var(--coral)', dusk:'var(--dusk)' }[tone];
  return (
    <div style={{ background:'var(--haze)', borderRadius:18, padding:'16px 18px', border:'1px solid rgba(83,74,183,0.12)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke={c} strokeWidth="1.7"/><circle cx="12" cy="12" r="2.6" stroke={c} strokeWidth="1.7"/></svg>
        <span style={{ fontSize:11.5, fontWeight:700, letterSpacing:'0.08em', color:c, textTransform:'uppercase' }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

// ---- Screen 4 ----
function PrivateResult() {
  return (
    <ResultShell tone="violet" icon="lock" title="Saved, just for you.">
      <p className="lede" style={{ textAlign:'center', margin:0 }}>
        This stays completely private. No one else can see it. If a pattern grows over time, VELOA may gently check in with you — but the choice will always be yours.
      </p>
    </ResultShell>
  );
}

// ---- Screen 5 ----
// Shows the privacy filter working, live: original words → filter → what the
// volunteer actually receives → how a volunteer responds to the group.
const rsLabelStyle = {
  fontSize:11.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
};

function FilterDivider() {
  const line = { flex:1, height:1, background:'var(--line-strong)' };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'-8px 0' }}>
      <span style={line}></span>
      <span style={{ display:'flex', alignItems:'center', gap:7 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ ...rsLabelStyle, fontSize:11, letterSpacing:'0.12em', color:'var(--coral)', whiteSpace:'nowrap' }}>Veloa removes all identities</span>
      </span>
      <span style={line}></span>
    </div>
  );
}

function VolunteerSent() {
  const nav = useNav();
  const story = window.__veloaUserStory || currentScenario().anon || '';
  const snippet = story.length > 140 ? story.slice(0, 140).replace(/\s+\S*$/, '') + ' …' : story;
  return (
    <ResultShell tone="coral" icon="heart" title="A volunteer has been gently alerted.">
      <p className="lede" style={{ textAlign:'center', margin:0 }}>
        A trained, neutral volunteer will help make the room fairer. Here is exactly what happened to your words on the way:
      </p>

      {/* A — the original words, faded */}
      <div style={{ background:'var(--haze)', borderRadius:18, padding:'15px 18px', border:'1px solid rgba(83,74,183,0.12)' }}>
        <div style={{ ...rsLabelStyle, color:'var(--violet)', marginBottom:8 }}>What you shared</div>
        <p style={{ margin:0, opacity:0.58, fontSize:'0.93rem', lineHeight:1.55, color:'var(--ink)' }}>{snippet}</p>
      </div>

      {/* B — the filter */}
      <FilterDivider />

      {/* C — the anonymized report */}
      <div style={{ background:'var(--card)', borderRadius:18, padding:'17px 18px', border:'1.5px solid rgba(83,74,183,0.42)', boxShadow:'var(--shadow-soft)' }}>
        <div style={{ ...rsLabelStyle, color:'var(--violet)', marginBottom:11 }}>What the volunteer receives</div>
        <FilteredBody />
        <div style={{ marginTop:12, display:'flex', gap:8, flexWrap:'wrap' }}>
          <Tag tone="grey">No names shared</Tag>
        </div>
      </div>

      <p className="serif" style={{ fontStyle:'italic', color:'var(--violet)', textAlign:'center', margin:0, fontSize:'1.08rem', lineHeight:1.5 }}>
        No names. No accusations. Just enough to make the room fairer.
      </p>

      {/* Close the loop — peek at the volunteer's side */}
      <NextStepCard
        text="A trained volunteer has been assigned. This is how it appears on their side — no names, just the room."
        cta="Peek at the volunteer's view →" onClick={() => nav('volunteer')} />

    </ResultShell>
  );
}

// A quiet “what happens next” card that links onward to the matching portal.
function NextStepCard({ text, cta, onClick }) {
  return (
    <div style={{ background:'var(--haze)', borderRadius:18, padding:'16px 18px', border:'1px solid rgba(83,74,183,0.28)' }}>
      <div style={{ ...rsLabelStyle, color:'var(--violet)', marginBottom:8 }}>What happens next</div>
      <p style={{ margin:'0 0 12px', fontSize:'0.94rem', color:'var(--ink)', lineHeight:1.55 }}>{text}</p>
      <button onClick={onClick} style={{
        background:'none', border:'1.4px solid var(--violet)', borderRadius:999, cursor:'pointer',
        padding:'9px 16px', color:'var(--violet)', fontFamily:'var(--sans)', fontSize:13.5, fontWeight:600,
      }}>{cta}</button>
    </div>
  );
}

// ---- Screen 6 ----
// The name-reveal choice was already made on the "Check before it goes"
// preview; this screen simply reflects it.
function AuthoritySent() {
  const nav = useNav();
  const reveal = !!window.__veloaReveal;
  const name = window.__veloaRevealName || 'Your verified name';
  const from = reveal ? 'Name: ' + name : PRIVATE_ID + ' (anonymous verified student)';

  return (
    <ResultShell tone="dusk" icon="building" title="Shared with the administration.">
      <p className="lede" style={{ textAlign:'center', margin:0 }}>
        For serious matters, the university handles this through its official process — with care and confidentiality.
      </p>

      <PreviewCard label="What the administration sees" tone="dusk">
        <FilteredBody from={from} />
        <div style={{ marginTop:12, display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          {reveal
            ? <Tag tone="coral">Name shared by choice</Tag>
            : <Tag tone="grey">Your identity sealed</Tag>}
        </div>
      </PreviewCard>

      {/* Close the loop — peek at the administration's side */}
      <NextStepCard
        text="Your report has arrived in the administration's Incoming Complaints inbox."
        cta="Peek at the admin view →" onClick={() => nav('admin')} />
    </ResultShell>
  );
}

Object.assign(window, { PrivateResult, VolunteerSent, AuthoritySent, PRIVATE_ID, currentScenario });
