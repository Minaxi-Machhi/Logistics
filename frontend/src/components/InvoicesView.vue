<template>
  <v-container fluid class="px-4 py-0">
    <!-- Header Area -->
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px;">
      <div>
        <h2 class="text-h6 font-weight-bold text-slate-800 d-flex align-center">
          <v-icon color="primary" class="mr-2" size="20">mdi-file-document-outline</v-icon>
          Invoicing & Billing
        </h2>
        <p class="text-caption text-medium-emphasis mb-0">
          Review automatically compiled VAT invoices and transaction records
        </p>
      </div>
      <div>
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Billing Status"
          density="compact"
          hide-details
          variant="outlined"
          color="primary"
          style="max-width: 180px"
        ></v-select>
      </div>
    </div>

    <!-- Invoices Table -->
    <v-card class="glass-card rounded-lg overflow-hidden" elevation="2">
      <v-table hover density="comfortable">
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold text-left">Invoice ID</th>
            <th class="font-weight-bold text-left">Order Reference</th>
            <th class="font-weight-bold text-left">Customer / Client</th>
            <th class="font-weight-bold text-left">Date Generated</th>
            <th class="font-weight-bold text-right">Subtotal (AED)</th>
            <th class="font-weight-bold text-right">VAT (5%)</th>
            <th class="font-weight-bold text-right">Total Amount</th>
            <th class="font-weight-bold text-center">Status</th>
            <th class="font-weight-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in filteredInvoices" :key="invoice.id">
            <td class="font-weight-bold text-primary">{{ invoice.id }}</td>
            <td class="font-weight-medium text-slate-700">
              {{ invoice.orderId }}
            </td>
            <td class="font-weight-medium">{{ invoice.customer }}</td>
            <td>{{ formatDate(invoice.createdAt) }}</td>
            <td class="text-right">AED {{ invoice.amount.toFixed(2) }}</td>
            <td class="text-right text-caption text-medium-emphasis">
              AED {{ invoice.tax.toFixed(2) }}
            </td>
            <td class="text-right font-weight-bold text-slate-800">
              AED {{ invoice.total.toFixed(2) }}
            </td>
            <td class="text-center">
              <v-chip
                size="small"
                :color="getStatusColor(invoice.status)"
                class="font-weight-bold"
              >
                {{ invoice.status }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn
                density="compact"
                text="View"
                size="small"
                color="primary"
                @click="openInvoiceDetails(invoice)"
              >
              </v-btn>
            </td>
          </tr>
          <tr v-if="filteredInvoices.length === 0">
            <td colspan="9" class="text-center py-8 text-medium-emphasis">
              <v-icon size="40" color="grey" class="mb-2"
                >mdi-file-remove-outline</v-icon
              >
              <div>
                No invoices found. Complete a trip in the simulation to generate
                invoices.
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Professional VAT Invoice Drawer -->
    <v-navigation-drawer
      v-model="invoiceDrawer"
      location="right"
      temporary
      width="750"
      class="pa-0"
    >
      <div v-if="selectedInvoice" class="d-flex flex-column h-100 bg-white">
        <!-- Drawer Header -->
        <div
          class="pa-4 bg-primary text-white d-flex justify-space-between align-center"
        >
          <span class="text-h6 font-weight-bold">VAT Tax Invoice Details</span>
          <div class="d-flex gap-2">
            <v-btn
              color="white"
              variant="outlined"
              size="small"
              class="font-weight-bold"
              prepend-icon="mdi-cash"
              v-if="selectedInvoice.status !== 'Paid'"
              @click="markInvoiceAsPaid(selectedInvoice)"
            >
              Mark As Paid
            </v-btn>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="invoiceDrawer = false"
            ></v-btn>
          </div>
        </div>

        <!-- Scrollable Invoice Sheet -->
        <div class="flex-grow-1 overflow-y-auto pa-8">
          <!-- Wared Logistics Invoice Template -->
          <div class="d-flex justify-space-between align-start mb-6">
            <div>
              <v-img
                src="@/assets/logo.png"
                alt="Wared Logo"
                max-width="180"
                contain
                class="mb-2"
              />
              <div class="text-caption text-medium-emphasis">
                Wared Logistics LLC<br />
                P.O. Box 29402, Jebel Ali Free Zone<br />
                Dubai, United Arab Emirates<br />
                TRN: 100382902910003
              </div>
            </div>
            <div class="text-right">
              <h2 class="text-h4 font-weight-bold text-primary mb-1">
                TAX INVOICE
              </h2>
              <div class="text-subtitle-2 font-weight-bold text-slate-700">
                Invoice: {{ selectedInvoice.id }}
              </div>
              <div class="text-caption text-medium-emphasis mt-2">
                Date: {{ formatDateOnly(selectedInvoice.createdAt) }}<br />
                Due Date: {{ formatDateOnly(selectedInvoice.dueDate) }}<br />
                Trip ID: {{ selectedInvoice.tripId }}
              </div>
              <div class="mt-2">
                <v-chip
                  size="small"
                  :color="getStatusColor(selectedInvoice.status)"
                  class="font-weight-bold"
                >
                  {{ selectedInvoice.status.toUpperCase() }}
                </v-chip>
              </div>
            </div>
          </div>

          <v-divider class="my-6"></v-divider>

          <!-- Billing Info -->
          <v-row class="mb-6">
            <v-col cols="6">
              <v-card
                class="pa-4 bg-grey-lighten-5 rounded-lg border-s-4 border-s-primary"
                flat
              >
                <div
                  class="text-caption text-medium-emphasis font-weight-bold mb-1"
                >
                  BILL TO:
                </div>
                <div class="font-weight-bold text-subtitle-1 text-slate-800">
                  {{ selectedInvoice.customer }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Wared Logistics Logistics Center & Kitchen<br />
                  Al Barsha Industrial Area 3, Dubai<br />
                  United Arab Emirates<br />
                  TRN: 100491829300002
                </div>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="pa-4 bg-grey-lighten-5 rounded-lg border" flat>
                <div
                  class="text-caption text-medium-emphasis font-weight-bold mb-1"
                >
                  PAYMENT DETAILS:
                </div>
                <div class="text-caption text-slate-700">
                  <strong>Bank Name:</strong> Emirates NBD PJSC<br />
                  <strong>Account Name:</strong> Wared Logistics LLC<br />
                  <strong>IBAN:</strong> AE120230000000000000101<br />
                  <strong>Swift Code:</strong> ENBD AEAD
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Itemized Table -->
          <v-table class="border rounded-lg mb-6">
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="font-weight-bold text-left">Description</th>
                <th class="font-weight-bold text-right">Qty Stops</th>
                <th class="font-weight-bold text-right">Weight (kg)</th>
                <th class="font-weight-bold text-right">Rate (AED)</th>
                <th class="font-weight-bold text-right">Taxable Val (AED)</th>
                <th class="font-weight-bold text-right">VAT (5%)</th>
                <th class="font-weight-bold text-right">Net Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="font-weight-bold">
                    Primary Freight Distribution Services
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Order Ref: {{ selectedInvoice.orderId }}
                  </div>
                </td>
                <td class="text-right">2 Stops</td>
                <td class="text-right">750 kg</td>
                <td class="text-right">
                  AED {{ selectedInvoice.amount.toLocaleString() }}
                </td>
                <td class="text-right">
                  AED {{ selectedInvoice.amount.toLocaleString() }}
                </td>
                <td class="text-right">
                  AED {{ selectedInvoice.tax.toFixed(2) }}
                </td>
                <td class="text-right font-weight-bold">
                  AED {{ selectedInvoice.total.toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Totals Area -->
          <v-row justify="end" class="mb-8">
            <v-col cols="12" sm="6" md="5" class="text-right">
              <div class="d-flex justify-space-between py-1 text-subtitle-2">
                <span class="text-medium-emphasis">Subtotal (Excl. VAT):</span>
                <span>AED {{ selectedInvoice.amount.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-space-between py-1 text-subtitle-2">
                <span class="text-medium-emphasis">Total VAT (5%):</span>
                <span>AED {{ selectedInvoice.tax.toFixed(2) }}</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div
                class="d-flex justify-space-between py-1 text-h6 font-weight-bold text-primary"
              >
                <span>Grand Total:</span>
                <span>AED {{ selectedInvoice.total.toFixed(2) }}</span>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- Terms -->
          <div class="text-caption text-medium-emphasis text-center">
            Invoice generated electronically. Net payment term is 30 days from
            invoice date.<br />
            For billing inquiries, email: billing@waredlogistics.com • Call:
            +971 4 800 WARED
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { store } from "@/state";

const statusFilter = ref("All Invoices");
const statusOptions = ["All Invoices", "Draft", "Sent", "Paid"];

const invoiceDrawer = ref(false);
const selectedInvoice = ref(null);

const filteredInvoices = computed(() => {
  return store.invoices.filter((inv) => {
    return (
      statusFilter.value === "All Invoices" || inv.status === statusFilter.value
    );
  });
});

function getStatusColor(status) {
  switch (status) {
    case "Draft":
      return "grey";
    case "Sent":
      return "info";
    case "Paid":
      return "success";
    default:
      return "grey";
  }
}

function formatDate(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function openInvoiceDetails(invoice) {
  selectedInvoice.value = invoice;
  invoiceDrawer.value = true;
}

function markInvoiceAsPaid(invoice) {
  invoice.status = "Paid";
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}
.h-100 {
  height: 100%;
}
.border-s-4 {
  border-left-width: 4px !important;
}
</style>
