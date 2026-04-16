<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import Select from 'primevue/select'
import { FilterMatchMode } from '@primevue/core/api'
import { getGuests, addGuest, updateGuest, deleteGuest } from '../services/guestService'
import { getWishes } from '../services/wishService'

const guests = ref([])
const wishes = ref([])
const wishesLoading = ref(false)
const showWishes = ref(false)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const guestDialog = ref(false)
const deleteGuestDialog = ref(false)
const guest = ref({})
const selectedGuests = ref([])
const submitted = ref(false)
const toast = useToast()

const statuses = ref(['invitado', 'confirmado', 'rechazado'])
const helpAsistencia = ref(['Sí, asistiré', 'No podré asistir', 'pendiente'])

onMounted(async () => {
  await loadGuests()
})

const loadGuests = async () => {
  try {
    guests.value = await getGuests()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los invitados', life: 3000 })
  }
}

const openNew = () => {
  guest.value = {
    nombre: '',
    apellido: '',
    estado: 'invitado',
    asistencia: 'pendiente',
    comentario: ''
  }
  submitted.value = false
  guestDialog.value = true
}

const hideDialog = () => {
  guestDialog.value = false
  submitted.value = false
}

const saveGuest = async () => {
  submitted.value = true

  if (guest.value.nombre.trim()) {
    try {
      if (guest.value.id) {
        await updateGuest(guest.value.id, guest.value)
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Invitado actualizado', life: 3000 })
      } else {
        await addGuest(guest.value)
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Invitado creado', life: 3000 })
      }

      guestDialog.value = false
      guest.value = {}
      await loadGuests()
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar invitado', life: 3000 })
    }
  }
}

const editGuest = (g) => {
  guest.value = { ...g }
  guestDialog.value = true
}

const confirmDeleteGuest = (g) => {
  guest.value = g
  deleteGuestDialog.value = true
}

const deleteGuestAction = async () => {
  try {
    await deleteGuest(guest.value.id)
    deleteGuestDialog.value = false
    guest.value = {}
    await loadGuests()
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Invitado eliminado', life: 3000 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar al invitado', life: 3000 })
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString()
}

