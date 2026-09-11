import { reactive } from 'vue'

const storageKey = 'emailpro.website-manager.v1'
export const sectionTypes = [
  { type: 'home', title: 'Inicio', icon: 'mdi-home-outline' },
  { type: 'about', title: 'Nosotros', icon: 'mdi-account-group-outline' },
  { type: 'carousel', title: 'Carrusel principal', icon: 'mdi-image-multiple-outline' },
  { type: 'offerings', title: 'Productos y servicios', icon: 'mdi-package-variant-closed' },
  { type: 'contact', title: 'Contacto', icon: 'mdi-email-outline' },
  { type: 'privacy_notice', title: 'Aviso de privacidad', icon: 'mdi-file-document-outline' },
]
let saved = {}
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') } catch { /* Start with an empty local demo. */ }
export const websites = reactive(saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {})
export const clone = (value) => JSON.parse(JSON.stringify(value))
export function commitWebsite(domainId, value) {
  const next = { ...clone(websites), [domainId]: clone(value) }
  // Persist before mutating the screen, so a quota failure does not look like success.
  localStorage.setItem(storageKey, JSON.stringify(next))
  websites[domainId] = clone(value)
}
export function createWebsite(domain, client) {
  if (websites[domain.id]) return
  commitWebsite(domain.id, {
    published: false,
    identity: { name: client.commercialName, tagline: '', logo: '', primary: '#2962FF', secondary: '#43A047', background: '#F8F6EE', text: '#212121' },
    sections: sectionTypes.map((item) => ({ ...item, id: item.type, active: item.type !== 'privacy_notice', description: '', image: '', items: [], categories: [], contact: {} })),
  })
}
export const required = (value) => !!String(value ?? '').trim() || 'Este campo es obligatorio.'
export const safeImage = (value) => !value || /^(https:\/\/|data:image\/(png|jpeg|webp);base64,)/i.test(value)
