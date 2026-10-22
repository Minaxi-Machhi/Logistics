<template>
  <v-container fluid class="page">
    <v-card class="rounded-lg border pa-8 text-center" flat>
      <v-icon size="40" color="medium-emphasis">mdi-file-search-outline</v-icon>
      <div class="text-h6 font-weight-medium mt-2">Record not found</div>
      <div class="text-body-2 text-medium-emphasis mb-4">It may have been deleted, or the link is wrong.</div>
      <v-btn color="primary" variant="flat" class="rounded-lg text-none" :to="backTo">Back to the list</v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
defineProps<{ backTo: string }>()
</script>
