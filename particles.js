const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d', { alpha: true });
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
let particles = [];
let animationFrameId = null;

const particleCount = Math.max(100, Math.min(300, Math.floor(W * H / 5000)));

class Particle {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.r = Math.random() * 1.2 + 0.5;
    this.opacity = Math.random() * 0.6 + 0.4;
    this.hue = Math.random() * 60 + 180;
    this.lifetime = Math.random() * 120 + 80;
    this.age = 0;
    this.isDead = false;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
    
    if (this.age > this.lifetime) {
      this.isDead = true;
      return;
    }
    
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
    
    this.x = Math.max(0, Math.min(W, this.x));
    this.y = Math.max(0, Math.min(H, this.y));
  }

  draw() {
    const fadeOut = 1 - (this.age / this.lifetime);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity * fadeOut})`;
    ctx.fill();
  }
}

function init() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

let lastTime = Date.now();
let frameCount = 0;

function animate() {
  ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
  ctx.fillRect(0, 0, W, H);

  particles = particles.filter(p => !p.isDead);
  
  for (const p of particles) {
    p.move();
    p.draw();
  }

  const targetCount = Math.max(50, Math.floor(particleCount * 0.7));
  if (particles.length < targetCount) {
    const newParticleCount = targetCount - particles.length;
    for (let i = 0; i < newParticleCount; i++) {
      particles.push(new Particle());
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  init();
});

window.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrameId);
  } else {
    animate();
  }
});

init();
animate();
