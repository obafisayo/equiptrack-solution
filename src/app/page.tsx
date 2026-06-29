import Link from 'next/link'
import Image from 'next/image'

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="3" rx="1.5" fill="white" />
        <rect x="2" y="9.5" width="13" height="3" rx="1.5" fill="white" />
        <rect x="2" y="15" width="16" height="3" rx="1.5" fill="white" />
      </svg>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-page-bg text-neutral-900 font-sans selection:bg-brand-500/20">
      {/* ── STICKY NAV ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 h-topbar z-50 bg-white/80 backdrop-blur-md border-b border-border-default flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <LogoMark size={32} />
          <span className="font-sans font-bold text-lg text-neutral-900 tracking-wide">
            EQUIPTRACK
          </span>
        </Link>
        <div className="hidden md:flex gap-8">
          <a href="#features" className="text-sm text-neutral-500 hover:text-brand-500 transition-colors font-medium">Features</a>
        </div>
        <Link href="/login" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 rounded-button transition-colors shadow-sm">
          Access Portal &rarr;
        </Link>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 md:px-12 flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-brand-50 to-page-bg -z-10" />

        <div className="max-w-4xl w-full">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 mb-6 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="font-semibold text-xs tracking-widest text-brand-600 uppercase">
              Oil &amp; Gas Operations Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-extrabold text-4xl md:text-6xl text-neutral-900 mb-6 leading-tight tracking-tight">
            Equipment that moves. <br className="hidden md:block" />
            <span className="text-brand-500 relative whitespace-nowrap">
              Accountability that stays.
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time lifecycle tracking for offshore equipment logistics — from requisition to deckspace, with named accountability at every stage.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/login" className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-base px-8 py-4 rounded-card transition-all shadow-raised hover:shadow-lg w-full sm:w-auto">
              Access Portal &rarr;
            </Link>
            <a href="#features" className="bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-base px-8 py-4 rounded-card border border-border-strong transition-all shadow-sm w-full sm:w-auto">
              See Features
            </a>
          </div>

          {/* Descriptive Image Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-xl border border-border-strong bg-white shadow-overlay p-2 overflow-hidden transform transition-transform hover:-translate-y-1 duration-500">
            <div className="rounded-lg overflow-hidden border border-border-default bg-neutral-50 aspect-video relative">
               <Image
                 src="/dashboard-mockup.png"
                 alt="Equiptrack Dashboard Interface Mockup"
                 fill
                 className="object-cover object-top"
                 priority
               />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────── */}
      <div className="border-y border-border-default bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24">
          {[
            { value: '16', label: 'Lifecycle Stages', color: 'text-stage-warehouse' },
            { value: '7', label: 'User Roles', color: 'text-stage-dispatch' },
            { value: '5', label: 'Departments', color: 'text-stage-qaqc' },
            { value: '100%', label: 'Traceability', color: 'text-stage-final' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`font-black text-4xl md:text-5xl ${s.color} mb-2`}>{s.value}</div>
              <div className="text-xs tracking-widest text-neutral-500 uppercase font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl md:text-4xl text-neutral-900 mb-4 tracking-tight">
            A platform built for accountability
          </h2>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto">
            Every feature is designed to eliminate the question &ldquo;who has it and why is it late?&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              accentClass: 'text-stage-warehouse bg-status-info-bg',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              title: 'Real-Time Pipeline Visibility',
              body: 'Know exactly where every equipment order is at this moment — which stage, which person, and for how long. No calls, no guessing.',
            },
            {
              accentClass: 'text-brand-500 bg-brand-50',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ),
              title: 'Named Accountability',
              body: '"Pending action by Emeka Okonkwo (3h 42m)" — not just "delayed in warehouse". Every delay has a name, a timestamp, and a reason.',
            },
            {
              accentClass: 'text-stage-qaqc bg-status-medium-bg',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              ),
              title: 'SLA Intelligence',
              body: 'Automatic breach detection surfaces orders at risk before they breach. Color-coded severity, department-level heatmaps, and escalation paths built in.',
            },
            {
              accentClass: 'text-stage-final bg-status-success-bg',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              ),
              title: 'Complete Audit Trail',
              body: 'Every stage transition is logged with person, timestamp, and duration. Full history from requisition to delivery — ready for compliance and post-mortems.',
            },
          ].map((card, idx) => (
            <div key={idx} className="bg-white border border-border-default rounded-xl p-8 shadow-card hover:shadow-raised transition-shadow">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${card.accentClass}`}>
                {card.icon}
              </div>
              <h3 className="font-bold text-xl text-neutral-900 mb-3">{card.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center relative overflow-hidden bg-neutral-900 text-white border-t border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(240,74,74,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="font-extrabold text-3xl md:text-5xl mb-6 leading-tight tracking-tight">
            Ready to bring order to your operations?
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join operations teams across the industry who track millions of dollars in equipment daily.
          </p>
          <Link href="/login" className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg px-10 py-4 rounded-card transition-all shadow-focus hover:shadow-lg inline-block">
            Access Portal &rarr;
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-neutral-950 py-8 px-6 md:px-12 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <LogoMark size={28} />
          <span className="font-sans font-bold text-sm text-neutral-300 tracking-wider">EQUIPTRACK</span>
        </div>
        <span className="text-xs text-neutral-500 tracking-wide">&copy; {new Date().getFullYear()} Equiptrack. All rights reserved.</span>
        <span className="text-xs text-neutral-500 tracking-wide hidden md:block">Equipment Lifecycle Management</span>
      </footer>
    </div>
  )
}
