<template>
  <span class="status-pill" :class="`text-${STATUS_COLOR[status] ?? 'secondary'}`">{{ status }}</span>
</template>

<script setup lang="ts">
import { STATUS_COLOR } from '@/mock/lookups'

defineProps<{ status: string }>()
</script>
