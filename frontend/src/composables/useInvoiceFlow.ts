import { reactive, ref } from 'vue'
import type { Invoice } from '@/types'
import { advanceInvoice, NEXT_STEP } from '@/mock/invoiceOps'
import { notify } from './useToast'

/** Asks before moving an invoice to its next status (Draft to Sent to Approved to Paid). */
export function useInvoiceFlow () {
  const target = ref<Invoice | null>(null)

  function ask (invoice: Invoice): void {
    if (NEXT_STEP[invoice.status]) target.value = invoice
  }

  function confirm (): void {
    if (!target.value) return
    const step = NEXT_STEP[target.value.status]
    advanceInvoice(target.value)
    notify(`${target.value.id} is now ${step.to}`)
    target.value = null
  }

  return reactive({ target, ask, confirm })
}

export type InvoiceFlow = ReturnType<typeof useInvoiceFlow>
