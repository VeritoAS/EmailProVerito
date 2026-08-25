<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import { distributorDomains, distributorMailboxes } from '../../../store/distributor'

const route = useRoute()
const router = useRouter()
const showConfirm = ref(false)
const domain = computed(() => distributorDomains.find((item) => item.id === Number(route.params.domainId)))
const form = ref({ localPart: '' })

function saveMailbox() {
  distributorMailboxes.push({ id: Date.now(), domainId: domain.value.id, localPart: form.value.localPart, status: 'Activa' })
  domain.value.activeMailboxes += 1
  router.push(`/distribuidor/clientes/${route.params.id}`)
}
</script>

<template>
  <section v-if="domain">
    <div class="d-flex align-start mb-6"><v-btn icon="mdi-arrow-left" variant="text" :to="`/distribuidor/clientes/${route.params.id}`" aria-label="Volver al cliente" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">CUENTAS DE CORREO</p><h1 class="text-h4 font-weight-bold">Agregar cuenta de correo</h1><p class="text-body-1 text-medium-emphasis mt-2">Registra una cuenta para {{ domain.name }}.</p></div></div>
    <v-form @submit.prevent="showConfirm = true"><v-card border rounded="xl" elevation="0"><v-card-title class="pa-6">Información de la cuenta</v-card-title><v-card-text class="px-6 pb-6"><v-row><v-col cols="12" md="6"><v-text-field v-model="form.localPart" label="Parte local" placeholder="ventas" variant="outlined" required /></v-col><v-col cols="12" md="6"><v-text-field :model-value="form.localPart ? `${form.localPart}@${domain.name}` : `usuario@${domain.name}`" label="Dirección de correo" variant="outlined" readonly /></v-col></v-row><v-alert type="info" variant="tonal" :text="`Este dominio permite hasta ${domain.maxActiveMailboxes} cuentas activas.`" /></v-card-text></v-card><div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" prepend-icon="mdi-content-save-outline">Guardar cuenta</v-btn></div></v-form>
    <ConfirmDialog v-model="showConfirm" message="Se registrará la cuenta de correo como activa." @confirm="saveMailbox" />
  </section>
</template>
