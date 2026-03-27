<template>
  <div class="card h-100 border-0 rounded-4 overflow-hidden info-card">
    <div class="card-body p-4 p-md-5 text-center justify-content-center">
      <div class="icon-box mb-4 mx-auto">
        <i class="pi pi-info-circle fs-1"></i>
      </div>

      <div class="tips-list text-start mx-auto" style="max-width: 950px;">
        <div class="tip-item d-flex align-items-start mb-3">
          <div class="tip-icon me-3 mt-1">
            <i class="pi pi-sun"></i>
          </div>
          <div>
            <p class="mb-0 fw-semibold small">Clima</p>
            <p class="text-muted small mb-0">La mayoría del evento será al aire libre, ¡venganse preparados!</p>
          </div>
        </div>

        <div class="tip-item d-flex align-items-start mb-3">
          <div class="tip-icon me-3 mt-1">
            <i class="pi pi-car"></i>
          </div>
          <div>
            <p class="mb-0 fw-semibold small">Estacionamiento</p>
            <p class="text-muted small mb-0">El salón cuenta con estacionamiento privado y gratuito.</p>
          </div>
        </div>

        <div class="tip-item d-flex align-items-start mb-3">
          <div class="tip-icon me-3 mt-1">
            <i class="pi pi-camera"></i>
          </div>
          <div>
            <p class="mb-0 fw-semibold small">Fotos</p>
            <p class="text-muted small mb-0">¡Etiquetanos en tus historias con nuestro hashtag!</p>
          </div>
        </div>

        <div class="tip-item d-flex align-items-start mb-0">
          <div class="tip-icon me-3 mt-1">
            <i class="pi pi-map-marker"></i>
          </div>
          <div>
            <p class="mb-0 fw-semibold small">¿Como llegar?</p>
            <p class="text-muted small mb-0">Te recomendamos venir por avenida alsina/BLVD. Tomas
              Espora hasta la altura de la serenisima y doblar en 25 de mayo. Seguramente el GPS te indique por otros
              lados, te sugiero que no le hagas caso para
              evitar meterte en lugares precarios ya que es zona de quintas por hacer unos kilometros menos. BLVD. Tomas
              Espora y 25 de mayo estan totalmente asfaltadas y señalizadas, no te podes perder ni retrasar!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-card {
  background: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.info-card:active {
  transform: scale(0.98);
}

@media (min-width: 768px) {
  .info-card {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
    transition: all 0.5s var(--transition-smooth);
  }

  .info-card:hover {
    box-shadow: var(--premium-shadow-hover);
    transform: translateY(-5px);
  }
}

.tip-icon {
  color: var(--primary-color);
  font-size: 1.1rem;
  flex-shrink: 0;
}
</style>
