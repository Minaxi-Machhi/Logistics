<template>
  <div class="d-inline-flex align-center gap-2" @click.stop>
    <v-btn v-if="order.status === 'Pending'" v-bind="btn" aria-label="Confirm order" @click="flow.confirming = order"><v-icon icon="mdi-check-circle-outline" /><v-tooltip activator="parent" location="top">Confirm order</v-tooltip></v-btn>
    <v-btn v-if="order.status === 'Confirmed'" v-bind="btn" aria-label="Create trip" @click="flow.planning = order"><v-icon icon="mdi-truck-plus-outline" /><v-tooltip activator="parent" location="top">Create trip</v-tooltip></v-btn>
    <v-btn v-if="order.status === 'Completed'" v-bind="btn" aria-label="Ready for invoice" @click="flow.readying = order"><v-icon icon="mdi-file-check-outline" /><v-tooltip activator="parent" location="top">Ready for invoice</v-tooltip></v-btn>
    <v-btn v-if="order.status === 'Ready for invoice'" v-bind="btn" aria-label="Generate invoice" @click="flow.invoicing = order"><v-icon icon="mdi-file-document-plus-outline" /><v-tooltip activator="parent" location="top">Generate invoice</v-tooltip></v-btn>
    <v-btn v-if="EDITABLE.includes(order.status)" v-bind="btn" aria-label="Edit order" @click="emit('edit', order)"><v-icon icon="mdi-pencil-outline" /><v-tooltip activator="parent" location="top">Edit</v-tooltip></v-btn>

    <v-btn v-if="CANCELLABLE.includes(order.status)" v-bind="btn" color="error" aria-label="Cancel order" @click="flow.cancelling = order"><v-icon icon="mdi-close-circle-outline" /><v-tooltip activator="parent" location="top">Cancel order</v-tooltip></v-btn>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import type { OrderFlow } from '@/composables/useOrderFlow'
import { CANCELLABLE, EDITABLE } from '@/mock/orderFlow'

defineProps<{ order: Order, flow: OrderFlow }>()
const emit = defineEmits<{ edit: [order: Order] }>()

// Square tinted icon buttons, as in the real app's row actions.
const btn = { variant: 'tonal' as const, color: 'primary', size: 'small' as const, rounded: 'lg' }
</script>
