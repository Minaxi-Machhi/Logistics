<template>
  <RecordDetail v-if="record" :title="record.id" :subtitle="subtitle" :status="record.status" :back-to="`/app/customers?tab=${kind}s`" :sections="sections">
    <template #actions>
      <v-btn variant="outlined" prepend-icon="mdi-pencil-outline" class="rounded-lg text-none" @click="crud.openEdit(record)">Edit</v-btn>
      <v-btn variant="outlined" color="error" prepend-icon="mdi-delete-outline" class="rounded-lg text-none" @click="crud.askRemove(record)">Delete</v-btn>
    </template>
    <template v-if="kind === 'customer'">
      <RelatedTable title="Contracts" :columns="contractColumns" :items="relatedContracts" :link-to="contractLink" empty="No contracts yet." />
      <RelatedTable title="Orders" :columns="orderColumns" :items="relatedOrders" :link-to="orderLink" empty="No orders yet." />
      <RelatedTable title="Invoices" :columns="invoiceColumns" :items="relatedInvoices" :link-to="invoiceLink" empty="No invoices yet." />
    </template>
    <CustomerFormDialog v-model="crud.formOpen" :kind="kind" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" :title="`Delete ${kind}?`" :text="`${record.id} will be removed.`" @confirm="onDelete" />
  </RecordDetail>
  <NotFound v-else :back-to="`/app/customers?tab=${kind}s`" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Column, Customer, CustomerContract, DetailSection } from '@/types'
import { customerContracts, customers } from '@/mock/customers'
import { invoices } from '@/mock/invoices'
import { orders } from '@/mock/orders'
import { type Crud, useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import NotFound from '@/components/common/NotFound.vue'
import RecordDetail from '@/components/common/RecordDetail.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { invoiceColumns, invoiceLink } from '../invoices/config'
import { orderLink } from '../orders/config'
import CustomerFormDialog from './components/CustomerFormDialog.vue'
import { contractColumns, contractLink } from './config'

const route = useRoute()
const router = useRouter()
const kind = computed<'customer' | 'contract'>(() => route.meta.kind === 'contract' ? 'contract' : 'customer')

const customerCrud = useCrud<Customer>(customers, { prefix: '' })
const contractCrud = useCrud<CustomerContract>(customerContracts, { prefix: '' })
const crud = computed<Crud>(() => kind.value === 'customer' ? customerCrud : contractCrud)

const record = computed<Customer | CustomerContract | undefined>(() =>
  kind.value === 'customer' ? customers.find(c => c.id === route.params.id) : customerContracts.find(c => c.id === route.params.id))
const customerName = computed(() => kind.value === 'customer' ? (record.value as Customer | undefined)?.name : (record.value as CustomerContract | undefined)?.customer)
const subtitle = computed(() => customerName.value ?? '')

const orderColumns: Column[] = [
  { key: 'id', title: 'Order', type: 'mono' }, { key: 'jobType', title: 'Job type' }, { key: 'orderDate', title: 'Order date' },
  { key: 'rate', title: 'Sell rate', type: 'money' }, { key: 'status', title: 'Status', type: 'status' },
]
const relatedContracts = computed(() => customerContracts.filter(c => c.customer === customerName.value))
const relatedOrders = computed(() => orders.filter(o => o.customer === customerName.value))
const relatedInvoices = computed(() => invoices.filter(i => i.customer === customerName.value))

const sections = computed<DetailSection[]>(() => {
  if (kind.value === 'customer') {
    const c = record.value as Customer
    return [
      { title: 'Customer', items: [{ label: 'Name', value: c.name }, { label: 'City', value: c.city }, { label: 'Contact', value: c.contact }] },
      { title: 'Credit', items: [{ label: 'Credit limit', value: c.creditLimit, type: 'money' }, { label: 'Outstanding', value: c.outstanding, type: 'money' }] },
    ]
  }
  const c = record.value as CustomerContract
  return [
    { title: 'Contract', items: [{ label: 'Customer', value: c.customer }, { label: 'Lane / scope', value: c.scope }, { label: 'Rate basis', value: c.basis }] },
    { title: 'Validity', items: [{ label: 'Start', value: c.start }, { label: 'End', value: c.end }] },
  ]
})

function onDelete () {
  if (crud.value.remove()) router.replace(`/app/customers?tab=${kind.value}s`)
}
</script>
