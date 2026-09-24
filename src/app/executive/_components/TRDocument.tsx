'use client'

import { useRef } from 'react'
import { X, Printer } from 'lucide-react'
import { COORDINATOR_CONFIG } from '@/lib/coordinator-config'
import type { WorkOrder } from '@/lib/mock-data'

interface Props {
  order: WorkOrder
  onClose: () => void
}

function fmtDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' AM'
}

function fmtPrintDate() {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Derive a reference number from the work order number (e.g. WO-24-441 → 25062024 style)
// We'll use the work order id digits as a compact ref
function deriveTRRef(order: WorkOrder): string {
  // Use the workOrderNumber directly (e.g. WO-24-441)
  return order.workOrderNumber.replace('WO-', '').replace('-', '')
}

export function TRDocument({ order, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    const prevTitle = document.title
    document.title = `TR-${order.workOrderNumber} — ${order.destination}`
    window.print()
    document.title = prevTitle
  }

  const { baseName, coordinators } = COORDINATOR_CONFIG
  const trRef = deriveTRRef(order)

  return (
    <>
      {/* Print styles injected into head at runtime */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 1.2cm; }
          body * { visibility: hidden !important; }
          #tr-document-print, #tr-document-print * { visibility: visible !important; }
          #tr-document-print {
            position: fixed !important;
            inset: 0 !important;
            background: white !important;
            z-index: 9999 !important;
            padding: 0 !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Modal overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 no-print">
        <div className="bg-white rounded-card shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">

          {/* Modal header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-default shrink-0 no-print">
            <div>
              <p className="text-xs text-gray-400 font-medium">Temporary Requisition Document</p>
              <p className="text-sm font-bold text-gray-900 font-mono">{order.workOrderNumber} — {order.destination}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 h-8 px-3 rounded-button bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
              >
                <Printer size={13} />
                Print / Save PDF
              </button>
              <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable document preview */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <div id="tr-document-print" ref={printRef}
              style={{ background: 'white', fontFamily: 'Arial, sans-serif', fontSize: '11pt', color: '#000' }}>

              {/* Print-only top strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8pt', marginBottom: '4px', color: '#555' }}>
                <span>{fmtPrintDate()}</span>
                <span>Temporary Requisition</span>
                <span>&nbsp;</span>
              </div>

              {/* Main bordered form */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #000' }}>
                <tbody>

                  {/* ── Row 1: Logo | Title | Company ── */}
                  <tr>
                    <td style={{ border: '1.5px solid #000', padding: '8px 12px', width: '15%', verticalAlign: 'middle' }}>
                      {/* TotalEnergies logo */}
                      <div style={{ textAlign: 'center' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://www.citypng.com/photo/26268/hd-total-energies-logo-transparent-png"
                          alt="TotalEnergies"
                          style={{ maxWidth: '90px', maxHeight: '50px', objectFit: 'contain' }}
                        />
                      </div>
                    </td>
                    <td style={{ border: '1.5px solid #000', padding: '12px', textAlign: 'center', width: '55%', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '15pt', fontWeight: 'bold', textDecoration: 'underline', letterSpacing: '1px' }}>
                        TEMPORARY REQUISITION
                      </div>
                    </td>
                    <td style={{ border: '1.5px solid #000', padding: '8px 12px', textAlign: 'right', width: '30%', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '10pt', lineHeight: '1.4' }}>
                        TOTALENERGIES EP<br />NIG. LTD.
                      </div>
                    </td>
                  </tr>

                  {/* ── Row 2: Destination | Ref | Requester info ── */}
                  <tr>
                    <td style={{ border: '1.5px solid #000', padding: '10px 12px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '9pt' }}>DESTINATION:</div>
                      <div style={{ marginTop: '6px', fontSize: '11pt', fontWeight: 'bold' }}>
                        {order.destination.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ border: '1.5px solid #000', padding: '10px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '13pt', fontWeight: 'bold', letterSpacing: '2px' }}>{trRef}</div>
                    </td>
                    <td style={{ border: '1.5px solid #000', padding: '10px 12px', verticalAlign: 'top', fontSize: '9.5pt' }}>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>REQUESTED BY:</strong> {order.requestedByName ?? '—'}
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Department / Entity:</strong><br />{order.entity ?? order.trDepartment ?? '—'}
                      </div>
                      <div>
                        <strong>Date:</strong> {fmtDateTime(order.createdAt)}
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>

              {/* ── Items table ── */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #000', borderTop: 'none', marginTop: '0' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    {['Material', 'Quantity', 'Description', 'Plant', 'Bin Loc', 'PR/WO number & Remarks'].map(h => (
                      <th key={h} style={{
                        border: '1px solid #000', padding: '7px 10px', textAlign: 'center',
                        fontWeight: 'bold', fontSize: '9.5pt',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td style={{ border: '1px solid #000', padding: '7px 10px', textAlign: 'center', minWidth: '60px' }}>&nbsp;</td>
                      <td style={{ border: '1px solid #000', padding: '7px 10px', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ border: '1px solid #000', padding: '7px 10px' }}>{item.description}</td>
                      <td style={{ border: '1px solid #000', padding: '7px 10px', textAlign: 'center' }}>{item.plant ?? ''}</td>
                      <td style={{ border: '1px solid #000', padding: '7px 10px', textAlign: 'center' }}>{item.binLoc ?? ''}</td>
                      <td style={{ border: '1px solid #000', padding: '7px 10px' }}>{item.partNumber ?? ''}</td>
                    </tr>
                  ))}
                  {/* Blank filler rows so the form looks structured even with few items */}
                  {Array.from({ length: Math.max(0, 5 - order.items.length) }).map((_, i) => (
                    <tr key={`blank-${i}`}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} style={{ border: '1px solid #000', padding: '7px 10px', height: '28px' }}>&nbsp;</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ── Approval section ── */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #000', borderTop: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '10pt', marginBottom: '6px' }}>
                        Approved by the {baseName} Logistics Coordinator
                      </div>
                      {coordinators.map((name, i) => (
                        <div key={i} style={{ fontSize: '9.5pt', color: '#333', marginTop: i > 0 ? '2px' : '0' }}>
                          {name}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Print footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7pt', color: '#888', marginTop: '6px' }}>
                <span>about:blank</span>
                <span>1/1</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
