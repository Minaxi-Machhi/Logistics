import type { StatusColor } from '@/types'

export const pick = <T>(list: readonly T[], i: number): T => list[i % list.length]
export const rows = <T>(n: number, build: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => build(i))
/** dd/mm/yyyy, counting back from the demo "today" (22 Oct 2026). */
export const day = (i: number): string => new Date(2026, 9, 22 - i).toLocaleDateString('en-GB')

export const TODAY = '22/10/2026'
export const addDays = (text: string, n: number): string => {
  const [d, m, y] = text.split('/').map(Number)
  return new Date(y, m - 1, d + n).toLocaleDateString('en-GB')
}
/** Next display id for a list: the highest trailing number plus one. */
export const nextId = (list: { id: string }[], prefix: string, pad = 0): string => {
  const max = list.reduce((n, r) => Math.max(n, parseInt(r.id.match(/(\d+)$/)?.[1] ?? '0', 10)), 0)
  return `${prefix}${String(max + 1).padStart(pad, '0')}`
}

export const CITY = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain', 'Ras Al Khaimah', 'Fujairah', 'Jebel Ali']
export const PORT = ['Jebel Ali', 'Khalifa Port', 'Port Rashid', 'Fujairah Port']
export const CUST = ['Gulf Fresh Foods', 'Emirates Retail Group', 'Desert Pharma', 'Al Noor Trading', 'Falcon Building Materials', 'Marina Hospitality', 'Oasis Beverages', 'Crescent Electronics', 'Palm Consumer Goods', 'Skyline Contracting', 'Sahara Cold Chain', 'Dune Motors']
export const VEND = ['Al Safar Transport', 'Gulf Haulage LLC', 'Bin Rashid Freight', 'Falcon Carriers', 'Horizon Container Lines', 'Mirdif Logistics', 'Sand Route Cargo', 'Khor Fakkan Trucking']
export const DRV = ['Faisal Khan', 'Imran Shaikh', 'Suresh Pillai', 'Manoj Kumar', 'Harjeet Singh', 'Rashid Ali', 'Anil Chauhan', 'Dinesh Nair', 'Mohan Das', 'Yusuf Rahman']
export const PLATE = ['DXB A 48213', 'AUH 7 55120', 'SHJ 3 20987', 'DXB K 77342', 'AJM B 10456', 'DXB M 66031', 'RAK 2 31772', 'DXB C 90815', 'AUH 12 44218', 'SHJ 9 18560']
export const VEHICLE_TYPE = ['Trailer 40 ft', 'Flatbed 20 ft', 'Reefer 20 ft', 'Curtain-side']
export const BRANCH = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Northern Emirates']

export const STATUS_COLOR: Record<string, StatusColor> = {
  Delivered: 'success', Completed: 'success', Paid: 'success', Active: 'success', Available: 'success', Approved: 'success',
  'On duty': 'info', 'In transit': 'info', Confirmed: 'info', Sent: 'info', Open: 'info', 'Ready for invoice': 'info',
  Pending: 'warning', Draft: 'warning', 'Due soon': 'warning', Expiring: 'warning', 'In service': 'warning',
  Cancelled: 'error', Overdue: 'error', Expired: 'error', Rejected: 'error',
  'Needs a truck': 'warning', Assigned: 'info', 'In progress': 'info',
  'On leave': 'secondary', Scheduled: 'secondary', Closed: 'secondary', 'Invoice generated': 'secondary',
}

export const STATUS = {
  order: ['Pending', 'Confirmed', 'Active', 'Completed', 'Ready for invoice', 'Invoice generated', 'Cancelled', 'Rejected'],
  doc: ['Draft', 'Active', 'Expiring', 'Expired'],
  party: ['Active', 'Pending'],
  trip: ['Scheduled', 'In transit', 'Delivered', 'Cancelled'],
  vendorOrder: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
  invoice: ['Draft', 'Sent', 'Due soon', 'Overdue', 'Paid'],
  driver: ['Available', 'On duty', 'On leave'],
  vehicle: ['Available', 'On duty', 'In service'],
  incentive: ['Open', 'Pending', 'Approved', 'Rejected'],
} as const
