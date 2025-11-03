// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA9lOPDNbUeKswlhwL6Mujeb8jKF134nOk",
  authDomain: "intelliprep-5b45f.firebaseapp.com",
  projectId: "intelliprep-5b45f",
  storageBucket: "intelliprep-5b45f.appspot.com",
  messagingSenderId: "1094431917407",
  appId: "1:1094431917407:web:4419229b84f783aba022ea",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Auth setup
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

export { app,auth, googleProvider, githubProvider, microsoftProvider, db };
