<script setup>
import { computed, ref, watch } from 'vue'
import ConfirmDialog from '../ConfirmDialog.vue'

const props = defineProps({ modelValue: Boolean, domain: Object })
const emit = defineEmits(['update:modelValue', 'saved'])
const limit = ref(1)
const showConfirm = ref(false)
const isInvalid = computed(() => Number(limit.value) < props.domain?.activeMailboxes)
watch(() => props.modelValue, (open) => { if (open && props.domain) limit.value = props.domain.maxActiveMailboxes })
function save() { props.domain.maxActiveMailboxes = Number(limit.value); emit('saved'); emit('update:modelValue', false) }
</script>
<template><v-dialog :model-value="modelValue" max-width="620" persistent @update:model-value="emit('update:modelValue', $event)"><v-card v-if="domain" rounded="xl"><v-card-title class="d-flex justify-space-between pa-6"><div><p class="text-overline text-secondary font-weight-bold mb-1">DOMINIO</p><h2 class="text-h5 font-weight-bold">Editar {{ domain.name }}</h2></div><v-btn icon="mdi-close" variant="text" @click="emit('update:modelValue', false)" /></v-card-title><v-card-text class="px-6 pb-6"><v-form @submit.prevent="showConfirm = true"><v-text-field v-model="limit" type="number" min="1" label="Límite de cuentas activas" variant="outlined" /><v-alert type="info" variant="tonal" :text="`Actualmente hay ${domain.activeMailboxes} cuentas activas.`" /><v-alert v-if="isInvalid" type="error" variant="tonal" class="mt-4" :text="`El límite no puede ser menor a ${domain.activeMailboxes}.`" /><div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" :disabled="isInvalid" prepend-icon="mdi-content-save-outline">Guardar cambios</v-btn></div></v-form></v-card-text></v-card><ConfirmDialog v-model="showConfirm" message="Se actualizará el límite de cuentas activas del dominio." @confirm="save" /></v-dialog></template>
