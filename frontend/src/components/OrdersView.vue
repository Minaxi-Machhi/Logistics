<template>
  <v-container fluid class="px-4 py-0">
    <!-- Header Area -->
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px;">
      <div>
        <h2 class="text-h6 font-weight-bold text-slate-800 d-flex align-center">
          <v-icon color="primary" class="mr-2" size="20">mdi-package-variant-closed</v-icon>
          Orders Management
        </h2>
        <p class="text-caption text-medium-emphasis mb-0">View, create, and dispatch FTL & LTL distribution orders</p>
      </div>
      <div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="default"
          class="rounded-lg font-weight-bold"
          @click="openCreateDialog"
        >
          Create Order
        </v-btn>
      </div>
    </div>

    <!-- Orders Filter Cards -->
    <v-card class="glass-card mb-4 pa-3 rounded-lg" elevation="2">
      <v-row class="align-center">
        <v-col cols="6" sm="4" md="3">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Search orders or clients..."
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-select
            v-model="filterStatus"
            :items="statusOptions"
            label="Status Filter"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-select
            v-model="filterTemp"
            :items="tempOptions"
            label="Temp Requirement"
            variant="outlined"
            density="compact"
            hide-details
            color="primary"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- Orders Table -->
    <v-card class="glass-card rounded-lg overflow-hidden" elevation="2">
      <v-table hover density="comfortable">
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold text-left">Order ID / Ref</th>
            <th class="font-weight-bold text-left">Customer / Manifest</th>
            <th class="font-weight-bold text-left">Type</th>
            <th class="font-weight-bold text-left">Temp Req</th>
            <th class="font-weight-bold text-left">Route</th>
            <th class="font-weight-bold text-right">Stops</th>
            <th class="font-weight-bold text-right">Weight (kg)</th>
            <th class="font-weight-bold text-right">Rate (AED)</th>
            <th class="font-weight-bold text-center">Status</th>
            <th class="font-weight-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="font-weight-bold text-primary">
              {{ order.id }}
              <div class="text-caption text-medium-emphasis font-weight-normal">Ref: {{ order.reference_number }}</div>
            </td>
            <td class="font-weight-medium">
              {{ order.customer }}
              <div class="text-caption text-medium-emphasis font-weight-normal">Manifest: {{ order.manifest_no }}</div>
            </td>
            <td>
              <v-chip
                size="small"
                :color="order.type === 'FTL' ? 'indigo-darken-2' : 'teal-darken-1'"
                variant="flat"
                class="font-weight-bold"
              >
                {{ order.type }}
              </v-chip>
            </td>
            <td>
              <v-chip
                size="small"
                :color="order.tempRequirement === 'Chilled' ? 'info' : 'grey-darken-1'"
                variant="tonal"
                class="font-weight-bold"
                :prepend-icon="order.tempRequirement === 'Chilled' ? 'mdi-snowflake' : 'mdi-sun-thermometer-outline'"
              >
                {{ order.tempRequirement }}
              </v-chip>
            </td>
            <td>
              <div class="text-caption font-weight-bold text-slate-800">{{ order.source_branch }}</div>
              <div class="d-flex align-center text-caption text-medium-emphasis">
                <v-icon size="10" class="mr-1">mdi-arrow-right</v-icon>
                {{ order.destination_branch }}
              </div>
            </td>
            <td class="text-right font-weight-bold">{{ order.stops.length }} stops</td>
            <td class="text-right">
              <div>{{ order.totalWeight.toLocaleString() }}</div>
              <div class="text-caption text-medium-emphasis">Chg: {{ order.chargeable_weight }} kg</div>
            </td>
            <td class="text-right font-weight-bold text-slate-800">
              AED {{ order.order_rate.toLocaleString() }}
              <div class="text-caption text-medium-emphasis font-weight-normal">{{ order.payment_type }}</div>
            </td>
            <td class="text-center">
              <v-chip
                size="small"
                :color="getStatusColor(order.status)"
                class="font-weight-bold"
              >
                {{ order.status }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn
                density="compact"
                text="View"
                size="small"
                color="primary"
                @click="viewOrderDetails(order)"
              >
              </v-btn>
            </td>
          </tr>
          <tr v-if="filteredOrders.length === 0">
            <td colspan="10" class="text-center py-8 text-medium-emphasis">
              <v-icon size="40" color="grey" class="mb-2">mdi-package-variant-closed-remove</v-icon>
              <div>No orders found matching the filter criteria.</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Create Order Dialog -->
    <v-dialog v-model="createDialog" max-width="760px" width="100%" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-subtitle-1 font-weight-bold text-primary px-5 py-4 d-flex justify-space-between align-center border-b">
          <div class="d-flex align-center gap-2">
            <span>Create Order</span>
          </div>
          <v-btn icon="mdi-close" variant="text" density="compact" @click="createDialog = false"></v-btn>
        </v-card-title>

        <v-card-text class="pa-5" style="max-height: 70vh; overflow-y: auto;">
          <v-form ref="orderForm" v-model="formValid">
            
            <!-- SECTION 1: General Info -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="primary">mdi-information-outline</v-icon>
              General Order Information
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-select
                v-model="newOrderData.customer"
                :items="['Wared Logistics', 'Lulu Hypermarket', 'Carrefour', 'Spinneys', 'Union Coop']"
                label="Customer Client *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-select>
              <v-text-field
                v-model="newOrderData.reference_number"
                label="Reference Number *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Reference number is required']"
              ></v-text-field>
              <v-text-field
                v-model="newOrderData.manifest_no"
                label="Manifest Number *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Manifest number is required']"
              ></v-text-field>
              <v-text-field
                v-model="newOrderData.execution_date"
                label="Execution Date *"
                type="date"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Execution date is required']"
              ></v-text-field>
            </div>

            <!-- SECTION 2: Routing -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="primary">mdi-routes</v-icon>
              Route & Network Branches
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-text-field
                v-model="newOrderData.pickup_address"
                label="Pickup Address *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Pickup address is required']"
              ></v-text-field>
              <v-text-field
                v-model="newOrderData.drop_address"
                label="Drop Address (Primary) *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Drop address is required']"
              ></v-text-field>
              <v-select
                v-model="newOrderData.source_branch"
                :items="['Dubai Hub', 'Abu Dhabi Branch', 'Sharjah Depot']"
                label="Source Branch *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-select>
              <v-select
                v-model="newOrderData.destination_branch"
                :items="['Dubai Hub', 'Abu Dhabi Branch', 'Sharjah Depot']"
                label="Destination Branch *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-select>
              <v-select
                v-model="newOrderData.current_branch"
                :items="['Dubai Hub', 'Abu Dhabi Branch', 'Sharjah Depot']"
                label="Current Branch *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-select>
              <v-select
                v-model="newOrderData.next_branch"
                :items="['', 'Dubai Hub', 'Abu Dhabi Branch', 'Sharjah Depot']"
                label="Next Branch"
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-select>
            </div>

            <!-- SECTION 3: Schedules -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="primary">mdi-calendar-range</v-icon>
              Schedules
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-text-field
                v-model="newOrderData.expected_pickup_date"
                label="Expected Pickup Date *"
                type="date"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Expected pickup date is required']"
              ></v-text-field>
              <v-text-field
                v-model="newOrderData.expected_delivery_date"
                label="Expected Delivery Date *"
                type="date"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Expected delivery date is required']"
              ></v-text-field>
            </div>

            <!-- SECTION 4: Cargo Specs -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="primary">mdi-cube-box-outline</v-icon>
              Cargo Specs & Temperature Segment
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-select
                v-model="newOrderData.type"
                :items="['LTL', 'FTL']"
                label="Load Type *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-select>
              <v-select
                v-model="newOrderData.tempRequirement"
                :items="['Dry', 'Chilled']"
                label="Temperature Segment *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-select>
              <v-text-field
                v-model.number="newOrderData.chargeable_weight"
                label="Chargeable Weight (kg) *"
                type="number"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Chargeable weight is required']"
              ></v-text-field>
              <v-text-field
                v-model.number="newOrderData.gross_weight"
                label="Gross Weight (kg) *"
                type="number"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Gross weight is required']"
              ></v-text-field>
              <v-text-field
                v-model.number="newOrderData.gross_volumetric_weight"
                label="Gross Volumetric Weight (kg) *"
                type="number"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Volumetric weight is required']"
              ></v-text-field>
            </div>

            <!-- SECTION 5: Finance -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="primary">mdi-currency-aed</v-icon>
              Finance & Commercials
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-text-field
                v-model.number="newOrderData.order_rate"
                label="Order Rate (AED) *"
                type="number"
                required
                prefix="AED"
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Order rate is required']"
              ></v-text-field>
              <v-text-field
                v-model.number="newOrderData.goods_value"
                label="Goods Value (AED) *"
                type="number"
                required
                prefix="AED"
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
                :rules="[v => !!v || 'Goods value is required']"
              ></v-text-field>
              <v-text-field
                v-model.number="newOrderData.oda_charge"
                label="ODA Charge (AED)"
                type="number"
                prefix="AED"
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-text-field>
              <v-select
                v-model="newOrderData.payment_type"
                :items="['Credit', 'Cash', 'Prepaid']"
                label="Payment Type *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-select>
              <v-select
                v-model="newOrderData.rate_type"
                :items="['Per Trip', 'Per Ton', 'Per CBM', 'Fixed']"
                label="Rate Type *"
                required
                variant="outlined"
                density="comfortable"
                color="primary"
                hide-details="auto"
              ></v-select>
            </div>

            <!-- SECTION 6: Flags -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="primary">mdi-tune-variant</v-icon>
              Operational Flags & Requirements
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <v-checkbox
                v-model="newOrderData.is_pickup_gatepass_required"
                label="Pickup Gatepass Required"
                color="primary"
                density="compact"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="newOrderData.is_drop_gatepass_required"
                label="Drop Gatepass Required"
                color="primary"
                density="compact"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="newOrderData.is_cross_docking"
                label="Is Cross Docking"
                color="primary"
                density="compact"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="newOrderData.is_delivery_note_required"
                label="Delivery Note Required"
                color="primary"
                density="compact"
                hide-details
              ></v-checkbox>
            </div>

            <!-- SECTION 7: Remarks -->
            <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-3 d-flex align-center gap-2">
              <v-icon size="14" color="primary">mdi-note-text-outline</v-icon>
              Remarks
            </div>
            <v-textarea
              v-model="newOrderData.order_remarks"
              label="Order Remarks"
              variant="outlined"
              density="comfortable"
              color="primary"
              rows="2"
              class="mb-4"
              hide-details="auto"
            ></v-textarea>

            <v-divider class="my-4"></v-divider>

            <!-- Section: Stops Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div class="text-caption font-weight-bold text-medium-emphasis text-uppercase d-flex align-center gap-2">
                <v-icon size="14" color="primary">mdi-map-marker-path</v-icon>
                Delivery Stops ({{ newOrderStops.length }})
              </div>
              <v-btn
                v-if="newOrderStops.length < 3"
                color="primary"
                variant="tonal"
                size="small"
                prepend-icon="mdi-plus"
                @click="addStop"
              >
                Add Stop
              </v-btn>
            </div>

            <!-- Stops Fields -->
            <div
              v-for="(stop, index) in newOrderStops"
              :key="index"
              class="border rounded-lg pa-3 mb-3 bg-grey-lighten-5"
            >
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <v-avatar color="primary" size="22" class="text-caption font-weight-bold">
                    {{ index + 1 }}
                  </v-avatar>
                  <span class="font-weight-bold text-body-2 text-primary">Stop {{ index + 1 }}</span>
                </div>
                <v-btn
                  v-if="newOrderStops.length > 1"
                  icon="mdi-trash-can-outline"
                  variant="text"
                  color="error"
                  density="compact"
                  size="small"
                  @click="removeStop(index)"
                ></v-btn>
              </div>

              <!-- Full-width address -->
              <div style="margin-bottom: 12px;">
                <v-text-field
                  v-model="stop.address"
                  label="Delivery Address *"
                  placeholder="e.g. Dubai Marina, Marina Heights Tower"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  required
                  hide-details="auto"
                  :rules="[v => !!v || 'Address is required']"
                ></v-text-field>
              </div>

              <!-- 2-column grid for stop fields -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <v-text-field
                  v-model="stop.contactName"
                  label="Contact Person Name"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                ></v-text-field>
                <v-text-field
                  v-model="stop.contactPhone"
                  label="Contact Phone"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  hide-details="auto"
                ></v-text-field>
                <v-text-field
                  v-model.number="stop.weight"
                  label="Cargo Weight (kg) *"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  required
                  hide-details="auto"
                  :rules="[v => !!v || 'Weight is required']"
                ></v-text-field>
                <v-text-field
                  v-model.number="stop.volume"
                  label="Volume (cbm) *"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  color="primary"
                  required
                  hide-details="auto"
                  :rules="[v => !!v || 'Volume is required']"
                ></v-text-field>
              </div>
            </div>

          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="px-5 py-3">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey-darken-1" class="font-weight-bold" @click="createDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" class="font-weight-bold px-6 rounded-lg" :disabled="!formValid" @click="submitOrder">
            Create Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Order Detail Drawer -->
    <v-navigation-drawer
      v-model="detailsDrawer"
      location="right"
      temporary
      width="540"
      class="pa-0"
    >
      <div v-if="selectedOrder" class="d-flex flex-column h-100 bg-white">

        <!-- Drawer Header Bar -->
        <div class="pa-4 bg-primary text-white d-flex justify-space-between align-center flex-shrink-0">
          <div>
            <div class="text-caption text-white opacity-70 font-weight-bold mb-1">ORDER DETAILS</div>
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
        <v-tabs v-model="detailsTab" color="primary" grow density="comfortable">
          <v-tab value="0" class="text-caption font-weight-bold">Route & Stops</v-tab>
          <v-tab value="1" class="text-caption font-weight-bold">Specs & Flags</v-tab>
          <v-tab value="2" class="text-caption font-weight-bold">System Log</v-tab>
        </v-tabs>

        <!-- Tab Items -->
        <div class="flex-grow-1 overflow-y-auto pa-4">
          <v-window v-model="detailsTab">
            <!-- TAB 1: ROUTE & STOPS -->
            <v-window-item value="0">
              <v-card flat class="pa-4 rounded-lg bg-grey-lighten-5 border mb-4">
                <v-row no-gutters align="center">
                  <v-col cols="8">
                    <div class="text-caption text-medium-emphasis font-weight-bold mb-1">CLIENT / CUSTOMER</div>
                    <div class="text-subtitle-1 font-weight-bold text-slate-800">{{ selectedOrder.customer }}</div>
                    <div class="text-caption text-medium-emphasis mt-1 d-flex align-center">
                      <v-icon size="13" class="mr-1">mdi-calendar-outline</v-icon>
                      Booked: {{ formatDate(selectedOrder.createdAt) }}
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <v-chip
                      size="small"
                      :color="selectedOrder.type === 'FTL' ? 'indigo-darken-2' : 'teal-darken-1'"
                      variant="flat"
                      class="font-weight-bold mb-2"
                    >
                      {{ selectedOrder.type }}
                    </v-chip>
                    <br />
                    <v-chip
                      size="small"
                      :color="selectedOrder.tempRequirement === 'Chilled' ? 'info' : 'grey-darken-1'"
                      variant="tonal"
                      class="font-weight-bold"
                      :prepend-icon="selectedOrder.tempRequirement === 'Chilled' ? 'mdi-snowflake' : 'mdi-sun-thermometer-outline'"
                    >
                      {{ selectedOrder.tempRequirement }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card>

              <!-- Route Branches Grid -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-primary mb-2">BRANCH ROUTING</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px;">
                  <div>
                    <span class="text-caption text-medium-emphasis d-block">Source Branch</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.source_branch }}</span>
                  </div>
                  <div>
                    <span class="text-caption text-medium-emphasis d-block">Destination Branch</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.destination_branch }}</span>
                  </div>
                  <div>
                    <span class="text-caption text-medium-emphasis d-block">Current Branch</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.current_branch || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-caption text-medium-emphasis d-block">Next Branch</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.next_branch || '-' }}</span>
                  </div>
                </div>
              </v-card>

              <!-- Addresses Card -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-primary mb-2">OPERATIONAL ROUTE</div>
                <div class="mb-2">
                  <span class="text-caption text-medium-emphasis d-block">Pickup Address</span>
                  <span class="text-body-2 text-slate-800 font-weight-medium">{{ selectedOrder.pickup_address }}</span>
                </div>
                <div>
                  <span class="text-caption text-medium-emphasis d-block">Drop Address</span>
                  <span class="text-body-2 text-slate-800 font-weight-medium">{{ selectedOrder.drop_address }}</span>
                </div>
              </v-card>

              <!-- Rate Card -->
              <v-card flat class="pa-4 rounded-lg mb-4 d-flex align-center justify-space-between" style="background: linear-gradient(135deg, #15499C11, #15499C22); border: 1px solid #15499C33;">
                <div>
                  <div class="text-caption font-weight-bold text-primary">ORDER RATE</div>
                  <div class="text-h5 font-weight-bold text-primary mt-1">AED {{ selectedOrder.order_rate.toLocaleString() }}</div>
                </div>
                <v-avatar color="primary" variant="tonal" rounded="lg" size="48">
                  <v-icon size="26" color="primary">mdi-cash-multiple</v-icon>
                </v-avatar>
              </v-card>

              <!-- Delivery Stops Timeline -->
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" size="18" class="mr-2">mdi-map-marker-path</v-icon>
                <span class="text-subtitle-2 font-weight-bold text-slate-800">Delivery Route & Stops ({{ selectedOrder.stops.length }})</span>
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
                    :class="stop.status === 'Delivered' ? 'bg-success' : 'bg-primary'"
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
                        :color="stop.status === 'Delivered' ? 'success' : 'primary'"
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

            <!-- TAB 2: SPECS & FLAGS -->
            <v-window-item value="1">
              <!-- Dates Card -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-primary mb-2">SCHEDULES & TIMING</div>
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

              <!-- Cargo Specs -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-primary mb-2">CARGO WEIGHT DETAILS</div>
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

              <!-- Financial Details -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-primary mb-2">COMMERCIAL & BILLING</div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">Goods Value</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">AED {{ selectedOrder.goods_value.toLocaleString() }}</span>
                  </div>
                  <v-divider></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">ODA Charge</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">AED {{ selectedOrder.oda_charge.toLocaleString() }}</span>
                  </div>
                  <v-divider></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">Payment Type</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.payment_type }}</span>
                  </div>
                  <v-divider></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption text-medium-emphasis">Rate Type</span>
                    <span class="font-weight-bold text-slate-800 text-body-2">{{ selectedOrder.rate_type }}</span>
                  </div>
                </div>
              </v-card>

              <!-- Flags Card -->
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-primary mb-2">OPERATIONAL FLAGS</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="d-flex align-center">
                    <v-icon :color="selectedOrder.is_pickup_gatepass_required ? 'primary' : 'grey'" size="16" class="mr-2">
                      {{ selectedOrder.is_pickup_gatepass_required ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                    </v-icon>
                    <span class="text-caption font-weight-medium">Pickup Gatepass</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon :color="selectedOrder.is_drop_gatepass_required ? 'primary' : 'grey'" size="16" class="mr-2">
                      {{ selectedOrder.is_drop_gatepass_required ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                    </v-icon>
                    <span class="text-caption font-weight-medium">Drop Gatepass</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon :color="selectedOrder.is_cross_docking ? 'primary' : 'grey'" size="16" class="mr-2">
                      {{ selectedOrder.is_cross_docking ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                    </v-icon>
                    <span class="text-caption font-weight-medium">Cross Docking</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon :color="selectedOrder.is_delivery_note_required ? 'primary' : 'grey'" size="16" class="mr-2">
                      {{ selectedOrder.is_delivery_note_required ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                    </v-icon>
                    <span class="text-caption font-weight-medium">Delivery Note</span>
                  </div>
                </div>
              </v-card>

              <!-- Remarks -->
              <v-card flat class="pa-4 rounded-lg border" v-if="selectedOrder.order_remarks || selectedOrder.cancellation_remarks">
                <div class="text-caption font-weight-bold text-primary mb-2">REMARKS</div>
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

            <!-- TAB 3: SYSTEM LOG -->
            <v-window-item value="2">
              <v-card flat class="pa-4 rounded-lg border mb-4">
                <div class="text-caption font-weight-bold text-primary mb-3">LIFECYCLE TRANSITION LOG</div>
                
                <div class="d-flex flex-column gap-3">
                  <!-- Booked -->
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="font-weight-bold text-body-2 text-slate-800">Order Booked</div>
                      <div class="text-caption text-medium-emphasis">By Customer Portal / Admin</div>
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
                      <div class="text-caption text-medium-emphasis" v-if="selectedOrder.collected_by">By {{ selectedOrder.collected_by }}</div>
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
                      <div class="text-caption text-medium-emphasis" v-if="selectedOrder.delivered_by">By {{ selectedOrder.delivered_by }}</div>
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
                      <div class="font-weight-bold text-body-2 text-slate-800">Order Completed</div>
                      <div class="text-caption text-medium-emphasis" v-if="selectedOrder.completed_by">By {{ selectedOrder.completed_by }}</div>
                      <div class="text-caption text-medium-emphasis" v-else>Pending Completion</div>
                    </div>
                    <div class="text-right" v-if="selectedOrder.completed_at">
                      <div class="text-body-2 font-weight-bold">{{ formatDate(selectedOrder.completed_at) }}</div>
                    </div>
                    <v-chip size="x-small" color="grey" v-else>N/A</v-chip>
                  </div>
                  <v-divider></v-divider>

                  <!-- Ready for Invoice -->
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="font-weight-bold text-body-2 text-slate-800">Ready for Invoicing</div>
                      <div class="text-caption text-medium-emphasis" v-if="selectedOrder.ready_for_invoice_by">By {{ selectedOrder.ready_for_invoice_by }}</div>
                      <div class="text-caption text-medium-emphasis" v-else>Pending Ready Status</div>
                    </div>
                    <div class="text-right" v-if="selectedOrder.ready_for_invoice_at">
                      <div class="text-body-2 font-weight-bold">{{ formatDate(selectedOrder.ready_for_invoice_at) }}</div>
                    </div>
                    <v-chip size="x-small" color="grey" v-else>N/A</v-chip>
                  </div>
                  <v-divider></v-divider>

                  <!-- Invoice Generated -->
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="font-weight-bold text-body-2 text-slate-800">Invoice Generated</div>
                      <div class="text-caption text-medium-emphasis">System Auto Invoicing</div>
                    </div>
                    <div class="text-right" v-if="selectedOrder.invoice_generated_at">
                      <div class="text-body-2 font-weight-bold">{{ formatDate(selectedOrder.invoice_generated_at) }}</div>
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
          <div class="d-flex gap-2">
            <v-btn
              v-if="selectedOrder.status === 'Draft' || selectedOrder.status === 'Planned'"
              color="primary"
              variant="flat"
              class="font-weight-bold rounded-lg flex-grow-1"
              prepend-icon="mdi-steering"
              @click="planTripWithOrder"
            >
              Plan Trip
            </v-btn>
            <v-btn
              v-if="selectedOrder.status === 'Draft' || selectedOrder.status === 'Planned'"
              color="error"
              variant="outlined"
              class="font-weight-bold rounded-lg flex-grow-1"
              prepend-icon="mdi-cancel"
              @click="openCancelDialog"
            >
              Cancel Order
            </v-btn>
          </div>
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            block
            prepend-icon="mdi-close"
            class="font-weight-bold rounded-lg mt-2"
            @click="detailsDrawer = false"
          >
            Close
          </v-btn>
        </div>

      </div>
    </v-navigation-drawer>

    <!-- Cancel Order Confirmation Dialog -->
    <v-dialog v-model="cancelDialog" max-width="450">
      <v-card class="rounded-lg pa-3">
        <v-card-title class="font-weight-bold text-h6 text-error d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert-circle-outline</v-icon>
          Cancel Order
        </v-card-title>
        <v-card-text class="pt-2">
          Are you sure you want to cancel Order <strong>{{ selectedOrder?.id }}</strong>? Please provide cancellation remarks.
          <v-textarea
            v-model="cancelRemarks"
            label="Cancellation Remarks"
            variant="outlined"
            color="error"
            density="comfortable"
            class="mt-3"
            rows="3"
            hide-details
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end pt-2">
          <v-btn variant="text" color="grey" @click="cancelDialog = false">Dismiss</v-btn>
          <v-btn color="error" variant="flat" class="font-weight-bold rounded-lg px-4" :disabled="!cancelRemarks.trim()" @click="confirmCancelOrder">Confirm Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, createOrder } from '@/state'

const searchQuery = ref('')
const filterStatus = ref('All Statuses')
const filterTemp = ref('All Temperatures')

const statusOptions = ['All Statuses', 'Draft', 'Planned', 'En Route', 'Delivered']
const tempOptions = ['All Temperatures', 'Dry', 'Chilled']

// Dialog States
const createDialog = ref(false)
const formValid = ref(false)
const orderForm = ref(null)

// Details Drawer
const detailsDrawer = ref(false)
const selectedOrder = ref(null)
const detailsTab = ref('0')

// Cancel Dialog
const cancelDialog = ref(false)
const cancelRemarks = ref('')

// Form Data Model
const newOrderData = ref({
  customer: 'Wared Logistics',
  type: 'LTL',
  tempRequirement: 'Chilled',
  price: 950,
  reference_number: '',
  pickup_address: '',
  drop_address: '',
  is_pickup_gatepass_required: false,
  is_drop_gatepass_required: false,
  source_branch: 'Dubai Hub',
  destination_branch: 'Dubai Hub',
  current_branch: 'Dubai Hub',
  next_branch: '',
  execution_date: '',
  order_rate: 950,
  payment_type: 'Credit',
  rate_type: 'Per Trip',
  goods_value: 10000,
  is_cross_docking: false,
  expected_pickup_date: '',
  expected_delivery_date: '',
  order_remarks: '',
  chargeable_weight: 250,
  gross_weight: 260,
  gross_volumetric_weight: 84,
  oda_charge: 0,
  is_delivery_note_required: true,
  manifest_no: ''
})

const newOrderStops = ref([
  { address: '', contactName: '', contactPhone: '', weight: 100, volume: 0.5 }
])

const filteredOrders = computed(() => {
  return store.orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (order.reference_number && order.reference_number.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (order.manifest_no && order.manifest_no.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      order.stops.some(s => s.address.toLowerCase().includes(searchQuery.value.toLowerCase()))
      
    const matchesStatus =
      filterStatus.value === 'All Statuses' || order.status === filterStatus.value
      
    const matchesTemp =
      filterTemp.value === 'All Temperatures' || order.tempRequirement === filterTemp.value

    return matchesSearch && matchesStatus && matchesTemp
  })
})

function getStatusColor(status) {
  switch (status) {
    case 'Draft': return 'grey'
    case 'Planned': return 'primary'
    case 'En Route': return 'warning'
    case 'Delivered': return 'success'
    case 'Cancelled': return 'error'
    default: return 'grey'
  }
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

function viewOrderDetails(order) {
  selectedOrder.value = order
  detailsTab.value = '0'
  detailsDrawer.value = true
}

function openCreateDialog() {
  const today = new Date().toISOString().split('T')[0]
  newOrderData.value = {
    customer: 'Wared Logistics',
    type: 'LTL',
    tempRequirement: 'Chilled',
    price: 950,
    reference_number: 'REF-' + Math.floor(100000 + Math.random() * 900000),
    pickup_address: 'Dubai Logistics Hub',
    drop_address: '',
    is_pickup_gatepass_required: false,
    is_drop_gatepass_required: false,
    source_branch: 'Dubai Hub',
    destination_branch: 'Dubai Hub',
    current_branch: 'Dubai Hub',
    next_branch: '',
    execution_date: today,
    order_rate: 950,
    payment_type: 'Credit',
    rate_type: 'Per Trip',
    goods_value: 10000,
    is_cross_docking: false,
    expected_pickup_date: today,
    expected_delivery_date: today,
    order_remarks: '',
    chargeable_weight: 250,
    gross_weight: 260,
    gross_volumetric_weight: 84,
    oda_charge: 0,
    is_delivery_note_required: true,
    manifest_no: 'MNF-' + Math.floor(100000 + Math.random() * 900000)
  }
  newOrderStops.value = [
    { address: '', contactName: '', contactPhone: '', weight: 250, volume: 0.8 }
  ]
  createDialog.value = true
}

function addStop() {
  if (newOrderStops.value.length < 3) {
    newOrderStops.value.push({ address: '', contactName: '', contactPhone: '', weight: 200, volume: 0.5 })
  }
}

function removeStop(idx) {
  if (newOrderStops.value.length > 1) {
    newOrderStops.value.splice(idx, 1)
  }
}

function openCancelDialog() {
  cancelRemarks.value = ''
  cancelDialog.value = true
}

function confirmCancelOrder() {
  if (selectedOrder.value) {
    selectedOrder.value.status = 'Cancelled'
    selectedOrder.value.cancelled_at = new Date().toISOString()
    selectedOrder.value.cancelled_by = 'Operations Admin'
    selectedOrder.value.cancellation_remarks = cancelRemarks.value
    cancelDialog.value = false
  }
}

function submitOrder() {
  if (orderForm.value?.validate()) {
    // Generate stops list
    const stopsList = newOrderStops.value.map((s, idx) => ({
      id: `S${Date.now()}-${idx}`,
      address: s.address || '',
      contactName: s.contactName || '',
      contactPhone: s.contactPhone || '',
      weight: Number(s.weight) || 0,
      volume: Number(s.volume) || 0,
      status: 'Pending'
    }))

    // Calculate total weight and volume
    const totalW = stopsList.reduce((sum, s) => sum + s.weight, 0)
    const totalV = stopsList.reduce((sum, s) => sum + s.volume, 0)

    createOrder({
      customer: newOrderData.value.customer,
      type: newOrderData.value.type,
      tempRequirement: newOrderData.value.tempRequirement,
      stops: stopsList,
      totalWeight: totalW,
      totalVolume: totalV,
      price: Number(newOrderData.value.order_rate),
      
      reference_number: newOrderData.value.reference_number,
      pickup_address: newOrderData.value.pickup_address,
      drop_address: newOrderData.value.drop_address || (stopsList[0]?.address) || '',
      is_pickup_gatepass_required: newOrderData.value.is_pickup_gatepass_required,
      is_drop_gatepass_required: newOrderData.value.is_drop_gatepass_required,
      source_branch: newOrderData.value.source_branch,
      destination_branch: newOrderData.value.destination_branch,
      current_branch: newOrderData.value.current_branch,
      next_branch: newOrderData.value.next_branch,
      execution_date: newOrderData.value.execution_date,
      order_rate: Number(newOrderData.value.order_rate),
      payment_type: newOrderData.value.payment_type,
      rate_type: newOrderData.value.rate_type,
      goods_value: Number(newOrderData.value.goods_value),
      is_cross_docking: newOrderData.value.is_cross_docking,
      expected_pickup_date: newOrderData.value.expected_pickup_date,
      expected_delivery_date: newOrderData.value.expected_delivery_date,
      order_remarks: newOrderData.value.order_remarks,
      chargeable_weight: Number(newOrderData.value.chargeable_weight),
      gross_weight: Number(newOrderData.value.gross_weight),
      gross_volumetric_weight: Number(newOrderData.value.gross_volumetric_weight),
      oda_charge: Number(newOrderData.value.oda_charge),
      is_delivery_note_required: newOrderData.value.is_delivery_note_required,
      manifest_no: newOrderData.value.manifest_no
    })

    createDialog.value = false
  }
}

function planTripWithOrder() {
  detailsDrawer.value = false
  store.activeAdminTab = 'trips'
}
</script>

<style scoped>
.absolute {
  position: absolute;
}
.left-0 {
  left: 0;
}
.w-100 {
  width: 100%;
}
.h-100 {
  height: 100%;
}
.gap-2 {
  gap: 8px;
}
.gap-2 span {
  display: inline-flex;
  align-items: center;
}
.border-t {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.border-success {
  border-color: rgb(var(--v-theme-success)) !important;
}
.opacity-70 {
  opacity: 0.7;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
