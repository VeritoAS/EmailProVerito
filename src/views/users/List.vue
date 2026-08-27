<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import { adminUsers } from '../../data/adminUsers'

const router = useRouter()
const searchInput = ref('')
const statusInput = ref('TODOS')
const appliedStatus = ref('TODOS')
const isEditingFilters = ref(false)
const selectedUser = ref(null)
const showStatusConfirm = ref(false)
const headers = [
  { title: '#', key: 'index', sortable: false },
  { title: 'Nombre', key: 'fullName' },
  { title: 'Correo (Acceso)', key: 'email' },
  { title: 'Rol', key: 'role' },
  { title: 'Estado', key: 'status' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]
const filteredUsers = computed(() => adminUsers.value.filter((user) => appliedStatus.value === 'TODOS' || user.status.toUpperCase() === appliedStatus.value.slice(0, -1)))

function toggleFilters() { if (isEditingFilters.value) appliedStatus.value = statusInput.value; isEditingFilters.value = !isEditingFilters.value }
function requestStatusChange(user) { if (!user.isCurrentUser && user.status !== 'Pendiente') { selectedUser.value = user; showStatusConfirm.value = true } }
function confirmStatusChange() { selectedUser.value.status = selectedUser.value.status === 'Activa' ? 'Inactiva' : 'Activa' }
function statusColor(status) { return status === 'Activa' ? '#43A047' : status === 'Inactiva' ? '#E53935' : '#FFB300' }
</script>

<template>
  <section>
    <div class="d-flex justify-space-between align-center mb-6"><div class="d-flex align-center"><v-icon icon="mdi-account-group-outline" size="32" class="mr-3 text-medium-emphasis" /><h1 class="text-h5 font-weight-bold mb-0">Usuarios</h1></div><v-btn color="#43A047" prepend-icon="mdi-plus" to="/usuarios/nuevo">Agregar usuario</v-btn></div>
    <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center py-4"><v-select v-model="statusInput" :items="['ACTIVAS', 'INACTIVAS', 'PENDIENTES', 'TODOS']" label="Mostrar" variant="underlined" density="compact" hide-details :disabled="!isEditingFilters" class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="searchInput" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text><v-sheet :color="isEditingFilters ? 'primary' : 'grey-darken-1'" class="py-2 px-4 text-center cursor-pointer" v-ripple @click="toggleFilters"><span class="text-caption font-weight-bold text-white text-uppercase d-flex align-center justify-center">{{ isEditingFilters ? 'Aplicar filtros' : 'Cambiar filtros' }}<v-icon icon="mdi-filter-variant" size="small" class="ml-1" /></span></v-sheet></v-card>
    <v-card border rounded="xl" elevation="0"><v-data-table :headers="headers" :items="filteredUsers" :search="searchInput" items-per-page-text="Usuarios por página" page-text="{0}-{1} de {2}"><template #item.index="{ index }"><span class="font-weight-bold">{{ index + 1 }}</span></template><template #item.role="{ item }"><v-chip :color="item.role === 'Super Admin' ? '#2962FF' : 'secondary'" size="small" variant="tonal">{{ item.role }}</v-chip></template><template #item.status="{ item }"><v-tooltip v-if="item.isCurrentUser" text="No puedes desactivar tu propia cuenta" location="top"><template #activator="{ props }"><v-chip v-bind="props" :color="statusColor(item.status)" size="small" variant="tonal">{{ item.status }}</v-chip></template></v-tooltip><v-btn v-else-if="item.status !== 'Pendiente'" :color="statusColor(item.status)" size="small" variant="tonal" @click="requestStatusChange(item)">{{ item.status }}</v-btn><v-chip v-else :color="statusColor(item.status)" size="small" variant="tonal">Pendiente</v-chip></template><template #item.actions="{ item }"><v-tooltip text="Ver detalle" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-eye-outline" color="#2962FF" variant="text" size="small" aria-label="Ver detalle" @click="router.push(`/usuarios/${item.id}`)" /></template></v-tooltip></template></v-data-table></v-card>
    <ConfirmDialog v-model="showStatusConfirm" :message="selectedUser?.status === 'Activa' ? `Se desactivará la cuenta de ${selectedUser?.fullName}.` : `Se activará la cuenta de ${selectedUser?.fullName}.`" @confirm="confirmStatusChange" />
  </section>
</template>
