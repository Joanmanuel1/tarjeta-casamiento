<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import AppNavbar from './components/AppNavbar.vue'
import HeroSection from './components/HeroSection.vue'
import CountdownTimer from './components/CountdownTimer.vue'
import OurStory from './components/OurStory.vue'
import CivilSection from './components/CivilSection.vue'
import PartySection from './components/PartySection.vue'
import PhotoGallery from './components/PhotoGallery.vue'
import GiftSection from './components/GiftSection.vue'
import QRCodeSection from './components/QRCodeSection.vue'
import RSVPForm from './components/RSVPForm.vue'
import BackToTop from './components/BackToTop.vue'
import DressCodeSection from './components/DressCodeSection.vue'
import TipsSection from './components/TipsSection.vue'
import MusicSection from './components/MusicSection.vue'

gsap.registerPlugin(ScrollTrigger)

// Performance configuration
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true
})

const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  document.documentElement.classList.add('js-enabled')
  if (isMobile.value) {
    document.documentElement.classList.add('is-mobile')
  }

  // Global Scroll Progress Bar
  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1
    }
  })

  // Batch Section Reveals for Performance
  const revealElements = gsap.utils.toArray('.section-reveal')

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    gsap.set(revealElements, { opacity: 1, y: 0, scale: 1, visibility: 'visible' })
    return
  }

  // Lighter, faster animations on mobile
  const duration = isMobile.value ? 0.5 : 1
  const stagger = isMobile.value ? 0.05 : 0.15

  // Refined ScrollTrigger Batching
  ScrollTrigger.batch(revealElements, {
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger,
      duration,
      ease: isMobile.value ? 'power2.out' : 'power3.out',
      overwrite: true
    }),
    start: 'top 95%',
    once: true
  })

  // Global Refresh after load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh()
  })
})
</script>

<template>
  <div class="wedding-website">
    <div class="scroll-progress-container">
      <div class="scroll-progress"></div>
    </div>
    <AppNavbar />

    <main>
      <HeroSection id="inicio" />
      <CountdownTimer id="contador" />
      <OurStory id="historia" class="section-reveal" />

      <!-- Civil -->
      <section id="civil" class="events-section section-reveal py-5">
        <div class="container-fluid px-4 px-md-5">
          <div class="text-center mb-5">
            <span class="section-tag">Ceremonia</span>
            <h2 class="GreatVibes display-4">Civil</h2>
          </div>
          <CivilSection />
        </div>
      </section>

      <!-- Fiesta -->
      <section id="fiesta" class="events-section section-reveal py-5 bg-light">
        <div class="container-fluid px-4 px-md-5">
          <div class="text-center mb-5">
            <span class="section-tag">Celebración</span>
            <h2 class="GreatVibes display-4">La Fiesta</h2>
          </div>
          <PartySection />
        </div>
      </section>

      <!-- DressCode -->
      <section id="dress-code" class="info-section section-reveal py-5">
        <div class="container-fluid px-4 px-md-5">
          <div class="text-center mb-5">
            <span class="section-tag">Código de Vestimenta</span>
            <h2 class="GreatVibes display-4">Dress Code</h2>
          </div>
          <DressCodeSection />
        </div>
      </section>

      <!-- Tips -->
      <section id="tips" class="info-section section-reveal py-5 bg-light">
        <div class="container-fluid px-4 px-md-5">
          <div class="text-center mb-5">
            <span class="section-tag">Tips para Invitados</span>
            <h2 class="GreatVibes display-4">Tips & Notas</h2>
          </div>
          <TipsSection />
        </div>
      </section>

      <MusicSection id="musica" class="section-reveal" />
      <PhotoGallery id="galeria" class="section-reveal" />

      <!-- Regalos -->
      <section id="regalos" class="gifts-qr-section section-reveal py-5">
        <div class="container-fluid px-4 px-md-5">
          <div class="text-center mb-5">
            <span class="section-tag">Un gesto de amor</span>
            <h2 class="GreatVibes display-4">Regalos</h2>
          </div>
          <GiftSection />
        </div>
      </section>

      <!-- QR/Fotos -->
      <section id="fotos" class="gifts-qr-section section-reveal py-5 bg-light">
        <div class="container-fluid px-4 px-md-5">
          <div class="text-center mb-5">
            <span class="section-tag">Galería de Fotos</span>
            <h2 class="GreatVibes display-4">Fotos compartidas</h2>
          </div>
          <QRCodeSection />
        </div>
      </section>

      <RSVPForm id="rsvp" class="section-reveal" />
    </main>

    <footer class="wedding-footer">
      <div class="container text-center">
        <div class="footer-decoration mb-4">✦</div>
        <p class="GreatVibes footer-names">Joan & Stephie</p>
        <p class="footer-message">
          Gracias por ser parte de nuestra historia de amor.<br>
          Nos vemos el <strong>6 de noviembre de 2027</strong>.
        </p>
        <div class="footer-divider mx-auto my-4"></div>
        <p class="footer-credits">
          Hecho con ❤️ para un día inolvidable
        </p>
      </div>
    </footer>

    <BackToTop />
  </div>
