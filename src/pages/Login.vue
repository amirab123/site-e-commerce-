<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMagasinStore } from '../store/magasin'
import { auth, googleProvider } from '../api/firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

const router = useRouter()
const store = useMagasinStore()

const email = ref('')
const motDePasse = ref('')
const erreur = ref('')

onMounted(() => {
  if (store.utilisateur) router.replace('/')
})

watch(() => store.utilisateur, (user) => {
  if (user) router.replace('/')
})

function messageErreurFirebase(code) {
  switch(code) {
    case 'auth/user-not-found': return "Utilisateur non trouvé."
    case 'auth/wrong-password': return "Mot de passe incorrect."
    case 'auth/invalid-email': return "Email invalide."
    default: return "Erreur lors de la connexion."
  }
}

async function connexion() {
  erreur.value = ''
  try {
    const res = await signInWithEmailAndPassword(auth, email.value, motDePasse.value)
    store.setUtilisateur(res.user)
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.replace(redirect)
  } catch (e) {
    erreur.value = messageErreurFirebase(e.code)
  }
}

async function connexionGoogle() {
  erreur.value = ''
  try {
    const res = await signInWithPopup(auth, googleProvider)
    store.setUtilisateur(res.user)
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.replace(redirect)
  } catch (e) {
    erreur.value = messageErreurFirebase(e.code)
  }
}
</script>

<template>
  <section class="page">
    <h1>Connexion</h1>
    <form @submit.prevent="connexion">
      <input type="email" v-model="email" placeholder="Email" required/>
      <input type="password" v-model="motDePasse" placeholder="Mot de passe" required/>
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="erreur" class="erreur">{{ erreur }}</p>
    <button class="google" @click="connexionGoogle">Se connecter avec Google</button>
    <p><router-link to="/inscription">Pas de compte ? Inscrivez-vous</router-link></p>
  </section>
</template>



<style scoped>

.page {
  max-width: 450px;
  margin: 50px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #07835c;
}

form div {
  margin-bottom: 15px;
  text-align: left;
}

label {
  font-weight: 500;
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  border-color: #07835c;
  outline: none;
  box-shadow: 0 0 5px rgba(7, 131, 92, 0.3);
}

button {
  width: 100%;
  background: #07835c;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  margin-top: 10px;
}

button:hover {
  background: #056645;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.separator {
  margin: 20px 0;
  font-weight: 500;
  color: #888;
}

button.google {
  background: #cb3b6d;
}

button.google:hover {
  background: #d633c3;
}
</style>