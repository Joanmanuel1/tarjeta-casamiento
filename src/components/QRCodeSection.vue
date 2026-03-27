<script setup>
const albumUrl = 'https://photos.app.goo.gl/example'

const openAlbum = () => {
  window.open(albumUrl, '_blank')
}
</script>

<template>
  <div class="qr-card glass-card p-4 p-md-5 rounded-5 border-0 text-center h-100 d-flex align-items-center">
    <div class="w-100">
      <div class="mb-4">
        <p class="text-muted small px-md-4 mb-4">
          Escaneá el código QR o hacé click en el botón para subir las fotos que saques durante la fiesta. ¡Queremos verlas todas!
        </p>
      </div>

      <div class="qr-wrapper mx-auto mb-4 bg-white p-3 rounded-4 shadow-sm border">
        <!-- QR placeholder — replace with actual QR image when available -->
        <div class="qr-placeholder d-flex flex-column align-items-center justify-content-center rounded-3">
          <i class="pi pi-qrcode" style="font-size: 5rem; color: var(--primary-color); opacity: 0.6;"></i>
          <small class="text-muted mt-2">Escanear QR</small>
        </div>
      </div>

      <div class="d-grid gap-3 d-sm-flex justify-content-center mt-4">
        <button @click="openAlbum" class="btn btn-premium rounded-pill px-5 py-3 d-flex align-items-center justify-content-center gap-2">
          <i class="pi pi-external-link"></i>
          <span>Abrir álbum</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-card {
  position: relative;
  overflow: hidden;
}

.qr-wrapper {
  max-width: 180px;
  transition: all 0.3s ease;
}

.qr-wrapper:active {
  transform: scale(0.97);
}

@media (min-width: 576px) {
  .qr-wrapper {
    max-width: 220px;
    transition: transform 0.4s var(--transition-bounce);
  }

  .qr-wrapper:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 35px rgba(0,0,0,0.08) !important;
  }
}

.qr-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: #fafafa;
}
</style>
