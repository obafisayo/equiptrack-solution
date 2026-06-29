/* eslint-disable */
export function AuthLeftPanel() {
  return (
    <div
      className="hidden md:flex flex-col flex-shrink-0 relative overflow-hidden"
      style={{ width: '50%', minHeight: '100vh', background: '#F04A4A' }}
    >
      {/* Dot-grid pattern overlay */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top-left logo */}
      <div className="relative z-10 flex items-center gap-3 p-10 pb-0">
        <div style={{
          width: 34, height: 34, background: 'rgba(0,0,0,0.18)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
            <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
            <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
            <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '0.06em' }}>
          EQUIPTRACK
        </span>
      </div>

      {/* Mock UI illustration — center */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-10 py-8">
        <MockDashboardUI />
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10 p-10 pt-0">
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: '0 0 12px' }}>
          Manage your equipment,<br />track every stage.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, maxWidth: 320, margin: 0 }}>
          Real-time lifecycle tracking for offshore equipment logistics — from requisition to deckspace, with named accountability at every step.
        </p>
      </div>
    </div>
  )
}

/* ── Glassmorphism mock-UI cards ──────────────────────────────────────────── */
function MockDashboardUI() {
  const STAGE_COLORS = [
    '#94A3B8', // 1 — pending
    '#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6', // 2-6 warehouse
    '#8B5CF6', // 7 — dispatch (current)
    '#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0', // 8-16 remaining
  ]

  return (
    <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Search bar mock */}
      <div style={{
        background: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        display: 'flex', alignItems: 'center', gap: 9,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4" stroke="#9CA3AF" strokeWidth="1.5" />
          <path d="M10 10L13 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 13, color: '#9CA3AF' }}>Search by Equipment ID…</span>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { label: 'Active', value: '47', trend: '+4.6%', positive: true },
          { label: 'Shipped', value: '12', trend: '+3', positive: true },
          { label: 'Breached', value: '5', trend: '−2', positive: false },
        ].map(card => (
          <div key={card.label} style={{
            background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '10px 12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {card.value}
            </div>
            <div style={{ fontSize: 10, color: card.positive ? '#22C55E' : '#EF4444', marginTop: 4, fontWeight: 600 }}>
              {card.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Equipment order card */}
      <div style={{
        background: 'rgba(255,255,255,0.97)', borderRadius: 10, padding: '16px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: '#F04A4A',
          }}>
            #EQ-2847-0924
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, background: '#EDE9FE', color: '#8B5CF6',
            padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap',
          }}>
            Dispatch Queue
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>
          Drilling Equipment Set · Urgent
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, marginBottom: 6, overflow: 'hidden' }}>
          <div style={{ width: '65%', height: '100%', background: '#F04A4A', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF', marginBottom: 10 }}>
          <span>Stage 7 of 16 · 65%</span>
          <span>Chika Obi</span>
        </div>

        {/* 16-stage strip */}
        <div style={{ display: 'flex', gap: 2 }}>
          {STAGE_COLORS.map((color, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 1.5,
              background: color,
              opacity: i >= 7 ? 0.35 : 1,
            }} />
          ))}
        </div>
      </div>

      {/* Bottom SLA alert */}
      <div style={{
        background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '10px 14px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: 11, color: '#6B7280' }}>
          <span style={{ fontWeight: 600, color: '#111827' }}>3h 42m</span> elapsed · SLA: 6h remaining
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, background: '#FFFBEB', color: '#D97706', padding: '2px 8px', borderRadius: 999 }}>
          Near SLA
        </span>
      </div>
    </div>
  )
}
