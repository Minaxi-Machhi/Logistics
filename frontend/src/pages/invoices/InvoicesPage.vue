<template>
  <v-container fluid class="page fill">
    <PageHeader title="Invoices" subtitle="Customer billing and collections.">
      <template #left><ListFilterBar :list="list" /></template>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" height="32" @click="createOpen = true">New invoice</v-btn>
    </PageHeader>

    <ListTable :list="list" :columns="invoiceColumns" storage-key="invoices" :link-to="invoiceLink" empty-text="Create an invoice from orders that are Ready for invoice.">
      <template #item.orders="{ item }">
        <span class="font-mono">{{ item.orders[0] }}</span><span v-if="item.orders.length > 1" class="more">+{{ item.orders.length - 1 }}</span>
      </template>
      <template #actions="{ item }">
        <RowActionButton v-if="NEXT_STEP[item.status]" :icon="NEXT_STEP[item.status].icon" :label="NEXT_STEP[item.status].label" @click="flow.ask(item)" />
        <RowActionButton v-if="EDITABLE_INVOICE.includes(item.status)" icon="mdi-pencil-outline" label="Edit dates" @click="crud.openEdit(item)" />
        <RowActionButton v-if="DELETABLE_INVOICE.includes(item.status)" tone="error" icon="mdi-delete-outline" label="Delete draft" @click="crud.askRemove(item)" />
      </template>
    </ListTable>

    <InvoiceCreateDialog v-model="createOpen" />
    <InvoiceFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog
      :model-value="!!flow.target"
      :title="`${flow.target ? NEXT_STEP[flow.target.status]?.label : ''}?`"
      :text="flow.target ? `${flow.target.id}: ${NEXT_STEP[flow.target.status]?.text}` : ''"
      :confirm-label="flow.target ? NEXT_STEP[flow.target.status]?.label : ''"
      confirm-color="primary"
      @update:model-value="v => { if (!v) flow.target = null }"
      @confirm="flow.confirm()"
    />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete draft?" :text="`${crud.target?.id} will be removed and its orders go back to Ready for invoice.`" @confirm="onDelete" />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Invoice } from '@/types'
import { useCrud } from '@/composables/useCrud'
import { useInvoiceFlow } from '@/composables/useInvoiceFlow'
import { useList } from '@/composables/useList'
import { DELETABLE_INVOICE, EDITABLE_INVOICE, NEXT_STEP, releaseOrders } from '@/mock/invoiceOps'
import { invoices } from '@/mock/invoices'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ListFilterBar from '@/components/common/ListFilterBar.vue'
import ListTable from '@/components/common/ListTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import RowActionButton from '@/components/common/RowActionButton.vue'
import InvoiceCreateDialog from './components/InvoiceCreateDialog.vue'
import InvoiceFormDialog from './components/InvoiceFormDialog.vue'
import { invoiceColumns, invoiceLink, invoiceListConfig } from './config'

const list = useList(() => invoices, invoiceListConfig)
onMounted(() => list.restore())

const createOpen = ref(false)
const flow = useInvoiceFlow()
const crud = useCrud<Invoice>(invoices, { prefix: 'INV-26-' })

function onDelete () {
  if (crud.target) releaseOrders(crud.target)
  crud.remove()
}
</script>

<style scoped>
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
.more { margin-left: 6px; padding: 0 6px; border-radius: 9px; background: rgba(var(--v-theme-on-surface), 0.08); font-size: 11.5px; }
</style>
