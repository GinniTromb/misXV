/* ============================================================
   invitation.js  –  15 años de Gianna
   Confetti (solo al cargar), globos flotantes, música
   ============================================================ */
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ── CONFETTI ──────────────────────────────────────────── */
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
 
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
 
  const COLORS = [
    '#C0001C', '#E8003A', '#FF4060',
    '#D4AF37', '#F0D060', '#FFFFFF',
    '#FFB3C1', '#FF0040'
  ];
 
  const pieces = [];
  const TOTAL  = 200;
  let animActive = true;
  let frameCount = 0;
 
  class Piece {
    constructor() { this.reset(true); }
 
    reset(initial = false) {
      this.x    = Math.random() * canvas.width;
      this.y    = initial
                    ? Math.random() * canvas.height * -1 - 10
                    : -20;
      this.size = Math.random() * 9 + 5;
      this.speedY = Math.random() * 3 + 1.5;
      this.speedX = (Math.random() - 0.5) * 2;
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.18;
      this.shape  = Math.random() < 0.5 ? 'rect' : 'circle';
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha  = 1;
    }
 
    update() {
      this.x     += this.speedX;
      this.y     += this.speedY;
      this.angle += this.spin;
      if (this.y > canvas.height + 20) this.alpha = 0;
    }
 
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
 
      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
 
  for (let i = 0; i < TOTAL; i++) pieces.push(new Piece());
 
  function animateConfetti() {
    if (!animActive) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
 
    frameCount++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    let allGone = true;
    pieces.forEach(p => {
      p.update();
      p.draw();
      if (p.alpha > 0) allGone = false;
    });
 
    if (allGone || frameCount > 360) {
      animActive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    requestAnimationFrame(animateConfetti);
  }
 
  animateConfetti();
 
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
 
 
  /* ── GLOBOS ────────────────────────────────────────────── */
  const container = document.querySelector('.balloons-container');
  const BALLOON_COUNT = 10;
  const balloonClasses = ['b1','b2','b3','b4','b5'];
   function ajustarIframe(obj) {
    obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
}
  function createBalloon() {
    const el = document.createElement('div');
    const cls = balloonClasses[Math.floor(Math.random() * balloonClasses.length)];
    el.className = `balloon ${cls}`;
 
    const size  = 50 + Math.random() * 35;     // 50-85 px
    const left  = Math.random() * 96;           // 0-96 %
    const dur   = 14 + Math.random() * 12;      // 14-26 s
    const delay = Math.random() * 20;           // 0-20 s
 
    el.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size * 1.25}px;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
    `;
    /*container.appendChild(el);*/
  }
 
  for (let i = 0; i < BALLOON_COUNT; i++) createBalloon();
 
 
  /* ── SPARKLES decorativos en el banner ─────────────────── */
  const banner = document.querySelector('.card-banner');
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.cssText = `
      left: ${10 + Math.random() * 80}%;
      top:  ${10 + Math.random() * 80}%;
      animation-delay: ${Math.random() * 3}s;
      animation-duration: ${2 + Math.random() * 2}s;
    `;
    banner.appendChild(s);
  }
 
 
  /* ── MÚSICA ─────────────────────────────────────────────── */
  /*
   * El archivo MP3 debe llamarse "musica.mp3" y estar en la
   * misma carpeta que index.html.
   * El audio arranca silencioso; el usuario presiona Play.
   */
  const audio    = document.getElementById('bg-music');
  const btnMusic = document.getElementById('btn-music');
  const btnIcon  = btnMusic.querySelector('.btn-icon');
  const btnLabel = btnMusic.querySelector('.btn-label');
  const indicator     = document.querySelector('.music-indicator');
  const musicBars     = document.querySelectorAll('.music-bar');
 
  let isPlaying = false;
 
  btnMusic.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      btnIcon.textContent  = '▶';
      btnLabel.textContent = 'Escuchar música';
      indicator.classList.remove('visible');
      musicBars.forEach(b => b.classList.remove('playing'));
    } else {
      audio.play().then(() => {
		audio.currentTime += 30;
        isPlaying = true;
        btnIcon.textContent  = '⏸';
        btnLabel.textContent = 'Pausar música';
        indicator.classList.add('visible');
        musicBars.forEach(b => b.classList.add('playing'));
		
      }).catch(() => {
        // autoplay bloqueado o archivo no encontrado
        console.warn('No se pudo reproducir el audio. Verificá que "musica.mp3" esté en la misma carpeta.');
      });
    }
  });
 
  // Si el audio termina, reiniciar (loop ya en el tag, esto es fallback)
  audio.addEventListener('ended', () => {
    if (isPlaying) audio.play();
  });
  
  
  
  /* ── CUENTA REGRESIVA ──────────────────────────────────── */
const eventDate = new Date('2026-08-08T21:30:00'); // ← cambiá por la fecha real

function updateCountdown() {
  const now  = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML =
      '<span class="countdown-feliz">¡Hoy es el gran día! 🎉</span>';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent    = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);
 
});
 