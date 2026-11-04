<script setup lang="ts">
// Decorative drifting squares behind the whole page. Positions are fixed (not random) so the
// server-rendered HTML always matches the client. Colours follow the theme tokens (art-1 / art-2).
interface Square {
  x: number // % from the left
  y: number // % from the top
  size: number // px
  tone: 1 | 2
  outline?: boolean
  dx: number // travel distance in px (sign = direction)
  dy: number
  rot: number // deg
  dur: number // s
  delay: number // s (negative = already mid-flight on load)
}

const squares: Square[] = [
  { x: 6, y: 14, size: 34, tone: 2, dx: 70, dy: -50, rot: 40, dur: 24, delay: -4 },
  { x: 22, y: 62, size: 20, tone: 1, outline: true, dx: -40, dy: 90, rot: -60, dur: 30, delay: -12 },
  { x: 40, y: 8, size: 26, tone: 1, dx: 60, dy: 80, rot: 90, dur: 28, delay: -7 },
  { x: 55, y: 48, size: 48, tone: 2, outline: true, dx: -90, dy: -40, rot: -35, dur: 34, delay: -20 },
  { x: 72, y: 22, size: 18, tone: 2, dx: 50, dy: 100, rot: 120, dur: 22, delay: -3 },
  { x: 88, y: 66, size: 38, tone: 1, dx: -70, dy: -90, rot: 50, dur: 32, delay: -15 },
  { x: 94, y: 12, size: 24, tone: 2, outline: true, dx: -50, dy: 60, rot: -80, dur: 27, delay: -9 },
  { x: 12, y: 86, size: 42, tone: 1, dx: 90, dy: -60, rot: 70, dur: 36, delay: -25 },
  { x: 33, y: 36, size: 16, tone: 2, dx: -60, dy: -70, rot: 150, dur: 21, delay: -6 },
  { x: 64, y: 90, size: 28, tone: 2, dx: 80, dy: -100, rot: -50, dur: 29, delay: -17 },
  { x: 80, y: 40, size: 14, tone: 1, dx: -30, dy: 80, rot: 100, dur: 20, delay: -11 },
  { x: 48, y: 74, size: 22, tone: 1, outline: true, dx: 70, dy: 50, rot: -110, dur: 31, delay: -2 },
  { x: 3, y: 46, size: 30, tone: 2, dx: 60, dy: 70, rot: 60, dur: 33, delay: -18 },
  { x: 97, y: 88, size: 20, tone: 1, dx: -60, dy: -50, rot: -70, dur: 25, delay: -8 },
]

function style(sq: Square) {
  return {
    left: `${sq.x}%`,
    top: `${sq.y}%`,
    width: `${sq.size}px`,
    height: `${sq.size}px`,
    borderRadius: `${Math.round(sq.size * 0.28)}px`,
    '--dx': `${sq.dx}px`,
    '--dy': `${sq.dy}px`,
    '--rot': `${sq.rot}deg`,
    animationDuration: `${sq.dur}s`,
    animationDelay: `${sq.delay}s`,
  }
}
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <span
      v-for="(sq, i) in squares"
      :key="i"
      class="absolute animate-drift will-change-transform"
      :class="[
        sq.outline
          ? sq.tone === 1
            ? 'border-2 border-art-1/40'
            : 'border-2 border-art-2/50'
          : sq.tone === 1
            ? 'bg-art-1/25'
            : 'bg-art-2/30',
      ]"
      :style="style(sq)"
    />
  </div>
</template>
