// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 40);
});

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => io.observe(r));

// DEMO POS
let cart = {};
let total = 0;

function addToCart(name, price) {
  if (cart[name]) {
    cart[name].qty++;
  } else {
    cart[name] = { price, qty: 1 };
  }
  total += price;
  renderCart();
}

function renderCart() {
  const el = document.getElementById('cartItems');
  el.innerHTML = '';
  Object.entries(cart).forEach(([name, { price, qty }]) => {
    const row = document.createElement('div');
    row.className = 'dci';
    row.innerHTML = `<span class="dci-name">${name} x${qty}</span><span class="dci-price">$${(price * qty).toLocaleString('es-AR')}</span>`;
    el.appendChild(row);
  });
  document.getElementById('demoTotal').textContent = '$' + total.toLocaleString('es-AR');
}

function cobrar() {
  if (total === 0) return;
  const screen = document.getElementById('demoScreen');
  const success = document.getElementById('demoSuccess');
  screen.style.display = 'none';
  success.style.display = 'block';
  success.querySelector('.demo-success').style.display = 'block';
}

function resetDemo() {
  cart = {};
  total = 0;
  document.getElementById('cartItems').innerHTML = '<span style="color:var(--txt3);font-size:13px">Tocá un producto para agregarlo...</span>';
  document.getElementById('demoTotal').textContent = '$0';
  document.getElementById('demoScreen').style.display = 'block';
  document.getElementById('demoSuccess').style.display = 'none';
}

// PRICING TOGGLE
function setToggle(mode) {
  document.getElementById('btnMensual').classList.toggle('active', mode === 'mensual');
  document.getElementById('btnAnual').classList.toggle('active', mode === 'anual');
  document.querySelectorAll('.plan-p').forEach(el => {
    const val = mode === 'mensual' ? parseInt(el.dataset.m) : parseInt(el.dataset.a);
    el.textContent = val === 0 ? '0' : val.toLocaleString('es-AR');
  });
  document.querySelectorAll('.plan-old-price').forEach(el => {
    el.textContent = mode === 'anual' ? el.dataset.a : el.dataset.m;
  });
}

// FAQ ACCORDION
function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// COUNTER ANIMATION
function animateCounter(el, end, duration = 1500) {
  let start = 0;
  const step = end / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= end) { el.textContent = end.toLocaleString('es-AR'); clearInterval(timer); return; }
    el.textContent = Math.floor(start).toLocaleString('es-AR');
  }, 16);
}
