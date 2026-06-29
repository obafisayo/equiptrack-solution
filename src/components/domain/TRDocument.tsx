/* eslint-disable */
'use client'

import { useRef } from 'react'
import { X, Printer } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface TRLineItem {
  material?: string
  quantity: number | string
  description: string
  plant?: string
  binLoc?: string
  prWoNumber?: string
  remarks?: string
}

export interface TRDocumentData {
  trNumber: string
  destination: string
  requestedBy: string
  department: string
  date: string   // e.g. "29/06/2026 10:02"
  approvedBy: string
  approverTitle: string
  items: TRLineItem[]
  company?: string
}

interface TRDocumentProps {
  data: TRDocumentData
  onClose: () => void
}

export function TRDocumentModal({ data, onClose }: TRDocumentProps) {
  const printRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    const content = printRef.current
    if (!content) return
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>TR-${data.trNumber}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Times New Roman', serif; font-size: 12px; color: #000; background: #fff; }
          .page { max-width: 800px; margin: 0 auto; padding: 24px 32px; }
          .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
          .header-meta { font-size: 11px; color: #444; }
          .doc-title { text-align: center; margin-bottom: 20px; }
          .doc-title h1 { font-size: 18px; font-weight: bold; text-decoration: underline; letter-spacing: 2px; }
          .doc-title .company { font-size: 13px; font-weight: bold; text-align: right; line-height: 1.4; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; border: 2px solid #000; margin-bottom: 20px; }
          .info-left { padding: 8px 12px; border-right: 1px solid #000; }
          .info-right { padding: 8px 12px; }
          .info-center { padding: 20px 12px; text-align: center; font-size: 32px; font-weight: bold; border-top: 1px solid #000; border-right: 1px solid #000; }
          .info-label { font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 3px; }
          .info-value { font-size: 12px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f5f5f5; font-weight: bold; text-align: center; padding: 8px; border: 1px solid #000; font-size: 11px; }
          td { padding: 8px; border: 1px solid #000; text-align: center; font-size: 11px; vertical-align: top; }
          td.left { text-align: left; }
          .approval { text-align: center; border-top: 2px solid #000; padding-top: 16px; }
          .approval p { font-size: 13px; font-weight: bold; margin-bottom: 4px; }
          .approval .approver { font-size: 12px; }
          @media print {
            body { print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header-row">
            <div class="header-meta">
              <div>${data.date}</div>
            </div>
            <div class="header-meta" style="text-align:center;font-weight:bold;">TR-${data.trNumber}</div>
            <div></div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
            <div style="font-size:20px;font-weight:bold;color:#e0001b;font-style:italic;">
              ${data.company || 'Equiptrack'}
            </div>
            <div style="text-align:center;flex:1;">
              <h1 style="font-size:18px;font-weight:bold;text-decoration:underline;letter-spacing:2px;">TEMPORARY REQUISITION</h1>
            </div>
            <div style="text-align:right;font-size:11px;font-weight:bold;line-height:1.5;">
              ${data.company || 'EQUIPTRACK'}<br/>LOGISTICS NIG. LTD.
            </div>
          </div>

          <div class="info-grid">
            <div class="info-left">
              <div class="info-label">DESTINATION:</div>
              <div class="info-value">${data.destination}</div>
            </div>
            <div class="info-right">
              <div class="info-label">REQUESTED BY: ${data.requestedBy}</div>
              <div style="margin-top:4px;font-size:11px;">Department / Entity: ${data.department}</div>
              <div style="margin-top:4px;font-size:11px;">Date: ${data.date}</div>
            </div>

            <div class="info-center">${data.trNumber}</div>
            <div style="padding:8px 12px;border-top:1px solid #000;"></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Plant</th>
                <th>Bin Loc</th>
                <th>PR/WO number &amp; Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td>${item.material ?? ''}</td>
                  <td>${item.quantity}</td>
                  <td class="left">${item.description}</td>
                  <td>${item.plant ?? ''}</td>
                  <td>${item.binLoc ?? ''}</td>
                  <td class="left">${[item.prWoNumber, item.remarks].filter(Boolean).join(' — ')}</td>
                </tr>
              `).join('')}
              ${Array(Math.max(0, 5 - data.items.length)).fill('<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>').join('')}
            </tbody>
          </table>

          <div class="approval">
            <p>Approved by the Onne Base Logistics Coordinator</p>
            <div class="approver">${data.approvedBy}</div>
          </div>
        </div>
      </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print() }, 300)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}/>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="relative bg-white rounded-2xl shadow-overlay w-full max-w-3xl max-h-[90vh] flex flex-col pointer-events-auto animate-fade-in">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-default shrink-0">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Temporary Requisition</h2>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">TR-{data.trNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" icon={<Printer size={14}/>} onClick={handlePrint}>
                Print / Export PDF
              </Button>
              <button type="button" aria-label="Close" onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                <X size={17}/>
              </button>
            </div>
          </div>

          {/* Document preview */}
          <div className="flex-1 overflow-y-auto p-6" ref={printRef}>
            <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm font-serif" style={{fontFamily:"'Times New Roman', serif"}}>
              {/* Top meta row */}
              <div className="flex justify-between text-xs text-neutral-500 mb-4">
                <span>{data.date}</span>
                <span className="font-bold">TR-{data.trNumber}</span>
              </div>

              {/* Brand + title row */}
              <div className="flex items-start justify-between mb-6">
                <div className="text-red-600 font-bold text-xl italic leading-none" style={{fontFamily:'Arial,sans-serif'}}>
                  {data.company || 'Equiptrack'}
                </div>
                <div className="flex-1 text-center">
                  <h1 className="text-lg font-bold underline tracking-widest">TEMPORARY REQUISITION</h1>
                </div>
                <div className="text-right text-xs font-bold leading-relaxed" style={{fontFamily:'Arial,sans-serif'}}>
                  {(data.company || 'EQUIPTRACK').toUpperCase()} EP<br/>NIG. LTD.
                </div>
              </div>

              {/* Info grid */}
              <div className="border-2 border-neutral-900 mb-6">
                <div className="grid grid-cols-2">
                  {/* Left: destination */}
                  <div className="p-3 border-r border-neutral-900">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1">DESTINATION:</p>
                    <p className="text-sm font-bold">{data.destination}</p>
                  </div>
                  {/* Right: requester info */}
                  <div className="p-3 space-y-0.5">
                    <p className="text-xs font-bold">REQUESTED BY: {data.requestedBy}</p>
                    <p className="text-xs">Department / Entity: {data.department}</p>
                    <p className="text-xs">Date: {data.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 border-t border-neutral-900">
                  {/* TR number large */}
                  <div className="p-4 border-r border-neutral-900 flex items-center justify-center">
                    <span className="text-4xl font-bold tracking-wider">{data.trNumber}</span>
                  </div>
                  <div className="p-3"/>
                </div>
              </div>

              {/* Materials table */}
              <table className="w-full border-collapse mb-6 text-xs" style={{fontFamily:'Arial,sans-serif'}}>
                <thead>
                  <tr className="bg-neutral-100">
                    {['Material','Quantity','Description','Plant','Bin Loc','PR/WO number & Remarks'].map(h => (
                      <th key={h} className="border border-neutral-900 px-2 py-2 text-center font-bold text-[11px] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, i) => (
                    <tr key={i}>
                      <td className="border border-neutral-900 px-2 py-2 text-center">{item.material ?? ''}</td>
                      <td className="border border-neutral-900 px-2 py-2 text-center font-bold">{item.quantity}</td>
                      <td className="border border-neutral-900 px-2 py-2 text-left">{item.description}</td>
                      <td className="border border-neutral-900 px-2 py-2 text-center">{item.plant ?? ''}</td>
                      <td className="border border-neutral-900 px-2 py-2 text-center">{item.binLoc ?? ''}</td>
                      <td className="border border-neutral-900 px-2 py-2 text-left">{[item.prWoNumber, item.remarks].filter(Boolean).join(' — ')}</td>
                    </tr>
                  ))}
                  {/* Blank filler rows */}
                  {Array.from({length: Math.max(0, 5 - data.items.length)}).map((_, i) => (
                    <tr key={`blank-${i}`}>
                      {Array(6).fill(null).map((_, j) => (
                        <td key={j} className="border border-neutral-900 px-2 py-3"/>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Approval footer */}
              <div className="border-t-2 border-neutral-900 pt-4 text-center" style={{fontFamily:'Arial,sans-serif'}}>
                <p className="text-sm font-bold mb-1">{data.approverTitle || 'Approved by the Onne Base Logistics Coordinator'}</p>
                <p className="text-xs">{data.approvedBy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
