const form = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const toggleLink = document.getElementById("authToggle");
const modeText = document.getElementById("authModeText"); // e.g. "Don't have an account?"
const submitBtn = document.getElementById("submitBtn");
let mode = "login"; // or "signup"

toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  mode = mode === "login" ? "signup" : "login";
  submitBtn.textContent = mode === "login" ? "Login" : "Sign Up";
  modeText.textContent =
    mode === "login" ? "Don't have an account?" : "Already have an account?";
  toggleLink.textContent = mode === "login" ? "Sign Up" : "Login";
});


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) return alert("Enter email and password");

  try {
    if (mode === "login") {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } else {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    }
    window.location.href = "tracker.html";
  } catch (err) {
    alert(err.message);
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // optional: auto-redirect to tracker
    // window.location.href = "tracker.html";
  }
});


