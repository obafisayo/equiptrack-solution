'use client'

import { Input } from '@/components/ui/Form'
import { Dropdown } from '@/components/ui/Dropdown'
import { DESTINATION_OPTIONS, CARGO_TYPES, WELL_FIELD_OPTIONS } from './constants'
import { SectionHeader, Label, FieldError } from './FormHelpers'

interface LogisticsSectionProps {
  destination: string
  customDest: string
  cargoType: string
  wellField: string
  costCode: string
  contactPhone: string
  errors: Record<string, string>
  onDestinationChange: (value: string) => void
  onCustomDestChange: (value: string) => void
  onCargoTypeChange: (value: string) => void
  onWellFieldChange: (value: string) => void
  onCostCodeChange: (value: string) => void
  onContactPhoneChange: (value: string) => void
}

export function LogisticsSection({
  destination, customDest, cargoType, wellField, costCode, contactPhone, errors,
  onDestinationChange, onCustomDestChange, onCargoTypeChange, onWellFieldChange,
  onCostCodeChange, onContactPhoneChange,
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

        {/* Well / Field */}
        <div className="flex flex-col gap-1.5">
          <Label text="Well / Field Name" />
          <Dropdown
            options={WELL_FIELD_OPTIONS}
            value={wellField}
            onChange={onWellFieldChange}
            placeholder="Select well or field…"
            searchable
          />
        </div>

        {/* Cost Code */}
        <div className="flex flex-col gap-1.5">
          <Label text="Cost Centre / Cost Code" />
          <Input
            placeholder="e.g. CC-4821-OPS"
            value={costCode}
            onChange={e => onCostCodeChange(e.target.value)}
          />
        </div>
      </div>

      {/* Contact phone */}
      <div className="flex flex-col gap-1.5">
        <Label text="Requestor Contact Phone" />
        <Input
          type="tel"
          placeholder="+234 800 000 0000"
          value={contactPhone}
          onChange={e => onContactPhoneChange(e.target.value)}
          className="sm:w-64"
        />
      </div>
    </div>
  )
}
