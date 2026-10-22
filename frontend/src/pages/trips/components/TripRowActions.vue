<template>
  <div class="d-inline-flex align-center gap-2" @click.stop>
    <RowActionButton v-if="trip.status === 'Scheduled' && !needs" icon="mdi-play-circle-outline" label="Start trip" @click="start" />
    <RowActionButton v-if="trip.status === 'In transit'" icon="mdi-check-circle-outline" label="Complete trip" @click="complete" />
    <RowActionButton v-if="CAN_ALLOCATE.includes(trip.status)" icon="mdi-truck-plus-outline" :label="needs ? 'Allocate truck' : 'Change truck'" @click="tripStore.open('allocateOpen', trip)" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Trip } from '@/types'
import RowActionButton from '@/components/common/RowActionButton.vue'
import { tripStore } from '@/composables/useTripStore'
import { notify } from '@/composables/useToast'
import { completeTrip, startTrip } from '@/mock/orderFlow'
import { CAN_ALLOCATE, needsTruck } from '@/mock/tripOps'

const props = defineProps<{ trip: Trip }>()
const needs = computed(() => needsTruck(props.trip))

function start () {
  startTrip(props.trip)
  notify(`${props.trip.id} started`)
}

function complete () {
  const done = completeTrip(props.trip)
  notify(done ? `${props.trip.id} delivered, ${done.id} is now Completed` : `${props.trip.id} delivered`)
}
</script>
