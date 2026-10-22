import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/state'

// Import views/layouts
import LoginView from '@/components/LoginView.vue'
import CustomerPortal from '@/components/CustomerPortal.vue'
import AdminLayout from '@/components/AdminLayout.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import OrdersView from '@/components/OrdersView.vue'
import TripPlanningView from '@/components/TripPlanningView.vue'
import ControlTowerView from '@/components/ControlTowerView.vue'
import InvoicesView from '@/components/InvoicesView.vue'
import AssetsView from '@/components/AssetsView.vue'
import CustomerLayout from '@/components/CustomerLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { appRoutes } from '@/pages/routes'

const routes = [
  {
    path: '/',
    redirect: () => {
      const role = store.currentUserRole
      if (role === 'admin') return '/app/dashboard'
      if (role === 'customer') return '/customer'
      return '/login'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/customer',
    component: CustomerLayout,
    children: [
      {
        path: '',
        name: 'customer',
        component: CustomerPortal
      }
    ]
  },
  {
    path: '/app',
    component: AppLayout,
    redirect: '/app/dashboard',
    children: appRoutes
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: AdminDashboard
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: OrdersView
      },
      {
        path: 'trips',
        name: 'admin-trips',
        component: TripPlanningView
      },
      {
        path: 'control-tower',
        name: 'admin-control-tower',
        component: ControlTowerView
      },
      {
        path: 'invoicing',
        name: 'admin-invoicing',
        component: InvoicesView
      },
      {
        path: 'assets/vehicles',
        name: 'admin-assets-vehicles',
        component: AssetsView
      },
      {
        path: 'assets/drivers',
        name: 'admin-assets-drivers',
        component: AssetsView
      }
    ]
  },
  // Catch all route redirects to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const role = store.currentUserRole

  if (!role && to.name !== 'login') {
    // Redirect to login if not logged in
    next({ name: 'login' })
  } else if (role && to.name === 'login') {
    // If logged in and trying to access login, redirect to dashboard/customer
    if (role === 'admin') {
      next({ path: '/app/dashboard' })
    } else {
      next({ name: 'customer' })
    }
  } else if (role === 'customer' && (to.path.startsWith('/admin') || to.path.startsWith('/app'))) {
    // Prevent customer from accessing admin routes
    next({ name: 'customer' })
  } else if (role === 'admin' && to.path === '/customer') {
    // Prevent admin from accessing customer routes
    next({ path: '/app/dashboard' })
  } else {
    // Synchronize active admin tab in store based on path
    if (to.path.startsWith('/admin/')) {
      const parts = to.path.split('/')
      const view = parts[2]
      if (view === 'assets') {
        const assetType = parts[3] // 'vehicles' or 'drivers'
        store.activeAdminTab = assetType
      } else if (view === 'control-tower') {
        store.activeAdminTab = 'controlTower'
      } else {
        store.activeAdminTab = view
      }
    }
    next()
  }
})
