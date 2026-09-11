'use client'

import { Input } from '@/components/ui/Form'
import { Dropdown } from '@/components/ui/Dropdown'
import { DESTINATION_OPTIONS, CARGO_TYPES, ENTITY_OPTIONS } from './constants'
import { SectionHeader, Label, FieldError } from './FormHelpers'

interface LogisticsSectionProps {
  destination: string
  customDest: string
  cargoType: string
  entity: string
  errors: Record<string, string>
  onDestinationChange: (value: string) => void
  onCustomDestChange: (value: string) => void
  onCargoTypeChange: (value: string) => void
  onEntityChange: (value: string) => void
}

export function LogisticsSection({
  destination, customDest, cargoType, entity, errors,
  onDestinationChange, onCustomDestChange, onCargoTypeChange, onEntityChange,
}: LogisticsSectionProps) {
  return (
    <div className="bg-white rounded-card shadow-card border border-border-default p-6 space-y-5">
      <SectionHeader step={2} title="Logistics Details" required />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Destination */}
        <div className="flex flex-col gap-1.5">
          <Label text="Destination" required />
          <Dropdown
            options={DESTINATION_OPTIONS}
            value={destination}
            onChange={onDestinationChange}
            placeholder="Select destination…"
            error={!!errors.destination}
            searchable
          />
          {errors.destination && <FieldError msg={errors.destination} />}
          {destination === 'Other' && (
            <Input
              placeholder="Specify destination"
              value={customDest}
              onChange={e => onCustomDestChange(e.target.value)}
              error={!!errors.customDest}
              className="mt-1"
            />
          )}
          {errors.customDest && <FieldError msg={errors.customDest} />}
        </div>

        {/* Entity */}
        <div className="flex flex-col gap-1.5">
          <Label text="Entity" required />
          <Dropdown
            options={ENTITY_OPTIONS}
            value={entity}
            onChange={onEntityChange}
            placeholder="Select entity…"
            error={!!errors.entity}
          />
          {errors.entity && <FieldError msg={errors.entity} />}
        </div>

        {/* Cargo Type */}
        <div className="flex flex-col gap-1.5">
          <Label text="Cargo Type" required />
          <Dropdown
            options={CARGO_TYPES}
            value={cargoType}
            onChange={onCargoTypeChange}
            placeholder="Select cargo type…"
            error={!!errors.cargoType}
          />
          {errors.cargoType && <FieldError msg={errors.cargoType} />}
        </div>
      </div>
    </div>
  )
}
