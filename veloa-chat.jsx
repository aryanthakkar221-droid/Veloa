// veloa-chat.jsx — Screen 3 (the heart)

// Scripted, fake scenarios. Each has matching keywords, a validation reply,
// a coaching phrase, and an anonymized description reused on result screens.
const SCENARIOS = [
  {
    id: 'interrupted',
    keys: ['interrupt', 'talked over', 'spoke over', 'cut off', 'cut me off', "couldn't finish", 'over me'],
    type: 'Unequal speaking time',
    validation: "What you felt is completely valid. Being talked over like that isn't small, and it isn't your fault. Your point deserved the room to land.",
    coach: "Next time, you can calmly say: \u201CI'd like to finish my point before we move on.\u201D",
    anon: "A student shared that during a recent group session, they were repeatedly spoken over and couldn't finish their point. They felt unheard and discouraged. The setting was a small team discussion.",
    setting: 'Small team discussion',
  },
  {
    id: 'ignored',
    keys: ['ignored', 'dismissed', 'idea', 'my suggestion', 'shot down', 'no one listened', 'brushed'],
    type: 'Idea dismissed in group',
    validation: "That sounds genuinely frustrating, and what you felt is valid. Having your idea brushed aside doesn't mean it wasn't good — it means the room didn't make space for it.",
    coach: "Next time, you can gently anchor it: \u201CI'd like to come back to my idea — here's why I think it's worth a look.\u201D",
    anon: "A student shared that in a recent group discussion, their contribution was dismissed without being considered. They felt unheard and discouraged. The setting was a collaborative team session.",
    setting: 'Collaborative team session',
  },
  {
    id: 'excluded',
    keys: ['left out', 'excluded', 'not invited', 'without me', 'on purpose', 'ignored me', 'group chat'],
    type: 'Exclusion from discussion',
    validation: "I'm really glad you told me. Being left out hurts, and what you're feeling is valid. Wanting to be included isn't asking for too much.",
    coach: "Next time, you can name it kindly: \u201CI'd love to be part of these conversations — can you loop me in next time?\u201D",
    anon: "A student shared that they were repeatedly left out of group conversations and planning. They felt excluded and discouraged. The setting was a study group.",
    setting: 'Study group',
  },
  {
    id: 'comment',
    keys: ['unsafe', 'comment', 'uncomfortable', 'remark', 'joke', 'said something', 'inappropriate'],
    type: 'Felt unsafe after a comment',
    validation: "Thank you for trusting me with this. What you felt is completely valid — feeling uncomfortable after a comment like that is a real and important signal, and none of it is your fault.",
    coach: "If it feels safe, you can set a calm boundary: \u201CThat comment didn't sit right with me. I'd like us to keep things respectful.\u201D",
    anon: "A student shared that a comment left them feeling uncomfortable and unsafe in a shared space. They felt unsettled by what was said. The setting was a group environment.",
    setting: 'Shared group space',
    serious: true,
  },
];
const FALLBACK = {
  id: 'general',
  type: 'A difficult moment',
  validation: "Thank you for sharing that with me. What you're feeling is valid, and it took courage to put it into words. I'm here with you.",
  coach: "When you're ready, you can name how you feel simply: \u201CThat didn't feel right to me, and I'd like to talk about it.\u201D",
  anon: "A student shared that a recent interaction left them feeling unheard and discouraged. They described it as difficult to sit with. The setting was a group environment.",
  setting: 'Group setting',
};

