<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({ modelValue: Boolean, domain: Object })
const emit = defineEmits(['update:modelValue', 'continue'])
const selectedMonths = ref(1)
const card = ref({ number: '4111111111111111', holder: 'Mariana Soto', month: '12', year: '28', cvv: '123' })
const periods = [
  { title: 'Mensual · 1 mes', value: 1 },
  { title: 'Trimestral · 3 meses', value: 3 },
  { title: 'Semestral · 6 meses', value: 6 },
  { title: 'Anual · 12 meses', value: 12 },
]
const period = computed(() => periods.find((item) => item.value === selectedMonths.value))
const total = computed(() => (props.domain?.maxActiveMailboxes || 0) * (props.domain?.monthlyPrice || 0) * selectedMonths.value)
const isAvailable = computed(() => props.domain?.status === 'Activo' && props.domain?.paymentEligible === true)
const isCardValid = computed(() => {
  const digits = card.value.number.replace(/\D/g, '')
  return digits.length >= 13 && digits.length <= 19 && card.value.holder.trim().length > 2 && /^(0[1-9]|1[0-2])$/.test(card.value.month) && /^\d{2}$/.test(card.value.year) && /^\d{3,4}$/.test(card.value.cvv)
})
const currency = (value) => `$${Number(value).toFixed(2)} MXN`

watch(() => props.modelValue, (open) => {
  if (open) {
    selectedMonths.value = 1
    card.value = { number: '4111111111111111', holder: 'Mariana Soto', month: '12', year: '28', cvv: '123' }
  }
})

function continuePayment() {
  if (!isCardValid.value) return
  emit('continue', {
    months: selectedMonths.value,
    period: period.value.title.split(' · ')[0],
    capacity: props.domain.maxActiveMailboxes,
    customerUnitPrice: props.domain.monthlyPrice,
    customerTotal: total.value,
  })
}
function onlyNumbers(value, limit) {
  return String(value ?? '').replace(/\D/g, '').slice(0, limit)
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="980" scrollable @update:model-value="emit('update:modelValue', $event)">
    <v-card v-if="domain" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-start pa-6"><div><p class="text-overline text-secondary font-weight-bold mb-1">PAGO DE DOMINIO</p><h2 class="text-h5 font-weight-bold">{{ domain.name }}</h2><p class="text-body-2 text-medium-emphasis mt-1">Vigencia actual: {{ domain.expirationDate }}</p></div><v-btn icon="mdi-close" variant="text" aria-label="Cerrar" @click="emit('update:modelValue', false)" /></v-card-title>
      <v-card-text class="px-6 pb-6">
        <v-alert v-if="!isAvailable" type="warning" variant="tonal" text="Este dominio no está disponible para pago en este momento." />
        <template v-else>
          <h3 class="text-h6 font-weight-bold mb-4">Selecciona tu periodo de pago</h3>
          <v-radio-group v-model="selectedMonths" inline hide-details class="mb-6"><v-radio v-for="item in periods" :key="item.value" :label="item.title" :value="item.value" color="#2962FF" /></v-radio-group>
          <v-row>
            <v-col cols="12" md="5"><v-card border rounded="lg" elevation="0" height="100%"><v-card-title class="pa-5">Resumen del pago</v-card-title><v-card-text class="px-5 pb-5"><div class="d-flex justify-space-between ga-4 mb-4"><span class="text-body-2 text-medium-emphasis">Dominio</span><span class="font-weight-bold text-right">{{ domain.name }}</span></div><div class="d-flex justify-space-between ga-4 mb-4"><span class="text-body-2 text-medium-emphasis">Periodo</span><span class="font-weight-bold">{{ period.title }}</span></div><div class="d-flex justify-space-between ga-4 mb-4"><span class="text-body-2 text-medium-emphasis">Capacidad</span><span class="font-weight-bold">{{ domain.maxActiveMailboxes }} cuentas</span></div><div class="d-flex justify-space-between ga-4"><span class="text-body-2 text-medium-emphasis">Precio por cuenta</span><span class="font-weight-bold">{{ currency(domain.monthlyPrice) }}</span></div><v-divider class="my-5" /><div class="d-flex justify-space-between align-center ga-4"><span class="text-h6 font-weight-bold">Total</span><span class="text-h5 font-weight-bold text-primary">{{ currency(total) }}</span></div></v-card-text></v-card></v-col>
            <v-col cols="12" md="7"><v-card border rounded="lg" elevation="0" height="100%"><v-card-title class="pa-5 d-flex align-center ga-3"><v-icon icon="mdi-credit-card-outline" color="#2962FF" />Datos de la tarjeta</v-card-title><v-card-text class="px-5 pb-5"><v-text-field :model-value="card.number" label="Número de tarjeta" prepend-inner-icon="mdi-credit-card-outline" inputmode="numeric" type="tel" maxlength="19" variant="outlined" hide-details @update:model-value="card.number = onlyNumbers($event, 19)" /><p class="text-caption text-medium-emphasis mt-1 mb-4">Ingresa de 13 a 19 dígitos.</p><v-text-field v-model="card.holder" label="Nombre del titular" prepend-inner-icon="mdi-account-outline" variant="outlined" /><v-row><v-col cols="12" sm="4"><v-text-field :model-value="card.month" label="Mes" placeholder="MM" inputmode="numeric" type="tel" maxlength="2" variant="outlined" @update:model-value="card.month = onlyNumbers($event, 2)" /></v-col><v-col cols="12" sm="4"><v-text-field :model-value="card.year" label="Año" placeholder="AA" inputmode="numeric" type="tel" maxlength="2" variant="outlined" @update:model-value="card.year = onlyNumbers($event, 2)" /></v-col><v-col cols="12" sm="4"><v-text-field :model-value="card.cvv" label="CVV" type="password" inputmode="numeric" maxlength="4" variant="outlined" @update:model-value="card.cvv = onlyNumbers($event, 4)" /></v-col></v-row><p v-if="!isCardValid" class="text-caption text-medium-emphasis mb-0">Completa los datos de tarjeta para habilitar el pago.</p></v-card-text></v-card></v-col>
          </v-row>
          <div class="d-flex flex-column flex-sm-row justify-end ga-3 mt-5"><v-btn variant="outlined" @click="emit('update:modelValue', false)">Cancelar</v-btn><v-btn color="#43A047" prepend-icon="mdi-lock-outline" :disabled="!isCardValid" @click="continuePayment">Pagar {{ currency(total) }}</v-btn></div>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
