<template>
  <v-navigation-drawer
    permanent
    :rail="rail"
    :rail-width="68"
    :width="236"
    class="border-e bg-surface"
    elevation="0"
  >
    <div class="pa-4 d-flex align-center gap-3 brand" :class="{ 'justify-center': rail }">
      <img src="@/assets/logo-lg.svg" alt="Logistics" width="32" height="32" class="brand__logo">
      <div v-if="!rail">
        <div class="brand__name">Logistics</div>
        <div class="brand__sub">Transport management</div>
      </div>
    </div>

    <v-list density="comfortable" nav class="px-2 mt-2">
      <v-list-item
        v-for="item in nav"
        :key="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        active-color="primary"
        class="rounded-lg mb-1"
      />
    </v-list>

    <template #append>
      <div v-if="!rail" class="pa-3">
        <div class="text-caption text-medium-emphasis mb-2">ats_shipping · sample data</div>
        <v-btn
          variant="outlined"
          block
          prepend-icon="mdi-logout"
          class="font-weight-bold rounded-lg"
          @click="logout"
        >
          Sign Out
        </v-btn>
      </div>
      <div v-else class="pa-2 d-flex justify-center">
        <v-btn icon="mdi-logout" variant="text" class="rounded-lg" aria-label="Sign out" @click="logout" />
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar flat class="border-b bg-surface px-3" elevation="0" height="56">
    <v-btn
      variant="text"
      class="mr-0"
      :aria-label="rail ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="rail = !rail"
    >
      <v-icon>mdi-dock-left</v-icon>
      <v-tooltip activator="parent" location="bottom">{{ rail ? 'Expand sidebar' : 'Collapse sidebar' }}</v-tooltip>
    </v-btn>

    <v-btn v-if="pageTitle.back" icon="mdi-arrow-left" variant="text" size="small" class="mr-1" aria-label="Back" :to="pageTitle.back" />
    <div class="bar-title">
      <div class="bar-title__name">{{ pageTitle.title }}</div>
      <div v-if="pageTitle.subtitle" class="bar-title__sub text-medium-emphasis">{{ pageTitle.subtitle }}</div>
    </div>

    <v-spacer />

    <div class="d-none d-lg-flex align-center text-body-2 mr-4">
      <v-icon size="10" color="success" class="mr-2">mdi-circle</v-icon>
      {{ now }}<span class="text-medium-emphasis ml-1">GST</span>
    </div>

    <!-- Country -->
    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="outlined" class="rounded-lg mr-3 text-none country-btn" height="44">
          <v-icon start>mdi-earth</v-icon>
          <div class="text-left">
            <div class="text-overline line-height-tight text-medium-emphasis">COUNTRY</div>
            <div class="font-weight-bold line-height-tight">{{ country }}</div>
          </div>
          <v-icon end>mdi-unfold-more-horizontal</v-icon>
        </v-btn>
      </template>
      <v-list density="compact" min-width="180">
        <v-list-item
          v-for="c in COUNTRIES"
          :key="c.code"
          :title="c.code"
          :subtitle="c.currency"
          :active="c.code === country"
          @click="country = c.code"
        />
      </v-list>
    </v-menu>

    <!-- Notifications -->
    <v-menu :close-on-content-click="false" location="bottom end">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon variant="text" class="mr-2" aria-label="Notifications">
          <v-badge :content="notifications.length" color="secondary" offset-x="-2" offset-y="-2">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-card min-width="320" max-width="360">
        <v-card-title class="text-subtitle-1 font-weight-bold">Notifications</v-card-title>
        <v-divider />
        <v-list lines="two" density="compact">
          <v-list-item v-for="n in notifications" :key="n.text" :subtitle="n.time">
            <template #prepend><v-icon :color="n.color" :icon="n.icon" /></template>
            <v-list-item-title class="text-wrap">{{ n.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-btn icon="mdi-theme-light-dark" variant="text" class="mr-2" aria-label="Toggle theme" @click="toggleTheme" />

    <!-- Profile -->
    <v-menu location="bottom end">
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text" class="text-none px-2" height="48">
          <v-avatar color="error" size="38" class="mr-3 text-body-2 font-weight-bold" style="color:#fff">MM</v-avatar>
          <div class="text-left d-none d-sm-block">
            <div class="font-weight-bold line-height-tight">Divyesh Patel</div>
            <div class="text-caption text-medium-emphasis line-height-tight">System Admin</div>
          </div>
          <v-icon end class="d-none d-sm-inline">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list density="compact" min-width="220">
        <v-list-item title="My profile" prepend-icon="mdi-account-outline" />
        <v-list-item title="Company settings" prepend-icon="mdi-cog-outline" />
        <v-list-item title="Users and roles" prepend-icon="mdi-account-group-outline" />
        <v-divider class="my-1" />
        <v-list-item title="Sign out" prepend-icon="mdi-logout" @click="logout" />
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-main class="bg-background">
    <router-view />
  </v-main>

  <v-snackbar v-model="toast.open" color="success" timeout="2500">{{ toast.text }}</v-snackbar>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { selectRole } from '@/state'
import { COUNTRIES, country } from '@/mock/country'
import { notifications } from '@/mock/misc'
import { pageTitle } from '@/composables/usePageTitle'
import { toast } from '@/composables/useToast'

const router = useRouter()
const theme = useTheme()
const rail = ref(false)

const nav = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/app/dashboard' },
  { title: 'Orders', icon: 'mdi-package-variant-closed', to: '/app/orders' },
  { title: 'Trips', icon: 'mdi-truck-fast-outline', to: '/app/trips' },
  { title: 'Customers', icon: 'mdi-account-group-outline', to: '/app/customers' },
  { title: 'Vendors', icon: 'mdi-warehouse', to: '/app/vendors' },
  { title: 'Assets', icon: 'mdi-truck-outline', to: '/app/assets' },
  { title: 'Invoices', icon: 'mdi-file-document-outline', to: '/app/invoices' },
  { title: 'Incentives', icon: 'mdi-medal-outline', to: '/app/incentives' },
  { title: 'Reports', icon: 'mdi-chart-box-outline', to: '/app/reports' },
]

const fmt = () => new Date().toLocaleString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
const now = ref(fmt())
let timer: ReturnType<typeof setInterval>
onMounted(() => { timer = setInterval(() => { now.value = fmt() }, 30000) })
onBeforeUnmount(() => clearInterval(timer))

function toggleTheme () {
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'
}

function logout () {
  selectRole(null)
  router.push('/login')
}
</script>

<style scoped>
.bar-title { min-width: 0; line-height: 1.2; }
.bar-title__name { font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-title__sub { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.brand { min-height: 56px; }
.brand__logo { display: block; flex: none; border-radius: 8px; }
.brand__name { font-size: 15px; font-weight: 600; line-height: 1.2; }
.brand__sub { font-size: 11.5px; line-height: 1.3; color: rgba(var(--v-theme-on-surface), 0.62); }
.font-mono { font-family: var(--v-font-mono, 'IBM Plex Mono', monospace); }
.line-height-tight { line-height: 1.15; }
.country-btn { border-color: rgba(var(--v-border-color), var(--v-border-opacity)); }
</style>
