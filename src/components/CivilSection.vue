<template>
  <div class="card h-100 border-0 rounded-4 overflow-hidden event-card">
    <div class="card-body p-4 p-md-5 text-center">
      <div class="icon-box mb-4 mx-auto">
        <i class="pi pi-building fs-1"></i>
      </div>
      <p class="mb-1 fw-bold"><i class="pi pi-calendar me-2 small"></i>Sábado 6 de Noviembre, 2027</p>
      <p class="mb-4 text-muted"><i class="pi pi-clock me-2 small"></i>11:30 HS</p>

      <div class="location-details mb-4">
        <p class="mb-1 fw-semibold">Registro Civil Temperley</p>
        <p class="text-muted small mb-0">Liniers 155, B1834 Lomas de Zamora, Provincia de Buenos Aires</p>
      </div>

      <a href="https://maps.app.goo.gl/1EoNEA5rh9U61FjM7" target="_blank"
        class="btn btn-outline-event rounded-pill px-4 py-2 hover-lift">
        <i class="pi pi-map-marker me-2"></i>Ver Ubicación
      </a>
      <div class="mt-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.18736899997!2d-58.399172899999996!3d-34.7760581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcd2e6b757cbbd%3A0x21edc66d66e1aa31!2sDelegaci%C3%B3n%20Registro%20Provincial%20de%20las%20Personas%20-%20Temperley!5e0!3m2!1ses-419!2sar!4v1774638463276!5m2!1ses-419!2sar"
          width="100%" height="600" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile-first event card */
.event-card {
  background: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.event-card:active {
  transform: scale(0.98);
}

.btn-outline-event {
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  font-weight: 600;
  font-size: 0.9rem;
  min-height: 48px;
  transition: all 0.3s ease;
}

.btn-outline-event:active {
  background-color: var(--primary-color);
  color: white;
}

@media (min-width: 768px) {
  .event-card {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
    transition: all 0.5s var(--transition-smooth);
  }

  .event-card:hover {
    box-shadow: var(--premium-shadow-hover);
    transform: translateY(-5px);
  }

  .btn-outline-event:hover {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}
</style>
