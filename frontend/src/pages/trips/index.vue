<template>
  <v-container fluid class="page fill">
    <PageHeader title="Trip scheduling" subtitle="Allocate trucks, reschedule and track trips.">
      <template #left>
        <TripFilterBar
          v-model:more-open="list.moreOpen"
          :filters="list.filters"
          :show-more="list.showMore"
          :more-active-count="list.moreActiveCount"
          :is-filtered="list.isFiltered"
          @reset="list.resetFilters"
        />
      </template>
      <v-btn variant="outlined" prepend-icon="mdi-download-outline" class="rounded-lg text-none font-weight-medium" height="32" @click="exportCsv">Export</v-btn>
    </PageHeader>

    <v-card class="rounded-lg border overflow-hidden fill-card" flat>
      <div class="d-flex align-center gap-3 pa-2 head">
        <StatusChips v-model="list.status" :items="list.statusChips" class="flex-grow-1" />
        <div class="d-flex gap-2 flex-none">
          <ColumnChooser :columns="columns.chooserColumns" @toggle="columns.toggle" @reorder="columns.reorder" @pin="columns.pin" @reset="columns.reset" />
          <v-btn icon="mdi-refresh" variant="flat" class="tool-btn tool-btn--icon" aria-label="Refresh" :loading="refreshing" @click="refresh" />
        </div>
      </div>

      <SelectionBar :count="selected.length" @clear="selected = []">
        <v-btn variant="outlined" size="small" prepend-icon="mdi-content-copy" class="text-none" @click="copyNumbers">Copy trip numbers</v-btn>
      </SelectionBar>

      <v-data-table-server
        v-model="selected"
        v-model:sort-by="sortBy"
        :headers="columns.headers"
        :items="list.rows"
        :items-length="list.total"
        :items-per-page="list.pageSize"
        :page="list.page"
        :loading="refreshing"
        :row-props="rowProps"
        item-value="id"
        show-select
        hide-default-footer
        fixed-header
        hover
        density="comfortable"
        class="row-link fill-table"
        @click:row="onRowClick"
      >
        <template #item.order="{ item }">
          <router-link :to="orderLink({ id: item.order })" class="id-link font-mono" @click.stop>{{ item.order }}</router-link>
          <div class="text-caption text-medium-emphasis">{{ item.customer || '—' }}</div>
        </template>
        <template #item.id="{ item }">
          <router-link :to="tripLink(item)" class="id-link font-mono" @click.stop>{{ item.id }}</router-link>
          <div class="text-caption text-medium-emphasis">{{ item.fleet }}</div>
        </template>
        <template #item.route="{ item }">
          <div class="font-weight-medium text-no-wrap">{{ item.route }}</div>
          <div class="text-caption text-medium-emphasis">{{ item.jobType || '—' }} · {{ item.distance }}</div>
        </template>
        <template #item.loading="{ item }">
          <div class="d-inline-flex align-center gap-1">
            <span class="font-weight-medium">{{ item.departure }}</span>
            <v-icon v-if="CAN_RESCHEDULE_TRIP.includes(item.status)" icon="mdi-pencil" size="13" color="primary" class="edit" @click.stop="tripStore.open('rescheduleOpen', item)" />
          </div>
          <div v-if="item.delayMin" class="delay"><v-icon icon="mdi-clock-alert-outline" size="12" /> Delayed {{ delayText(item.delayMin) }}</div>
          <div v-else class="text-caption text-medium-emphasis">ETA {{ item.eta }}</div>
        </template>
        <template #item.status="{ item }"><StatusPill :status="item.status" /></template>
        <template #item.vehicle="{ item }">
          <button v-if="item.vehicle || CAN_ALLOCATE.includes(item.status)" type="button" class="cell-edit font-mono" @click.stop="CAN_ALLOCATE.includes(item.status) && tripStore.open('allocateOpen', item)">
            {{ item.vehicle || 'Assign' }}<v-icon v-if="CAN_ALLOCATE.includes(item.status)" icon="mdi-pencil" size="13" color="primary" />
          </button>
          <span v-else>—</span>
        </template>
        <template #item.driver="{ item }">
          <button v-if="item.driver || CAN_ALLOCATE.includes(item.status)" type="button" class="cell-edit" @click.stop="CAN_ALLOCATE.includes(item.status) && tripStore.open('allocateOpen', item)">
            {{ item.driver || 'Assign' }}<v-icon v-if="CAN_ALLOCATE.includes(item.status)" icon="mdi-pencil" size="13" color="primary" />
          </button>
          <span v-else>—</span>
        </template>
        <template #item.actions="{ item }"><TripRowActions :trip="item" /></template>
        <template #no-data>
          <div class="pa-8 text-center">
            <v-icon icon="mdi-truck-remove-outline" size="36" class="text-medium-emphasis" />
            <div class="text-subtitle-1 font-weight-medium mt-2">No trips found</div>
            <div class="text-body-2 text-medium-emphasis mb-3">{{ list.isFiltered || list.status ? 'Nothing matches these filters.' : 'Trips appear here when you create them from a confirmed order.' }}</div>
            <v-btn v-if="list.isFiltered || list.status" variant="outlined" class="rounded-lg text-none" @click="clearAll">Clear filters</v-btn>
          </div>
        </template>
      </v-data-table-server>

      <div class="px-3 py-2 foot"><ListPagination v-model:page="list.page" v-model:page-size="list.pageSize" :total="list.total" /></div>
    </v-card>

    <TripDialogs />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { tripStore } from '@/composables/useTripStore'
