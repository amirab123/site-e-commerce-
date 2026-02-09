<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMagasinStore } from '../store/magasin'
import { auth } from '../api/firebase'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'

const router = useRouter()
const store = useMagasinStore()

const nomUtilisateur = ref('')
const email = ref('')
const motDePasse = ref('')
const confirmation = ref('')
const erreur = ref('')

const googleProvider = new GoogleAuthProvider()


onMounted(() => {
  if (store.utilisateur) router.replace('/')
})

watch(() => store.utilisateur, (user) => {
  if (user) router.replace('/')
})


const regexMotDePasse =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/

const forceMotDePasse = computed(() => {
  const pwd = motDePasse.value

  if (!pwd) return ''  

  let score = 0
  if (pwd.length >= 6) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(pwd)) score++

  if (score <= 2) return 'Faible'
  if (score === 3 || score === 4) return 'Moyen'
  return 'Fort'
})




function messageErreurFirebase(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return "Email déjà utilisé."
    case 'auth/invalid-email':
      return "Email invalide."
    case 'auth/weak-password':
      return "Mot de passe trop faible."
    default:
      return "Erreur lors de l'inscription."
  }
}


async function inscription() {
  erreur.value = ''

  if (!nomUtilisateur.value.trim()) {
    erreur.value = "Le nom d'utilisateur est obligatoire."
    return
  }

  if (!/.+@.+\..+/.test(email.value)) {
    erreur.value = "Email invalide."
    return
  }

  if (!regexMotDePasse.test(motDePasse.value)) {
    erreur.value =
      "Mot de passe : 6 caractères min, 1 lettre, 1 chiffre, 1 caractère spécial."
    return
  }

  if (motDePasse.value !== confirmation.value) {
    erreur.value = "Les mots de passe ne correspondent pas."
    return
  }

  try {
    const res = await createUserWithEmailAndPassword(
      auth,
      email.value,
      motDePasse.value
    )

    store.setUtilisateur({
      ...res.user,
      nomUtilisateur: nomUtilisateur.value
    })

    const redirect = router.currentRoute.value.query.redirect || '/'
    router.replace(redirect)
  } catch (e) {
    erreur.value = messageErreurFirebase(e.code)
  }
}


async function inscriptionGoogle() {
  erreur.value = ''
  try {
    const res = await signInWithPopup(auth, googleProvider)

    store.setUtilisateur({
      ...res.user,
      nomUtilisateur: res.user.displayName || 'Utilisateur Google'
    })

    const redirect = router.currentRoute.value.query.redirect || '/'
    router.replace(redirect)
  } catch (e) {
    erreur.value = "Erreur lors de l'inscription avec Google."
    console.error(e)
  }
}
</script>

<template>
  <section class="page">
    <h1>Inscription</h1>

    <form @submit.prevent="inscription">
      <input
        type="text"
        v-model="nomUtilisateur"
        placeholder="Nom d'utilisateur"
        required
      />

      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
      />

      <input
        type="password"
        v-model="motDePasse"
        placeholder="Mot de passe"
        required
      />

   <p
  v-if="forceMotDePasse"
  class="force"
  :class="forceMotDePasse"
>
  Force du mot de passe : {{ forceMotDePasse }}
</p>


      <input
        type="password"
        v-model="confirmation"
        placeholder="Confirmer le mot de passe"
        required
      />

      <button type="submit">S'inscrire</button>
    </form>

    <button class="google" @click="inscriptionGoogle">
      S'inscrire avec Google
    </button>

    <p v-if="erreur" class="erreur">{{ erreur }}</p>

    <p>
      <router-link to="/connexion">
        Déjà un compte ? Connectez-vous
      </router-link>
    </p>
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

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 5px;
}

input:focus {
  border-color: #07835c;
  outline: none;
  box-shadow: 0 0 5px rgba(7, 131, 92, 0.3);
}

button {
  width: 100%;
  background: #07835c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 10px;
}

button:hover {
  background: #056645;
}

button.google {
  background: #cb3b6d;
}

button.google:hover {
  background: #d633c3;
}

.erreur {
  color: #d93025;
  margin-top: 15px;
  font-weight: 500;
}

.force {
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.force.Faible {
  color: #d93025;
}

.force.Moyen {
  color: #fbbc05;
}

.force.Fort {
  color: #34a853;
}
</style>
