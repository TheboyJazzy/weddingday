/**
 * ALEX & BELLA — WEDDING TEMPLATE
 * main.js — Navbar · Smooth Scroll · Hero Animations · Countdown · RSVP Form
 * Requires: GSAP + ScrollTrigger (loaded in HTML)
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     NAVBAR — scroll shrink + hamburger + active link
  ═══════════════════════════════════════════ */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const ham    = document.getElementById('navHam');
    const drawer = document.getElementById('mobileDrawer');
    if (!navbar) return;

    // Scroll-shrink
    const updateScrolled = () =>
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', updateScrolled, { passive: true });
    updateScrolled();

    // Active link tracking
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // Hamburger toggle
    if (ham && drawer) {
      ham.addEventListener('click', () => {
        const open = !ham.classList.contains('open');
        ham.classList.toggle('open', open);
        ham.setAttribute('aria-expanded', String(open));
        drawer.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });

      // Close drawer on link click
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          ham.classList.remove('open');
          ham.setAttribute('aria-expanded', 'false');
          drawer.classList.remove('open');
          document.body.style.overflow = '';
        });
      });

      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
          ham.classList.remove('open');
          ham.setAttribute('aria-expanded', 'false');
          drawer.classList.remove('open');
          document.body.style.overflow = '';
          ham.focus();
        }
      });
    }
  }

  /* ═══════════════════════════════════════════
     SMOOTH SCROLL — anchor links
  ═══════════════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ═══════════════════════════════════════════
     HERO ANIMATIONS
  ═══════════════════════════════════════════ */
  function initHeroAnimations() {
    // Ken Burns — start zoom-out
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      requestAnimationFrame(() => heroBg.classList.add('ready'));
    }
    // Slideshow
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showNextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

