import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBS1g62HdwxGJkXKH3vIN28XiPHLddQX8s",
  authDomain: "it-help-e3fad.firebaseapp.com",
  projectId: "it-help-e3fad",
  storageBucket: "it-help-e3fad.appspot.com",
  messagingSenderId: "161882274818",
  appId: "1:161882274818:web:3b3345b09cd1479102bb1b",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
