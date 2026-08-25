import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import PlaceholderView from '../views/PlaceholderView.vue'
import DistributorDashboardView from '../views/distributor_section/dashboard/Home.vue'
import DistributorClientsView from '../views/distributor_section/clients/List.vue'
import DistributorAccountView from '../views/distributor_section/account/Information.vue'
import DistributorAccountForm from '../views/distributor_section/account/Form.vue'
import DistributorClientForm from '../views/distributor_section/clients/Form.vue'
import DistributorClientShow from '../views/distributor_section/clients/Show.vue'
import DistributorDomainForm from '../views/distributor_section/domains/Form.vue'
import DistributorMailboxForm from '../views/distributor_section/mailboxes/Form.vue'
import ClientDashboardView from '../views/client_section/dashboard/Home.vue'
import ClientDomainsView from '../views/client_section/domains/List.vue'
import ClientAccountView from '../views/client_section/account/Information.vue'
import ClientAccountForm from '../views/client_section/account/Form.vue'
import WebsiteView from '../views/WebsiteView.vue'
// Nota: Hemos eliminado "import DistributorsView..." de aquí

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: DashboardView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true } // Esta meta etiqueta es vital para tu App.vue
    },
    {
      path: '/sitio',
      name: 'website',
      component: WebsiteView,
      meta: { public: true }
    },
    {
      path: '/distribuidor',
      name: 'distributor-dashboard',
      component: DistributorDashboardView,
      meta: { role: 'distributor' }
    },
    {
      path: '/distribuidor/clientes',
      name: 'distributor-clients',
      component: DistributorClientsView,
      meta: { role: 'distributor' }
    },
    {
      path: '/distribuidor/clientes/nuevo',
      name: 'distributor-client-create',
      component: DistributorClientForm,
      meta: { role: 'distributor' }
    },
    {
      path: '/distribuidor/clientes/:id',
      name: 'distributor-client-show',
      component: DistributorClientShow,
      meta: { role: 'distributor' }
    },
    {
      path: '/distribuidor/clientes/:id/dominios/nuevo',
      name: 'distributor-domain-create',
      component: DistributorDomainForm,
      meta: { role: 'distributor' }
    },
    {
      path: '/distribuidor/clientes/:id/dominios/:domainId/cuentas/nuevo',
      name: 'distributor-mailbox-create',
      component: DistributorMailboxForm,
      meta: { role: 'distributor' }
    },
    {
      path: '/distribuidor/mi-cuenta',
      name: 'distributor-account',
      component: DistributorAccountView,
      meta: { role: 'distributor' }
    },
    {
      path: '/distribuidor/mi-cuenta/editar',
      name: 'distributor-account-edit',
      component: DistributorAccountForm,
      meta: { role: 'distributor' }
    },
    {
      path: '/cliente',
      name: 'client-dashboard',
      component: ClientDashboardView,
      meta: { role: 'client' }
    },
    {
      path: '/cliente/dominios',
      name: 'client-domains',
      component: ClientDomainsView,
      meta: { role: 'client' }
    },
    {
      path: '/cliente/mi-cuenta',
      name: 'client-account',
      component: ClientAccountView,
      meta: { role: 'client' }
    },
    {
      path: '/cliente/mi-cuenta/editar',
      name: 'client-account-edit',
      component: ClientAccountForm,
      meta: { role: 'client' }
    },
    
    // --- Módulo de Distribuidores ---
    {
      path: '/distribuidores',
      name: 'distribuidores-list',
      component: () => import('../views/distributors/List.vue')
    },
    {
      path: '/distribuidores/nuevo',
      name: 'distribuidores-create',
      component: () => import('../views/distributors/Form.vue')
    },
    {
      path: '/distribuidores/:id',
      name: 'distribuidores-show',
      component: () => import('../views/distributors/Show.vue')
    },
    {
      path: '/distribuidores/:id/editar',
      name: 'distribuidores-edit',
      component: () => import('../views/distributors/Form.vue')
    },

    {
      path: '/usuarios',
      name: 'usuarios',
      component: PlaceholderView
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: PlaceholderView
    }
  ]
})

export default router
