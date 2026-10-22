<template>
  <v-container fluid class="page">
    <PageHeader toolbar title="Vendors" subtitle="Carriers, their contracts and purchase orders.">
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" @click="crud.openNew()">{{ ADD[tab] }}</v-btn>
    </PageHeader>

    <v-tabs v-model="tab" color="primary" class="mb-2">
      <v-tab value="vendors" class="text-none">Vendors <v-chip size="x-small" label class="ml-2 font-mono">{{ vendors.length }}</v-chip></v-tab>
      <v-tab value="contracts" class="text-none">Vendor contracts <v-chip size="x-small" label class="ml-2 font-mono">{{ vendorContracts.length }}</v-chip></v-tab>
      <v-tab value="orders" class="text-none">Vendor orders <v-chip size="x-small" label class="ml-2 font-mono">{{ vendorOrders.length }}</v-chip></v-tab>
    </v-tabs>

    <DataTable v-if="tab === 'vendors'" :columns="vendorColumns" :items="vendors" search-label="Search vendors" :link-to="vendorLink" @edit="vendorCrud.openEdit" @remove="vendorCrud.askRemove" />
    <DataTable v-else-if="tab === 'contracts'" :columns="vendorContractColumns" :items="vendorContracts" search-label="Search vendor contracts" :link-to="vendorContractLink" @edit="contractCrud.openEdit" @remove="contractCrud.askRemove" />
    <DataTable v-else :columns="vendorOrderColumns" :items="vendorOrders" search-label="Search vendor orders" :link-to="vendorOrderLink" @edit="orderCrud.openEdit" @remove="orderCrud.askRemove" />

    <VendorFormDialog v-model="vendorCrud.formOpen" kind="vendor" :row="vendorCrud.editing" @save="vendorCrud.save" />
    <VendorFormDialog v-model="contractCrud.formOpen" kind="contract" :row="contractCrud.editing" @save="contractCrud.save" />
    <VendorFormDialog v-model="orderCrud.formOpen" kind="order" :row="orderCrud.editing" @save="orderCrud.save" />
    <ConfirmDialog v-model="vendorCrud.confirmOpen" title="Delete vendor?" :text="`${vendorCrud.target?.id} will be removed from this list.`" @confirm="vendorCrud.remove()" />
    <ConfirmDialog v-model="contractCrud.confirmOpen" title="Delete contract?" :text="`${contractCrud.target?.id} will be removed from this list.`" @confirm="contractCrud.remove()" />
    <ConfirmDialog v-model="orderCrud.confirmOpen" title="Delete vendor order?" :text="`${orderCrud.target?.id} will be removed from this list.`" @confirm="orderCrud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Vendor, VendorContract, VendorOrder } from '@/types'
import { vendorContracts, vendorOrders, vendors } from '@/mock/vendors'
import { type Crud, useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DataTable from '@/components/common/DataTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import VendorFormDialog from './components/VendorFormDialog.vue'
import { vendorColumns, vendorContractColumns, vendorContractLink, vendorLink, vendorOrderColumns, vendorOrderLink } from './config'

type Tab = 'vendors' | 'contracts' | 'orders'
const ADD: Record<Tab, string> = { vendors: 'Add vendor', contracts: 'New vendor contract', orders: 'New vendor order' }

const route = useRoute()
const tab = ref<Tab>(route.query.tab === 'contracts' || route.query.tab === 'orders' ? route.query.tab : 'vendors')

const vendorCrud = useCrud<Vendor>(vendors, { prefix: 'VND-' })
const contractCrud = useCrud<VendorContract>(vendorContracts, { prefix: 'VC-' })
const orderCrud = useCrud<VendorOrder>(vendorOrders, { prefix: 'VPO-' })
const crud = computed<Crud>(() => ({ vendors: vendorCrud, contracts: contractCrud, orders: orderCrud })[tab.value])
</script>
