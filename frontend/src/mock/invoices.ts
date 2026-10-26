import { reactive } from 'vue'
import type { Incentive, Invoice } from '@/types'
import { CUST, day, DRV, pick, rows } from './lookups'

/** VAT and total follow from the amount (UAE VAT, 5%). */
export function withVat<T extends { amount: number }> (row: T): T & { vat: number, total: number } {
  return { ...row, vat: Math.round(row.amount * 0.05), total: Math.round(row.amount * 1.05) }
}

export const invoices = reactive<Invoice[]>(rows(16, i => withVat({
  id: `INV-26-${1040 + i}`,
  customer: pick(CUST, i + 3),
  orders: [`ATS-TL2610-${String(27 - (i % 27)).padStart(4, '0')}`],
  date: day(i * 2),
  due: day(-28 + i * 2),
  amount: 4200 + i * 635,
  status: pick(['Paid', 'Sent', 'Approved', 'Paid', 'Draft', 'Sent'], i),
})))

export const incentives = reactive<Incentive[]>(DRV.map((driver, i) => ({
  id: `INC-${60 + i}`,
  driver,
  period: 'Sep 2026',
  trips: 18 - i % 6,
  onTime: `${(98 - i * 1.4).toFixed(1)}%`,
  fuel: `${(4 + i % 4 * 1.3).toFixed(1)}%`,
  amount: 320 + i * 65,
  status: pick(['Approved', 'Pending', 'Approved', 'Open', 'Rejected'], i),
})))
