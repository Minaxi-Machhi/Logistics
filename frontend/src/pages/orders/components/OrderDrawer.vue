<template>
  <v-navigation-drawer v-model="orderStore.drawerOpen" temporary location="right" width="420" class="quick">
    <template v-if="order">
      <div class="d-flex align-start justify-space-between pa-4 pb-2">
        <div>
          <div class="text-subtitle-1 font-weight-bold font-mono">{{ order.id }}</div>
          <div class="text-caption text-medium-emphasis">{{ order.jobType }} · {{ order.ref }}</div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Close" @click="orderStore.drawerOpen = false" />
      </div>
      <div class="px-4 pb-3"><StatusPill :status="order.status" /></div>
      <v-divider />

      <dl class="facts pa-4">
        <template v-for="f in facts" :key="f.label">
          <dt class="text-medium-emphasis">{{ f.label }}</dt>
          <dd>{{ f.value }}</dd>
        </template>
      </dl>
      <v-divider />
      <div class="pa-4 d-flex flex-wrap gap-2">
        <v-btn color="primary" variant="flat" class="rounded-lg text-none font-weight-bold" prepend-icon="mdi-open-in-new" @click="openOrder">Open order</v-btn>
        <v-btn v-if="EDITABLE.includes(order.status)" variant="outlined" class="rounded-lg text-none" prepend-icon="mdi-pencil-outline" @click="edit">Edit</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentOrder as order, orderStore } from '@/composables/useOrderStore'
import { money } from '@/mock/country'
import { EDITABLE } from '@/mock/orderFlow'
import StatusPill from '@/components/common/StatusPill.vue'
import { orderLink } from '../config'

const router = useRouter()

const facts = computed(() => {
  const o = order.value
  if (!o) return []
  return [
    { label: 'Customer', value: o.customer },
    { label: 'Branch', value: o.branch },
    { label: 'Route', value: `${o.origin} → ${o.destination}` },
    { label: 'Pickup', value: o.originDepot },
    { label: 'Drop', value: o.destDepot },
    { label: 'Loading', value: o.loading },
    { label: 'Ordered', value: o.orderDate },
    { label: 'Product', value: o.product || '—' },
    { label: 'Vendor', value: o.vendor || '—' },
    { label: 'Quantity', value: o.quantity || '—' },
    { label: 'Sell rate', value: o.rate ? money(o.rate) : '—' },
    { label: 'Legs', value: o.legs.length },
  ]
})

function openOrder () {
  orderStore.drawerOpen = false
  if (order.value) router.push(orderLink(order.value))
}

function edit () {
  orderStore.drawerOpen = false
  if (order.value) orderStore.openEdit(order.value)
}
</script>

<style scoped>
.facts { display: grid; grid-template-columns: 110px 1fr; gap: 8px 12px; margin: 0; font-size: 13px; }
.facts dd { margin: 0; font-weight: 500; overflow-wrap: anywhere; }
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
</style>
