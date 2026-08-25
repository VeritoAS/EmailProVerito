<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { fakeUsers } from '../data/fakeUsers'

defineProps({ isDark: Boolean })
defineEmits(['toggle-theme'])

const router = useRouter()
const showPassword = ref(false)
const email = ref('')
const password = ref('')
const loginError = ref('')

function signIn() {
  const user = fakeUsers.find((item) => item.email === email.value.trim().toLowerCase() && item.password === password.value)
  if (!user) {
    loginError.value = 'Correo o contraseña incorrectos.'
    return
  }
  loginError.value = ''
  router.push(user.redirectTo)
}

function returnToWebsite() {
  router.push('/sitio')
}
</script>

<template>
  <v-sheet color="background" class="fill-height d-flex align-center justify-center pa-4" width="100%">
    <v-card width="520" max-width="100%" rounded="xl" elevation="8">
      
      <div class="d-flex justify-space-between align-center pa-5 pb-0">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="returnToWebsite">
          Volver al sitio
        </v-btn>
        <v-btn 
          icon 
          variant="text" 
          :aria-label="isDark ? 'Usar tema claro' : 'Usar tema oscuro'" 
          @click="$emit('toggle-theme')"
        >
          <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'" />
        </v-btn>
      </div>
      
      <v-card-text class="px-10 py-12 px-sm-16">
        <div class="d-flex justify-center mb-12">
          <v-img 
            :src="isDark ? '/assets/brand/EmailPro_Blanco.png' : '/assets/brand/EmailPro.png'" 
            alt="EmailPro" 
            width="185" 
            max-width="100%" 
          />
        </div>
        
        <v-form @submit.prevent="signIn">
          <!-- Textos convertidos a divs con clases de tipografía de Vuetify -->
          <div class="text-subtitle-2 text-medium-emphasis mb-1">Correo electrónico</div>
          <v-text-field 
            id="login-email" 
            v-model="email" 
            placeholder="nombre@empresa.com" 
            prepend-inner-icon="mdi-email-outline" 
            variant="outlined" 
            density="comfortable" 
            hide-details 
            class="mb-4"
          />
          
          <div class="d-flex justify-space-between align-center mt-2 mb-1">
            <div class="text-subtitle-2 text-medium-emphasis">Contraseña</div>
            <v-btn variant="text" color="primary" size="small" class="px-2">
              ¿Olvidaste tu contraseña?
            </v-btn>
          </div>
          <v-text-field 
            id="login-password" 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Ingresa tu contraseña" 
            prepend-inner-icon="mdi-lock-outline" 
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" 
            variant="outlined" 
            density="comfortable" 
            hide-details 
            @click:append-inner="showPassword = !showPassword" 
          />
          
          <v-btn type="submit" color="primary" size="large" block class="mt-7" append-icon="mdi-arrow-right">
            Iniciar sesión
          </v-btn>
          <v-alert v-if="loginError" type="error" variant="tonal" density="compact" class="mt-4" :text="loginError" />
        </v-form>
        
        <p class="text-caption text-medium-emphasis text-center mt-8 mb-0">
          Al continuar aceptas los términos y condiciones de EmailPro.
        </p>
      </v-card-text>
      
      <v-divider />
      
      <div class="text-caption text-medium-emphasis text-center py-4">
        © 2026 EmailPro. Todos los derechos reservados.
      </div>
    </v-card>
  </v-sheet>
</template>
