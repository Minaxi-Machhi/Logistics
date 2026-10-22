<template>
  <v-card class="rounded-lg border" flat>
    <Teleport to="#page-toolbar" defer :disabled="!hasTarget">
      <div class="toolbar" :class="{ 'pa-2': !hasTarget }">
        <v-text-field
          v-model="search"
          :placeholder="searchLabel"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="toolbar-search"
        />
        <v-select
          v-if="statuses.length"
          v-model="status"
          :items="statuses"
          placeholder="All statuses"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="toolbar-status"
        />
      </div>
    </Teleport>
    <v-data-table
      :headers="headers"
      :items="filtered"
      :search="search"
      items-per-page="10"
      hover
      density="comfortable"
      :class="{ 'row-link': !!linkTo }"
      @click:row="(_: Event, { item }: { item: T }) => open(item)"
    >
      <template #item.actions="{ item }">
        <slot name="actions" :item="item">
          <v-btn icon="mdi-pencil-outline" size="small" variant="text" aria-label="Edit" @click.stop="emit('edit', item)" />
          <v-btn icon="mdi-delete-outline" size="small" variant="text" color="error" aria-label="Delete" @click.stop="emit('remove', item)" />
        </slot>
      </template>
      <template v-for="c in columns" :key="c.key" #[`item.${c.key}`]="{ value, item }">
        <router-link v-if="c.key === 'id' && linkTo" :to="linkTo(item)" class="id-link font-mono text-no-wrap" @click.stop>{{ value }}</router-link>
        <StatusPill v-else-if="c.type === 'status'" :status="String(value)" />
        <span v-else-if="c.type === 'money'" class="text-no-wrap">{{ money(Number(value)) }}</span>
        <span v-else-if="c.type === 'mono'" class="font-mono text-no-wrap">{{ value }}</span>
        <span v-else class="text-no-wrap">{{ value }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts" generic="T extends Entity">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Column, Entity } from '@/types'
import { money } from '@/mock/country'
import StatusPill from '@/components/common/StatusPill.vue'

const props = withDefaults(defineProps<{
  columns: Column[]
  items: T[]
  searchLabel?: string
  /** Where a row click goes (detail page). */
  linkTo?: (row: T) => string
}>(), { searchLabel: 'Search' })

const emit = defineEmits<{ edit: [row: T], remove: [row: T] }>()
const router = useRouter()

// Search and filters move into the page header row when the page has one.
const hasTarget = ref(false)
onMounted(() => { hasTarget.value = !!document.querySelector('#page-toolbar') })

const search = ref('')
const status = ref<string | null>(null)

const headers = computed(() => [
  ...props.columns.map(c => ({ title: c.title, key: c.key, align: c.type === 'money' ? ('end' as const) : ('start' as const) })),
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
])
const statusKey = computed(() => props.columns.find(c => c.type === 'status')?.key)
const rowOf = (item: T) => item as Record<string, any>
const statuses = computed(() => statusKey.value ? [...new Set(props.items.map(i => String(rowOf(i)[statusKey.value!])))] : [])
const filtered = computed(() => status.value ? props.items.filter(i => rowOf(i)[statusKey.value!] === status.value) : props.items)

function open (row: T) {
  if (props.linkTo) router.push(props.linkTo(row))
}
</script>

<style scoped>
.toolbar { display: flex; align-items: center; gap: 8px; flex: 1 1 auto; min-width: 0; }
.toolbar-search { flex: 1 1 220px; max-width: 340px; min-width: 120px; }
.toolbar-status { flex: 0 1 190px; min-width: 120px; }
@media (max-width: 480px) { .toolbar { flex-wrap: wrap; } }
.row-link :deep(tbody tr) { cursor: pointer; }
.id-link { color: rgb(var(--v-theme-primary)); font-weight: 600; text-decoration: none; }
.id-link:hover { text-decoration: underline; }
</style>
