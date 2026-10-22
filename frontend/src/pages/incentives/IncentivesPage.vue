<template>
  <v-container fluid class="page">
    <PageHeader title="Incentives" subtitle="Driver incentives for on-time delivery and fuel saving.">
      <template #left><ListFilterBar :list="list" /></template>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" height="32" @click="crud.openNew()">Calculate incentives</v-btn>
    </PageHeader>

    <ListTable :list="list" :columns="incentiveColumns" storage-key="incentives" :link-to="incentiveLink" empty-text="Calculate incentives to see them here.">
      <template #actions="{ item }">
        <RowActionButton icon="mdi-pencil-outline" label="Edit incentive" @click="crud.openEdit(item)" />
        <RowActionButton tone="error" icon="mdi-delete-outline" label="Delete incentive" @click="crud.askRemove(item)" />
      </template>
    </ListTable>

    <IncentiveFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete incentive?" :text="`${crud.target?.id} will be removed from this list.`" @confirm="crud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { Incentive } from '@/types'
import { useCrud } from '@/composables/useCrud'
import { useList } from '@/composables/useList'
import { incentives } from '@/mock/invoices'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ListFilterBar from '@/components/common/ListFilterBar.vue'
import ListTable from '@/components/common/ListTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import RowActionButton from '@/components/common/RowActionButton.vue'
import IncentiveFormDialog from './components/IncentiveFormDialog.vue'
import { incentiveColumns, incentiveLink, incentiveListConfig } from './config'

const list = useList(() => incentives, incentiveListConfig)
onMounted(() => list.restore())

const crud = useCrud<Incentive>(incentives, { prefix: 'INC-' })
</script>
