import type { Order, OrderLeg } from '@/types'
import { ADDRESS_BOOK, buildOrder, loadingDate, orders } from './orders'
import { nextId, TODAY } from './lookups'

/** Small edits to an order, used by the row-action dialogs. */
export const CAN_RESCHEDULE = ['Pending']
export const CAN_EDIT_PICK_DROP = ['Pending']
export const CAN_CHANGE_BRANCH = ['Pending', 'Confirmed']
export const CAN_SPLIT = ['Pending', 'Confirmed']
export const CAN_UPDATE_RATE = ['Pending', 'Confirmed', 'Active']

export function reschedule (order: Order, date: string): void {
  order.loading = `${date} ${order.loading.split(' ').slice(1).join(' ')}`.trim()
}

export function updatePickDrop (order: Order, pickup: string, drop: string): void {
  order.originDepot = pickup
  order.destDepot = drop
}

export const changeBranch = (order: Order, branch: string): void => { order.branch = branch }
export const updateRate = (order: Order, rate: number): void => { order.rate = rate }

const orderId = () => nextId(orders, 'ATS-TL2610-', 4)

/** A new Pending copy of an order, dated today. */
export function replicate (order: Order): Order {
  const copy = buildOrder({
    ...order,
    id: orderId(),
    ref: undefined,
    status: 'Pending',
    orderDate: TODAY,
    loading: `${TODAY} 9:00 am`,
    cutoff: '',
    legs: [],
  })
  orders.unshift(copy)
  return copy
}

/** Splits an order into `parts` Pending orders that share its quantity and rate; the original is cancelled. */
export function split (order: Order, parts: number): Order[] {
  const created: Order[] = []
  for (let i = 0; i < parts; i++) {
    const child = buildOrder({
      ...order,
      id: orderId(),
      ref: undefined,
      status: 'Pending',
      quantity: Math.floor(order.quantity / parts) + (i < order.quantity % parts ? 1 : 0),
      rate: Math.round(order.rate / parts),
      remarks: `Split from ${order.id}`,
      legs: [],
    })
    orders.unshift(child)
    created.push(child)
  }
  order.status = 'Cancelled'
  order.remarks = `Split into ${created.map(c => c.id).join(', ')}`
  return created
}

export function addLeg (order: Order, input: Omit<OrderLeg, 'id'>): OrderLeg {
  const leg: OrderLeg = { id: `${order.id}-L${order.legs.length + 1}`, ...input }
  order.legs.push(leg)
  return leg
}


export { ADDRESS_BOOK }
