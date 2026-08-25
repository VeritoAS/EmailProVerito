<script setup>
import { useRouter } from 'vue-router'

defineProps({ isDark: Boolean })
defineEmits(['toggle-theme'])
const router = useRouter()
const services = [
  ['mdi-web', 'Diseño de página web profesional', 'Sitios modernos, atractivos y pensados para generar resultados.'],
  ['mdi-earth', 'Hospedaje web y dominio', 'Un plan completo para mantener tu presencia en línea.'],
  ['mdi-shield-lock-outline', 'Certificado SSL', 'Seguridad y confianza para tus visitantes.'],
  ['mdi-view-dashboard-outline', 'Secciones personalizables', 'Adapta tu sitio a las necesidades de tu negocio.'],
  ['mdi-share-variant-outline', 'Links y redes sociales', 'Conecta todos tus canales en un solo lugar.'],
  ['mdi-cellphone-link', 'Visualización en móviles', 'Una experiencia ideal en cualquier dispositivo.'],
  ['mdi-chart-bar', 'Google Maps y estadísticas', 'Métricas para tomar mejores decisiones.'],
  ['mdi-email-outline', 'Correos corporativos', 'Una imagen profesional para tu empresa.'],
]
const benefits = [
  ['mdi-lock-outline', 'Presencia digital segura'], ['mdi-account-outline', 'Imagen profesional'], ['mdi-earth', 'Alcance global'], ['mdi-cash', 'Ahorro en impresión'], ['mdi-bullhorn-outline', 'Mejor publicidad'], ['mdi-clock-outline', 'Disponibilidad 24/7'],
]
const steps = [
  ['1', 'Contrata mínimo 3 correos EmailPro', 'Elige el plan que mejor se adapte a tu equipo.'], ['2', 'Firma de contrato digital', 'Un proceso claro y sencillo para comenzar.'], ['3', 'Dominio .COM gratis con la renta', 'Tu dominio incluye el servicio contratado.'], ['4', 'Pide más correos cuando los necesites', 'Escala tu cuenta cuando tu negocio lo requiera.'],
]
const terms = ['La página web y los correos corporativos se renuevan cada año.', 'La fotografía profesional tiene costo adicional.', 'Para dominios .COM.MX se requiere un mínimo de 4 correos.', 'Para dominios .MX se requieren mínimo 5 correos corporativos.']

