import { reactive } from 'vue'
import type { Trip } from '@/types'
import { CITY, day, DRV, pick, PLATE, rows } from './lookups'

// Every sixth trip has no truck yet, and a few running trips are late.
export const trips = reactive<Trip[]>(rows(18, i => {
  const unassigned = i % 6 === 4
  const status = unassigned ? 'Scheduled' : pick(['In transit', 'Delivered', 'Scheduled', 'Delivered', 'In transit'], i)
  return {
    id: `TRP-${5100 + i}`,
    order: `ATS-TL2610-${String(27 - (i % 27)).padStart(4, '0')}`,
    route: `${pick(CITY, i)} → ${pick(CITY, i + 3)}`,
    driver: unassigned ? '' : pick(DRV, i),
    vehicle: unassigned ? '' : pick(PLATE, i + 2),
    distance: `${38 + i * 14} km`,
    departure: day(i),
    eta: day(i - 1),
    status,
    ...(status === 'In transit' && i % 4 === 0 ? { delayMin: 20 + i * 7 } : {}),
  }
}))
