<script setup>
import mensDressWebp from '../assets/mens_dress.webp'
import mensDressPng from '../assets/mens_dress.png'
import womensDressWebp from '../assets/womens_dress.webp'
import womensDressPng from '../assets/womens_dress.png'

const dressCodeMessage = "Elegante pero cómodo 😎"
const danceMessage = "Queremos que te veas increíble... ¡y que bailes toda la noche! 💃🕺"
</script>

<template>
  <div class="dress-code-wrapper py-5 px-3">
    <div class="header-human text-center mb-5 section-reveal">
      <h3 class="GreatVibes display-5 mb-2">{{ dressCodeMessage }}</h3>
      <p class="text-muted small tracking-widest text-uppercase">El estilo perfecto para celebrar</p>
    </div>

    <div class="row g-4 justify-content-center">
      <!-- Card Hombres -->
      <div class="col-md-6 col-lg-5 col-xl-4 section-reveal">
        <div class="outfit-card p-4 rounded-5 shadow-lg h-100 hover-glow scheme-men">
          <div class="outfit-image-wrapper mb-4 overflow-hidden rounded-4 shadow-sm">
            <picture>
              <source :srcset="mensDressWebp" type="image/webp" />
              <img :src="mensDressPng" alt="Dress Code Hombres" class="w-100 object-fit-cover"
                loading="lazy" decoding="async" style="aspect-ratio: 3/4; width: 100%;">
            </picture>
          </div>

          <div class="text-center">
            <div class="outfit-badge mb-3 mx-auto">👔 🕺 👞</div>
            <h4 class="fw-bold mb-1">Para Ellos</h4>
            <p class="small text-muted mb-4">Semi-Formal / Elegante Sport</p>

            <div class="outfit-details px-3">
              <ul class="list-unstyled d-flex flex-column gap-2 text-start mx-auto" style="max-width: 220px;">
                <li class="d-flex align-items-center gap-2">
                  <span class="emoji-bullet">👔</span>
                  <span class="small fw-medium">Camisa y pantalón</span>
                </li>
                <li class="d-flex align-items-center gap-2">
                  <span class="emoji-bullet">🧥</span>
                  <span class="small fw-medium">Saco (opcional)</span>
                </li>
                <li class="d-flex align-items-center gap-2">
                  <span class="emoji-bullet">👞</span>
                  <span class="small fw-medium">Calzado cómodo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Mujeres -->
      <div class="col-md-6 col-lg-5 col-xl-4 section-reveal">
        <div class="outfit-card p-4 rounded-5 shadow-lg h-100 hover-glow scheme-women">
          <div class="outfit-image-wrapper mb-4 overflow-hidden rounded-4 shadow-sm">
            <picture>
              <source :srcset="womensDressWebp" type="image/webp" />
              <img :src="womensDressPng" alt="Dress Code Mujeres" class="w-100 object-fit-cover"
                loading="lazy" decoding="async" style="aspect-ratio: 3/4; width: 100%;">
            </picture>
          </div>

          <div class="text-center">
            <div class="outfit-badge mb-3 mx-auto">👗 💃 👠</div>
            <h4 class="fw-bold mb-1">Para Ellas</h4>
            <p class="small text-muted mb-4">Semi-Formal / Elegante</p>

            <div class="outfit-details px-3">
              <ul class="list-unstyled d-flex flex-column gap-2 text-start mx-auto" style="max-width: 220px;">
                <li class="d-flex align-items-center gap-2">
                  <span class="emoji-bullet">👗</span>
                  <span class="small fw-medium">Vestido (corto o largo)</span>
                </li>
                <li class="d-flex align-items-center gap-2">
                  <span class="emoji-bullet">✨</span>
                  <span class="small fw-medium">Conjunto elegante</span>
                </li>
                <li class="d-flex align-items-center gap-2">
                  <span class="emoji-bullet">👠</span>
                  <span class="small fw-medium">Zapatos para bailar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-5 footer-reveal">
      <div class="dance-message-bubble p-4 rounded-pill shadow-sm mx-auto">
        <span class="dance-text fw-bold">{{ danceMessage }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dress-code-wrapper {
  background-color: transparent;
}

.outfit-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.02);
  transition: all 0.5s var(--transition-smooth);
  position: relative;
  overflow: hidden;
}

.scheme-men {
  background: #fdfbf7;
}

.scheme-women {
  background: #fff5f5;
}

.outfit-image-wrapper {
  border: 4px solid white;
}

.outfit-badge {
  background: white;
  width: fit-content;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.emoji-bullet {
  font-size: 1.2rem;
  min-width: 30px;
}

.dance-message-bubble {
  background: white;
  max-width: 800px;
  border: 1px solid var(--secondary-color);
  transition: all 0.3s ease;
}

.dance-text {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.1rem;
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    opacity: 0.8;
  }

  50% {
    opacity: 1;
    transform: scale(1.02);
  }

  100% {
    opacity: 0.8;
  }
}

@media (min-width: 768px) {
  .outfit-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 30px 60px rgba(212, 163, 115, 0.1) !important;
  }
}

@media (max-width: 767px) {
  .outfit-card:active {
    transform: scale(0.98);
  }

  .dress-code-wrapper {
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .outfit-badge {
    font-size: 1.3rem;
  }

  .dance-message-bubble {
    border-radius: 1.25rem !important;
    padding: 1rem 1.25rem !important;
  }

  .dance-text {
    font-size: 0.95rem;
  }
}
</style>
