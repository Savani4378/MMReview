import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "summer-pattern-qcf5x",
  appId: "1:374954115753:web:ba8985e6654526168b1fb8",
  apiKey: "AIzaSyDg8x_jv6vQd1upt-ctB5S9a2x6c-Z6azM",
  authDomain: "summer-pattern-qcf5x.firebaseapp.com",
  storageBucket: "summer-pattern-qcf5x.firebasestorage.app",
  messagingSenderId: "374954115753"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-meetmosaicfeedba-4698707d-d43c-4580-82cd-f86b437f6613");
