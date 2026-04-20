<script setup>
const tips = [
  { title: 'Clima', icon: 'pi pi-sun',        text: 'La ceremonia y recepción serán al aire libre. ¡Traigan algo liviano por si refresca!' },
  { title: 'Estacionamiento', icon: 'pi pi-car', text: 'El salón "Los Cipreses" cuenta con seguridad privada y estacionamiento gratuito dentro del predio.' },
  { title: 'Fotos & Recuerdos', icon: 'pi pi-camera', text: '¡Queremos ver la fiesta a través de sus ojos! Suban sus fotos al código QR o a través del link.' },
  { title: 'Cómo Llegar', icon: 'pi pi-map-marker', text: 'Recomendamos usar Av. Espora y luego 25 de mayo. El GPS suele enviar por calles precarias, ¡ignórenlo!' },
]
</script>

<template>
  <div class="tips-grid">
    <div v-for="(tip, i) in tips" :key="i" class="tip-card section-reveal">
      <div class="tip-icon-box">
        <i :class="tip.icon"></i>
      </div>
      <div class="tip-body">
        <h5 class="tip-title">{{ tip.title }}</h5>
        <p class="tip-text">{{ tip.text }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tips-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 760px;
  margin: 0 auto;
}

@media (min-width: 600px) {
  .tips-grid { grid-template-columns: 1fr 1fr; }
}

.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: white;
  border-radius: 1.5rem;
  padding: 1.25rem 1.35rem;
  border: 1px solid rgba(0,0,0,0.03);
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  transition: all 0.35s var(--transition-bounce);
}

.tip-card:active { transform: scale(0.98); }

@media (min-width: 768px) {
  .tip-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 40px rgba(212,163,115,0.12);
    border-color: rgba(212,163,115,0.25);
  }
}

.tip-icon-box {
  width: 48px; height: 48px;
  min-width: 48px;
  border-radius: 1rem;
  background: var(--secondary-color);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary-dark);
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(212,163,115,0.2);
}

.tip-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 0.35rem;
}
.tip-text {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}
</style>
