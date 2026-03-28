<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { getGuests } from '../services/guestService'
import { updateMultipleRSVPs } from '../services/rsvpService'

// --- State ---
const currentStep = ref(1) // 1: Main Flow, 3: Success (Step 2 merged into 1)
const searchQuery = ref('')
const allGuests = ref([])
const filteredResults = ref([])
const selectedGuests = ref([]) // Guests being prepared for confirmation
const isSearching = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)
const showResults = ref(false) // Control visibility of results

// --- Scroll Lock Logic ---
watch(selectedGuests, (newVal) => {
  if (newVal.length > 0 && currentStep.value === 1) {
    document.body.style.overflow = 'hidden'
  } else if (currentStep.value !== 3) {
    document.body.style.overflow = ''
  }
}, { deep: true })

// --- Search Logic ---
let searchTimeout = null
watch(searchQuery, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (!newVal || newVal.trim().length < 1) {
    filteredResults.value = []
    isSearching.value = false
    showResults.value = false
    return
  }

  isSearching.value = true
  showResults.value = true
  searchTimeout = setTimeout(() => {
    const term = newVal.toLowerCase().trim()

    filteredResults.value = allGuests.value.filter(g => {
      const fullName = `${g.nombre} ${g.apellido}`.toLowerCase()
      const matches = fullName.includes(term) ||
        g.nombre.toLowerCase().includes(term) ||
        g.apellido.toLowerCase().includes(term)

      const isAlreadyInSelection = selectedGuests.value.some(sg => sg.id === g.id)
      return matches && !isAlreadyInSelection
    }).slice(0, 15)

    isSearching.value = false

    nextTick(() => {
      gsap.from('.result-card-accessible', {
        opacity: 0,
        y: 10,
        stagger: 0.05,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  }, 200)
})

// --- Actions ---
onMounted(async () => {
  try {
    allGuests.value = await getGuests()
  } catch (error) {
    console.error('Error loading guests:', error)
  } finally {
    isLoading.value = false
  }
})

const toggleGuestSelection = (guest) => {
  const index = selectedGuests.value.findIndex(g => g.id === guest.id)
  if (index === -1) {
    selectedGuests.value.push({
      ...guest,
      attendance: guest.asistencia === 'No podré asistir' ? 'No podré asistir' : 'Sí, asistiré',
      comments: guest.comentario || '',
      isEditing: guest.estado === 'confirmado'
    })
    showResults.value = false // Hide dropdown but keep query string
  } else {
    selectedGuests.value.splice(index, 1)
  }
}

const submitAll = async () => {
  isSubmitting.value = true
  try {
    const payloads = selectedGuests.value.map(g => ({
      id: g.id,
      attendance: g.attendance,
      comments: g.comments
    }))

    await updateMultipleRSVPs(payloads)

    // Refresh local guest list to update "YA CONFIRMADO" status
    allGuests.value = await getGuests()

    const anyAttending = selectedGuests.value.some(g => g.attendance === 'Sí, asistiré')
    if (anyAttending) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4a373', '#faedcd', '#ccd5ae']
      })
    }

    document.body.style.overflow = ''
    currentStep.value = 3
  } catch (error) {
    alert('Hubo un error. Por favor intentá de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}

const resetAll = () => {
  currentStep.value = 1
  selectedGuests.value = []
  searchQuery.value = ''
  document.body.style.overflow = ''
}

const getInitials = (g) => (g.nombre[0] + g.apellido[0]).toUpperCase()
</script>

<template>
  <section id="rsvp-section" class="rsvp-fluid-section py-5 px-3"
    :class="{ 'focus-mode': selectedGuests.length > 0 && currentStep === 1 }">
    <div class="container-fluid max-width-600">

      <!-- SUCCESS VIEW -->
      <div v-if="currentStep === 3" class="success-view text-center py-5 animate-fade-in">
        <div class="success-illustration mb-4">
          <span class="display-1">✨🎉❤️</span>
        </div>
        <h2 class="GreatVibes display-3 mb-4">¡Gracias Familia!</h2>
        <p class="lead text-muted mb-5">
          Nos hace muy felices saber que nos acompañarán. <br>
          ¡Prepárense para bailar!
        </p>
        <div class="family-signature mb-5">
          <p class="mb-1 text-premium fw-bold tracking-widest">Joan & Stephie</p>
          <div class="signature-line mx-auto"></div>
        </div>
        <button @click="resetAll" class="btn btn-outline-secondary rounded-pill px-4 py-2 border-0 opacity-50">
          <i class="pi pi-refresh me-2"></i> Confirmar a alguien más
        </button>
      </div>

      <!-- MAIN FLOW: SEARCH & CONFIRM -->
      <div v-else class="fluid-wizard">
        <div class="text-center mb-4">
          <h2 class="GreatVibes display-4 mb-2">¿Quién nos acompaña?</h2>
          <p class="text-muted small">Buscá tu nombre y confirmá tu asistencia</p>
        </div>

        <!-- Search Area -->
        <div class="search-experience-fixed mb-4">
          <div class="search-pill-premium d-flex align-items-center p-2 rounded-pill shadow-sm border bg-white">
            <i class="pi pi-search ms-3 me-2 text-primary opacity-50"></i>
            <InputText v-model="searchQuery" placeholder="Escribí tu nombre o apellido"
              class="flex-grow-1 premium-input-field py-2" autofocus @focus="showResults = true" />
            <Button v-if="searchQuery" icon="pi pi-times" class="p-button-text p-button-rounded p-button-sm me-2"
              @click="searchQuery = ''; showResults = false" />
          </div>

          <!-- Dynamic Results Overlay -->
          <div v-if="searchQuery && showResults"
            class="results-overlay mt-2 rounded-4 shadow-xl border bg-white custom-scroll">
            <div v-for="guest in filteredResults" :key="guest.id"
              class="result-card-accessible p-3 border-bottom d-flex align-items-center"
              @click="toggleGuestSelection(guest)">
              <div class="guest-avatar-large me-3">{{ getInitials(guest) }}</div>
              <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold">{{ guest.nombre }} {{ guest.apellido }}</h6>
                <span v-if="guest.estado === 'confirmado'" class="text-success extra-small fw-bold">YA CONFIRMADO
                  ✅</span>
              </div>
              <i class="pi pi-plus-circle fs-5 text-primary opacity-25"></i>
            </div>
            <div v-if="!isSearching && filteredResults.length === 0" class="p-4 text-center text-muted small">
              No encontramos a nadie con ese nombre 😔
            </div>
          </div>
        </div>

        <!-- Confirmation List (Appears as you select) -->
        <div class="confirmation-area" v-if="selectedGuests.length > 0">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-uppercase tracking-widest text-muted small mb-0">Tus Invitados</h6>
            <span class="badge rounded-pill bg-primary px-3">{{ selectedGuests.length }}</span>
          </div>

          <div class="selected-list custom-scroll">
            <div v-for="guest in selectedGuests" :key="guest.id"
              class="confirm-card-compact p-3 rounded-4 mb-3 bg-white shadow-sm border animate-drop-in">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center">
                  <div class="guest-avatar-small me-3">{{ getInitials(guest) }}</div>
                  <div>
                    <h6 class="mb-0 fw-bold">{{ guest.nombre }} {{ guest.apellido }}</h6>
                    <p v-if="guest.isEditing" class="extra-small text-primary fw-bold mb-0">ACTUALIZANDO</p>
                  </div>
                </div>
                <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm"
                  @click="toggleGuestSelection(guest)" />
              </div>

              <div class="d-flex gap-2">
                <button @click="guest.attendance = 'Sí, asistiré'"
                  class="attendance-btn-compact yes flex-grow-1 p-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                  :class="{ active: guest.attendance === 'Sí, asistiré' }">
                  <span class="small">Sí, voy ❤️</span>
                </button>
                <button @click="guest.attendance = 'No podré asistir'"
                  class="attendance-btn-compact no flex-grow-1 p-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                  :class="{ active: guest.attendance === 'No podré asistir' }">
                  <span class="small">No puedo 😢</span>
                </button>
              </div>

              <div v-if="guest.attendance === 'Sí, asistiré'" class="mt-3">
                <InputText v-model="guest.comments" placeholder="¿Dieta especial? (Celíaco, etc.)"
                  class="w-100 p-2 rounded-pill bg-light border-0 small px-3" style="color: black;" />
              </div>
            </div>
          </div>

          <!-- Sticky Submit Button (Hidden when searching on mobile) -->
          <div v-if="!showResults" class="submit-wrap fixed-bottom p-4 bg-white border-top shadow-lg-up d-flex gap-3">
            <Button label="Cancelar" severity="secondary" class="w-50 py-3 rounded-pill border-0 o-75"
              @click="resetAll" />
            <Button :label="isSubmitting ? 'Enviando...' : 'Confirmar ❤️'" severity="success"
              class="w-50 py-3 rounded-pill mb-0" :loading="isSubmitting" @click="submitAll" />
          </div>
        </div>

        <!-- Help state -->
        <div v-else-if="!searchQuery" class="empty-state-helper text-center py-5 opacity-25">
          <i class="pi pi-search fs-1 mb-3"></i>
          <p>Escribí tu nombre arriba <br> para empezar</p>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.rsvp-fluid-section {
  background-color: #fdfbf7;
  min-height: 100dvh;
  transition: all 0.5s ease;
}

.max-width-600 {
  max-width: 600px;
  position: relative;
  z-index: 10;
}

/* Focus Mode: Lock the experience */
.rsvp-fluid-section.focus-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  z-index: 9999;
  background-color: rgba(253, 251, 247, 0.98);
  padding-top: 5vh;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Search UI */
.search-experience-fixed {
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-pill-premium {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-pill-premium:focus-within {
  transform: translateY(-2px);
  border-color: var(--primary-color);
  box-shadow: 0 10px 25px rgba(212, 163, 115, 0.15) !important;
}

.premium-input-field {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  font-size: 1.1rem !important;
  color: var(--text-dark) !important;
}

.results-overlay {
  max-height: 250px;
  overflow-y: auto;
  z-index: 100;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
}

/* Dim confirmation area when searching */
.search-experience-fixed:focus-within+.confirmation-area {
  opacity: 0.3;
  pointer-events: none;
  filter: blur(2px);
  transition: all 0.3s ease;
}

/* Selected List */
.selected-list {
  max-height: calc(100vh - 420px);
  overflow-y: auto;
}

/* Avatar Styles */
.guest-avatar-large {
  width: 45px;
  height: 45px;
  background: var(--secondary-color);
  color: var(--primary-dark);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
}

.guest-avatar-small {
  width: 30px;
  height: 30px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
}

/* Compact Confirm Cards (Ultra-Compact) */
.confirm-card-compact {
  padding: 1rem !important;
  margin-bottom: 0.75rem !important;
  transition: all 0.3s ease;
}

.confirm-card-compact h6 {
  font-size: 0.95rem;
  margin-bottom: 0;
}

.attendance-btn-compact {
  background: white;
  border: 1px solid #efefef;
  color: var(--text-muted);
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.attendance-btn-compact.active {
  transform: scale(1.02);
}

.attendance-btn-compact.yes.active {
  background: #faedcd;
  color: #8c714d;
  border-color: #d4a373;
}

.attendance-btn-compact.no.active {
  background: #f8f9fa;
  color: #adb5bd;
  border-color: #dee2e6;
}

/* Animations */
.animate-drop-in {
  animation: dropIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes dropIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Footer & Button */
.submit-wrap {
  z-index: 1000;
  border-radius: 30px 30px 0 0;
}

.shadow-lg-up {
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05);
}

.btn-primary-premium {
  background: var(--text-dark);
  border: none;
  font-weight: 800;
  font-size: 1.1rem;
}

/* Utils */
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #d4a373;
  border-radius: 10px;
}

.tracking-widest {
  letter-spacing: 0.2em;
}

.text-premium {
  color: var(--primary-color);
}

.signature-line {
  width: 40px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
}

.extra-small {
  font-size: 0.7rem;
}

/* Mobile Tweaks */
@media (max-width: 768px) {
  .display-4 {
    font-size: 2.5rem;
  }
}
</style>
