'use client'

interface SectionHeaderProps {
  step: number
  title: string
  required?: boolean
  noMb?: boolean
}

export function SectionHeader({ step, title, required, noMb }: SectionHeaderProps) {
  return (
    <div className={noMb ? '' : 'mb-4'}>
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
        <h2 className="text-sm font-bold text-neutral-900">
          {title}
          {required && <span className="text-status-critical ml-0.5">*</span>}
        </h2>
      </div>
    </div>
  )
}

interface LabelProps {
  text: string
  required?: boolean
}

export function Label({ text, required }: LabelProps) {
  return (
    <label className="text-sm font-medium text-gray-700">
      {text}
      {required && <span className="text-status-critical ml-0.5">*</span>}
    </label>
  )
}

interface FieldErrorProps {
  msg: string
}

export function FieldError({ msg }: FieldErrorProps) {
  return <p className="text-xs text-status-critical mt-0.5">{msg}</p>
}
