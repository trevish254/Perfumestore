const checkoutCart = (() => { try { return JSON.parse(localStorage.getItem('velin-cart') || '[]'); } catch { return []; } })();
const summaryItems = document.querySelector('#summary-items');
const subtotal = checkoutCart.reduce((total, item) => total + item.price * item.quantity, 0);

summaryItems.innerHTML = checkoutCart.length ? checkoutCart.map((item) => `<div class="summary-item"><img src="${item.image}" alt="${item.name}" /><div class="summary-item-info"><strong>${item.name}</strong><span>Qty: ${item.quantity}</span></div><strong>$${(item.price * item.quantity).toFixed(2)}</strong></div>`).join('') : '<p class="summary-empty">Your cart is empty. <a href="shop.html">Continue shopping.</a></p>';
document.querySelector('#summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
document.querySelector('#summary-total').textContent = `$${subtotal.toFixed(2)}`;

document.querySelector('#checkout-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.querySelector('#checkout-message');
  message.textContent = 'M-Pesa payment request ready. Check your phone to complete payment.';
  message.hidden = false;
});
