const userRows = [...document.querySelectorAll('#users-body tr')];
const userSearch = document.querySelector('#user-search');
const userStatus = document.querySelector('#user-status');
const userSort = document.querySelector('#user-sort');
const emptyUsers = document.querySelector('#empty-users');
function filterUsers() {
  const query = userSearch.value.toLowerCase().trim(); const status = userStatus.value;
  let visible = 0;
  userRows.forEach((row) => { const matchesText = row.textContent.toLowerCase().includes(query); const matchesStatus = status === 'all' || (status === 'new' ? row.dataset.new === 'yes' : row.dataset.status === status); row.hidden = !(matchesText && matchesStatus); if (!row.hidden) visible += 1; });
  emptyUsers.hidden = visible > 0;
}
userSearch.addEventListener('input', filterUsers); userStatus.addEventListener('change', filterUsers);
userSort.addEventListener('change', (event) => { const rows = [...document.querySelectorAll('#users-body tr')]; rows.sort((a, b) => event.target.value === 'name' ? a.textContent.localeCompare(b.textContent) : event.target.value === 'orders' ? Number(b.dataset.orders) - Number(a.dataset.orders) : 0); rows.forEach((row) => document.querySelector('#users-body').append(row)); });
