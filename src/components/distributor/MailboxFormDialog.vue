<script setup>
import { ref, watch } from 'vue'
import ConfirmDialog from '../ConfirmDialog.vue'
import { distributorMailboxes } from '../../store/distributor'

const props = defineProps({
  modelValue: Boolean,
  domain: { type: Object, default: null },
  mailbox: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'saved'])
const showConfirm = ref(false)
const form = ref({ localPart: '' })

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) form.value.localPart = props.mailbox?.localPart || ''
})

function saveMailbox() {
  if (props.mailbox) props.mailbox.localPart = form.value.localPart
  else { distributorMailboxes.push({ id: Date.now(), domainId: props.domain.id, localPart: form.value.localPart, status: 'Activa' }); props.domain.activeMailboxes += 1 }
  emit('saved')
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="720" persistent @update:model-value="emit('update:modelValue', $event)">
    <v-card v-if="domain" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-start pa-6"><div><p class="text-overline text-secondary font-weight-bold mb-1">CUENTAS DE CORREO</p><h2 class="text-h5 font-weight-bold">{{ mailbox ? 'Editar cuenta de correo' : 'Agregar cuenta de correo' }}</h2><p class="text-body-2 text-medium-emphasis mt-1">Registra una cuenta para {{ domain.name }}.</p></div><v-btn icon="mdi-close" variant="text" aria-label="Cerrar" @click="emit('update:modelValue', false)" /></v-card-title>
      <v-card-text class="px-6 pb-6"><v-form @submit.prevent="showConfirm = true"><v-row><v-col cols="12" md="6"><v-text-field v-model="form.localPart" label="Parte local" placeholder="ventas" variant="outlined" required /></v-col><v-col cols="12" md="6"><v-text-field :model-value="form.localPart ? `${form.localPart}@${domain.name}` : `usuario@${domain.name}`" label="Dirección de correo" variant="outlined" readonly /></v-col></v-row><v-alert type="info" variant="tonal" :text="`Este dominio permite hasta ${domain.maxActiveMailboxes} cuentas activas.`" /><div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" prepend-icon="mdi-content-save-outline">{{ mailbox ? 'Guardar cambios' : 'Guardar cuenta' }}</v-btn></div></v-form></v-card-text>
    </v-card>
    <ConfirmDialog v-model="showConfirm" message="Se registrará la cuenta de correo como activa." @confirm="saveMailbox" />
  </v-dialog>
</template>
