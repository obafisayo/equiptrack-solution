import type { WorkOrder, ScheduleItem, MaintPriority } from './types'

export const INIT_WOS: WorkOrder[] = [
  { id:'MNT-001', equipment:'Mud Pump #3',          category:'Drilling',     task:'Liner seal replacement',        type:'Corrective',  priority:'high',     status:'in_progress', assignedTo:'Segun Folarin',   dueDate:'2026-06-29', startedAt:'2026-06-27', estimatedHours:4,  techNote:'Seals showing excessive wear. Replacement parts in stock at Bay 1-A.' },
  { id:'MNT-002', equipment:'Generator Set A',       category:'Power',        task:'Oil & filter change',           type:'Preventive',  priority:'medium',   status:'pending',     assignedTo:'Kenneth Nwosu',   dueDate:'2026-06-30', estimatedHours:2   },
  { id:'MNT-003', equipment:'BOP Stack — 13.5"',    category:'Well Control', task:'Annual pressure test',          type:'Inspection',  priority:'high',     status:'overdue',     assignedTo:'Segun Folarin',   dueDate:'2026-06-27', estimatedHours:6   },
  { id:'MNT-004', equipment:'Choke Manifold',        category:'Well Control', task:'Valve seat inspection',         type:'Inspection',  priority:'low',      status:'pending',     assignedTo:'Kenneth Nwosu',   dueDate:'2026-07-04', estimatedHours:3   },
  { id:'MNT-005', equipment:'Crane #2',              category:'Lifting',      task:'Hydraulic hose check',          type:'Preventive',  priority:'medium',   status:'pending',     assignedTo:'Danjuma Yusuf',   dueDate:'2026-07-01', estimatedHours:2   },
  { id:'MNT-006', equipment:'Separator Unit',        category:'Process',      task:'Safety valve calibration',      type:'Calibration', priority:'high',     status:'pending',     assignedTo:'Segun Folarin',   dueDate:'2026-07-02', estimatedHours:3   },
  { id:'MNT-007', equipment:'Drill Rig #4',          category:'Drilling',     task:'Derrick structural inspection', type:'Inspection',  priority:'critical', status:'overdue',     assignedTo:'Segun Folarin',   dueDate:'2026-06-25', estimatedHours:8   },
]

export const INIT_HISTORY: WorkOrder[] = [
  { id:'MNT-H001', equipment:'Mud Pump #1',    category:'Drilling',     task:'Piston rod replacement',    type:'Corrective',  priority:'high',   status:'completed', assignedTo:'Segun Folarin',  dueDate:'2026-06-20', completedAt:'2026-06-20', estimatedHours:5, actualHours:4.5, techNote:'Replaced worn piston rod, tested at 3000 PSI. All readings within tolerance.' },
  { id:'MNT-H002', equipment:'Separator Unit', category:'Process',      task:'Safety valve service',      type:'Calibration', priority:'medium', status:'completed', assignedTo:'Kenneth Nwosu', dueDate:'2026-06-18', completedAt:'2026-06-18', estimatedHours:3, actualHours:2.5, techNote:'Calibrated at 850 PSI, replaced spring, verified set point.' },
  { id:'MNT-H003', equipment:'Drill Rig #4',  category:'Drilling',     task:'Derrick inspection',        type:'Inspection',  priority:'low',    status:'completed', assignedTo:'Segun Folarin',  dueDate:'2026-06-15', completedAt:'2026-06-15', estimatedHours:8, actualHours:7,   techNote:'No structural defects found. Greased all pivot points. Next inspection due Oct.' },
  { id:'MNT-H004', equipment:'Crane #1',       category:'Lifting',      task:'Annual slewing ring check', type:'Inspection',  priority:'medium', status:'completed', assignedTo:'Danjuma Yusuf', dueDate:'2026-06-10', completedAt:'2026-06-11', estimatedHours:4, actualHours:5,   techNote:'Minor wear detected on slewing ring. Flagged for replacement at next overhaul.' },
]

export const SCHEDULE: ScheduleItem[] = [
  { date:'2026-06-30', wo:'MNT-002', equipment:'Generator Set A',    task:'Oil & filter change',   priority:'medium' as MaintPriority, assignedTo:'Kenneth Nwosu' },
  { date:'2026-07-01', wo:'MNT-005', equipment:'Crane #2',           task:'Hydraulic hose check',  priority:'medium' as MaintPriority, assignedTo:'Danjuma Yusuf' },
  { date:'2026-07-02', wo:'MNT-006', equipment:'Separator Unit',     task:'Safety valve calibration',priority:'high' as MaintPriority, assignedTo:'Segun Folarin' },
  { date:'2026-07-04', wo:'MNT-004', equipment:'Choke Manifold',     task:'Valve seat inspection', priority:'low'    as MaintPriority, assignedTo:'Kenneth Nwosu' },
  { date:'2026-07-10', wo:'MNT-SCH-01', equipment:'Mud Pump #2',    task:'Liner check — routine', priority:'low'    as MaintPriority, assignedTo:'Segun Folarin' },
  { date:'2026-07-15', wo:'MNT-SCH-02', equipment:'BOP Stack — 13.5"',task:'Hydraulic pressure test',priority:'high' as MaintPriority,assignedTo:'Segun Folarin' },
  { date:'2026-07-20', wo:'MNT-SCH-03', equipment:'Generator Set B', task:'Full service — 500hr',  priority:'medium' as MaintPriority, assignedTo:'Kenneth Nwosu' },
]
