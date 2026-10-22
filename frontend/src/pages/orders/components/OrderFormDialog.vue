<template>
  <FormDialog
    :model-value="modelValue"
    :title="row ? `Edit ${row.id}` : 'New order'"
    :submit-label="row ? 'Save changes' : 'Create order'"
    :fields="orderFields"
    :row="row"
    @update:model-value="emit('update:modelValue', $event)"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import FormDialog from '@/components/common/FormDialog.vue'
import { orderFields } from '../config'

defineProps<{ modelValue: boolean, row: Order | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()
</script>
