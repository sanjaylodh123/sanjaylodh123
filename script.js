// Initialize Year
document.getElementById('year').textContent = new Date().getFullYear();

// 1. DYNAMIC WEIRD AVATAR LOGIC
function randomizeAvatar() {
  const avatar = document.getElementById('dynamicAvatar');
  if (!avatar) return;

  // Function to get a random percentage between 30 and 70
  const r = () => Math.floor(Math.random() * 41) + 30;

  // Create a 8-point border radius (weird organic blob)
  const blobValue = `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;
  
  // Set the CSS variable
  avatar.style.setProperty('--blob', blobValue);
}

// 2. NAVIGATION LOGIC
const links = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function showSection(targetId) {
  sections.forEach(s => s.classList.add('hidden'));
  links.forEach(l => l.classList.remove('active'));

  const target = document.getElementById(targetId);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
  }

  const activeLink = document.querySelector(`a[href="#${targetId}"]`);
  if (activeLink) activeLink.classList.add('active');
}

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').replace('#', '');
    showSection(id);
  });
});

// Hero Button Logic
document.querySelector('.hero-btn.primary').addEventListener('click', e => {
  e.preventDefault();
  showSection('about');
});

// 3. THEME TOGGLE
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
});

// 4. CONTENT LOADERS (Placeholder logic based on your previous file)
async function loadContent(url, gridId, templateFn) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = data.map(templateFn).join('');
  } catch (err) {
    console.warn(`Could not load ${url}. Ensure the JSON file exists.`);
  }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  randomizeAvatar(); // Change shape on load
  
  // Example loaders - you'll need the JSON files in your 'data/' folder
  loadContent('data/posts.json', 'postsGrid', p => `
    <div class="card">
      <h3>${p.title}</h3>
      <p>${p.summary}</p>
    </div>
  `);
});
