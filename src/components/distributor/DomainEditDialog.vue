<script setup>
import { computed, ref, watch } from 'vue'
import ConfirmDialog from '../ConfirmDialog.vue'
import { distributorDomains, distributorProfile } from '../../store/distributor'

const props = defineProps({ modelValue: Boolean, domain: Object })
const emit = defineEmits(['update:modelValue', 'saved'])
const limit = ref(1)
const domainName = ref('')
const monthlyPrice = ref(0)
const showConfirm = ref(false)
const minimumMonthlyPrice = computed(() => distributorProfile.svrMonthlyCost + 1)
const normalizedDomainName = computed(() => domainName.value.trim().toLowerCase())
const isLimitInvalid = computed(() => Number(limit.value) < props.domain?.activeMailboxes)
const isPriceInvalid = computed(() => Number(monthlyPrice.value) < minimumMonthlyPrice.value)
const isDuplicate = computed(() => distributorDomains.some((item) => item.id !== props.domain?.id && item.name.toLowerCase() === normalizedDomainName.value))
const isInvalid = computed(() => !normalizedDomainName.value || isLimitInvalid.value || isDuplicate.value || isPriceInvalid.value)

watch(() => props.modelValue, (open) => {
  if (open && props.domain) {
    limit.value = props.domain.maxActiveMailboxes
    domainName.value = props.domain.name
    monthlyPrice.value = props.domain.monthlyPrice
  }
})

function save() {
  props.domain.name = normalizedDomainName.value
  props.domain.maxActiveMailboxes = Number(limit.value)
  props.domain.monthlyPrice = Number(monthlyPrice.value)
  emit('saved')
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="620" persistent @update:model-value="emit('update:modelValue', $event)">
    <v-card v-if="domain" rounded="xl">
      <v-card-title class="d-flex justify-space-between pa-6"><div><p class="text-overline text-secondary font-weight-bold mb-1">DOMINIO</p><h2 class="text-h5 font-weight-bold">Editar dominio</h2></div><v-btn icon="mdi-close" variant="text" @click="emit('update:modelValue', false)" /></v-card-title>
      <v-card-text class="px-6 pb-6">
        <v-form @submit.prevent="showConfirm = true">
          <v-text-field v-model="domainName" label="Dominio" placeholder="empresa.com" variant="outlined" :error-messages="isDuplicate ? 'Este dominio ya está registrado.' : []" />
          <v-text-field v-model="limit" type="number" min="1" label="Límite de cuentas activas" variant="outlined" />
          <v-text-field v-model="monthlyPrice" type="number" :min="minimumMonthlyPrice" label="Precio mensual por cuenta" prefix="$" suffix="MXN" variant="outlined" persistent-hint :hint="`Mínimo: $${minimumMonthlyPrice.toFixed(2)} MXN por cuenta.`" :error-messages="isPriceInvalid ? `El precio debe ser al menos $${minimumMonthlyPrice.toFixed(2)} MXN.` : []" />
          <v-alert type="info" variant="tonal" :text="`Actualmente hay ${domain.activeMailboxes} cuentas activas.`" />
          <v-alert v-if="isLimitInvalid" type="error" variant="tonal" class="mt-4" :text="`El límite no puede ser menor a ${domain.activeMailboxes}.`" />
          <div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" :disabled="isInvalid" prepend-icon="mdi-content-save-outline">Guardar cambios</v-btn></div>
        </v-form>
      </v-card-text>
    </v-card>
    <ConfirmDialog v-model="showConfirm" message="Se actualizará la configuración del dominio. El nuevo precio aplicará únicamente a pagos futuros." @confirm="save" />
  </v-dialog>
</template>
