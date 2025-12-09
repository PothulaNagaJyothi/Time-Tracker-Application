// js/tracker.js

// ------------------------------
// STATE
// ------------------------------
const DAILY_GOAL_MINUTES = 480; // 8 hours

// All activities grouped by dateKey: "YYYY-MM-DD" -> Activity[]
const activitiesByDate = {};

// Currently selected date
let selectedDate = new Date();

// Category metadata for charts
const CATEGORY_META = {
  work: { label: "Work", className: "cat-work" },
  meeting: { label: "Meeting", className: "cat-meeting" },
  break: { label: "Break", className: "cat-break" },
  learning: { label: "Learning", className: "cat-learning" },
  other: { label: "Other", className: "cat-other" },
};

// ------------------------------
// HELPERS
// ------------------------------
function getDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateLabel(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function getCurrentActivities() {
  const key = getDateKey(selectedDate);
  return activitiesByDate[key] || [];
}

function setCurrentActivities(list) {
  const key = getDateKey(selectedDate);
  activitiesByDate[key] = list;
}

// Format 90 -> "1h 30m"
function formatDuration(minutes) {
  minutes = Number(minutes) || 0;
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ------------------------------
// DATE PICKER LOGIC
// ------------------------------
function setupDateControls() {
  const prevBtn = document.getElementById("prevDateBtn");
  const nextBtn = document.getElementById("nextDateBtn");
  const todayBtn = document.getElementById("todayBtn");
  const dateLabel = document.getElementById("selectedDateText");
  const datePopupBtn = document.getElementById("datePopupBtn");
  const calendarPopup = document.getElementById("calendarPopup");
  const calendarContainer = document.getElementById("calendarContainer");

  if (!dateLabel) return;

  function updateDateUI() {
    dateLabel.textContent = formatDateLabel(selectedDate);
    renderActivities();
    updateAnalytics();
    updateWeeklyTrend();
    renderCalendarGrid(calendarContainer, selectedDate);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      selectedDate = new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000);
      updateDateUI();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      selectedDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
      updateDateUI();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      selectedDate = new Date();
      updateDateUI();
    });
  }

  // Simple calendar popup toggle
  if (datePopupBtn && calendarPopup && calendarContainer) {
    datePopupBtn.addEventListener("click", () => {
      calendarPopup.style.display =
        calendarPopup.style.display === "block" ? "none" : "block";
    });

    // Initial render of calendar
    renderCalendarGrid(calendarContainer, selectedDate);

    // Close popup on outside click
    document.addEventListener("click", (e) => {
      if (!calendarPopup.contains(e.target) && !datePopupBtn.contains(e.target)) {
        calendarPopup.style.display = "none";
      }
    });
  }

  // Initial label
  updateDateUI();
}

// Simple month grid calendar
function renderCalendarGrid(container, date) {
  if (!container) return;

  container.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();

  // Day names
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  dayNames.forEach((d) => {
    const el = document.createElement("div");
    el.textContent = d;
    el.className = "day-name";
    container.appendChild(el);
  });

  // First day of month
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Padding days
  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement("div");
    container.appendChild(empty);
  }

  const todayKey = getDateKey(new Date());
  const currentMonthKeyPrefix = `${year}-${String(month + 1).padStart(2, "0")}-`;

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "day";

    const thisDate = new Date(year, month, day);
    const thisKey = getDateKey(thisDate);

    cell.textContent = day;

    if (thisKey === getDateKey(selectedDate)) {
      cell.classList.add("selected");
    }
    if (thisKey === todayKey) {
      cell.classList.add("today");
    }

    cell.addEventListener("click", () => {
      selectedDate = thisDate;
      renderCalendarGrid(container, selectedDate);
      const label = document.getElementById("selectedDateText");
      if (label) label.textContent = formatDateLabel(selectedDate);
      renderActivities();
      updateAnalytics();
      updateWeeklyTrend();
      const popup = document.getElementById("calendarPopup");
      if (popup) popup.style.display = "none";
    });

    container.appendChild(cell);
  }
}

