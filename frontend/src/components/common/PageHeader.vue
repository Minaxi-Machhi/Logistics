<template>
  <div v-if="$slots.default || toolbar" class="d-flex flex-wrap align-center gap-2 mb-3">
    <!-- A table on the page teleports its search and filters here. -->
    <div id="page-toolbar" class="d-flex align-center gap-2 flex-grow-1" style="min-width: 0" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watchEffect } from 'vue'
import { pageTitle } from '@/composables/usePageTitle'

/** Sets the title shown in the app bar; renders the page's action buttons, with a slot on the left for the table's search and filters. */
const props = defineProps<{ title: string, subtitle?: string, back?: string, toolbar?: boolean }>()

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
