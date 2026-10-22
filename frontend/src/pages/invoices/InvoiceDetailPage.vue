<template>
  <RecordDetail v-if="invoice" :title="invoice.id" :subtitle="invoice.customer" :status="invoice.status" back-to="/app/invoices" :sections="sections">
    <template #actions>
      <v-btn variant="outlined" prepend-icon="mdi-pencil-outline" class="rounded-lg text-none" @click="crud.openEdit(invoice)">Edit</v-btn>
      <v-btn variant="outlined" color="error" prepend-icon="mdi-delete-outline" class="rounded-lg text-none" @click="crud.askRemove(invoice)">Delete</v-btn>
    </template>
    <RelatedTable title="Order" :columns="orderColumns" :items="linkedOrders" :link-to="orderLink" empty="Order not found in the list." />
    <InvoiceFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete invoice?" :text="`${invoice.id} will be removed.`" @confirm="onDelete" />
  </RecordDetail>
  <NotFound v-else back-to="/app/invoices" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Column, DetailSection, Invoice } from '@/types'
import { invoices, withVat } from '@/mock/invoices'
import { orders } from '@/mock/orders'
import { useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import NotFound from '@/components/common/NotFound.vue'
import RecordDetail from '@/components/common/RecordDetail.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { orderLink } from '../orders/config'
import InvoiceFormDialog from './components/InvoiceFormDialog.vue'

const route = useRoute()
const router = useRouter()
const invoice = computed(() => invoices.find(i => i.id === route.params.id))
const crud = useCrud<Invoice>(invoices, { prefix: '', update: (cur, v) => withVat({ ...cur, ...v } as Invoice) })

const orderColumns: Column[] = [
  { key: 'id', title: 'Order', type: 'mono' }, { key: 'jobType', title: 'Job type' }, { key: 'route', title: 'Route' }, { key: 'status', title: 'Status', type: 'status' },
]
const linkedOrders = computed(() => orders.filter(o => o.id === invoice.value?.order).map(o => ({ ...o, route: `${o.origin} → ${o.destination}` })))

const sections = computed<DetailSection[]>(() => {
  const i = invoice.value!
  return [
    { title: 'Invoice', items: [{ label: 'Customer', value: i.customer }, { label: 'Order', value: i.order, type: 'mono' }, { label: 'Invoice date', value: i.date }, { label: 'Due date', value: i.due }] },
    { title: 'Amounts', items: [{ label: 'Amount', value: i.amount, type: 'money' }, { label: 'VAT (5%)', value: i.vat, type: 'money' }, { label: 'Total', value: i.total, type: 'money' }] },
  ]
})

function onDelete () {
  if (crud.remove()) router.replace('/app/invoices')
}
</script>
