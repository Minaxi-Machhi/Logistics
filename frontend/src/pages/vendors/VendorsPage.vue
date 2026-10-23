<template>
  <v-container fluid class="page fill">
    <PageHeader title="Vendors" subtitle="Carriers, their contracts and purchase orders.">
      <template #left><ListFilterBar :list="active" /></template>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" height="32" @click="crud.openNew()">{{ ADD[tab] }}</v-btn>
    </PageHeader>

    <v-tabs v-model="tab" color="primary" class="mb-2">
      <v-tab value="vendors" class="text-none">Vendors <v-chip size="x-small" label class="ml-2 font-mono">{{ vendors.length }}</v-chip></v-tab>
      <v-tab value="contracts" class="text-none">Vendor contracts <v-chip size="x-small" label class="ml-2 font-mono">{{ vendorContracts.length }}</v-chip></v-tab>
      <v-tab value="orders" class="text-none">Vendor orders <v-chip size="x-small" label class="ml-2 font-mono">{{ vendorOrders.length }}</v-chip></v-tab>
    </v-tabs>

    <ListTable v-if="tab === 'vendors'" :list="vendorList" :columns="vendorColumns" storage-key="vendors" :link-to="vendorLink" empty-text="Add the first vendor.">
      <template #actions="{ item }">
        <RowActionButton icon="mdi-pencil-outline" label="Edit vendor" @click="vendorCrud.openEdit(item)" />
        <RowActionButton tone="error" icon="mdi-delete-outline" label="Delete vendor" @click="vendorCrud.askRemove(item)" />
      </template>
    </ListTable>
    <ListTable v-else-if="tab === 'contracts'" :list="contractList" :columns="vendorContractColumns" storage-key="vendor-contracts" :link-to="vendorContractLink" empty-text="No vendor contracts yet.">
      <template #actions="{ item }">
        <RowActionButton icon="mdi-pencil-outline" label="Edit contract" @click="contractCrud.openEdit(item)" />
        <RowActionButton tone="error" icon="mdi-delete-outline" label="Delete contract" @click="contractCrud.askRemove(item)" />
      </template>
    </ListTable>
    <ListTable v-else :list="orderList" :columns="vendorOrderColumns" storage-key="vendor-orders" :link-to="vendorOrderLink" empty-text="No vendor orders yet.">
      <template #actions="{ item }">
        <RowActionButton icon="mdi-pencil-outline" label="Edit vendor order" @click="orderCrud.openEdit(item)" />
        <RowActionButton tone="error" icon="mdi-delete-outline" label="Delete vendor order" @click="orderCrud.askRemove(item)" />
      </template>
    </ListTable>

    <VendorFormDialog v-model="vendorCrud.formOpen" kind="vendor" :row="vendorCrud.editing" @save="vendorCrud.save" />
    <VendorFormDialog v-model="contractCrud.formOpen" kind="contract" :row="contractCrud.editing" @save="contractCrud.save" />
    <VendorFormDialog v-model="orderCrud.formOpen" kind="order" :row="orderCrud.editing" @save="orderCrud.save" />
    <ConfirmDialog v-model="vendorCrud.confirmOpen" title="Delete vendor?" :text="`${vendorCrud.target?.id} will be removed from this list.`" @confirm="vendorCrud.remove()" />
    <ConfirmDialog v-model="contractCrud.confirmOpen" title="Delete contract?" :text="`${contractCrud.target?.id} will be removed from this list.`" @confirm="contractCrud.remove()" />
    <ConfirmDialog v-model="orderCrud.confirmOpen" title="Delete vendor order?" :text="`${orderCrud.target?.id} will be removed from this list.`" @confirm="orderCrud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Vendor, VendorContract, VendorOrder } from '@/types'
import { type Crud, useCrud } from '@/composables/useCrud'
import { useList } from '@/composables/useList'
import { vendorContracts, vendorOrders, vendors } from '@/mock/vendors'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ListFilterBar from '@/components/common/ListFilterBar.vue'
import ListTable from '@/components/common/ListTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import RowActionButton from '@/components/common/RowActionButton.vue'
import VendorFormDialog from './components/VendorFormDialog.vue'
import { vendorColumns, vendorContractColumns, vendorContractLink, vendorContractListConfig, vendorLink, vendorListConfig, vendorOrderColumns, vendorOrderLink, vendorOrderListConfig } from './config'

type Tab = 'vendors' | 'contracts' | 'orders'
const ADD: Record<Tab, string> = { vendors: 'Add vendor', contracts: 'New vendor contract', orders: 'New vendor order' }

const route = useRoute()
const tab = ref<Tab>(route.query.tab === 'contracts' || route.query.tab === 'orders' ? route.query.tab : 'vendors')

const vendorList = useList(() => vendors, vendorListConfig)
const contractList = useList(() => vendorContracts, vendorContractListConfig)
const orderList = useList(() => vendorOrders, vendorOrderListConfig)
const active = computed(() => ({ vendors: vendorList, contracts: contractList, orders: orderList })[tab.value])
onMounted(() => { vendorList.restore(); contractList.restore(); orderList.restore() })

const vendorCrud = useCrud<Vendor>(vendors, { prefix: 'VND-' })
const contractCrud = useCrud<VendorContract>(vendorContracts, { prefix: 'VC-' })
const orderCrud = useCrud<VendorOrder>(vendorOrders, { prefix: 'VPO-' })
const crud = computed<Crud>(() => ({ vendors: vendorCrud, contracts: contractCrud, orders: orderCrud })[tab.value])
</script>
