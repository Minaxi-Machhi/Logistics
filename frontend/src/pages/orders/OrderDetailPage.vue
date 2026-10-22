<template>
  <RecordDetail
    v-if="order"
    :title="order.id"
    :subtitle="`${order.jobType} · ${order.ref}`"
    :status="order.status"
    back-to="/app/orders"
    :sections="sections"
  >
    <template #actions>
      <v-btn v-if="order.status === 'Pending'" color="primary" variant="flat" prepend-icon="mdi-check-circle-outline" class="rounded-lg text-none font-weight-bold" @click="flow.confirming = order">Confirm order</v-btn>
      <v-btn v-if="order.status === 'Confirmed'" color="primary" variant="flat" prepend-icon="mdi-truck-plus-outline" class="rounded-lg text-none font-weight-bold" @click="flow.planning = order">Create trip</v-btn>
      <v-btn v-if="order.status === 'Completed'" color="primary" variant="flat" prepend-icon="mdi-file-check-outline" class="rounded-lg text-none font-weight-bold" @click="flow.readying = order">Ready for invoice</v-btn>
      <v-btn v-if="order.status === 'Ready for invoice'" color="primary" variant="flat" prepend-icon="mdi-file-document-plus-outline" class="rounded-lg text-none font-weight-bold" @click="flow.invoicing = order">Generate invoice</v-btn>
      <v-btn v-if="EDITABLE.includes(order.status)" variant="outlined" prepend-icon="mdi-pencil-outline" class="rounded-lg text-none" @click="crud.openEdit(order)">Edit</v-btn>
      <v-btn v-if="CANCELLABLE.includes(order.status)" variant="outlined" color="error" prepend-icon="mdi-close-circle-outline" class="rounded-lg text-none" @click="flow.cancelling = order">Cancel order</v-btn>
    </template>
    <OrderTimeline :status="order.status" />
    <RelatedTable title="Trips" :columns="tripColumns" :items="relatedTrips" :link-to="tripLink" empty="No trip planned for this order yet." />
    <RelatedTable title="Invoices" :columns="invoiceColumns" :items="relatedInvoices" :link-to="invoiceLink" empty="Not invoiced yet." />
    <OrderFlowDialogs :flow="flow" />
    <OrderFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
  </RecordDetail>
  <NotFound v-else back-to="/app/orders" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { DetailSection, Order } from '@/types'
import { invoices } from '@/mock/invoices'
import { orders, rebuildOrder } from '@/mock/orders'
import { trips } from '@/mock/trips'
import { useCrud } from '@/composables/useCrud'
import { useOrderFlow } from '@/composables/useOrderFlow'
import { CANCELLABLE, EDITABLE } from '@/mock/orderFlow'
import NotFound from '@/components/common/NotFound.vue'
import RecordDetail from '@/components/common/RecordDetail.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { invoiceColumns, invoiceLink } from '../invoices/config'
import { tripColumns, tripLink } from '../trips/config'
import OrderFlowDialogs from './components/OrderFlowDialogs.vue'
import OrderFormDialog from './components/OrderFormDialog.vue'
import OrderTimeline from './components/OrderTimeline.vue'

const route = useRoute()
const router = useRouter()
const order = computed(() => orders.find(o => o.id === route.params.id))

const flow = useOrderFlow({ onInvoiceGenerated: id => router.push(invoiceLink({ id })) })
const crud = useCrud<Order>(orders, { prefix: '', update: rebuildOrder })

const sections = computed<DetailSection[]>(() => {
  const o = order.value!
  return [
    { title: 'Order', items: [{ label: 'Customer', value: o.customer }, { label: 'Job type', value: o.jobType }, { label: 'Reference', value: o.ref, type: 'mono' }, { label: 'Branch', value: o.branch }, { label: 'Order date', value: o.orderDate }] },
    { title: 'Route and schedule', items: [{ label: 'Origin', value: `${o.origin} · ${o.originDepot}` }, { label: 'Destination', value: `${o.destination} · ${o.destDepot}` }, { label: 'Loading', value: o.loading }, { label: 'Cut-off', value: o.cutoff || '—' }, { label: 'Sell rate', value: o.rate, type: 'money' }] },
  ]
})

const relatedTrips = computed(() => trips.filter(t => t.order === route.params.id))
const relatedInvoices = computed(() => invoices.filter(i => i.order === route.params.id))

</script>