const toggleWishes = async () => {
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

const formatWishDate = (ts) => {
  if (!ts?.toDate) return ''
  return ts.toDate().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="guest-admin-section py-5">
    <div class="container">
      <div class="card p-4 shadow-sm border-0 bg-white">
        <Toast />
        
        <div class="admin-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-4">
          <div>
            <h2 class="mb-1 fw-bold text-dark">Gestión de Invitados</h2>
            <p class="text-muted small mb-0">Administrá tu lista de invitados de forma rápida y sencilla.</p>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
            <div class="search-wrapper position-relative">
              <i class="pi pi-search search-icon" />
              <InputText v-model="filters['global'].value" placeholder="Nombre o apellido..." class="search-input w-100" />
            </div>
            <Button label="Nuevo Invitado" icon="pi pi-plus" class="p-button-success shadow-sm px-4 rounded-pill" @click="openNew" />
          </div>
        </div>

        <DataTable :value="guests" :paginator="true" :rows="10" :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5,10,25,50]"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
          responsiveLayout="stack" breakpoint="960px" class="premium-table">
          
          <Column field="nombre" header="Nombre" :sortable="true" class="fw-bold"></Column>
          <Column field="apellido" header="Apellido" :sortable="true"></Column>
          <Column field="estado" header="Estado" :sortable="true">
            <template #body="slotProps">
              <span :class="'badge status-' + slotProps.data.estado">{{ slotProps.data.estado }}</span>
            </template>
          </Column>
          <Column field="asistencia" header="Asistencia" :sortable="true" class="d-none d-md-table-cell"></Column>
          <Column field="confirmadoEn" header="Confirmación" :sortable="true" class="d-none d-lg-table-cell">
            <template #body="slotProps">
              <span class="text-muted small">{{ formatDate(slotProps.data.confirmadoEn) }}</span>
            </template>
          </Column>
          <Column header="Acciones" headerStyle="width: 8rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
            <template #body="slotProps">
              <div class="d-flex justify-content-center gap-2">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-secondary" @click="editGuest(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteGuest(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Sección Muro de Deseos -->
    <div class="container mt-4">
      <div class="card border-0 shadow-sm bg-white">
        <div
          class="card-header bg-white border-0 d-flex justify-content-between align-items-center p-4"
          style="cursor:pointer"
          @click="toggleWishes"
        >
          <div>
            <h5 class="fw-bold mb-0">💌 Muro de Deseos</h5>
            <p class="text-muted small mb-0">Mensajes que dejaron los invitados</p>
          </div>
          <i :class="`pi ${showWishes ? 'pi-chevron-up' : 'pi-chevron-down'} text-muted`"></i>
        </div>

        <div v-if="showWishes" class="card-body pt-0 px-4 pb-4">
          <div v-if="wishesLoading" class="text-center py-4 text-muted small">
            <i class="pi pi-spinner pi-spin me-2"></i> Cargando deseos…
          </div>
          <div v-else-if="wishes.length === 0" class="text-center py-4 text-muted small">
            Aún no hay deseos enviados.
          </div>
          <div v-else class="wishes-admin-list">
            <div
              v-for="w in wishes"
              :key="w.id"
              class="wish-row d-flex gap-3 align-items-start py-3 border-bottom"
            >
              <div class="wish-avatar-sm">{{ w.nombre?.charAt(0)?.toUpperCase() }}</div>
              <div class="flex-grow-1 min-width-0">
                <p class="fw-bold small mb-1">{{ w.nombre }}</p>
                <p class="text-muted small mb-0" style="line-height:1.5">"{{ w.mensaje }}"</p>
              </div>
              <span class="text-muted" style="font-size:.72rem;white-space:nowrap;padding-top:2px">
                {{ formatWishDate(w.creadoEn) }}
              </span>
            </div>
          </div>
          <p v-if="wishes.length" class="text-muted text-end mt-3 mb-0" style="font-size:.75rem">
            {{ wishes.length }} deseo{{ wishes.length !== 1 ? 's' : '' }} en total
          </p>
        </div>
      </div>
    </div>

    <!-- Edit/New Dialog -->
    <Dialog v-model:visible="guestDialog" :style="{width: '450px'}" header="Detalles del Invitado" :modal="true" class="p-fluid premium-dialog">
      <div class="row g-3">
        <div class="col-md-6">
          <div class="field mb-3">
            <label for="nombre" class="form-label fw-bold small text-muted">Nombre</label>
            <InputText id="nombre" v-model.trim="guest.nombre" required="true" autofocus :class="{'p-invalid': submitted && !guest.nombre}" />
            <small class="p-error" v-if="submitted && !guest.nombre">Requerido.</small>
          </div>
        </div>
        <div class="col-md-6">
          <div class="field mb-3">
            <label for="apellido" class="form-label fw-bold small text-muted">Apellido</label>
            <InputText id="apellido" v-model.trim="guest.apellido" />
          </div>
        </div>
      </div>

      <div class="field mb-3">
        <label for="estado" class="form-label fw-bold">Estado</label>
        <Select id="estado" v-model="guest.estado" :options="statuses" placeholder="Seleccionar Estado" />
      </div>

      <div class="field mb-3">
        <label for="asistencia" class="form-label fw-bold">Asistencia</label>
        <Select id="asistencia" v-model="guest.asistencia" :options="helpAsistencia" placeholder="Seleccionar Asistencia" />
      </div>

      <div class="field mb-3">
        <label for="comentario" class="form-label fw-bold">Comentario</label>
        <InputText id="comentario" v-model="guest.comentario" />
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-success" @click="saveGuest" />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:visible="deleteGuestDialog" :style="{width: '450px'}" header="Confirmar" :modal="true">
      <div class="confirmation-content d-flex align-items-center">
        <i class="pi pi-exclamation-triangle me-3" style="font-size: 2rem" />
        <span v-if="guest">¿Estás seguro de que deseas eliminar a <b>{{guest.nombre}}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteGuestDialog = false" />
        <Button label="Sí" icon="pi pi-check" class="p-button-danger" @click="deleteGuestAction" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.guest-admin-section {
  background: var(--bg-light);
  padding: 4rem 0;
}

.search-wrapper {
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  z-index: 1;
}

.search-input {
  padding-left: 35px !important;
  border-radius: 20px !important;
  border: 1px solid #ddd !important;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 0.2rem rgba(212, 163, 115, 0.1) !important;
}

.status-invitado {
  background-color: #f0f0f0;
  color: #666;
}

.status-confirmado {
  background-color: #dcfce7;
  color: #166534;
}

.status-rechazado {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge {
  padding: 0.4em 0.8em;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.premium-table :deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
}

.premium-table :deep(.p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.premium-table :deep(.p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}

.wish-avatar-sm {
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

.wish-row:last-child { border-bottom: none !important; }

@media (max-width: 768px) {
  .search-wrapper {
    min-width: 100%;
  }
}
</style>
