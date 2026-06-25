// ============================================
// HOME.JS — Homepage interactions
// ============================================

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.classList.add('visible'); }, i * 75);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => observer.observe(el));
}

// ---- ANIMATE HERO PRICE PREVIEW CARD ON LOAD ----
window.addEventListener('DOMContentLoaded', () => {
    const ppcBar = document.querySelector('.ppc__bar');
    if (ppcBar) {
        ppcBar.style.width = '0%';
        ppcBar.style.transition = 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => { ppcBar.style.width = '72%'; }, 600);
    }

    const ppcPrice = document.querySelector('.ppc__price');
    if (ppcPrice) {
        const target = 74.38;
        const duration = 1000;
        const start = performance.now();
        ppcPrice.textContent = '₹0.00 Lakhs';
        setTimeout(() => {
            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                ppcPrice.textContent = `₹${(target * eased).toFixed(2)} Lakhs`;
                if (progress < 1) requestAnimationFrame(tick);
                else ppcPrice.textContent = `₹${target} Lakhs`;
            }
            requestAnimationFrame(tick);
        }, 500);
    }

    // ---- FOOTER DASHBOARD LINKS: CHECK LOGIN FIRST ----
    // Any link that goes to dashboard.html in the footer or anywhere on this page
    // gets intercepted — if not logged in, redirect to login instead
    document.querySelectorAll('a[href="dashboard.html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const user = localStorage.getItem('oraclerealty-user');
            if (!user) {
                e.preventDefault();
                window.location.href = 'login.html?next=dashboard.html';
            }
            // If logged in, allow the default navigation to dashboard.html
        });
    });
});