'use client'

import { Textarea } from '@/components/ui/Form'
import { SectionHeader, FieldError } from './FormHelpers'

interface NotesSectionProps {
  isTR: boolean
  notes: string
  error?: string
  onChange: (value: string) => void
}

export function NotesSection({ isTR, notes, error, onChange }: NotesSectionProps) {
  return (
    <div className="bg-white rounded-card shadow-card border border-border-default p-6 space-y-3">
      <SectionHeader step={5} title={isTR ? 'Justification (Required for TR)' : 'Additional Notes'} required={isTR} noMb />
      <Textarea
        rows={4}
        placeholder={
          isTR
            ? 'Provide full written justification for the temporary requisition - describe why this equipment is needed, the operational impact if not fulfilled, and reference any relevant work orders or well programmes…'
            : 'Any special handling instructions, packaging requirements, or operational context…'
        }
        value={notes}
        onChange={e => onChange(e.target.value)}
        error={!!error}
      />
      {error && <FieldError msg={error} />}
    </div>
  )
}
