'use client'

export interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/45 z-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-modal shadow-overlay w-full max-w-sm">
        <div className="px-6 py-5">
          <h2 className="font-semibold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-9 rounded-button border border-border-default text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-9 rounded-button bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
