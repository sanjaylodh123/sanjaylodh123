// Simple SPA: nav switching, data fetch, modal viewer, theme toggle, animated background

const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.nav-link');
const yearEl = document.getElementById('year');
const themeToggle = document.getElementById('themeToggle');
yearEl.textContent = new Date().getFullYear();

// Nav routing
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href').replace('#', '');
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    sections.forEach(s => s.classList.add('hidden'));
    document.getElementById(target).classList.remove('hidden');
    window.history.pushState({}, '', `#${target}`);
  });
});

// Load state from hash
window.addEventListener('load', () => {
  const hash = location.hash?.replace('#', '') || 'about';
  document.querySelector(`a[href="#${hash}"]`)?.click();
  initBlog();
  initVideos();
  initDownloads();
  initOrbital();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});

// BLOG: Fetch posts.json
async function initBlog() {
  const res = await fetch('data/posts.json');
  const posts = await res.json();
  const grid = document.getElementById('postsGrid');
  const tagFilter = document.getElementById('tagFilter');
  const searchInput = document.getElementById('searchInput');

  const uniqueTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));
  uniqueTags.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = t;
    tagFilter.appendChild(opt);
  });

  function render() {
    const q = (searchInput.value || '').toLowerCase();
    const tag = tagFilter.value;
    grid.innerHTML = '';
    posts
      .filter(p => (!tag || (p.tags || []).includes(tag)))
      .filter(p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q))
      .forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${p.title}</h3>
          <div class="meta">${p.date} • ${p.read_time} min read</div>
          <p>${p.summary}</p>
          ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        `;
        card.addEventListener('click', () => openPost(p));
        grid.appendChild(card);
      });
  }

  searchInput.addEventListener('input', render);
  tagFilter.addEventListener('change', render);
  render();

  // Modal
  const modal = document.getElementById('postModal');
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  function openPost(p) {
    modal.classList.remove('hidden');
    const article = document.getElementById('modalArticle');
    article.innerHTML = `
      <h2>${p.title}</h2>
      <div class="meta">${p.date} • ${p.read_time} min read</div>
      ${renderMarkdown(p.content)}
    `;
  }
}

// COLLECTION: videos.json -> embed grid
async function initVideos() {
  const res = await fetch('data/videos.json');
  const videos = await res.json();
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = '';
  videos.forEach(v => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card';
    wrapper.innerHTML = `
      <h3>${v.title}</h3>
      <div class="meta">${v.channel || ''}</div>
      <div class="video">
        <iframe src="https://www.youtube.com/embed/${v.id}" title="${v.title}" allowfullscreen></iframe>
      </div>
    `;
    grid.appendChild(wrapper);
  });
}

// DOWNLOADS: downloads.json -> list with files
async function initDownloads() {
  const res = await fetch('data/downloads.json');
  const items = await res.json();
  const list = document.getElementById('downloadList');
  list.innerHTML = '';
  items.forEach(d => {
    const li = document.createElement('li');
    li.className = 'download-item';
    li.innerHTML = `
      <div>
        <strong>${d.name}</strong>
        <div class="meta">${d.description || ''}</div>
      </div>
      <a href="${d.url}" download>Download</a>
    `;
    list.appendChild(li);
  });
}

// Minimal Markdown renderer: headings, code, lists, bold/italic
function renderMarkdown(md) {
  // Escape HTML
  md = md.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  // Code blocks
  md = md.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code}</code></pre>`);
  // Headings
  md = md.replace(/^### (.*)$/gm, '<h3>$1</h3>')
         .replace(/^## (.*)$/gm, '<h2>$1</h2>')
         .replace(/^# (.*)$/gm, '<h1>$1</h1>');
  // Bold/italic
  md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
         .replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Lists
  md = md.replace(/^\- (.*)$/gm, '<li>$1</li>')
         .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  // Paragraphs
  md = md.replace(/^(?!<h\d|<ul|<pre|<li|<strong|<em)(.+)$/gm, '<p>$1</p>');
  return md;
}

// Animated orbital dots background
function initOrbital() {
  const canvas = document.getElementById('orbital-bg');
  const ctx = canvas.getContext('2d');
  let w, h, dots;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    dots = Array.from({ length: 60 }, () => ({
      r: Math.random() * 2 + 0.6,
      x: Math.random() * w,
      y: Math.random() * h,
      a: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005
    }));
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach(d => {
      d.a += d.speed;
      d.x += Math.cos(d.a) * 0.6;
      d.y += Math.sin(d.a) * 0.6;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(123,140,255,0.6)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
