<script setup>
import { ref, reactive } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import confetti from 'canvas-confetti'

const loading = ref(false)
const submitted = ref(false)

const form = reactive({
  song: '',
  artist: ''
})

const errors = reactive({
  song: ''
})

const validate = () => {
  let isValid = true
  if (!form.song.trim()) {
    errors.song = 'Por favor, decinos qué canción querés escuchar'
    isValid = false
  } else {
    errors.song = ''
  }
  return isValid
}

const submitSong = () => {
  if (!validate()) return

  loading.value = true

  setTimeout(() => {
    console.log('Song Suggested:', { ...form })
    loading.value = false
    submitted.value = true

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#d4a373', '#faedcd', '#ccd5ae']
    })

    setTimeout(() => {
      submitted.value = false
      form.song = ''
      form.artist = ''
    }, 5000)
  }, 1000)
}
</script>

<template>
  <section class="music-section">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="row g-0">
              <div
                class="col-md-5 d-none d-md-flex music-sidebar align-items-center justify-content-center p-5 text-white text-center">
                <div>
                  <i class="pi pi-music mb-4 music-icon"></i>
                  <h2 class="GreatVibes fs-1 mb-3">¿Qué canción no puede faltar?</h2>
                  <p class="opacity-75">Ayudanos a armar la playlist perfecta para la fiesta.</p>
                </div>
              </div>

              <div class="col-md-7">
                <div class="card-body p-4 p-md-5">
                  <div class="d-md-none text-center mb-4">
                    <i class="pi pi-music fs-2 text-premium mb-2"></i>
                    <h2 class="GreatVibes fs-2">¿Qué canción no puede faltar?</h2>
                  </div>

                  <template v-if="!submitted">
                    <form @submit.prevent="submitSong">
                      <div class="mb-4">
                        <label class="form-label fw-bold small">Canción</label>
                        <InputText v-model="form.song" placeholder="Ej: Dancing Queen" class="w-100"
                          :class="{ 'p-invalid': errors.song }" />
                        <small class="text-danger" v-if="errors.song">{{ errors.song }}</small>
                      </div>

                      <div class="mb-4">
                        <label class="form-label fw-bold small">Artista / Banda</label>
                        <InputText v-model="form.artist" placeholder="Ej: ABBA" class="w-100" />
                      </div>

                      <div class="text-center mt-4">
                        <Button type="submit" label="Sugerir Canción" icon="pi pi-plus"
                          class="p-button-rounded submit-btn px-5" :loading="loading" />
                      </div>
                    </form>
                  </template>

                  <template v-else>
                    <div class="text-center py-4">
                      <div class="success-icon mb-4 mx-auto d-flex align-items-center justify-content-center">
                        <i class="pi pi-check fs-2"></i>
                      </div>
                      <h3 class="GreatVibes fs-2 mb-2">¡Sugerencia enviada!</h3>
                      <p class="text-muted small">¡La vamos a tener en cuenta para la fiesta!</p>
                      <p class="text-premium small mt-3 fw-bold">¿Tenés otra canción en mente?</p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.music-section {
  background: white;
}

.music-sidebar {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
}

.music-icon {
  font-size: 3.5rem !important;
  display: block;
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e8f5e9;
  color: #28a745;
}

:deep(.submit-btn) {
  background: var(--primary-color);
  border-color: var(--primary-color);
  min-height: 48px;
  transition: all 0.3s ease;
}

:deep(.submit-btn:active) {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: scale(0.97);
}

@media (min-width: 768px) {
  :deep(.submit-btn:hover) {
    background: var(--primary-dark);
    border-color: var(--primary-dark);
  }
}
</style>
