import type { VesselEvent } from './types'

export const INIT_EVENTS: VesselEvent[] = [
  {
    id:'EVT-005-DEP', vesselId:'VSL-005', vesselName:'MV ESCRAVOS STAR',
    type:'Departure', date:'2026-06-22', time:'07:00', port:'Warri Port',
    destination:'Escravos Terminal', capacitySqM:479, bookedSqM:479,
    distribution:[{dept:'DRILL',units:144},{dept:'FOPS',units:335}],
    status:'in-transit', pic:'Grace Okonkwo', notes:'Departed 22 Jun -- fully loaded. ETA 28 Jun.',
  },
  {
    id:'EVT-001-DEP', vesselId:'VSL-001', vesselName:'MV SEPLAT PRIDE',
    type:'Departure', date:'2026-06-28', time:'08:00', port:'Warri Port',
    destination:'Bonga FPSO', capacitySqM:479, bookedSqM:306,
    distribution:[{dept:'DRILL',units:122},{dept:'FOPS',units:107},{dept:'ECP',units:77}],
    status:'loading', pic:'Grace Okonkwo', notes:'Loading in progress. Final manifest due 06:00.',
  },
  {
    id:'EVT-005-ARR', vesselId:'VSL-005', vesselName:'MV ESCRAVOS STAR',
    type:'Arrival', date:'2026-06-28', time:'16:00', port:'Escravos Terminal',
    destination:'Escravos Terminal', capacitySqM:479, bookedSqM:479,
    distribution:[{dept:'DRILL',units:144},{dept:'FOPS',units:335}],
    status:'in-transit', pic:'Grace Okonkwo', notes:'ETA 28 Jun. Confirm berth.',
  },
  {
    id:'EVT-002-DEP', vesselId:'VSL-002', vesselName:'MV NIGER DELTA',
    type:'Departure', date:'2026-06-30', time:'10:00', port:'Port Harcourt',
    destination:'Agbami FPSO', capacitySqM:413, bookedSqM:413,
    distribution:[{dept:'FOPS',units:248},{dept:'PROJECT',units:165}],
    status:'full', pic:'Grace Okonkwo', notes:'Vessel full. No further bookings.',
  },
  {
    id:'EVT-003-DEP', vesselId:'VSL-003', vesselName:'MV IJELE OFFSHORE',
    type:'Departure', date:'2026-07-03', time:'07:00', port:'Warri Port',
    destination:'Erha FPSO', capacitySqM:479, bookedSqM:143,
    distribution:[{dept:'DRILL',units:72},{dept:'TECHLOG',units:71}],
    status:'available', pic:'Grace Okonkwo', notes:'336 m2 still available.',
  },
  {
    id:'EVT-004-DEP', vesselId:'VSL-004', vesselName:'MV OML 25 RUNNER',
    type:'Departure', date:'2026-07-07', time:'09:00', port:'Port Harcourt',
    destination:'Forcados Terminal', capacitySqM:350, bookedSqM:0,
    distribution:[], status:'available', pic:'Grace Okonkwo', notes:'No cargo booked yet.',
  },
]
