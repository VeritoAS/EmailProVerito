import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { clientProfile, distributorClients, distributorDomains } from '../store/distributor'
import { websites } from '../store/websiteManager'

export function useWebsiteManager() {
  const route = useRoute()
  const isClient = computed(() => route.meta.role === 'client')
  const clientId = computed(() => isClient.value ? clientProfile.clientId : Number(route.params.id))
  const client = computed(() => distributorClients.find((item) => item.id === clientId.value))
  const domain = computed(() => distributorDomains.find((item) => item.id === Number(route.params.domainId) && item.clientId === clientId.value))
  const website = computed(() => domain.value ? websites[domain.value.id] : null)
  const back = computed(() => isClient.value ? '/cliente/dominios' : `/distribuidor/clientes/${clientId.value}`)
  const base = computed(() => `${back.value}${isClient.value ? '' : '/dominios'}/${route.params.domainId}/gestor`)
  return { route, client, domain, website, back, base }
}
