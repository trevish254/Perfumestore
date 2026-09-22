const blogCards = [...document.querySelectorAll('.blog-card')];
const blogSearch = document.querySelector('#blog-search');
const blogFilter = document.querySelector('#blog-filter');
const emptyBlogs = document.querySelector('#empty-blogs');
function filterBlogs() { const query = blogSearch.value.toLowerCase().trim(); const category = blogFilter.value; let visible = 0; blogCards.forEach((card) => { const matchesQuery = card.dataset.title.toLowerCase().includes(query); const matchesCategory = category === 'all' || card.dataset.category === category; card.hidden = !(matchesQuery && matchesCategory); if (!card.hidden) visible += 1; }); emptyBlogs.hidden = visible > 0; }
blogSearch.addEventListener('input', filterBlogs); blogFilter.addEventListener('change', filterBlogs);
