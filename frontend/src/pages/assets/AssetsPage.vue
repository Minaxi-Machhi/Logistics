<template>
  <v-container fluid class="page">
    <PageHeader toolbar title="Assets" subtitle="Drivers and vehicles.">
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" @click="(tab === 'drivers' ? driverCrud : vehicleCrud).openNew()">{{ tab === 'drivers' ? 'Add driver' : 'Add vehicle' }}</v-btn>
    </PageHeader>

    <v-tabs v-model="tab" color="primary" class="mb-2">
      <v-tab value="drivers" class="text-none">Drivers <v-chip size="x-small" label class="ml-2 font-mono">{{ drivers.length }}</v-chip></v-tab>
      <v-tab value="vehicles" class="text-none">Vehicles <v-chip size="x-small" label class="ml-2 font-mono">{{ vehicles.length }}</v-chip></v-tab>
    </v-tabs>

    <DataTable v-if="tab === 'drivers'" :columns="driverColumns" :items="drivers" search-label="Search drivers" :link-to="driverLink" @edit="driverCrud.openEdit" @remove="driverCrud.askRemove" />
    <DataTable v-else :columns="vehicleColumns" :items="vehicles" search-label="Search vehicles" :link-to="vehicleLink" @edit="vehicleCrud.openEdit" @remove="vehicleCrud.askRemove" />

    <AssetFormDialog v-model="driverCrud.formOpen" kind="driver" :row="driverCrud.editing" @save="driverCrud.save" />
    <AssetFormDialog v-model="vehicleCrud.formOpen" kind="vehicle" :row="vehicleCrud.editing" @save="vehicleCrud.save" />
    <ConfirmDialog v-model="driverCrud.confirmOpen" title="Delete driver?" :text="`${driverCrud.target?.id} will be removed from this list.`" @confirm="driverCrud.remove()" />
    <ConfirmDialog v-model="vehicleCrud.confirmOpen" title="Delete vehicle?" :text="`${vehicleCrud.target?.id} will be removed from this list.`" @confirm="vehicleCrud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Driver, Vehicle } from '@/types'
import { drivers, vehicles } from '@/mock/assets'
import { useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DataTable from '@/components/common/DataTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import AssetFormDialog from './components/AssetFormDialog.vue'
import { driverColumns, driverLink, vehicleColumns, vehicleLink } from './config'

const route = useRoute()
const tab = ref(route.query.tab === 'vehicles' ? 'vehicles' : 'drivers')
const driverCrud = useCrud<Driver>(drivers, { prefix: 'DRV-' })
const vehicleCrud = useCrud<Vehicle>(vehicles, { prefix: '' })
</script>
