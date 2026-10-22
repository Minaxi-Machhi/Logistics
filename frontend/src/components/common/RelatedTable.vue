<template>
  <v-card class="rounded-lg border mt-3" flat>
    <div class="font-weight-bold px-3 pt-3 pb-1">{{ title }} <v-chip size="x-small" label class="ml-1 font-mono">{{ items.length }}</v-chip></div>
    <div v-if="!items.length" class="px-4 pb-4 text-body-2 text-medium-emphasis">{{ empty }}</div>
    <v-table v-else density="compact">
      <thead>
        <tr><th v-for="c in columns" :key="c.key">{{ c.title }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in items" :key="r.id" :class="{ 'row-link': !!linkTo }" @click="linkTo && router.push(linkTo(r))">
          <td v-for="c in columns" :key="c.key">
            <StatusPill v-if="c.type === 'status'" :status="String(rowOf(r)[c.key])" />
            <span v-else-if="c.type === 'money'" class="text-no-wrap">{{ money(Number(rowOf(r)[c.key])) }}</span>
            <span v-else :class="{ 'font-mono': c.type === 'mono' }" class="text-no-wrap">{{ rowOf(r)[c.key] }}</span>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup lang="ts" generic="T extends Entity">
import { useRouter } from 'vue-router'
import type { Column, Entity } from '@/types'
import { money } from '@/mock/country'
import StatusPill from '@/components/common/StatusPill.vue'

withDefaults(defineProps<{ title: string, columns: Column[], items: T[], linkTo?: (row: T) => string, empty?: string }>(), { empty: 'Nothing linked yet.' })
const router = useRouter()
const rowOf = (r: T) => r as Record<string, any>
</script>

<style scoped>
.row-link { cursor: pointer; }
</style>
