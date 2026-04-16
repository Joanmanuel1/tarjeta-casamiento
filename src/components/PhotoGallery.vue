<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Imágenes ─────────────────────────────────────────────────────────
// Usamos WebP (con fallback JPG para el lightbox en browsers muy viejos)
// Para agregar fotos: importar el WebP y el JPEG original, agregar al array.
import img1w from '../assets/1.webp'
import img2w from '../assets/2.webp'
import img3w from '../assets/3.webp'
import img1j from '../assets/1.jpeg'
import img2j from '../assets/2.jpeg'
import img3j from '../assets/3.jpeg'

// LQIPs generados con ffmpeg (30px, blur)
const LQIP = [
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgABXwFbAAD//gARTGF2YzU4LjEzNC4xMDAA/9sAQwAIPj5JPklVVVVVVVVkXWRoaGhkZGRkaGhocHBwg4ODcHBwaGhwcHx8g4OPk4+Hh4OHk5Obm5u6urKy2dng/////8QAXAAAAwEAAAAAAAAAAAAAAAAABwYFBAEBAQEBAAAAAAAAAAAAAAAABQQDAhAAAgICAwEBAAAAAAAAAAAAAAECESFBAzISIjERAQEBAAAAAAAAAAAAAAAAAAABAv/AABEIACcAHgMBIgACEQADEQD/2gAMAwEAAhEDEQA/AHbkhaAdLGAxS5kCGTtm9HZTbGWzUopowtUHFLGSmUlEb/FIH7dOjV1IpxZskiAhisjNyGzsDJx+gnQ/BHfYsFRO2MCRD2MiJ6ej/9k=',
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAFfAWHAAD//gARTGF2YzU4LjEzNC4xMDAA/9sAQwAIPj5JPklVVVVVVVVkXWRoaGhkZGRkaGhocHBwg4ODcHBwaGhwcHx8g4OPk4+Hh4OHk5Obm5u6urKy2dng/////8QAXQAAAgMBAAAAAAAAAAAAAAAABwYDBQgEAQEBAQEBAAAAAAAAAAAAAAAEAQMFAhAAAgIDAQEBAAAAAAAAAAAAAAEDAiERMRIyIhEBAQAAAAAAAAAAAAAAAAAAAAH/wAARCAAnAB4DASIAAhEAAxEA/9oADAMBAAIRAxEAPwB2ZTLBDa2Bes2h5J/R1g5rZjyiysirbhHbNSql4Uzu/CCEpk9BLQD296DrHX8liUlS8B63gIM3AbMO6LpTNCxPdUZyRoOH5NHiv//Z',
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAASABJAAD//gARTGF2YzU4LjEzNC4xMDAA/9sAQwAIPj5JPklVVVVVVVVkXWRoaGhkZGRkaGhocHBwg4ODcHBwaGhwcHx8g4OPk4+Hh4OHk5Obm5u6urKy2dng/////8QAWQABAQEAAAAAAAAAAAAAAAAABgUEAQADAQEAAAAAAAAAAAAAAAAAAQIEAxAAAwEBAAMBAAAAAAAAAAAAAAERAhIiAzEyEQEBAAAAAAAAAAAAAAAAAAAAEf/AABEIABYAHgMBIgACEQADEQD/2gAMAwEAAhEDEQA/AHC9lRB7XRhWSJtQFQ+WkZdaoBVsEfLFRGukdOlB/CMji1sl8xOmwkv2KRIf/9k='
]

const images = ref([
  { src: img1w, fallback: img1j, lqip: LQIP[0], alt: 'Momento 1' },
  { src: img2w, fallback: img2j, lqip: LQIP[1], alt: 'Momento 2' },
  { src: img3w, fallback: img3j, lqip: LQIP[2], alt: 'Momento 3' },
  { src: img1w, fallback: img1j, lqip: LQIP[0], alt: 'Momento 4' },
  { src: img2w, fallback: img2j, lqip: LQIP[1], alt: 'Momento 5' },
  { src: img3w, fallback: img3j, lqip: LQIP[2], alt: 'Momento 6' },
  { src: img1w, fallback: img1j, lqip: LQIP[0], alt: 'Momento 7' },
  { src: img2w, fallback: img2j, lqip: LQIP[1], alt: 'Momento 8' },
  { src: img3w, fallback: img3j, lqip: LQIP[2], alt: 'Momento 9' },
])

// ── Lightbox ─────────────────────────────────────────────────────────
const lightboxOpen  = ref(false)
const currentIndex  = ref(0)

function openLightbox(i) {
  currentIndex.value = i
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
}

// ── Teclado ───────────────────────────────────────────────────────────
function onKey(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft')  prev()
  if (e.key === 'Escape')     closeLightbox()
}

// ── Swipe en mobile ───────────────────────────────────────────────────
let touchStartX = 0
const MIN_SWIPE = 50

function onTouchStart(e) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (dx > MIN_SWIPE)  prev()
  if (dx < -MIN_SWIPE) next()
}

