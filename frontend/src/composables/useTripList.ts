import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LEG_STATUSES, toRow, type TripRow } from '@/mock/tripOps'
import { trips } from '@/mock/trips'

export interface TripFilters {
  search: string
  branches: string[]
  customers: string[]
  jobTypes: string[]
  drivers: string[]
  vehicles: string[]
}

const FILTERS_KEY = 'trip-list-filters-v1'
const LIST_URL_KEYS = { branch: 'branches', customer: 'customers', job: 'jobTypes', driver: 'drivers', vehicle: 'vehicles' } as const
const STATE_KEYS = ['q', 'status', 'sort', 'page', 'size', ...Object.keys(LIST_URL_KEYS)]

const emptyFilters = (): TripFilters => ({ search: '', branches: [], customers: [], jobTypes: [], drivers: [], vehicles: [] })
const dmyToIso = (dmy: string) => dmy.split('/').reverse().join('-')
const within = (list: string[], v: string) => !list.length || list.includes(v)

const SORTERS: Record<string, (t: TripRow) => string> = {
  order: t => t.order, id: t => t.id, route: t => t.route, loading: t => dmyToIso(t.departure), legStatus: t => t.legStatus,
  vehicle: t => t.vehicle, driver: t => t.driver, customer: t => t.customer,
}

/** Filters, status chip, sort and paging for the trips list, kept in the URL like the orders list. */
export function useTripList () {
  const route = useRoute()
  const router = useRouter()

  const filters = reactive<TripFilters>(emptyFilters())
  const status = ref<string | null>(null)
  const ordering = ref<string | null>(null)
  const page = ref(1)
  const pageSize = ref(20)
  const moreOpen = ref(false)

  const moreActiveCount = computed(() => filters.drivers.length + filters.vehicles.length)
  const showMore = computed(() => moreOpen.value || moreActiveCount.value > 0)
  const isFiltered = computed(() => !!filters.search.trim() || filters.branches.length > 0 || filters.customers.length > 0 || filters.jobTypes.length > 0 || moreActiveCount.value > 0)

  const all = computed(() => trips.map(toRow))
  const base = computed(() => {
    const q = filters.search.trim().toLowerCase()
    return all.value.filter(t =>
      (!q || [t.id, t.order, t.route, t.driver, t.vehicle, t.customer].some(v => v.toLowerCase().includes(q))) &&
      within(filters.branches, t.branch) && within(filters.customers, t.customer) && within(filters.jobTypes, t.jobType) &&
      within(filters.drivers, t.driver) && within(filters.vehicles, t.vehicle))
  })

  const counts = computed(() => {
    const byStatus: Record<string, number> = {}
    for (const t of base.value) byStatus[t.legStatus] = (byStatus[t.legStatus] ?? 0) + 1
    return { total: base.value.length, byStatus }
  })

  const sorted = computed(() => {
    const rows = status.value ? base.value.filter(t => t.legStatus === status.value) : [...base.value]
    if (!ordering.value) return rows
    const desc = ordering.value.startsWith('-')
    const get = SORTERS[ordering.value.replace(/^-/, '')]
    if (!get) return rows
    return rows.sort((a, b) => (get(a) < get(b) ? -1 : get(a) > get(b) ? 1 : 0) * (desc ? -1 : 1))
  })

  const total = computed(() => sorted.value.length)
  const rows = computed(() => sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

  const statusChips = computed(() => [
    { value: null as string | null, label: 'All', count: counts.value.total },
    ...LEG_STATUSES.map(s => ({
      value: s as string | null,
      label: s,
      count: counts.value.byStatus[s] ?? 0,
      tone: s === 'Needs a truck' ? ('attention' as const) : s === 'Cancelled' ? ('muted' as const) : undefined,
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
    if (ordering.value) q.sort = ordering.value
    if (page.value > 1) q.page = String(page.value)
    if (pageSize.value !== 20) q.size = String(pageSize.value)
    return q
  }

  const fromQuery = (q: Record<string, any>) => {
    const list = (v: unknown) => String(v ?? '').split(',').filter(Boolean)
    filters.search = String(q.q ?? '')
    status.value = (LEG_STATUSES as readonly string[]).includes(q.status) ? q.status : null
    for (const [key, field] of Object.entries(LIST_URL_KEYS)) filters[field] = list(q[key])
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
    } catch { /* the URL still carries the state */ }
  }

  function restore () {
    const hasUrlState = Object.keys(route.query).some(k => STATE_KEYS.includes(k))
    let saved: Record<string, any> = {}
    try { saved = JSON.parse(localStorage.getItem(FILTERS_KEY) ?? '{}') } catch { saved = {} }
    fromQuery(hasUrlState ? route.query : saved)
    sync()
  }

  watch(filters, () => { page.value = 1 }, { deep: true })
  watch(status, () => { page.value = 1 })
  watch([filters, status, ordering, page, pageSize], sync, { deep: true })

  return reactive({ filters, status, ordering, page, pageSize, moreOpen, showMore, moreActiveCount, isFiltered, counts, statusChips, total, rows, resetFilters, restore })
}