const CHIP_SCENARIOS = [
  {
    id: 'meeting-interrupt',
    label: 'I was interrupted again in a meeting',
    type: 'Repeatedly interrupted',
    validation: "That's frustrating \u2014 and it's not in your head. Being repeatedly interrupted is one of the most common ways women's voices get pushed out of rooms. You deserved to finish your point.",
    coach: "I wasn't finished \u2014 I'd like to complete my thought.",
    anon: "A student shared that they were repeatedly interrupted during a meeting and couldn't finish their point. They felt their voice was being pushed aside. The setting was a team meeting.",
    setting: 'Team meeting',
    story: "Hi, I'm Priya. Today in our weekly project meeting in Room S-204, I was presenting our marketing plan. Rahul interrupted me three times \u2014 every time I started explaining, he talked over me and finished my sentences wrong. By the end I just went quiet. Nobody said anything.",
    filtered: { issue:'Repeated interruptions', where:'Weekly project meeting, Room S-204', what:'A team member is repeatedly talked over and cannot finish presenting.', focus:'Remind the group about equal speaking space and letting people finish.' },
  },
  {
    id: 'idea-reattribution',
    label: 'My idea was ignored \u2014 then praised when a man repeated it',
    type: 'Idea re-attribution',
    validation: "What you experienced has a name \u2014 idea re-attribution. It happens to thousands of women, and it is exhausting. Your idea was good. That's exactly why it was repeated.",
    coach: "Glad you agree \u2014 that's the idea I shared earlier. Happy to take it forward.",
    anon: "A student shared that their idea was ignored, then praised when someone else repeated it. They felt overlooked and exhausted. The setting was a group discussion.",
    setting: 'Group discussion',
    story: "I'm Lena. Last Thursday in our research group seminar, I suggested testing our survey with first-semester students. Nobody reacted. Ten minutes later, Jonas said the exact same thing and our supervisor called it 'a great idea, Jonas.' I sat there feeling invisible.",
    filtered: { issue:'Idea re-attribution', where:'Research group seminar, Thursdays', what:"A student's suggestion was ignored, then praised when repeated by someone else.", focus:'Encourage the group to acknowledge ideas the first time they are said.' },
  },
  {
    id: 'sexist-joke',
    label: 'Someone made a sexist joke and everyone laughed',
    type: 'Sexist remark',
    validation: "You don't have to laugh along to keep the peace. Feeling uncomfortable was the right response \u2014 the joke was the problem, not your reaction.",
    coach: "I don't find that funny. Can we move on?",
    anon: "A student shared that a sexist joke was made and others laughed along. They felt uncomfortable and singled out. The setting was a shared group space.",
    setting: 'Shared group space',
    serious: true,
    story: "I'm Mira. Yesterday during lunch break in the student lab, Tim made a joke about how 'women can't read maps or code.' Everyone at the table laughed, including people I thought respected me. I laughed too \u2014 and I hated myself for it.",
    filtered: { issue:'Sexist humour', where:'Student lab, lunch break group', what:'Demeaning jokes about women are being normalised in the group.', focus:'A gentle reset on respectful humour — addressed to everyone, blaming no one.' },
  },
  {
    id: 'leadership-overlooked',
    label: 'I was not considered for a leadership role',
    type: 'Overlooked for leadership',
    validation: "Being overlooked hurts \u2014 especially when you know you were ready. This pattern is real and documented. Your ambition is not the problem.",
    coach: "I'd like to be considered for the next lead role \u2014 here's what I bring.",
    anon: "A student shared that they were not considered for a leadership role despite being ready. They felt overlooked and discouraged. The setting was a team project.",
    setting: 'Team project',
    story: "I'm Anna. Our student council was choosing a team lead for the science fair project. I've organized two events before, but Max was chosen without any discussion \u2014 the coordinator said he 'just seems like a natural leader.' I wasn't even asked if I was interested.",
    filtered: { issue:'Overlooked for leadership', where:'Student council, science fair team', what:'Lead roles are being assigned without open discussion or equal consideration.', focus:'Encourage a fair, transparent selection conversation for team roles.' },
  },
  {
    id: 'pay-gap',
    label: "I found out I'm paid less for the same work",
    type: 'Unequal pay',
    validation: "That discovery is heavy \u2014 and you're allowed to be upset about it. Asking about fair pay is not greedy. It's professional.",
    coach: "I'd like to understand how pay is decided for my role.",
    anon: "A student shared that they discovered they are paid less than others for the same work. They felt undervalued and upset. The setting was a workplace.",
    setting: 'Workplace',
    story: "I'm Sofia. I work as a student assistant in the library. Last week I accidentally saw the hours sheet \u2014 David, who started after me and does the same job, gets paid one pay grade higher. When I asked about it, I was told 'these things are complicated.'",
    filtered: { issue:'Possible pay inequality', where:'Library, student assistant team', what:'Equal work may not be receiving equal pay.', focus:'This topic should be guided toward the supervising office — volunteers do not handle pay matters directly.' },
  },
];

