import type { StatusColor } from '@/types'

export interface Report { title: string, text: string, icon: string }
export interface Kpi { label: string, value: string, note: string, color: StatusColor, icon: string, to: string, money?: boolean }
export interface Notification { text: string, time: string, icon: string, color: StatusColor }

export const reports: Report[] = [
  { title: 'Trip report', text: 'Every trip in the date range with its order, driver, vehicle and status.', icon: 'mdi-truck-fast-outline' },
  { title: 'Order report', text: 'Orders placed in the date range with route, rate and status.', icon: 'mdi-package-variant-closed' },
  { title: 'Driver and vehicle optimization', text: 'Trips, distance and idle days for each driver and vehicle.', icon: 'mdi-gauge' },
  { title: 'Incentive report', text: 'Driver incentives with on-time delivery and fuel saving.', icon: 'mdi-medal-outline' },
  { title: 'Receivables ageing', text: 'Unpaid invoices per customer, grouped by how long they are past due.', icon: 'mdi-clock-alert-outline' },
  { title: 'Revenue by customer', text: 'Billed amount, VAT and total per customer for the date range.', icon: 'mdi-cash-multiple' },
]

export const dashboard = {
  months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  ordersByType: { FTL: [62, 70, 66, 81, 88, 74], FCL: [18, 22, 25, 24, 31, 28], LTL: [40, 44, 52, 49, 57, 51] } as Record<string, number[]>,
  revenue: [84, 91, 88, 106, 119, 107], // thousands
  kpis: [
    { label: 'Open orders', value: '132', note: '+9 this week', color: 'success', icon: 'mdi-package-variant-closed', to: '/app/orders' },
    { label: 'Trips in transit', value: '27', note: '4 delayed', color: 'warning', icon: 'mdi-truck-fast-outline', to: '/app/trips' },
    { label: 'Billed this month', value: '107K', note: '-10% vs Sep', color: 'error', icon: 'mdi-cash-multiple', to: '/app/invoices', money: true },
    { label: 'Receivables due', value: '62K', note: '5 invoices overdue', color: 'error', icon: 'mdi-clock-alert-outline', to: '/app/invoices', money: true },
    { label: 'Vehicles on duty', value: '14 / 19', note: '74% utilisation', color: 'success', icon: 'mdi-truck-outline', to: '/app/assets?tab=vehicles' },
  ] as Kpi[],
}

export const notifications: Notification[] = [
  { text: 'Invoice INV-26-1042 is waiting for approval', time: '2 hours ago', icon: 'mdi-alert-circle-outline', color: 'error' },
  { text: 'Trip TRP-5103 reached Sharjah', time: '5 hours ago', icon: 'mdi-truck-check-outline', color: 'success' },
  { text: 'DXB K 77342 insurance expires in 30 days', time: 'Yesterday', icon: 'mdi-shield-alert-outline', color: 'warning' },
  { text: 'Contract CC-2203 is expiring', time: 'Yesterday', icon: 'mdi-file-clock-outline', color: 'warning' },
  { text: 'New order ATS-TL2610-0027 from Palm Consumer Goods', time: '2 days ago', icon: 'mdi-package-variant-closed-plus', color: 'info' },
  { text: 'Vendor PO VPO-9402 confirmed', time: '2 days ago', icon: 'mdi-check-circle-outline', color: 'success' },
]
