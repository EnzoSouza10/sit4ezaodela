const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .14 });
document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

const message = document.querySelector('.memory-message');
document.querySelectorAll('.memory').forEach(star => star.addEventListener('click', () => {
  message.style.opacity = '0';
  setTimeout(() => {
    message.innerHTML = `<strong>${star.dataset.title}</strong><span>${star.dataset.message}</span>`;
    message.style.opacity = '1';
  }, 170);
}));

const modal = document.querySelector('#love-modal');
const openModal = document.querySelector('#heart-button');
const closeModal = document.querySelector('.close-modal');
function setModal(open) { modal.classList.toggle('open', open); modal.setAttribute('aria-hidden', !open); if (open) closeModal.focus(); }
openModal.addEventListener('click', () => setModal(true));
closeModal.addEventListener('click', () => setModal(false));
modal.addEventListener('click', event => { if (event.target === modal) setModal(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') setModal(false); });

// A contagem é mantida em relação ao primeiro dia 20 após o início do namoro.
const anniversary = new Date(2026, 7, 20, 0, 0, 0);
const countdown = {
  days: document.querySelector('#countdown-days'),
  hours: document.querySelector('#countdown-hours'),
  minutes: document.querySelector('#countdown-minutes'),
  seconds: document.querySelector('#countdown-seconds')
};
function updateCountdown() {
  const now = new Date();
  const remaining = Math.max(0, anniversary - now);
  if (remaining > 0) {
    countdown.days.textContent = Math.floor(remaining / 86400000);
    countdown.hours.textContent = String(Math.floor(remaining / 3600000) % 24).padStart(2, '0');
    countdown.minutes.textContent = String(Math.floor(remaining / 60000) % 60).padStart(2, '0');
    countdown.seconds.textContent = String(Math.floor(remaining / 1000) % 60).padStart(2, '0');
  } else {
    countdown.days.textContent = '♥';
    countdown.hours.textContent = '00';
    countdown.minutes.textContent = '00';
    countdown.seconds.textContent = '00';
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

const canvas = document.querySelector('#stars');
const ctx = canvas.getContext('2d');
let dots = [];
function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  dots = Array.from({ length: Math.min(100, Math.floor(innerWidth / 8)) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.25 + .15, a: Math.random() * .55 + .15, v: Math.random() * .012 + .003 }));
}
function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  dots.forEach(dot => { dot.a += dot.v; const opacity = .16 + Math.abs(Math.sin(dot.a)) * .5; ctx.fillStyle = `rgba(222,178,255,${opacity})`; ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2); ctx.fill(); });
  requestAnimationFrame(draw);
}
resize(); draw(); window.addEventListener('resize', resize);
