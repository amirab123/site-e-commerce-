import axios from 'axios'
import { ref } from 'vue'

const BASE_URL = 'https://fakestoreapi.com'

export function useApi() {
  const produits = ref([])
  const categories = ref([])
  const produit = ref(null)
  const chargement = ref(false)
  const erreur = ref(null)


  const chargerProduits = async () => {
    chargement.value = true
    erreur.value = null
    try {
      const res = await axios.get(`${BASE_URL}/products`)
      produits.value = res.data
    } catch (e) {
      erreur.value = 'Erreur chargement produits'
      console.error(e)
    } finally {
      chargement.value = false
    }
  }

 
  const chargerCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products/categories`)
      categories.value = res.data
    } catch (e) {
      erreur.value = 'Erreur chargement catégories'
      console.error(e)
    }
  }


  const chargerProduitsParCategorie = async (categorie) => {
    chargement.value = true
    erreur.value = null
    try {
      const res = await axios.get(`${BASE_URL}/products/category/${categorie}`)
      produits.value = res.data
    } catch (e) {
      erreur.value = 'Erreur chargement catégorie'
      console.error(e)
    } finally {
      chargement.value = false
    }
  }


  const chargerProduit = async (id) => {
    chargement.value = true
    erreur.value = null
    try {
      const res = await axios.get(`${BASE_URL}/products/${id}`)
      produit.value = res.data
    } catch (e) {
      erreur.value = 'Erreur chargement produit'
      console.error(e)
    } finally {
      chargement.value = false
    }
  }


  const filtrerProduits = (terme) => {
    if (!terme) return produits.value
    return produits.value.filter(p =>
      p.title.toLowerCase().includes(terme.toLowerCase())
    )
  }

  return {
    produits,
    categories,
    produit,
    chargement,
    erreur,
    chargerProduits,
    chargerCategories,
    chargerProduitsParCategorie,
    chargerProduit,
    filtrerProduits
  }
}
