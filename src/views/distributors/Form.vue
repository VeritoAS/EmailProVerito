<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '../../components/ConfirmDialog.vue'

const router = useRouter()
const showConfirm = ref(false)

// Estructura actualizada a las reglas de negocio
const form = ref({
  commercial_name: '',
  first_name: '',
  last_name: '',
  second_last_name: '',
  email: ''
})

function save() {
  router.push('/distribuidores')
}
</script>

<template>
  <section>
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" class="mr-4" @click="router.push('/distribuidores')" />
      <div>
        <p class="text-overline text-primary mb-0">DISTRIBUIDORES</p>
        <h1 class="text-h5 font-weight-bold mb-0">Nuevo distribuidor</h1>
      </div>
    </div>

    <v-card border elevation="0" rounded="lg" width="100%">
      <v-card-text class="pa-6 pa-sm-8">
        <v-form @submit.prevent="showConfirm = true">
          
          <h2 class="text-h6 font-weight-bold mb-4">Datos del Distribuidor</h2>
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">Nombre Comercial</div>
              <v-text-field v-model="form.commercial_name" placeholder="Ej. Comercializadora del Bajío" variant="outlined" density="comfortable" maxlength="150" />
            </v-col>
          </v-row>

          <v-divider class="my-6" />
          
          <h2 class="text-h6 font-weight-bold mb-4">Datos de la Cuenta de Acceso</h2>
          <v-row>
            <v-col cols="12" md="4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">Nombre(s)</div>
              <v-text-field v-model="form.first_name" placeholder="Ej. Juan" variant="outlined" density="comfortable" />
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">Apellido Paterno</div>
              <v-text-field v-model="form.last_name" placeholder="Ej. Pérez" variant="outlined" density="comfortable" />
            </v-col>

            <v-col cols="12" md="4">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">Apellido Materno (Opcional)</div>
              <v-text-field v-model="form.second_last_name" placeholder="Ej. López" variant="outlined" density="comfortable" />
            </v-col>

            <v-col cols="12" md="6">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">Correo Electrónico</div>
              <v-text-field v-model="form.email" type="email" placeholder="correo@ejemplo.com" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <div class="d-flex justify-end">
            <v-btn color="#43A047" type="submit" elevation="0">Registrar distribuidor</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
    <ConfirmDialog v-model="showConfirm" message="Se registrará el distribuidor y su cuenta de acceso." @confirm="save" />
  </section>
</template>
