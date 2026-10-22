<template>
  <v-card class="rounded-lg border pa-3 h-100" flat>
    <div class="d-flex justify-space-between align-start">
      <div class="text-body-2 text-medium-emphasis">{{ kpi.label }}</div>
      <v-icon :color="kpi.color" :icon="kpi.icon" size="20" />
    </div>
    <div class="kpi-value my-1">{{ kpi.money ? `${currency} ${kpi.value}` : kpi.value }}</div>
    <div class="text-caption" :class="`text-${kpi.color}`">{{ kpi.note }}</div>
  </v-card>
</template>

<script setup lang="ts">
import { currency } from '@/mock/country'
import type { Kpi } from '@/mock/misc'

defineProps<{ kpi: Kpi }>()
</script>

<style scoped>
.kpi-value { font-size: 24px; font-weight: 600; font-variant-numeric: tabular-nums; }
</style>
