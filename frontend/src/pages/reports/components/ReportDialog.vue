<template>
  <v-dialog :model-value="modelValue" max-width="480" @update:model-value="emit('update:modelValue', $event)">
    <v-card v-if="report" class="rounded-lg">
      <div class="d-flex align-start pa-4 pb-2">
        <div class="flex-grow-1">
          <div class="text-subtitle-1 font-weight-bold">{{ report.title }}</div>
          <div class="text-caption text-medium-emphasis">{{ report.text }}</div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" color="primary" aria-label="Close" @click="emit('update:modelValue', false)" />
      </div>
      <v-divider />
      <v-card-text class="pa-4">
        <div class="grid">
          <FormField label="From" required><v-text-field v-model="from" type="date" v-bind="control" /></FormField>
          <FormField label="To" required><v-text-field v-model="to" type="date" :error-messages="error" v-bind="control" /></FormField>
          <FormField label="Format" class="span"><v-select v-model="format" :items="['CSV', 'Excel']" v-bind="control" /></FormField>
        </div>
      </v-card-text>
      <v-divider />
      <div class="d-flex pa-3 px-4 gap-2">
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-lg text-none font-weight-bold" :disabled="!!error || !from || !to" @click="run">Generate report</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { generate } from '@/composables/useReports'
import type { Report } from '@/mock/misc'
import FormField from '@/components/common/FormField.vue'

const props = defineProps<{ modelValue: boolean, report: Report | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean] }>()

const control = { 'persistent-placeholder': true, variant: 'outlined' as const, density: 'compact' as const, 'hide-details': 'auto' as const, rounded: 'lg' as const }

const from = ref('2026-10-01')
const to = ref('2026-10-22')
const format = ref<'CSV' | 'Excel'>('CSV')
const error = computed(() => (from.value && to.value && to.value < from.value ? 'To is before From' : ''))

function run () {
  if (!props.report) return
  generate(props.report.title, from.value, to.value, format.value)
  emit('update:modelValue', false)
}
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 16px; }
.span { grid-column: span 2; }
</style>
