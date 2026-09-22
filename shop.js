let shopCards = [];
const productGrid = document.querySelector('#product-grid');
const countLabel = document.querySelector('#product-count');
const noResults = document.querySelector('#no-results');
const filtersPanel = document.querySelector('.filters-panel');

const slugify = (value = '') => value.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const addLiveFilterGroups = () => {
  const typeFieldset = filtersPanel?.querySelector('fieldset');
  if (typeFieldset) {
    typeFieldset.querySelector('legend').textContent = 'Audience (0)';
    typeFieldset.innerHTML += '<label><input type="checkbox" name="type" value="unisex" /> Unisex</label><label><input type="checkbox" name="type" value="for-her" /> For her</label><label><input type="checkbox" name="type" value="for-him" /> For him</label>';
    [...typeFieldset.querySelectorAll('label')].slice(0, 3).forEach((label) => label.remove());
  }
  const scentFieldset = document.createElement('fieldset');
  scentFieldset.innerHTML = '<legend>Scent family (0)</legend><label><input type="checkbox" name="scent" value="amber-and-warm" /> Amber and warm</label><label><input type="checkbox" name="scent" value="oud-and-woods" /> Oud and woods</label><label><input type="checkbox" name="scent" value="floral-and-sweet" /> Floral and sweet</label><label><input type="checkbox" name="scent" value="fresh-and-citrus" /> Fresh and citrus</label>';
  filtersPanel?.append(scentFieldset);
};

const createLiveProductCard = (product, index) => {
  const card = document.createElement('article'); card.className = 'shop-product-card';
  const tags = product.product_tags || []; const audience = product.audience_tags || [];
  card.dataset.type = audience.join(' '); card.dataset.collection = tags.join(' '); card.dataset.scent = slugify(product.scent_family); card.dataset.price = product.price; card.dataset.order = index + 1;
  const imageWrap = document.createElement('div'); imageWrap.className = 'shop-product-image';
  const badge = tags.includes('bestseller') ? 'Bestseller' : tags.includes('new') ? 'New' : tags.includes('featured') ? 'Featured' : '';
  if (badge) { const badgeElement = document.createElement('span'); badgeElement.className = 'product-badge'; badgeElement.textContent = badge; imageWrap.append(badgeElement); }
  const favorite = document.createElement('button'); favorite.className = 'favorite-button'; favorite.type = 'button'; favorite.setAttribute('aria-label', `Add ${product.title} to favorites`); favorite.setAttribute('aria-pressed', 'false'); favorite.textContent = '♡';
  const image = document.createElement('img'); image.src = product.image_urls?.[0] || product.image_url || ''; image.alt = product.title; image.loading = 'lazy'; imageWrap.append(favorite, image);
  const info = document.createElement('div'); info.className = 'shop-product-info'; const title = document.createElement('h2'); title.textContent = product.title; const price = document.createElement('p'); price.textContent = `$${Number(product.price).toFixed(2)} USD`; info.append(title, price); card.append(imageWrap, info); return card;
};

function applyShopFilters() {
  const types = [...document.querySelectorAll('input[name="type"]:checked')].map((input) => input.value);
  const collections = [...document.querySelectorAll('input[name="collection"]:checked')].map((input) => input.value);
  const prices = [...document.querySelectorAll('input[name="price"]:checked')].map((input) => input.value);
  const scents = [...document.querySelectorAll('input[name="scent"]:checked')].map((input) => input.value);
  let visible = 0;
  shopCards.forEach((card) => {
    const price = Number(card.dataset.price); const priceMatch = !prices.length || prices.some((range) => (range === 'under25' && price < 25) || (range === '25-50' && price >= 25 && price <= 50) || (range === '50-100' && price > 50));
    const collectionMatch = !collections.length || collections.some((value) => card.dataset.collection.split(' ').includes(value));
    const typeMatch = !types.length || types.some((value) => card.dataset.type.split(' ').includes(value));
    const scentMatch = !scents.length || !card.dataset.scent || scents.includes(card.dataset.scent);
    const matches = priceMatch && collectionMatch && typeMatch && scentMatch; card.hidden = !matches; if (matches) visible += 1;
  });
  countLabel.textContent = `${visible} product${visible === 1 ? '' : 's'}`; noResults.hidden = visible > 0;
}

const attachCardEvents = () => {
  shopCards.forEach((card) => card.addEventListener('click', (event) => { if (event.target.closest('button')) return; const name = card.querySelector('h2')?.textContent.trim(); if (name) window.location.href = `product.html?product=${encodeURIComponent(name)}`; }));
  shopCards.forEach((card) => card.querySelector('.favorite-button')?.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); const button = event.currentTarget; const active = button.getAttribute('aria-pressed') === 'true'; button.setAttribute('aria-pressed', String(!active)); button.textContent = active ? '♡' : '♥'; }));
};

const loadDatabaseProducts = async () => {
  if (!window.supabaseRequest) return;
  try {
    const products = await window.supabaseRequest('products?select=*&is_active=eq.true&order=created_at.desc');
    if (products.length) { productGrid.replaceChildren(...products.map(createLiveProductCard)); shopCards = [...productGrid.querySelectorAll('.shop-product-card')]; attachCardEvents(); applyShopFilters(); }
  } catch (error) { console.warn('Database products unavailable:', error); }
};

addLiveFilterGroups();
const audienceFromUrl = new URLSearchParams(window.location.search).get('audience');
if (audienceFromUrl) { const audienceFilter = document.querySelector(`input[name="type"][value="${audienceFromUrl}"]`); if (audienceFilter) audienceFilter.checked = true; }
shopCards = [...document.querySelectorAll('.shop-product-card')];
attachCardEvents();
document.querySelectorAll('.filters-panel input').forEach((input) => input.addEventListener('change', applyShopFilters));
document.querySelector('#clear-filters')?.addEventListener('click', () => { document.querySelectorAll('.filters-panel input').forEach((input) => { input.checked = false; }); applyShopFilters(); });
document.querySelector('#sort-products')?.addEventListener('change', (event) => { const mode = event.target.value; const sorted = [...shopCards].sort((a, b) => mode === 'low' ? Number(a.dataset.price) - Number(b.dataset.price) : mode === 'high' ? Number(b.dataset.price) - Number(a.dataset.price) : mode === 'az' ? a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent) : Number(a.dataset.order) - Number(b.dataset.order)); sorted.forEach((card) => productGrid.append(card)); });
loadDatabaseProducts();
