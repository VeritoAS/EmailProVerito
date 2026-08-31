<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const navigation = [
  { title: 'Inicio', icon: 'mdi-home-outline', to: '/cliente' },
  { title: 'Mis dominios', icon: 'mdi-earth', to: '/cliente/dominios' },
  { title: 'Mi cuenta', icon: 'mdi-account-circle-outline', to: '/cliente/mi-cuenta' },
]
</script>

<template>
  <v-navigation-drawer rail expand-on-hover :width="252" :rail-width="80" permanent class="border-e">
    <v-list nav density="comfortable" class="px-3 pt-3"><v-list-item v-for="item in navigation" :key="item.title" :to="item.to" :active="route.path === item.to" :prepend-icon="item.icon" :title="item.title" rounded="lg" class="mb-2" /></v-list>
  </v-navigation-drawer>
</template>
