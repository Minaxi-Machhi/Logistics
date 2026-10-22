import { reactive } from 'vue'
import type { Order } from '@/types'
import { BRANCH, CITY, CUST, day, pick, rows, STATUS, VEND } from './lookups'

export const DEPOT: Record<string, string> = { Dubai: 'Dubai Depot', 'Abu Dhabi': 'Abu Dhabi Depot', Sharjah: 'Sharjah Depot', Ajman: 'Ajman Depot', 'Al Ain': 'Al Ain Depot', 'Ras Al Khaimah': 'RAK Depot', Fujairah: 'Fujairah Port', 'Jebel Ali': 'Jebel Ali Port' }
/** Address book used by the pickup / drop and leg dialogs. */
export const ADDRESS_BOOK = [...Object.values(DEPOT), 'Jebel Ali Free Zone Gate 3', 'Al Quoz Warehouse 12', 'Khalifa Port Terminal 2']
export const PRODUCTS = ['Frozen foods', 'Building materials', 'Pharma', 'Beverages', 'Electronics', 'Consumer goods']
const FLOW = ['Pending', 'Confirmed', 'Active', 'Completed', 'Completed', 'Completed', 'Ready for invoice', 'Completed', 'Invoice generated', 'Completed', 'Cancelled', 'Completed', 'Rejected']

export const JOB_TYPES = ['FTL', 'FCL', 'LTL'] as const
export const ORDER_STATUSES = STATUS.order

/** What a caller supplies; depots, reference and the optional details are filled in. */
export type OrderInput = Omit<Order, 'originDepot' | 'destDepot' | 'ref' | 'product' | 'vendor' | 'quantity' | 'remarks' | 'legs'> &
  Partial<Pick<Order, 'ref' | 'originDepot' | 'destDepot' | 'product' | 'vendor' | 'quantity' | 'remarks' | 'legs'>>

/** Fills the fields that follow from the ones the user enters. */
export function buildOrder (o: OrderInput): Order {
  return {
    ...o,
    originDepot: o.originDepot || DEPOT[o.origin] || o.origin,
    destDepot: o.destDepot || DEPOT[o.destination] || o.destination,
    ref: o.ref ?? `REF${o.jobType}${o.orderDate.split('/').reverse().join('').slice(2)}`,
    product: o.product ?? '',
    vendor: o.vendor ?? '',
    quantity: o.quantity ?? 0,
    remarks: o.remarks ?? '',
    legs: o.legs ?? [],
  }
}

/** Rebuilds an order after an edit. Depots only follow the route when the route itself changed. */
export function rebuildOrder (current: Order, values: Record<string, any>): Order {
  const { ref: _ref, ...merged } = { ...current, ...values }
  // A changed city brings its own depot, unless the user picked a different address on purpose.
  const originMoved = merged.origin !== current.origin && (values.originDepot === undefined || values.originDepot === current.originDepot)
  const destMoved = merged.destination !== current.destination && (values.destDepot === undefined || values.destDepot === current.destDepot)
  return buildOrder({ ...merged, originDepot: originMoved ? undefined : merged.originDepot, destDepot: destMoved ? undefined : merged.destDepot } as OrderInput)
}

export const loadingDate = (o: Pick<Order, 'loading'>): string => o.loading.split(' ')[0]

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
  product: pick(PRODUCTS, i + 1),
  vendor: i % 2 ? pick(VEND, i) : '',
  quantity: 4 + (i % 7) * 3,
})))
