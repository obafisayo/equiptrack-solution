export interface ColorCodePeriod {
  label: string
  startMonth: number
  startYear: number
  endMonth: number
  endYear: number
  color: string
  hex: string
  tailwindBg: string
  tailwindText: string
  tailwindBorder: string
}

/**
 * Nigerian offshore container inspection color rotation.
 * Containers must bear the current period color to be considered valid.
 * A 6-month inspection cycle. Colors repeat in a 4-period rotation.
 */
const COLOR_ROTATION_SEQUENCE: Array<{ color: string; hex: string; tailwindBg: string; tailwindText: string; tailwindBorder: string }> = [
  { color: 'RED',    hex: '#EF4444', tailwindBg: 'bg-red-500',    tailwindText: 'text-red-700',    tailwindBorder: 'border-red-300'    },
  { color: 'YELLOW', hex: '#F59E0B', tailwindBg: 'bg-amber-400',  tailwindText: 'text-amber-700',  tailwindBorder: 'border-amber-300'  },
  { color: 'GREEN',  hex: '#22C55E', tailwindBg: 'bg-green-500',  tailwindText: 'text-green-700',  tailwindBorder: 'border-green-300'  },
  { color: 'WHITE',  hex: '#94A3B8', tailwindBg: 'bg-slate-300',  tailwindText: 'text-slate-700',  tailwindBorder: 'border-slate-300'  },
]

// Base: Jan 2025 = RED (index 0)
const BASE_YEAR  = 2025
const BASE_MONTH = 1

function getPeriodIndex(year: number, month: number): number {
  const totalMonths    = (year - BASE_YEAR) * 12 + (month - BASE_MONTH)
  const halfYears      = Math.floor(totalMonths / 6)
  return ((halfYears % COLOR_ROTATION_SEQUENCE.length) + COLOR_ROTATION_SEQUENCE.length) % COLOR_ROTATION_SEQUENCE.length
}

function buildPeriod(year: number, periodStart: 'H1' | 'H2'): ColorCodePeriod {
  const startMonth = periodStart === 'H1' ? 1 : 7
  const endMonth   = periodStart === 'H1' ? 6 : 12
  const idx        = getPeriodIndex(year, startMonth)
  const seq        = COLOR_ROTATION_SEQUENCE[idx]
  return {
    label: `${periodStart === 'H1' ? 'Jan' : 'Jul'}–${periodStart === 'H1' ? 'Jun' : 'Dec'} ${year}`,
    startMonth,
    startYear: year,
    endMonth,
    endYear: year,
    ...seq,
  }
}

export function getCurrentColorCode(): ColorCodePeriod {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth() + 1
  const half  = month <= 6 ? 'H1' : 'H2'
  return buildPeriod(year, half)
}

export function getColorCodeForDate(date: Date): ColorCodePeriod {
  const year  = date.getFullYear()
  const month = date.getMonth() + 1
  const half  = month <= 6 ? 'H1' : 'H2'
  return buildPeriod(year, half)
}

export function isContainerColorValid(containerInspectionExpiry: string): boolean {
  const current = getCurrentColorCode()
  const expiry  = new Date(containerInspectionExpiry)
  const expCode = getColorCodeForDate(expiry)
  return expCode.color === current.color
}

export const CCU_SITES = [
  'Onne Base',
  'Bonga FPSO',
  'Agbami FPSO',
  'Escravos Terminal',
  'Bonny Terminal',
  'Egina FPSO',
  'Erha FPSO',
  'Usan FPSO',
  'Forcados Terminal',
] as const

export type CCUSite = typeof CCU_SITES[number]

export const CCU_SITE_COUNTS: Record<CCUSite, number> = {
  'Onne Base':          11,
  'Bonga FPSO':          4,
  'Agbami FPSO':         2,
  'Escravos Terminal':   3,
  'Bonny Terminal':      1,
  'Egina FPSO':          2,
  'Erha FPSO':           1,
  'Usan FPSO':           1,
  'Forcados Terminal':   0,
}

export const CCU_SITE_LAST_MOVEMENT: Record<CCUSite, string> = {
  'Onne Base':          '2026-06-29',
  'Bonga FPSO':         '2026-06-27',
  'Agbami FPSO':        '2026-06-25',
  'Escravos Terminal':  '2026-06-28',
  'Bonny Terminal':     '2026-06-20',
  'Egina FPSO':         '2026-06-22',
  'Erha FPSO':          '2026-06-24',
  'Usan FPSO':          '2026-06-18',
  'Forcados Terminal':  '2026-06-10',
}
