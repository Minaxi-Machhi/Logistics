<template>
  <v-container fluid class="page">
    <PageHeader :title="title" :subtitle="subtitle" :back="backTo">
      <StatusPill v-if="status" :status="status" class="align-self-center" />
      <slot name="actions" />
    </PageHeader>

    <div class="grid-2">
      <v-card v-for="s in sections" :key="s.title" class="rounded-lg border pa-3 h-100" flat>
          <div class="font-weight-bold mb-3">{{ s.title }}</div>
          <dl class="detail-grid">
            <template v-for="it in s.items" :key="it.label">
              <dt class="text-medium-emphasis">{{ it.label }}</dt>
              <dd :class="{ 'font-mono': it.type === 'mono' }">{{ it.type === 'money' ? money(Number(it.value)) : it.value }}</dd>
            </template>
          </dl>
      </v-card>
    </div>

    <slot />
  </v-container>
</template>

<script setup lang="ts">
import type { DetailSection } from '@/types'
import { money } from '@/mock/country'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusPill from '@/components/common/StatusPill.vue'

defineProps<{ title: string, subtitle?: string, status?: string, backTo: string, sections: DetailSection[] }>()
</script>

<style scoped>
.detail-grid { display: grid; grid-template-columns: minmax(110px, 40%) 1fr; gap: 8px 16px; margin: 0; }
.detail-grid dd { margin: 0; font-weight: 500; overflow-wrap: anywhere; }
</style>
