/**
 * Lothika K Portfolio — Interactions & Animations
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ── Page loader ──
  const loader = document.getElementById('pageLoader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader?.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 1200);
  });

  // ── Scroll reveal ──
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  document.querySelectorAll('#hero .reveal').forEach((el) => {
    setTimeout(() => el.classList.add('visible'), 200);
  });

  // ── Skill bar fill animation ──
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.skill-bar-fill').forEach((bar) => {
          const w = bar.dataset.width;
          bar.style.setProperty('--fill-width', `${w}%`);
          bar.classList.add('animated');
        });
        barObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.skill-bars-wrap').forEach((el) => barObserver.observe(el));

  // ── Scroll progress & navbar ──
  const progressBar = document.querySelector('.scroll-progress');
  const navbar = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');
  const heroBg = document.querySelector('.hero-bg');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = `${progress}%`;
    navbar?.classList.toggle('scrolled', scrollTop > 40);
    backToTop?.classList.toggle('visible', scrollTop > 500);

    // Parallax hero background
    if (heroBg && scrollTop < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollTop * 0.25}px)`;
    }

    // Active nav
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - 120) current = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Typing effect ──
  const taglineEl = document.getElementById('typedTagline');
  const phrases = [
    '3rd Year B.Tech AI & Data Science Student 🎓',
    'DevOps Intern @ Prime Vector ⚡',
    'No cap, just clean code & automation 💻',
    'Building intelligent systems that hit different 🚀'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeTagline() {
    if (!taglineEl) return;

    const current = phrases[phraseIndex];
    taglineEl.classList.remove('done');

    if (!isDeleting) {
      taglineEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        taglineEl.classList.add('done');
        setTimeout(typeTagline, 2200);
        return;
      }
    } else {
      taglineEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(typeTagline, isDeleting ? 35 : 55);
  }

  setTimeout(typeTagline, 1400);

  // ── Counter animation ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(eased * target)}+`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach((el) => statObserver.observe(el));

  // ── 3D tilt on cards ──
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── Magnetic buttons + ripple ──
  document.querySelectorAll('.btn-magnetic').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });

    if (isFinePointer && !prefersReduced) {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    }
  });

  // ── Cursor glow ──
  const cursorGlow = document.getElementById('cursorGlow');

  if (cursorGlow && isFinePointer && !prefersReduced) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });
  }

  // ── Particle canvas ──
  const canvas = document.getElementById('particleCanvas');

  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resizeCanvas() {
      const hero = document.getElementById('hero');
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles(count) {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 1,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.4 + 0.2
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(84, 158, 237, ${p.opacity})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(84, 158, 237, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles(window.innerWidth < 768 ? 25 : 45);
    drawParticles();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      resizeCanvas();
      createParticles(window.innerWidth < 768 ? 25 : 45);
      drawParticles();
    });
  }

  // ── Close mobile nav on link click ──
  document.querySelectorAll('.nav-link, .scroll-hint').forEach((link) => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navbarNav');
      if (collapse?.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });

  // ── Skill pills pop-in on reveal ──
  document.querySelectorAll('.skills-block').forEach((block) => {
    const pillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.skill-pill').forEach((pill, i) => {
            pill.style.animation = `pillPop 0.4s var(--ease-out) ${i * 0.06}s both`;
          });
          pillObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    pillObserver.observe(block);
  });

  // ── Formspree Contact Form Handling ──
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const subject = contactForm.querySelector('[name="subject"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();

      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all fields before sending.', 'error');
        return;
      }

      // Show loading state
      submitBtn.disabled = true;
      if (btnText) btnText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
      showStatus('', ''); // hide status

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showStatus('✨ Thank you! Your message has been sent successfully. I will get back to you soon!', 'success');
          contactForm.reset();
        } else {
          const data = await response.json();
          if (Object.hasOwn(data, 'errors')) {
            showStatus(data.errors.map(error => error.message).join(', '), 'error');
          } else {
            showStatus('Oops! There was a problem submitting your message. Please try emailing lothika6649@gmail.com directly.', 'error');
          }
        }
      } catch (error) {
        showStatus('Unable to send message due to network connection. You can email lothika6649@gmail.com directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }



})();



