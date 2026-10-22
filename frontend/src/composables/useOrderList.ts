import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Order } from '@/types'
import type { DateRange } from '@/components/common/DateRangeFilter.vue'
import { currency } from '@/mock/country'
import { loadingDate, orders, ORDER_STATUSES } from '@/mock/orders'

export interface OrderFilters {
  search: string
  branches: string[]
  customers: string[]
  jobTypes: string[]
  vendors: string[]
  products: string[]
  pickups: string[]
  drops: string[]
  loading: DateRange | null
}

const FILTERS_KEY = 'order-list-filters-v1'
const LIST_URL_KEYS = { branch: 'branches', customer: 'customers', job: 'jobTypes', vendor: 'vendors', product: 'products', from: 'pickups', to: 'drops' } as const
const RANGE_URL_KEYS = { loading: 'loading' } as const
const STATE_KEYS = ['q', 'status', 'sort', 'page', 'size', ...Object.keys(LIST_URL_KEYS), ...Object.keys(RANGE_URL_KEYS)]
const MORE_KEYS = ['vendors', 'products', 'pickups', 'drops', 'loading'] as const

const emptyFilters = (): OrderFilters => ({ search: '', branches: [], customers: [], jobTypes: [], vendors: [], products: [], pickups: [], drops: [], loading: null })
const dmyToIso = (dmy: string) => dmy.split('/').reverse().join('-')
const inRange = (dmy: string, r: DateRange | null) => !r || (dmyToIso(dmy) >= r.from && dmyToIso(dmy) <= r.to)
const within = (list: string[], value: string) => !list.length || list.includes(value)

const SORTERS: Record<string, (o: Order) => string | number> = {
  id: o => o.id, customer: o => o.customer, status: o => o.status, rate: o => o.rate, branch: o => o.branch,
  jobType: o => o.jobType, orderDate: o => dmyToIso(o.orderDate), loading: o => dmyToIso(loadingDate(o)),
}

