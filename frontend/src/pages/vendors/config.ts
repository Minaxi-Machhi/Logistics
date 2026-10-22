import type { Vendor, VendorContract, VendorOrder } from '@/types'
import { dmyToIso } from '@/composables/useList'
import type { ListConfig } from '@/composables/useList'
import type { Column, FieldDef } from '@/types'
import { CITY, STATUS, VEHICLE_TYPE, VEND } from '@/mock/lookups'
import { date, num, req, select, text, to } from '../fields'

export const vendorLink = (r: { id: string }) => to('/app/vendors', r.id)
export const vendorContractLink = (r: { id: string }) => to('/app/vendors/contracts', r.id)
export const vendorOrderLink = (r: { id: string }) => to('/app/vendors/orders', r.id)

export const vendorColumns: Column[] = [
  { key: 'id', title: 'Code', type: 'mono' }, { key: 'name', title: 'Vendor' }, { key: 'type', title: 'Type' }, { key: 'city', title: 'City' },
  { key: 'fleet', title: 'Fleet size' }, { key: 'rating', title: 'Rating' }, { key: 'status', title: 'Status', type: 'status' },
]
export const vendorContractColumns: Column[] = [
  { key: 'id', title: 'Contract', type: 'mono' }, { key: 'vendor', title: 'Vendor' }, { key: 'lane', title: 'Lane' }, { key: 'rate', title: 'Agreed rate', type: 'money' },
  { key: 'from', title: 'Valid from' }, { key: 'to', title: 'Valid to' }, { key: 'status', title: 'Status', type: 'status' },
]
export const vendorOrderColumns: Column[] = [
  { key: 'id', title: 'PO no.', type: 'mono' }, { key: 'vendor', title: 'Vendor' }, { key: 'order', title: 'Linked order', type: 'mono' }, { key: 'route', title: 'Route' },
  { key: 'vehicle', title: 'Vehicle' }, { key: 'cost', title: 'Cost', type: 'money' }, { key: 'status', title: 'Status', type: 'status' },
]

export const vendorFields: FieldDef[] = [
  text('name', 'Vendor name', req),
  select('type', 'Type', ['Road carrier', 'Shipping line', 'Haulage'], req),
  select('city', 'City', CITY, req),
  num('fleet', 'Fleet size', req),
  text('rating', 'Rating', { value: '4.0 / 5' }),
  select('status', 'Status', STATUS.party, { ...req, value: 'Pending' }),
]
export const vendorContractFields: FieldDef[] = [
  select('vendor', 'Vendor', VEND, req),
  text('lane', 'Lane', req),
  num('rate', 'Agreed rate', req),
  date('from', 'Valid from'),
  date('to', 'Valid to'),
  select('status', 'Status', STATUS.doc, { ...req, value: 'Active' }),
]
export const vendorOrderFields: FieldDef[] = [
  select('vendor', 'Vendor', VEND, req),
  text('order', 'Linked order', { ...req, hint: 'e.g. ATS-TL2610-0003' }),
  text('route', 'Route', req),
  select('vehicle', 'Vehicle', VEHICLE_TYPE.slice(0, 3), req),
  num('cost', 'Cost', req),
  select('status', 'Status', STATUS.vendorOrder, { ...req, value: 'Pending' }),
]

export const vendorListConfig: ListConfig<Vendor> = {
  storageKey: 'vendors-list', searchPlaceholder: 'Search vendors…',
  searchText: r => [r.id, r.name, r.type, r.city],
  filters: [
    { key: 'type', label: 'Type', allLabel: 'All types', icon: 'mdi-warehouse', options: ['Road carrier', 'Shipping line', 'Haulage'], get: r => r.type },
    { key: 'city', label: 'City', allLabel: 'All cities', icon: 'mdi-map-marker-outline', options: CITY, get: r => r.city, more: true },
  ],
  status: { get: r => r.status, list: STATUS.party, attention: 'Pending' },
  sorters: { id: r => r.id, name: r => r.name, type: r => r.type, city: r => r.city, fleet: r => r.fleet, rating: r => r.rating, status: r => r.status },
}

export const vendorContractListConfig: ListConfig<VendorContract> = {
  storageKey: 'vendor-contracts-list', searchPlaceholder: 'Search vendor contracts…',
  searchText: r => [r.id, r.vendor, r.lane],
  filters: [{ key: 'vendor', label: 'Vendor', allLabel: 'All vendors', icon: 'mdi-warehouse', options: VEND, get: r => r.vendor, searchable: true }],
  status: { get: r => r.status, list: STATUS.doc, attention: 'Expiring', muted: ['Expired'] },
  sorters: { id: r => r.id, vendor: r => r.vendor, lane: r => r.lane, rate: r => r.rate, from: r => dmyToIso(r.from), to: r => dmyToIso(r.to), status: r => r.status },
}

export const vendorOrderListConfig: ListConfig<VendorOrder> = {
  storageKey: 'vendor-orders-list', searchPlaceholder: 'Search vendor orders…',
  searchText: r => [r.id, r.vendor, r.order, r.route],
  filters: [
    { key: 'vendor', label: 'Vendor', allLabel: 'All vendors', icon: 'mdi-warehouse', options: VEND, get: r => r.vendor, searchable: true },
    { key: 'vehicle', label: 'Vehicle', allLabel: 'All vehicles', icon: 'mdi-truck-outline', options: VEHICLE_TYPE.slice(0, 3), get: r => r.vehicle },
  ],
  status: { get: r => r.status, list: STATUS.vendorOrder, attention: 'Pending', muted: ['Cancelled'] },
  sorters: { id: r => r.id, vendor: r => r.vendor, order: r => r.order, route: r => r.route, vehicle: r => r.vehicle, cost: r => r.cost, status: r => r.status },
}
