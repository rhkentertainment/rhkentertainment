document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('inquiry').addEventListener('submit', function(event) {
  event.preventDefault();
  document.getElementById('form-status').textContent = 'Preview only — your inquiry has not been sent or saved. Online inquiries will be available soon.';
});

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
