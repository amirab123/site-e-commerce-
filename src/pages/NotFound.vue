<template>
  <section class="page-404">
    <h1>404</h1>
    <p>⚠️ Oups ! La page que vous recherchez n’existe pas.</p>
    <p>Vérifiez l’URL ou revenez à la page d’accueil.</p>
    <button @click="retourAccueil">⬅ Retour à l’accueil</button>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function retourAccueil() {
  router.push('/') 
}
</script>

<style scoped>
.page-404 {
  text-align: center;
  margin: 100px auto;
  font-family: Arial, sans-serif;
}
.page-404 h1 {
  font-size: 6rem;
  color: #d33;
}
.page-404 p {
  font-size: 1.2rem;
  margin: 15px 0;
  color: #555;
}
.page-404 button {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #07835c;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}
.page-404 button:hover {
  background-color: #056645;
  transform: scale(1.05);
}
</style>
