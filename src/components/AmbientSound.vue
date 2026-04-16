<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

// Cambiá esta URL por la canción que quieran como ambiental
// (un MP3 público, hosted en tu Firebase Storage o CDN)
const AUDIO_SRC = 'https://www.bensound.com/bensound-music/bensound-romantic.mp3'

const playing = ref(false)
const btnRef = ref(null)
let audio = null

function toggle() {
  if (!audio) {
    audio = new Audio(AUDIO_SRC)
    audio.loop = true
    audio.volume = 0
  }

  if (playing.value) {
    // Fade out
    gsap.to(audio, { volume: 0, duration: 1, onComplete: () => audio.pause() })
    playing.value = false
  } else {
    audio.play().then(() => {
      gsap.to(audio, { volume: 0.28, duration: 1.5 })
    }).catch(() => {
      // autoplay bloqueado — silencioso
    })
    playing.value = true
  }

  // Micro animación del botón
  gsap.fromTo(btnRef.value, { scale: 0.88 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' })
}
</script>

<template>
  <button
    ref="btnRef"
    class="ambient-btn"
    :class="{ 'ambient-btn--playing': playing }"
    :aria-label="playing ? 'Silenciar música' : 'Reproducir música ambiental'"
    @click="toggle"
  >
    <!-- Ícono nota musical -->
    <svg class="ambient-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.8"/>
      <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.8"/>
    </svg>

    <!-- Ondas animadas (solo cuando suena) -->
    <span v-if="playing" class="ambient-waves" aria-hidden="true">
      <span class="wave wave-1"></span>
      <span class="wave wave-2"></span>
      <span class="wave wave-3"></span>
    </span>
  </button>
</template>

<style scoped>
.ambient-btn {
  position: fixed;
  bottom: 5rem;
  left: 1.25rem;
  z-index: 1040;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid rgba(212, 163, 115, 0.45);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  color: var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
  will-change: transform;
}

.ambient-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 24px rgba(212, 163, 115, 0.2);
  border-color: var(--primary-color);
}

.ambient-btn--playing {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.ambient-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

/* Ondas sonoras */
.ambient-waves {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
}

.wave {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  animation: soundwave 1.8s ease-out infinite;
}

.wave-2 { animation-delay: 0.6s; }
.wave-3 { animation-delay: 1.2s; }

@keyframes soundwave {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
}

@media (max-width: 767px) {
  .ambient-btn {
    bottom: calc(60px + env(safe-area-inset-bottom, 0px));
    left: 1rem;
    width: 44px;
    height: 44px;
  }
}

.ambient-btn:active {
  transform: scale(0.9);
  transition: transform 0.1s;
}
</style>
