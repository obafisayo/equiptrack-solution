'use client'

import { LIFECYCLE, STAGE_INDEX, type Stage } from '@/lib/lifecycle'

interface ReverseStageModalProps {
  currentStage: Stage
  orderId: string
  onConfirm: (orderId: string, targetStage: Stage) => void
  onClose: () => void
}

export function ReverseStageModal({ currentStage, orderId, onConfirm, onClose }: ReverseStageModalProps) {
  const currentIdx = STAGE_INDEX[currentStage]
  const previousStages = LIFECYCLE.slice(0, currentIdx) as Stage[]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl border border-border-default w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-5 py-4 border-b border-border-default">
          <h2 className="text-sm font-semibold text-gray-900">Reverse Stage</h2>
          <p className="text-xs text-gray-500 mt-0.5">Select the stage to revert this order to</p>
        </div>

        <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
          {previousStages.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No previous stages available.</p>
          ) : (
            [...previousStages].reverse().map((stage, i) => (
              <button
                key={stage}
                type="button"
                onClick={() => { onConfirm(orderId, stage); onClose() }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-3 ${
                  i === 0
                    ? 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <span className="text-[10px] font-bold text-gray-400 w-4 text-right shrink-0">{previousStages.length - i}</span>
                {stage}
                {i === 0 && <span className="ml-auto text-[10px] text-brand-500 font-semibold">Previous</span>}
              </button>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-border-default flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
