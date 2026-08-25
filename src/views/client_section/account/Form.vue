<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import { clientProfile } from '../../../store/distributor'

const router = useRouter()
const showConfirm = ref(false)
const form = ref({ legalName: clientProfile.commercialName, rfc: '', postalCode: '', fiscalRegime: null, cfdiUse: null })
const fiscalRegimes = ['Persona Física con Actividad Empresarial', 'Régimen Simplificado de Confianza', 'Persona Moral']
const cfdiUses = ['G03 - Gastos en general', 'S01 - Sin efectos fiscales']
function saveInformation() { clientProfile.fiscalProfileComplete = true; router.push('/cliente/mi-cuenta') }
</script>

<template>
  <section><div class="d-flex align-start mb-6"><v-btn icon="mdi-arrow-left" variant="text" to="/cliente/mi-cuenta" aria-label="Volver a mi cuenta" class="mr-2" /><div><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><h1 class="text-h4 font-weight-bold">Editar información</h1><p class="text-body-1 text-medium-emphasis mt-2">Registra tu información fiscal y uso CFDI predeterminado.</p></div></div><v-form @submit.prevent="showConfirm = true"><v-card border rounded="xl" elevation="0"><v-card-title class="pa-6">Información fiscal</v-card-title><v-card-text class="px-6 pb-6"><v-row><v-col cols="12" md="6"><v-text-field v-model="form.legalName" label="Nombre o razón social" variant="outlined" /></v-col><v-col cols="12" md="6"><v-text-field v-model="form.rfc" label="RFC" variant="outlined" /></v-col><v-col cols="12" md="6"><v-text-field v-model="form.postalCode" label="Código postal" maxlength="5" variant="outlined" /></v-col><v-col cols="12" md="6"><v-select v-model="form.fiscalRegime" :items="fiscalRegimes" label="Régimen fiscal" variant="outlined" /></v-col><v-col cols="12" md="6"><v-select v-model="form.cfdiUse" :items="cfdiUses" label="Uso CFDI predeterminado" variant="outlined" /></v-col></v-row></v-card-text></v-card><div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" prepend-icon="mdi-content-save-outline">Guardar información</v-btn></div></v-form><ConfirmDialog v-model="showConfirm" @confirm="saveInformation" /></section>
</template>
