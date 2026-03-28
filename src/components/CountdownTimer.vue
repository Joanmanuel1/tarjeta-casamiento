<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// --- CONFIGURATION ---
const targetDate = new Date('2027-11-06T18:00:00')
const startDate = new Date('2024-11-06T00:00:00') // When the journey started

// --- REFS ---
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const currentPhraseIndex = ref(0)
const phrases = [
  "Todo comenzó con un mensaje...",
  "Luego vino la primera cita en un bar",
  "Luego la segunda cita en la plaza",
  "Nos pusimos de novios",
  "Comenzamos a convivir",
  "Y ahora nos vamos a casar",
  "Falta muy poquito para el gran día ❤️"
]

// --- COMPUTED ---
const progress = computed(() => {
  const now = new Date()
  const total = targetDate - startDate
  const elapsed = now - startDate
  return Math.min(Math.max((elapsed / total) * 100, 0), 100)
})

const timeOfDayColor = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 21) return 'sunset'
  return 'night'
})

// --- METHODS ---
const updateCountdown = () => {
  const now = new Date()
  const diff = targetDate - now

  if (diff <= 0) {
    days.value = hours.value = minutes.value = seconds.value = 0
    return
  }

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)
}

const cyclePhrases = () => {
  gsap.to('.story-text', {
    opacity: 0,
    y: -10,
    duration: 1,
    onComplete: () => {
      currentPhraseIndex.value = (currentPhraseIndex.value + 1) % phrases.length
      gsap.fromTo('.story-text',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }
      )
    }
  })
}

// --- PARTICLES ---
const createParticle = () => {
  const container = document.querySelector('.particles-container')
  if (!container) return

  const particle = document.createElement('div')
  particle.className = 'particle'
  container.appendChild(particle)

  const startX = Math.random() * window.innerWidth
  const size = Math.random() * 8 + 4

  gsap.set(particle, {
    x: startX,
    y: window.innerHeight + 10,
    width: size,
    height: size,
    opacity: Math.random() * 0.5 + 0.2
  })

  gsap.to(particle, {
    y: -100,
    x: startX + (Math.random() - 0.5) * 200,
    rotation: Math.random() * 360,
    duration: Math.random() * 10 + 10,
    ease: 'none',
    onComplete: () => particle.remove()
  })
}

let countdownTimer, phraseTimer, particleTimer
onMounted(() => {
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
  phraseTimer = setInterval(cyclePhrases, 6000)
  particleTimer = setInterval(createParticle, 2000)

  // Initial animations
  gsap.from('.countdown-visual-container', { opacity: 0, scale: 0.9, duration: 2, ease: 'power3.out' })
})

onUnmounted(() => {
  clearInterval(countdownTimer)
  clearInterval(phraseTimer)
  clearInterval(particleTimer)
})
</script>

<template>
  <section class="countdown-experience py-5 overflow-hidden position-relative" :class="timeOfDayColor">
    <div class="particles-container"></div>

    <div class="container py-5 text-center position-relative z-1">
      <!-- Storytelling Header -->
      <div class="mb-5">
        <h2 class="story-text GreatVibes display-4 text-white drop-shadow">
          {{ phrases[currentPhraseIndex] }}
        </h2>
      </div>

      <!-- Visual Journey Path -->
      <div class="countdown-visual-container mx-auto mb-2">
        <div class="journey-path-wrapper mx-auto position-relative">
          <svg viewBox="0 0 400 100" class="journey-svg w-100 h-100">
            <!-- Background Line -->
            <path d="M 40 50 L 360 50" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"
              stroke-dasharray="4 4" />

            <!-- Progress Line -->
            <path id="journeyPath" d="M 40 50 L 360 50" fill="none" stroke="white" stroke-width="3"
              stroke-dasharray="320" :stroke-dashoffset="320 - (3.2 * progress)"
              style="transition: stroke-dashoffset 2s ease-out;" />

            <!-- Start Icon -->
            <foreignObject x="25" y="35" width="30" height="30">
              <i class="pi pi-heart-fill text-white fs-4"></i>
            </foreignObject>

            <!-- End Icon -->
            <g class="target-point">
              <foreignObject x="345" y="35" width="30" height="30">
                <i class="pi pi-heart-fill text-white fs-4 target-heart"></i>
              </foreignObject>
              <circle cx="360" cy="50" r="15" fill="none" stroke="white" stroke-width="1" class="pulse-circle" />
            </g>

            <!-- Moving Pointer (Star) -->
            <g :style="{ transform: `translateX(${3.2 * progress}px)` }" class="traveler-pointer">
              <foreignObject x="25" y="35" width="30" height="30">
                <i class="pi pi-star-fill text-warning fs-5"></i>
              </foreignObject>
            </g>
          </svg>
        </div>
      </div>

      <!-- Time Stats -->
      <div class="stats-glass-container glass-premium p-4 rounded-5 mx-auto maxWidth-md">
        <div class="row g-2 g-md-4">
          <div class="col-3">
            <span class="d-block display-6 fw-bold text-white">{{ days }}</span>
            <span class="small text-uppercase tracking-widest text-white">Días</span>
          </div>
          <div class="col-3 border-start border-white-50">
            <span class="d-block display-6 fw-bold text-white">{{ hours }}</span>
            <span class="small text-uppercase tracking-widest text-white">Horas</span>
          </div>
          <div class="col-3 border-start border-white-50">
            <span class="d-block display-6 fw-bold text-white">{{ minutes }}</span>
            <span class="small text-uppercase tracking-widest text-white">Minutos</span>
          </div>
          <div class="col-3 border-start border-white-50">
            <span class="d-block display-6 fw-bold text-white">{{ seconds }}</span>
            <span class="small text-uppercase tracking-widest text-white">Segundos</span>
          </div>
        </div>
      </div>

      <div class="mt-4 text-white small tracking-widest text-uppercase">
        El viaje hacia nuestro "Sí, acepto"
      </div>
    </div>
  </section>
</template>

<style scoped>
.countdown-experience {
  min-height: 500px;
  transition: background 3s ease;
}

/* Day/Night Themes */
.morning {
  background: linear-gradient(135deg, #fdfbf7 0%, #d4a373 100%);
}

.afternoon {
  background: linear-gradient(135deg, #d4a373 0%, #faedcd 100%);
}

.sunset {
  background: linear-gradient(135deg, #d4a373 0%, #a44a3f 100%);
}

.night {
  background: linear-gradient(135deg, #2b2d42 0%, #8d99ae 100%);
}

.maxWidth-md {
  max-width: 600px;
}

.journey-path-wrapper {
  max-width: 500px;
  height: 120px;
}

.journey-icon {
  fill: white;
  font-size: 24px;
}

.target-heart {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.pulse-circle {
  animation: pulse 2s infinite;
  transform-origin: center;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }

  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.glass-premium {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.drop-shadow {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Particles */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

:deep(.particle) {
  position: absolute;
  background: white;
  border-radius: 50%;
  filter: blur(1px);
}

.traveler-pointer {
  transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 768px) {
  .display-4 {
    font-size: 2.2rem;
  }

  .display-6 {
    font-size: 1.5rem;
  }

  .journey-path-wrapper {
    height: 80px;
  }
}
</style>