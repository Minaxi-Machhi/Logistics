<template>
  <FormDialog
    :model-value="modelValue"
    :title="row ? `Edit ${row.id}` : kind === 'customer' ? 'Add customer' : 'New customer contract'"
    :submit-label="row ? 'Save changes' : 'Create'"
    :fields="kind === 'customer' ? customerFields : contractFields"
    :row="row"
    @update:model-value="emit('update:modelValue', $event)"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
import type { Customer, CustomerContract } from '@/types'
import FormDialog from '@/components/common/FormDialog.vue'
import { contractFields, customerFields } from '../config'

defineProps<{ modelValue: boolean, kind: 'customer' | 'contract', row: Customer | CustomerContract | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()
</script>
