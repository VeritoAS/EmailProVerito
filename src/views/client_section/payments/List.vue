<script setup>
import { computed, ref } from 'vue'
import { clientProfile, distributorDomains, distributorPayments } from '../../../store/distributor'

const dataRevision = ref(0)
const searchInput = ref('')
const statusInput = ref('DISPONIBLES')
const domains = computed(() => { dataRevision.value; return distributorDomains.filter((domain) => domain.clientId === clientProfile.clientId) })
const headers = [
  { title: 'Dominio', key: 'name' },
  { title: 'Vigencia', key: 'expirationDate' },
  { title: 'Capacidad', key: 'capacity', sortable: false },
  { title: 'Precio por cuenta', key: 'monthlyPrice' },
  { title: 'Último pago', key: 'lastPayment' },
  { title: 'Estado', key: 'paymentStatus' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]
const paymentRows = computed(() => domains.value.map((domain) => {
  const latest = distributorPayments.filter((payment) => payment.domainId === domain.id).sort((a, b) => b.id - a.id)[0]
  const available = domain.status === 'Activo' && domain.paymentEligible === true
  return { ...domain, latestPayment: latest, lastPayment: latest ? latest.paidAt : 'Sin pagos', paymentStatus: available ? 'Disponible' : 'No disponible' }
}))
const filteredPayments = computed(() => {
  const query = searchInput.value.trim().toLowerCase()
  return paymentRows.value.filter((item) => {
    const matchesStatus = statusInput.value === 'TODOS' || (statusInput.value === 'DISPONIBLES' ? item.paymentStatus === 'Disponible' : item.paymentStatus === 'No disponible')
    return matchesStatus && (!query || item.name.toLowerCase().includes(query))
  })
})
const currency = (value) => `$${Number(value).toFixed(2)} MXN`
</script>

<template>
  <section>
    <div class="d-flex align-start mb-6"><v-btn icon="mdi-arrow-left" variant="text" to="/cliente/dominios" aria-label="Volver a mis dominios" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><h1 class="text-h4 font-weight-bold">Pagos</h1><p class="text-body-1 text-medium-emphasis mt-2">Consulta la disponibilidad de pago de cada dominio.</p></div></div>
    <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center ga-4 py-4"><v-select v-model="statusInput" :items="['DISPONIBLES', 'NO DISPONIBLES', 'TODOS']" label="Mostrar" variant="underlined" density="compact" hide-details class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="searchInput" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text></v-card>
    <v-card border rounded="xl" elevation="0"><v-data-table :headers="headers" :items="filteredPayments" items-per-page-text="Dominios por página" page-text="{0}-{1} de {2}"><template #no-data><div class="py-8 text-center text-medium-emphasis"><v-icon icon="mdi-invoice-text" size="34" class="mb-2" /><p class="mb-0">No hay dominios que coincidan con los filtros.</p></div></template><template #item.capacity="{ item }">{{ item.maxActiveMailboxes }} cuentas</template><template #item.monthlyPrice="{ item }">{{ currency(item.monthlyPrice) }}</template><template #item.paymentStatus="{ item }"><v-chip :color="item.paymentStatus === 'Disponible' ? '#43A047' : '#E53935'" variant="tonal" size="small">{{ item.paymentStatus }}</v-chip></template><template #item.actions="{ item }"><v-btn color="#43A047" size="small" prepend-icon="mdi-credit-card-outline" :disabled="item.paymentStatus !== 'Disponible'" :to="`/cliente/pagos/${item.id}/pagar`">Pagar</v-btn></template></v-data-table></v-card>
  </section>
</template>
