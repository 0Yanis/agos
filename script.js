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

function setFieldError(el, msg) {
    el.classList.add('invalid');
    let span = el.parentElement.querySelector('.field-error-msg');
    if (!span) {
        span = document.createElement('span');
        span.className = 'field-error-msg';
        el.after(span);
    }
    span.textContent = msg;
}

function clearFieldError(el) {
    el.classList.remove('invalid');
    const span = el.parentElement.querySelector('.field-error-msg');
    if (span) span.remove();
}

function validateForm() {
    let valid = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fields = [
        { el: form.querySelector('#name'),     msg: 'Απαιτείται όνομα.' },
        { el: form.querySelector('#firm'),     msg: 'Απαιτείται επωνυμία.' },
        { el: form.querySelector('#vertical'), msg: 'Επιλέξτε κλάδο.' },
    ];

    fields.forEach(({ el, msg }) => {
        if (!el.value.trim()) { setFieldError(el, msg); valid = false; }
        else clearFieldError(el);
    });

    const emailEl = form.querySelector('#email');
    if (!emailEl.value.trim()) {
        setFieldError(emailEl, 'Απαιτείται email.');
        valid = false;
    } else if (!emailRe.test(emailEl.value.trim())) {
        setFieldError(emailEl, 'Μη έγκυρη διεύθυνση email.');
        valid = false;
    } else {
        clearFieldError(emailEl);
    }

    return valid;
}

if (form) {
    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', () => clearFieldError(el));
        el.addEventListener('change', () => clearFieldError(el));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Αποστολή…';
        btn.disabled = true;

        try {
            const res = await fetch('https://formspree.io/f/mrevzrql', {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                btn.style.display = 'none';
                if (successMsg) successMsg.style.display = 'flex';
                form.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
            } else {
                btn.textContent = 'Σφάλμα — δοκιμάστε ξανά';
                btn.disabled = false;
            }
        } catch {
            btn.textContent = 'Σφάλμα — δοκιμάστε ξανά';
            btn.disabled = false;
        }
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
