<template>
  <v-container fluid class="page">
    <PageHeader title="Reports" subtitle="Pick a report, set a date range and download it." />

    <div class="grid-cards mb-4">
      <ReportCard v-for="r in reports" :key="r.title" :report="r" @run="run" />
    </div>

    <v-card class="rounded-lg border overflow-hidden" flat>
      <div class="d-flex align-center pa-3 head">
        <div class="font-weight-bold">Generated reports</div>
        <v-chip size="x-small" label class="ml-2 font-mono">{{ generated.length }}</v-chip>
        <span v-if="pending" class="ml-3 text-caption text-medium-emphasis">{{ pending }} generating. Refresh to check.</span>
        <v-spacer />
        <v-btn icon="mdi-refresh" variant="flat" class="tool-btn tool-btn--icon" aria-label="Refresh" :loading="refreshing" @click="refresh">
          <v-icon icon="mdi-refresh" />
          <v-tooltip activator="parent" location="top">Refresh</v-tooltip>
        </v-btn>
      </div>

      <div v-if="!generated.length" class="pa-8 text-center">
        <v-icon icon="mdi-file-chart-outline" size="36" class="text-medium-emphasis" />
        <div class="text-subtitle-1 font-weight-medium mt-2">No reports generated yet</div>
        <div class="text-body-2 text-medium-emphasis">Run a report above and it will appear here, ready to download.</div>
      </div>

      <v-data-table v-else :headers="headers" :items="generated" item-value="id" density="comfortable" hover :items-per-page="10" class="gen">
        <template #item.title="{ item }">
          <div class="font-weight-medium">{{ item.title }}</div>
          <div class="text-caption text-medium-emphasis font-mono">{{ item.id }}</div>
        </template>
        <template #item.range="{ item }">{{ fmt(item.from) }} – {{ fmt(item.to) }}</template>
        <template #item.format="{ item }"><v-chip size="small" label class="font-mono">{{ item.format }}</v-chip></template>
        <template #item.status="{ item }">
          <span v-if="item.status === 'Generating'" class="d-inline-flex align-center gap-2 text-medium-emphasis"><v-progress-circular indeterminate size="14" width="2" /> Generating</span>
          <StatusPill v-else status="Completed" />
        </template>
        <template #item.actions="{ item }">
          <div class="d-inline-flex align-center gap-2">
            <RowActionButton icon="mdi-download-outline" label="Download" :disabled="item.status !== 'Ready'" @click="download(item)" />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <ReportDialog v-model="open" :report="selected" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { computed } from 'vue'
import { notify } from '@/composables/useToast'
import { download, generated, refreshReports } from '@/composables/useReports'
import { reports, type Report } from '@/mock/misc'
import PageHeader from '@/components/common/PageHeader.vue'
import RowActionButton from '@/components/common/RowActionButton.vue'
import StatusPill from '@/components/common/StatusPill.vue'
import ReportCard from './components/ReportCard.vue'
import ReportDialog from './components/ReportDialog.vue'

const open = ref(false)
const refreshing = ref(false)
const pending = computed(() => generated.filter(r => r.status === 'Generating').length)
const selected = ref<Report | null>(null)

const headers = [
  { title: 'Report', key: 'title' },
  { title: 'Date range', key: 'range', sortable: false },
  { title: 'Format', key: 'format' },
  { title: 'Rows', key: 'rows', align: 'end' as const },
  { title: 'Generated at', key: 'generatedAt' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'start' as const },
]

const fmt = (iso: string) => iso.split('-').reverse().join('/')

function refresh () {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    const before = pending.value
    const done = refreshReports()
    notify(done ? `${done} ${done === 1 ? 'report is' : 'reports are'} ready to download` : before ? 'Still generating. Try again in a moment.' : 'Up to date')
  }, 500)
}

function run (r: Report) {
  selected.value = r
  open.value = true
}
</script>

<style scoped>
.head { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
</style>
