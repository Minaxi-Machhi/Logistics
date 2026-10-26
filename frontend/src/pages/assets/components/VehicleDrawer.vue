<template>
  <EntityDrawer
    :model-value="modelValue"
    :title="vehicle?.id ?? ''"
    :subtitle="vehicle?.type"
    :status="vehicle?.status"
    icon="mdi-truck-outline"
    :sections="sections"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <RelatedTable title="Trips" :columns="tripColumns.filter(c => c.key !== 'vehicle')" :items="relatedTrips" :link-to="tripLink" empty="No trips for this vehicle yet." />
  </EntityDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DetailSection, Vehicle } from '@/types'
import { trips } from '@/mock/trips'
import EntityDrawer from '@/components/common/EntityDrawer.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { tripColumns, tripLink } from '../../trips/config'

const props = defineProps<{ modelValue: boolean, vehicle: Vehicle | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean] }>()

const relatedTrips = computed(() => trips.filter(t => t.vehicle === props.vehicle?.id))

const sections = computed<DetailSection[]>(() => {
  const v = props.vehicle
  if (!v) return []
  return [
    { title: 'Vehicle', items: [{ label: 'Type', value: v.type }, { label: 'Capacity', value: v.capacity }, { label: 'Ownership', value: v.ownership }] },
    { title: 'Compliance', items: [{ label: 'Fitness valid till', value: v.fitness }, { label: 'Insurance till', value: v.insurance }] },
  ]
})
</script>
