/* =========================================
   GESDA CONSTRUCTORA — MAIN JS
   ========================================= */

// ─── NAV SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── NAV MOBILE TOGGLE ───
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  });
});

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

// ─── COUNTER ANIMATION ───
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ─── PARTICLES ───
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 8;
    Object.assign(p.style, {
      width: size + 'px',
      height: size + 'px',
      left: left + '%',
      bottom: '-10px',
      animationDelay: delay + 's',
      animationDuration: duration + 's',
    });
    container.appendChild(p);
  }
}
createParticles();

// ─── VIDEO SCROLL APPLE EFFECT ───
(function initVideoScroll() {
  const video = document.getElementById('scrollVideo');
  const spacer = document.getElementById('videoSpacer');
  const steps = document.querySelectorAll('.video-step');
  const section = document.querySelector('.video-scroll-section');

  if (!video || !spacer || !section) return;

  // Preload video and enable frame-seeking
  video.load();
  video.pause();

  let videoReady = false;
  video.addEventListener('loadedmetadata', () => { videoReady = true; });
  video.addEventListener('canplaythrough', () => { videoReady = true; });

  function setActiveStep(index) {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
  }

  function onScroll() {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = spacer.offsetHeight;
    const scrolled = window.scrollY - sectionTop;
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));

    // Advance video
    if (videoReady && video.duration) {
      const targetTime = progress * video.duration;
      if (Math.abs(video.currentTime - targetTime) > 0.04) {
        video.currentTime = targetTime;
      }
    }

    // Switch text step based on scroll quartile
    const stepIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    setActiveStep(stepIndex);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init
})();

// ─── FACHADA GALLERY CLICK ───
(function initFachadaGallery() {
  const mainImg = document.querySelector('.fachada-main');
  const thumbs = document.querySelectorAll('.fachada-thumbs img');

  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const temp = mainImg.src;
      mainImg.src = thumb.src;
      thumb.src = temp;

      const tempAlt = mainImg.alt;
      mainImg.alt = thumb.alt;
      thumb.alt = tempAlt;
    });
  });
})();

// ─── FORM SUBMIT ───
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre = data.get('nombre') || '';
    const telefono = data.get('telefono') || '';
    const servicio = data.get('servicio') || '';
    const mensaje = data.get('mensaje') || '';

    const text = encodeURIComponent(
      `Hola GESDA, me interesa obtener más información.\n\n` +
      `Nombre: ${nombre}\n` +
      `Teléfono: ${telefono}\n` +
      `Servicio: ${servicio}\n` +
      (mensaje ? `Mensaje: ${mensaje}` : '')
    );

    window.open(`https://wa.me/523334760271?text=${text}`, '_blank');
  });
}

// ─── SMOOTH ACTIVE NAV ───
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