/** Filters, status tab, sort and paging for the orders list. Lives in the URL, and the last view is restored from localStorage. */
export function useOrderList () {
  const route = useRoute()
  const router = useRouter()

  const filters = reactive<OrderFilters>(emptyFilters())
  const status = ref<string | null>(null)
  const ordering = ref<string | null>(null)
  const page = ref(1)
  const pageSize = ref(20)
  const moreOpen = ref(false)

  // ---- filtering ----
  const moreActiveCount = computed(() => MORE_KEYS.filter(k => { const v = filters[k]; return Array.isArray(v) ? v.length > 0 : !!v }).length)
  const showMore = computed(() => moreOpen.value || moreActiveCount.value > 0)
  const isFiltered = computed(() => !!filters.search.trim() || filters.branches.length > 0 || filters.customers.length > 0 || filters.jobTypes.length > 0 || moreActiveCount.value > 0)

  const base = computed(() => {
    const q = filters.search.trim().toLowerCase()
    return orders.filter(o =>
      (!q || [o.id, o.ref, o.customer, o.origin, o.destination, o.product].some(v => v.toLowerCase().includes(q))) &&
      within(filters.branches, o.branch) && within(filters.customers, o.customer) && within(filters.jobTypes, o.jobType) &&
      within(filters.vendors, o.vendor) && within(filters.products, o.product) && within(filters.pickups, o.origin) && within(filters.drops, o.destination) &&
      inRange(loadingDate(o), filters.loading))
  })

  const counts = computed(() => {
    const byStatus: Record<string, number> = {}
    for (const o of base.value) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1
    return { total: base.value.length, byStatus }
  })

  const sorted = computed(() => {
    const rows = status.value ? base.value.filter(o => o.status === status.value) : [...base.value]
    if (!ordering.value) return rows
    const desc = ordering.value.startsWith('-')
    const get = SORTERS[ordering.value.replace(/^-/, '')]
    if (!get) return rows
    return rows.sort((a, b) => (get(a) < get(b) ? -1 : get(a) > get(b) ? 1 : 0) * (desc ? -1 : 1))
  })

  const total = computed(() => sorted.value.length)
  const rows = computed(() => sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

  // ---- summary line (over all orders, not the filtered ones) ----
  const summary = computed(() => ({
    total: orders.length,
    openValue: orders.filter(o => ['Pending', 'Confirmed', 'Active'].includes(o.status)).reduce((n, o) => n + o.rate, 0),
    pending: orders.filter(o => o.status === 'Pending').length,
    unassigned: orders.filter(o => o.status === 'Confirmed').length,
    currency: currency.value,
  }))

  const statusChips = computed(() => [
    { value: null as string | null, label: 'All', count: counts.value.total },
    ...ORDER_STATUSES.map(s => ({
      value: s as string | null,
      label: s,
      count: counts.value.byStatus[s] ?? 0,
      tone: s === 'Pending' ? ('attention' as const) : ['Cancelled', 'Rejected'].includes(s) ? ('muted' as const) : undefined,
    })),
  ])

  function resetFilters () {
    Object.assign(filters, emptyFilters())
    moreOpen.value = false
  }

  // ---- URL and storage ----
  const toQuery = () => {
    const q: Record<string, string> = {}
    if (filters.search.trim()) q.q = filters.search.trim()
    if (status.value) q.status = status.value
    for (const [key, field] of Object.entries(LIST_URL_KEYS)) if (filters[field].length) q[key] = filters[field].join(',')
    for (const [key, field] of Object.entries(RANGE_URL_KEYS)) { const r = filters[field]; if (r) q[key] = `${r.from}..${r.to}` }
    if (ordering.value) q.sort = ordering.value
    if (page.value > 1) q.page = String(page.value)
    if (pageSize.value !== 20) q.size = String(pageSize.value)
    return q
  }

  const fromQuery = (q: Record<string, any>) => {
    const list = (v: unknown) => String(v ?? '').split(',').filter(Boolean)
    const range = (v: unknown): DateRange | null => {
      const [from, to] = String(v ?? '').split('..')
      return /^\d{4}-\d{2}-\d{2}$/.test(from ?? '') && /^\d{4}-\d{2}-\d{2}$/.test(to ?? '') ? { from, to } : null
    }
    filters.search = String(q.q ?? '')
    status.value = (ORDER_STATUSES as readonly string[]).includes(q.status) ? q.status : null
    for (const [key, field] of Object.entries(LIST_URL_KEYS)) filters[field] = list(q[key])
    filters.loading = range(q.loading)
    ordering.value = q.sort && SORTERS[String(q.sort).replace(/^-/, '')] ? String(q.sort) : null
    page.value = Math.max(1, Number(q.page) || 1)
    pageSize.value = [20, 50, 100].includes(Number(q.size)) ? Number(q.size) : 20
    moreOpen.value = moreActiveCount.value > 0
  }

  function sync () {
    const query = toQuery()
    const others = Object.fromEntries(Object.entries(route.query).filter(([k]) => !STATE_KEYS.includes(k)))
    router.replace({ query: { ...others, ...query } })
    try {
      const { page: _page, ...persisted } = query
      localStorage.setItem(FILTERS_KEY, JSON.stringify(persisted))
    } catch { /* storage unavailable: the URL still carries the state */ }
  }

  // A link with filters wins; otherwise come back to the last-used view.
  function restore () {
    const hasUrlState = Object.keys(route.query).some(k => STATE_KEYS.includes(k))
    let saved: Record<string, any> = {}
    try { saved = JSON.parse(localStorage.getItem(FILTERS_KEY) ?? '{}') } catch { saved = {} }
    fromQuery(hasUrlState ? route.query : saved)
    sync()
  }

  // Any filter change goes back to page 1.
  watch(filters, () => { page.value = 1 }, { deep: true })
  watch(status, () => { page.value = 1 })
  watch([filters, status, ordering, page, pageSize], sync, { deep: true })

  // reactive() so templates can read `list.status`, `list.total` and so on without .value.
  return reactive({ filters, status, ordering, page, pageSize, moreOpen, showMore, moreActiveCount, isFiltered, counts, statusChips, summary, total, rows, resetFilters, restore })
}
