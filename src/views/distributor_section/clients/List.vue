<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { distributorClients } from '../../../store/distributor'

const router = useRouter()
const searchInput = ref('')
const statusInput = ref('CONFIRMADA')
const headers = [
  { title: '#', key: 'index', sortable: false },
  { title: 'Nombre comercial', key: 'commercialName' },
  { title: 'Responsable', key: 'responsible' },
  { title: 'Correo (Acceso)', key: 'email' },
  { title: 'Perfil fiscal', key: 'fiscalProfile' },
  { title: 'Cuenta', key: 'accountStatus' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]
const filteredClients = computed(() => statusInput.value === 'TODOS' ? distributorClients : distributorClients.filter((client) => client.accountStatus.toUpperCase() === statusInput.value))
</script>

<template>
  <section>
    <div class="d-flex justify-space-between align-center mb-6"><div class="d-flex align-center"><v-icon icon="mdi-account-group-outline" size="32" class="mr-3 text-medium-emphasis" /><h1 class="text-h5 font-weight-bold mb-0">Clientes</h1></div><v-btn color="#43A047" prepend-icon="mdi-plus" elevation="0" @click="router.push('/distribuidor/clientes/nuevo')">Agregar cliente</v-btn></div>
    <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center ga-4 py-4"><v-select v-model="statusInput" :items="['CONFIRMADA', 'PENDIENTE', 'TODOS']" label="Mostrar" variant="underlined" density="compact" hide-details class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="searchInput" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text></v-card>
    <v-card border rounded="xl" elevation="0"><v-data-table :headers="headers" :items="filteredClients" :search="searchInput" items-per-page-text="Clientes por página" page-text="{0}-{1} de {2}"><template #item.index="{ index }"><span class="font-weight-bold">{{ index + 1 }}</span></template><template #item.fiscalProfile="{ item }"><v-chip size="small" :color="item.fiscalProfile === 'Completa' ? '#43A047' : '#FFB300'" variant="tonal">{{ item.fiscalProfile }}</v-chip></template><template #item.accountStatus="{ item }"><v-chip size="small" :color="item.accountStatus === 'Confirmada' ? '#43A047' : '#FFB300'" variant="tonal">{{ item.accountStatus }}</v-chip></template><template #item.actions="{ item }"><v-btn icon="mdi-earth" color="#2962FF" variant="text" size="small" aria-label="Consultar dominios del cliente" @click="router.push(`/distribuidor/clientes/${item.id}`)" /></template></v-data-table></v-card>
  </section>
</template>
