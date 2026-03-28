<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const isScrolled = ref(false)
const ticking = false

const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > 50
    })
  }
}

const closeMenu = () => {
  const collapse = document.getElementById('navbarNav')
  if (collapse && collapse.classList.contains('show')) {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse)
    bsCollapse.hide()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="navbar navbar-expand-lg fixed-top" :class="{ 'scrolled': isScrolled || isAdmin }">
    <div class="container-fluid">
      <a class="navbar-brand GreatVibes fs-2" :href="isAdmin ? '#admin' : '#'">
        J & S
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-label="Toggle navigation">
        <i class="pi pi-bars"></i>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav align-items-center">
          <template v-if="!isAdmin">
            <li class="nav-item"><a class="nav-link px-3" href="#inicio" @click="closeMenu">Inicio</a></li>
            <li class="nav-item"><a class="nav-link px-3" href="#contador" @click="closeMenu">Cuenta regresiva</a></li>
            <li class="nav-item"><a class="nav-link px-3" href="#historia" @click="closeMenu">Historia</a></li>
            <li class="nav-item"><a class="nav-link px-3" href="#civil" @click="closeMenu">Ceremonia Civil</a></li>
            <li class="nav-item"><a class="nav-link px-3" href="#fiesta" @click="closeMenu">Fiesta</a></li>
            <li class="nav-item"><a class="nav-link px-3" href="#regalos" @click="closeMenu">Regalos</a></li>
            <li class="nav-item"><a class="nav-link px-3" href="#musica" @click="closeMenu">Música</a></li>
            <li class="nav-item"><a class="nav-link px-3" href="#admin" @click="closeMenu">Invitados</a></li>
            <li class="nav-item">
              <a class="nav-link nav-cta px-4 py-2 rounded-pill ms-lg-3" href="#rsvp" @click="closeMenu">
                Confirmar
              </a>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <a class="nav-link nav-cta px-4 py-2 rounded-pill" href="#" @click="closeMenu">
                <i class="pi pi-arrow-left me-2"></i> Volver a la Invitación
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  transition: all 0.4s var(--transition-smooth);
  padding: 1.2rem 0;
  border-bottom: 1px solid transparent;
}

.scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 0.6rem 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.navbar-brand {
  color: #fff;
  transition: color 0.3s ease;
  font-weight: bold;
}

.scrolled .navbar-brand {
  color: var(--primary-color);
}

.nav-link {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.scrolled .nav-link {
  color: #555;
}

.nav-link:active {
  color: var(--primary-color) !important;
}

@media (min-width: 992px) {
  .nav-link:hover {
    color: var(--primary-color) !important;
    transform: translateY(-1px);
  }

  .scrolled .nav-link:hover {
    color: var(--primary-color) !important;
  }
}

/* CTA in navbar */
.nav-cta {
  background: var(--primary-color) !important;
  color: white !important;
  font-weight: 600;
  font-size: 0.8rem !important;
  letter-spacing: 0.08em;
  transition: all 0.3s ease;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-cta:active {
  background: var(--primary-dark) !important;
  transform: scale(0.97) !important;
}

@media (min-width: 992px) {
  .nav-cta {
    margin-left: 0.5rem;
    transition: all 0.3s var(--transition-bounce);
  }

  .nav-cta:hover {
    background: var(--primary-dark) !important;
    transform: translateY(-2px) scale(1.03) !important;
    box-shadow: 0 8px 20px rgba(212, 163, 115, 0.3);
  }
}

.scrolled .nav-cta {
  color: white !important;
}

.navbar-toggler {
  border: none;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem;
  min-height: 48px;
  min-width: 48px;
}

.scrolled .navbar-toggler {
  color: var(--primary-color);
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(20px);
    padding: 1rem 1.5rem 1.5rem;
    border-radius: 1.5rem;
    margin-top: 0.75rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(212, 163, 115, 0.1);
  }

  .nav-link {
    color: #333 !important;
    padding: 0;
    justify-content: center;
  }

  .nav-cta {
    margin-top: 0.5rem;
    margin-left: 0;
    display: flex;
    width: 100%;
  }
}
</style>
