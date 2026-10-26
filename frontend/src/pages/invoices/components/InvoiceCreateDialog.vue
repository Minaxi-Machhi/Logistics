<template>
  <v-dialog :model-value="modelValue" max-width="860" scrollable @update:model-value="emit('update:modelValue', $event)">
    <v-card class="rounded-lg">
      <div class="d-flex align-start pa-4 pb-2">
        <div class="flex-grow-1">
          <div class="text-subtitle-1 font-weight-bold">New invoice</div>
          <div class="text-caption text-primary">Created as Draft</div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" color="primary" aria-label="Close" @click="close" />
      </div>
      <v-divider />

      <v-card-text class="pa-4">
        <div class="grid">
          <FormField label="Customer" required>
            <v-select v-model="customer" :items="customerItems" placeholder="Select customer" v-bind="control">
              <template #item="{ props, item }">
                <v-list-item v-bind="props" :title="item.value">
                  <template #append><v-chip v-if="item.count" size="x-small" label color="primary" variant="tonal">{{ item.count }} ready</v-chip></template>
                </v-list-item>
              </template>
            </v-select>
          </FormField>
          <FormField label="Invoice date" required><v-text-field v-model="invoiceDate" type="date" v-bind="control" /></FormField>
          <FormField label="Due date" required><v-text-field v-model="dueDate" type="date" :error-messages="dateError" v-bind="control" /></FormField>
        </div>

        <div class="d-flex align-center mt-4 mb-2">
          <div class="text-body-2 font-weight-bold">Orders ready for invoice</div>
          <v-spacer />
          <span v-if="ready.length" class="text-caption text-medium-emphasis">{{ picked.length }} of {{ ready.length }} selected</span>
        </div>

        <div class="orders border rounded-lg">
          <div v-if="!customer" class="empty">Pick a customer to see the orders ready to invoice.</div>
          <div v-else-if="!ready.length" class="empty">{{ customer }} has no orders in Ready for invoice.</div>
          <v-table v-else density="compact" fixed-header>
            <thead>
              <tr>
                <th style="width: 44px"><v-checkbox-btn :model-value="allPicked" :indeterminate="!!picked.length && !allPicked" density="compact" aria-label="Select all" @update:model-value="toggleAll" /></th>
                <th>Order</th><th>Route</th><th>Loading</th><th>Job type</th><th class="text-end">Sell rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in ready" :key="o.id" class="pick" @click="toggle(o.id)">
                <td @click.stop><v-checkbox-btn :model-value="selected.includes(o.id)" density="compact" :aria-label="`Select ${o.id}`" @update:model-value="toggle(o.id)" /></td>
                <td class="font-mono">{{ o.id }}</td>
                <td class="text-no-wrap">{{ o.origin }} → {{ o.destination }}</td>
                <td class="text-no-wrap">{{ o.loading }}</td>
                <td>{{ o.jobType }}</td>
                <td class="text-end">{{ money(o.rate) }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>
      <v-divider />

      <div class="d-flex align-center flex-wrap gap-3 pa-3 px-4">
        <div class="totals text-body-2">
          <span class="text-medium-emphasis">Amount</span> <b>{{ money(amount) }}</b>
          <span class="text-medium-emphasis ml-3">VAT (5%)</span> <b>{{ money(vat) }}</b>
          <span class="text-medium-emphasis ml-3">Total</span> <b class="text-primary">{{ money(amount + vat) }}</b>
        </div>
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-lg text-none font-weight-bold" :disabled="!canCreate" @click="create">Create invoice</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { notify } from '@/composables/useToast'
import { money } from '@/mock/country'
import { createInvoice, customersByReady, readyOrdersFor } from '@/mock/invoiceOps'
import { addDays, TODAY } from '@/mock/lookups'
import FormField from '@/components/common/FormField.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [open: boolean], created: [id: string] }>()

const control = { 'persistent-placeholder': true, variant: 'outlined' as const, density: 'compact' as const, 'hide-details': 'auto' as const, rounded: 'lg' as const }

const toIso = (dmy: string) => dmy.split('/').reverse().join('-')
const toDmy = (iso: string) => iso.split('-').reverse().join('/')

const customer = ref<string | null>(null)
const invoiceDate = ref(toIso(TODAY))
const dueDate = ref(toIso(addDays(TODAY, 30)))
const selected = ref<string[]>([])

const customerItems = computed(() => (props.modelValue ? customersByReady() : []))
const ready = computed(() => (customer.value ? readyOrdersFor(customer.value) : []))
const picked = computed(() => ready.value.filter(o => selected.value.includes(o.id)))
const allPicked = computed(() => ready.value.length > 0 && picked.value.length === ready.value.length)

const amount = computed(() => picked.value.reduce((n, o) => n + o.rate, 0))
const vat = computed(() => Math.round(amount.value * 0.05))
const dateError = computed(() => (dueDate.value && invoiceDate.value && dueDate.value < invoiceDate.value ? 'Due date is before the invoice date' : ''))
const canCreate = computed(() => !!customer.value && picked.value.length > 0 && !!invoiceDate.value && !!dueDate.value && !dateError.value)

// Changing customer starts a fresh selection; all of their ready orders are ticked.
watch(customer, () => { selected.value = ready.value.map(o => o.id) })
watch(() => props.modelValue, open => {
  if (!open) return
  customer.value = null
  selected.value = []
  invoiceDate.value = toIso(TODAY)
  dueDate.value = toIso(addDays(TODAY, 30))
})

const toggle = (id: string) => { selected.value = selected.value.includes(id) ? selected.value.filter(x => x !== id) : [...selected.value, id] }
const toggleAll = (on: boolean | null) => { selected.value = on ? ready.value.map(o => o.id) : [] }
const close = () => emit('update:modelValue', false)

function create () {
  if (!canCreate.value || !customer.value) return
  const invoice = createInvoice(customer.value, toDmy(invoiceDate.value), toDmy(dueDate.value), picked.value.map(o => o.id))
  notify(`${invoice.id} created as Draft for ${picked.value.length} orders`)
  emit('created', invoice.id)
  close()
}
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px 16px; }
.empty { padding: 28px 16px; text-align: center; font-size: 13px; color: rgba(var(--v-theme-on-surface), 0.6); }
.orders { overflow: auto; max-height: 280px; }
.pick { cursor: pointer; }
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
@media (max-width: 640px) { .grid { grid-template-columns: minmax(0, 1fr); } }
</style>
