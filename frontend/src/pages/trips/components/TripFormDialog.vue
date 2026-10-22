<template>
  <FormDialog
    :model-value="modelValue"
    :title="row ? `Edit ${row.id}` : 'New trip'"
    :submit-label="row ? 'Save changes' : 'Create trip'"
    :fields="tripFields"
    :row="row"
    @update:model-value="emit('update:modelValue', $event)"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
import type { Trip } from '@/types'
import FormDialog from '@/components/common/FormDialog.vue'
import { tripFields } from '../config'

defineProps<{ modelValue: boolean, row: Trip | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()
</script>
