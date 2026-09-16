const catalog = [
  { title: 'The Last Voyage', genre: 'Drama', year: 2024, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80', description: 'A disgraced cartographer gets one last chance to redraw the map of a world that has forgotten how to dream.' },
  { title: 'Neon Divide', genre: 'Sci-Fi', year: 2024, image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=700&q=80', description: 'Two strangers wake up in a city where every memory has a price.' },
  { title: 'Afterlight', genre: 'Drama', year: 2023, image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80', description: 'A photographer follows a trail of forgotten pictures through the places she once called home.' },
  { title: 'Lucky Break', genre: 'Comedy', year: 2024, image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80', description: 'Three lifelong friends turn one impossible weekend into their best bad idea yet.' },
  { title: 'The Quiet House', genre: 'Drama', year: 2022, image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=700&q=80', description: 'A family returns to a remote house and finds that the silence has been waiting for them.' },
  { title: 'Orbit 9', genre: 'Sci-Fi', year: 2023, image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=700&q=80', description: 'The final crew on a dying station receives a message from a future that should not exist.' },
  { title: 'Small Victories', genre: 'Comedy', year: 2021, image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=80', description: 'A hopeful underdog assembles a team for the most local championship in the world.' },
  { title: 'Blue Hour', genre: 'Drama', year: 2024, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=80', description: 'One summer. Two old friends. A secret that changes the shape of both their lives.' },
  { title: 'Signal Lost', genre: 'Sci-Fi', year: 2020, image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=700&q=80', description: 'A radio astronomer hears a familiar voice in the static between the stars.' },
  { title: 'The Long Weekend', genre: 'Comedy', year: 2022, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80', description: 'An honest wedding, an accidental road trip, and four friends with no backup plan.' },
  { title: 'Wildflower', genre: 'Drama', year: 2023, image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80', description: 'A young botanist races to save a rare forest before the season changes forever.' },
  { title: 'First Contact', genre: 'Sci-Fi', year: 2021, image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=700&q=80', description: 'Humanity gets a reply. It is not the answer anyone expected.' },
  { title: 'Paper Planes', genre: 'Comedy', year: 2020, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80', description: 'A burnt-out teacher finds an unlikely new beginning in an after-school club.' },
  { title: 'North Country', genre: 'Drama', year: 2022, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80', description: 'A search-and-rescue pilot returns to the mountain that took her brother.' }
];

const ratings = { 'The Last Voyage': 96, 'Neon Divide': 91, Afterlight: 87, 'Lucky Break': 84, 'The Quiet House': 78, 'Orbit 9': 93, 'Small Victories': 82, 'Blue Hour': 89, 'Signal Lost': 86, 'The Long Weekend': 81, Wildflower: 95, 'First Contact': 88, 'Paper Planes': 79, 'North Country': 90 };
const reviews = {
  'The Last Voyage': [['Maya R.', '★★★★★', 'A beautiful, patient story with a huge heart.'], ['Jordan K.', '★★★★☆', 'The final episode stayed with me for days.'], ['Screen & Sound', '★★★★★', 'A quietly spectacular original.']],
  'Neon Divide': [['Alex P.', '★★★★★', 'Smart science fiction with a pulse.'], ['The Daily Reel', '★★★★☆', 'Inventive, stylish, and wonderfully strange.'], ['Sam T.', '★★★★☆', 'The world-building is next level.']],
  'Orbit 9': [['Priya N.', '★★★★★', 'The kind of space story you can get lost in.'], ['Jordan K.', '★★★★☆', 'Tense, thoughtful, and beautifully shot.'], ['Film Club', '★★★★★', 'A must-watch for sci-fi fans.']]
};
let profiles = [];
let activeProfile = null;
let selectedProfiles = [];
let authToken = sessionStorage.getItem('netflix-auth-token');
let savedTitles = new Set(JSON.parse(localStorage.getItem('netflix-saved-titles') || '[]'));

const byTitle = title => catalog.find(item => item.title === title) || catalog[0];
const posterCard = (item, compact = false) => `<article class="poster-card" data-title="${item.title}"><div class="poster-art" style="background-image:url('${item.image}')"><button class="save-button ${savedTitles.has(item.title) ? 'is-saved' : ''}" data-save="${item.title}" aria-label="${savedTitles.has(item.title) ? 'Remove' : 'Save'} ${item.title}">${savedTitles.has(item.title) ? '♥' : '＋'}</button><div class="poster-hover-description"><strong>${item.title}</strong><p>${item.description}</p></div><div class="poster-overlay"><div><h3>${item.title}</h3><small><strong>${ratings[item.title]}% match</strong> · ${item.genre}</small></div><button class="poster-play" data-play="${item.title}" aria-label="Play ${item.title}">▶</button></div></div></article>`;

const keepWatching = [catalog[0], catalog[1], catalog[2], catalog[3], catalog[4]];
const trending = [catalog[5], catalog[7], catalog[8], catalog[10], catalog[11]];
document.querySelector('#keepWatchingRow').innerHTML = keepWatching.map(item => posterCard(item)).join('');
document.querySelector('#trendingRow').innerHTML = trending.map(item => posterCard(item)).join('');

let activeFilter = 'All';
let activePage = 1;
const perPage = 6;
const libraryGrid = document.querySelector('#libraryGrid');
const pagination = document.querySelector('#pagination');
const searchInput = document.querySelector('#searchInput');
const sortSelect = document.querySelector('#sortSelect');

function renderLibrary() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let results = catalog.filter(item => (activeFilter === 'All' || item.genre === activeFilter) && (!searchTerm || `${item.title} ${item.genre}`.toLowerCase().includes(searchTerm)));
  if (sortSelect.value === 'match' && activeProfile) results.sort((a, b) => activeProfile.matches[b.title] - activeProfile.matches[a.title]);
  if (sortSelect.value === 'az') results.sort((a, b) => a.title.localeCompare(b.title));
  if (sortSelect.value === 'year') results.sort((a, b) => b.year - a.year);
  const pages = Math.max(1, Math.ceil(results.length / perPage));
  activePage = Math.min(activePage, pages);
  const pageItems = results.slice((activePage - 1) * perPage, activePage * perPage);
  libraryGrid.innerHTML = pageItems.length ? pageItems.map(item => posterCard(item, true)).join('') : '<div class="empty-state">No titles found. Try a different search.</div>';
  pagination.innerHTML = pages > 1 ? Array.from({ length: pages }, (_, index) => `<button class="page-button ${index + 1 === activePage ? 'is-current' : ''}" data-page="${index + 1}">${index + 1}</button>`).join('') : '';
}
renderLibrary();

function renderFriends() {
  const comparedProfiles = selectedProfiles.map(id => profiles.find(profile => profile.id === id)).filter(Boolean);
  const common = comparedProfiles.length > 1 ? catalog.filter(item => comparedProfiles.every(profile => profile.matches[item.title] >= 70)).sort((a, b) => Math.min(...comparedProfiles.map(profile => profile.matches[b.title])) - Math.min(...comparedProfiles.map(profile => profile.matches[a.title]))) : [];
  document.querySelector('#friendsCount').textContent = comparedProfiles.length > 1 ? `${common.length} titles everyone will like` : 'Select at least two profiles to compare';
  document.querySelector('#friendsGrid').innerHTML = common.map(item => `<article class="friend-title" data-title="${item.title}"><div class="friend-art" style="background-image:url('${item.image}')"><span>${Math.min(...comparedProfiles.map(profile => profile.matches[item.title]))}% min match</span></div><div><h4>${item.title}</h4><small>${item.genre} · ${item.year}</small></div></article>`).join('');
  document.querySelector('#profilePresence').innerHTML = comparedProfiles.map(profile => `<span style="--profile-color:${profile.color}" title="${profile.name}">${profile.initial}</span>`).join('');
  document.querySelector('#friendsProfilePicker').innerHTML = profiles.map(profile => `<button class="friend-profile-option ${selectedProfiles.includes(profile.id) ? 'is-selected' : ''}" data-friend-profile="${profile.id}"><span style="--profile-color:${profile.color}">${profile.initial}</span>${profile.name}<b>${selectedProfiles.includes(profile.id) ? '✓' : '+'}</b></button>`).join('');
}
renderFriends();

function showModal(id) { const modal = document.querySelector(`#${id}`); modal.classList.add('is-visible'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open'); }
function closeModal(id) { const modal = document.querySelector(`#${id}`); modal.classList.remove('is-visible'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); }
function openDetails(title) {
  const item = byTitle(title);
  document.querySelector('#detailVisual').style.backgroundImage = `url('${item.image}')`;
  const itemReviews = reviews[item.title] || [['Netflix viewer', '★★★★★', 'A compelling story from beginning to end.'], ['Jordan K.', '★★★★☆', 'Beautifully made and easy to recommend.'], ['The Daily Reel', '★★★★☆', 'A confident, memorable watch.']];
  document.querySelector('#detailBody').innerHTML = `<p class="section-kicker">${item.genre.toUpperCase()} · ${item.year}</p><h2>${item.title}</h2><div class="detail-rating"><strong>${ratings[item.title]}% Match</strong><span>★ ${Math.round(ratings[item.title] / 20 * 10) / 10}</span><span>${itemReviews.length} reviews</span></div><p>${item.description}</p><div class="detail-actions"><button class="primary-button" data-play="${item.title}"><span>▶</span> Play now</button><button class="secondary-button" id="detailListButton" data-save="${item.title}"><span>${savedTitles.has(item.title) ? '♥' : '＋'}</span> ${savedTitles.has(item.title) ? 'Saved' : 'My List'}</button></div><div class="reviews"><div class="reviews-heading"><p class="section-kicker">VIEWER REVIEWS</p><span>4.5 / 5</span></div>${itemReviews.map(review => `<blockquote><div><strong>${review[0]}</strong><span class="stars">${review[1]}</span></div><p>“${review[2]}”</p></blockquote>`).join('')}</div>`;
  showModal('detailModal');
}
function playTitle(title) { document.querySelector('#playerTitle').textContent = title; closeModal('detailModal'); showModal('playerModal'); }
function toast(message) { const element = document.querySelector('#toast'); element.textContent = message; element.classList.add('is-visible'); setTimeout(() => element.classList.remove('is-visible'), 2300); }

document.addEventListener('click', event => {
  const saveButton = event.target.closest('[data-save]');
  if (saveButton) { event.stopPropagation(); const title = saveButton.dataset.save; if (savedTitles.has(title)) { savedTitles.delete(title); toast(`${title} removed from My List`); } else { savedTitles.add(title); toast(`${title} saved to ${activeProfile.name}'s My List`); } localStorage.setItem('netflix-saved-titles', JSON.stringify([...savedTitles])); renderLibrary(); document.querySelector('#keepWatchingRow').innerHTML = keepWatching.map(item => posterCard(item)).join(''); document.querySelector('#trendingRow').innerHTML = trending.map(item => posterCard(item)).join(''); return; }
  const playButton = event.target.closest('[data-play]');
  const detailButton = event.target.closest('[data-details]');
  const card = event.target.closest('.poster-card');
  if (playButton) playTitle(playButton.dataset.play);
  else if (detailButton) openDetails(detailButton.dataset.details);
  else if (card) openDetails(card.dataset.title);
  const pageButton = event.target.closest('[data-page]');
  if (pageButton) { activePage = Number(pageButton.dataset.page); renderLibrary(); setActiveView('search'); }
  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) { document.querySelectorAll('[data-filter]').forEach(button => button.classList.remove('is-selected')); filterButton.classList.add('is-selected'); activeFilter = filterButton.dataset.filter; activePage = 1; renderLibrary(); }
  const viewAll = event.target.closest('[data-view-all]');
  if (viewAll) { setActiveView('search'); toast('Search view ready'); }
  const closeButton = event.target.closest('[data-close]');
  if (closeButton) closeModal(closeButton.dataset.close);
  if (event.target.id === 'detailModal' || event.target.id === 'playerModal') closeModal(event.target.id);
  if (event.target.id === 'detailListButton') toast('Added to My List');
  const heading = event.target.closest('[data-nav-reveal]');
  if (heading) revealNav(heading.dataset.navReveal);
  const friendProfile = event.target.closest('[data-friend-profile]');
  if (friendProfile) { const profileId = Number(friendProfile.dataset.friendProfile); selectedProfiles = selectedProfiles.includes(profileId) ? selectedProfiles.filter(id => id !== profileId) : [...selectedProfiles, profileId]; renderFriends(); return; }
  const friendTitle = event.target.closest('.friend-title');
  if (friendTitle) openDetails(friendTitle.dataset.title);
});
searchInput.addEventListener('input', () => { activePage = 1; renderLibrary(); });
sortSelect.addEventListener('change', () => { activePage = 1; renderLibrary(); });

function setActiveView(view) { document.querySelectorAll('.app-view').forEach(section => section.classList.toggle('is-active', section.id === view)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function revealNav(section) { document.body.classList.add('nav-open'); const link = document.querySelector(`[data-nav="${section}"]`); if (link) { document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('is-active')); link.classList.add('is-active'); } }
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => { document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('is-active')); link.classList.add('is-active'); if (link.dataset.nav === 'friends') setActiveView('friends'); else if (link.dataset.nav === 'search') setActiveView('search'); else { setActiveView('home'); } if (link.dataset.nav === 'coming-soon') toast('Coming soon: new stories every week'); document.body.classList.remove('nav-open'); }));

let navTimer;
document.addEventListener('mousemove', event => { if (event.clientX <= 22) { clearTimeout(navTimer); document.body.classList.add('nav-open'); } else if (event.clientX > 285) { navTimer = setTimeout(() => document.body.classList.remove('nav-open'), 400); } });
document.querySelector('#mobileMenuButton').addEventListener('click', () => document.body.classList.toggle('nav-open'));
document.querySelector('#navScrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
document.querySelector('#helpButton').addEventListener('click', () => toast('Help center is coming soon'));
document.querySelector('#logoutButton').addEventListener('click', async () => { if (authToken) await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${authToken}` } }); sessionStorage.removeItem('netflix-auth-token'); authToken = null; profiles = []; selectedProfiles = []; activeProfile = null; document.body.classList.remove('is-authenticated'); document.querySelector('#authGate').classList.remove('is-hidden'); document.querySelector('#loginPanel').hidden = false; document.querySelector('#profileSelectPanel').hidden = true; document.querySelector('#loginPassword').value = ''; toast('Logged out'); });
function renderProfiles() { document.querySelector('#profilesGrid').innerHTML = profiles.map((profile, index) => `<button class="profile-card ${profile === activeProfile ? 'is-current' : ''}" data-profile-index="${index}"><span style="--profile-color:${profile.color}">${profile.initial}</span><strong>${profile.name}</strong>${profile === activeProfile ? '<small>Current</small>' : ''}</button>`).join(''); }
renderProfiles();
document.querySelector('#profileButton').addEventListener('click', () => { renderProfiles(); showModal('profileModal'); });
document.querySelector('#profilesGrid').addEventListener('click', event => { const profileCard = event.target.closest('[data-profile-index]'); if (!profileCard) return; activeProfile = profiles[Number(profileCard.dataset.profileIndex)]; document.querySelector('#profileButton small').textContent = activeProfile.name; document.querySelector('#profileButton span').textContent = activeProfile.initial; document.querySelector('#profileButton span').style.background = activeProfile.color; renderProfiles(); renderLibrary(); toast(`Switched to ${activeProfile.name}'s profile`); });
document.querySelector('#profileForm').addEventListener('submit', async event => { event.preventDefault(); const name = document.querySelector('#profileNameInput').value.trim(); if (!name) return; const response = await fetch('/api/profiles', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ name }) }); if (!response.ok) return toast('Could not create profile'); const result = await response.json(); profiles.push(result.profile); document.querySelector('#profileNameInput').value = ''; renderProfiles(); renderFriends(); toast(`${name}'s profile created`); });
document.querySelector('#playerPlay').addEventListener('click', event => { const isPaused = event.currentTarget.textContent === '▶'; event.currentTarget.textContent = isPaused ? 'Ⅱ' : '▶'; event.currentTarget.setAttribute('aria-label', isPaused ? 'Pause' : 'Play'); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeModal('detailModal'); closeModal('playerModal'); document.body.classList.remove('nav-open'); } });

function showAuthError(message) { document.querySelector('#authError').textContent = message; }
function renderAuthProfiles() { document.querySelector('#authProfiles').innerHTML = profiles.map(profile => `<button class="auth-profile-card ${selectedProfiles.includes(profile.id) ? 'is-selected' : ''}" data-auth-profile="${profile.id}"><span style="--profile-color:${profile.color}">${profile.initial}</span><strong>${profile.name}</strong></button>`).join(''); document.querySelector('#continueButton').disabled = selectedProfiles.length === 0; }
function finishAuthentication() { document.body.classList.add('is-authenticated'); document.querySelector('#authGate').classList.add('is-hidden'); activeProfile = profiles.find(profile => profile.id === selectedProfiles[0]); document.querySelector('#profileButton small').textContent = activeProfile.name; document.querySelector('#profileButton span').textContent = activeProfile.initial; document.querySelector('#profileButton span').style.background = activeProfile.color; renderLibrary(); renderFriends(); }
async function loadProfilesAfterLogin() { const response = await fetch('/api/profiles', { headers: { Authorization: `Bearer ${authToken}` } }); if (!response.ok) throw new Error('Session expired'); const result = await response.json(); profiles = result.profiles; selectedProfiles = []; renderAuthProfiles(); document.querySelector('#loginPanel').hidden = true; document.querySelector('#profileSelectPanel').hidden = false; }
document.querySelector('#loginForm').addEventListener('submit', async event => { event.preventDefault(); showAuthError(''); const button = event.currentTarget.querySelector('button'); button.disabled = true; try { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.querySelector('#loginEmail').value, password: document.querySelector('#loginPassword').value }) }); if (!response.ok) throw new Error('Invalid email or password'); const result = await response.json(); authToken = result.token; sessionStorage.setItem('netflix-auth-token', authToken); profiles = result.profiles; renderAuthProfiles(); document.querySelector('#loginPanel').hidden = true; document.querySelector('#profileSelectPanel').hidden = false; } catch (error) { showAuthError(error.message); } finally { button.disabled = false; } });
document.querySelector('#authProfiles').addEventListener('click', event => { const card = event.target.closest('[data-auth-profile]'); if (!card) return; const profileId = Number(card.dataset.authProfile); selectedProfiles = [profileId]; renderAuthProfiles(); });
document.querySelector('#continueButton').addEventListener('click', finishAuthentication);
if (authToken) loadProfilesAfterLogin().catch(() => { sessionStorage.removeItem('netflix-auth-token'); authToken = null; });
