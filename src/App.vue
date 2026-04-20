<script setup>
import { onMounted, ref, defineAsyncComponent } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── Todos los componentes: carga inmediata ────────────────────────────
// (necesario para que ScrollTrigger.batch encuentre .section-reveal en el DOM)
import AppNavbar from './components/AppNavbar.vue'
import HeroSection from './components/HeroSection.vue'
import IntroScreen from './components/IntroScreen.vue'
import CustomCursor from './components/CustomCursor.vue'
import BackToTop from './components/BackToTop.vue'
import AmbientSound from './components/AmbientSound.vue'
import CountdownTimer from './components/CountdownTimer.vue'
import OurStory from './components/OurStory.vue'
import CivilSection from './components/CivilSection.vue'
import PartySection from './components/PartySection.vue'
import DressCodeSection from './components/DressCodeSection.vue'
import TipsSection from './components/TipsSection.vue'
import DayTimeline from './components/DayTimeline.vue'
import MusicSection from './components/MusicSection.vue'
import GiftSection from './components/GiftSection.vue'
import QRCodeSection from './components/QRCodeSection.vue'
import PhotoGallery from './components/PhotoGallery.vue'
import WishWall from './components/WishWall.vue'
import RSVPForm from './components/RSVPForm.vue'

// ── Admin: lazy (solo se carga al navegar a /admin-joan-stephie) ─────
const GuestAdmin = defineAsyncComponent(() => import('./components/GuestAdmin.vue'))

gsap.registerPlugin(ScrollTrigger)

const ADMIN_PATH = '/admin-joan-stephie'
const ADMIN_USER = 'joan'
const ADMIN_PASS = 'casamiento'

const isAdminPath = ref(window.location.pathname === ADMIN_PATH)
const adminAuthenticated = ref(sessionStorage.getItem('admin_auth') === '1')
const currentHash = ref(window.location.hash || '#inicio')
const introFinished = ref(false)

// Login form state
const loginUser = ref('')
const loginPass = ref('')
const loginError = ref('')

function doLogin() {
  if (loginUser.value === ADMIN_USER && loginPass.value === ADMIN_PASS) {
    sessionStorage.setItem('admin_auth', '1')
    adminAuthenticated.value = true
    loginError.value = ''
    document.body.style.overflow = ''
    window.scrollTo(0, 0)
  } else {
    loginError.value = 'Usuario o contraseña incorrectos'
    loginPass.value = ''
  }
}

function doLogout() {
  sessionStorage.removeItem('admin_auth')
  adminAuthenticated.value = false
  window.history.pushState({}, '', '/')
  isAdminPath.value = false
}

// Handle hash-based routing (for non-admin pages)
const handleHashChange = () => {
  currentHash.value = window.location.hash || '#inicio'
}

// Handle back/forward navigation
const handlePopstate = () => {
  isAdminPath.value = window.location.pathname === ADMIN_PATH
  currentHash.value = window.location.hash || '#inicio'
}

const onIntroDone = () => {
  introFinished.value = true
  if (!isAdminPath.value) {
    window.scrollTo(0, 0)
  }
}

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

  // Listen to hash changes and popstate for routing
  window.addEventListener('hashchange', handleHashChange)
  window.addEventListener('popstate', handlePopstate)
})
</script>

