<script setup>
import { ref, reactive } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
import confetti from 'canvas-confetti'

const options = ref(['Sí, asistiré', 'No podré ir'])
const loading = ref(false)
const submitted = ref(false)

const form = reactive({
  name: '',
  guests: 1,
  attendance: 'Sí, asistiré',
  comments: ''
})

const errors = reactive({
  name: ''
})

const validate = () => {
  let isValid = true
  if (!form.name.trim()) {
    errors.name = 'Por favor, ingresá tu nombre'
    isValid = false
  } else {
    errors.name = ''
  }
  return isValid
}

const submitRSVP = () => {
  if (!validate()) return

  loading.value = true

  setTimeout(() => {
    console.log('RSVP Submitted:', { ...form })
    loading.value = false
    submitted.value = true

    if (form.attendance === 'Sí, asistiré') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4a373', '#faedcd', '#ccd5ae']
      })
    }
  }, 1500)
}
</script>

<template>
  <section class="rsvp-section">
    <div class="container-fluid py-lg-5">
      <div class="row justify-content-center">
        <div class="col-lg-7 col-xl-6">
          <div class="card rsvp-card glass-card border-0 shadow-lg rounded-5 overflow-hidden">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-5">
                <span class="section-tag">RSVP</span>
                <h2 class="GreatVibes display-4 mb-3">Confirmá tu asistencia</h2>
                <p class="text-muted small px-md-5">
                  Por favor, confirmá antes del 15 de octubre de 2027 para ayudarnos con la organización.
                </p>
              </div>

              <template v-if="!submitted">
                <form @submit.prevent="submitRSVP" class="rsvp-form">
                  <div class="row g-4">
                    <div class="col-12">
                      <div>
                        <label class="form-label small fw-bold text-muted text-uppercase"
                          style="letter-spacing: 0.1em;">Nombre Completo</label>
                        <InputText v-model="form.name" placeholder="Ej: Juan Pérez" class="w-100 p-3 rounded-3"
                          :class="{ 'p-invalid': errors.name }" />
                        <transition name="fade">
                          <small class="text-danger mt-1 d-block" v-if="errors.name">{{ errors.name }}</small>
                        </transition>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted text-uppercase"
                        style="letter-spacing: 0.1em;">Invitados adicionales</label>
                      <InputNumber v-model="form.guests" :min="0" :max="10" showButtons
                        class="w-100 custom-number-input" />
                      <small class="text-muted opacity-75" style="font-size: 0.75rem;">Sin contarte a vos</small>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label small fw-bold text-muted text-uppercase d-block mb-2"
                        style="letter-spacing: 0.1em;">¿Asistirás?</label>
                      <SelectButton v-model="form.attendance" :options="options" class="w-100 d-flex" />
                    </div>

                    <div class="col-12">
                      <label class="form-label small fw-bold text-muted text-uppercase"
                        style="letter-spacing: 0.1em;">Mensaje o Restricción alimentaria</label>
                      <Textarea v-model="form.comments" rows="3" class="w-100 p-3 rounded-3"
                        placeholder="Ej: Vegano, celíaco, o un saludo para nosotros..." />
                    </div>

                    <div class="col-12 text-center mt-4">
                      <Button type="submit" label="Enviar Confirmación" icon="pi pi-heart-fill"
                        class="btn-premium-rsvp w-100 py-3 rounded-pill shadow-sm" :loading="loading" />
                    </div>
                  </div>
                </form>
              </template>

              <template v-else>
                <div class="text-center py-5">
                  <div class="success-icon mb-4 mx-auto d-flex align-items-center justify-content-center">
                    <i class="pi pi-check-circle fs-1 pulse-animation"></i>
                  </div>
                  <h3 class="GreatVibes display-5 mb-3">¡Te esperamos!</h3>
                  <p class="text-muted mb-4 px-md-4">Tu confirmación ha sido enviada con éxito. ¡Estamos muy felices de
                    que seas parte!</p>
                  <Button label="Modificar respuesta" variant="text" icon="pi pi-refresh"
                    class="p-button-text text-muted" @click="submitted = false" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rsvp-section {
  background: white;
  position: relative;
}

.rsvp-card {
  transition: transform 0.4s ease;
}

.btn-premium-rsvp {
  background: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  font-size: 1rem;
  min-height: 56px;
}

.btn-premium-rsvp:active {
  transform: scale(0.97);
  background: var(--primary-dark) !important;
}

@media (min-width: 768px) {
  .btn-premium-rsvp:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(212, 163, 115, 0.4) !important;
  }
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #f0fdf4;
  border-radius: 50%;
  color: #16a34a;
}

@media (min-width: 768px) {
  .success-icon {
    width: 100px;
    height: 100px;
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

:deep(.p-selectbutton .p-button) {
  flex: 1;
  background: white;
  border: 1px solid #ddd;
  color: #666;
  min-height: 48px;
  /* Touch target size */
}

:deep(.p-selectbutton .p-button.p-highlight) {
  background: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

:deep(.p-inputtext),
:deep(.p-textarea) {
  min-height: 48px;
}

:deep(.p-inputtext:focus),
:deep(.p-textarea:focus) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(212, 163, 115, 0.2) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
