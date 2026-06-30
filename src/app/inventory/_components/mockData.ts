import type { StockItem, Movement } from './types'

export const INIT_STOCK: StockItem[] = [
  { id:'EQ-0012', name:'Drill Pipe — 5" 19.5ppf',    category:'Drilling',     qty:48,  reorderAt:20,  unit:'joints',  status:'ok',       location:'Bay 2-A',  lastUpdated:'2026-06-25', supplier:'Baker Hughes',      leadDays:14 },
  { id:'EQ-0037', name:'BOP Gasket Kit — 13.5"',     category:'Well Control', qty:4,   reorderAt:10,  unit:'kits',    status:'reorder',  location:'Bay 1-C',  lastUpdated:'2026-06-26', supplier:'NOV Nigeria',        leadDays:21 },
  { id:'EQ-0051', name:'Chemical — Barite Sacks',    category:'Drilling',     qty:210, reorderAt:100, unit:'sacks',   status:'ok',       location:'Chem Store',lastUpdated:'2026-06-27', supplier:'Halliburton NG',    leadDays:7  },
  { id:'EQ-0063', name:'Choke Manifold — 5000 PSI',  category:'Well Control', qty:2,   reorderAt:3,   unit:'units',   status:'critical', location:'Bay 3-B',  lastUpdated:'2026-06-20', supplier:'Cameron Int.',      leadDays:30 },
  { id:'EQ-0078', name:'Safety Valve — 4.5"',        category:'Safety',       qty:12,  reorderAt:5,   unit:'units',   status:'ok',       location:'Bay 2-B',  lastUpdated:'2026-06-24', supplier:'Weatherford NG',    leadDays:14 },
  { id:'EQ-0089', name:'Mud Pump Liner — 6.5"',      category:'Drilling',     qty:6,   reorderAt:8,   unit:'pieces',  status:'reorder',  location:'Bay 1-A',  lastUpdated:'2026-06-22', supplier:'National Oilwell',  leadDays:21 },
  { id:'EQ-0102', name:'Flex Hose — 3" x 20ft',      category:'Piping',       qty:30,  reorderAt:15,  unit:'lengths', status:'ok',       location:'Bay 4-D',  lastUpdated:'2026-06-26', supplier:'Parker Hannifin',   leadDays:10 },
  { id:'EQ-0115', name:'Generator — 250 KVA',        category:'Power',        qty:1,   reorderAt:2,   unit:'units',   status:'critical', location:'Power Bay', lastUpdated:'2026-06-18', supplier:'Aggreko',           leadDays:45 },
  { id:'EQ-0128', name:'BOP Accumulator Unit',       category:'Well Control', qty:3,   reorderAt:2,   unit:'units',   status:'ok',       location:'Bay 3-A',  lastUpdated:'2026-06-23', supplier:'Cameron Int.',      leadDays:30 },
  { id:'EQ-0133', name:'Drill Bit — 12.25" PDC',     category:'Drilling',     qty:8,   reorderAt:4,   unit:'pieces',  status:'ok',       location:'Bay 2-C',  lastUpdated:'2026-06-27', supplier:'Schlumberger NG',   leadDays:14 },
]

export const INIT_MOVEMENTS: Movement[] = [
  { id:'MOV-1001', itemId:'EQ-0012', itemName:'Drill Pipe — 5" 19.5ppf',  type:'Issue',      qty:12, date:'2026-06-27', time:'14:30', by:'Emeka Okonkwo',   reference:'WO-0087', note:'Issued to Bonga FPSO expedition.' },
  { id:'MOV-1002', itemId:'EQ-0051', itemName:'Chemical — Barite Sacks',  type:'Receive',    qty:50, date:'2026-06-26', time:'09:15', by:'Ngozi Eze',       reference:'PO-2241', note:'Received from Halliburton delivery.' },
  { id:'MOV-1003', itemId:'EQ-0037', itemName:'BOP Gasket Kit — 13.5"',   type:'Issue',      qty:2,  date:'2026-06-25', time:'11:00', by:'Tunde Bello',     reference:'WO-0085', note:'Issued for BOP maintenance.' },
  { id:'MOV-1004', itemId:'EQ-0078', itemName:'Safety Valve — 4.5"',      type:'Transfer',   qty:3,  date:'2026-06-24', time:'16:45', by:'Ngozi Eze',       reference:'TRF-099', note:'Transferred to Bay 2-B from Bay 4.' },
  { id:'MOV-1005', itemId:'EQ-0063', itemName:'Choke Manifold — 5000 PSI',type:'Adjustment', qty:-1, date:'2026-06-20', time:'08:00', by:'Segun Folarin',   reference:'ADJ-012', note:'One unit sent for off-site repair.' },
  { id:'MOV-1006', itemId:'EQ-0102', itemName:'Flex Hose — 3" x 20ft',    type:'Receive',    qty:10, date:'2026-06-19', time:'10:30', by:'Ngozi Eze',       reference:'PO-2238', note:'Partial PO delivery received.' },
  { id:'MOV-1007', itemId:'EQ-0133', itemName:'Drill Bit — 12.25" PDC',   type:'Issue',      qty:2,  date:'2026-06-18', time:'07:00', by:'Biodun Adekunle', reference:'WO-0081', note:'Dispatched on MV Seplat Pride.' },
]
