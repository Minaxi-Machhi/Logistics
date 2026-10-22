<template>
  <div class="d-inline-flex align-center gap-2" @click.stop>
    <RowActionButton v-if="order.status === 'Pending'" icon="mdi-check-circle-outline" label="Confirm order" @click="flow.confirming = order" />
    <RowActionButton v-if="order.status === 'Confirmed'" icon="mdi-truck-plus-outline" label="Create trip" @click="flow.planning = order" />
    <RowActionButton v-if="order.status === 'Completed'" icon="mdi-file-check-outline" label="Ready for invoice" @click="flow.readying = order" />
    <RowActionButton v-if="order.status === 'Ready for invoice'" icon="mdi-file-document-plus-outline" label="Generate invoice" @click="flow.invoicing = order" />

    <RowActionButton v-if="EDITABLE.includes(order.status)" icon="mdi-pencil-outline" label="Edit order" @click="orderStore.openEdit(order)" />
    <RowActionButton v-if="CANCELLABLE.includes(order.status)" tone="error" icon="mdi-close-circle-outline" label="Cancel order" @click="flow.cancelling = order" />
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import type { OrderFlow } from '@/composables/useOrderFlow'
import RowActionButton from '@/components/common/RowActionButton.vue'
import { orderStore } from '@/composables/useOrderStore'
import { CAN_CHANGE_BRANCH, CAN_EDIT_PICK_DROP, CAN_RESCHEDULE, CAN_SPLIT, CAN_UPDATE_RATE } from '@/mock/orderOps'
import { CANCELLABLE, EDITABLE } from '@/mock/orderFlow'

defineProps<{ order: Order, flow: OrderFlow }>()

</script>
