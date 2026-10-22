<template>
  <!-- Sidebar Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    permanent
    class="border-e bg-surface"
    elevation="1"
  >
    <!-- Branding Header -->
    <div class="pa-4 d-flex justify-center border-b">
      <v-img
        src="@/assets/logo.png"
        alt="Wared Logo"
        max-height="60"
        max-width="180"
        contain
      />
    </div>

    <!-- Navigation Links -->
    <v-list v-model:opened="opened" density="comfortable" nav class="px-2 mt-2">
      <v-list-item
        prepend-icon="mdi-view-dashboard-outline"
        title="Dashboard"
        value="dashboard"
        to="/admin/dashboard"
        active-color="primary"
        class="rounded-lg mb-1"
      />
      <v-list-item
        prepend-icon="mdi-package-variant-closed"
        title="Orders"
        value="orders"
        to="/admin/orders"
        active-color="primary"
        class="rounded-lg mb-1"
      />
      <v-list-item
        prepend-icon="mdi-steering"
        title="Trip Planning"
        value="trips"
        to="/admin/trips"
        active-color="primary"
        class="rounded-lg mb-1"
      />
      <v-list-item
        prepend-icon="mdi-radiobox-marked"
        title="Control Tower"
        value="controlTower"
        to="/admin/control-tower"
        active-color="primary"
        class="rounded-lg mb-1"
      >
        <template #append v-if="store.activeSimulationTripId">
          <v-badge dot inline color="warning" class="pulse-marker ml-1"></v-badge>
        </template>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-file-document-outline"
        title="Invoices"
        value="invoicing"
        to="/admin/invoicing"
        active-color="primary"
        class="rounded-lg mb-1"
      />
      <!-- Assets Submenu Group -->
      <v-list-group value="assets">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-truck-outline"
            title="Assets"
            active-color="primary"
            class="rounded-lg mb-1"
          />
        </template>
        <v-list-item
          prepend-icon="mdi-truck-cargo-container"
          title="Vehicles"
          value="vehicles"
          to="/admin/assets/vehicles"
          active-color="primary"
          class="rounded-lg mb-1 pl-8"
        />
        <v-list-item
          prepend-icon="mdi-card-account-details-outline"
          title="Drivers"
          value="drivers"
          to="/admin/assets/drivers"
          active-color="primary"
          class="rounded-lg mb-1 pl-8"
        />
      </v-list-group>
    </v-list>

    <!-- Sidebar Footer Status -->
    <template #append>
      <div class="pa-3">
        <v-card class="bg-grey-lighten-4 pa-3 rounded-lg border mb-2" flat>
          <div class="text-caption font-weight-bold text-medium-emphasis">Transport Admin</div>
          <div class="text-caption text-slate-600 mt-1 d-flex align-center">
            <v-icon size="14" color="success" class="mr-1">mdi-circle</v-icon>
            <span>{{ store.currentUserRole }}</span>
          </div>
        </v-card>
        <v-btn
          color="error"
          variant="tonal"
          block
          prepend-icon="mdi-logout"
          class="font-weight-bold rounded-lg"
          @click="logout"
        >
          Sign Out
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <!-- App Bar -->
  <v-app-bar flat class="border-b bg-surface px-4" elevation="0">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none"></v-app-bar-nav-icon>
    
    <v-toolbar-title class="font-weight-bold text-slate-800 d-flex align-center">
      <v-chip color="primary" class="font-weight-bold mr-2" label size="small">
        OPERATIONS
      </v-chip>
      <span class="d-none d-sm-inline">Wared Logistics Management</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Role Switcher Shortcuts -->
    <v-btn
      color="secondary"
      variant="flat"
      class="font-weight-bold rounded-lg mr-2"
      prepend-icon="mdi-account-circle-outline"
      size="small"
      @click="swapToClient"
    >
      Swap to Client View
    </v-btn>

    <!-- Theme toggle button -->
    <v-btn
      icon="mdi-theme-light-dark"
      color="primary"
      variant="tonal"
      class="rounded-lg"
      @click="toggleTheme"
    />
  </v-app-bar>

  <!-- Main Admin Content Area -->
  <v-main class="bg-background">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { store, selectRole } from '@/state'

const router = useRouter()
const drawer = ref(true)
const opened = ref(['assets'])
const vuetifyTheme = useTheme()

function toggleTheme() {
  vuetifyTheme.global.name.value = vuetifyTheme.global.name.value === 'light' ? 'dark' : 'light'
}

function logout() {
  selectRole(null)
  router.push('/login')
}

function swapToClient() {
  selectRole('customer')
  router.push('/customer')
}
</script>

<style scoped>
/* Scoped layout styles for admin */
.bg-background {
  background-color: var(--v-theme-background) !important;
}
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.border-e {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.gap-2 {
  gap: 8px;
}
</style>
