<template>
  <RecordDetail v-if="invoice" :title="invoice.id" :subtitle="invoice.customer" :status="invoice.status" back-to="/app/invoices" :sections="sections">
    <template #actions>
      <v-btn v-if="NEXT_STEP[invoice.status]" color="primary" variant="flat" :prepend-icon="NEXT_STEP[invoice.status].icon" class="rounded-lg text-none font-weight-bold" @click="flow.ask(invoice)">{{ NEXT_STEP[invoice.status].label }}</v-btn>
      <v-btn v-if="EDITABLE_INVOICE.includes(invoice.status)" variant="outlined" prepend-icon="mdi-pencil-outline" class="rounded-lg text-none" @click="crud.openEdit(invoice)">Edit dates</v-btn>
      <v-btn v-if="DELETABLE_INVOICE.includes(invoice.status)" variant="outlined" color="error" prepend-icon="mdi-delete-outline" class="rounded-lg text-none" @click="crud.askRemove(invoice)">Delete draft</v-btn>
    </template>

    <v-card class="rounded-lg border pa-3 mb-3" flat>
      <div class="steps">
        <div v-for="(s, i) in STEPS" :key="s" class="step" :class="{ done: i < stepIndex, current: i === stepIndex }">
          <span class="dot"><v-icon v-if="i < stepIndex" icon="mdi-check" size="13" /></span>{{ s }}
        </div>
      </div>
    </v-card>

    <RelatedTable title="Billed orders" :columns="orderColumns" :items="billedOrders" :link-to="orderLink" empty="Orders for this invoice are not in the list." />

    <InvoiceFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog
      :model-value="!!flow.target"
      :title="`${NEXT_STEP[invoice.status]?.label ?? ''}?`"
      :text="`${invoice.id}: ${NEXT_STEP[invoice.status]?.text ?? ''}`"
      :confirm-label="NEXT_STEP[invoice.status]?.label ?? ''"
      confirm-color="primary"
      @update:model-value="v => { if (!v) flow.target = null }"
      @confirm="flow.confirm()"
    />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete draft?" :text="`${invoice.id} will be removed and its orders go back to Ready for invoice.`" @confirm="onDelete" />
  </RecordDetail>
  <NotFound v-else back-to="/app/invoices" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Column, DetailSection, Invoice } from '@/types'
import { useCrud } from '@/composables/useCrud'
import { useInvoiceFlow } from '@/composables/useInvoiceFlow'
import { DELETABLE_INVOICE, EDITABLE_INVOICE, NEXT_STEP, releaseOrders } from '@/mock/invoiceOps'
import { invoices } from '@/mock/invoices'
import { STATUS } from '@/mock/lookups'
import { orders } from '@/mock/orders'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import NotFound from '@/components/common/NotFound.vue'
import RecordDetail from '@/components/common/RecordDetail.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { orderLink } from '../orders/config'
import InvoiceFormDialog from './components/InvoiceFormDialog.vue'

const route = useRoute()
const router = useRouter()
const invoice = computed(() => invoices.find(i => i.id === route.params.id))
const flow = useInvoiceFlow()
const crud = useCrud<Invoice>(invoices, { prefix: '' })

const STEPS = STATUS.invoice
const stepIndex = computed(() => STEPS.indexOf((invoice.value?.status ?? 'Draft') as (typeof STEPS)[number]))

const orderColumns: Column[] = [
  { key: 'id', title: 'Order', type: 'mono' }, { key: 'jobType', title: 'Job type' }, { key: 'route', title: 'Route' },
  { key: 'loading', title: 'Loading' }, { key: 'rate', title: 'Sell rate', type: 'money' },
]
const billedOrders = computed(() => orders.filter(o => invoice.value?.orders.includes(o.id)).map(o => ({ ...o, route: `${o.origin} → ${o.destination}` })))

const sections = computed<DetailSection[]>(() => {
  const i = invoice.value!
  return [
    { title: 'Invoice', items: [{ label: 'Customer', value: i.customer }, { label: 'Orders', value: i.orders.length }, { label: 'Invoice date', value: i.date }, { label: 'Due date', value: i.due }] },
    { title: 'Amounts', items: [{ label: 'Amount', value: i.amount, type: 'money' }, { label: 'VAT (5%)', value: i.vat, type: 'money' }, { label: 'Total', value: i.total, type: 'money' }] },
  ]
})

function onDelete () {
  if (crud.target) releaseOrders(crud.target)
  if (crud.remove()) router.replace('/app/invoices')
}
</script>

<style scoped>
.steps { display: flex; gap: 8px; flex-wrap: wrap; }
.step { display: inline-flex; align-items: center; gap: 6px; padding: 3px 12px 3px 4px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 999px; font-size: 12px; color: rgba(var(--v-theme-on-surface), 0.55); }
.dot { display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; background: rgba(var(--v-theme-on-surface), 0.1); }
.step.done { color: rgb(var(--v-theme-on-surface)); }
.step.done .dot { background: rgb(var(--v-theme-success)); color: #fff; }
.step.current { border-color: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-surface)); font-weight: 600; }
.step.current .dot { background: rgb(var(--v-theme-primary)); }
</style>
