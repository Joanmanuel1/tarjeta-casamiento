<template>
  <div class="event-premium-card p-4 p-md-5 rounded-5 shadow-sm bg-white border-light text-center h-100 hover-lift">
    <div class="event-icon-wrapper mb-4 mx-auto bg-light rounded-circle shadow-xs">
      <i class="pi pi-star fs-1 text-primary"></i>
    </div>

    <div class="mb-4">
      <span class="section-tag small fw-bold">Celebración</span>
      <h3 class="fw-bold mb-3">La Fiesta</h3>
      <div class="d-flex align-items-center justify-content-center gap-3 text-muted small mb-1">
        <i class="pi pi-calendar"></i>
        <span>Sábado 6 de Noviembre, 2027</span>
      </div>
      <div class="d-flex align-items-center justify-content-center gap-3 text-muted small">
        <i class="pi pi-clock"></i>
        <span>18:00 HS</span>
      </div>
    </div>

    <div class="location-box mb-5 p-3 rounded-4 bg-light border-light">
      <h6 class="fw-bold mb-1">Quinta "Los Cipreses"</h6>
      <p class="mb-0 text-muted extra-small">25 de Mayo 1696, Ministro Rivadavia, PBA</p>
      <p class="mb-0 text-muted extra-small">Recomendamos usar Av. Espora y luego 25 de mayo (todo asfaltado). El GPS
        suele enviar por calles precarias, ¡ignórenlo!</p>
    </div>

    <div class="d-grid">
      <a href="https://maps.app.goo.gl/SBSGdeesLDC6EwDw7" target="_blank"
        class="btn btn-premium-outline rounded-pill py-3 fw-bold">
        <i class="pi pi-map-marker me-2"></i>Ubicación en Maps
      </a>
    </div>

    <div class="mt-4">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3274.8726785634044!2d-58.355814599999995!3d-34.834293599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a32b3be862db31%3A0x25ec96e82d674b3e!2sLos%20cipreses%20quinta%20para%20eventos!5e0!3m2!1ses-419!2sar!4v1774715923284!5m2!1ses-419!2sar"
        width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</template>

<style scoped>
.event-premium-card {
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.4s var(--transition-bounce);
}

.event-icon-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-box {
  background-color: #fdfbf7;
}

.btn-premium-outline {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
  transition: all 0.3s ease;
}

.btn-premium-outline:hover,
.btn-premium-outline:active {
  background: var(--primary-color);
  color: white;
}

.map-preview-shimmer {
  height: 120px;
  background: #f8f9fa;
  position: relative;
}

.shimmer-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}

.extra-small {
  font-size: 0.75rem;
}

@media (min-width: 768px) {
  .event-premium-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  }
}
</style>
