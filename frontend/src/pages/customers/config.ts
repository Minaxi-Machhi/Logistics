import type { Customer, CustomerContract } from '@/types'
import { dmyToIso } from '@/composables/useList'
import type { ListConfig } from '@/composables/useList'
import type { Column, FieldDef } from '@/types'
import { CITY, CUST, STATUS } from '@/mock/lookups'
import { date, num, req, select, text, to } from '../fields'

export const customerLink = (r: { id: string }) => to('/app/customers', r.id)
export const contractLink = (r: { id: string }) => to('/app/customers/contracts', r.id)

export const customerColumns: Column[] = [
  { key: 'id', title: 'Code', type: 'mono' }, { key: 'name', title: 'Customer' }, { key: 'city', title: 'City' }, { key: 'contact', title: 'Contact' },
  { key: 'creditLimit', title: 'Credit limit', type: 'money' }, { key: 'outstanding', title: 'Outstanding', type: 'money' }, { key: 'status', title: 'Status', type: 'status' },
]
export const contractColumns: Column[] = [
  { key: 'id', title: 'Contract', type: 'mono' }, { key: 'customer', title: 'Customer' }, { key: 'scope', title: 'Lane / scope' }, { key: 'basis', title: 'Rate basis' },
  { key: 'start', title: 'Start' }, { key: 'end', title: 'End' }, { key: 'status', title: 'Status', type: 'status' },
]

export const customerFields: FieldDef[] = [
  text('name', 'Customer name', req),
  select('city', 'City', CITY, req),
  text('contact', 'Contact person', req),
  num('creditLimit', 'Credit limit', req),
  num('outstanding', 'Outstanding', { value: 0 }),
  select('status', 'Status', STATUS.party, { ...req, value: 'Active' }),
]
export const contractFields: FieldDef[] = [
  select('customer', 'Customer', CUST, req),
  text('scope', 'Lane / scope', { ...req, hint: 'e.g. Dubai ⇄ Abu Dhabi' }),
  select('basis', 'Rate basis', ['Per trip', 'Per tonne', 'Per container', 'Per km'], req),
  date('start', 'Start date'),
  date('end', 'End date'),
  select('status', 'Status', STATUS.doc, { ...req, value: 'Active' }),
]

export const customerListConfig: ListConfig<Customer> = {
  storageKey: 'customers-list', searchPlaceholder: 'Search customers…',
  searchText: r => [r.id, r.name, r.city, r.contact],
  filters: [{ key: 'city', label: 'City', allLabel: 'All cities', icon: 'mdi-map-marker-outline', options: CITY, get: r => r.city }],
  status: { get: r => r.status, list: STATUS.party, attention: 'Pending' },
  sorters: { id: r => r.id, name: r => r.name, city: r => r.city, contact: r => r.contact, creditLimit: r => r.creditLimit, outstanding: r => r.outstanding, status: r => r.status },
}

export const contractListConfig: ListConfig<CustomerContract> = {
  storageKey: 'customer-contracts-list', searchPlaceholder: 'Search contracts…',
  searchText: r => [r.id, r.customer, r.scope, r.basis],
  filters: [
    { key: 'customer', label: 'Customer', allLabel: 'All customers', icon: 'mdi-account-group-outline', options: CUST, get: r => r.customer, searchable: true },
    { key: 'basis', label: 'Rate basis', allLabel: 'All rate bases', icon: 'mdi-cash-multiple', options: ['Per trip', 'Per tonne', 'Per container', 'Per km'], get: r => r.basis },
  ],
  status: { get: r => r.status, list: STATUS.doc, attention: 'Expiring', muted: ['Expired'] },
  sorters: { id: r => r.id, customer: r => r.customer, scope: r => r.scope, basis: r => r.basis, start: r => dmyToIso(r.start), end: r => dmyToIso(r.end), status: r => r.status },
}
