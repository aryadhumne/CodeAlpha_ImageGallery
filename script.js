// ── Data ─────────────────────────────────────────────────
const cards      = Array.from(document.querySelectorAll('.card'));
const filterBtns = document.querySelectorAll('.filter-btn');
const gallery    = document.getElementById('gallery');
const noResults  = document.getElementById('noResults');

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbCat    = document.getElementById('lbCat');
const lbTitle  = document.getElementById('lbTitle');
const lbCounter= document.getElementById('lbCounter');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');

let activeCategory = 'all';
let visibleCards   = [...cards];
let currentIndex   = 0;

// ── Category Filter ───────────────────────────────────────
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    applyFilter();
  });
});

function applyFilter() {
  visibleCards = [];

  cards.forEach((card, i) => {
    const match = activeCategory === 'all' || card.dataset.cat === activeCategory;
    card.classList.remove('hidden', 'fade-in');

    if (!match) {
      card.classList.add('hidden');
    } else {
      visibleCards.push(card);
      // Staggered fade-in
      setTimeout(() => card.classList.add('fade-in'), visibleCards.length * 60);
    }
  });

  noResults.classList.toggle('show', visibleCards.length === 0);
}

// ── Open Lightbox ─────────────────────────────────────────
cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    currentIndex = visibleCards.indexOf(card);
    if (currentIndex === -1) return;
    openLightbox(currentIndex);
  });
});

function openLightbox(idx) {
  const card  = visibleCards[idx];
  const img   = card.querySelector('img');
  const label = card.querySelector('.card-label').textContent;
  const title = card.querySelector('.card-title').textContent;

  lbImg.style.opacity = '0';
  lbImg.src   = img.src.replace('w=800', 'w=1400');
  lbImg.alt   = img.alt;
  lbCat.textContent   = label;
  lbTitle.textContent = title;
  lbCounter.textContent = `${idx + 1} / ${visibleCards.length}`;

  lbImg.onload = () => { lbImg.style.opacity = '1'; };

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  currentIndex = idx;
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % visibleCards.length;
  openLightbox(currentIndex);
}

// ── Lightbox Controls ─────────────────────────────────────
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
lbNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

// Click outside image to close
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ── Keyboard Navigation ───────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

// ── Touch Swipe Support ───────────────────────────────────
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
lightbox.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? showNext() : showPrev();
  }
});

// Init
applyFilter();