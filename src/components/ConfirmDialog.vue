<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '¿Estás seguro que quieres continuar?' },
  message: { type: String, default: 'Se guardarán los cambios realizados.' },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

function close() {
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm')
  close()
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="520" persistent @update:model-value="emit('update:modelValue', $event)">
    <v-card rounded="xl" class="text-center pa-4">
      <v-card-text class="pa-6">
        <v-avatar color="warning" size="88" class="mb-6">
          <v-icon icon="mdi-alert-outline" color="white" size="48" />
        </v-avatar>
        <h2 class="text-h4 font-weight-bold">{{ title }}</h2>
        <p class="text-body-1 text-medium-emphasis mt-4">{{ message }}</p>
        <div class="d-flex justify-center ga-8 mt-8">
          <div class="d-flex flex-column align-center ga-2">
            <v-btn color="success" icon="mdi-check" size="large" elevation="2" aria-label="Sí, continuar" @click="confirm" />
            <span class="font-weight-bold">Sí</span>
          </div>
          <div class="d-flex flex-column align-center ga-2">
            <v-btn color="error" icon="mdi-close" size="large" elevation="2" aria-label="No, cancelar" @click="close" />
            <span class="font-weight-bold">No</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
