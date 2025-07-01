// // Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// src/firebase/firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyADRPXBR3_Iv-zCrZhHY1CN27AV8pGO4zc",
  authDomain: "luminella-38832.firebaseapp.com",
  projectId: "luminella-38832",
  storageBucket: "luminella-38832.appspot.com", // ✅ fixed domain
  messagingSenderId: "351714681056",
  appId: "1:351714681056:web:c9bdb4aa32360eaa74f085",
  measurementId: "G-3LG5925TD9"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth instance
const auth = getAuth(app);
export { auth };
