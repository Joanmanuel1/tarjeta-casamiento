<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const heroTitle = ref(null)
const heroSubtitle = ref(null)
const heroBg = ref(null)
const heroContent = ref(null)
const scrollIndicator = ref(null)

onMounted(() => {
  const tl = gsap.timeline()

  // Entrance Animation - prioritize image reveal
  tl.from(heroBg.value, { scale: 1.15, filter: 'brightness(1)', duration: 2.5, ease: 'power2.out' })
    .from(heroContent.value, { opacity: 0, y: 30, duration: 1.2, ease: 'power3.out' }, '-=1.5')
    .from(scrollIndicator.value, { opacity: 0, y: -20, duration: 1, ease: 'power2.out' }, '-=0.5')

  // Floating animation for scroll indicator
  gsap.to('.scroll-arrow', {
    y: 10,
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: 'sine.inOut'
  })
})
</script>

<template>
  <header class="hero-section position-relative overflow-hidden d-flex align-items-end justify-content-center pb-5">
    <div ref="heroBg" class="hero-background"></div>
    <div class="hero-overlay-refined"></div>

    <div ref="heroContent" class="container position-relative z-3 mb-5 px-4">
      <div class="hero-text-overlay text-center text-white">
        <div class="hero-badge-minimal mb-3">06 . 11 . 27</div>

        <h1 class="GreatVibes hero-names display-1 mb-2">Joan & Stephie</h1>

        <p class="hero-msg-premium mb-4 mx-auto opacity-90 fw-medium">
          Nuestra historia, nuestro día, para siempre.
        </p>

        <div class="hero-actions mt-4">
          <a href="#rsvp" class="btn btn-premium-hero-transparent px-5 py-3 rounded-pill fw-bold">
            Confirmar Asistencia
          </a>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator - Elegant & Clear -->
    <div ref="scrollIndicator" class="scroll-helper position-absolute bottom-0 mb-4 text-white text-center z-3 pointer"
      @click="() => $el.ownerDocument.getElementById('contador').scrollIntoView({ behavior: 'smooth' })">
      <span class="small text-uppercase tracking-widest opacity-50 d-block mb-2">Deslizá</span>
      <div class="scroll-arrow">
        <i class="pi pi-chevron-down fs-4"></i>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-section {
  height: 100vh;
  min-height: 600px;
  background-color: #000;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/home.jpg') no-repeat center center/cover;
  z-index: 1;
  /* Reduced initial brightness filter to show the photo better */
}

.hero-overlay-refined {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Gradient focused at the bottom to ensure text legibility while keeping the top/center photo clear */
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.1) 40%,
      rgba(0, 0, 0, 0.7) 100%);
  z-index: 2;
}

.hero-names {
  font-size: clamp(3.5rem, 15vw, 8.5rem);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
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
  min-height: 56px;
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
  transition: opacity 0.3s;
}

.scroll-helper:hover {
  opacity: 1 !important;
}

.scroll-arrow {
  color: white;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3));
}

@media (max-width: 768px) {
  .hero-names {
    font-size: 4rem;
  }

  .hero-msg-premium {
    font-size: 0.95rem;
    padding: 0 1rem;
  }

  .hero-section {
    align-items: center;
    /* Center on mobile to ensure it's balanced */
  }

  .hero-content {
    margin-bottom: 2rem;
  }
}
</style>
