<template>
  <RecordDetail v-if="trip" :title="trip.id" :subtitle="trip.route" :status="trip.status" back-to="/app/trips" :sections="sections">
    <template #actions>
      <v-btn v-if="trip.status === 'Scheduled'" color="primary" variant="flat" prepend-icon="mdi-play-circle-outline" class="rounded-lg text-none font-weight-bold" @click="start">Start trip</v-btn>
      <v-btn v-if="trip.status === 'In transit'" color="primary" variant="flat" prepend-icon="mdi-check-circle-outline" class="rounded-lg text-none font-weight-bold" @click="complete">Complete trip</v-btn>
      <v-btn variant="outlined" prepend-icon="mdi-pencil-outline" class="rounded-lg text-none" @click="crud.openEdit(trip)">Edit</v-btn>
      <v-btn variant="outlined" color="error" prepend-icon="mdi-delete-outline" class="rounded-lg text-none" @click="crud.askRemove(trip)">Delete</v-btn>
    </template>
    <RelatedTable title="Order" :columns="orderColumns" :items="linkedOrders" :link-to="orderLink" empty="This trip is not linked to an order in the list." />
    <TripFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete trip?" :text="`${trip.id} will be removed.`" @confirm="onDelete" />
  </RecordDetail>
  <NotFound v-else back-to="/app/trips" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Column, DetailSection, Trip } from '@/types'
import { orders } from '@/mock/orders'
import { trips } from '@/mock/trips'
import { useCrud } from '@/composables/useCrud'
import { notify } from '@/composables/useToast'
import { completeTrip, startTrip } from '@/mock/orderFlow'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import NotFound from '@/components/common/NotFound.vue'
import RecordDetail from '@/components/common/RecordDetail.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { orderLink } from '../orders/config'
import TripFormDialog from './components/TripFormDialog.vue'

const route = useRoute()
const router = useRouter()
const trip = computed(() => trips.find(t => t.id === route.params.id))
const crud = useCrud<Trip>(trips, { prefix: '' })

const orderColumns: Column[] = [
  { key: 'id', title: 'Order', type: 'mono' }, { key: 'customer', title: 'Customer' }, { key: 'jobType', title: 'Job type' },
  { key: 'rate', title: 'Sell rate', type: 'money' }, { key: 'status', title: 'Status', type: 'status' },
]
const linkedOrders = computed(() => orders.filter(o => o.id === trip.value?.order))

const sections = computed<DetailSection[]>(() => {
  const t = trip.value!
  return [
    { title: 'Trip', items: [{ label: 'Order', value: t.order, type: 'mono' }, { label: 'Route', value: t.route }, { label: 'Distance', value: t.distance }, { label: 'Departure', value: t.departure }, { label: 'ETA', value: t.eta }] },
    { title: 'Driver and vehicle', items: [{ label: 'Driver', value: t.driver }, { label: 'Vehicle', value: t.vehicle, type: 'mono' }] },
  ]
})

function start () {
  startTrip(trip.value!)
  notify(`${trip.value!.id} started`)
}

function complete () {
  const done = completeTrip(trip.value!)
  notify(done ? `${trip.value!.id} delivered, ${done.id} is now Completed` : `${trip.value!.id} delivered`)
}

function onDelete () {
  if (crud.remove()) router.replace('/app/trips')
}
</script>
