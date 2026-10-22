<template>
  <div class="bar">
    <label class="search">
      <v-icon icon="mdi-magnify" size="16" />
      <input ref="inputEl" v-model="filters.search" type="search" placeholder="Search orders…  ( / )" aria-label="Search orders">
    </label>
    <FilterSelect v-model="filters.branches" label="Branch" icon="mdi-office-building-outline" :options="branchOptions" multiple all-label="All branches" />
    <FilterSelect v-model="filters.customers" label="Customer" icon="mdi-account-group-outline" :options="customerOptions" multiple searchable all-label="All customers" />
    <FilterSelect v-model="filters.jobTypes" label="Job type" icon="mdi-truck-outline" :options="jobTypeOptions" multiple all-label="All job types" />
    <template v-if="showMore">
      <FilterSelect v-model="filters.vendors" label="Vendor" icon="mdi-warehouse" :options="vendorOptions" multiple searchable all-label="All vendors" />
      <FilterSelect v-model="filters.products" label="Product" icon="mdi-package-variant-closed" :options="productOptions" multiple searchable all-label="All products" />
      <FilterSelect v-model="filters.pickups" label="Pick up" icon="mdi-map-marker-outline" :options="cityOptions" multiple searchable all-label="Any pick up" />
      <FilterSelect v-model="filters.drops" label="Drop" icon="mdi-map-marker-check-outline" :options="cityOptions" multiple searchable all-label="Any drop" />
      <DateRangeFilter v-model="filters.loading" label="Loading" icon="mdi-calendar-clock-outline" any-label="Any loading date" />
    </template>
    <button v-if="!moreActiveCount" type="button" class="link" :aria-expanded="showMore" @click="moreOpen = !moreOpen">
      <v-icon :icon="showMore ? 'mdi-minus' : 'mdi-plus'" size="14" /> {{ showMore ? 'Fewer' : 'More filters' }}
    </button>
    <button v-if="isFiltered" type="button" class="link" @click="reset"><v-icon icon="mdi-close" size="14" /> Reset</button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { OrderFilters } from '@/composables/useOrderList'
import { BRANCH, CITY, CUST, VEND } from '@/mock/lookups'
import { JOB_TYPES, PRODUCTS } from '@/mock/orders'
import DateRangeFilter from '@/components/common/DateRangeFilter.vue'
import FilterSelect from '@/components/common/FilterSelect.vue'

defineProps<{ filters: OrderFilters, showMore: boolean, moreActiveCount: number, isFiltered: boolean }>()
const moreOpen = defineModel<boolean>('moreOpen', { default: false })
const emit = defineEmits<{ reset: [] }>()
const reset = () => emit('reset')

const opts = (list: readonly string[]) => list.map(v => ({ value: v, label: v }))
const branchOptions = opts(BRANCH)
const customerOptions = opts(CUST)
const vendorOptions = opts(VEND)
const productOptions = opts(PRODUCTS)
const cityOptions = opts(CITY)
const jobTypeOptions = opts(JOB_TYPES)

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
.search { display: inline-flex; flex: 0 1 210px; align-items: center; gap: 8px; min-width: 150px; height: 32px; padding: 0 10px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 8px; background: rgb(var(--v-theme-surface)); color: rgba(var(--v-theme-on-surface), 0.65); transition: border-color 0.15s ease; }
.search:focus-within { border-color: rgb(var(--v-theme-primary)); }
.search input { flex: 1 1 auto; min-width: 0; border: 0; outline: none; background: transparent; font: inherit; font-size: 13px; color: rgb(var(--v-theme-on-surface)); }
.link { display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border: 0; border-radius: 6px; background: transparent; font: inherit; font-size: 13px; color: rgba(var(--v-theme-on-surface), 0.65); cursor: pointer; }
.link:hover { background: rgba(var(--v-theme-on-surface), 0.06); color: rgb(var(--v-theme-on-surface)); }
</style>
