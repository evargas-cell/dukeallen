/* === Duke Allen & Co — script.js === */

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

// ── Form validation helpers ────────────────────────────────────────
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
function isValidPhone(v) { return /^\+?[\d\s\-().]{7,}$/.test(v.trim()); }
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

// ── Hero prequalify form ────────────────────────────────────────────
const heroForm = document.getElementById('hero-form');
if (heroForm) {
  heroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name  = document.getElementById('hero-name').value;
    const phone = document.getElementById('hero-phone').value;
    const loan  = document.getElementById('hero-loan-type').value;

    clearError('hero-name',  'hero-name-error');
    clearError('hero-phone', 'hero-phone-error');
    clearError('hero-loan-type', 'hero-loan-error');

    if (!name.trim()) {
      showError('hero-name', 'hero-name-error', 'Please enter your name.');
      valid = false;
    }
    if (!isValidPhone(phone)) {
      showError('hero-phone', 'hero-phone-error', 'Please enter a valid phone number.');
      valid = false;
    }
    if (!loan) {
      showError('hero-loan-type', 'hero-loan-error', 'Please select a loan type.');
      valid = false;
    }

    if (valid) {
      // PLACEHOLDER: Replace with real form submission (Formspree, Netlify, etc.)
      heroForm.innerHTML = `
        <div style="text-align:center;padding:2rem 0;">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">✅</div>
          <h3 style="color:#fff;margin-bottom:0.5rem;">Application Started!</h3>
          <p style="color:rgba(255,255,255,0.6);font-size:0.9rem;">
            We'll call you back within 1 business hour.<br/>
            Or call us now: <a href="tel:13055226126" style="color:#0AA5AD;">1-800-DUKEALLEN</a>
          </p>
        </div>`;
    }
  });
}

// ── Contact form ────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name  = document.getElementById('cf-name').value;
    const phone = document.getElementById('cf-phone').value;
    const loan  = document.getElementById('cf-loan').value;

    clearError('cf-name',  'cf-name-error');
    clearError('cf-phone', 'cf-phone-error');
    clearError('cf-loan',  'cf-loan-error');

    if (!name.trim()) {
      showError('cf-name', 'cf-name-error', 'Please enter your name.');
      valid = false;
    }
    if (!isValidPhone(phone)) {
      showError('cf-phone', 'cf-phone-error', 'Please enter a valid phone number.');
      valid = false;
    }
    if (!loan) {
      showError('cf-loan', 'cf-loan-error', 'Please select a loan type.');
      valid = false;
    }

    if (valid) {
      // PLACEHOLDER: Replace with real form submission
      contactForm.innerHTML = `
        <div style="text-align:center;padding:2.5rem 0;">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">✅</div>
          <h3 style="margin-bottom:0.5rem;">Message Sent!</h3>
          <p style="color:#5A7080;font-size:0.9rem;">
            We'll respond within 1 business hour.<br/>
            Or call us: <a href="tel:13055226126" style="color:#0AA5AD;">1-800-DUKEALLEN</a>
          </p>
        </div>`;
    }
  });
}

// ── Email capture form ──────────────────────────────────────────────
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

    // PLACEHOLDER: Wire to Mailchimp, ConvertKit, or similar
    emailCapture.innerHTML = `<p style="color:rgba(255,255,255,0.8);font-size:0.9rem;">
      ✅ Guide sent! Check your inbox.
    </p>`;
  });
}
