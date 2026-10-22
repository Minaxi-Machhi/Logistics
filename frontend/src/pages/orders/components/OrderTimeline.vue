<template>
  <v-card class="rounded-lg border pa-4 mb-4" flat>
    <div v-if="terminal" class="d-flex align-center gap-2">
      <StatusPill :status="status" />
      <span class="text-body-2 text-medium-emphasis">This order is closed and can't move forward.</span>
    </div>
    <ol v-else class="steps">
      <li v-for="(s, i) in FLOW_STEPS" :key="s" :class="{ done: i < index, current: i === index }">
        <span class="dot"><v-icon v-if="i < index" size="14">mdi-check</v-icon></span>
        <span class="label">{{ s }}</span>
      </li>
    </ol>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FLOW_STEPS } from '@/mock/orderFlow'
import StatusPill from '@/components/common/StatusPill.vue'

const props = defineProps<{ status: string }>()
const index = computed(() => FLOW_STEPS.indexOf(props.status))
const terminal = computed(() => index.value < 0)
</script>

<style scoped>
.steps { display: flex; list-style: none; margin: 0; padding: 0; overflow-x: auto; }
.steps li { flex: 1 0 110px; display: flex; flex-direction: column; align-items: center; gap: 6px; position: relative; font-size: 12px; color: rgba(var(--v-theme-on-surface), 0.6); }
.steps li::before { transition: background-color 0.3s ease; content: ''; position: absolute; top: 11px; left: -50%; width: 100%; height: 2px; background: rgba(var(--v-border-color), var(--v-border-opacity)); }
.steps li:first-child::before { display: none; }
.dot { transition: background-color 0.3s ease, border-color 0.3s ease; position: relative; z-index: 1; width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(var(--v-border-color), 0.4); background: rgb(var(--v-theme-surface)); display: grid; place-items: center; }
.steps li.done .dot { background: rgb(var(--v-theme-success)); border-color: rgb(var(--v-theme-success)); color: #fff; }
.steps li.done::before, .steps li.current::before { background: rgb(var(--v-theme-success)); }
.steps li.current .dot { border-color: rgb(var(--v-theme-primary)); background: rgb(var(--v-theme-primary)); }
.steps li.current .label { color: rgb(var(--v-theme-on-surface)); font-weight: 600; }
.label { text-align: center; }
</style>
