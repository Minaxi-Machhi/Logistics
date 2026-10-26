import { drivers, vehicles } from './assets'
import { incentives, invoices } from './invoices'
import { TODAY } from './lookups'
import { orders } from './orders'
import { trips } from './trips'

export interface ReportTable {
  columns: string[]
  rows: (string | number)[][]
}

const iso = (dmy: string) => dmy.split('/').reverse().join('-')
const inRange = (dmy: string, from: string, to: string) => iso(dmy) >= from && iso(dmy) <= to
const daysBetween = (fromDmy: string, toDmy: string) => Math.round((new Date(iso(toDmy)).getTime() - new Date(iso(fromDmy)).getTime()) / 864e5)
const group = <T>(list: T[], key: (r: T) => string) => list.reduce<Record<string, T[]>>((m, r) => { (m[key(r)] ??= []).push(r); return m }, {})
const sum = (nums: number[]) => nums.reduce((n, v) => n + v, 0)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthKey = (period: string) => { const [m, y] = period.split(' '); return `${y}-${String(MONTHS.indexOf(m) + 1).padStart(2, '0')}` }
const daysInRange = (from: string, to: string) => Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 864e5) + 1)

const BUILDERS: Record<string, (from: string, to: string) => ReportTable> = {
  'Trip report': (from, to) => ({
    columns: ['Trip', 'Order', 'Customer', 'Route', 'Driver', 'Vehicle', 'Distance (km)', 'Departure', 'ETA', 'Status'],
    rows: trips.filter(t => inRange(t.departure, from, to)).map(t => [t.id, t.order, orders.find(o => o.id === t.order)?.customer ?? '', t.route, t.driver || 'Unassigned', t.vehicle || 'Unassigned', parseInt(t.distance, 10) || 0, t.departure, t.eta, t.status]),
  }),

  'Order report': (from, to) => ({
    columns: ['Order', 'Reference', 'Customer', 'Job type', 'Origin', 'Destination', 'Loading', 'Order date', 'Branch', 'Sell rate', 'Status'],
    rows: orders.filter(o => inRange(o.orderDate, from, to)).map(o => [o.id, o.ref, o.customer, o.jobType, o.origin, o.destination, o.loading, o.orderDate, o.branch, o.rate, o.status]),
  }),

  'Driver and vehicle optimization': (from, to) => {
    const days = daysInRange(from, to)
    const inPeriod = trips.filter(t => inRange(t.departure, from, to) && t.driver && t.vehicle)
    const pairs = Object.values(group(inPeriod, t => `${t.driver}|${t.vehicle}`)).map(list => {
      const busyDays = new Set(list.map(t => t.departure)).size
      return [list[0].driver, list[0].vehicle, list.length, sum(list.map(t => parseInt(t.distance, 10) || 0)), list.filter(t => t.status === 'Completed').length, busyDays, days - busyDays, Math.round(busyDays / days * 100)] as (string | number)[]
    })
    // Drivers and vehicles with no trip in the range are the idle capacity.
    const idleDrivers = drivers.filter(d => !inPeriod.some(t => t.driver === d.name)).map(d => [d.name, '—', 0, 0, 0, 0, days, 0] as (string | number)[])
    const idleVehicles = vehicles.filter(v => !inPeriod.some(t => t.vehicle === v.id)).map(v => ['—', v.id, 0, 0, 0, 0, days, 0] as (string | number)[])
    return {
      columns: ['Driver', 'Vehicle', 'Trips', 'Distance (km)', 'Completed', 'Busy days', 'Idle days', 'Utilisation %'],
      rows: [...pairs.sort((a, b) => Number(b[7]) - Number(a[7])), ...idleDrivers, ...idleVehicles],
    }
  },

  'Incentive report': (from, to) => ({
    columns: ['Ref', 'Driver', 'Period', 'Trips', 'On-time', 'Fuel saving', 'Incentive', 'Status'],
    rows: incentives.filter(i => monthKey(i.period) >= from.slice(0, 7) && monthKey(i.period) <= to.slice(0, 7)).map(i => [i.id, i.driver, i.period, i.trips, i.onTime, i.fuel, i.amount, i.status]),
  }),

  // Unpaid invoices by days past their due date, as of the demo "today".
  'Receivables ageing': () => {
    const late = (due: string) => daysBetween(due, TODAY)
    return {
      columns: ['Customer', 'Not yet due', '1-30 days', '31-60 days', '60+ days', 'Total open'],
      rows: Object.entries(group(invoices.filter(i => i.status !== 'Paid'), i => i.customer)).map(([c, list]) => [
        c,
        sum(list.filter(i => late(i.due) <= 0).map(i => i.total)),
        sum(list.filter(i => late(i.due) > 0 && late(i.due) <= 30).map(i => i.total)),
        sum(list.filter(i => late(i.due) > 30 && late(i.due) <= 60).map(i => i.total)),
        sum(list.filter(i => late(i.due) > 60).map(i => i.total)),
        sum(list.map(i => i.total)),
      ] as (string | number)[]).sort((a, b) => Number(b[5]) - Number(a[5])),
    }
  },

  'Revenue by customer': (from, to) => ({
    columns: ['Customer', 'Invoices', 'Amount', 'VAT', 'Total'],
    rows: Object.entries(group(invoices.filter(i => inRange(i.date, from, to)), i => i.customer))
      .map(([c, list]) => [c, list.length, sum(list.map(i => i.amount)), sum(list.map(i => i.vat)), sum(list.map(i => i.total))] as (string | number)[])
      .sort((a, b) => Number(b[4]) - Number(a[4])),
  }),
}

export const buildReport = (title: string, from: string, to: string): ReportTable => (BUILDERS[title] ?? (() => ({ columns: [], rows: [] })))(from, to)

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
export const toCsv = (t: ReportTable): string => [t.columns, ...t.rows].map(r => r.map(csvCell).join(',')).join('\r\n')

const esc = (v: string | number) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
/** An HTML table with an .xls name: Excel opens it as a sheet. */
export const toExcel = (t: ReportTable): string =>
  `<html><head><meta charset="utf-8"></head><body><table border="1"><tr>${t.columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr>${t.rows.map(r => `<tr>${r.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</table></body></html>`
