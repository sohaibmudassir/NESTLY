let currentPlatform = 'ios';

function openWaitlistModal(platform) {
  currentPlatform = platform;
  document.getElementById('waitlist-platform').value = platform;
  document.getElementById('waitlist-email').value = '';
  document.getElementById('waitlist-form').style.display = 'block';
  document.getElementById('waitlist-success').style.display = 'none';
  document.getElementById('waitlist-error').style.display = 'none';
  document.getElementById('waitlist-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('waitlist-email').focus(), 100);

  posthog.capture('waitlist_clicked', { platform });
}

function closeWaitlistModal() {
  document.getElementById('waitlist-modal').style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('waitlist-modal').addEventListener('click', function (e) {
  if (e.target === this) closeWaitlistModal();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeWaitlistModal();
});

document.getElementById('waitlist-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('waitlist-email').value.trim();
  const platform = document.getElementById('waitlist-platform').value;
  const btn = document.getElementById('waitlist-submit');
  const errorEl = document.getElementById('waitlist-error');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Submitting…';
  errorEl.style.display = 'none';

  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, platform }),
    });

    const data = await res.json();

    if (data.success) {
      posthog.capture('waitlist_signup', { platform, email });
      document.getElementById('waitlist-form').style.display = 'none';
      const successEl = document.getElementById('waitlist-success');
      document.getElementById('waitlist-success-msg').textContent =
        `You're on the list! We'll notify you at ${email} when Nestly launches.`;
      successEl.style.display = 'flex';
    } else if (data.error === 'Already signed up') {
      errorEl.textContent = 'You're already on the waitlist!';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Notify me when it launches';
    } else if (data.error === 'Invalid email') {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Notify me when it launches';
    } else {
      throw new Error('Unexpected response');
    }
  } catch {
    errorEl.textContent = 'Something went wrong. Please try again.';
    errorEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Notify me when it launches';
  }
});

window.openWaitlistModal = openWaitlistModal;
window.closeWaitlistModal = closeWaitlistModal;
