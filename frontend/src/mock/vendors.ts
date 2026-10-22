import { reactive } from 'vue'
import type { Vendor, VendorContract, VendorOrder } from '@/types'
import { CITY, day, pick, rows, VEHICLE_TYPE, VEND } from './lookups'

export const vendors = reactive<Vendor[]>(VEND.map((name, i) => ({
  id: `VND-${31 + i}`,
  name,
  type: i === 4 ? 'Shipping line' : i === 7 ? 'Haulage' : 'Road carrier',
  city: pick(CITY, i + 2),
  fleet: 12 + i * 9,
  rating: `${(3.6 + i % 5 * 0.3).toFixed(1)} / 5`,
  status: pick(['Active', 'Active', 'Pending', 'Active'], i),
})))

export const vendorContracts = reactive<VendorContract[]>(rows(9, i => ({
  id: `VC-${810 + i}`,
  vendor: pick(VEND, i),
  lane: `${pick(CITY, i)} → ${pick(CITY, i + 4)}`,
  rate: 1500 + i * 170,
  from: day(240 - i * 10),
  to: day(-90 + i * 25),
  status: pick(['Active', 'Active', 'Expiring', 'Active', 'Expired'], i),
})))

export const vendorOrders = reactive<VendorOrder[]>(rows(14, i => ({
  id: `VPO-${9400 + i}`,
  vendor: pick(VEND, i + 1),
  order: `ATS-TL2610-${String(27 - (i % 27)).padStart(4, '0')}`,
  route: `${pick(CITY, i)} → ${pick(CITY, i + 3)}`,
  vehicle: pick(VEHICLE_TYPE.slice(0, 3), i),
  cost: 1400 + i * 150,
  status: pick(['Confirmed', 'Pending', 'Delivered', 'Delivered', 'Cancelled'], i),
})))
