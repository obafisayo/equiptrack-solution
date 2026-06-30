export function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export function fmtDate(iso: string): string {
  const d = new Date(iso+'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
}

export function getCalendarCells(year: number, month: number): Date[] {
  const first = new Date(year, month, 1).getDay()
  const dim   = new Date(year, month+1, 0).getDate()
  const dprev = new Date(year, month, 0).getDate()
  const cells: Date[] = []
  for (let i = first-1; i >= 0; i--) cells.push(new Date(year, month-1, dprev-i))
  for (let d = 1; d <= dim; d++)     cells.push(new Date(year, month, d))
  const rem = 42 - cells.length
  for (let i = 1; i <= rem; i++)     cells.push(new Date(year, month+1, i))
  return cells
}

export function getWeekOf(d: Date): Date[] {
  const dow = d.getDay()
  return Array.from({length:7}, (_,i) => {
    const x = new Date(d)
    x.setDate(d.getDate()-dow+i)
    return x
  })
}
