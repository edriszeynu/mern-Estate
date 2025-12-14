// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernestate-project.firebaseapp.com",
  projectId: "mernestate-project",
  storageBucket: "mernestate-project.firebasestorage.app",
  messagingSenderId: "171589636804",
  appId: "1:171589636804:web:8f5d390c3a900c1d612f91"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);