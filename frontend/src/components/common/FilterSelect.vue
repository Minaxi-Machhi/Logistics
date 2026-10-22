<template>
  <v-menu :close-on-content-click="!multiple" location="bottom start" offset="6">
    <template #activator="{ props }">
      <button v-bind="props" type="button" class="pill" :class="{ 'is-active': active }">
        <v-icon v-if="icon" :icon="icon" size="15" />
        <span class="pill__label">{{ summary }}</span>
        <v-icon icon="mdi-chevron-down" size="15" />
      </button>
    </template>
    <v-card min-width="240" max-width="320">
      <div v-if="searchable" class="pa-2 pb-0">
        <v-text-field v-model="query" placeholder="Search…" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details autofocus />
      </div>
      <v-list density="compact" max-height="280" class="py-1">
        <v-list-item v-if="!query" :active="!selected.length" title="" @click="clear">
          <v-list-item-title>{{ allLabel }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-for="o in visible" :key="String(o.value)" @click="toggle(o.value)">
          <template #prepend>
            <v-icon :icon="selected.includes(o.value) ? 'mdi-checkbox-marked' : multiple ? 'mdi-checkbox-blank-outline' : 'mdi-circle-small'" size="18" :color="selected.includes(o.value) ? 'primary' : undefined" />
          </template>
          <v-list-item-title>{{ o.label }}</v-list-item-title>
          <v-list-item-subtitle v-if="o.sub">{{ o.sub }}</v-list-item-subtitle>
        </v-list-item>
        <div v-if="!visible.length" class="px-4 py-2 text-body-2 text-medium-emphasis">No matches.</div>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts" generic="V extends string | number">
import { computed, ref } from 'vue'

export interface FilterOption<T> { value: T, label: string, sub?: string }

const props = defineProps<{
  label: string
  icon?: string
  options: FilterOption<V>[]
  multiple?: boolean
  searchable?: boolean
  allLabel: string
}>()

const model = defineModel<V[]>({ default: () => [] })
const query = ref('')

const selected = computed(() => model.value)
const active = computed(() => selected.value.length > 0)
const visible = computed(() => props.options.filter(o => !query.value || o.label.toLowerCase().includes(query.value.toLowerCase())))

const summary = computed(() => {
  if (!selected.value.length) return props.allLabel
  const first = props.options.find(o => o.value === selected.value[0])?.label ?? String(selected.value[0])
  return selected.value.length === 1 ? first : `${props.label}: ${selected.value.length}`
})

function toggle (value: V) {
  if (!props.multiple) { model.value = [value]; return }
  model.value = selected.value.includes(value) ? selected.value.filter(v => v !== value) : [...selected.value, value]
}
function clear () { model.value = [] }
</script>

<style scoped>
.pill { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 8px; background: rgb(var(--v-theme-surface)); font: inherit; font-size: 13px; color: rgb(var(--v-theme-on-surface)); cursor: pointer; max-width: 220px; transition: border-color 0.15s ease, background-color 0.15s ease; }
.pill:hover { border-color: rgba(var(--v-theme-on-surface), 0.4); }
.pill.is-active { border-color: rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-primary), 0.06); }
.pill__label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
