<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const heroTitle = ref(null)
const heroSubtitle = ref(null)
const heroBadge = ref(null)
const heroBg = ref(null)
const heroActions = ref(null)
const quickInfo = ref(null)
const scrollIndicator = ref(null)

onMounted(() => {
  const isMobile = window.innerWidth < 768
  const tl = gsap.timeline()

  // Initial state
  gsap.set([heroTitle.value, heroSubtitle.value, heroBadge.value, heroActions.value, quickInfo.value], {
    opacity: 0,
    y: 15
  })
  gsap.set(heroBg.value, { scale: isMobile ? 1.03 : 1.1 })
  if (scrollIndicator.value) {
    gsap.set(scrollIndicator.value, { opacity: 0, y: -10 })
  }

  // Entrance Animation — faster on mobile
  const speed = isMobile ? 0.7 : 1

  tl.to(heroBg.value, {
    scale: 1,
    duration: 1.4 * speed,
    ease: 'power2.out'
  })
    .to(heroTitle.value, {
      opacity: 1,
      y: 0,
      duration: 0.8 * speed,
      ease: 'power3.out'
    }, '-=1')
    .to(heroSubtitle.value, {
      opacity: 1,
      y: 0,
      duration: 0.6 * speed,
      ease: 'power2.out'
    }, '-=0.6')
    .to(heroBadge.value, {
      opacity: 1,
      y: 0,
      duration: 0.5 * speed,
      ease: 'back.out(1.2)'
    }, '-=0.5')
    .to([heroActions.value, quickInfo.value], {
      opacity: 1,
      y: 0,
      duration: 0.7 * speed,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.3')

  // Scroll indicator after entrance — hide on mobile to save space
  if (scrollIndicator.value && !isMobile) {
    tl.to(scrollIndicator.value, {
      opacity: 0.7,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
  }

  // Parallax + content fade — ONLY on desktop (perf killer on mobile)
  if (!isMobile) {
    gsap.to(heroBg.value, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true
      }
    })

    gsap.to('.hero-content', {
      opacity: 0,
      y: -30,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom 40%',
        scrub: true
      }
    })
  }
})
</script>

<template>
  <header class="hero text-center d-flex align-items-center justify-content-center text-white">
    <div ref="heroBg" class="hero-bg"></div>
    <div class="overlay"></div>

    <div class="hero-content container px-4">
      <div ref="heroBadge" class="pre-title text-uppercase tracking-widest mb-3 opacity-75 fw-semibold">
        ¡Nos casamos!
      </div>
      <h1 ref="heroTitle" class="GreatVibes hero-title mb-2">Joan & Stephie</h1>
      <p ref="heroSubtitle" class="lead mb-5 hero-subtitle opacity-90 mx-auto">
        Queremos compartir con ustedes el día más importante de nuestras vidas.
      </p>

      <div ref="heroActions"
        class="hero-actions d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
        <a href="#rsvp" class="btn btn-premium hero-btn px-5 py-3 rounded-pill fw-bold">
          <i class="pi pi-heart-fill me-2"></i>Confirmar asistencia
        </a>
        <a href="#contador" class="btn btn-outline-white hero-btn px-5 py-3 rounded-pill fw-bold">
          Ver detalles
        </a>
      </div>
    </div>

    <!-- Quick Info Bar — visible on all devices -->
    <div ref="quickInfo" class="quick-info-bar w-100">
      <div class="container-fluid">
        <div class="row align-items-center g-2 g-md-0">
          <div class="col-4 col-md-4">
            <div class="quick-info-item">
              <i class="pi pi-calendar"></i>
              <span>6 DE NOVIEMBRE DE 2027</span>
            </div>
          </div>
          <div class="col-4 col-md-4">
            <div class="quick-info-item border-start border-white border-opacity-25">
              <i class="pi pi-clock"></i>
              <span>18:00 hs</span>
            </div>
          </div>
          <div class="col-4 col-md-4">
            <div class="quick-info-item border-start border-white border-opacity-25">
              <a class="text-white"
                href="https://www.google.com/maps/place/Los+cipreses+quinta+para+eventos/@-34.8342891,-58.3606855,17z/data=!3m1!4b1!4m6!3m5!1s0x95a32b3be862db31:0x25ec96e82d674b3e!8m2!3d-34.8342936!4d-58.3558146!16s%2Fg%2F1vfn7vb5?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D">
                <span> <i class="pi pi-map-marker"></i>
                  LOS CIPRESES, BURZACO</span>
              </a>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div ref="scrollIndicator" class="scroll-indicator">
      <div class="scroll-mouse">
        <div class="scroll-dot"></div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ===========================
   MOBILE-FIRST HERO
   =========================== */
.hero {
  height: 100vh;
  height: 100svh;
  /* iOS safe viewport height */
  position: relative;
  overflow: hidden;
  background-color: #000;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/home.jpg') no-repeat center center/cover;
  z-index: 1;
  filter: brightness(0.75);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.15) 40%,
      rgba(0, 0, 0, 0.6) 100%);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  margin-top: 0;
  padding: 0 0.5rem;
}

.pre-title {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
}

.hero-title {
  font-size: clamp(3rem, 12vw, 8rem);
  letter-spacing: -1px;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1rem;
  max-width: 800px;
  line-height: 1.6;
}

.hero-btn {
  min-width: 100%;
  font-size: 0.95rem;
  min-height: 52px;
  padding: 0.85rem 2rem;
}

.btn-premium {
  background: var(--primary-color);
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-premium:active {
  transform: scale(0.97);
  background: var(--primary-dark);
}

.btn-outline-white {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  transition: all 0.3s ease;
}

.btn-outline-white:active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Quick Info Bar */
.quick-info-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 4;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent);
  padding: 1rem 0;
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
  font-size: 0.7rem;
  letter-spacing: 0.02em;
}

.quick-info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  opacity: 0.85;
}

.quick-info-item i {
  font-size: 0.65rem;
}

/* Scroll Indicator — hidden on mobile */
.scroll-indicator {
  display: none;
}

.scroll-mouse {
  width: 26px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 13px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.scroll-dot {
  width: 4px;
  height: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 2px;
  animation: scrollBounce 2s infinite;
}

@keyframes scrollBounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }

  40% {
    transform: translateY(10px);
    opacity: 0.3;
  }
}

/* ===========================
   TABLET+ (min-width: 576px)
   =========================== */
@media (min-width: 576px) {
  .hero-btn {
    min-width: 220px;
  }

  .hero-subtitle {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
  }

  .quick-info-bar {
    font-size: 0.8rem;
    padding: 1.25rem 0;
  }

  .quick-info-item {
    gap: 0.5rem;
  }

  .quick-info-item i {
    font-size: 0.8rem;
  }
}

/* ===========================
   DESKTOP (min-width: 768px)
   =========================== */
@media (min-width: 768px) {
  .hero-bg {
    height: 105%;
    /* Extra height for parallax */
  }

  .hero-content {
    margin-top: -40px;
    padding: 0;
  }

  .pre-title {
    font-size: 0.85rem;
    letter-spacing: 0.4em;
  }

  .quick-info-bar {
    font-size: 0.9rem;
    padding: 1.5rem 0;
  }

  .scroll-indicator {
    display: block;
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
  }

  .btn-premium:hover {
    transform: translateY(-5px) scale(1.02);
    background: var(--primary-dark);
    box-shadow: 0 15px 35px rgba(212, 163, 115, 0.4);
    color: white;
  }

  .btn-outline-white:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }
}
</style>
