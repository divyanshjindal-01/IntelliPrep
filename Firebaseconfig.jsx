import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ fix here

const firebaseConfig = {
 
  authDomain: "intelliprep-5b45f.firebaseapp.com",
  projectId: "intelliprep-5b45f",
  storageBucket: "intelliprep-5b45f.appspot.com", // small typo fixed
  messagingSenderId: "1094431917407",
  appId: "1:1094431917407:web:4419229b84f783aba022ea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
