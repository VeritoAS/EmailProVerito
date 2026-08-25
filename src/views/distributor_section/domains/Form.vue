<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import { distributorClients, distributorDomains } from '../../../store/distributor'

const route = useRoute()
const router = useRouter()
const showConfirm = ref(false)
const client = computed(() => distributorClients.find((item) => item.id === Number(route.params.id)))
const form = ref({ name: '', extension: '.com', maxActiveMailboxes: 5 })
const extensions = ['.com', '.com.mx', '.mx', '.net']

function saveDomain() {
  distributorDomains.push({
    id: Date.now(), clientId: client.value.id, name: `${form.value.name}${form.value.extension}`,
    expirationDate: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
    maxActiveMailboxes: Number(form.value.maxActiveMailboxes), activeMailboxes: 0, status: 'Activo',
  })
  router.push(`/distribuidor/clientes/${client.value.id}`)
}
</script>

<template>
  <section v-if="client">
    <div class="d-flex align-start mb-6"><v-btn icon="mdi-arrow-left" variant="text" :to="`/distribuidor/clientes/${client.id}`" aria-label="Volver al cliente" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">DOMINIOS</p><div class="d-flex align-center"><v-icon icon="mdi-earth" size="30" class="mr-3 text-medium-emphasis" /><h1 class="text-h4 font-weight-bold">Agregar dominio</h1></div><p class="text-body-1 text-medium-emphasis mt-2">Registra un dominio para {{ client.commercialName }}.</p></div></div>
    <v-form @submit.prevent="showConfirm = true"><v-card border rounded="xl" elevation="0"><v-card-title class="pa-6">Información del dominio</v-card-title><v-card-text class="px-6 pb-6"><v-row><v-col cols="12" md="6"><v-text-field v-model="form.name" label="Nombre del dominio" placeholder="empresa" variant="outlined" required /></v-col><v-col cols="12" md="6"><v-select v-model="form.extension" :items="extensions" label="Extensión" variant="outlined" required /></v-col><v-col cols="12" md="6"><v-text-field v-model="form.maxActiveMailboxes" label="Límite de cuentas activas" type="number" min="1" variant="outlined" required /></v-col></v-row><v-alert type="info" variant="tonal" text="La fecha de expiración se inicializa automáticamente al registrar el dominio." /></v-card-text></v-card><div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" prepend-icon="mdi-content-save-outline">Guardar dominio</v-btn></div></v-form>
    <ConfirmDialog v-model="showConfirm" message="Se registrará el dominio para este cliente." @confirm="saveDomain" />
  </section>
</template>
