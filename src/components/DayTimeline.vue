<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const events = [
  { time: '11:00',  icon: 'pi-car',          label: 'Llegada',         desc: 'Registro Civil Temperley',          color: '#d4a373' },
  { time: '11:30',  icon: 'pi-heart',         label: 'Ceremonia Civil', desc: 'El "Sí, quiero" oficial',           color: '#bc8a5f' },
  { time: '13:00',  icon: 'pi-star',          label: 'Brindis & fotos', desc: 'A celebrar con los más cercanos',   color: '#ccd5ae' },
  { time: '17:30',  icon: 'pi-map-marker',    label: 'Llegada a la Quinta', desc: 'Los Cipreses, Minist. Rivadavia', color: '#d4a373' },
  { time: '18:00',  icon: 'pi-sparkles',      label: 'Ceremonia simbolica',      desc: 'El "Sí, quiero" oficial',            color: '#bc8a5f' },
  { time: '19:00',  icon: 'pi-sparkles',      label: 'Bienvenida',      desc: 'Aperitivo y coctelería',            color: '#bc8a5f' },
  { time: '20:00',  icon: 'pi-music',         label: 'Entrada de los novios',            desc: '¡Que empiece la fiesta!',  color: '#ccd5ae' },
  { time: '22:00',  icon: 'pi-inbox',         label: 'Islas de comidas y barra libre',            desc: 'Livings',  color: '#ccd5ae' },
  { time: '23:00',  icon: 'pi-music',         label: 'Baile',           desc: '¡La pista es de todos!',            color: '#d4a373' },
  { time: '02:00',  icon: 'pi-music',         label: 'Baile carioca',           desc: '¡La pista es de todos!',            color: '#d4a373' },
  { time: '03:30',  icon: 'pi-inbox',         label: 'Pizza, panchos y café',           desc: 'Fin de fiesta',            color: '#d4a373' },
  { time: '04:00',  icon: 'pi-moon',          label: 'Cierre',          desc: 'Hasta siempre, con mucho amor',     color: '#bc8a5f' },
]

const trackRef    = ref(null)
const containerRef = ref(null)
const isMobile    = ref(false)
let   ctx         = null

onMounted(() => {
  isMobile.value = window.innerWidth < 768

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  if (isMobile.value) {
    // Mobile: reveal de items al scroll vertical (la pista es horizontal/scroll nativo)
    const items = document.querySelectorAll('.tl-item')
    ScrollTrigger.batch(items, {
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        x: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true
      }),
      start: 'top 92%',
      once: true
    })
    gsap.set(items, { opacity: 0, x: 40 })
  } else {
    // Desktop: items se revelan al entrar en viewport
    ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.tl-item')
      items.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          }
        })
      })

      // Línea de progreso: crece con el scroll
      gsap.from('.tl-line-fill', {
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.4
        }
      })
    }, containerRef.value)
  }
})

onUnmounted(() => { if (ctx) ctx.revert() })
</script>

<template>
  <section class="timeline-section py-5" ref="containerRef">
    <div class="container px-4">

      <div class="text-center mb-5 section-reveal">
        <span class="section-tag">6 de Noviembre, 2027</span>
        <h2 class="GreatVibes display-4">El Gran Día</h2>
        <p class="text-muted small mx-auto" style="max-width:420px">
          Un vistazo a cómo se va a vivir este día especial.
        </p>
      </div>

      <!-- Desktop: fila horizontal con línea de progreso -->
      <div class="tl-desktop d-none d-md-block">
        <!-- Línea de fondo -->
        <div class="tl-track position-relative mb-4" ref="trackRef">
          <div class="tl-line-bg"></div>
          <div class="tl-line-fill"></div>
        </div>

        <div class="tl-row d-flex gap-3 justify-content-between">
          <div v-for="(ev, i) in events" :key="i" class="tl-item tl-item--desktop text-center flex-fill">
            <!-- Nodo -->
            <div class="tl-node mx-auto mb-3" :style="{ '--node-color': ev.color }">
              <i :class="`pi ${ev.icon}`"></i>
            </div>
            <p class="tl-time mb-1">{{ ev.time }}</p>
            <p class="tl-label mb-1">{{ ev.label }}</p>
            <p class="tl-desc">{{ ev.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Mobile: columna vertical con scroll horizontal suave -->
      <div class="tl-mobile d-md-none">
        <div class="tl-scroll-track">
          <div v-for="(ev, i) in events" :key="i" class="tl-item tl-item--mobile d-flex gap-3 mb-4">
            <!-- Nodo + línea vertical -->
            <div class="tl-node-col d-flex flex-column align-items-center">
              <div class="tl-node-sm" :style="{ background: ev.color }">
                <i :class="`pi ${ev.icon}`"></i>
              </div>
              <div v-if="i < events.length - 1" class="tl-vline flex-grow-1"></div>
            </div>

            <!-- Contenido -->
            <div class="tl-content pb-4">
              <span class="tl-time-badge">{{ ev.time }}</span>
              <p class="tl-label mb-1 mt-2">{{ ev.label }}</p>
              <p class="tl-desc">{{ ev.desc }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.timeline-section {
  background: var(--bg-light);
}

/* ─────────────────── DESKTOP ─────────────────── */
.tl-track {
  height: 3px;
  margin: 0 4%;
  margin-bottom: 0 !important;
  position: relative;
  top: 52px; /* Alinea con los nodos */
  z-index: 0;
}

.tl-line-bg {
  position: absolute;
  inset: 0;
  background: rgba(212, 163, 115, 0.18);
  border-radius: 4px;
}

.tl-line-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 4px;
  transform-origin: left center;
}

.tl-row {
  position: relative;
  z-index: 1;
}

.tl-item--desktop {
  min-width: 0;
}

.tl-node {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--node-color, var(--primary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  transition: transform 0.25s ease;
  cursor: default;
}

.tl-item--desktop:hover .tl-node {
  transform: scale(1.15);
}

.tl-time {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--primary-color);
  letter-spacing: 0.05em;
}

.tl-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1.3;
}

.tl-desc {
  font-size: 0.72rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 0;
}

/* ─────────────────── MOBILE ─────────────────── */
.tl-node-col {
  width: 36px;
  min-width: 36px;
}

.tl-node-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
}

.tl-vline {
  width: 2px;
  background: rgba(212, 163, 115, 0.25);
  margin: 6px auto;
  min-height: 24px;
}

.tl-time-badge {
  display: inline-block;
  background: var(--secondary-color);
  color: var(--primary-dark);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.15rem 0.65rem;
  border-radius: 2rem;
}

.tl-content .tl-label {
  font-size: 0.9rem;
}

.tl-content .tl-desc {
  font-size: 0.78rem;
}
</style>
