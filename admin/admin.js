const adminScript = [...document.scripts].find((script) => script.src.includes('admin.js'));
const liveStoreLink = document.querySelector('.follow-area > p');
if (liveStoreLink && adminScript) {
  const nestedAdminPage = adminScript.getAttribute('src').startsWith('../');
  liveStoreLink.innerHTML = `<a href="${nestedAdminPage ? '../../index.html' : '../index.html'}">View Live Store</a>`;
}
