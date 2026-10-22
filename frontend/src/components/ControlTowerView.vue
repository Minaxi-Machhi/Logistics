<template>
  <v-container fluid class="px-4 py-0">
    <!-- Header Area -->
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px;">
      <div>
        <h2 class="text-h6 font-weight-bold text-slate-800 d-flex align-center">
          <v-icon color="primary" class="mr-2" size="20">mdi-radiobox-marked</v-icon>
          Control Tower &amp; Live Tracking
        </h2>
        <p class="text-caption text-medium-emphasis mb-0">Live fleet monitoring, geofence status, and interactive transit telemetry</p>
      </div>
    </div>

    <v-row>
      <!-- Map Column -->
      <v-col cols="12" lg="8">
        <v-card class="map-container pa-0 fill-height d-flex flex-column" elevation="3" style="min-height: 520px;">
          <!-- Telemetry Header Overlay -->
          <div class="pa-4 bg-white border-b d-flex justify-space-between align-center flex-wrap gap-2" style="z-index: 5;">
            <div class="d-flex align-center">
              <v-chip
                v-if="store.activeSimulationTripId"
                color="warning"
                class="font-weight-bold mr-3"
                size="small"
              >
                <v-icon class="pulse-marker mr-1" size="14">mdi-radiobox-marked</v-icon>
                LIVE SIMULATION ACTIVE
              </v-chip>
              <v-chip
                v-else
                color="grey"
                class="font-weight-bold mr-3"
                size="small"
              >
                STANDBY
              </v-chip>
              <span class="text-subtitle-2 font-weight-bold text-slate-700">
                {{ store.activeSimulationTripId ? `Tracking: ${store.simulatingTrip?.tripName}` : 'Select a planned trip to track' }}
              </span>
            </div>

            <!-- Stats overlay -->
            <div v-if="store.activeSimulationTripId && store.simulatingTrip" class="d-flex gap-4 text-caption text-medium-emphasis">
              <div>
                <v-icon size="14" class="mr-1">mdi-speedometer</v-icon>
                Speed: <strong>82 km/h</strong>
              </div>
              <div v-if="store.simulatingTrip.vehicle.tempType === 'Chilled'">
                <v-icon size="14" class="mr-1" color="info">mdi-snowflake</v-icon>
                Temp: <strong class="text-info">3.8 °C</strong>
              </div>
              <div>
                <v-icon size="14" class="mr-1">mdi-timer-sand</v-icon>
                Status: <strong>Transit</strong>
              </div>
            </div>
          </div>

          <!-- Interactive SVG UAE Map -->
          <div class="flex-grow-1 relative d-flex align-center justify-center bg-grey-lighten-4" style="overflow: hidden;">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 350"
              preserveAspectRatio="xMidYMid meet"
              class="w-100 h-100"
              style="max-height: 480px;"
            >
              <!-- Map Grid Background -->
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(21,73,156,0.04)" stroke-width="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              <!-- UAE Outline representation / main coastal lines (Mock) -->
              <path
                d="M 50 180 Q 120 120 250 110 T 360 80 L 370 200 Q 250 220 190 280 T 80 320 Z"
                fill="rgba(21,73,156,0.02)"
                stroke="rgba(21,73,156,0.06)"
                stroke-width="2"
              />

              <!-- Highway Routes -->
              <!-- E11 Dubai - Abu Dhabi -->
              <path
                d="M 220 150 L 160 195 L 80 250"
                fill="none"
                stroke="#cbd5e1"
                stroke-width="4"
                stroke-linecap="round"
              />
              <path
                d="M 220 150 L 160 195 L 80 250"
                fill="none"
                stroke="#15499C"
                stroke-width="2"
                class="road-path"
                stroke-opacity="0.6"
              />

              <!-- E11 Dubai - Sharjah -->
              <path
                d="M 220 150 L 250 120"
                fill="none"
                stroke="#cbd5e1"
                stroke-width="4"
                stroke-linecap="round"
              />
              <path
                d="M 220 150 L 250 120"
                fill="none"
                stroke="#15499C"
                stroke-width="2"
                class="road-path"
                stroke-opacity="0.6"
              />

              <!-- Jebel Ali Branch Connection -->
              <circle cx="160" cy="195" r="3" fill="#cbd5e1" />

              <!-- Hub Nodes (Glow Circles) -->
              <!-- Dubai Hub -->
              <g transform="translate(220, 150)">
                <circle cx="0" cy="0" r="10" fill="rgba(21,73,156,0.15)" />
                <circle cx="0" cy="0" r="5" fill="#15499C" />
                <text x="8" y="4" font-size="8" font-weight="bold" fill="#0f172a">Dubai Hub</text>
              </g>

              <!-- Abu Dhabi Hub -->
              <g transform="translate(80, 250)">
                <circle cx="0" cy="0" r="10" fill="rgba(46,125,50,0.15)" />
                <circle cx="0" cy="0" r="5" fill="#2E7D32" />
                <text x="8" y="4" font-size="8" font-weight="bold" fill="#0f172a">Abu Dhabi Branch</text>
              </g>

              <!-- Sharjah Hub -->
              <g transform="translate(250, 120)">
                <circle cx="0" cy="0" r="10" fill="rgba(237,108,2,0.15)" />
                <circle cx="0" cy="0" r="5" fill="#ED6C02" />
                <text x="8" y="4" font-size="8" font-weight="bold" fill="#0f172a">Sharjah Depot</text>
              </g>

              <!-- Active Stops for Selected Trip Route -->
              <g v-if="store.simulatingTrip">
                <g v-for="(stop, idx) in store.simulatingTrip.orders.flatMap(o => o.stops)" :key="stop.id">
                  <!-- stop coordinate mapping -->
                  <circle
                    :cx="getStopCoords(stop.address).x"
                    :cy="getStopCoords(stop.address).y"
                    r="6"
                    :fill="stop.status === 'Delivered' ? '#2E7D32' : '#E0E0E0'"
                    stroke="#15499C"
                    stroke-width="1.5"
                  />
                  <text
                    :x="getStopCoords(stop.address).x + 8"
                    :y="getStopCoords(stop.address).y + 3"
                    font-size="7"
                    fill="#475569"
                  >
                    Stop {{ idx + 1 }}
                  </text>
                </g>
              </g>

              <!-- Moving vehicle marker -->
              <g
                v-if="store.activeSimulationTripId"
                :transform="`translate(${store.simulatedVehiclePosition.x}, ${store.simulatedVehiclePosition.y})`"
              >
                <!-- Outer Pulse -->
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="rgba(21,73,156,0.3)"
                  class="pulse-marker"
                  style="animation: pulse-ring 1.5s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;"
                />
                <!-- Vehicle Icon Container -->
                <circle cx="0" cy="0" r="7" fill="#15499C" stroke="#fff" stroke-width="1.5" />
                <!-- Small Pointer -->
                <polygon points="-3,-3 3,-3 0,-7" fill="#15499C" transform="rotate(45)" />
              </g>
            </svg>

            <!-- Map Popup for active telemetry logs -->
            <div
              v-if="store.activeSimulationTripId && store.simulatingTrip"
              class="absolute pa-3 rounded-lg border bg-white shadow-lg text-caption"
              style="bottom: 16px; left: 16px; max-width: 250px; z-index: 10;"
            >
              <div class="font-weight-bold text-primary mb-1">
                {{ store.simulatingTrip.vehicle.name }}
              </div>
              <div class="text-medium-emphasis">
                Driver: {{ store.simulatingTrip.driver.name }}
              </div>
              <div class="text-medium-emphasis mt-1">
                Plate: {{ store.simulatingTrip.vehicle.plateNumber }}
              </div>
              <v-divider class="my-1"></v-divider>
              <div class="font-weight-bold text-success">
                {{ store.simulatedTripStatusText }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Sidebar Controls and Simulation Console -->
      <v-col cols="12" lg="4">
        <v-card class="glass-card pa-4 rounded-lg fill-height d-flex flex-column" elevation="2" style="min-height: 520px;">
          <h2 class="text-subtitle-1 font-weight-bold mb-3 text-slate-800">Dispatch Controls</h2>

          <!-- Active Trip info -->
          <div v-if="store.activeSimulationTripId && store.simulatingTrip" class="flex-grow-1 d-flex flex-column">
            <v-card class="pa-4 bg-grey-lighten-5 rounded-lg border mb-4" flat>
              <div class="text-overline font-weight-bold text-primary mb-1">TRACKED TRIP</div>
              <div class="text-subtitle-1 font-weight-bold text-slate-800">{{ store.simulatingTrip.tripName }}</div>
              <div class="text-caption text-medium-emphasis">Vehicle Plate: {{ store.simulatingTrip.vehicle.plateNumber }}</div>
              <div class="text-caption text-medium-emphasis">Driver Cell: {{ store.simulatingTrip.driver.phone }}</div>
            </v-card>

            <!-- Simulation Controls -->
            <div class="d-flex justify-between gap-3 mb-6">
              <v-btn
                color="error"
                variant="outlined"
                block
                prepend-icon="mdi-stop-circle-outline"
                class="font-weight-bold"
                @click="endSimulation"
              >
                Abort Simulation
              </v-btn>
            </div>

            <!-- Terminal Console Logs -->
            <span class="text-overline font-weight-bold text-medium-emphasis mb-2">TELEMETRY SIMULATION CONSOLE</span>
            <div class="demo-console pa-3 rounded-lg flex-grow-1 overflow-y-auto mb-4" style="height: 180px; font-size: 11px;">
              <div>[SYSTEM] Connecting to vehicle GPS telemetry...</div>
              <div>[SYSTEM] Establishing socket stream...</div>
              <div class="text-success">[GPS] Signal Lock: 3G/HD GPS Receiver VH-101</div>
              <div v-if="store.simulatingTrip.orders.length > 0">
                [ORDERS] Loaded orders: {{ store.simulatingTrip.orders.map(o => o.id).join(', ') }}
              </div>
              <div class="text-warning mt-2">[TELEMETRY] {{ store.simulatedTripStatusText }}</div>
              <!-- Completed logs -->
              <div v-for="stop in store.simulatingTrip.orders.flatMap(o => o.stops).filter(s => s.status === 'Delivered')" :key="stop.id" class="text-success">
                [DELIVERY] Stop at {{ stop.address.substring(0, 20) }}... marked DELIVERED
              </div>
            </div>
          </div>

          <!-- If no active simulation -->
          <div v-else class="text-center py-8 flex-grow-1 d-flex flex-column justify-center align-center">
            <v-icon size="52" color="grey" class="mb-3">mdi-radar</v-icon>
            <h3 class="text-subtitle-1 font-weight-bold text-slate-700">No active tracking</h3>
            <p class="text-caption text-medium-emphasis px-4 mb-4">
              Go to Trip Planning to assign orders to a vehicle and launch the simulation.
            </p>
            <v-btn
              color="primary"
              prepend-icon="mdi-steering"
              size="small"
              class="font-weight-bold mb-4"
              @click="store.activeAdminTab = 'trips'"
            >
              Go to Trip Planning
            </v-btn>

            <!-- Quick SLA Stats -->
            <v-divider class="w-100 mb-3"></v-divider>
            <div class="w-100 text-left">
              <div class="text-overline font-weight-bold text-medium-emphasis mb-2">TODAY'S SLA SUMMARY</div>
              <v-row dense>
                <v-col cols="6">
                  <v-card flat class="pa-2 rounded-lg bg-grey-lighten-5 text-center border">
                    <div class="text-h6 font-weight-bold text-success">96.2%</div>
                    <div class="text-caption text-medium-emphasis">On-Time Rate</div>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card flat class="pa-2 rounded-lg bg-grey-lighten-5 text-center border">
                    <div class="text-h6 font-weight-bold text-primary">{{ store.trips.filter(t => t.status === 'Completed').length }}</div>
                    <div class="text-caption text-medium-emphasis">Completed Trips</div>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card flat class="pa-2 rounded-lg bg-grey-lighten-5 text-center border">
                    <div class="text-h6 font-weight-bold text-slate-800">{{ store.invoices.length }}</div>
                    <div class="text-caption text-medium-emphasis">Invoices Issued</div>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card flat class="pa-2 rounded-lg bg-grey-lighten-5 text-center border">
                    <div class="text-h6 font-weight-bold text-warning">0</div>
                    <div class="text-caption text-medium-emphasis">Temp Alerts</div>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <!-- Route Legend -->
            <v-divider class="w-100 my-3"></v-divider>
            <div class="w-100 text-left">
              <div class="text-overline font-weight-bold text-medium-emphasis mb-2">MAP LEGEND</div>
              <div class="d-flex align-center mb-1 text-caption">
                <span class="legend-dot" style="background:#15499C;"></span>
                Dubai Logistics Hub
              </div>
              <div class="d-flex align-center mb-1 text-caption">
                <span class="legend-dot" style="background:#2E7D32;"></span>
                Abu Dhabi Branch
              </div>
              <div class="d-flex align-center text-caption">
                <span class="legend-dot" style="background:#ED6C02;"></span>
                Sharjah Depot
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { store, stopSimulation, HUBS } from '@/state'

function endSimulation() {
  stopSimulation()
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
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
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
.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}
.w-100 {
  width: 100%;
}
</style>
