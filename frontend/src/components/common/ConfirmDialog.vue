<template>
  <v-dialog :model-value="modelValue" max-width="400" @update:model-value="emit('update:modelValue', $event)">
    <v-card class="rounded-lg">
      <v-card-title class="text-h6 font-weight-medium pa-4">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="outlined" class="rounded-lg text-none" @click="emit('update:modelValue', false)">Back</v-btn>
        <v-btn :color="confirmColor" variant="flat" class="rounded-lg text-none font-weight-bold" @click="emit('confirm')">{{ confirmLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ modelValue: boolean, title: string, text: string, confirmLabel?: string, confirmColor?: string }>(), { confirmLabel: 'Delete', confirmColor: 'error' })
const emit = defineEmits<{ 'update:modelValue': [open: boolean], confirm: [] }>()
</script>
