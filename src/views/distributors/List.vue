<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { adminDistributors } from '../../data/adminDistributors'

const router = useRouter()

// Buscador independiente y en tiempo real
const searchInput = ref('')

// Estado interactivo de la barra de filtros
const isEditingFilters = ref(false)

// Valores del selector
const statusInput = ref('ACTIVOS')
const appliedStatus = ref('ACTIVOS')

// Función que controla el flujo del botón (Gris/Azul y Bloqueado/Desbloqueado)
function toggleFilters() {
  if (isEditingFilters.value) {
    // Si estaba azul (editando), aplicamos y regresamos a gris
    appliedStatus.value = statusInput.value
    isEditingFilters.value = false
  } else {
    // Si estaba gris, lo volvemos azul y habilitamos el selector
    isEditingFilters.value = true
  }
}

const headers = [
  { title: '#', key: 'index', sortable: false },
  { title: 'Nombre Comercial', key: 'name' },
  { title: 'Usuario (Acceso)', key: 'user' },
  { title: 'Costo por cuenta', key: 'monthlyCost' },
  { title: 'CLABE', key: 'clabe' },
  { title: 'Perfil Fiscal', key: 'fiscalProfile' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

// Filtro aplicado a la tabla (solo reacciona al appliedStatus)
const filteredDistributors = computed(() => {
  if (appliedStatus.value === 'TODOS') return adminDistributors.value
  return adminDistributors.value.filter(d => d.status === appliedStatus.value)
})
</script>

<template>
  <section>
    <!-- Encabezado -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <v-icon icon="mdi-handshake-outline" size="32" class="mr-3 text-medium-emphasis" />
        <h1 class="text-h5 font-weight-bold mb-0">Distribuidores</h1>
      </div>
      <v-btn color="#43A047" prepend-icon="mdi-plus" elevation="0" @click="router.push('/distribuidores/nuevo')">
        Agregar distribuidor
      </v-btn>
    </div>

    <!-- BLOQUE 1: Contenedor de Filtros -->
    <v-card elevation="2" rounded="lg" class="mb-4">
      <v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center py-4">
        <!-- Selector (Bloqueado por defecto, reacciona al botón) -->
        <v-select
          v-model="statusInput"
          :items="['ACTIVOS', 'INACTIVOS', 'TODOS']"
          label="Mostrar"
          variant="underlined"
          density="compact"
          hide-details
          :disabled="!isEditingFilters"
          style="max-width: 200px;"
          class="w-100 mb-3 mb-sm-0"
        />
        
        <!-- Buscador (Siempre libre e independiente) -->
        <v-text-field
          v-model="searchInput"
          placeholder="Buscar"
          append-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 300px;"
          class="w-100"
        />
      </v-card-text>

      <!-- Botón interactivo -->
      <v-sheet 
        :color="isEditingFilters ? 'primary' : 'grey-darken-1'" 
        class="py-2 px-4 text-center cursor-pointer transition-swing" 
        v-ripple 
        @click="toggleFilters"
      >
        <span class="text-caption font-weight-bold text-white text-uppercase d-flex align-center justify-center">
          {{ isEditingFilters ? 'Aplicar filtros' : 'Cambiar filtros' }}
          <v-icon icon="mdi-filter-variant" size="small" class="ml-1" />
        </span>
      </v-sheet>
    </v-card>

    <!-- BLOQUE 2: Tabla de datos -->
    <v-card elevation="2" rounded="lg">
      <v-data-table
        :headers="headers"
        :items="filteredDistributors"
        :search="searchInput"
        items-per-page-text="Elementos por página:"
        page-text="{0}-{1} de {2}"
        class="elevation-0"
      >
        <template v-slot:item.index="{ index }">
          <span class="font-weight-bold">{{ index + 1 }}</span>
        </template>

        <template v-slot:item.monthlyCost="{ item }">
          <span class="font-weight-medium">${{ Number(item.monthlyCost).toFixed(2) }} MXN</span>
        </template>

        <template v-slot:item.fiscalProfile="{ item }">
          <v-chip size="small" :color="item.fiscalProfile === 'Pendiente' ? '#FFB300' : '#43A047'" variant="tonal">{{ item.fiscalProfile }}</v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" size="small" color="grey-darken-2" @click="router.push(`/distribuidores/${item.id}`)" />
        </template>
      </v-data-table>
    </v-card>
  </section>
</template>
