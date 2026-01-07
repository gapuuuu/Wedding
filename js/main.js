// タブ：スムーズスクロール
document.querySelectorAll('.topnav-item').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// スクロール位置で active を切り替え
const tabs = Array.from(document.querySelectorAll('.topnav-item'));
const sections = ['#message', '#events', '#rsvp']
  .map(s => document.querySelector(s))
  .filter(Boolean);

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = `#${entry.target.id}`;
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === id));
  });
}, { threshold: 0.45 });

sections.forEach(s => io.observe(s));

/* COUNTDOWN（秒単位） */
const weddingDate = new Date("2026-03-27T13:00:00"); // JST想定
const elDays  = document.getElementById("cdDays");
const elHours = document.getElementById("cdHours");
const elMins  = document.getElementById("cdMins");
const elSecs  = document.getElementById("cdSecs");

let prev = { d:null, h:null, m:null, s:null };
const pad2 = (n) => String(n).padStart(2, "0");

function pulse(el){
  if (!el) return;
  el.classList.remove("pulse");
  void el.offsetWidth;
  el.classList.add("pulse");
}

function updateCountdown(){
  const now = new Date();
  let diff = weddingDate - now;

  if (diff <= 0) {
    if (elDays)  elDays.textContent  = "00";
    if (elHours) elHours.textContent = "00";
    if (elMins)  elMins.textContent  = "00";
    if (elSecs)  elSecs.textContent  = "00";
    return;
  }

  const total = Math.floor(diff / 1000);
  const d = Math.floor(total / (3600 * 24));
  const h = Math.floor((total % (3600 * 24)) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (prev.d !== d && elDays)  { elDays.textContent  = pad2(d); pulse(elDays); }
  if (prev.h !== h && elHours) { elHours.textContent = pad2(h); pulse(elHours); }
  if (prev.m !== m && elMins)  { elMins.textContent  = pad2(m); pulse(elMins); }
  if (prev.s !== s && elSecs)  { elSecs.textContent  = pad2(s); pulse(elSecs); }

  prev = { d,h,m,s };
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* HERO SLIDER：矢印クリック/スワイプ/3秒自動 */
const frames = Array.from(document.querySelectorAll('.hero-frame'));
const btnPrev = document.getElementById('heroPrev');
const btnNext = document.getElementById('heroNext');
const stage = document.getElementById('heroStage');

let idx = 0;
let timer = null;

function show(i){
  if (!frames.length) return;
  idx = (i + frames.length) % frames.length;
  frames.forEach((f, j) => f.classList.toggle('is-active', j === idx));
}

function next(){ show(idx + 1); }
function prevSlide(){ show(idx - 1); }

function startAuto(){
  stopAuto();
  timer = setInterval(next, 3000);
}
function stopAuto(){
  if (timer) clearInterval(timer);
  timer = null;
}

if (btnNext) btnNext.addEventListener('click', () => { next(); startAuto(); });
if (btnPrev) btnPrev.addEventListener('click', () => { prevSlide(); startAuto(); });

/* スワイプ */
let touchStartX = null;
if (stage){
  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive:true });

  stage.addEventListener('touchend', (e) => {
    if (touchStartX == null) return;
    const x = e.changedTouches[0].clientX;
    const dx = x - touchStartX;
    touchStartX = null;

    if (Math.abs(dx) > 40){
      if (dx < 0) next();
      else prevSlide();
    }
    startAuto();
  }, { passive:true });
}

show(0);
startAuto();