// ── Animación de entrada de las tarjetas ─────────────────────────────
onMounted(() => {
  document.addEventListener('keydown', onKey)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  ScrollTrigger.batch('.masonry-item', {
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.06,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: true
    }),
    start: 'top 92%',
    once: true
  })

  gsap.set('.masonry-item', { opacity: 0, y: 24, scale: 0.97 })
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <section class="gallery-section py-5">
    <div class="container px-4">

      <div class="text-center mb-5 section-reveal">
        <span class="section-tag">Galería</span>
        <h2 class="GreatVibes display-4">Nuestros Momentos</h2>
        <p class="text-muted small mx-auto" style="max-width:400px">
          Una muestra de nuestra historia juntos.
        </p>
      </div>

      <!-- Masonry grid (CSS columns) -->
      <div class="masonry-grid">
        <div
          v-for="(img, i) in images"
          :key="i"
          class="masonry-item"
          @click="openLightbox(i)"
          :aria-label="`Ver foto ${i + 1}`"
          role="button"
          tabindex="0"
          @keydown.enter="openLightbox(i)"
        >
          <!-- LQIP como fondo mientras la imagen carga -->
          <div
            class="masonry-lqip"
            :style="{ backgroundImage: `url('${img.lqip}')` }"
            aria-hidden="true"
          ></div>
          <!-- WebP con fallback JPEG; siempre visible (el LQIP queda debajo) -->
          <picture>
            <source :srcset="img.src" type="image/webp" />
            <img :src="img.fallback" :alt="img.alt" loading="lazy" decoding="async" />
          </picture>
          <div class="masonry-overlay" aria-hidden="true">
            <i class="pi pi-search-plus"></i>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Lightbox ── -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="lightbox"
        @click.self="closeLightbox"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
        aria-modal="true"
        role="dialog"
        :aria-label="`Foto ${currentIndex + 1} de ${images.length}`"
      >
        <!-- Botón cerrar -->
        <button class="lb-close" @click="closeLightbox" aria-label="Cerrar">
          <i class="pi pi-times"></i>
        </button>

        <!-- Imagen activa -->
        <div class="lb-img-wrap">
          <img
            :src="images[currentIndex].src"
            :alt="images[currentIndex].alt"
            class="lb-img"
          />
        </div>

        <!-- Contador -->
        <p class="lb-counter">{{ currentIndex + 1 }} / {{ images.length }}</p>

        <!-- Navegación -->
        <button class="lb-nav lb-nav--prev" @click="prev" aria-label="Anterior">
          <i class="pi pi-chevron-left"></i>
        </button>
        <button class="lb-nav lb-nav--next" @click="next" aria-label="Siguiente">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery-section {
  background: var(--bg-cream);
}

/* ── Masonry ─────────────────────────────────── */
.masonry-grid {
  columns: 3 220px;
  column-gap: 0.75rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 0.75rem;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  will-change: transform, opacity;
}

/* Alturas variadas para efecto masonry real */
.masonry-item:nth-child(3n + 1) img { aspect-ratio: 4/5; }
.masonry-item:nth-child(3n + 2) img { aspect-ratio: 1/1; }
.masonry-item:nth-child(3n)     img { aspect-ratio: 3/4; }

/* LQIP: fondo borroso que queda tapado por la imagen cuando carga */
.masonry-lqip {
  position: absolute;
  inset: 0;
  background: no-repeat center/cover;
  filter: blur(10px);
  transform: scale(1.05); /* evita bordes del blur */
  z-index: 0;
}

/* La imagen siempre visible (opacity: 1); el LQIP queda debajo */
.masonry-item picture {
  display: block;
  position: relative;
  z-index: 1;
}

.masonry-item img {
  width: 100%;
  display: block;
  object-fit: cover;
  position: relative;
  z-index: 1;
  transition: transform 0.45s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.masonry-item:hover img,
.masonry-item:focus-visible img {
  transform: scale(1.05);
}

.masonry-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  color: white;
  font-size: 1.5rem;
  opacity: 0;
}

.masonry-item:hover .masonry-overlay,
.masonry-item:focus-visible .masonry-overlay {
  background: rgba(0, 0, 0, 0.3);
  opacity: 1;
}

@media (max-width: 480px) {
  .masonry-grid { columns: 2 140px; column-gap: 0.5rem; }
  .masonry-item { margin-bottom: 0.5rem; border-radius: 0.6rem; }
}

/* ── Lightbox ────────────────────────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: lbFadeIn 0.2s ease;
}

@keyframes lbFadeIn {
  from { opacity: 0 }
  to   { opacity: 1 }
}

.lb-img-wrap {
  max-width: 90vw;
  max-height: 88vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-img {
  max-width: 90vw;
  max-height: 88vh;
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  user-select: none;
  -webkit-user-drag: none;
}

.lb-close {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 1;
}

.lb-close:hover { background: rgba(255,255,255,0.25); }

.lb-counter {
  position: absolute;
  bottom: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.55);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  margin: 0;
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.lb-nav:hover { background: rgba(255,255,255,0.25); }
.lb-nav--prev { left: 1rem; }
.lb-nav--next { right: 1rem; }

@media (max-width: 600px) {
  .lb-nav { width: 40px; height: 40px; font-size: 1rem; }
  .lb-nav--prev { left: 0.4rem; }
  .lb-nav--next { right: 0.4rem; }
}
</style>
