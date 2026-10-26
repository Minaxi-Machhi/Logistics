import { reactive } from 'vue'
import { buildReport, toCsv, toExcel } from '@/mock/reportData'
import { notify } from './useToast'

export interface GeneratedReport {
  id: string
  title: string
  from: string
  to: string
  format: 'CSV' | 'Excel'
  rows: number
  generatedAt: string
  status: 'Generating' | 'Ready'
  /** When the "server" finishes building it (ms since epoch). Only set while Generating. */
  readyAt?: number
}

const KEY = 'generated-reports-v2'

const SEED: Omit<GeneratedReport, 'rows' | 'status' | 'readyAt'>[] = [
  { id: 'RPT-S0005', title: 'Revenue by customer', from: '2026-10-01', to: '2026-10-21', format: 'CSV', generatedAt: '21/10/2026 17:42' },
  { id: 'RPT-S0004', title: 'Trip report', from: '2026-10-01', to: '2026-10-20', format: 'Excel', generatedAt: '20/10/2026 11:05' },
  { id: 'RPT-S0003', title: 'Order report', from: '2026-09-01', to: '2026-09-30', format: 'CSV', generatedAt: '01/10/2026 09:30' },
  { id: 'RPT-S0002', title: 'Driver and vehicle optimization', from: '2026-09-01', to: '2026-09-30', format: 'Excel', generatedAt: '30/09/2026 16:18' },
  { id: 'RPT-S0001', title: 'Incentive report', from: '2026-09-01', to: '2026-09-30', format: 'CSV', generatedAt: '30/09/2026 14:02' },
]

// First visit: a few sample reports so the list shows how it works. After that, whatever the user keeps.
const load = (): GeneratedReport[] => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) return SEED.map(r => ({ ...r, rows: buildReport(r.title, r.from, r.to).rows.length, status: 'Ready' as const }))
    return JSON.parse(raw) as GeneratedReport[]
  } catch { return [] }
}

/** Reports the user has generated, newest first. The file is rebuilt from the current data on each download. */
export const generated = reactive<GeneratedReport[]>(load())

const save = () => { try { localStorage.setItem(KEY, JSON.stringify(generated)) } catch { /* ignore */ } }
const stamp = () => new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')

/** Starts a report. It stays Generating until the list is refreshed after it has finished building. */
export function generate (title: string, from: string, to: string, format: 'CSV' | 'Excel'): void {
  generated.unshift({ id: `RPT-${Date.now().toString(36).toUpperCase()}`, title, from, to, format, rows: buildReport(title, from, to).rows.length, generatedAt: stamp(), status: 'Generating', readyAt: Date.now() + 2500 })
  save()
  notify(`${title} is generating. Refresh the list to see when it is ready.`)
}

/** Marks every report that has finished building as Ready. Returns how many became ready. */
export function refreshReports (): number {
  let done = 0
  for (const r of generated) {
    if (r.status === 'Generating' && (r.readyAt ?? 0) <= Date.now()) {
      r.status = 'Ready'
      delete r.readyAt
      done++
    }
  }
  save()
  return done
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function download (report: GeneratedReport): void {
  const table = buildReport(report.title, report.from, report.to)
  const excel = report.format === 'Excel'
  const blob = new Blob([excel ? toExcel(table) : `﻿${toCsv(table)}`], { type: excel ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug(report.title)}_${report.from}_to_${report.to}.${excel ? 'xls' : 'csv'}`
  a.click()
  URL.revokeObjectURL(url)
  notify(`${a.download} downloaded`)
}