import { useColumnState } from '@/composables/useColumnState'
import { useTripList } from '@/composables/useTripList'
import { notify } from '@/composables/useToast'
import { CAN_ALLOCATE, CAN_RESCHEDULE_TRIP, type TripRow } from '@/mock/tripOps'
import ColumnChooser from '@/components/common/ColumnChooser.vue'
import ListPagination from '@/components/common/ListPagination.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SelectionBar from '@/components/common/SelectionBar.vue'
import StatusChips from '@/components/common/StatusChips.vue'
import StatusPill from '@/components/common/StatusPill.vue'
import { orderLink } from '../orders/config'
import TripDialogs from './components/TripDialogs.vue'
import TripFilterBar from './components/TripFilterBar.vue'
import TripRowActions from './components/TripRowActions.vue'
import { tripLink } from './config'

const router = useRouter()
const list = useTripList()
const refreshing = ref(false)
const selected = ref<string[]>([])

onMounted(() => list.restore())

const columns = useColumnState('trip-list-columns-v2', [
  { colId: 'id', title: 'Trip', sortable: true },
  { colId: 'order', title: 'Order', sortable: true },
  { colId: 'route', title: 'Route', sortable: true },
  { colId: 'loading', title: 'Loading', sortable: true },
  { colId: 'status', title: 'Trip status', sortable: true },
  { colId: 'vehicle', title: 'Vehicle', sortable: true },
  { colId: 'driver', title: 'Driver', sortable: true },
  { colId: 'customer', title: 'Customer', sortable: true },
], { pinned: ['id'], locked: ['id'] })

const sortBy = computed({
  get: () => list.ordering ? [{ key: list.ordering.replace(/^-/, ''), order: list.ordering.startsWith('-') ? ('desc' as const) : ('asc' as const) }] : [],
  set: (v: { key: string, order?: 'asc' | 'desc' | boolean }[]) => { list.ordering = v[0] ? `${v[0].order === 'desc' ? '-' : ''}${v[0].key}` : null },
})

watch([() => list.filters, () => list.status, () => list.page, () => list.pageSize], () => { selected.value = [] }, { deep: true })

// A coloured edge marks finished and late trips.
const rowProps = ({ item }: { item: TripRow }) => ({ class: item.delayMin ? 'edge edge--late' : item.status === 'Completed' ? 'edge edge--done' : item.status === 'Unassigned' ? 'edge edge--wait' : '' })

const delayText = (m: number) => m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`

function onRowClick (_: Event, { item }: { item: TripRow }) {
  router.push(tripLink(item))
}

async function copyNumbers () {
  try {
    await navigator.clipboard.writeText(selected.value.join('\n'))
    notify(`${selected.value.length} trip numbers copied`)
  } catch {
    notify('Copy is blocked in this browser')
  }
}

// Exports the selected trips, or every trip matching the filters when none are selected.
function exportCsv () {
  const source = selected.value.length ? list.rows.filter(t => selected.value.includes(t.id)) : list.rows
  const head = ['Trip', 'Order', 'Route', 'Customer', 'Job type', 'Loading', 'ETA', 'Trip status', 'Vehicle', 'Driver']
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines = source.map(t => [t.id, t.order, t.route, t.customer, t.jobType, t.departure, t.eta, t.status, t.vehicle, t.driver].map(q).join(','))
  const url = URL.createObjectURL(new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `trips-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  notify(`${source.length} trips exported`)
}

function clearAll () {
  list.resetFilters()
  list.status = null
}

function refresh () {
  refreshing.value = true
  setTimeout(() => { refreshing.value = false; notify('Trips refreshed') }, 400)
}
</script>

<style scoped>
.head { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.foot { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.row-link :deep(tbody tr) { cursor: pointer; }
.row-link :deep(td) { white-space: nowrap; }
.row-link :deep(tr.edge td:first-child) { box-shadow: inset 3px 0 0 transparent; }
.row-link :deep(tr.edge--done td:first-child) { box-shadow: inset 3px 0 0 rgb(var(--v-theme-success)); }
.row-link :deep(tr.edge--late td:first-child) { box-shadow: inset 3px 0 0 rgb(var(--v-theme-error)); }
.row-link :deep(tr.edge--late) { background: rgba(var(--v-theme-error), 0.04); }
.row-link :deep(tr.edge--wait td:first-child) { box-shadow: inset 3px 0 0 rgb(var(--v-theme-warning)); }
.id-link { color: rgb(var(--v-theme-primary)); font-weight: 600; text-decoration: none; }
.id-link:hover { text-decoration: underline; }
.cell-edit { display: inline-flex; align-items: center; gap: 4px; padding: 0; border: 0; background: transparent; font: inherit; color: inherit; cursor: pointer; }
.cell-edit:hover { color: rgb(var(--v-theme-primary)); }
.edit { cursor: pointer; opacity: 0.7; }
.edit:hover { opacity: 1; }
.delay { display: inline-flex; align-items: center; gap: 3px; padding: 0 6px; border-radius: 9px; background: rgba(var(--v-theme-error), 0.12); color: rgb(var(--v-theme-error)); font-size: 11.5px; }
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
</style>
