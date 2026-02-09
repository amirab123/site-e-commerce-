<script setup>
import { useRouter } from 'vue-router'
defineProps({ produit: Object })
const emit = defineEmits(['ajouter'])
const router = useRouter()

function allerDetail() {
  router.push(`/produits/${produit.id}`)
}

function ajouter() {
  emit('ajouter', produit)
}
</script>

<template>
  <article class="carte-produit">
    <img :src="produit.image" :alt="produit.title" @click="allerDetail" />
    <div class="infos">
      <h3 @click="allerDetail">{{ produit.title }}</h3>
      <p class="prix">{{ produit.price }} $</p>
      <p>Catégorie: {{ produit.category }}</p>
      <p>⭐ {{ produit.rating.rate }} ({{ produit.rating.count }})</p>
      <button @click.stop="ajouter">Ajouter au panier</button>
    </div>
  </article>
</template>

<style scoped>
.carte-produit { background:#fff; border-radius:12px; padding:15px; box-shadow:0 4px 12px rgba(0,0,0,0.08); cursor:pointer; transition:0.3s; }
.carte-produit img { width:100%; height:220px; object-fit:contain; margin-bottom:10px; }
.carte-produit h3 { font-size:16px; margin-bottom:5px; }
button { padding:6px 12px; background:#13c69f; border:none; color:#fff; border-radius:6px; cursor:pointer; }
button:hover { background:#07835c; }
</style>
