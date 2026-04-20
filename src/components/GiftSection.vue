<script setup>
import { ref } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const accounts = [
  { label: 'Cuenta en Pesos 🇦🇷',    alias: 'BODA.JOAN.Y.STEPHIE', cbu: '0000003100012345678901', icon: 'pi pi-money-bill' },
  { label: 'Cuenta en Dólares 🇺🇸',   alias: 'JOAN.STEPHIE.USD',     cbu: '0000003100098765432109', icon: 'pi pi-dollar' },
]
const copied = ref({})

const copyToClipboard = (text, key, label) => {
  navigator.clipboard.writeText(text).then(() => {
    copied.value[key] = true
    setTimeout(() => { copied.value[key] = false }, 2000)
    toast.add({ severity: 'contrast', summary: '¡Copiado!', detail: `${label} copiado con éxito`, life: 2000 })
  })
}
</script>

<template>
  <div class="gifts-wrapper">
    <Toast />

    <!-- Mensaje intro -->
    <p class="gifts-intro text-center mx-auto mb-5">
      Si deseás colaborar con nuestra luna de miel, podés hacerlo mediante transferencia. 💌
    </p>

    <div class="gifts-grid">
      <div v-for="(acc, i) in accounts" :key="i" class="gift-card section-reveal">
        <!-- Icono + título -->
        <div class="gift-card-header">
          <div class="gift-icon-ring">
            <i :class="acc.icon"></i>
          </div>
          <h4 class="gift-card-title">{{ acc.label }}</h4>
        </div>

        <!-- Alias -->
        <div class="gift-detail-row">
          <div class="gift-detail-info">
            <span class="gift-detail-label">ALIAS</span>
            <span class="gift-detail-value">{{ acc.alias }}</span>
          </div>
          <button
            class="copy-btn"
            :class="{ 'copy-btn--done': copied[`alias-${i}`] }"
            @click="copyToClipboard(acc.alias, `alias-${i}`, 'Alias')"
            :aria-label="`Copiar alias ${acc.alias}`"
          >
            <i :class="copied[`alias-${i}`] ? 'pi pi-check' : 'pi pi-copy'"></i>
          </button>
        </div>

        <!-- CBU -->
        <div class="gift-detail-row">
          <div class="gift-detail-info overflow-hidden">
            <span class="gift-detail-label">CBU</span>
            <span class="gift-detail-value gift-detail-value--mono">{{ acc.cbu }}</span>
          </div>
          <button
            class="copy-btn"
            :class="{ 'copy-btn--done': copied[`cbu-${i}`] }"
            @click="copyToClipboard(acc.cbu, `cbu-${i}`, 'CBU')"
            :aria-label="`Copiar CBU`"
          >
            <i :class="copied[`cbu-${i}`] ? 'pi pi-check' : 'pi pi-copy'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer romántico -->
    <div class="gifts-footer text-center mt-5 section-reveal">
      <div class="gifts-ornament" aria-hidden="true">
        <span></span><span class="gifts-ornament-glyph">✦</span><span></span>
      </div>
      <p class="gifts-footer-text">
        Gracias por querer ser parte de nuestro nuevo comienzo. ❤️
      </p>
    </div>
  </div>
</template>

<style scoped>
.gifts-wrapper { max-width: 680px; margin: 0 auto; }

.gifts-intro {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 480px;
}

/* ── Grid ─────────────────────────────────── */
.gifts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 600px) {
  .gifts-grid { grid-template-columns: 1fr 1fr; }
}

/* ── Card ─────────────────────────────────── */
.gift-card {
  background: white;
  border-radius: 2rem;
  padding: 1.5rem;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 15px 40px rgba(0,0,0,0.05);
  transition: all 0.4s var(--transition-bounce);
}
@media (min-width: 768px) {
  .gift-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 25px 55px rgba(212,163,115,0.12);
  }
}
.gift-card:active { transform: scale(0.99); }

/* Header */
.gift-card-header {
  display: flex; align-items: center; gap: 1rem;
  margin-bottom: 1.5rem;
}
.gift-icon-ring {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--secondary-color);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary-dark); font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(212,163,115,0.2);
}
.gift-card-title {
  font-size: 0.92rem; font-weight: 700;
  color: var(--text-dark); margin: 0;
}

/* Detail rows */
.gift-detail-row {
  display: flex; align-items: center; gap: 0.75rem;
  background: var(--bg-cream);
  border-radius: 1rem;
  padding: 0.85rem 1rem;
  margin-bottom: 0.65rem;
  border: 1px solid rgba(212,163,115,0.1);
}
.gift-detail-info { flex: 1; min-width: 0; }
.gift-detail-label {
  display: block;
  font-size: 0.58rem; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 0.2rem;
}
.gift-detail-value {
  display: block;
  font-size: 0.9rem; font-weight: 700;
  color: var(--text-dark); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.gift-detail-value--mono {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.8rem;
}

/* Copy button */
.copy-btn {
  width: 36px; height: 36px;
  border-radius: 0.75rem;
  background: white; border: 1px solid #eee;
  color: var(--primary-color);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: all 0.25s var(--transition-bounce);
}
.copy-btn:hover {
  background: var(--primary-color); color: white;
  box-shadow: 0 4px 12px rgba(212,163,115,0.25);
  transform: scale(1.08);
}
.copy-btn:active { transform: scale(0.9); }
.copy-btn--done { background: var(--accent-color); color: #3a4a2b; border-color: var(--accent-color); }

/* Footer ornamento */
.gifts-footer { padding-top: 0.5rem; }
.gifts-ornament {
  display: flex; align-items: center; gap: 1rem;
  max-width: 180px; margin: 0 auto 1rem;
}
.gifts-ornament span:not(.gifts-ornament-glyph) {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
}
.gifts-ornament-glyph { color: var(--primary-color); font-size: 0.8rem; opacity: 0.6; }
.gifts-footer-text {
  font-size: 0.88rem; color: var(--text-muted);
  font-style: italic; line-height: 1.6;
}
</style>
