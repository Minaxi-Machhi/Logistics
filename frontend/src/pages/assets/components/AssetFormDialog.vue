<template>
  <FormDialog
    :model-value="modelValue"
    :title="row ? `Edit ${row.id}` : kind === 'driver' ? 'Add driver' : 'Add vehicle'"
    :submit-label="row ? 'Save changes' : 'Create'"
    :fields="kind === 'driver' ? driverFields : vehicleFields"
    :row="row"
    @update:model-value="emit('update:modelValue', $event)"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
import type { Driver, Vehicle } from '@/types'
import FormDialog from '@/components/common/FormDialog.vue'
import { driverFields, vehicleFields } from '../config'

defineProps<{ modelValue: boolean, kind: 'driver' | 'vehicle', row: Driver | Vehicle | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()
</script>
