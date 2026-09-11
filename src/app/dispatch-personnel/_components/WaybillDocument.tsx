'use client'

import { X, Printer } from 'lucide-react'
import { COORDINATOR_CONFIG } from '@/lib/coordinator-config'
import type { WorkOrder } from '@/lib/mock-data'

interface WaybillDocumentProps {
  order: WorkOrder
  mode: 'preview' | 'approved'   // preview = submit btn shown; approved = print only
  onClose: () => void
  onSubmit?: () => void           // only used in preview mode
}

function fmtWaybillDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).replace(/ /g, '-')
}

function fmtNow() {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }) + ' AM'
}

const PRINT_ID = 'waybill-doc-print'

const TD: React.CSSProperties = {
  border: '1px solid #000',
  padding: '4px 7px',
  fontSize: '8.5pt',
  verticalAlign: 'top',
}

const TH: React.CSSProperties = {
  ...TD,
  background: '#D9E1F2',
  fontWeight: 700,
  textAlign: 'center',
  fontSize: '7.5pt',
}

const LABEL: React.CSSProperties = {
  fontSize: '7pt',
  color: '#555',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  display: 'block',
  marginBottom: 2,
}

export function WaybillDocument({ order, mode, onClose, onSubmit }: WaybillDocumentProps) {
  const { baseName, coordinators } = COORDINATOR_CONFIG
  const coordinator = coordinators[0] ?? 'Kenneth Omireh'
  const nowStr = fmtNow()
  const dateStr = fmtWaybillDate(order.createdAt)
  const origin = `ONNE FLT`

  function handlePrint() {
    const prev = document.title
    document.title = `Waybill ${order.waybillNumber ?? ''} — ${order.destination}`
    window.print()
    document.title = prev
  }

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 1cm; }
          body * { visibility: hidden !important; }
          #${PRINT_ID}, #${PRINT_ID} * { visibility: visible !important; }
          #${PRINT_ID} {
            position: fixed !important;
            inset: 0 !important;
            background: white !important;
            z-index: 9999 !important;
            padding: 0 !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 no-print">
        <div className="bg-white rounded-card shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">

          {/* Modal toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-default shrink-0 no-print">
            <div>
              <p className="text-xs text-gray-400">Freight Waybill</p>
              <p className="text-sm font-bold text-gray-900 font-mono">
                {order.waybillNumber ?? 'Preview'} — {order.destination}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 h-8 px-3 rounded-button bg-gray-800 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                <Printer size={13} />
                Print
              </button>
              {mode === 'preview' && onSubmit && (
                <button
                  type="button"
                  onClick={onSubmit}
                  className="flex items-center gap-1.5 h-8 px-4 rounded-button bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
                >
                  Submit for Executive Approval
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Document body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div id={PRINT_ID} style={{ fontFamily: 'Arial, sans-serif', background: 'white', padding: 0 }}>

              {/* ── Page header ────────────────────────────────────────────── */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ border: 'none', padding: '0 0 4px 0', width: '60%' }}>
                      <div style={{ fontSize: '16pt', fontWeight: 900, color: '#E2001A', letterSpacing: '-0.5px', lineHeight: 1 }}>
                        TotalEnergies
                      </div>
                      <div style={{ fontSize: '8pt', color: '#555', marginTop: 2 }}>
                        TOTALENERGIES EP NIG. LTD. · {baseName.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ border: 'none', padding: '0 0 4px 0', textAlign: 'right' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://companieslogo.com/img/orig/TTE_BIG-cf13cf30.png?t=1720244494&download=true"
                        alt="TotalEnergies"
                        style={{ height: 40, objectFit: 'contain' }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Waybill number banner ───────────────────────────────────── */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ ...TD, background: '#D9E1F2', fontWeight: 700, fontSize: '11pt', letterSpacing: '1px', width: '50%' }}>
                      Freight Waybill No: &nbsp;
                      <span style={{ fontFamily: 'monospace', fontSize: '13pt' }}>
                        {order.waybillNumber ?? '— Preview —'}
                      </span>
                    </td>
                    <td style={{ ...TD, fontWeight: 700, fontSize: '11pt', textAlign: 'right' }}>
                      {new Date().getFullYear()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Info grid ──────────────────────────────────────────────── */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ ...TD, width: '16%', background: '#EBF0FA' }}>
                      <span style={LABEL}>Origin</span>
                      <strong>{origin}</strong>
                    </td>
                    <td style={{ ...TD, width: '16%' }}>
                      <span style={LABEL}>Destination</span>
                      <strong>{order.destination.toUpperCase()}</strong>
                    </td>
                    <td style={{ ...TD, width: '18%' }}>
                      <span style={LABEL}>Requester</span>
                      {order.requestedByName}
                    </td>
                    <td style={{ ...TD, width: '16%' }}>
                      <span style={LABEL}>Entity</span>
                      {order.entity ?? '—'}
                    </td>
                    <td style={{ ...TD, width: '18%' }}>
                      <span style={LABEL}>Truck / Vessel ID</span>
                      {order.allocatedVessel ?? 'N/A'}
                    </td>
                    <td style={{ ...TD, width: '16%' }}>
                      <span style={LABEL}>Date</span>
                      {dateStr}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ ...TD, background: '#EBF0FA' }}>
                      <span style={LABEL}>Consignee</span>
                      <strong>{order.destination.toUpperCase()} OPERATIONS</strong>
                    </td>
                    <td style={TD}>
                      <span style={LABEL}>Entity</span>
                      {order.entity ?? 'Logistics'}
                    </td>
                    <td style={TD}>
                      <span style={LABEL}>Container (CCU)</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{order.containerId ?? 'N/A'}</span>
                    </td>
                    <td style={TD}>
                      <span style={LABEL}>Vessel</span>
                      {order.allocatedVessel ?? ''}
                    </td>
                    <td style={TD}>
                      <span style={LABEL}>Work Order</span>
                      <span style={{ fontFamily: 'monospace' }}>{order.workOrderNumber}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} style={TD}>
                      <span style={LABEL}>Remarks</span>
                      {order.notes || '—'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── CCU / Items table ───────────────────────────────────────── */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 0 }}>
                <thead>
                  <tr>
                    {['No', 'CCU ID', 'CCU Type', 'SAP / MAT No', 'Description', 'Qty', 'Weight/T', 'Length/m', 'Width/m', 'Height/m', 'Unit', 'Doc Ref'].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F7F9FC' }}>
                      <td style={{ ...TD, textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ ...TD, fontFamily: 'monospace', fontWeight: 700 }}>{order.containerId ?? 'N/A'}</td>
                      <td style={{ ...TD, textAlign: 'center' }}>N/A</td>
                      <td style={{ ...TD, fontFamily: 'monospace' }}>{item.partNumber ?? item.binLoc ?? '—'}</td>
                      <td style={{ ...TD }}>{item.description}</td>
                      <td style={{ ...TD, textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ ...TD, textAlign: 'center' }}>0</td>
                      <td style={{ ...TD, textAlign: 'center' }}>0</td>
                      <td style={{ ...TD, textAlign: 'center' }}>0</td>
                      <td style={{ ...TD, textAlign: 'center' }}>0</td>
                      <td style={{ ...TD, textAlign: 'center' }}>{item.unit}</td>
                      <td style={{ ...TD, textAlign: 'center' }}>{order.requestType}</td>
                    </tr>
                  ))}
                  {/* Pad to at least 4 rows */}
                  {Array.from({ length: Math.max(0, 4 - order.items.length) }).map((_, i) => (
                    <tr key={`pad-${i}`} style={{ height: 22 }}>
                      {Array.from({ length: 12 }).map((__, j) => (
                        <td key={j} style={TD}>&nbsp;</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ── Signatory section ───────────────────────────────────────── */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, width: '33%' }}>Consignor</th>
                    <th style={{ ...TH, width: '33%' }}>Entity</th>
                    <th style={{ ...TH, width: '34%' }}>TotalEnergies EP Approval</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...TD, height: 60, verticalAlign: 'bottom' }}>
                      <div style={{ fontSize: '8pt', color: '#333', fontWeight: 600 }}>
                        {(order.requestedByName ?? '').toUpperCase()}
                      </div>
                    </td>
                    <td style={{ ...TD, verticalAlign: 'bottom' }}>
                      <div style={{ fontSize: '8pt', color: '#333' }}>
                        {order.entity ?? '—'}
                      </div>
                      <div style={{ fontSize: '7pt', color: '#888', marginTop: 2 }}>
                        {order.requestedByName} {nowStr}
                      </div>
                    </td>
                    <td style={{ ...TD, verticalAlign: 'bottom' }}>
                      <div style={{ marginBottom: 4 }}>
                        <img
                          src="https://companieslogo.com/img/orig/TTE_BIG-cf13cf30.png?t=1720244494&download=true"
                          alt="TotalEnergies"
                          style={{ height: 18, objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ fontSize: '7pt', fontWeight: 700, color: '#333' }}>
                        TOTALENERGIES EP NIG. LTD.
                      </div>
                      <div style={{ fontSize: '7pt', color: '#555' }}>
                        {baseName.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '7pt', color: '#333', marginTop: 4 }}>
                        {coordinator.toUpperCase()} {nowStr}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Footer notes ────────────────────────────────────────────── */}
              <div style={{ marginTop: 6, fontSize: '7pt', color: '#444', borderTop: '1px solid #ccc', paddingTop: 4 }}>
                <span style={{ fontWeight: 700 }}>1.</span> Equipment must be delivered along with the waybill the day before the departure of the Vessel with the agreement of TUCN LOG OPS SUPV. &nbsp;
                <span style={{ fontWeight: 700 }}>2.</span> Equipment and certification will be controlled by TUCN QA/QC. &nbsp;
                <span style={{ fontWeight: 700 }}>3.</span> Equipment which does not comply to TUCN company rules will not be discharged from the truck.
              </div>

            </div>{/* end print area */}
          </div>
        </div>
      </div>
    </>
  )
}
