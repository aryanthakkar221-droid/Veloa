// veloa-login.jsx — Screen 2
function Login() {
  const nav = useNav();
  const t = window.__veloaTweaks || {};
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    'Connecting to your university…',
    'Verifying you safely…',
    "You're in.",
  ];

  function signIn(e) {
    e.preventDefault();
    setVerifying(true);
  }

  useEffect(() => {
    if (!verifying) return;
    if (step < steps.length - 1) {
      const id = setTimeout(() => setStep(step + 1), step === 0 ? 850 : 750);
      return () => clearTimeout(id);
    }
    const done = setTimeout(() => nav('chat'), 850);
    return () => clearTimeout(done);
  }, [verifying, step]);

  if (verifying) {
    return (
      <div className="veloa-col" style={{ alignItems:'center', justifyContent:'center', textAlign:'center' }}>
        <div className="fade-up" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:38 }}>
          <SealAnimation done={step >= steps.length - 1} />
          <div style={{ position:'relative', height:'2.2em', width:'min(86vw,360px)' }}>
            {steps.map((s, i) => (
              <span key={i} className="serif" style={{
                position:'absolute', left:0, right:0, top:0, textAlign:'center',
                fontStyle:'italic', fontSize:'1.28rem', color:'var(--dusk)', lineHeight:1.35,
                opacity: i === step ? 1 : 0,
                transform: i === step ? 'translateY(0)' : (i < step ? 'translateY(-8px)' : 'translateY(8px)'),
                transition:'opacity .55s ease, transform .55s ease',
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="veloa-col fade-up" style={{ paddingBottom: 40 }}>
      <TopBar onBack={() => nav('landing')} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:26, paddingBottom:20 }}>
        <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:18 }}>
          <VeloaLogo size={0.74} />
          <p className="tag-line" style={{ fontSize:'1.32rem', margin:0, maxWidth:380, lineHeight:1.4 }}>
            Welcome. This is your space — private and yours.
          </p>
        </div>

        <form className="card" onSubmit={signIn} style={{ padding:'26px 22px', display:'flex', flexDirection:'column', gap:16 }}>
          <Field label="University email">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@university.edu" style={inp} />
          </Field>
          <Field label="Password">
            <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" style={inp} />
          </Field>
          <button type="submit" className="btn btn-violet btn-block" style={{ marginTop:6 }}>Sign in</button>
        </form>

        <div style={{ display:'flex', gap:11, alignItems:'flex-start', padding:'0 6px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 2l7 3v6c0 4.5-3 8.3-7 9-4-0.7-7-4.5-7-9V5l7-3z" stroke="#534AB7" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#534AB7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <p style={{ margin:0, fontSize:13.5, color:'var(--ink-soft)', lineHeight:1.55 }}>
            VELOA verifies that you belong here — but it never sees who you are. Your identity stays sealed.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display:'flex', flexDirection:'column', gap:7 }}>
      <span style={{ fontSize:13.5, fontWeight:600, color:'var(--dusk)' }}>{label}</span>
      {children}
    </label>
  );
}
const inp = {
  width:'100%', padding:'14px 16px', borderRadius:14, border:'1.5px solid var(--line-strong)',
  background:'var(--field)', color:'var(--ink)', outline:'none', transition:'border .2s',
};

// Creative post-login animation: the VELOA voice-wave draws itself and the
// coral dot travels along it, wrapped in a progress ring that "seals" shut.
function SealAnimation({ done }) {
  const WAVE = "M30 76 C46 62 58 90 74 82 C90 74 98 62 112 68";
  return (
    <div className="seal">
      <span className="seal-ripple" />
      <span className="seal-ripple seal-ripple-2" />
      <svg viewBox="0 0 140 140" width="186" height="186" fill="none">
        <circle className="seal-track" cx="70" cy="70" r="58" />
        <circle className="seal-prog" cx="70" cy="70" r="58" />
        <path className="seal-wave" d={WAVE} />
        <circle cx="112" cy="68" r="4.2" className="seal-dot-fill">
          <animateMotion dur="1.15s" begin="0.15s" fill="freeze" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" path={WAVE} />
        </circle>
        <g className={'seal-check' + (done ? ' on' : '')}>
          <circle cx="70" cy="70" r="17" className="seal-check-bg" />
          <path d="M62 70l6 6 11-12" className="seal-check-mark" />
        </g>
      </svg>
      <style>{`
        .seal { position:relative; width:186px; height:186px; display:grid; place-items:center; }
        .seal-track { stroke:var(--line); stroke-width:4; }
        .seal-prog {
          stroke:var(--violet); stroke-width:4; stroke-linecap:round;
          stroke-dasharray:365; stroke-dashoffset:365;
          transform:rotate(-90deg); transform-origin:70px 70px;
          animation:sealFill 2.35s cubic-bezier(.5,0,.2,1) forwards;
        }
        @keyframes sealFill { to { stroke-dashoffset:0; } }
        .seal-wave {
          stroke:var(--violet-soft); stroke-width:3; stroke-linecap:round; stroke-linejoin:round;
          stroke-dasharray:210; stroke-dashoffset:210;
          animation:sealDraw 1.15s ease .15s forwards;
        }
        @keyframes sealDraw { to { stroke-dashoffset:0; } }
        .seal-dot-fill { fill:var(--coral); filter:drop-shadow(0 0 5px rgba(216,90,48,.55)); }
        .seal-ripple {
          position:absolute; width:120px; height:120px; border-radius:50%;
          border:1.5px solid var(--violet); opacity:0;
          animation:sealRipple 2.4s ease-out infinite;
        }
        .seal-ripple-2 { animation-delay:1.2s; }
        @keyframes sealRipple {
          0% { transform:scale(.62); opacity:.45; }
          100% { transform:scale(1.5); opacity:0; }
        }
        .seal-check { opacity:0; transform:scale(.4); transform-origin:70px 70px; transition:opacity .4s ease, transform .45s cubic-bezier(.3,.8,.3,1.4); }
        .seal-check.on { opacity:1; transform:scale(1); }
        .seal-check-bg { fill:var(--violet); }
        .seal-check-mark { fill:none; stroke:#fff; stroke-width:3; stroke-linecap:round; stroke-linejoin:round; }
      `}</style>
    </div>
  );
}
window.SealAnimation = SealAnimation;
window.Login = Login;
