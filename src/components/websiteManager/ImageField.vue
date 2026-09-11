<script setup>
import { ref } from 'vue'
import { safeImage } from '../../store/websiteManager'
defineProps({ modelValue: String, label: { type: String, default: 'Imagen' } })
const emit = defineEmits(['update:modelValue'])
const error = ref('')
async function upload(value) {
  const file = Array.isArray(value) ? value[0] : value
  if (!file) return
  error.value = ''
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 750000) {
    error.value = 'Selecciona PNG, JPG o WEBP de hasta 750 KB.'; return
  }
  const reader = new FileReader()
  reader.onload = () => emit('update:modelValue', reader.result)
  reader.onerror = () => { error.value = 'No se pudo leer la imagen.' }
  reader.readAsDataURL(file)
}
</script>
<template>
  <v-file-input :label="`Subir ${label.toLowerCase()}`" accept="image/png,image/jpeg,image/webp" variant="outlined" :error-messages="error" hint="PNG, JPG o WEBP · máximo 750 KB" persistent-hint @update:model-value="upload" />
  <div v-if="modelValue && safeImage(modelValue)" class="mb-4"><v-img :src="modelValue" height="140" contain :alt="label" /><v-btn variant="text" color="grey" @click="emit('update:modelValue', '')">Quitar imagen</v-btn></div>
</template>
