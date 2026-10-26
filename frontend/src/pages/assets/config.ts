import type { Driver, Vehicle } from '@/types'
import { dmyToIso } from '@/composables/useList'
import type { ListConfig } from '@/composables/useList'
import type { Column, FieldDef } from '@/types'
import { STATUS, VEHICLE_TYPE } from '@/mock/lookups'
import { date, num, req, select, text } from '../fields'


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

export const driverListConfig: ListConfig<Driver> = {
  storageKey: 'drivers-list', searchPlaceholder: 'Search drivers…',
  searchText: r => [r.id, r.name, r.phone, r.licence],
  filters: [],
  status: { get: r => r.status, list: STATUS.driver, muted: ['On leave'] },
  sorters: { id: r => r.id, name: r => r.name, phone: r => r.phone, licence: r => r.licence, expiry: r => dmyToIso(r.expiry), trips: r => r.trips, status: r => r.status },
}

export const vehicleListConfig: ListConfig<Vehicle> = {
  storageKey: 'vehicles-list', searchPlaceholder: 'Search vehicles…',
  searchText: r => [r.id, r.type, r.ownership],
  filters: [
    { key: 'type', label: 'Type', allLabel: 'All types', icon: 'mdi-truck-outline', options: VEHICLE_TYPE, get: r => r.type },
    { key: 'ownership', label: 'Ownership', allLabel: 'All ownership', icon: 'mdi-key-outline', options: ['Owned', 'Attached'], get: r => r.ownership },
    { key: 'capacity', label: 'Capacity', allLabel: 'All capacities', icon: 'mdi-weight', options: ['9 t', '12 t', '18 t', '28 t'], get: r => r.capacity, more: true },
  ],
  status: { get: r => r.status, list: STATUS.vehicle },
  sorters: { id: r => r.id, type: r => r.type, capacity: r => r.capacity, ownership: r => r.ownership, fitness: r => dmyToIso(r.fitness), insurance: r => dmyToIso(r.insurance), status: r => r.status },
}
