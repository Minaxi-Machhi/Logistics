import type { Column, FieldDef } from '@/types'
import { STATUS, VEHICLE_TYPE } from '@/mock/lookups'
import { date, num, req, select, text, to } from '../fields'

export const driverLink = (r: { id: string }) => to('/app/assets/drivers', r.id)
export const vehicleLink = (r: { id: string }) => to('/app/assets/vehicles', r.id)

export const driverColumns: Column[] = [
  { key: 'id', title: 'Code', type: 'mono' }, { key: 'name', title: 'Driver' }, { key: 'phone', title: 'Phone', type: 'mono' }, { key: 'licence', title: 'Licence no.', type: 'mono' },
  { key: 'expiry', title: 'Licence expiry' }, { key: 'trips', title: 'Trips (month)' }, { key: 'status', title: 'Status', type: 'status' },
]
export const vehicleColumns: Column[] = [
  { key: 'id', title: 'Registration', type: 'mono' }, { key: 'type', title: 'Type' }, { key: 'capacity', title: 'Capacity' }, { key: 'ownership', title: 'Ownership' },
  { key: 'fitness', title: 'Fitness valid till' }, { key: 'insurance', title: 'Insurance till' }, { key: 'status', title: 'Status', type: 'status' },
]

export const driverFields: FieldDef[] = [
  text('name', 'Driver name', req),
  text('phone', 'Phone', { ...req, hint: '+971 50 123 4567' }),
  text('licence', 'Licence no.', req),
  date('expiry', 'Licence expiry'),
  num('trips', 'Trips (month)', { value: 0 }),
  select('status', 'Status', STATUS.driver, { ...req, value: 'Available' }),
]
export const vehicleFields: FieldDef[] = [
  text('id', 'Registration', { ...req, hint: 'e.g. DXB A 48213' }),
  select('type', 'Type', VEHICLE_TYPE, req),
  select('capacity', 'Capacity', ['9 t', '12 t', '18 t', '28 t'], req),
  select('ownership', 'Ownership', ['Owned', 'Attached'], req),
  date('fitness', 'Fitness valid till'),
  date('insurance', 'Insurance till'),
  select('status', 'Status', STATUS.vehicle, { ...req, value: 'Available' }),
]
