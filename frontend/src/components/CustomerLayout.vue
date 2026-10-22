<template>
  <!-- App Bar -->
  <v-app-bar flat class="border-b bg-surface px-4" elevation="0">
    <v-toolbar-title class="font-weight-bold text-slate-800 d-flex align-center">
      <v-img
        src="@/assets/logo.png"
        alt="Wared Logo"
        max-height="45"
        max-width="120"
        contain
        class="mr-4"
      />
      <v-chip color="secondary" class="font-weight-bold mr-2" label size="small">
        CLIENT HUB
      </v-chip>
      <span class="d-none d-sm-inline text-subtitle-1 font-weight-bold text-slate-700">Wared Logistics Portal</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Role Switcher Shortcut -->
    <v-btn
      color="primary"
      variant="flat"
      class="font-weight-bold rounded-lg mr-2"
      prepend-icon="mdi-shield-account-outline"
      size="small"
      @click="swapToAdmin"
    >
      Back to Admin Desk
    </v-btn>

    <!-- Theme Toggle -->
    <v-btn
      icon="mdi-theme-light-dark"
      color="secondary"
      variant="tonal"
      class="rounded-lg mr-2"
      @click="toggleTheme"
    />

    <!-- Sign Out -->
    <v-btn
      icon="mdi-logout"
      color="error"
      variant="text"
      class="rounded-lg"
      @click="logout"
    ></v-btn>
  </v-app-bar>

  <!-- Main Customer Content Area -->
  <v-main class="bg-background">
    <router-view />
  </v-main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { selectRole } from '@/state'

const router = useRouter()
const vuetifyTheme = useTheme()

function toggleTheme() {
  vuetifyTheme.global.name.value = vuetifyTheme.global.name.value === 'light' ? 'dark' : 'light'
}

function logout() {
  selectRole(null)
  router.push('/login')
}

function swapToAdmin() {
  selectRole('admin')
  router.push('/admin/dashboard')
}
</script>

<style scoped>
.bg-background {
  background-color: var(--v-theme-background) !important;
}
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
</style>
