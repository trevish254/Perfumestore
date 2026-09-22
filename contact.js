document.querySelector('#contact-form')?.addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#contact-success').hidden = false; event.currentTarget.reset(); });
