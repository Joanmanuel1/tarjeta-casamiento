<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['done'])

const overlay = ref(null)
const line1 = ref(null)
const line2 = ref(null)
const dateBadge = ref(null)
const ampersand = ref(null)

onMounted(() => {
  // Sólo se muestra una vez por sesión
  const already = sessionStorage.getItem('intro-seen')
  if (already) {
    emit('done')
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    sessionStorage.setItem('intro-seen', '1')
    emit('done')
    return
  }

  document.body.style.overflow = 'hidden'

  const tl = gsap.timeline({
    onComplete: () => {
      sessionStorage.setItem('intro-seen', '1')
      document.body.style.overflow = ''
      emit('done')
    }
  })

  // Estado inicial: todo invisible
  gsap.set([line1.value, line2.value, dateBadge.value, ampersand.value], {
    opacity: 0
  })
  gsap.set(line1.value, { y: 40 })
  gsap.set(line2.value, { y: 40 })
  gsap.set(dateBadge.value, { y: 10 })

  tl
    // Silencio inicial
    .to({}, { duration: 0.4 })

    // Aparece "&" primero, sutil
    .to(ampersand.value, {
      opacity: 0.15,
      duration: 1.2,
      ease: 'power2.out'
    })

    // "Joan" entra desde abajo
    .to(line1.value, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'power3.out'
    }, '-=0.6')

    // "Stephie" entra levemente después
    .to(line2.value, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'power3.out'
    }, '-=1.0')

    // La fecha aparece
    .to(dateBadge.value, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.6')

    // Pausa para que se lea
    .to({}, { duration: 1.6 })

    // Todo sale hacia arriba — el overlay desaparece
    .to([line1.value, line2.value, ampersand.value, dateBadge.value], {
      opacity: 0,
      y: -30,
      stagger: 0.05,
      duration: 0.9,
      ease: 'power2.in'
    })
    .to(overlay.value, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.5')
})
</script>

<template>
  <div ref="overlay" class="intro-overlay">
    <!-- Gran "&" decorativo de fondo -->
    <span ref="ampersand" class="intro-ampersand" aria-hidden="true">&amp;</span>

    <div class="intro-content">
      <p ref="line1" class="intro-name intro-name--top">Joan</p>
      <p ref="line2" class="intro-name intro-name--bottom">Stephie</p>
      <p ref="dateBadge" class="intro-date">06 · 11 · 2027</p>
    </div>
  </div>
</template>

<style scoped>
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #0e0c0a;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}

.intro-ampersand {
  position: absolute;
  font-family: var(--romantic-font);
  font-size: clamp(18rem, 45vw, 36rem);
  color: rgba(212, 163, 115, 0.06);
  line-height: 1;
  user-select: none;
  pointer-events: none;
}

.intro-content {
  position: relative;
  text-align: center;
  z-index: 1;
}

.intro-name {
  font-family: var(--romantic-font);
  font-size: clamp(4rem, 14vw, 9rem);
  color: #f5ede0;
  line-height: 1.05;
  margin: 0;
  letter-spacing: 0.02em;
  text-shadow: 0 0 60px rgba(212, 163, 115, 0.2);
}

.intro-name--bottom {
  background: linear-gradient(135deg, #d4a373, #faedcd 60%, #d4a373);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.intro-date {
  margin-top: 1.5rem;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  letter-spacing: 0.5em;
  color: rgba(212, 163, 115, 0.7);
  font-weight: 600;
  text-transform: uppercase;
}
</style>
