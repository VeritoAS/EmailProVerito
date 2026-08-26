<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminDistributors } from '../../data/adminDistributors'

const route = useRoute()
const router = useRouter()
const distributor = computed(() => adminDistributors.value.find((item) => item.id === Number(route.params.id)))
</script>

<template>
  <section v-if="distributor">
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center"><v-btn icon="mdi-arrow-left" variant="text" class="mr-4" @click="router.push('/distribuidores')" /><div><p class="text-overline text-primary mb-0">DETALLE DE DISTRIBUIDOR</p><h1 class="text-h5 font-weight-bold mb-0">{{ distributor.name }}</h1></div></div>
      <v-btn color="#FFB300" prepend-icon="mdi-pencil-outline" :to="`/distribuidores/${distributor.id}/editar`">Editar</v-btn>
    </div>

    <v-row align="stretch">
      <v-col cols="12" md="6"><v-card border elevation="0" rounded="lg" class="h-100"><v-card-title class="pa-4 border-b font-weight-bold"><v-icon icon="mdi-account-tie-outline" color="primary" class="mr-2" />Información comercial y cuenta</v-card-title><v-card-text class="pa-6"><div class="mb-4"><span class="text-caption text-medium-emphasis d-block">Nombre comercial</span><span class="text-body-1 font-weight-medium">{{ distributor.name }}</span></div><div class="mb-4"><span class="text-caption text-medium-emphasis d-block">Responsable</span><span class="text-body-1">{{ distributor.responsible }}</span></div><div class="mb-4"><span class="text-caption text-medium-emphasis d-block">Correo de acceso</span><span class="text-body-1">{{ distributor.user }}</span></div><div><span class="text-caption text-medium-emphasis d-block">Fecha de registro</span><span class="text-body-1">{{ distributor.registeredAt }}</span></div></v-card-text></v-card></v-col>
      <v-col cols="12" md="6"><v-card border elevation="0" rounded="lg" class="h-100"><v-card-title class="pa-4 border-b font-weight-bold"><v-icon icon="mdi-cash-multiple" color="primary" class="mr-2" />Costo asignado por SVR</v-card-title><v-card-text class="pa-6"><span class="text-caption text-medium-emphasis d-block">Costo mensual por cuenta</span><p class="text-h5 font-weight-bold mb-0">${{ Number(distributor.monthlyCost).toFixed(2) }} MXN</p></v-card-text></v-card></v-col>
      <v-col cols="12" md="6"><v-card border elevation="0" rounded="lg" class="h-100"><v-card-title class="pa-4 border-b font-weight-bold"><v-icon icon="mdi-file-document-outline" color="primary" class="mr-2" />Información fiscal</v-card-title><v-card-text class="pa-6"><template v-if="distributor.fiscal"><v-row><v-col cols="12" md="6"><span class="text-caption text-medium-emphasis d-block">Razón social</span><span class="text-body-1">{{ distributor.fiscal.legalName }}</span></v-col><v-col cols="12" md="6"><span class="text-caption text-medium-emphasis d-block">RFC</span><span class="text-body-1">{{ distributor.fiscal.rfc }}</span></v-col><v-col cols="12" md="6"><span class="text-caption text-medium-emphasis d-block">Código postal</span><span class="text-body-1">{{ distributor.fiscal.postalCode }}</span></v-col><v-col cols="12" md="6"><span class="text-caption text-medium-emphasis d-block">Régimen fiscal</span><span class="text-body-1">{{ distributor.fiscal.fiscalRegime }}</span></v-col><v-col cols="12"><span class="text-caption text-medium-emphasis d-block">Uso CFDI predeterminado</span><span class="text-body-1">{{ distributor.fiscal.cfdiUse }}</span></v-col></v-row></template><v-alert v-else type="warning" variant="tonal" text="El distribuidor aún no ha registrado su información fiscal." /></v-card-text></v-card></v-col>
      <v-col cols="12" md="6"><v-card border elevation="0" rounded="lg" class="h-100"><v-card-title class="pa-4 border-b font-weight-bold"><v-icon icon="mdi-bank-outline" color="primary" class="mr-2" />CLABE para depósitos</v-card-title><v-card-text class="pa-6"><template v-if="distributor.clabe"><span class="text-caption text-medium-emphasis d-block">CLABE interbancaria</span><span class="text-h6 font-weight-medium">{{ distributor.clabe }}</span></template><v-alert v-else type="warning" variant="tonal" text="El distribuidor aún no ha registrado una CLABE." /></v-card-text></v-card></v-col>
    </v-row>
  </section>
  <section v-else class="text-center pa-8"><p class="text-h6">No encontramos el distribuidor solicitado.</p><v-btn color="primary" to="/distribuidores">Volver a distribuidores</v-btn></section>
</template>
