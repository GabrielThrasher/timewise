// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABsFERUUxXybrBvrazns-kW6pIzB8Rh8o",
  authDomain: "timewise-32065.firebaseapp.com",
  projectId: "timewise-32065",
  storageBucket: "timewise-32065.firebasestorage.app",
  messagingSenderId: "259447612920",
  appId: "1:259447612920:web:c9e527ceffda8320eae20d",
  measurementId: "G-PSDC6C0NLN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
