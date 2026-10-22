<template>
  <v-container fluid class="page">
    <PageHeader title="Reports" subtitle="Pick a report, set a date range and export." />
    <div class="grid-cards">
      <ReportCard v-for="r in reports" :key="r.title" :report="r" @run="run" />
    </div>
    <ReportDialog v-model="open" :report="selected" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { reports, type Report } from '@/mock/misc'
import PageHeader from '@/components/common/PageHeader.vue'
import ReportCard from './components/ReportCard.vue'
import ReportDialog from './components/ReportDialog.vue'

const open = ref(false)
const selected = ref<Report | null>(null)

function run (r: Report) {
  selected.value = r
  open.value = true
}
</script>
