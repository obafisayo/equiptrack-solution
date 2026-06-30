import type { Incident, Inspection, PTW, Severity } from './types'

export const INIT_INCIDENTS: Incident[] = [
  { id: 'INC-2026-001', type: 'Near Miss',          location: 'Warehouse Bay 3',   severity: 'medium',   reportedBy: 'Emeka Okonkwo',   date: '2026-06-26', time: '09:14', status: 'open',         description: 'Forklift passed within 0.5m of foot-worker crossing unmarked aisle during routine transfer.',        immediateAction: 'Area cordoned, supervisor notified. Pedestrian walkway markings to be refreshed.', investigator: 'Yinka Adeyemi', witnesses: 'Tunde Bello, Chibike Eze', equipment: 'Forklift FL-03', daysOpen: 2 },
  { id: 'INC-2026-002', type: 'Equipment Damage',   location: 'Dispatch Yard',     severity: 'high',     reportedBy: 'Biodun Adekunle', date: '2026-06-25', time: '14:33', status: 'under_review',  description: 'Rigging sling snapped during offshore container lift, container dropped 0.4m onto trailer bed.', immediateAction: 'Lift suspended, sling removed from service, third-party inspection requested.',    investigator: 'Femi Emmanuel',  witnesses: 'Chika Obi',                equipment: 'Sling Set SL-12B', daysOpen: 3 },
  { id: 'INC-2026-003', type: 'Slip / Trip',        location: 'Loading Bay 1',     severity: 'low',      reportedBy: 'Kenneth Nwosu',   date: '2026-06-24', time: '07:55', status: 'closed',        description: 'Technician slipped on wet concrete near draining basin. No injury sustained.',                   immediateAction: 'Area marked with wet floor signs, drainage improved.',                              investigator: 'Yinka Adeyemi', witnesses: 'None',                   equipment: 'N/A',              daysOpen: 0 },
  { id: 'INC-2026-004', type: 'Near Miss',          location: 'Container Yard',    severity: 'medium',   reportedBy: 'Tunde Bello',     date: '2026-06-23', time: '11:20', status: 'open',          description: 'Container swung during crane lift and struck scaffolding rail - no personnel injured.',           immediateAction: 'Lift aborted, exclusion zone extended, crane operator re-briefed.',                  investigator: 'Femi Emmanuel',  witnesses: 'Danjuma Yusuf',          equipment: 'Crane CR-01, Container CNT-009', daysOpen: 5 },
  { id: 'INC-2026-005', type: 'First Aid',          location: 'Warehouse Bay 1',   severity: 'low',      reportedBy: 'Yinka Adeyemi',   date: '2026-06-22', time: '16:02', status: 'closed',        description: 'Minor cut to right hand while handling metal casing. First aid administered on-site.',            immediateAction: 'Wound cleaned and dressed by first-aider. Cut-resistant gloves now mandatory.',     investigator: 'Femi Emmanuel',  witnesses: 'Ngozi Eze',              equipment: 'Metal Casing MC-44', daysOpen: 0 },
  { id: 'INC-2026-006', type: 'Chemical Spill',     location: 'Chemical Store',    severity: 'high',     reportedBy: 'Aisha Musa',      date: '2026-06-20', time: '08:48', status: 'escalated',     description: 'Drilling fluid drum overturned, spilling approximately 200L onto bay floor. Fumes detected.',     immediateAction: 'Immediate evacuation, MSDS consulted, spill contained with absorbent pads. ERT activated.', investigator: 'Yinka Adeyemi', witnesses: 'Tunde Bello, Biodun Adekunle', equipment: 'Drum DR-221 (Drilling Fluid)', daysOpen: 8 },
  { id: 'INC-2026-007', type: 'Working at Height',  location: 'Mezzanine Level 2', severity: 'critical', reportedBy: 'Segun Folarin',   date: '2026-06-18', time: '13:10', status: 'under_review',  description: 'Worker found without harness attached while on mezzanine platform at 4.2m height. Work stopped.', immediateAction: 'Work immediately halted. Full safety stand-down called. Toolbox talk held.',         investigator: 'Aisha Musa',     witnesses: 'Yinka Adeyemi, Emeka Okonkwo', equipment: 'Mezzanine Platform MZ-02', daysOpen: 10 },
  { id: 'INC-2026-008', type: 'Electrical Hazard',  location: 'Panel Room B',      severity: 'medium',   reportedBy: 'Danjuma Yusuf',   date: '2026-06-17', time: '10:05', status: 'closed',        description: 'Exposed wiring found behind Panel B-07 during routine maintenance. Area isolated.',              immediateAction: 'Panel B-07 isolated and locked out. Electrical contractor engaged for repair.',      investigator: 'Femi Emmanuel',  witnesses: 'None',                   equipment: 'Panel B-07',       daysOpen: 0 },
]

