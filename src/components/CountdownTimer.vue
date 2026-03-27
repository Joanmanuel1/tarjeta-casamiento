<template>
  <div class="countdown-section">
    <div class="container text-center">

      <!-- Header -->
      <div class="mb-5 section-reveal">
        <h2 class="GreatVibes display-5 mb-2">Faltan tan solo...</h2>
        <p class="text-muted small opacity-75">
          para el mejor día de nuestras vidas 💛
        </p>
      </div>

      <!-- Countdown -->
      <div class="row justify-content-center g-3">

        <div class="col-6 col-md-2" v-for="(item, index) in timeItems" :key="index">
          <div class="counter-card glass-card p-3">

            <!-- Flip Number -->
            <div class="flip-container">
              <span class="flip-number" :class="{ tick: item.key === 'seconds' && ticking }">
                {{ item.value.toString().padStart(2, '0') }}
              </span>
            </div>

            <small class="counter-label">{{ item.label }}</small>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const targetDate = new Date('2027-11-05T18:30:00')

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const ticking = ref(false)

const updateCountdown = () => {
  const now = new Date()
  const diff = targetDate - now

  if (diff <= 0) return

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)

  // trigger tick animation
  ticking.value = false
  requestAnimationFrame(() => {
    ticking.value = true
  })
}

const timeItems = computed(() => [
  { label: 'Días', value: days.value, key: 'days' },
  { label: 'Horas', value: hours.value, key: 'hours' },
  { label: 'Min', value: minutes.value, key: 'minutes' },
  { label: 'Seg', value: seconds.value, key: 'seconds' }
])

let timer
onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
/* SECTION */
.countdown-section {
  padding: 2rem 0;
}

/* CARD */
.counter-card {
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  text-align: center;
  transition: transform 0.3s ease;
}

.counter-card:active {
  transform: scale(0.97);
}

/* FLIP CONTAINER */
.flip-container {
  perspective: 1000px;
  margin-bottom: 5px;
}

/* NUMBER */
.flip-number {
  display: inline-block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #d4a373;
  transform-origin: center;
  transition: transform 0.4s ease, opacity 0.3s ease;
}

/* TICK ANIMATION (ultra smooth) */
.flip-number.tick {
  animation: flipTick 0.5s ease;
}

@keyframes flipTick {
  0% {
    transform: rotateX(90deg);
    opacity: 0;
  }

  50% {
    transform: rotateX(-10deg);
    opacity: 1;
  }

  100% {
    transform: rotateX(0deg);
  }
}

/* LABEL */
.counter-label {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

/* MOBILE OPTIMIZATION */
@media (max-width: 768px) {
  .flip-number {
    font-size: 2.2rem;
  }
}

/* DESKTOP */
@media (min-width: 768px) {
  .flip-number {
    font-size: 3.5rem;
  }

  .counter-card:hover {
    transform: translateY(-6px) scale(1.03);
  }
}
</style>