<template>
  <v-container fluid class="page">
    <PageHeader toolbar title="Incentives" subtitle="Driver incentives for on-time delivery and fuel saving.">
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" @click="crud.openNew()">Calculate incentives</v-btn>
    </PageHeader>
    <DataTable :columns="incentiveColumns" :items="incentives" search-label="Search incentives" :link-to="incentiveLink" @edit="crud.openEdit" @remove="crud.askRemove" />
    <IncentiveFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete incentive?" :text="`${crud.target?.id} will be removed from this list.`" @confirm="crud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import type { Incentive } from '@/types'
import { incentives } from '@/mock/invoices'
import { useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DataTable from '@/components/common/DataTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import IncentiveFormDialog from './components/IncentiveFormDialog.vue'
import { incentiveColumns, incentiveLink } from './config'

const crud = useCrud<Incentive>(incentives, { prefix: 'INC-' })
</script>
