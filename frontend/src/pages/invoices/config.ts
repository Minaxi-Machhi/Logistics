import type { Invoice } from '@/types'
import { dmyToIso } from '@/composables/useList'
import type { ListConfig } from '@/composables/useList'
import type { Column, FieldDef } from '@/types'
import { CUST, STATUS } from '@/mock/lookups'
import { date, num, req, select, text, to } from '../fields'

export const invoiceLink = (r: { id: string }) => to('/app/invoices', r.id)

export const invoiceColumns: Column[] = [
  { key: 'id', title: 'Invoice no.', type: 'mono' }, { key: 'customer', title: 'Customer' }, { key: 'order', title: 'Order', type: 'mono' },
  { key: 'date', title: 'Invoice date' }, { key: 'due', title: 'Due date' }, { key: 'amount', title: 'Amount', type: 'money' },
  { key: 'vat', title: 'VAT (5%)', type: 'money' }, { key: 'total', title: 'Total', type: 'money' }, { key: 'status', title: 'Status', type: 'status' },
]

export const invoiceFields: FieldDef[] = [
  select('customer', 'Customer', CUST, req),
  text('order', 'Order no.', req),
  date('date', 'Invoice date'),
  date('due', 'Due date'),
  num('amount', 'Amount', req),
  select('status', 'Status', STATUS.invoice, { ...req, value: 'Draft' }),
]

export const invoiceListConfig: ListConfig<Invoice> = {
  storageKey: 'invoices-list', searchPlaceholder: 'Search invoices…',
  searchText: r => [r.id, r.customer, r.order],
  filters: [{ key: 'customer', label: 'Customer', allLabel: 'All customers', icon: 'mdi-account-group-outline', options: CUST, get: r => r.customer, searchable: true }],
  status: { get: r => r.status, list: STATUS.invoice, attention: 'Overdue' },
  sorters: { id: r => r.id, customer: r => r.customer, order: r => r.order, date: r => dmyToIso(r.date), due: r => dmyToIso(r.due), amount: r => r.amount, vat: r => r.vat, total: r => r.total, status: r => r.status },
  syncUrl: true,
}
