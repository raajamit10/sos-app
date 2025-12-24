import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtWg_rYIyh9Gn8REwI4gaXdUv8Nq7cQTo",
  authDomain: "sos-web-2f3a3.firebaseapp.com",
  projectId: "sos-web-2f3a3",
  storageBucket: "sos-web-2f3a3.appspot.com",
  messagingSenderId: "1025261933170",
  appId: "1:1025261933170:web:fbe1befa7b6b501b3828eb",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
