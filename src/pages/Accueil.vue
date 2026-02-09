<template>
  <section class="page">
    <h1>ShopQuebec - Notre boutique en ligne</h1>
    <p>
      Explorez nos catégories et trouvez facilement les produits qui vous inspirent.
    </p>

    <h2>Nos catégories</h2>
    <div class="categories">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="allerProduits(cat)"
        :class="{ actif: catSelectionnee === cat }"
      >
        {{ cat }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const categories = ref([])
const catSelectionnee = ref(null)

async function chargerCategories() {
  try {
    const res = await fetch('https://fakestoreapi.com/products/categories')
    categories.value = await res.json()
  } catch (err) {
    console.error('Erreur API:', err)
  }
}

function allerProduits(cat) {
  catSelectionnee.value = cat
  console.log('Catégorie sélectionnée :', cat)
}

onMounted(() => {
  chargerCategories()
})
</script>

<style scoped>
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

button {
  padding: 10px 25px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #056645, #2d5449);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}


button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(60deg, rgba(255,255,255,0.2), rgba(255,255,255,0));
  transform: rotate(45deg);
  transition: all 0.5s ease;
}

button:hover::before {
  top: -20%;
  left: -20%;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.35);
}


button.actif {
  background: linear-gradient(135deg, #ff512f, #dd2476);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
  animation: bounce 0.3s;
}

@keyframes bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}


@media (max-width: 600px) {
  .categories {
    flex-direction: column;
  }
  button {
    width: 100%;
    text-align: center;
  }
}
</style>
