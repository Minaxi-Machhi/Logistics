<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-4 align-center justify-between">
      <v-col cols="12" md="6">
        <h2 class="text-h4 font-weight-bold text-slate-800 d-flex align-center">
          <v-icon color="secondary" class="mr-2">mdi-account-circle-outline</v-icon>
          Wared Logistics Client Portal
        </h2>
        <p class="text-subtitle-2 text-medium-emphasis">Submit distribution requests, monitor cold-chain telemetry, and view invoice accounts</p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-btn
          color="secondary"
          prepend-icon="mdi-plus"
          size="default"
          class="rounded-lg font-weight-bold"
          @click="openBooking"
        >
          Book Delivery Request
        </v-btn>
      </v-col>
    </v-row>

    <!-- Content Grid -->
    <v-row>
      <!-- Left Column: Orders & Invoices List -->
      <v-col cols="12" lg="7">
        <!-- Active Shipments Timeline Card -->
        <v-card class="glass-card pa-4 pt-0 rounded-lg mb-4" elevation="2">
          <h3 class="text-h6 font-weight-bold mb-4 text-slate-800 d-flex align-center">
            <v-icon color="secondary" class="mr-2" size="22">mdi-clock-outline</v-icon>
            Your Active Shipments
          </h3>

          <div v-if="activeCustomerOrders.length === 0" class="text-center py-6 text-medium-emphasis text-body-2">
            No active shipments currently in transit.
          </div>

          <div v-for="order in activeCustomerOrders" :key="order.id" class="border rounded-lg pa-4 mb-4 bg-grey-lighten-5">
            <div class="d-flex justify-space-between align-center mb-3">
              <div>
                <span class="font-weight-bold text-primary text-subtitle-1">{{ order.id }}</span>
                <span class="text-caption text-medium-emphasis ml-2">Booked: {{ formatDate(order.createdAt) }}</span>
              </div>
              <v-chip :color="getStatusColor(order.status)" class="font-weight-bold" size="small">
                {{ order.status }}
              </v-chip>
            </div>

            <!-- Custom Timeline Stepper -->
            <v-row class="px-2 pt-2 text-center text-caption font-weight-bold text-medium-emphasis">
              <v-col cols="3" :class="getTimelineStepClass(order.status, 1)">
                <v-icon size="16">mdi-check-circle</v-icon>
                <div class="mt-1">Ordered</div>
              </v-col>
              <v-col cols="3" :class="getTimelineStepClass(order.status, 2)">
                <v-icon size="16">mdi-truck-cargo-container</v-icon>
                <div class="mt-1">Planned / Scheduled</div>
              </v-col>
              <v-col cols="3" :class="getTimelineStepClass(order.status, 3)">
                <v-icon size="16" :class="order.status === 'En Route' ? 'pulse-marker' : ''">mdi-radiobox-marked</v-icon>
                <div class="mt-1">In Transit</div>
              </v-col>
              <v-col cols="3" :class="getTimelineStepClass(order.status, 4)">
                <v-icon size="16">mdi-package-variant-closed-check</v-icon>
                <div class="mt-1">Delivered</div>
              </v-col>
            </v-row>

            <v-divider class="my-3"></v-divider>

            <!-- Stops info -->
            <div class="text-caption">
              <div class="font-weight-bold text-slate-700 mb-1">Stops:</div>
              <div v-for="(stop, idx) in order.stops" :key="stop.id" class="d-flex justify-space-between align-center py-1">
                <span>Stop {{ idx + 1 }}: {{ stop.address }}</span>
                <v-chip size="x-small" :color="stop.status === 'Delivered' ? 'success' : 'grey'" class="font-weight-bold">
                  {{ stop.status }}
                </v-chip>
              </div>
            </div>

            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-end">
              <v-btn
                size="small"
                variant="tonal"
                color="secondary"
                prepend-icon="mdi-eye-outline"
                class="font-weight-bold rounded-lg"
                @click="viewOrderDetails(order)"
              >
                Track & Details
              </v-btn>
            </div>
          </div>
        </v-card>

        <!-- Customer Invoice Listing -->
        <v-card class="glass-card pa-4 rounded-lg" elevation="2">
          <h2 class="text-h6 font-weight-bold mb-4 text-slate-800 d-flex align-center">
            <v-icon color="secondary" class="mr-2" size="22">mdi-file-document-outline</v-icon>
            Billing Statements & Invoices
          </h2>

          <v-table hover density="comfortable">
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="font-weight-bold">Invoice ID</th>
                <th class="font-weight-bold">Date</th>
                <th class="font-weight-bold">Order Ref</th>
                <th class="font-weight-bold text-right">Total Amount</th>
                <th class="font-weight-bold text-center">Status</th>
                <th class="font-weight-bold text-center">View</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invoice in customerInvoices" :key="invoice.id">
                <td class="font-weight-bold text-primary">{{ invoice.id }}</td>
                <td>{{ formatDateOnly(invoice.createdAt) }}</td>
                <td class="font-weight-medium text-slate-600">{{ invoice.orderId }}</td>
                <td class="text-right font-weight-bold">AED {{ invoice.total.toFixed(2) }}</td>
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
                    icon="mdi-printer-outline"
                    variant="text"
                    color="primary"
                    density="comfortable"
                    @click="viewInvoice(invoice)"
                  ></v-btn>
                </td>
              </tr>
              <tr v-if="customerInvoices.length === 0">
                <td colspan="6" class="text-center py-6 text-medium-emphasis">No invoices generated yet.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Right Column: Tracking Map / Status -->
      <v-col cols="12" lg="5">
        <v-card class="map-container pa-0 fill-height d-flex flex-column" elevation="3" style="min-height: 480px;">
          <div class="pa-4 bg-white border-b d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-chip
                v-if="isTransitActive"
                color="warning"
                class="font-weight-bold mr-2 pulse-marker"
                size="small"
              >
                LIVE
              </v-chip>
              <span class="text-subtitle-2 font-weight-bold text-slate-700">
                {{ isTransitActive ? 'Active Delivery Vehicle Map' : 'Shipment Tracking Map' }}
              </span>
            </div>
            <div v-if="isTransitActive" class="text-caption text-medium-emphasis font-weight-bold">
              <v-icon size="14" color="info" class="mr-1">mdi-snowflake</v-icon>
              3.6 °C Chilled Segment Lock
            </div>
          </div>

          <!-- SVG UAE Map (Simplified client version) -->
          <div class="flex-grow-1 relative d-flex align-center justify-center bg-grey-lighten-4" style="overflow: hidden;">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 350"
              preserveAspectRatio="xMidYMid meet"
              class="w-100 h-100"
              style="max-height: 400px;"
            >
              <rect width="100%" height="100%" fill="rgba(21,73,156,0.01)" />
              <path
                d="M 50 180 Q 120 120 250 110 T 360 80 L 370 200 Q 250 220 190 280 T 80 320 Z"
                fill="rgba(21,73,156,0.01)"
                stroke="rgba(21,73,156,0.04)"
                stroke-width="2"
              />

              <!-- Highway Routes -->
              <path d="M 220 150 L 160 195 L 80 250" fill="none" stroke="#e2e8f0" stroke-width="3" />
              <path d="M 220 150 L 250 120" fill="none" stroke="#e2e8f0" stroke-width="3" />

              <!-- Dubai Hub -->
              <circle cx="220" cy="150" r="4" fill="#15499C" />
              <text x="226" y="153" font-size="7" font-weight="bold" fill="#64748b">Dubai Hub</text>

              <!-- Client stops for active order -->
              <g v-if="activeTrip && isTransitActive">
                <g v-for="(stop, idx) in activeTrip.orders.flatMap(o => o.stops)" :key="stop.id">
                  <circle
                    :cx="getStopCoords(stop.address).x"
                    :cy="getStopCoords(stop.address).y"
                    r="5"
                    :fill="stop.status === 'Delivered' ? '#2E7D32' : '#cbd5e1'"
                    stroke="#15499C"
                    stroke-width="1"
                  />
                  <text
                    :x="getStopCoords(stop.address).x + 6"
                    :y="getStopCoords(stop.address).y + 2"
                    font-size="6"
                    fill="#64748b"
                  >
                    Stop {{ idx + 1 }}
                  </text>
                </g>
              </g>

              <!-- Live moving truck tracker -->
              <g
                v-if="isTransitActive"
                :transform="`translate(${store.simulatedVehiclePosition.x}, ${store.simulatedVehiclePosition.y})`"
              >
                <circle
                  cx="0"
                  cy="0"
                  r="10"
                  fill="rgba(92,107,192,0.3)"
                  class="pulse-marker"
                  style="animation: pulse-ring 1.5s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;"
                />
                <circle cx="0" cy="0" r="6" fill="#5C6BC0" stroke="#fff" stroke-width="1.5" />
              </g>
            </svg>

            <!-- Status HUD Overlay -->
            <div
              v-if="isTransitActive"
              class="absolute pa-3 rounded-lg border bg-white shadow-lg text-caption"
              style="bottom: 12px; left: 12px; max-width: 260px; z-index: 10;"
            >
              <div class="font-weight-bold text-secondary mb-1">
                Wared Live Tracker
              </div>
              <div class="text-medium-emphasis">
                Assigned Vehicle: {{ activeTrip?.vehicle.name }}
              </div>
              <v-divider class="my-1"></v-divider>
              <div class="font-weight-bold text-success">
                {{ store.simulatedTripStatusText }}
              </div>
            </div>
            <div
              v-else
              class="absolute text-caption text-medium-emphasis text-center pa-8 w-100"
            >
              <v-icon size="36" color="grey" class="mb-2">mdi-map-marker-off-outline</v-icon>
              <div>No active deliveries on route right now.</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create Request Dialog -->
    <v-dialog v-model="openOrderDialog" max-width="720px" width="100%" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-subtitle-1 font-weight-bold text-secondary px-5 py-4 d-flex justify-space-between align-center border-b">
          <div class="d-flex align-center gap-2">
            <span>Book Delivery Request</span>
          </div>
          <v-btn icon="mdi-close" variant="text" density="compact" @click="openOrderDialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-5" style="max-height: 70vh; overflow-y: auto;">
          <v-form ref="requestForm" v-model="requestFormValid">
            
            <!-- SECTION 1: General Info -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="secondary">mdi-information-outline</v-icon>
              General Information
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-text-field
                v-model="bookingData.reference_number"
                label="Reference Number *"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Reference number is required']"
              ></v-text-field>
              <v-text-field
                v-model="bookingData.expected_pickup_date"
                label="Expected Pickup Date *"
                type="date"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Expected pickup date is required']"
              ></v-text-field>
              <v-text-field
                v-model="bookingData.expected_delivery_date"
                label="Expected Delivery Date *"
                type="date"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Expected delivery date is required']"
              ></v-text-field>
            </div>

            <!-- SECTION 2: Routing -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="secondary">mdi-routes</v-icon>
              Route & Branches
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-text-field
                v-model="bookingData.pickup_address"
                label="Pickup Address *"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Pickup address is required']"
              ></v-text-field>
              <v-text-field
                v-model="bookingData.address"
                label="Drop Address (Primary) *"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Drop address is required']"
              ></v-text-field>
              <v-select
                v-model="bookingData.source_branch"
                :items="['Dubai Hub', 'Abu Dhabi Branch', 'Sharjah Depot']"
                label="Source Branch *"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
              ></v-select>
              <v-select
                v-model="bookingData.destination_branch"
                :items="['Dubai Hub', 'Abu Dhabi Branch', 'Sharjah Depot']"
                label="Destination Branch *"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
              ></v-select>
            </div>

            <!-- SECTION 3: Cargo Specs -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="secondary">mdi-cube-box-outline</v-icon>
              Cargo Specs & Temperature
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-select
                v-model="bookingData.type"
                :items="['LTL', 'FTL']"
                label="Delivery Class *"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
              ></v-select>
              <v-select
                v-model="bookingData.tempRequirement"
                :items="['Dry', 'Chilled']"
                label="Temperature Mode *"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
              ></v-select>
              <v-text-field
                v-model.number="bookingData.chargeable_weight"
                label="Chargeable Weight (kg) *"
                type="number"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Chargeable weight is required']"
              ></v-text-field>
              <v-text-field
                v-model.number="bookingData.gross_weight"
                label="Gross Weight (kg) *"
                type="number"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Gross weight is required']"
              ></v-text-field>
              <v-text-field
                v-model.number="bookingData.gross_volumetric_weight"
                label="Gross Volumetric Weight (kg) *"
                type="number"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Volumetric weight is required']"
              ></v-text-field>
              <v-text-field
                v-model.number="bookingData.volume"
                label="Volume (cbm) *"
                type="number"
                required
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Volume is required']"
              ></v-text-field>
            </div>

            <!-- SECTION 4: Flags & Remarks -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="secondary">mdi-tune-variant</v-icon>
              Operational Flags & Value
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-text-field
                v-model.number="bookingData.goods_value"
                label="Goods Value (AED) *"
                type="number"
                required
                prefix="AED"
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
                :rules="[v => !!v || 'Goods value is required']"
              ></v-text-field>
              <v-checkbox
                v-model="bookingData.is_pickup_gatepass_required"
                label="Pickup Gatepass Required"
                color="secondary"
                density="compact"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="bookingData.is_drop_gatepass_required"
                label="Drop Gatepass Required"
                color="secondary"
                density="compact"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="bookingData.is_delivery_note_required"
                label="Delivery Note Required"
                color="secondary"
                density="compact"
                hide-details
              ></v-checkbox>
            </div>

            <!-- Stop Contact Details -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="secondary">mdi-account-outline</v-icon>
              Destination Contact Person
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-text-field
                v-model="bookingData.contactName"
                label="Contact Person Name"
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
              ></v-text-field>
              <v-text-field
                v-model="bookingData.contactPhone"
                label="Contact Phone"
                variant="outlined"
                density="comfortable"
                color="secondary"
                hide-details="auto"
              ></v-text-field>
            </div>

            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="secondary">mdi-note-text-outline</v-icon>
              Remarks
            </div>
            <v-textarea
              v-model="bookingData.order_remarks"
              label="Order Remarks"
              variant="outlined"
              density="comfortable"
              color="secondary"
              rows="2"
              class="mb-4"
              hide-details="auto"
            ></v-textarea>

            <div class="mt-4 pa-3 bg-secondary-lighten-5 rounded border" style="background-color: rgba(92,107,192,0.05); border: 1px solid rgba(92,107,192,0.2) !important;">
              <div class="text-caption text-secondary font-weight-bold">Estimated Distribution Rate:</div>
              <div class="text-h6 font-weight-bold text-secondary">
                AED {{ estimatedPrice.toLocaleString() }}
              </div>
              <div class="text-caption text-medium-emphasis">
                Rate calculated automatically: AED 500 base fee + AED 1.5 per kg.
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="px-5 py-3">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" class="font-weight-bold" @click="openOrderDialog = false">Cancel</v-btn>
          <v-btn color="secondary" variant="flat" class="font-weight-bold px-6 rounded-lg" :disabled="!requestFormValid" @click="submitBooking">
            Book Delivery
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Invoice Details Dialog overlay -->
    <v-dialog v-model="showInvoiceDialog" max-width="700px">
      <v-card class="pa-6 rounded-xl">
        <div class="d-flex justify-space-between align-center mb-4">
          <span class="text-h6 font-weight-bold text-primary">VAT Tax Invoice Sheet</span>
          <v-btn icon="mdi-close" variant="text" @click="showInvoiceDialog = false"></v-btn>
        </div>
        <div v-if="selectedInvoice" class="bg-white text-caption">
          <!-- Wared Logistics Header -->
          <div class="d-flex justify-space-between mb-4">
            <div>
              <v-img src="@/assets/logo.png" max-width="150" contain class="mb-1" />
              <div>TRN: 100382902910003</div>
            </div>
            <div class="text-right">
              <h2 class="text-h6 font-weight-bold text-primary">TAX INVOICE</h2>
              <div>ID: {{ selectedInvoice.id }}</div>
              <div>Due: {{ formatDateOnly(selectedInvoice.dueDate) }}</div>
            </div>
          </div>
          <v-divider class="my-3"></v-divider>
          <!-- Bill to -->
          <div class="mb-4">
            <strong>Bill To:</strong><br />
            Wared Logistics Kitchens & Logistics Center<br />
            Al Barsha, Dubai • TRN: 100491829300002
          </div>
          <!-- Table -->
          <v-table class="border rounded-lg mb-4 text-caption">
            <thead>
              <tr class="bg-grey-lighten-4">
                <th>Description</th>
                <th class="text-right">Subtotal</th>
                <th class="text-right">VAT (5%)</th>
                <th class="text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Freight logistics order booking ({{ selectedInvoice.orderId }})</td>
                <td class="text-right">AED {{ selectedInvoice.amount.toFixed(2) }}</td>
                <td class="text-right">AED {{ selectedInvoice.tax.toFixed(2) }}</td>
                <td class="text-right font-weight-bold">AED {{ selectedInvoice.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </v-table>
          <div class="text-right font-weight-bold text-subtitle-1 text-primary">
            Grand Total: AED {{ selectedInvoice.total.toFixed(2) }}
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Customer Shipment Details Drawer -->
    <v-navigation-drawer
      v-model="detailsDrawer"
      location="right"
      temporary
      width="540"
      class="pa-0"
    >
      <div v-if="selectedOrder" class="d-flex flex-column h-100 bg-white">

        <!-- Drawer Header Bar -->
        <div class="pa-4 bg-secondary text-white d-flex justify-space-between align-center flex-shrink-0">
          <div>
            <div class="text-caption text-white opacity-70 font-weight-bold mb-1">TRACK SHIPMENT</div>
            <div class="text-h6 font-weight-bold">{{ selectedOrder.id }}</div>
            <div class="text-caption text-white opacity-90 mt-1">Ref: {{ selectedOrder.reference_number }}</div>
          </div>
          <div class="d-flex align-center gap-2">
            <v-chip
              :color="getStatusColor(selectedOrder.status)"
              class="font-weight-bold"
              size="small"
            >
              {{ selectedOrder.status }}
            </v-chip>
            <v-btn icon="mdi-close" variant="text" color="white" size="small" @click="detailsDrawer = false" />
          </div>
        </div>

        <!-- Tabs Navigation -->
        <v-tabs v-model="detailsTab" color="secondary" grow density="comfortable">
          <v-tab value="0" class="text-caption font-weight-bold">Route & Stops</v-tab>
          <v-tab value="1" class="text-caption font-weight-bold">Cargo & Flags</v-tab>
          <v-tab value="2" class="text-caption font-weight-bold">Transit Log</v-tab>
        </v-tabs>

        <!-- Tab Items -->
        <div class="flex-grow-1 overflow-y-auto pa-4">
          <v-window v-model="detailsTab">
            <!-- TAB 1: ROUTE & STOPS -->
            <v-window-item value="0">
              <!-- Route Branches Grid -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-secondary mb-2">BRANCH ROUTING</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px;">
                  <div>
                    <span class="text-caption text-medium-emphasis d-block">Source Hub</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.source_branch }}</span>
                  </div>
                  <div>
                    <span class="text-caption text-medium-emphasis d-block">Destination Hub</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.destination_branch }}</span>
                  </div>
                  <div>
                    <span class="text-caption text-medium-emphasis d-block">Current Hub</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.current_branch || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-caption text-medium-emphasis d-block">Next Route Hub</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.next_branch || '-' }}</span>
                  </div>
                </div>
              </v-card>

              <!-- Addresses Card -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-secondary mb-2">OPERATIONAL ROUTE</div>
                <div class="mb-2">
                  <span class="text-caption text-medium-emphasis d-block">Pickup Address</span>
                  <span class="text-body-2 text-slate-800 font-weight-medium">{{ selectedOrder.pickup_address }}</span>
                </div>
                <div>
                  <span class="text-caption text-medium-emphasis d-block">Drop Address</span>
                  <span class="text-body-2 text-slate-800 font-weight-medium">{{ selectedOrder.drop_address }}</span>
                </div>
              </v-card>

              <!-- Distribution Rate Card -->
              <v-card flat class="pa-4 rounded-lg mb-4 d-flex align-center justify-space-between" style="background: linear-gradient(135deg, rgba(92,107,192,0.05), rgba(92,107,192,0.1)); border: 1px solid rgba(92,107,192,0.2);">
                <div>
                  <div class="text-caption font-weight-bold text-secondary">DISTRIBUTION BOOKING RATE</div>
                  <div class="text-h5 font-weight-bold text-secondary mt-1">AED {{ selectedOrder.order_rate.toLocaleString() }}</div>
                </div>
                <v-avatar color="secondary" variant="tonal" rounded="lg" size="48">
                  <v-icon size="26" color="secondary">mdi-cash-multiple</v-icon>
                </v-avatar>
              </v-card>

              <!-- Delivery Stops Timeline -->
              <div class="d-flex align-center mb-3">
                <v-icon color="secondary" size="18" class="mr-2">mdi-map-marker-path</v-icon>
                <span class="text-subtitle-2 font-weight-bold text-slate-800">Route Stops Timeline ({{ selectedOrder.stops.length }})</span>
              </div>
              <div class="pl-2">
                <div
                  v-for="(stop, index) in selectedOrder.stops"
                  :key="stop.id"
                  class="d-flex mb-4"
                  style="position: relative; padding-left: 40px;"
                >
                  <div
                    class="d-flex align-center justify-center rounded-circle font-weight-bold text-caption text-white"
                    :class="stop.status === 'Delivered' ? 'bg-success' : 'bg-secondary'"
                    style="width: 26px; height: 26px; position: absolute; left: 0; top: 2px; flex-shrink: 0;"
                  >
                    <v-icon v-if="stop.status === 'Delivered'" size="14" color="white">mdi-check</v-icon>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <div
                    v-if="index < selectedOrder.stops.length - 1"
                    style="position: absolute; left: 12px; top: 28px; width: 2px; height: calc(100% + 8px); background: #e2e8f0;"
                  />
                  <v-card flat class="pa-3 rounded-lg border flex-grow-1" :class="stop.status === 'Delivered' ? 'border-success' : ''">
                    <div class="d-flex justify-space-between align-start mb-1">
                      <div class="font-weight-bold text-body-2 text-wrap text-slate-800" style="max-width: 75%;">
                        {{ stop.address }}
                      </div>
                      <v-chip
                        size="x-small"
                        :color="stop.status === 'Delivered' ? 'success' : 'secondary'"
                        class="font-weight-bold ml-1 flex-shrink-0"
                      >
                        {{ stop.status }}
                      </v-chip>
                    </div>
                    <div class="text-caption text-medium-emphasis d-flex align-center mt-1">
                      <v-icon size="13" class="mr-1">mdi-account-outline</v-icon>
                      {{ stop.contactName || 'No contact' }}
                      <span v-if="stop.contactPhone" class="mx-1">•</span>
                      <v-icon v-if="stop.contactPhone" size="13" class="mr-1">mdi-phone-outline</v-icon>
                      {{ stop.contactPhone }}
                    </div>
                    <div class="text-caption font-weight-bold text-slate-600 mt-1 d-flex gap-2">
                      <span>
                        <v-icon size="12" class="mr-1">mdi-weight-kilogram</v-icon>
                        {{ stop.weight }} kg
                      </span>
                      <span>
                        <v-icon size="12" class="mr-1">mdi-cube-outline</v-icon>
                        {{ stop.volume }} cbm
                      </span>
                    </div>
                  </v-card>
                </div>
              </div>
            </v-window-item>

            <!-- TAB 2: CARGO & FLAGS -->
            <v-window-item value="1">
              <!-- Schedules Card -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-secondary mb-2">SCHEDULES & TIMING</div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">Execution Date</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.execution_date }}</span>
                  </div>
                  <v-divider></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">Expected Pickup Date</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.expected_pickup_date }}</span>
                  </div>
                  <v-divider></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">Expected Delivery Date</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.expected_delivery_date }}</span>
                  </div>
                </div>
              </v-card>

              <!-- Cargo Weights -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-secondary mb-2">CARGO WEIGHT DETAILS</div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">Chargeable Weight</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.chargeable_weight }} kg</span>
                  </div>
                  <v-divider></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">Gross Weight</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.gross_weight }} kg</span>
                  </div>
                  <v-divider></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">Gross Volumetric Weight</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.gross_volumetric_weight }} kg</span>
                  </div>
                </div>
              </v-card>

              <!-- Commercial Value -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-secondary mb-2">COMMERCIAL VALUE</div>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-caption text-medium-emphasis">Goods Value</span>
                  <span class="font-weight-bold text-slate-800 text-body-2">AED {{ selectedOrder.goods_value.toLocaleString() }}</span>
                </div>
              </v-card>

              <!-- Operational Requirements -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-secondary mb-2">OPERATIONAL FLAGS</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="d-flex align-center">
                    <v-icon :color="selectedOrder.is_pickup_gatepass_required ? 'secondary' : 'grey'" size="16" class="mr-2">
                      {{ selectedOrder.is_pickup_gatepass_required ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                    </v-icon>
                    <span class="text-caption font-weight-medium">Pickup Gatepass</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon :color="selectedOrder.is_drop_gatepass_required ? 'secondary' : 'grey'" size="16" class="mr-2">
                      {{ selectedOrder.is_drop_gatepass_required ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                    </v-icon>
                    <span class="text-caption font-weight-medium">Drop Gatepass</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon :color="selectedOrder.is_delivery_note_required ? 'secondary' : 'grey'" size="16" class="mr-2">
                      {{ selectedOrder.is_delivery_note_required ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                    </v-icon>
                    <span class="text-caption font-weight-medium">Delivery Note</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon :color="selectedOrder.is_cross_docking ? 'secondary' : 'grey'" size="16" class="mr-2">
                      {{ selectedOrder.is_cross_docking ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                    </v-icon>
                    <span class="text-caption font-weight-medium">Cross Docking</span>
                  </div>
                </div>
              </v-card>

              <!-- Remarks -->
              <v-card flat class="pa-4 rounded-lg border" v-if="selectedOrder.order_remarks || selectedOrder.cancellation_remarks">
                <div class="text-caption font-weight-bold text-secondary mb-2">REMARKS & REMARKS</div>
                <div v-if="selectedOrder.order_remarks" class="mb-3">
                  <span class="text-caption text-medium-emphasis d-block">Order Remarks</span>
                  <span class="text-body-2 text-slate-800">{{ selectedOrder.order_remarks }}</span>
                </div>
                <div v-if="selectedOrder.cancellation_remarks" class="pa-2 rounded bg-error-lighten-5 border border-error">
                  <span class="text-caption text-error font-weight-bold d-block">Cancellation Remarks</span>
                  <span class="text-body-2 text-error">{{ selectedOrder.cancellation_remarks }}</span>
                </div>
              </v-card>
            </v-window-item>

            <!-- TAB 3: TRANSIT LOG -->
            <v-window-item value="2">
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-secondary mb-3">OPERATIONAL TRANSITION LOG</div>
                
                <div class="d-flex flex-column gap-3">
                  <!-- Booked -->
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="font-weight-bold text-body-2 text-slate-800">Order Booked</div>
                      <div class="text-caption text-medium-emphasis">Submitted by Customer Portal</div>
                    </div>
                    <div class="text-right">
                      <div class="text-body-2 font-weight-bold">{{ formatDate(selectedOrder.createdAt) }}</div>
                    </div>
                  </div>
                  <v-divider></v-divider>

                  <!-- Collected -->
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="font-weight-bold text-body-2 text-slate-800">Cargo Collected</div>
                      <div class="text-caption text-medium-emphasis" v-if="selectedOrder.collected_by">By driver {{ selectedOrder.collected_by }}</div>
                      <div class="text-caption text-medium-emphasis" v-else>Pending Collection</div>
                    </div>
                    <div class="text-right" v-if="selectedOrder.collected_at">
                      <div class="text-body-2 font-weight-bold">{{ formatDate(selectedOrder.collected_at) }}</div>
                    </div>
                    <v-chip size="x-small" color="grey" v-else>N/A</v-chip>
                  </div>
                  <v-divider></v-divider>

                  <!-- Delivered -->
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="font-weight-bold text-body-2 text-slate-800">Cargo Delivered</div>
                      <div class="text-caption text-medium-emphasis" v-if="selectedOrder.delivered_by">By driver {{ selectedOrder.delivered_by }}</div>
                      <div class="text-caption text-medium-emphasis" v-else>Pending Delivery</div>
                    </div>
                    <div class="text-right" v-if="selectedOrder.delivered_at">
                      <div class="text-body-2 font-weight-bold">{{ formatDate(selectedOrder.delivered_at) }}</div>
                    </div>
                    <v-chip size="x-small" color="grey" v-else>N/A</v-chip>
                  </div>
                  <v-divider></v-divider>

                  <!-- Completed -->
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="font-weight-bold text-body-2 text-slate-800">Completed & Closed</div>
                      <div class="text-caption text-medium-emphasis" v-if="selectedOrder.completed_by">By operations {{ selectedOrder.completed_by }}</div>
                      <div class="text-caption text-medium-emphasis" v-else>In Transit / Processing</div>
                    </div>
                    <div class="text-right" v-if="selectedOrder.completed_at">
                      <div class="text-body-2 font-weight-bold">{{ formatDate(selectedOrder.completed_at) }}</div>
                    </div>
                    <v-chip size="x-small" color="grey" v-else>N/A</v-chip>
                  </div>

                  <!-- Cancelled (if cancelled) -->
                  <template v-if="selectedOrder.status === 'Cancelled'">
                    <v-divider></v-divider>
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-bold text-body-2 text-error">Order Cancelled</div>
                        <div class="text-caption text-error opacity-70" v-if="selectedOrder.cancelled_by">By {{ selectedOrder.cancelled_by }}</div>
                      </div>
                      <div class="text-right" v-if="selectedOrder.cancelled_at">
                        <div class="text-body-2 font-weight-bold text-error">{{ formatDate(selectedOrder.cancelled_at) }}</div>
                      </div>
                    </div>
                  </template>
                </div>
              </v-card>
            </v-window-item>
          </v-window>
        </div>

        <!-- Footer Actions -->
        <div class="pa-4 border-t flex-shrink-0 bg-white">
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            block
            prepend-icon="mdi-close"
            class="font-weight-bold rounded-lg"
            @click="detailsDrawer = false"
          >
            Close Tracking
          </v-btn>
        </div>

      </div>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, createOrder, HUBS } from '@/state'

const openOrderDialog = ref(false)
const requestFormValid = ref(false)
const requestForm = ref(null)

const showInvoiceDialog = ref(false)
const selectedInvoice = ref(null)

// Details Drawer
const detailsDrawer = ref(false)
const selectedOrder = ref(null)
const detailsTab = ref('0')

const bookingData = ref({
  tempRequirement: 'Chilled',
  type: 'LTL',
  address: '',
  contactName: 'Chef Francois',
  contactPhone: '+971 50 111 2222',
  weight: 200,
  volume: 0.6,
  reference_number: '',
  pickup_address: 'Dubai Logistics Hub',
  source_branch: 'Dubai Hub',
  destination_branch: 'Dubai Hub',
  is_pickup_gatepass_required: false,
  is_drop_gatepass_required: false,
  is_delivery_note_required: true,
  order_remarks: '',
  chargeable_weight: 200,
  gross_weight: 210,
  gross_volumetric_weight: 60,
  goods_value: 5000,
  expected_pickup_date: '',
  expected_delivery_date: ''
})

// Auto estimated price
const estimatedPrice = computed(() => {
  const w = Number(bookingData.value.chargeable_weight) || 0
  return 500 + w * 1.5
})

const customerInvoices = computed(() => {
  return store.invoices.filter(inv => inv.customer === 'Wared Logistics')
})

const activeCustomerOrders = computed(() => {
  return store.orders.filter(o => o.customer === 'Wared Logistics')
})

// Check if there is an active trip carrying Wared Logistics orders
const activeTrip = computed(() => {
  return store.trips.find(t => t.status === 'Active' && t.orders.some(o => o.customer === 'Wared Logistics'))
})

const isTransitActive = computed(() => {
  return !!activeTrip.value && store.activeSimulationTripId !== null
})

function getStatusColor(status) {
  switch (status) {
    case 'Draft': return 'grey'
    case 'Planned': return 'primary'
    case 'En Route': return 'warning'
    case 'Delivered': return 'success'
    case 'Cancelled': return 'error'
    case 'Paid': return 'success'
    case 'Sent': return 'info'
    default: return 'grey'
  }
}

function getTimelineStepClass(status, step) {
  if (status === 'Delivered') {
    return 'text-success'
  }
  if (status === 'En Route') {
    return step <= 3 ? 'text-primary' : 'text-disabled'
  }
  if (status === 'Planned') {
    return step <= 2 ? 'text-primary' : 'text-disabled'
  }
  return step <= 1 ? 'text-primary' : 'text-disabled'
}

function formatDate(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDateOnly(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function openBooking() {
  const today = new Date().toISOString().split('T')[0]
  bookingData.value = {
    tempRequirement: 'Chilled',
    type: 'LTL',
    address: '',
    contactName: 'Chef Francois',
    contactPhone: '+971 50 111 2222',
    weight: 200,
    volume: 0.6,
    reference_number: 'REF-' + Math.floor(100000 + Math.random() * 900000),
    pickup_address: 'Dubai Logistics Hub',
    source_branch: 'Dubai Hub',
    destination_branch: 'Dubai Hub',
    is_pickup_gatepass_required: false,
    is_drop_gatepass_required: false,
    is_delivery_note_required: true,
    order_remarks: '',
    chargeable_weight: 200,
    gross_weight: 210,
    gross_volumetric_weight: 60,
    goods_value: 5000,
    expected_pickup_date: today,
    expected_delivery_date: today
  }
  openOrderDialog.value = true
}

function viewOrderDetails(order) {
  selectedOrder.value = order
  detailsTab.value = '0'
  detailsDrawer.value = true
}

function submitBooking() {
  if (requestForm.value?.validate()) {
    createOrder({
      customer: 'Wared Logistics',
      type: bookingData.value.type,
      tempRequirement: bookingData.value.tempRequirement,
      stops: [
        {
          id: `S-${Date.now()}`,
          address: bookingData.value.address,
          contactName: bookingData.value.contactName,
          contactPhone: bookingData.value.contactPhone,
          weight: Number(bookingData.value.chargeable_weight),
          volume: Number(bookingData.value.volume),
          status: 'Pending'
        }
      ],
      totalWeight: Number(bookingData.value.chargeable_weight),
      totalVolume: Number(bookingData.value.volume),
      price: estimatedPrice.value,
      
      reference_number: bookingData.value.reference_number,
      pickup_address: bookingData.value.pickup_address,
      drop_address: bookingData.value.address,
      is_pickup_gatepass_required: bookingData.value.is_pickup_gatepass_required,
      is_drop_gatepass_required: bookingData.value.is_drop_gatepass_required,
      source_branch: bookingData.value.source_branch,
      destination_branch: bookingData.value.destination_branch,
      current_branch: bookingData.value.source_branch,
      next_branch: '',
      execution_date: bookingData.value.expected_pickup_date,
      order_rate: estimatedPrice.value,
      payment_type: 'Credit',
      rate_type: 'Per Trip',
      goods_value: Number(bookingData.value.goods_value),
      is_cross_docking: false,
      expected_pickup_date: bookingData.value.expected_pickup_date,
      expected_delivery_date: bookingData.value.expected_delivery_date,
      order_remarks: bookingData.value.order_remarks,
      chargeable_weight: Number(bookingData.value.chargeable_weight),
      gross_weight: Number(bookingData.value.gross_weight),
      gross_volumetric_weight: Number(bookingData.value.gross_volumetric_weight),
      oda_charge: 0,
      is_delivery_note_required: bookingData.value.is_delivery_note_required,
      manifest_no: 'MNF-' + Math.floor(100000 + Math.random() * 900000)
    })
    
    openOrderDialog.value = false
  }
}

function viewInvoice(invoice) {
  selectedInvoice.value = invoice
  showInvoiceDialog.value = true
}

// Return coordinates depending on stop location text
function getStopCoords(address) {
  const addr = address.toLowerCase()
  if (addr.includes('abu dhabi') || addr.includes('yas')) {
    return HUBS.abuDhabi
  } else if (addr.includes('sharjah')) {
    return HUBS.sharjah
  } else {
    // Return relative Dubai coordinate offset for local stops
    if (addr.includes('marina')) {
      return { x: 180, y: 170 }
    } else if (addr.includes('downtown')) {
      return { x: 210, y: 140 }
    } else if (addr.includes('jumeirah')) {
      return { x: 190, y: 155 }
    } else {
      return { x: 200, y: 165 }
    }
  }
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
.gap-2 {
  gap: 8px;
}
.w-100 {
  width: 100%;
}
.absolute {
  position: absolute;
}
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.pulse-marker {
  animation: pulse-ring 1.5s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
}
</style>
