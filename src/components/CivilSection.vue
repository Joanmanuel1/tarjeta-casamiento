<script setup>
import AddToCalendar from './AddToCalendar.vue'
</script>

<template>
  <div class="event-premium-card p-4 p-md-5 rounded-5 shadow-sm bg-white border-light text-center h-100 hover-lift">
    <div class="event-icon-wrapper mb-4 mx-auto bg-light rounded-circle shadow-xs">
      <i class="pi pi-building fs-1 text-primary"></i>
    </div>

    <div class="mb-4">
      <span class="section-tag small fw-bold">Ceremonia</span>
      <h3 class="fw-bold mb-3">Civil</h3>
      <div class="d-flex align-items-center justify-content-center gap-3 text-muted small mb-1">
        <i class="pi pi-calendar"></i>
        <span>Sábado 6 de Noviembre, 2027</span>
      </div>
      <div class="d-flex align-items-center justify-content-center gap-3 text-muted small">
        <i class="pi pi-clock"></i>
        <span>11:30 HS</span>
      </div>
    </div>

    <div class="location-box mb-5 p-3 rounded-4 bg-light border-light">
      <h6 class="fw-bold mb-1">Registro Civil Temperley</h6>
      <p class="mb-0 text-muted extra-small">Liniers 155, Lomas de Zamora, PBA</p>
    </div>

    <div class="d-grid gap-2">
      <a href="https://maps.app.goo.gl/1EoNEA5rh9U61FjM7" target="_blank"
        class="btn btn-premium-outline rounded-pill py-3 fw-bold">
        <i class="pi pi-map-marker me-2"></i>Cómo llegar
      </a>
      <AddToCalendar which="civil" variant="outline" />
    </div>
    <div class="map-wrapper mt-4">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.18736899997!2d-58.399172899999996!3d-34.7760581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcd2e6b757cbbd%3A0x21edc66d66e1aa31!2sDelegaci%C3%B3n%20Registro%20Provincial%20de%20las%20Personas%20-%20Temperley!5e0!3m2!1ses-419!2sar!4v1774715857405!5m2!1ses-419!2sar"
        width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
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

.map-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 1rem;
  overflow: hidden;
}

@media (max-width: 767px) {
  .map-wrapper {
    aspect-ratio: 4/3;
  }

  .event-premium-card {
    padding: 1.25rem !important;
  }
}

@media (min-width: 768px) {
  .event-premium-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  }
}
</style>
