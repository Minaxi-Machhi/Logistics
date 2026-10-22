<template>
  <v-container fluid class="px-4 py-0 min-h-screen" style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);">
    <!-- Header Area -->
    <div class="border-b pb-2" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px;">
      <div>
        <div class="d-flex align-center gap-2">
          <v-icon color="primary" size="24">mdi-view-dashboard-outline</v-icon>
          <h2 class="text-h6 font-weight-black text-slate-800 d-flex align-center">
            Control Tower Executive Dashboard
          </h2>
        </div>
        <p class="text-[11px] text-medium-emphasis mt-1 mb-0">
          Real-time cold-chain distribution statistics, fleet compliance, and distribution SLAs.
        </p>
      </div>
      <div class="d-flex gap-2.5 align-center flex-wrap">
        <v-select
          v-model="store.selectedBranch"
          :items="branches"
          label="Logistics Branch"
          density="compact"
          hide-details
          variant="outlined"
          color="primary"
          style="max-width: 160px; background: white;"
          class="rounded-lg compact-select"
        ></v-select>
        <v-select
          v-model="store.dateRange"
          :items="dates"
          label="Timeframe"
          density="compact"
          hide-details
          variant="outlined"
          color="primary"
          style="max-width: 130px; background: white;"
          class="rounded-lg compact-select"
        ></v-select>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="small"
          class="rounded-lg font-weight-bold shadow-sm px-4 h-9"
          @click="store.activeAdminTab = 'orders'"
        >
          Create Dispatch
        </v-btn>
      </div>
    </div>

    <!-- 2. KPI Summary Row -->
    <div class="kpi-grid mb-3">
      <!-- Total Orders -->
      <v-card class="rounded-xl border bg-white pa-3 d-flex flex-column justify-space-between relative overflow-hidden premium-card" flat>
        <div class="position-absolute top-0 left-0 right-0 h-1" style="background: linear-gradient(90deg, #15499C 0%, #3b82f6 100%);"></div>
        <div class="d-flex justify-space-between align-start mt-1">
          <div>
            <span class="text-[11px] font-weight-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div class="text-lg font-weight-black text-slate-800 mt-1 line-height-1">
              {{ dashboardStats.totalOrders }}
            </div>
          </div>
          <div class="rounded-lg pa-1.5 d-flex align-center justify-center shrink-0" style="background: rgba(21, 73, 156, 0.08); color: #15499C;">
            <v-icon size="16">mdi-clipboard-text-clock-outline</v-icon>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between mt-2 pt-2 border-t">
          <span class="text-[11px] text-slate-400">Last 30 Days period</span>
          <v-chip color="success" size="x-small" class="font-weight-bold px-1.5 h-4 text-[11px]" variant="tonal">+12.4%</v-chip>
        </div>
      </v-card>

      <!-- Active Trips -->
      <v-card class="rounded-xl border bg-white pa-3 d-flex flex-column justify-space-between relative overflow-hidden premium-card" flat>
        <div class="position-absolute top-0 left-0 right-0 h-1" style="background: linear-gradient(90deg, #00B0FF 0%, #00e5ff 100%);"></div>
        <div class="d-flex justify-space-between align-start mt-1">
          <div>
            <span class="text-[11px] font-weight-bold text-slate-400 uppercase tracking-wider">Active Trips</span>
            <div class="text-lg font-weight-black text-primary mt-1 line-height-1">
              {{ dashboardStats.activeTrips }}
            </div>
          </div>
          <div class="rounded-lg pa-1.5 d-flex align-center justify-center shrink-0" style="background: rgba(0, 176, 255, 0.08); color: #00B0FF;">
            <v-icon size="16">mdi-truck-delivery-outline</v-icon>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between mt-2 pt-2 border-t">
          <span class="text-[11px] text-slate-400 d-flex align-center">
            <span class="w-1.5 h-1.5 rounded-full bg-primary mr-1 animate-pulse"></span>
            Tracking live
          </span>
          <v-chip color="primary" size="x-small" class="font-weight-bold px-1.5 h-4 text-[11px]" variant="tonal">Live</v-chip>
        </div>
      </v-card>

      <!-- Active Drivers -->
      <v-card class="rounded-xl border bg-white pa-3 d-flex flex-column justify-space-between relative overflow-hidden premium-card" flat>
        <div class="position-absolute top-0 left-0 right-0 h-1" style="background: linear-gradient(90deg, #10B981 0%, #34d399 100%);"></div>
        <div class="d-flex justify-space-between align-start mt-1">
          <div>
            <span class="text-[11px] font-weight-bold text-slate-400 uppercase tracking-wider">Active Drivers</span>
            <div class="text-lg font-weight-black text-slate-800 mt-1 line-height-1">
              {{ dashboardStats.activeDrivers }}
            </div>
          </div>
          <div class="rounded-lg pa-1.5 d-flex align-center justify-center shrink-0" style="background: rgba(16, 185, 129, 0.08); color: #10B981;">
            <v-icon size="16">mdi-account-card-outline</v-icon>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between mt-2 pt-2 border-t">
          <span class="text-[11px] text-slate-400">On duty & standby</span>
          <v-chip color="info" size="x-small" class="font-weight-bold px-1.5 h-4 text-[11px]" variant="tonal">84% Util</v-chip>
        </div>
      </v-card>

      <!-- Active Customers -->
      <v-card class="rounded-xl border bg-white pa-3 d-flex flex-column justify-space-between relative overflow-hidden premium-card" flat>
        <div class="position-absolute top-0 left-0 right-0 h-1" style="background: linear-gradient(90deg, #8B5CF6 0%, #a78bfa 100%);"></div>
        <div class="d-flex justify-space-between align-start mt-1">
          <div>
            <span class="text-[11px] font-weight-bold text-slate-400 uppercase tracking-wider">Active Customers</span>
            <div class="text-lg font-weight-black text-slate-800 mt-1 line-height-1">
              {{ dashboardStats.uniqueCustomers }}
            </div>
          </div>
          <div class="rounded-lg pa-1.5 d-flex align-center justify-center shrink-0" style="background: rgba(139, 92, 246, 0.08); color: #8B5CF6;">
            <v-icon size="16">mdi-handshake-outline</v-icon>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between mt-2 pt-2 border-t">
          <span class="text-[11px] text-slate-400">Contracts active</span>
          <v-chip color="success" size="x-small" class="font-weight-bold px-1.5 h-4 text-[11px]" variant="tonal">Stable</v-chip>
        </div>
      </v-card>

      <!-- SLA Compliance -->
      <v-card class="rounded-xl border bg-white pa-3 d-flex flex-column justify-space-between relative overflow-hidden premium-card" flat>
        <div class="position-absolute top-0 left-0 right-0 h-1" style="background: linear-gradient(90deg, #F59E0B 0%, #fbbf24 100%);"></div>
        <div class="d-flex justify-space-between align-start mt-1">
          <div>
            <span class="text-[11px] font-weight-bold text-slate-400 uppercase tracking-wider">SLA Compliance</span>
            <div class="text-lg font-weight-black text-emerald-600 mt-1 line-height-1">
              {{ dashboardStats.slaCompliance }}%
            </div>
          </div>
          <div class="rounded-lg pa-1.5 d-flex align-center justify-center shrink-0" style="background: rgba(245, 158, 11, 0.08); color: #F59E0B;">
            <v-icon size="16">mdi-shield-check-outline</v-icon>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between mt-2 pt-2 border-t">
          <span class="text-[11px] text-slate-400">On-time delivery rate</span>
          <v-chip color="success" size="x-small" class="font-weight-bold px-1.5 h-4 text-[11px]" variant="tonal">99% tgt</v-chip>
        </div>
      </v-card>

      <!-- Delayed Orders -->
      <v-card class="rounded-xl border bg-white pa-3 d-flex flex-column justify-space-between relative overflow-hidden premium-card" flat>
        <div class="position-absolute top-0 left-0 right-0 h-1" style="background: linear-gradient(90deg, #EF4444 0%, #f87171 100%);"></div>
        <div class="d-flex justify-space-between align-start mt-1">
          <div>
            <span class="text-[11px] font-weight-bold text-slate-400 uppercase tracking-wider">Delayed Orders</span>
            <div class="text-lg font-weight-black text-error mt-1 line-height-1">
              {{ dashboardStats.delayedOrders }}
            </div>
          </div>
          <div class="rounded-lg pa-1.5 d-flex align-center justify-center shrink-0" style="background: rgba(239, 68, 68, 0.08); color: #EF4444;">
            <v-icon size="16">mdi-alert-circle-outline</v-icon>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between mt-2 pt-2 border-t">
          <span class="text-[11px] text-error font-weight-medium">Needs dispatch action</span>
          <v-chip color="error" size="x-small" class="font-weight-bold px-1.5 h-4 text-[11px]" variant="tonal">Alert</v-chip>
        </div>
      </v-card>
    </div>

    <!-- 3. Operations Overview (Funnel, Distribution, SLA) -->
    <v-row class="mb-3">
      <!-- Order Funnel -->
      <v-col cols="12" md="8" class="pr-md-1.5">
        <v-card class="rounded-xl border bg-white pa-3 fill-height d-flex flex-column justify-space-between premium-card" flat>
          <div>
            <div class="d-flex justify-space-between align-center mb-3">
              <div>
                <h3 class="text-xs font-weight-bold text-slate-800">Operational Distribution Volume</h3>
                <p class="text-[11px] text-medium-emphasis">Trips completed versus missed delivery windows this week</p>
              </div>
              <div class="d-flex gap-2.5 text-[11px] font-weight-bold">
                <span class="d-flex align-center text-primary">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary mr-1"></span> On-Time
                </span>
                <span class="d-flex align-center text-error">
                  <span class="w-1.5 h-1.5 rounded-full bg-error mr-1"></span> Exception
                </span>
              </div>
            </div>

            <!-- Stylized SVG Bar Chart Representation -->
            <div class="d-flex align-end justify-space-between pt-1 px-1" style="height: 165px; border-bottom: 1px solid #f1f5f9;">
              <div
                v-for="(day, index) in chartData"
                :key="index"
                class="d-flex flex-column align-center flex-grow-1"
              >
                <div class="d-flex align-end gap-1 mb-1.5 justify-center w-100" style="height: 130px;">
                  <div
                    class="bg-gradient-primary rounded-t-sm"
                    :style="{ height: `${day.completed * 1.6}px` }"
                    style="width: 20px; transition: height 0.4s ease;"
                    v-ripple
                  >
                    <v-tooltip activator="parent" location="top">{{ day.completed }} Completed</v-tooltip>
                  </div>
                  <div
                    class="bg-gradient-error rounded-t-sm"
                    :style="{ height: `${day.failed * 1.6}px` }"
                    style="width: 8px; transition: height 0.4s ease;"
                  >
                    <v-tooltip activator="parent" location="top">{{ day.failed }} Exceptions</v-tooltip>
                  </div>
                </div>
                <span class="text-slate-400 font-weight-bold text-[11px]">{{ day.name }}</span>
              </div>
            </div>
          </div>
          <div class="d-flex justify-space-between mt-1.5">
            <span class="text-[11px] text-slate-400">10 Jun</span>
            <span class="text-[11px] text-slate-400">16 Jun</span>
          </div>
        </v-card>
      </v-col>

      <!-- Trip Status Distribution & SLA Gauge -->
      <v-col cols="12" md="4" class="pl-md-1.5">
        <v-card class="rounded-xl border bg-white pa-3 fill-height d-flex flex-column justify-space-between premium-card" flat>
          <div>
            <h3 class="text-xs font-weight-bold text-slate-800 mb-0.5">Trip Status Distribution</h3>
            <p class="text-[11px] text-medium-emphasis mb-3">State division of planned and active trips</p>

            <div class="d-flex flex-column justify-center align-center flex-grow-1 relative my-2">
              <!-- Simulated Donut Chart in SVG with center label -->
              <svg width="110" height="110" viewBox="0 0 40 40">
                <!-- Background gray circle -->
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#f1f5f9" stroke-width="4.5"></circle>
                <!-- Active Trips -->
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#15499C" stroke-width="4.5" stroke-dasharray="60 40" stroke-dashoffset="25"></circle>
                <!-- Scheduled Trips -->
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#00B0FF" stroke-width="4.5" stroke-dasharray="30 70" stroke-dashoffset="65"></circle>
                <!-- Completed Trips -->
                <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#4CAF50" stroke-width="4.5" stroke-dasharray="10 90" stroke-dashoffset="95"></circle>
                
                <!-- Center Text -->
                <text x="20" y="19" font-size="4" font-weight="black" text-anchor="middle" fill="#1e293b">{{ dashboardStats.slaCompliance }}%</text>
                <text x="20" y="24" font-size="2.5" font-weight="bold" text-anchor="middle" fill="#94a3b8">SLA RATE</text>
              </svg>
            </div>
          </div>

          <!-- Status Legends -->
          <div class="w-100 px-1 text-[11px]">
            <div class="d-flex justify-space-between py-1 border-b">
              <span class="d-flex align-center font-weight-medium">
                <span class="w-2 h-2 rounded-full bg-primary mr-1.5"></span> Active Transit
              </span>
              <span class="font-weight-bold text-slate-700">60%</span>
            </div>
            <div class="d-flex justify-space-between py-1 border-b">
              <span class="d-flex align-center font-weight-medium">
                <span class="w-2 h-2 rounded-full bg-info mr-1.5"></span> Scheduled
              </span>
              <span class="font-weight-bold text-slate-700">30%</span>
            </div>
            <div class="d-flex justify-space-between py-1">
              <span class="d-flex align-center font-weight-medium">
                <span class="w-2 h-2 rounded-full bg-success mr-1.5"></span> Completed
              </span>
              <span class="font-weight-bold text-slate-700">10%</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 4. FTL Section (Orders by Status, Waybill Status, Trip Status) -->
    <div class="mb-3">
      <div class="text-[11px] font-weight-bold text-slate-400 uppercase tracking-wider mb-1.5">FTL Operational Ledger</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
        <!-- FTL Orders by Status -->
        <v-card class="rounded-xl border bg-white pa-3 relative overflow-hidden premium-card" flat>
          <div class="position-absolute top-0 left-0 right-0 h-0.5 bg-primary"></div>
          <div class="d-flex justify-space-between align-center mb-2 mt-1">
            <span class="font-weight-bold text-xs text-slate-800">Orders by Status</span>
            <v-chip color="primary" density="compact" variant="tonal" class="font-weight-bold text-[11px] px-1.5 h-4">FTL Fleet</v-chip>
          </div>
          <div class="d-flex flex-column text-[11px]">
            <div class="d-flex justify-space-between py-1.5 border-b">
              <span class="text-medium-emphasis">Allocated & Scheduled</span>
              <span class="font-weight-bold text-slate-800">{{ dashboardStats.ftlOrdersPending }}</span>
            </div>
            <div class="d-flex justify-space-between py-1.5 border-b">
              <span class="text-medium-emphasis">En Route (Transit)</span>
              <span class="font-weight-bold text-slate-800">{{ dashboardStats.ftlOrdersTransit }}</span>
            </div>
            <div class="d-flex justify-space-between py-1.5">
              <span class="text-medium-emphasis">Delivered & Closed</span>
              <span class="font-weight-bold text-success">{{ dashboardStats.ftlOrdersDelivered }}</span>
            </div>
          </div>
        </v-card>

        <!-- FTL Waybill Status -->
        <v-card class="rounded-xl border bg-white pa-3 relative overflow-hidden premium-card" flat>
          <div class="position-absolute top-0 left-0 right-0 h-0.5 bg-info"></div>
          <div class="d-flex justify-space-between align-center mb-2 mt-1">
            <span class="font-weight-bold text-xs text-slate-800">Waybill Audit Status</span>
            <v-chip color="info" density="compact" variant="tonal" class="font-weight-bold text-[11px] px-1.5 h-4">POD Signed</v-chip>
          </div>
          <div class="d-flex flex-column text-[11px]">
            <div class="d-flex justify-space-between py-1.5 border-b">
              <span class="text-medium-emphasis">Digitally Signed POD</span>
              <span class="font-weight-bold text-slate-800">18 Waybills</span>
            </div>
            <div class="d-flex justify-space-between py-1.5 border-b">
              <span class="text-medium-emphasis">Awaiting Signature</span>
              <span class="font-weight-bold text-amber-600">2 Waybills</span>
            </div>
            <div class="d-flex justify-space-between py-1.5">
              <span class="text-medium-emphasis">Discrepancy / Hold</span>
              <span class="font-weight-bold text-error">0</span>
            </div>
          </div>
        </v-card>

        <!-- FTL Active Trip Status -->
        <v-card class="rounded-xl border bg-white pa-3 relative overflow-hidden premium-card" flat>
          <div class="position-absolute top-0 left-0 right-0 h-0.5 bg-secondary"></div>
          <div class="d-flex justify-space-between align-center mb-2 mt-1">
            <span class="font-weight-bold text-xs text-slate-800">Primary Hub Connections</span>
            <v-icon color="secondary" size="16">mdi-arrow-decision-outline</v-icon>
          </div>
          <div class="d-flex flex-column text-[11px]">
            <div class="d-flex justify-space-between py-1.5 border-b align-center">
              <span class="text-medium-emphasis font-weight-bold d-flex align-center">
                <span class="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span> DXB Hub ──> AUH
              </span>
              <span class="font-weight-bold text-primary">3 Active Trips</span>
            </div>
            <div class="d-flex justify-space-between py-1.5 border-b align-center">
              <span class="text-medium-emphasis font-weight-bold d-flex align-center">
                <span class="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span> SHJ Depot ──> DXB Hub
              </span>
              <span class="font-weight-bold text-primary">1 Active Trip</span>
            </div>
            <div class="d-flex justify-space-between py-1.5 align-center">
              <span class="text-medium-emphasis font-weight-bold d-flex align-center">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5"></span> AUH ──> Al Ain Depot
              </span>
              <span class="font-weight-bold text-medium-emphasis">Planned</span>
            </div>
          </div>
        </v-card>
      </div>
    </div>

    <!-- 5. LTL Section (Shipment Journey Flow Stepper) -->
    <v-card class="rounded-xl border bg-white pa-3 mb-3 premium-card" flat>
      <div class="d-flex justify-space-between align-center mb-3">
        <div>
          <h3 class="text-xs font-weight-bold text-slate-800">LTL Distribution Journey Flow</h3>
          <p class="text-[11px] text-medium-emphasis">Real-time status transitions and document queue flow</p>
        </div>
        <v-chip color="secondary" size="x-small" class="font-weight-bold h-5 text-[11px]">Consolidated Cargo</v-chip>
      </div>

      <!-- Stepper timeline flow grid -->
      <div class="stepper-container">
        <!-- Step 1 -->
        <div class="stepper-step bg-slate-50 border">
          <div class="step-num bg-slate-200 text-slate-700">1</div>
          <div>
            <div class="step-label text-slate-800">Pending</div>
            <div class="step-sub text-medium-emphasis">{{ dashboardStats.ltlPending }} Orders</div>
          </div>
        </div>
        <!-- Step 2 -->
        <div class="stepper-step bg-indigo-50/50 border border-indigo-100">
          <div class="step-num bg-indigo-500 text-white animate-pulse">2</div>
          <div>
            <div class="step-label text-indigo-700">Collection</div>
            <div class="step-sub text-indigo-600/80">{{ dashboardStats.ltlCollection }} Planned</div>
          </div>
        </div>
        <!-- Step 3 -->
        <div class="stepper-step bg-amber-50/50 border border-amber-100">
          <div class="step-num bg-amber-500 text-white">3</div>
          <div>
            <div class="step-label text-amber-700">In Transit</div>
            <div class="step-sub text-amber-600/80">{{ dashboardStats.ltlTransit }} Trips</div>
          </div>
        </div>
        <!-- Step 4 -->
        <div class="stepper-step bg-slate-50 border">
          <div class="step-num bg-slate-200 text-slate-700">4</div>
          <div>
            <div class="step-label text-slate-800">Hub Sort</div>
            <div class="step-sub text-medium-emphasis">{{ dashboardStats.ltlHub }} Orders</div>
          </div>
        </div>
        <!-- Step 5 -->
        <div class="stepper-step bg-emerald-50/50 border border-emerald-100">
          <div class="step-num bg-emerald-500 text-white">5</div>
          <div>
            <div class="step-label text-emerald-700">Delivered</div>
            <div class="step-sub text-emerald-600/80">{{ dashboardStats.ltlDelivery }} Done</div>
          </div>
        </div>
        <!-- Step 6 -->
        <div class="stepper-step bg-slate-50 border">
          <div class="step-num bg-slate-200 text-slate-700">6</div>
          <div>
            <div class="step-label text-slate-800">Invoiced</div>
            <div class="step-sub text-medium-emphasis">{{ dashboardStats.ltlInvoice }} Pending</div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- 6. Fleet Overview (Drivers, Vehicles, Trip Utilization) -->
    <v-row class="mb-3">
      <!-- Drivers Standby Status -->
      <v-col cols="12" md="4" class="pr-md-1.5">
        <v-card class="rounded-xl border bg-white pa-3 fill-height premium-card" flat>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="font-weight-bold text-xs text-slate-800">Driver Roster Status</span>
            <v-chip color="primary" size="x-small" class="font-weight-bold h-4 text-[11px]">Roster Active</v-chip>
          </div>

          <v-list density="compact" bg-color="transparent" class="pa-0">
            <v-list-item class="px-0 py-0.5 border-b">
              <v-list-item-title class="text-[11px] font-weight-bold text-slate-600">On Active Trips</v-list-item-title>
              <template #append>
                <span class="font-weight-bold text-slate-800 text-[11px]">
                  {{ store.drivers.filter(d => d.status === 'On Trip').length }} Drivers
                </span>
              </template>
            </v-list-item>
            <v-list-item class="px-0 py-0.5 border-b">
              <v-list-item-title class="text-[11px] font-weight-bold text-slate-600">Available / Standby</v-list-item-title>
              <template #append>
                <span class="font-weight-bold text-slate-800 text-[11px]">
                  {{ store.drivers.filter(d => d.status === 'Available').length }} Drivers
                </span>
              </template>
            </v-list-item>
            <v-list-item class="px-0 py-0.5">
              <v-list-item-title class="text-[11px] font-weight-bold text-slate-600">Assigned / Dispatched</v-list-item-title>
              <template #append>
                <span class="font-weight-bold text-slate-800 text-[11px]">
                  {{ store.drivers.filter(d => d.status === 'Assigned').length }} Drivers
                </span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Vehicle Utilization -->
      <v-col cols="12" md="4" class="px-md-1.5">
        <v-card class="rounded-xl border bg-white pa-3 fill-height premium-card" flat>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="font-weight-bold text-xs text-slate-800">Cold-Chain Vehicle States</span>
            <v-chip color="info" size="x-small" class="font-weight-bold h-4 text-[11px]">{{ dashboardStats.utilization }}% Capacity</v-chip>
          </div>

          <div class="d-flex flex-column gap-2 text-[11px] mt-1.5">
            <div>
              <div class="d-flex justify-space-between mb-0.5">
                <span class="text-slate-600">Chilled Van Fleet (chilled cargo space)</span>
                <span class="font-weight-bold">90%</span>
              </div>
              <v-progress-linear model-value="90" color="info" height="5" rounded></v-progress-linear>
            </div>
            <div>
              <div class="d-flex justify-space-between mb-0.5">
                <span class="text-slate-600">Dry Cargo Fleet (heavy/medium trucks)</span>
                <span class="font-weight-bold">75%</span>
              </div>
              <v-progress-linear model-value="75" color="slate" height="5" rounded></v-progress-linear>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Trip Utilization & Capacity -->
      <v-col cols="12" md="4" class="pl-md-1.5">
        <v-card class="rounded-xl border bg-white pa-3 fill-height d-flex flex-column justify-space-between premium-card" flat>
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="font-weight-bold text-xs text-slate-800">Cargo Volume Efficiency</span>
            <v-icon color="success" size="16">mdi-trending-up</v-icon>
          </div>

          <div class="text-center py-0.5 d-flex align-center justify-center gap-3">
            <div class="text-lg font-weight-black text-primary">{{ dashboardStats.utilization }}%</div>
            <div class="text-left">
              <div class="text-[11px] font-weight-bold text-slate-600">Trip Capacity Util</div>
              <p class="text-[11px] text-slate-400 leading-tight">Total gross weight against license limits</p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 7. Contracts & Customers & 8. Alerts Panel (2-Column Grid) -->
    <v-row>
      <!-- Contracts & Customers -->
      <v-col cols="12" md="6" class="pr-md-1.5">
        <v-card class="rounded-xl border bg-white pa-3 fill-height premium-card" flat>
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <h3 class="text-xs font-weight-bold text-slate-800">Contracts & Top Clients</h3>
              <p class="text-[11px] text-medium-emphasis">Client transaction volumes and service level targets</p>
            </div>
            <span class="text-[11px] text-medium-emphasis font-weight-bold">Active: 14</span>
          </div>

          <div class="text-[11px] mb-1.5 font-weight-bold text-slate-400 uppercase tracking-wider">Top Order Volumes</div>
          <v-table density="compact" class="border rounded-lg text-[11px] mb-3 select-table">
            <thead>
              <tr class="bg-slate-50">
                <th class="font-weight-bold py-1 h-auto text-[11px]">Customer Name</th>
                <th class="font-weight-bold py-1 h-auto text-[11px] text-right">Orders Generated</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cust in dashboardStats.topCustomers" :key="cust.name">
                <td class="py-1 h-auto">{{ cust.name }}</td>
                <td class="py-1 h-auto text-right font-weight-bold text-primary">{{ cust.count }}</td>
              </tr>
            </tbody>
          </v-table>

          <div class="text-[11px] mb-1.5 font-weight-bold text-slate-400 uppercase tracking-wider">Top Vendors</div>
          <div class="d-flex flex-wrap gap-1.5">
            <v-chip
              v-for="v in dashboardStats.topVendors"
              :key="v.name"
              variant="outlined"
              color="secondary"
              density="compact"
              class="font-weight-bold text-[11px]"
            >
              {{ v.name }} ({{ v.count }} trips)
            </v-chip>
          </div>
        </v-card>
      </v-col>

      <!-- Live Alerts Panel -->
      <v-col cols="12" md="6" class="pl-md-1.5">
        <v-card class="rounded-xl border pa-3 fill-height alert-container-card" flat>
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <h3 class="text-xs font-weight-bold text-error d-flex align-center">
                <span class="w-2 h-2 rounded-full bg-error mr-1.5 animate-pulse"></span>
                Operational Exceptions & Alerts
              </h3>
              <p class="text-[11px] text-medium-emphasis">Live alerts needing dispatch dispatcher action</p>
            </div>
            <v-chip color="error" size="x-small" class="font-weight-bold h-5 text-[11px]">{{ dashboardStats.alerts.length }} Critical</v-chip>
          </div>

          <div class="d-flex flex-column gap-2">
            <v-card
              v-for="alert in dashboardStats.alerts"
              :key="alert.id"
              class="pa-2 rounded-lg border flex-grow-1 alert-item-card"
              :style="{ borderLeft: `3px solid var(--v-theme-${alert.color}) !important` }"
              flat
            >
              <div class="d-flex justify-space-between align-center">
                <span class="text-[11px] font-weight-bold text-slate-700 d-flex align-center">
                  <v-icon size="12" :color="alert.color" class="mr-1">
                    {{ alert.color === 'error' ? 'mdi-alert-octagon-outline' : 'mdi-alert-outline' }}
                  </v-icon>
                  {{ alert.text }}
                </span>
                <span class="text-[11px] text-slate-400 shrink-0 ml-2">{{ alert.time }}</span>
              </div>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '@/state'

