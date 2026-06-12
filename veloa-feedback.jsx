// veloa-feedback.jsx — end-of-chat feedback popup, shared persistence, hidden viewer
const { useState: useFbState, useEffect: useFbEffect, useRef: useFbRef } = React;

// ---------------------------------------------------------------------------
// Storage adapter
// Prefers the artifact shared-storage API (window.storage) so submissions from
// every judge's phone collect in one place. Falls back to localStorage when the
// API isn't present (e.g. local preview). Every call is wrapped so the popup
// can never break the app.
// ---------------------------------------------------------------------------
const veloaStore = {
  async set(key, value, shared = true) {
    try {
      if (window.storage && typeof window.storage.set === 'function') {
        await window.storage.set(key, value, shared);
        return true;
      }
    } catch (e) { /* fall through to local */ }
    try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
  },
  async list(prefix, shared = true) {
    try {
      if (window.storage && typeof window.storage.list === 'function') {
        const keys = await window.storage.list(prefix, shared);
        if (Array.isArray(keys)) return keys;
        if (keys && Array.isArray(keys.keys)) return keys.keys;
      }
    } catch (e) { /* fall through */ }
    try {
      const out = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) out.push(k);
      }
      return out;
    } catch (e) { return []; }
  },
  async get(key, shared = true) {
    try {
      if (window.storage && typeof window.storage.get === 'function') {
        return await window.storage.get(key, shared);
      }
    } catch (e) { /* fall through */ }
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
};

async function saveFeedback(rating, suggestion) {
  const entry = {
    rating,
    suggestion: (suggestion || '').trim(),
    timestamp: new Date().toISOString(),
  };
  try {
    await veloaStore.set('feedback:' + Date.now(), JSON.stringify(entry), true);
  } catch (e) { /* never throw — popup still shows thank-you */ }
}

// ---------------------------------------------------------------------------
// Feedback popup
// ---------------------------------------------------------------------------
const RATINGS = [
  { id: 'good',    label: 'Good' },
  { id: 'average', label: 'Average' },
  { id: 'bad',     label: 'Bad' },
];

function ratingStyle(opt, selected) {
  const map = {
    good:    { c: 'var(--coral)',  tint: 'var(--tint-coral)' },
    average: { c: 'var(--violet)', tint: 'var(--haze)' },
    bad:     { c: 'var(--dusk)',   tint: 'var(--tint-dusk)' },
  }[opt];
  return {
    flex: 1,
    padding: '15px 8px',
    borderRadius: 16,
    cursor: 'pointer',
    fontFamily: 'var(--sans)',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all .18s ease',
    border: `1.6px solid ${selected ? map.c : 'var(--line-strong)'}`,
    background: selected ? (opt === 'good' ? map.c : map.tint) : 'var(--card)',
    color: selected ? (opt === 'good' ? '#fff' : map.c) : 'var(--ink-soft)',
    boxShadow: selected ? `0 10px 24px -12px ${map.c}` : 'none',
    transform: selected ? 'translateY(-1px)' : 'none',
  };
}

