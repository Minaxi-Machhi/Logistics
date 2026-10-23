import { computed, reactive, ref, watch } from 'vue'
import type { ChooserColumn } from '@/components/common/ColumnChooser.vue'

export interface ColumnDef { colId: string, title: string, sortable?: boolean, align?: 'end' }
interface ColumnState { colId: string, hide: boolean, pinned: 'left' | null }

/** Column order, visibility and pinning for a table, remembered in localStorage. */
export function useColumnState (storageKey: string, defs: ColumnDef[], options: { hidden?: string[], pinned?: string[], locked?: string[] } = {}) {
  const defaults = (): ColumnState[] => defs.map(d => ({ colId: d.colId, hide: !!options.hidden?.includes(d.colId), pinned: options.pinned?.includes(d.colId) ? 'left' : null }))
  const load = (): ColumnState[] => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null') as ColumnState[] | null
      if (saved?.length === defs.length && defs.every(d => saved.some(s => s.colId === d.colId))) return saved
    } catch { /* fall back to defaults */ }
    return defaults()
  }

  const state = ref<ColumnState[]>(load())
  watch(state, s => { try { localStorage.setItem(storageKey, JSON.stringify(s)) } catch { /* ignore */ } }, { deep: true })

  const defOf = (id: string) => defs.find(d => d.colId === id)!
  const chooserColumns = computed<ChooserColumn[]>(() => state.value.map(s => ({ colId: s.colId, label: defOf(s.colId).title, visible: !s.hide, pinned: s.pinned, locked: options.locked?.includes(s.colId) })))
  const headers = computed(() => [
    ...state.value.filter(s => !s.hide).map(s => {
      const d = defOf(s.colId)
      return { title: d.title, key: d.colId, sortable: !!d.sortable, align: d.align, fixed: s.pinned === 'left' }
    }),
    { title: 'Actions', key: 'actions', sortable: false, align: 'start' as const },
  ])

  // reactive() so templates can read `columns.headers` without .value.
  return reactive({
    chooserColumns,
    headers,
    toggle: (id: string, visible: boolean) => { state.value.find(s => s.colId === id)!.hide = !visible },
    pin: (id: string, pinned: 'left' | null) => { state.value.find(s => s.colId === id)!.pinned = pinned },
    reorder: (ids: string[]) => { state.value = ids.map(id => state.value.find(s => s.colId === id)!) },
    reset: () => { state.value = defaults() },
  })
}
