<template>
  <FormDialog v-model="tripStore.rescheduleOpen" :title="`Reschedule ${current?.id ?? ''}`" submit-label="Reschedule" :columns="1" :fields="[date('date', 'Loading date')]" :row="current && { date: current.departure }" @save="v => run(t => rescheduleTrip(t, v.date), 'rescheduled')" />
  <FormDialog v-model="tripStore.allocateOpen" :title="`Allocate truck for ${current?.id ?? ''}`" submit-label="Allocate" :fields="allocateFields" :row="current && { driver: current.driver, vehicle: current.vehicle }" @save="v => run(t => allocate(t, v.driver, v.vehicle), 'truck allocated')" />
</template>

<script setup lang="ts">
import type { FieldDef, Trip } from '@/types'
import { currentTrip as current, tripStore } from '@/composables/useTripStore'
import { notify } from '@/composables/useToast'
import { DRV, PLATE } from '@/mock/lookups'
import { allocate, rescheduleTrip } from '@/mock/tripOps'
import FormDialog from '@/components/common/FormDialog.vue'
import { date, req, select } from '../../fields'

const allocateFields: FieldDef[] = [select('driver', 'Driver', DRV, req), select('vehicle', 'Vehicle', PLATE, req)]

function run (change: (t: Trip) => void, done: string) {
  if (!current.value) return
  change(current.value)
  notify(`${current.value.id} ${done}`)
}


</script>

