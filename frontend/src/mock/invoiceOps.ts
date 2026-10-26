import type { Invoice, Order } from '@/types'
import { invoices, withVat } from './invoices'
import { CUST, nextId } from './lookups'
import { orders } from './orders'

/** Invoice lifecycle: Draft -> Sent -> Approved -> Paid. */
export const NEXT_STEP: Record<string, { to: string, label: string, icon: string, text: string }> = {
  Draft: { to: 'Sent', label: 'Send invoice', icon: 'mdi-send-outline', text: 'It will be marked as sent to the customer.' },
  Sent: { to: 'Approved', label: 'Approve invoice', icon: 'mdi-check-decagram-outline', text: 'It will be marked as approved by the customer.' },
  Approved: { to: 'Paid', label: 'Mark as paid', icon: 'mdi-cash-check', text: 'It will be marked as paid in full.' },
}

export const EDITABLE_INVOICE = ['Draft']
export const DELETABLE_INVOICE = ['Draft']

export const readyOrdersFor = (customer: string): Order[] => orders.filter(o => o.customer === customer && o.status === 'Ready for invoice')

/** Customers that have orders waiting to be invoiced come first. */
export const customersByReady = (): { title: string, value: string, count: number }[] =>
  CUST.map(c => ({ title: c, value: c, count: readyOrdersFor(c).length })).sort((a, b) => b.count - a.count)

/** A Draft invoice for the picked orders, which become Invoice generated. */
export function createInvoice (customer: string, date: string, due: string, orderIds: string[]): Invoice {
  const picked = orders.filter(o => orderIds.includes(o.id))
  const invoice = withVat({
    id: nextId(invoices, 'INV-26-'),
    customer,
    orders: picked.map(o => o.id),
    date,
    due,
    amount: picked.reduce((n, o) => n + o.rate, 0),
    status: 'Draft',
  })
  invoices.unshift(invoice)
  picked.forEach(o => { o.status = 'Invoice generated' })
  return invoice
}

export function advanceInvoice (invoice: Invoice): void {
  const next = NEXT_STEP[invoice.status]
  if (next) invoice.status = next.to
}

/** Deleting a Draft frees its orders to be invoiced again. */
export function releaseOrders (invoice: Invoice): void {
  orders.filter(o => invoice.orders.includes(o.id) && o.status === 'Invoice generated').forEach(o => { o.status = 'Ready for invoice' })
}
