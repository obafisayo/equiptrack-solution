'use client'

import Link from 'next/link'

const CSS_ANIMATIONS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes stageGlow {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  @keyframes pulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
  }
  @keyframes bounceDown {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }
  .fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; }
  .fade-up-1 { animation-delay: 0.1s; }
  .fade-up-2 { animation-delay: 0.2s; }
  .fade-up-3 { animation-delay: 0.3s; }
  .fade-up-4 { animation-delay: 0.4s; }
  .fade-up-5 { animation-delay: 0.5s; }
  .fade-up-6 { animation-delay: 0.6s; }
  .bounce-arrow { animation: bounceDown 1.6s ease-in-out infinite; }
  .stage-pill { animation: stageGlow 2s ease-in-out infinite; }
  .stage-pill:nth-child(2) { animation-delay: 0.3s; }
  .stage-pill:nth-child(3) { animation-delay: 0.6s; }
  .stage-pill:nth-child(4) { animation-delay: 0.9s; }
  .stage-pill:nth-child(5) { animation-delay: 1.2s; }
  .landing-nav-link {
    color: rgba(220,229,240,0.55);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.15s;
  }
  .landing-nav-link:hover { color: #DCE5F0; }
  .pipeline-cell {
    transition: border-color 0.2s, background 0.2s;
  }
  .pipeline-cell:hover {
    background: rgba(255,255,255,0.04) !important;
  }
  .role-card {
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    text-decoration: none;
    display: block;
  }
  .role-card:hover {
    transform: translateY(-2px);
  }
  .feature-card {
    transition: border-color 0.2s;
  }
  .portal-btn {
    background: #F04A4A;
    color: white;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s, box-shadow 0.15s;
    display: inline-block;
  }
  .portal-btn:hover {
    background: #E02828;
    box-shadow: 0 4px 20px rgba(240,74,74,0.35);
  }
  .portal-btn-lg {
    padding: 14px 32px;
    font-size: 15px;
    border-radius: 8px;
  }
  .ghost-btn {
    background: transparent;
    color: rgba(220,229,240,0.8);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    padding: 14px 32px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.14);
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.15s, color 0.15s;
    display: inline-block;
  }
  .ghost-btn:hover {
    border-color: rgba(255,255,255,0.3);
    color: #DCE5F0;
  }
