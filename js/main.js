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

// ===== Countdown (per second) =====
const weddingDate = new Date("2026-03-27T13:00:00"); // JST想定

const elDays  = document.getElementById("cdDays");
const elHours = document.getElementById("cdHours");
const elMins  = document.getElementById("cdMins");
const elSecs  = document.getElementById("cdSecs");

let prev = { d: null, h: null, m: null, s: null };

function pad2(n){ return String(n).padStart(2, "0"); }

function pulse(el){
  if (!el) return;
  el.classList.remove("cd-pulse");
  void el.offsetWidth; // reflow
  el.classList.add("cd-pulse");
}

function updateCountdown() {
  const now = new Date();
  let diff = weddingDate - now;

  if (diff <= 0) {
    if (elDays)  elDays.textContent  = "00";
    if (elHours) elHours.textContent = "00";
    if (elMins)  elMins.textContent  = "00";
    if (elSecs)  elSecs.textContent  = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const d = Math.floor(totalSeconds / (3600 * 24));
  const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  // 更新（変化したものだけパルス）
  if (elDays && prev.d !== d)  { elDays.textContent  = pad2(d); pulse(elDays); }
  if (elHours && prev.h !== h) { elHours.textContent = pad2(h); pulse(elHours); }
  if (elMins && prev.m !== m)  { elMins.textContent  = pad2(m); pulse(elMins); }
  if (elSecs && prev.s !== s)  { elSecs.textContent  = pad2(s); pulse(elSecs); }

  prev = { d, h, m, s };
}

updateCountdown();
setInterval(updateCountdown, 1000);
