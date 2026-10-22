<template>
  <div class="ff">
    <label class="ff__label">{{ label }}<span v-if="required" class="ff__req" aria-hidden="true"> *</span></label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string, required?: boolean }>()
</script>

<style scoped>
.ff { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.ff__label { font-size: 13px; font-weight: 500; color: rgb(var(--v-theme-on-surface)); }
.ff__req { color: rgb(var(--v-theme-primary)); }
</style>
