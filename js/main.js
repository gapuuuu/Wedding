// フェードイン
window.addEventListener("load", () => {
  document.querySelectorAll(".fade").forEach(el => {
    el.classList.add("show");
  });
});

// カウントダウン
const weddingDate = new Date("2026-03-27T13:00:00");

const countdownEl = document.getElementById("countdown");

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    countdownEl.textContent = "本日は誠におめでとうございます";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  countdownEl.textContent = `挙式まで あと ${days} 日`;
}

updateCountdown();
setInterval(updateCountdown, 60000);
