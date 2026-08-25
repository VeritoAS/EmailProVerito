<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  isDark: Boolean,
  user: {
    type: Object,
    default: () => ({ initials: 'AD', name: 'Admin EmailPro', role: 'Administrador', email: 'admin@emailpro.com', id: 'ADM-0001' }),
  },
})
</script>

<template>
  <v-menu location="bottom end" offset="10" :theme="props.isDark ? 'emailProDark' : 'emailProLight'">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" variant="text" height="52" class="px-1 ml-2">
        <v-avatar color="primary" size="38">
          <span class="text-white font-weight-bold">{{ props.user.initials }}</span>
        </v-avatar>
        
        <div class="d-none d-sm-flex flex-column text-left ml-3">
          <strong class="text-body-2">{{ props.user.name }}</strong>
          <span class="text-caption text-medium-emphasis">{{ props.user.role }}</span>
        </div>
        
        <v-icon icon="mdi-chevron-down" size="18" class="ml-2" />
      </v-btn>
    </template>
    
    <v-card min-width="320" rounded="xl" elevation="4">
      <v-card-text class="pa-5 text-center">
        
        <div class="position-relative d-inline-block mb-3">
          <v-avatar color="grey-lighten-4" size="70">
            <v-icon color="grey-darken-1" icon="mdi-account" size="42" />
          </v-avatar>
          <v-avatar color="primary" size="24" class="position-absolute" style="bottom: 0; right: 0;">
            <v-icon icon="mdi-camera" size="14" color="white" />
          </v-avatar>
        </div>
        
        <strong class="d-block text-body-1">{{ props.user.email }}</strong>
        <p class="text-caption text-medium-emphasis mb-6 text-uppercase">{{ props.user.name }}</p>
        
        <v-row dense class="mb-4">
          <v-col cols="6">
            <div class="border rounded-lg pa-2 text-center">
              <span class="text-caption text-medium-emphasis d-block mb-1" style="line-height: 1;">Rol</span>
              <strong class="text-caption font-weight-bold">{{ props.user.role }}</strong>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="border rounded-lg pa-2 text-center">
              <span class="text-caption text-medium-emphasis d-block mb-1" style="line-height: 1;">ID</span>
              <strong class="text-caption font-weight-bold">{{ props.user.id }}</strong>
            </div>
          </v-col>
        </v-row>
        
        <v-divider class="mb-4" />
        
        <v-btn 
          variant="text" 
          color="error" 
          prepend-icon="mdi-logout" 
          class="w-100 font-weight-bold" 
          @click="router.push('/login')"
        >
          Cerrar Sesión
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
