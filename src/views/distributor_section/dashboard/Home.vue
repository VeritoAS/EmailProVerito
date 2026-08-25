<script setup>
import PendingInformationCard from '../../../components/distributor/PendingInformationCard.vue'
import { distributorClients } from '../../../store/distributor'
</script>

<template>
  <section>
    <div class="text-center mb-6"><p class="text-overline text-secondary font-weight-bold mb-1">DISTRIBUIDOR</p><h1 class="text-h4 font-weight-bold">Hola, Comercial Norte</h1><p class="text-body-1 text-medium-emphasis mt-2">Consulta el estado de tu cuenta y administra a tus clientes.</p></div>
    <v-row justify="center"><v-col cols="12" md="4"><v-card border rounded="xl" elevation="0"><v-card-text class="pa-5"><div class="d-flex justify-space-between align-start"><p class="text-body-2 text-medium-emphasis mb-0">Clientes registrados</p><v-icon color="primary" icon="mdi-account-group-outline" size="30" /></div><p class="text-h4 font-weight-bold text-center mt-1 mb-0">{{ distributorClients.length }}</p><p class="text-caption text-medium-emphasis mt-4 mb-0">En tu cartera actual</p></v-card-text></v-card></v-col></v-row>
    <v-row justify="center" class="mt-1"><v-col cols="12" md="6" lg="4"><PendingInformationCard /></v-col></v-row>
  </section>
</template>
