<script setup>
import AddToCalendar from './AddToCalendar.vue'
</script>

<template>
  <div class="event-card h-100">
    <!-- Cabecera coloreada -->
    <div class="event-card-header">
      <div class="event-icon-ring">
        <i class="pi pi-building"></i>
      </div>
      <div class="event-card-header-text">
        <span class="section-tag" style="color: rgba(255,255,255,0.75)">Ceremonia</span>
        <h3 class="GreatVibes event-title">Civil</h3>
      </div>
    </div>

    <!-- Cuerpo -->
    <div class="event-card-body">
      <!-- Fecha y hora -->
      <div class="event-meta-row">
        <div class="event-meta-item">
          <i class="pi pi-calendar event-meta-icon"></i>
          <div>
            <span class="event-meta-label">Fecha</span>
            <span class="event-meta-value">Sábado 6 de Nov, 2027</span>
          </div>
        </div>
        <div class="event-meta-item">
          <i class="pi pi-clock event-meta-icon"></i>
          <div>
            <span class="event-meta-label">Hora</span>
            <span class="event-meta-value">11:30 HS</span>
          </div>
        </div>
      </div>

      <!-- Lugar -->
      <div class="event-location-box">
        <i class="pi pi-map-marker event-loc-icon"></i>
        <div>
          <h6 class="event-loc-name">Registro Civil Temperley</h6>
          <p class="event-loc-addr">Liniers 155, Lomas de Zamora, PBA</p>
        </div>
      </div>

      <!-- Acciones -->
      <div class="d-grid gap-2 mb-4">
        <a
          href="https://maps.app.goo.gl/1EoNEA5rh9U61FjM7"
          target="_blank"
          rel="noopener"
          class="btn-event-action btn-event-action--outline"
        >
          <i class="pi pi-map-marker me-2"></i>Cómo llegar
        </a>
        <AddToCalendar which="civil" variant="outline" />
      </div>

      <!-- Mapa -->
      <div class="event-map-wrap">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.18736899997!2d-58.399172899999996!3d-34.7760581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcd2e6b757cbbd%3A0x21edc66d66e1aa31!2sDelegaci%C3%B3n%20Registro%20Provincial%20de%20las%20Personas%20-%20Temperley!5e0!3m2!1ses-419!2sar!4v1774715857405!5m2!1ses-419!2sar"
          width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Mapa Registro Civil Temperley"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 20px 50px rgba(0,0,0,0.06);
  transition: transform 0.4s var(--transition-bounce), box-shadow 0.4s ease;
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .event-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 70px rgba(212,163,115,0.15);
  }
}
.event-card:active { transform: scale(0.99); }

/* Header */
.event-card-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  padding: 1.75rem 1.5rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.event-icon-ring {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.4);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1.4rem;
  flex-shrink: 0;
}
.event-card-header-text { flex: 1; }
.event-title {
  font-size: 2.2rem;
  color: white;
  margin: 0;
  line-height: 1;
}

/* Body */
.event-card-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }

/* Meta row */
.event-meta-row {
  display: flex; gap: 1rem;
  margin-bottom: 1.25rem;
}
.event-meta-item {
  flex: 1;
  display: flex; align-items: flex-start; gap: 0.65rem;
  background: var(--bg-cream);
  border-radius: 1rem;
  padding: 0.85rem 1rem;
}
.event-meta-icon {
  color: var(--primary-color);
  font-size: 1rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}
.event-meta-label {
  display: block;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.event-meta-value {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1.3;
}

/* Location */
.event-location-box {
  display: flex; align-items: flex-start; gap: 0.75rem;
  background: var(--bg-cream);
  border-radius: 1rem;
  padding: 1rem 1.1rem;
  margin-bottom: 1.25rem;
  border: 1px solid rgba(212,163,115,0.15);
}
.event-loc-icon { color: var(--primary-color); font-size: 1.1rem; margin-top: 0.15rem; flex-shrink: 0; }
.event-loc-name { font-size: 0.9rem; font-weight: 700; color: var(--text-dark); margin: 0 0 0.2rem; }
.event-loc-addr { font-size: 0.75rem; color: var(--text-muted); margin: 0; line-height: 1.4; }

/* Buttons */
.btn-event-action {
  display: flex; align-items: center; justify-content: center;
  border-radius: 2rem;
  padding: 0.7rem 1.25rem;
  font-size: 0.85rem; font-weight: 700;
  min-height: 48px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s var(--transition-bounce);
}
.btn-event-action--outline {
  background: transparent;
  border: 1.5px solid var(--primary-color);
  color: var(--primary-color);
}
.btn-event-action--outline:hover {
  background: var(--primary-color); color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212,163,115,0.25);
}
.btn-event-action--outline:active { background: var(--primary-dark); color: white; transform: scale(0.97); }

/* Mapa */
.event-map-wrap {
  border-radius: 1.25rem; overflow: hidden;
  aspect-ratio: 16/9;
  flex: 1; min-height: 160px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}
@media (max-width: 767px) {
  .event-map-wrap { aspect-ratio: 4/3; }
  .event-card-header { padding: 1.25rem 1.25rem 1rem; }
  .event-card-body { padding: 1.25rem; }
  .event-meta-row { flex-direction: column; gap: 0.5rem; }
}
</style>
