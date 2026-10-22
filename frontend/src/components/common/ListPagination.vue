<template>
  <div class="d-flex align-center justify-space-between flex-wrap gap-2 text-body-2">
    <span class="text-medium-emphasis">{{ from }}–{{ to }} of {{ total.toLocaleString() }}</span>
    <div class="d-flex align-center gap-2">
      <span class="text-medium-emphasis d-none d-sm-inline">Rows</span>
      <v-select v-model="pageSize" :items="[20, 50, 100]" variant="outlined" density="compact" hide-details style="width: 88px" />
      <v-btn icon="mdi-chevron-left" size="small" variant="text" aria-label="Previous page" :disabled="page <= 1" @click="page--" />
      <span class="font-mono">{{ page }} / {{ pages }}</span>
      <v-btn icon="mdi-chevron-right" size="small" variant="text" aria-label="Next page" :disabled="page >= pages" @click="page++" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ total: number }>()
const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 20 })

const pages = computed(() => Math.max(1, Math.ceil(props.total / pageSize.value)))
const from = computed(() => props.total ? (page.value - 1) * pageSize.value + 1 : 0)
const to = computed(() => Math.min(props.total, page.value * pageSize.value))
</script>

<style scoped>
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
</style>
