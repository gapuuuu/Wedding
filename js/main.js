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

// ===== Countdown =====
const countdownEl = document.getElementById("countdown");
const weddingDate = new Date("2026-03-27T13:00:00");

function formatCountdown(diffMs) {
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  return `挙式まで あと ${days}日 ${hours}時間`;
}

function updateCountdown() {
  if (!countdownEl) return;
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    countdownEl.textContent = "本日は誠におめでとうございます";
    return;
  }
  countdownEl.textContent = formatCountdown(diff);
}
updateCountdown();
setInterval(updateCountdown, 60 * 1000);
