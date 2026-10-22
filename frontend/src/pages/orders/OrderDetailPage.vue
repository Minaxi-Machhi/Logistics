<template>
  <RecordDetail
    v-if="order"
    :title="order.id"
    :subtitle="`${order.jobType} · ${order.ref}`"
    :status="order.status"
    back-to="/app/orders"
    :sections="tab === 'overview' ? sections : []"
  >
    <template #actions>
      <v-btn v-if="order.status === 'Pending'" color="primary" variant="flat" prepend-icon="mdi-check-circle-outline" class="rounded-lg text-none font-weight-bold" @click="flow.confirming = order">Confirm order</v-btn>
      <v-btn v-if="order.status === 'Confirmed'" color="primary" variant="flat" prepend-icon="mdi-truck-plus-outline" class="rounded-lg text-none font-weight-bold" @click="flow.planning = order">Create trip</v-btn>
      <v-btn v-if="order.status === 'Completed'" color="primary" variant="flat" prepend-icon="mdi-file-check-outline" class="rounded-lg text-none font-weight-bold" @click="flow.readying = order">Ready for invoice</v-btn>
      <v-btn v-if="order.status === 'Ready for invoice'" color="primary" variant="flat" prepend-icon="mdi-file-document-plus-outline" class="rounded-lg text-none font-weight-bold" @click="flow.invoicing = order">Generate invoice</v-btn>
      <v-btn v-if="EDITABLE.includes(order.status)" variant="outlined" prepend-icon="mdi-pencil-outline" class="rounded-lg text-none" @click="orderStore.openEdit(order)">Edit</v-btn>
      <v-btn v-if="CANCELLABLE.includes(order.status)" variant="outlined" color="error" prepend-icon="mdi-close-circle-outline" class="rounded-lg text-none" @click="flow.cancelling = order">Cancel order</v-btn>
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="outlined" append-icon="mdi-chevron-down" class="rounded-lg text-none">More</v-btn>
        </template>
        <v-list density="compact" min-width="210">
          <v-list-item :disabled="!CAN_RESCHEDULE.includes(order.status)" prepend-icon="mdi-calendar-edit" title="Reschedule order" @click="orderStore.open('rescheduleOpen', order)" />
          <v-list-item :disabled="!CAN_EDIT_PICK_DROP.includes(order.status)" prepend-icon="mdi-map-marker-outline" title="Edit pickup and drop details" @click="orderStore.open('pickDropOpen', order)" />
          <v-list-item prepend-icon="mdi-content-duplicate" title="Replicate order" @click="orderStore.open('replicateOpen', order)" />
          <v-list-item :disabled="!CAN_CHANGE_BRANCH.includes(order.status)" prepend-icon="mdi-source-branch" title="Change branch" @click="orderStore.open('branchOpen', order)" />
          <v-list-item v-if="['FTL', 'FCL'].includes(order.jobType)" :disabled="!CAN_UPDATE_RATE.includes(order.status)" prepend-icon="mdi-cash-edit" title="Update rate" @click="orderStore.open('rateOpen', order)" />
          <v-list-item v-if="order.jobType === 'FTL'" :disabled="!CAN_SPLIT.includes(order.status)" prepend-icon="mdi-call-split" title="Split order" @click="orderStore.open('splitOpen', order)" />
        </v-list>
      </v-menu>
    </template>

    <OrderTimeline :status="order.status" />

    <v-tabs v-model="tab" color="primary" class="mb-2">
      <v-tab value="overview" class="text-none">Overview</v-tab>
      <v-tab value="trips" class="text-none">Trips <v-chip size="x-small" label class="ml-2 font-mono">{{ relatedTrips.length }}</v-chip></v-tab>
      <v-tab value="legs" class="text-none">Legs <v-chip size="x-small" label class="ml-2 font-mono">{{ order.legs.length }}</v-chip></v-tab>
      <v-tab value="invoices" class="text-none">Invoices <v-chip size="x-small" label class="ml-2 font-mono">{{ relatedInvoices.length }}</v-chip></v-tab>
    </v-tabs>

    <RelatedTable v-if="tab === 'trips'" title="Trips" :columns="tripColumns" :items="relatedTrips" :link-to="tripLink" empty="No trip planned for this order yet." />
    <RelatedTable v-if="tab === 'invoices'" title="Invoices" :columns="invoiceColumns" :items="relatedInvoices" :link-to="invoiceLink" empty="Not invoiced yet." />
    <div v-if="tab === 'legs'">
      <div class="d-flex justify-end mb-2">
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" height="32" @click="orderStore.open('legOpen', order)">Add additional leg</v-btn>
      </div>
      <RelatedTable title="Additional legs" :columns="legColumns" :items="order.legs" empty="No additional legs yet." />
    </div>

    <OrderFlowDialogs :flow="flow" />
    <OrderDialogs />
  </RecordDetail>
  <NotFound v-else back-to="/app/orders" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Column, DetailSection } from '@/types'
