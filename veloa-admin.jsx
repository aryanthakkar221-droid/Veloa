// veloa-admin.jsx — Administration Portal: home with 3 entry cards,
// one full-screen view at a time (Complaints / Monthly / Yearly).

// ---------- Incoming complaints (content unchanged) ----------
const ADMIN_INBOX = [
  { id:1, from:'VL-3D77-KN08 (anonymous verified student)', issue:'Possible pay inequality', where:'Library, student assistant team',
    what:'Equal work may not be receiving equal pay.', time:'Today, 08:12', status:'New' },
  { id:2, from:'Anna M.', named:true, issue:'Overlooked for leadership', where:'Student council, science fair team',
    what:'Lead roles are being assigned without open discussion or equal consideration.', time:'Yesterday, 16:40', status:'In review' },
  { id:3, from:'VL-9Q08-TT54 (anonymous verified student)', issue:'Sexist humour', where:'Student lab, lunch break group',
    what:'Demeaning jokes about women are being normalised in the group.', time:'May 27, 10:05', status:'Resolved' },
];

function AdminInboxCard({ r }) {
  const statusTone = r.status === 'New' ? 'coral' : r.status === 'In review' ? 'violet' : 'grey';
  return (
    <div className="card" style={{ padding:'16px 18px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, flexWrap:'wrap', marginBottom:12 }}>
        <div>
          <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'0.1em', color:'var(--ink-soft)', textTransform:'uppercase', marginBottom:3 }}>From</div>
          <div style={{ fontWeight:600, color:'var(--dusk)', fontSize:'0.95rem' }}>{r.from}</div>
        </div>
        {r.named && <span style={{ background:'var(--coral)', color:'#fff', fontSize:10.5, fontWeight:700, padding:'4px 10px', borderRadius:999, whiteSpace:'nowrap' }}>Name shared by choice</span>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <FilteredRow label="Issue" value={r.issue} />
        <FilteredRow label="Where" value={r.where} />
        <FilteredRow label="What's happening" value={r.what} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:13 }}>
        <span style={{ fontSize:12, color:'var(--ink-soft)' }}>{r.time}</span>
        <Tag tone={statusTone}>{r.status}</Tag>
      </div>
    </div>
  );
}

// ---------- Shared admin pieces ----------
function AdminStyles() {
  return (
    <style>{`
      .admin-entry-grid { display:grid; gap:12px; }
      @media (min-width:600px){ .admin-entry-grid { grid-template-columns:repeat(3,1fr); } }
      .admin-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      @media (min-width:600px){ .admin-stat-grid { grid-template-columns:repeat(4,1fr); } }
    `}</style>
  );
}