</template>

<style>
/* ===========================
   DESIGN TOKENS
   =========================== */
:root {
  --primary-color: #d4a373;
  --primary-dark: #bc8a5f;
  --secondary-color: #faedcd;
  --accent-color: #ccd5ae;
  --text-dark: #1e1e1e;
  --text-muted: #6c757d;
  --bg-cream: #fdfbf7;
  --bg-light: #f9f7f4;
  --romantic-font: 'Great Vibes', cursive;
  --modern-font: 'Montserrat', sans-serif;
  --premium-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  --premium-shadow-hover: 0 25px 60px rgba(212, 163, 115, 0.15);
  --glass-bg: rgba(255, 255, 255, 0.7);
  --transition-smooth: cubic-bezier(0.165, 0.84, 0.44, 1);
  --transition-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  scroll-padding-top: 75px;
}

body {
  font-family: var(--modern-font);
  color: var(--text-dark);
  overflow-x: hidden;
  background-color: var(--bg-cream);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(212, 163, 115, 0.15);
  -webkit-overflow-scrolling: touch;
}

.GreatVibes {
  font-family: var(--romantic-font);
}

/* Mobile-first: base padding for mobile, scale up for desktop */
section {
  padding: 60px 0;
}

@media (min-width: 768px) {
  section {
    padding: 20px 0;
  }
}

/* ===========================
   PREMIUM SCROLLBAR
   =========================== */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-cream);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 10px;
}

/* ===========================
   SCROLL PROGRESS BAR
   =========================== */
.scroll-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
  background: transparent;
}

.scroll-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
}

/* ===========================
   GLOBAL REVEAL BASE STATE
   =========================== */
.section-reveal {
  opacity: 0;
  transform: translateY(20px);
  visibility: hidden;
  will-change: transform, opacity;
}

@media (min-width: 768px) {
  .section-reveal {
    transform: translateY(30px) scale(0.99);
  }
}

.js-enabled .section-reveal {
  visibility: visible;
}

/* ===========================
   GLOBAL REUSABLE CLASSES
   =========================== */

/* Section Tag (small uppercased label) */
.section-tag {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
}

/* Text Utilities */
.text-premium {
  color: var(--primary-color);
}

.tracking-widest {
  letter-spacing: 0.3em;
}

.tracking-wider {
  letter-spacing: 0.15em;
  font-size: 0.7rem;
  font-weight: 700;
}

