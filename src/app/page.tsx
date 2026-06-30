import Link from 'next/link'
import Image from 'next/image'
import { Check, ArrowRight } from 'lucide-react'
import { NewsletterForm } from '@/components/marketing/NewsletterForm'

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

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features',     label: 'Features' },
  { href: '#pricing',      label: 'Pricing' },
]

const BTN_PRIMARY   = 'inline-flex items-center justify-center gap-2 h-11 px-6 rounded-button bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors shadow-sm whitespace-nowrap'
const BTN_SECONDARY = 'inline-flex items-center justify-center gap-2 h-11 px-6 rounded-button bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-sm border border-border-strong transition-colors whitespace-nowrap'
const BTN_GHOST_NAV = 'inline-flex items-center justify-center h-10 px-2.5 sm:px-4 rounded-button text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors whitespace-nowrap'
const BTN_BRAND_NAV = 'inline-flex items-center justify-center gap-1.5 h-10 px-3.5 sm:px-5 rounded-button bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors shadow-sm whitespace-nowrap'

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Submit a request',
    body: 'A requester logs the equipment needed, the destination, and the urgency. The clock starts the moment it is submitted.',
  },
  {
    step: '02',
    title: 'Warehouse & dispatch act',
    body: 'Work orders route automatically to the right warehouse and dispatch teams, each assigned to a named person with an SLA timer running.',
  },
  {
    step: '03',
    title: 'QAQC certifies',
    body: 'Quality officers inspect, containerize, and certify the load before it is cleared to move, with every check logged.',
  },
  {
    step: '04',
    title: 'Delivered & audited',
    body: 'Equipment reaches its destination with a complete, timestamped trail from request to delivery, ready for review at any time.',
  },
]

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$249',
    period: '/month',
    tagline: 'For single-site teams getting equipment tracking under control.',
    features: [
      'Up to 5 active user roles',
      'Core lifecycle tracking (16 stages)',
      'SLA alerts & breach indicators',
      'Standard reporting',
      'Email support',
    ],
    cta: 'Join Waitlist',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$699',
    period: '/month',
    tagline: 'For multi-department operations that need full visibility.',
    features: [
      'Unlimited user roles',
      'Full lifecycle & dispatch automation',
      'Executive analytics & bottleneck heatmaps',
      'QAQC container fleet management',
      'Priority support with onboarding',
    ],
    cta: 'Join Waitlist',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    tagline: 'For organisations running multiple yards, vessels, or regions.',
    features: [
      'Multi-site & multi-organisation support',
      'Single sign-on (SSO) & custom roles',
      'Dedicated account manager',
      'Custom integrations & API access',
      '24/7 priority support',
    ],
    cta: 'Talk to Sales',
    highlighted: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-page-bg text-neutral-900 font-sans selection:bg-brand-500/20">
      {/* ── STICKY NAV ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 h-topbar z-50 bg-white/85 backdrop-blur-md border-b border-border-default flex items-center justify-between gap-3 px-4 sm:px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline shrink-0">
          <LogoMark size={32} />
          <span className="font-sans font-bold text-base sm:text-lg text-neutral-900 tracking-wide">
            EQUIPTRACK
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className={BTN_GHOST_NAV}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link href="/login" className={BTN_GHOST_NAV}>
            Log In
          </Link>
          <Link href="/waitlist" className={BTN_BRAND_NAV}>
            Join Waitlist
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="pt-28 pb-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-brand-50 to-page-bg -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Image, left */}
          <div className="order-2 lg:order-1 relative">
            <div className="relative mx-auto max-w-xl rounded-xl border border-border-strong bg-white shadow-overlay p-2 overflow-hidden">
              <div className="rounded-lg overflow-hidden border border-border-default bg-neutral-50 aspect-[4/3] relative">
                <Image
                  src="/dashboard-mockup.png"
                  alt="Equiptrack dashboard interface"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
            {/* Floating stat chip */}
            <div className="hidden md:flex absolute -bottom-5 -right-3 bg-white rounded-xl border border-border-default shadow-raised px-4 py-3 items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-status-success-bg flex items-center justify-center shrink-0">
                <Check size={16} className="text-status-success" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-bold text-sm text-neutral-900 leading-tight">100% Traceable</div>
                <div className="text-xs text-neutral-500">From request to delivery</div>
              </div>
            </div>
          </div>

          {/* Text, right */}
          <div className="order-1 lg:order-2">
            <h1 className="font-extrabold text-3xl md:text-4xl lg:text-[44px] text-neutral-900 mb-5 leading-[1.12] tracking-tight">
              Equipment that moves.
              <br />
              <span className="text-brand-500">Accountability that stays.</span>
            </h1>

            <p className="text-base md:text-lg text-neutral-600 mb-8 leading-relaxed max-w-lg">
              Equiptrack gives any organisation that moves shipping equipment, oil and gas, marine, construction, or logistics, a single source of truth for where equipment is, who has it, and how long it has been there.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/waitlist" className={BTN_PRIMARY}>
                Join the Waitlist <ArrowRight size={16} />
              </Link>
              <Link href="/login" className={BTN_SECONDARY}>
                Explore Demo Dashboards
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-status-success" /> No card required to join waitlist</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-status-success" /> Setup support included</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────── */}
      <div className="border-y border-border-default bg-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-10 md:gap-20">
          {[
            { value: '16', label: 'Lifecycle Stages', color: 'text-stage-warehouse' },
            { value: '7', label: 'User Roles', color: 'text-stage-dispatch' },
            { value: '5', label: 'Departments', color: 'text-stage-qaqc' },
            { value: '100%', label: 'Traceability', color: 'text-stage-final' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`font-black text-3xl md:text-4xl ${s.color} mb-1.5`}>{s.value}</div>
              <div className="text-xs tracking-widest text-neutral-500 uppercase font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-16 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-semibold text-xs tracking-widest text-brand-600 uppercase mb-3 block">
            How It Works
          </span>
          <h2 className="font-bold text-3xl md:text-4xl text-neutral-900 mb-4 tracking-tight">
            From request to delivery, fully tracked
          </h2>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto">
            Equiptrack follows your equipment through every department, so nothing gets lost in a handoff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((s, idx) => (
            <div key={s.step} className="relative bg-white border border-border-default rounded-xl p-6 shadow-card">
              <span className="font-black text-3xl text-brand-100 leading-none">{s.step}</span>
              <h3 className="font-bold text-lg text-neutral-900 mt-3 mb-2">{s.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{s.body}</p>
              {idx < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight size={18} className="text-neutral-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-16 py-24 px-6 md:px-12 max-w-7xl mx-auto bg-white">
        <div className="text-center mb-16">
          <span className="font-semibold text-xs tracking-widest text-brand-600 uppercase mb-3 block">
            Features
          </span>
          <h2 className="font-bold text-3xl md:text-4xl text-neutral-900 mb-4 tracking-tight">
            A platform built for accountability
          </h2>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto">
            Every feature is designed to eliminate the question, who has it and why is it late?
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
              body: 'Know exactly where every equipment order is right now, which stage, which person, and for how long, without a single phone call.',
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
              body: '"Pending action by Emeka Okonkwo (3h 42m)" instead of "delayed in warehouse". Every delay has a name, a timestamp, and a reason.',
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
              body: 'Automatic breach detection surfaces orders at risk before they breach, with color-coded severity, department heatmaps, and built-in escalation paths.',
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
              body: 'Every stage transition is logged with person, timestamp, and duration, giving you a full history from requisition to delivery for compliance and post-mortems.',
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

      {/* ── PRICING ────────────────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-16 py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-semibold text-xs tracking-widest text-brand-600 uppercase mb-3 block">
            Pricing
          </span>
          <h2 className="font-bold text-3xl md:text-4xl text-neutral-900 mb-4 tracking-tight">
            Plans for every size of operation
          </h2>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto">
            Start small and scale up as your fleet and team grow. All plans include onboarding support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {PRICING_PLANS.map(plan => (
            <div
              key={plan.name}
              className={[
                'rounded-xl p-8 flex flex-col h-full',
                plan.highlighted
                  ? 'bg-neutral-900 text-white shadow-raised border border-neutral-900 lg:-translate-y-2'
                  : 'bg-white border border-border-default shadow-card',
              ].join(' ')}
            >
              {plan.highlighted && (
                <span className="self-start mb-4 text-[11px] font-bold uppercase tracking-widest text-brand-400 bg-brand-500/15 px-2.5 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className={`font-bold text-xl mb-1 ${plan.highlighted ? 'text-white' : 'text-neutral-900'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 leading-relaxed ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {plan.tagline}
              </p>
              <div className="mb-6">
                <span className={`font-black text-4xl tracking-tight ${plan.highlighted ? 'text-white' : 'text-neutral-900'}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm font-medium ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className={`shrink-0 mt-0.5 ${plan.highlighted ? 'text-brand-400' : 'text-status-success'}`} />
                    <span className={plan.highlighted ? 'text-neutral-200' : 'text-neutral-700'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/waitlist"
                className={[
                  'h-11 inline-flex items-center justify-center rounded-button font-semibold text-sm transition-colors',
                  plan.highlighted
                    ? 'bg-brand-500 hover:bg-brand-600 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white',
                ].join(' ')}
              >
                {plan.cta}
              </Link>
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
            Join operations teams across oil and gas, marine, construction, and logistics who track their equipment in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/waitlist" className={BTN_PRIMARY + ' h-12 px-8 text-base'}>
              Join the Waitlist <ArrowRight size={17} />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-button bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/15 transition-colors whitespace-nowrap">
              Explore Demo Dashboards
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-neutral-950 pt-16 pb-8 px-6 md:px-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <LogoMark size={28} />
              <span className="font-sans font-bold text-sm text-neutral-300 tracking-wider">EQUIPTRACK</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mb-6">
              Equipment lifecycle tracking for any organisation that moves shipping equipment, from request to delivery.
            </p>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Newsletter</h4>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mb-3">
              Product updates and release notes, straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-neutral-500">
              <li><a href="#how-it-works" className="hover:text-neutral-300 transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-neutral-300 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-neutral-300 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm text-neutral-500">
              <li><Link href="/login" className="hover:text-neutral-300 transition-colors">Log In</Link></li>
              <li><Link href="/waitlist" className="hover:text-neutral-300 transition-colors">Join Waitlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Industries</h4>
            <ul className="space-y-2.5 text-sm text-neutral-500">
              <li>Oil &amp; Gas</li>
              <li>Marine &amp; Offshore</li>
              <li>Construction &amp; Logistics</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-neutral-500 tracking-wide">&copy; {new Date().getFullYear()} Equiptrack. All rights reserved.</span>
          <span className="text-xs text-neutral-500 tracking-wide">Equipment Lifecycle Management</span>
        </div>
      </footer>
    </div>
  )
}
