<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import { clientProfile, distributorDomains, distributorPayments } from '../../../store/distributor'

const route = useRoute()
const showInvoiceConfirm = ref(false)
const selectedInvoice = ref(null)
const showSuccess = ref(false)
const successMessage = ref('')
const dataRevision = ref(0)
const searchInput = ref('')
const termInput = ref('TODOS')
const appliedTerm = ref('TODOS')
const isEditingFilters = ref(false)

const domain = computed(() => distributorDomains.find((item) => item.id === Number(route.params.domainId) && item.clientId === clientProfile.clientId))
const headers = [
  { title: 'Periodo de pago', key: 'payment_term_id' },
  { title: 'Cuentas pagadas', key: 'mailbox_quantity' },
  { title: 'Monto pagado', key: 'gross_amount' },
  { title: 'Expiración anterior', key: 'previous_expires_at' },
  { title: 'Nueva expiración', key: 'new_expires_at' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]
const payments = computed(() => {
  dataRevision.value
  return distributorPayments.filter((item) => item.domainId === domain.value?.id).sort((a, b) => b.id - a.id)
})
const filteredPayments = computed(() => {
  const query = searchInput.value.trim().toLowerCase()
  return payments.value.filter((item) => {
    const matchesTerm = appliedTerm.value === 'TODOS' || item.payment_term_id?.toUpperCase() === appliedTerm.value
    const searchable = `${item.payment_term_id} ${item.previous_expires_at} ${item.new_expires_at}`.toLowerCase()
    return matchesTerm && (!query || searchable.includes(query))
  })
})
const canPay = computed(() => domain.value?.status === 'Activo' && domain.value?.paymentEligible === true)
const currency = (value) => `$${Number(value).toFixed(2)} MXN`

function toggleFilters() {
  if (isEditingFilters.value) appliedTerm.value = termInput.value
  isEditingFilters.value = !isEditingFilters.value
}
function requestInvoice(payment) {
  selectedInvoice.value = payment
  showInvoiceConfirm.value = true
}
function generateInvoice() {
  selectedInvoice.value.invoiceStatus = 'generated'
  dataRevision.value += 1
  successMessage.value = 'Factura generada correctamente.'
  showSuccess.value = true
}
function download(type) {
  successMessage.value = `Archivo ${type} preparado correctamente.`
  showSuccess.value = true
}
</script>

<template>
  <section v-if="domain">
    <div class="d-flex align-start justify-space-between flex-wrap ga-3 mb-6">
      <div class="d-flex align-start"><v-btn icon="mdi-arrow-left" variant="text" to="/cliente/dominios" aria-label="Volver a mis dominios" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><h1 class="text-h4 font-weight-bold">Pagos de {{ domain.name }}</h1><p class="text-body-1 text-medium-emphasis mt-2">Consulta tu historial de pagos y descarga tus comprobantes.</p></div></div>
      <v-btn color="#43A047" prepend-icon="mdi-credit-card-outline" :disabled="!canPay" :to="`/cliente/pagos/${domain.id}/pagar`">Pagar</v-btn>
    </div>

    <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center py-4"><v-select v-model="termInput" :items="['TODOS', 'MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']" label="Mostrar" variant="underlined" density="compact" hide-details :disabled="!isEditingFilters" class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="searchInput" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text><v-sheet :color="isEditingFilters ? 'primary' : 'grey-darken-1'" class="py-2 px-4 text-center cursor-pointer" v-ripple @click="toggleFilters"><span class="text-caption font-weight-bold text-white text-uppercase d-flex align-center justify-center">{{ isEditingFilters ? 'Aplicar filtros' : 'Cambiar filtros' }}<v-icon icon="mdi-filter-variant" size="small" class="ml-1" /></span></v-sheet></v-card>
    <v-card border rounded="xl" elevation="0"><v-data-table :headers="headers" :items="filteredPayments" items-per-page-text="Pagos por página" page-text="{0}-{1} de {2}"><template #no-data><div class="py-8 text-center text-medium-emphasis"><v-icon icon="mdi-invoice-text-outline" size="34" class="mb-2" /><p class="mb-0">Aún no hay pagos registrados para este dominio.</p></div></template><template #item.gross_amount="{ item }">{{ currency(item.gross_amount) }}</template><template #item.actions="{ item }"><template v-if="item.invoiceStatus === 'generated'"><v-tooltip text="Descargar PDF" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-file-pdf-box" color="#E53935" variant="text" size="small" aria-label="Descargar PDF" @click="download('PDF')" /></template></v-tooltip><v-tooltip text="Descargar XML" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-file-xml-box" color="#26A69A" variant="text" size="small" aria-label="Descargar XML" @click="download('XML')" /></template></v-tooltip></template><v-tooltip v-else text="Generar factura" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-file-document-plus-outline" color="#FFB300" variant="text" size="small" aria-label="Generar factura" @click="requestInvoice(item)" /></template></v-tooltip></template></v-data-table></v-card>
    <ConfirmDialog v-model="showInvoiceConfirm" title="¿Quieres generar la factura?" message="Se habilitarán los archivos PDF y XML de este pago." @confirm="generateInvoice" />
    <v-snackbar v-model="showSuccess" color="#43A047" location="top right" timeout="4000">{{ successMessage }}</v-snackbar>
  </section>
  <section v-else class="text-center py-16"><v-icon icon="mdi-earth-off" size="48" class="text-medium-emphasis mb-3" /><h1 class="text-h5 font-weight-bold">Dominio no encontrado</h1><v-btn color="#2962FF" class="mt-4" to="/cliente/dominios">Volver a mis dominios</v-btn></section>
</template>
