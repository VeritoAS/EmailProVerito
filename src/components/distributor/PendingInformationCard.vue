<template>
  <v-card border rounded="xl" elevation="0">
    <v-card-title class="px-5 pt-5">Información pendiente</v-card-title>
    <v-card-subtitle class="px-5">Completa estos datos para terminar el registro de tu cuenta.</v-card-subtitle>
    <v-card-text class="px-5 pt-5 pb-5">
      <div class="d-flex align-start ga-4"><v-icon color="secondary" icon="mdi-file-document-outline" size="30" /><div><p class="font-weight-bold mb-1">Información fiscal</p><p class="text-body-2 text-medium-emphasis mb-0">Aún no has registrado un perfil fiscal.</p></div></div>
      <v-divider class="my-3" />
      <div class="d-flex align-start ga-4"><v-icon color="primary" icon="mdi-bank-outline" size="30" /><div><p class="font-weight-bold mb-1">CLABE para depósitos</p><p class="text-body-2 text-medium-emphasis mb-0">Registra una CLABE válida de 18 dígitos.</p></div></div>
      <div class="d-flex justify-center mt-4">
        <v-btn color="#FFB300" to="/distribuidor/mi-cuenta" append-icon="mdi-arrow-right">Completar información pendiente</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
