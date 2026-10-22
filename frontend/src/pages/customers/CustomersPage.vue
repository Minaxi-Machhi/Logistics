<template>
  <v-container fluid class="page">
    <PageHeader toolbar title="Customers" subtitle="Customer master and rate contracts.">
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" @click="(tab === 'customers' ? customerCrud : contractCrud).openNew()">
        {{ tab === 'customers' ? 'Add customer' : 'New contract' }}
      </v-btn>
    </PageHeader>

    <v-tabs v-model="tab" color="primary" class="mb-2">
      <v-tab value="customers" class="text-none">Customers <v-chip size="x-small" label class="ml-2 font-mono">{{ customers.length }}</v-chip></v-tab>
      <v-tab value="contracts" class="text-none">Customer contracts <v-chip size="x-small" label class="ml-2 font-mono">{{ customerContracts.length }}</v-chip></v-tab>
    </v-tabs>

    <DataTable v-if="tab === 'customers'" :columns="customerColumns" :items="customers" search-label="Search customers" :link-to="customerLink" @edit="customerCrud.openEdit" @remove="customerCrud.askRemove" />
    <DataTable v-else :columns="contractColumns" :items="customerContracts" search-label="Search contracts" :link-to="contractLink" @edit="contractCrud.openEdit" @remove="contractCrud.askRemove" />

    <CustomerFormDialog v-model="customerCrud.formOpen" kind="customer" :row="customerCrud.editing" @save="customerCrud.save" />
    <CustomerFormDialog v-model="contractCrud.formOpen" kind="contract" :row="contractCrud.editing" @save="contractCrud.save" />
    <ConfirmDialog v-model="customerCrud.confirmOpen" title="Delete customer?" :text="`${customerCrud.target?.id} will be removed from this list.`" @confirm="customerCrud.remove()" />
    <ConfirmDialog v-model="contractCrud.confirmOpen" title="Delete contract?" :text="`${contractCrud.target?.id} will be removed from this list.`" @confirm="contractCrud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Customer, CustomerContract } from '@/types'
import { customerContracts, customers } from '@/mock/customers'
import { useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DataTable from '@/components/common/DataTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import CustomerFormDialog from './components/CustomerFormDialog.vue'
import { contractColumns, contractLink, customerColumns, customerLink } from './config'

const route = useRoute()
const tab = ref(route.query.tab === 'contracts' ? 'contracts' : 'customers')
const customerCrud = useCrud<Customer>(customers, { prefix: 'CUS-' })
const contractCrud = useCrud<CustomerContract>(customerContracts, { prefix: 'CC-' })
</script>
