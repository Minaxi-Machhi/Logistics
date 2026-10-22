<template>
  <div class="bar">
    <label class="search">
      <v-icon icon="mdi-magnify" size="16" />
      <input ref="inputEl" v-model="list.search" type="search" :placeholder="`${list.searchPlaceholder}  ( / )`" :aria-label="list.searchPlaceholder">
    </label>
    <template v-for="f in list.filterDefs" :key="f.key">
      <FilterSelect
        v-if="!f.more || list.showMore"
        v-model="list.values[f.key]"
        :label="f.label"
        :icon="f.icon"
        :options="f.options.map(o => ({ value: o, label: o }))"
        multiple
        :searchable="f.searchable"
        :all-label="f.allLabel"
      />
    </template>
    <button v-if="hasMore && !list.moreActiveCount" type="button" class="link" :aria-expanded="list.showMore" @click="list.moreOpen = !list.moreOpen">
      <v-icon :icon="list.showMore ? 'mdi-minus' : 'mdi-plus'" size="14" /> {{ list.showMore ? 'Fewer' : 'More filters' }}
    </button>
    <button v-if="list.isFiltered" type="button" class="link" @click="list.resetFilters()"><v-icon icon="mdi-close" size="14" /> Reset</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ListState } from '@/composables/useList'
import FilterSelect from '@/components/common/FilterSelect.vue'

const props = defineProps<{ list: ListState }>()
const hasMore = computed(() => props.list.filterDefs.some((f: { more?: boolean }) => f.more))

// "/" jumps to the search box.
const inputEl = ref<HTMLInputElement | null>(null)
function onKey (e: KeyboardEvent) {
  const tag = (e.target as HTMLElement | null)?.tagName
  if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); inputEl.value?.focus() }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.bar { display: flex; flex: 1 1 auto; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
.search { display: inline-flex; flex: 0 1 230px; align-items: center; gap: 8px; min-width: 150px; height: 32px; padding: 0 10px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 8px; background: rgb(var(--v-theme-surface)); color: rgba(var(--v-theme-on-surface), 0.65); transition: border-color 0.15s ease; }
.search:focus-within { border-color: rgb(var(--v-theme-primary)); }
.search input { flex: 1 1 auto; min-width: 0; border: 0; outline: none; background: transparent; font: inherit; font-size: 13px; color: rgb(var(--v-theme-on-surface)); }
.link { display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border: 0; border-radius: 6px; background: transparent; font: inherit; font-size: 13px; color: rgba(var(--v-theme-on-surface), 0.65); cursor: pointer; }
.link:hover { background: rgba(var(--v-theme-on-surface), 0.06); color: rgb(var(--v-theme-on-surface)); }
</style>
