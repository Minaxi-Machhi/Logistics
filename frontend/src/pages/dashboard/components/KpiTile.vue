<template>
  <v-card class="rounded-lg border pa-3 h-100 lift" flat :to="kpi.to">
    <div class="d-flex justify-space-between align-start">
      <div class="text-body-2 text-medium-emphasis">{{ kpi.label }}</div>
      <v-icon :color="kpi.color" :icon="kpi.icon" size="20" />
    </div>
    <div class="kpi-value my-1">{{ kpi.money ? `${currency} ${value}` : value }}</div>
    <div class="text-caption" :class="`text-${kpi.color}`">{{ kpi.note }}</div>
  </v-card>
</template>

<script setup lang="ts">
import { currency } from '@/mock/country'
import { useCountUp } from '@/composables/useCountUp'
import type { Kpi } from '@/mock/misc'

const props = defineProps<{ kpi: Kpi }>()
const value = useCountUp(props.kpi.value)
</script>

<style scoped>
.kpi-value { font-size: 24px; font-weight: 600; font-variant-numeric: tabular-nums; }
</style>
