const slides = document.querySelectorAll('.hero-slide');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
let currentSlide = 0;

document.querySelectorAll('.brand').forEach((brand) => { brand.textContent = 'Perfume Store'; brand.setAttribute('aria-label', 'Perfume Store home'); });
document.querySelectorAll('.nav-links').forEach((nav) => { if (!nav.querySelector('a[href="index.html"]')) { const home = document.createElement('a'); home.href = 'index.html'; home.textContent = 'Home'; nav.prepend(home); } });
document.querySelectorAll('.mobile-menu').forEach((menu) => { if (!menu.querySelector('a[href="index.html"]')) { const home = document.createElement('a'); home.href = 'index.html'; home.textContent = 'Home'; menu.prepend(home); } });
document.querySelectorAll('.footer-meta p').forEach((copyright) => { copyright.textContent = '© Perfume Store 2025'; });
document.querySelectorAll('.footer-column').forEach((column) => {
  const heading = column.querySelector('h2')?.textContent.trim();
  const links = column.querySelectorAll('a');
  if (heading === 'Shop') ['Everyday scents', 'Warm & woody', 'Fresh & floral'].forEach((label, index) => { if (links[index]) links[index].textContent = label; });
  if (heading === 'Explore' && links[0]) links[0].textContent = 'About Perfume Store';
});
document.title = document.title.replace(/Velin/gi, 'Perfume Store');

if (document.body.classList.contains('about-page')) {
  const aboutHeroImage = document.querySelector('.about-hero-image img');
  if (aboutHeroImage) { aboutHeroImage.src = 'https://images.unsplash.com/photo-1705899844877-81bb0a0665c1?auto=format&fit=crop&w=1800&q=90'; aboutHeroImage.alt = 'Minimal perfume bottle and natural stones'; }
  const timelineImages = [
    'https://images.unsplash.com/photo-1646639181895-33d6b2f79d22?auto=format&fit=crop&w=900&q=90',
    'https://images.unsplash.com/photo-1733348172372-31f147483275?auto=format&fit=crop&w=900&q=90',
    'https://images.unsplash.com/photo-1705899844877-81bb0a0665c1?auto=format&fit=crop&w=900&q=90',
    'https://images.unsplash.com/photo-1642999743456-f7073a0b2d9c?auto=format&fit=crop&w=900&q=90'
  ];
  document.querySelectorAll('.timeline-grid img').forEach((image, index) => { if (timelineImages[index]) image.src = timelineImages[index]; image.alt = `Perfume Store fragrance milestone ${index + 1}`; });
  const impactImage = document.querySelector('.impact-image img');
  if (impactImage) { impactImage.src = 'https://images.unsplash.com/photo-1705899844877-81bb0a0665c1?auto=format&fit=crop&w=1200&q=90'; impactImage.alt = 'Perfume bottle in a natural still life'; }
  const founderName = document.querySelector('.founder-section h2 em');
  if (founderName) founderName.textContent = 'Projectskevv';
}

function readVelinCart() {
  try { return JSON.parse(localStorage.getItem('velin-cart') || '[]'); } catch { return []; }
}

function cartCount(items = readVelinCart()) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount(items = readVelinCart()) {
  document.querySelectorAll('#cart-count').forEach((element) => { element.textContent = cartCount(items); });
}

function renderCartDrawer() {
  const items = readVelinCart();
  const itemCount = cartCount(items);
  const itemMarkup = items.length ? items.map((item) => `
    <article class="cart-item">
      <img class="cart-item-image" src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-size">Size: 50ml</span>
        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        <div class="cart-item-controls"><button type="button" data-cart-action="decrease" data-cart-name="${item.name}">−</button><span>${item.quantity}</span><button type="button" data-cart-action="increase" data-cart-name="${item.name}">＋</button></div>
        <button class="cart-item-controls cart-remove" type="button" data-cart-action="remove" data-cart-name="${item.name}" aria-label="Remove ${item.name}">×</button>
      </div>
    </article>`).join('') : '<p class="cart-empty">Your cart is empty.</p>';
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  drawer.querySelector('.cart-drawer-count').textContent = `${itemCount} item${itemCount === 1 ? '' : 's'} in cart`;
  drawer.querySelector('.cart-items').innerHTML = itemMarkup;
  drawer.querySelector('.cart-subtotal strong').textContent = `$${subtotal.toFixed(2)}`;
}

function setCartOpen(open) { document.querySelector('.cart-overlay')?.classList.toggle('is-open', open); document.body.classList.toggle('cart-is-open', open); }

window.addVelinCartItem = (item) => {
  const items = readVelinCart();
  const existing = items.find((entry) => entry.name === item.name);
  if (existing) existing.quantity += item.quantity;
  else items.push(item);
  localStorage.setItem('velin-cart', JSON.stringify(items));
  updateCartCount(items);
  renderCartDrawer();
};

const cartOverlay = document.createElement('div');
cartOverlay.className = 'cart-overlay';
cartOverlay.innerHTML = `<aside class="cart-drawer" aria-label="Shopping cart"><header class="cart-drawer-header"><span class="cart-drawer-count">0 items in cart</span><button class="cart-close" type="button" aria-label="Close cart">×</button></header><div class="cart-items"></div><footer class="cart-footer"><div class="cart-subtotal"><span>Subtotal</span><strong>$0.00</strong></div><button class="cart-checkout" type="button">Checkout</button></footer></aside>`;
document.body.append(cartOverlay);
document.querySelectorAll('a[href="#cart"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); renderCartDrawer(); setCartOpen(true); }));
cartOverlay.addEventListener('click', (event) => {
  if (event.target === cartOverlay || event.target.closest('.cart-close')) setCartOpen(false);
  const action = event.target.closest('[data-cart-action]');
  if (!action) return;
  const items = readVelinCart();
  const item = items.find((entry) => entry.name === action.dataset.cartName);
  if (!item) return;
  if (action.dataset.cartAction === 'increase') item.quantity += 1;
  if (action.dataset.cartAction === 'decrease') item.quantity = Math.max(0, item.quantity - 1);
  if (action.dataset.cartAction === 'remove' || item.quantity === 0) items.splice(items.indexOf(item), 1);
  localStorage.setItem('velin-cart', JSON.stringify(items));
  updateCartCount(items); renderCartDrawer();
});
cartOverlay.querySelector('.cart-checkout')?.addEventListener('click', () => { window.location.href = 'checkout.html'; });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setCartOpen(false); });
updateCartCount();
renderCartDrawer();

function showSlide(index) {
  slides[currentSlide].classList.remove('is-active');
  currentSlide = index % slides.length;
  slides[currentSlide].classList.add('is-active');
}

if (slides.length > 1) setInterval(() => showSlide(currentSlide + 1), 5000);

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  });
});

document.querySelectorAll('.favorite-button').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isFavorite = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!isFavorite));
    button.classList.toggle('is-favorite', !isFavorite);
    button.textContent = isFavorite ? '♡' : '♥';
  });
});

document.querySelector('#newsletter-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  form.hidden = true;
  document.querySelector('#newsletter-success').hidden = false;
});
