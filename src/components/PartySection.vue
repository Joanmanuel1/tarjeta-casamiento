<template>
  <div class="card h-100 border-0 rounded-4 overflow-hidden event-card">
    <div class="card-body p-4 p-md-5 text-center">
      <div class="icon-box mb-4 mx-auto">
        <i class="pi pi-star fs-1"></i>
      </div>
      <p class="mb-1 fw-bold"><i class="pi pi-calendar me-2 small"></i>Sábado 6 de Noviembre, 2027</p>
      <p class="mb-4 text-muted"><i class="pi pi-clock me-2 small"></i>18:00 HS</p>

      <div class="location-details mb-4">
        <p class="mb-1 fw-semibold">Los Cipreses</p>
        <p class="text-muted small mb-0">25 de Mayo 1696, B1852 Ministro Rivadavia, Provincia de Buenos Aires</p>
      </div>
      <div class="location-details mb-4">
        <p class="mb-1 fw-semibold">¿Cómo llegar?</p>
        <p class="text-muted small mb-0"> Te recomendamos venir por avenida alsina/BLVD. Tomas Espora hasta la altura de
          la serenisima y doblar en 25 de mayo.</p>
        <p class="text-muted small mb-0">Seguramente el GPS te indique por otros lados para cortar camino, <b
            class="fw-bold text-uppercase">pero te
            sugiero que no le hagas caso</b>
          para evitar meterte en lugares precarios ya que es zona de quintas por hacer unos kilometros menos. </p>
        <p class="text-muted small mb-0">BLVD. Tomas Espora y 25 de mayo estan totalmente asfaltadas y señalizadas.</p>
        <p class="text-muted small mb-0">¡No te podes perder ni retrasar!</p>
      </div>


      <a href="https://maps.app.goo.gl/SBSGdeesLDC6EwDw7" target="_blank"
        class="btn btn-outline-event rounded-pill px-4 py-2 hover-lift">
        <i class="pi pi-map-marker me-2"></i>Ver Ubicación
      </a>
      <div class="mt-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3274.8726785634044!2d-58.355814599999995!3d-34.834293599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a32b3be862db31%3A0x25ec96e82d674b3e!2sLos%20cipreses%20quinta%20para%20eventos!5e0!3m2!1ses-419!2sar!4v1774637477098!5m2!1ses-419!2sar"
          width="100%" height="600" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
