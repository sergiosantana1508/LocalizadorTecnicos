// ======================================
// FIREBASE
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";



const firebaseConfig = {

    apiKey: "AIzaSyAuUZm9Ac7E2TujnCXpAzg-iaqcxg5XbeA",

    authDomain: "localizadortecnicos.firebaseapp.com",

    projectId: "localizadortecnicos",

    storageBucket: "localizadortecnicos.firebasestorage.app",

    messagingSenderId: "407071243026",

    appId: "1:407071243026:web:4dde5093550b3c31bc51cb"

};



const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export {

    collection,

    getDocs,

    addDoc,

    updateDoc,

    deleteDoc,

    doc

};