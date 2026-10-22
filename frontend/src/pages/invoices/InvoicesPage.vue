<template>
  <v-container fluid class="page">
    <PageHeader title="Invoices" subtitle="Customer billing and collections.">
      <template #left><ListFilterBar :list="list" /></template>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" height="32" @click="crud.openNew()">New invoice</v-btn>
    </PageHeader>

    <ListTable :list="list" :columns="invoiceColumns" storage-key="invoices" :link-to="invoiceLink" empty-text="Generate an invoice from a ready order, or create one here.">
      <template #actions="{ item }">
        <RowActionButton icon="mdi-pencil-outline" label="Edit invoice" @click="crud.openEdit(item)" />
        <RowActionButton tone="error" icon="mdi-delete-outline" label="Delete invoice" @click="crud.askRemove(item)" />
      </template>
    </ListTable>

    <InvoiceFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete invoice?" :text="`${crud.target?.id} will be removed from this list.`" @confirm="crud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { Invoice } from '@/types'
import { useCrud } from '@/composables/useCrud'
import { useList } from '@/composables/useList'
import { invoices, withVat } from '@/mock/invoices'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ListFilterBar from '@/components/common/ListFilterBar.vue'
import ListTable from '@/components/common/ListTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import RowActionButton from '@/components/common/RowActionButton.vue'
import InvoiceFormDialog from './components/InvoiceFormDialog.vue'
import { invoiceColumns, invoiceLink, invoiceListConfig } from './config'

const list = useList(() => invoices, invoiceListConfig)
onMounted(() => list.restore())

const crud = useCrud<Invoice>(invoices, {
  prefix: 'INV-26-',
  build: (v, id) => withVat({ ...(v as Omit<Invoice, 'vat' | 'total'>), id }),
  update: (cur, v) => withVat({ ...cur, ...v } as Invoice),
})
</script>
