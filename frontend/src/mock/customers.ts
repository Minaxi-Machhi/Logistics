import { reactive } from 'vue'
import type { Customer, CustomerContract } from '@/types'
import { CITY, CUST, day, pick, rows } from './lookups'

export const customers = reactive<Customer[]>(CUST.map((name, i) => ({
  id: `CUS-${101 + i}`,
  name,
  city: pick(CITY, i),
  contact: pick(['Anita Rao', 'Omar Haddad', 'Neha Kulkarni', 'Rohit Bansal'], i),
  creditLimit: 50000 + i * 25000,
  outstanding: 4000 + i * 3750,
  status: pick(['Active', 'Active', 'Active', 'Pending'], i),
})))

export const customerContracts = reactive<CustomerContract[]>(rows(10, i => ({
  id: `CC-${2201 + i}`,
  customer: pick(CUST, i),
  scope: `${pick(CITY, i)} ⇄ ${pick(CITY, i + 5)}`,
  basis: pick(['Per trip', 'Per tonne', 'Per container', 'Per km'], i),
  start: day(300 - i * 9),
  end: day(-60 + i * 30),
  status: pick(['Active', 'Active', 'Expiring', 'Active', 'Expired'], i),
})))
