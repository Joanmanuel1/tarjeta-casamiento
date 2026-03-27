<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import { getGuests } from '../services/guestService'
import { updateMultipleRSVPs } from '../services/rsvpService'

const searchQuery = ref('')
const allGuests = ref([])
const filteredResults = ref([])
const selectedGuests = ref([])
const isSearching = ref(false)
const isLoading = ref(true)
const submitted = ref(false)
const isSubmmitting = ref(false)

const options = ['Sí, asistiré', 'No podré asistir']

onMounted(async () => {
  try {
    allGuests.value = await getGuests()
  } catch (error) {
    console.error('Error loading guests:', error)
  } finally {
    isLoading.value = false
    // Initial reveal
    gsap.from('.rsvp-header', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' })
  }
})

// Advanced Client-side Search (Partial matching for name/surname)
let searchTimeout = null
watch(searchQuery, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!newVal || newVal.length < 3) {
    filteredResults.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  searchTimeout = setTimeout(() => {
    const term = newVal.toLowerCase().trim()
    
    filteredResults.value = allGuests.value.filter(g => {
      // Don't show already selected or already confirmed
      const isSelected = selectedGuests.value.some(sg => sg.id === g.id)
      const isConfirmed = g.estado === 'confirmado'
      
      if (isSelected || isConfirmed) return false
      
      // Multi-field search
      const fullName = `${g.nombre} ${g.apellido}`.toLowerCase()
      return fullName.includes(term) || g.nombreSearch.includes(term)
    }).slice(0, 8)
    
    isSearching.value = false
    
    // Staggered reveal for results
    nextTick(() => {
      gsap.from('.result-card', { 
        opacity: 0, 
        y: 15, 
        stagger: 0.08, 
        duration: 0.5, 
        ease: 'power2.out',
        clearProps: 'all'
      })
    })
  }, 300)
})

const toggleSelection = (guest) => {
  const index = selectedGuests.value.findIndex(g => g.id === guest.id)
  if (index === -1) {
    selectedGuests.value.push({
      ...guest,
      attendance: 'Sí, asistiré',
      comments: ''
    })
    
    // Visual feedback for selection
    nextTick(() => {
      gsap.from(`.selected-guest-card`, {
        scale: 0.95,
        opacity: 0,
        backgroundColor: 'rgba(212, 163, 115, 0.1)',
        duration: 0.4,
        ease: 'back.out(1.7)'
      })
    })
    
    searchQuery.value = '' // Clear search for next person
  } else {
    selectedGuests.value.splice(index, 1)
  }
}

const removeGuest = (id) => {
  // Animate out before removing
  gsap.to(`.card-${id}`, {
    x: -20,
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      selectedGuests.value = selectedGuests.value.filter(g => g.id !== id)
    }
  })
}

const submitRSVP = async () => {
  if (selectedGuests.value.length === 0) return
  
  isSubmmitting.value = true
  try {
    const payloads = selectedGuests.value.map(g => ({
      id: g.id,
      attendance: g.attendance,
      comments: g.comments
    }))
    
    await updateMultipleRSVPs(payloads)
    
    const anyAttending = selectedGuests.value.some(g => g.attendance === 'Sí, asistiré')
    if (anyAttending) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4a373', '#faedcd', '#ccd5ae']
      })
    }
    
    submitted.value = true
    nextTick(() => {
      gsap.from('.success-view', { 
        scale: 0.9, 
        opacity: 0, 
        duration: 0.7, 
        ease: 'elastic.out(1, 0.75)' 
      })
    })
  } catch (error) {
    console.error('Error submitting RSVP:', error)
    alert('Hubo un error al enviar. Por favor, intenta de nuevo.')
  } finally {
    isSubmmitting.value = false
  }
}

const getInitials = (guest) => {
  const n = guest.nombre ? guest.nombre[0] : ''
  const a = guest.apellido ? guest.apellido[0] : ''
  return (n + a).toUpperCase() || '?'
}
</script>

