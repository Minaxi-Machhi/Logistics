import { computed, reactive } from 'vue'
import type { Order } from '@/types'
import { orders } from '@/mock/orders'

/** Which order the row-action dialogs act on, and which of them is open. Shared by the list and detail pages. */
export const orderStore = reactive({
  currentOrderId: null as string | null,

  formOpen: false,
  rescheduleOpen: false,
  pickDropOpen: false,
  branchOpen: false,
  rateOpen: false,
  splitOpen: false,
  replicateOpen: false,
  legOpen: false,
  drawerOpen: false,

  openNew () { this.currentOrderId = null; this.formOpen = true },
  openEdit (order: Order) { this.currentOrderId = order.id; this.formOpen = true },
  open (dialog: 'rescheduleOpen' | 'pickDropOpen' | 'branchOpen' | 'rateOpen' | 'splitOpen' | 'replicateOpen' | 'legOpen' | 'drawerOpen', order: Order) {
    this.currentOrderId = order.id
    this[dialog] = true
  },
})

export const currentOrder = computed<Order | undefined>(() => orders.find(o => o.id === orderStore.currentOrderId))
