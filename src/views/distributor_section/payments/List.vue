<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import { distributorClients, distributorDomains, distributorPayments } from '../../../store/distributor'

const route = useRoute()
const searchInput = ref('')
const periodInput = ref('TODOS')
const showInvoiceConfirm = ref(false)
const selectedPayment = ref(null)
const showSuccess = ref(false)
const dataRevision = ref(0)
const client = computed(() => distributorClients.find((item) => item.id === Number(route.params.id)))
const domainNames = computed(() => Object.fromEntries(distributorDomains.filter((item) => item.clientId === Number(route.params.id)).map((item) => [item.id, item.name])))
const payments = computed(() => {
  dataRevision.value
  return distributorPayments.filter((item) => domainNames.value[item.domainId]).map((item) => ({ ...item, domain: domainNames.value[item.domainId] }))
})
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
  { title: 'Factura', key: 'invoice', sortable: false, align: 'end' },
]
const filteredPayments = computed(() => {
  const query = searchInput.value.trim().toLowerCase()
  return payments.value.filter((payment) => {
    const matchesPeriod = periodInput.value === 'TODOS' || payment.period.toUpperCase() === periodInput.value
    return matchesPeriod && (!query || Object.values(payment).join(' ').toLowerCase().includes(query))
  })
})
const currency = (value) => `$${Number(value).toFixed(2)} MXN`

function requestInvoice(payment) {
  selectedPayment.value = payment
  showInvoiceConfirm.value = true
}

function generateInvoice() {
  const payment = distributorPayments.find((item) => item.id === selectedPayment.value?.id)
  if (!payment) return
  payment.invoiceStatus = 'generated'
  dataRevision.value += 1
  showSuccess.value = true
}
</script>

<template>
  <section v-if="client">
    <div class="d-flex align-start mb-6"><v-btn icon="mdi-arrow-left" variant="text" :to="`/distribuidor/clientes/${client.id}`" aria-label="Volver al cliente" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><p class="text-body-2 text-medium-emphasis mb-2"><span class="text-primary">Clientes</span> <v-icon icon="mdi-chevron-right" size="small" /> {{ client.commercialName }}</p><h1 class="text-h4 font-weight-bold">Pagos</h1><p class="text-body-1 text-medium-emphasis mt-2">Consulta los pagos realizados por {{ client.commercialName }}.</p></div></div>
    <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center ga-4 py-4"><v-select v-model="periodInput" :items="['TODOS', 'MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']" label="Mostrar" variant="underlined" density="compact" hide-details class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="searchInput" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text></v-card>
    <v-card border rounded="xl" elevation="0"><v-data-table :headers="headers" :items="filteredPayments" items-per-page-text="Pagos por página" page-text="{0}-{1} de {2}"><template #no-data><div class="py-8 text-center text-medium-emphasis"><v-icon icon="mdi-invoice-text" size="34" class="mb-2" /><p class="mb-0">No hay pagos que coincidan con los filtros.</p></div></template><template #item.customerUnitPrice="{ item }">{{ currency(item.customerUnitPrice) }}</template><template #item.customerTotal="{ item }">{{ currency(item.customerTotal) }}</template><template #item.svrTotal="{ item }">{{ currency(item.svrTotal) }}</template><template #item.distributorDifference="{ item }"><span class="font-weight-bold text-success">{{ currency(item.distributorDifference) }}</span></template><template #item.invoice="{ item }"><v-chip v-if="item.invoiceStatus === 'generated'" color="#43A047" prepend-icon="mdi-check-circle-outline" size="small" variant="tonal">Factura generada</v-chip><v-tooltip v-else text="Generar factura" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-file-document-plus-outline" color="#FFB300" variant="text" size="small" aria-label="Generar factura" @click="requestInvoice(item)" /></template></v-tooltip></template></v-data-table></v-card>
    <ConfirmDialog v-model="showInvoiceConfirm" title="¿Quieres generar la factura?" message="La factura quedará registrada para este pago." @confirm="generateInvoice" />
    <v-snackbar v-model="showSuccess" color="#43A047" location="top right" timeout="4000">Factura generada correctamente.</v-snackbar>
  </section>
  <section v-else class="text-center pa-8"><p class="text-h6">No encontramos el cliente solicitado.</p><v-btn class="mt-4" color="primary" to="/distribuidor/clientes">Volver a clientes</v-btn></section>
</template>
