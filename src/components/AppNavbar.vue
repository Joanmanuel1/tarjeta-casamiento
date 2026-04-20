<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  isAdmin: { type: Boolean, default: false }
})

const isScrolled = ref(false)
const menuOpen = ref(false)
const navRef = ref(null)

const handleScroll = () => {
  requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 50
  })
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    gsap.from('.mobile-nav-link', {
      opacity: 0, x: -20, stagger: 0.07, duration: 0.4, ease: 'power3.out'
    })
  }
}

const closeMenu = () => { menuOpen.value = false }

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav ref="navRef" class="navbar-premium fixed-top" :class="{ 'scrolled': isScrolled || isAdmin }">
    <div class="navbar-inner container-fluid px-4 px-md-5">

      <!-- Brand -->
      <a class="brand GreatVibes" href="#">J &amp; S</a>

      <!-- Desktop links -->
      <ul class="desktop-links d-none d-lg-flex align-items-center gap-1 list-unstyled mb-0" v-if="!isAdmin">
        <li><a class="desk-link" href="#inicio">Inicio</a></li>
        <li><a class="desk-link" href="#historia">Historia</a></li>
        <li><a class="desk-link" href="#civil">Civil</a></li>
        <li><a class="desk-link" href="#fiesta">Fiesta</a></li>
        <li><a class="desk-link" href="#timeline">El día</a></li>
        <li><a class="desk-link" href="#deseos">Deseos</a></li>
        <li><a class="desk-link" href="#musica">Música</a></li>
        <li><a class="desk-link" href="#regalos">Regalos</a></li>
        <li>
          <a class="desk-cta rounded-pill" href="#rsvp">Confirmar ❤️</a>
        </li>
      </ul>

      <template v-else>
        <a class="desk-cta rounded-pill d-none d-lg-inline-flex" href="#">
          <i class="pi pi-arrow-left me-2"></i>Volver
        </a>
      </template>

      <!-- Mobile hamburger -->
      <button
        v-if="!isAdmin"
        class="hamburger d-lg-none"
        :class="{ 'is-open': menuOpen }"
        @click="toggleMenu"
        :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
        aria-expanded="menuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile drawer -->
    <Transition name="drawer">
      <div v-if="menuOpen" class="mobile-drawer d-lg-none" @click.self="closeMenu">
        <ul class="list-unstyled p-4 m-0">
          <li v-for="link in [
            { href: '#inicio', label: 'Inicio' },
            { href: '#historia', label: 'Nuestra Historia' },
            { href: '#civil', label: 'Ceremonia Civil' },
            { href: '#fiesta', label: 'La Fiesta' },
            { href: '#timeline', label: 'El Gran Día' },
            { href: '#dress-code', label: 'Dress Code' },
            { href: '#musica', label: 'Música' },
            { href: '#regalos', label: 'Regalos' },
            { href: '#deseos', label: 'Muro de Deseos' },
          ]" :key="link.href">
            <a class="mobile-nav-link" :href="link.href" @click="closeMenu">{{ link.label }}</a>
          </li>
          <li class="mt-3">
            <a class="mobile-cta rounded-pill d-block text-center" href="#rsvp" @click="closeMenu">
              Confirmar Asistencia ❤️
            </a>
          </li>
        </ul>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
/* ── Base ───────────────────────────────── */
.navbar-premium {
  top: 0; left: 0; width: 100%;
  z-index: 1050;
  transition: all 0.4s var(--transition-smooth);
  padding: 0;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  transition: height 0.4s var(--transition-smooth);
}

.scrolled .navbar-inner {
  height: 56px;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(0,0,0,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.3);
}

/* ── Brand ─────────────────────────────── */
.brand {
  font-size: 2rem;
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
  line-height: 1;
}
.scrolled .brand { color: var(--primary-color); }

/* ── Desktop links ─────────────────────── */
.desk-link {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255,255,255,0.88);
  text-decoration: none;
  padding: 0.5rem 0.6rem;
  border-radius: 0.5rem;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.scrolled .desk-link { color: #555; }
.desk-link:hover { color: var(--primary-color) !important; transform: translateY(-1px); }
.desk-link:active { color: var(--primary-color) !important; }

.desk-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white !important;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.5rem 1.25rem;
  min-height: 40px;
  transition: all 0.3s var(--transition-bounce);
  white-space: nowrap;
}
.desk-cta:hover {
  background: var(--primary-dark);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 20px rgba(212,163,115,0.3);
}
.desk-cta:active { background: var(--primary-dark); transform: scale(0.97); }

/* ── Hamburger ─────────────────────────── */
.hamburger {
  width: 44px; height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0;
  border-radius: 0.5rem;
  transition: background 0.2s;
}
.hamburger:active { background: rgba(255,255,255,0.1); }
.scrolled .hamburger:active { background: rgba(0,0,0,0.05); }

.hamburger span {
  display: block;
  width: 22px; height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.35s var(--transition-smooth);
  transform-origin: center;
}
.scrolled .hamburger span { background: var(--text-dark); }

.hamburger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.is-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Mobile drawer ─────────────────────── */
.mobile-drawer {
  position: absolute;
  top: 100%;
  left: 0; right: 0;
  background: rgba(253,251,247,0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(212,163,115,0.15);
  border-bottom: 1px solid rgba(212,163,115,0.15);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}

.mobile-nav-link {
  display: block;
  padding: 0.85rem 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
  text-decoration: none;
  border-bottom: 1px solid rgba(212,163,115,0.1);
  transition: all 0.2s ease;
}
.mobile-nav-link:active { color: var(--primary-color); padding-left: 1rem; }

.mobile-cta {
  display: block;
  background: var(--primary-color);
  color: white !important;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.85rem 1.5rem;
  min-height: 52px;
  line-height: 1.6;
  transition: all 0.3s ease;
}
.mobile-cta:active { background: var(--primary-dark); transform: scale(0.98); }

/* ── Drawer transitions ─────────────────── */
.drawer-enter-active { transition: all 0.3s var(--transition-smooth); }
.drawer-leave-active { transition: all 0.25s ease-in; }
.drawer-enter-from { opacity: 0; transform: translateY(-10px); }
.drawer-leave-to   { opacity: 0; transform: translateY(-10px); }
</style>
