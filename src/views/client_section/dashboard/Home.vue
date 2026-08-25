<script setup>
import { computed } from 'vue'
import { clientProfile, distributorDomains, distributorMailboxes } from '../../../store/distributor'

const domains = computed(() => distributorDomains.filter((domain) => domain.clientId === clientProfile.clientId))
const activeMailboxes = computed(() => distributorMailboxes.filter((mailbox) => domains.value.some((domain) => domain.id === mailbox.domainId) && mailbox.status === 'Activa').length)
</script>

<template>
  <section>
    <div class="text-center mb-7"><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><h1 class="text-h4 font-weight-bold">Hola, {{ clientProfile.commercialName }}</h1><p class="text-body-1 text-medium-emphasis mt-2">Consulta tus dominios y administra tus cuentas de correo.</p></div>
    <v-row justify="center"><v-col cols="12" md="5"><v-card border rounded="xl" elevation="0"><v-card-text class="pa-5"><div class="d-flex justify-space-between align-start"><p class="text-body-2 text-medium-emphasis mb-0">Mis dominios</p><v-icon color="primary" icon="mdi-earth" size="30" /></div><p class="text-h4 font-weight-bold text-center mt-1 mb-0">{{ domains.length }}</p><p class="text-caption text-medium-emphasis mt-4 mb-0">Dominios disponibles para consulta</p></v-card-text></v-card></v-col><v-col cols="12" md="5"><v-card border rounded="xl" elevation="0"><v-card-text class="pa-5"><div class="d-flex justify-space-between align-start"><p class="text-body-2 text-medium-emphasis mb-0">Cuentas activas</p><v-icon color="primary" icon="mdi-email-outline" size="30" /></div><p class="text-h4 font-weight-bold text-center mt-1 mb-0">{{ activeMailboxes }}</p><p class="text-caption text-medium-emphasis mt-4 mb-0">En todos tus dominios</p></v-card-text></v-card></v-col></v-row>
    <v-row justify="center" class="mt-2"><v-col cols="12" md="6"><v-card border rounded="xl" elevation="0"><v-card-text class="pa-5"><div class="d-flex justify-space-between align-start"><div><h2 class="text-h6 font-weight-bold">Información fiscal</h2><p class="text-body-2 text-medium-emphasis mt-1">{{ clientProfile.fiscalProfileComplete ? 'Tu información fiscal está completa.' : 'Completa tu información fiscal para finalizar tu registro.' }}</p></div><v-icon :color="clientProfile.fiscalProfileComplete ? '#43A047' : '#FFB300'" icon="mdi-file-document-outline" size="30" /></div><div class="d-flex justify-center mt-4"><v-btn :color="clientProfile.fiscalProfileComplete ? '#43A047' : '#FFB300'" to="/cliente/mi-cuenta">{{ clientProfile.fiscalProfileComplete ? 'Consultar información' : 'Completar información' }}</v-btn></div></v-card-text></v-card></v-col></v-row>
  </section>
</template>
