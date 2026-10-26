import type { Trip } from '@/types'
import { addDays } from './lookups'
import { drivers, vehicles } from './assets'
import { orders } from './orders'
import { trips } from './trips'

export const TRIP_STATUSES = ['Unassigned', 'Assigned', 'Active', 'Completed', 'Cancelled'] as const

/** A trip joined with the details of its order, for the list. */
export interface TripRow extends Trip {
  customer: string
  jobType: string
  branch: string
  fleet: string
}

export const needsTruck = (t: Trip) => t.status === 'Unassigned'

export function toRow (t: Trip): TripRow {
  const order = orders.find(o => o.id === t.order)
  return { ...t, customer: order?.customer ?? '', jobType: order?.jobType ?? '', branch: order?.branch ?? '', fleet: 'Own fleet' }
}

export const CAN_ALLOCATE = ['Unassigned', 'Assigned']
export const CAN_RESCHEDULE_TRIP = ['Unassigned', 'Assigned']

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
  if (trip.status === 'Unassigned') trip.status = 'Assigned'
  setAsset(driver, vehicle, 'On duty')
}

export function rescheduleTrip (trip: Trip, date: string): void {
  trip.departure = date
  trip.eta = addDays(date, 1)
}

