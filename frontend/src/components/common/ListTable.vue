<template>
  <v-card class="rounded-lg border overflow-hidden fill-card" flat>
    <div class="d-flex align-center gap-3 pa-2 head">
      <StatusChips v-if="list.statusChips.length" v-model="list.status" :items="list.statusChips" class="flex-grow-1" />
      <v-spacer v-else />
      <div class="d-flex gap-2 flex-none">
        <ColumnChooser :columns="cols.chooserColumns" @toggle="cols.toggle" @reorder="cols.reorder" @pin="cols.pin" @reset="cols.reset" />
        <v-btn icon="mdi-refresh" variant="flat" class="tool-btn tool-btn--icon" aria-label="Refresh" :loading="refreshing" @click="refresh" />
      </div>
    </div>

    <SelectionBar :count="selected.length" @clear="selected = []">
      <v-btn variant="outlined" size="small" prepend-icon="mdi-content-copy" class="text-none" @click="copyIds">Copy numbers</v-btn>
      <v-btn variant="outlined" size="small" prepend-icon="mdi-file-delimited-outline" class="text-none" @click="exportCsv">Export to CSV</v-btn>
    </SelectionBar>

    <v-data-table-server
      v-model="selected"
      v-model:sort-by="sortBy"
      :headers="cols.headers"
      :items="list.rows"
      :items-length="list.total"
      :items-per-page="list.pageSize"
      :page="list.page"
      :loading="refreshing"
      item-value="id"
      show-select
      hide-default-footer
      fixed-header
      hover
      density="comfortable"
      :class="['fill-table', { 'row-link': !!linkTo }]"
      @click:row="onRowClick"
    >
      <template v-for="c in columns" :key="c.key" #[`item.${c.key}`]="{ item, value }">
        <slot :name="`item.${c.key}`" :item="item" :value="value">
          <router-link v-if="c.key === 'id' && linkTo" :to="linkTo(item)" class="id-link font-mono" @click.stop>{{ value }}</router-link>
          <StatusPill v-else-if="c.type === 'status'" :status="String(value)" />
          <span v-else-if="c.type === 'money'">{{ money(Number(value)) }}</span>
          <span v-else-if="c.type === 'mono'" class="font-mono">{{ value }}</span>
          <span v-else>{{ value }}</span>
        </slot>
      </template>
      <template #item.actions="{ item }"><div class="d-inline-flex align-center gap-2" @click.stop><slot name="actions" :item="item" /></div></template>
      <template #no-data>
        <div class="pa-8 text-center">
          <v-icon icon="mdi-text-box-search-outline" size="36" class="text-medium-emphasis" />
          <div class="text-subtitle-1 font-weight-medium mt-2">Nothing found</div>
          <div class="text-body-2 text-medium-emphasis mb-3">{{ list.isFiltered || list.status ? 'Nothing matches these filters.' : emptyText }}</div>
          <v-btn v-if="list.isFiltered || list.status" variant="outlined" class="rounded-lg text-none" @click="clearAll">Clear filters</v-btn>
        </div>
      </template>
    </v-data-table-server>

    <div class="px-3 py-2 foot"><ListPagination v-model:page="list.page" v-model:page-size="list.pageSize" :total="list.total" /></div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Column } from '@/types'
import { useColumnState } from '@/composables/useColumnState'
import type { ListState } from '@/composables/useList'
import { notify } from '@/composables/useToast'
import { money } from '@/mock/country'
import ColumnChooser from '@/components/common/ColumnChooser.vue'
import ListPagination from '@/components/common/ListPagination.vue'
import SelectionBar from '@/components/common/SelectionBar.vue'
import StatusChips from '@/components/common/StatusChips.vue'
import StatusPill from '@/components/common/StatusPill.vue'

const props = withDefaults(defineProps<{
  list: ListState
  columns: Column[]
  /** Remembers the column layout. */
  storageKey: string
  linkTo?: (row: any) => string
  emptyText?: string
}>(), { emptyText: 'Nothing here yet.' })

const router = useRouter()
const selected = ref<string[]>([])
const refreshing = ref(false)

const cols = useColumnState(`list-columns:${props.storageKey}`, props.columns.map(c => ({
  colId: c.key, title: c.title, sortable: !!props.list.sorters[c.key], align: c.type === 'money' ? ('end' as const) : undefined,
})), { locked: [props.columns[0].key] })

const sortBy = computed({
  get: () => props.list.ordering ? [{ key: props.list.ordering.replace(/^-/, ''), order: props.list.ordering.startsWith('-') ? ('desc' as const) : ('asc' as const) }] : [],
  set: (v: { key: string, order?: 'asc' | 'desc' | boolean }[]) => { props.list.ordering = v[0] ? `${v[0].order === 'desc' ? '-' : ''}${v[0].key}` : null },
})

watch([() => props.list.search, () => props.list.values, () => props.list.status, () => props.list.page, () => props.list.pageSize], () => { selected.value = [] }, { deep: true })

function onRowClick (_: Event, { item }: { item: any }) {
  if (props.linkTo) router.push(props.linkTo(item))
}

const picked = () => props.list.rows.filter((r: { id: string }) => selected.value.includes(r.id))

async function copyIds () {
  try {
    await navigator.clipboard.writeText(selected.value.join('\n'))
    notify(`${selected.value.length} numbers copied`)
  } catch {
    notify('Copy is blocked in this browser')
  }
}

function exportCsv () {
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines = picked().map((r: Record<string, unknown>) => props.columns.map(c => q(r[c.key])).join(','))
  const url = URL.createObjectURL(new Blob([[props.columns.map(c => q(c.title)).join(','), ...lines].join('\n')], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.storageKey}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  notify(`${picked().length} rows exported`)
}

function clearAll () {
  props.list.resetFilters()
  props.list.status = null
}

function refresh () {
  refreshing.value = true
  setTimeout(() => { refreshing.value = false; notify('Refreshed') }, 400)
}
</script>

<style scoped>
.head { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.foot { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.row-link :deep(tbody tr) { cursor: pointer; }
.row-link :deep(td) { white-space: nowrap; }
.id-link { color: rgb(var(--v-theme-primary)); font-weight: 600; text-decoration: none; }
.id-link:hover { text-decoration: underline; }
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
</style>
