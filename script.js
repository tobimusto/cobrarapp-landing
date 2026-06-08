// NAV — printed shadow once you scroll past the fold edge
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// SCROLL REVEAL — content is visible by default; this only enhances it
const reveals = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('is-in'), i * 70);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(r => io.observe(r));
} else {
  reveals.forEach(r => r.classList.add('is-in'));
}

// DEMO POS
let cart = {};
let total = 0;

function addToCart(name, price) {
  if (cart[name]) cart[name].qty++;
  else cart[name] = { price, qty: 1 };
  total += price;
  renderCart();
}

function renderCart() {
  const el = document.getElementById('cartItems');
  el.innerHTML = '';
  Object.entries(cart).forEach(([name, { price, qty }]) => {
    const row = document.createElement('div');
    row.className = 'dci';
    row.innerHTML =
      `<span class="dci-name">${name} ×${qty}</span>` +
      `<span class="dci-price">$${(price * qty).toLocaleString('es-AR')}</span>`;
    el.appendChild(row);
  });
  document.getElementById('demoTotal').textContent = '$' + total.toLocaleString('es-AR');
}

function cobrar() {
  if (total === 0) return;
  document.getElementById('demoScreen').hidden = true;
  document.getElementById('demoSuccess').hidden = false;
}

function resetDemo() {
  cart = {};
  total = 0;
  document.getElementById('cartItems').innerHTML =
    '<span class="cart-empty">Tocá un producto para empezar…</span>';
  document.getElementById('demoTotal').textContent = '$0';
  document.getElementById('demoScreen').hidden = false;
  document.getElementById('demoSuccess').hidden = true;
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

// SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// TIME-SAVED CALCULATOR
(function () {
  const sliders = ['rngVentas', 'rngCierre', 'rngStock'].map(id => document.getElementById(id));
  if (sliders.some(s => !s)) return;
  const el = id => document.getElementById(id);
  const round = n => Math.round(n);

  function fill(input) {
    const p = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--p', p + '%');
  }

  function update() {
    const ventas = +el('rngVentas').value;   // ventas por día
    const cierre = +el('rngCierre').value;    // minutos de cierre por día
    const stock = +el('rngStock').value;      // horas de inventario por semana

    el('outVentas').textContent = ventas;
    el('outCierre').textContent = cierre + ' min';
    el('outStock').textContent = stock + ' h';

    // Estimación de horas recuperadas por mes
    const hVentas = ventas * 30 * 0.7 / 60;  // ~0.7 min menos por venta registrada
    const hCierre = cierre * 0.85 * 30 / 60; // cierre 85% más rápido, por día
    const hStock = stock * 0.6 * 4.33;       // inventario 60% menos, semanas/mes
    const hRep = 3;                          // reportes automáticos
    const total = hVentas + hCierre + hStock + hRep;

    el('crHours').textContent = round(total);
    el('crDays').textContent = round(total * 12 / 8); // jornadas de 8 h al año
    el('brVentas').textContent = '+' + round(hVentas) + ' h';
    el('brCierre').textContent = '+' + round(hCierre) + ' h';
    el('brStock').textContent = '+' + round(hStock) + ' h';
    el('brRep').textContent = '+' + round(hRep) + ' h';

    sliders.forEach(fill);
  }

  sliders.forEach(s => s.addEventListener('input', update));
  update();
})();

// THEME TOGGLE (View Transitions API)
const themeBtn = document.getElementById('themeToggle');

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark-theme');
}

themeBtn.addEventListener('click', (e) => {
  const isDark = document.documentElement.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');

  if (!document.startViewTransition) {
    document.documentElement.classList.toggle('dark-theme');
    return;
  }

  const x = e.clientX;
  const y = e.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  const transition = document.startViewTransition(() => {
    document.documentElement.classList.toggle('dark-theme');
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ];

    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    );
  });
});
