<template>
  <v-menu :close-on-content-click="false" location="bottom end" offset="6">
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="flat" prepend-icon="mdi-view-column-outline" class="tool-btn">Columns</v-btn>
    </template>
    <v-card min-width="260">
      <div class="px-3 pt-2 text-caption text-medium-emphasis">Drag to reorder. Pin keeps a column in view.</div>
      <v-list density="compact" max-height="340">
        <v-list-item
          v-for="c in columns"
          :key="c.colId"
          :draggable="!c.locked"
          class="col-row"
          :class="{ 'is-over': overId === c.colId }"
          @dragstart="dragId = c.colId"
          @dragover.prevent="overId = c.colId"
          @dragleave="overId = null"
          @drop.prevent="drop(c.colId)"
          @dragend="dragId = overId = null"
        >
          <template #prepend>
            <v-icon icon="mdi-drag" size="18" class="mr-1 drag" :class="{ 'opacity-30': c.locked }" />
            <v-checkbox-btn :model-value="c.visible" density="compact" :disabled="c.locked" @update:model-value="emit('toggle', c.colId, !!$event)" />
          </template>
          <v-list-item-title>{{ c.label }}</v-list-item-title>
          <template #append>
            <v-btn :icon="c.pinned ? 'mdi-pin' : 'mdi-pin-outline'" size="x-small" variant="text" :color="c.pinned ? 'primary' : undefined" :disabled="c.locked" aria-label="Pin column" @click="emit('pin', c.colId, c.pinned ? null : 'left')" />
          </template>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-btn variant="text" block class="text-none" @click="emit('reset')">Reset columns</v-btn>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface ChooserColumn { colId: string, label: string, visible: boolean, pinned: 'left' | null, locked?: boolean }

const props = defineProps<{ columns: ChooserColumn[] }>()
const emit = defineEmits<{ toggle: [colId: string, visible: boolean], reorder: [colIds: string[]], pin: [colId: string, pinned: 'left' | null], reset: [] }>()

const dragId = ref<string | null>(null)
const overId = ref<string | null>(null)

function drop (targetId: string) {
  const from = dragId.value
  dragId.value = overId.value = null
  if (!from || from === targetId) return
  const ids = props.columns.map(c => c.colId).filter(id => id !== from)
  ids.splice(ids.indexOf(targetId), 0, from)
  emit('reorder', ids)
}
</script>

<style scoped>
.col-row { cursor: grab; }
.col-row.is-over { box-shadow: inset 0 2px 0 rgb(var(--v-theme-primary)); }
.drag { cursor: grab; }
</style>
