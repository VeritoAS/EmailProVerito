<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const distributor = {
  id: 1,
  name: 'Comercializadora del Bajío',
  user: 'contacto@bajio.com',
  clabe: '012345678901234567',
  profile: 'Persona Moral',
  registered_at: '15/08/2026'
}
</script>

<template>
  <section>
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" class="mr-4" @click="router.push('/distribuidores')" />
        <div>
          <p class="text-overline text-primary mb-0">DETALLE DE DISTRIBUIDOR</p>
          <h1 class="text-h5 font-weight-bold mb-0">{{ distributor.name }}</h1>
        </div>
      </div>
      <!-- Botón de edición eliminado según las reglas -->
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-card border elevation="0" rounded="lg" class="h-100" width="100%">
          <v-card-title class="pa-4 border-b font-weight-bold">
            <v-icon icon="mdi-domain" color="primary" class="mr-2" />
            Información Comercial y Cuenta
          </v-card-title>
          <v-card-text class="pa-6">
            <div class="mb-4">
              <span class="text-caption text-medium-emphasis d-block">Nombre Comercial</span>
              <span class="text-body-1 font-weight-medium">{{ distributor.name }}</span>
            </div>
            <div class="mb-4">
              <span class="text-caption text-medium-emphasis d-block">Cuenta de Usuario Vinculada</span>
              <span class="text-body-1">{{ distributor.user }}</span>
            </div>
            <div>
              <span class="text-caption text-medium-emphasis d-block">Fecha de Registro</span>
              <span class="text-body-1">{{ distributor.registered_at }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card border elevation="0" rounded="lg" class="h-100" width="100%">
          <v-card-title class="pa-4 border-b font-weight-bold">
            <v-icon icon="mdi-bank-outline" color="primary" class="mr-2" />
            Bancario y Fiscal
          </v-card-title>
          <v-card-text class="pa-6">
            <!-- Mantenemos esto visible porque el distribuidor lo llenará después y el Admin necesita verlo -->
            <div class="mb-4">
              <span class="text-caption text-medium-emphasis d-block">CLABE Interbancaria</span>
              <span class="text-body-1 text-mono">{{ distributor.clabe || 'Pendiente de registro' }}</span>
            </div>
            <div>
              <span class="text-caption text-medium-emphasis d-block mb-1">Perfil Fiscal</span>
              <v-chip v-if="distributor.profile" size="small" color="info" variant="tonal">{{ distributor.profile }}</v-chip>
              <span v-else class="text-body-2 text-medium-emphasis">Pendiente de registro</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>