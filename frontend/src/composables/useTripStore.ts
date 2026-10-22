import { computed, reactive } from 'vue'
import type { Trip } from '@/types'
import { trips } from '@/mock/trips'

/** Which trip the row-action dialogs act on, and which of them is open. */
export const tripStore = reactive({
  currentTripId: null as string | null,
  rescheduleOpen: false,
  allocateOpen: false,

  open (dialog: 'rescheduleOpen' | 'allocateOpen', trip: Trip) {
    this.currentTripId = trip.id
    this[dialog] = true
  },
})

export const currentTrip = computed<Trip | undefined>(() => trips.find(t => t.id === tripStore.currentTripId))
