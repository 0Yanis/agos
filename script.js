// === NAV scroll state ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

// === Scroll reveal (IntersectionObserver) ===
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -56px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// === Staggered delay for grid children ===
document.querySelectorAll('.pillars-grid, .capabilities-grid').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.07}s`;
    });
});

document.querySelectorAll('.principles-row').forEach(row => {
    row.querySelectorAll('.principle').forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
    });
});

// === Roadmap bar animation ===
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.rm-fill').forEach(fill => {
                const target = fill.dataset.width || '0';
                fill.style.width = target + '%';
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const roadmapTable = document.querySelector('.roadmap-table');
if (roadmapTable) barObserver.observe(roadmapTable);

// === Contact form ===
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const data = new FormData(form);

        btn.textContent = 'Sending…';
        btn.disabled = true;

        // Simulate send — replace with real endpoint
        setTimeout(() => {
            btn.style.display = 'none';
            if (successMsg) {
                successMsg.style.display = 'flex';
            }
            form.querySelectorAll('input, select, textarea').forEach(el => {
                el.disabled = true;
            });
        }, 800);
    });
}

// === Smooth anchor scroll (fallback for browsers that don't support CSS scroll-behavior) ===
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = nav ? nav.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});
