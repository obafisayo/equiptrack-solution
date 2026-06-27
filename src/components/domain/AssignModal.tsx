'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { WorkOrder, Personnel } from '@/lib/mock-data'

interface AssignModalProps {
  order: WorkOrder | null
  personnel: Personnel[]
  onConfirm: (personnelId: string, name: string) => void
  onClose: () => void
}

export function AssignModal({ order, personnel, onConfirm, onClose }: AssignModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(order?.assignedTo ?? null)

  if (!order) return null

  const selected = personnel.find(p => p.id === selectedId)

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[450] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="fixed inset-0 z-[460] flex items-end sm:items-center sm:p-4">
        <div
          className="bg-white flex flex-col w-full sm:w-[480px] rounded-t-2xl sm:rounded-xl"
          style={{
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            maxHeight: '90vh',
          }}
        >
          {/* Header */}
          <div
            className="flex items-start justify-between gap-4 shrink-0"
            style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}
          >
            <div className="min-w-0">
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>
                {order.assignedTo ? 'Reassign' : 'Assign'} Work Order
              </h2>
              <p
                className="font-mono-id"
                style={{ fontSize: 12, color: '#F04A4A', margin: 0 }}
              >
                {order.id}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center rounded-lg transition-colors duration-150 shrink-0"
              style={{ width: 32, height: 32, color: '#6B7280', background: 'transparent' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F3F4F6')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Personnel list */}
          <div
            className="overflow-y-auto flex-1"
            style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {personnel.map(p => {
              const loadPct = p.capacity > 0 ? (p.active / p.capacity) * 100 : 0
              const isOverloaded = loadPct > 80
              const isSelected = p.id === selectedId
              const isCurrentlyAssigned = p.id === order.assignedTo

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={[
                    'w-full text-left rounded-lg border transition-all duration-150',
                    isSelected
                      ? 'border-brand-500 bg-brand-50'
                      : isOverloaded
                      ? 'border-amber-200 bg-amber-50/50 hover:border-amber-300'
                      : 'border-border-default hover:border-gray-300 hover:bg-gray-50',
                  ].join(' ')}
                  style={{ padding: 12 }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                      {isCurrentlyAssigned && (
                        <span style={{ fontSize: 11, color: '#F04A4A', fontWeight: 500 }}>(current)</span>
                      )}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: isOverloaded ? '#F59E0B' : '#22C55E' }}>
                      {p.active}/{p.capacity}
                    </span>
                  </div>
                  {/* Load bar */}
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: '#F3F4F6' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(loadPct, 100)}%`,
                        background: isOverloaded ? '#F59E0B' : '#22C55E',
                      }}
                    />
                  </div>
                  {isOverloaded && (
                    <p style={{ fontSize: 10, color: '#D97706', marginTop: 4, fontWeight: 600, letterSpacing: '0.04em' }}>
                      HIGH LOAD
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end shrink-0"
            style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', gap: 8 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="transition-colors duration-150"
              style={{
                height: 36, padding: '0 16px',
                background: '#fff', color: '#374151',
                border: '1px solid #E2E8F0', borderRadius: 8,
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => selected && onConfirm(selected.id, selected.name)}
              disabled={!selectedId}
              className="transition-colors duration-150"
              style={{
                height: 36, padding: '0 16px',
                background: selectedId ? '#111827' : '#9CA3AF',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 600,
                cursor: selectedId ? 'pointer' : 'not-allowed',
                opacity: selectedId ? 1 : 0.6,
              }}
              onMouseEnter={e => {
                if (selectedId) (e.currentTarget as HTMLElement).style.background = '#1F2937'
              }}
              onMouseLeave={e => {
                if (selectedId) (e.currentTarget as HTMLElement).style.background = '#111827'
              }}
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
