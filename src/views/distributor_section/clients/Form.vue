<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { distributorClients } from '../../../store/distributor'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'

const router = useRouter()
const showConfirm = ref(false)
const form = ref({ commercialName: '', firstName: '', paternalLastName: '', maternalLastName: '', email: '' })
function registerClient() {
  distributorClients.push({
    id: Date.now(),
    commercialName: form.value.commercialName,
    responsible: [form.value.firstName, form.value.paternalLastName, form.value.maternalLastName].filter(Boolean).join(' '),
    email: form.value.email,
    fiscalProfile: 'Pendiente',
    accountStatus: 'Pendiente',
  })
  router.push('/distribuidor/clientes')
}
</script>

<template>
  <section><div class="d-flex align-start mb-6"><v-btn icon="mdi-arrow-left" variant="text" to="/distribuidor/clientes" aria-label="Volver a clientes" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">DISTRIBUIDOR</p><div class="d-flex align-center"><v-icon icon="mdi-account-group-outline" size="30" class="mr-3 text-medium-emphasis" /><h1 class="text-h4 font-weight-bold">Agregar cliente</h1></div><p class="text-body-1 text-medium-emphasis mt-2">Registra el nombre comercial y la cuenta responsable del cliente.</p></div></div><v-form @submit.prevent="showConfirm = true"><v-row><v-col cols="12"><v-card border rounded="xl" elevation="0" class="mb-5"><v-card-title class="pa-6">Información del cliente</v-card-title><v-card-text class="px-6 pb-6"><v-text-field v-model="form.commercialName" label="Nombre comercial" variant="outlined" required /></v-card-text></v-card><v-card border rounded="xl" elevation="0"><v-card-title class="pa-6">Cuenta responsable</v-card-title><v-card-text class="px-6 pb-6"><v-row><v-col cols="12" md="6"><v-text-field v-model="form.firstName" label="Nombre" variant="outlined" required /></v-col><v-col cols="12" md="6"><v-text-field v-model="form.paternalLastName" label="Apellido paterno" variant="outlined" required /></v-col><v-col cols="12" md="6"><v-text-field v-model="form.maternalLastName" label="Apellido materno" variant="outlined" /></v-col><v-col cols="12" md="6"><v-text-field v-model="form.email" label="Correo electrónico" type="email" variant="outlined" required /></v-col></v-row><v-alert type="info" variant="tonal" text="La cuenta se registrará con rol Cliente y recibirá un correo de confirmación para establecer su contraseña." /></v-card-text></v-card><div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" prepend-icon="mdi-account-plus-outline">Registrar cliente</v-btn></div></v-col></v-row></v-form><ConfirmDialog v-model="showConfirm" message="Se registrará el cliente y se enviará la invitación de acceso." @confirm="registerClient" /></section>
</template>
