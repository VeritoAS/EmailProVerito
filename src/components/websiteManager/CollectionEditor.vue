<script setup>
import ImageField from './ImageField.vue'
import { required } from '../../store/websiteManager'
const props = defineProps({ modelValue: Array, catalog: Boolean, categories: Array })
const emit = defineEmits(['update:modelValue', 'update:categories'])
function add() { emit('update:modelValue', [...props.modelValue, { id: crypto.randomUUID(), title: '', description: '', image: '', active: true, category: '', price: null }]) }
function move(index, direction) { const items = [...props.modelValue]; [items[index], items[index + direction]] = [items[index + direction], items[index]]; emit('update:modelValue', items) }
</script>
<template>
  <v-combobox v-if="catalog" :model-value="categories" multiple chips closable-chips label="Categorías" hint="Escribe una categoría y presiona Enter para agregarla." persistent-hint variant="outlined" class="mb-4" @update:model-value="emit('update:categories', $event)" />
  <div class="d-flex justify-space-between align-center mb-4"><h3 class="text-h6">{{ catalog ? 'Productos y servicios' : 'Imágenes del carrusel' }}</h3><v-btn color="#43A047" prepend-icon="mdi-plus" @click="add">Agregar</v-btn></div>
  <v-alert v-if="!modelValue.length" variant="tonal" color="grey" class="mb-4">Todavía no hay elementos. Agrega el primero.</v-alert>
  <v-expansion-panels variant="accordion" class="mb-6">
    <v-expansion-panel v-for="(item, index) in modelValue" :key="item.id">
      <v-expansion-panel-title>{{ index + 1 }}. {{ item.title || 'Nuevo elemento' }} · {{ item.active ? 'Activo' : 'Oculto' }}</v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <v-text-field v-model="item.title" label="Título" variant="outlined" :rules="catalog ? [required] : []" />
        <v-textarea v-model="item.description" label="Descripción" variant="outlined" rows="3" />
        <ImageField v-model="item.image" />
        <v-row v-if="catalog"><v-col cols="12" sm="6"><v-select v-model="item.category" :items="categories" label="Categoría" variant="outlined" clearable /></v-col><v-col cols="12" sm="6"><v-text-field v-model.number="item.price" label="Precio opcional (MXN)" type="number" min="0" step="0.01" variant="outlined" :rules="[v => v === '' || v == null || Number(v) >= 0 || 'Ingresa un precio positivo.']" /></v-col></v-row>
        <div class="d-flex flex-wrap align-center ga-2"><v-checkbox v-model="item.active" label="Visible" color="#43A047" hide-details /><v-btn icon="mdi-arrow-up" variant="text" :disabled="index === 0" aria-label="Subir elemento" @click="move(index, -1)" /><v-btn icon="mdi-arrow-down" variant="text" :disabled="index === modelValue.length - 1" aria-label="Bajar elemento" @click="move(index, 1)" /></div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
