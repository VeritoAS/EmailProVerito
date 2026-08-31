<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import { clientProfile, distributorDomains, distributorPayments, distributorProfile } from '../../../store/distributor'

const route = useRoute()
const showConfirm = ref(false)
const showSuccess = ref(false)
const paymentRecorded = ref(false)
const selectedMonths = ref(1)
const card = ref({ number: '4111111111111111', holder: 'Mariana Soto', month: '12', year: '28', cvv: '123' })
const fiscalForm = ref({ commercialName: '', rfc: '', postalCode: '', fiscalRegime: null, cfdiUse: null, ...(clientProfile.fiscalData || {}) })

const periods = [
  { title: 'Mensual · 1 mes', value: 1, label: 'Mensual' },
  { title: 'Trimestral · 3 meses', value: 3, label: 'Trimestral' },
  { title: 'Semestral · 6 meses', value: 6, label: 'Semestral' },
  { title: 'Anual · 12 meses', value: 12, label: 'Anual' },
]
const fiscalRegimes = ['Régimen General de Ley Personas Morales', 'Régimen Simplificado de Confianza', 'Personas Físicas con Actividades Empresariales']
const cfdiUses = ['G03 - Gastos en general', 'S01 - Sin efectos fiscales', 'D01 - Honorarios médicos, dentales y gastos hospitalarios']
const domain = computed(() => distributorDomains.find((item) => item.id === Number(route.params.domainId) && item.clientId === clientProfile.clientId))
const selectedPeriod = computed(() => periods.find((item) => item.value === selectedMonths.value))
const total = computed(() => (domain.value?.maxActiveMailboxes || 0) * (domain.value?.monthlyPrice || 0) * selectedMonths.value)
const isCardValid = computed(() => {
  const digits = card.value.number.replace(/\D/g, '')
  return digits.length >= 13 && digits.length <= 19 && card.value.holder.trim().length > 2 && /^(0[1-9]|1[0-2])$/.test(card.value.month) && /^\d{2}$/.test(card.value.year) && /^\d{3,4}$/.test(card.value.cvv)
})
const isFiscalValid = computed(() => fiscalForm.value.commercialName.trim().length > 2 && fiscalForm.value.rfc.trim().length >= 12 && /^\d{5}$/.test(fiscalForm.value.postalCode) && fiscalForm.value.fiscalRegime && fiscalForm.value.cfdiUse)
const canSubmit = computed(() => !paymentRecorded.value && isCardValid.value && isFiscalValid.value)
const currency = (value) => `$${Number(value).toFixed(2)} MXN`

function onlyNumbers(value, limit) {
  return String(value ?? '').replace(/\D/g, '').slice(0, limit)
}
function parseExpirationDate(label) {
  const [day, monthLabel, year] = label.replace('.', '').split(' ')
  const monthIndex = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 }[monthLabel.toLowerCase()]
  return new Date(Number(year), monthIndex, Number(day))
}
function requestPayment() {
  if (canSubmit.value) showConfirm.value = true
}
function confirmPayment() {
  const selectedDomain = domain.value
  const previousExpiration = selectedDomain.expirationDate
  const expiresAt = parseExpirationDate(previousExpiration)
  const now = new Date()
  const baseDate = expiresAt > now ? expiresAt : now
  const nextDate = new Date(baseDate)
  nextDate.setMonth(nextDate.getMonth() + selectedMonths.value)
  selectedDomain.expirationDate = nextDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
  const svrTotal = distributorProfile.svrMonthlyCost * selectedDomain.maxActiveMailboxes * selectedMonths.value
  distributorPayments.unshift({
    id: Date.now(),
    domainId: selectedDomain.id,
    paidAt: now.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
    payment_term_id: selectedPeriod.value.label,
    mailbox_quantity: selectedDomain.maxActiveMailboxes,
    customer_unit_price: selectedDomain.monthlyPrice,
    distributor_unit_cost: distributorProfile.svrMonthlyCost,
    months: selectedMonths.value,
    gross_amount: total.value,
    svr_amount: svrTotal,
    distributor_amount: total.value - svrTotal,
    external_transaction_id: `SIM-${Date.now()}`,
    previous_expires_at: previousExpiration,
    new_expires_at: selectedDomain.expirationDate,
    invoiceStatus: 'generated',
    period: selectedPeriod.value.label,
    capacity: selectedDomain.maxActiveMailboxes,
    customerUnitPrice: selectedDomain.monthlyPrice,
    customerTotal: total.value,
    svrUnitCost: distributorProfile.svrMonthlyCost,
    svrTotal,
    distributorDifference: total.value - svrTotal,
    newExpirationDate: selectedDomain.expirationDate,
  })
  clientProfile.fiscalProfileComplete = true
  clientProfile.fiscalData = { ...fiscalForm.value }
  paymentRecorded.value = true
  showSuccess.value = true
}
</script>

