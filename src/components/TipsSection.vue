<template>
  <div class="tips-wrapper py-4 px-3">
    <div class="row g-4 justify-content-center">
      <div v-for="(tip, index) in tips" :key="index" class="col-md-6 col-lg-5">
        <div
          class="tip-card p-4 rounded-5 bg-white shadow-sm h-100 d-flex align-items-start gap-4 border-light hover-lift">
          <div class="tip-icon-box bg-tips p-3 rounded-4 shadow-xs">
            <i :class="tip.icon" class="fs-3 text-primary"></i>
          </div>
          <div class="tip-content flex-grow-1">
            <h5 class="fw-bold mb-2">{{ tip.title }}</h5>
            <p class="text-muted small mb-0 lh-base">{{ tip.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const tips = [
  {
    title: 'Clima',
    icon: 'pi pi-sun',
    text: 'La ceremonia y recepción serán al aire libre. ¡Traigan algo liviano por si refresca!'
  },
  {
    title: 'Estacionamiento',
    icon: 'pi pi-car',
    text: 'El salón "Los Cipreses" cuenta con seguridad privada y estacionamiento gratuito dentro del predio.'
  },
  {
    title: 'Fotos y Recuerdos',
    icon: 'pi pi-camera',
    text: '¡Queremos ver la fiesta a través de sus ojos! Suban sus fotos al código QR o a traves de este link.'
  },
  {
    title: 'Cómo Llegar',
    icon: 'pi pi-map-marker',
    text: 'Recomendamos usar Av. Espora y luego 25 de mayo (todo asfaltado). El GPS suele enviar por calles precarias, ¡ignórenlo!'
  }
]
</script>

<style scoped>
.tip-card {
  border: 1px solid rgba(0, 0, 0, 0.02);
  transition: all 0.4s var(--transition-bounce);
}

.tip-icon-box {
  background-color: var(--bg-tips);
  border: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .tip-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
    border-color: var(--primary-color);
  }
}

@media (max-width: 767px) {
  .tip-card {
    padding: 1.5rem !important;
    gap: 1rem !important;
  }

  .tip-icon-box {
    padding: 0.75rem !important;
  }

  .tip-icon-box i {
    font-size: 1.25rem !important;
  }
}
</style>
