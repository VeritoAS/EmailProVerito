<script setup>
defineProps({ identity: Object, to: String })
const colors = [{ key: 'primary', label: 'Primario' }, { key: 'secondary', label: 'Secundario' }, { key: 'background', label: 'Fondo' }, { key: 'text', label: 'Texto' }]
</script>
<template>
  <v-card :to="to" border rounded="xl" elevation="0" class="mb-6" aria-label="Abrir identidad visual">
    <v-card-text class="pa-6"><v-row align="center">
      <v-col cols="12" md="3"><h2 class="text-h6 font-weight-bold">Identidad visual</h2><span class="text-caption text-medium-emphasis">Selecciona para configurar</span></v-col>
      <v-col cols="12" md="3"><div class="d-flex align-center ga-3"><v-avatar size="64" color="primary"><v-img v-if="identity.logo" :src="identity.logo" alt="Logo del sitio" /><span v-else>{{ identity.name.slice(0, 2).toUpperCase() }}</span></v-avatar><div><strong>{{ identity.name }}</strong><p class="text-body-2 text-medium-emphasis">{{ identity.tagline }}</p></div></div></v-col>
      <v-col v-for="color in colors" :key="color.key" cols="6" sm="3" md="auto"><div class="d-flex align-center ga-2"><v-avatar :color="identity[color.key]" size="32" class="border" /><div><p>{{ color.label }}</p><span class="text-caption text-medium-emphasis">{{ identity[color.key] }}</span></div></div></v-col>
    </v-row></v-card-text>
  </v-card>
</template>
