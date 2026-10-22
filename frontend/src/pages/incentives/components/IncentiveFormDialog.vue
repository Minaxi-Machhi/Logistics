<template>
  <FormDialog
    :model-value="modelValue"
    :title="row ? `Edit ${row.id}` : 'Calculate incentive'"
    :submit-label="row ? 'Save changes' : 'Create incentive'"
    :fields="incentiveFields"
    :row="row"
    @update:model-value="emit('update:modelValue', $event)"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
import type { Incentive } from '@/types'
import FormDialog from '@/components/common/FormDialog.vue'
import { incentiveFields } from '../config'

defineProps<{ modelValue: boolean, row: Incentive | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()
</script>