import { orderStore } from '@/composables/useOrderStore'
import { useOrderFlow } from '@/composables/useOrderFlow'
import { invoices } from '@/mock/invoices'
import { CANCELLABLE, EDITABLE } from '@/mock/orderFlow'
import { CAN_CHANGE_BRANCH, CAN_EDIT_PICK_DROP, CAN_RESCHEDULE, CAN_SPLIT, CAN_UPDATE_RATE } from '@/mock/orderOps'
import { orders } from '@/mock/orders'
import { trips } from '@/mock/trips'
import NotFound from '@/components/common/NotFound.vue'
import RecordDetail from '@/components/common/RecordDetail.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { invoiceColumns, invoiceLink } from '../invoices/config'
import { tripColumns, tripLink } from '../trips/config'
import OrderDialogs from './components/OrderDialogs.vue'
import OrderFlowDialogs from './components/OrderFlowDialogs.vue'
import OrderTimeline from './components/OrderTimeline.vue'

const route = useRoute()
const router = useRouter()
const order = computed(() => orders.find(o => o.id === route.params.id))
const tab = ref('overview')

const flow = useOrderFlow({ onInvoiceGenerated: id => router.push(invoiceLink({ id })) })

// The dialogs act on the store's current order, so keep it on this page's order.
watch(order, o => { if (o) orderStore.currentOrderId = o.id }, { immediate: true })

const legColumns: Column[] = [
  { key: 'id', title: 'Leg', type: 'mono' }, { key: 'source', title: 'Source' }, { key: 'destination', title: 'Destination' },
  { key: 'loading', title: 'Loading date' }, { key: 'remarks', title: 'Remarks' },
]

const sections = computed<DetailSection[]>(() => {
  const o = order.value!
  return [
    { title: 'Order', items: [{ label: 'Customer', value: o.customer }, { label: 'Job type', value: o.jobType }, { label: 'Reference', value: o.ref, type: 'mono' }, { label: 'Branch', value: o.branch }, { label: 'Order date', value: o.orderDate }, { label: 'Remarks', value: o.remarks || '—' }] },
    { title: 'Route and schedule', items: [{ label: 'Origin', value: `${o.origin} · ${o.originDepot}` }, { label: 'Destination', value: `${o.destination} · ${o.destDepot}` }, { label: 'Loading', value: o.loading }, { label: 'Cut-off', value: o.cutoff || '—' }] },
    { title: 'Cargo', items: [{ label: 'Product', value: o.product || '—' }, { label: 'Vendor', value: o.vendor || '—' }, { label: 'Quantity', value: o.quantity || '—' }] },
    { title: 'Commercial', items: [{ label: 'Sell rate', value: o.rate, type: 'money' }] },
  ]
})

const relatedTrips = computed(() => trips.filter(t => t.order === route.params.id))
const relatedInvoices = computed(() => invoices.filter(i => i.order === route.params.id))
</script>
