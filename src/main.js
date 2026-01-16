import "./style.css";

const touchLayer = document.querySelector("#touchLayer");
const promptEls = [
  document.querySelector("#promptTop"),
  document.querySelector("#promptRight"),
  document.querySelector("#promptBottom"),
  document.querySelector("#promptLeft"),
];
const progressTop = document.querySelector("#progressTop");
const progressRight = document.querySelector("#progressRight");
const progressBottom = document.querySelector("#progressBottom");
const progressLeft = document.querySelector("#progressLeft");

const touches = new Map();
const COUNTDOWN_MS = 2500;
const COLORS = [
  "#00f2a5",
  "#35a7ff",
  "#ffb84d",
  "#ff6b6b",
  "#a855f7",
  "#f97316",
];
const availableColors = [...COLORS];

const APP_VERSION = "4.1";
const SUPPORTED_LANGS = ["fr", "en", "de", "it", "es"];
const MESSAGES = {
  fr: {
    promptTouch: "Posez un doigt sur l'écran.",
    chosen: "Choisi. Relevez pour rejouer.",
    countdown: "Compte à rebours: {seconds}s",
  },
  en: {
    promptTouch: "Place a finger on the screen.",
    chosen: "Chosen. Lift to play again.",
    countdown: "Countdown: {seconds}s",
  },
  de: {
    promptTouch: "Lege einen Finger auf den Bildschirm.",
    chosen: "Gewählt. Zum erneuten Spielen loslassen.",
    countdown: "Countdown: {seconds}s",
  },
  it: {
    promptTouch: "Appoggia un dito sullo schermo.",
    chosen: "Scelto. Solleva per rigiocare.",
    countdown: "Conto alla rovescia: {seconds}s",
  },
  es: {
    promptTouch: "Pon un dedo en la pantalla.",
    chosen: "Elegido. Suelta para jugar de nuevo.",
    countdown: "Cuenta regresiva: {seconds}s",
  },
};

let countdownStart = null;
let selectedId = null;
let lastCount = 0;
let countdownLabel = "";

const normalizeLanguage = (value) => {
  if (!value) {
    return null;
  }
  return value.toLowerCase().split("-")[0];
};

const getPreferredLanguage = () => {
  const params = new URLSearchParams(window.location.search);
  const queryLang = normalizeLanguage(params.get("lang"));
  if (queryLang && SUPPORTED_LANGS.includes(queryLang)) {
    return queryLang;
  }
  const browserLang = normalizeLanguage(navigator.language);
  if (browserLang && SUPPORTED_LANGS.includes(browserLang)) {
    return browserLang;
  }
  return "fr";
};

