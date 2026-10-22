export type StatusColor = 'success' | 'info' | 'warning' | 'error' | 'secondary'

export type ColumnType = 'text' | 'mono' | 'money' | 'status'

export interface Column {
  key: string
  title: string
  type?: ColumnType
}

export type FieldType = 'text' | 'number' | 'date' | 'select'

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  items?: string[]
  required?: boolean
  hint?: string
  value?: string | number
}

/** Every record has a display id (order no., invoice no., registration...) used in routes. */
export interface Entity {
  id: string
}

export type JobType = 'FTL' | 'FCL' | 'LTL'

export interface Order extends Entity {
  ref: string
  customer: string
  jobType: JobType
  origin: string
  destination: string
  originDepot: string
  destDepot: string
  loading: string
  orderDate: string
  rate: number
  status: string
  branch: string
  cutoff: string
}

export interface Trip extends Entity {
  order: string
  route: string
  driver: string
  vehicle: string
  distance: string
  departure: string
  eta: string
  status: string
}

export interface Customer extends Entity {
  name: string
  city: string
  contact: string
  creditLimit: number
  outstanding: number
  status: string
}

export interface CustomerContract extends Entity {
  customer: string
  scope: string
  basis: string
  start: string
  end: string
  status: string
}

export interface Vendor extends Entity {
  name: string
  type: string
  city: string
  fleet: number
  rating: string
  status: string
}

export interface VendorContract extends Entity {
  vendor: string
  lane: string
  rate: number
  from: string
  to: string
  status: string
}

export interface VendorOrder extends Entity {
  vendor: string
  order: string
  route: string
  vehicle: string
  cost: number
  status: string
}

export interface Driver extends Entity {
  name: string
  phone: string
  licence: string
  expiry: string
  trips: number
  status: string
}

export interface Vehicle extends Entity {
  type: string
  capacity: string
  ownership: string
  fitness: string
  insurance: string
  status: string
}

export interface Invoice extends Entity {
  customer: string
  order: string
  date: string
  due: string
  amount: number
  vat: number
  total: number
  status: string
}

export interface Incentive extends Entity {
  driver: string
  period: string
  trips: number
  onTime: string
  fuel: string
  amount: number
  status: string
}

export interface DetailItem {
  label: string
  value: string | number
  type?: ColumnType
}

export interface DetailSection {
  title: string
  items: DetailItem[]
}
