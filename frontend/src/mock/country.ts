import { computed, ref } from 'vue'

export interface Country {
  code: string
  currency: string
}

export const COUNTRIES: Country[] = [
  { code: 'UAE', currency: 'AED' },
  { code: 'India', currency: 'INR' },
  { code: 'Saudi Arabia', currency: 'SAR' },
  { code: 'Oman', currency: 'OMR' },
]

export const country = ref('UAE')
export const currency = computed(() => COUNTRIES.find(c => c.code === country.value)?.currency ?? 'AED')

// Mock amounts are plain numbers; only the currency label follows the selected country.
export function money (n: number): string {
  return `${currency.value} ${Number(n).toLocaleString('en-US')}`
}
