<template>
  <div class="card h-100 border-0 rounded-4 overflow-hidden info-card">
    <div class="card-body p-4 p-md-5 text-center">
      <div class="icon-box mb-4 mx-auto">
        <i class="pi pi-briefcase fs-1"></i>
      </div>
      <p class="mb-4 text-muted">Queremos que te sientas cómodo/a para celebrar con nosotros.</p>

      <div class="dress-code-details mb-4">
        <h4 class="fs-5 fw-bold mb-2">Elegante Sport</h4>
        <p class="small text-muted mb-1">👔 Hombres: Camisa y pantalón de vestir (saco opcional).</p>
        <p class="small text-muted mb-0">👗 Mujeres: Vestido corto o largo, o conjunto elegante.</p>
      </div>

      <div class="alert-romantic border-0 rounded-pill py-2 px-4 d-inline-flex align-items-center gap-2">
        <i class="pi pi-heart-fill small"></i>
        <span class="small fw-semibold">¡Tu presencia es nuestro mejor regalo!</span>
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

.alert-romantic {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}
</style>
