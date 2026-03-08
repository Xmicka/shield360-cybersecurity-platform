import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDBh4N6jRKOL2z0e9M1Dq0lKWrFMsSS5v4",
    authDomain: "behaviour-adapt-spear-phishing.firebaseapp.com",
    projectId: "behaviour-adapt-spear-phishing",
    storageBucket: "behaviour-adapt-spear-phishing.firebasestorage.app",
    messagingSenderId: "35425075133",
    appId: "1:35425075133:web:5409533f44d729771cdcd4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
