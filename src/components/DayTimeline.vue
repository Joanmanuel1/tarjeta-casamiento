<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const events = [
  { time: '11:00', icon: 'pi-car',        label: 'Llegada',               desc: 'Registro Civil Temperley',         color: '#d4a373' },
  { time: '11:30', icon: 'pi-heart',       label: 'Ceremonia Civil',        desc: 'El "Sí, quiero" oficial',          color: '#bc8a5f' },
  { time: '13:00', icon: 'pi-star',        label: 'Brindis & fotos',        desc: 'A celebrar con los más cercanos',  color: '#ccd5ae' },
  { time: '17:30', icon: 'pi-map-marker',  label: 'Llegada a la Quinta',    desc: 'Los Cipreses, Minist. Rivadavia',  color: '#d4a373' },
  { time: '18:00', icon: 'pi-sparkles',    label: 'Ceremonia Simbólica',    desc: '¡El gran sí!',                     color: '#bc8a5f' },
  { time: '19:00', icon: 'pi-sparkles',    label: 'Bienvenida',             desc: 'Aperitivo y coctelería',           color: '#d4a373' },
  { time: '20:00', icon: 'pi-music',       label: 'Entrada de los novios',  desc: '¡Que empiece la fiesta!',          color: '#ccd5ae' },
  { time: '22:00', icon: 'pi-inbox',       label: 'Islas de comida & barra', desc: 'Livings y barra libre',          color: '#bc8a5f' },
  { time: '23:00', icon: 'pi-music',       label: 'Baile',                  desc: '¡La pista es de todos!',           color: '#d4a373' },
  { time: '02:00', icon: 'pi-music',       label: 'Baile carioca',          desc: '¡La pista es de todos!',           color: '#d4a373' },
  { time: '03:30', icon: 'pi-inbox',       label: 'Pizza, panchos & café',  desc: 'Fin de fiesta',                    color: '#bc8a5f' },
  { time: '04:00', icon: 'pi-moon',        label: 'Cierre',                 desc: 'Hasta siempre, con mucho amor',    color: '#1a1a2e' },
]

const containerRef = ref(null)
let ctx = null

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const isMobile = window.innerWidth < 768

  if (isMobile) {
    const items = document.querySelectorAll('.tl-item')
    gsap.set(items, { opacity: 0, x: 30 })
    ScrollTrigger.batch(items, {
      onEnter: batch => gsap.to(batch, { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', overwrite: true }),
      start: 'top 92%', once: true
    })
  } else {
    ctx = gsap.context(() => {
      gsap.utils.toArray('.tl-item').forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 30, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        })
      })
      gsap.from('.tl-line-fill', {
        scaleX: 0, transformOrigin: 'left center', ease: 'none',
        scrollTrigger: { trigger: containerRef.value, start: 'top 70%', end: 'bottom 60%', scrub: 0.4 }
      })
    }, containerRef.value)
  }
})

onUnmounted(() => { if (ctx) ctx.revert() })
</script>

<template>
  <section class="tl-section py-5" ref="containerRef">
    <div class="container px-4">

      <div class="text-center mb-4 mb-md-5 section-reveal">
        <span class="section-tag">6 de Noviembre, 2027</span>
        <h2 class="GreatVibes display-4">El Gran Día</h2>
        <p class="tl-subtitle mx-auto">Un vistazo a cómo se va a vivir este día especial.</p>
      </div>

      <!-- Desktop: horizontal -->
      <div class="d-none d-md-block">
        <div class="tl-track-wrap position-relative mb-0">
          <div class="tl-line-bg"></div>
          <div class="tl-line-fill"></div>
        </div>
        <div class="tl-desktop-row">
          <div v-for="(ev, i) in events" :key="i" class="tl-item tl-item--desk text-center">
            <div class="tl-node-desk mx-auto mb-3" :style="{ background: ev.color }">
              <i :class="`pi ${ev.icon}`"></i>
            </div>
            <p class="tl-time-desk">{{ ev.time }}</p>
            <p class="tl-label-desk">{{ ev.label }}</p>
            <p class="tl-desc-desk">{{ ev.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Mobile: vertical timeline -->
      <div class="d-md-none">
        <div v-for="(ev, i) in events" :key="i" class="tl-item d-flex gap-3 mb-0">
          <div class="tl-mobile-col d-flex flex-column align-items-center">
            <div class="tl-node-mobile" :style="{ background: ev.color }">
              <i :class="`pi ${ev.icon}`"></i>
            </div>
            <div v-if="i < events.length - 1" class="tl-vline"></div>
          </div>
          <div class="tl-mobile-content pb-4">
            <span class="tl-time-badge">{{ ev.time }}</span>
            <p class="tl-mobile-label mb-1 mt-2">{{ ev.label }}</p>
            <p class="tl-mobile-desc mb-0">{{ ev.desc }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.tl-section { background: var(--bg-light); }

.tl-subtitle {
  font-size: 0.88rem;
  color: var(--text-muted);
  max-width: 400px;
  line-height: 1.6;
}

/* ── Desktop ─────────────────────────────── */
.tl-track-wrap {
  height: 3px;
  margin: 0 3%;
  top: 52px;
  z-index: 0;
  position: relative;
}
.tl-line-bg {
  position: absolute; inset: 0;
  background: rgba(212,163,115,0.2);
  border-radius: 4px;
}
.tl-line-fill {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 4px;
  transform-origin: left center;
}

.tl-desktop-row {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.tl-item--desk { flex: 1; min-width: 0; }

.tl-node-desk {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1rem;
  box-shadow: 0 4px 14px rgba(0,0,0,0.14);
  transition: transform 0.25s ease;
  position: relative; z-index: 1;
}
.tl-item--desk:hover .tl-node-desk { transform: scale(1.2); }

.tl-time-desk {
  font-size: 0.68rem; font-weight: 800;
  color: var(--primary-color); letter-spacing: 0.05em;
  margin: 0.3rem 0 0.15rem;
}
.tl-label-desk {
  font-size: 0.75rem; font-weight: 700;
  color: var(--text-dark); line-height: 1.3; margin: 0 0 0.2rem;
}
.tl-desc-desk {
  font-size: 0.68rem; color: var(--text-muted); line-height: 1.4; margin: 0;
}

/* ── Mobile ──────────────────────────────── */
.tl-mobile-col { width: 38px; min-width: 38px; }

.tl-node-mobile {
  width: 38px; height: 38px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.14);
  flex-shrink: 0;
}

.tl-vline {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: linear-gradient(to bottom, rgba(212,163,115,0.4), rgba(212,163,115,0.05));
  margin: 5px auto;
}

.tl-time-badge {
  display: inline-block;
  background: var(--secondary-color);
  color: var(--primary-dark);
  font-size: 0.68rem; font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.18rem 0.65rem;
  border-radius: 2rem;
}

.tl-mobile-label {
  font-size: 0.92rem; font-weight: 700;
  color: var(--text-dark);
}
.tl-mobile-desc {
  font-size: 0.78rem; color: var(--text-muted);
  line-height: 1.4;
}
</style>
