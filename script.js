/* ============================================
   PORTFOLIO JAVASCRIPT
   Ahmad Faozan Zebua
   ============================================ */

// ===== PARTICLES CANVAS =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  const colors = ['#6B4E71', '#53687E', '#C2B2B4', '#F5DDDD'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.1;
      this.opacityDir = (Math.random() - 0.5) * 0.005;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.opacityDir;
      if (this.opacity <= 0.05 || this.opacity >= 0.6) this.opacityDir *= -1;
      if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = '#6B4E71';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[data-section="${id}"]`);

    if (navLink) {
      if (scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

// ===== TYPED TEXT EFFECT =====
const roles = [
  'Web Developer',
  'UI Designer',
  'Backend Developer',
  'Laravel Developer',
  'Problem Solver'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeEffect() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}

setTimeout(typeEffect, 800);

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== INTERSECTION OBSERVER - Scroll Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('animate');
        // Animate skill bars if inside skill card
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          fill.style.width = fill.dataset.width + '%';
        }
      }, parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe cards and elements
document.querySelectorAll('.about-card, .about-info, .skill-card, .featured-project, .contact-form').forEach(el => {
  observer.observe(el);
});

// Staggered animation for about cards
document.querySelectorAll('.about-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.15}s`;
});

// Staggered animation for skill cards
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.dataset.delay = i * 80;
  card.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // Simple validation
  const inputs = this.querySelectorAll('input, textarea');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#ff5f57';
      valid = false;
      setTimeout(() => {
        input.style.borderColor = '';
      }, 2000);
    }
  });

  if (!valid) return;

  // Simulate sending
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Mengirim...</span>';

  setTimeout(() => {
    submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Terkirim!</span>';
    formSuccess.classList.add('show');
    contactForm.reset();

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Kirim Pesan</span>';
      formSuccess.classList.remove('show');
    }, 4000);
  }, 1800);
});

// ===== IFRAME LOAD BUTTON =====
const loadIframeBtn = document.getElementById('load-iframe-btn');
const iframeOverlay = document.getElementById('iframe-overlay');
const iframe = document.getElementById('project-iframe');

if (loadIframeBtn) {
  loadIframeBtn.addEventListener('click', () => {
    loadIframeBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:2rem"></i><span>Memuat...</span>';
    loadIframeBtn.disabled = true;
    // iframe src already set, just hide the overlay
    iframe.addEventListener('load', () => {
      iframeOverlay.classList.add('hidden');
    }, { once: true });
    // Reload iframe if needed
    const src = iframe.src;
    iframe.src = '';
    iframe.src = src;
    // Fallback hide overlay after 4s
    setTimeout(() => {
      iframeOverlay.classList.add('hidden');
    }, 4000);
  });
}

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== HERO ANIMATION ON LOAD =====
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-greeting, .hero-name, .hero-role, .hero-desc, .hero-buttons, .hero-socials').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.7s ease, transform 0.7s ease`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 150);
  });

  document.querySelector('.hero-visual').style.opacity = '0';
  document.querySelector('.hero-visual').style.transition = 'opacity 1s ease 0.5s';
  setTimeout(() => {
    document.querySelector('.hero-visual').style.opacity = '1';
  }, 100);
});
