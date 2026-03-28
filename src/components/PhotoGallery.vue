<script setup>
import { ref } from 'vue'
import Galleria from 'primevue/galleria'
import Image from 'primevue/image'
import img1 from '../assets/1.jpeg'
import img2 from '../assets/2.jpeg'
import img3 from '../assets/3.jpeg'

const images = ref([
  { itemImageSrc: img1, thumbnailImageSrc: img1, alt: 'Momento 1' },
  { itemImageSrc: img2, thumbnailImageSrc: img2, alt: 'Momento 2' },
  { itemImageSrc: img3, thumbnailImageSrc: img3, alt: 'Momento 3' }
])

const responsiveOptions = [
  { breakpoint: '1024px', numVisible: 3 },
  { breakpoint: '768px', numVisible: 3 },
  { breakpoint: '560px', numVisible: 2 }
]
</script>

<template>
  <section class="gallery-section py-5 bg-galeria">
    <div class="container maxWidth-lg">
      <div class="text-center mb-5 section-reveal">
        <span class="section-tag mb-2">Galería</span>
        <h2 class="GreatVibes display-4">Nuestros Momentos</h2>
      </div>

      <div class="premium-galleria-wrapper p-2 p-md-4 rounded-5 shadow-2xl bg-white">
        <Galleria 
          :value="images" 
          :responsiveOptions="responsiveOptions" 
          :numVisible="5" 
          containerStyle="width: 100%"
          circular
          :showItemNavigators="true"
          :showThumbnails="true"
          class="modern-galleria"
        >
          <template #item="slotProps">
            <div class="main-image-container rounded-4 overflow-hidden shadow-sm">
              <Image 
                :src="slotProps.item.itemImageSrc" 
                :alt="slotProps.item.alt" 
                class="w-100 h-100"
                preview 
              />
            </div>
          </template>
          <template #thumbnail="slotProps">
            <div class="thumbnail-item px-1">
              <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" class="rounded-3 shadow-xs" />
            </div>
          </template>
        </Galleria>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery-section {
  background-color: var(--bg-galeria);
}

.maxWidth-lg {
  max-width: 1000px;
}

.premium-galleria-wrapper {
  border: 1px solid rgba(0,0,0,0.03);
}

.main-image-container {
  aspect-ratio: 16/9;
  background: #f8f9fa;
}

.main-image-container :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--transition-smooth);
}

.thumbnail-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  opacity: 0.6;
  transition: all 0.3s ease;
  cursor: pointer;
}

:deep(.p-galleria-thumbnail-item-current) img {
  opacity: 1;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
}

:deep(.p-galleria-item-prev),
:deep(.p-galleria-item-next) {
  background: rgba(255,255,255,0.2) !important;
  backdrop-filter: blur(10px);
  color: white !important;
  width: 44px;
  height: 44px;
  border-radius: 50% !important;
  margin: 0 10px;
}

@media (max-width: 768px) {
  .main-image-container {
    aspect-ratio: 4/5;
  }
}
</style>
