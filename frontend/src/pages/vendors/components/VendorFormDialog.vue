<template>
  <FormDialog
    :model-value="modelValue"
    :title="row ? `Edit ${row.id}` : `Add ${LABEL[kind]}`"
    :submit-label="row ? 'Save changes' : 'Create'"
    :fields="FIELDS[kind]"
    :row="row"
    @update:model-value="emit('update:modelValue', $event)"
    @save="emit('save', $event)"
  />
</template>

<script setup lang="ts">
import type { FieldDef, Vendor, VendorContract, VendorOrder } from '@/types'
import FormDialog from '@/components/common/FormDialog.vue'
import { vendorContractFields, vendorFields, vendorOrderFields } from '../config'

export type VendorKind = 'vendor' | 'contract' | 'order'

defineProps<{ modelValue: boolean, kind: VendorKind, row: Vendor | VendorContract | VendorOrder | null }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean], save: [values: Record<string, any>] }>()

const FIELDS: Record<VendorKind, FieldDef[]> = { vendor: vendorFields, contract: vendorContractFields, order: vendorOrderFields }
const LABEL: Record<VendorKind, string> = { vendor: 'vendor', contract: 'vendor contract', order: 'vendor order' }
</script>
