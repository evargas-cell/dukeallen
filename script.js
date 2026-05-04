/* === Duke Allen & Co — script.js === */

const LENDINGWISE_URL = 'https://app.lendingwise.com/HMLOWebForm.php?bRc=405994c1adade29d&fOpt=8e614f58c0d670e4&op=69ae9aa7bfc04392';

// Sticky nav shadow on scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
    mobileMenu.setAttribute('aria-hidden', true);
  });
});

// Scroll-triggered fade-in (IntersectionObserver)
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ── Validation helpers ─────────────────────────────────────────────
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.style.borderColor = '#f87171';
  if (error) error.textContent = message;
}
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.style.borderColor = '';
  if (error) error.textContent = '';
}
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

// ── Submit to Netlify + redirect to Lendingwise ────────────────────
function submitAndRedirect(formEl, formName, nameVal, emailVal, btn, lang) {
  btn.textContent = lang === 'es' ? 'Redirigiendo...' : 'Redirecting...';
  btn.disabled = true;

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'form-name': formName,
      'name': nameVal,
      'email': emailVal
    }).toString()
  })
  .finally(() => {
    window.location.href = LENDINGWISE_URL;
  });
}

// ── Hero prequalify form ───────────────────────────────────────────
const heroForm = document.getElementById('hero-form');
if (heroForm) {
  heroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name  = document.getElementById('hero-name').value;
    const email = document.getElementById('hero-email').value;

    clearError('hero-name',  'hero-name-error');
    clearError('hero-email', 'hero-email-error');

    if (!name.trim()) {
      showError('hero-name', 'hero-name-error', 'Please enter your name.');
      valid = false;
    }
    if (!isValidEmail(email)) {
      showError('hero-email', 'hero-email-error', 'Please enter a valid email address.');
      valid = false;
    }

    if (valid) {
      const btn = heroForm.querySelector('button[type="submit"]');
      submitAndRedirect(heroForm, 'prequalify', name, email, btn, 'en');
    }
  });
}

// ── Contact form ───────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name  = document.getElementById('cf-name').value;
    const email = document.getElementById('cf-email').value;

    clearError('cf-name',  'cf-name-error');
    clearError('cf-email', 'cf-email-error');

    if (!name.trim()) {
      showError('cf-name', 'cf-name-error', 'Please enter your name.');
      valid = false;
    }
    if (!isValidEmail(email)) {
      showError('cf-email', 'cf-email-error', 'Please enter a valid email address.');
      valid = false;
    }

    if (valid) {
      const btn = contactForm.querySelector('button[type="submit"]');
      submitAndRedirect(contactForm, 'contact', name, email, btn, 'en');
    }
  });
}

// ── Spanish form ───────────────────────────────────────────────────
const esForm = document.getElementById('apply-form-es');
if (esForm) {
  esForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name  = document.getElementById('nombre').value;
    const email = document.getElementById('correo').value;

    clearError('nombre', 'es-name-error');
    clearError('correo', 'es-email-error');

    if (!name.trim()) {
      showError('nombre', 'es-name-error', 'Por favor ingrese su nombre.');
      valid = false;
    }
    if (!isValidEmail(email)) {
      showError('correo', 'es-email-error', 'Por favor ingrese un correo válido.');
      valid = false;
    }

    if (valid) {
      const btn = esForm.querySelector('button[type="submit"]');
      submitAndRedirect(esForm, 'solicitud-espanol', name, email, btn, 'es');
    }
  });
}

// ── Email capture form ─────────────────────────────────────────────
const emailCapture = document.getElementById('email-capture');
if (emailCapture) {
  emailCapture.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = emailCapture.querySelector('input[type="email"]');
    const error = document.getElementById('email-error');

    if (!isValidEmail(emailInput.value)) {
      if (error) error.textContent = 'Please enter a valid email address.';
      emailInput.style.borderColor = '#f87171';
      return;
    }

    emailCapture.innerHTML = `<p style="color:rgba(255,255,255,0.8);font-size:0.9rem;">
      ✅ Guide sent! Check your inbox.
    </p>`;
  });
}
