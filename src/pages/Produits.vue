<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../api/useApi'
import { useMagasinStore } from '../store/magasin'

const router = useRouter()
const store = useMagasinStore()
const { produits, chargement, erreur, chargerProduits, categories, chargerCategories } = useApi()

const categorieSelectionnee = ref('Toutes')


const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref('success') 
let toastTimeout = null

function showMessage(message, type = 'success') {
  toastMessage.value = message
  toastType.value = type
  toastVisible.value = true
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => toastVisible.value = false, 2500)
}


const confirmVisible = ref(false)
let actionConfirmer = null
let actionAnnuler = null
let confirmMessage = ''

function showConfirm(message, onYes, onNo) {
  confirmMessage = message
  actionConfirmer = onYes
  actionAnnuler = onNo
  confirmVisible.value = true
}
function onConfirmYes() {
  confirmVisible.value = false
  if (actionConfirmer) actionConfirmer()
}
function onConfirmNo() {
  confirmVisible.value = false
  if (actionAnnuler) actionAnnuler()
}

onMounted(() => {
  chargerProduits()
  chargerCategories()
})

const produitsFiltres = computed(() => {
  if (categorieSelectionnee.value === 'Toutes') return produits.value
  return produits.value.filter(p => p.category === categorieSelectionnee.value)
})

function ajouterAuPanier(produit) {
  if (!store.utilisateur) {
    showMessage('🔐 Connectez-vous pour ajouter au panier', 'error')
    router.push('/connexion')
    return
  }

  const id = produit.id
  const nom = produit.title || produit.name

  showConfirm(
    `Ajouter "${nom}" au panier ?`,
    () => {
      store.ajouterPanier(produit)
      showMessage(`✅ ${nom} ajouté au panier`, 'success')
      const existe = store.panier.find(p => p.id === id)
      if (existe && existe.quantite > 1) {
        showMessage(`⚡ Quantité mise à jour : ${nom}`, 'success')
      }
    },
    () => {
      showMessage(`❌ Ajout annulé`, 'error')
    }
  )
}

function allerDetail(id) {
  router.push(`/produits/${id}`)
}

function etoiles(rate) {
  const note = Math.round(rate)
  return '★'.repeat(note) + '☆'.repeat(5 - note)
}
</script>

<template>
  <section class="produits-page">
    <h1>Produits</h1>

    <p v-if="chargement">Chargement...</p>
    <p v-if="erreur" class="erreur">{{ erreur }}</p>


    <div v-if="categories.length" class="filtre-categorie">
      <button
        :class="{ actif: categorieSelectionnee === 'Toutes' }"
        @click="categorieSelectionnee = 'Toutes'"
      >
        Toutes
      </button>

      <button
        v-for="c in categories"
        :key="c"
        :class="{ actif: categorieSelectionnee === c }"
        @click="categorieSelectionnee = c"
      >
        {{ c }}
      </button>
    </div>


    <div v-if="produitsFiltres.length" class="grille-produits">
      <div
        v-for="(p, index) in produitsFiltres"
        :key="p.id"
        class="produit-card"
        :style="{ animationDelay: index * 0.05 + 's' }"
      >
        <img :src="p.image" :alt="p.title" @click="allerDetail(p.id)" />
        <h2 @click="allerDetail(p.id)">{{ p.title }}</h2>
        <p class="prix">{{ p.price }} $</p>
        <p class="note">{{ etoiles(p.rating.rate) }} ({{ p.rating.count }})</p>

        <button v-if="store.utilisateur" @click="ajouterAuPanier(p)">
          Ajouter au panier
        </button>

        <p v-else class="message-non-connecte">
          Connectez-vous pour ajouter au panier
        </p>
      </div>
    </div>

 
    <transition name="toast">
      <div v-show="toastVisible" :class="['toast', toastType]">
        {{ toastMessage }}
      </div>
    </transition>


    <div v-if="confirmVisible" class="modal">
      <div class="modal-content">
        <p>{{ confirmMessage }}</p>
        <div class="actions">
          <button class="btn-confirm" @click="onConfirmYes">Oui</button>
          <button class="btn-cancel" @click="onConfirmNo">Non</button>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.produits-page {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
h1 { text-align: center; color: #07835c; margin-bottom: 30px; }

.filtre-categorie {
  margin-bottom: 15px;
}
.filtre-categorie button {
  margin: 5px 5px 5px 0;
  padding: 6px 12px;
  border: 1px solid #07835c;
  border-radius: 6px;
  background: #fff;
  color: #07835c;
  cursor: pointer;
  transition: all 0.3s;
}
.filtre-categorie button.actif,
.filtre-categorie button:hover {
  background-color: #07835c;
  color: #fff;
}

.grille-produits {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.produit-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  background: #fff;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeSlideIn 0.5s forwards;
}
@keyframes fadeSlideIn { to { opacity: 1; transform: translateY(0); } }

.produit-card img {
  max-width: 100%;
  height: 150px;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.produit-card img:hover { transform: scale(1.1); }

.produit-card h2 {
  font-size: 1rem;
  margin: 8px 0;
  cursor: pointer;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.produit-card h2:hover { color: #07835c; }

.prix { color: #0ec05e; font-weight: bold; }
.note { color: #f5c518; font-size: 0.9rem; }

.produit-card button {
  margin-top: 10px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background-color: #07835c;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s;
}
.produit-card button:hover { background-color: #056645; }

.message-non-connecte { color: #d33; font-size: 0.9rem; }


.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 0.95rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  z-index: 9999;
  color: #fff;
  font-weight: 500;
}
.toast.success { background-color: #07835c; }
.toast.error { background-color: #d33; }
.toast-enter-active,
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from,
.toast-leave-to { opacity: 0; transform: translateY(20px); }


.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 25px 30px;
  border-radius: 12px;
  text-align: center;
  min-width: 300px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  animation: fadeIn 0.3s ease;
}
.actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
.btn-confirm {
  background: #07835c;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.btn-confirm:hover { background: #056645; transform: translateY(-2px); }
.btn-cancel {
  background: #d33;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.btn-cancel:hover { background: #a61e4d; transform: translateY(-2px); }

@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

@media (max-width: 600px) {
  .grille-produits { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .produit-card img { height: 120px; }
}
</style>