<template>
  <section v-if="domain">
    <div class="d-flex align-start mb-6"><v-btn icon="mdi-arrow-left" variant="text" :to="`/cliente/pagos/${domain.id}`" aria-label="Volver al historial de pagos" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><h1 class="text-h4 font-weight-bold">Pagar {{ domain.name }}</h1><p class="text-body-1 text-medium-emphasis mt-2">Selecciona tu periodo y confirma tus datos.</p></div></div>
    <v-row>
      <v-col cols="12" lg="4"><v-card border rounded="xl" elevation="0"><v-card-title class="pa-6">Resumen del pago</v-card-title><v-card-text class="px-6 pb-6"><div class="d-flex justify-space-between ga-4 mb-5"><span class="text-body-2 text-medium-emphasis">Dominio</span><span class="font-weight-bold text-right">{{ domain.name }}</span></div><div class="d-flex justify-space-between ga-4 mb-5"><span class="text-body-2 text-medium-emphasis">Capacidad</span><span class="font-weight-bold">{{ domain.maxActiveMailboxes }} cuentas</span></div><div class="d-flex justify-space-between ga-4 mb-6"><span class="text-body-2 text-medium-emphasis">Precio por cuenta</span><span class="font-weight-bold">{{ currency(domain.monthlyPrice) }}</span></div><v-select v-model="selectedMonths" :items="periods" item-title="title" item-value="value" label="Periodo de pago" variant="outlined" hide-details /><v-divider class="my-6" /><div class="d-flex justify-space-between align-center"><span class="text-h6 font-weight-bold">Total</span><span class="text-h5 font-weight-bold text-primary">{{ currency(total) }}</span></div></v-card-text></v-card></v-col>
      <v-col cols="12" lg="8"><v-card border rounded="xl" elevation="0" class="mb-5"><v-card-title class="pa-6">Datos de facturación</v-card-title><v-card-text class="px-6 pb-6"><v-alert type="info" variant="tonal" class="mb-5" text="La factura se generará con esta información. Puedes actualizarla antes de pagar." /><v-row><v-col cols="12" md="7"><v-text-field v-model="fiscalForm.commercialName" label="Razón social" variant="outlined" required /></v-col><v-col cols="12" md="5"><v-text-field v-model="fiscalForm.rfc" label="RFC" variant="outlined" required /></v-col><v-col cols="12" md="4"><v-text-field :model-value="fiscalForm.postalCode" label="Código postal" inputmode="numeric" maxlength="5" variant="outlined" :error-messages="fiscalForm.postalCode && !/^\d{5}$/.test(fiscalForm.postalCode) ? 'Ingresa 5 dígitos.' : []" @update:model-value="fiscalForm.postalCode = onlyNumbers($event, 5)" required /></v-col><v-col cols="12" md="8"><v-select v-model="fiscalForm.fiscalRegime" :items="fiscalRegimes" label="Régimen fiscal" variant="outlined" required /></v-col><v-col cols="12"><v-select v-model="fiscalForm.cfdiUse" :items="cfdiUses" label="Uso CFDI" variant="outlined" required /></v-col></v-row><p class="text-caption text-medium-emphasis mb-0">Estos datos se guardarán al confirmar el pago.</p></v-card-text></v-card>
      <v-card border rounded="xl" elevation="0"><v-card-title class="pa-6 d-flex align-center ga-3"><v-icon icon="mdi-credit-card-outline" color="#2962FF" />Datos de la tarjeta</v-card-title><v-card-text class="px-6 pb-6"><v-text-field :model-value="card.number" label="Número de tarjeta" prepend-inner-icon="mdi-credit-card-outline" inputmode="numeric" type="tel" maxlength="19" variant="outlined" hide-details @update:model-value="card.number = onlyNumbers($event, 19)" /><p class="text-caption text-medium-emphasis mt-1 mb-4">Ingresa de 13 a 19 dígitos.</p><v-text-field v-model="card.holder" label="Nombre del titular" prepend-inner-icon="mdi-account-outline" variant="outlined" /><v-row><v-col cols="12" sm="4"><v-text-field :model-value="card.month" label="Mes" placeholder="MM" inputmode="numeric" type="tel" maxlength="2" variant="outlined" @update:model-value="card.month = onlyNumbers($event, 2)" /></v-col><v-col cols="12" sm="4"><v-text-field :model-value="card.year" label="Año" placeholder="AA" inputmode="numeric" type="tel" maxlength="2" variant="outlined" @update:model-value="card.year = onlyNumbers($event, 2)" /></v-col><v-col cols="12" sm="4"><v-text-field :model-value="card.cvv" label="CVV" type="password" inputmode="numeric" maxlength="4" variant="outlined" @update:model-value="card.cvv = onlyNumbers($event, 4)" /></v-col></v-row><p v-if="!isCardValid" class="text-caption text-medium-emphasis mb-0">Completa los datos de tarjeta para habilitar el pago.</p></v-card-text></v-card></v-col>
    </v-row>
    <div class="d-flex flex-column flex-sm-row justify-end ga-3 mt-6"><v-btn variant="outlined" :to="`/cliente/pagos/${domain.id}`">Cancelar</v-btn><v-btn v-if="!paymentRecorded" color="#43A047" prepend-icon="mdi-lock-outline" :disabled="!canSubmit" @click="requestPayment">Pagar {{ currency(total) }}</v-btn><v-btn v-else color="#2962FF" :to="`/cliente/pagos/${domain.id}`">Ver historial de pagos</v-btn></div>
    <ConfirmDialog v-model="showConfirm" :message="`Se registrará un pago de ${currency(total)} para ${domain.name} y se guardarán los datos fiscales indicados.`" @confirm="confirmPayment" />
    <v-snackbar v-model="showSuccess" color="#43A047" location="top right" timeout="5000">Pago registrado correctamente. La vigencia del dominio fue actualizada.</v-snackbar>
  </section>
  <section v-else class="text-center py-16"><v-icon icon="mdi-earth-off" size="48" class="text-medium-emphasis mb-3" /><h1 class="text-h5 font-weight-bold">Dominio no encontrado</h1><v-btn color="#2962FF" class="mt-4" to="/cliente/dominios">Volver a mis dominios</v-btn></section>
</template>
