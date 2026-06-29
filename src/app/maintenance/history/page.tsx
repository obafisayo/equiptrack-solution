'use client'

import AppShell from '@/components/layout/AppShell'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { CheckCircle2, Wrench, Calendar } from 'lucide-react'

export default function MaintenanceHistoryPage() {
  const historyData = [
    { id: 'MNT-10024', item: 'Heavy-Duty Pump A2', type: 'Preventive', date: 'Oct 12, 2026', technician: 'Segun Folarin', duration: '4h 30m' },
    { id: 'MNT-10023', item: 'Electric Drill X', type: 'Repair', date: 'Oct 10, 2026', technician: 'Segun Folarin', duration: '1h 15m' },
    { id: 'MNT-10022', item: 'Safety Harness Batch', type: 'Inspection', date: 'Oct 05, 2026', technician: 'Segun Folarin', duration: '6h 00m' },
    { id: 'MNT-10021', item: 'Generator Unit G-3', type: 'Overhaul', date: 'Sep 28, 2026', technician: 'External Vendor', duration: '2 Days' },
  ]

  return (
    <AppShell
      role="maintenance"
      currentPath="/maintenance/history"
      title="Repair History"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Maintenance Tasks', href: '/maintenance' },
        { label: 'Repair History' }
      ]}
    >
      <div className="space-y-6">
        <SectionTitle title="Historical Maintenance Log" count={historyData.length} />
        
        <div className="bg-white border border-border-default rounded-card shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-border-default text-neutral-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Work Order</th>
                <th className="px-6 py-4">Equipment</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date Completed</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {historyData.map((record) => (
                <tr key={record.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-bold font-mono text-brand-600">{record.id}</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{record.item}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md text-xs font-bold w-fit">
                      <Wrench size={12} /> {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-600 flex items-center gap-2">
                    <Calendar size={14} className="text-neutral-400"/> {record.date}
                  </td>
                  <td className="px-6 py-4 text-neutral-700">{record.technician}</td>
                  <td className="px-6 py-4 text-neutral-600 font-medium">{record.duration}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-status-success font-bold text-xs">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}
