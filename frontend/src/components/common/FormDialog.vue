<template>
  <v-dialog :model-value="modelValue" max-width="640" scrollable @update:model-value="emit('update:modelValue', $event)">
    <v-card class="rounded-lg">
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h6 font-weight-medium">{{ title }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Close" @click="close" />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-4">
        <v-form ref="formRef" @submit.prevent="submit">
          <div class="form-grid">
            <div v-for="fld in fields" :key="fld.key">
              <v-select
                v-if="fld.type === 'select'"
                v-model="model[fld.key]"
                :label="fld.label"
                :items="fld.items"
                :rules="fld.required ? [required] : []"
                variant="outlined"
                density="comfortable"
              />
              <v-text-field
                v-else
                v-model="model[fld.key]"
                :label="fld.label"
                :type="fld.type"
                :hint="fld.hint"
                :persistent-hint="!!fld.hint"
                :rules="fld.required ? [required] : []"
                variant="outlined"
                density="comfortable"
              />
            </div>
          </div>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="outlined" class="rounded-lg text-none" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-lg text-none font-weight-bold" @click="submit">{{ submitLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import type { FieldDef } from '@/types'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  submitLabel?: string
  fields: FieldDef[]
  /** Record being edited; null means a new record. */
  row?: Record<string, any> | null
}>(), { submitLabel: 'Save', row: null })

const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }>, resetValidation: () => void } | null>(null)
const model = reactive<Record<string, any>>({})
const required = (v: unknown) => (v !== null && v !== undefined && String(v).trim() !== '') || 'Required'

// Dates are shown as "22/10/2026" in tables but edited as yyyy-mm-dd.
const toIso = (text: string) => { const [d, m, y] = String(text).split('/'); return y ? `${y}-${m}-${d}` : '' }
const toDisplay = (iso: string) => iso.split('-').reverse().join('/')

watch(() => props.modelValue, open => {
  if (!open) return
  for (const fld of props.fields) {
    const existing = props.row?.[fld.key]
    model[fld.key] = existing === undefined
      ? fld.value ?? (fld.type === 'number' ? null : '')
      : fld.type === 'date' ? toIso(existing) : existing
  }
  nextTick(() => formRef.value?.resetValidation())
})

function close () { emit('update:modelValue', false) }

async function submit () {
  const result = await formRef.value?.validate()
  if (!result?.valid) return
  const out: Record<string, any> = {}
  for (const fld of props.fields) {
    const v = model[fld.key]
    out[fld.key] = fld.type === 'date' ? (v ? toDisplay(v) : '') : fld.type === 'number' ? Number(v) : v
  }
  emit('save', out)
  close()
}
</script>

<style scoped>
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 16px; row-gap: 4px; }
@media (max-width: 600px) { .form-grid { grid-template-columns: minmax(0, 1fr); } }
</style>
