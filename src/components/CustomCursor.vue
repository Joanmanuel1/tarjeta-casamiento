<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const ring = ref(null)
const dot = ref(null)

let mouseX = 0, mouseY = 0
let ringX = 0, ringY = 0
let raf = null
let isVisible = false

const LERP = 0.12   // qué tan "pegado" va el ring al cursor (0-1)

function lerp(a, b, t) { return a + (b - a) * t }

function onMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY

  // El dot sigue instantáneamente
  gsap.set(dot.value, { x: mouseX, y: mouseY })

  if (!isVisible) {
    isVisible = true
    gsap.to([ring.value, dot.value], { opacity: 1, duration: 0.3 })
  }
}

function onMouseLeave() {
  gsap.to([ring.value, dot.value], { opacity: 0, duration: 0.3 })
  isVisible = false
}

// Detectar hover sobre links/botones → agrandar ring
function onMouseOver(e) {
  const target = e.target.closest('a, button, [role="button"], .hover-lift, label')
  if (target) {
    gsap.to(ring.value, { scale: 1.8, borderColor: 'rgba(212,163,115,0.9)', duration: 0.25 })
    gsap.to(dot.value, { scale: 0, duration: 0.2 })
  }
}
function onMouseOut(e) {
  const target = e.target.closest('a, button, [role="button"], .hover-lift, label')
  if (target) {
    gsap.to(ring.value, { scale: 1, borderColor: 'rgba(212,163,115,0.6)', duration: 0.25 })
    gsap.to(dot.value, { scale: 1, duration: 0.2 })
  }
}

function tick() {
  ringX = lerp(ringX, mouseX, LERP)
  ringY = lerp(ringY, mouseY, LERP)
  gsap.set(ring.value, { x: ringX, y: ringY })
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  // Solo en desktop con mouse real
  if (window.matchMedia('(pointer: coarse)').matches) return

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
  document.addEventListener('mouseover', onMouseOver)
  document.addEventListener('mouseout', onMouseOut)

  // Ocultar cursor nativo del browser via clase global
  document.documentElement.classList.add('custom-cursor-active')

  raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  document.removeEventListener('mouseover', onMouseOver)
  document.removeEventListener('mouseout', onMouseOut)
  document.documentElement.classList.remove('custom-cursor-active')
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <!-- Solo se renderiza, el posicionamiento es por JS (gsap.set) -->
  <div aria-hidden="true">
    <!-- Anillo con lag -->
    <div ref="ring" class="cursor-ring"></div>
    <!-- Punto central instantáneo -->
    <div ref="dot" class="cursor-dot">
      <svg viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 17S1 11 1 5.5A4.5 4.5 0 0 1 10 3.5 4.5 4.5 0 0 1 19 5.5C19 11 10 17 10 17Z"
              fill="#d4a373" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(212, 163, 115, 0.6);
  border-radius: 50%;
  pointer-events: none;
  z-index: 999998;
  opacity: 0;
  /* Centrar el anillo sobre la punta */
  transform: translate(-50%, -50%);
  will-change: transform;
  transition: border-color 0.25s, width 0.25s, height 0.25s;
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 14px;
  height: 14px;
  pointer-events: none;
  z-index: 999999;
  opacity: 0;
  /* Centrar el corazón */
  transform: translate(-50%, -50%);
  will-change: transform;
}

.cursor-dot svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 1px 4px rgba(212, 163, 115, 0.6));
}
</style>
