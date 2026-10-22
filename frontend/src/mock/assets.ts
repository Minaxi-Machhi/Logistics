import { reactive } from 'vue'
import type { Driver, Vehicle } from '@/types'
import { day, DRV, pick, PLATE, VEHICLE_TYPE } from './lookups'

export const drivers = reactive<Driver[]>(DRV.map((name, i) => ({
  id: `DRV-${41 + i}`,
  name,
  phone: `+971 50 ${String(100 + i * 37)} ${String(2000 + i * 713).slice(0, 4)}`,
  licence: `DXB-${4410 + i * 37}`,
  expiry: day(-120 - i * 45),
  trips: 6 + i % 5 * 2,
  status: pick(['On duty', 'Available', 'On leave', 'On duty', 'Available'], i),
})))

export const vehicles = reactive<Vehicle[]>(PLATE.map((plate, i) => ({
  id: plate,
  type: pick(VEHICLE_TYPE, i),
  capacity: pick(['28 t', '18 t', '12 t', '9 t'], i),
  ownership: pick(['Owned', 'Owned', 'Attached', 'Owned'], i),
  fitness: day(-200 + i * 20),
  insurance: day(-90 - i * 30),
  status: pick(['On duty', 'Available', 'In service', 'On duty'], i),
})))
