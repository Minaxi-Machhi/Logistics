<template>
  <OrderFormDialog v-model="orderStore.formOpen" :row="current ?? null" @save="saveForm" />

  <FormDialog v-model="orderStore.rescheduleOpen" :title="`Reschedule ${current?.id ?? ''}`" submit-label="Reschedule" :fields="[date('date', 'Loading date')]" :row="current && { date: loadingDate(current) }" @save="v => run(o => reschedule(o, v.date), 'rescheduled')" />
  <FormDialog v-model="orderStore.pickDropOpen" :title="`Pickup and drop for ${current?.id ?? ''}`" submit-label="Save" :fields="pickDropFields" :row="current && { pickup: current.originDepot, drop: current.destDepot }" @save="v => run(o => updatePickDrop(o, v.pickup, v.drop), 'pickup and drop updated')" />
  <FormDialog v-model="orderStore.branchOpen" :title="`Change branch for ${current?.id ?? ''}`" submit-label="Change branch" :fields="[select('branch', 'Branch', BRANCH, req)]" :row="current && { branch: current.branch }" @save="v => run(o => changeBranch(o, v.branch), 'branch changed')" />
  <FormDialog v-model="orderStore.rateOpen" :title="`Update rate for ${current?.id ?? ''}`" submit-label="Update rate" :fields="[num('rate', 'Sell rate', req)]" :row="current && { rate: current.rate }" @save="v => run(o => updateRate(o, v.rate), 'rate updated')" />
  <FormDialog v-model="orderStore.splitOpen" :title="`Split ${current?.id ?? ''}`" submit-label="Split order" :fields="splitFields" @save="onSplit" />
  <FormDialog v-model="orderStore.legOpen" :title="`New additional leg for ${current?.id ?? ''}`" submit-label="Create leg" :fields="legFields" @save="onLeg" />

  <ConfirmDialog v-model="orderStore.replicateOpen" title="Replicate order?" :text="`${current?.id} will be copied as a new Pending order dated today.`" confirm-label="Replicate" confirm-color="primary" @confirm="onReplicate" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FieldDef, Order } from '@/types'
import { currentOrder as current, orderStore } from '@/composables/useOrderStore'
import { notify } from '@/composables/useToast'
import { BRANCH, TODAY } from '@/mock/lookups'
import { addLeg, ADDRESS_BOOK, changeBranch, replicate, reschedule, split, updatePickDrop, updateRate } from '@/mock/orderOps'
import { buildOrder, loadingDate, orders, rebuildOrder } from '@/mock/orders'
import { nextId } from '@/mock/lookups'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import { date, num, req, select, text } from '../../fields'
import OrderFormDialog from './OrderFormDialog.vue'

const emit = defineEmits<{ opened: [order: Order] }>()

const pickDropFields: FieldDef[] = [select('pickup', 'Pickup address', ADDRESS_BOOK, req), select('drop', 'Drop address', ADDRESS_BOOK, req)]
const splitFields: FieldDef[] = [num('parts', 'Split into', { ...req, value: 2, hint: 'Number of new orders (2 to 5). The original is cancelled.' })]
const legFields = computed<FieldDef[]>(() => [
  select('source', 'Source address', ADDRESS_BOOK, req),
  select('destination', 'Destination address', ADDRESS_BOOK, req),
  date('loading', 'Loading date', { value: '2026-10-23' }),
  text('remarks', 'Remarks'),
])

/** Runs an edit on the current order and confirms it. */
function run (change: (o: Order) => void, done: string) {
  if (!current.value) return
  change(current.value)
  notify(`${current.value.id} ${done}`)
}

function saveForm (values: Record<string, any>) {
  const { loadingDate: date, ...rest } = values
  if (current.value) {
    const o = current.value
    Object.assign(o, rebuildOrder(o, { ...rest, loading: `${date} ${o.loading.split(' ').slice(1).join(' ')}`.trim() }))
    notify(`${o.id} updated`)
    return
  }
  const order = buildOrder({ ...(rest as Omit<Order, 'originDepot' | 'destDepot' | 'ref' | 'status'>), id: nextId(orders, 'ATS-TL2610-', 4), status: 'Pending', loading: `${date} 9:00 am`, cutoff: '' })
  orders.unshift(order)
  notify(`${order.id} created`)
  emit('opened', order)
}

function onSplit (v: Record<string, any>) {
  if (!current.value) return
  const parts = Math.min(5, Math.max(2, Math.round(Number(v.parts))))
  const made = split(current.value, parts)
  notify(`${current.value.id} split into ${made.length} orders`)
}

function onLeg (v: Record<string, any>) {
  if (!current.value) return
  addLeg(current.value, { source: v.source, destination: v.destination, loading: v.loading || TODAY, remarks: v.remarks ?? '' })
  notify(`Leg added to ${current.value.id}`)
}

function onReplicate () {
  if (!current.value) return
  const copy = replicate(current.value)
  notify(`${copy.id} created from ${current.value.id}`)
}

</script>
