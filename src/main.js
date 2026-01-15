import './style.css';

const touchLayer = document.querySelector('#touchLayer');
const promptEls = [
  document.querySelector('#promptTop'),
  document.querySelector('#promptRight'),
  document.querySelector('#promptBottom'),
  document.querySelector('#promptLeft'),
];
const progressTop = document.querySelector('#progressTop');
const progressRight = document.querySelector('#progressRight');
const progressBottom = document.querySelector('#progressBottom');
const progressLeft = document.querySelector('#progressLeft');

const touches = new Map();
const COUNTDOWN_MS = 2500;
const COLORS = ['#00f2a5', '#35a7ff', '#ffb84d', '#ff6b6b', '#a855f7', '#f97316'];
const availableColors = [...COLORS];

let countdownStart = null;
let selectedId = null;
let lastCount = 0;
let countdownLabel = '';

const isTouchLike = (event) => event.pointerType === 'touch' || event.pointerType === 'pen';

const createDot = (color) => {
  const dot = document.createElement('div');
  dot.className = 'touch-dot';
  dot.style.setProperty('--touch-color', color);
  touchLayer.appendChild(dot);
  return dot;
};

const updateDotPosition = (dot, x, y) => {
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
};

const clearSelection = () => {
  selectedId = null;
  touches.forEach((touch) => touch.el.classList.remove('touch-dot--winner'));
  document.body.classList.remove('winner-mode');
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
    chosen.el.classList.add('touch-dot--winner');
    chosen.el.classList.add('is-zooming');
    document.documentElement.style.setProperty('--winner-color', chosen.color);
    document.body.classList.add('winner-mode');
    window.setTimeout(() => chosen.el.classList.remove('is-zooming'), 950);
  }
};

const updatePrompt = () => {
  let text = "Posez un doigt sur l'écran.";
  if (selectedId) {
    text = 'Choisi. Relevez pour rejouer.';
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
    progressTop.style.transform = 'scaleX(0)';
    progressBottom.style.transform = 'scaleX(0)';
    progressRight.style.transform = 'scaleY(0)';
    progressLeft.style.transform = 'scaleY(0)';
    countdownLabel = '';
    return;
  }

  if (!countdownStart) {
    countdownStart = now;
  }

  if (selectedId) {
    progressTop.style.transform = 'scaleX(0)';
    progressBottom.style.transform = 'scaleX(0)';
    progressRight.style.transform = 'scaleY(0)';
    progressLeft.style.transform = 'scaleY(0)';
    countdownLabel = '';
    return;
  }

  const elapsed = now - countdownStart;
  const remaining = Math.max(0, COUNTDOWN_MS - elapsed);
  const progress = 1 - remaining / COUNTDOWN_MS;

  countdownLabel = `Compte à rebours: ${(remaining / 1000).toFixed(1)}s`;
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
  if (!isTouchLike(event) && event.pointerType !== 'mouse') {
    return;
  }
  event.preventDefault();
  const color = availableColors.length > 0 ? availableColors.shift() : COLORS[0];
  const dot = createDot(color);
  touches.set(event.pointerId, { x: event.clientX, y: event.clientY, el: dot, color });
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

window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);
window.addEventListener('pointercancel', onPointerUp);
window.addEventListener('contextmenu', (event) => event.preventDefault());
window.addEventListener('dragstart', (event) => event.preventDefault());

const loop = (now) => {
  updateCountdown(now);
  updatePrompt();
  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
