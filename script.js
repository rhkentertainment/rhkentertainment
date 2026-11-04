document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('inquiry').addEventListener('submit', async function(event) {
  event.preventDefault();
  const status = document.getElementById('form-status');
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  status.textContent = CONTACT_API_URL ? 'Sending your inquiry…' : 'Online inquiries will be available soon.';
  if (!CONTACT_API_URL) return;
  try {
      const response = await fetch(CONTACT_API_URL, {method: 'POST', body: new URLSearchParams(payload)});
    if (!response.ok) throw new Error('Request failed');
    event.currentTarget.reset();
    status.textContent = 'Thanks — your inquiry was sent. We’ll be in touch soon.';
  } catch (error) {
    status.textContent = 'We couldn’t send that right now. Please try again or call us.';
  }
});

const CONTACT_API_URL = 'https://8i2h26n0ae.execute-api.us-east-2.amazonaws.com/Prod/contact';

const talentTrack = document.getElementById('talent-track');
const talentPrev = document.getElementById('talent-prev');
const talentNext = document.getElementById('talent-next');
function updateTalentControls() {
  talentPrev.disabled = talentTrack.scrollLeft <= 2;
  talentNext.disabled = talentTrack.scrollLeft >= talentTrack.scrollWidth - talentTrack.clientWidth - 2;
}
function scrollTalent(direction) {
  const step = talentTrack.querySelector('.talent-card').getBoundingClientRect().width + parseFloat(getComputedStyle(talentTrack).gap);
  talentTrack.scrollBy({left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
}
talentPrev.addEventListener('click', () => scrollTalent(-1));
talentNext.addEventListener('click', () => scrollTalent(1));
talentTrack.addEventListener('scroll', updateTalentControls, {passive: true});
window.addEventListener('resize', updateTalentControls);
updateTalentControls();
