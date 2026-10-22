<template>
  <v-app :theme="themeName">
    <router-view />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const themeName = ref('light')
</script>

<style>
.bg-background {
  background-color: var(--v-theme-background) !important;
}
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.border-e {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.w-100 {
  width: 100%;
}
.h-100 {
  height: 100%;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
</style>
