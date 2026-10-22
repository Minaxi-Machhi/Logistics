import { reactive, ref } from 'vue'
import type { Order } from '@/types'
import { cancelOrder, confirmOrder, createTripForOrder, generateInvoice, markReadyForInvoice, type TripInput } from '@/mock/orderFlow'
import { notify } from './useToast'

/** State and actions for the order lifecycle dialogs (confirm, create trip, cancel). Shared by the list and detail pages. */
export function useOrderFlow (options: { onInvoiceGenerated?: (invoiceId: string) => void } = {}) {
  const confirming = ref<Order | null>(null)
  const planning = ref<Order | null>(null)
  const cancelling = ref<Order | null>(null)
  const readying = ref<Order | null>(null)
  const invoicing = ref<Order | null>(null)

  function applyRate (values: Record<string, any>): void {
    if (!confirming.value) return
    confirmOrder(confirming.value, Number(values.rate))
    notify(`${confirming.value.id} confirmed at ${values.rate}`)
  }

  function createTrip (values: Record<string, any>): void {
    if (!planning.value) return
    const trip = createTripForOrder(planning.value, values as TripInput)
    notify(`${trip.id} created, ${planning.value.id} is now Active`)
  }

  function cancel (): void {
    if (!cancelling.value) return
    cancelOrder(cancelling.value)
    notify(`${cancelling.value.id} cancelled`)
    cancelling.value = null
  }

  function confirmReady (): void {
    if (!readying.value) return
    markReadyForInvoice(readying.value)
    notify(`${readying.value.id} is ready for invoice`)
    readying.value = null
  }

  function confirmInvoice (): void {
    if (!invoicing.value) return
    const inv = generateInvoice(invoicing.value)
    notify(`${inv.id} generated for ${invoicing.value.id}`)
    invoicing.value = null
    options.onInvoiceGenerated?.(inv.id)
  }

  return reactive({ confirming, planning, cancelling, readying, invoicing, applyRate, createTrip, cancel, confirmReady, confirmInvoice })
}

export type OrderFlow = ReturnType<typeof useOrderFlow>
