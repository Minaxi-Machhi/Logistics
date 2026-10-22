import { reactive } from 'vue'
import type { Trip } from '@/types'
import { CITY, day, DRV, pick, PLATE, rows } from './lookups'

export const trips = reactive<Trip[]>(rows(18, i => ({
  id: `TRP-${5100 + i}`,
  order: `ATS-TL2610-${String(27 - (i % 27)).padStart(4, '0')}`,
  route: `${pick(CITY, i)} → ${pick(CITY, i + 3)}`,
  driver: pick(DRV, i),
  vehicle: pick(PLATE, i + 2),
  distance: `${38 + i * 14} km`,
  departure: day(i),
  eta: day(i - 1),
  status: pick(['In transit', 'Delivered', 'Scheduled', 'Delivered', 'In transit'], i),
})))
