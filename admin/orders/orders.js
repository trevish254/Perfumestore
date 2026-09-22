const orderRows = [...document.querySelectorAll('#orders-body tr')];
const searchInput = document.querySelector('#order-search');
const statusFilter = document.querySelector('#status-filter');
const dateFilter = document.querySelector('#date-filter');
const emptyMessage = document.querySelector('#no-orders');

function filterOrders() {
  const search = searchInput.value.toLowerCase().trim();
  const status = statusFilter.value;
  const date = dateFilter.value;
  let visible = 0;
  orderRows.forEach((row) => {
    const matchesText = row.textContent.toLowerCase().includes(search);
    const matchesStatus = status === 'all' || row.dataset.status === status;
    const matchesDate = date === 'all' || row.dataset.date === date;
    row.hidden = !(matchesText && matchesStatus && matchesDate);
    if (!row.hidden) visible += 1;
  });
  emptyMessage.hidden = visible > 0;
}

searchInput.addEventListener('input', filterOrders);
statusFilter.addEventListener('change', filterOrders);
dateFilter.addEventListener('change', filterOrders);
