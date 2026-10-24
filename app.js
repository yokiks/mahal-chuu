const $ = (id) => document.getElementById(id);
const screens = ['welcome', 'together', 'letter'];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let noCount = 0;
let photoIndex = 0;
let slideshowTimer = null;
let playing = !reducedMotion.matches;
let activeScreen = 'welcome';
let swipeStart = null;
const photoPaths = Array.from({ length: 10 }, (_, i) => `assets/photos/${String(i + 1).padStart(2, '0')}.jpg`);

function showScreen(name) {
  activeScreen = name;
  screens.forEach((id) => { $(id).hidden = id !== name; });
  window.scrollTo({ top: 0, behavior: 'instant' });
  $(`${name}-title`).focus({ preventScroll: true });
}

function updateSlideshow() {
  clearInterval(slideshowTimer);
  slideshowTimer = null;
  $('slideshow').textContent = playing ? 'Ⅱ' : '▷';
  $('slideshow').setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
  $('slideshow').setAttribute('aria-pressed', String(playing));
  if (playing && activeScreen === 'together' && !document.hidden) {
    slideshowTimer = setInterval(() => showPhoto(photoIndex + 1), 5500);
  }
}

function showPhoto(index) {
  photoIndex = (index + photoPaths.length) % photoPaths.length;
  const photo = $('memory');
  photo.classList.remove('changing');
  photo.src = photoPaths[photoIndex];
  photo.alt = `Picture nating dalawa, ${photoIndex + 1} sa 10`;
  requestAnimationFrame(() => photo.classList.add('changing'));
  $('photo-count').innerHTML = `${String(photoIndex + 1).padStart(2, '0')} <span>/ 10</span>`;
  [...$('dots').children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === photoIndex)));
}

function manualPhoto(index) {
  showPhoto(index);
  updateSlideshow();
}

photoPaths.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.setAttribute('aria-label', `Ipakita ang picture ${i + 1}`);
  dot.setAttribute('aria-current', String(i === 0));
  dot.addEventListener('click', () => manualPhoto(i));
  $('dots').append(dot);
});

function celebrate() {
  if (reducedMotion.matches) return;
  for (let i = 0; i < 22; i++) {
    const heart = document.createElement('span');
    heart.className = 'falling-heart';
    heart.textContent = i % 3 === 0 ? '🤍' : '♡';
    heart.style.left = `${Math.random() * 96}%`;
    heart.style.animationDelay = `${Math.random() * 1.8}s`;
    heart.style.fontSize = `${18 + Math.random() * 17}px`;
    $('heart-rain').append(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
}

$('yes').addEventListener('click', () => {
  showScreen('together');
  showPhoto(0);
  playing = !reducedMotion.matches;
  updateSlideshow();
  // Only load the chosen song after the visitor chooses Yes.
  const frame = document.createElement('iframe');
  frame.title = 'an apology — Keanne Nuevas (YouTube music player)';
  frame.src = 'https://www.youtube.com/embed/QOVW18nSa74?autoplay=1&playsinline=1&rel=0';
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allowFullscreen = true;
  $('player').replaceChildren(frame);
  photoPaths.slice(1).forEach((src) => { const image = new Image(); image.src = src; });
  celebrate();
});

$('no').addEventListener('click', () => {
  noCount++;
  if (noCount >= 4) {
    showScreen('letter');
    return;
  }
  const area = $('choices');
  const button = $('no');
  // Three distinct positions, separated from Yes and bounded by the card.
  const positions = [
    { x: 0, y: 94 },
    { x: area.clientWidth - button.offsetWidth, y: 94 },
    { x: (area.clientWidth - button.offsetWidth) / 2, y: 94 },
  ];
  button.style.left = `${Math.max(0, positions[noCount - 1].x)}px`;
  button.style.top = `${positions[noCount - 1].y}px`;
  $('choice-hint').textContent = ['mahal kooo 🥺', 'pleasee, mahal chuu? 🤍', 'okay lang din kung kailangan mo muna ng time 🤍'][noCount - 1];
});

function reset() {
  clearInterval(slideshowTimer);
  slideshowTimer = null;
  $('player').replaceChildren();
  $('heart-rain').replaceChildren();
  noCount = 0;
  $('no').style.removeProperty('left');
  $('no').style.removeProperty('top');
  $('choice-hint').textContent = 'made with all my love, for my favorite person ♡';
  showScreen('welcome');
}
$('back').addEventListener('click', reset);
$('start-over').addEventListener('click', reset);
$('previous').addEventListener('click', () => manualPhoto(photoIndex - 1));
$('next').addEventListener('click', () => manualPhoto(photoIndex + 1));
$('slideshow').addEventListener('click', () => { playing = !playing; updateSlideshow(); });
document.addEventListener('visibilitychange', updateSlideshow);
document.addEventListener('keydown', (event) => {
  if (activeScreen !== 'together' || event.target.closest('button, iframe, a')) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); manualPhoto(photoIndex + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); manualPhoto(photoIndex - 1); }
});
$('photo-stage').addEventListener('touchstart', (event) => {
  swipeStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
}, { passive: true });
$('photo-stage').addEventListener('touchend', (event) => {
  if (!swipeStart) return;
  const dx = event.changedTouches[0].clientX - swipeStart.x;
  const dy = event.changedTouches[0].clientY - swipeStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) manualPhoto(photoIndex + (dx < 0 ? 1 : -1));
  swipeStart = null;
}, { passive: true });
