<template>
  <v-container fluid class="page">
    <PageHeader toolbar title="Orders" subtitle="Create, confirm and track orders through to invoicing.">
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" @click="crud.openNew()">New order</v-btn>
    </PageHeader>

    <DataTable :columns="orderColumns" :items="orders" search-label="Search orders" :link-to="orderLink">
      <template #actions="{ item }">
        <OrderActionsMenu :order="item" :flow="flow" @edit="crud.openEdit" />
      </template>
    </DataTable>

    <OrderFlowDialogs :flow="flow" />
    <OrderFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
  </v-container>
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import { buildOrder, orders, rebuildOrder } from '@/mock/orders'
import { useCrud } from '@/composables/useCrud'
import { useOrderFlow } from '@/composables/useOrderFlow'
import DataTable from '@/components/common/DataTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import OrderActionsMenu from './components/OrderActionsMenu.vue'
import OrderFlowDialogs from './components/OrderFlowDialogs.vue'
import OrderFormDialog from './components/OrderFormDialog.vue'
import { orderColumns, orderLink } from './config'

const flow = useOrderFlow()

const crud = useCrud<Order>(orders, {
  prefix: 'ATS-TL2610-',
  pad: 4,
  build: (v, id) => buildOrder({ ...(v as Omit<Order, 'originDepot' | 'destDepot' | 'ref' | 'status'>), id, status: 'Pending', loading: `${v.orderDate} 9:00 am`, cutoff: '' }),
  update: rebuildOrder,
})
</script>