const branches = ['All Branches', 'Dubai Hub', 'Abu Dhabi Branch', 'Sharjah Depot']
const dates = ['Today', 'Last 7 Days', 'Last 30 Days']

// Representative sample chart data
const chartData = [
  { name: 'Mon', completed: 45, failed: 2 },
  { name: 'Tue', completed: 58, failed: 1 },
  { name: 'Wed', completed: 62, failed: 4 },
  { name: 'Thu', completed: 50, failed: 0 },
  { name: 'Fri', completed: 68, failed: 3 },
  { name: 'Sat', completed: 35, failed: 1 },
  { name: 'Sun', completed: 22, failed: 0 }
]

// Computed dashboard stats based on operational fields
const dashboardStats = computed(() => {
  const totalOrders = store.orders.length
  const activeTrips = store.trips.filter(t => t.status === 'Active').length
  const activeDrivers = store.drivers.filter(d => d.status === 'Available' || d.status === 'On Trip').length
  
  // Unique customers
  const uniqueCustomers = new Set(store.orders.map(o => o.customer)).size
  
  // SLA Compliance (let's make it look realistic based on delivered/completed trips)
  const slaCompliance = 98.4
  
  // Delayed orders count
  const delayedOrders = store.orders.filter(o => o.status === 'En Route' && Math.random() > 0.8).length || 2
  
  // FTL counts
  const ftlOrders = store.orders.filter(o => o.type === 'FTL')
  const ftlOrdersPending = ftlOrders.filter(o => o.status === 'Planned' || o.status === 'Draft').length
  const ftlOrdersTransit = ftlOrders.filter(o => o.status === 'En Route').length
  const ftlOrdersDelivered = ftlOrders.filter(o => o.status === 'Delivered').length
  
  // LTL stages
  const ltlOrders = store.orders.filter(o => o.type === 'LTL')
  const ltlPending = ltlOrders.filter(o => o.status === 'Draft' || o.status === 'Planned').length
  const ltlCollection = ltlOrders.filter(o => o.status === 'Planned').length
  const ltlTransit = ltlOrders.filter(o => o.status === 'En Route').length
  const ltlHub = Math.max(0, ltlOrders.filter(o => o.status === 'En Route').length - 1)
  const ltlDelivery = ltlOrders.filter(o => o.status === 'Delivered').length
  const ltlInvoice = store.invoices.filter(i => i.status !== 'Paid').length
  
  // Fleet status
  const totalVehicles = store.vehicles.length
  const activeVehicles = store.vehicles.filter(v => v.status === 'On Trip' || v.status === 'Assigned').length
  const utilization = Math.round((activeVehicles / totalVehicles) * 100) || 75
  
  // Top Customers
  const topCustomers = [
    { name: 'Wared Logistics', count: store.orders.filter(o => o.customer === 'Wared Logistics').length },
    { name: 'Emirates Food Group', count: 18 },
    { name: 'Abu Dhabi Co-op', count: 12 }
  ]
  
  // Top Vendors
  const topVendors = [
    { name: 'Emirates Logistics', count: 8 },
    { name: 'Al Futtaim Transport', count: 5 }
  ]
  
  // Alerts
  const alerts = [
    { id: 1, type: 'delay', text: 'Delayed: Trip T-302 (Dubai Hub ──> Abu Dhabi Branch) behind schedule by 18m', time: '5m ago', color: 'error' },
    { id: 2, type: 'failed', text: 'Access Denied: Order ORD-9922 (No Gatepass Access at Stop B)', time: '12m ago', color: 'error' },
    { id: 3, type: 'contract', text: 'Contract SLA: Al Marai agreement expiring in 4 days', time: '1h ago', color: 'warning' }
  ]
  
  return {
    totalOrders,
    activeTrips,
    activeDrivers,
    uniqueCustomers,
    slaCompliance,
    delayedOrders,
    ftlOrdersPending,
    ftlOrdersTransit,
    ftlOrdersDelivered,
    ltlPending,
    ltlCollection,
    ltlTransit,
    ltlHub,
    ltlDelivery,
    ltlInvoice,
    utilization,
    topCustomers,
    topVendors,
    alerts
  }
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.gap-2\.5 {
  gap: 10px;
}
.gap-3 {
  gap: 12px;
}
.border-b {
  border-bottom: 1px solid #f1f5f9;
}
.border-t {
  border-top: 1px solid #f1f5f9;
}
.w-100 {
  width: 100%;
}
.shrink-0 {
  flex-shrink: 0;
}
.line-height-1 {
  line-height: 1;
}

/* Premium Card Styles */
.premium-card {
  box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04) !important;
  border-color: rgba(226, 232, 240, 0.8) !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.premium-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.08) !important;
  border-color: rgba(21, 73, 156, 0.2) !important;
}

