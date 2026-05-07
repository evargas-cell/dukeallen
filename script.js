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

// ── Submit to Netlify + send welcome email + redirect ──────────────
function submitAndRedirect(formEl, formName, nameVal, emailVal, btn, lang) {
  btn.textContent = lang === 'es' ? 'Enviando...' : 'Sending...';
  btn.disabled = true;

  // Capture lead in Netlify Forms dashboard
  const netlifySubmit = fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'form-name': formName,
      'name': nameVal,
      'email': emailVal
    }).toString()
  });

  // Send welcome email via Resend (Netlify Function)
  const emailSend = fetch('/.netlify/functions/send-welcome', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nameVal, email: emailVal, language: lang })
  });

  // Wait max 3s for both, then redirect regardless
  const timeout = new Promise(resolve => setTimeout(resolve, 3000));
  Promise.race([Promise.all([netlifySubmit, emailSend]), timeout])
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

// ── Fix & Flip Calculator ──────────────────────────────────────────
function calcFmt(n) {
  const abs = Math.abs(Math.round(n));
  return (n < 0 ? '-$' : '$') + abs.toLocaleString('en-US');
}

function runCalc() {
  const purchase = parseFloat(document.getElementById('calc-purchase').value) || 0;
  const rehab    = parseFloat(document.getElementById('calc-rehab').value)    || 0;
  const arv      = parseFloat(document.getElementById('calc-arv').value)      || 0;
  const ltc      = parseFloat(document.getElementById('calc-ltc').value)      || 90;
  const rate     = parseFloat(document.getElementById('calc-rate').value)     || 11;
  const term     = parseFloat(document.getElementById('calc-term').value)     || 12;

  const totalCost   = purchase + rehab;
  const loanAmt     = totalCost * (Math.min(ltc, 90) / 100);
  const cashNeeded  = totalCost - loanAmt;
  const monthlyInt  = loanAmt * (rate / 100 / 12);
  const totalInt    = monthlyInt * term;
  const grossProfit = arv - purchase - rehab - totalInt;
  const roi         = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;

  document.getElementById('res-loan').textContent     = calcFmt(loanAmt);
  document.getElementById('res-cash').textContent     = calcFmt(cashNeeded);
  document.getElementById('res-monthly').textContent  = calcFmt(monthlyInt);
  document.getElementById('res-interest').textContent = calcFmt(totalInt);
  document.getElementById('res-profit').textContent   = calcFmt(grossProfit);
  document.getElementById('res-roi').textContent      = roi.toFixed(1) + '%';

  const verdictBar   = document.getElementById('calc-verdict-bar');
  const verdictIcon  = document.getElementById('calc-verdict-icon');
  const verdictLabel = document.getElementById('calc-verdict-label');
  verdictBar.classList.remove('warn', 'bad');

  if (roi >= 20) {
    verdictIcon.textContent  = '✅';
    verdictLabel.textContent = 'Strong Deal';
  } else if (roi >= 10) {
    verdictBar.classList.add('warn');
    verdictIcon.textContent  = '⚠️';
    verdictLabel.textContent = 'Thin Margin — Review Carefully';
  } else {
    verdictBar.classList.add('bad');
    verdictIcon.textContent  = '❌';
    verdictLabel.textContent = 'Deal Needs Work';
  }
}

['calc-purchase', 'calc-rehab', 'calc-arv', 'calc-ltc', 'calc-rate'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', runCalc);
});

document.querySelectorAll('.calc-term-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.calc-term-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('calc-term').value = btn.dataset.months;
    runCalc();
  });
});

runCalc();

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
