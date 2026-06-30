'use client'

import { type WorkOrder, type Personnel } from '@/lib/mock-data'
import { fmtHours, STAGE_SLA_HOURS } from '@/config/sla'
import { Avatar } from './Avatar'
import { LoadBar } from './LoadBar'

interface PersonnelCardProps {
  person: Personnel
  orders: WorkOrder[]
  selectedOrderId: string | null
  onSelectOrder: (id: string) => void
  onReassign: (person: Personnel) => void
}

export function PersonnelCard({ person, orders, selectedOrderId, onSelectOrder, onReassign }: PersonnelCardProps) {
  const active = orders.length
  const pct = Math.round((active / person.capacity) * 100)
  const isOverloaded = pct > 80
  const isWarning = pct > 60 && pct <= 80

  return (
    <div
      className={`bg-white rounded-card border shadow-card p-5 ${
        isOverloaded ? 'border-status-critical/40' : 'border-border-default'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar name={person.name} size={36} />
          <div>
            <p className="font-semibold text-gray-900 text-sm">{person.name}</p>
            <p className="text-xs text-gray-500">Warehouse Personnel</p>
          </div>
        </div>
        {isOverloaded && (
          <span className="text-xs font-semibold text-status-critical bg-status-critical-bg px-2 py-0.5 rounded-full">
            OVERLOADED
          </span>
        )}
        {isWarning && !isOverloaded && (
          <span className="text-xs font-semibold text-status-medium bg-status-medium-bg px-2 py-0.5 rounded-full">
            HIGH LOAD
          </span>
        )}
      </div>

      {/* Load bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500 font-medium">Active Orders</span>
          <span className={`font-bold ${isOverloaded ? 'text-status-critical' : isWarning ? 'text-status-medium' : 'text-gray-700'}`}>
            {active} / {person.capacity}
          </span>
        </div>
        <LoadBar pct={pct} />
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-2">No active orders</p>
      ) : (
        <div className="space-y-1 max-h-36 overflow-y-auto mb-3">
          {orders.map(o => {
            const sla = o.elapsedHours > (STAGE_SLA_HOURS[o.stage] ?? Infinity)
            return (
              <button
                key={o.id}
                onClick={() => onSelectOrder(o.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left hover:bg-gray-50 transition-colors ${
                  selectedOrderId === o.id ? 'bg-red-50' : ''
                }`}
              >
                <span className="font-mono-id text-brand-500 text-xs font-semibold">{o.id}</span>
                <span className="text-xs text-gray-500 truncate mx-2 flex-1">{o.destination}</span>
                <span className={`text-xs font-semibold ${sla ? 'text-status-critical' : 'text-gray-400'}`}>
                  {fmtHours(o.elapsedHours)}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Reassign button */}
      {orders.length > 0 && (
        <button
          onClick={() => onReassign(person)}
          className="w-full h-8 rounded-button border border-border-default text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-brand-300 hover:text-brand-500 transition-colors"
        >
          Reassign Orders
        </button>
      )}
    </div>
  )
}
