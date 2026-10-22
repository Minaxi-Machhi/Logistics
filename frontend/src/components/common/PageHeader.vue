<template>
  <div v-if="$slots.default || $slots.left" class="d-flex flex-wrap align-center gap-2 mb-3">
    <slot name="left" />
    <v-spacer v-if="!$slots.left" />
    <div v-if="$slots.default" class="d-flex flex-wrap align-center gap-2 flex-none"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watchEffect } from 'vue'
import { pageTitle } from '@/composables/usePageTitle'

/** Sets the title shown in the app bar; renders the page's action buttons and a `left` slot for the page's filters. */
const props = defineProps<{ title: string, subtitle?: string, back?: string }>()

watchEffect(() => {
  pageTitle.title = props.title
  pageTitle.subtitle = props.subtitle ?? ''
  pageTitle.back = props.back ?? ''
})

onBeforeUnmount(() => {
  pageTitle.title = ''
  pageTitle.subtitle = ''
  pageTitle.back = ''
})
</script>
