import type { RouteRecordRaw } from 'vue-router'

/** Routes under /app, loaded per page so each module is its own chunk. */
export const appRoutes: RouteRecordRaw[] = [
  { path: 'dashboard', name: 'app-dashboard', component: () => import('./dashboard/DashboardPage.vue') },

  { path: 'orders', name: 'app-orders', component: () => import('./orders/OrdersPage.vue') },
  { path: 'orders/:id', name: 'app-order', component: () => import('./orders/OrderDetailPage.vue') },

  { path: 'trips', name: 'app-trips', component: () => import('./trips/TripsPage.vue') },
  { path: 'trips/:id', name: 'app-trip', component: () => import('./trips/TripDetailPage.vue') },

  { path: 'customers', name: 'app-customers', component: () => import('./customers/CustomersPage.vue') },
  { path: 'customers/contracts/:id', name: 'app-customer-contract', component: () => import('./customers/CustomerDetailPage.vue'), meta: { kind: 'contract' } },
  { path: 'customers/:id', name: 'app-customer', component: () => import('./customers/CustomerDetailPage.vue'), meta: { kind: 'customer' } },

  { path: 'vendors', name: 'app-vendors', component: () => import('./vendors/VendorsPage.vue') },
  { path: 'vendors/contracts/:id', name: 'app-vendor-contract', component: () => import('./vendors/VendorDetailPage.vue'), meta: { kind: 'contract' } },
  { path: 'vendors/orders/:id', name: 'app-vendor-order', component: () => import('./vendors/VendorDetailPage.vue'), meta: { kind: 'order' } },
  { path: 'vendors/:id', name: 'app-vendor', component: () => import('./vendors/VendorDetailPage.vue'), meta: { kind: 'vendor' } },

  { path: 'assets', name: 'app-assets', component: () => import('./assets/AssetsPage.vue') },
  { path: 'assets/drivers/:id', name: 'app-driver', component: () => import('./assets/AssetDetailPage.vue'), meta: { kind: 'driver' } },
  { path: 'assets/vehicles/:id', name: 'app-vehicle', component: () => import('./assets/AssetDetailPage.vue'), meta: { kind: 'vehicle' } },

  { path: 'invoices', name: 'app-invoices', component: () => import('./invoices/InvoicesPage.vue') },
  { path: 'invoices/:id', name: 'app-invoice', component: () => import('./invoices/InvoiceDetailPage.vue') },

  { path: 'incentives', name: 'app-incentives', component: () => import('./incentives/IncentivesPage.vue') },
  { path: 'incentives/:id', name: 'app-incentive', component: () => import('./incentives/IncentiveDetailPage.vue') },

  { path: 'reports', name: 'app-reports', component: () => import('./reports/ReportsPage.vue') },
]
