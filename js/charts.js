/* ============================================================
   charts.js — Chart.js rendering helpers
   Uses local lib/chart.min.js (loaded as window.Chart).
   Each helper is wrapped so a single chart failure cannot
   block sibling charts on the same page.
   ============================================================ */
(function () {
  if (typeof Chart === "undefined") return;
  Chart.defaults.font.family = "'Sora', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = "#4b5563";
  Chart.defaults.borderColor = "#e5e7eb";
  Chart.defaults.plugins.legend.position = "bottom";
  Chart.defaults.plugins.legend.labels.padding = 14;
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.boxHeight = 10;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.tooltip.backgroundColor = "#0f1f12";
  Chart.defaults.plugins.tooltip.titleFont = { weight: "600", size: 12 };
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.tooltip.boxPadding = 6;
})();

const CHART_PALETTE = {
  green:   "#16a34a",
  green2:  "#22c55e",
  greenSoft: "rgba(34,197,94,0.18)",
  orange:  "#f97316",
  orangeSoft: "rgba(249,115,22,0.18)",
  blue:    "#3b82f6",
  pink:    "#ec4899",
  amber:   "#f59e0b",
  cyan:    "#06b6d4",
  violet:  "#8b5cf6",
  red:     "#ef4444",
  slate:   "#64748b"
};
const CHART_SCHEME = ["#16a34a", "#f97316", "#3b82f6", "#ec4899", "#f59e0b", "#06b6d4", "#8b5cf6", "#ef4444"];

function safeChart(label, fn) {
  try { return fn(); } catch (e) {
    console.warn("[charts] " + label + " failed:", e.message || e);
    return null;
  }
}
function chartGradient(ctx, area, color) {
  const g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
  g.addColorStop(0, color + "40"); g.addColorStop(1, color + "00");
  return g;
}

/* Line chart (area-fill) */
function renderLineChart(canvas, labels, data, label) {
  return safeChart("renderLineChart", () => {
    if (!canvas || typeof Chart === "undefined") return null;
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    return new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: label || "Value", data,
          borderColor: CHART_PALETTE.green,
          backgroundColor: c => { const a = c.chart.chartArea; if (!a) return CHART_PALETTE.greenSoft; return chartGradient(c.chart.ctx, a, CHART_PALETTE.green); },
          borderWidth: 2.5, fill: true, tension: .35, pointRadius: 4, pointHoverRadius: 6,
          pointBackgroundColor: "#fff", pointBorderColor: CHART_PALETTE.green, pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { weight: 500 } } },
          y: { beginAtZero: true, grid: { color: "#f1f5f1", drawBorder: false }, ticks: { padding: 6 } }
        }
      }
    });
  });
}

/* Dual line (admin: customers vs shopkeepers) */
function renderDualLine(canvas, labels, series1, label1, series2, label2) {
  return safeChart("renderDualLine", () => {
    if (!canvas || typeof Chart === "undefined") return null;
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    return new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: label1, data: series1, borderColor: CHART_PALETTE.green,  backgroundColor: c => { const a = c.chart.chartArea; if (!a) return CHART_PALETTE.greenSoft;  return chartGradient(c.chart.ctx, a, CHART_PALETTE.green); },  borderWidth: 2.5, fill: true, tension: .35, pointRadius: 3, pointBackgroundColor: "#fff", pointBorderColor: CHART_PALETTE.green,  pointBorderWidth: 2 },
          { label: label2, data: series2, borderColor: CHART_PALETTE.orange, backgroundColor: c => { const a = c.chart.chartArea; if (!a) return CHART_PALETTE.orangeSoft; return chartGradient(c.chart.ctx, a, CHART_PALETTE.orange); }, borderWidth: 2.5, fill: true, tension: .35, pointRadius: 3, pointBackgroundColor: "#fff", pointBorderColor: CHART_PALETTE.orange, pointBorderWidth: 2 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: "#f1f5f1" } } }
      }
    });
  });
}

/* Bar chart */
function renderBarChart(canvas, labels, data, label, color) {
  return safeChart("renderBarChart", () => {
    if (!canvas || typeof Chart === "undefined") return null;
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    return new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{ label: label || "Value", data, backgroundColor: color || CHART_PALETTE.green, borderRadius: 8, borderSkipped: false, barPercentage: .65, categoryPercentage: .7 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: "#f1f5f1" } } }
      }
    });
  });
}

/* Horizontal bar (funnel-style) */
function renderHBar(canvas, labels, data, label) {
  return safeChart("renderHBar", () => {
    if (!canvas || typeof Chart === "undefined") return null;
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    return new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{ label: label || "Value", data, backgroundColor: labels.map((_, i) => CHART_SCHEME[i % CHART_SCHEME.length]), borderRadius: 8, borderSkipped: false, barPercentage: .7 }] },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, grid: { color: "#f1f5f1" } }, y: { grid: { display: false }, ticks: { font: { weight: 600 } } } }
      }
    });
  });
}

/* Doughnut chart */
function renderDoughnut(canvas, labels, data) {
  return safeChart("renderDoughnut", () => {
    if (!canvas || typeof Chart === "undefined") return null;
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    return new Chart(ctx, {
      type: "doughnut",
      data: { labels, datasets: [{ data, backgroundColor: labels.map((_, i) => CHART_SCHEME[i % CHART_SCHEME.length]), borderWidth: 0, hoverOffset: 8 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { position: "right", labels: { padding: 12 } } } }
    });
  });
}

/* Pie chart */
function renderPie(canvas, labels, data) {
  return safeChart("renderPie", () => {
    if (!canvas || typeof Chart === "undefined") return null;
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    return new Chart(ctx, {
      type: "pie",
      data: { labels, datasets: [{ data, backgroundColor: labels.map((_, i) => CHART_SCHEME[i % CHART_SCHEME.length]), borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right" } } }
    });
  });
}

/* Sparkline */
function renderSpark(canvas, data, color) {
  return safeChart("renderSpark", () => {
    if (!canvas || typeof Chart === "undefined") return null;
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    return new Chart(ctx, {
      type: "line",
      data: { labels: data.map((_, i) => i + 1), datasets: [{ data, borderColor: color || CHART_PALETTE.green, backgroundColor: (color || CHART_PALETTE.green) + "26", borderWidth: 2, fill: true, tension: .4, pointRadius: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } }
    });
  });
}
