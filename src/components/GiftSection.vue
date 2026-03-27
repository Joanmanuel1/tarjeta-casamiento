<script setup>
import { ref } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const alias = ref('BODA.JOAN.Y.STEPHIE')
const cbu = ref('0000003100012345678901')

const copiedAlias = ref(false)
const copiedCbu = ref(false)

const copyToClipboard = (text, type) => {
  navigator.clipboard.writeText(text).then(() => {
    if (type === 'alias') {
      copiedAlias.value = true
      setTimeout(() => copiedAlias.value = false, 2500)
    } else {
      copiedCbu.value = true
      setTimeout(() => copiedCbu.value = false, 2500)
    }

    toast.add({
      severity: 'success',
      summary: '¡Copiado!',
      detail: 'Copiado al portapapeles',
      life: 2000
    })
  })
}
</script>

<template>
  <div class="gift-card glass-card p-4 p-md-5 rounded-5 text-center position-relative overflow-hidden h-100">
    <Toast />

    <!-- Decorative background element -->
    <div class="decor-circle"></div>

    <div class="content-wrapper position-relative" style="z-index: 2;">
      <div class="icon-box mb-4 mx-auto shadow-sm" style="background: white;">
        <i class="pi pi-gift fs-1"></i>
      </div>

      <p class="mb-5 text-muted fs-6 px-lg-4">
        Tu presencia es nuestro mayor regalo, pero si deseás colaborar con nuestra luna de miel, te dejamos nuestros
        datos.
      </p>

      <div class="bank-details-wrapper d-grid gap-4">
        <!-- Alias Card -->
        <div class="detail-item p-3 rounded-4 border border-light bg-white bg-opacity-50">
          <label class="text-uppercase small fw-bold text-muted d-block mb-3"
            style="letter-spacing: 0.15em; font-size: 0.7rem;">Alias de la cuenta en dolares</label>
          <div class="d-flex align-items-center justify-content-between bg-white p-3 rounded-pill shadow-sm border">
            <span class="fs-6 fw-bold text-dark font-mono ms-2">{{ alias }}</span>
            <button @click="copyToClipboard(alias, 'alias')"
              class="btn btn-copy rounded-pill d-flex align-items-center gap-2 px-3"
              :class="{ 'btn-success-soft': copiedAlias }">
              <i :class="copiedAlias ? 'pi pi-check' : 'pi pi-copy'"></i>
              <span class="small fw-bold">{{ copiedAlias ? '¡Copiado!' : 'Copiar' }}</span>
            </button>
          </div>
        </div>

        <!-- CBU Card -->
        <div class="detail-item p-3 rounded-4 border border-light bg-white bg-opacity-50">
          <label class="text-uppercase small fw-bold text-muted d-block mb-3"
            style="letter-spacing: 0.15em; font-size: 0.7rem;">CBU de la cuenta en dolares</label>
          <div class="d-flex align-items-center justify-content-between bg-white p-3 rounded-pill shadow-sm border">
            <span class="fs-6 fw-bold text-dark font-mono ms-2 overflow-hidden text-truncate">{{ cbu }}</span>
            <button @click="copyToClipboard(cbu, 'cbu')"
              class="btn btn-copy rounded-pill d-flex align-items-center gap-2 px-3"
              :class="{ 'btn-success-soft': copiedCbu }">
              <i :class="copiedCbu ? 'pi pi-check' : 'pi pi-copy'"></i>
              <span class="small fw-bold">{{ copiedCbu ? '¡Copiado!' : 'Copiar' }}</span>
            </button>
          </div>
        </div>

      </div>
      <div class="bank-details-wrapper d-grid gap-4">
        <!-- Alias Card -->
        <div class="detail-item p-3 rounded-4 border border-light bg-white bg-opacity-50">
          <label class="text-uppercase small fw-bold text-muted d-block mb-3"
            style="letter-spacing: 0.15em; font-size: 0.7rem;">Alias de la cuenta en pesos</label>
          <div class="d-flex align-items-center justify-content-between bg-white p-3 rounded-pill shadow-sm border">
            <span class="fs-6 fw-bold text-dark font-mono ms-2">{{ alias }}</span>
            <button @click="copyToClipboard(alias, 'alias')"
              class="btn btn-copy rounded-pill d-flex align-items-center gap-2 px-3"
              :class="{ 'btn-success-soft': copiedAlias }">
              <i :class="copiedAlias ? 'pi pi-check' : 'pi pi-copy'"></i>
              <span class="small fw-bold">{{ copiedAlias ? '¡Copiado!' : 'Copiar' }}</span>
            </button>
          </div>
        </div>

        <!-- CBU Card -->
        <div class="detail-item p-3 rounded-4 border border-light bg-white bg-opacity-50">
          <label class="text-uppercase small fw-bold text-muted d-block mb-3"
            style="letter-spacing: 0.15em; font-size: 0.7rem;">CBU de la cuenta en pesos</label>
          <div class="d-flex align-items-center justify-content-between bg-white p-3 rounded-pill shadow-sm border">
            <span class="fs-6 fw-bold text-dark font-mono ms-2 overflow-hidden text-truncate">{{ cbu }}</span>
            <button @click="copyToClipboard(cbu, 'cbu')"
              class="btn btn-copy rounded-pill d-flex align-items-center gap-2 px-3"
              :class="{ 'btn-success-soft': copiedCbu }">
              <i :class="copiedCbu ? 'pi pi-check' : 'pi pi-copy'"></i>
              <span class="small fw-bold">{{ copiedCbu ? '¡Copiado!' : 'Copiar' }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.gift-card {
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-item {
  transition: all 0.3s ease;
  cursor: pointer;
}

.detail-item:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.8) !important;
}

@media (min-width: 768px) {
  .detail-item:hover {
    background: white !important;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  }

  .btn-copy:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

.btn-copy {
  background: #f8f9fa;
  color: var(--text-dark);
  border: 1px solid #eee;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-height: 44px;
  /* Touch target base size */
}

.btn-copy:active {
  background: var(--primary-color);
  color: white;
}

.btn-success-soft {
  background: #e8f5e9 !important;
  color: #2e7d32 !important;
  border-color: #c8e6c9 !important;
}

.decor-circle {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: var(--secondary-color);
  border-radius: 50%;
  opacity: 0.3;
  z-index: 1;
}

/* Mobile-first typo */
.font-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.75rem;
}

@media (min-width: 576px) {
  .font-mono {
    font-size: 0.85rem;
  }
}
</style>
