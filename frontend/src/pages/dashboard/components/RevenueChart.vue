<template>
  <v-card class="rounded-lg border pa-3" flat>
    <div class="font-weight-bold mb-3">Billed revenue ({{ currency }} thousand)</div>
    <svg viewBox="0 0 520 200" width="100%" style="max-height: 190px" role="img" aria-label="Billed revenue per month">
      <g v-for="v in ticks" :key="v">
        <line x1="34" x2="520" :y1="y(v)" :y2="y(v)" stroke="currentColor" opacity="0.12" />
        <text x="28" :y="y(v) + 4" text-anchor="end" class="axis">{{ v }}</text>
      </g>
      <polygon :points="`${pts[0][0]},${y(0)} ${line} ${pts[pts.length - 1][0]},${y(0)}`" fill="rgb(var(--v-theme-chart-a))" opacity="0.14" />
      <polyline :points="line" fill="none" stroke="rgb(var(--v-theme-chart-a))" stroke-width="2.4" />
      <text v-for="(p, i) in pts" :key="i" :x="p[0]" y="194" text-anchor="middle" class="axis">{{ dashboard.months[i] }}</text>
      <circle :cx="last[0]" :cy="last[1]" r="5" fill="rgb(var(--v-theme-chart-a))" />
      <text :x="last[0]" :y="last[1] - 11" text-anchor="end" class="axis strong">{{ dashboard.revenue[dashboard.revenue.length - 1] }}K</text>
    </svg>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { currency } from '@/mock/country'
import { dashboard } from '@/mock/misc'

const ticks = [0, 60, 120]
const y = (v: number) => 170 - 160 * v / 120
const pts = dashboard.revenue.map((v, i) => [54 + i * 90, y(v)])
const last = pts[pts.length - 1]
const line = computed(() => pts.map(p => p.join(',')).join(' '))
</script>

<style scoped>
.axis { font-size: 11px; fill: currentColor; opacity: 0.6; }
.axis.strong { opacity: 1; font-weight: 600; }
</style>
