<template>
  <div v-if="count" class="selection-bar d-flex align-center flex-wrap gap-3 px-3 py-2">
    <span class="text-body-2 font-weight-medium">{{ count }} selected</span>
    <slot />
    <v-spacer />
    <v-btn variant="text" size="small" class="text-none" prepend-icon="mdi-close" @click="emit('clear')">Clear</v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{ count: number }>()
const emit = defineEmits<{ clear: [] }>()
</script>

<style scoped>
.selection-bar { background: rgba(var(--v-theme-primary), 0.06); border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
</style>
