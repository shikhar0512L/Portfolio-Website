// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrEPMRVv4qkYO5KWvQcgEfKvLUD2Smg3A",
  authDomain: "shikhar-singh-in.firebaseapp.com",
  projectId: "shikhar-singh-in",
  storageBucket: "shikhar-singh-in.firebasestorage.app",
  messagingSenderId: "702061837182",
  appId: "1:702061837182:web:151df053ba6d92d96e912f",
  measurementId: "G-SKVJQPP1D7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export
export const db = getFirestore(app);