function ChartCard({ title, sub, children }) {
  return (
    <div className="card" style={{ padding:'18px' }}>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontWeight:600, color:'var(--dusk)', fontSize:'1rem' }}>{title}</div>
        {sub && <div style={{ fontSize:12.5, color:'var(--ink-soft)', marginTop:2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function AdminStat({ value, label, delta }) {
  return (
    <div className="card" style={{ padding:'14px 13px', borderRadius:14 }}>
      <div className="serif" style={{ fontSize:'1.55rem', color:'var(--dusk)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, fontWeight:600, color:'var(--ink-soft)', marginTop:6, lineHeight:1.3 }}>{label}</div>
      {delta && <div style={{ fontSize:10, fontWeight:700, color:'var(--green-fg)', marginTop:4 }}>{delta}</div>}
    </div>
  );
}

function AdminViewShell({ onBack, title, subtitle, children }) {
  return (
    <div className="veloa-col fade-up" style={{ paddingBottom:40 }}>
      <AdminStyles />
      <TopBar onBack={onBack} />
      <div style={{ margin:'2px 0 18px' }}>
        <h1 style={{ fontSize:'1.55rem', margin:'0 0 6px' }}>{title}</h1>
        {subtitle && <p style={{ margin:0, fontSize:13, color:'var(--ink-soft)', lineHeight:1.5 }}>{subtitle}</p>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>{children}</div>
    </div>
  );
}

// ---------- Home ----------
function AdminEntryIcon({ kind }) {
  const c = 'var(--violet)';
  return (
    <span style={{ width:44, height:44, borderRadius:14, background:'var(--haze)', display:'grid', placeItems:'center', flexShrink:0 }}>
      {kind === 'inbox' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 13l2.2-7h11.6L20 13v6H4v-6z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"></path><path d="M4 13h4.5l1.5 2.6h4L15.5 13H20" stroke={c} strokeWidth="1.7" strokeLinejoin="round"></path></svg>}
      {kind === 'pie' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.2" stroke={c} strokeWidth="1.7"></circle><path d="M12 3.8V12h8.2" stroke={c} strokeWidth="1.7" strokeLinecap="round"></path></svg>}
      {kind === 'trend' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3.5 17.5l5.5-5.5 3.6 3.6 7-8" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.5 7.6h4.1v4.1" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
    </span>
  );
}

function AdminEntryCard({ onClick, icon, title, desc, badge, badgeTone }) {
  return (
    <button className="card" onClick={onClick} style={{
      textAlign:'left', cursor:'pointer', padding:'18px', display:'flex', flexDirection:'column',
      alignItems:'flex-start', gap:13, fontFamily:'var(--sans)', border:'1px solid var(--line)',
      transition:'transform .2s, box-shadow .2s' }}
      onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
      onMouseLeave={e=>e.currentTarget.style.transform='none'}>
      <AdminEntryIcon kind={icon} />
      <span>
        <span style={{ display:'block', fontWeight:700, color:'var(--dusk)', fontSize:'1.05rem', marginBottom:4 }}>{title}</span>
        <span style={{ display:'block', fontSize:13, color:'var(--ink-soft)', lineHeight:1.45 }}>{desc}</span>
      </span>
      {badgeTone === 'coral'
        ? <span style={{ background:'var(--coral)', color:'#fff', fontSize:11, fontWeight:700, padding:'4px 11px', borderRadius:999 }}>{badge}</span>
        : <span style={{ background:'var(--haze)', color:'var(--violet)', fontSize:11, fontWeight:600, padding:'4px 11px', borderRadius:999 }}>{badge}</span>}
    </button>
  );
}

function AdminHome({ nav, setView }) {
  return (
    <div className="veloa-col fade-up" style={{ paddingBottom:40 }}>
      <AdminStyles />
      <TopBar onBack={() => nav('chat')} />
      <div style={{ margin:'4px 0 20px' }}>
        <h1 style={{ fontSize:'1.9rem', margin:'0 0 5px' }}>Administration Portal</h1>
        <p className="serif" style={{ fontStyle:'italic', color:'var(--ink-soft)', margin:0, fontSize:'1.08rem' }}>Anonymous patterns. Real decisions.</p>
      </div>
      <div className="admin-entry-grid">
        <AdminEntryCard onClick={() => setView('inbox')} icon="inbox" title="Incoming Complaints"
          desc="Reports students chose to send you." badge="3 new" badgeTone="coral" />
        <AdminEntryCard onClick={() => setView('month')} icon="pie" title="Monthly Report"
          desc="What campus lived through this month." badge="June 2026" />
        <AdminEntryCard onClick={() => setView('year')} icon="trend" title="Yearly Report"
          desc="The honest mirror — one year of patterns." badge="2025/26" />
      </div>
    </div>
  );
}

// ---------- View 1 — Incoming Complaints ----------
function AdminInboxView({ onBack }) {
  return (
    <AdminViewShell onBack={onBack} title="Incoming Complaints"
      subtitle="Reports arrive anonymous by default. Names appear only when the student chooses to share them.">
      {ADMIN_INBOX.map(r => <AdminInboxCard key={r.id} r={r} />)}
    </AdminViewShell>
  );
}

// ---------- View 2 — Monthly Report ----------
const MR_STATS = [
  { value:'47', label:'Signals shared', delta:'\u2191 12% vs May' },
  { value:'31', label:'Resolved privately' },
  { value:'11', label:'Volunteer sessions held' },
  { value:'5', label:'Escalated to administration' },
];
const MR_ISSUES = [
  { label:'Repeated interruptions', value:34, color:'var(--violet)' },
  { label:'Idea re-attribution', value:26, color:'var(--coral)' },
  { label:'Sexist humour', value:18, color:'var(--dusk)' },
  { label:'Leadership selection', value:13, color:'#AFA9EC' },
  { label:'Pay inequality', value:9, color:'var(--haze-deep)' },
];
const MR_WHERE = [
  { label:'Group meetings', v:38 },
  { label:'Seminars', v:24 },
  { label:'Labs', v:16 },
  { label:'Student council', v:12 },
  { label:'Workplaces', v:10 },
];

function AdminHBar({ rows, color }) {
  const max = Math.max(...rows.map(r => r.v));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
      {rows.map((r, i) => (
        <div key={i}>
          <div style={{ display:'flex', justifyContent:'space-between', gap:10, fontSize:12.5, marginBottom:4 }}>
            <span style={{ color:'var(--ink)' }}>{r.label}</span>
            <span style={{ color:'var(--ink-soft)', fontWeight:600 }}>{r.v}%</span>
          </div>
          <div style={{ height:8, borderRadius:999, background:'var(--haze)' }}>
            <div style={{ width:(r.v / max * 100) + '%', height:'100%', borderRadius:999, background:color || 'var(--violet)' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminMonthlyView({ onBack }) {
  return (
    <AdminViewShell onBack={onBack} title="Monthly Report — June 2026"
      subtitle="All data is anonymous and pattern-based. No individuals are identified.">
      <div className="admin-stat-grid">
        {MR_STATS.map((s, i) => <AdminStat key={i} {...s} />)}
      </div>

      <ChartCard title="Issues this month" sub="Share of all signals, by pattern.">
        <Donut segments={MR_ISSUES} center={{ value:'47', label:'SIGNALS' }} />
      </ChartCard>

      <ChartCard title="Where it happens" sub="Settings the signals point to.">
        <AdminHBar rows={MR_WHERE} />
      </ChartCard>

      <ChartCard title="Signals per week" sub="How June built up, week by week.">
        <AreaLine data={[9, 13, 11, 14]} labels={['Week 1','Week 2','Week 3','Week 4']} id="mr-weeks" color="var(--violet)" height={140} />
      </ChartCard>

      <div className="card" style={{ padding:'16px 18px', borderLeft:'4px solid var(--coral)' }}>
        <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'0.08em', color:'var(--coral)', textTransform:'uppercase', marginBottom:8 }}>Trending this month</div>
        <p style={{ margin:0, fontSize:'0.96rem', color:'var(--ink)', lineHeight:1.55 }}>
          Repeated interruptions in group meetings. Suggested workshop: <span style={{ fontWeight:600, color:'var(--dusk)' }}>“Equal voice in team meetings”</span> — recommended for week 1 of July.
        </p>
      </div>

      <p className="serif" style={{ margin:'2px 4px 0', fontStyle:'italic', fontSize:12.5, color:'var(--ink-soft)', lineHeight:1.5 }}>
        Generated by VELOA pattern intelligence — reviewed by humans before any action.
      </p>
    </AdminViewShell>
  );
}

// ---------- View 3 — Yearly Report ----------
const YR_STATS = [
  { value:'412', label:'Total signals this year' },
  { value:'68%', label:'Resolved without escalation' },
  { value:'94', label:'Volunteer sessions' },
  { value:'+22%', label:'Students reporting feeling heard', delta:'vs last year' },
];
const YR_MONTHS = [28, 35, 22, 41, 44, 39, 37, 42, 47, 31, 19, 27];
const YR_LABELS = ['O','N','D','J','F','M','A','M','J','J','A','S'];
const YR_CHOICES = [
  { label:'Kept private', value:52, color:'var(--violet)' },
  { label:'Volunteer', value:33, color:'var(--coral)' },
  { label:'Administration', value:15, color:'#AFA9EC' },
];
const YR_SEMESTER = [
  { label:'Repeated interruptions', winter:38, summer:31 },
  { label:'Idea re-attribution', winter:26, summer:29 },
  { label:'Sexist humour', winter:18, summer:14 },
  { label:'Leadership selection', winter:12, summer:16 },
  { label:'Pay inequality', winter:9, summer:11 },
];
const YR_CLIMATE = [
  { label:'\u201CI feel safe sharing concerns\u201D', now:74, was:58 },
  { label:'\u201CMy ideas are heard in groups\u201D', now:61, was:49 },
  { label:'\u201CI know where to get support\u201D', now:82, was:60 },
];

function AdminSemesterBars({ rows }) {
  const max = Math.max(...rows.map(r => Math.max(r.winter, r.summer)));
  const bar = (v, color) => (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:7, borderRadius:999, background:'var(--haze)' }}>
        <div style={{ width:(v / max * 100) + '%', height:'100%', borderRadius:999, background:color }}></div>
      </div>
      <span style={{ fontSize:10.5, color:'var(--ink-soft)', fontWeight:600, width:20, textAlign:'right' }}>{v}</span>
    </div>
  );
  return (
    <div>
      <div style={{ display:'flex', gap:16, marginBottom:14, fontSize:12 }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--ink)' }}><span style={{ width:10, height:10, borderRadius:3, background:'var(--violet)' }}></span>Winter</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--ink)' }}><span style={{ width:10, height:10, borderRadius:3, background:'var(--coral)' }}></span>Summer</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
        {rows.map((r, i) => (
          <div key={i}>
            <div style={{ fontSize:12.5, color:'var(--ink)', marginBottom:5 }}>{r.label}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
              {bar(r.winter, 'var(--violet)')}
              {bar(r.summer, 'var(--coral)')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminClimateBar({ label, now, was }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', gap:10, fontSize:12.5, marginBottom:5 }}>
        <span style={{ color:'var(--ink)' }}>{label}</span>
        <span style={{ fontWeight:700, color:'var(--dusk)' }}>{now}%</span>
      </div>
      <div style={{ height:9, borderRadius:999, background:'var(--haze)' }}>
        <div style={{ width:now + '%', height:'100%', borderRadius:999, background:'var(--violet)' }}></div>
      </div>
      <div style={{ fontSize:10.5, fontWeight:600, color:'var(--green-fg)', marginTop:4 }}>up from {was}%</div>
    </div>
  );
}

function AdminYearlyView({ onBack }) {
  return (
    <AdminViewShell onBack={onBack} title="Yearly Report — 2025/26" subtitle="Not to punish. To heal.">
      <div className="admin-stat-grid">
        {YR_STATS.map((s, i) => <AdminStat key={i} {...s} />)}
      </div>

      <ChartCard title="Signals across the year" sub="October to September — the peak month is marked.">
        <AreaLine data={YR_MONTHS} labels={YR_LABELS} id="yr-months" color="var(--violet)" peakColor="var(--coral)" height={150} />
      </ChartCard>

      <ChartCard title="How students chose to act" sub="Every signal stayed in the student's control.">
        <Donut segments={YR_CHOICES} center={{ value:'412', label:'SIGNALS' }} />
      </ChartCard>

      <ChartCard title="Issue mix by semester" sub="The five patterns, winter vs summer.">
        <AdminSemesterBars rows={YR_SEMESTER} />
      </ChartCard>

      <ChartCard title="Campus climate indicators" sub="Anonymous pulse survey, year over year.">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {YR_CLIMATE.map((c, i) => <AdminClimateBar key={i} {...c} />)}
        </div>
      </ChartCard>

      <div style={{ background:'#26215C', borderRadius:18, padding:'22px 20px' }}>
        <p className="serif" style={{ margin:0, color:'#fff', fontSize:'1.12rem', lineHeight:1.55 }}>
          One year of quiet signals. Hundreds of fairer rooms. Zero people exposed.
        </p>
      </div>
    </AdminViewShell>
  );
}

// ---------- Router ----------
function AdminDashboard() {
  const nav = useNav();
  const [view, setView] = useState('home');
  const back = () => setView('home');
  if (view === 'inbox') return <AdminInboxView onBack={back} />;
  if (view === 'month') return <AdminMonthlyView onBack={back} />;
  if (view === 'year') return <AdminYearlyView onBack={back} />;
  return <AdminHome nav={nav} setView={setView} />;
}

Object.assign(window, { AdminDashboard });
