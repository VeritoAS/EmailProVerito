<script setup>
import ProfileMenu from './ProfileMenu.vue'

defineProps({ isDark: Boolean, user: Object })
defineEmits(['toggle-theme'])
</script>

<template>
  <v-app-bar elevation="0" height="68" class="border-b px-2">
    <v-spacer />
    
    <v-btn icon variant="text" class="mx-1" aria-label="Notificaciones">
      <v-badge color="secondary" dot offset-x="5" offset-y="5">
        <v-icon icon="mdi-bell-outline" />
      </v-badge>
    </v-btn>
    
    <v-btn 
      icon 
      variant="text" 
      class="mx-1" 
      :aria-label="isDark ? 'Usar tema claro' : 'Usar tema oscuro'" 
      @click="$emit('toggle-theme')"
    >
      <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'" />
    </v-btn>
    
    <ProfileMenu :user="user" :is-dark="isDark" />
  </v-app-bar>
</template>
