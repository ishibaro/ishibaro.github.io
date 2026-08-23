/* ============================================
   slideshow.js — Hero background slideshow
   Used only on index.html
   ============================================ */

(function () {
    'use strict';

    const slides = Array.from(document.querySelectorAll('.ix-bg-slide'));
    const dotsEl = document.querySelector('.ix-dots');
    if (!slides.length) return;

    // Pre-load background images
    slides.forEach(el => {
        el.style.backgroundImage = `url("${el.dataset.src}")`;
    });

    // Build dot indicators
    const dots = slides.map((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'ix-dot';
        btn.setAttribute('aria-label', `Image ${i + 1}`);
        btn.addEventListener('click', () => { goTo(i); clearInterval(timer); });
        if (dotsEl) dotsEl.appendChild(btn);
        return btn;
    });

    // Pick random start, different from last visit
    const lastIdx = parseInt(localStorage.getItem('ix-last-slide') || '-1', 10);
    const pool    = slides.map((_, i) => i).filter(i => i !== lastIdx);
    let current   = pool[Math.floor(Math.random() * pool.length)];

    function goTo(idx) {
        slides[current].classList.remove('active');
        if (dots[current]) dots[current].classList.remove('active');
        current = idx;
        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
        localStorage.setItem('ix-last-slide', String(current));
    }

    function next() { goTo((current + 1) % slides.length); }

    goTo(current);

    let timer = setInterval(next, 5000);

    // Pause on hover
    const hero = document.querySelector('.ix-hero');
    if (hero) {
        hero.addEventListener('mouseenter', () => clearInterval(timer));
        hero.addEventListener('mouseleave', () => { timer = setInterval(next, 5000); });
    }
})();
