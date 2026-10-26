<template>
  <FormDialog
    :model-value="modelValue"
    :title="`Edit ${row?.id ?? ''}`"
    submit-label="Save changes"
    :columns="2"
    :fields="invoiceFields"
    :row="row"
    @update:model-value="emit('update:modelValue', $event)"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
import type { Invoice } from '@/types'
import FormDialog from '@/components/common/FormDialog.vue'
import { invoiceFields } from '../config'

defineProps<{ modelValue: boolean, row: Invoice | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()
</script>
