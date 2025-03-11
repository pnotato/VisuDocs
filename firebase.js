import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "visudocs-beab4.firebaseapp.com",
  projectId: "visudocs-beab4",
  storageBucket: "visudocs-beab4.firebasestorage.app",
  messagingSenderId: "897823269158",
  appId: "1:897823269158:web:58967d81c1a2d044f7e1e7",
  measurementId: "G-D50TQW8X17"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default firebaseApp;