import type { Column, FieldDef } from '@/types'
import { BRANCH, CITY, CUST } from '@/mock/lookups'
import { JOB_TYPES } from '@/mock/orders'
import { date, num, req, select, to } from '../fields'

export const orderLink = (r: { id: string }) => to('/app/orders', r.id)

export const orderColumns: Column[] = [
  { key: 'id', title: 'Order no.', type: 'mono' }, { key: 'customer', title: 'Customer' }, { key: 'jobType', title: 'Job type' },
  { key: 'origin', title: 'Origin' }, { key: 'destination', title: 'Destination' }, { key: 'orderDate', title: 'Order date' },
  { key: 'rate', title: 'Sell rate', type: 'money' }, { key: 'branch', title: 'Branch' }, { key: 'status', title: 'Status', type: 'status' },
]

export const orderFields: FieldDef[] = [
  select('customer', 'Customer', CUST, req),
  select('jobType', 'Job type', JOB_TYPES, req),
  select('origin', 'Origin', CITY, req),
  select('destination', 'Destination', CITY, req),
  num('rate', 'Sell rate', { hint: 'Optional now, applied when the order is confirmed', value: 0 }),
  date('orderDate', 'Order date'),
  select('branch', 'Branch', BRANCH, { ...req, value: 'Dubai' }),
]
