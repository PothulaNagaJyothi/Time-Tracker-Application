let pieChart = null;
let barChart = null;

const pieCanvas = document.getElementById("categoryPie");
const barCanvas = document.getElementById("activityBar");
const noDataView = document.getElementById("noDataView");

function analyzeActivities(activities) {
  const MAX_MINUTES = 1440;

  // Total minutes across all activities
  const totalMinutes = activities.reduce((sum, a) => sum + (a.minutes || 0), 0);

  // Remaining minutes in the day
  const remainingMinutes = Math.max(0, MAX_MINUTES - totalMinutes);

  // Aggregate minutes per category
  const perCategoryTotals = {};
  for (const a of activities) {
    if (!perCategoryTotals[a.category]) perCategoryTotals[a.category] = 0;
    perCategoryTotals[a.category] += a.minutes;
  }

  // Convert to array format
  const perCategoryArray = Object.entries(perCategoryTotals).map(([category, minutes]) => ({
    category,
    minutes
  }));

  // Determine category with max minutes
  let topCategory = null;
  if (perCategoryArray.length > 0) {
    topCategory = perCategoryArray.reduce((max, curr) =>
      curr.minutes > max.minutes ? curr : max
    );
  }

  return {
    totalMinutes,
    remainingMinutes,
    perCategoryTotals: perCategoryArray,
    topCategory
  };
}


function computeStats(activities) {
  const total = activities.reduce((sum, a) => sum + a.minutes, 0);
  const remaining = 1440 - total;
  const map = {};
  activities.forEach((a) => {
    map[a.category] = (map[a.category] || 0) + a.minutes;
  });
  const perCategory = Object.entries(map).map(([name, minutes]) => ({
    name,
    minutes,
  }));
  const top =
    perCategory.length === 0
      ? "-"
      : perCategory.sort((a, b) => b.minutes - a.minutes)[0].name;
  return { total, remaining, perCategory, top };
}


function updateSummaryAndCharts() {
  const { total, remaining, perCategory, top } = computeStats(activities);

  totalSpan.textContent = total;
  remainingSpan.textContent = remaining;
  countSpan.textContent = activities.length;
  topCategorySpan.textContent = top;

  if (activities.length === 0) {
    destroyCharts();
    showNoDataView();
    return;
  }

  hideNoDataView();
  renderPie(perCategory);
  renderBar(activities);
}

function renderPie(perCategory) {
  if (!pieCanvas) return;
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(pieCanvas, {
    type: "pie",
    data: {
      labels: perCategory.map((c) => c.name),
      datasets: [
        {
          data: perCategory.map((c) => c.minutes),
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

function renderBar(activities) {
  if (!barCanvas) return;
  if (barChart) barChart.destroy();

  barChart = new Chart(barCanvas, {
    type: "bar",
    data: {
      labels: activities.map((a) => a.title),
      datasets: [
        {
          data: activities.map((a) => a.minutes),
        },
      ],
    },
    options: {
      scales: {
        x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } },
      },
    },
  });
}

function showNoDataView() {
  if (noDataView) noDataView.style.display = "flex";
}

function hideNoDataView() {
  if (noDataView) noDataView.style.display = "none";
}

function destroyCharts() {
  if (pieChart) {
    pieChart.destroy();
    pieChart = null;
  }
  if (barChart) {
    barChart.destroy();
    barChart = null;
  }
}

