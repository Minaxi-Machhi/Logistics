import type { Order, Trip } from '@/types'
import { addDays } from './lookups'
import { drivers, vehicles } from './assets'
import { orders } from './orders'
import { trips } from './trips'

export const LEG_STATUSES = ['Needs a truck', 'Assigned', 'In progress', 'Completed', 'Cancelled', 'Ready for invoice', 'Invoice generated'] as const

/** A trip joined with the details of its order, for the list. */
export interface TripRow extends Trip {
  customer: string
  jobType: string
  branch: string
  fleet: string
  legStatus: string
}

export const needsTruck = (t: Trip) => t.status !== 'Cancelled' && t.status !== 'Delivered' && (!t.driver || !t.vehicle)

/** The status the list shows. Billing states come from the order once the trip is delivered. */
export function legStatus (t: Trip, order?: Order): string {
  if (t.status === 'Cancelled') return 'Cancelled'
  if (needsTruck(t)) return 'Needs a truck'
  if (t.status === 'Delivered') {
    if (order?.status === 'Ready for invoice') return 'Ready for invoice'
    if (order?.status === 'Invoice generated') return 'Invoice generated'
    return 'Completed'
  }
  return t.status === 'In transit' ? 'In progress' : 'Assigned'
}

export function toRow (t: Trip): TripRow {
  const order = orders.find(o => o.id === t.order)
  return { ...t, customer: order?.customer ?? '', jobType: order?.jobType ?? '', branch: order?.branch ?? '', fleet: 'Own fleet', legStatus: legStatus(t, order) }
}

export const CAN_ALLOCATE = ['Scheduled']
export const CAN_RESCHEDULE_TRIP = ['Scheduled']

const setAsset = (driver: string, vehicle: string, status: string) => {
  const d = drivers.find(x => x.name === driver)
  const v = vehicles.find(x => x.id === vehicle)
  if (d) d.status = status
  if (v) v.status = status
}

/** Puts a driver and vehicle on a trip; whatever it had before goes back to Available. */
export function allocate (trip: Trip, driver: string, vehicle: string): void {
  setAsset(trip.driver, trip.vehicle, 'Available')
  trip.driver = driver
  trip.vehicle = vehicle
  setAsset(driver, vehicle, 'On duty')
}

export function rescheduleTrip (trip: Trip, date: string): void {
  trip.departure = date
  trip.eta = addDays(date, 1)
}

