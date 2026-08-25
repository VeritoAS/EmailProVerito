<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const route = useRoute()
const rail = computed({
  get: () => !props.modelValue,
  set: (value) => emit('update:modelValue', !value),
})

function toggleMenu() {
  emit('update:modelValue', !props.modelValue)
}

// Data fake lista para el maquetado
const navigation = [
  { title: 'Inicio', icon: 'mdi-home-outline', to: '/' },
  { title: 'Distribuidores', icon: 'mdi-handshake-outline', to: '/distribuidores' },
  { title: 'Usuarios', icon: 'mdi-account-multiple-outline', to: '/usuarios' },
  { title: 'Configuración', icon: 'mdi-cog-outline', to: '/configuracion' },
]
</script>

<template>
  <v-navigation-drawer v-model:rail="rail" :width="252" :rail-width="80" permanent>
    <div class="px-3 pt-3 pb-2 d-flex justify-start">
      <v-btn icon="mdi-menu" variant="text" aria-label="Mostrar menú" @click="toggleMenu" />
    </div>
    
    <v-list nav density="comfortable" class="px-2">
      <v-list-item
        v-for="item in navigation"
        :key="item.title"
        :to="item.to"
        :active="route.path === item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="lg"
        color="primary"
      />
    </v-list>
  </v-navigation-drawer>
</template>