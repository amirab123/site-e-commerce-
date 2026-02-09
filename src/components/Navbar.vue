<script setup>
import { computed, ref, watch } from 'vue'
import { useMagasinStore } from '../store/magasin'
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'

const store = useMagasinStore()
const router = useRouter()


const isAuth = computed(() => !!store.utilisateur)


const cartCount = computed(() =>
  store.panier.reduce((total, p) => total + p.quantite, 0)
)


const animateBadge = ref(false)


watch(cartCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    animateBadge.value = true
    setTimeout(() => (animateBadge.value = false), 300)
  }
})


function logout() {
  store.deconnexion()
  router.push('/connexion')
}
</script>

<template>
  <header>
    <nav class="nav">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <img :src="logo" alt="ShopQuebec" />
        <span>ShopQuebec</span>
      </router-link>

      <!-- Liens -->
      <div class="nav-links">
        <router-link to="/produits">Produits</router-link>

        <router-link v-if="isAuth" to="/panier" class="panier-link">
          Panier
          <span class="badge" :class="{ animate: animateBadge }">{{ cartCount }}</span>
        </router-link>

        <router-link v-if="!isAuth" to="/connexion">Connexion</router-link>
        <router-link v-if="!isAuth" to="/inscription"> Créez un compte </router-link>

        <span v-if="isAuth" class="user">
          Bonjour {{ store.utilisateur.nomUtilisateur || store.utilisateur.email }} 
          <button @click="logout">Déconnexion</button>
        </span>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #13c69f;
}


.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
}

.logo img {
  height: 50px;
  object-fit: contain;
  transition: transform 0.3s;
}

.logo img:hover {
  transform: scale(1.05);
}


.nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  position: relative;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}


.panier-link {
  display: flex;
  align-items: center;
  gap: 5px;
}

.badge {
  background-color: #ff4d4f;
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  transition: transform 0.3s ease;
}

.badge.animate {
  transform: scale(1.5);
}


button {
  background: none;
  border: 1px solid white;
  padding: 5px 10px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

button:hover,
a:hover {
  opacity: 0.8;
}


@media (max-width: 600px) {
  .nav {
    flex-direction: column;
    gap: 10px;
  }
  .nav-links {
    flex-direction: column;
  }
}
</style>
