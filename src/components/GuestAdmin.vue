<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import Select from 'primevue/select'
import { FilterMatchMode } from '@primevue/core/api'
import { getGuests, addGuest, updateGuest, deleteGuest } from '../services/guestService'
import { getWishes } from '../services/wishService'

const guests  = ref([])
const wishes  = ref([])
const loading = ref(false)
const wishesLoading = ref(false)
const showWishes    = ref(false)

const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } })

const guestDialog       = ref(false)
const deleteGuestDialog = ref(false)
const resetDialog       = ref(false)
const guest    = ref({})
const submitted = ref(false)
const toast = useToast()

const STATUSES    = ['invitado', 'confirmado', 'rechazado']
const ASISTENCIAS = ['Sí, asistiré', 'No podré asistir', 'pendiente']

// ── Stats ─────────────────────────────────────────────────────────────
const stats = computed(() => ({
  total:      guests.value.length,
  confirmados: guests.value.filter(g => g.estado === 'confirmado').length,
  rechazados:  guests.value.filter(g => g.estado === 'rechazado').length,
  pendientes:  guests.value.filter(g => g.estado === 'invitado').length,
}))

// ── Load ──────────────────────────────────────────────────────────────
onMounted(loadGuests)

async function loadGuests() {
  loading.value = true
  try {
    guests.value = await getGuests()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los invitados', life: 3000 })
  } finally {
    loading.value = false
  }
}

// ── CRUD ──────────────────────────────────────────────────────────────
function openNew() {
  guest.value = { nombre: '', apellido: '', estado: 'invitado', asistencia: 'pendiente', comentario: '' }
  submitted.value = false
  guestDialog.value = true
}

function hideDialog() {
  guestDialog.value = false
  submitted.value = false
}

async function saveGuest() {
  submitted.value = true
  if (!guest.value.nombre?.trim()) return
  try {
    if (guest.value.id) {
      await updateGuest(guest.value.id, guest.value)
      toast.add({ severity: 'success', summary: 'Guardado', detail: 'Invitado actualizado', life: 2500 })
    } else {
      await addGuest(guest.value)
      toast.add({ severity: 'success', summary: 'Creado', detail: 'Invitado agregado', life: 2500 })
    }
    guestDialog.value = false
    guest.value = {}
    await loadGuests()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar', life: 3000 })
  }
}

function editGuest(g) {
  guest.value = { ...g }
  guestDialog.value = true
}

function confirmDelete(g) {
  guest.value = g
  deleteGuestDialog.value = true
}

async function doDelete() {
  try {
    await deleteGuest(guest.value.id)
    deleteGuestDialog.value = false
    guest.value = {}
    await loadGuests()
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Invitado eliminado', life: 2500 })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 })
  }
}

// ── Reset estado ──────────────────────────────────────────────────────
function confirmReset(g) {
  guest.value = g
  resetDialog.value = true
}

async function doReset() {
  try {
    await updateGuest(guest.value.id, {
      ...guest.value,
      estado: 'invitado',
      asistencia: 'pendiente',
      confirmadoEn: null,
      comentario: ''
    })
    resetDialog.value = false
    guest.value = {}
    await loadGuests()
    toast.add({ severity: 'info', summary: 'Reseteado', detail: 'Invitado vuelto a estado inicial', life: 2500 })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo resetear', life: 3000 })
  }
}

