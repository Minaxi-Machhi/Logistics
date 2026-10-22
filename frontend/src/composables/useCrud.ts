import { reactive, ref } from 'vue'
import type { Entity } from '@/types'
import { nextId } from '@/mock/lookups'
import { notify } from './useToast'

type Values = Record<string, any>

interface CrudOptions<T extends Entity> {
  /** Prefix for generated ids, e.g. "FTL-". Ignored when the form supplies its own `id`. */
  prefix: string
  pad?: number
  /** Turns form values into a full record (derived fields, defaults). */
  build?: (values: Values, id: string) => T
  /** Applies form values onto an existing record. */
  update?: (current: T, values: Values) => Partial<T>
}

/** Add, edit and delete for a reactive list, plus the open/close state the dialogs need. */
export function useCrud<T extends Entity> (list: T[], options: CrudOptions<T>) {
  const formOpen = ref(false)
  const confirmOpen = ref(false)
  const editing = ref<T | null>(null)
  const target = ref<T | null>(null)

  function openNew (): void {
    editing.value = null
    formOpen.value = true
  }

  function openEdit (row: T): void {
    editing.value = row
    formOpen.value = true
  }

  function askRemove (row: T): void {
    target.value = row
    confirmOpen.value = true
  }

  function save (values: Values): void {
    if (editing.value) {
      Object.assign(editing.value, options.update ? options.update(editing.value, values) : values)
      notify(`${editing.value.id} updated`)
      return
    }
    const id = values.id ? String(values.id) : nextId(list, options.prefix, options.pad)
    const row = options.build ? options.build(values, id) : ({ ...values, id } as T)
    list.unshift(row)
    notify(`${row.id} created`)
  }

  /** Returns true when a record was removed. */
  function remove (): boolean {
    if (!target.value) return false
    const at = list.indexOf(target.value)
    if (at >= 0) list.splice(at, 1)
    notify(`${target.value.id} deleted`)
    confirmOpen.value = false
    return at >= 0
  }

  // reactive() so templates can bind `crud.formOpen` directly, even when `crud` is picked by a computed.
  return reactive({ formOpen, confirmOpen, editing, target, openNew, openEdit, askRemove, save, remove })
}

/** Loosely typed handle for pages that pick one of several crud instances at runtime. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Crud = ReturnType<typeof useCrud<any>>
