// ===== Scroll progress =====
const progressBar = document.getElementById("progressBar");
function updateProgress() {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll("[data-reveal]");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealEls.forEach(el => io.observe(el));

// ===== Tabs active highlight =====
const tabs = Array.from(document.querySelectorAll(".tab"));
const sections = ["#message", "#events", "#map"].map(id => document.querySelector(id)).filter(Boolean);

const tabIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = "#" + entry.target.id;
      tabs.forEach(t => t.classList.toggle("active", t.getAttribute("href") === id));
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => tabIo.observe(s));

// Smooth scroll for tabs
tabs.forEach(t => {
  t.addEventListener("click", (e) => {
    e.preventDefault();
    const id = t.getAttribute("href");
    const target = document.querySelector(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ===== Countdown (per second) =====
const weddingDate = new Date("2026-03-27T13:00:00"); // JST想定
const elDays = document.getElementById("cdDays");
const elHours = document.getElementById("cdHours");
const elMins = document.getElementById("cdMins");
const elSecs = document.getElementById("cdSecs");
const countGrid = document.getElementById("countGrid");

let prev = { d: null, h: null, m: null, s: null };

function pad2(n){ return String(n).padStart(2, "0"); }

function tickPop() {
  if (!countGrid) return;
  countGrid.classList.remove("tick");
  // reflow
  void countGrid.offsetWidth;
  countGrid.classList.add("tick");
}

function updateCountdown() {
  const now = new Date();
  let diff = weddingDate - now;

  if (diff <= 0) {
    if (elDays) elDays.textContent = "00";
    if (elHours) elHours.textContent = "00";
    if (elMins) elMins.textContent = "00";
    if (elSecs) elSecs.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const d = Math.floor(totalSeconds / (3600 * 24));
  const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (elDays) elDays.textContent = pad2(d);
  if (elHours) elHours.textContent = pad2(h);
  if (elMins) elMins.textContent = pad2(m);
  if (elSecs) elSecs.textContent = pad2(s);

  // 秒が変わったときだけポップ
  if (prev.s !== null && prev.s !== s) tickPop();
  prev = { d, h, m, s };
}

updateCountdown();
setInterval(updateCountdown, 1000);
