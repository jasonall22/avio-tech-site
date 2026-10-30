(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;
  const button = form.querySelector('button[type="submit"]');
  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    sending = true;
    const data = new FormData(form);
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'sending';
    status.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Submission failed');
      status.dataset.state = 'success';
      status.textContent = 'Thank you! Your message has been sent.';
      form.reset();
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.name === 'AbortError'
        ? 'We could not confirm delivery. Please call (941) 218-0418 before trying again.'
        : 'Your message could not be sent. Please try again, call (941) 218-0418, or email info@aviotechsolutions.net.';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      form.removeAttribute('aria-busy');
      sending = false;
    }
  });
})();
