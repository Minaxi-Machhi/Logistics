<template>
  <EntityDrawer
    :model-value="modelValue"
    :title="incentive?.id ?? ''"
    :subtitle="incentive ? `${incentive.driver} · ${incentive.period}` : ''"
    :status="incentive?.status"
    icon="mdi-medal-outline"
    :sections="sections"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <RelatedTable title="Driver" :columns="driverColumns" :items="linkedDrivers" empty="Driver not found in the list." />
  </EntityDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DetailSection, Incentive } from '@/types'
import { drivers } from '@/mock/assets'
import EntityDrawer from '@/components/common/EntityDrawer.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { driverColumns } from '../../assets/config'

const props = defineProps<{ modelValue: boolean, incentive: Incentive | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean] }>()

const linkedDrivers = computed(() => drivers.filter(d => d.name === props.incentive?.driver))

const sections = computed<DetailSection[]>(() => {
  const i = props.incentive
  if (!i) return []
  return [
    { title: 'Performance', items: [{ label: 'Driver', value: i.driver }, { label: 'Period', value: i.period }, { label: 'Trips', value: i.trips }, { label: 'On-time', value: i.onTime }, { label: 'Fuel saving', value: i.fuel }] },
    { title: 'Payout', items: [{ label: 'Incentive', value: i.amount, type: 'money' }] },
  ]
})
</script>
