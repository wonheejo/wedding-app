// i18n content
const I18N = {
  en: {
    hero: {
      kicker: "We’re getting married",
      title: "Wonhee & Averyl",
      date: "Saturday, October 18, 2025 • 4:00 PM",
    },
    cta: { details: "Event Details", rsvp: "RSVP / Contact" },
    details: { heading: "The Day", sub: "Everything you need to know for a smooth, happy day." },
    when: { heading: "When", body: "Ceremony at 4:00 PM, reception to follow.", dress: "Dress code: Semi-formal" },
    where: { heading: "Where", venueName: "Koreana Hotel", venueAddr: "Koreana Hotel, 135 Sejong-daero, Jung District, Seoul", map: "Open in Google Maps" },
    how: {
      heading: "How to get there",
      publicHeading: "By public transport",
      publicBody: "Subway: Line 2 City Hall, Exit 4 or Line 5 GwangHwaMoon Square, Exit 6. Bus: Seoul Sinmoon or Press Center Stop.",
      driveHeading: "By car",
      driveBody: "On-site parking available (free up to 3 hours)."
    },
    gallery: { heading: "Gallery", sub: "A few favorites — more to come!" },
    comments: { heading: "Leave a message", submit: "Post", note: "Comments are stored locally in your browser." },
    rsvp: { heading: "RSVP / Contact", body: "Please message us on Kakao or email: wonheejo@gmail.com or averylchan@gmail.com" },
    bank: {
      heading: "Bank Account Info",
      sub: "For those who cannot attend but would like to send their wishes:",
      name1: "Wonhee Jo",
      bank1: "Kakaobank 333308-605-6884",
      name2: "Averyl Chan",
      bank2: "Wooribank 1002-863-255898",
      bank3: "POSB Savings 228-398500",
      bank4: "Paynow +65 92981294"
    },
    footer: { names: "Wonhee & Averyl" },
    badge: "English"
  },
  ko: {
    hero: {
      kicker: "저희 결혼합니다",
      title: "조원희 & 지아",
      date: "2025년 10월 18일 (토) • 오후 4시",
    },
    cta: { details: "행사 안내", rsvp: "RSVP / 연락" },
    details: { heading: "그날의 일정", sub: "편안하고 행복한 하루를 위한 안내입니다." },
    when: { heading: "시간", body: "예식 오후 4시, 이후 피로연이 이어집니다.", dress: "드레스코드: 세미포멀" },
    where: { heading: "장소", venueName: "코리아나 호텔", venueAddr: "서울 중구 세종대로 135", map: "구글지도 열기" },
    how: {
      heading: "오시는 길",
      publicHeading: "대중교통",
      publicBody: "2호선 시청역 3번 출구 또는 5호선 광화문역 6번 출구. 버스 서울신문사 또는 프레스센터 정류장 하차.",
      driveHeading: "자가용",
      driveBody: "하이파킹 코리아나호텔 주차장 (최대 2시간 무료)."
    },
    gallery: { heading: "사진", sub: "몇 장 먼저 공개해요. 더 올라올 예정!" },
    comments: { heading: "메시지 남기기", submit: "등록", note: "댓글은 브라우저에만 저장됩니다." },
    rsvp: { heading: "RSVP / 연락", body: "카카오톡 또는 이메일(wonheejo@gmail.com)로 연락 부탁드립니다." },
    bank: {
      heading: "계좌안내",
      sub: "참석이 어려우신 분들께서는 마음을 전달해 주시면 감사하겠습니다",
      name1: "조원희",
      bank1: "카카오뱅크 3333086056884",
      name2: "지아",
      bank2: "우리은행 1002-863-255898",
      bank3: "POSB Savings 228-398500",
      bank4: "Paynow +65 92981294"
    },
    footer: { names: "원희 & 지아" },
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

  // Build map links based on language
  const venueName = dict.where.venueName;
  const venueAddr = dict.where.venueAddr;

  const mapLinksEL = document.getElementById("mapLinks");
  mapLinksEL.innerHTML = ""; //reset

  const q = encodeURIComponent(`${venueName} ${venueAddr}`);

  if (lang === "ko") {
    // Naver + Kakao side by side
    const naverHref = `https://map.naver.com/v5/search/${q}`;
    const kakaoHref = `https://map.kakao.com/?q=${q}`;

    mapLinksEL.appendChild(makeBtn(naverHref, dict.where.mapNaver || "네이버지도"));
    mapLinksEL.appendChild(makeBtn(kakaoHref, dict.where.mapKakao || "카카오맵"));
  } else {
    // Google maps only
    const gmapHref = `https://www.google.com/maps/search/?api=1&query=${q}`;
    mapLinksEL.appendChild(makeBtn(gmapHref, dict.where.map || "Open in Google Maps"));
  }

  // Iterate all elements with data-i18n="path.to.key"
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const path = el.getAttribute("data-i18n").split(".");
    let cur = dict;
    for (const k of path) cur = cur?.[k];
    if (typeof cur === "string") {
      // allow HTML only for RSVP body if i need 
      if (path.join(".") === "rsvp.body") el.innerHTML = cur;
      else el.textContent = cur;
    }
  });
}

