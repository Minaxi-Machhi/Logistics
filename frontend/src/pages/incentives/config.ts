import type { Column, FieldDef } from '@/types'
import { DRV, STATUS } from '@/mock/lookups'
import { num, req, select, text, to } from '../fields'

export const incentiveLink = (r: { id: string }) => to('/app/incentives', r.id)

export const incentiveColumns: Column[] = [
  { key: 'id', title: 'Ref', type: 'mono' }, { key: 'driver', title: 'Driver' }, { key: 'period', title: 'Period' }, { key: 'trips', title: 'Trips' },
  { key: 'onTime', title: 'On-time' }, { key: 'fuel', title: 'Fuel saving' }, { key: 'amount', title: 'Incentive', type: 'money' }, { key: 'status', title: 'Status', type: 'status' },
]

export const incentiveFields: FieldDef[] = [
  select('driver', 'Driver', DRV, req),
  text('period', 'Period', { ...req, value: 'Oct 2026' }),
  num('trips', 'Trips', req),
  text('onTime', 'On-time', { hint: 'e.g. 96.5%' }),
  text('fuel', 'Fuel saving', { hint: 'e.g. 5.2%' }),
  num('amount', 'Incentive', req),
  select('status', 'Status', STATUS.incentive, { ...req, value: 'Open' }),
]
