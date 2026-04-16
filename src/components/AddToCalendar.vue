<script setup>
import { ref } from 'vue'
import gsap from 'gsap'
import { downloadCalendar } from '../services/calendarService'

const props = defineProps({
  /** 'both' | 'civil' | 'fiesta' */
  which: { type: String, default: 'both' },
  /** Variante visual: 'outline' | 'solid' | 'ghost' */
  variant: { type: String, default: 'outline' },
})

const btnRef = ref(null)
const downloaded = ref(false)

function handleClick() {
  downloadCalendar(props.which)

  downloaded.value = true
  setTimeout(() => { downloaded.value = false }, 3000)

  // micro feedback
  gsap.fromTo(btnRef.value,
    { scale: 0.93 },
    { scale: 1, duration: 0.4, ease: 'back.out(2)' }
  )
}
</script>

<template>
  <button
    ref="btnRef"
    type="button"
    class="add-to-cal-btn"
    :class="[`add-to-cal-btn--${variant}`, { 'downloaded': downloaded }]"
    :aria-label="downloaded ? 'Calendario descargado' : 'Agendar en mi calendario'"
    @click="handleClick"
  >
    <i :class="downloaded ? 'pi pi-check' : 'pi pi-calendar-plus'" class="me-2"></i>
    <span>{{ downloaded ? '¡Listo! Revisá tus descargas' : 'Agendar en mi calendario' }}</span>
  </button>
</template>

<style scoped>
.add-to-cal-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border-radius: 2rem;
  padding: 0.6rem 1.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  min-height: 44px;
  cursor: pointer;
  transition: all 0.25s ease;
  will-change: transform;
  white-space: nowrap;
}

/* ── Outline (default, para las tarjetas de evento) ── */
.add-to-cal-btn--outline {
  background: transparent;
  border: 1.5px solid var(--primary-color);
  color: var(--primary-color);
}

.add-to-cal-btn--outline:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(212, 163, 115, 0.25);
}

/* ── Solid (para pantalla de éxito del RSVP) ── */
.add-to-cal-btn--solid {
  background: var(--primary-color);
  border: 1.5px solid var(--primary-color);
  color: white;
}

.add-to-cal-btn--solid:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 163, 115, 0.3);
}

/* ── Ghost (minimalista) ── */
.add-to-cal-btn--ghost {
  background: transparent;
  border: none;
  color: var(--primary-color);
  padding: 0.4rem 0.8rem;
}

.add-to-cal-btn--ghost:hover {
  background: var(--secondary-color);
}

/* Estado "descargado" */
.add-to-cal-btn.downloaded {
  background: #d1e7dd !important;
  border-color: #a3cfbb !important;
  color: #0a3622 !important;
  pointer-events: none;
}
</style>
