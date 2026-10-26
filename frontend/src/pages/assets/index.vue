<template>
  <v-container fluid class="page fill">
    <PageHeader title="Assets" subtitle="Drivers and vehicles.">
      <template #left><ListFilterBar :list="active" /></template>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg text-none font-weight-bold" height="32" @click="(tab === 'drivers' ? driverCrud : vehicleCrud).openNew()">{{ tab === 'drivers' ? 'Add driver' : 'Add vehicle' }}</v-btn>
    </PageHeader>

    <v-tabs v-model="tab" color="primary" class="mb-2">
      <v-tab value="drivers" class="text-none">Drivers <v-chip size="x-small" label class="ml-2 font-mono">{{ drivers.length }}</v-chip></v-tab>
      <v-tab value="vehicles" class="text-none">Vehicles <v-chip size="x-small" label class="ml-2 font-mono">{{ vehicles.length }}</v-chip></v-tab>
    </v-tabs>

    <ListTable v-if="tab === 'drivers'" :list="driverList" :columns="driverColumns" storage-key="drivers" row-click="event" empty-text="Add the first driver." @row-click="showDriver">
      <template #actions="{ item }">
        <RowActionButton icon="mdi-pencil-outline" label="Edit driver" @click="driverCrud.openEdit(item)" />
        <RowActionButton tone="error" icon="mdi-delete-outline" label="Delete driver" @click="driverCrud.askRemove(item)" />
      </template>
    </ListTable>
    <ListTable v-else :list="vehicleList" :columns="vehicleColumns" storage-key="vehicles" row-click="event" empty-text="Add the first vehicle." @row-click="showVehicle">
      <template #actions="{ item }">
        <RowActionButton icon="mdi-pencil-outline" label="Edit vehicle" @click="vehicleCrud.openEdit(item)" />
        <RowActionButton tone="error" icon="mdi-delete-outline" label="Delete vehicle" @click="vehicleCrud.askRemove(item)" />
      </template>
    </ListTable>

    <DriverDrawer v-model="driverDrawer" :driver="selectedDriver" />
    <VehicleDrawer v-model="vehicleDrawer" :vehicle="selectedVehicle" />
    <AssetFormDialog v-model="driverCrud.formOpen" kind="driver" :row="driverCrud.editing" @save="driverCrud.save" />
    <AssetFormDialog v-model="vehicleCrud.formOpen" kind="vehicle" :row="vehicleCrud.editing" @save="vehicleCrud.save" />
    <ConfirmDialog v-model="driverCrud.confirmOpen" title="Delete driver?" :text="`${driverCrud.target?.id} will be removed from this list.`" @confirm="driverCrud.remove()" />
    <ConfirmDialog v-model="vehicleCrud.confirmOpen" title="Delete vehicle?" :text="`${vehicleCrud.target?.id} will be removed from this list.`" @confirm="vehicleCrud.remove()" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Driver, Vehicle } from '@/types'
import { useCrud } from '@/composables/useCrud'
import { useList } from '@/composables/useList'
import { drivers, vehicles } from '@/mock/assets'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ListFilterBar from '@/components/common/ListFilterBar.vue'
import ListTable from '@/components/common/ListTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import RowActionButton from '@/components/common/RowActionButton.vue'
import AssetFormDialog from './components/AssetFormDialog.vue'
import DriverDrawer from './components/DriverDrawer.vue'
import VehicleDrawer from './components/VehicleDrawer.vue'
import { driverColumns, driverListConfig, vehicleColumns, vehicleListConfig } from './config'

const route = useRoute()
const tab = ref(route.query.tab === 'vehicles' ? 'vehicles' : 'drivers')

const driverList = useList(() => drivers, driverListConfig)
const vehicleList = useList(() => vehicles, vehicleListConfig)
const active = computed(() => (tab.value === 'drivers' ? driverList : vehicleList))
onMounted(() => { driverList.restore(); vehicleList.restore() })

// Row click opens a side drawer with the full details.
const driverDrawer = ref(false)
const vehicleDrawer = ref(false)
const selectedDriver = ref<Driver | null>(null)
const selectedVehicle = ref<Vehicle | null>(null)

function showDriver (row: Driver) {
  selectedDriver.value = row
  driverDrawer.value = true
}

function showVehicle (row: Vehicle) {
  selectedVehicle.value = row
  vehicleDrawer.value = true
}

const driverCrud = useCrud<Driver>(drivers, { prefix: 'DRV-' })
const vehicleCrud = useCrud<Vehicle>(vehicles, { prefix: '' })
</script>
