<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const route = useRoute()
const rail = computed({ get: () => !props.modelValue, set: (value) => emit('update:modelValue', !value) })
const navigation = [
  { title: 'Inicio', icon: 'mdi-home-outline', to: '/cliente' },
  { title: 'Mis dominios', icon: 'mdi-earth', to: '/cliente/dominios' },
  { title: 'Mi cuenta', icon: 'mdi-account-circle-outline', to: '/cliente/mi-cuenta' },
]
</script>

<template>
  <v-navigation-drawer v-model:rail="rail" :width="252" :rail-width="80" permanent class="border-e">
    <div class="d-flex align-center pa-4" :class="{ 'justify-center': rail }"><v-btn icon="mdi-menu" variant="text" aria-label="Mostrar menú" @click="emit('update:modelValue', !modelValue)" /></div>
    <v-list nav density="comfortable" class="px-3"><v-list-item v-for="item in navigation" :key="item.title" :to="item.to" :active="route.path === item.to" :prepend-icon="item.icon" :title="item.title" rounded="lg" class="mb-2" /></v-list>
  </v-navigation-drawer>
</template>
