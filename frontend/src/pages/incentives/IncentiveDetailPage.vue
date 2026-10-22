<template>
  <RecordDetail v-if="incentive" :title="incentive.id" :subtitle="`${incentive.driver} · ${incentive.period}`" :status="incentive.status" back-to="/app/incentives" :sections="sections">
    <template #actions>
      <v-btn variant="outlined" prepend-icon="mdi-pencil-outline" class="rounded-lg text-none" @click="crud.openEdit(incentive)">Edit</v-btn>
      <v-btn variant="outlined" color="error" prepend-icon="mdi-delete-outline" class="rounded-lg text-none" @click="crud.askRemove(incentive)">Delete</v-btn>
    </template>
    <RelatedTable title="Driver" :columns="driverColumns" :items="linkedDrivers" :link-to="driverLink" empty="Driver not found in the list." />
    <IncentiveFormDialog v-model="crud.formOpen" :row="crud.editing" @save="crud.save" />
    <ConfirmDialog v-model="crud.confirmOpen" title="Delete incentive?" :text="`${incentive.id} will be removed.`" @confirm="onDelete" />
  </RecordDetail>
  <NotFound v-else back-to="/app/incentives" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { DetailSection, Incentive } from '@/types'
import { drivers } from '@/mock/assets'
import { incentives } from '@/mock/invoices'
import { useCrud } from '@/composables/useCrud'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import NotFound from '@/components/common/NotFound.vue'
import RecordDetail from '@/components/common/RecordDetail.vue'
import RelatedTable from '@/components/common/RelatedTable.vue'
import { driverColumns, driverLink } from '../assets/config'
import IncentiveFormDialog from './components/IncentiveFormDialog.vue'

const route = useRoute()
const router = useRouter()
const incentive = computed(() => incentives.find(i => i.id === route.params.id))
const crud = useCrud<Incentive>(incentives, { prefix: '' })
const linkedDrivers = computed(() => drivers.filter(d => d.name === incentive.value?.driver))

const sections = computed<DetailSection[]>(() => {
  const i = incentive.value!
  return [
    { title: 'Performance', items: [{ label: 'Driver', value: i.driver }, { label: 'Period', value: i.period }, { label: 'Trips', value: i.trips }, { label: 'On-time', value: i.onTime }, { label: 'Fuel saving', value: i.fuel }] },
    { title: 'Payout', items: [{ label: 'Incentive', value: i.amount, type: 'money' }] },
  ]
})

function onDelete () {
  if (crud.remove()) router.replace('/app/incentives')
}
</script>