// ------------------------------
// ACTIVITY FORM + LIST
// ------------------------------
function setupActivityForm() {
  const form = document.getElementById("activityForm");
  const titleInput = document.getElementById("activityTitle");
  const categorySelect = document.getElementById("activityCategory");
  const minutesInput = document.getElementById("activityMinutes");

  if (!form || !titleInput || !categorySelect || !minutesInput) {
    console.warn("Activity form elements not found.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const minutes = Number(minutesInput.value);

    if (!title || !category || !minutes || minutes <= 0) {
      alert("Please fill all fields with valid values.");
      return;
    }

    const newActivity = {
      id: Date.now().toString(),
      title,
      category,
      minutes,
    };

    const currentList = getCurrentActivities();
    currentList.push(newActivity);
    setCurrentActivities(currentList);

    // TODO: If you want Firestore persistence, save here.
    //Example (compat):
    const user = firebase.auth().currentUser;
    if (user) {
      const dateKey = getDateKey(selectedDate);
      await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("days")
        .doc(dateKey)
        .collection("activities")
        .doc(newActivity.id)
        .set(newActivity);
    }

    // Update UI
    titleInput.value = "";
    categorySelect.value = "";
    minutesInput.value = "";
    renderActivities();
    updateAnalytics();
  });
}

function setupActivityDelete() {
  const listEl = document.getElementById("activityList");
  if (!listEl) return;

  listEl.addEventListener("click", async (e) => {
    const target = e.target;
    if (!target.classList.contains("btn-delete-activity")) return;

    const id = target.getAttribute("data-id");
    if (!id) return;

    let currentList = getCurrentActivities();
    currentList = currentList.filter((a) => a.id !== id);
    setCurrentActivities(currentList);

    // TODO: Firestore delete (if using backend)
    const user = firebase.auth().currentUser;
    if (user) {
      const dateKey = getDateKey(selectedDate);
      await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("days")
        .doc(dateKey)
        .collection("activities")
        .doc(id)
        .delete();
    }

    renderActivities();
    updateAnalytics();
  });
}

function renderActivities() {
  const listEl = document.getElementById("activityList");
  const emptyEl = document.getElementById("noActivities");
  if (!listEl || !emptyEl) return;

  const list = getCurrentActivities();

  if (list.length === 0) {
    emptyEl.style.display = "block";
    listEl.innerHTML = "";
    return;
  }

  emptyEl.style.display = "none";

  listEl.innerHTML = list
    .map(
      (act) => `
      <div class="activity-item fade-in">
        <div style="
            width:6px;
            height:6px;
            border-radius:999px;
            background:${getCategoryColor(act.category)};
            flex-shrink:0;
        "></div>
        <div style="flex:1; min-width:0;">
          <p style="font-size:0.9rem; font-weight:500;">${act.title}</p>
          <p style="font-size:0.75rem; color:#9ca3af; text-transform:capitalize;">
            ${act.category}
          </p>
        </div>
        <span style="font-size:0.9rem; font-weight:500; color:var(--primary);">
          ${formatDuration(act.minutes)}
        </span>
        <button
          class="btn-delete-activity"
          data-id="${act.id}"
          style="
            margin-left:8px;
            border:none;
            background:transparent;
            color:#9ca3af;
            cursor:pointer;
            font-size:14px;
          ">
          ✕
        </button>
      </div>
    `
    )
    .join("");
}

function getCategoryColor(category) {
  switch (category) {
    case "work":
      return "#0ea5e9"; // info
    case "meeting":
      return "#eab308"; // warning
    case "break":
      return "#22c55e"; // success
    case "learning":
      return "#6366f1"; // primary
    case "other":
    default:
      return "#6b7280"; // muted
  }
}

