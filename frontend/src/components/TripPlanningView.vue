<template>
  <v-container fluid class="px-4 py-0">
    <!-- Header Area -->
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px;">
      <div>
        <h2 class="text-h6 font-weight-bold text-slate-800 d-flex align-center">
          <v-icon color="primary" class="mr-2" size="20">mdi-steering</v-icon>
          Trip Planning & Dispatch
        </h2>
        <p class="text-caption text-medium-emphasis mb-0">Consolidate orders, match vehicle capacity, assign drivers, and dispatch routes</p>
      </div>
      <div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="default"
          class="rounded-lg font-weight-bold"
          @click="openCreateDialog"
        >
          Create Trip
        </v-btn>
      </div>
    </div>

    <!-- Trip Stats Strip (Interactive Click Filters) -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 16px;">
      <v-card 
        class="glass-card pa-4 rounded-xl cursor-pointer text-center" 
        :class="{ 'active-stat-card': activeStatusFilter === 'All' }"
        elevation="1"
        @click="activeStatusFilter = 'All'"
      >
        <v-avatar color="primary" variant="tonal" class="mb-2" size="40">
          <v-icon size="20">mdi-steering</v-icon>
        </v-avatar>
        <div class="text-h5 font-weight-bold text-primary">{{ store.trips.length }}</div>
        <div class="text-caption font-weight-bold text-medium-emphasis">Total Trips</div>
      </v-card>
      <v-card 
        class="glass-card pa-4 rounded-xl cursor-pointer text-center" 
        :class="{ 'active-stat-card': activeStatusFilter === 'Scheduled' }"
        elevation="1"
        @click="activeStatusFilter = 'Scheduled'"
      >
        <v-avatar color="grey-darken-1" variant="tonal" class="mb-2" size="40">
          <v-icon size="20">mdi-calendar-clock</v-icon>
        </v-avatar>
        <div class="text-h5 font-weight-bold text-slate-800">{{ store.trips.filter(t => t.status === 'Scheduled').length }}</div>
        <div class="text-caption font-weight-bold text-medium-emphasis">Scheduled</div>
      </v-card>
      <v-card 
        class="glass-card pa-4 rounded-xl cursor-pointer text-center" 
        :class="{ 'active-stat-card': activeStatusFilter === 'Active' }"
        elevation="1"
        @click="activeStatusFilter = 'Active'"
      >
        <v-avatar color="warning" variant="tonal" class="mb-2" size="40">
          <v-icon size="20" class="pulse-marker">mdi-radiobox-marked</v-icon>
        </v-avatar>
        <div class="text-h5 font-weight-bold text-warning">{{ store.trips.filter(t => t.status === 'Active').length }}</div>
        <div class="text-caption font-weight-bold text-medium-emphasis">Active Now</div>
      </v-card>
      <v-card 
        class="glass-card pa-4 rounded-xl cursor-pointer text-center" 
        :class="{ 'active-stat-card': activeStatusFilter === 'Completed' }"
        elevation="1"
        @click="activeStatusFilter = 'Completed'"
      >
        <v-avatar color="success" variant="tonal" class="mb-2" size="40">
          <v-icon size="20">mdi-check-circle-outline</v-icon>
        </v-avatar>
        <div class="text-h5 font-weight-bold text-success">{{ store.trips.filter(t => t.status === 'Completed').length }}</div>
        <div class="text-caption font-weight-bold text-medium-emphasis">Completed</div>
      </v-card>
    </div>

    <!-- Trips Filter Card -->
    <v-card class="glass-card mb-3 pa-3 rounded-lg" elevation="2">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; align-items: center;">
        <div>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search by ID, route, vehicle or driver..."
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
          ></v-text-field>
        </div>
        <div>
          <v-select
            v-model="activeStatusFilter"
            :items="statusOptions"
            label="Status Filter"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
          ></v-select>
        </div>
      </div>
    </v-card>

    <!-- Trips Table -->
    <v-card class="glass-card rounded-lg overflow-hidden" elevation="2">
      <v-table hover density="comfortable">
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold text-left">Trip ID / Route</th>
            <th class="font-weight-bold text-left">Driver Assignment</th>
            <th class="font-weight-bold text-left">Vehicle & Plate</th>
            <th class="font-weight-bold text-left">Grouped Orders</th>
            <th class="font-weight-bold text-right">Consolidated Weight</th>
            <th class="font-weight-bold text-right">Consolidated Volume</th>
            <th class="font-weight-bold text-center">Status</th>
            <th class="font-weight-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trip in filteredTrips" :key="trip.id">
            <td class="font-weight-bold text-primary py-3">
              {{ trip.id }}
              <div class="text-caption text-slate-800 font-weight-bold mt-1 text-wrap" style="max-width: 220px;">
                {{ trip.tripName }}
              </div>
            </td>
            <td>
              <div class="d-flex align-center font-weight-bold text-slate-800 text-body-2">
                <v-icon color="primary" size="16" class="mr-1">mdi-steering</v-icon>
                {{ trip.driver.name }}
              </div>
              <div class="text-caption text-medium-emphasis mt-1">
                <v-icon size="14" class="mr-1">mdi-phone</v-icon>
                {{ trip.driver.phone }}
              </div>
            </td>
            <td>
              <div class="d-flex align-center font-weight-bold text-slate-800 text-body-2">
                <v-icon color="primary" size="16" class="mr-1">mdi-truck-delivery-outline</v-icon>
                {{ trip.vehicle.name }}
              </div>
              <div class="text-caption text-medium-emphasis mt-1">
                <span class="mr-2">Plate: <strong>{{ trip.vehicle.plateNumber }}</strong></span>
                <v-chip size="x-small" :color="trip.vehicle.tempType === 'Chilled' ? 'info' : 'grey'" variant="flat" class="font-weight-bold">
                  {{ trip.vehicle.tempType }}
                </v-chip>
              </div>
            </td>
            <td>
              <div class="font-weight-bold text-slate-700">
                {{ trip.orders.length }} Order(s)
              </div>
              <div class="text-caption text-medium-emphasis mt-1 text-wrap" style="max-width: 180px;">
                <span v-for="(order, oIdx) in trip.orders" :key="order.id">
                  {{ order.id }}{{ oIdx < trip.orders.length - 1 ? ', ' : '' }}
                </span>
              </div>
            </td>
            <td class="text-right font-weight-bold">
              {{ getTripTotalWeight(trip).toLocaleString() }} kg
            </td>
            <td class="text-right font-weight-bold">
              {{ getTripTotalVolume(trip).toFixed(1) }} cbm
            </td>
            <td class="text-center">
              <v-chip
                size="small"
                :color="getTripStatusColor(trip.status)"
                class="font-weight-bold"
              >
                {{ trip.status }}
              </v-chip>
            </td>
            <td class="text-center">
              <div v-if="trip.status === 'Scheduled'" class="d-flex justify-center">
                <v-btn
                  color="primary"
                  variant="flat"
                  size="small"
                  class="font-weight-bold rounded-lg"
                  prepend-icon="mdi-play-circle-outline"
                  @click="runSimulation(trip.id)"
                >
                  Start Simulation
                </v-btn>
              </div>
              <div v-else-if="trip.status === 'Active'" class="d-flex justify-center align-center">
                <v-btn
                  color="warning"
                  variant="tonal"
                  size="small"
                  class="font-weight-bold rounded-lg"
                  prepend-icon="mdi-radiobox-marked"
                  @click="goToControlTower"
                >
                  Track Live
                </v-btn>
              </div>
              <div v-else-if="trip.status === 'Completed'" class="d-flex justify-center align-center text-caption text-success font-weight-bold">
                <v-icon size="16" class="mr-1" color="success">mdi-check-circle-outline</v-icon>
                <span>Finished</span>
              </div>
            </td>
          </tr>
          <tr v-if="filteredTrips.length === 0">
            <td colspan="8" class="text-center py-8 text-medium-emphasis">
              <v-icon size="40" color="grey" class="mb-2">mdi-steering-off</v-icon>
              <div>No trips found matching the current search or filters.</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Create Trip Dialog -->
    <v-dialog v-model="createDialog" max-width="650px" width="100%" persistent scrollable>
      <v-card class="rounded-xl">
        <v-card-title class="text-subtitle-1 font-weight-bold text-primary px-5 py-4 d-flex justify-space-between align-center border-b bg-surface">
          <div class="d-flex align-center gap-2">
            <v-icon color="primary" size="20">mdi-steering</v-icon>
            <span>Schedule & Dispatch New Trip</span>
          </div>
          <v-btn icon="mdi-close" variant="text" density="compact" @click="createDialog = false"></v-btn>
        </v-card-title>

        <v-card-text class="pa-5" style="max-height: 70vh;">
          <v-form ref="tripForm" v-model="formValid">
            
            <!-- Trip Name -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-2">
              Route Information
            </div>
            <v-text-field
              v-model="tripName"
              label="Trip Route Name *"
              placeholder="e.g. Dubai - Sharjah Multi-Drop Chilled"
              variant="outlined"
              density="comfortable"
              color="primary"
              required
              :rules="[v => !!v || 'Route name is required']"
              class="mb-4"
              hide-details="auto"
            ></v-text-field>

            <!-- 1. Select Orders Checklist -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-2">
              1. Select Orders to Group ({{ selectedOrderIds.length }} selected)
            </div>
            
            <v-card variant="outlined" class="pa-3 mb-4 rounded-lg bg-grey-lighten-5" style="max-height: 200px; overflow-y: auto;">
              <div v-if="unassignedOrders.length === 0" class="text-center py-4 text-medium-emphasis text-caption">
                No draft or planned orders available for dispatch.
              </div>
              <v-checkbox
                v-for="order in unassignedOrders"
                :key="order.id"
                v-model="selectedOrderIds"
                :value="order.id"
                density="compact"
                hide-details
                color="primary"
              >
                <template #label>
                  <div class="d-flex w-100 justify-space-between align-center text-caption py-1">
                    <div>
                      <span class="font-weight-bold text-primary">{{ order.id }}</span> •
                      <span class="font-weight-medium text-slate-800 ml-1">{{ order.customer }}</span>
                      <span class="text-medium-emphasis"> ({{ order.stops.length }} stops)</span>
                    </div>
                    <div class="d-flex gap-2 align-center">
                      <v-chip size="x-small" :color="order.tempRequirement === 'Chilled' ? 'info' : 'grey'" variant="flat" class="font-weight-bold">
                        {{ order.tempRequirement }}
                      </v-chip>
                      <span class="font-weight-bold text-slate-700 ml-1">{{ order.totalWeight }} kg</span>
                    </div>
                  </div>
                </template>
              </v-checkbox>
            </v-card>

            <!-- Capacity Progress Bars -->
            <div v-if="selectedOrderIds.length > 0" class="mb-4">
              <!-- Using simple CSS grid to prevent purging of Vuetify column widths during compilation -->
              <div class="capacity-grid">
                <v-card class="pa-3 border rounded-lg" flat>
                  <div class="text-caption text-medium-emphasis font-weight-medium">Consolidated Weight</div>
                  <div class="text-subtitle-1 font-weight-bold mt-1" :class="weightExceeded ? 'text-error' : 'text-slate-800'">
                    {{ totalSelectedWeight.toLocaleString() }} kg
                    <span v-if="selectedVehicle" class="text-caption font-weight-normal text-medium-emphasis">
                      / {{ selectedVehicle.capacityWeight.toLocaleString() }} kg
                    </span>
                  </div>
                  <v-progress-linear
                    v-if="selectedVehicle"
                    :model-value="(totalSelectedWeight / selectedVehicle.capacityWeight) * 100"
                    :color="weightExceeded ? 'error' : 'primary'"
                    height="4"
                    rounded
                    class="mt-2"
                  ></v-progress-linear>
                </v-card>

                <v-card class="pa-3 border rounded-lg" flat>
                  <div class="text-caption text-medium-emphasis font-weight-medium">Consolidated Volume</div>
                  <div class="text-subtitle-1 font-weight-bold mt-1" :class="volumeExceeded ? 'text-error' : 'text-slate-800'">
                    {{ totalSelectedVolume.toFixed(1) }} cbm
                    <span v-if="selectedVehicle" class="text-caption font-weight-normal text-medium-emphasis">
                      / {{ selectedVehicle.capacityVolume.toFixed(1) }} cbm
                    </span>
                  </div>
                  <v-progress-linear
                    v-if="selectedVehicle"
                    :model-value="(totalSelectedVolume / selectedVehicle.capacityVolume) * 100"
                    :color="volumeExceeded ? 'error' : 'primary'"
                    height="4"
                    rounded
                    class="mt-2"
                  ></v-progress-linear>
                </v-card>
              </div>
            </div>

            <!-- 2. Assign Vehicle -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-2">
              2. Assign Fleet Asset
            </div>
            <v-select
              v-model="selectedVehicleId"
              :items="availableVehicles"
              item-title="displayName"
              item-value="id"
              label="Assign Available Vehicle *"
              variant="outlined"
              density="comfortable"
              color="primary"
              required
              :rules="[v => !!v || 'Vehicle is required']"
              class="mb-4"
              hide-details="auto"
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #append>
                    <v-chip size="x-small" :color="item.raw.tempType === 'Chilled' ? 'info' : 'grey'" class="font-weight-bold">
                      {{ item.raw.tempType }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <!-- Alerts / Warnings -->
            <div v-if="temperatureMismatch || weightExceeded || volumeExceeded" class="mb-4">
              <v-alert
                v-if="temperatureMismatch"
                type="warning"
                variant="tonal"
                density="compact"
                class="mb-2 text-caption"
                icon="mdi-alert-circle-outline"
              >
                <strong>Segment Mismatch:</strong> You have selected Chilled orders, but assigned a Dry vehicle. Cargo spoilage risk!
              </v-alert>

              <v-alert
                v-if="weightExceeded"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-2 text-caption"
                icon="mdi-alert-octagon"
              >
                <strong>Weight Exceeded:</strong> Cargo total weight exceeds assigned vehicle weight capacity!
              </v-alert>

              <v-alert
                v-if="volumeExceeded"
                type="error"
                variant="tonal"
                density="compact"
                class="text-caption"
                icon="mdi-alert-octagon"
              >
                <strong>Volume Exceeded:</strong> Cargo total volume exceeds assigned vehicle volume capacity!
              </v-alert>
            </div>

            <!-- 3. Assign Driver -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-2">
              3. Assign Driver
            </div>
            <v-select
              v-model="selectedDriverId"
              :items="availableDrivers"
              item-title="displayName"
              item-value="id"
              label="Assign Standby Driver *"
              variant="outlined"
              density="comfortable"
              color="primary"
              required
              :rules="[v => !!v || 'Driver is required']"
              class="mb-2"
              hide-details="auto"
            ></v-select>

          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="px-5 py-3 bg-surface">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" class="font-weight-bold" @click="createDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="font-weight-bold px-6 rounded-lg"
            :disabled="!isSubmitAllowed"
            @click="dispatchTrip"
          >
            Schedule & Dispatch Trip
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, createTrip, startSimulation } from '@/state'

