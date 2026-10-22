<template>
  <FormDialog
    :model-value="modelValue"
    :title="row ? `Edit ${row.id}` : 'New order'"
    :subtitle="row ? undefined : 'Local'"
    submit-label="Create order"
    :fields="orderFields"
    :steps="orderSteps"
    :columns="4"
    :row="row && { ...row, loadingDate: loadingDate(row) }"
    @update:model-value="emit('update:modelValue', $event)"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import { loadingDate } from '@/mock/orders'
import FormDialog from '@/components/common/FormDialog.vue'
import { orderFields, orderSteps } from '../config'

defineProps<{ modelValue: boolean, row: Order | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()
</script>
