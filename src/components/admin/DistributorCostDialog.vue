<script setup>
import { ref, watch } from 'vue'
import ConfirmDialog from '../ConfirmDialog.vue'

const props = defineProps({ modelValue: Boolean, distributor: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'saved'])
const cost = ref(1)
const showConfirm = ref(false)

watch(() => props.modelValue, (open) => { if (open && props.distributor) cost.value = props.distributor.monthlyCost })
function save() { props.distributor.monthlyCost = Number(cost.value); emit('saved'); emit('update:modelValue', false) }
</script>

<template><v-dialog :model-value="modelValue" max-width="560" persistent @update:model-value="emit('update:modelValue', $event)"><v-card v-if="distributor" rounded="xl"><v-card-title class="d-flex justify-space-between pa-6"><div><p class="text-overline text-secondary font-weight-bold mb-1">DISTRIBUIDOR</p><h2 class="text-h5 font-weight-bold">Editar costo por cuenta</h2><p class="text-body-2 text-medium-emphasis mt-1">{{ distributor.name }}</p></div><v-btn icon="mdi-close" variant="text" @click="emit('update:modelValue', false)" /></v-card-title><v-card-text class="px-6 pb-6"><v-form @submit.prevent="showConfirm = true"><v-text-field v-model="cost" type="number" min="0.01" step="0.01" prefix="$" suffix="MXN" label="Costo mensual por cuenta" variant="outlined" :rules="[(value) => Number(value) > 0 || 'Ingresa un importe mayor que cero.']" /><div class="d-flex justify-end mt-6"><v-btn color="#43A047" type="submit" :disabled="Number(cost) <= 0" prepend-icon="mdi-content-save-outline">Guardar cambios</v-btn></div></v-form></v-card-text></v-card><ConfirmDialog v-model="showConfirm" message="Se actualizará el costo mensual por cuenta para pagos futuros." @confirm="save" /></v-dialog></template>
