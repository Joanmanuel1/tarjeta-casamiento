<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import storyImg from '../assets/1.webp'

gsap.registerPlugin(ScrollTrigger)

const milestones = [
  { year: '2018', icon: 'pi-heart',    label: 'El comienzo', desc: 'Nos conocimos y algo mágico empezó…' },
  { year: '2019', icon: 'pi-map-marker', label: 'Primer viaje', desc: 'Exploramos el mundo juntos por primera vez.' },
  { year: '2021', icon: 'pi-home',     label: 'Nuestro hogar', desc: 'Construimos nuestro primer nido juntos.' },
  { year: '2023', icon: 'pi-sparkles', label: 'La propuesta', desc: '¡Dijo que sí! El mejor momento de nuestras vidas.' },
  { year: '2027', icon: 'pi-star',     label: 'El gran día', desc: '6 de noviembre, para siempre.' },
]

onMounted(() => {
  gsap.from('.story-img-frame', {
    opacity: 0, x: -40, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.story-grid', start: 'top 80%', once: true }
  })
  gsap.from('.milestone-item', {
    opacity: 0, x: 30, stagger: 0.12, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.milestones-col', start: 'top 80%', once: true }
  })
})
</script>

<template>
  <section class="story-section py-5 overflow-hidden">
    <div class="container px-4 px-md-5 py-md-3">

      <!-- Header -->
      <div class="text-center mb-5 section-reveal">
        <span class="section-tag">Nuestra Historia</span>
        <h2 class="GreatVibes display-4">Seis años juntos</h2>
        <p class="story-subtitle mx-auto">
          Una historia de amor que empezó sin darnos cuenta y que hoy nos lleva al altar.
        </p>
      </div>

      <div class="story-grid row g-4 g-lg-5 align-items-center">

        <!-- Foto lado izquierdo -->
        <div class="col-lg-5 text-center text-lg-start">
          <div class="story-img-frame">
            <div class="story-img-inner">
              <img :src="storyImg" alt="Joan y Stephie" class="story-img" loading="lazy" />
            </div>
            <!-- Badge flotante -->
            <div class="story-badge shadow-lg">
              <span class="badge-number">6</span>
              <span class="badge-label">Años juntos</span>
            </div>
            <!-- Ornamento esquina -->
            <div class="story-corner-ornament" aria-hidden="true">✦</div>
          </div>
        </div>

        <!-- Milestones lado derecho -->
        <div class="col-lg-7 milestones-col">
          <p class="story-intro-text mb-4">
            Nuestra historia comenzó…
          </p>

          <div class="milestones">
            <div
              v-for="(m, i) in milestones"
              :key="i"
              class="milestone-item d-flex gap-3 align-items-start"
            >
              <!-- Nodo + línea vertical -->
              <div class="ms-col d-flex flex-column align-items-center">
                <div class="ms-node">
                  <i :class="`pi ${m.icon}`"></i>
                </div>
                <div v-if="i < milestones.length - 1" class="ms-vline"></div>
              </div>
              <!-- Contenido -->
              <div class="ms-content pb-4">
                <span class="ms-year">{{ m.year }}</span>
                <h5 class="ms-label">{{ m.label }}</h5>
                <p class="ms-desc">{{ m.desc }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.story-section {
  background: var(--bg-cream);
}

.story-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 480px;
  line-height: 1.7;
}

/* ── Imagen ───────────────────────────────── */
.story-img-frame {
  position: relative;
  display: inline-block;
  max-width: 360px;
}

.story-img-inner {
  border-radius: 2rem;
  overflow: hidden;
  border: 5px solid white;
  box-shadow: 0 25px 60px rgba(0,0,0,0.1);
  transform: rotate(-2deg);
  transition: transform 0.5s var(--transition-bounce);
}

@media (min-width: 992px) {
  .story-img-inner:hover { transform: rotate(0deg) scale(1.02); }
}
@media (max-width: 991px) {
  .story-img-inner { transform: rotate(0); }
}

.story-img {
  width: 100%; display: block;
  aspect-ratio: 3/4; object-fit: cover;
  filter: sepia(0.15) contrast(1.05);
  transition: filter 0.5s ease;
}
.story-img-inner:hover .story-img { filter: sepia(0); }

/* Badge flotante */
.story-badge {
  position: absolute;
  bottom: -16px; right: -16px;
  background: white;
  border-radius: 1.25rem;
  padding: 0.85rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(212,163,115,0.2);
}
.badge-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--primary-color);
  line-height: 1;
}
.badge-label {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.story-corner-ornament {
  position: absolute;
  top: -12px; left: -12px;
  font-size: 1.5rem;
  color: var(--primary-color);
  opacity: 0.5;
}

/* ── Intro text ──────────────────────────── */
.story-intro-text {
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.8;
  font-style: italic;
}

/* ── Milestones ──────────────────────────── */
.milestones { padding-top: 0.5rem; }

.ms-col { width: 40px; min-width: 40px; }

.ms-node {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--secondary-color);
  border: 2px solid var(--primary-color);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary-dark);
  font-size: 0.9rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(212,163,115,0.2);
}

.ms-vline {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: linear-gradient(to bottom, var(--primary-color), rgba(212,163,115,0.1));
  margin: 6px auto;
}

.ms-year {
  display: inline-block;
  background: var(--secondary-color);
  color: var(--primary-dark);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 0.18rem 0.65rem;
  border-radius: 2rem;
  margin-bottom: 0.35rem;
}

.ms-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 0.25rem;
}

.ms-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

/* ── Mobile ───────────────────────────────── */
@media (max-width: 991px) {
  .story-img-frame { max-width: 280px; }
  .story-badge { right: -10px; bottom: -12px; padding: 0.65rem 1rem; }
  .badge-number { font-size: 1.4rem; }
}
</style>
