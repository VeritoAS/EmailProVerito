<script setup>
import { computed, ref, watch } from 'vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import IdentitySummary from '../../components/websiteManager/IdentitySummary.vue'
import { useWebsiteManager } from '../../composables/useWebsiteManager'
import { clone, commitWebsite, createWebsite } from '../../store/websiteManager'
const { domain, client, website, back, base } = useWebsiteManager()
const search = ref(''), status = ref('Todos'), page = ref(1), confirm = ref(false), error = ref(''), notice = ref('')
let pending = null
const headers = [{ title: 'Sección', key: 'title', sortable: false }, { title: 'Estado', key: 'active', sortable: false }, { title: 'Orden', key: 'order', sortable: false }, { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }]
const rows = computed(() => (website.value?.sections || []).filter(s => s.title.toLowerCase().includes(search.value.toLowerCase()) && (status.value === 'Todos' || s.active === (status.value === 'Activas'))))
watch([search, status], () => { page.value = 1 })
watch(base, () => { search.value = ''; status.value = 'Todos'; page.value = 1; error.value = ''; confirm.value = false })
function request(action) { pending = action; confirm.value = true }
function accept() { try { pending?.(); error.value = ''; notice.value = 'Cambios guardados.' } catch { error.value = 'No se pudo guardar. El almacenamiento local puede estar lleno; reduce el tamaño de las imágenes.' } }
function change(mutator) { const next = clone(website.value); mutator(next); commitWebsite(domain.value.id, next) }
function move(item, direction) {
  try {
    change(next => { const from = next.sections.findIndex(s => s.id === item.id); const to = from + direction; if (to >= 0 && to < next.sections.length) [next.sections[from], next.sections[to]] = [next.sections[to], next.sections[from]] })
    notice.value = 'Orden actualizado.'
  } catch { error.value = 'No se pudo guardar el orden.' }
}
</script>
<template>
  <section v-if="domain && client">
    <div class="d-flex flex-wrap align-start justify-space-between ga-4 mb-6"><div class="d-flex ga-3"><v-btn :to="back" icon="mdi-arrow-left" variant="text" aria-label="Volver a dominios" /><div><p class="text-overline text-secondary">SITIO WEB</p><h1 class="text-h4 font-weight-bold">Gestor de página web</h1><p class="text-medium-emphasis mt-2">{{ client.commercialName }} · {{ domain.name }}</p></div></div><v-btn v-if="website?.published" :to="{ path: '/sitio', query: { domain: domain.name } }" target="_blank" color="#2962FF" variant="outlined" prepend-icon="mdi-open-in-new">Ir a mi sitio web</v-btn></div>
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
    <v-card v-if="!website" border rounded="xl" elevation="0" class="text-center pa-8"><v-icon icon="mdi-monitor-dashboard" size="52" color="primary" /><h2 class="text-h5 my-4">Crea la página de {{ domain.name }}</h2><p class="text-medium-emphasis mb-6">Configura tu identidad y contenido antes de publicarlo.</p><v-btn color="#43A047" prepend-icon="mdi-plus" @click="request(() => createWebsite(domain, client))">Crear página web</v-btn></v-card>
    <template v-else>
      <v-card border rounded="xl" elevation="0" class="mb-6"><v-card-text class="pa-6"><v-row align="center"><v-col cols="12" md="5"><div class="d-flex align-center ga-3"><v-icon icon="mdi-earth" color="primary" size="32" /><div><strong>{{ domain.name }}</strong><p class="text-body-2 text-medium-emphasis">Página web del dominio</p></div></div></v-col><v-col cols="12" md="3"><v-chip :color="domain.status === 'Activo' ? '#43A047' : 'grey'" variant="tonal">Dominio {{ domain.status.toLowerCase() }}</v-chip></v-col><v-col cols="12" md="4"><v-switch :model-value="website.published" color="#43A047" label="Página publicada" hide-details :disabled="domain.status !== 'Activo' && !website.published" @update:model-value="value => request(() => change(w => { w.published = value }))" /></v-col></v-row></v-card-text></v-card>
      <IdentitySummary :identity="website.identity" :to="`${base}/identidad`" />
      <div class="d-flex flex-wrap justify-space-between align-center ga-3 mb-4"><h2 class="text-h5 font-weight-bold">Contenido del sitio</h2><v-btn color="#43A047" prepend-icon="mdi-plus" :to="`${base}/secciones/nueva`">Agregar sección</v-btn></div>
      <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text><v-row><v-col cols="12" sm="6"><v-select v-model="status" :items="['Todos', 'Activas', 'Ocultas']" label="Mostrar" variant="underlined" density="compact" hide-details /></v-col><v-col cols="12" sm="6"><v-text-field v-model="search" label="Buscar sección" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details /></v-col></v-row></v-card-text></v-card>
      <v-card border rounded="xl" elevation="0"><v-data-table v-model:page="page" :headers="headers" :items="rows" :items-per-page="5" items-per-page-text="Elementos por página" page-text="{0}-{1} de {2}" no-data-text="No hay secciones que coincidan con los filtros.">
        <template #item.title="{ item }"><div class="d-flex align-center ga-3 py-3"><v-icon :icon="item.icon" /><span class="font-weight-medium">{{ item.title }}</span></div></template>
        <template #item.active="{ item }"><v-btn :color="item.active ? '#43A047' : 'grey'" variant="tonal" size="small" :aria-label="`${item.active ? 'Ocultar' : 'Mostrar'} ${item.title}`" @click="request(() => change(w => { w.sections.find(s => s.id === item.id).active = !item.active }))">{{ item.active ? 'Activa' : 'Oculta' }}</v-btn></template>
        <template #item.order="{ item }"><v-btn icon="mdi-arrow-up" variant="text" size="small" :disabled="website.sections[0].id === item.id" :aria-label="`Subir ${item.title}`" @click="move(item, -1)" /><v-btn icon="mdi-arrow-down" variant="text" size="small" :disabled="website.sections.at(-1).id === item.id" :aria-label="`Bajar ${item.title}`" @click="move(item, 1)" /></template>
        <template #item.actions="{ item }"><v-btn :to="`${base}/secciones/${item.id}`" icon="mdi-eye-outline" color="#2962FF" variant="text" size="small" :aria-label="`Administrar ${item.title}`"><v-icon icon="mdi-eye-outline" /><v-tooltip activator="parent" location="top">Administrar sección</v-tooltip></v-btn></template>
      </v-data-table></v-card>
    </template>
    <ConfirmDialog v-model="confirm" @confirm="accept" /><v-snackbar :model-value="!!notice" :timeout="2200" @update:model-value="notice = ''">{{ notice }}</v-snackbar>
  </section>
  <v-alert v-else type="info" variant="tonal">No encontramos este dominio en tu cuenta. <router-link :to="back">Volver</router-link></v-alert>
</template>
