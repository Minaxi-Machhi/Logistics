<template>
  <v-container fluid class="page">
    <PageHeader toolbar title="Invoices" subtitle="Customer billing and collections.">
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" @click="crud.openNew()">New invoice</v-btn>
    </PageHeader>
    <DataTable :columns="invoiceColumns" :items="invoices" search-label="Search invoices" :link-to="invoiceLink" @edit="crud.openEdit" @remove="crud.askRemove" />
    <InvoiceFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete invoice?" :text="`${crud.target?.id} will be removed from this list.`" @confirm="crud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import type { Invoice } from '@/types'
import { invoices, withVat } from '@/mock/invoices'
import { useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DataTable from '@/components/common/DataTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import InvoiceFormDialog from './components/InvoiceFormDialog.vue'
import { invoiceColumns, invoiceLink } from './config'

const crud = useCrud<Invoice>(invoices, {
  prefix: 'INV-26-',
  build: (v, id) => withVat({ ...(v as Omit<Invoice, 'vat' | 'total'>), id }),
  update: (cur, v) => withVat({ ...cur, ...v } as Invoice),
})
</script>
