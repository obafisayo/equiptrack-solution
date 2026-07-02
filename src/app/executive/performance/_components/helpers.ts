export type ComparisonMode = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface DateRange {
  start: Date
  end: Date
  label: string
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getCurrentRange(mode: ComparisonMode, ref: Date = new Date()): DateRange {
  const d = startOfDay(ref)
  switch (mode) {
    case 'daily': {
      return { start: d, end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59), label: 'Today' }
    }
    case 'weekly': {
      const day   = d.getDay()
      const start = new Date(d); start.setDate(d.getDate() - day)
      const end   = new Date(start); end.setDate(start.getDate() + 6)
      return { start, end, label: 'This Week' }
    }
    case 'monthly': {
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      return { start, end, label: 'This Month' }
    }
    case 'yearly': {
      const start = new Date(d.getFullYear(), 0, 1)
      const end   = new Date(d.getFullYear(), 11, 31)
      return { start, end, label: 'This Year' }
    }
  }
}

export function getPreviousRange(mode: ComparisonMode, ref: Date = new Date()): DateRange {
  const d = startOfDay(ref)
  switch (mode) {
    case 'daily': {
      const prev = new Date(d); prev.setDate(d.getDate() - 1)
      return { start: prev, end: new Date(prev.getFullYear(), prev.getMonth(), prev.getDate(), 23, 59, 59), label: 'Yesterday' }
    }
    case 'weekly': {
      const day   = d.getDay()
      const thisStart = new Date(d); thisStart.setDate(d.getDate() - day)
      const end   = new Date(thisStart); end.setDate(thisStart.getDate() - 1)
      const start = new Date(end); start.setDate(end.getDate() - 6)
      return { start, end, label: 'Last Week' }
    }
    case 'monthly': {
      const start = new Date(d.getFullYear(), d.getMonth() - 1, 1)
      const end   = new Date(d.getFullYear(), d.getMonth(), 0)
      return { start, end, label: 'Last Month' }
    }
    case 'yearly': {
      const start = new Date(d.getFullYear() - 1, 0, 1)
      const end   = new Date(d.getFullYear() - 1, 11, 31)
      return { start, end, label: 'Last Year' }
    }
  }
}

export function inRange(dateStr: string, range: DateRange): boolean {
  const d = new Date(dateStr)
  return d >= range.start && d <= range.end
}

export function deltaLabel(current: number, previous: number, lowerIsBetter = false): {
  text: string
  positive: boolean
  direction: 'up' | 'down' | 'neutral'
} {
  if (previous === 0 && current === 0) return { text: 'No change', positive: true, direction: 'neutral' }
  if (previous === 0) return { text: '+∞%', positive: !lowerIsBetter, direction: 'up' }
  const pct   = Math.round(((current - previous) / previous) * 100)
  const up    = pct > 0
  const positive = lowerIsBetter ? !up : up
  return {
    text: (pct > 0 ? '+' : '') + pct + '%',
    positive,
    direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral',
  }
}
