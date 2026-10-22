<template>
  <v-container fluid class="page">
    <PageHeader toolbar title="Trips" subtitle="Dispatch, track and close trips against orders.">
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" @click="crud.openNew()">New trip</v-btn>
    </PageHeader>
    <DataTable :columns="tripColumns" :items="trips" search-label="Search trips" :link-to="tripLink" @edit="crud.openEdit" @remove="crud.askRemove" />
    <TripFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete trip?" :text="`${crud.target?.id} will be removed from this list.`" @confirm="crud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import type { Trip } from '@/types'
import { trips } from '@/mock/trips'
import { useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DataTable from '@/components/common/DataTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import TripFormDialog from './components/TripFormDialog.vue'
import { tripColumns, tripLink } from './config'

const crud = useCrud<Trip>(trips, { prefix: 'TRP-' })
</script>
