<template>
  <v-card class="rounded-lg border pa-3" flat>
    <div class="font-weight-bold mb-3">Billed revenue ({{ currency }} thousand)</div>
    <svg viewBox="0 0 520 200" width="100%" style="max-height: 190px" role="img" aria-label="Billed revenue per month">
      <g v-for="v in ticks" :key="v">
        <line x1="34" x2="520" :y1="y(v)" :y2="y(v)" stroke="currentColor" opacity="0.12" />
        <text x="28" :y="y(v) + 4" text-anchor="end" class="axis">{{ v }}</text>
      </g>
      <polygon :points="`${pts[0][0]},${y(0)} ${line} ${pts[pts.length - 1][0]},${y(0)}`" fill="rgb(var(--v-theme-chart-a))" opacity="0.14" />
      <polyline :points="line" fill="none" stroke="rgb(var(--v-theme-chart-a))" stroke-width="2.4" class="draw" pathLength="1" />
      <text v-for="(p, i) in pts" :key="i" :x="p[0]" y="194" text-anchor="middle" class="axis">{{ dashboard.months[i] }}</text>
      <g v-if="hover !== null" class="hover">
        <line :x1="pts[hover][0]" :x2="pts[hover][0]" y1="10" :y2="y(0)" stroke="currentColor" opacity="0.25" stroke-dasharray="3 3" />
        <circle :cx="pts[hover][0]" :cy="pts[hover][1]" r="5" fill="rgb(var(--v-theme-chart-a))" />
        <text :x="pts[hover][0]" :y="pts[hover][1] - 11" text-anchor="middle" class="axis strong">{{ dashboard.revenue[hover] }}K</text>
      </g>
      <rect v-for="(p, i) in pts" :key="`h${i}`" :x="p[0] - 45" y="0" width="90" height="180" fill="transparent" @mouseenter="hover = i" @mouseleave="hover = last_i" />
    </svg>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { currency } from '@/mock/country'
import { dashboard } from '@/mock/misc'

const ticks = [0, 60, 120]
const y = (v: number) => 170 - 160 * v / 120
const pts = dashboard.revenue.map((v, i) => [54 + i * 90, y(v)])
const last_i = pts.length - 1
const hover = ref<number | null>(last_i)
const line = computed(() => pts.map(p => p.join(',')).join(' '))
</script>

<style scoped>
.axis { font-size: 11px; fill: currentColor; opacity: 0.6; }
.axis.strong { opacity: 1; font-weight: 600; }
.draw { stroke-dasharray: 1; stroke-dashoffset: 0; animation: draw 0.9s ease-out both; }
@keyframes draw { from { stroke-dashoffset: 1; } }
@media (prefers-reduced-motion: reduce) { .draw { animation: none; } }
</style>
