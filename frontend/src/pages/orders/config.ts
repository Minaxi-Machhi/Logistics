import type { Column, FieldDef, FormStep } from '@/types'
import { BRANCH, CITY, CUST } from '@/mock/lookups'
import { ADDRESS_BOOK } from '@/mock/orders'
import { JOB_TYPES, PRODUCTS } from '@/mock/orders'
import { date, num, req, select, text, to } from '../fields'

export const orderLink = (r: { id: string }) => to('/app/orders', r.id)

export const orderColumns: Column[] = [
  { key: 'id', title: 'Order no.', type: 'mono' }, { key: 'customer', title: 'Customer' }, { key: 'jobType', title: 'Job type' },
  { key: 'origin', title: 'Origin' }, { key: 'destination', title: 'Destination' }, { key: 'orderDate', title: 'Order date' },
  { key: 'rate', title: 'Sell rate', type: 'money' }, { key: 'branch', title: 'Branch' }, { key: 'status', title: 'Status', type: 'status' },
]

export const orderSteps: FormStep[] = [
  { key: 'details', label: 'Order details' },
  { key: 'route', label: 'Route' },
  { key: 'pricing', label: 'Pricing & notes' },
  { key: 'review', label: 'Review' },
]

export const orderFields: FieldDef[] = [
  { ...select('customer', 'Customer', CUST, req), step: 'details' },
  { ...select('branch', 'Branch', BRANCH, { ...req, value: 'Dubai' }), step: 'details' },
  { ...select('jobType', 'Job type', JOB_TYPES, req), step: 'details' },
  { ...date('orderDate', 'Order date', { value: '2026-10-22' }), step: 'details' },
  { ...date('loadingDate', 'Loading date', { value: '2026-10-23' }), step: 'details' },
  { ...select('product', 'Product', PRODUCTS), step: 'details' },
  { ...num('quantity', 'Quantity', { value: 0 }), step: 'details' },

  { ...select('origin', 'Origin', CITY, req), step: 'route' },
  { ...select('destination', 'Destination', CITY, req), step: 'route' },
  { ...select('originDepot', 'Pickup address', ADDRESS_BOOK, { placeholder: 'Defaults to the origin depot' }), step: 'route' },
  { ...select('destDepot', 'Drop address', ADDRESS_BOOK, { placeholder: 'Defaults to the destination depot' }), step: 'route' },

  { ...num('rate', 'Sell rate', { hint: 'Optional now, applied when the order is confirmed', value: 0 }), step: 'pricing' },
  { ...text('remarks', 'Remarks'), type: 'textarea', span: 2, step: 'pricing' },
]
