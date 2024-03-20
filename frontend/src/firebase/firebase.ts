// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD6_1HxrB9hAIL-7Oc1ctaBHvj32LLgono",
  authDomain: "femwell-testing-3c4bb.firebaseapp.com",
  projectId: "femwell-testing-3c4bb",
  storageBucket: "femwell-testing-3c4bb.appspot.com",
  messagingSenderId: "763581336732",
  appId: "1:763581336732:web:3922b9c6bfd13b5dc5f159",
  measurementId: "G-NY7V9T8FFY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
