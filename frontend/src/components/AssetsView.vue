<template>
  <v-container fluid class="px-4 py-0">
    <!-- Header Area -->
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px;">
      <div>
        <h2 class="text-h6 font-weight-bold text-slate-800 d-flex align-center">
          <v-icon color="primary" class="mr-2" size="24">
            {{ isDriversTab ? 'mdi-card-account-details-outline' : 'mdi-truck-cargo-container' }}
          </v-icon>
          <span>{{ isDriversTab ? 'Driver Registry' : 'Fleet Directory' }}</span>
        </h2>
        <p class="text-caption text-medium-emphasis mb-0">
          {{ isDriversTab ? 'Manage active standby drivers, contact sheets, and license verification files' : 'Manage logistics fleet specs, cold-chain categories, and capacities' }}
        </p>
      </div>
      <div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="default"
          class="rounded-lg font-weight-bold"
          @click="openCreateDialog"
        >
          Add {{ isDriversTab ? 'Driver' : 'Vehicle' }}
        </v-btn>
      </div>
    </div>

    <!-- Dynamic KPI Strip -->
    <v-row class="mb-3" dense>
      <template v-if="!isDriversTab">
        <!-- Vehicles Stats -->
        <v-col cols="6" sm="3" md="2.4" class="d-flex">
          <v-card class="glass-card pa-3 rounded-lg text-center flex-grow-1 border" elevation="1">
            <v-icon color="primary" size="20" class="mb-1">mdi-truck-outline</v-icon>
            <div class="text-h6 font-weight-bold text-slate-800">{{ store.vehicles.length }}</div>
            <div class="text-caption text-medium-emphasis">Total Vehicles</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3" md="2.4" class="d-flex">
          <v-card class="glass-card pa-3 rounded-lg text-center flex-grow-1 border" elevation="1">
            <v-icon color="success" size="20" class="mb-1">mdi-check-circle-outline</v-icon>
            <div class="text-h6 font-weight-bold text-success">
              {{ store.vehicles.filter(v => v.status === 'Available').length }}
            </div>
            <div class="text-caption text-medium-emphasis">Available Fleet</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3" md="2.4" class="d-flex">
          <v-card class="glass-card pa-3 rounded-lg text-center flex-grow-1 border" elevation="1">
            <v-icon color="warning" size="20" class="mb-1">mdi-truck-delivery-outline</v-icon>
            <div class="text-h6 font-weight-bold text-warning">
              {{ store.vehicles.filter(v => v.status === 'On Trip').length }}
            </div>
            <div class="text-caption text-medium-emphasis">Active (On Trip)</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3" md="2.4" class="d-flex">
          <v-card class="glass-card pa-3 rounded-lg text-center flex-grow-1 border" elevation="1">
            <v-icon color="error" size="20" class="mb-1">mdi-wrench-outline</v-icon>
            <div class="text-h6 font-weight-bold text-error">
              {{ store.vehicles.filter(v => v.status === 'Maintenance').length }}
            </div>
            <div class="text-caption text-medium-emphasis">Maintenance</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3" md="2.4" class="d-flex">
          <v-card class="glass-card pa-3 rounded-lg text-center flex-grow-1 border" elevation="1">
            <v-icon color="info" size="20" class="mb-1">mdi-snowflake</v-icon>
            <div class="text-h6 font-weight-bold text-info">
              {{ store.vehicles.filter(v => v.tempType === 'Chilled').length }}
            </div>
            <div class="text-caption text-medium-emphasis">Cold-Chain</div>
          </v-card>
        </v-col>
      </template>
      <template v-else>
        <!-- Drivers Stats -->
        <v-col cols="6" sm="3" class="d-flex">
          <v-card class="glass-card pa-3 rounded-lg text-center flex-grow-1 border" elevation="1">
            <v-icon color="primary" size="20" class="mb-1">mdi-account-multiple-outline</v-icon>
            <div class="text-h6 font-weight-bold text-slate-800">{{ store.drivers.length }}</div>
            <div class="text-caption text-medium-emphasis">Total Drivers</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3" class="d-flex">
          <v-card class="glass-card pa-3 rounded-lg text-center flex-grow-1 border" elevation="1">
            <v-icon color="success" size="20" class="mb-1">mdi-account-check-outline</v-icon>
            <div class="text-h6 font-weight-bold text-success">
              {{ store.drivers.filter(d => d.status === 'Available').length }}
            </div>
            <div class="text-caption text-medium-emphasis">Standby Drivers</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3" class="d-flex">
          <v-card class="glass-card pa-3 rounded-lg text-center flex-grow-1 border" elevation="1">
            <v-icon color="warning" size="20" class="mb-1">mdi-steering</v-icon>
            <div class="text-h6 font-weight-bold text-warning">
              {{ store.drivers.filter(d => d.status === 'On Trip').length }}
            </div>
            <div class="text-caption text-medium-emphasis">Active (On Trip)</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3" class="d-flex">
          <v-card class="glass-card pa-3 rounded-lg text-center flex-grow-1 border" elevation="1">
            <v-icon color="error" size="20" class="mb-1">mdi-account-off-outline</v-icon>
            <div class="text-h6 font-weight-bold text-error">
              {{ store.drivers.filter(d => d.status === 'On Leave').length }}
            </div>
            <div class="text-caption text-medium-emphasis">On Leave</div>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <!-- Filters & Actions Card -->
    <v-card class="glass-card mb-4 pa-3 rounded-lg border" elevation="2">
      <v-row class="align-center" dense>
        <v-col cols="12" sm="4" md="4">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            :label="isDriversTab ? 'Search drivers by ID, name, phone...' : 'Search vehicles by ID, name, plate...'"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
            clearable
          ></v-text-field>
        </v-col>

        <!-- Dynamic Filter Selects -->
        <template v-if="!isDriversTab">
          <v-col cols="6" sm="4" md="3">
            <v-select
              v-model="filterStatus"
              :items="['All Statuses', 'Available', 'Assigned', 'On Trip', 'Maintenance']"
              label="Status Filter"
              variant="outlined"
              density="compact"
              hide-details
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="6" sm="4" md="3">
            <v-select
              v-model="filterTemp"
              :items="['All Temp Types', 'Dry', 'Chilled']"
              label="Temp Segment"
              variant="outlined"
              density="compact"
              hide-details
              color="primary"
            ></v-select>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="6" sm="4" md="3">
            <v-select
              v-model="filterStatus"
              :items="['All Statuses', 'Available', 'Assigned', 'On Trip', 'On Leave']"
              label="Status Filter"
              variant="outlined"
              density="compact"
              hide-details
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="6" sm="4" md="3">
            <v-select
              v-model="filterLicense"
              :items="['All License Types', 'Heavy', 'Light']"
              label="License Type"
              variant="outlined"
              density="compact"
              hide-details
              color="primary"
            ></v-select>
          </v-col>
        </template>
      </v-row>
    </v-card>

    <!-- Table Section -->
    <v-card class="glass-card rounded-lg overflow-hidden border" elevation="2">
      <!-- 1. VEHICLES TABLE -->
      <v-table v-if="!isDriversTab" hover density="comfortable">
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold text-left">Vehicle ID</th>
            <th class="font-weight-bold text-left">Plate Number</th>
            <th class="font-weight-bold text-left">Vehicle Name & Model</th>
            <th class="font-weight-bold text-left">Type</th>
            <th class="font-weight-bold text-center">Temp Category</th>
            <th class="font-weight-bold text-right">Capacity (Weight)</th>
            <th class="font-weight-bold text-right">Capacity (Volume)</th>
            <th class="font-weight-bold text-center">Current Status</th>
            <th class="font-weight-bold text-left" style="width: 140px;">Utilization</th>
            <th class="font-weight-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicle in filteredVehicles" :key="vehicle.id" class="table-row-hover">
            <td class="font-weight-bold text-primary">{{ vehicle.id }}</td>
            <td class="font-weight-medium text-slate-800">{{ vehicle.plateNumber }}</td>
            <td>
              <div class="font-weight-bold text-slate-800">{{ vehicle.name }}</div>
            </td>
            <td>
              <v-chip size="small" color="grey-darken-2" variant="tonal" density="comfortable">
                {{ vehicle.type }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-chip
                size="small"
                :color="vehicle.tempType === 'Chilled' ? 'info' : 'grey-darken-1'"
                variant="tonal"
                class="font-weight-bold"
                :prepend-icon="vehicle.tempType === 'Chilled' ? 'mdi-snowflake' : 'mdi-sun-thermometer-outline'"
              >
                {{ vehicle.tempType }}
              </v-chip>
            </td>
            <td class="text-right font-weight-bold text-slate-700">
              {{ vehicle.capacityWeight.toLocaleString() }} kg
            </td>
            <td class="text-right font-weight-bold text-slate-700">
              {{ vehicle.capacityVolume }} cbm
            </td>
            <td class="text-center">
              <div class="d-inline-flex align-center">
                <div class="status-dot mr-2" :class="getStatusDotClass(vehicle.status)"></div>
                <v-chip
                  size="small"
                  :color="getVehicleStatusColor(vehicle.status)"
                  class="font-weight-bold"
                  variant="flat"
                >
                  {{ vehicle.status }}
                </v-chip>
              </div>
            </td>
            <td>
              <div class="d-flex flex-column justify-center fill-height pt-1">
                <div class="d-flex justify-space-between text-[10px] text-medium-emphasis mb-1">
                  <span>{{ getVehicleLoadPercent(vehicle) }}% Load</span>
                </div>
                <v-progress-linear
                  :model-value="getVehicleLoadPercent(vehicle)"
                  :color="vehicle.status === 'On Trip' ? 'warning' : 'primary'"
                  height="5"
                  rounded
                  bg-color="grey-lighten-3"
                ></v-progress-linear>
              </div>
            </td>
            <td class="text-center">
              <v-btn
                density="compact"
                icon="mdi-pencil-outline"
                size="small"
                color="primary"
                variant="tonal"
                class="rounded-lg mr-1"
                @click="openEditVehicle(vehicle)"
              ></v-btn>
            </td>
          </tr>
          <tr v-if="filteredVehicles.length === 0">
            <td colspan="10" class="text-center py-8 text-medium-emphasis">
              <v-icon size="40" color="grey" class="mb-2">mdi-truck-remove-outline</v-icon>
              <div>No vehicles found matching the filter criteria.</div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- 2. DRIVERS TABLE -->
      <v-table v-else hover density="comfortable">
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold text-left">Driver ID</th>
            <th class="font-weight-bold text-left">Driver Name</th>
            <th class="font-weight-bold text-left">License Class</th>
            <th class="font-weight-bold text-left">Contact Mobile</th>
            <th class="font-weight-bold text-center">Status</th>
            <th class="font-weight-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="driver in filteredDrivers" :key="driver.id" class="table-row-hover">
            <td class="font-weight-bold text-primary">{{ driver.id }}</td>
            <td>
              <div class="d-flex align-center">
                <v-avatar
                  :color="getDriverStatusColor(driver.status)"
                  size="32"
                  class="mr-2 text-white font-weight-bold text-caption"
                >
                  {{ getInitials(driver.name) }}
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-slate-800">{{ driver.name }}</div>
                </div>
              </div>
            </td>
            <td>
              <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold" prepend-icon="mdi-file-certificate-outline">
                {{ driver.licenseType }} License
              </v-chip>
            </td>
            <td>
              <div class="d-flex align-center">
                <v-icon size="14" class="mr-1 text-medium-emphasis">mdi-phone</v-icon>
                <span class="font-weight-medium text-slate-700">{{ driver.phone }}</span>
                <v-btn
                  density="compact"
                  icon="mdi-phone-outgoing"
                  variant="text"
                  color="success"
                  size="x-small"
                  class="ml-2"
                  :href="'tel:' + driver.phone"
                ></v-btn>
              </div>
            </td>
            <td class="text-center">
              <div class="d-inline-flex align-center">
                <v-chip
                  size="small"
                  :color="getDriverStatusColor(driver.status)"
                  class="font-weight-bold"
                  variant="flat"
                >
                  {{ driver.status }}
                </v-chip>
              </div>
            </td>
            <td class="text-center">
              <v-btn
                density="compact"
                icon="mdi-pencil-outline"
                size="small"
                color="primary"
                variant="tonal"
                class="rounded-lg mr-1"
                @click="openEditDriver(driver)"
              ></v-btn>
            </td>
          </tr>
          <tr v-if="filteredDrivers.length === 0">
            <td colspan="6" class="text-center py-8 text-medium-emphasis">
              <v-icon size="40" color="grey" class="mb-2">mdi-account-off-outline</v-icon>
              <div>No drivers found matching the filter criteria.</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- VEHICLE CREATE/EDIT DIALOG -->
    <v-dialog v-model="vehicleDialog" max-width="560px" width="100%" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-subtitle-1 font-weight-bold text-primary px-5 py-4 d-flex justify-space-between align-center border-b">
          <div class="d-flex align-center gap-2">
            <v-icon color="primary">{{ editMode ? 'mdi-pencil-outline' : 'mdi-plus' }}</v-icon>
            <span>{{ editMode ? 'Edit Vehicle Profile' : 'Register Fleet Vehicle' }}</span>
          </div>
          <v-btn icon="mdi-close" variant="text" density="compact" @click="vehicleDialog = false"></v-btn>
        </v-card-title>

        <v-card-text class="pa-5">
          <v-form ref="vehicleForm" v-model="formValid">
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
              <v-text-field
                v-model="vehicleData.name"
                label="Vehicle Name / Model *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                placeholder="e.g. Scania R450 Box"
                :rules="[v => !!v || 'Vehicle Name is required']"
              ></v-text-field>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <v-text-field
                  v-model="vehicleData.plateNumber"
                  label="Plate Number *"
                  required
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                  placeholder="e.g. A-29402"
                  :rules="[v => !!v || 'Plate Number is required']"
                ></v-text-field>

                <v-select
                  v-model="vehicleData.type"
                  :items="['Heavy Truck', 'Medium Truck', 'Chilled Van', 'Light Van']"
                  label="Vehicle Type *"
                  required
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                ></v-select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <v-select
                  v-model="vehicleData.tempType"
                  :items="['Dry', 'Chilled']"
                  label="Temperature Segment *"
                  required
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                ></v-select>

                <v-select
                  v-model="vehicleData.status"
                  :items="['Available', 'Assigned', 'On Trip', 'Maintenance']"
                  label="Fleet Status *"
                  required
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                ></v-select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <v-text-field
                  v-model.number="vehicleData.capacityWeight"
                  label="Weight Capacity (kg) *"
                  type="number"
                  required
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                  :rules="[v => !!v || 'Weight capacity is required', v => v > 0 || 'Capacity must be positive']"
                ></v-text-field>

                <v-text-field
                  v-model.number="vehicleData.capacityVolume"
                  label="Volumetric Capacity (cbm) *"
                  type="number"
                  required
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                  :rules="[v => !!v || 'Volumetric capacity is required', v => v > 0 || 'Capacity must be positive']"
                ></v-text-field>
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="px-5 py-3">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" class="font-weight-bold" @click="vehicleDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="font-weight-bold px-6 rounded-lg"
            :disabled="!formValid"
            @click="submitVehicle"
          >
            {{ editMode ? 'Save Changes' : 'Register Vehicle' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DRIVER CREATE/EDIT DIALOG -->
    <v-dialog v-model="driverDialog" max-width="500px" width="100%" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-subtitle-1 font-weight-bold text-primary px-5 py-4 d-flex justify-space-between align-center border-b">
          <div class="d-flex align-center gap-2">
            <v-icon color="primary">{{ editMode ? 'mdi-pencil-outline' : 'mdi-plus' }}</v-icon>
            <span>{{ editMode ? 'Edit Driver Profile' : 'Register Standby Driver' }}</span>
          </div>
          <v-btn icon="mdi-close" variant="text" density="compact" @click="driverDialog = false"></v-btn>
        </v-card-title>

        <v-card-text class="pa-5">
          <v-form ref="driverForm" v-model="formValid">
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
              <v-text-field
                v-model="driverData.name"
                label="Driver Full Name *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                placeholder="e.g. Ahmed Al-Mansoori"
                :rules="[v => !!v || 'Driver Name is required']"
              ></v-text-field>

              <v-text-field
                v-model="driverData.phone"
                label="Mobile Phone Number *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                placeholder="e.g. +971 50 999 8881"
                :rules="[v => !!v || 'Phone is required']"
              ></v-text-field>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <v-select
                  v-model="driverData.licenseType"
                  :items="['Heavy', 'Light']"
                  label="License Type *"
                  required
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                ></v-select>

                <v-select
                  v-model="driverData.status"
                  :items="['Available', 'Assigned', 'On Trip', 'On Leave']"
                  label="Duty Status *"
                  required
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                ></v-select>
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="px-5 py-3">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" class="font-weight-bold" @click="driverDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="font-weight-bold px-6 rounded-lg"
            :disabled="!formValid"
            @click="submitDriver"
          >
            {{ editMode ? 'Save Changes' : 'Register Driver' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, createVehicle, updateVehicle, createDriver, updateDriver } from '@/state'

// Tab state logic
const isDriversTab = computed(() => store.activeAdminTab === 'drivers')

// Search & filter state
const searchQuery = ref('')
const filterStatus = ref('All Statuses')
const filterTemp = ref('All Temp Types')
const filterLicense = ref('All License Types')

// Reset filters when tab switches
const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'All Statuses'
  filterTemp.value = 'All Temp Types'
  filterLicense.value = 'All License Types'
}

// Dialog States
const vehicleDialog = ref(false)
const driverDialog = ref(false)
const editMode = ref(false)
const formValid = ref(false)

const vehicleForm = ref(null)
const driverForm = ref(null)

// Selected entities for editing
const selectedId = ref('')
const vehicleData = ref({
  name: '',
  plateNumber: '',
  type: 'Light Van',
  tempType: 'Dry',
  capacityWeight: 1000,
  capacityVolume: 5,
  status: 'Available'
})

const driverData = ref({
  name: '',
  phone: '',
  licenseType: 'Light',
  status: 'Available'
})

// Methods for Dialog actions
function openCreateDialog() {
  editMode.value = false
  if (isDriversTab.value) {
    driverData.value = {
      name: '',
      phone: '',
      licenseType: 'Light',
      status: 'Available'
    }
    driverDialog.value = true
  } else {
    vehicleData.value = {
      name: '',
      plateNumber: '',
      type: 'Light Van',
      tempType: 'Dry',
      capacityWeight: 1000,
      capacityVolume: 5,
      status: 'Available'
    }
    vehicleDialog.value = true
  }
}

function openEditVehicle(vehicle) {
  editMode.value = true
  selectedId.value = vehicle.id
  vehicleData.value = { ...vehicle }
  vehicleDialog.value = true
}

function openEditDriver(driver) {
  editMode.value = true
  selectedId.value = driver.id
  driverData.value = { ...driver }
  driverDialog.value = true
}

function submitVehicle() {
  if (editMode.value) {
    updateVehicle(selectedId.value, vehicleData.value)
  } else {
    createVehicle(vehicleData.value)
  }
  vehicleDialog.value = false
}

function submitDriver() {
  if (editMode.value) {
    updateDriver(selectedId.value, driverData.value)
  } else {
    createDriver(driverData.value)
  }
  driverDialog.value = false
}

// Computed filter lists
const filteredVehicles = computed(() => {
  return store.vehicles.filter(vehicle => {
    // Search query matches
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch =
        vehicle.id.toLowerCase().includes(query) ||
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.plateNumber.toLowerCase().includes(query) ||
        vehicle.type.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Status Filter matches
    if (filterStatus.value !== 'All Statuses') {
      if (vehicle.status !== filterStatus.value) return false
    }

    // Temp segment matches
    if (filterTemp.value !== 'All Temp Types') {
      if (vehicle.tempType !== filterTemp.value) return false
    }

    return true
  })
})

const filteredDrivers = computed(() => {
  return store.drivers.filter(driver => {
    // Search query matches
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch =
        driver.id.toLowerCase().includes(query) ||
        driver.name.toLowerCase().includes(query) ||
        driver.phone.includes(query)
      if (!matchesSearch) return false
    }

    // Status Filter matches
    if (filterStatus.value !== 'All Statuses') {
      if (driver.status !== filterStatus.value) return false
    }

    // License Type matches
    if (filterLicense.value !== 'All License Types') {
      if (driver.licenseType !== filterLicense.value) return false
    }

    return true
  })
})

// UI Helper Functions
function getVehicleStatusColor(status) {
  switch (status) {
    case 'Available': return 'success'
    case 'Assigned': return 'primary'
    case 'On Trip': return 'warning'
    case 'Maintenance': return 'error'
    default: return 'grey'
  }
}

function getDriverStatusColor(status) {
  switch (status) {
    case 'Available': return 'success'
    case 'Assigned': return 'primary'
    case 'On Trip': return 'warning'
    case 'On Leave': return 'error'
    default: return 'grey'
  }
}

function getStatusDotClass(status) {
  switch (status) {
    case 'Available': return 'dot-success'
    case 'On Trip': return 'dot-warning dot-pulse'
    case 'Maintenance': return 'dot-error'
    default: return 'dot-grey'
  }
}

function getInitials(name) {
  if (!name) return 'D'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function getVehicleLoadPercent(vehicle) {
  if (vehicle.status === 'On Trip') return 78
  if (vehicle.status === 'Assigned') return 55
  return 0
}
</script>

<style scoped>
.gap-2 { gap: 8px; }

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-success { background-color: rgb(var(--v-theme-success)); }
.dot-warning { background-color: rgb(var(--v-theme-warning)); }
.dot-error { background-color: rgb(var(--v-theme-error)); }
.dot-grey { background-color: #9e9e9e; }
.dot-pulse {
  animation: pulse-ring 1.5s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
  box-shadow: 0 0 0 4px rgba(var(--v-theme-warning), 0.3);
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0.5); }
  70% { box-shadow: 0 0 0 6px rgba(var(--v-theme-warning), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0); }
}

.table-row-hover {
  transition: background-color 0.2s ease;
}
.table-row-hover:hover {
  background-color: rgba(var(--v-theme-primary), 0.03) !important;
}

.glass-card {
  background: rgba(var(--v-theme-surface), 0.8) !important;
  backdrop-filter: blur(10px);
}
</style>
