<script setup>
import { computed, ref } from 'vue'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import PaymentDialog from '../../../components/client/PaymentDialog.vue'
import { clientProfile, distributorDomains, distributorPayments, distributorProfile } from '../../../store/distributor'

const selectedDomain = ref(null)
const paymentDialog = ref(false)
const showPaymentConfirm = ref(false)
const showPaymentSuccess = ref(false)
const pendingPayment = ref(null)
const dataRevision = ref(0)
const searchInput = ref('')
const statusInput = ref('DISPONIBLES')
const appliedStatus = ref('DISPONIBLES')
const isEditingFilters = ref(false)
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
    const matchesStatus = appliedStatus.value === 'TODOS' || (appliedStatus.value === 'DISPONIBLES' ? item.paymentStatus === 'Disponible' : item.paymentStatus === 'No disponible')
    return matchesStatus && (!query || item.name.toLowerCase().includes(query))
  })
})
const currency = (value) => `$${Number(value).toFixed(2)} MXN`

function toggleFilters() { if (isEditingFilters.value) appliedStatus.value = statusInput.value; isEditingFilters.value = !isEditingFilters.value }
function openPayment(domain) { selectedDomain.value = domain; paymentDialog.value = true }
function requestPayment(payment) { pendingPayment.value = payment; paymentDialog.value = false; showPaymentConfirm.value = true }
function parseExpirationDate(label) {
  const [day, monthLabel, year] = label.replace('.', '').split(' ')
  const monthIndex = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 }[monthLabel.toLowerCase()]
  return new Date(Number(year), monthIndex, Number(day))
}
function confirmPayment() {
  const domain = selectedDomain.value
  const payment = pendingPayment.value
  const now = new Date()
  const nextDate = parseExpirationDate(domain.expirationDate)
  nextDate.setMonth(nextDate.getMonth() + payment.months)
  domain.expirationDate = nextDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
  distributorPayments.unshift({
    id: Date.now(), domainId: domain.id,
    paidAt: now.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
    period: payment.period, capacity: payment.capacity,
    customerUnitPrice: payment.customerUnitPrice, customerTotal: payment.customerTotal,
    svrUnitCost: distributorProfile.svrMonthlyCost,
    svrTotal: distributorProfile.svrMonthlyCost * payment.capacity * payment.months,
    distributorDifference: payment.customerTotal - (distributorProfile.svrMonthlyCost * payment.capacity * payment.months),
    newExpirationDate: domain.expirationDate,
  })
  dataRevision.value += 1
  showPaymentSuccess.value = true
}
</script>

<template>
  <section>
    <div class="d-flex align-start mb-6"><v-btn icon="mdi-arrow-left" variant="text" to="/cliente/dominios" aria-label="Volver a mis dominios" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><h1 class="text-h4 font-weight-bold">Pagos</h1><p class="text-body-1 text-medium-emphasis mt-2">Consulta la disponibilidad de pago de cada dominio.</p></div></div>
    <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center py-4"><v-select v-model="statusInput" :items="['DISPONIBLES', 'NO DISPONIBLES', 'TODOS']" label="Mostrar" variant="underlined" density="compact" hide-details :disabled="!isEditingFilters" class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="searchInput" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text><v-sheet :color="isEditingFilters ? 'primary' : 'grey-darken-1'" class="py-2 px-4 text-center cursor-pointer" v-ripple @click="toggleFilters"><span class="text-caption font-weight-bold text-white text-uppercase d-flex align-center justify-center">{{ isEditingFilters ? 'Aplicar filtros' : 'Cambiar filtros' }}<v-icon icon="mdi-filter-variant" size="small" class="ml-1" /></span></v-sheet></v-card>
    <v-card border rounded="xl" elevation="0"><v-data-table :headers="headers" :items="filteredPayments" items-per-page-text="Dominios por página" page-text="{0}-{1} de {2}"><template #no-data><div class="py-8 text-center text-medium-emphasis"><v-icon icon="mdi-invoice-text" size="34" class="mb-2" /><p class="mb-0">No hay dominios que coincidan con los filtros.</p></div></template><template #item.capacity="{ item }">{{ item.maxActiveMailboxes }} cuentas</template><template #item.monthlyPrice="{ item }">{{ currency(item.monthlyPrice) }}</template><template #item.paymentStatus="{ item }"><v-chip :color="item.paymentStatus === 'Disponible' ? '#43A047' : '#E53935'" variant="tonal" size="small">{{ item.paymentStatus }}</v-chip></template><template #item.actions="{ item }"><v-btn color="#43A047" size="small" prepend-icon="mdi-credit-card-outline" :disabled="item.paymentStatus !== 'Disponible'" @click="openPayment(item)">Pagar</v-btn></template></v-data-table></v-card>
    <PaymentDialog v-model="paymentDialog" :domain="selectedDomain" @continue="requestPayment" />
    <ConfirmDialog v-model="showPaymentConfirm" :message="pendingPayment ? `Se registrará un pago de ${currency(pendingPayment.customerTotal)} para ${selectedDomain?.name}.` : ''" @confirm="confirmPayment" />
    <v-snackbar v-model="showPaymentSuccess" color="#43A047" location="top right" timeout="4000">Pago registrado correctamente. La vigencia del dominio fue actualizada.</v-snackbar>
  </section>
</template>
