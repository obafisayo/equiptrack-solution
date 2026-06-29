/* eslint-disable */
export function AuthLeftPanel() {
  return (
    <div
      className="hidden md:flex flex-col flex-shrink-0 relative overflow-hidden"
      style={{ width: '50%', height: '100vh', background: '#F04A4A' }}
    >
      {/* Dot-grid overlay */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Logo row */}
      <div className="relative z-10 flex items-center gap-2.5 px-8 pt-8 pb-0 shrink-0">
        <div style={{
          width: 32, height: 32, background: 'rgba(0,0,0,0.18)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
            <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
            <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
            <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '0.06em' }}>
          EQUIPTRACK
        </span>
      </div>

      {/* Mock UI — fills remaining space, clips if tight */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-8 py-5 overflow-hidden">
        <MockDashboardUI />
      </div>

      {/* Tagline */}
      <div className="relative z-10 px-8 pb-8 pt-0 shrink-0">
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.25, margin: '0 0 10px' }}>
          Manage your equipment,<br />track every stage.
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, maxWidth: 300, margin: 0 }}>
          Real-time lifecycle tracking for offshore equipment logistics — from requisition to deckspace, with named accountability at every step.
        </p>
      </div>
    </div>
  )
}

/* ── Glassmorphism mock-UI cards ──────────────────────────────────────────── */
function MockDashboardUI() {
  const STAGE_COLORS = [
    '#94A3B8',
    '#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6',
    '#8B5CF6',
    '#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0',
  ]

  return (
    <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Search bar */}
      <div style={{
        background: 'rgba(255,255,255,0.95)', borderRadius: 9, padding: '9px 13px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4" stroke="#9CA3AF" strokeWidth="1.5" />
          <path d="M10 10L13 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>Search by Equipment ID…</span>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
        {[
          { label: 'Active',   value: '47', trend: '+4.6%', positive: true  },
          { label: 'Shipped',  value: '12', trend: '+3',    positive: true  },
          { label: 'Breached', value: '5',  trend: '−2',   positive: false },
        ].map(card => (
          <div key={card.label} style={{
            background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '9px 11px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: 9.5, color: '#6B7280', marginBottom: 3 }}>{card.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {card.value}
            </div>
            <div style={{ fontSize: 9.5, color: card.positive ? '#22C55E' : '#EF4444', marginTop: 3, fontWeight: 600 }}>
              {card.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Equipment order card */}
      <div style={{
        background: 'rgba(255,255,255,0.97)', borderRadius: 9, padding: '14px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 7 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 600, color: '#F04A4A' }}>
            #EQ-2847-0924
          </span>
          <span style={{
            fontSize: 9.5, fontWeight: 600, background: '#EDE9FE', color: '#8B5CF6',
            padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap',
          }}>
            Dispatch Queue
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: '#6B7280', marginBottom: 9 }}>
          Drilling Equipment Set · Urgent
        </div>

        {/* Progress bar */}
        <div style={{ height: 3.5, background: '#F3F4F6', borderRadius: 2, marginBottom: 5, overflow: 'hidden' }}>
          <div style={{ width: '65%', height: '100%', background: '#F04A4A', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#9CA3AF', marginBottom: 9 }}>
          <span>Stage 7 of 16 · 65%</span>
          <span>Chika Obi</span>
        </div>

        {/* 16-stage strip */}
        <div style={{ display: 'flex', gap: 2 }}>
          {STAGE_COLORS.map((color, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 1.5,
              background: color, opacity: i >= 7 ? 0.35 : 1,
            }} />
          ))}
        </div>
      </div>

      {/* SLA alert */}
      <div style={{
        background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '9px 13px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: 10.5, color: '#6B7280' }}>
          <span style={{ fontWeight: 600, color: '#111827' }}>3h 42m</span> elapsed · SLA: 6h remaining
        </div>
        <span style={{ fontSize: 9.5, fontWeight: 600, background: '#FFFBEB', color: '#D97706', padding: '2px 7px', borderRadius: 999 }}>
          Near SLA
        </span>
      </div>

    </div>
  )
}