function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <v-sheet color="background" min-height="100vh">
    <v-app-bar color="background" elevation="0" border scroll-behavior="elevate">
      <v-container class="d-flex align-center px-4" fluid>
        <v-img :src="isDark ? '/assets/brand/EmailPro_Blanco.png' : '/assets/brand/EmailPro.png'" alt="EmailPro" width="132" max-width="132" class="mr-7" />
        <div class="d-none d-md-flex ga-1"><v-btn variant="text" color="primary" @click="scrollToSection('inicio')">Inicio</v-btn><v-btn variant="text" @click="scrollToSection('servicios')">Servicios</v-btn><v-btn variant="text" @click="scrollToSection('beneficios')">Beneficios</v-btn><v-btn variant="text" @click="scrollToSection('como-adquirirlo')">Cómo adquirirlo</v-btn><v-btn variant="text" @click="scrollToSection('terminos')">Términos</v-btn><v-btn variant="text" @click="scrollToSection('contacto')">Contacto</v-btn></div>
        <v-spacer />
        <v-btn icon variant="text" class="mr-2" :aria-label="isDark ? 'Usar tema claro' : 'Usar tema oscuro'" @click="$emit('toggle-theme')"><v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'" /></v-btn>
        <v-btn variant="outlined" color="primary" prepend-icon="mdi-account-outline" class="mr-2" @click="router.push('/login')">Iniciar sesión</v-btn>
        <v-btn color="secondary">Solicitar servicio<template #append><v-icon :color="isDark ? 'white' : 'navy'" icon="mdi-arrow-right" /></template></v-btn>
      </v-container>
    </v-app-bar>

    <v-container class="pt-16 px-5 px-md-12">
      <v-row id="inicio" align="center" class="mb-14">
        <v-col cols="12" md="6"><h1 class="text-h3 text-md-h2 font-weight-bold">Proyecta una imagen profesional con tu <span class="text-secondary">correo corporativo</span></h1><p class="text-body-1 text-medium-emphasis mt-6">Los correos gratuitos no dan seriedad. Con EmailPro obtienes correos empresariales, página web profesional, hosting, dominio y gestión centralizada para que tu negocio luzca y funcione mejor.</p><div class="d-flex flex-wrap ga-3 mt-7"><v-btn color="secondary" size="large"><template #prepend><v-icon :color="isDark ? 'white' : 'navy'" icon="mdi-email-outline" /></template>Solicitar servicio</v-btn></div><p class="text-caption text-medium-emphasis mt-5">* Dominio .COM gratis aplicable con mínimo 3 correos.</p></v-col>
        <v-col cols="12" md="6"><v-img :src="isDark ? '/assets/images/Modo_Oscuro.png' : '/assets/images/Modo_Claro.png'" alt="Vista de EmailPro" rounded="xl" /></v-col>
      </v-row>

      <v-row class="mb-16"><v-col cols="12" md="4"><v-card border rounded="lg" class="pa-5 d-flex align-center ga-4" elevation="0"><v-icon color="secondary" size="38">mdi-earth</v-icon><div><strong>Dominio .COM gratis*</strong><div class="text-body-2 text-medium-emphasis">Con mínimo 3 correos</div></div></v-card></v-col><v-col cols="12" md="4"><v-card border rounded="lg" class="pa-5 d-flex align-center ga-4" elevation="0"><v-icon color="secondary" size="38">mdi-shield-lock-outline</v-icon><div><strong>Hosting y SSL incluidos</strong><div class="text-body-2 text-medium-emphasis">Seguridad y rendimiento garantizados</div></div></v-card></v-col><v-col cols="12" md="4"><v-card border rounded="lg" class="pa-5 d-flex align-center ga-4" elevation="0"><v-icon color="secondary" size="38">mdi-view-dashboard-outline</v-icon><div><strong>Gestión desde un panel</strong><div class="text-body-2 text-medium-emphasis">Administra todo de forma centralizada</div></div></v-card></v-col></v-row>

      <section id="servicios" class="mb-16"><h2 class="text-h4 text-center font-weight-bold mb-8"><span class="text-primary">Servicios</span> que ofrecemos</h2><v-row><v-col v-for="service in services" :key="service[1]" cols="12" sm="6" md="3"><v-card border rounded="lg" class="pa-5 h-100" elevation="0"><v-icon :icon="service[0]" color="primary" size="34" class="mb-4" /><h3 class="text-subtitle-1 font-weight-bold">{{ service[1] }}</h3><p class="text-body-2 text-medium-emphasis mt-2 mb-0">{{ service[2] }}</p></v-card></v-col></v-row></section>

      <section id="beneficios" class="mb-16"><h2 class="text-h4 text-center font-weight-bold mb-8"><span class="text-secondary">Beneficios</span> para tu negocio</h2><v-row><v-col v-for="benefit in benefits" :key="benefit[1]" cols="6" sm="4" md="2"><div class="text-center"><v-icon :icon="benefit[0]" color="secondary" size="38" /><p class="text-subtitle-2 font-weight-bold mt-3">{{ benefit[1] }}</p></div></v-col></v-row></section>

      <section id="como-adquirirlo" class="mb-16"><h2 class="text-h4 text-center font-weight-bold mb-8"><span class="text-primary">¿Cómo adquirirlo?</span></h2><v-row><v-col v-for="step in steps" :key="step[0]" cols="12" sm="6" md="3"><v-card border rounded="lg" class="pa-6 h-100" elevation="0"><v-avatar color="primary" size="32" class="mb-5"><span class="font-weight-bold">{{ step[0] }}</span></v-avatar><h3 class="text-subtitle-1 font-weight-bold">{{ step[1] }}</h3><p class="text-body-2 text-medium-emphasis mt-2 mb-0">{{ step[2] }}</p></v-card></v-col></v-row></section>

      <section id="terminos" class="mb-16"><h2 class="text-h4 text-center font-weight-bold mb-8"><span class="text-primary">Términos y condiciones</span> importantes</h2><v-expansion-panels variant="accordion"><v-expansion-panel v-for="term in terms" :key="term" :title="term"><v-expansion-panel-text>Consulta con nuestro equipo cualquier detalle adicional sobre el servicio.</v-expansion-panel-text></v-expansion-panel></v-expansion-panels></section>
    </v-container>

    <v-sheet id="contacto" color="navy" class="text-white" border><v-container class="py-10 px-5 px-md-12"><v-row><v-col cols="12" md="7"><v-img src="/assets/brand/EmailPro_Blanco.png" alt="EmailPro" width="165" max-width="100%" /><p class="mt-4">Correos corporativos y páginas web profesionales para impulsar tu negocio.</p></v-col><v-col cols="12" md="5"><strong>Contacto</strong><div class="d-flex flex-column ga-2 mt-4 text-body-2"><span><v-icon icon="mdi-whatsapp" size="18" class="mr-2" />WhatsApp</span><span><v-icon icon="mdi-email-outline" size="18" class="mr-2" />info@emailpro.com</span><span><v-icon icon="mdi-clock-outline" size="18" class="mr-2" />Lunes a viernes</span></div></v-col></v-row><v-divider class="my-7" /><div class="text-caption">© 2026 EmailPro. Todos los derechos reservados.</div></v-container></v-sheet>
  </v-sheet>
</template>