function FeedbackPopup({ onClose }) {
  const [rating, setRating] = useFbState(null);
  const [showSuggestion, setShowSuggestion] = useFbState(false);
  const [suggestion, setSuggestion] = useFbState('');
  const [phase, setPhase] = useFbState('form'); // 'form' | 'thanks'
  const [busy, setBusy] = useFbState(false);

  // auto-close after the thank-you state
  useFbEffect(() => {
    if (phase !== 'thanks') return;
    const t = setTimeout(() => onClose(), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  async function submit() {
    if (!rating || busy) return;
    setBusy(true);
    await saveFeedback(rating, suggestion);
    setPhase('thanks');
  }

  return (
    <div className="fb-backdrop" onClick={() => phase === 'form' && onClose()}>
      <div className="fb-card fb-pop" onClick={(e) => e.stopPropagation()}>
        {phase === 'form' ? (
          <>
            <h3 style={fbT.title}>How was your experience with VELOA?</h3>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {RATINGS.map((r) => (
                <button key={r.id} onClick={() => setRating(r.id)} style={ratingStyle(r.id, rating === r.id)}>
                  {r.label}
                </button>
              ))}
            </div>

            {!showSuggestion ? (
              <button className="fb-link" onClick={() => setShowSuggestion(true)} style={{ marginTop: 16 }}>
                Any suggestion?
              </button>
            ) : (
              <div style={{ marginTop: 16 }} className="fb-reveal">
                <textarea
                  autoFocus
                  value={suggestion}
                  maxLength={500}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Tell us one thing we could do better…"
                  style={fbT.textarea}
                />
                <div style={fbT.counter}>{suggestion.length}/500</div>
              </div>
            )}

            <button
              className="btn btn-coral btn-block"
              onClick={submit}
              disabled={!rating || busy}
              style={{ marginTop: 20, opacity: rating ? 1 : 0.5, cursor: rating ? 'pointer' : 'not-allowed' }}>
              Submit
            </button>
            <button className="fb-skip" onClick={() => onClose()}>Skip</button>
          </>
        ) : (
          <div className="fb-thanks" style={{ textAlign: 'center', padding: '14px 6px 6px' }}>
            <div className="fb-heart" style={{ display: 'grid', placeItems: 'center', marginBottom: 16 }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" style={{ overflow: 'visible', transformOrigin: 'center' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--coral)" />
              </svg>
            </div>
            <h3 style={{ ...fbT.title, marginBottom: 8 }}>Thank you.</h3>
            <p className="lede" style={{ margin: 0 }}>Every voice makes VELOA better.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hidden feedback viewer (team only — opened via 5 quick taps on the logo)
// ---------------------------------------------------------------------------
function FeedbackViewer({ onClose }) {
  const [loading, setLoading] = useFbState(true);
  const [entries, setEntries] = useFbState([]);

  useFbEffect(() => {
    let alive = true;
    (async () => {
      const out = [];
      try {
        const keys = await veloaStore.list('feedback:', true);
        for (const k of keys) {
          try {
            const raw = await veloaStore.get(k, true);
            if (raw) out.push(JSON.parse(raw));
          } catch (e) { /* skip bad entry */ }
        }
      } catch (e) { /* ignore */ }
      out.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      if (alive) { setEntries(out); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const counts = entries.reduce((a, e) => { a[e.rating] = (a[e.rating] || 0) + 1; return a; }, {});
  const withNotes = entries.filter((e) => e.suggestion);

  function fmt(ts) {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' +
             d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    } catch (e) { return ts; }
  }

  return (
    <div className="fb-backdrop" onClick={onClose}>
      <div className="fb-card fb-pop" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ ...fbT.title, fontSize: '1.3rem' }}>Feedback collected</h3>
          <button onClick={onClose} aria-label="Close" style={fbT.close}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {loading ? (
          <p className="lede" style={{ margin: '12px 0' }}>Loading…</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, margin: '6px 0 14px' }}>
              <CountPill label="Good"    n={counts.good || 0}    c="var(--coral)"  tint="var(--tint-coral)" />
              <CountPill label="Average" n={counts.average || 0} c="var(--violet)" tint="var(--haze)" />
              <CountPill label="Bad"     n={counts.bad || 0}     c="var(--dusk)"   tint="var(--tint-dusk)" />
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>
              {entries.length} total · {withNotes.length} with notes
            </div>

            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 2 }}>
              {withNotes.length === 0 && (
                <div style={{ textAlign:'center', padding:'22px 8px 14px' }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--haze)', display:'grid', placeItems:'center', margin:'0 auto 14px' }}>
                    <WaveMark h={30} color="var(--ink-soft)" />
                  </div>
                  <p className="lede" style={{ margin:'0 0 4px' }}>No written suggestions yet.</p>
                  <p style={{ margin:0, fontSize:12, color:'var(--ink-soft)' }}>Suggestions from judges will appear here.</p>
                </div>
              )}
              {withNotes.map((e, i) => (
                <div key={i} style={fbT.note}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: e.rating === 'good' ? 'var(--coral)' : e.rating === 'average' ? 'var(--violet)' : 'var(--dusk)' }}>{e.rating}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{fmt(e.timestamp)}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--ink)' }}>{e.suggestion}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CountPill({ label, n, c, tint }) {
  return (
    <div style={{ flex: 1, background: tint, borderRadius: 14, padding: '12px 8px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', lineHeight: 1, color: c }}>{n}</div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-soft)', marginTop: 5 }}>{label}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mount — registers global openers, renders popup + viewer once at app root
// ---------------------------------------------------------------------------
function FeedbackMount() {
  const [pending, setPending] = useFbState(null); // { cb }
  const [viewer, setViewer] = useFbState(false);

  useFbEffect(() => {
    window.openVeloaFeedback = (cb) => setPending({ cb: typeof cb === 'function' ? cb : () => {} });
    window.openVeloaFeedbackViewer = () => setViewer(true);
    return () => { delete window.openVeloaFeedback; delete window.openVeloaFeedbackViewer; };
  }, []);

  return (
    <>
      {pending && (
        <FeedbackPopup onClose={() => { const cb = pending.cb; setPending(null); cb(); }} />
      )}
      {viewer && <FeedbackViewer onClose={() => setViewer(false)} />}
    </>
  );
}

const fbT = {
  title: { fontFamily: 'var(--serif)', fontWeight: 400, color: 'var(--dusk)', fontSize: '1.45rem', lineHeight: 1.25, margin: 0 },
  textarea: {
    width: '100%', resize: 'none', minHeight: 92, padding: '13px 15px', borderRadius: 14,
    border: '1.5px solid var(--line-strong)', background: 'var(--field)', color: 'var(--ink)',
    outline: 'none', lineHeight: 1.5, fontSize: '0.97rem',
  },
  counter: { textAlign: 'right', fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 5 },
  close: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', padding: 6, display: 'grid', placeItems: 'center', borderRadius: 8 },
  note: { background: 'var(--field)', border: '1px solid var(--line)', borderRadius: 14, padding: '12px 14px' },
};

Object.assign(window, { FeedbackMount, veloaStore });
