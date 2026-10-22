<template>
  <v-btn
    v-bind="$attrs"
    icon
    variant="flat"
    :aria-label="label"
    class="row-btn"
    :class="[`row-btn--${tone}`]"
    :disabled="disabled"
  >
    <v-icon :icon="icon" size="15" />
    <v-tooltip v-if="!disabled" activator="parent" location="top">{{ label }}</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
/** Square, softly tinted icon button for table rows. `plain` is the white one used for the "more" menu. */
withDefaults(defineProps<{ icon: string, label: string, tone?: 'primary' | 'error' | 'plain', disabled?: boolean }>(), { tone: 'primary' })
defineOptions({ inheritAttrs: false })
</script>
