<template>
  <v-dialog :model-value="modelValue" max-width="440" @update:model-value="emit('update:modelValue', $event)">
    <v-card class="rounded-lg">
      <div class="d-flex align-start pa-4 pb-2">
        <div class="text-subtitle-1 font-weight-bold flex-grow-1">My profile</div>
        <v-btn icon="mdi-close" variant="text" size="small" color="primary" aria-label="Close" @click="emit('update:modelValue', false)" />
      </div>

      <div class="d-flex align-center gap-4 px-4 pb-4">
        <v-avatar color="primary" size="64" class="text-h6 font-weight-bold">{{ profile.initials }}</v-avatar>
        <div>
          <div class="text-h6 font-weight-bold line-height-tight">{{ profile.name }}</div>
          <v-chip size="small" label color="primary" variant="tonal" class="mt-1">{{ profile.role }}</v-chip>
        </div>
      </div>
      <v-divider />

      <dl class="facts pa-4">
        <template v-for="f in facts" :key="f.label">
          <dt class="text-medium-emphasis">{{ f.label }}</dt>
          <dd>{{ f.value }}</dd>
        </template>
      </dl>
      <v-divider />

      <div class="d-flex pa-3 px-4">
        <v-spacer />
        <v-btn variant="outlined" class="rounded-lg text-none" @click="emit('update:modelValue', false)">Close</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { country, currency } from '@/mock/country'
import { profile } from '@/mock/profile'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean] }>()

const facts = computed(() => [
  { label: 'Email', value: profile.email },
  { label: 'Phone', value: profile.phone },
  { label: 'Company', value: profile.company },
  { label: 'Branch', value: profile.branch },
  { label: 'Country', value: `${country.value} (${currency.value})` },
  { label: 'Last sign-in', value: profile.lastSignIn },
  { label: 'Member since', value: profile.memberSince },
])
</script>

<style scoped>
.facts { display: grid; grid-template-columns: 120px 1fr; gap: 10px 12px; margin: 0; font-size: 13px; }
.facts dd { margin: 0; font-weight: 500; overflow-wrap: anywhere; }
.line-height-tight { line-height: 1.2; }
</style>
