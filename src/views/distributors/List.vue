<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { adminDistributors } from '../../data/adminDistributors'

const router = useRouter()

// Buscador independiente y en tiempo real
const searchInput = ref('')

// Selector aplicado en tiempo real
const statusInput = ref('ACTIVOS')

const headers = [
  { title: '#', key: 'index', sortable: false },
  { title: 'Nombre Comercial', key: 'name' },
  { title: 'Usuario (Acceso)', key: 'user' },
  { title: 'Costo por cuenta', key: 'monthlyCost' },
  { title: 'CLABE', key: 'clabe' },
  { title: 'Perfil Fiscal', key: 'fiscalProfile' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

const filteredDistributors = computed(() => {
  if (statusInput.value === 'TODOS') return adminDistributors.value
  return adminDistributors.value.filter(d => d.status === statusInput.value)
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
      <v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center ga-4 py-4">
        <!-- Selector aplicado automáticamente -->
        <v-select
          v-model="statusInput"
          :items="['ACTIVOS', 'INACTIVOS', 'TODOS']"
          label="Mostrar"
          variant="underlined"
          density="compact"
          hide-details
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
