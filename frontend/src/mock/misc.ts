import type { StatusColor } from '@/types'

export interface Report { title: string, text: string, icon: string }
export interface Kpi { label: string, value: string, note: string, color: StatusColor, icon: string, to: string, money?: boolean }
export interface Notification { text: string, time: string, icon: string, color: StatusColor }

export const reports: Report[] = [
  { title: 'Revenue by customer', text: 'Billed amount per customer for any date range.', icon: 'mdi-cash-multiple' },
  { title: 'Trip profitability', text: 'Customer rate against vendor cost and fuel for each trip.', icon: 'mdi-chart-line' },
  { title: 'Order status summary', text: 'FTL, FCL and LTL orders grouped by status.', icon: 'mdi-package-variant-closed' },
  { title: 'Vendor payables', text: 'Open vendor purchase orders and ageing.', icon: 'mdi-account-cash-outline' },
  { title: 'Receivables ageing', text: 'Outstanding invoices in 0-30, 31-60 and 60+ day buckets.', icon: 'mdi-clock-alert-outline' },
  { title: 'Driver performance', text: 'On-time delivery, trips and incentive earned.', icon: 'mdi-card-account-details-outline' },
  { title: 'Vehicle utilisation', text: 'Running days, idle days and km per vehicle.', icon: 'mdi-truck-outline' },
  { title: 'Contract expiry', text: 'Customer and vendor contracts ending in 60 days.', icon: 'mdi-file-clock-outline' },
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
  { text: 'Invoice INV-26-1042 is overdue', time: '2 hours ago', icon: 'mdi-alert-circle-outline', color: 'error' },
  { text: 'Trip TRP-5103 reached Sharjah', time: '5 hours ago', icon: 'mdi-truck-check-outline', color: 'success' },
  { text: 'DXB K 77342 insurance expires in 30 days', time: 'Yesterday', icon: 'mdi-shield-alert-outline', color: 'warning' },
  { text: 'Contract CC-2203 is expiring', time: 'Yesterday', icon: 'mdi-file-clock-outline', color: 'warning' },
  { text: 'New order ATS-TL2610-0027 from Palm Consumer Goods', time: '2 days ago', icon: 'mdi-package-variant-closed-plus', color: 'info' },
  { text: 'Vendor PO VPO-9402 confirmed', time: '2 days ago', icon: 'mdi-check-circle-outline', color: 'success' },
]
