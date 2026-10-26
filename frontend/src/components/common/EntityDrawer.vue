<template>
  <v-navigation-drawer :model-value="modelValue" temporary location="right" :width="width" @update:model-value="emit('update:modelValue', $event)">
    <div class="d-flex align-center pa-4 pb-3 gap-3">
      <v-avatar color="primary" size="44" rounded="lg" class="font-weight-bold text-body-2">
        <v-icon v-if="icon" :icon="icon" />
        <template v-else>{{ initials }}</template>
      </v-avatar>
      <div class="flex-grow-1">
        <div class="text-subtitle-1 font-weight-bold line-height-tight">{{ title }}</div>
        <div class="text-caption text-medium-emphasis">{{ subtitle }}</div>
      </div>
      <StatusPill v-if="status" :status="status" />
      <v-btn icon="mdi-close" variant="text" size="small" aria-label="Close" @click="emit('update:modelValue', false)" />
    </div>
    <v-divider />

    <div class="pa-4">
      <div class="sections">
        <v-card v-for="s in sections" :key="s.title" class="rounded-lg border pa-3" flat>
          <div class="font-weight-bold mb-3">{{ s.title }}</div>
          <dl class="facts">
            <template v-for="f in s.items" :key="f.label">
              <dt class="text-medium-emphasis">{{ f.label }}</dt>
              <dd :class="{ 'font-mono': f.type === 'mono' }">{{ f.type === 'money' ? money(Number(f.value)) : f.value }}</dd>
            </template>
          </dl>
        </v-card>
      </div>
      <!-- Related tables -->
      <slot />
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import type { DetailSection } from '@/types'
import { money } from '@/mock/country'
import StatusPill from '@/components/common/StatusPill.vue'

/** Right-hand drawer with a header, detail cards and room for related tables. The <Entity>Drawer components fill it in. */
const props = defineProps<{
  modelValue: boolean
  title: string
  subtitle?: string
  status?: string
  /** Icon in the avatar; initials are used when it is not given. */
  icon?: string
  initialsFrom?: string
  sections: DetailSection[]
}>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean] }>()

// Wide enough for the related tables, but never wider than the window.
const { width: windowWidth } = useDisplay()
const width = computed(() => Math.min(1040, windowWidth.value))
const initials = computed(() => (props.initialsFrom ?? props.title).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase())
</script>

<style scoped>
.sections { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 4px; }
.facts { display: grid; grid-template-columns: minmax(110px, 42%) 1fr; gap: 8px 12px; margin: 0; font-size: 13px; }
.facts dd { margin: 0; font-weight: 500; overflow-wrap: anywhere; }
.line-height-tight { line-height: 1.2; }
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
@media (max-width: 700px) { .sections { grid-template-columns: minmax(0, 1fr); } }
</style>
