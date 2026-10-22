<template>
  <v-menu :close-on-content-click="false" location="bottom start" offset="6">
    <template #activator="{ props }">
      <button v-bind="props" type="button" class="pill" :class="{ 'is-active': !!model }">
        <v-icon :icon="icon ?? 'mdi-calendar-blank-outline'" size="15" />
        <span>{{ summary }}</span>
        <v-icon icon="mdi-chevron-down" size="15" />
      </button>
    </template>
    <v-card min-width="260">
      <v-list density="compact">
        <v-list-item :active="!model" @click="model = null"><v-list-item-title>{{ anyLabel }}</v-list-item-title></v-list-item>
        <v-list-item v-for="p in presets" :key="p.label" @click="model = p.range()"><v-list-item-title>{{ p.label }}</v-list-item-title></v-list-item>
      </v-list>
      <v-divider />
      <div class="d-flex gap-2 pa-3">
        <v-text-field v-model="from" label="From" type="date" variant="outlined" density="compact" hide-details />
        <v-text-field v-model="to" label="To" type="date" variant="outlined" density="compact" hide-details />
      </div>
      <div class="px-3 pb-3 d-flex justify-end">
        <v-btn color="primary" variant="flat" size="small" class="text-none" :disabled="!from || !to || from > to" @click="model = { from, to }">Apply</v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface DateRange { from: string, to: string }

const props = defineProps<{ label: string, anyLabel: string, icon?: string }>()
const model = defineModel<DateRange | null>({ default: null })

const from = ref(model.value?.from ?? '')
const to = ref(model.value?.to ?? '')
watch(model, v => { from.value = v?.from ?? ''; to.value = v?.to ?? '' })

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
// Demo "today" is 22 Oct 2026, matching the sample data.
const TODAY = new Date(2026, 9, 22)
const back = (n: number) => iso(new Date(2026, 9, 22 - n))
const presets = [
  { label: 'Today', range: () => ({ from: iso(TODAY), to: iso(TODAY) }) },
  { label: 'Last 7 days', range: () => ({ from: back(6), to: iso(TODAY) }) },
  { label: 'Last 30 days', range: () => ({ from: back(29), to: iso(TODAY) }) },
  { label: 'This month', range: () => ({ from: '2026-10-01', to: iso(TODAY) }) },
]

const fmt = (s: string) => s.split('-').reverse().join('/')
const summary = computed(() => model.value ? `${fmt(model.value.from)} – ${fmt(model.value.to)}` : props.anyLabel)
</script>

<style scoped>
.pill { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 8px; background: rgb(var(--v-theme-surface)); font: inherit; font-size: 13px; color: rgb(var(--v-theme-on-surface)); cursor: pointer; transition: border-color 0.15s ease, background-color 0.15s ease; }
.pill:hover { border-color: rgba(var(--v-theme-on-surface), 0.4); }
.pill.is-active { border-color: rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-primary), 0.06); }
</style>
