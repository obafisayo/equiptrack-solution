# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is a **Claude Design export** for Equiptrack — an equipment lifecycle tracking system for oil & gas field operations. The export contains a CSS design system (tokens, components) and a working HTML prototype. The task is to implement these designs as a **Next.js + TypeScript + Tailwind CSS** application.

The intended Next.js app structure is documented in `_ds_manifest.json` under the path prefix `equiptrack-solution/src/`.

---

## Development commands

Once the Next.js app is bootstrapped (not yet done — this repo contains only the design system source):

```bash
npm run dev          # start dev server on http://localhost:3000
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

---

## Design system source (read before coding)

| File | Purpose |
|---|---|
| `readme.md` | Full product brief, roles, lifecycle stages, design rules |
| `SKILL.md` | Condensed design rules — read this first |
| `styles.css` | Entry point; imports all token files |
| `tokens/colors.css` | All CSS custom properties for color |
| `tokens/typography.css` | Font families, scale, weights |
| `tokens/spacing.css` | 4px-base spacing + semantic aliases |
| `tokens/effects.css` | Shadows, radii, transitions, z-index |
| `ui_kits/equiptrack/index.html` | Full working React prototype (reference for interactions) |
| `ui_kits/equiptrack/data.js` | Mock data: ORDERS, PERSONNEL, CONTAINERS, SLA config |
| `components/` | Reference JSX implementations (inline-style based) |

---

## App architecture (target Next.js structure)

### Routes (from `_ds_manifest.json`)

```
/                          → role-selector home (RootLayout)
/requester                 → Requester dashboard
/requester/new             → New request form
/warehouse                 → Warehouse Supervisor
/warehouse/orders          → All Orders view
/warehouse/personnel       → Personnel load management
/warehouse-personnel       → Warehouse Personnel (task executor)
/dispatch                  → Dispatch Supervisor
/dispatch/personnel        → Dispatch personnel management
/dispatch-personnel        → Dispatch Personnel (task executor)
/qaqc                      → QAQC Officer
/qaqc/containers           → Container fleet management
/executive                 → Executive dashboard
```

### Component layers

**Layout** (`src/components/layout/`)
- `AppShell` — wraps every page: `Sidebar` (200px, `#131722`) + `Topbar` (64px) + content area
- `Sidebar` — fixed left nav, brand-red active state, role-aware nav items
- `Topbar` — page title, breadcrumb, search, user avatar

**Domain** (`src/components/domain/`)
- `WorkOrderCard` — primary card: delivery number, stage, person, SLA timer, urgency
- `StatCard` — KPI metric: value, label, trend indicator
- `DetailPanel` — 480px right-side slide-in panel (250ms ease transform)
- `AssignModal` — modal for assigning/reassigning work orders
- `SLABar` — progress bar for stage SLA consumption
- `StageTimeline` (`StageStrip` + `StageHistory`) — 16-stage progress strip
- `OrderGrid` — grid layout wrapper for work order cards
- `BottleneckHeatmap` — executive view heatmap
- `Charts` — `TrendChart`, `BarChart`, `LoadBars`, `DonutChart`
- `Pills` — `StagePill`, `UrgencyPill`, `TypeBadge`, `SLAChip`

**UI primitives** (`src/components/ui/`)
- `Button`, `Badge`, `Avatar`, `Card`
- `Form` (`Input`, `Select`, `Field`, `Textarea`)

**Config / lib**
- `src/config/sla.ts` — `URGENCY_CONFIG`, `STAGE_SLA_HOURS`, `SLA_WARNING_THRESHOLD`, `SLA_COLORS`
- `src/lib/lifecycle.ts` — `LIFECYCLE` (16 stages), `STAGE_DEPARTMENT`, `DEPARTMENT_COLOR`, `STAGE_COLOR`, `ROLE_STAGES`, `ROLE_LABEL`, `ROLE_ROUTE`
- `src/lib/dispatch.ts` — `DISPATCH_STAGES`
- `src/lib/mock-data.ts` — `PERSONNEL`, `CONTAINERS`, `WORK_ORDERS`

---

## Critical design rules

- **Primary color** `#F04A4A` — logo, active nav, CTA buttons, SLA breach indicators. Hover: `#E02828`.
- **Sidebar** `#131722` — never changes. Nav hover: `rgba(255,255,255,0.07)`.
- **Page background** `#F5F5F5`. Cards: white, `1px solid #E2E8F0`, `border-radius: 8px`, `shadow-sm`.
- **SLA-breached cards** get a `3px` red top strip (`#EF4444`) + faint red glow border. No colored left-border-only cards.
- **Font**: Inter (Google Fonts). JetBrains Mono for delivery numbers, work order IDs, reference codes — always monospace.
- **Elapsed time is mandatory** on every work order card. Format: `6h 32m`, never `6.53 hours`.
- **Named accountability**: always "Pending action by John Ifeanyi", never "delayed in warehouse".
- No emoji anywhere. No gradient backgrounds. No bounce/spring animations.
- Transitions: `150ms ease` (hover), `250ms ease` (panel slide/modal).

## Lifecycle stage department colors

| Department | Color |
|---|---|
| Pending BC Approval | `#94A3B8` (slate) |
| Warehouse (stages 2–6) | `#3B82F6` (blue) |
| Dispatch (stages 7–8) | `#8B5CF6` (violet) |
| QAQC (stages 9–11) | `#F59E0B` (amber) |
| Final (stages 12–16) | `#10B981` (green) |

## SLA urgency levels

| Level | SLA | Color |
|---|---|---|
| Low | 7 days | `#22C55E` |
| Medium | 5 days | `#F59E0B` |
| High | 3 days | `#F97316` |
| Urgent | Next boat | `#EF4444` |

## Tailwind configuration

Map design tokens to Tailwind's `theme.extend` in `tailwind.config.ts`:
- Extend `colors` with brand (`brand-500: #F04A4A`), sidebar (`sidebar: #131722`), and all status/stage colors
- Extend `fontFamily` with `sans: ['Inter', ...]` and `mono: ['JetBrains Mono', ...]`
- Extend `spacing` and `borderRadius` to match the token scale
- The CSS custom properties in `tokens/` are the authoritative source of truth
