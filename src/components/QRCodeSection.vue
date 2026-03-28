<script setup>
const albumUrl = 'https://photos.app.goo.gl/kFHSb1q1aX59tm3D7'
const openAlbum = () => window.open(albumUrl, '_blank')
</script>

<template>
  <div class="qr-container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="qr-card-premium p-4 p-md-5 rounded-5 bg-white shadow-sm border-light text-center">
          <div class="qr-visual-area mx-auto mb-4 bg-light p-4 rounded-5 position-relative">
            <!-- Representing a premium QR look -->
            <div class="qr-inner bg-white p-3 rounded-4 shadow-sm border-light mx-auto" style="max-width: 800px;">
              <img src="../assets/qrboda.jpeg" alt="QR Code" class="w-100">
            </div>
            <div class="qr-tag shadow-lg">SCAN ME</div>
          </div>

          <h4 class="fw-bold mb-3">Compartí tus fotos</h4>
          <p class="text-muted small mb-4 mx-auto" style="max-width: 800px;">
            Queremos revivir cada momento de la fiesta. Escaneá el código o usá el botón para subir tus fotos al
            álbum compartido.
          </p>

          <button @click="openAlbum"
            class="btn btn-premium-qr rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2">
            <i class="pi pi-images"></i>
            Sumar mis fotos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-card-premium {
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.qr-visual-area {
  max-width: 320px;
}

.qr-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--text-dark);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 1px;
}

.btn-premium-qr {
  background: var(--primary-color);
  color: white;
  border: none;
  transition: all 0.4s var(--transition-bounce);
  box-shadow: 0 10px 20px rgba(212, 163, 115, 0.2);
}

.btn-premium-qr:hover {
  transform: translateY(-5px);
  background: var(--primary-dark);
  box-shadow: 0 15px 30px rgba(212, 163, 115, 0.3);
}

@media (max-width: 767px) {
  .qr-visual-area {
    padding: 1.5rem !important;
  }

  .qr-inner i {
    font-size: 6rem !important;
  }
}
</style>
