<template>
  <FormDialog
    :model-value="!!flow.confirming"
    :title="`Confirm ${flow.confirming?.id}`"
    submit-label="Confirm order"
    :fields="rateFields"
    :row="flow.confirming"
    @update:model-value="v => { if (!v) flow.confirming = null }"
    @save="flow.applyRate"
  />
  <FormDialog
    :model-value="!!flow.planning"
    :title="`Create trip for ${flow.planning?.id}`"
    submit-label="Create trip"
    :fields="tripFields"
    @update:model-value="v => { if (!v) flow.planning = null }"
    @save="flow.createTrip"
  />
  <ConfirmDialog
    :model-value="!!flow.cancelling"
    title="Cancel order?"
    :text="`${flow.cancelling?.id} will be marked Cancelled. This can't be undone.`"
    confirm-label="Cancel order"
    @update:model-value="v => { if (!v) flow.cancelling = null }"
    @confirm="flow.cancel()"
  />
  <ConfirmDialog
    :model-value="!!flow.readying"
    title="Mark ready for invoice?"
    :text="`${flow.readying?.id} is completed. Marking it ready lets you generate its invoice next.`"
    confirm-label="Ready for invoice"
    confirm-color="primary"
    @update:model-value="v => { if (!v) flow.readying = null }"
    @confirm="flow.confirmReady()"
  />
  <ConfirmDialog
    :model-value="!!flow.invoicing"
    title="Generate invoice?"
    :text="`An invoice for ${flow.invoicing?.id} will be created at its sell rate plus 5% VAT.`"
    confirm-label="Generate invoice"
    confirm-color="primary"
    @update:model-value="v => { if (!v) flow.invoicing = null }"
    @confirm="flow.confirmInvoice()"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FieldDef } from '@/types'
import { drivers, vehicles } from '@/mock/assets'
import type { OrderFlow } from '@/composables/useOrderFlow'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import FormDialog from '@/components/common/FormDialog.vue'
import { date, num, req, select } from '../../fields'

defineProps<{ flow: OrderFlow }>()

const rateFields: FieldDef[] = [num('rate', 'Sell rate', { ...req, hint: 'Rate applied to this order' })]

// Offer free drivers and vehicles first; fall back to everyone if none are free.
const freeDrivers = computed(() => (drivers.some(d => d.status === 'Available') ? drivers.filter(d => d.status === 'Available') : drivers).map(d => d.name))
const freeVehicles = computed(() => (vehicles.some(v => v.status === 'Available') ? vehicles.filter(v => v.status === 'Available') : vehicles).map(v => v.id))

const tripFields = computed<FieldDef[]>(() => [
  select('driver', 'Driver', freeDrivers.value, req),
  select('vehicle', 'Vehicle', freeVehicles.value, req),
  date('departure', 'Departure', { value: '2026-10-22' }),
  date('eta', 'ETA', { value: '2026-10-23' }),
])
</script>
