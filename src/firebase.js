import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCDz5Zl0dhI_DePjfgVkZCoV23h7LNSn0c",
  authDomain: "riskbank-tradebook.firebaseapp.com",
  projectId: "riskbank-tradebook",
  storageBucket: "riskbank-tradebook.firebasestorage.app",
  messagingSenderId: "530375326827",
  appId: "1:530375326827:web:fd9ffaed68bab0527e852e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);