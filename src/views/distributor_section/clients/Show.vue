<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import MailboxFormDialog from '../../../components/distributor/MailboxFormDialog.vue'
import DomainEditDialog from '../../../components/distributor/DomainEditDialog.vue'
import { distributorClients, distributorDomains, distributorMailboxes } from '../../../store/distributor'

const route = useRoute()
const selectedDomainId = ref(null)
const mailboxDialog = ref(false)
const mailboxFormDialog = ref(false)
const domainEditDialog = ref(false)
const showDomainStatusConfirm = ref(false)
const showMailboxStatusConfirm = ref(false)
const selectedMailbox = ref(null)
const dataRevision = ref(0)
const domainSearch = ref('')
const domainStatusInput = ref('ACTIVOS')
const appliedDomainStatus = ref('ACTIVOS')
const editingDomainFilters = ref(false)
const mailboxSearch = ref('')
const mailboxStatusInput = ref('ACTIVAS')
const appliedMailboxStatus = ref('ACTIVAS')
const editingMailboxFilters = ref(false)

const client = computed(() => distributorClients.find((item) => item.id === Number(route.params.id)))
const domains = computed(() => distributorDomains.filter((item) => item.clientId === Number(route.params.id)))
const selectedDomain = computed(() => {
  dataRevision.value
  return domains.value.find((item) => item.id === selectedDomainId.value)
})
const isSelectedDomainAtCapacity = computed(() => selectedDomain.value && selectedDomain.value.activeMailboxes >= selectedDomain.value.maxActiveMailboxes)

