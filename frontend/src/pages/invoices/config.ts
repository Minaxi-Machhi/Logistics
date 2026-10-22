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
