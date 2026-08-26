<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { distributorClients, distributorDomains, distributorPayments } from '../../../store/distributor'

const route = useRoute()
const searchInput = ref('')
const periodInput = ref('TODOS')
const appliedPeriod = ref('TODOS')
const isEditingFilters = ref(false)
const client = computed(() => distributorClients.find((item) => item.id === Number(route.params.id)))
const domainNames = computed(() => Object.fromEntries(distributorDomains.filter((item) => item.clientId === Number(route.params.id)).map((item) => [item.id, item.name])))
const payments = computed(() => distributorPayments.filter((item) => domainNames.value[item.domainId]).map((item) => ({ ...item, domain: domainNames.value[item.domainId] })))
const headers = [
  { title: 'Dominio', key: 'domain' },
  { title: 'Fecha de pago', key: 'paidAt' },
  { title: 'Periodo', key: 'period' },
  { title: 'Capacidad', key: 'capacity' },
  { title: 'Precio por cuenta', key: 'customerUnitPrice' },
  { title: 'Total del cliente', key: 'customerTotal' },
  { title: 'Costo SVR', key: 'svrTotal' },
  { title: 'Diferencia', key: 'distributorDifference' },
  { title: 'Nueva vigencia', key: 'newExpirationDate' },
]
const filteredPayments = computed(() => {
  const query = searchInput.value.trim().toLowerCase()
  return payments.value.filter((payment) => {
    const matchesPeriod = appliedPeriod.value === 'TODOS' || payment.period.toUpperCase() === appliedPeriod.value
    return matchesPeriod && (!query || Object.values(payment).join(' ').toLowerCase().includes(query))
  })
})
const currency = (value) => `$${Number(value).toFixed(2)} MXN`
function toggleFilters() { if (isEditingFilters.value) appliedPeriod.value = periodInput.value; isEditingFilters.value = !isEditingFilters.value }
</script>

<template>
  <section v-if="client">
    <div class="d-flex align-start mb-6"><v-btn icon="mdi-arrow-left" variant="text" :to="`/distribuidor/clientes/${client.id}`" aria-label="Volver al cliente" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><p class="text-body-2 text-medium-emphasis mb-2"><span class="text-primary">Clientes</span> <v-icon icon="mdi-chevron-right" size="small" /> {{ client.commercialName }}</p><h1 class="text-h4 font-weight-bold">Pagos</h1><p class="text-body-1 text-medium-emphasis mt-2">Consulta los pagos realizados por {{ client.commercialName }}.</p></div></div>
    <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center py-4"><v-select v-model="periodInput" :items="['TODOS', 'MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']" label="Mostrar" variant="underlined" density="compact" hide-details :disabled="!isEditingFilters" class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="searchInput" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text><v-sheet :color="isEditingFilters ? 'primary' : 'grey-darken-1'" class="py-2 px-4 text-center cursor-pointer" v-ripple @click="toggleFilters"><span class="text-caption font-weight-bold text-white text-uppercase d-flex align-center justify-center">{{ isEditingFilters ? 'Aplicar filtros' : 'Cambiar filtros' }}<v-icon icon="mdi-filter-variant" size="small" class="ml-1" /></span></v-sheet></v-card>
    <v-card border rounded="xl" elevation="0"><v-data-table :headers="headers" :items="filteredPayments" items-per-page-text="Pagos por página" page-text="{0}-{1} de {2}"><template #no-data><div class="py-8 text-center text-medium-emphasis"><v-icon icon="mdi-invoice-text" size="34" class="mb-2" /><p class="mb-0">No hay pagos que coincidan con los filtros.</p></div></template><template #item.customerUnitPrice="{ item }">{{ currency(item.customerUnitPrice) }}</template><template #item.customerTotal="{ item }">{{ currency(item.customerTotal) }}</template><template #item.svrTotal="{ item }">{{ currency(item.svrTotal) }}</template><template #item.distributorDifference="{ item }"><span class="font-weight-bold text-success">{{ currency(item.distributorDifference) }}</span></template></v-data-table></v-card>
  </section>
  <section v-else class="text-center pa-8"><p class="text-h6">No encontramos el cliente solicitado.</p><v-btn class="mt-4" color="primary" to="/distribuidor/clientes">Volver a clientes</v-btn></section>
</template>
