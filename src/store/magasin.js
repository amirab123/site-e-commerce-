import { defineStore } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import { auth, onAuthStateChanged } from '../api/firebase'

export const useMagasinStore = defineStore('magasin', () => {
  const utilisateur = ref(null)
  const panier = ref([])

 
  const nombreArticles = computed(() =>
    panier.value.reduce((t, p) => t + p.quantite, 0)
  )

  
  const sousTotal = computed(() =>
    panier.value.reduce((t, p) => t + Number(p.price) * p.quantite, 0)
  )


  const taxes = computed(() => Number((sousTotal.value * 0.15).toFixed(2)))
  const total = computed(() => Number((sousTotal.value + taxes.value).toFixed(2)))


 function ajouterPanier(produit) {
  const id = produit.id
  const nom = produit.title || produit.name
  const price = Number(produit.price)
  const image = produit.image || ''

  const existe = panier.value.find(p => p.id === id)

  if (existe) {
    existe.quantite++

  } else {
    panier.value.push({ id, nom, price, image, quantite: 1 })
  
  }


}



 
  function retirerPanier(id) {
    panier.value = panier.value.filter(p => p.id !== id)
  }

 
  function setUtilisateur(user) {
    utilisateur.value = user
  }

  function deconnexion() {
    utilisateur.value = null
    panier.value = []
    localStorage.removeItem('panier')
    auth.signOut().catch(e => console.error(e))
  }
function viderPanier() {
  panier.value.splice(0)  
}


  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      setUtilisateur(user || null)
    })

    const localPanier = localStorage.getItem('panier')
    if (localPanier) panier.value = JSON.parse(localPanier)
  })


  watch(panier, (val) => {
    localStorage.setItem('panier', JSON.stringify(val))
  }, { deep: true })

  return {
    utilisateur,
    panier,
    nombreArticles,
    sousTotal,
    taxes,
    total,
    ajouterPanier,
    retirerPanier,
    setUtilisateur,
    deconnexion,
      viderPanier 
  }
})
