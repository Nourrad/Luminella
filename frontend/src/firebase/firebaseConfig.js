// src/firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyADRPXBR3_Iv-zCrZhHY1CN27AV8pGO4zc",
  authDomain: "luminella-38832.firebaseapp.com",
  projectId: "luminella-38832",
  storageBucket: "luminella-38832.firebasestorage.app", // ✅ fixed domain
  messagingSenderId: "351714681056",
  appId: "1:351714681056:web:c9bdb4aa32360eaa74f085",
  measurementId: "G-3LG5925TD9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
