<script setup>
import { computed, ref } from 'vue'
import MailboxDialog from '../../../components/client/MailboxDialog.vue'
import { clientProfile, distributorDomains, distributorMailboxes } from '../../../store/distributor'

const selectedDomain = ref(null)
const selectedMailbox = ref(null)
const mailboxListDialog = ref(false)
const mailboxFormDialog = ref(false)
const dataRevision = ref(0)
const searchInput = ref('')
const statusInput = ref('ACTIVOS')
const mailboxSearch = ref('')
const mailboxStatusInput = ref('ACTIVAS')

const domains = computed(() => distributorDomains.filter((domain) => domain.clientId === clientProfile.clientId))
const headers = [
  { title: 'Dominio', key: 'name' },
  { title: 'Expiración', key: 'expirationDate' },
  { title: 'Cuentas activas', key: 'capacity', sortable: false },
  { title: 'Precio por cuenta', key: 'monthlyPrice' },
  { title: 'Estado', key: 'status' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]
const mailboxHeaders = [{ title: 'Cuenta de correo', key: 'address' }, { title: 'Estado', key: 'status' }, { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }]
const filteredDomains = computed(() => {
  const query = searchInput.value.trim().toLowerCase()
  return domains.value.filter((domain) => {
    const matchesStatus = statusInput.value === 'TODOS' || domain.status.toUpperCase() === statusInput.value.slice(0, -1)
    return matchesStatus && (!query || domain.name.toLowerCase().includes(query))
  })
})
const mailboxes = computed(() => { dataRevision.value; return distributorMailboxes.filter((mailbox) => mailbox.domainId === selectedDomain.value?.id).map((mailbox) => ({ ...mailbox, address: `${mailbox.localPart}@${selectedDomain.value.name}` })) })
const filteredMailboxes = computed(() => {
  const query = mailboxSearch.value.trim().toLowerCase()
  return mailboxes.value.filter((mailbox) => {
    const matchesStatus = mailboxStatusInput.value === 'TODAS' || mailbox.status.toUpperCase() === mailboxStatusInput.value.slice(0, -1)
    return matchesStatus && (!query || mailbox.address.toLowerCase().includes(query))
  })
})
const currency = (value) => `$${Number(value).toFixed(2)} MXN`

function openMailboxes(domain) { selectedDomain.value = domain; mailboxListDialog.value = true }
function openNewMailbox() { mailboxListDialog.value = false; selectedMailbox.value = null; mailboxFormDialog.value = true }
function openEditMailbox(mailbox) { mailboxListDialog.value = false; selectedMailbox.value = distributorMailboxes.find((item) => item.id === mailbox.id); mailboxFormDialog.value = true }
function saved() { dataRevision.value += 1 }
</script>

<template>
  <section>
    <div class="mb-6"><p class="text-overline text-secondary font-weight-bold mb-1">CLIENTE</p><h1 class="text-h4 font-weight-bold">Mis dominios</h1><p class="text-body-1 text-medium-emphasis mt-2">Consulta tus dominios y administra sus cuentas de correo.</p></div>
    <v-card border rounded="xl" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center ga-4 py-4"><v-select v-model="statusInput" :items="['ACTIVOS', 'INACTIVOS', 'TODOS']" label="Mostrar" variant="underlined" density="compact" hide-details class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="searchInput" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text></v-card>
    <v-card border rounded="xl" elevation="0"><v-data-table :headers="headers" :items="filteredDomains" items-per-page-text="Dominios por página" page-text="{0}-{1} de {2}"><template #no-data><div class="py-8 text-center text-medium-emphasis"><v-icon icon="mdi-earth" size="34" class="mb-2" /><p class="mb-0">No hay dominios que coincidan con los filtros.</p></div></template><template #item.capacity="{ item }">{{ item.activeMailboxes }} de {{ item.maxActiveMailboxes }}</template><template #item.monthlyPrice="{ item }">{{ currency(item.monthlyPrice) }}</template><template #item.status="{ item }"><v-chip :color="item.status === 'Activo' ? '#43A047' : '#E53935'" size="small" variant="tonal">{{ item.status }}</v-chip></template><template #item.actions="{ item }"><v-tooltip text="Ver cuentas de correo" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-card-account-details-outline" color="#2962FF" variant="text" size="small" aria-label="Consultar cuentas" @click="openMailboxes(item)" /></template></v-tooltip><v-tooltip text="Ver pagos y facturas" location="top"><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-invoice-text" color="#43A047" variant="text" size="small" aria-label="Ver pagos y facturas" :to="`/cliente/pagos/${item.id}`" /></template></v-tooltip></template></v-data-table></v-card>

    <v-dialog v-model="mailboxListDialog" max-width="1000" scrollable><v-card v-if="selectedDomain" rounded="xl"><v-card-title class="d-flex justify-space-between align-start pa-6"><div><p class="text-overline text-secondary font-weight-bold mb-1">DOMINIO</p><h2 class="text-h5 font-weight-bold">{{ selectedDomain.name }}</h2><p class="text-body-2 text-medium-emphasis mt-1">{{ selectedDomain.activeMailboxes }} / {{ selectedDomain.maxActiveMailboxes }} cuentas activas</p></div><v-btn icon="mdi-close" variant="text" @click="mailboxListDialog = false" /></v-card-title><v-card-text class="px-6 pb-6"><div class="d-flex justify-space-between align-center mb-4"><h3 class="text-h6 font-weight-bold">Cuentas de correo</h3><v-btn color="#43A047" prepend-icon="mdi-plus" @click="openNewMailbox">Agregar cuenta</v-btn></div><v-card border rounded="lg" elevation="0" class="mb-4"><v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center ga-4 py-4"><v-select v-model="mailboxStatusInput" :items="['ACTIVAS', 'INACTIVAS', 'TODAS']" label="Mostrar" variant="underlined" density="compact" hide-details class="w-100 mb-3 mb-sm-0" /><v-text-field v-model="mailboxSearch" placeholder="Buscar" append-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details class="w-100" /></v-card-text></v-card><v-data-table :headers="mailboxHeaders" :items="filteredMailboxes" items-per-page-text="Cuentas por página" page-text="{0}-{1} de {2}"><template #item.status="{ item }"><v-chip :color="item.status === 'Activa' ? '#43A047' : '#E53935'" size="small" variant="tonal">{{ item.status }}</v-chip></template><template #item.actions="{ item }"><v-btn icon="mdi-pencil-outline" color="#FFB300" variant="text" size="small" aria-label="Editar cuenta" @click="openEditMailbox(item)" /></template></v-data-table></v-card-text></v-card></v-dialog>
    <MailboxDialog v-model="mailboxFormDialog" :domain="selectedDomain" :mailbox="selectedMailbox" @saved="saved" />
  </section>
</template>
