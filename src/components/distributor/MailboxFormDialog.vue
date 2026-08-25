<script setup>
import { computed, ref, watch } from 'vue'
import ConfirmDialog from '../ConfirmDialog.vue'
import { distributorMailboxes } from '../../store/distributor'

const props = defineProps({ modelValue: Boolean, domain: { type: Object, default: null }, mailbox: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'saved'])
const showConfirm = ref(false)
const form = ref({ localPart: '' })
const isEditing = computed(() => Boolean(props.mailbox))
const localPart = computed(() => form.value.localPart.trim().toLowerCase())
const isAtCapacity = computed(() => !isEditing.value && props.domain && props.domain.activeMailboxes >= props.domain.maxActiveMailboxes)
const duplicateMailbox = computed(() => distributorMailboxes.some((item) => item.domainId === props.domain?.id && item.id !== props.mailbox?.id && item.localPart.toLowerCase() === localPart.value))
const canSave = computed(() => Boolean(localPart.value) && !duplicateMailbox.value && !isAtCapacity.value)

watch(() => props.modelValue, (isOpen) => { if (isOpen) form.value.localPart = props.mailbox?.localPart || '' })
function requestSave() { if (canSave.value) showConfirm.value = true }
function saveMailbox() {
  if (props.mailbox) props.mailbox.localPart = localPart.value
  else { distributorMailboxes.push({ id: Date.now(), domainId: props.domain.id, localPart: localPart.value, status: 'Activa' }); props.domain.activeMailboxes += 1 }
  emit('saved'); emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="720" persistent @update:model-value="emit('update:modelValue', $event)">
    <v-card v-if="domain" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-start pa-6"><div><p class="text-overline text-secondary font-weight-bold mb-1">CUENTAS DE CORREO</p><h2 class="text-h5 font-weight-bold">{{ isEditing ? 'Editar cuenta de correo' : 'Agregar cuenta de correo' }}</h2><p class="text-body-2 text-medium-emphasis mt-1">{{ domain.name }}</p></div><v-btn icon="mdi-close" variant="text" aria-label="Cerrar" @click="emit('update:modelValue', false)" /></v-card-title>
      <v-card-text class="px-6 pb-6"><v-form @submit.prevent="requestSave"><v-alert type="info" variant="tonal" class="mb-5" :text="`${domain.activeMailboxes} de ${domain.maxActiveMailboxes} cuentas activas utilizadas.`" /><v-alert v-if="isAtCapacity" type="warning" variant="tonal" class="mb-5" text="Se alcanzó el límite de cuentas activas. Edita el dominio o desactiva una cuenta para continuar." /><v-row><v-col cols="12" md="6"><v-text-field v-model="form.localPart" label="Parte local" placeholder="ventas" variant="outlined" required :error-messages="duplicateMailbox ? 'Esta cuenta ya existe en el dominio.' : []" /></v-col><v-col cols="12" md="6"><v-text-field :model-value="localPart ? `${localPart}@${domain.name}` : `usuario@${domain.name}`" label="Dirección de correo" variant="outlined" readonly /></v-col></v-row><div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" :disabled="!canSave" prepend-icon="mdi-content-save-outline">{{ isEditing ? 'Guardar cambios' : 'Guardar cuenta' }}</v-btn></div></v-form></v-card-text>
    </v-card>
    <ConfirmDialog v-model="showConfirm" :message="isEditing ? 'Se actualizará la cuenta de correo.' : 'Se registrará la cuenta de correo como activa.'" @confirm="saveMailbox" />
  </v-dialog>
</template>
