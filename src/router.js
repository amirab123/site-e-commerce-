import { createRouter, createWebHistory } from 'vue-router'
import { useMagasinStore } from './store/magasin'

import Accueil from './Pages/Accueil.vue'
import Produits from './pages/Produits.vue'
import DetailProduit from './pages/DetailProduit.vue'
import Panier from './pages/Panier.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import NotFound from './pages/NotFound.vue'


const routes = [
  { path: '/', name: 'Accueil', component: Accueil },
  { path: '/produits', name: 'Produits', component: Produits },
  { path: '/produits/:id', name: 'DetailProduit', component: DetailProduit },
  { path: '/panier', name: 'Panier', component: Panier, meta: { requiresAuth: true } },
  { path: '/connexion', name: 'Login', component: Login },
  { path: '/inscription', name: 'Register', component: Register },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useMagasinStore()
  if (to.meta.requiresAuth && !store.utilisateur) {
    next({ path: '/connexion', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
