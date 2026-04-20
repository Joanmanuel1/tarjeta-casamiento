<script setup>
import mensDressWebp  from '../assets/mens_dress.webp'
import mensDressPng   from '../assets/mens_dress.png'
import womensDressWebp from '../assets/womens_dress.webp'
import womensDressPng  from '../assets/womens_dress.png'
</script>

<template>
  <div class="dc-wrapper">
    <!-- Mensaje principal -->
    <div class="text-center mb-5 section-reveal">
      <h3 class="GreatVibes display-5 dc-headline">Elegante pero cómodo 😎</h3>
      <p class="dc-note">El estilo perfecto para celebrar · Se reserva el color blanco</p>
    </div>

    <!-- Cards -->
    <div class="dc-grid">
      <!-- Hombres -->
      <div class="dc-card dc-card--men section-reveal">
        <div class="dc-img-wrap">
          <picture>
            <source :srcset="mensDressWebp" type="image/webp" />
            <img :src="mensDressPng" alt="Dress Code Hombres" loading="lazy" decoding="async" />
          </picture>
          <div class="dc-img-overlay">
            <span class="dc-img-badge">👔 Para Ellos</span>
          </div>
        </div>
        <div class="dc-card-body">
          <div class="dc-emoji-row mb-3">👔 🕺 👞</div>
          <h4 class="dc-card-title">Semi-Formal / Elegante Sport</h4>
          <ul class="dc-list">
            <li><span class="dc-list-emoji">👔</span><span>Camisa y pantalón</span></li>
            <li><span class="dc-list-emoji">🧥</span><span>Saco (opcional)</span></li>
            <li><span class="dc-list-emoji">👞</span><span>Calzado cómodo</span></li>
          </ul>
        </div>
      </div>

      <!-- Mujeres -->
      <div class="dc-card dc-card--women section-reveal">
        <div class="dc-img-wrap">
          <picture>
            <source :srcset="womensDressWebp" type="image/webp" />
            <img :src="womensDressPng" alt="Dress Code Mujeres" loading="lazy" decoding="async" />
          </picture>
          <div class="dc-img-overlay">
            <span class="dc-img-badge">👗 Para Ellas</span>
          </div>
        </div>
        <div class="dc-card-body">
          <div class="dc-emoji-row mb-3">👗 💃 👠</div>
          <h4 class="dc-card-title">Semi-Formal / Elegante</h4>
          <ul class="dc-list">
            <li><span class="dc-list-emoji">👗</span><span>Vestido (corto o largo)</span></li>
            <li><span class="dc-list-emoji">✨</span><span>Conjunto elegante</span></li>
            <li><span class="dc-list-emoji">👠</span><span>Zapatos para bailar</span></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Banner baile -->
    <div class="dc-dance-banner section-reveal">
      <span class="dc-dance-text">Queremos que te veas increíble… ¡y que bailes toda la noche! 💃🕺</span>
    </div>
  </div>
</template>

<style scoped>
.dc-wrapper { padding-bottom: 1rem; }

.dc-headline { color: var(--primary-dark); }
.dc-note {
  font-size: 0.8rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

/* ── Grid ─────────────────────────────────── */
.dc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  max-width: 720px;
  margin: 0 auto 2rem;
}
@media (min-width: 600px) {
  .dc-grid { grid-template-columns: 1fr 1fr; }
}

/* ── Card ─────────────────────────────────── */
.dc-card {
  border-radius: 2rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 20px 50px rgba(0,0,0,0.07);
  border: 1px solid rgba(0,0,0,0.03);
  transition: all 0.45s var(--transition-bounce);
}
@media (min-width: 768px) {
  .dc-card:hover {
    transform: translateY(-10px) scale(1.01);
    box-shadow: 0 30px 60px rgba(212,163,115,0.12);
  }
}
.dc-card:active { transform: scale(0.98); }

/* Imagen */
.dc-img-wrap { position: relative; overflow: hidden; }
.dc-img-wrap img {
  width: 100%; display: block;
  aspect-ratio: 3/4; object-fit: cover;
  transition: transform 0.5s var(--transition-smooth);
}
.dc-card:hover .dc-img-wrap img { transform: scale(1.04); }

.dc-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%);
  display: flex; align-items: flex-end; padding: 1.1rem;
}
.dc-img-badge {
  background: rgba(255,255,255,0.92);
  color: var(--text-dark);
  font-size: 0.78rem; font-weight: 700;
  padding: 0.35rem 0.85rem;
  border-radius: 2rem;
  backdrop-filter: blur(6px);
}

/* Body */
.dc-card-body { padding: 1.25rem 1.35rem 1.5rem; text-align: center; }
.dc-emoji-row { font-size: 1.3rem; letter-spacing: 0.15em; }
.dc-card-title {
  font-size: 0.82rem; font-weight: 600;
  color: var(--text-muted); margin: 0 0 1rem;
  text-transform: uppercase; letter-spacing: 0.08em;
}

.dc-list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 0.5rem;
  text-align: left; max-width: 200px; margin: 0 auto;
}
.dc-list li { display: flex; align-items: center; gap: 0.6rem; }
.dc-list-emoji { font-size: 1.1rem; min-width: 24px; }
.dc-list span:last-child { font-size: 0.85rem; font-weight: 600; color: var(--text-dark); }

/* ── Banner baile ─────────────────────────── */
.dc-dance-banner {
  max-width: 680px;
  margin: 0 auto;
  background: white;
  border: 1.5px solid rgba(212,163,115,0.25);
  border-radius: 2rem;
  padding: 1.25rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(212,163,115,0.1);
}
.dc-dance-text {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
}

@media (max-width: 599px) {
  .dc-dance-banner { padding: 1rem 1.25rem; border-radius: 1.5rem; }
  .dc-dance-text { font-size: 0.9rem; }
}
</style>
