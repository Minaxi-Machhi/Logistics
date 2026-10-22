import { reactive } from 'vue'

export const toast = reactive({ open: false, text: '' })

export function notify (text: string): void {
  toast.text = text
  toast.open = true
}
