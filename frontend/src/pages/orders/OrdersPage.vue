<template>
  <v-container fluid class="page fill">
    <PageHeader title="Orders" subtitle="Customer orders from booking to invoice.">
      <template #left>
        <OrderFilterBar
          v-model:more-open="list.moreOpen"
          :filters="list.filters"
          :show-more="list.showMore"
          :more-active-count="list.moreActiveCount"
          :is-filtered="list.isFiltered"
          @reset="list.resetFilters"
        />
      </template>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" height="32" @click="orderStore.openNew()">New order</v-btn>
    </PageHeader>

    <v-card class="rounded-lg border overflow-hidden fill-card" flat>
      <div class="d-flex align-center gap-3 pa-2 head">
        <StatusChips v-model="list.status" :items="list.statusChips" class="flex-grow-1" />
        <div class="d-flex gap-2 flex-none">
          <ColumnChooser :columns="chooserColumns" @toggle="toggleColumn" @reorder="reorderColumns" @pin="pinColumn" @reset="resetColumns" />
          <v-btn icon="mdi-refresh" variant="flat" class="tool-btn tool-btn--icon" aria-label="Refresh" :loading="refreshing" @click="refresh" />
        </div>
      </div>

      <SelectionBar :count="selected.length" @clear="selected = []">
        <v-btn variant="outlined" size="small" prepend-icon="mdi-content-copy" class="text-none" @click="copyNumbers">Copy order numbers</v-btn>
        <v-btn variant="outlined" size="small" prepend-icon="mdi-file-delimited-outline" class="text-none" @click="exportCsv">Export to CSV</v-btn>
      </SelectionBar>

      <v-data-table-server
        v-model="selected"
        v-model:sort-by="sortBy"
        :headers="headers"
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
        class="row-link fill-table"
        @click:row="onRowClick"
      >
        <template #item.id="{ item }">
          <router-link :to="orderLink(item)" class="id-link font-mono" @click.stop>{{ item.id }}</router-link>
          <div class="text-caption text-medium-emphasis">{{ item.jobType }} · <span class="font-mono">{{ item.ref }}</span></div>
        </template>
        <template #item.customer="{ item }">
          <div class="font-weight-medium">{{ item.customer }}</div>
          <div class="text-caption text-medium-emphasis">{{ item.branch }}</div>
        </template>
        <template #item.route="{ item }">
          <div class="font-weight-medium text-no-wrap">{{ item.origin }} → {{ item.destination }}</div>
          <div class="text-caption text-medium-emphasis text-no-wrap">{{ item.originDepot }} → {{ item.destDepot }}</div>
        </template>
        <template #item.loading="{ item }">
          <div class="font-weight-medium text-no-wrap">{{ item.loading }}</div>
          <div class="text-caption text-medium-emphasis">Ordered {{ item.orderDate }}</div>
        </template>
        <template #item.status="{ item }"><StatusPill :status="item.status" /></template>
        <template #item.rate="{ item }">{{ item.rate ? item.rate.toLocaleString('en-US') : '—' }}</template>
        <template #item.jobType="{ item }"><v-chip size="small" label class="font-mono">{{ item.jobType }}</v-chip></template>
        <template #item.actions="{ item }"><OrderRowActions :order="item" :flow="flow" /></template>
        <template #no-data>
          <div class="pa-8 text-center">
            <v-icon icon="mdi-package-variant-closed-remove" size="36" class="text-medium-emphasis" />
            <div class="text-subtitle-1 font-weight-medium mt-2">No orders found</div>
            <div class="text-body-2 text-medium-emphasis mb-3">{{ list.isFiltered || list.status ? 'Nothing matches these filters.' : 'Create the first order to get started.' }}</div>
            <v-btn v-if="list.isFiltered || list.status" variant="outlined" class="rounded-lg text-none" @click="clearAll">Clear filters</v-btn>
            <v-btn v-else color="primary" variant="flat" class="rounded-lg text-none" prepend-icon="mdi-plus" @click="orderStore.openNew()">New order</v-btn>
          </div>
        </template>
      </v-data-table-server>

      <div class="px-3 py-2 foot"><ListPagination v-model:page="list.page" v-model:page-size="list.pageSize" :total="list.total" /></div>
    </v-card>

    <OrderQuickView />
    <OrderFlowDialogs :flow="flow" />
    <OrderDialogs />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Order } from '@/types'
import { orderStore } from '@/composables/useOrderStore'
import { useOrderFlow } from '@/composables/useOrderFlow'
import { useOrderList } from '@/composables/useOrderList'
import { notify } from '@/composables/useToast'
import { money } from '@/mock/country'
import { orders } from '@/mock/orders'
import ColumnChooser, { type ChooserColumn } from '@/components/common/ColumnChooser.vue'
import ListPagination from '@/components/common/ListPagination.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SelectionBar from '@/components/common/SelectionBar.vue'
import StatusChips from '@/components/common/StatusChips.vue'
import StatusPill from '@/components/common/StatusPill.vue'
import OrderDialogs from './components/OrderDialogs.vue'
import OrderFilterBar from './components/OrderFilterBar.vue'
import OrderFlowDialogs from './components/OrderFlowDialogs.vue'
import OrderQuickView from './components/OrderQuickView.vue'
import OrderRowActions from './components/OrderRowActions.vue'
import { orderLink } from './config'

