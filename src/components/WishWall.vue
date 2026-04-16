<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { addWish, subscribeToWishes } from '../services/wishService'

// ── Estado formulario ────────────────────────────────────────────────
const nombre   = ref('')
const mensaje  = ref('')
const sending  = ref(false)
const sent     = ref(false)
const error    = ref('')

// ── Deseos del muro ─────────────────────────────────────────────────
const wishes   = ref([])
let   unsubscribe = null

const MAX_CHARS = 220

// ── Formulario ───────────────────────────────────────────────────────
async function submitWish() {
  error.value = ''
  if (!nombre.value.trim() || !mensaje.value.trim()) {
    error.value = 'Completá tu nombre y mensaje.'
    return
  }
  if (mensaje.value.trim().length > MAX_CHARS) {
    error.value = `El mensaje no puede superar ${MAX_CHARS} caracteres.`
    return
  }

  sending.value = true
  try {
    await addWish({ nombre: nombre.value, mensaje: mensaje.value })
    sent.value = true
    nombre.value = ''
    mensaje.value = ''
  } catch {
    error.value = 'Algo salió mal. Intentá de nuevo.'
  } finally {
    sending.value = false
  }
}

// ── Realtime listener ────────────────────────────────────────────────
onMounted(() => {
  unsubscribe = subscribeToWishes(async (newWishes) => {
    const prev = wishes.value.length
    wishes.value = newWishes

    if (prev < newWishes.length) {
      await nextTick()
      const cards = document.querySelectorAll('.wish-card:not(.wish-card--animated)')
      if (cards.length) {
        cards.forEach(c => c.classList.add('wish-card--animated'))
        gsap.from(cards, {
          opacity: 0,
          y: 24,
          scale: 0.95,
          stagger: 0.07,
          duration: 0.5,
          ease: 'power3.out'
        })
      }
    }
  })
})

onUnmounted(() => { if (unsubscribe) unsubscribe() })

// ── Utilidad ─────────────────────────────────────────────────────────
function formatDate(ts) {
  if (!ts?.toDate) return ''
  return ts.toDate().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <section class="wish-section py-5">
    <div class="container px-4">

      <!-- Encabezado -->
      <div class="text-center mb-5 section-reveal">
        <span class="section-tag">Para los novios</span>
        <h2 class="GreatVibes display-4">Muro de Deseos</h2>
        <p class="text-muted small mx-auto" style="max-width:480px">
          Dejales un mensaje a Joan & Stephie que guardarán para siempre.
        </p>
      </div>

      <!-- Formulario -->
      <div class="wish-form-wrap mx-auto mb-5">
        <div v-if="!sent" class="wish-form glass-card p-4 rounded-4">
          <div class="mb-3">
            <input
              v-model="nombre"
              type="text"
              class="wish-input rounded-pill px-4 py-2 w-100"
              placeholder="Tu nombre"
              maxlength="60"
              :disabled="sending"
            />
          </div>
          <div class="mb-3 position-relative">
            <textarea
              v-model="mensaje"
              class="wish-textarea rounded-4 px-4 py-3 w-100"
              placeholder="Escribí tus deseos para los novios…"
              rows="3"
              :maxlength="MAX_CHARS"
              :disabled="sending"
            ></textarea>
            <span class="char-count" :class="{ 'char-count--warn': mensaje.length > MAX_CHARS - 30 }">
              {{ mensaje.length }}/{{ MAX_CHARS }}
            </span>
          </div>
          <p v-if="error" class="text-danger small mb-2">{{ error }}</p>
          <button
            class="btn btn-premium w-100 rounded-pill py-2 fw-bold"
            :disabled="sending"
            @click="submitWish"
          >
            <i class="pi pi-send me-2"></i>
            {{ sending ? 'Enviando…' : 'Enviar mi deseo 💌' }}
          </button>
        </div>

        <!-- Estado enviado -->
        <div v-else class="wish-sent text-center glass-card p-4 rounded-4 animate-fade-in">
          <p class="display-4 mb-2">💌</p>
          <p class="fw-bold mb-1">¡Gracias! Tu mensaje fue enviado.</p>
          <p class="text-muted small mb-3">Joan & Stephie lo van a leer con mucho amor.</p>
          <button class="btn btn-outline-secondary btn-sm rounded-pill px-4" @click="sent = false">
            Enviar otro mensaje
          </button>
        </div>
      </div>

      <!-- Muro de deseos: masonry CSS columns -->
      <div v-if="wishes.length" class="wish-wall">
        <div
          v-for="wish in wishes"
          :key="wish.id"
          class="wish-card wish-card--animated"
        >
          <p class="wish-text mb-3">"{{ wish.mensaje }}"</p>
          <div class="wish-meta d-flex align-items-center gap-2">
            <span class="wish-avatar">{{ wish.nombre.charAt(0).toUpperCase() }}</span>
            <div>
              <p class="wish-name mb-0">{{ wish.nombre }}</p>
              <p class="wish-date mb-0">{{ formatDate(wish.creadoEn) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="text-center py-5 opacity-25">
        <i class="pi pi-heart fs-1 mb-3 d-block"></i>
        <p class="small">Aún no hay deseos. ¡Sé el primero!</p>
      </div>

    </div>
  </section>
</template>

<style scoped>
.wish-section {
  background: var(--bg-cream);
}

.wish-form-wrap {
  max-width: 560px;
}

/* ── Inputs ── */
.wish-input,
.wish-textarea {
  background: #fff;
  border: 1.5px solid rgba(212, 163, 115, 0.25);
  font-family: var(--modern-font);
  font-size: 16px; /* previene zoom en iOS */
  color: var(--text-dark);
  outline: none;
  transition: border-color 0.2s;
  resize: none;
  display: block;
}

.wish-input {
  min-height: 48px; /* touch target mínimo */
}

.wish-input:focus,
.wish-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.12);
}

.char-count {
  position: absolute;
  bottom: 0.6rem;
  right: 1rem;
  font-size: 0.7rem;
  color: var(--text-muted);
  pointer-events: none;
}

.char-count--warn { color: #e07b54; }

/* ── Enviado ── */
.wish-sent { animation: fadeIn .5s ease; }
@keyframes fadeIn { from { opacity:0; transform:scale(.96) } to { opacity:1; transform:scale(1) } }

/* ── Masonry wall (CSS columns) ── */
.wish-wall {
  columns: 3 280px;
  column-gap: 1.25rem;
}

/* ── Tarjeta individual ── */
.wish-card {
  break-inside: avoid;
  background: white;
  border: 1px solid rgba(212, 163, 115, 0.15);
  border-radius: 1.25rem;
  padding: 1.25rem 1.35rem;
  margin-bottom: 1.25rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.wish-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(212, 163, 115, 0.15);
}

.wish-text {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-dark);
  font-style: italic;
}

.wish-avatar {
  width: 32px;
  height: 32px;
  min-width: 32px;
  background: var(--secondary-color);
  color: var(--primary-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
}

.wish-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-dark);
}

.wish-date {
  font-size: 0.72rem;
  color: var(--text-muted);
}

@media (max-width: 600px) {
  .wish-wall { columns: 1; }

  .wish-form-wrap {
    padding: 0;
  }

  .wish-form {
    padding: 1.25rem !important;
    border-radius: 1.25rem !important;
  }

  .wish-card {
    padding: 1rem 1.1rem;
  }
}

@media (min-width: 601px) and (max-width: 900px) {
  .wish-wall { columns: 2; }
}

/* Touch feedback en cards */
.wish-card:active {
  transform: scale(0.99);
}
</style>
