<script setup>
import { ref } from 'vue'
import Galleria from 'primevue/galleria'
import Image from 'primevue/image'
import img1 from '../assets/1.jpeg'
import img2 from '../assets/2.jpeg'
import img3 from '../assets/3.jpeg'

const images = ref([
  {
    itemImageSrc: img1,
    thumbnailImageSrc: img1,
    alt: 'Nuestra Historia 1'
  },
  {
    itemImageSrc: img2,
    thumbnailImageSrc: img2,
    alt: 'Nuestra Historia 2'
  },
  {
    itemImageSrc: img3,
    thumbnailImageSrc: img3,
    alt: 'Nuestra Historia 3'
  }
])

const responsiveOptions = [
  { breakpoint: '1024px', numVisible: 3 },
  { breakpoint: '768px', numVisible: 2 },
  { breakpoint: '560px', numVisible: 1 }
]
</script>

<template>
  <section class="photo-gallery overflow-hidden">
    <div class="container text-center">
      <div class="mb-5">
        <span class="section-tag">Momentos</span>
        <h2 class="GreatVibes display-4 mb-4">Nuestra Galería</h2>
      </div>

      <div class="gallery-container p-3 p-md-4 glass-card rounded-5 border-0 position-relative">
        <Galleria 
          :value="images" 
          :responsiveOptions="responsiveOptions" 
          :numVisible="5" 
          containerStyle="max-width: 100%"
          circular
          autoPlay
          :transitionInterval="5000"
          class="custom-galleria"
        >
          <template #item="slotProps">
            <div class="gallery-item-wrapper rounded-4 overflow-hidden shadow-sm">
              <Image 
                :src="slotProps.item.itemImageSrc" 
                :alt="slotProps.item.alt" 
                class="gallery-image w-100 h-100"
                preview 
                loading="lazy"
              />
            </div>
          </template>
          <template #thumbnail="slotProps">
            <div class="thumbnail-wrapper p-2">
              <img 
                :src="slotProps.item.thumbnailImageSrc" 
                :alt="slotProps.item.alt" 
                class="thumbnail-img img-fluid rounded-3 shadow-sm" 
                loading="lazy"
              />
            </div>
          </template>
        </Galleria>
      </div>
    </div>
  </section>
</template>

<style scoped>
.photo-gallery {
  background: var(--bg-cream);
}

.gallery-container {
  overflow: hidden;
  position: relative;
}

.gallery-item-wrapper {
  aspect-ratio: 4/3;
  background: #f8f9fa;
}

.gallery-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-image :deep(img):active {
  transform: scale(0.98);
}

.thumbnail-img {
  opacity: 0.5;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

:deep(.p-galleria-thumbnail-item-current) .thumbnail-img {
  opacity: 1;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

:deep(.p-galleria-thumbnail-container) {
  padding: 1.5rem 0;
  background: transparent;
}

@media (min-width: 768px) {
  .gallery-item-wrapper {
    aspect-ratio: 16/10;
  }
  
  .gallery-image :deep(img) {
    transition: transform 1.2s var(--transition-smooth);
  }

  .gallery-image :deep(img):hover {
    transform: scale(1.06);
  }

  .thumbnail-img {
    transition: all 0.4s ease;
  }

  :deep(.p-galleria-thumbnail-item-current) .thumbnail-img {
    transform: translateY(-4px);
  }

  :deep(.p-galleria-thumbnail-container) {
    padding: 2rem 0;
  }
}
</style>
