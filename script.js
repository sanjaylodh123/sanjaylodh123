const sections = document.querySelectorAll('section');
const links = document.querySelectorAll('.nav-link');
const yearEl = document.getElementById('year');
const themeToggle = document.getElementById('themeToggle');
yearEl.textContent = new Date().getFullYear();

// Navigation
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href').replace('#', '');
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    sections.forEach(s => s.classList.add('hidden'));
    document.getElementById(target).classList.remove('hidden');
  });
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});

// Blog posts
async function initBlog() {
  const res = await fetch('data/posts.json');
  const posts = await res.json();
  const grid = document.getElementById('postsGrid');
  posts.forEach(p => {
    const card = document.createElement('div');