export const INSPECTIONS: Inspection[] = [
  { id: 'INP-001', equipment: 'Forklift FL-01',        category: 'Mobile Plant',    inspector: 'Yinka Adeyemi',   lastDate: '2026-06-15', nextDate: '2026-07-15', status: 'passed',  findings: 'All systems operational. Tyre tread within tolerance.' },
  { id: 'INP-002', equipment: 'Forklift FL-03',        category: 'Mobile Plant',    inspector: 'Emeka Okonkwo',   lastDate: '2026-05-30', nextDate: '2026-06-30', status: 'overdue', findings: 'Due for brake inspection - scheduled post-incident review.' },
  { id: 'INP-003', equipment: 'Crane CR-01',           category: 'Lifting Gear',    inspector: 'Femi Emmanuel',   lastDate: '2026-06-20', nextDate: '2026-07-20', status: 'passed',  findings: 'Load test completed. No structural defects found.' },
  { id: 'INP-004', equipment: 'Sling Set SL-12B',      category: 'Rigging',         inspector: 'Chika Obi',       lastDate: '2026-06-25', nextDate: '2026-07-25', status: 'failed',  findings: 'Sling snapped during lift - removed from service, replacement ordered.' },
  { id: 'INP-005', equipment: 'Fire Suppression Bay 3',category: 'Fire Safety',     inspector: 'Aisha Musa',      lastDate: '2026-06-10', nextDate: '2026-09-10', status: 'passed',  findings: 'All extinguishers charged and in date. Sprinkler test passed.' },
  { id: 'INP-006', equipment: 'Mezzanine MZ-02',       category: 'Work at Height',  inspector: 'Segun Folarin',   lastDate: '2026-06-01', nextDate: '2026-07-01', status: 'overdue', findings: 'Guardrail inspection overdue. Work suspended pending inspection.' },
  { id: 'INP-007', equipment: 'Chemical Store CS-A',   category: 'COSHH',           inspector: 'Aisha Musa',      lastDate: '2026-06-22', nextDate: '2026-07-22', status: 'pending', findings: 'Bunding integrity check pending.' },
  { id: 'INP-008', equipment: 'Electrical Panel B-07', category: 'Electrical',      inspector: 'Danjuma Yusuf',   lastDate: '2026-06-17', nextDate: '2026-09-17', status: 'failed',  findings: 'Exposed wiring found. Panel isolated. Repair in progress.' },
]

export const PTWS: PTW[] = [
  { id: 'PTW-2026-041', type: 'Hot Work',         location: 'Dispatch Yard',     crew: 'Biodun Adekunle, Tunde Bello',    supervisor: 'Chika Obi',       validFrom: '2026-06-29', validTo: '2026-06-29', status: 'active',    description: 'Welding repair of trailer hitch bracket. Fire watch in place.' },
  { id: 'PTW-2026-040', type: 'Confined Space',   location: 'Tank Farm TF-03',   crew: 'Segun Folarin, Kenneth Nwosu',    supervisor: 'Yinka Adeyemi',   validFrom: '2026-06-28', validTo: '2026-06-28', status: 'closed',    description: 'Entry for inspection and sludge removal. BA sets issued.' },
  { id: 'PTW-2026-039', type: 'Electrical',       location: 'Panel Room B',      crew: 'Danjuma Yusuf',                   supervisor: 'Femi Emmanuel',   validFrom: '2026-06-28', validTo: '2026-06-28', status: 'closed',    description: 'Repair of exposed wiring on Panel B-07. LOTO applied.' },
  { id: 'PTW-2026-042', type: 'Lifting',          location: 'Container Yard',    crew: 'Emeka Okonkwo, Ngozi Eze',        supervisor: 'Chika Obi',       validFrom: '2026-06-30', validTo: '2026-06-30', status: 'pending',   description: 'Crane lift of 12T container to vessel hold. Banksman assigned.' },
  { id: 'PTW-2026-043', type: 'Working at Height',location: 'Mezzanine MZ-02',   crew: 'Segun Folarin',                   supervisor: 'Yinka Adeyemi',   validFrom: '2026-07-01', validTo: '2026-07-01', status: 'pending',   description: 'Guardrail inspection and repair at 4.2m. Full harness required.' },
  { id: 'PTW-2026-038', type: 'Cold Work',        location: 'Chemical Store CS-A',crew: 'Aisha Musa, Kenneth Nwosu',      supervisor: 'Femi Emmanuel',   validFrom: '2026-06-27', validTo: '2026-06-27', status: 'suspended', description: 'Bunding repair - suspended pending re-assessment of chemical inventory.' },
]

export const INC_TYPE_OPTIONS = [
  'Near Miss','First Aid','Equipment Damage','Slip / Trip',
  'Chemical Spill','Fire / Explosion','Struck By Object','Electrical Hazard',
  'Working at Height','Other',
].map(v => ({ value: v, label: v }))

export const LOCATION_OPTIONS = [
  'Warehouse Bay 1','Warehouse Bay 2','Warehouse Bay 3',
  'Dispatch Yard','Loading Bay 1','Loading Bay 2',
  'Container Yard','Chemical Store','Panel Room B',
  'Mezzanine Level 2','Tank Farm','Maintenance Workshop','Other',
].map(v => ({ value: v, label: v }))

export const SEV_OPTIONS = ['low','medium','high','critical'] as Severity[]
export const SEV_LABELS: Record<Severity, string> = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' }
