<template>
  <v-dialog :model-value="modelValue" :max-width="width" scrollable @update:model-value="emit('update:modelValue', $event)">
    <v-card class="rounded-lg fd">
      <div class="d-flex align-start pa-4 pb-2">
        <div class="flex-grow-1">
          <div class="fd__title">{{ title }}</div>
          <div v-if="subtitle" class="fd__sub">{{ subtitle }}</div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" color="primary" aria-label="Close" @click="close" />
      </div>

      <div v-if="steps" class="fd__steps px-4 pb-3" role="tablist">
        <button
          v-for="(s, i) in steps"
          :key="s.key"
          type="button"
          role="tab"
          class="fd__step"
          :class="{ 'is-on': i === stepIndex, 'is-done': i < stepIndex }"
          :disabled="i > reached"
          :aria-selected="i === stepIndex"
          @click="goTo(i)"
        >
          <span class="fd__n">{{ i + 1 }}</span>{{ s.label }}
        </button>
      </div>
      <v-divider />

      <v-card-text class="px-4 py-4">
        <v-form ref="formRef" @submit.prevent="next">
          <div v-if="isReview" class="fd__review">
            <template v-for="fld in fields" :key="fld.key">
              <div class="text-medium-emphasis">{{ fld.label }}</div>
              <div class="font-weight-medium">{{ display(fld) }}</div>
            </template>
          </div>
          <div v-else class="fd__grid" :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
            <FormField v-for="fld in visibleFields" :key="fld.key" :label="fld.label" :required="fld.required" :style="{ gridColumn: `span ${Math.min(fld.span ?? 1, columns)}` }">
              <v-select
                v-if="fld.type === 'select'"
                v-model="model[fld.key]"
                :items="fld.items"
                :placeholder="fld.placeholder ?? `Select ${fld.label.toLowerCase()}`"
                :rules="fld.required ? [required] : []"
                v-bind="control"
              />
              <v-textarea
                v-else-if="fld.type === 'textarea'"
                v-model="model[fld.key]"
                :placeholder="fld.placeholder"
                rows="3"
                auto-grow
                v-bind="control"
              />
              <v-text-field
                v-else
                v-model="model[fld.key]"
                :type="fld.type"
                :placeholder="fld.placeholder"
                :hint="fld.hint"
                :persistent-hint="!!fld.hint"
                :rules="fld.required ? [required] : []"
                v-bind="control"
              />
            </FormField>
          </div>
        </v-form>
      </v-card-text>
      <v-divider />

      <div class="d-flex align-center pa-3 px-4 gap-2">
        <span v-if="steps" class="text-caption text-medium-emphasis">Step {{ stepIndex + 1 }} of {{ steps.length }}</span>
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="close">Cancel</v-btn>
        <v-btn v-if="steps && stepIndex > 0" variant="outlined" class="rounded-lg text-none" @click="goTo(stepIndex - 1)">Back</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-lg text-none font-weight-bold" @click="next">{{ isLast ? submitLabel : 'Next' }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { FieldDef, FormStep } from '@/types'
import FormField from '@/components/common/FormField.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  subtitle?: string
  submitLabel?: string
  fields: FieldDef[]
  /** Run the form as a stepper. Fields pick their step with `step`; a step keyed "review" lists the values. */
  steps?: FormStep[]
  /** Grid columns for the fields. */
  columns?: number
  /** Record being edited; null means a new record. */
  row?: Record<string, any> | null
}>(), { submitLabel: 'Save', row: null, columns: 2 })

const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }>, resetValidation: () => void } | null>(null)
const model = reactive<Record<string, any>>({})
const stepIndex = ref(0)
const reached = ref(0)
const required = (v: unknown) => (v !== null && v !== undefined && String(v).trim() !== '') || 'Required'

// Compact outlined inputs with the label above (see FormField).
const control = { 'persistent-placeholder': true, variant: 'outlined' as const, density: 'compact' as const, 'hide-details': 'auto' as const, rounded: 'lg' as const, class: 'fd__input' }

