<template>
  <EntityDrawer
    :model-value="modelValue"
    :title="driver?.id ?? ''"
    :subtitle="driver?.name"
    :status="driver?.status"
    :initials-from="driver?.name"
    :sections="sections"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <RelatedTable title="Trips" :columns="tripColumns.filter(c => c.key !== 'driver')" :items="relatedTrips" :link-to="tripLink" empty="No trips for this driver yet." />
    <RelatedTable title="Incentives" :columns="incentiveColumns" :items="relatedIncentives" empty="No incentives yet." />
  </EntityDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DetailSection, Driver } from '@/types'
import { incentives } from '@/mock/invoices'
import { trips } from '@/mock/trips'
import EntityDrawer from '@/components/common/EntityDrawer.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { incentiveColumns } from '../../incentives/config'
import { tripColumns, tripLink } from '../../trips/config'

const props = defineProps<{ modelValue: boolean, driver: Driver | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean] }>()

const relatedTrips = computed(() => trips.filter(t => t.driver === props.driver?.name))
const relatedIncentives = computed(() => incentives.filter(i => i.driver === props.driver?.name))

const sections = computed<DetailSection[]>(() => {
  const d = props.driver
  if (!d) return []
  return [
    { title: 'Driver', items: [{ label: 'Name', value: d.name }, { label: 'Phone', value: d.phone, type: 'mono' }, { label: 'Trips this month', value: d.trips }] },
    { title: 'Licence', items: [{ label: 'Licence no.', value: d.licence, type: 'mono' }, { label: 'Expiry', value: d.expiry }] },
  ]
})
</script>
