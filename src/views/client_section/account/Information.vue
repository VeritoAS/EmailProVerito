<script setup>
import { clientProfile } from '../../../store/distributor'
</script>

<template>
  <section>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p>
        <h1 class="text-h4 font-weight-bold">Mi cuenta</h1>
        <p class="text-body-1 text-medium-emphasis mt-2">Consulta tus datos y actualiza tu información fiscal.</p>
      </div>
      <v-btn color="#FFB300" prepend-icon="mdi-pencil-outline" to="/cliente/mi-cuenta/editar">Editar información fiscal</v-btn>
    </div>
    <v-card border rounded="xl" elevation="0" class="mb-5"><v-card-title class="pa-6">Datos personales</v-card-title><v-card-text class="px-6 pb-6"><v-row><v-col cols="12" md="6"><div class="d-flex align-center ga-4"><v-icon color="primary" icon="mdi-account-outline" size="30" /><div><p class="text-body-2 text-medium-emphasis mb-1">Responsable de la cuenta</p><p class="font-weight-bold mb-0">{{ clientProfile.responsible }}</p></div></div></v-col><v-col cols="12" md="6"><div class="d-flex align-center ga-4"><v-icon color="primary" icon="mdi-email-outline" size="30" /><div><p class="text-body-2 text-medium-emphasis mb-1">Correo de acceso</p><p class="font-weight-bold mb-0">{{ clientProfile.email }}</p></div></div></v-col></v-row><v-alert type="info" variant="tonal" class="mt-5" text="Los datos de acceso son administrados por tu distribuidor." /></v-card-text></v-card>
    <v-card border rounded="xl" elevation="0"><v-card-title class="pa-6">Información fiscal</v-card-title><v-card-text class="px-6 pb-6"><v-alert :type="clientProfile.fiscalProfileComplete ? 'success' : 'warning'" variant="tonal" :text="clientProfile.fiscalProfileComplete ? 'Tu información fiscal está completa.' : 'Aún no has registrado tu información fiscal.'" /><v-divider class="my-5" /><div class="d-flex align-start ga-4"><v-icon color="secondary" icon="mdi-file-document-outline" size="30" /><div><p class="font-weight-bold mb-1">Perfil fiscal</p><p class="text-body-2 text-medium-emphasis mb-0">{{ clientProfile.fiscalProfileComplete ? 'Perfil fiscal registrado.' : 'Pendiente de registro.' }}</p></div></div></v-card-text></v-card>
  </section>
</template>
