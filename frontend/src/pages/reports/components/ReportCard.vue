<template>
  <v-card class="rounded-lg border pa-4 d-flex flex-column" flat>
    <v-avatar color="accent" rounded="lg" size="40" class="mb-3">
      <v-icon color="primary">{{ report.icon }}</v-icon>
    </v-avatar>
    <div class="font-weight-bold">{{ report.title }}</div>
    <div class="text-body-2 text-medium-emphasis flex-grow-1 my-1">{{ report.text }}</div>
    <v-btn variant="outlined" class="rounded-lg text-none mt-2" block @click="emit('run', report)">Run report</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import type { Report } from '@/mock/misc'

defineProps<{ report: Report }>()
const emit = defineEmits<{ run: [report: Report] }>()
</script>
