import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface FilterDef<T> {
  key: string
  label: string
  /** Text of the pill while nothing is chosen, e.g. "All cities". */
  allLabel: string
  icon: string
  options: readonly string[]
  get: (row: T) => string
  searchable?: boolean
  /** Hidden behind "More filters" until used. */
  more?: boolean
}

export interface ListConfig<T> {
  /** Remembers the last-used view in localStorage. */
  storageKey: string
  searchPlaceholder: string
  searchText: (row: T) => string[]
  filters: FilterDef<T>[]
  status?: { get: (row: T) => string, list: readonly string[], attention?: string, muted?: string[] }
  sorters: Record<string, (row: T) => string | number>
  /** Keep filters in the URL. Pages with tabs keep them in localStorage only. */
  syncUrl?: boolean
}

const dmyToIso = (v: string) => (/^\d{2}\/\d{2}\/\d{4}$/.test(v) ? v.split('/').reverse().join('-') : v)

/** Search, filters, status chips, sort and paging for a list page. Used by every list except Orders and Trips, which have their own. */
export function useList<T> (source: () => T[], config: ListConfig<T>) {
  const route = useRoute()
  const router = useRouter()

  const search = ref('')
  const values = reactive<Record<string, string[]>>(Object.fromEntries(config.filters.map(f => [f.key, [] as string[]])))
  const status = ref<string | null>(null)
  const ordering = ref<string | null>(null)
  const page = ref(1)
  const pageSize = ref(20)
  const moreOpen = ref(false)

  const moreKeys = config.filters.filter(f => f.more).map(f => f.key)
  const moreActiveCount = computed(() => moreKeys.filter(k => values[k].length).length)
  const showMore = computed(() => moreOpen.value || moreActiveCount.value > 0)
  const isFiltered = computed(() => !!search.value.trim() || config.filters.some(f => values[f.key].length))

  const base = computed(() => {
    const q = search.value.trim().toLowerCase()
    return source().filter(row =>
      (!q || config.searchText(row).some(v => String(v).toLowerCase().includes(q))) &&
      config.filters.every(f => !values[f.key].length || values[f.key].includes(f.get(row))))
  })

  const counts = computed(() => {
    const byStatus: Record<string, number> = {}
    if (config.status) for (const row of base.value) { const s = config.status.get(row); byStatus[s] = (byStatus[s] ?? 0) + 1 }
    return { total: base.value.length, byStatus }
  })

  const sorted = computed(() => {
    const rows = status.value && config.status ? base.value.filter(r => config.status!.get(r) === status.value) : [...base.value]
    const key = ordering.value?.replace(/^-/, '')
    const get = key ? config.sorters[key] : undefined
    if (!get) return rows
    const desc = ordering.value!.startsWith('-')
    return rows.sort((a, b) => {
      const x = get(a)
      const y = get(b)
      return (x < y ? -1 : x > y ? 1 : 0) * (desc ? -1 : 1)
    })
  })

  const total = computed(() => sorted.value.length)
  const rows = computed(() => sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

  const statusChips = computed(() => !config.status ? [] : [
    { value: null as string | null, label: 'All', count: counts.value.total },
    ...config.status.list.map(s => ({
      value: s as string | null,
      label: s,
      count: counts.value.byStatus[s] ?? 0,
      tone: s === config.status!.attention ? ('attention' as const) : config.status!.muted?.includes(s) ? ('muted' as const) : undefined,
    })),
  ])

  function resetFilters () {
    search.value = ''
    for (const f of config.filters) values[f.key] = []
    moreOpen.value = false
  }

  // ---- URL and storage ----
  const stateKeys = ['q', 'status', 'sort', 'page', 'size', ...config.filters.map(f => `f_${f.key}`)]

  const toQuery = () => {
    const q: Record<string, string> = {}
    if (search.value.trim()) q.q = search.value.trim()
    if (status.value) q.status = status.value
    for (const f of config.filters) if (values[f.key].length) q[`f_${f.key}`] = values[f.key].join('|')
    if (ordering.value) q.sort = ordering.value
    if (page.value > 1) q.page = String(page.value)
    if (pageSize.value !== 20) q.size = String(pageSize.value)
    return q
  }

  const fromQuery = (q: Record<string, any>) => {
    search.value = String(q.q ?? '')
    status.value = config.status?.list.includes(q.status) ? q.status : null
    for (const f of config.filters) values[f.key] = String(q[`f_${f.key}`] ?? '').split('|').filter(Boolean)
    const key = String(q.sort ?? '').replace(/^-/, '')
    ordering.value = key && config.sorters[key] ? String(q.sort) : null
    page.value = Math.max(1, Number(q.page) || 1)
    pageSize.value = [20, 50, 100].includes(Number(q.size)) ? Number(q.size) : 20
    moreOpen.value = moreActiveCount.value > 0
  }

  function sync () {
    const query = toQuery()
    if (config.syncUrl) {
      const others = Object.fromEntries(Object.entries(route.query).filter(([k]) => !stateKeys.includes(k)))
      router.replace({ query: { ...others, ...query } })
    }
    try {
      const { page: _page, ...persisted } = query
      localStorage.setItem(config.storageKey, JSON.stringify(persisted))
    } catch { /* storage unavailable */ }
  }

  function restore () {
    let saved: Record<string, any> = {}
    try { saved = JSON.parse(localStorage.getItem(config.storageKey) ?? '{}') } catch { saved = {} }
    const hasUrlState = !!config.syncUrl && Object.keys(route.query).some(k => stateKeys.includes(k))
    fromQuery(hasUrlState ? route.query : saved)
    sync()
  }

  watch([search, values], () => { page.value = 1 }, { deep: true })
  watch(status, () => { page.value = 1 })
  watch([search, values, status, ordering, page, pageSize], sync, { deep: true })

  return reactive({
    filterDefs: config.filters, searchPlaceholder: config.searchPlaceholder, sorters: config.sorters,
    search, values, status, ordering, page, pageSize, moreOpen, showMore, moreActiveCount, isFiltered, statusChips, total, rows, resetFilters, restore,
  })
}

export type ListState = ReturnType<typeof useList<any>>

export { dmyToIso }
