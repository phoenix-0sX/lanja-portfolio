/**
 * `v-reveal` fades an element up every time it scrolls into view (not only the first time):
 * once it has fully left the viewport it is reset, so it plays again on the next visit.
 * Optional value = delay in ms, e.g. `v-reveal="120"`.
 * Content stays visible without JS / with reduced motion (the class is only added on mount).
 */
type RevealEl = HTMLElement & { __revealObserver?: IntersectionObserver }

const SHOW_AT = 0.12 // fraction of the element that must be visible to play the animation

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<RevealEl, number | undefined>('reveal', {
    mounted(el, binding) {
      if (typeof IntersectionObserver === 'undefined') return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      el.classList.add('reveal')

      // Two thresholds give a hysteresis: show at 12 % visible, reset only when completely out of view.
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= SHOW_AT) {
              el.classList.add('is-visible')
            } else if (!entry.isIntersecting) {
              el.classList.remove('is-visible')
            }
          }
        },
        { threshold: [0, SHOW_AT], rootMargin: '0px 0px -40px 0px' },
      )
      observer.observe(el)
      el.__revealObserver = observer
    },
    unmounted(el) {
      el.__revealObserver?.disconnect()
    },
    getSSRProps: () => ({}),
  })
})
