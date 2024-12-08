// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7xlZMf2EYJHWQuTF2Tf4ZunNmqysbMUs",
  authDomain: "salutdigital-35723.firebaseapp.com",
  projectId: "salutdigital-35723",
  storageBucket: "salutdigital-35723.appspot.com",
  messagingSenderId: "265415135523",
  appId: "1:265415135523:web:15389f6f2da991cbb77c96",
  measurementId: "G-NYZC5RWK36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);