<template>
  <div class="wedding-website">
    <!-- Intro cinematográfica (solo en landing, no en admin) -->
    <IntroScreen v-if="!introFinished && !isAdminPath" @done="onIntroDone" />

    <!-- Cursor personalizado (desktop only, no en admin) -->
    <CustomCursor v-if="!isAdminPath" />

    <div class="scroll-progress-container">
      <div class="scroll-progress"></div>
    </div>
    <AppNavbar :is-admin="isAdminPath" />

    <main>
      <div v-if="!isAdminPath" class="landing-content">
        <HeroSection id="inicio" :active="introFinished" />

        <!-- Divider: Hero → Countdown -->
        <div class="section-divider divider-dark-to-cream" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--bg-cream)" />
          </svg>
        </div>

        <CountdownTimer id="contador" />

        <!-- Divider decorativo con motivo floral (texto) -->
        <div class="section-divider-ornament" aria-hidden="true">
          <span class="ornament-line"></span>
          <span class="ornament-glyph">✦</span>
          <span class="ornament-line"></span>
        </div>

        <OurStory id="historia" class="section-reveal" />

        <!-- Divider: Historia → Civil -->
        <div class="section-divider divider-cream-to-white" aria-hidden="true">
          <svg viewBox="0 0 1440 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,25 C480,55 960,-5 1440,25 L1440,50 L0,50 Z" fill="white" />
          </svg>
        </div>

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

        <!-- Timeline del día -->
        <DayTimeline id="timeline" class="section-reveal" />

        <!-- Divider: Events → DressCode -->
        <div class="section-divider divider-light-to-cream" aria-hidden="true">
          <svg viewBox="0 0 1440 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 C360,50 1080,0 1440,35 L1440,50 L0,50 Z" fill="var(--bg-light)" />
          </svg>
        </div>

        <!-- DressCode -->
        <section id="dress-code" class="info-section section-reveal py-5">
          <div class="container-fluid px-4 px-md-5">
            <div class="text-center mb-5">
              <span class="section-tag">Código de Vestimenta</span>
              <h2 class="GreatVibes display-4">Dress Code</h2>
              <p>Se reserva el color blanco.</p>
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
        <PhotoGallery id="galeria" class="section-reveal" />

        <!-- Muro de Deseos -->
        <WishWall id="deseos" class="section-reveal" />

        <RSVPForm id="rsvp" class="section-reveal" />
      </div>

      <!-- Private Admin View -->
      <div v-else-if="isAdminPath">
        <!-- Login wall -->
        <div v-if="!adminAuthenticated" class="admin-login-wrap">
          <form class="admin-login-card" @submit.prevent="doLogin">
            <p class="GreatVibes admin-login-title">Panel de administración</p>
            <p v-if="loginError" class="admin-login-error">{{ loginError }}</p>
            <div class="admin-login-field">
              <label for="adm-user">Usuario</label>
              <input id="adm-user" v-model="loginUser" type="text" autocomplete="username" required />
            </div>
            <div class="admin-login-field">
              <label for="adm-pass">Contraseña</label>
              <input id="adm-pass" v-model="loginPass" type="password" autocomplete="current-password" required />
            </div>
            <button type="submit" class="admin-login-btn">Entrar</button>
          </form>
        </div>
        <!-- Admin content once authenticated -->
        <div v-else class="admin-content animate-fade-in pt-5">
          <div class="admin-logout-bar container-fluid px-4 py-2 d-flex justify-content-end">
            <button class="admin-logout-btn" @click="doLogout">
              <i class="pi pi-sign-out me-2"></i>Salir
            </button>
          </div>
          <GuestAdmin id="admin-guests" />
        </div>
      </div>
    </main>

    <footer v-if="!isAdminPath" class="wedding-footer">
      <div class="container text-center">
        <div class="footer-decoration mb-4">✦</div>
        <p class="GreatVibes footer-names">Joan & Stephie</p>
        <p class="footer-message">
          Gracias por ser parte de nuestra historia.<br>
          Nos vemos el <strong>6 de noviembre de 2027</strong>.
        </p>
        <div class="footer-divider mx-auto my-4"></div>
        <p class="footer-credits">
          Hecho con ❤️ para un día inolvidable
        </p>
      </div>
    </footer>

    <BackToTop />

    <!-- Botón de música ambiental -->
    <AmbientSound v-if="!isAdminPath" />

  </div>
</template>

<style>
/* ===========================
   SELF-HOSTED FONTS
   =========================== */
@font-face {
  font-family: 'Great Vibes';
  src: url('/fonts/GreatVibes-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Montserrat latin-ext (á, é, ñ, etc.) */
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/Montserrat-latin-ext.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7,
    U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F,
    U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113,
    U+2C60-2C7F, U+A720-A7FF;
}

/* Montserrat latin básico */
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/Montserrat-latin.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
    U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC,
    U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

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
  overflow-x: hidden; /* Prevent horizontal splash at the root */
}

