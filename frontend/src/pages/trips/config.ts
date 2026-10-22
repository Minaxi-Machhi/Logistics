import type { Column, FieldDef } from '@/types'
import { DRV, PLATE, STATUS } from '@/mock/lookups'
import { date, req, select, text, to } from '../fields'

export const tripLink = (r: { id: string }) => to('/app/trips', r.id)

export const tripColumns: Column[] = [
  { key: 'id', title: 'Trip no.', type: 'mono' }, { key: 'order', title: 'Order', type: 'mono' }, { key: 'route', title: 'Route' },
  { key: 'driver', title: 'Driver' }, { key: 'vehicle', title: 'Vehicle', type: 'mono' }, { key: 'distance', title: 'Distance' },
  { key: 'departure', title: 'Departure' }, { key: 'eta', title: 'ETA' }, { key: 'status', title: 'Status', type: 'status' },
]

export const tripFields: FieldDef[] = [
  text('order', 'Order no.', { ...req, hint: 'e.g. ATS-TL2610-0003' }),
  text('route', 'Route', { ...req, hint: 'e.g. Dubai → Abu Dhabi' }),
  select('driver', 'Driver', DRV, req),
  select('vehicle', 'Vehicle', PLATE, req),
  text('distance', 'Distance', { hint: 'e.g. 140 km' }),
  date('departure', 'Departure'),
  date('eta', 'ETA'),
  select('status', 'Status', STATUS.trip, { ...req, value: 'Scheduled' }),
]
