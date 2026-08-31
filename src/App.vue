<script setup>
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopbar from './components/layout/AppTopbar.vue'
import DistributorSidebar from './components/distributor/DistributorSidebar.vue'
import ClientSidebar from './components/client/ClientSidebar.vue'

const theme = useTheme()
const isDark = ref(false)
const route = useRoute()
const isPublicRoute = computed(() => route.meta.public === true)
const isDistributorRoute = computed(() => route.meta.role === 'distributor')
const isClientRoute = computed(() => route.meta.role === 'client')
const currentUser = computed(() => isDistributorRoute.value
  ? { initials: 'CN', name: 'Comercial Norte', role: 'Distribuidor', email: 'contacto@comercialnorte.com', id: 'DIS-0001' }
  : isClientRoute.value
    ? { initials: 'GH', name: 'Grupo Horizonte', role: 'Cliente', email: 'mariana@horizonte.com', id: 'CLI-0001' }
    : { initials: 'AD', name: 'Admin EmailPro', role: 'Administrador', email: 'admin@emailpro.com', id: 'ADM-0001' })

function toggleTheme() {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'emailProDark' : 'emailProLight'
}
</script>

<template>
  <v-app>
    <template v-if="!isPublicRoute">
      <DistributorSidebar v-if="isDistributorRoute" />
      <ClientSidebar v-else-if="isClientRoute" />
      <AppSidebar v-else />
      <AppTopbar :is-dark="isDark" :user="currentUser" @toggle-theme="toggleTheme" />
    </template>
    
    <!-- Usamos bg-background nativo de Vuetify para adaptar el fondo al tema en lugar de 'login-main' -->
    <v-main class="bg-background">
      
      <!-- Vista Pública (Login) -->
      <router-view v-if="isPublicRoute" :is-dark="isDark" @toggle-theme="toggleTheme" />
      
      <!-- Vista Privada (Dashboard) con padding dinámico de Vuetify (pa-4 en móvil, pa-6 en pantallas más grandes) en lugar de 'page-container' -->
      <v-container v-if="!isPublicRoute" fluid class="pa-4 pa-sm-6">
        <router-view />
      </v-container>

    </v-main>
  </v-app>
</template>