// ── Quick status change ───────────────────────────────────────────────
async function setStatus(g, status) {
  try {
    await updateGuest(g.id, { ...g, estado: status })
    await loadGuests()
    toast.add({ severity: 'success', summary: 'Actualizado', detail: `Estado → ${status}`, life: 2000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar', life: 3000 })
  }
}

// ── Wishes ────────────────────────────────────────────────────────────
async function toggleWishes() {
  showWishes.value = !showWishes.value
  if (showWishes.value && wishes.value.length === 0) {
    wishesLoading.value = true
    try {
      wishes.value = await getWishes()
    } catch {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los deseos', life: 3000 })
    } finally {
      wishesLoading.value = false
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────
function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatWishDate(ts) {
  if (!ts?.toDate) return ''
  return ts.toDate().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="ga-wrap">
    <Toast />

    <!-- Header ────────────────────────────────────────────── -->
    <div class="ga-header">
      <div>
        <h1 class="ga-title">Panel de invitados</h1>
        <p class="ga-subtitle">Joan &amp; Stephie · 6 de noviembre de 2027</p>
      </div>
      <button class="ga-refresh-btn" @click="loadGuests" title="Actualizar">
        <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
      </button>
    </div>

    <!-- Stats ─────────────────────────────────────────────── -->
    <div class="ga-stats">
      <div class="ga-stat">
        <span class="ga-stat-num">{{ stats.total }}</span>
        <span class="ga-stat-label">Total</span>
      </div>
      <div class="ga-stat ga-stat--green">
        <span class="ga-stat-num">{{ stats.confirmados }}</span>
        <span class="ga-stat-label">Confirmados</span>
      </div>
      <div class="ga-stat ga-stat--red">
        <span class="ga-stat-num">{{ stats.rechazados }}</span>
        <span class="ga-stat-label">Rechazados</span>
      </div>
      <div class="ga-stat ga-stat--yellow">
        <span class="ga-stat-num">{{ stats.pendientes }}</span>
        <span class="ga-stat-label">Pendientes</span>
      </div>
    </div>

    <!-- Table card ────────────────────────────────────────── -->
    <div class="ga-card">
      <div class="ga-card-toolbar">
        <div class="ga-search-wrap">
          <i class="pi pi-search ga-search-icon"></i>
          <InputText
            v-model="filters['global'].value"
            placeholder="Buscar invitado…"
            class="ga-search-input"
          />
        </div>
        <button class="ga-btn-primary" @click="openNew">
          <i class="pi pi-plus me-2"></i>Nuevo invitado
        </button>
      </div>

      <DataTable
        :value="guests"
        :loading="loading"
        :paginator="true"
        :rows="15"
        :filters="filters"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink CurrentPageReport"
        currentPageReportTemplate="{first}–{last} de {totalRecords}"
        :rowsPerPageOptions="[10, 15, 25, 50]"
        responsiveLayout="stack"
        breakpoint="700px"
        class="ga-table"
        stripedRows
      >
        <template #empty>
          <div class="ga-empty">
            <i class="pi pi-users ga-empty-icon"></i>
            <p>No hay invitados todavía. ¡Agregá el primero!</p>
          </div>
        </template>

        <Column field="nombre"   header="Nombre"   sortable style="min-width:110px"></Column>
        <Column field="apellido" header="Apellido"  sortable style="min-width:110px"></Column>

        <Column field="estado" header="Estado" sortable style="min-width:120px">
          <template #body="{ data }">
            <span :class="['ga-badge', `ga-badge--${data.estado}`]">{{ data.estado }}</span>
          </template>
        </Column>

        <Column field="asistencia" header="Asistencia" sortable style="min-width:130px">
          <template #body="{ data }">
            <span class="ga-asistencia">{{ data.asistencia || '—' }}</span>
          </template>
        </Column>

        <Column field="confirmadoEn" header="Confirmado el" sortable style="min-width:150px">
          <template #body="{ data }">
            <span class="ga-date">{{ formatDate(data.confirmadoEn) }}</span>
          </template>
        </Column>

        <Column header="Acciones" style="min-width:200px; text-align:right" headerStyle="text-align:right">
          <template #body="{ data }">
            <div class="ga-actions">
              <!-- Quick status -->
              <button
                v-if="data.estado !== 'confirmado'"
                class="ga-action-btn ga-action-btn--green"
                title="Marcar confirmado"
                @click="setStatus(data, 'confirmado')"
              ><i class="pi pi-check"></i></button>

              <button
                v-if="data.estado !== 'rechazado'"
                class="ga-action-btn ga-action-btn--red"
                title="Marcar rechazado"
                @click="setStatus(data, 'rechazado')"
              ><i class="pi pi-times"></i></button>

              <!-- Reset -->
              <button
                v-if="data.estado !== 'invitado'"
                class="ga-action-btn ga-action-btn--yellow"
                title="Resetear a estado inicial"
                @click="confirmReset(data)"
              ><i class="pi pi-undo"></i></button>

              <!-- Edit -->
              <button class="ga-action-btn ga-action-btn--blue" title="Editar" @click="editGuest(data)">
                <i class="pi pi-pencil"></i>
              </button>

              <!-- Delete -->
              <button class="ga-action-btn ga-action-btn--ghost" title="Eliminar" @click="confirmDelete(data)">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Wishes card ───────────────────────────────────────── -->
    <div class="ga-card ga-card--collapsible" @click="toggleWishes">
      <div class="ga-wishes-header">
        <div>
          <h3 class="ga-wishes-title">💌 Muro de Deseos</h3>
          <p class="ga-wishes-sub">Mensajes de los invitados</p>
        </div>
        <i :class="`pi ${showWishes ? 'pi-chevron-up' : 'pi-chevron-down'} ga-chevron`"></i>
      </div>

      <div v-if="showWishes" class="ga-wishes-body" @click.stop>
        <div v-if="wishesLoading" class="ga-empty">
          <i class="pi pi-spin pi-spinner"></i><p>Cargando…</p>
        </div>
        <div v-else-if="wishes.length === 0" class="ga-empty">
          <p>Aún no hay deseos enviados.</p>
        </div>
        <div v-else>
          <div v-for="w in wishes" :key="w.id" class="ga-wish-row">
            <div class="ga-wish-avatar">{{ w.nombre?.charAt(0)?.toUpperCase() }}</div>
            <div class="ga-wish-content">
              <p class="ga-wish-name">{{ w.nombre }}</p>
              <p class="ga-wish-msg">"{{ w.mensaje }}"</p>
            </div>
            <span class="ga-wish-date">{{ formatWishDate(w.creadoEn) }}</span>
          </div>
          <p class="ga-wishes-count">{{ wishes.length }} deseo{{ wishes.length !== 1 ? 's' : '' }}</p>
        </div>
      </div>
    </div>

    <!-- Edit / New Dialog ─────────────────────────────────── -->
    <Dialog v-model:visible="guestDialog" header="Invitado" :modal="true" :style="{ width: '460px' }" class="ga-dialog">
      <div class="ga-form">
        <div class="ga-form-row">
          <div class="ga-field">
            <label>Nombre *</label>
            <InputText v-model.trim="guest.nombre" autofocus :class="{ 'p-invalid': submitted && !guest.nombre }" />
            <small v-if="submitted && !guest.nombre" class="ga-error">Requerido</small>
          </div>
          <div class="ga-field">
            <label>Apellido</label>
            <InputText v-model.trim="guest.apellido" />
          </div>
        </div>

        <div class="ga-form-row">
          <div class="ga-field">
            <label>Estado</label>
            <Select v-model="guest.estado" :options="STATUSES" placeholder="Estado" />
          </div>
          <div class="ga-field">
            <label>Asistencia</label>
            <Select v-model="guest.asistencia" :options="ASISTENCIAS" placeholder="Asistencia" />
          </div>
        </div>

        <div class="ga-field">
          <label>Comentario</label>
          <InputText v-model="guest.comentario" placeholder="Ej: alergia, menú especial…" />
        </div>
      </div>

      <template #footer>
        <button class="ga-btn-ghost" @click="hideDialog">Cancelar</button>
        <button class="ga-btn-primary" @click="saveGuest">
          <i class="pi pi-check me-2"></i>Guardar
        </button>
      </template>
    </Dialog>

    <!-- Delete Dialog ─────────────────────────────────────── -->
    <Dialog v-model:visible="deleteGuestDialog" header="Eliminar invitado" :modal="true" :style="{ width: '400px' }" class="ga-dialog">
      <div class="ga-confirm-body">
        <i class="pi pi-exclamation-triangle ga-confirm-icon ga-confirm-icon--red"></i>
        <p>¿Eliminar a <strong>{{ guest.nombre }} {{ guest.apellido }}</strong>? Esta acción no se puede deshacer.</p>
      </div>
      <template #footer>
        <button class="ga-btn-ghost" @click="deleteGuestDialog = false">Cancelar</button>
        <button class="ga-btn-danger" @click="doDelete">
          <i class="pi pi-trash me-2"></i>Eliminar
        </button>
      </template>
    </Dialog>

    <!-- Reset Dialog ──────────────────────────────────────── -->
    <Dialog v-model:visible="resetDialog" header="Resetear invitado" :modal="true" :style="{ width: '400px' }" class="ga-dialog">
      <div class="ga-confirm-body">
        <i class="pi pi-undo ga-confirm-icon ga-confirm-icon--yellow"></i>
        <p>Esto va a volver a <strong>{{ guest.nombre }}</strong> al estado inicial: <em>invitado / pendiente</em>, borrando la confirmación y el comentario.</p>
      </div>
      <template #footer>
        <button class="ga-btn-ghost" @click="resetDialog = false">Cancelar</button>
        <button class="ga-btn-warning" @click="doReset">
          <i class="pi pi-undo me-2"></i>Resetear
        </button>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* ── Reset cursor / efectos globales ─────────────────────── */
.ga-wrap * {
  cursor: default !important;
}
.ga-wrap button,
.ga-wrap a,
.ga-wrap [role="button"] {
  cursor: pointer !important;
}
.ga-wrap input,
.ga-wrap textarea {
  cursor: text !important;
}

/* ── Layout ──────────────────────────────────────────────── */
.ga-wrap {
  min-height: 100vh;
  background: #f1f5f9;
  padding: 2rem 1.5rem 4rem;
  font-family: 'Montserrat', sans-serif;
  color: #1e293b;
}

/* ── Header ──────────────────────────────────────────────── */
.ga-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}

.ga-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.2rem;
}

.ga-subtitle {
  font-size: 0.82rem;
  color: #64748b;
  margin: 0;
}

.ga-refresh-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.6rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1rem;
  transition: all 0.2s;
  flex-shrink: 0;
}
.ga-refresh-btn:hover { border-color: #d4a373; color: #d4a373; }

/* ── Stats ───────────────────────────────────────────────── */
.ga-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .ga-stats { grid-template-columns: repeat(2, 1fr); }
}

.ga-stat {
  background: white;
  border-radius: 0.875rem;
  padding: 1.1rem 1rem;
  text-align: center;
  border-left: 4px solid #e2e8f0;
}
.ga-stat--green  { border-color: #22c55e; }
.ga-stat--red    { border-color: #ef4444; }
.ga-stat--yellow { border-color: #f59e0b; }

.ga-stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 0.3rem;
}

.ga-stat-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

/* ── Card ────────────────────────────────────────────────── */
.ga-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.ga-card--collapsible { cursor: pointer; }

/* ── Toolbar ─────────────────────────────────────────────── */
.ga-card-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
}

.ga-search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.ga-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.85rem;
  pointer-events: none;
}

.ga-search-input {
  width: 100%;
  padding: 0.55rem 0.75rem 0.55rem 2.25rem !important;
  border: 1.5px solid #e2e8f0 !important;
  border-radius: 0.6rem !important;
  font-size: 0.88rem !important;
  background: #f8fafc !important;
  color: #1e293b !important;
  transition: border-color 0.2s;
}
.ga-search-input:focus {
  border-color: #d4a373 !important;
  background: white !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(212,163,115,0.12) !important;
}

/* ── Buttons ─────────────────────────────────────────────── */
.ga-btn-primary {
  background: #d4a373;
  color: white;
  border: none;
  border-radius: 0.6rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.88rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  transition: background 0.2s;
  white-space: nowrap;
}
.ga-btn-primary:hover { background: #bc8a5f; }

.ga-btn-ghost {
  background: transparent;
  color: #64748b;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.6rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.88rem;
  font-weight: 600;
  min-height: 40px;
  transition: all 0.2s;
}
.ga-btn-ghost:hover { border-color: #94a3b8; color: #1e293b; }

.ga-btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.6rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.88rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  transition: background 0.2s;
}
.ga-btn-danger:hover { background: #dc2626; }

.ga-btn-warning {
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 0.6rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.88rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  transition: background 0.2s;
}
.ga-btn-warning:hover { background: #d97706; }

/* ── Table ───────────────────────────────────────────────── */
.ga-table :deep(table) {
  background: white !important;
  color: #1e293b !important;
}

.ga-table :deep(.p-datatable-thead > tr > th) {
  background: #f8fafc !important;
  color: #64748b !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
  padding: 0.9rem 1rem !important;
  border-bottom: 1px solid #e2e8f0 !important;
  border-top: none !important;
}

.ga-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.85rem 1rem !important;
  border-bottom: 1px solid #f1f5f9 !important;
  font-size: 0.88rem !important;
  color: #1e293b !important;
  background: white !important;
  vertical-align: middle !important;
}

.ga-table :deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background: #fafafa !important;
}

.ga-table :deep(.p-datatable-tbody > tr:hover > td) {
  background: #f0f9ff !important;
}

.ga-table :deep(.p-paginator) {
  background: white !important;
  border-top: 1px solid #f1f5f9 !important;
  padding: 0.75rem 1rem !important;
  color: #64748b !important;
  font-size: 0.82rem !important;
}

.ga-table :deep(.p-paginator .p-paginator-page),
.ga-table :deep(.p-paginator .p-paginator-prev),
.ga-table :deep(.p-paginator .p-paginator-next) {
  color: #64748b !important;
  background: transparent !important;
  border: none !important;
  border-radius: 0.4rem !important;
  min-width: 2rem !important;
  height: 2rem !important;
}

.ga-table :deep(.p-paginator .p-paginator-page.p-highlight) {
  background: #d4a373 !important;
  color: white !important;
}

.ga-table :deep(.p-datatable-loading-overlay) {
  background: rgba(255,255,255,0.7) !important;
}

/* ── Badge ───────────────────────────────────────────────── */
.ga-badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 2rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.ga-badge--invitado   { background: #f1f5f9; color: #475569; }
.ga-badge--confirmado { background: #dcfce7; color: #166534; }
.ga-badge--rechazado  { background: #fee2e2; color: #991b1b; }

.ga-asistencia { font-size: 0.83rem; color: #475569; }
.ga-date       { font-size: 0.78rem; color: #94a3b8; }

/* ── Actions ─────────────────────────────────────────────── */
.ga-actions {
  display: flex;
  gap: 0.35rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.ga-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 0.45rem;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  transition: all 0.15s;
  flex-shrink: 0;
}
.ga-action-btn--green  { background: #dcfce7; color: #16a34a; }
.ga-action-btn--green:hover  { background: #22c55e; color: white; }
.ga-action-btn--red    { background: #fee2e2; color: #dc2626; }
.ga-action-btn--red:hover    { background: #ef4444; color: white; }
.ga-action-btn--yellow { background: #fef3c7; color: #d97706; }
.ga-action-btn--yellow:hover { background: #f59e0b; color: white; }
.ga-action-btn--blue   { background: #dbeafe; color: #2563eb; }
.ga-action-btn--blue:hover   { background: #3b82f6; color: white; }
.ga-action-btn--ghost  { background: #f1f5f9; color: #94a3b8; }
.ga-action-btn--ghost:hover  { background: #fee2e2; color: #dc2626; }

/* ── Empty ───────────────────────────────────────────────── */
.ga-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.ga-empty-icon { font-size: 2.5rem; opacity: 0.4; }
.ga-empty p { font-size: 0.9rem; margin: 0; }

/* ── Wishes ──────────────────────────────────────────────── */
.ga-wishes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
}
.ga-wishes-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.15rem; }
.ga-wishes-sub   { font-size: 0.78rem; color: #94a3b8; margin: 0; }
.ga-chevron      { color: #94a3b8; font-size: 0.9rem; }

.ga-wishes-body {
  border-top: 1px solid #f1f5f9;
  padding: 0 1.5rem 1.5rem;
}

.ga-wish-row {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid #f1f5f9;
}
.ga-wish-row:last-child { border-bottom: none; }

.ga-wish-avatar {
  width: 34px;
  height: 34px;
  min-width: 34px;
  background: #faedcd;
  color: #bc8a5f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
}

.ga-wish-content  { flex: 1; min-width: 0; }
.ga-wish-name     { font-size: 0.82rem; font-weight: 700; color: #1e293b; margin: 0 0 0.2rem; }
.ga-wish-msg      { font-size: 0.82rem; color: #64748b; margin: 0; line-height: 1.5; }
.ga-wish-date     { font-size: 0.72rem; color: #cbd5e1; white-space: nowrap; padding-top: 2px; }
.ga-wishes-count  { font-size: 0.75rem; color: #94a3b8; text-align: right; margin: 0.75rem 0 0; }

/* ── Dialog form ─────────────────────────────────────────── */
.ga-dialog :deep(.p-dialog-header) {
  background: white !important;
  color: #0f172a !important;
  border-bottom: 1px solid #f1f5f9 !important;
  padding: 1.25rem 1.5rem !important;
  font-weight: 700 !important;
}
.ga-dialog :deep(.p-dialog-content) {
  background: white !important;
  padding: 1.5rem !important;
}
.ga-dialog :deep(.p-dialog-footer) {
  background: white !important;
  border-top: 1px solid #f1f5f9 !important;
  padding: 1rem 1.5rem !important;
  display: flex !important;
  justify-content: flex-end !important;
  gap: 0.75rem !important;
}

.ga-form { display: flex; flex-direction: column; gap: 1rem; }
.ga-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 480px) { .ga-form-row { grid-template-columns: 1fr; } }

.ga-field { display: flex; flex-direction: column; gap: 0.35rem; }
.ga-field label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #64748b;
}
.ga-field :deep(.p-inputtext),
.ga-field :deep(.p-select) {
  border: 1.5px solid #e2e8f0 !important;
  border-radius: 0.6rem !important;
  font-size: 0.9rem !important;
  color: #1e293b !important;
  background: #f8fafc !important;
  padding: 0.6rem 0.875rem !important;
}
.ga-field :deep(.p-inputtext:focus),
.ga-field :deep(.p-select:focus),
.ga-field :deep(.p-select.p-focus) {
  border-color: #d4a373 !important;
  background: white !important;
  box-shadow: 0 0 0 3px rgba(212,163,115,0.12) !important;
  outline: none !important;
}
.ga-field :deep(.p-invalid) { border-color: #ef4444 !important; }
.ga-error { font-size: 0.75rem; color: #ef4444; }

/* ── Confirm dialog ──────────────────────────────────────── */
.ga-confirm-body {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem 0;
}
.ga-confirm-body p { font-size: 0.92rem; color: #475569; margin: 0; line-height: 1.6; }

.ga-confirm-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
  margin-top: 2px;
}
.ga-confirm-icon--red    { color: #ef4444; }
.ga-confirm-icon--yellow { color: #f59e0b; }
</style>
