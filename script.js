// Footer year
const yearEl = document.getElementById('year');
yearEl.textContent = new Date().getFullYear();

// Sections & nav links
const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.nav-link');

// Navigation toggle
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href').replace('#', '');
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    sections.forEach(s => s.classList.add('hidden'));
    document.getElementById(target).classList.remove('hidden');
    document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
  });
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});

// Smooth scroll from Hero button to About section
const heroBtn = document.querySelector('.hero-btn');
if (heroBtn) {
  heroBtn.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('about').classList.remove('hidden');
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    links.forEach(l => l.classList.remove('active'));
    document.querySelector('a[href="#about"]').classList.add('active');
  });
}

// Blog posts loader
async function initBlog() {
  try {
    const res = await fetch('data/posts.json');
    const posts = await res.json();
    const grid = document.getElementById('postsGrid');
    grid.innerHTML = '';
    posts.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${p.title}</h3>
        <div class="meta">${p.date} • ${p.read_time} • ${p.tags.join(', ')}</div>
        <p>${p.summary}</p>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading posts:', err);
  }
}

// Videos loader
async function initVideos() {
  try {
    const res = await fetch('data/videos.json');
    const videos = await res.json();
    const grid = document.getElementById('videoGrid');
    grid.innerHTML = '';
    videos.forEach(v => {
      const wrapper = document.createElement('div');
      wrapper.className = 'card';
      wrapper.innerHTML = `
        <h3>${v.title}</h3>
        <div class="meta">${v.channel}</div>
        <iframe src="https://www.youtube.com/embed/${v.id}" 
                title="${v.title}" allowfullscreen></iframe>
      `;
      grid.appendChild(wrapper);
    });
  } catch (err) {
    console.error('Error loading videos:', err);
  }
}

// Downloads loader
async function initDownloads() {
  try {
    const res = await fetch('data/downloads.json');
    const downloads = await res.json();
    const list = document.getElementById('downloadList');
    list.innerHTML = '';
    downloads.forEach(d => {
      const item = document.createElement('li');
      item.className = 'download-item';
      item.innerHTML = `
        <span>${d.name} (${d.type})</span>
        <a href="${d.url}" download>⬇ Download</a>
      `;
      list.appendChild(item);
    });
  } catch (err) {
    console.error('Error loading downloads:', err);
  }
}

// Initialize content
initBlog();
initVideos();
initDownloads();
