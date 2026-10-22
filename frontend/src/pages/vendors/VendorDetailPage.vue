<template>
  <RecordDetail v-if="record" :title="record.id" :subtitle="subtitle" :status="record.status" :back-to="`/app/vendors?tab=${TAB[kind]}`" :sections="sections">
    <template #actions>
      <v-btn variant="outlined" prepend-icon="mdi-pencil-outline" class="rounded-lg text-none" @click="crud.openEdit(record)">Edit</v-btn>
      <v-btn variant="outlined" color="error" prepend-icon="mdi-delete-outline" class="rounded-lg text-none" @click="crud.askRemove(record)">Delete</v-btn>
    </template>
    <template v-if="kind === 'vendor'">
      <RelatedTable title="Contracts" :columns="vendorContractColumns" :items="relatedContracts" :link-to="vendorContractLink" empty="No contracts yet." />
      <RelatedTable title="Vendor orders" :columns="vendorOrderColumns" :items="relatedOrders" :link-to="vendorOrderLink" empty="No vendor orders yet." />
    </template>
    <RelatedTable v-if="kind === 'order'" title="Linked customer order" :columns="orderColumns" :items="linkedOrders" :link-to="orderLink" empty="Order not found in the list." />
    <VendorFormDialog v-model="crud.formOpen" :kind="kind" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete record?" :text="`${record.id} will be removed.`" @confirm="onDelete" />
  </RecordDetail>
  <NotFound v-else :back-to="`/app/vendors?tab=${TAB[kind]}`" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Column, DetailSection, Vendor, VendorContract, VendorOrder } from '@/types'
import { orders } from '@/mock/orders'
import { vendorContracts, vendorOrders, vendors } from '@/mock/vendors'
import { type Crud, useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import NotFound from '@/components/common/NotFound.vue'
import RecordDetail from '@/components/common/RecordDetail.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { orderLink } from '../orders/config'
import VendorFormDialog, { type VendorKind } from './components/VendorFormDialog.vue'
import { vendorContractColumns, vendorContractLink, vendorOrderColumns, vendorOrderLink } from './config'

const TAB: Record<VendorKind, string> = { vendor: 'vendors', contract: 'contracts', order: 'orders' }

const route = useRoute()
const router = useRouter()
const kind = computed<VendorKind>(() => (route.meta.kind as VendorKind | undefined) ?? 'vendor')

const vendorCrud = useCrud<Vendor>(vendors, { prefix: '' })
const contractCrud = useCrud<VendorContract>(vendorContracts, { prefix: '' })
const orderCrud = useCrud<VendorOrder>(vendorOrders, { prefix: '' })
const crud = computed<Crud>(() => ({ vendor: vendorCrud, contract: contractCrud, order: orderCrud })[kind.value])

const record = computed<Vendor | VendorContract | VendorOrder | undefined>(() => {
  const id = route.params.id
  if (kind.value === 'vendor') return vendors.find(v => v.id === id)
  if (kind.value === 'contract') return vendorContracts.find(v => v.id === id)
  return vendorOrders.find(v => v.id === id)
})
const vendorName = computed(() => kind.value === 'vendor' ? (record.value as Vendor | undefined)?.name : (record.value as VendorContract | VendorOrder | undefined)?.vendor)
const subtitle = computed(() => vendorName.value ?? '')

const orderColumns: Column[] = [
  { key: 'id', title: 'Order', type: 'mono' }, { key: 'customer', title: 'Customer' }, { key: 'jobType', title: 'Job type' }, { key: 'status', title: 'Status', type: 'status' },
]
const relatedContracts = computed(() => vendorContracts.filter(c => c.vendor === vendorName.value))
const relatedOrders = computed(() => vendorOrders.filter(o => o.vendor === vendorName.value))
const linkedOrders = computed(() => orders.filter(o => o.id === (record.value as VendorOrder | undefined)?.order))

const sections = computed<DetailSection[]>(() => {
  if (kind.value === 'vendor') {
    const v = record.value as Vendor
    return [
      { title: 'Vendor', items: [{ label: 'Name', value: v.name }, { label: 'Type', value: v.type }, { label: 'City', value: v.city }] },
      { title: 'Capacity', items: [{ label: 'Fleet size', value: v.fleet }, { label: 'Rating', value: v.rating }] },
    ]
  }
  if (kind.value === 'contract') {
    const c = record.value as VendorContract
    return [
      { title: 'Contract', items: [{ label: 'Vendor', value: c.vendor }, { label: 'Lane', value: c.lane }, { label: 'Agreed rate', value: c.rate, type: 'money' }] },
      { title: 'Validity', items: [{ label: 'Valid from', value: c.from }, { label: 'Valid to', value: c.to }] },
    ]
  }
  const o = record.value as VendorOrder
  return [
    { title: 'Purchase order', items: [{ label: 'Vendor', value: o.vendor }, { label: 'Linked order', value: o.order, type: 'mono' }, { label: 'Route', value: o.route }] },
    { title: 'Cost', items: [{ label: 'Vehicle', value: o.vehicle }, { label: 'Cost', value: o.cost, type: 'money' }] },
  ]
})

function onDelete () {
  if (crud.value.remove()) router.replace(`/app/vendors?tab=${TAB[kind.value]}`)
}
</script>
