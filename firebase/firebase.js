import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzG0ezm3s7DImXxCWmomsMBm4Z8IZWrRc",
  authDomain: "vehicle-tracking-web-bf51e.firebaseapp.com",
  projectId: "vehicle-tracking-web-bf51e",
  storageBucket: "vehicle-tracking-web-bf51e.appspot.com",
  messagingSenderId: "683576781113",
  appId: "1:683576781113:web:2fdbfe1b4a02080ebf20e8",
  measurementId: "G-GZYY0HB6JT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getFirestore(app);
export { auth, firestore, db };
