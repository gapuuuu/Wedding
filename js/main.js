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

// ===== Scroll reveal (Intersection Observer) =====
const revealEls = document.querySelectorAll("[data-reveal]");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ===== TOC Drawer =====
const tocBtn = document.getElementById("tocBtn");
const tocDrawer = document.getElementById("tocDrawer");
const tocClose = document.getElementById("tocClose");
const tocBackdrop = document.getElementById("tocBackdrop");
const tocLinks = Array.from(document.querySelectorAll(".toc-link"));

function openToc() {
  tocDrawer.classList.add("open");
  tocDrawer.setAttribute("aria-hidden", "false");
}
function closeToc() {
  tocDrawer.classList.remove("open");
  tocDrawer.setAttribute("aria-hidden", "true");
}

tocBtn.addEventListener("click", openToc);
tocClose.addEventListener("click", closeToc);
tocBackdrop.addEventListener("click", closeToc);

// Smooth scroll on link click
tocLinks.forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const id = a.getAttribute("href");
    const target = document.querySelector(id);
    closeToc();
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== TOC active highlight by section =====
const sectionIds = ["#greeting", "#schedule", "#venue", "#story", "#map"];
const sectionEls = sectionIds.map(sel => document.querySelector(sel)).filter(Boolean);

const activeIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = "#" + entry.target.id;
      tocLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === id));
    }
  });
}, { threshold: 0.35 });

sectionEls.forEach(el => activeIo.observe(el));

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
