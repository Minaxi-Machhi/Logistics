<template>
  <v-container fluid class="page">
    <PageHeader title="Customers" subtitle="Customer master and rate contracts.">
      <template #left><ListFilterBar :list="active" /></template>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" height="32" @click="(tab === 'customers' ? customerCrud : contractCrud).openNew()">
        {{ tab === 'customers' ? 'Add customer' : 'New contract' }}
      </v-btn>
    </PageHeader>

    <v-tabs v-model="tab" color="primary" class="mb-2">
      <v-tab value="customers" class="text-none">Customers <v-chip size="x-small" label class="ml-2 font-mono">{{ customers.length }}</v-chip></v-tab>
      <v-tab value="contracts" class="text-none">Customer contracts <v-chip size="x-small" label class="ml-2 font-mono">{{ customerContracts.length }}</v-chip></v-tab>
    </v-tabs>

    <ListTable v-if="tab === 'customers'" :list="customerList" :columns="customerColumns" storage-key="customers" :link-to="customerLink" empty-text="Add the first customer to get started.">
      <template #actions="{ item }">
        <RowActionButton icon="mdi-pencil-outline" label="Edit customer" @click="customerCrud.openEdit(item)" />
        <RowActionButton tone="error" icon="mdi-delete-outline" label="Delete customer" @click="customerCrud.askRemove(item)" />
      </template>
    </ListTable>
    <ListTable v-else :list="contractList" :columns="contractColumns" storage-key="customer-contracts" :link-to="contractLink" empty-text="No contracts yet.">
      <template #actions="{ item }">
        <RowActionButton icon="mdi-pencil-outline" label="Edit contract" @click="contractCrud.openEdit(item)" />
        <RowActionButton tone="error" icon="mdi-delete-outline" label="Delete contract" @click="contractCrud.askRemove(item)" />
      </template>
    </ListTable>

    <CustomerFormDialog v-model="customerCrud.formOpen" kind="customer" :row="customerCrud.editing" @save="customerCrud.save" />
    <CustomerFormDialog v-model="contractCrud.formOpen" kind="contract" :row="contractCrud.editing" @save="contractCrud.save" />
    <ConfirmDialog v-model="customerCrud.confirmOpen" title="Delete customer?" :text="`${customerCrud.target?.id} will be removed from this list.`" @confirm="customerCrud.remove()" />
    <ConfirmDialog v-model="contractCrud.confirmOpen" title="Delete contract?" :text="`${contractCrud.target?.id} will be removed from this list.`" @confirm="contractCrud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Customer, CustomerContract } from '@/types'
import { useCrud } from '@/composables/useCrud'
import { useList } from '@/composables/useList'
import { customerContracts, customers } from '@/mock/customers'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ListFilterBar from '@/components/common/ListFilterBar.vue'
import ListTable from '@/components/common/ListTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import RowActionButton from '@/components/common/RowActionButton.vue'
import CustomerFormDialog from './components/CustomerFormDialog.vue'
import { contractColumns, contractLink, contractListConfig, customerColumns, customerLink, customerListConfig } from './config'

const route = useRoute()
const tab = ref(route.query.tab === 'contracts' ? 'contracts' : 'customers')

const customerList = useList(() => customers, customerListConfig)
const contractList = useList(() => customerContracts, contractListConfig)
const active = computed(() => (tab.value === 'customers' ? customerList : contractList))
onMounted(() => { customerList.restore(); contractList.restore() })

const customerCrud = useCrud<Customer>(customers, { prefix: 'CUS-' })
const contractCrud = useCrud<CustomerContract>(customerContracts, { prefix: 'CC-' })
</script>
