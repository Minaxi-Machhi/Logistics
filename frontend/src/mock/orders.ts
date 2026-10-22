import { reactive } from 'vue'
import type { Order } from '@/types'
import { BRANCH, CITY, CUST, day, pick, rows, STATUS } from './lookups'

const DEPOT: Record<string, string> = { Dubai: 'Dubai Depot', 'Abu Dhabi': 'Abu Dhabi Depot', Sharjah: 'Sharjah Depot', Ajman: 'Ajman Depot', 'Al Ain': 'Al Ain Depot', 'Ras Al Khaimah': 'RAK Depot', Fujairah: 'Fujairah Port', 'Jebel Ali': 'Jebel Ali Port' }
const FLOW = ['Pending', 'Confirmed', 'Active', 'Completed', 'Completed', 'Completed', 'Ready for invoice', 'Completed', 'Invoice generated', 'Completed', 'Cancelled', 'Completed', 'Rejected']

export const JOB_TYPES = ['FTL', 'FCL', 'LTL'] as const
export const ORDER_STATUSES = STATUS.order

/** Fills the fields that follow from the ones the user enters. */
export function buildOrder (o: Omit<Order, 'originDepot' | 'destDepot' | 'ref'> & { ref?: string }): Order {
  return {
    ...o,
    originDepot: DEPOT[o.origin] ?? o.origin,
    destDepot: DEPOT[o.destination] ?? o.destination,
    ref: o.ref ?? `REF${o.jobType}${o.orderDate.split('/').reverse().join('').slice(2)}`,
  }
}

/** Rebuilds an order after an edit, so depots and the reference follow the new values. */
export function rebuildOrder (current: Order, values: Record<string, any>): Order {
  const { ref: _ref, originDepot: _o, destDepot: _d, ...rest } = { ...current, ...values }
  return buildOrder(rest as Omit<Order, 'originDepot' | 'destDepot' | 'ref'>)
}

export const orders = reactive<Order[]>(rows(27, i => buildOrder({
  id: `ATS-TL2610-${String(27 - i).padStart(4, '0')}`,
  customer: pick(CUST, i),
  jobType: pick(['FTL', 'FTL', 'FCL', 'LTL'] as const, i),
  origin: pick(CITY, i),
  destination: pick(CITY, i + 3),
  loading: `${day(i)} ${pick(['7:09 pm', '3:19 pm', '4:02 pm', '11:40 am', '10:26 am'], i)}`,
  orderDate: day(i),
  rate: pick([1000, 70, 1200, 700, 1020, 2400], i),
  status: pick(FLOW, i),
  branch: pick(BRANCH, i),
  cutoff: i % 3 ? day(i - 1) : '',
})))
