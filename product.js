const productCatalog = {
  'Pure Cleanser': { price: 79, badge: 'Bestseller', image: 'https://framerusercontent.com/images/S9bF5xZAKeF1uY3MNzTaUj2jts.png', description: 'Gentle, sulfate-free wash that lifts makeup and oil without stripping moisture. Crafted with advanced actives and balanced botanicals, this formula delivers visible results while respecting even the most sensitive skin.' },
  'Dew Toner': { price: 79, badge: '20% off', image: 'https://framerusercontent.com/images/OiaHKYo7D3gLtk9JB7Hr0fVZhZQ.png', description: 'A refreshing, lightweight toner that replenishes hydration and leaves skin soft, calm, and ready for the rest of your ritual.' },
  'Glow Serum': { price: 39, badge: 'Bestseller', image: 'https://framerusercontent.com/images/gQOLspoYfZoJmCbCcTVO2y5V6s.png', description: 'A silky brightening serum made with refined actives to reveal a smoother, more luminous complexion.' }
};

const selectedName = new URLSearchParams(window.location.search).get('product') || 'Pure Cleanser';
let activeProduct = productCatalog[selectedName] || productCatalog['Pure Cleanser'];
let galleryImages = [activeProduct.image];
let galleryIndex = 0;
let quantity = 1;

const setProductDetails = (product) => {
  activeProduct = product;
  galleryImages = product.images?.length ? product.images : [product.image];
  galleryIndex = 0;
  document.title = `${product.name} — Perfume Store`;
  document.querySelector('#product-name').textContent = product.name;
  document.querySelector('#product-price').textContent = `$${Number(product.price).toFixed(2)} USD`;
  document.querySelector('#product-description').textContent = product.description || 'A considered fragrance composition made for everyday presence and lasting impression.';
  const badge = document.querySelector('#product-badge'); badge.hidden = !product.badge; if (product.badge) badge.textContent = product.badge;
  renderGallery();
};

const renderGallery = () => {
  const image = document.querySelector('#product-image'); image.src = galleryImages[galleryIndex]; image.alt = activeProduct.name;
  const dots = document.querySelector('.gallery-dots'); dots.replaceChildren(...galleryImages.map((_, index) => { const dot = document.createElement('span'); dot.className = index === galleryIndex ? 'active' : ''; return dot; }));
  const multiple = galleryImages.length > 1; document.querySelector('.gallery-prev').hidden = !multiple; document.querySelector('.gallery-next').hidden = !multiple;
};

const renderRecommendations = (products, currentName) => {
  const grid = document.querySelector('.recommendations-grid');
  if (!grid) return;
  const recommendations = products.filter((product) => product.title !== currentName).slice(0, 4);
  if (!recommendations.length) return;
  grid.replaceChildren(...recommendations.map((product) => {
    const card = document.createElement('article'); card.className = 'recommendation-card'; card.dataset.recommendation = product.title;
    const imageWrap = document.createElement('div'); imageWrap.className = 'recommendation-image';
    const tags = product.product_tags || []; const badge = tags.includes('bestseller') ? 'Bestseller' : tags.includes('new') ? 'New' : tags.includes('featured') ? 'Featured' : '';
    if (badge) { const badgeElement = document.createElement('span'); badgeElement.className = 'recommendation-badge'; badgeElement.textContent = badge; imageWrap.append(badgeElement); }
    const favorite = document.createElement('button'); favorite.className = 'recommendation-favorite'; favorite.type = 'button'; favorite.setAttribute('aria-label', `Add ${product.title} to favorites`); favorite.textContent = '♡';
    const image = document.createElement('img'); image.src = product.image_urls?.[0] || product.image_url || ''; image.alt = product.title; image.loading = 'lazy'; imageWrap.append(favorite, image);
    const info = document.createElement('div'); info.className = 'recommendation-info'; const title = document.createElement('h3'); title.textContent = product.title; const price = document.createElement('p'); price.textContent = `$${Number(product.price).toFixed(2)} USD`; info.append(title, price); card.append(imageWrap, info); return card;
  }));
  grid.querySelectorAll('.recommendation-card').forEach((card) => card.addEventListener('click', (event) => { if (event.target.closest('button')) return; window.location.href = `product.html?product=${encodeURIComponent(card.dataset.recommendation)}`; }));
};

const loadRecommendations = async (currentName) => {
  if (!window.supabaseRequest) return;
  try { const products = await window.supabaseRequest('products?select=*&is_active=eq.true&order=created_at.desc'); renderRecommendations(products, currentName); } catch (error) { console.warn('Recommendations unavailable:', error); }
};

const fallbackProduct = productCatalog[selectedName] || productCatalog['Pure Cleanser'];
setProductDetails({ name: selectedName, ...fallbackProduct, images: [fallbackProduct.image] });

const loadDatabaseProduct = async () => {
  if (!window.supabaseRequest) return;
  try {
    const rows = await window.supabaseRequest(`products?select=*&title=eq.${encodeURIComponent(selectedName)}&is_active=eq.true&limit=1`);
    const row = rows[0];
    if (!row) { loadRecommendations(selectedName); return; }
    const tags = row.product_tags || [];
    setProductDetails({ name: row.title, price: Number(row.price), badge: tags.includes('bestseller') ? 'Bestseller' : tags.includes('new') ? 'New' : tags.includes('featured') ? 'Featured' : '', image: row.image_urls?.[0] || row.image_url, images: row.image_urls || (row.image_url ? [row.image_url] : []), description: row.description });
    loadRecommendations(row.title);
  } catch (error) { console.warn('Database product unavailable; using fallback:', error); }
};
loadDatabaseProduct();

document.querySelector('.gallery-prev').addEventListener('click', () => { galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length; renderGallery(); });
document.querySelector('.gallery-next').addEventListener('click', () => { galleryIndex = (galleryIndex + 1) % galleryImages.length; renderGallery(); });
const quantityLabel = document.querySelector('#quantity');
document.querySelector('#decrease').addEventListener('click', () => { quantity = Math.max(1, quantity - 1); quantityLabel.textContent = quantity; });
document.querySelector('#increase').addEventListener('click', () => { quantity += 1; quantityLabel.textContent = quantity; });
document.querySelector('#add-to-cart').addEventListener('click', () => { window.addVelinCartItem({ name: activeProduct.name, image: galleryImages[0], price: Number(activeProduct.price), quantity }); document.querySelector('#cart-message').hidden = false; });
document.querySelector('#mpesa-checkout')?.addEventListener('click', () => { window.location.href = `checkout.html?product=${encodeURIComponent(activeProduct.name)}`; });

document.querySelectorAll('.recommendation-card').forEach((card) => card.addEventListener('click', (event) => { if (event.target.closest('button')) return; window.location.href = `product.html?product=${encodeURIComponent(card.dataset.recommendation)}`; }));