const formValid = ref(false)
const tripName = ref('')
const selectedOrderIds = ref([])
const selectedVehicleId = ref('')
const selectedDriverId = ref('')
const createDialog = ref(false)

// Search & Status Filters
const search = ref('')
const activeStatusFilter = ref('All')
const statusOptions = ['All', 'Scheduled', 'Active', 'Completed']

// Computed options
const unassignedOrders = computed(() => {
  return store.orders.filter(o => o.status === 'Draft' || o.status === 'Planned')
})

const availableVehicles = computed(() => {
  return store.vehicles
    .filter(v => v.status === 'Available')
    .map(v => ({
      id: v.id,
      name: v.name,
      tempType: v.tempType,
      capacityWeight: v.capacityWeight,
      capacityVolume: v.capacityVolume,
      displayName: `${v.name} (${v.plateNumber}) • ${v.type} [Max ${v.capacityWeight}kg / ${v.capacityVolume}cbm]`
    }))
})

const availableDrivers = computed(() => {
  return store.drivers
    .filter(d => d.status === 'Available')
    .map(d => ({
      id: d.id,
      displayName: `${d.name} (${d.licenseType} License)`
    }))
})

// Selected stats calculation
const totalSelectedWeight = computed(() => {
  return store.orders
    .filter(o => selectedOrderIds.value.includes(o.id))
    .reduce((sum, o) => sum + o.totalWeight, 0)
})

