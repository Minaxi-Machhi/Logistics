<template>
  <v-container fluid class="pa-6">
    <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-4">
      <div>
        <h1 class="page-title">{{ mod.title }}</h1>
        <div class="text-body-2 text-medium-emphasis">{{ mod.subtitle }}</div>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" class="rounded-lg font-weight-bold" @click="openNew">{{ mod.action }}</v-btn>
    </div>

    <v-tabs v-if="mod.tabs" v-model="tab" color="primary" class="mb-4">
      <v-tab v-for="t in mod.tabs" :key="t.key" :value="t.key" class="text-none">
        {{ t.title }}
        <v-chip size="x-small" class="ml-2 font-mono" label>{{ t.data.items.length }}</v-chip>
      </v-tab>
    </v-tabs>

    <DataTable
      :key="`${route.name}-${tab}`"
      :columns="data.columns"
      :items="data.items"
      :search-label="`Search ${mod.title.toLowerCase()}`"
      @edit="openEdit"
      @remove="askRemove"
    />

    <FormDialog
      v-model="dialog"
      :title="editing ? `Edit ${recordName}` : `${mod.action}`"
      :submit-label="editing ? 'Save changes' : 'Create'"
      :fields="data.form.fields"
      :row="editing"
      @save="save"
    />

    <v-dialog v-model="confirm" max-width="400">
      <v-card class="rounded-lg">
        <v-card-title class="text-h6 font-weight-medium pa-4">Delete record?</v-card-title>
        <v-card-text>{{ target?.[data.form.idKey] }} will be removed from this list.</v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" class="rounded-lg text-none" @click="confirm = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" class="rounded-lg text-none font-weight-bold" @click="remove">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="toast" color="success" timeout="2500">{{ toastText }}</v-snackbar>
  </v-container>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MODULES } from '@/mock/data'
import DataTable from '@/components/DataTable.vue'
import FormDialog from '@/components/FormDialog.vue'

const route = useRoute()
const mod = computed(() => MODULES[route.meta.module])
const tab = ref(mod.value.tabs?.[0].key)

watch(mod, m => { tab.value = m.tabs?.[0].key })

const data = computed(() => mod.value.tabs ? mod.value.tabs.find(t => t.key === tab.value).data : mod.value.data)

const dialog = ref(false)
const editing = ref(null)
const confirm = ref(false)
const target = ref(null)
const toast = ref(false)
const toastText = ref('')

const recordName = computed(() => (mod.value.tabs?.find(t => t.key === tab.value).title ?? mod.value.title).replace(/s$/, ''))

function notify (text) { toastText.value = text; toast.value = true }

function openNew () { editing.value = null; dialog.value = true }
function openEdit (row) { editing.value = row; dialog.value = true }
function askRemove (row) { target.value = row; confirm.value = true }

function nextId (form, items) {
  const max = items.reduce((m, r) => Math.max(m, parseInt(String(r[form.idKey]).replace(/\D+/g, ''), 10) || 0), 0)
  return `${form.prefix}${max + 1}`
}

function save (values) {
  const { form, items } = data.value
  const withDerived = form.derive ?? (r => r)
  if (editing.value) {
    Object.assign(editing.value, withDerived({ ...editing.value, ...values }))
    notify(`${editing.value[form.idKey]} updated`)
  } else {
    // vehicles are keyed by their registration, which the user types in
    const row = withDerived({ [form.idKey]: nextId(form, items), ...values })
    items.unshift(row)
    notify(`${row[form.idKey]} created`)
  }
}

function remove () {
  const { items, form } = data.value
  items.splice(items.indexOf(target.value), 1)
  confirm.value = false
  notify(`${target.value[form.idKey]} deleted`)
}
</script>
