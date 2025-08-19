// i18n content
const I18N = {
  en: {
    hero: {
      kicker: "We’re getting married",
      title: "Alex & Jina",
      date: "Saturday, October 18, 2025 • 2:00 PM",
    },
    cta: { details: "Event Details", rsvp: "RSVP / Contact" },
    details: { heading: "The Day", sub: "Everything you need to know for a smooth, happy day." },
    when: { heading: "When", body: "Ceremony at 2:00 PM, reception to follow.", dress: "Dress code: Semi-formal" },
    where: { heading: "Where", venueName: "Riverside Hall", venueAddr: "123 Han River Rd, Seoul", map: "Open in Google Maps" },
    how: {
      heading: "How to get there",
      publicHeading: "By public transport",
      publicBody: "Subway Line 2 to City Hall, Exit 4. Bus 100 or 301 to Riverside Stop.",
      driveHeading: "By car",
      driveBody: "On-site parking available (free up to 3 hours)."
    },
    gallery: { heading: "Photos", sub: "A few favorites — more to come!" },
    comments: { heading: "Leave a message", submit: "Post", note: "Comments are stored locally in your browser." },
    rsvp: { heading: "RSVP / Contact", body: "Please message us on Kakao or email: hello@example.com." },
    footer: { names: "Alex & Jina" },
    badge: "English"
  },
  ko: {
    hero: {
      kicker: "저희 결혼합니다",
      title: "알렉스 & 지나",
      date: "2025년 10월 18일 (토) • 오후 2시",
    },
    cta: { details: "행사 안내", rsvp: "RSVP / 연락" },
    details: { heading: "그날의 일정", sub: "편안하고 행복한 하루를 위한 안내입니다." },
    when: { heading: "시간", body: "예식 오후 2시, 이후 피로연이 이어집니다.", dress: "드레스코드: 세미포멀" },
    where: { heading: "장소", venueName: "리버사이드 홀", venueAddr: "서울 한강로 123", map: "구글지도 열기" },
    how: {
      heading: "오시는 길",
      publicHeading: "대중교통",
      publicBody: "2호선 시청역 4번 출구. 버스 100 또는 301 리버사이드 정류장 하차.",
      driveHeading: "자가용",
      driveBody: "주차 가능 (최대 3시간 무료)."
    },
    gallery: { heading: "사진", sub: "몇 장 먼저 공개해요. 더 올라올 예정!" },
    comments: { heading: "메시지 남기기", submit: "등록", note: "댓글은 브라우저에만 저장됩니다." },
    rsvp: { heading: "RSVP / 연락", body: "카카오톡 또는 이메일(hello@example.com)로 연락 부탁드립니다." },
    footer: { names: "알렉스 & 지나" },
    badge: "한국어"
  }
};

function getLang() {
  const p = new URLSearchParams(window.location.search);
  const lang = p.get("lang");
  return (lang === "ko" || lang === "en") ? lang : "en";
}

function applyI18N(lang) {
  const dict = I18N[lang];
  document.documentElement.lang = lang === "ko" ? "ko" : "en";
  document.querySelector("#languageBadge").textContent = dict.badge;

  // Map links (example place id/search query)
  const mapQuery = encodeURIComponent(dict.where.venueName + " " + dict.where.venueAddr);
  const mapHref = "https://www.google.com/maps/search/?api=1&query=" + mapQuery;
  document.querySelector("#mapLink").href = mapHref;

  // Iterate all elements with data-i18n="path.to.key"
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const path = el.getAttribute("data-i18n").split(".");
    let cur = dict;
    for (const k of path) cur = cur?.[k];
    if (typeof cur === "string") el.textContent = cur;
  });
}

function initCountdown() {
  // Target date (adjust as needed)
  const target = new Date("2025-10-18T14:00:00+09:00").getTime();
  const el = document.getElementById("countdown");
  function tick() {
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000*60*60*24)); diff -= days*24*60*60*1000;
    const hrs  = Math.floor(diff / (1000*60*60));    diff -= hrs*60*60*1000;
    const mins = Math.floor(diff / (1000*60));       diff -= mins*60*1000;
    const secs = Math.floor(diff / 1000);
    el.innerHTML = `
      <div class="timebox"><div class="num">${days}</div><div>Days</div></div>
      <div class="timebox"><div class="num">${hrs}</div><div>Hours</div></div>
      <div class="timebox"><div class="num">${mins}</div><div>Minutes</div></div>
      <div class="timebox"><div class="num">${secs}</div><div>Seconds</div></div>
    `;
  }
  tick();
  setInterval(tick, 1000);
}

function initLightbox() {
  const modal = document.getElementById("lightbox");
  const modalImg = modal.querySelector("img");
  document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modal.classList.add("open");
    });
  });
  modal.addEventListener("click", () => modal.classList.remove("open"));
}

function commentsKey() {
  const lang = getLang();
  return "wedding_comments_" + lang;
}

function loadComments() {
  const list = document.getElementById("commentsList");
  list.innerHTML = "";
  const items = JSON.parse(localStorage.getItem(commentsKey()) || "[]");
  for (const it of items) {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <div class="meta">${it.name} • ${new Date(it.ts).toLocaleString()}</div>
      <div>${escapeHtml(it.msg)}</div>
    `;
    list.appendChild(div);
  }
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function initCommentForm() {
  const form = document.getElementById("commentForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("nameInput").value.trim();
    const msg = document.getElementById("msgInput").value.trim();
    if (!name || !msg) return;

    const key = commentsKey();
    const items = JSON.parse(localStorage.getItem(key) || "[]");
    items.unshift({ name, msg, ts: Date.now() });
    localStorage.setItem(key, JSON.stringify(items));
    document.getElementById("msgInput").value = "";
    loadComments();
  });
}

function initYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

(function init(){
  const lang = getLang();
  applyI18N(lang);
  document.getElementById("switchEn").href = "?lang=en";
  document.getElementById("switchKo").href = "?lang=ko";
  initCountdown();
  initLightbox();
  initCommentForm();
  loadComments();
  initYear();
})();
