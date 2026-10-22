<template>
  <RecordDetail v-if="record" :title="record.id" :subtitle="subtitle" :status="record.status" :back-to="`/app/assets?tab=${kind}s`" :sections="sections">
    <template #actions>
      <v-btn variant="outlined" prepend-icon="mdi-pencil-outline" class="rounded-lg text-none" @click="crud.openEdit(record)">Edit</v-btn>
      <v-btn variant="outlined" color="error" prepend-icon="mdi-delete-outline" class="rounded-lg text-none" @click="crud.askRemove(record)">Delete</v-btn>
    </template>
    <RelatedTable title="Trips" :columns="tripColumns" :items="relatedTrips" :link-to="tripLink" empty="No trips for this asset yet." />
    <RelatedTable v-if="kind === 'driver'" title="Incentives" :columns="incentiveColumns" :items="relatedIncentives" :link-to="incentiveLink" empty="No incentives yet." />
    <AssetFormDialog v-model="crud.formOpen" :kind="kind" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" :title="`Delete ${kind}?`" :text="`${record.id} will be removed.`" @confirm="onDelete" />
  </RecordDetail>
  <NotFound v-else :back-to="`/app/assets?tab=${kind}s`" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { DetailSection, Driver, Vehicle } from '@/types'
import { drivers, vehicles } from '@/mock/assets'
import { incentives } from '@/mock/invoices'
import { trips } from '@/mock/trips'
import { type Crud, useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import NotFound from '@/components/common/NotFound.vue'
import RecordDetail from '@/components/common/RecordDetail.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { incentiveColumns, incentiveLink } from '../incentives/config'
import { tripColumns, tripLink } from '../trips/config'
import AssetFormDialog from './components/AssetFormDialog.vue'

const route = useRoute()
const router = useRouter()
const kind = computed<'driver' | 'vehicle'>(() => route.meta.kind === 'vehicle' ? 'vehicle' : 'driver')

const driverCrud = useCrud<Driver>(drivers, { prefix: '' })
const vehicleCrud = useCrud<Vehicle>(vehicles, { prefix: '' })
const crud = computed<Crud>(() => kind.value === 'driver' ? driverCrud : vehicleCrud)

const record = computed<Driver | Vehicle | undefined>(() =>
  kind.value === 'driver' ? drivers.find(d => d.id === route.params.id) : vehicles.find(v => v.id === route.params.id))
const subtitle = computed(() => kind.value === 'driver' ? (record.value as Driver).name : (record.value as Vehicle).type)

const relatedTrips = computed(() => trips.filter(t => kind.value === 'driver' ? t.driver === (record.value as Driver | undefined)?.name : t.vehicle === record.value?.id))
const relatedIncentives = computed(() => incentives.filter(i => i.driver === (record.value as Driver | undefined)?.name))

const sections = computed<DetailSection[]>(() => {
  if (kind.value === 'driver') {
    const d = record.value as Driver
    return [
      { title: 'Driver', items: [{ label: 'Name', value: d.name }, { label: 'Phone', value: d.phone, type: 'mono' }, { label: 'Trips this month', value: d.trips }] },
      { title: 'Licence', items: [{ label: 'Licence no.', value: d.licence, type: 'mono' }, { label: 'Expiry', value: d.expiry }] },
    ]
  }
  const v = record.value as Vehicle
  return [
    { title: 'Vehicle', items: [{ label: 'Type', value: v.type }, { label: 'Capacity', value: v.capacity }, { label: 'Ownership', value: v.ownership }] },
    { title: 'Compliance', items: [{ label: 'Fitness valid till', value: v.fitness }, { label: 'Insurance till', value: v.insurance }] },
  ]
})

function onDelete () {
  if (crud.value.remove()) router.replace(`/app/assets?tab=${kind.value}s`)
}
</script>
