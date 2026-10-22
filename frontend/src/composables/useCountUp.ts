import { onMounted, ref } from 'vue'

/** Counts the first number in `text` up from zero ("107K" becomes 0K ... 107K). Shows the final text at once if motion is reduced. */
export function useCountUp (text: string, duration = 700) {
  const shown = ref(text)
  const match = text.match(/\d+/)

  onMounted(() => {
    if (!match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = Number(match[0])
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      shown.value = text.replace(match[0], String(Math.round(target * eased)))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

  return shown
}
