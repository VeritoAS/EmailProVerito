<script setup>
import { computed, watchEffect } from 'vue'
import { useTheme } from 'vuetify'
import { useWebsiteManager } from '../../composables/useWebsiteManager'
const { website, domain, base, back } = useWebsiteManager()
const theme = useTheme()
watchEffect(() => {
  if (!website.value) return
  const identity = website.value.identity
  theme.themes.value.emailProWebsitePreview = {
    dark: false,
    colors: { primary: identity.primary, secondary: identity.secondary, background: identity.background, 'on-background': identity.text, surface: '#FFFFFF', 'on-surface': '#111827' },
    variables: {},
  }
})
const sections = computed(() => website.value?.sections.filter(s => s.active) || [])
const contactLabels = { phone: 'Teléfono', whatsapp: 'WhatsApp', email: 'Correo', address: 'Dirección', location: 'Ubicación', facebook: 'Facebook', instagram: 'Instagram' }
</script>
<template>
  <section v-if="website && domain">
    <div class="d-flex align-center ga-3 mb-6"><v-btn :to="base" icon="mdi-arrow-left" variant="text" aria-label="Volver al gestor" /><div><h1 class="text-h5 font-weight-bold">Vista previa · {{ domain.name }}</h1><p class="text-medium-emphasis">{{ website.published ? 'Página marcada como publicada' : 'Borrador sin publicar' }}</p></div></div>
    <v-card border rounded="xl" elevation="0"><v-card-text class="pa-6"><div class="d-flex flex-wrap align-center ga-4"><v-avatar :color="website.identity.primary" size="56"><v-img v-if="website.identity.logo" :src="website.identity.logo" alt="Logo" /><span v-else>{{ website.identity.name.slice(0, 2) }}</span></v-avatar><h2 class="text-h5">{{ website.identity.name }}</h2><v-spacer /><v-btn v-for="s in sections" :key="s.id" :href="`#preview-${s.id}`" variant="text" :color="website.identity.primary">{{ s.title }}</v-btn></div><p class="mt-3">{{ website.identity.tagline }}</p></v-card-text></v-card>
    <v-alert v-if="!sections.length" variant="tonal" color="grey" class="mt-6">No hay secciones visibles. Activa alguna desde el gestor.</v-alert>
    <v-card v-for="s in sections" :id="`preview-${s.id}`" :key="s.id" theme="emailProWebsitePreview" :color="s.type === 'home' ? 'background' : 'surface'" border rounded="xl" elevation="0" class="mt-6"><v-card-text class="pa-6">
      <v-sheet :color="s.type === 'home' ? 'background' : 'surface'"><h2 class="text-h4 mb-4">{{ s.title }}</h2><p v-for="(paragraph, index) in s.description.split('\n')" :key="index" class="text-body-1 mb-2">{{ paragraph }}</p></v-sheet>
      <v-img v-if="s.image" :src="s.image" max-height="380" contain class="my-4" :alt="s.title" />
      <v-carousel v-if="s.type === 'carousel' && s.items.some(i => i.active)" height="350" show-arrows="hover" hide-delimiter-background><v-carousel-item v-for="item in s.items.filter(i => i.active)" :key="item.id" :src="item.image" :alt="item.title"><v-sheet class="pa-3" color="surface"><h3>{{ item.title }}</h3><p>{{ item.description }}</p></v-sheet></v-carousel-item></v-carousel>
      <v-row v-if="s.type === 'offerings'"><v-col v-for="item in s.items.filter(i => i.active)" :key="item.id" cols="12" sm="6" lg="4"><v-card border rounded="lg" elevation="0"><v-img v-if="item.image" :src="item.image" height="180" contain :alt="item.title" /><v-card-text><v-chip v-if="item.category" :color="website.identity.secondary" size="small">{{ item.category }}</v-chip><h3 class="text-h6 mt-3">{{ item.title }}</h3><p>{{ item.description }}</p><p v-if="item.price != null && item.price !== ''" class="font-weight-bold mt-3">{{ Number(item.price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) }}</p></v-card-text></v-card></v-col></v-row>
      <v-list v-if="s.type === 'contact'" bg-color="transparent"><template v-for="(label, key) in contactLabels" :key="key"><v-list-item v-if="s.contact[key]" :title="label" :subtitle="s.contact[key]" /></template></v-list>
    </v-card-text></v-card>
  </section>
  <v-alert v-else type="info" variant="tonal">No hay sitio para previsualizar. <router-link :to="back">Volver</router-link></v-alert>
</template>
