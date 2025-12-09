// js/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCn1KgkHczyw_xnVjKTrC9HHkWkjnrnnjw",
    authDomain: "time-tracker-f45a1.firebaseapp.com",
    projectId: "time-tracker-f45a1",
    storageBucket: "time-tracker-f45a1.firebasestorage.app",
    messagingSenderId: "224028383958",
    appId: "1:224028383958:web:6aa6f725e98b5108df0777"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth ? firebase.getAuth(app) : firebase.auth(); // depending on v11 vs compat
const db = firebase.getFirestore ? firebase.getFirestore(app) : firebase.firestore();

// Expose globally
window.auth = auth;
window.db = db;
