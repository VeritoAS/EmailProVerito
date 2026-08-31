<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// Data fake lista para el maquetado
const navigation = [
  { title: 'Inicio', icon: 'mdi-home-outline', to: '/' },
  { title: 'Distribuidores', icon: 'mdi-handshake-outline', to: '/distribuidores' },
  { title: 'Usuarios', icon: 'mdi-account-multiple-outline', to: '/usuarios' },
  { title: 'Configuración', icon: 'mdi-cog-outline', to: '/configuracion' },
]
</script>

<template>
  <v-navigation-drawer rail expand-on-hover :width="252" :rail-width="80" permanent>
    <v-list nav density="comfortable" class="px-2 pt-3">
      <v-list-item
        v-for="item in navigation"
        :key="item.title"
        :to="item.to"
        :active="route.path === item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="lg"
        color="primary"
      />
    </v-list>
  </v-navigation-drawer>
</template>
