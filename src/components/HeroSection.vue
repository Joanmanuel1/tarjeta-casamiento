<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import homeWebp from '../assets/home.webp'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const heroBg = ref(null)
const heroContent = ref(null)
const scrollIndicator = ref(null)
const particlesCanvas = ref(null)
const animationStarted = ref(false)

// ── Particles ─────────────────────────────────────────────────────────────────
let animFrame = null
let particles = []

function initParticles() {
  const canvas = particlesCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const count = window.innerWidth < 768 ? 18 : 38
  particles = Array.from({ length: count }, () => createParticle(canvas))

  function createParticle(c, fromBottom = false) {
    return {
      x: Math.random() * c.width,
      y: fromBottom ? c.height + 10 : Math.random() * c.height,
      r: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.4 + 0.15,
      drift: (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * Math.PI * 2
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.y -= p.speed
      p.x += p.drift
      p.pulse += 0.02
      const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse))

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(212, 163, 115, ${alpha})`
      ctx.fill()

      if (p.y < -10) Object.assign(p, createParticle(canvas, true))
    })
    animFrame = requestAnimationFrame(draw)
  }
  draw()
}

// ── Scroll parallax ───────────────────────────────────────────────────────────
function initParallax() {
  const isMobile = window.innerWidth < 768
  if (isMobile) return // no parallax on mobile (battery / perf)

  gsap.to(heroBg.value, {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
}

function startEntrance() {
  if (animationStarted.value) return
  animationStarted.value = true

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    gsap.set(scrollIndicator.value, { opacity: 1, y: 0 })
    initParallax()
    return
  }

  // Entrance animation
  const tl = gsap.timeline()
  tl.from(heroBg.value, {
      scale: 1.15,
      duration: 3,
      ease: 'power2.out'
    })
    .from(heroContent.value, {
      opacity: 0,
      y: 40,
      duration: 1.5,
      ease: 'power3.out'
    }, '-=1.8')
    .to(scrollIndicator.value, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=1.2')

  // Floating scroll indicator - MORE dynamic jump
  gsap.to('.scroll-arrow', {
    y: 18,
    repeat: -1,
    yoyo: true,
    duration: 0.9,
    ease: 'power2.inOut'
  })

  // Subtle pulse for the helper text
  gsap.to('.scroll-helper span', {
    opacity: 0.3,
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: 'sine.inOut'
  })

  initParallax()
}

onMounted(() => {
  initParticles()
  if (props.active) {
    startEntrance()
  }
})

watch(() => props.active, (newVal) => {
  if (newVal) {
    startEntrance()
  }
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<template>
  <header class="hero-section position-relative overflow-hidden d-flex align-items-end justify-content-center pb-5">
    <!-- Fondo principal con la imagen WebP -->
    <div ref="heroBg" class="hero-background" :style="{ backgroundImage: `url(${homeWebp})` }"></div>

    <!-- Overlay de gradiente -->
    <div class="hero-overlay-refined"></div>

    <!-- Capa 3: partículas bokeh doradas -->
    <canvas ref="particlesCanvas" class="hero-particles" aria-hidden="true"></canvas>

    <!-- Contenido -->
    <div ref="heroContent" class="container z-3 mb-5 px-4">
      <div class="hero-text-overlay text-center text-white" style="margin-bottom: 10rem;">
        <div class="hero-badge-minimal mb-3">06 . 11 . 27</div>

        <h1 class="GreatVibes hero-names display-1 mb-2">Joan &amp; Stephie</h1>

      </div>
      <!-- <div class="hero-actions mt-4">
        <a href="#rsvp" class="btn btn-premium-hero-transparent px-2 py-1 rounded-pill fw-bold">
          Confirmar Asistencia
        </a>
      </div> -->
    </div>

    <!-- Scroll indicator -->
    <div ref="scrollIndicator" class="scroll-helper position-absolute text-white text-center pointer"
      style="z-index: 100;"
      @click="() => $el.ownerDocument.getElementById('contador').scrollIntoView({ behavior: 'smooth' })">
      <span class="small text-uppercase tracking-widest d-block mb-2 fw-bold" style="opacity: 0.8; letter-spacing: 0.4em;">Deslizá</span>
      <div class="scroll-arrow">
        <i class="pi pi-chevron-down fs-2"></i>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-section {
  height: 100dvh;
  min-height: 600px;
  background-color: #000;
}

.hero-background {
  position: absolute;
  top: -15%;
  left: 0;
  width: 100%;
  height: 130%;
  background: no-repeat center center/cover;
  z-index: 1;
  will-change: transform;
  transform-origin: center top;
}

.hero-overlay-refined {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.05) 0%,
    rgba(0, 0, 0, 0.08) 40%,
    rgba(0, 0, 0, 0.72) 100%
  );
  z-index: 2;
}

/* Canvas de partículas */
.hero-particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.hero-names {
  font-size: clamp(3.5rem, 15vw, 8.5rem);
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.55);
  line-height: 0.9;
}

.hero-badge-minimal {
  font-weight: 700;
  letter-spacing: 5px;
  font-size: 0.85rem;
  opacity: 0.8;
}

.hero-msg-premium {
  font-size: 1.1rem;
  max-width: 500px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.btn-premium-hero-transparent {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  transition: all 0.4s var(--transition-bounce);
  min-height: 36px;
  display: inline-flex;
  align-items: center;
}

.btn-premium-hero-transparent:hover {
  background: white;
  color: var(--text-dark);
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.scroll-helper {
  cursor: pointer;
  transition: all 0.4s var(--transition-smooth);
  opacity: 0;
  will-change: transform, opacity;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: fit-content;
  transform: translateY(40px);
}

@media (min-width: 768px) {
  .scroll-helper {
    bottom: 3.5rem;
  }
}

.scroll-helper:hover {
  transform: translateY(5px);
}

.scroll-arrow {
  color: #fff;
  filter: drop-shadow(0 0 10px var(--primary-color));
  transition: all 0.3s ease;
}

.scroll-helper:hover .scroll-arrow {
  color: var(--primary-color);
  filter: drop-shadow(0 0 15px #fff);
}

@media (max-width: 768px) {
  .hero-names {
    font-size: 2rem;
  }

  .hero-msg-premium {
    font-size: 0.95rem;
    padding: 0 1rem;
  }

  .hero-section {
    align-items: center;
    padding-bottom: 0 !important;
  }

  .hero-content {
    margin-bottom: 0 !important;
  }

  /* Sin margen extra de parallax en mobile */
  .hero-background {
    top: 0;
    height: 100%;
  }
}
</style>
