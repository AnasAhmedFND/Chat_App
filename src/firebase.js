
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfAl-i6yRzNxmdTZbz0G3tWwL1SuqZ-Yk",
  authDomain: "real-chat-app-d3f6e.firebaseapp.com",
  projectId: "real-chat-app-d3f6e",
  storageBucket: "real-chat-app-d3f6e.firebasestorage.app",
  messagingSenderId: "487595839302",
  appId: "1:487595839302:web:6daba13ab61955eba19f47"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Firestore exports
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);


