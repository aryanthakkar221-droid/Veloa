// veloa-landing.jsx — Screen 1
function Landing() {
  const nav = useNav();
  const t = window.__veloaTweaks || {};
  return (
    <div className="veloa-col fade-up" style={{ paddingBottom: 40 }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:30, padding:'48px 0 8px' }}>
        <VeloaLogo size={1.2} />

        <div style={{ maxWidth: 460, display:'flex', flexDirection:'column', gap:18 }}>
          <h1 className="display">A safe place<br/>for your voice.</h1>
          <p className="lede" style={{ margin:0 }}>
            Whatever happened, it matters. Start by simply talking — at your pace, in your words.
          </p>
          <p className="lede" style={{ margin:0, color:'var(--violet)', fontWeight:500 }}>
            You stay in control of your story, always.
          </p>
        </div>

        <div style={{ width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:14, marginTop:6 }}>
          <button className="btn btn-violet btn-block" onClick={() => nav('login')}>
            Get started
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <p className="tag-line" style={{ margin:'4px 0 0', fontSize:'1.02rem' }}>
            Your story. Your voice. Your VELOA.
          </p>
        </div>
      </div>

      <div style={{ textAlign:'center', paddingTop:18 }}>
        <span style={{ fontSize:13, color:'var(--ink-soft)', opacity:0.8 }}>
          Built by Team <span style={{ fontFamily:'var(--serif)', fontStyle:'italic' }}>Stimme of Change</span>
        </span>
      </div>
    </div>
  );
}
window.Landing = Landing;
