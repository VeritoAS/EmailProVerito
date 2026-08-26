<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import { adminDistributors } from '../../data/adminDistributors'

const router = useRouter()
const route = useRoute()
const showConfirm = ref(false)
const distributor = computed(() => adminDistributors.value.find((item) => item.id === Number(route.params.id)))
const isEditing = computed(() => Boolean(route.params.id))

// Estructura actualizada a las reglas de negocio
const form = ref({
  commercial_name: '',
  first_name: '',
  last_name: '',
  second_last_name: '',
  email: '',
  monthlyCost: null,
})

if (distributor.value) {
  const [firstName = '', ...lastNames] = distributor.value.responsible.split(' ')
  form.value = {
    commercial_name: distributor.value.name,
    first_name: firstName,
    last_name: lastNames.shift() || '',
    second_last_name: lastNames.join(' '),
    email: distributor.value.user,
    monthlyCost: distributor.value.monthlyCost,
  }
}

function save() {
  const responsible = [form.value.first_name, form.value.last_name, form.value.second_last_name].filter(Boolean).join(' ')
  if (isEditing.value && distributor.value) {
    Object.assign(distributor.value, {
      name: form.value.commercial_name,
      responsible,
      user: form.value.email,
      monthlyCost: Number(form.value.monthlyCost),
    })
    router.push(`/distribuidores/${distributor.value.id}`)
    return
  }
  adminDistributors.value.push({
    id: Date.now(),
    name: form.value.commercial_name,
    responsible,
    user: form.value.email,
    monthlyCost: Number(form.value.monthlyCost),
    clabe: '',
    fiscalProfile: 'Pendiente',
    fiscal: null,
    status: 'ACTIVOS',
    registeredAt: new Date().toLocaleDateString('es-MX'),
  })
  router.push('/distribuidores')
}
</script>

<template>
  <section>
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" class="mr-4" @click="router.push('/distribuidores')" />
      <div>
        <p class="text-overline text-primary mb-0">DISTRIBUIDORES</p>
        <h1 class="text-h5 font-weight-bold mb-0">{{ isEditing ? 'Editar distribuidor' : 'Nuevo distribuidor' }}</h1>
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

          <h2 class="text-h6 font-weight-bold mb-4">Costo asignado por SVR</h2>
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">Costo mensual por cuenta</div>
              <v-text-field v-model="form.monthlyCost" type="number" min="0.01" step="0.01" prefix="$" suffix="MXN" placeholder="0.00" variant="outlined" density="comfortable" :rules="[(value) => Number(value) > 0 || 'Ingresa un importe mayor que cero.']" />
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
            <v-btn color="#43A047" type="submit" elevation="0" :disabled="Number(form.monthlyCost) <= 0">{{ isEditing ? 'Guardar cambios' : 'Registrar distribuidor' }}</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
    <ConfirmDialog v-model="showConfirm" :message="isEditing ? 'Se actualizarán los datos del distribuidor.' : 'Se registrará el distribuidor y su cuenta de acceso.'" @confirm="save" />
  </section>
</template>
