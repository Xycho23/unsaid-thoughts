// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Add Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Add Firestore
import { getStorage } from "firebase/storage"; // Add Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy-fbV2Ml-_zD0qB3okOsgMLt7QP0-PsE",
  authDomain: "unsaidthoughts-64509.firebaseapp.com",
  projectId: "unsaidthoughts-64509",
  storageBucket: "unsaidthoughts-64509.firebasestorage.app",
  messagingSenderId: "271156538942",
  appId: "1:271156538942:web:134f2d15b5593b20f16b6f",
  measurementId: "G-PV793GHEYQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize Analytics (optional)
const auth = getAuth(app); // Initialize Authentication
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

// Export Firebase services
export { app, analytics, auth, db, storage };