/* Icon Box — mobile-first sizing */
.icon-box {
  width: 64px;
  height: 64px;
  background: var(--secondary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
}

@media (min-width: 768px) {
  .icon-box {
    width: 80px;
    height: 80px;
  }
}

/* Glassmorphism Card Base — reduced blur on mobile for performance */
.glass-card {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: var(--premium-shadow) !important;
  transition: all 0.3s ease;
}

@media (min-width: 768px) {
  .glass-card {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all 0.5s var(--transition-smooth);
  }
}

/* Premium Button — 44px min touch target */
.btn-premium {
  background: var(--primary-color);
  color: white;
  border: none;
  font-weight: 600;
  letter-spacing: 0.05em;
  min-height: 48px;
  transition: all 0.3s ease;
}

.btn-premium:active {
  transform: scale(0.97);
  background: var(--primary-dark);
}

@media (min-width: 768px) {
  .btn-premium {
    transition: all 0.4s var(--transition-bounce);
  }

  .btn-premium:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(212, 163, 115, 0.3);
    color: white;
    background: var(--primary-dark);
  }
}

/* Hover Lift — disabled on touch, active state instead */
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:active {
  transform: scale(0.98);
}

@media (min-width: 768px) {
  .hover-lift {
    transition: all 0.3s var(--transition-smooth);
  }

  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(212, 163, 115, 0.2);
  }
}

/* Typography Overrides */
.display-4,
.display-5 {
  color: var(--text-dark);
}

/* ===========================
   SECTION BACKGROUNDS
   =========================== */
.events-section {
  background: white;
}

.info-section {
  background: var(--bg-light);
}

.gifts-qr-section {
  background: var(--bg-light);
}

/* ===========================
   PREMIUM FOOTER
   =========================== */
.wedding-footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 5rem 0 3rem;
  position: relative;
  overflow: hidden;
}

.wedding-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
}

.footer-decoration {
  font-size: 1.5rem;
  color: var(--primary-color);
  letter-spacing: 1em;
  opacity: 0.7;
}

.footer-names {
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-message {
  font-size: 1.1rem;
  opacity: 0.8;
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto;
}

.footer-divider {
  width: 60px;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.footer-credits {
  font-size: 0.85rem;
  opacity: 0.4;
  margin-bottom: 0;
}

/* ===========================
   MOBILE-FIRST REFINEMENTS
   =========================== */

/* Base (mobile) footer sizes */
.footer-names {
  font-size: 2.5rem;
}

.footer-message {
  font-size: 0.95rem;
  padding: 0 1rem;
}

.wedding-footer {
  padding: 3.5rem 0 2rem;
  /* iOS safe area support */
  padding-bottom: calc(2rem + env(safe-area-inset-bottom, 0px));
}

@media (min-width: 768px) {
  .footer-names {
    font-size: 4rem;
  }

  .footer-message {
    font-size: 1.1rem;
    padding: 0;
  }

  .wedding-footer {
    padding: 5rem 0 3rem;
  }
}

/* ===========================
   GLOBAL MOBILE TOUCH HELPERS
   =========================== */

/* All interactive elements: minimum touch target */
@media (max-width: 767px) {

  a.btn,
  button,
  .btn {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Disable hover transforms on touch devices */
  .event-card:hover,
  .info-card:hover,
  .counter-card:hover,
  .detail-item:hover {
    transform: none !important;
    box-shadow: var(--premium-shadow) !important;
  }

  /* Active states for touch */
  .event-card:active,
  .info-card:active {
    transform: scale(0.98) !important;
  }

  /* Reduce display-4 size for mobile */
  .display-4 {
    font-size: 2.2rem;
  }

  .display-5 {
    font-size: 1.8rem;
  }

  /* Section tag slightly smaller on mobile */
  .section-tag {
    font-size: 0.65rem;
    letter-spacing: 0.25em;
  }

  /* Tighter section heading spacing */
  .events-section .text-center.mb-5,
  .info-section .text-center.mb-5,
  .gifts-qr-section .text-center.mb-5 {
    margin-bottom: 1.5rem !important;
  }
}
</style>
