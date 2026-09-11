export const DESTINATIONS = [
  'Akpo',
  'Amadi-Base',
  'Amenam',
  'AMQ',
  'Egina',
  'Hosh-1',
  'Odudu',
  'Ofon',
  'Onne',
] as const

export type Destination = typeof DESTINATIONS[number]
