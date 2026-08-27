<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { adminUsers } from '../../data/adminUsers'

const route = useRoute()
const user = computed(() => adminUsers.value.find((item) => item.id === Number(route.params.id)))
const statusColor = (status) => status === 'Activa' ? '#43A047' : status === 'Inactiva' ? '#E53935' : '#FFB300'
</script>

<template>
  <section v-if="user">
    <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center ga-4 mb-6"><div class="d-flex align-center"><v-btn icon="mdi-arrow-left" variant="text" to="/usuarios" aria-label="Volver a usuarios" class="mr-4" /><div><p class="text-overline text-secondary font-weight-bold mb-1">DETALLE DE USUARIO</p><h1 class="text-h5 font-weight-bold mb-0">{{ user.fullName }}</h1></div></div><v-btn color="#FFB300" prepend-icon="mdi-pencil-outline" :to="`/usuarios/${user.id}/editar`">Editar</v-btn></div>
    <v-card border rounded="xl" elevation="0"><v-card-title class="pa-5 border-b font-weight-bold"><v-icon icon="mdi-account-outline" color="primary" class="mr-2" />Información del usuario y cuenta de acceso</v-card-title><v-card-text class="pa-6"><v-row><v-col cols="12" sm="6" md="4"><span class="text-caption text-medium-emphasis d-block">Nombre(s)</span><span class="text-body-1">{{ user.firstName }}</span></v-col><v-col cols="12" sm="6" md="4"><span class="text-caption text-medium-emphasis d-block">Apellido paterno</span><span class="text-body-1">{{ user.lastName }}</span></v-col><v-col cols="12" sm="6" md="4"><span class="text-caption text-medium-emphasis d-block">Apellido materno</span><span class="text-body-1">{{ user.secondLastName || 'No registrado' }}</span></v-col><v-col cols="12" sm="6" md="4"><span class="text-caption text-medium-emphasis d-block">Correo electrónico</span><span class="text-body-1">{{ user.email }}</span></v-col><v-col cols="12" sm="6" md="4"><span class="text-caption text-medium-emphasis d-block mb-2">Rol</span><v-chip :color="user.role === 'Super Admin' ? '#2962FF' : 'secondary'" size="small" variant="tonal">{{ user.role }}</v-chip></v-col><v-col cols="12" sm="6" md="4"><span class="text-caption text-medium-emphasis d-block mb-2">Estado de la cuenta</span><v-chip :color="statusColor(user.status)" variant="tonal">{{ user.status }}</v-chip></v-col></v-row></v-card-text></v-card>
  </section>
  <section v-else class="text-center pa-8"><p class="text-h6">No encontramos el usuario solicitado.</p><v-btn color="primary" to="/usuarios">Volver a usuarios</v-btn></section>
</template>
