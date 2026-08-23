/* ============================================
   main.js — iRO · Israel Hinojosa Baliño
   Handles: theme, language (i18n via strings.json),
   nav injection, quotes (quotes.json),
   scroll-reveal, responsive nav toggle.
   ============================================ */

'use strict';

// ── Cached strings and current state ──────────
let STRINGS = null;
let CURRENT_LANG = localStorage.getItem('selectedLanguage') || 'en';
let CURRENT_PAGE = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

// ── 1. THEME ──────────────────────────────────
function applyTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    const checkbox = document.getElementById('checkbox');
    if (checkbox) checkbox.checked = (theme === 'dark');
}

function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);

    // Bind checkbox — may not exist yet if nav is injected later,
    // so we use event delegation on document
    document.addEventListener('change', (e) => {
        if (e.target && e.target.id === 'checkbox') {
            const isDark = document.body.classList.contains('dark-theme');
            const next = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', next);
            applyTheme(next);
        }
    });
}

// ── 2. LANGUAGE / i18n ────────────────────────
function applyLanguage(lang) {
    CURRENT_LANG = lang;
    localStorage.setItem('selectedLanguage', lang);

    // Fill all [data-i18n] elements
    if (STRINGS) fillStrings();

    // Update lang buttons
    document.querySelectorAll('.nav-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// Called from nav buttons: onclick="setLanguage('en')"
window.setLanguage = function(lang) {
    applyLanguage(lang);
};

function fillStrings() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;           // e.g. "index.title"
        const [section, field] = key.split('.');
        const entry = STRINGS[section] && STRINGS[section][field];
        if (!entry) return;
        const text = entry[CURRENT_LANG] || entry['en'];
        // Use innerHTML to support <br> and <em> in strings
        el.innerHTML = text;
    });
}

// ── 3. NAV INJECTION ──────────────────────────
function buildNav() {
    if (!STRINGS) return;
    const s = STRINGS.nav;
    const p = CURRENT_PAGE;

    const links = [
        { key: 'home',      href: './index.html' },
        { key: 'services',  href: './services.html' },
        { key: 'profile',   href: './profile.html' },
        { key: 'portfolio', href: './portfolio.html' },
        { key: 'store',     href: './store.html' },
        { key: 'contact',   href: './contact.html', id: 'yellow' },
    ];

    const linksHTML = links.map(l => {
        const label   = s[l.key][CURRENT_LANG] || s[l.key]['en'];
        const active  = p === l.key ? ' active' : '';
        const idAttr  = l.id ? ` id="${l.id}"` : '';
        return `<a class="${active}"${idAttr} href="${l.href}">${label}</a>`;
    }).join('\n');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isChecked  = savedTheme === 'dark' ? 'checked' : '';

    const navHTML = `
<nav class="topnav" id="myTopnav">
    ${linksHTML}
    <div class="nav-controls-item">
        <div class="nav-lang-selector">
            <button class="nav-lang-btn${CURRENT_LANG === 'en' ? ' active' : ''}"
                    data-lang="en" onclick="setLanguage('en')">EN</button>
            <button class="nav-lang-btn${CURRENT_LANG === 'es' ? ' active' : ''}"
                    data-lang="es" onclick="setLanguage('es')">ES</button>
        </div>
        <input type="checkbox" class="checkbox" id="checkbox" ${isChecked}>
        <label for="checkbox" class="checkbox-label">
            <i class="fas fa-moon"></i>
            <i class="fas fa-sun"></i>
            <span class="ball"></span>
        </label>
    </div>
    <a href="javascript:void(0);" class="icon" onclick="ResponsiveNav()">
        <i class="fa fa-bars"></i>
    </a>
</nav>`;

    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) placeholder.outerHTML = navHTML;
}

// ── 4. RESPONSIVE NAV TOGGLE ──────────────────
window.ResponsiveNav = function() {
    const nav = document.getElementById('myTopnav');
    if (!nav) return;
    nav.classList.toggle('responsive');
};

// ── 5. QUOTES ─────────────────────────────────
function loadQuote(quotes) {
    const el = document.getElementById('quote-block');
    if (!el || !quotes.length) return;

    const lastIdx = parseInt(localStorage.getItem('last-quote') || '-1', 10);
    const pool    = quotes.map((_, i) => i).filter(i => i !== lastIdx);
    const idx     = pool[Math.floor(Math.random() * pool.length)];
    const q       = quotes[idx];

    localStorage.setItem('last-quote', String(idx));

    const workPart = q.work ? `, <cite>${q.work}</cite>` : '';
    el.innerHTML = `
        <p>${q.text}</p>
        <footer>— ${q.author}${workPart}</footer>`;
}

// ── 6. SCROLL REVEAL ──────────────────────────
function initScrollReveal() {
    const els = document.querySelectorAll('.sv-block, .pf-stratum');
    if (!els.length || !window.IntersectionObserver) {
        els.forEach(el => el.classList.add('visible'));
        return;
    }
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach((el, i) => {
        el.style.transitionDelay = (i * 0.06) + 's';
        obs.observe(el);
    });
}

// ── 7. BOOT ───────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

// Aplicar tema e idioma INMEDIATAMENTE, sin esperar el fetch
    initTheme();
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    document.body.setAttribute('data-lang', savedLang);
    CURRENT_LANG = savedLang;


    // Determine base path (works on GitHub Pages subdirectory too)
    const base = document.querySelector('meta[name="base-path"]')?.content || '.';

    try {
        // Load strings and quotes in parallel
        const [strRes, quotesRes] = await Promise.all([
            fetch(`${base}/assets/data/strings.json`),
            fetch(`${base}/assets/data/quotes.json`)
        ]);

        STRINGS = await strRes.json();
        const quotes = await quotesRes.json();

        // Inject nav (uses STRINGS)
        buildNav();

        // Apply language (fills data-i18n elements)
        applyLanguage(CURRENT_LANG);

        // Random quote
        loadQuote(quotes);

    } catch (err) {
        console.warn('iRO: could not load data files.', err);
        // Fallback: inject nav without translations
        buildNav();
    }

    // Scroll reveal (works regardless of fetch)
    initScrollReveal();
});
