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

let countdownTimer, particleTimer
onMounted(() => {
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
  particleTimer = setInterval(createParticle, 2000)
  gsap.from('.stats-glass-container', { opacity: 0, scale: 0.9, duration: 2, ease: 'power3.out' })
})

onUnmounted(() => {
  clearInterval(countdownTimer)
  clearInterval(phraseTimer)
  clearInterval(particleTimer)
})
</script>

<template>
  <section class="countdown-experience py-1 overflow-hidden position-relative" :class="timeOfDayColor">
    <div class="particles-container"></div>
    <div class="container py-1 text-center position-relative z-1">
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
            <span class="small text-uppercase tracking-widest text-white">Min</span>
          </div>
          <div class="col-3 border-start border-white-50">
            <span class="d-block display-6 fw-bold text-white">{{ seconds }}</span>
            <span class="small text-uppercase tracking-widest text-white">Seg</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.countdown-experience {
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