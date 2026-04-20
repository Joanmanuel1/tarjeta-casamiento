<script setup>
import qrImg from '../assets/qrboda.jpeg'
const openAlbum = () => window.open('https://photos.app.goo.gl/kFHSb1q1aX59tm3D7', '_blank', 'noopener')
</script>

<template>
  <div class="qr-wrapper">
    <div class="qr-card section-reveal mx-auto">
      <!-- QR image -->
      <div class="qr-visual">
        <img :src="qrImg" alt="QR Code para álbum compartido" class="qr-img" />
        <div class="qr-scan-badge">SCAN ME</div>
      </div>

      <!-- Text -->
      <div class="qr-info">
        <h4 class="qr-title">Compartí tus fotos 📷</h4>
        <p class="qr-desc">
          Queremos revivir cada momento de la fiesta. Escaneá el código o usá el botón para subir tus fotos al álbum compartido.
        </p>
        <button @click="openAlbum" class="qr-btn">
          <i class="pi pi-images me-2"></i>
          Sumar mis fotos
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-wrapper { max-width: 640px; margin: 0 auto; }

.qr-card {
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 2rem 2.5rem;
  gap: 1.75rem;
  transition: transform 0.4s var(--transition-bounce);
}
@media (min-width: 600px) {
  .qr-card {
    flex-direction: row;
    padding: 2rem 2.5rem;
    align-items: center;
  }
}
@media (min-width: 768px) {
  .qr-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px rgba(212,163,115,0.12); }
}

/* QR Visual */
.qr-visual {
  position: relative;
  flex-shrink: 0;
}
.qr-img {
  width: 160px; height: 160px;
  object-fit: cover;
  border-radius: 1.25rem;
  border: 4px solid var(--secondary-color);
  box-shadow: 0 8px 25px rgba(212,163,115,0.2);
  display: block;
}
@media (min-width: 600px) {
  .qr-img { width: 180px; height: 180px; }
}

.qr-scan-badge {
  position: absolute;
  top: -10px; right: -10px;
  background: var(--text-dark);
  color: white;
  font-size: 0.58rem; font-weight: 800;
  padding: 4px 10px; border-radius: 2rem;
  letter-spacing: 0.12em;
}

/* Info */
.qr-info { flex: 1; text-align: center; }
@media (min-width: 600px) { .qr-info { text-align: left; } }

.qr-title {
  font-size: 1.1rem; font-weight: 700;
  color: var(--text-dark); margin: 0 0 0.6rem;
}
.qr-desc {
  font-size: 0.85rem; color: var(--text-muted);
  line-height: 1.6; margin: 0 0 1.25rem;
}
.qr-btn {
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--primary-color); color: white;
  border: none; border-radius: 2rem;
  padding: 0.7rem 1.75rem;
  font-size: 0.9rem; font-weight: 700;
  min-height: 48px; cursor: pointer;
  transition: all 0.35s var(--transition-bounce);
  box-shadow: 0 8px 20px rgba(212,163,115,0.25);
}
.qr-btn:hover { background: var(--primary-dark); transform: translateY(-3px); box-shadow: 0 14px 30px rgba(212,163,115,0.3); }
.qr-btn:active { transform: scale(0.97); }
</style>
