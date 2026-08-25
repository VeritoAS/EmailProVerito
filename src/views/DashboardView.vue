<script setup>
import MetricCard from '../components/dashboard/MetricCard.vue'
import ActivityPanel from '../components/dashboard/ActivityPanel.vue'

// Usamos colores semánticos de Vuetify en la data fake
const metrics = [
  { title: 'Distribuidores activos', value: '24', icon: 'mdi-handshake-outline', helper: '+3 este mes', tone: 'primary' },
  { title: 'Usuarios activos', value: '58', icon: 'mdi-account-multiple-outline', helper: 'En 24 distribuidores', tone: 'warning' },
]
</script>

<template>
  <section>
    <!-- Encabezado con márgenes y tipografías nativas -->
    <div class="mb-6">
      <p class="text-overline text-primary mb-0">VISTA GENERAL</p>
      <h1 class="text-h4 font-weight-bold mb-1">Hola</h1>
      <p class="text-body-1 text-medium-emphasis mb-0">Este es el resumen de tu espacio de trabajo.</p>
    </div>

    <v-row class="mt-2">
      <v-col v-for="metric in metrics" :key="metric.title" cols="12" md="6">
        <MetricCard v-bind="metric" />
      </v-col>
    </v-row>
    
    <v-row justify="center" class="mt-2">
      <v-col cols="12" xl="8">
        <ActivityPanel />
      </v-col>
    </v-row>
  </section>
</template>