<template>
  <section class="rsvp-section py-5 px-3">
    <div class="container maxWidth-md">
      
      <!-- 1. Header (Emotional & Clear) -->
      <div class="rsvp-header text-center mb-5">
        <div class="rsvp-badge mb-3">RSVP</div>
        <h2 class="GreatVibes display-4 mb-3">La Fiesta no está completa sin vos</h2>
        <p class="text-muted small mx-auto instruction-text">
          <b>Répondez s'il vous plaît</b> — Responda, por favor.<br>
          Buscate en la lista y confirmá tu presencia (y la de tu familia).
        </p>
      </div>

      <!-- 2. Interactive Flow -->
      <div v-if="!submitted" class="rsvp-flow">
        
        <!-- Search Interface -->
        <div class="search-experience mb-5">
          <div class="search-input-wrapper shadow-premium">
            <i class="pi pi-search search-icon" />
            <InputText v-model="searchQuery" 
              placeholder="Buscá tu nombre o el de tu familia..." 
              class="w-100 premium-input" autofocus />
            <div v-if="isSearching" class="search-shimmer"></div>
          </div>

          <!-- Animated Search Results -->
          <div class="results-container mt-3">
            <transition-group name="stagger">
              <div v-for="guest in filteredResults" :key="guest.id" 
                class="result-card p-3 rounded-4 mb-2 d-flex align-items-center justify-content-between"
                @click="toggleSelection(guest)">
                <div class="d-flex align-items-center">
                  <div class="guest-avatar-mini me-3">{{ getInitials(guest) }}</div>
                  <div>
                    <h6 class="mb-0 fw-bold">{{ guest.nombre }} {{ guest.apellido }}</h6>
                    <span class="text-muted extra-small">Invitado</span>
                  </div>
                </div>
                <div class="add-action text-primary">
                  <i class="pi pi-plus-circle fs-4"></i>
                </div>
              </div>
            </transition-group>

            <div v-if="searchQuery.length >= 3 && filteredResults.length === 0 && !isSearching" 
              class="empty-search text-center py-4 fade-in">
              <i class="pi pi-search-minus opacity-25 display-6 mb-2"></i>
              <p class="text-muted small">No encontramos a nadie con ese nombre.</p>
            </div>
          </div>
        </div>

        <!-- 3. Selection Panel (The "App" Panel) -->
        <transition name="panel-slide">
          <div v-if="selectedGuests.length > 0" class="selection-panel glass-card rounded-5 shadow-2xl p-4 p-md-5">
            <div class="panel-header d-flex justify-content-between align-items-center mb-4">
              <h4 class="mb-0 fw-bold">Tus Invitados</h4>
              <span class="selection-count">{{ selectedGuests.length }}</span>
            </div>

            <div class="selected-guests-list custom-scroll mb-4">
              <div v-for="guest in selectedGuests" :key="guest.id" 
                :class="'selected-guest-card card-' + guest.id"
                class="p-4 rounded-4 mb-4 bg-white border-light shadow-sm">
                
                <div class="d-flex justify-content-between align-items-start mb-4">
                  <div class="d-flex align-items-center">
                    <div class="guest-avatar me-3">{{ getInitials(guest) }}</div>
                    <h5 class="mb-0 fw-bold">{{ guest.nombre }} {{ guest.apellido }}</h5>
                  </div>
                  <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-secondary" 
                    @click="removeGuest(guest.id)" />
                </div>

                <div class="row g-3 align-items-end">
                  <div class="col-md-7">
                    <label class="small fw-bold text-muted mb-2 d-block">¿Vas a venir?</label>
                    <SelectButton v-model="guest.attendance" :options="options" class="premium-selector" />
                  </div>
                  <div class="col-md-5">
                    <label class="small fw-bold text-muted mb-2 d-block">Notas (Menú, etc.)</label>
                    <InputText v-model="guest.comments" placeholder="Ej: Celíaco" 
                      class="w-100 p-2 rounded-pill bg-light border-0 px-3" />
                  </div>
                </div>
              </div>
            </div>

            <Button label="Confirmar Ahora" icon="pi pi-heart-fill" 
              class="w-100 py-3 rounded-pill btn-rsvp-submit shadow-lg" 
              :loading="isSubmmitting" @click="submitRSVP" />
          </div>
        </transition>

        <!-- Empty state helper -->
        <div v-if="selectedGuests.length === 0 && !isSearching && searchQuery.length < 3" 
          class="empty-helper text-center py-5 opacity-25">
          <i class="pi pi-users fs-1 mb-3"></i>
          <p>Buscate a vos y a tu familia para confirmar</p>
        </div>

      </div>

      <!-- 4. Success Experience -->
      <div v-else class="success-view text-center py-5">
        <div class="success-icon-wrapper mb-4">
          <span class="success-emoji">❤️</span>
          <div class="success-glow"></div>
        </div>
        <h2 class="GreatVibes display-4 mb-4 text-dark">¡Gracias Familia!</h2>
        <p class="fs-5 text-muted mb-5 px-md-5">
          Nos hace muy felices saber que nos acompañarán en este día tan especial. <br>
          ¡Nos vemos en la fiesta!
        </p>
        <div class="final-signature">
          <p class="mb-0 text-premium fw-bold tracking-widest">Joan & Stephie</p>
          <div class="signature-line mx-auto mt-2"></div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.rsvp-section {
  background-color: var(--bg-cream);
  min-height: 90vh;
}