const width = computed(() => (props.columns > 2 ? 900 : props.columns === 2 ? 640 : 480))
const isReview = computed(() => props.steps?.[stepIndex.value]?.key === 'review')
const isLast = computed(() => !props.steps || stepIndex.value === props.steps.length - 1)
const visibleFields = computed(() => props.steps ? props.fields.filter(f => f.step === props.steps![stepIndex.value].key) : props.fields)

// Dates are shown as "22/10/2026" in tables but edited as yyyy-mm-dd.
const toIso = (text: string) => { const [d, m, y] = String(text).split('/'); return y ? `${y}-${m}-${d}` : '' }
const toDisplay = (iso: string) => iso.split('-').reverse().join('/')

const display = (fld: FieldDef) => {
  const v = model[fld.key]
  if (v === null || v === undefined || v === '') return '—'
  return fld.type === 'date' ? toDisplay(String(v)) : String(v)
}

watch(() => props.modelValue, open => {
  if (!open) return
  stepIndex.value = 0
  reached.value = props.row ? (props.steps?.length ?? 1) - 1 : 0
  for (const fld of props.fields) {
    const existing = props.row?.[fld.key]
    model[fld.key] = existing === undefined
      ? fld.value ?? (fld.type === 'number' ? null : '')
      : fld.type === 'date' ? toIso(existing) : existing
  }
  nextTick(() => formRef.value?.resetValidation())
})

function close () { emit('update:modelValue', false) }

function goTo (i: number) {
  if (i <= reached.value) stepIndex.value = i
}

async function next () {
  if (!isReview.value) {
    const result = await formRef.value?.validate()
    if (!result?.valid) return
  }
  if (!isLast.value) {
    stepIndex.value++
    reached.value = Math.max(reached.value, stepIndex.value)
    nextTick(() => formRef.value?.resetValidation())
    return
  }
  // A required field left empty (e.g. a step skipped through a pill) sends the user back to it.
  const missing = props.fields.find(f => f.required && required(model[f.key]) !== true)
  if (missing && props.steps) {
    const at = props.steps.findIndex(s => s.key === missing.step)
    if (at >= 0) { stepIndex.value = at; nextTick(() => formRef.value?.validate()); return }
  }
  const out: Record<string, any> = {}
  for (const fld of props.fields) {
    const v = model[fld.key]
    out[fld.key] = fld.type === 'date' ? (v ? toDisplay(v) : '') : fld.type === 'number' ? (v === null || v === '' ? 0 : Number(v)) : v
  }
  emit('save', out)
  close()
}
</script>

<style scoped>
.fd__title { font-size: 16px; font-weight: 600; line-height: 1.3; }
.fd__sub { font-size: 12px; color: rgb(var(--v-theme-primary)); }
.fd__steps { display: flex; gap: 6px; flex-wrap: wrap; }
.fd__step { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 4px; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 999px; background: transparent; font: inherit; font-size: 12px; color: rgba(var(--v-theme-on-surface), 0.55); cursor: pointer; transition: border-color 0.15s ease, color 0.15s ease; }
.fd__step:disabled { cursor: default; }
.fd__step.is-on { border-color: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-surface)); font-weight: 600; }
.fd__step.is-done { color: rgb(var(--v-theme-on-surface)); }
.fd__n { display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; background: rgba(var(--v-theme-on-surface), 0.1); font-size: 11px; }
.fd__step.is-on .fd__n { background: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary)); }
.fd__grid { display: grid; gap: 14px 16px; }
.fd__review { display: grid; grid-template-columns: 160px 1fr; gap: 8px 16px; font-size: 13px; }
.fd :deep(.fd__input .v-field) { font-size: 13px; border-radius: 8px; }
.fd :deep(.fd__input .v-field__input) { min-height: 36px; padding-top: 6px; padding-bottom: 6px; }
.fd :deep(.fd__input .v-field__outline) { --v-field-border-opacity: 0.3; }
.fd :deep(.fd__input input::placeholder), .fd :deep(.fd__input textarea::placeholder) { opacity: 0.5; }
@media (max-width: 600px) { .fd__grid { grid-template-columns: minmax(0, 1fr) !important; } .fd__grid > * { grid-column: auto !important; } }
</style>
