// auth.js
// IMPORTANT:
// 1. Make sure these are loaded BEFORE this file in index.html:
//    - https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js
//    - https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js
//    - ./js/firebase-config.js  (where firebase.initializeApp(...) is called)
//
// 2. This script must be included at the end of <body> in index.html

// Grab DOM elements
const authTitle = document.getElementById("authTitle");
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const authBtn = document.getElementById("authBtn");
const toggleLink = document.getElementById("toggleLink");
const toggleText = document.querySelector(".auth-toggle");

// Mode: "login" or "signup"
let mode = "login";

// --------- UI TOGGLE: Login <-> Sign Up ----------
if (toggleLink && authTitle && authBtn && toggleText) {
  toggleLink.addEventListener("click", () => {
    if (mode === "login") {
      mode = "signup";
      authTitle.textContent = "Sign Up";
      authBtn.textContent = "Create Account";
      toggleLink.textContent = "Login";
      // change leading text in the <p class="auth-toggle">
      toggleText.firstChild.textContent = "Already have an account? ";
    } else {
      mode = "login";
      authTitle.textContent = "Login";
      authBtn.textContent = "Login";
      toggleLink.textContent = "Sign up";
      toggleText.firstChild.textContent = "Don't have an account? ";
    }
  });
}

// --------- FORM SUBMIT HANDLER ----------
if (authForm && emailInput && passwordInput) {
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page reload

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      if (!firebase || !firebase.auth) {
        console.error("Firebase Auth not available. Check script order.");
        alert("Internal error: Firebase not loaded.");
        return;
      }

      if (mode === "login") {
        // Login existing user
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } else {
        // Create new account
        await firebase.auth().createUserWithEmailAndPassword(email, password);
      }

      // ✅ On success: go to dashboard
      window.location.href = "tracker.html"; // change to "index.html" if your dashboard file name is different
    } catch (err) {
      console.error(err);
      alert(err.message || "Authentication failed. Check console for details.");
    }
  });
}

// js/auth.js

// ... your existing authTitle/authForm/toggle logic ABOVE this ...

// === LOGOUT HANDLER (used on tracker.html) ===
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await firebase.auth().signOut();
        // After logout go back to login page (index.html)
        window.location.href = "index.html";
      } catch (err) {
        console.error("Error logging out:", err);
        alert("Failed to logout. Check console for details.");
      }
    });
  }
});


// --------- AUTH STATE LISTENER ----------
if (firebase && firebase.auth) {
  firebase.auth().onAuthStateChanged((user) => {
    const path = window.location.pathname;
    const isLoginPage =
      path.endsWith("index.html") ||
      path === "/" ||
      path.endsWith("/");

    const isTrackerPage = path.endsWith("tracker.html");

    // Logged-in user on login page → send to dashboard
    if (user && isLoginPage) {
      window.location.href = "tracker.html";
    }

    // Not logged in but on tracker → push back to login
    if (!user && isTrackerPage) {
      window.location.href = "index.html";
    }
  });
}

