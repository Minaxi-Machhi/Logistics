import type { Invoice, Order, Trip } from '@/types'
import { drivers, vehicles } from './assets'
import { invoices, withVat } from './invoices'
import { addDays, nextId, TODAY } from './lookups'
import { orders } from './orders'
import { trips } from './trips'

/**
 * Order lifecycle:
 *   Pending -> Confirmed (rate applied) -> Active (trip created) -> Completed (trip delivered)
 *   -> Ready for invoice -> Invoice generated.   Pending/Confirmed orders can also be cancelled.
 */
export const EDITABLE = ['Pending', 'Confirmed']
export const CANCELLABLE = ['Pending', 'Confirmed']

export const FLOW_STEPS = ['Pending', 'Confirmed', 'Active', 'Completed', 'Ready for invoice', 'Invoice generated']

export interface TripInput {
  driver: string
  vehicle: string
  departure: string
  eta: string
}

export function confirmOrder (order: Order, rate: number): void {
  order.rate = rate
  order.status = 'Confirmed'
}

export function cancelOrder (order: Order): void {
  order.status = 'Cancelled'
}

/** Creates a trip for a confirmed order; the order becomes Active. */
export function createTripForOrder (order: Order, input: TripInput): Trip {
  const trip: Trip = {
    id: nextId(trips, 'TRP-'),
    order: order.id,
    route: `${order.origin} → ${order.destination}`,
    distance: '—',
    status: 'Scheduled',
    ...input,
  }
  trips.unshift(trip)
  order.status = 'Active'
  setAssetStatus(input, 'On duty')
  return trip
}

export function startTrip (trip: Trip): void {
  trip.status = 'In transit'
}

/** Delivers a trip and frees its driver and vehicle. Returns the order if it moved to Completed. */
export function completeTrip (trip: Trip): Order | undefined {
  trip.status = 'Delivered'
  setAssetStatus(trip, 'Available')
  const order = orders.find(o => o.id === trip.order)
  if (order?.status === 'Active') {
    order.status = 'Completed'
    return order
  }
}

export function markReadyForInvoice (order: Order): void {
  order.status = 'Ready for invoice'
}

/** Bills the order at its sell rate, with 30-day terms. */
export function generateInvoice (order: Order): Invoice {
  const invoice = withVat({
    id: nextId(invoices, 'INV-26-'),
    customer: order.customer,
    order: order.id,
    date: TODAY,
    due: addDays(TODAY, 30),
    amount: order.rate,
    status: 'Draft',
  })
  invoices.unshift(invoice)
  order.status = 'Invoice generated'
  return invoice
}

function setAssetStatus ({ driver, vehicle }: { driver: string, vehicle: string }, status: string): void {
  const d = drivers.find(x => x.name === driver)
  const v = vehicles.find(x => x.id === vehicle)
  if (d) d.status = status
  if (v) v.status = status
}
