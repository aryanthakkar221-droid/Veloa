// veloa-app.jsx — router + tweaks + shell
const { useState: useS } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "orb": "glow",
  "scale": 1,
  "radius": 22,
  "flourish": true,
  "titleFont": "Georgia",
  "transition": "elevate"
}/*EDITMODE-END*/;

const BUILT = {
  landing: Landing, login: Login, chat: Chat,
  'volunteer-preview': VolunteerPreview, 'authority-preview': AuthorityPreview,
  'private': PrivateResult, 'volunteer-sent': VolunteerSent, 'authority-sent': AuthoritySent,
  dashboard: Dashboard, volunteer: VolunteerPortal, admin: AdminDashboard, settings: Settings,
};

function ComingNext({ name, nav }) {
  const labels = {
    'private': 'Result · Kept private',
    'volunteer-sent': 'Result · Sent to a volunteer',
    'authority-sent': 'Result · Sent to administration',
    'dashboard': 'Your personal dashboard',
    'volunteer': 'Volunteer portal',
    'admin': 'Administration dashboard',
    'settings': 'Privacy & data controls',
  };
  return (
    <div className="veloa-col fade-up" style={{ alignItems:'center', justifyContent:'center', textAlign:'center' }}>
      <TopBar onBack={() => nav('chat')} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:22 }}>
        <Orb size={92} variant={(window.__veloaTweaks||{}).orb || 'glow'} />
        <div>
          <h2 style={{ fontSize:'1.7rem', margin:'0 0 8px' }}>{labels[name] || name}</h2>
          <p className="lede" style={{ maxWidth:340, margin:'0 auto' }}>
            This screen is next in the build. The flow up to here works — choose a path in chat to see how it routes.
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => nav('chat')}>Back to chat</button>
      </div>
    </div>
  );
}

function DemoNav({ nav, current }) {
  const [open, setOpen] = useState(false);
  const groups = [
    { label:'Her journey', items:[['landing','Landing'],['login','Login'],['chat','Chat companion'],['dashboard','My dashboard'],['settings','Privacy & settings']] },
    { label:'Results', items:[['private','Kept private'],['volunteer-sent','Sent to volunteer'],['authority-sent','Sent to administration']] },
    { label:'Other roles', items:[['volunteer','Volunteer portal'],['admin','Administration']] },
  ];
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Browse screens" style={{
        position:'fixed', left:16, bottom:'calc(16px + env(safe-area-inset-bottom))', zIndex:40,
        height:42, padding:'0 16px', borderRadius:999, border:'1px solid var(--line-strong)',
        background:'var(--glass)', backdropFilter:'blur(8px)', cursor:'pointer',
        display:'flex', alignItems:'center', gap:8, boxShadow:'var(--shadow-soft)',
        color:'var(--dusk)', fontFamily:'var(--sans)', fontSize:13.5, fontWeight:600 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="3" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7"/><rect x="3" y="14" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="14" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7"/></svg>
        Screens
      </button>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(38,33,92,0.32)', display:'flex', alignItems:'flex-end', justifyContent:'center' }} className="fade-up">
          <div onClick={e=>e.stopPropagation()} style={{ width:'100%', maxWidth:540, background:'var(--warm)', borderRadius:'24px 24px 0 0', padding:'10px 20px calc(24px + env(safe-area-inset-bottom))', maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ width:42, height:5, borderRadius:3, background:'var(--line-strong)', margin:'8px auto 16px' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span className="wordmark" style={{ fontSize:15 }}>VELOA</span>
              <span style={{ fontSize:12.5, color:'var(--ink-soft)' }}>Prototype · fake data</span>
            </div>
            {groups.map(g => (
              <div key={g.label} style={{ marginTop:14 }}>
                <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'0.08em', color:'var(--ink-soft)', textTransform:'uppercase', margin:'0 2px 8px' }}>{g.label}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {g.items.map(([id,label]) => (
                    <button key={id} onClick={() => { nav(id); setOpen(false); }} style={{
                      padding:'9px 14px', borderRadius:999, cursor:'pointer', fontFamily:'var(--sans)', fontSize:13.5, fontWeight:500,
                      border:`1px solid ${current===id?'var(--violet)':'var(--line-strong)'}`,
                      background: current===id ? 'var(--violet)' : 'var(--card)',
                      color: current===id ? '#fff' : 'var(--dusk)' }}>{label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function ThemeToggle({ dark, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle dark mode" style={{
      position:'fixed', right:16, bottom:'calc(16px + env(safe-area-inset-bottom))', zIndex:40,
      width:46, height:46, borderRadius:'50%', border:'1px solid var(--line-strong)',
      background:'var(--glass)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', cursor:'pointer',
      display:'grid', placeItems:'center', boxShadow:'var(--shadow-soft)', color:'var(--dusk)' }}>
      {dark
        ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 14.5A8 8 0 119.5 4 6.3 6.3 0 0020 14.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>}
    </button>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useS('landing');
  window.__veloaTweaks = t;
  const dark = t.theme === 'dark';
  React.useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', dark);
  }, [dark]);

  const nav = (s) => { setScreen(s); if (screen !== s) window.scrollTo(0,0); };

  const Screen = BUILT[screen];
  const serif = t.titleFont === 'Spectral' ? "'Spectral', Georgia, serif" : "Georgia, 'Spectral', serif";

  return (
    <NavContext.Provider value={nav}>
      <div className={'veloa-stage' + (t.flourish ? '' : ' flourish-off') + (dark ? ' theme-dark' : '')}
        style={{ '--scale': t.scale, '--radius': t.radius + 'px', '--serif': serif }}>
        <div className="veloa-shapes" aria-hidden="true"><span/><span/><span/></div>
        <div key={screen} className={'screen-frame tx-' + (t.transition || 'elevate')}>
          {Screen ? <Screen /> : <ComingNext name={screen} nav={nav} />}
        </div>
        <DemoNav nav={nav} current={screen} />
        <ThemeToggle dark={dark} onToggle={() => setTweak('theme', dark ? 'light' : 'dark')} />
        <FeedbackMount />
      </div>

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme} options={['light','dark']}
          onChange={v => setTweak('theme', v)} />
        <TweakSection label="Companion orb" />
        <TweakRadio label="Style" value={t.orb} options={['glow','sunrise','rings']}
          onChange={v => setTweak('orb', v)} />
        <TweakSection label="Feel" />
        <TweakRadio label="Screen transition" value={t.transition} options={['elevate','fade','slide']}
          onChange={v => setTweak('transition', v)} />
        <TweakToggle label="Floating shapes" value={t.flourish} onChange={v => setTweak('flourish', v)} />
        <TweakSlider label="Corner softness" value={t.radius} min={10} max={30} step={2} unit="px"
          onChange={v => setTweak('radius', v)} />
        <TweakSection label="Typography" />
        <TweakRadio label="Title font" value={t.titleFont} options={['Georgia','Spectral']}
          onChange={v => setTweak('titleFont', v)} />
        <TweakSlider label="Text size" value={t.scale} min={0.9} max={1.2} step={0.05}
          onChange={v => setTweak('scale', v)} />
      </TweaksPanel>
    </NavContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
