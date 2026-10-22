<template>
  <v-card class="rounded-lg border pa-3" flat>
    <div class="font-weight-bold mb-3">Orders per month</div>
    <div class="chart">
      <div v-for="(m, i) in dashboard.months" :key="m" class="group">
        <div class="bars">
          <div
            v-for="(color, type) in series"
            :key="type"
            class="bar"
            :style="{ height: `${dashboard.ordersByType[type][i]}%`, background: `rgb(var(--v-theme-${color}))`, animationDelay: `${i * 60}ms` }"
          >
            <v-tooltip activator="parent" location="top">{{ type }} · {{ m }}: {{ dashboard.ordersByType[type][i] }} orders</v-tooltip>
          </div>
        </div>
        <div class="text-caption text-medium-emphasis">{{ m }}</div>
      </div>
    </div>
    <div class="d-flex gap-4 mt-3 text-caption text-medium-emphasis">
      <span v-for="(color, type) in series" :key="type"><v-icon :color="color" size="10" class="mr-1">mdi-square</v-icon>{{ type }}</span>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { dashboard } from '@/mock/misc'

const series: Record<string, string> = { FTL: 'chart-a', FCL: 'chart-b', LTL: 'chart-c' }
</script>

<style scoped>
.chart { display: flex; gap: 8px; height: 170px; align-items: flex-end; }
.group { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; gap: 6px; }
.bars { display: flex; gap: 3px; align-items: flex-end; height: calc(100% - 22px); width: 100%; justify-content: center; }
.bar { width: 14px; border-radius: 3px 3px 0 0; transform-origin: bottom; animation: grow 0.5s ease-out both; transition: filter 0.15s ease; }
.bar:hover { filter: brightness(1.12); }
@keyframes grow { from { transform: scaleY(0); } }
@media (prefers-reduced-motion: reduce) { .bar { animation: none; } }
</style>
