<template>
  <v-card class="rounded-lg border mt-3" flat>
    <div class="font-weight-bold px-3 pt-3 pb-1">{{ title }} <v-chip size="x-small" label class="ml-1 font-mono">{{ items.length }}</v-chip></div>
    <div v-if="!items.length" class="px-4 pb-4 text-body-2 text-medium-emphasis">{{ empty }}</div>
    <v-data-table
      v-else
      :headers="headers"
      :items="items"
      item-value="id"
      density="compact"
      :hover="!!linkTo"
      :items-per-page="10"
      :hide-default-footer="items.length <= 10"
      :class="{ 'row-link': !!linkTo }"
      @click:row="onRowClick"
    >
      <template v-for="(c, i) in columns" :key="c.key" #[`item.${c.key}`]="{ item, value }">
        <router-link v-if="linkTo && i === 0" :to="linkTo(item)" class="id-link font-mono text-no-wrap" @click.stop>{{ value }}</router-link>
        <StatusPill v-else-if="c.type === 'status'" :status="String(value)" />
        <span v-else-if="c.type === 'money'" class="text-no-wrap">{{ money(Number(value)) }}</span>
        <span v-else :class="{ 'font-mono': c.type === 'mono' }" class="text-no-wrap">{{ value }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts" generic="T extends Entity">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Column, Entity } from '@/types'
import { money } from '@/mock/country'
import StatusPill from '@/components/common/StatusPill.vue'

const props = withDefaults(defineProps<{ title: string, columns: Column[], items: T[], linkTo?: (row: T) => string, empty?: string }>(), { empty: 'Nothing linked yet.' })
const router = useRouter()

const headers = computed(() => props.columns.map(c => ({ title: c.title, key: c.key, align: c.type === 'money' ? ('end' as const) : ('start' as const) })))

function onRowClick (_: Event, { item }: { item: T }) {
  if (props.linkTo) router.push(props.linkTo(item))
}
</script>

<style scoped>
.row-link :deep(tbody tr) { cursor: pointer; }
.id-link { color: rgb(var(--v-theme-primary)); font-weight: 600; text-decoration: none; }
.id-link:hover { text-decoration: underline; }
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
</style>