const list = useOrderList()
const flow = useOrderFlow()
const refreshing = ref(false)

onMounted(() => list.restore())

// ---- sorting: the table reports it, the list sorts ----
const sortBy = computed({
  get: () => list.ordering ? [{ key: list.ordering.replace(/^-/, ''), order: list.ordering.startsWith('-') ? ('desc' as const) : ('asc' as const) }] : [],
  set: (v: { key: string, order?: 'asc' | 'desc' | boolean }[]) => { list.ordering = v[0] ? `${v[0].order === 'desc' ? '-' : ''}${v[0].key}` : null },
})

// ---- columns: order, visibility and pinning persist ----
const COLUMN_KEY = 'order-list-columns-v1'
interface ColumnDef { colId: string, title: string, sortable?: boolean, align?: 'end' }
const DEFS: ColumnDef[] = [
  { colId: 'id', title: 'Order', sortable: true },
  { colId: 'customer', title: 'Customer', sortable: true },
  { colId: 'route', title: 'Route' },
  { colId: 'loading', title: 'Loading', sortable: true },
  { colId: 'status', title: 'Status', sortable: true },
  { colId: 'rate', title: 'Sell rate', sortable: true, align: 'end' },
  { colId: 'jobType', title: 'Job type', sortable: true },
  { colId: 'branch', title: 'Branch', sortable: true },
  { colId: 'orderDate', title: 'Order date', sortable: true },
]
interface ColumnState { colId: string, hide: boolean, pinned: 'left' | null }
const defaultState = (): ColumnState[] => DEFS.map(d => ({ colId: d.colId, hide: ['legs'].includes(d.colId), pinned: d.colId === 'id' ? 'left' : null }))
const loadState = (): ColumnState[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(COLUMN_KEY) ?? 'null') as ColumnState[] | null
    if (saved?.length === DEFS.length && DEFS.every(d => saved.some(s => s.colId === d.colId))) return saved
  } catch { /* fall back to defaults */ }
  return defaultState()
}
const columnState = ref<ColumnState[]>(loadState())
watch(columnState, s => { try { localStorage.setItem(COLUMN_KEY, JSON.stringify(s)) } catch { /* ignore */ } }, { deep: true })

const defOf = (id: string) => DEFS.find(d => d.colId === id)!
const chooserColumns = computed<ChooserColumn[]>(() => columnState.value.map(s => ({ colId: s.colId, label: defOf(s.colId).title, visible: !s.hide, pinned: s.pinned, locked: s.colId === 'id' })))
const headers = computed(() => [
  ...columnState.value.filter(s => !s.hide).map(s => {
    const d = defOf(s.colId)
    return { title: d.title, key: d.colId, sortable: !!d.sortable, align: d.align, fixed: s.pinned === 'left' }
  }),
  { title: 'Actions', key: 'actions', sortable: false, align: 'start' as const },
])

const toggleColumn = (id: string, visible: boolean) => { columnState.value.find(s => s.colId === id)!.hide = !visible }
const pinColumn = (id: string, pinned: 'left' | null) => { columnState.value.find(s => s.colId === id)!.pinned = pinned }
const reorderColumns = (ids: string[]) => { columnState.value = ids.map(id => columnState.value.find(s => s.colId === id)!) }
const resetColumns = () => { columnState.value = defaultState() }

// ---- selection ----
const selected = ref<string[]>([])
watch([() => list.filters, () => list.status, () => list.page, () => list.pageSize], () => { selected.value = [] }, { deep: true })
const selectedRows = computed(() => orders.filter(o => selected.value.includes(o.id)))

async function copyNumbers () {
  try {
    await navigator.clipboard.writeText(selectedRows.value.map(o => o.id).join('\n'))
    notify(`${selectedRows.value.length} order numbers copied`)
  } catch {
    notify('Copy is blocked in this browser')
  }
}

function exportCsv () {
  const head = ['Order', 'Reference', 'Customer', 'Job type', 'Origin', 'Destination', 'Loading', 'Status', 'Sell rate', 'Branch', 'Order date', 'Product', 'Vendor', 'Quantity']
  const q = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`
  const lines = selectedRows.value.map(o => [o.id, o.ref, o.customer, o.jobType, o.origin, o.destination, o.loading, o.status, o.rate, o.branch, o.orderDate, o.product, o.vendor, o.quantity].map(q).join(','))
  const url = URL.createObjectURL(new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  notify(`${selectedRows.value.length} orders exported`)
}

function onRowClick (_: Event, { item }: { item: Order }) {
  orderStore.open('quickViewOpen', item)
}

function clearAll () {
  list.resetFilters()
  list.status = null
}

function refresh () {
  refreshing.value = true
  setTimeout(() => { refreshing.value = false; notify('Orders refreshed') }, 400)
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
