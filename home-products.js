const featuredGrid = document.querySelector('.hero-recommendations-grid');
const bestsellerGrid = document.querySelector('#bestsellers .product-grid');
const arrivalsGrid = document.querySelector('#new-arrivals .product-grid');

const productImage = (product) => product.image_urls?.[0] || product.image_url || '';
const productBadge = (product, preferred) => preferred || ((product.product_tags || []).includes('bestseller') ? 'Bestseller' : (product.product_tags || []).includes('new') ? 'New' : (product.product_tags || []).includes('featured') ? 'Featured' : '');

const addFavoriteBehavior = (button) => button.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); const active = button.getAttribute('aria-pressed') === 'true'; button.setAttribute('aria-pressed', String(!active)); button.textContent = active ? '♡' : '♥'; });

const createFeaturedCard = (product) => {
  const card = document.createElement('a'); card.className = 'hero-recommendation-card'; card.href = `product.html?product=${encodeURIComponent(product.title)}`;
  const imageWrap = document.createElement('div'); imageWrap.className = 'hero-recommendation-image'; const badge = productBadge(product); if (badge) { const badgeElement = document.createElement('span'); badgeElement.textContent = badge; imageWrap.append(badgeElement); }
  const image = document.createElement('img'); image.src = productImage(product); image.alt = product.title; image.loading = 'lazy'; imageWrap.append(image); const info = document.createElement('div'); const title = document.createElement('h3'); title.textContent = product.title; const price = document.createElement('p'); price.textContent = `$${Number(product.price).toFixed(2)} USD`; info.append(title, price); card.append(imageWrap, info); return card;
};

const createProductCard = (product, badgeText) => {
  const card = document.createElement('a'); card.className = 'product-card'; card.href = `product.html?product=${encodeURIComponent(product.title)}`;
  const imageWrap = document.createElement('div'); imageWrap.className = 'product-image-container'; const badge = productBadge(product, badgeText); if (badge) { const badgeElement = document.createElement('span'); badgeElement.className = 'product-badge'; badgeElement.textContent = badge; imageWrap.append(badgeElement); }
  const favorite = document.createElement('button'); favorite.className = 'favorite-button'; favorite.type = 'button'; favorite.setAttribute('aria-label', `Add ${product.title} to favorites`); favorite.setAttribute('aria-pressed', 'false'); favorite.textContent = '♡'; addFavoriteBehavior(favorite);
  const image = document.createElement('img'); image.src = productImage(product); image.alt = product.title; image.loading = 'lazy'; imageWrap.append(favorite, image); const info = document.createElement('div'); info.className = 'product-info'; const title = document.createElement('h3'); title.textContent = product.title; const price = document.createElement('p'); price.textContent = `$${Number(product.price).toFixed(2)} USD`; info.append(title, price); card.append(imageWrap, info); return card;
};

if (window.supabaseRequest) {
  window.supabaseRequest('products?select=*&is_active=eq.true&order=created_at.desc').then((products) => {
    const featured = products.filter((product) => (product.product_tags || []).includes('featured')).slice(0, 4);
    const bestsellers = products.filter((product) => (product.product_tags || []).includes('bestseller')).slice(0, 4);
    const arrivals = products.filter((product) => (product.product_tags || []).includes('new')).slice(0, 4);
    if (featured.length && featuredGrid) featuredGrid.replaceChildren(...featured.map(createFeaturedCard));
    if (bestsellers.length && bestsellerGrid) bestsellerGrid.replaceChildren(...bestsellers.map((product) => createProductCard(product, 'Bestseller')));
    if (arrivals.length && arrivalsGrid) arrivalsGrid.replaceChildren(...arrivals.map((product) => createProductCard(product, 'New')));
  }).catch((error) => console.warn('Homepage products unavailable:', error));
}
