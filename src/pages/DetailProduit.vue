<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useMagasinStore } from '../store/magasin'

const store = useMagasinStore()
const route = useRoute()
const router = useRouter()
const produit = ref(null)
const chargement = ref(true)
const erreur = ref(null)


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


async function chargerProduit() {
  try {
    const res = await axios.get(`https://fakestoreapi.com/products/${route.params.id}`)
    produit.value = res.data
  } catch (e) {
    erreur.value = "Erreur lors du chargement du produit"
    console.error(e)
  } finally {
    chargement.value = false
  }
}


function ajouterAuPanier() {
  if (!store.utilisateur) {
    showMessage('🔐 Vous devez être connecté pour ajouter au panier !', 'error')
    return
  }

  showConfirm(
    `Ajouter "${produit.value.title}" au panier ?`,
    () => {
      store.ajouterPanier(produit.value)
      showMessage(`✅ Produit ajouté au panier !`, 'success')
    },
    () => {
      showMessage(`❌ Ajout annulé`, 'error')
    }
  )
}

onMounted(() => {
  chargerProduit()
})
</script>

<template>
  <section v-if="chargement" class="chargement">Chargement...</section>
  <section v-else-if="erreur" class="erreur">{{ erreur }}</section>
  <section v-else class="detail-produit-page">

    <div class="image">
      <img :src="produit.image" :alt="produit.title" />
    </div>

    <div class="infos">
      <h1>{{ produit.title }}</h1>
      <p class="prix">{{ produit.price }} $</p>
      <p class="categorie">Catégorie : {{ produit.category }}</p>
      <p class="note">⭐ {{ produit.rating.rate }} <span>({{ produit.rating.count }})</span></p>

   
      <h4>   Description :</h4>
      <p class="description">{{ produit.description }}</p>

      <button 
        v-if="store.utilisateur"
        @click="ajouterAuPanier"
      >
        Ajouter au panier
      </button>

      <p v-else class="connexion-msg">
        🔒 Connectez-vous pour ajouter ce produit au panier
      </p>
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
.detail-produit-page {
  max-width: 1000px;
  margin: 40px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding: 0 20px;
  font-family: Arial, sans-serif;
}

.image {
  flex: 1;
  max-width: 400px;
  overflow: hidden;
  border-radius: 12px;
}

.image img {
  width: 100%;
  object-fit: contain;
  animation: zoomLoop 5s infinite ease-in-out;
}

@keyframes zoomLoop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.infos {
  flex: 1;
}

.infos h1 {
  color: #07835c;
  margin-bottom: 20px;
}

.infos .prix {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0ec05e;
  margin-bottom: 15px;
}

.infos .categorie {
  display: inline-block;
  background: #e0f7f1;
  color: #07835c;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.infos .description {
  line-height: 1.6;
  font-size: 1rem;
  color: #333;
  background: #f9f9f9;
  padding: 15px 20px;
  border-left: 4px solid #07835c;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

button {
  padding: 12px 24px;
  background-color: #13c69f;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background-color: #07835c;
}

.connexion-msg {
  margin-top: 20px;
  font-style: italic;
  color: #e95e5e;
}


.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  z-index: 9999;
  color: #fff;
  font-weight: 500;
  pointer-events: auto;
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

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 600px) {
  .detail-produit-page { flex-direction: column; }
  .image, .infos { max-width: 100%; }
}
</style>
