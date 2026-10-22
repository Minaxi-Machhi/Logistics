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
