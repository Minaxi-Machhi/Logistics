<template>
  <v-container fluid class="page">
    <PageHeader title="Dashboard" subtitle="Operations and billing at a glance." />

    <div class="grid-kpi">
      <KpiTile v-for="k in dashboard.kpis" :key="k.label" :kpi="k" />
    </div>

    <div class="grid-2">
      <OrdersChart />
      <RevenueChart />
    </div>

    <RelatedTable title="Active trips" :columns="columns" :items="activeTrips" :link-to="tripLink" />
  </v-container>
</template>

<script setup lang="ts">
import type { Column } from '@/types'
import { dashboard } from '@/mock/misc'
import { trips } from '@/mock/trips'
import PageHeader from '@/components/common/PageHeader.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { tripLink } from '../trips/config'
import KpiTile from './components/KpiTile.vue'
import OrdersChart from './components/OrdersChart.vue'
import RevenueChart from './components/RevenueChart.vue'

const columns: Column[] = [
  { key: 'id', title: 'Trip no.', type: 'mono' }, { key: 'route', title: 'Route' }, { key: 'driver', title: 'Driver' },
  { key: 'vehicle', title: 'Vehicle', type: 'mono' }, { key: 'eta', title: 'ETA' }, { key: 'status', title: 'Status', type: 'status' },
]
const activeTrips = trips.filter(t => t.status === 'Active' || t.status === 'Assigned').slice(0, 6)
</script>
