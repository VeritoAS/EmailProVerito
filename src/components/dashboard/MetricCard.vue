<script setup>
defineProps({ 
  title: String, 
  value: String, 
  icon: String, 
  helper: String, 
  tone: { type: String, default: 'primary' } 
})
</script>

<template>
  <!-- Usamos border en lugar de elevation para un diseño más limpio (flat design) -->
  <v-card rounded="xl" class="h-100 border" elevation="0">
    <v-card-text class="pa-6">
      <div class="d-flex align-start justify-space-between">
        <div>
          <p class="text-subtitle-2 text-medium-emphasis font-weight-bold text-uppercase mb-1">{{ title }}</p>
          <p class="text-h3 font-weight-bold mb-2">{{ value }}</p>
        </div>
        
        <!-- v-avatar con variant="tonal" nos da ese efecto de fondo claro dinámico perfecto para iconos -->
        <v-avatar :color="tone" variant="tonal" rounded="lg" size="48">
          <v-icon :icon="icon" size="24" />
        </v-avatar>
      </div>
      
      <p class="text-caption text-medium-emphasis mb-0">{{ helper }}</p>
    </v-card-text>
  </v-card>
</template>