const WELCOME = "Hi, I'm VELOA. Whatever happened \u2014 big or small \u2014 you can tell me. Or pick a situation below to see how I respond.";

function matchScenario(text) {
  const low = text.toLowerCase();
  let best = null, score = 0;
  for (const s of SCENARIOS) {
    const hits = s.keys.filter(k => low.includes(k)).length;
    if (hits > score) { score = hits; best = s; }
  }
  return best || FALLBACK;
}

function Chat() {
  const nav = useNav();
  const t = window.__veloaTweaks || {};
  // If we're returning from a "Go back — don't send" preview screen, restore
  // the previous thread (plus the gentle AI line) instead of starting fresh.
  const [messages, setMessages] = useState(() => {
    const r = window.__veloaResume;
    // Strip the `stream` flag so a restored thread doesn't re-type itself.
    if (r) return r.map(m => ({ from:m.from, text:m.text }));
    return [{ from:'ai', text: WELCOME }];
  });
  const [typing, setTyping] = useState(false);
  const [streaming, setStreaming] = useState(false); // an AI bubble is typing itself out
  const [coach, setCoach] = useState(null);     // coaching card content
  const [showOptions, setShowOptions] = useState(() => !!window.__veloaResume);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const scroller = useRef(null);
  const endRef = useRef(null);
  const tapRef = useRef({ count:0, timer:null });
  const lastScenario = useRef(null);

  const scrollDown = React.useCallback(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, []);

  useEffect(() => { window.__veloaResume = null; }, []);
  useEffect(() => { window.__veloaThread = messages; }, [messages]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, typing, coach, showOptions, streaming]);

  // Hidden team viewer: 5 quick taps on the VELOA logo.
  function brandTap() {
    const r = tapRef.current;
    r.count += 1;
    clearTimeout(r.timer);
    if (r.count >= 5) {
      r.count = 0;
      if (window.openVeloaFeedbackViewer) window.openVeloaFeedbackViewer();
      return;
    }
    r.timer = setTimeout(() => { r.count = 0; }, 800);
  }

  function endConversation() {
    if (window.openVeloaFeedback) window.openVeloaFeedback(() => nav('landing'));
    else nav('landing');
  }

  function send(text, forced) {
    const msg = (text != null ? text : draft).trim();
    if (!msg || typing) return;
    setDraft('');
    setCoach(null);
    setShowOptions(false);
    setMessages(m => [...m, { from:'user', text: msg }]);
    const scenario = forced || matchScenario(msg);
    lastScenario.current = scenario;
    window.__veloaScenario = scenario; // stash for result screens
    window.__veloaUserStory = msg;     // original words, for the filter demo

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      // The validation streams in character by character (see StreamingBubble).
      // Coach + options are scheduled when the stream finishes, so the rhythm
      // follows her actually “hearing” the reply.
      setStreaming(true);
      setMessages(m => [...m, { from:'ai', text: scenario.validation, stream:true }]);
    }, 1150);
  }

  // Called by StreamingBubble once the validation has finished typing out.
  function onValidationDone() {
    setStreaming(false);
    const sc = lastScenario.current || {};
    setTimeout(() => setCoach({ text: sc.coach }), 350);
    setTimeout(() => setShowOptions(true), 1150);
  }

  // Chip tap: brief pulse, then send the full story (300ms pause is intentional).
  function tapChip(c, e) {
    if (typing || streaming) return;
    const el = e.currentTarget;
    el.classList.add('chip-pulse');
    setTimeout(() => { send(c.story || c.label, c); }, 300);
  }

  function copyCoach() {
    const text = (coach && coach.text || '').replace(/[\u201C\u201D]/g,'"');
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="veloa-col" style={{ height:'100vh', height:'100dvh', display:'flex', flexDirection:'column' }}>
      <TopBar onBack={() => nav('landing')} onBrandTap={brandTap} right={
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <button onClick={endConversation} style={endBtnStyle}>End conversation</button>
          <button className="btn btn-ghost" style={{ padding:'9px 14px', fontSize:13 }} onClick={() => nav('dashboard')}>My space</button>
        </div>
      } />

      {/* Companion header */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, paddingBottom:10 }}>
        <Orb size={84} variant={t.orb || 'glow'} speaking={typing || streaming} />
      </div>

      {/* Thread */}
      <div ref={scroller} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:14, padding:'8px 2px 18px' }}>
        {messages.map((m, i) => m.stream
          ? <StreamingBubble key={i} text={m.text} onDone={onValidationDone} onProgress={scrollDown} />
          : <Bubble key={i} from={m.from}>{m.text}</Bubble>)}

        {typing && <TypingBubble />}

        {coach && <CoachCard text={coach.text} onCopy={copyCoach} copied={copied} />}

        {showOptions && <OptionsBlock nav={nav} />}
        <div ref={endRef} />
      </div>

      {/* Input */}
      {!showOptions && (
        <div style={{ paddingBottom:'calc(14px + env(safe-area-inset-bottom))', paddingTop:6 }}>
          {messages.length <= 1 && !typing && (
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
              {CHIP_SCENARIOS.map(c => (
                <button key={c.id} onClick={(e) => tapChip(c, e)} className="starter-chip" style={chipStyle}>{c.label}</button>
              ))}
            </div>
          )}
          <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder="Tell me what happened…"
              style={taStyle}
            />
            <button className="btn btn-violet" onClick={() => send()} aria-label="Send" style={{ padding:0, width:50, height:50, borderRadius:'50%', flexShrink:0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-7-7 16-2-7-7-2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Bubble({ from, children }) {
  const ai = from === 'ai';
  return (
    <div className="fade-up" style={{ display:'flex', justifyContent: ai ? 'flex-start' : 'flex-end' }}>
      <div style={{
        maxWidth:'82%', padding:'13px 17px', lineHeight:1.55, fontSize:'0.99rem', overflowWrap:'break-word',
        borderRadius: ai ? '4px 20px 20px 20px' : '20px 4px 20px 20px',
        background: ai ? 'var(--card)' : 'var(--violet)',
        color: ai ? 'var(--ink)' : '#fff',
        boxShadow: ai ? 'var(--shadow-soft)' : '0 8px 20px -10px rgba(83,74,183,0.6)',
        border: ai ? '1px solid var(--line)' : 'none',
      }}>{children}</div>
    </div>
  );
}

// An AI bubble that types itself out, with a blinking violet caret after the
// last character that disappears when the text is complete.
function StreamingBubble({ text, onDone, onProgress }) {
  const [n, setN] = useState(0);
  const fired = useRef(false);
  useEffect(() => {
    if (n >= text.length) {
      if (!fired.current) { fired.current = true; onDone && onDone(); }
      return;
    }
    const id = setTimeout(() => { setN(n + 1); onProgress && onProgress(); }, 22);
    return () => clearTimeout(id);
  }, [n, text]);
  const done = n >= text.length;
  return (
    <Bubble from="ai">
      {text.slice(0, n)}
      {!done && <span className="stream-caret" aria-hidden="true" />}
    </Bubble>
  );
}

function TypingBubble() {
  return (
    <div className="fade-up" style={{ display:'flex', justifyContent:'flex-start' }}>
      <div style={{ padding:'15px 18px', borderRadius:'4px 20px 20px 20px', background:'var(--card)', boxShadow:'var(--shadow-soft)', display:'flex', gap:6 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{ width:8, height:8, borderRadius:'50%', background:'var(--violet-soft)', animation:`typedot 1.2s ease-in-out ${i*0.18}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes typedot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}`}</style>
    </div>
  );
}

function CoachCard({ text, onCopy, copied }) {
  return (
    <div className="coach-card" style={{
      borderLeft:'4px solid var(--coral)', background:'var(--card)', borderRadius:'6px 18px 18px 6px',
      padding:'15px 18px', boxShadow:'var(--shadow-soft)', maxWidth:'90%',
      display:'flex', flexDirection:'column', gap:10,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2A7 7 0 0012 2z" stroke="#D85A30" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/></svg>
        <span style={{ fontSize:11.5, fontWeight:700, letterSpacing:'0.1em', color:'var(--coral)' }}>TRY THIS NEXT TIME</span>
      </div>
      <p className="serif" style={{ margin:0, fontStyle:'italic', fontSize:'1.12rem', lineHeight:1.5, color:'var(--dusk)' }}>{text}</p>
      <button onClick={onCopy} style={{
        alignSelf:'flex-start', display:'flex', alignItems:'center', gap:6, background:'none', border:'none',
        cursor:'pointer', color:'var(--coral)', fontSize:13, fontWeight:600, fontFamily:'var(--sans)', padding:0,
      }}>
        {copied
          ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#D85A30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>Copied</>
          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke="#D85A30" strokeWidth="1.6"/><path d="M5 15V5a2 2 0 012-2h10" stroke="#D85A30" strokeWidth="1.6"/></svg>Copy</>}
      </button>
    </div>
  );
}

function OptionsBlock({ nav }) {
  return (
    <div className="fade-up" style={{ display:'flex', flexDirection:'column', gap:13, marginTop:8 }}>
      <p className="serif" style={{ fontStyle:'italic', color:'var(--ink-soft)', textAlign:'center', margin:'2px 0 4px', fontSize:'1.04rem' }}>
        Whenever you're ready, you can choose what happens next. There's no rush.
      </p>
      <OptionCard tone="violet" title="Keep this private" desc="Just for you. No one else sees this." onClick={() => nav('private')} />
      <OptionCard tone="coral" highlight title="Share with a volunteer" desc="A trained, neutral person helps make the room fairer — your name and the other person's name are never shared." onClick={() => nav('volunteer-preview')} />
      <OptionCard tone="dusk" title="Tell the administration" desc="For serious matters. The university handles this through its official process." onClick={() => nav('authority-preview')} />
    </div>
  );
}

function OptionCard({ tone, title, desc, onClick, highlight }) {
  const accent = { violet:'var(--violet)', coral:'var(--coral)', dusk:'var(--dusk)' }[tone];
  return (
    <button onClick={onClick} style={{
      textAlign:'left', cursor:'pointer', width:'100%', display:'flex', alignItems:'center', gap:14,
      padding:'16px 18px', borderRadius:18, fontFamily:'var(--sans)',
      background: highlight ? 'var(--card)' : 'var(--card)',
      border: highlight ? '1.5px solid rgba(216,90,48,0.4)' : '1px solid var(--line)',
      boxShadow: highlight ? '0 14px 34px -16px rgba(216,90,48,0.5)' : 'var(--shadow-soft)',
      transition:'transform .2s, box-shadow .2s',
    }}
    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
    onMouseLeave={e=>e.currentTarget.style.transform='none'}>
      <span style={{ width:10, height:10, borderRadius:'50%', background:accent, flexShrink:0, boxShadow:`0 0 0 5px ${accent}1f` }} />
      <span style={{ flex:1 }}>
        <span style={{ display:'block', fontWeight:600, fontSize:'1.02rem', color: tone==='dusk'?'var(--dusk)':accent, marginBottom:3 }}>{title}</span>
        <span style={{ display:'block', fontSize:13.2, color:'var(--ink-soft)', lineHeight:1.45 }}>{desc}</span>
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
}

const chipStyle = {
  width:'100%', textAlign:'left', padding:'13px 16px', borderRadius:14,
  border:'1.5px solid transparent', background:'var(--haze)', color:'var(--violet)',
  fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'var(--sans)', lineHeight:1.4,
  transition:'border-color .18s ease, transform .18s ease, box-shadow .18s ease',
};
const endBtnStyle = {
  background:'none', border:'none', cursor:'pointer', color:'var(--ink-soft)',
  fontFamily:'var(--sans)', fontSize:12.5, fontWeight:500, padding:'8px 6px', whiteSpace:'nowrap',
};
const taStyle = {
  flex:1, resize:'none', padding:'14px 18px', borderRadius:26, border:'1.5px solid var(--line-strong)',
  background:'var(--card)', color:'var(--ink)', outline:'none', maxHeight:120, lineHeight:1.4, boxShadow:'var(--shadow-soft)',
};

window.Chat = Chat;
