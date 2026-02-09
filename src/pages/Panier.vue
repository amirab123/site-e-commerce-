<script setup>
import { ref } from 'vue'
import { useMagasinStore } from '../store/magasin'

const store = useMagasinStore()
const paiementOk = ref(false)
const confirmSupprimer = ref(false)
let produitASupprimer = null
const confirmViderPanier = ref(false)
const confirmPaiement = ref(false) 


function demanderPaiement() {
  confirmPaiement.value = true
}

function confirmerPaiement() {
  store.viderPanier()
  paiementOk.value = true
  confirmPaiement.value = false
  setTimeout(() => paiementOk.value = false, 3000)
}

function annulerPaiement() {
  confirmPaiement.value = false
}


function supprimerProduit(id) {
  produitASupprimer = id
  confirmSupprimer.value = true
}

function confirmerSupprimer() {
  store.retirerPanier(produitASupprimer)
  confirmSupprimer.value = false
}

function annulerSupprimer() {
  confirmSupprimer.value = false
}


function viderPanier() {
  confirmViderPanier.value = true
}

function confirmerViderPanier() {
  store.viderPanier()
  confirmViderPanier.value = false
}

function annulerViderPanier() {
  confirmViderPanier.value = false
}
</script>

<template>
  <section class="panier-page">
    <h1>Mon Panier</h1>

 
    <transition name="fade">
      <div v-if="paiementOk" class="alerte-succes">
        ✅ Paiement effectué avec succès ! Merci pour votre commande.
      </div>
    </transition>


    <div v-if="store.panier.length === 0 && !paiementOk" class="vide">
      Votre panier est vide.
    </div>

  
    <ul v-if="store.panier.length > 0" class="liste-panier">
      <li v-for="p in store.panier" :key="p.id" class="panier-item">
        <img :src="p.image" :alt="p.nom" class="img-panier" />
        <div class="details">
          <h3>{{ p.nom }}</h3>
          <p v-if="p.description">Description : {{ p.description }}</p>
          <p>Quantité : {{ p.quantite }}</p>
          <p>Prix unitaire : {{ p.price.toFixed(2) }} $</p>
          <p>Sous-total : {{ (p.price * p.quantite).toFixed(2) }} $</p>

          <button class="btn-supprimer" @click="supprimerProduit(p.id)">
            Supprimer
          </button>
        </div>
      </li>
    </ul>


    <div v-if="store.panier.length > 0" class="totaux">
      <p>Sous-total : {{ store.sousTotal.toFixed(2) }} $</p>
      <p>Taxes (15%) : {{ store.taxes.toFixed(2) }} $</p>
      <p><strong>Total : {{ store.total.toFixed(2) }} $</strong></p>

      <div class="actions-panier">
        <button class="btn-payer" @click="demanderPaiement">💳 Payer</button>
        <button class="btn-vider" @click="viderPanier">🗑 Vider le panier</button>
      </div>
    </div>


    <div v-if="confirmSupprimer" class="modal">
      <div class="modal-content">
        <p>⚠️ Voulez-vous vraiment supprimer ce produit ?</p>
        <div class="actions">
          <button @click="confirmerSupprimer" class="btn-confirm">Oui</button>
          <button @click="annulerSupprimer" class="btn-cancel">Non</button>
        </div>
      </div>
    </div>


    <div v-if="confirmViderPanier" class="modal">
      <div class="modal-content">
        <p>⚠️ Voulez-vous vraiment vider le panier ?</p>
        <div class="actions">
          <button @click="confirmerViderPanier" class="btn-confirm">Oui</button>
          <button @click="annulerViderPanier" class="btn-cancel">Non</button>
        </div>
      </div>
    </div>


    <div v-if="confirmPaiement" class="modal">
      <div class="modal-content">
        <p>💳 Voulez-vous vraiment payer votre commande ?</p>
        <div class="actions">
          <button @click="confirmerPaiement" class="btn-confirm">Oui</button>
          <button @click="annulerPaiement" class="btn-cancel">Non</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panier-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #07835c;
  margin-bottom: 25px;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.alerte-succes {
  background-color: #d3f9d8;
  color: #2b8a3e;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}

.vide {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
}

.liste-panier {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panier-item {
  display: flex;
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
  transition: background 0.2s;
}
.panier-item:hover {
  background: #f9f9f9;
}

.img-panier {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.details h3 {
  margin: 0 0 10px 0;
  color: #07835c;
}

.btn-supprimer {
  margin-top: 10px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ff6b6b, #cb3b6d);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}
.btn-supprimer:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 10px rgba(0,0,0,0.15);
  background: linear-gradient(135deg, #ff4b4b, #a61e4d);
}

.totaux {
  margin-top: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: right;
}

.actions-panier {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 15px;
}

.btn-payer {
  margin-top: 15px;
  padding: 12px 22px;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #0ca678;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.btn-payer:hover {
  background-color: #099268;
}

.btn-vider {
  background: linear-gradient(135deg, #ff6b6b, #cb3b6d);
  color: white;
    margin-top: 15px;
  padding: 12px 22px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-vider:hover {
  background: linear-gradient(135deg, #ff4b4b, #a61e4d);
  transform: translateY(-2px) scale(1.03);
}

/* Modales */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
  animation: fadeIn 0.3s ease;
}

.modal-content .actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.btn-confirm {
  background: #cb3b6d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm:hover {
  background: #a61e4d;
  transform: translateY(-2px);
}

.btn-cancel {
  background: #aaa;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover {
  background: #888;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
