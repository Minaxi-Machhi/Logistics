<template>
  <v-dialog :model-value="modelValue" max-width="480" @update:model-value="emit('update:modelValue', $event)">
    <v-card v-if="report" class="rounded-lg">
      <v-card-title class="text-h6 font-weight-medium pa-4">{{ report.title }}</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="6"><v-text-field v-model="from" label="From" type="date" variant="outlined" density="comfortable" /></v-col>
          <v-col cols="6"><v-text-field v-model="to" label="To" type="date" variant="outlined" density="comfortable" /></v-col>
          <v-col cols="12"><v-select v-model="format" label="Export as" :items="['PDF', 'Excel', 'CSV']" variant="outlined" density="comfortable" /></v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="outlined" class="rounded-lg text-none" @click="emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-lg text-none font-weight-bold" @click="run">Run report</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Report } from '@/mock/misc'
import { notify } from '@/composables/useToast'

const props = defineProps<{ modelValue: boolean, report: Report | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean] }>()

const from = ref('2026-10-01')
const to = ref('2026-10-22')
const format = ref('PDF')

function run () {
  notify(`${props.report?.title} (${format.value}) is being prepared`)
  emit('update:modelValue', false)
}
</script>
