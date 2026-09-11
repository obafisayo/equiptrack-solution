// Mutable coordinator config — edit from executive settings.
// Supports 1 or 2 coordinators (they sometimes rotate).

export interface CoordinatorConfig {
  baseName: string        // e.g. "Onne Base"
  coordinators: string[]  // 1-2 names shown on TR approval line
}

export const COORDINATOR_CONFIG: CoordinatorConfig = {
  baseName:     'Onne Base',
  coordinators: ['Kenneth Omireh'],
}

export function setCoordinators(names: string[]): void {
  COORDINATOR_CONFIG.coordinators = names.map(n => n.trim()).filter(Boolean)
}

export function setBaseName(name: string): void {
  COORDINATOR_CONFIG.baseName = name.trim()
}
