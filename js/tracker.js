let currentUser = null;

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    currentUser = user;
    const emailSpan = document.getElementById("userEmail");
    if (emailSpan) emailSpan.textContent = user.email;
    initTracker();
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  firebase.auth().signOut();
});

let activities = [];
const MAX_MINUTES = 1440;

const datePicker = document.getElementById("datePicker");
const titleInput = document.getElementById("activityTitle");
const categorySelect = document.getElementById("activityCategory");
const minutesInput = document.getElementById("activityMinutes");
const addBtn = document.getElementById("addActivityBtn");
const listEl = document.getElementById("activityList");
const analyseBtn = document.getElementById("analyseBtn");

// summary spans
const totalSpan = document.getElementById("totalMinutesValue");
const remainingSpan = document.getElementById("remainingMinutesValue");
const countSpan = document.getElementById("activityCountValue");
const topCategorySpan = document.getElementById("topCategoryValue");

function initTracker() {
  const today = new Date().toISOString().slice(0, 10);
  datePicker.value = today;
  loadActivitiesForDate(today);
}

datePicker.addEventListener("change", () => {
  loadActivitiesForDate(datePicker.value);
});

function getActivitiesCollectionRef(dateStr) {
  const uid = currentUser.uid;
  return firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("days")
    .doc(dateStr)
    .collection("activities");
}

async function loadActivitiesForDate(dateStr) {
  activities = [];
  listEl.innerHTML = "";
  showNoDataView(); // default

  const colRef = getActivitiesCollectionRef(dateStr);
  const snap = await colRef.get();
  snap.forEach((doc) => {
    activities.push({ id: doc.id, ...doc.data() });
  });

  renderActivityList();
  updateSummaryAndCharts();
}

function renderActivityList() {
  listEl.innerHTML = "";
  if (activities.length === 0) {
    listEl.innerHTML = "<li class='empty'>No activities yet for this date.</li>";
    return;
  }

  activities.forEach((a) => {
    const li = document.createElement("li");
    li.className = "activity-item";
    li.innerHTML = `
      <div>
        <div class="activity-title">${a.title}</div>
        <div class="activity-meta">${a.category} • ${a.minutes} min</div>
      </div>
      <button class="delete-btn" data-id="${a.id}">Delete</button>
    `;
    listEl.appendChild(li);
  });

  listEl.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteActivity(btn.dataset.id));
  });
}

addBtn.addEventListener("click", addActivity);

async function addActivity() {
  const title = titleInput.value.trim();
  const category = categorySelect.value;
  const minutes = parseInt(minutesInput.value, 10);

  if (!title || !minutes || minutes <= 0) {
    alert("Enter valid title and positive minutes.");
    return;
  }

  const currentTotal = activities.reduce((sum, a) => sum + a.minutes, 0);
  if (currentTotal + minutes > MAX_MINUTES) {
    const remaining = MAX_MINUTES - currentTotal;
    alert(
      `This exceeds 1440 minutes. You have only ${remaining} minutes left for this day.`
    );
    return;
  }

  const docRef = await getActivitiesCollectionRef(datePicker.value).add({
    title,
    category,
    minutes,
    createdAt: Date.now(),
  });

  activities.push({ id: docRef.id, title, category, minutes });
  titleInput.value = "";
  minutesInput.value = "";
  renderActivityList();
  updateSummaryAndCharts();
}


async function deleteActivity(id) {
  await getActivitiesCollectionRef(datePicker.value).doc(id).delete();
  activities = activities.filter((a) => a.id !== id);
  renderActivityList();
  updateSummaryAndCharts();
}

analyseBtn.addEventListener("click", () => {
  if (activities.length === 0) {
    showNoDataView();
    return;
  }
  hideNoDataView();
  updateSummaryAndCharts();
});
