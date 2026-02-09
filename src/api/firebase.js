import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAEuXHoDlIP21btjyGGicVZ9evT75lMx_U",
  authDomain: "gestionproduit-37ae1.firebaseapp.com",
  projectId: "gestionproduit-37ae1",
  storageBucket: "gestionproduit-37ae1.firebasestorage.app",
  messagingSenderId: "823587792419",
  appId: "1:823587792419:web:eeafd59c5655baa71af396",
  measurementId: "G-DD0PKD4QY9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { onAuthStateChanged }; // ⚡ export pour le store