.maxWidth-md {
  max-width: 650px;
}

/* Header & Badge */
.rsvp-badge {
  display: inline-block;
  padding: 4px 16px;
  background: var(--secondary-color);
  color: var(--primary-dark);
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 2px;
}

.instruction-text {
  line-height: 1.6;
}

/* Search Bar Premium */
.search-input-wrapper {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: all 0.4s var(--transition-smooth);
}

.search-icon {
  margin-left: 15px;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.premium-input {
  border: none !important;
  box-shadow: none !important;
  font-size: 1.1rem !important;
  font-weight: 500;
  padding-left: 10px !important;
}

.search-input-wrapper:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}

.search-shimmer {
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  animation: searchLoading 1.5s infinite;
}

@keyframes searchLoading {
  0% { transform: scaleX(0); opacity: 0; }
  50% { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(0); opacity: 0; }
}

/* Results Grid */
.result-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-card:hover {
  background: white;
  border-color: var(--primary-color);
  transform: scale(1.02);
}

.result-card:active {
  transform: scale(0.98);
}

.guest-avatar-mini {
  width: 40px;
  height: 40px;
  background: var(--secondary-color);
  color: var(--primary-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
}

/* Selection Panel */
.selection-panel {
  margin-top: 3rem;
  background: white !important;
  border: 1px solid rgba(0,0,0,0.03) !important;
}

.selection-count {
  background: var(--primary-color);
  color: white;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.selected-guest-card {
  border: 1px solid #f0f0f0;
}

.guest-avatar {
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  box-shadow: 0 8px 16px rgba(212, 163, 115, 0.2);
}

.btn-rsvp-submit {
  background: var(--text-dark);
  border: none;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

/* Premium Select Button */
:deep(.premium-selector) {
  display: flex;
  background: #f1f3f5;
  padding: 4px;
  border-radius: 16px;
}

:deep(.premium-selector .p-button) {
  flex: 1;
  background: transparent;
  border: none;
  color: #666;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 10px;
  border-radius: 12px !important;
  transition: all 0.3s var(--transition-smooth);
}

:deep(.premium-selector .p-button.p-highlight) {
  background: white;
  color: var(--text-dark);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* Success View */
.success-icon-wrapper {
  position: relative;
  display: inline-block;
}

.success-emoji {
  font-size: 6rem;
  position: relative;
  z-index: 2;
}

.success-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background: var(--primary-color);
  filter: blur(60px);
  opacity: 0.2;
  border-radius: 50%;
}

.signature-line {
  width: 40px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
}

/* Animations */
.panel-slide-enter-active, .panel-slide-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.panel-slide-enter-from, .panel-slide-leave-to {
  transform: translateY(100px);
  opacity: 0;
}

.stagger-enter-active {
  transition: all 0.4s ease;
}
.stagger-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* Extra Small Text */
.extra-small {
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 700;
}

/* Mobile Tweaks */
@media (max-width: 768px) {
  .rsvp-section {
    padding: 3rem 1rem;
  }
  
  .selection-panel {
    border-radius: 40px 40px 0 0 !important;
    margin: 2rem -1rem -4rem -1rem;
    padding-bottom: 6rem !important;
  }
  
  :deep(.premium-selector) {
    flex-direction: column;
    background: transparent;
    padding: 0;
    gap: 8px;
  }
  
  :deep(.premium-selector .p-button) {
    background: #f8f9fa;
    border: 1px solid #efefef;
  }
}
</style>
