<script setup>
// Colores semánticos en lugar de 'blue' o 'gold' para la data fake
const activity = [
  { icon: 'mdi-account-plus-outline', title: 'Nuevo usuario agregado', detail: 'Mariana Soto se unió al equipo', time: 'Hace 8 min', color: 'primary' },
  { icon: 'mdi-email-check-outline', title: 'Campaña enviada', detail: 'Boletín de agosto entregado', time: 'Hace 2 h', color: 'warning' },
  { icon: 'mdi-file-document-check-outline', title: 'Contenido actualizado', detail: 'Plantilla de bienvenida editada', time: 'Ayer', color: 'primary' },
]
</script>

<template>
  <v-card rounded="xl" elevation="0" class="border h-100">
    <v-card-title class="d-flex justify-space-between align-center px-6 pt-6 pb-4">
      <div>
        <h2 class="text-h6 font-weight-bold mb-0">Actividad reciente</h2>
        <p class="text-body-2 text-medium-emphasis mb-0">Últimos movimientos en EmailPro</p>
      </div>
      <v-btn variant="text" color="primary" size="small" class="px-2">Ver todo</v-btn>
    </v-card-title>
    
    <v-card-text class="px-6 pb-3">
      <!-- Convertimos activity-row en flexbox dinámico con divisor inferior automático -->
      <div 
        v-for="(item, index) in activity" 
        :key="item.title" 
        class="d-flex align-center py-3"
        :class="{ 'border-b': index < activity.length - 1 }"
      >
        <!-- Icono redondo con color tonal -->
        <v-avatar :color="item.color" variant="tonal" size="40" class="mr-4">
          <v-icon :icon="item.icon" size="20" />
        </v-avatar>
        
        <div class="flex-grow-1">
          <p class="text-subtitle-2 font-weight-bold mb-0">{{ item.title }}</p>
          <p class="text-body-2 text-medium-emphasis mb-0">{{ item.detail }}</p>
        </div>
        
        <span class="text-caption text-medium-emphasis ml-4">{{ item.time }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>