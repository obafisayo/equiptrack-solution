'use client'

import { useState } from 'react'
import { CheckCircle2, AlertTriangle, Clock, FileText } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { Button } from '@/components/ui/Button'

type PTWStatus = 'active' | 'pending_approval' | 'expired' | 'cancelled' | 'completed'
type PTWType   = 'Hot Work' | 'Cold Work' | 'Confined Space' | 'Electrical' | 'Working at Height' | 'Lifting Operations'

interface PTW {
  id: string; type: PTWType; location: string; description: string
  issuedTo: string; approvedBy?: string; issuedDate: string; expiryDate: string
  status: PTWStatus; hazards: string[]
}

const STATUS_CFG: Record<PTWStatus, { badge: string; label: string; pulse?: boolean }> = {
  active:           { badge: 'bg-green-50 text-green-700 border-green-200',   label: 'Active',           pulse: true },
  pending_approval: { badge: 'bg-amber-50 text-amber-700 border-amber-200',   label: 'Pending Approval'              },
  expired:          { badge: 'bg-red-50 text-red-700 border-red-200',         label: 'Expired'                       },
  cancelled:        { badge: 'bg-neutral-50 text-neutral-500 border-neutral-200', label: 'Cancelled'                },
  completed:        { badge: 'bg-blue-50 text-blue-700 border-blue-200',      label: 'Completed'                     },
}

const INIT_PTWS: PTW[] = [
  { id:'PTW-2026-001', type:'Hot Work',          location:'Mud Pump Room B',        description:'Welding repairs on pump casing',     issuedTo:'Segun Folarin',  approvedBy:'HSE Manager',    issuedDate:'2026-06-29', expiryDate:'2026-06-29', status:'active',           hazards:['Fire','Explosion','Burns'] },
  { id:'PTW-2026-002', type:'Confined Space',    location:'Diesel Tank — Bottom',   description:'Inspection and cleaning of tank',    issuedTo:'Kenneth Nwosu',  approvedBy:'Safety Officer', issuedDate:'2026-06-29', expiryDate:'2026-06-30', status:'active',           hazards:['Asphyxiation','Toxic Gas'] },
  { id:'PTW-2026-003', type:'Working at Height', location:'Derrick Level 3',        description:'Cable routing and inspection',       issuedTo:'Biodun Adekunle',approvedBy:undefined,        issuedDate:'2026-06-29', expiryDate:'2026-06-30', status:'pending_approval', hazards:['Fall from height'] },
  { id:'PTW-2026-004', type:'Electrical',        location:'Main Switchboard Room',  description:'Isolation of MCB-44 for maintenance',issuedTo:'Danjuma Yusuf',  approvedBy:'Electrical Lead', issuedDate:'2026-06-28', expiryDate:'2026-06-28', status:'expired',          hazards:['Electrocution','Arc Flash'] },
  { id:'PTW-2026-005', type:'Lifting Operations',location:'Drill Floor',            description:'Crane lift — 12-ton pipe section',   issuedTo:'Kola Martins',   approvedBy:'Crane Supervisor',issuedDate:'2026-06-27', expiryDate:'2026-06-27', status:'completed',        hazards:['Dropped Object','Crush'] },
]

export default function SafetyPTWPage() {
  const [ptws, setPtws] = useState<PTW[]>(INIT_PTWS)
  const active   = ptws.filter(p => p.status === 'active').length
  const pending  = ptws.filter(p => p.status === 'pending_approval').length
  const expired  = ptws.filter(p => p.status === 'expired').length
  const done     = ptws.filter(p => p.status === 'completed').length

  function approve(id: string) {
    setPtws(prev => prev.map(p => p.id === id ? {...p, status:'active', approvedBy:'Safety Officer'} : p))
  }

  return (
    <AppShell
      role="safety"
      currentPath="/safety/ptw"
      title="Permit to Work"
      breadcrumb={[{label:'Home',href:'/'},{label:'Safety',href:'/safety'},{label:'Permit to Work'}]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Permits"  value={active}  color="#10B981" icon={CheckCircle2}/>
        <StatCard label="Pending Approval"value={pending} color={pending>0?'#F59E0B':'#22C55E'} icon={Clock}/>
        <StatCard label="Expired Today"   value={expired} color={expired>0?'#EF4444':'#22C55E'} icon={AlertTriangle}/>
        <StatCard label="Completed"       value={done}    color="#3B82F6" icon={FileText}/>
      </div>

      <div className="space-y-3">
        {ptws.map(p => {
          const sc = STATUS_CFG[p.status]
          return (
            <div key={p.id} className={`bg-white rounded-card border shadow-card p-5 ${p.status==='pending_approval'?'border-amber-200':'border-border-default'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-brand-500">{p.id}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${sc.badge}`}>
                      {sc.pulse && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>}
                      {sc.label}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded-full">{p.type}</span>
                  </div>
                  <p className="text-sm font-bold text-neutral-900">{p.description}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{p.location}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400 flex-wrap">
                    <span>Issued to: <strong className="text-neutral-700">{p.issuedTo}</strong></span>
                    {p.approvedBy && <span>Approved by: <strong className="text-neutral-700">{p.approvedBy}</strong></span>}
                    <span>Expires: <strong className={p.status==='expired'?'text-red-600':'text-neutral-700'}>{p.expiryDate}</strong></span>
                  </div>
                  {p.hazards.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <AlertTriangle size={11} className="text-amber-500 shrink-0"/>
                      {p.hazards.map(h => (
                        <span key={h} className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">{h}</span>
                      ))}
                    </div>
                  )}
                </div>
                {p.status === 'pending_approval' && (
                  <Button variant="brand" size="sm" onClick={() => approve(p.id)}>
                    Approve PTW
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
