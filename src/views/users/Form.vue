<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import { adminUsers } from '../../data/adminUsers'

const route = useRoute()
const router = useRouter()
const showConfirm = ref(false)
const user = computed(() => adminUsers.value.find((item) => item.id === Number(route.params.id)))
const isEditing = computed(() => Boolean(route.params.id))
const roles = ['Super Admin', 'Operador']
const form = ref({ firstName: '', lastName: '', secondLastName: '', email: '', role: 'Operador' })

if (user.value) {
  form.value = { firstName: user.value.firstName, lastName: user.value.lastName, secondLastName: user.value.secondLastName, email: user.value.email, role: user.value.role }
}

function save() {
  const fullName = [form.value.firstName, form.value.lastName, form.value.secondLastName].filter(Boolean).join(' ')
  if (isEditing.value && user.value) {
    Object.assign(user.value, { ...form.value, fullName })
    router.push(`/usuarios/${user.value.id}`)
    return
  }
  adminUsers.value.push({ id: Date.now(), ...form.value, fullName, status: 'Pendiente', isCurrentUser: false })
  router.push('/usuarios')
}
</script>

<template>
  <section>
    <div class="d-flex align-center mb-6"><v-btn icon="mdi-arrow-left" variant="text" :to="isEditing ? `/usuarios/${user?.id}` : '/usuarios'" aria-label="Volver" class="mr-4" /><div><p class="text-overline text-secondary font-weight-bold mb-1">USUARIOS</p><h1 class="text-h5 font-weight-bold mb-0">{{ isEditing ? 'Editar usuario' : 'Nuevo usuario' }}</h1><p class="text-body-2 text-medium-emphasis mt-1">{{ isEditing ? 'Actualiza la información de la cuenta interna.' : 'Registra una cuenta interna de SVR.' }}</p></div></div>
    <v-form @submit.prevent="showConfirm = true"><v-card border rounded="xl" elevation="0"><v-card-text class="pa-6 pa-sm-8"><h2 class="text-h6 font-weight-bold mb-4">Datos de la cuenta</h2><v-row><v-col cols="12" md="4"><v-text-field v-model="form.firstName" label="Nombre(s)" variant="outlined" required /></v-col><v-col cols="12" md="4"><v-text-field v-model="form.lastName" label="Apellido paterno" variant="outlined" required /></v-col><v-col cols="12" md="4"><v-text-field v-model="form.secondLastName" label="Apellido materno" variant="outlined" /></v-col><v-col cols="12" md="6"><v-text-field v-model="form.email" label="Correo electrónico" type="email" variant="outlined" required /></v-col><v-col cols="12" md="6"><v-select v-model="form.role" :items="roles" label="Rol" variant="outlined" required /></v-col></v-row><v-alert v-if="!isEditing" type="info" variant="tonal" class="mt-4" text="Al guardar se enviará un correo de confirmación para que el usuario defina su contraseña." /><div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" :disabled="!form.firstName || !form.lastName || !form.email" prepend-icon="mdi-content-save-outline">{{ isEditing ? 'Guardar cambios' : 'Registrar usuario' }}</v-btn></div></v-card-text></v-card></v-form>
    <ConfirmDialog v-model="showConfirm" :message="isEditing ? 'Se actualizará la información del usuario.' : 'Se registrará el usuario y se enviará el correo de confirmación.'" @confirm="save" />
  </section>
</template>
