import type { FieldDef } from '@/types'

type Extra = Partial<Omit<FieldDef, 'key' | 'label' | 'type'>>

export const text = (key: string, label: string, extra: Extra = {}): FieldDef => ({ key, label, type: 'text', ...extra })
export const num = (key: string, label: string, extra: Extra = {}): FieldDef => ({ key, label, type: 'number', ...extra })
export const date = (key: string, label: string, extra: Extra = {}): FieldDef => ({ key, label, type: 'date', required: true, ...extra })
export const select = (key: string, label: string, items: readonly string[], extra: Extra = {}): FieldDef => ({ key, label, type: 'select', items: [...items], ...extra })
export const req: Extra = { required: true }

/** Detail page link for a record id (ids can hold spaces, e.g. vehicle plates). */
export const to = (base: string, id: string): string => `${base}/${encodeURIComponent(id)}`