const domainHeaders = [
  { title: 'Dominio', key: 'name' },
  { title: 'Expiración', key: 'expirationDate' },
  { title: 'Cuentas activas', key: 'capacity', sortable: false },
  { title: 'Precio por cuenta', key: 'monthlyPrice' },
  { title: 'Estado', key: 'status' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]
const mailboxHeaders = [
  { title: 'Cuenta de correo', key: 'address' },
  { title: 'Estado', key: 'status' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

const filteredDomains = computed(() => {
  const query = domainSearch.value.trim().toLowerCase()
  return domains.value.filter((domain) => {
    const matchesStatus = appliedDomainStatus.value === 'TODOS' || domain.status.toUpperCase() === appliedDomainStatus.value.slice(0, -1)
    return matchesStatus && (!query || domain.name.toLowerCase().includes(query))
  })
})
const mailboxItems = computed(() => {
  dataRevision.value
  return distributorMailboxes.filter((mailbox) => mailbox.domainId === selectedDomain.value?.id).map((mailbox) => ({ ...mailbox, address: `${mailbox.localPart}@${selectedDomain.value.name}` }))
})
const filteredMailboxes = computed(() => {
  const query = mailboxSearch.value.trim().toLowerCase()
  return mailboxItems.value.filter((mailbox) => {
    const matchesStatus = appliedMailboxStatus.value === 'TODAS' || mailbox.status.toUpperCase() === appliedMailboxStatus.value.slice(0, -1)
    return matchesStatus && (!query || mailbox.address.toLowerCase().includes(query))
  })
})

function toggleDomainFilters() { if (editingDomainFilters.value) appliedDomainStatus.value = domainStatusInput.value; editingDomainFilters.value = !editingDomainFilters.value }
function toggleMailboxFilters() { if (editingMailboxFilters.value) appliedMailboxStatus.value = mailboxStatusInput.value; editingMailboxFilters.value = !editingMailboxFilters.value }
function openMailboxes(domain) { selectedDomainId.value = domain.id; mailboxDialog.value = true }
function openMailboxForm() { if (!isSelectedDomainAtCapacity.value) { mailboxDialog.value = false; selectedMailbox.value = null; mailboxFormDialog.value = true } }
function openDomainEdit(domain) { selectedDomainId.value = domain.id; domainEditDialog.value = true }
function openMailboxEdit(mailbox) { selectedMailbox.value = distributorMailboxes.find((item) => item.id === mailbox.id); mailboxDialog.value = false; mailboxFormDialog.value = true }
function toggleDomainStatus(domain) { selectedDomainId.value = domain.id; showDomainStatusConfirm.value = true }
function confirmDomainStatus() { selectedDomain.value.status = selectedDomain.value.status === 'Activo' ? 'Inactivo' : 'Activo'; dataRevision.value += 1 }
function toggleMailboxStatus(mailbox) { selectedMailbox.value = distributorMailboxes.find((item) => item.id === mailbox.id); showMailboxStatusConfirm.value = true }
function confirmMailboxStatus() {
  const mailbox = selectedMailbox.value
  const isActivating = mailbox.status === 'Inactiva'
  if (isActivating && isSelectedDomainAtCapacity.value) return
  mailbox.status = isActivating ? 'Activa' : 'Inactiva'
  selectedDomain.value.activeMailboxes += isActivating ? 1 : -1
  dataRevision.value += 1
}
function mailboxSaved() { dataRevision.value += 1 }
const currency = (value) => `$${Number(value).toFixed(2)} MXN`
</script>

<template>
  <section v-if="client">
    <div class="d-flex align-start mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" to="/distribuidor/clientes" aria-label="Volver a clientes" class="mr-2" />
      <div><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><p class="text-body-2 text-medium-emphasis mb-2"><span class="text-primary">Clientes</span> <v-icon icon="mdi-chevron-right" size="small" /> {{ client.commercialName }}</p><h1 class="text-h4 font-weight-bold">{{ client.commercialName }}</h1><p class="text-body-1 text-medium-emphasis mt-2">Administra sus dominios y cuentas de correo.</p></div>
    </div>

    <v-card border rounded="xl" elevation="0" class="mb-7"><v-card-text class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 pa-5"><div class="d-flex align-center ga-4"><v-avatar color="secondary" variant="tonal" icon="mdi-account-outline" /><div><p class="font-weight-bold mb-1">Responsable: {{ client.responsible }}</p><p class="text-body-2 text-medium-emphasis mb-0">{{ client.email }}</p></div></div><v-chip :color="client.accountStatus === 'Confirmada' ? '#43A047' : '#FFB300'" variant="tonal" prepend-icon="mdi-check-circle-outline">Cuenta {{ client.accountStatus.toLowerCase() }}</v-chip></v-card-text></v-card>

    <div class="d-flex justify-space-between align-center mb-4"><div class="d-flex align-center"><v-icon icon="mdi-earth" size="28" class="mr-3 text-medium-emphasis" /><h2 class="text-h5 font-weight-bold">Dominios</h2></div><v-btn color="#43A047" prepend-icon="mdi-plus" :to="`/distribuidor/clientes/${client.id}/dominios/nuevo`">Agregar dominio</v-btn></div>
    <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center py-4"><v-select v-model="domainStatusInput" :items="['ACTIVOS', 'INACTIVOS', 'TODOS']" label="Mostrar" variant="underlined" density="compact" hide-details :disabled="!editingDomainFilters" class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="domainSearch" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text><v-sheet :color="editingDomainFilters ? 'primary' : 'grey-darken-1'" class="py-2 px-4 text-center cursor-pointer" v-ripple @click="toggleDomainFilters"><span class="text-caption font-weight-bold text-white text-uppercase d-flex align-center justify-center">{{ editingDomainFilters ? 'Aplicar filtros' : 'Cambiar filtros' }}<v-icon icon="mdi-filter-variant" size="small" class="ml-1" /></span></v-sheet></v-card>
    <v-card border rounded="xl" elevation="0"><v-data-table :headers="domainHeaders" :items="filteredDomains" items-per-page-text="Dominios por página" page-text="{0}-{1} de {2}"><template #no-data><div class="py-8 text-center text-medium-emphasis"><v-icon icon="mdi-earth" size="34" class="mb-2" /><p class="mb-0">No hay dominios que coincidan con los filtros.</p></div></template><template #item.capacity="{ item }">{{ item.activeMailboxes }} de {{ item.maxActiveMailboxes }}</template><template #item.monthlyPrice="{ item }">{{ currency(item.monthlyPrice) }}</template><template #item.status="{ item }"><v-btn :color="item.status === 'Activo' ? '#43A047' : '#E53935'" size="small" variant="tonal" @click="toggleDomainStatus(item)">{{ item.status }}</v-btn></template><template #item.actions="{ item }"><v-tooltip text="Ver cuentas de correo" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-card-account-details-outline" color="#2962FF" variant="text" size="small" aria-label="Consultar cuentas de correo" @click="openMailboxes(item)" /></template></v-tooltip><v-tooltip text="Consultar pagos" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-invoice-text" color="#43A047" variant="text" size="small" aria-label="Consultar pagos" :to="`/distribuidor/clientes/${client.id}/pagos`" /></template></v-tooltip><v-tooltip text="Editar dominio" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-pencil-outline" color="#FFB300" variant="text" size="small" aria-label="Editar dominio" @click="openDomainEdit(item)" /></template></v-tooltip></template></v-data-table></v-card>

    <v-dialog v-model="mailboxDialog" max-width="1080" scrollable><v-card v-if="selectedDomain" rounded="xl"><v-card-title class="d-flex justify-space-between align-start pa-6"><div><p class="text-overline text-secondary font-weight-bold mb-1">DOMINIO</p><h2 class="text-h5 font-weight-bold">{{ selectedDomain.name }}</h2><p class="text-body-2 text-medium-emphasis mt-1">{{ selectedDomain.activeMailboxes }} / {{ selectedDomain.maxActiveMailboxes }} cuentas activas</p></div><v-btn icon="mdi-close" variant="text" aria-label="Cerrar" @click="mailboxDialog = false" /></v-card-title><v-card-text class="px-6 pb-6"><div class="d-flex justify-space-between align-center mb-4"><h3 class="text-h6 font-weight-bold">Cuentas de correo</h3><v-btn color="#43A047" prepend-icon="mdi-plus" :disabled="isSelectedDomainAtCapacity" @click="openMailboxForm">Agregar cuenta</v-btn></div><v-alert v-if="isSelectedDomainAtCapacity" type="warning" variant="tonal" class="mb-4" text="Se alcanzó el límite de cuentas activas de este dominio. Puedes editar el límite o desactivar una cuenta." /><v-card border rounded="lg" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center py-4"><v-select v-model="mailboxStatusInput" :items="['ACTIVAS', 'INACTIVAS', 'TODAS']" label="Mostrar" variant="underlined" density="compact" hide-details :disabled="!editingMailboxFilters" class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="mailboxSearch" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text><v-sheet :color="editingMailboxFilters ? 'primary' : 'grey-darken-1'" class="py-2 px-4 text-center cursor-pointer" v-ripple @click="toggleMailboxFilters"><span class="text-caption font-weight-bold text-white text-uppercase d-flex align-center justify-center">{{ editingMailboxFilters ? 'Aplicar filtros' : 'Cambiar filtros' }}<v-icon icon="mdi-filter-variant" size="small" class="ml-1" /></span></v-sheet></v-card><v-card border rounded="lg" elevation="0"><v-data-table :headers="mailboxHeaders" :items="filteredMailboxes" items-per-page-text="Cuentas por página" page-text="{0}-{1} de {2}"><template #no-data><div class="py-8 text-center text-medium-emphasis"><v-icon icon="mdi-email-outline" size="34" class="mb-2" /><p class="mb-0">No hay cuentas que coincidan con los filtros.</p></div></template><template #item.status="{ item }"><v-btn :color="item.status === 'Activa' ? '#43A047' : '#E53935'" size="small" variant="tonal" :disabled="item.status === 'Inactiva' && isSelectedDomainAtCapacity" @click="toggleMailboxStatus(item)">{{ item.status }}</v-btn></template><template #item.actions="{ item }"><v-tooltip text="Editar cuenta" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-pencil-outline" color="#FFB300" variant="text" size="small" aria-label="Editar cuenta" @click="openMailboxEdit(item)" /></template></v-tooltip></template></v-data-table></v-card></v-card-text></v-card></v-dialog>


    <MailboxFormDialog v-model="mailboxFormDialog" :domain="selectedDomain" :mailbox="selectedMailbox" @saved="mailboxSaved" />
    <DomainEditDialog v-model="domainEditDialog" :domain="selectedDomain" @saved="mailboxSaved" />
    <ConfirmDialog v-model="showDomainStatusConfirm" :message="selectedDomain?.status === 'Activo' ? 'Se desactivará el dominio y sus cuentas no estarán disponibles.' : 'Se activará el dominio.'" @confirm="confirmDomainStatus" />
    <ConfirmDialog v-model="showMailboxStatusConfirm" :message="selectedMailbox?.status === 'Activa' ? 'Se desactivará la cuenta de correo.' : 'Se activará la cuenta de correo.'" @confirm="confirmMailboxStatus" />
  </section>
  <section v-else class="text-center pa-8"><p class="text-h6">No encontramos el cliente solicitado.</p><v-btn class="mt-4" color="primary" to="/distribuidor/clientes">Volver a clientes</v-btn></section>
</template>
