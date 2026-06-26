'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CONTAINERS, WORK_ORDERS, type Container } from '@/lib/mock-data'

const STATUS_CONFIG = {
  available:   { label: 'Available',   color: '#22C55E', bg: '#F0FDF4', border: '#22C55E33' },
  'in-use':    { label: 'In Use',      color: '#3B82F6', bg: '#EFF6FF', border: '#3B82F633' },
  inspection:  { label: 'Inspection',  color: '#F59E0B', bg: '#FFFBEB', border: '#F59E0B33' },
} as const

type ContainerStatus = keyof typeof STATUS_CONFIG

interface EditModalProps {
  container: Container
  onSave: (c: Container) => void
  onClose: () => void
}

function EditModal({ container, onSave, onClose }: EditModalProps) {
  const [status, setStatus]   = useState<ContainerStatus>(container.status as ContainerStatus)
  const [yard, setYard]       = useState(container.yard)
  const [notes, setNotes]     = useState(container.notes ?? '')

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-sm mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Edit Container <span className="font-mono text-brand-500">{container.id}</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as ContainerStatus)}
              className="w-full border border-border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="available">Available</option>
              <option value="in-use">In Use</option>
              <option value="inspection">Inspection / Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Yard Location</label>
            <input
              value={yard}
              onChange={e => setYard(e.target.value)}
              className="w-full border border-border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onSave({ ...container, status, yard, notes })}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ContainerFleetPage() {
  const [containers, setContainers] = useState<Container[]>(CONTAINERS)
  const [editingContainer, setEditingContainer] = useState<Container | null>(null)

  const available   = containers.filter(c => c.status === 'available').length
  const inUse       = containers.filter(c => c.status === 'in-use').length
  const inspection  = containers.filter(c => c.status === 'inspection').length

  function getUsingOrder(containerId: string) {
    return WORK_ORDERS.find(o => o.containerId === containerId)
  }

  function handleMarkAvailable(id: string) {
    setContainers(prev => prev.map(c =>
      c.id === id ? { ...c, status: 'available', workOrderId: undefined } : c
    ))
  }

  function handleScheduleInspection(id: string) {
    setContainers(prev => prev.map(c =>
      c.id === id ? { ...c, status: 'inspection' } : c
    ))
  }

  function handleSave(updated: Container) {
    setContainers(prev => prev.map(c => c.id === updated.id ? updated : c))
    setEditingContainer(null)
  }

  return (
    <AppShell
      role="qaqc"
      currentPath="/qaqc/containers"
      title="Container Fleet"
      breadcrumb={[{ label: 'QAQC Dashboard', href: '/qaqc' }]}
    >
      {/* STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Containers"  value={containers.length} color="#6B7280" />
        <StatCard label="Available"          value={available}         color="#22C55E" />
        <StatCard label="In Use"             value={inUse}             color="#3B82F6" />
        <StatCard label="Inspection"         value={inspection}        color="#F59E0B" />
      </div>

      <SectionTitle title="Container Fleet" count={containers.length} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {containers.map(c => {
          const cfg = STATUS_CONFIG[c.status as ContainerStatus] ?? STATUS_CONFIG.available
          const usingOrder = c.status === 'in-use' ? getUsingOrder(c.id) : null

          return (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono font-bold text-gray-900 text-base">{c.id}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.size} · {c.yard}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full border"
                  style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                >
                  {cfg.label}
                </span>
              </div>

              {c.status === 'in-use' && usingOrder && (
                <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-2 mb-3">
                  <p className="text-xs text-blue-700">
                    In use for <span className="font-mono font-semibold">{usingOrder.id}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    {usingOrder.destination} · Packed by {usingOrder.assignedToName ?? 'Unassigned'}
                  </p>
                </div>
              )}

              {c.notes && (
                <p className="text-xs text-gray-500 mb-3 italic">"{c.notes}"</p>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setEditingContainer(c)}
                  className="text-xs font-medium text-brand-500 hover:text-brand-600 border border-brand-200 hover:border-brand-400 px-2.5 py-1 rounded transition-colors duration-150"
                >
                  Edit
                </button>
                {c.status !== 'inspection' && (
                  <button
                    onClick={() => handleScheduleInspection(c.id)}
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-400 px-2.5 py-1 rounded transition-colors duration-150"
                  >
                    Schedule Inspection
                  </button>
                )}
                {c.status !== 'available' && c.status !== 'in-use' && (
                  <button
                    onClick={() => handleMarkAvailable(c.id)}
                    className="text-xs font-medium text-green-600 hover:text-green-700 border border-green-200 hover:border-green-400 px-2.5 py-1 rounded transition-colors duration-150"
                  >
                    Mark Available
                  </button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {editingContainer && (
        <EditModal
          container={editingContainer}
          onSave={handleSave}
          onClose={() => setEditingContainer(null)}
        />
      )}
    </AppShell>
  )
}