body {
  font-family: var(--modern-font);
  color: var(--text-dark);
  background-color: var(--bg-cream);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(212, 163, 115, 0.15);
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  position: relative;
  width: 100%;
  margin: 0;
}

#app {
  width: 100%;
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
   ADMIN LOGIN
   =========================== */
.admin-login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-cream);
  padding: 2rem 1rem;
}

.admin-login-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.admin-login-title {
  font-size: 2rem;
  color: var(--primary-color);
  text-align: center;
  margin: 0;
  line-height: 1.2;
}

.admin-login-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  margin: 0;
  text-align: center;
}

.admin-login-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.admin-login-field label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.admin-login-field input {
  border: 1.5px solid rgba(212,163,115,0.3);
  border-radius: 0.75rem;
  padding: 0.7rem 1rem;
  font-size: 16px !important;
  outline: none;
  transition: border-color 0.2s;
  background: var(--bg-cream);
  color: var(--text-dark) !important;
  -webkit-text-fill-color: var(--text-dark) !important;
}

.admin-login-field input:focus {
  border-color: var(--primary-color);
  background: white;
  color: var(--text-dark) !important;
  -webkit-text-fill-color: var(--text-dark) !important;
}

.admin-login-field input:-webkit-autofill,
.admin-login-field input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--bg-cream) inset;
  -webkit-text-fill-color: var(--text-dark) !important;
}

.admin-login-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 2rem;
  padding: 0.85rem;
  font-size: 0.95rem;
  font-weight: 700;
  min-height: 52px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.admin-login-btn:hover { background: var(--primary-dark); }
.admin-login-btn:active { transform: scale(0.97); }

.admin-logout-bar {
  background: white;
  border-bottom: 1px solid rgba(212,163,115,0.15);
}

.admin-logout-btn {
  background: none;
  border: 1.5px solid rgba(212,163,115,0.4);
  border-radius: 2rem;
  padding: 0.4rem 1.2rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
  min-height: 36px;
}
.admin-logout-btn:hover { color: var(--primary-dark); border-color: var(--primary-color); }

/* ===========================
   CUSTOM CURSOR
   =========================== */
.custom-cursor-active,
.custom-cursor-active * {
  cursor: none !important;
}

/* ===========================
   SECTION DIVIDERS
   =========================== */
.section-divider {
  position: relative;
  line-height: 0;
  overflow: hidden;
  margin-top: -1px; /* evitar gaps de subpíxel */
}

.section-divider svg {
  display: block;
  width: 100%;
  height: clamp(30px, 5vw, 60px);
}

/* Variantes de color — el SVG fill coincide con la sección destino */
.divider-dark-to-cream { background: #111; }   /* debajo del hero oscuro */
.divider-cream-to-white { background: var(--bg-cream); }
.divider-light-to-cream { background: white; }

/* Ornamento decorativo entre secciones */
.section-divider-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 2rem 0;
}

.ornament-line {
  display: block;
  flex: 1;
  max-width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
}

.ornament-glyph {
  color: var(--primary-color);
  font-size: 0.9rem;
  opacity: 0.7;
}

/* ===========================
   GLOBAL MOBILE TOUCH HELPERS
   =========================== */

/* Prevenir zoom en iOS al hacer focus en inputs */
input, textarea, select {
  font-size: 16px !important;
}

/* overscroll natural */
body {
}

/* Safe areas (notch, home indicator) */
:root {
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-top: env(safe-area-inset-top, 0px);
}

/* Tap highlight personalizado */
* {
  -webkit-tap-highlight-color: rgba(212, 163, 115, 0.12);
}

/* Momentum scroll en iOS para contenedores con overflow */
.custom-scroll {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

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
  .detail-item:hover,
  .hover-lift:hover,
  .glass-card:hover {
    transform: none !important;
    box-shadow: var(--premium-shadow) !important;
  }

  /* Active states para touch feedback */
  .event-card:active,
  .info-card:active,
  .hover-lift:active {
    transform: scale(0.98) !important;
  }

  /* Reduce display-4 size for mobile */
  .display-4 {
    font-size: 2rem;
  }

  .display-5 {
    font-size: 1.65rem;
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
