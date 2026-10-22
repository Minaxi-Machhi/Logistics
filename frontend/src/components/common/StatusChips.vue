<template>
  <div class="chips" role="tablist" aria-label="Status">
    <button
      v-for="c in items"
      :key="String(c.value)"
      type="button"
      role="tab"
      class="chip"
      :class="{ 'is-on': model === c.value, 'is-attention': c.tone === 'attention' && c.count, 'is-muted': c.tone === 'muted' || (c.count === 0 && c.value !== null) }"
      :aria-selected="model === c.value"
      @click="model = c.value"
    >
      {{ c.label }}
      <span class="chip__n font-mono">{{ c.count ?? '–' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface StatusChip { value: string | null, label: string, count: number | null, tone?: 'attention' | 'muted' }

defineProps<{ items: StatusChip[] }>()
const model = defineModel<string | null>({ default: null })
</script>

<style scoped>
.chips { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border: 0; border-radius: 999px; background: transparent; font: inherit; font-size: 13px; color: rgba(var(--v-theme-on-surface), 0.75); white-space: nowrap; cursor: pointer; transition: background-color 0.15s ease, color 0.15s ease; }
.chip:hover { background: rgba(var(--v-theme-on-surface), 0.06); }
.chip.is-on { background: rgba(var(--v-theme-primary), 0.1); color: rgb(var(--v-theme-primary)); font-weight: 600; }
.chip.is-muted:not(.is-on) { color: rgba(var(--v-theme-on-surface), 0.4); }
.chip__n { font-size: 11px; padding: 0 6px; border-radius: 9px; background: rgba(var(--v-theme-on-surface), 0.08); }
.chip.is-attention .chip__n { background: rgba(var(--v-theme-warning), 0.18); color: rgb(var(--v-theme-warning)); }
.chip.is-on .chip__n { background: rgba(var(--v-theme-primary), 0.16); }
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
</style>