// Change every 5 seconds
setInterval(showNextSlide, 5000);

    // Fallback: if GSAP not available, show all hero elements
    if (typeof gsap === 'undefined') {
      ['.hero-initials', '.hero-eyebrow', '.hero-names', '.hero-date', '.hero-tagline', '.hero-scroll']
        .forEach(sel => {
          const el = document.querySelector(sel);
          if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
        });
      return;
    }

    const tl = gsap.timeline({ delay: 0.25 });

    tl.to('.hero-initials', { opacity: 1, y: 0, duration: 0.9,  ease: 'power2.out' })
      .to('.hero-eyebrow',  { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.55')
      .to('.hero-names',    { opacity: 1, y: 0, duration: 1.0,  ease: 'power2.out' }, '-=0.5')
      .to('.hero-date',     { opacity: 1, y: 0, duration: 0.8,  ease: 'power2.out' }, '-=0.55')
      .to('.hero-tagline',  { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.5')
      .to('.hero-scroll',   { opacity: 1, y: 0, duration: 0.7,  ease: 'power2.out' }, '-=0.35');

    // Parallax on scroll
    if (heroBg) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to('.hero-bg', {
        y: 130, ease: 'none',
        scrollTrigger: {
          trigger: '.hero', scrub: 1.3,
          start: 'top top', end: 'bottom top',
        },
      });
    }
  }

  /* ═══════════════════════════════════════════
     SCROLL ANIMATIONS — data-anim + data-anim-stagger
  ═══════════════════════════════════════════ */
  function initScrollAnimations() {
    // Fallback
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('[data-anim], [data-anim-child]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Generic fade-up
    gsap.utils.toArray('[data-anim]').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.88, ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Staggered children
    gsap.utils.toArray('[data-anim-stagger]').forEach(parent => {
      const children = parent.querySelectorAll('[data-anim-child]');
      if (!children.length) return;
      gsap.to(children, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.14, ease: 'power2.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 84%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }

  /* ═══════════════════════════════════════════
     COUNTDOWN TIMER
  ═══════════════════════════════════════════ */
  function initCountdown(targetDateStr) {
    const target = new Date(targetDateStr).getTime();
    const els = {
      d: document.getElementById('cd-days'),
      h: document.getElementById('cd-hours'),
      m: document.getElementById('cd-mins'),
      s: document.getElementById('cd-secs'),
    };
    if (!els.d) return;

    const pad = n => String(Math.max(0, n)).padStart(2, '0');

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        Object.values(els).forEach(el => { if (el) el.textContent = '00'; });
        return;
      }
      els.d.textContent = pad(Math.floor(diff / 86400000));
      els.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      els.m.textContent = pad(Math.floor((diff % 3600000)  / 60000));
      els.s.textContent = pad(Math.floor((diff % 60000)    / 1000));
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ═══════════════════════════════════════════
     RSVP FORM
  ═══════════════════════════════════════════ */
  function initRSVP() {
    const form     = document.getElementById('rsvpForm');
    const success  = document.getElementById('rsvpSuccess');
    const feedback = document.getElementById('rsvpFeedback');
    if (!form) return;

    // Radio visual selection
    form.querySelectorAll('.choice-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        form.querySelectorAll('.choice-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        // Clear attendance error on selection
        clearAttendanceError();
      });
    });

    // Clear field errors on input
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        el.classList.remove('invalid');
        el.closest('.fg')?.classList.remove('has-error');
      });
    });

    function clearAttendanceError() {
      const err = document.getElementById('attendanceErr');
      const fg  = form.querySelector('.choice-group')?.closest('.fg');
      if (err) err.style.display = 'none';
      if (fg)  fg.classList.remove('has-error');
    }

    function validateForm() {
      let valid = true;

      // Full name
      const nameEl = form.querySelector('#fullName');
      if (!nameEl.value.trim()) {
        markInvalid(nameEl);
        valid = false;
      }

      // Email
      const emailEl  = form.querySelector('#email');
      const emailRx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailEl.value.trim() || !emailRx.test(emailEl.value.trim())) {
        markInvalid(emailEl);
        valid = false;
      }

      // Attendance
      const checked = form.querySelector('input[name="attendance"]:checked');
      if (!checked) {
        const err = document.getElementById('attendanceErr');
        const fg  = form.querySelector('.choice-group')?.closest('.fg');
        if (err) { err.style.display = 'block'; }
        if (fg)  { fg.classList.add('has-error'); }
        valid = false;
      }

      return valid;
    }

    function markInvalid(el) {
      el.classList.add('invalid');
      el.closest('.fg')?.classList.add('has-error');
    }

    // Form submit
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm()) return;

      const submitBtn  = form.querySelector('button[type="submit"]');
      const origLabel  = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp; Sending…';

      // Collect data
      const formData = new FormData(form);
      const data = {
        name:       formData.get('fullName'),
        email:      formData.get('email'),
        attendance: formData.get('attendance'),
        message:    formData.get('message') || '',
        timestamp:  new Date().toISOString(),
      };

      // Attempt PHP submission, fall back to localStorage
      fetch('rsvp.php', { method: 'POST', body: formData })
        .then(res => (res.ok ? res.text() : Promise.reject(res)))
        .then(text => {
          if (text.trim() === 'success') {
            showSuccess();
          } else {
            saveLocally(data);
            showSuccess();
          }
        })
        .catch(() => {
          saveLocally(data);
          showSuccess();
        });

      function saveLocally(obj) {
        try {
          const store = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
          store.push(obj);
          localStorage.setItem('wedding_rsvp', JSON.stringify(store));
        } catch (_) {}
      }

      function showSuccess() {
        form.style.display = 'none';
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Restore button if something fails silently
      setTimeout(() => {
        if (!form.style.display || form.style.display !== 'none') {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origLabel;
        }
      }, 8000);
    });
  }

  /* ═══════════════════════════════════════════
     PUBLIC API / BOOT
  ═══════════════════════════════════════════ */
  window.Wedding = {
    init(weddingDateStr) {
      initNavbar();
      initSmoothScroll();
      initHeroAnimations();
      initScrollAnimations();
      initCountdown(weddingDateStr || '2026-06-20T16:30:00');
      initRSVP();
    },
  };

})();

let audio = document.getElementById('bgMusic');
let isPlaying = false;
function toggleMusic() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying = !isPlaying;
}
// ── Music Toggle ──────────────────────────────
(function () {
  // Wait for the DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Get the elements
    const toggleButton = document.getElementById('musicToggle');
    const audioPlayer = document.getElementById('bgMusic');
    
    // Check if elements exist
    if (!toggleButton) {
      console.error('Music toggle button not found - check HTML');
      return;
    }
    
    if (!audioPlayer) {
      console.error('Audio element not found - check HTML');
      return;
    }

    // Set initial volume (25%)
    audioPlayer.volume = 0.25;
    
    // Track if music is playing
    let isMusicPlaying = false;

    // Function to start music
    function playMusic() {
      audioPlayer.play()
        .then(() => {
          isMusicPlaying = true;
          toggleButton.classList.add('playing');
          console.log('Music started playing');
        })
        .catch(function(error) {
          console.log('Could not play music:', error);
        });
    }

    // Function to stop music
    function pauseMusic() {
      audioPlayer.pause();
      isMusicPlaying = false;
      toggleButton.classList.remove('playing');
      console.log('Music paused');
    }

    // Toggle function
    function toggleMusic() {
      if (isMusicPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    }

    // Add click event to the button
    toggleButton.addEventListener('click', toggleMusic);

    // Add keyboard support (Enter and Space keys)
    toggleButton.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMusic();
      }
    });
  });
})();