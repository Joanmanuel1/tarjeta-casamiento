<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import storyImg from '../assets/1.jpeg'

const storyImage = ref(null)
const storyContent = ref(null)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  if (storyImage.value) {
    gsap.from(storyImage.value, {
      x: -40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: storyImage.value,
        start: 'top 85%',
        once: true
      }
    })
  }

  if (storyContent.value) {
    gsap.from(storyContent.value, {
      x: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: storyContent.value,
        start: 'top 85%',
        once: true
      }
    })
  }
})
</script>

<template>
  <section class="our-story overflow-hidden">
    <div class="container py-lg-5">
      <div class="row align-items-center g-5">
        <div ref="storyImage" class="col-lg-6 story-image-col">
          <div class="image-wrapper position-relative">
            <div class="frame shadow-lg">
              <img :src="storyImg" alt="Joan y Stephie — Nuestra Historia" class="img-fluid rounded-4" loading="lazy">
            </div>
            <div class="floating-badge p-4 bg-white rounded-4 shadow-lg d-none d-md-block">
              <span class="GreatVibes fs-3 text-premium">Desde 2021</span>
            </div>
          </div>
        </div>
        <div ref="storyContent" class="col-lg-6 story-content-col">
          <div class="ps-lg-4">
            <span class="section-tag">El comienzo de todo</span>
            <h2 class="GreatVibes display-4 mb-4">Nuestra historia de amor</h2>
            <div class="lead-text text-muted mb-4 fs-5 lh-lg">
              Todo empezó con una lie a una foto de Lisa de instragram y una foto de una tarta de verdura. Desde aquella
              primera charla, supimos que estábamos destinados a escribir este camino juntos.
            </div>
            <div class="text-muted mb-5 fs-6 lh-lg">
              Han sido años de viajes, complicidad, risas y crecimiento mutuo. Hoy, con la misma ilusión de ese primer
              día, decidimos dar el paso más importante y celebrar nuestro amor rodeados de las personas que más
              queremos.
            </div>
            <div class="story-quote p-4 rounded-4 border-start border-4 bg-light shadow-sm">
              <em>"El amor no se mira, se siente, y aún más cuando ella está junto a ti."</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.our-story {
  background: white;
}

.border-start {
  border-color: var(--primary-color) !important;
}

.image-wrapper {
  padding: 20px;
}

.frame {
  position: relative;
  z-index: 1;
  background: white;
  padding: 12px;
  border-radius: 1.5rem;
  transform: rotate(-2deg);
  transition: all 0.3s ease;
}

.frame:active {
  transform: rotate(0deg) scale(0.98);
}

@media (min-width: 768px) {
  .frame {
    transition: transform 0.6s var(--transition-bounce);
  }
  .frame:hover {
    transform: rotate(0deg) scale(1.02);
  }
}

.floating-badge {
  position: absolute;
  bottom: -20px;
  right: 0;
  z-index: 2;
  border: 1px solid rgba(212, 163, 115, 0.2);
}

.story-quote {
  font-family: var(--modern-font);
  color: var(--text-muted);
  position: relative;
}

@media (max-width: 991px) {
  .story-image-col {
    order: 2;
  }

  .story-content-col {
    order: 1;
    text-align: center;
  }

  .story-quote {
    text-align: left;
  }
}
</style>