`

const DEPT_COLORS = {
  pending:   '#94A3B8',
  warehouse: '#3B82F6',
  dispatch:  '#8B5CF6',
  qaqc:      '#F59E0B',
  final:     '#10B981',
}

const PIPELINE_ROW1 = [
  { n: 1,  name: 'Pending BC Approval', dept: 'pending'   as const, sla: '24h' },
  { n: 2,  name: 'New Request',          dept: 'warehouse' as const, sla: '4h'  },
  { n: 3,  name: 'WH Assigned',          dept: 'warehouse' as const, sla: '2h'  },
  { n: 4,  name: 'Processing',           dept: 'warehouse' as const, sla: '6h'  },
  { n: 5,  name: 'GI Created',           dept: 'warehouse' as const, sla: '2h'  },
  { n: 6,  name: 'To Dispatch',          dept: 'warehouse' as const, sla: '2h'  },
  { n: 7,  name: 'Dispatch Queue',       dept: 'dispatch'  as const, sla: '4h'  },
  { n: 8,  name: 'Dispatch Assigned',    dept: 'dispatch'  as const, sla: '6h'  },
]

const PIPELINE_ROW2 = [
  { n: 9,  name: 'Preload QAQC',        dept: 'qaqc'  as const, sla: '6h'  },
  { n: 10, name: 'Containerization',    dept: 'qaqc'  as const, sla: '8h'  },
  { n: 11, name: 'Post QAQC',           dept: 'qaqc'  as const, sla: '4h'  },
  { n: 12, name: 'Waybill Pending',     dept: 'final' as const, sla: '8h'  },
  { n: 13, name: 'Waybill Done',        dept: 'final' as const, sla: '4h'  },
  { n: 14, name: 'Awaiting Deckspace',  dept: 'final' as const, sla: '48h' },
  { n: 15, name: 'Shipped',             dept: 'final' as const, sla: '—'   },
  { n: 16, name: 'Completed',           dept: 'final' as const, sla: '—'   },
]

const ROLES = [
  { slug: 'requester',            label: 'Requester',             dept: 'Operations',          color: '#6366F1', desc: 'Submit and track equipment requests end-to-end.' },
  { slug: 'warehouse-supervisor', label: 'Warehouse Supervisor',  dept: 'Warehouse',           color: '#3B82F6', desc: 'Assign orders, manage team load, ensure SLA compliance.' },
  { slug: 'warehouse-personnel',  label: 'Warehouse Personnel',   dept: 'Warehouse',           color: '#60A5FA', desc: 'Execute picks, create GI, handoff to dispatch.' },
  { slug: 'dispatch-supervisor',  label: 'Dispatch Supervisor',   dept: 'Dispatch',            color: '#8B5CF6', desc: 'Coordinate dispatch, QAQC queues, vessel loading.' },
  { slug: 'dispatch-personnel',   label: 'Dispatch Personnel',    dept: 'Dispatch',            color: '#A78BFA', desc: 'Pack containers, generate waybills, move to deckspace.' },
  { slug: 'qaqc-officer',         label: 'QAQC Officer',          dept: 'Quality & Compliance',color: '#F59E0B', desc: 'Conduct inspections, manage container fleet.' },
  { slug: 'executive',            label: 'Executive',             dept: 'Leadership',          color: '#10B981', desc: 'KPI dashboards, bottleneck heatmaps, team performance.' },
]

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, background: '#F04A4A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4"  width="18" height="3" rx="1.5" fill="white"/>
        <rect x="2" y="9.5" width="13" height="3" rx="1.5" fill="white"/>
        <rect x="2" y="15" width="16" height="3" rx="1.5" fill="white"/>
      </svg>
    </div>
  )
}

function RoleIcon({ slug, color, size = 28 }: { slug: string; color: string; size?: number }) {
  const paths: Record<string, string> = {
    'requester':            'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 12h6M9 16h4',
    'warehouse-supervisor': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
    'warehouse-personnel':  'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M12 22V12 M3.27 6.96L12 12l8.73-5.04',
    'dispatch-supervisor':  'M1 3h15v13H1z M16 8h4l3 5v3h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    'dispatch-personnel':   'M12 2l9 4.9V17L12 22l-9-5.1V7L12 2z M12 22V12 M3.27 6.96L12 12l8.73-5.04',
    'qaqc-officer':         'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
    'executive':            'M18 20V10 M12 20V4 M6 20v-6',
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[slug] ?? paths['executive']} />
    </svg>
  )
}

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#060B14', color: '#DCE5F0', minHeight: '100vh' }}>
      <style>{CSS_ANIMATIONS}</style>

      {/* ── STICKY NAV ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 100,
        background: 'rgba(6,11,20,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoMark size={36} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: '#F0F4FF', letterSpacing: '0.04em' }}>
            EQUIPTRACK
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 32 }}>
          <a href="#features"  className="landing-nav-link">Features</a>
          <a href="#lifecycle" className="landing-nav-link">Lifecycle</a>
          <a href="#roles"     className="landing-nav-link">Roles</a>
        </div>
        <Link href="/login" className="portal-btn">Access Portal →</Link>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: 64, position: 'relative', overflow: 'hidden',
        backgroundImage: [
          'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(240,74,74,0.1) 0%, transparent 60%)',
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: 'auto, 64px 64px, 64px 64px',
      }}>
        <div style={{ maxWidth: 960, width: '100%', padding: '0 24px', textAlign: 'center' }}>

          {/* Tag */}
          <div className="fade-up fade-up-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F04A4A', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: '0.22em', color: '#F04A4A', textTransform: 'uppercase' }}>
              Oil &amp; Gas Operations Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up fade-up-2" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1.05, margin: '0 0 24px', color: '#F0F4FF' }}>
            <div style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>EQUIPMENT THAT MOVES.</div>
            <div style={{ fontSize: 'clamp(36px, 6vw, 64px)', display: 'inline-block', borderBottom: '3px solid #F04A4A', paddingBottom: 4 }}>
              ACCOUNTABILITY THAT STAYS.
            </div>
          </h1>

          {/* Sub */}
          <p className="fade-up fade-up-3" style={{ fontSize: 18, color: '#8B9BB5', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Real-time lifecycle tracking for offshore equipment logistics — from requisition to deckspace, with named accountability at every stage.
          </p>

          {/* CTAs */}
          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
            <Link href="/login" className="portal-btn portal-btn-lg">Access Portal →</Link>
            <a href="#lifecycle" className="ghost-btn">See How It Works</a>
          </div>

          {/* Pipeline mini-preview */}
          <div className="fade-up fade-up-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'New Request',  color: '#3B82F6' },
              { label: '→',           color: null },
              { label: 'Processing',  color: '#3B82F6' },
              { label: '→',           color: null },
              { label: 'Dispatch',    color: '#8B5CF6' },
              { label: '→',           color: null },
              { label: 'Post QAQC',   color: '#F59E0B' },
              { label: '→',           color: null },
              { label: 'Shipped',     color: '#10B981' },
            ].map((item, i) =>
              item.color ? (
                <span key={i} className="stage-pill" style={{
                  padding: '4px 12px', borderRadius: 99,
                  background: item.color + '22', border: `1px solid ${item.color}44`,
                  color: item.color, fontSize: 12, fontWeight: 600,
                }}>{item.label}</span>
              ) : (
                <span key={i} style={{ color: 'rgba(220,229,240,0.25)', fontSize: 14 }}>→</span>
              )
            )}
          </div>

          {/* Scroll hint */}
          <div className="fade-up fade-up-6" style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.15em', color: 'rgba(220,229,240,0.25)', textTransform: 'uppercase' }}>Scroll to explore</span>
            <span className="bounce-arrow" style={{ color: 'rgba(220,229,240,0.25)', fontSize: 18 }}>↓</span>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '36px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 80, flexWrap: 'wrap', rowGap: 32 }}>
          {[
            { value: '16', label: 'Lifecycle Stages', color: '#3B82F6' },
            { value: '7',  label: 'User Roles',       color: '#8B5CF6' },
            { value: '5',  label: 'Departments',      color: '#F59E0B' },
            { value: '100%', label: 'Traceability',   color: '#10B981' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 48, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.14em', color: '#6B7A99', textTransform: 'uppercase', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" style={{ padding: '96px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(28px,4vw,36px)', color: '#F0F4FF', margin: '0 0 14px' }}>
            A platform built for accountability
          </h2>
          <p style={{ fontSize: 16, color: '#6B7A99', maxWidth: 520, margin: '0 auto' }}>
            Every feature is designed to eliminate the question &ldquo;who has it and why is it late?&rdquo;
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {[
            {
              accent: '#3B82F6',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              ),
              title: 'Real-Time Pipeline Visibility',
              body: 'Know exactly where every equipment order is at this moment — which stage, which person, and for how long. No calls, no guessing.',
            },
            {
              accent: '#F04A4A',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F04A4A" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              ),
              title: 'Named Accountability',
              body: '"Pending action by Emeka Okonkwo (3h 42m)" — not just "delayed in warehouse". Every delay has a name, a timestamp, and a reason.',
            },
            {
              accent: '#F59E0B',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ),
              title: 'SLA Intelligence',
              body: 'Automatic breach detection surfaces orders at risk before they breach. Color-coded severity, department-level heatmaps, and escalation paths built in.',
            },
            {
              accent: '#10B981',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
              ),
              title: 'Complete Audit Trail',
              body: 'Every stage transition is logged with person, timestamp, and duration. Full history from requisition to delivery — ready for compliance and post-mortems.',
            },
          ].map(card => (
            <div key={card.title} className="feature-card" style={{
              background: '#0D1525', border: `1px solid #1B2B42`,
              borderRadius: 16, padding: 28,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: card.accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {card.icon}
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#F0F4FF', margin: '0 0 10px' }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: '#6B7A99', lineHeight: 1.65, margin: 0 }}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIFECYCLE PIPELINE ─────────────────────────────────── */}
      <section id="lifecycle" style={{ padding: '80px 48px', background: 'rgba(0,0,0,0.25)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(28px,4vw,36px)', color: '#F0F4FF', margin: '0 0 14px' }}>
              16 Stages. 5 Departments. Zero Gaps.
            </h2>
            <p style={{ fontSize: 15, color: '#6B7A99', margin: '0 0 28px' }}>
              The complete equipment lifecycle — from base coordinator approval to offshore delivery.
            </p>
            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Pending',   color: '#94A3B8' },
                { label: 'Warehouse', color: '#3B82F6' },
                { label: 'Dispatch',  color: '#8B5CF6' },
                { label: 'QAQC',      color: '#F59E0B' },
                { label: 'Final',     color: '#10B981' },
              ].map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#8B9BB5' }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            {PIPELINE_ROW1.map((stage, i) => {
              const color = DEPT_COLORS[stage.dept]
              return (
                <>
                  <div key={stage.n} className="pipeline-cell" style={{
                    flex: 1, background: '#0C1826',
                    border: `1px solid ${color}30`,
                    borderLeft: `2px solid ${color}`,
                    borderRadius: 8, padding: '10px 8px', minWidth: 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 9, fontWeight: 700, color: '#060B14' }}>
                        {stage.n}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#CBD5E1', lineHeight: 1.3, marginBottom: 3 }}>{stage.name}</div>
                    <div style={{ fontSize: 9, color: '#4B5E78' }}>SLA {stage.sla}</div>
                  </div>
                  {i < PIPELINE_ROW1.length - 1 && (
                    <span key={`arrow-${i}`} style={{ color: 'rgba(220,229,240,0.2)', fontSize: 12, flexShrink: 0 }}>›</span>
                  )}
                </>
              )
            })}
          </div>

          {/* Down arrow between rows */}
          <div style={{ textAlign: 'right', paddingRight: 4, marginBottom: 4 }}>
            <span style={{ color: 'rgba(220,229,240,0.25)', fontSize: 18, lineHeight: 1 }}>↓</span>
          </div>

          {/* Row 2 — reversed for snake pattern */}
          <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 4 }}>
            {PIPELINE_ROW2.map((stage, i) => {
              const color = DEPT_COLORS[stage.dept]
              return (
                <>
                  <div key={stage.n} className="pipeline-cell" style={{
                    flex: 1, background: '#0C1826',
                    border: `1px solid ${color}30`,
                    borderLeft: `2px solid ${color}`,
                    borderRadius: 8, padding: '10px 8px', minWidth: 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 9, fontWeight: 700, color: '#060B14' }}>
                        {stage.n}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#CBD5E1', lineHeight: 1.3, marginBottom: 3 }}>{stage.name}</div>
                    <div style={{ fontSize: 9, color: '#4B5E78' }}>SLA {stage.sla}</div>
                  </div>
                  {i < PIPELINE_ROW2.length - 1 && (
                    <span key={`arrow2-${i}`} style={{ color: 'rgba(220,229,240,0.2)', fontSize: 12, flexShrink: 0 }}>‹</span>
                  )}
                </>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── ROLES ──────────────────────────────────────────────── */}
      <section id="roles" style={{ padding: '96px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(28px,4vw,36px)', color: '#F0F4FF', margin: '0 0 14px' }}>
            Built for every member of your operations team
          </h2>
          <p style={{ fontSize: 15, color: '#6B7A99' }}>
            Seven purpose-built dashboards. One connected platform.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {ROLES.map(role => (
            <Link key={role.slug} href={`/login/${role.slug}`} className="role-card" style={{
              background: '#0D1525',
              border: `1px solid #1B2B42`,
              borderRadius: 16, padding: 24,
              borderTop: `3px solid ${role.color}`,
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = role.color + '80'
                el.style.boxShadow = `0 4px 24px ${role.color}18`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = '#1B2B42'
                el.style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: role.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RoleIcon slug={role.slug} color={role.color} size={22} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: role.color, background: role.color + '18', padding: '3px 8px', borderRadius: 4 }}>
                  {role.dept}
                </span>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: '#F0F4FF', marginBottom: 8 }}>{role.label}</div>
              <p style={{ fontSize: 13, color: '#8B9BB5', lineHeight: 1.55, margin: '0 0 20px' }}>{role.desc}</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: role.color }}>Login as {role.label} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section style={{
        padding: '100px 48px', textAlign: 'center',
        background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(240,74,74,0.08), transparent)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(32px,5vw,48px)', color: '#F0F4FF', margin: '0 0 18px', lineHeight: 1.1 }}>
          Ready to bring order to your<br />operations?
        </h2>
        <p style={{ fontSize: 16, color: '#6B7A99', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.65 }}>
          Join operations teams across the industry who track millions of dollars in equipment daily.
        </p>
        <Link href="/login" className="portal-btn portal-btn-lg">Access Portal →</Link>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark size={28} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: 'rgba(220,229,240,0.4)' }}>EQUIPTRACK</span>
        </div>
        <span style={{ fontSize: 12, color: 'rgba(220,229,240,0.25)' }}>© {new Date().getFullYear()} Equiptrack</span>
        <span style={{ fontSize: 12, color: 'rgba(220,229,240,0.25)' }}>Equipment Lifecycle Management</span>
      </footer>
    </div>
  )
}