// ------------------------------
// ANALYTICS: SUMMARY CARDS + CATEGORY + WEEKLY TREND
// ------------------------------
function updateAnalytics() {
  const list = getCurrentActivities();
  const totalMinutes = list.reduce((sum, a) => sum + (a.minutes || 0), 0);
  const count = list.length;
  const avg = count > 0 ? Math.round(totalMinutes / count) : 0;
  const goalProgress = Math.min(
    Math.round((totalMinutes / DAILY_GOAL_MINUTES) * 100),
    100
  );

  const totalEl = document.getElementById("totalMinutesValue");
  const countEl = document.getElementById("activityCountValue");
  const avgEl = document.getElementById("avgPerActivityValue");
  const goalEl = document.getElementById("dailyGoalValue");

  if (totalEl) totalEl.textContent = formatDuration(totalMinutes);
  if (countEl) countEl.textContent = String(count);
  if (avgEl) avgEl.textContent = count > 0 ? formatDuration(avg) : "0m";
  if (goalEl) goalEl.textContent = `${goalProgress}%`;

  updateCategoryBreakdown(list, totalMinutes);
}

function updateCategoryBreakdown(list, totalMinutes) {
  const container = document.getElementById("categoryBreakdown");
  const emptyEl = document.getElementById("categoryEmpty");
  if (!container || !emptyEl) return;

  if (!list || list.length === 0 || totalMinutes === 0) {
    emptyEl.style.display = "flex";
    container.innerHTML = "";
    return;
  }

  emptyEl.style.display = "none";

  const totals = {};
  list.forEach((a) => {
    if (!totals[a.category]) totals[a.category] = 0;
    totals[a.category] += a.minutes || 0;
  });

  container.innerHTML = "";

  Object.keys(CATEGORY_META).forEach((catKey) => {
    const meta = CATEGORY_META[catKey];
    const total = totals[catKey] || 0;
    if (total <= 0) return;

    const pct = Math.round((total / totalMinutes) * 100);

    const row = document.createElement("div");
    row.className = "category-row";

    row.innerHTML = `
      <div class="flex justify-between" style="margin-bottom:4px;">
        <span style="font-size:0.85rem;">${meta.label}</span>
        <span style="font-size:0.8rem; color:#9ca3af;">${total}m (${pct}%)</span>
      </div>
      <div class="category-row__bar">
        <div
          class="category-row__fill ${meta.className}"
          style="width:${pct}%;"
        ></div>
      </div>
    `;

    container.appendChild(row);
  });
}

function updateWeeklyTrend() {
  const trendEl = document.querySelector(".weekly-trend");
  if (!trendEl) return;

  const bars = trendEl.querySelectorAll(".weekly-bar");
  if (bars.length !== 7) return;

  // Build data for current week (Mon-Sun)
  // Find Monday of the current week
  const temp = new Date(selectedDate);
  const day = temp.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = ((day + 6) % 7); // 0 if Mon, 1 if Tue, etc.
  const monday = new Date(temp.getTime() - diffToMonday * 24 * 60 * 60 * 1000);

  const totalsPerDay = [];
  let maxMinutes = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
    const key = getDateKey(d);
    const dayActivities = activitiesByDate[key] || [];
    const total = dayActivities.reduce(
      (sum, a) => sum + (a.minutes || 0),
      0
    );
    totalsPerDay.push({ date: d, total });
    if (total > maxMinutes) maxMinutes = total;
  }

  // If maxMinutes is 0, all bars small
  const maxHeight = 100;

  totalsPerDay.forEach((entry, index) => {
    const bar = bars[index];
    const fill = bar.querySelector(".weekly-bar__fill");
    const label = bar.querySelector("span");

    const heightPct =
      maxMinutes > 0
        ? Math.max(15, Math.round((entry.total / maxMinutes) * maxHeight))
        : 20;

    if (fill) {
      fill.style.height = `${heightPct}%`;
    }

    // Highlight today
    const isToday = getDateKey(entry.date) === getDateKey(new Date());
    if (isToday) {
      bar.classList.add("weekly-bar--today");
    } else {
      bar.classList.remove("weekly-bar--today");
    }

    // Label text stays as e.g. "Mon", "Tue" from HTML
    if (label && label.textContent) {
      // keep as-is
    }
  });
}

// ------------------------------
// INIT
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupDateControls();
  setupActivityForm();
  setupActivityDelete();

  // Initial UI render
  renderActivities();
  updateAnalytics();
  updateWeeklyTrend();
});
