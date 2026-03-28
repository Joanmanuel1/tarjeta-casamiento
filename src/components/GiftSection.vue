<script setup>
import { ref } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const accounts = [
  {
    label: 'Cuenta en Pesos',
    alias: 'BODA.JOAN.Y.STEPHIE',
    cbu: '0000003100012345678901',
    icon: 'pi pi-money-bill'
  },
  {
    label: 'Cuenta en Dólares',
    alias: 'JOAN.STEPHIE.USD',
    cbu: '0000003100098765432109',
    icon: 'pi pi-dollar'
  }
]

const copyToClipboard = (text, label) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.add({
      severity: 'contrast',
      summary: '¡Copiado!',
      detail: `${label} copiado con éxito`,
      life: 2000
    })
  })
}
</script>

<template>
  <div class="gifts-container py-4">
    <Toast />

    <div class="row g-4 justify-content-center">
      <div v-for="(acc, index) in accounts" :key="index" class="col-lg-10">
        <div class="gift-card-premium p-4 p-md-5 rounded-5 shadow-sm bg-white border-light text-center">
          <div class="d-flex align-items-center justify-content-center gap-3 mb-4">
            <div class="icon-circle-sm bg-soft text-primary">
              <i :class="acc.icon"></i>
            </div>
            <h4 class="fw-bold mb-0">{{ acc.label }}</h4>
          </div>

          <p class="text-muted small mb-5 mx-auto" style="max-width: 800px;">
            Si deseás colaborar con nuestra luna de miel, podés hacerlo a través de transferencia:
          </p>

          <div class="row g-3">
            <div class="col-md-6">
              <div class="detail-box p-3 rounded-4 bg-light d-flex align-items-center justify-content-between">
                <div class="text-start">
                  <span class="label-tiny">ALIAS</span>
                  <div class="fw-bold font-mono">{{ acc.alias }}</div>
                </div>
                <button @click="copyToClipboard(acc.alias, 'Alias')" class="copy-btn-minimal">
                  <i class="pi pi-copy"></i>
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <div class="detail-box p-3 rounded-4 bg-light d-flex align-items-center justify-content-between">
                <div class="text-start overflow-hidden">
                  <span class="label-tiny">CBU</span>
                  <div class="fw-bold font-mono text-truncate">{{ acc.cbu }}</div>
                </div>
                <button @click="copyToClipboard(acc.cbu, 'CBU')" class="copy-btn-minimal">
                  <i class="pi pi-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gift-card-premium {
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: transform 0.4s var(--transition-bounce);
}

.icon-circle-sm {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.label-tiny {
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: 800;
  color: #aaa;
  display: block;
}

.font-mono {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.9rem;
}

.detail-box {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.copy-btn-minimal {
  background: white;
  border: 1px solid #eee;
  padding: 8px 12px;
  border-radius: 12px;
  color: var(--primary-color);
  transition: all 0.3s var(--transition-bounce);
}

.copy-btn-minimal:active {
  transform: scale(0.9);
  background: var(--primary-color);
  color: white;
}

@media (min-width: 768px) {
  .gift-card-premium:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  }

  .copy-btn-minimal:hover {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 4px 10px rgba(212, 163, 115, 0.2);
  }
}
</style>
