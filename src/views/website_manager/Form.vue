<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import ImageField from '../../components/websiteManager/ImageField.vue'
import CollectionEditor from '../../components/websiteManager/CollectionEditor.vue'
import { useWebsiteManager } from '../../composables/useWebsiteManager'
import { clone, commitWebsite, required } from '../../store/websiteManager'
const { route, domain, website, base, back } = useWebsiteManager()
const router = useRouter(), form = ref(null), draft = ref(null), confirm = ref(false), error = ref('')
const identity = computed(() => route.path.endsWith('/identidad'))
const creating = computed(() => route.params.sectionId === 'nueva')
const heading = computed(() => identity.value ? 'Identidad visual' : creating.value ? 'Agregar sección' : draft.value?.title)
const colorFields = [{ key: 'primary', label: 'Color primario' }, { key: 'secondary', label: 'Color secundario' }, { key: 'background', label: 'Fondo del banner' }, { key: 'text', label: 'Texto del banner' }]
const contactFields = [{ key: 'phone', label: 'Teléfono' }, { key: 'whatsapp', label: 'WhatsApp' }, { key: 'email', label: 'Correo electrónico' }, { key: 'address', label: 'Dirección' }, { key: 'location', label: 'Enlace de ubicación' }, { key: 'facebook', label: 'Facebook' }, { key: 'instagram', label: 'Instagram' }]
watch(() => route.fullPath, () => {
  error.value = ''; confirm.value = false
  if (!website.value) { draft.value = null; return }
  const value = identity.value ? website.value.identity : creating.value ? { id: crypto.randomUUID(), type: 'custom', title: '', icon: 'mdi-file-document-outline', active: true, description: '', image: '', items: [], categories: [], contact: {} } : website.value.sections.find(s => s.id === route.params.sectionId)
  draft.value = value ? clone(value) : null
}, { immediate: true })
async function submit() {
  const result = await form.value.validate()
  if (!result.valid) return
  // Validate collapsed collection items as well as the visible fields.
  if (draft.value.type === 'offerings' && draft.value.items.some(i => !i.title.trim())) { error.value = 'Todos los productos y servicios necesitan un título.'; return }
  if (draft.value.type === 'carousel' && draft.value.items.some(i => !i.image)) { error.value = 'Agrega una imagen a cada elemento del carrusel.'; return }
  confirm.value = true
}
function save() {
  try {
    const next = clone(website.value)
    if (identity.value) next.identity = clone(draft.value)
    else if (creating.value) next.sections.push(clone(draft.value))
    else next.sections[next.sections.findIndex(s => s.id === draft.value.id)] = clone(draft.value)
    commitWebsite(domain.value.id, next)
    router.push(base.value)
  } catch { error.value = 'No se pudo guardar. Reduce el tamaño de las imágenes e inténtalo nuevamente.' }
}
</script>
<template>
  <section v-if="domain && draft">
    <div class="d-flex ga-3 mb-6"><v-btn :to="base" icon="mdi-arrow-left" variant="text" aria-label="Volver al gestor" /><div><p class="text-overline text-secondary">{{ domain.name }}</p><h1 class="text-h4 font-weight-bold">{{ heading }}</h1><p class="text-medium-emphasis mt-2">Configura la información que aparecerá en tu página web.</p></div></div>
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
    <v-form ref="form" @submit.prevent="submit">
      <v-card border rounded="xl" elevation="0" class="mb-6"><v-card-text class="pa-6">
        <template v-if="identity">
          <h2 class="text-h6 mb-5">Nombre y logo</h2><v-row><v-col cols="12" md="6"><v-text-field v-model="draft.name" label="Nombre público" variant="outlined" :rules="[required]" /><v-text-field v-model="draft.tagline" label="Mensaje de marca" variant="outlined" /></v-col><v-col cols="12" md="6"><ImageField v-model="draft.logo" label="Logo" /></v-col></v-row>
          <v-divider class="my-5" /><h2 class="text-h6 mb-5">Colores de marca</h2><v-row><v-col v-for="color in colorFields" :key="color.key" cols="12" sm="6" lg="3"><v-text-field v-model="draft[color.key]" :label="color.label" variant="outlined" :rules="[v => /^#[0-9a-f]{6}$/i.test(v) || 'Usa un color hexadecimal, por ejemplo #2962FF.']"><template #prepend-inner><v-avatar size="22" :color="draft[color.key]" class="border" /></template></v-text-field><v-color-picker v-model="draft[color.key]" mode="hex" hide-inputs hide-mode-switch elevation="0" width="240" /></v-col></v-row>
        </template>
        <template v-else>
          <v-row><v-col cols="12" md="8"><v-text-field v-model="draft.title" label="Título de la sección" variant="outlined" :rules="[required]" /></v-col><v-col cols="12" md="4"><v-select v-model="draft.active" label="Estado" :items="[{ title: 'Activa', value: true }, { title: 'Oculta', value: false }]" variant="outlined" /></v-col></v-row>
          <template v-if="draft.type === 'contact'"><v-row><v-col v-for="field in contactFields" :key="field.key" cols="12" md="6"><v-text-field v-model="draft.contact[field.key]" :label="field.label" variant="outlined" :rules="field.key === 'email' ? [v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Ingresa un correo válido.'] : ['location', 'facebook', 'instagram'].includes(field.key) ? [v => !v || /^https:\/\//i.test(v) || 'Usa un enlace HTTPS.'] : []" /></v-col></v-row></template>
          <template v-else><v-textarea v-model="draft.description" :label="draft.type === 'privacy_notice' ? 'Aviso de privacidad' : 'Descripción'" variant="outlined" :rows="draft.type === 'privacy_notice' ? 12 : 4" auto-grow /><ImageField v-if="['home', 'about', 'custom'].includes(draft.type)" v-model="draft.image" :label="draft.type === 'home' ? 'Banner principal' : 'Imagen'" /><CollectionEditor v-if="['carousel', 'offerings'].includes(draft.type)" v-model="draft.items" v-model:categories="draft.categories" :catalog="draft.type === 'offerings'" /></template>
        </template>
      </v-card-text></v-card>
      <div class="d-flex justify-end"><v-btn type="submit" color="#43A047" prepend-icon="mdi-content-save-outline">Guardar información</v-btn></div>
    </v-form><ConfirmDialog v-model="confirm" @confirm="save" />
  </section>
  <v-alert v-else type="info" variant="tonal">No encontramos esta sección. <router-link :to="domain ? base : back">Volver</router-link></v-alert>
</template>
