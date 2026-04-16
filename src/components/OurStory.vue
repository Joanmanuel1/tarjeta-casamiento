<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import storyImg from '../assets/1.webp'

const storyRef = ref(null)

onMounted(() => {
  // Staggered reveal for blocks
  gsap.from('.story-block', {
    opacity: 0,
    y: 30,
    stagger: 0.3,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.story-container',
      start: 'top 80%',
      once: true
    }
  })
})
</script>

<template>
  <section class="story-section py-5 overflow-hidden bg-history">
    <div class="container py-lg-5">
      <div class="text-center mb-5 story-block">
        <h2 class="GreatVibes display-4">Nuestra historia de amor</h2>
      </div>

      <div class="row align-items-center g-5 story-container">
        <!-- Image Side -->
        <div class="col-lg-6 story-block">
          <div class="story-image-frame position-relative p-2 bg-white shadow-2xl rounded-5">
            <img :src="storyImg" alt="Joan y Stephie" class="img-fluid rounded-5 story-img" loading="lazy">
            <div class="story-floating-years shadow-lg">
              <span class="fs-4 fw-bold">6</span>
              <span class="small opacity-75">Años Juntos</span>
            </div>
          </div>
        </div>

        <!-- Narrative Side -->
        <div class="col-lg-6 story-block">
          <div class="ps-lg-5">
            <div class="narrative-content">
              <p class="fs-5 lh-lg text-muted mb-4">
                Nuestra historia comenzo...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story-section {
  background-color: var(--bg-history);
}

.text-highlight {
  color: var(--primary-color);
  font-weight: 700;
  position: relative;
}

.text-highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  height: 6px;
  background: var(--secondary-color);
  z-index: -1;
  opacity: 0.5;
}

.story-image-frame {
  transform: rotate(-3deg);
  transition: all 0.5s var(--transition-bounce);
}

.story-img {
  filter: sepia(0.2) contrast(1.05);
  transition: all 0.5s ease;
}

.story-floating-years {
  position: absolute;
  bottom: -20px;
  right: -10px;
  background: white;
  padding: 15px 25px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  border: 1px solid #f0f0f0;
}

.emotional-quote {
  border-left: 4px solid var(--primary-color);
}

@media (max-width: 991px) {
  .story-image-frame {
    transform: rotate(0deg);
    max-width: 400px;
    margin: 0 auto;
  }

  .story-section {
    text-align: center;
  }

  .emotional-quote {
    text-align: left;
  }
}

@media (min-width: 992px) {
  .story-image-frame:hover {
    transform: rotate(0deg) scale(1.02);
  }

  .story-image-frame:hover .story-img {
    filter: sepia(0);
  }
}
</style>