const totalSelectedVolume = computed(() => {
  return store.orders
    .filter(o => selectedOrderIds.value.includes(o.id))
    .reduce((sum, o) => sum + o.totalVolume, 0)
})

const selectedVehicle = computed(() => {
  return store.vehicles.find(v => v.id === selectedVehicleId.value)
})

// Mismatches and limits
const temperatureMismatch = computed(() => {
  if (!selectedVehicle.value) return false
  const hasChilledOrder = store.orders
    .filter(o => selectedOrderIds.value.includes(o.id))
    .some(o => o.tempRequirement === 'Chilled')
  return hasChilledOrder && selectedVehicle.value.tempType === 'Dry'
})

const weightExceeded = computed(() => {
  if (!selectedVehicle.value) return false
  return totalSelectedWeight.value > selectedVehicle.value.capacityWeight
})

const volumeExceeded = computed(() => {
  if (!selectedVehicle.value) return false
  return totalSelectedVolume.value > selectedVehicle.value.capacityVolume
})

const isSubmitAllowed = computed(() => {
  return (
    formValid.value &&
    selectedOrderIds.value.length > 0 &&
    selectedVehicleId.value !== '' &&
    selectedDriverId.value !== '' &&
    !weightExceeded.value &&
    !volumeExceeded.value
  )
})