const currentLang = getPreferredLanguage();
const currentMessages = MESSAGES[currentLang] || MESSAGES.fr;
const secondsFormatter = new Intl.NumberFormat(currentLang, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
document.documentElement.lang = currentLang;

const versionBadge = document.createElement("div");
versionBadge.className = "version-badge";
versionBadge.textContent = APP_VERSION;
document.body.appendChild(versionBadge);

const isTouchLike = (event) =>
  event.pointerType === "touch" || event.pointerType === "pen";

const createDot = (color) => {
  const dot = document.createElement("div");
  dot.className = "touch-dot";
  dot.style.setProperty("--touch-color", color);
  touchLayer.appendChild(dot);
  return dot;
};

const updateDotPosition = (dot, x, y) => {
  dot.style.setProperty("--touch-x", `${x}px`);
  dot.style.setProperty("--touch-y", `${y}px`);
};

const clearSelection = () => {
  selectedId = null;
  touches.forEach((touch) => touch.el.classList.remove("touch-dot--winner"));
  document.querySelectorAll(".touch-dot--winner").forEach((el) => {
    el.classList.remove("touch-dot--winner");
  });
  document.body.classList.remove("winner-mode");
};

const startCountdown = () => {
  if (touches.size < 2) {
    countdownStart = null;
    return;
  }
  countdownStart = performance.now();
};

const handleCountChange = () => {
  if (touches.size !== lastCount) {
    lastCount = touches.size;
    if (selectedId && touches.size > 0) {
      return;
    }
    clearSelection();
    startCountdown();
  }
};

const chooseWinner = () => {
  const ids = Array.from(touches.keys());
  if (ids.length === 0) {
    return;
  }
  const choiceIndex = Math.floor(Math.random() * ids.length);
  selectedId = ids[choiceIndex];
  const chosen = touches.get(selectedId);
  if (chosen) {
    chosen.el.classList.add("touch-dot--winner");
    chosen.el.classList.add("is-zooming");
    document.documentElement.style.setProperty("--winner-color", chosen.color);
    document.body.classList.add("winner-mode");
    window.setTimeout(() => chosen.el.classList.remove("is-zooming"), 950);
  }
};

const updatePrompt = () => {
  let text = currentMessages.promptTouch;
  if (selectedId) {
    text = currentMessages.chosen;
  } else if (countdownLabel) {
    text = countdownLabel;
  }
  promptEls.forEach((el) => {
    if (el) {
      el.textContent = text;
    }
  });
};

const updateCountdown = (now) => {
  if (touches.size < 2) {
    progressTop.style.transform = "scaleX(0)";
    progressBottom.style.transform = "scaleX(0)";
    progressRight.style.transform = "scaleY(0)";
    progressLeft.style.transform = "scaleY(0)";
    countdownLabel = "";
    return;
  }

  if (!countdownStart) {
    countdownStart = now;
  }

  if (selectedId) {
    progressTop.style.transform = "scaleX(0)";
    progressBottom.style.transform = "scaleX(0)";
    progressRight.style.transform = "scaleY(0)";
    progressLeft.style.transform = "scaleY(0)";
    countdownLabel = "";
    return;
  }

  const elapsed = now - countdownStart;
  const remaining = Math.max(0, COUNTDOWN_MS - elapsed);
  const progress = 1 - remaining / COUNTDOWN_MS;

  const seconds = secondsFormatter.format(remaining / 1000);
  countdownLabel = currentMessages.countdown.replace("{seconds}", seconds);
  const fillValue = Math.max(0, 1 - progress);
  progressTop.style.transform = `scaleX(${fillValue})`;
  progressBottom.style.transform = `scaleX(${fillValue})`;
  progressRight.style.transform = `scaleY(${fillValue})`;
  progressLeft.style.transform = `scaleY(${fillValue})`;

  if (remaining <= 0) {
    chooseWinner();
  }
};

const onPointerDown = (event) => {
  if (!isTouchLike(event) && event.pointerType !== "mouse") {
    return;
  }
  event.preventDefault();
  if (touches.has(event.pointerId)) {
    return;
  }
  const color =
    availableColors.length > 0 ? availableColors.shift() : COLORS[0];
  const dot = createDot(color);
  touches.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
    el: dot,
    color,
  });
  updateDotPosition(dot, event.clientX, event.clientY);
  handleCountChange();
  updatePrompt();
};

const onPointerMove = (event) => {
  const touch = touches.get(event.pointerId);
  if (!touch) {
    return;
  }
  event.preventDefault();
  touch.x = event.clientX;
  touch.y = event.clientY;
  updateDotPosition(touch.el, touch.x, touch.y);
};

const onPointerUp = (event) => {
  const touch = touches.get(event.pointerId);
  if (!touch) {
    return;
  }
  event.preventDefault();
  touch.el.remove();
  if (touch.color && !availableColors.includes(touch.color)) {
    availableColors.push(touch.color);
  }
  touches.delete(event.pointerId);
  if (touches.size === 0) {
    clearSelection();
  }
  handleCountChange();
  updatePrompt();
};

window.addEventListener("pointerdown", onPointerDown);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("pointerup", onPointerUp);
window.addEventListener("pointercancel", onPointerUp);
window.addEventListener("contextmenu", (event) => event.preventDefault());
window.addEventListener("dragstart", (event) => event.preventDefault());

const loop = (now) => {
  updateCountdown(now);
  updatePrompt();
  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  });
}