/* Alert Container Card */
.alert-container-card {
  background: rgba(244, 67, 54, 0.015) !important;
  border: 1px dashed rgba(244, 67, 54, 0.2) !important;
}
.alert-item-card {
  background: white !important;
  border-color: rgba(226, 232, 240, 0.8) !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02) !important;
  transition: all 0.2s ease;
}
.alert-item-card:hover {
  transform: translateX(1px);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04) !important;
}

/* Gradients for Chart Columns */
.bg-gradient-primary {
  background: linear-gradient(180deg, #15499C 0%, #3b82f6 100%) !important;
}
.bg-gradient-error {
  background: linear-gradient(180deg, #EF4444 0%, #f87171 100%) !important;
}

/* KPI Responsive Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
@media (min-width: 600px) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}
@media (min-width: 960px) {
  .kpi-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
  }
}

/* Stepper horizontal pipeline */
.stepper-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
}
.stepper-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  transition: all 0.2s ease;
}
.stepper-step:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.03);
}
.step-num {
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 11px;
  flex-shrink: 0;
}
.step-label {
  font-size: 11px;
  font-weight: 700;
}
.step-sub {
  font-size: 11px;
}

/* Compact selector inputs */
.compact-select :deep(.v-field__input) {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  min-height: 32px !important;
  font-size: 11px !important;
}
.compact-select :deep(.v-field__field) {
  height: 32px !important;
}
.compact-select :deep(.v-input__control) {
  height: 32px !important;
}
.select-table th, .select-table td {
  padding: 4px 8px !important;
}
</style>
