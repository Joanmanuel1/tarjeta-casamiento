<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { addWish, subscribeToWishes } from '../services/wishService'

const nombre   = ref('')
const mensaje  = ref('')
const sending  = ref(false)
const sent     = ref(false)
const error    = ref('')
const wishes   = ref([])
const MAX_CHARS = 220
let unsubscribe = null

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
    sending.value = false }
}

onMounted(() => {
  unsubscribe = subscribeToWishes(async (newWishes) => {
    const prev = wishes.value.length
    wishes.value = newWishes
    if (prev < newWishes.length) {
      await nextTick()
      const cards = document.querySelectorAll('.wish-card:not(.wc-anim)')
      if (cards.length) {
        cards.forEach(c => c.classList.add('wc-anim'))
        gsap.from(cards, { opacity: 0, y: 20, scale: 0.96, stagger: 0.07, duration: 0.45, ease: 'power3.out' })
      }
    }
  })
})
onUnmounted(() => { if (unsubscribe) unsubscribe() })

function formatDate(ts) {
  if (!ts?.toDate) return ''
  return ts.toDate().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function initials(name) { return name.charAt(0).toUpperCase() }
</script>

<template>
  <section class="wish-section py-5">
    <div class="container px-4">

      <!-- Header -->
      <div class="text-center mb-5 section-reveal">
        <span class="section-tag">Para los novios</span>
        <h2 class="GreatVibes display-4">Muro de Deseos</h2>
        <p class="wish-subtitle mx-auto">
          Dejales un mensaje a Joan &amp; Stephie que guardarán para siempre. 💌
        </p>
      </div>

      <!-- Form -->
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
          <p v-if="error" class="wish-error mb-2">{{ error }}</p>
          <button
            class="wish-submit w-100 rounded-pill py-2"
            :disabled="sending"
            @click="submitWish"
          >
            <i class="pi pi-send me-2"></i>
            {{ sending ? 'Enviando…' : 'Enviar mi deseo 💌' }}
          </button>
        </div>

        <!-- Enviado -->
        <div v-else class="wish-sent glass-card p-4 rounded-4 text-center">
          <p class="display-4 mb-2">💌</p>
          <p class="fw-bold mb-1">¡Gracias! Tu mensaje fue enviado.</p>
          <p class="text-muted small mb-3">Joan &amp; Stephie lo van a leer con mucho amor.</p>
          <button class="btn btn-outline-secondary btn-sm rounded-pill px-4" @click="sent = false">
            Enviar otro mensaje
          </button>
        </div>
      </div>

      <!-- Masonry wall -->
      <div v-if="wishes.length" class="wish-wall">
        <div v-for="wish in wishes" :key="wish.id" class="wish-card wc-anim">
          <p class="wish-text">"{{ wish.mensaje }}"</p>
          <div class="wish-meta">
            <span class="wish-avatar">{{ initials(wish.nombre) }}</span>
            <div>
              <p class="wish-name">{{ wish.nombre }}</p>
              <p class="wish-date">{{ formatDate(wish.creadoEn) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vacío -->
      <div v-else class="wish-empty text-center py-5">
        <i class="pi pi-heart wish-empty-icon"></i>
        <p class="wish-empty-text">Aún no hay deseos. ¡Sé el primero!</p>
      </div>

    </div>
  </section>
</template>

<style scoped>
.wish-section { background: var(--bg-cream); }

.wish-subtitle {
  font-size: 0.9rem; color: var(--text-muted);
  max-width: 400px; line-height: 1.7;
}

/* ── Form ────────────────────────────────── */
.wish-form-wrap { max-width: 540px; }

.wish-input,
.wish-textarea {
  background: white;
  border: 1.5px solid rgba(212,163,115,0.25);
  font-family: var(--modern-font);
  font-size: 16px;
  color: var(--text-dark);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  resize: none;
  display: block;
}
.wish-input { min-height: 48px; }
.wish-input:focus, .wish-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(212,163,115,0.12);
}

.char-count {
  position: absolute; bottom: 0.6rem; right: 1rem;
  font-size: 0.68rem; color: var(--text-muted); pointer-events: none;
}
.char-count--warn { color: #e07b54; }

.wish-error { font-size: 0.8rem; color: #d14040; }

.wish-submit {
  background: var(--primary-color); color: white;
  border: none; font-weight: 700; font-size: 0.95rem;
  min-height: 50px; cursor: pointer;
  transition: all 0.3s var(--transition-bounce);
}
.wish-submit:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 10px 25px rgba(212,163,115,0.3); }
.wish-submit:active { transform: scale(0.97); }
.wish-submit:disabled { opacity: 0.6; cursor: default; transform: none; box-shadow: none; }

/* Enviado */
.wish-sent { animation: wsFade .5s ease; }
@keyframes wsFade { from { opacity: 0; transform: scale(.96) } to { opacity: 1; transform: scale(1) } }

/* ── Masonry ─────────────────────────────── */
.wish-wall {
  columns: 3 260px;
  column-gap: 1.1rem;
}

.wish-card {
  break-inside: avoid;
  background: white;
  border: 1px solid rgba(212,163,115,0.12);
  border-radius: 1.35rem;
  padding: 1.2rem 1.3rem;
  margin-bottom: 1.1rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.wish-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(212,163,115,0.15);
}
.wish-card:active { transform: scale(0.99); }

.wish-text {
  font-size: 0.88rem; line-height: 1.7;
  color: var(--text-dark); font-style: italic;
  margin: 0 0 0.85rem;
}

.wish-meta { display: flex; align-items: center; gap: 0.65rem; }

.wish-avatar {
  width: 34px; height: 34px; min-width: 34px;
  background: var(--secondary-color);
  color: var(--primary-dark);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.82rem;
}

.wish-name {
  font-size: 0.82rem; font-weight: 700;
  color: var(--text-dark); margin: 0;
}
.wish-date {
  font-size: 0.7rem; color: var(--text-muted); margin: 0;
}

/* ── Empty ───────────────────────────────── */
.wish-empty { opacity: 0.3; }
.wish-empty-icon { font-size: 2.5rem; color: var(--primary-color); display: block; margin-bottom: 0.75rem; }
.wish-empty-text { font-size: 0.9rem; color: var(--text-muted); }

/* ── Mobile ──────────────────────────────── */
@media (max-width: 600px) {
  .wish-wall { columns: 1; }
  .wish-form { padding: 1.25rem !important; border-radius: 1.25rem !important; }
}
@media (min-width: 601px) and (max-width: 900px) {
  .wish-wall { columns: 2; }
}
</style>