const filteredTrips = computed(() => {
  return store.trips.filter(t => {
    // 1. Search Query
    const query = search.value.toLowerCase().trim()
    const matchesSearch = !query || 
      t.id.toLowerCase().includes(query) ||
      t.tripName.toLowerCase().includes(query) ||
      t.driver.name.toLowerCase().includes(query) ||
      t.vehicle.name.toLowerCase().includes(query) ||
      t.vehicle.plateNumber.toLowerCase().includes(query)

    // 2. Status Filter
    const matchesStatus = activeStatusFilter.value === 'All' || t.status === activeStatusFilter.value

    return matchesSearch && matchesStatus
  })
})

function getTripStatusColor(status) {
  switch (status) {
    case 'Scheduled': return 'primary'
    case 'Active': return 'warning'
    case 'Completed': return 'success'
    default: return 'grey'
  }
}

function getTripTotalWeight(trip) {
  return trip.orders.reduce((sum, o) => sum + o.totalWeight, 0)
}

function getTripTotalVolume(trip) {
  return trip.orders.reduce((sum, o) => sum + o.totalVolume, 0)
}

function openCreateDialog() {
  tripName.value = ''
  selectedOrderIds.value = []
  selectedVehicleId.value = ''
  selectedDriverId.value = ''
  createDialog.value = true
}

function dispatchTrip() {
  if (isSubmitAllowed.value) {
    createTrip(
      tripName.value,
      selectedDriverId.value,
      selectedVehicleId.value,
      selectedOrderIds.value
    )
    // Reset form and close dialog
    tripName.value = ''
    selectedOrderIds.value = []
    selectedVehicleId.value = ''
    selectedDriverId.value = ''
    createDialog.value = false
  }
}

function runSimulation(tripId) {
  startSimulation(tripId)
  store.activeAdminTab = 'controlTower'
}

function goToControlTower() {
  store.activeAdminTab = 'controlTower'
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.w-100 {
  width: 100%;
}
.cursor-pointer {
  cursor: pointer;
}
.active-stat-card {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.1) !important;
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}
.capacity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 600px) {
  .capacity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