function makeBtn(href, label) {
  const a = document.createElement("a");
  a.className = "btn";
  a.target = "_blank";
  a.rel = "noopener";
  a.href = href;
  a.textContent = label;
  return a;
}

function initCountdown() {
  // Target date (adjust as needed)
  const target = new Date("2025-10-18T14:00:00+09:00").getTime();
  const el = document.getElementById("countdown");
  function tick() {
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)); diff -= days * 24 * 60 * 60 * 1000;
    const hrs = Math.floor(diff / (1000 * 60 * 60)); diff -= hrs * 60 * 60 * 1000;
    const mins = Math.floor(diff / (1000 * 60)); diff -= mins * 60 * 1000;
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

function escapeHtml(str) {
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
/*
function copyBank(btn) {
  const parent = btn.closest(".account");
  const numberEl = parent.querySelector(".bank-number");
  const text = numberEl.textContent;

  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "✅ Copied!";
    setTimeout(() => (btn.textContent = "📋 Copy"), 1500);
  }).catch(err => {
    console.error("Copy Failed", err);
    btn.textContent = "❌ Error";
  });
}
  */

(function init() {
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

// Tiny toast for feedback
(function ensureToast() {
  if (!document.getElementById("copyToast")) {
    const t = document.createElement("div");
    t.id = "copyToast";
    t.style.cssText = "position:fixed;left:50%;bottom:16px;transform:translateX(-50%);background:#111;color:#fff;padding:8px 12px;border-radius:8px;font-size:14px;opacity:0;transition:opacity .2s;z-index:9999";
    document.body.appendChild(t);
  }
})();
function showToast(msg) {
  const t = document.getElementById("copyToast");
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(() => (t.style.opacity = "0"), 1200);
}

async function copyBank(btn) {
  try {
    // const parent = btn.closest(".account");
    const numberEl = btn.previousElementSibling;
    const text = (numberEl?.textContent || "").trim();
    if (!text) {
      showToast("Nothing to copy");
      return;
    }

    // Try modern Clipboard API (HTTPS or localhost + user gesture)
    let ok = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch (_) { }
    }

    // Fallback (works on most HTTP/older mobile browsers)
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      ta.style.fontSize = "16px"; // avoid iOS zoom
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length); // iOS
      try {
        ok = document.execCommand("copy");
      } catch (_) {
        ok = false;
      }
      document.body.removeChild(ta);
    }

    // Last-resort iOS trick (contentEditable selection)
    if (!ok) {
      const span = document.createElement("span");
      span.textContent = text;
      span.contentEditable = "true";
      span.style.position = "absolute";
      span.style.left = "-9999px";
      document.body.appendChild(span);

      const range = document.createRange();
      range.selectNodeContents(span);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      try {
        ok = document.execCommand("copy");
      } catch (_) {
        ok = false;
      }
      sel.removeAllRanges();
      document.body.removeChild(span);
    }

    if (ok) {
      btn.textContent = "✅ Copied!";
      showToast("Copied");
      setTimeout(() => (btn.textContent = "📋"), 10);
    } else {
      btn.textContent = "❌ Copy";
      showToast("Copy failed");
      alert("Copy failed. Long-press and copy:\n\n" + text);
    }
  } catch (e) {
    console.error("Copy error:", e);
    showToast("Copy error");
  }
}

// expose for inline onclick
window.copyBank = copyBank;

(function initBgm() {
  const bgm = document.getElementById("bgm");
  const btn = document.getElementById("audioToggle");
  if (!bgm || !btn) return;

  const PREF_KEY = "bgm_pref"; // 'on' | 'off'
  const setBtn = (on) => {
    btn.textContent = on ? "🔊" : "🔇";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  };

  // default volume (tweak if you like)
  bgm.volume = 0.5;

  async function playBgm() {
    try {
      await bgm.play();
      setBtn(true);
      localStorage.setItem(PREF_KEY, "on");
      removeGateListeners();
      return true;
    } catch (e) {
      // Autoplay blocked
      return false;
    }
  }
  function pauseBgm() {
    bgm.pause();
    setBtn(false);
    localStorage.setItem(PREF_KEY, "off");
  }

  // Button toggle
  btn.addEventListener("click", async () => {
    if (bgm.paused) await playBgm();
    else pauseBgm();
  });

  // Try to autoplay if user previously enabled it
  const wantOn = localStorage.getItem(PREF_KEY) === "on";

  // Some browsers need a user gesture; attach one-time “gate” listeners
  const gate = async () => { if (wantOn) await playBgm(); else setBtn(false); };
  const gateEvents = ["pointerdown", "touchstart", "keydown", "scroll"];
  const removeGateListeners = () => gateEvents.forEach(ev => document.removeEventListener(ev, gate));
  gateEvents.forEach(ev => document.addEventListener(ev, gate, { once: true, passive: true }));

  // First attempt: immediate autoplay (works on some Android/desktop)
  (async () => {
    if (wantOn) {
      const ok = await playBgm();
      if (!ok) setBtn(false); // show muted icon until user interacts
    } else {
      setBtn(false);
    }
  })();
})();
