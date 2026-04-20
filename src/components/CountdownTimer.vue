<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const targetDate = new Date('2027-11-06T18:00:00')
const startDate  = new Date('2024-11-06T00:00:00')

const days    = ref(0)
const hours   = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const timeOfDayColor = computed(() => {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  if (h >= 18 && h < 21) return 'sunset'
  return 'night'
})

const updateCountdown = () => {
  const diff = targetDate - new Date()
  if (diff <= 0) { days.value = hours.value = minutes.value = seconds.value = 0; return }
  days.value    = Math.floor(diff / 86400000)
  hours.value   = Math.floor((diff % 86400000) / 3600000)
  minutes.value = Math.floor((diff % 3600000)  / 60000)
  seconds.value = Math.floor((diff % 60000)    / 1000)
}

const createParticle = () => {
  const container = document.querySelector('.cd-particles')
  if (!container) return
  const p = document.createElement('div')
  p.className = 'cd-particle'
  container.appendChild(p)
  const x = Math.random() * window.innerWidth
  const size = Math.random() * 7 + 3
  gsap.set(p, { x, y: window.innerHeight + 10, width: size, height: size, opacity: Math.random() * 0.4 + 0.1 })
  gsap.to(p, {
    y: -80, x: x + (Math.random() - 0.5) * 180,
    rotation: Math.random() * 360,
    duration: Math.random() * 12 + 10,
    ease: 'none', onComplete: () => p.remove()
  })
}

let countdownTimer, particleTimer
onMounted(() => {
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
  particleTimer  = setInterval(createParticle, 2000)
  gsap.from('.cd-glass', { opacity: 0, scale: 0.92, y: 30, duration: 1.2, ease: 'power3.out', delay: 0.3 })
})

onUnmounted(() => {
  clearInterval(countdownTimer)
  clearInterval(particleTimer)
})
</script>

<template>
  <section class="cd-section overflow-hidden position-relative" :class="timeOfDayColor">
    <div class="cd-particles" aria-hidden="true"></div>

    <div class="container position-relative z-1 py-5 py-md-4">
      <!-- Header -->
      <div class="text-center mb-4 mb-md-5">
        <span class="cd-eyebrow">6 de Noviembre, 2027</span>
        <h2 class="GreatVibes cd-title">Faltan…</h2>
      </div>

      <!-- Glass card -->
      <div class="cd-glass mx-auto">
        <div class="cd-row">
          <div class="cd-unit">
            <span class="cd-number">{{ days }}</span>
            <span class="cd-label">Días</span>
          </div>
          <div class="cd-sep" aria-hidden="true">:</div>
          <div class="cd-unit">
            <span class="cd-number">{{ hours }}</span>
            <span class="cd-label">Horas</span>
          </div>
          <div class="cd-sep" aria-hidden="true">:</div>
          <div class="cd-unit">
            <span class="cd-number">{{ minutes }}</span>
            <span class="cd-label">Min</span>
          </div>
          <div class="cd-sep" aria-hidden="true">:</div>
          <div class="cd-unit">
            <span class="cd-number cd-number--seconds">{{ seconds }}</span>
            <span class="cd-label">Seg</span>
          </div>
        </div>

        <!-- Ornamento -->
        <div class="cd-ornament" aria-hidden="true">
          <span class="cd-orn-line"></span>
          <span class="cd-orn-glyph">✦</span>
          <span class="cd-orn-line"></span>
        </div>
        <p class="cd-caption">Cada segundo nos acerca más</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Temas de hora ────────────────────────── */
.cd-section {
  transition: background 3s ease;
  padding: 3rem 0;
}
.morning   { background: linear-gradient(150deg, #fdfbf7 0%, #e8c99a 100%); }
.afternoon { background: linear-gradient(150deg, #d4a373 0%, #faedcd 80%); }
.sunset    { background: linear-gradient(150deg, #d4a373 0%, #a44a3f 100%); }
.night     { background: linear-gradient(150deg, #2b2d42 0%, #4a4e6e 100%); }

/* ── Partículas ───────────────────────────── */
.cd-particles {
  position: absolute; inset: 0;
  pointer-events: none; overflow: hidden;
}
:deep(.cd-particle) {
  position: absolute; border-radius: 50%;
  background: rgba(255,255,255,0.7);
  filter: blur(1px);
}

/* ── Eyebrow y título ─────────────────────── */
.cd-eyebrow {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  margin-bottom: 0.5rem;
}
.morning .cd-eyebrow, .afternoon .cd-eyebrow { color: var(--primary-dark); }

.cd-title {
  font-size: clamp(2.2rem, 8vw, 3.5rem);
  color: white;
  margin: 0;
  text-shadow: 0 2px 20px rgba(0,0,0,0.15);
}
.morning .cd-title, .afternoon .cd-title { color: var(--text-dark); }

/* ── Glass card ───────────────────────────── */
.cd-glass {
  max-width: 640px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 2rem;
  padding: 2rem 1.5rem 1.5rem;
  box-shadow: 0 25px 60px rgba(0,0,0,0.12);
}
.morning .cd-glass, .afternoon .cd-glass {
  background: rgba(255,255,255,0.55);
  border-color: rgba(255,255,255,0.7);
}

/* ── Row de unidades ─────────────────────── */
.cd-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cd-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
}

.cd-number {
  font-family: var(--modern-font);
  font-size: clamp(2.8rem, 10vw, 4.5rem);
  font-weight: 800;
  color: white;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  min-width: 2ch;
  text-align: center;
}
.morning .cd-number, .afternoon .cd-number { color: var(--text-dark); }

.cd-number--seconds {
  opacity: 0.65;
  font-size: clamp(2rem, 7vw, 3.2rem);
}

.cd-sep {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 300;
  color: rgba(255,255,255,0.4);
  line-height: 1;
  margin-bottom: 1.5rem;
  align-self: flex-start;
  padding-top: 0.15rem;
}
.morning .cd-sep, .afternoon .cd-sep { color: rgba(0,0,0,0.2); }

.cd-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.65);
  margin-top: 0.4rem;
}
.morning .cd-label, .afternoon .cd-label { color: var(--text-muted); }

/* ── Ornamento inferior ───────────────────── */
.cd-ornament {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem auto 0.75rem;
  max-width: 200px;
}
.cd-orn-line {
  flex: 1; height: 1px;
  background: rgba(255,255,255,0.3);
}
.morning .cd-orn-line, .afternoon .cd-orn-line { background: rgba(0,0,0,0.12); }
.cd-orn-glyph { color: rgba(255,255,255,0.5); font-size: 0.75rem; }
.morning .cd-orn-glyph, .afternoon .cd-orn-glyph { color: var(--primary-color); }

.cd-caption {
  font-size: 0.78rem;
  text-align: center;
  color: rgba(255,255,255,0.55);
  margin: 0;
  font-style: italic;
  letter-spacing: 0.05em;
}
.morning .cd-caption, .afternoon .cd-caption { color: var(--text-muted); }

/* ── Mobile ───────────────────────────────── */
@media (max-width: 480px) {
  .cd-glass { padding: 1.5rem 1rem 1.25rem; border-radius: 1.5rem; }
  .cd-unit  { min-width: 58px; }
  .cd-row   { gap: 0.25rem; }
}
</style>
