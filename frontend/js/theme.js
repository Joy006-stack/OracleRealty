const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('.theme-toggle__icon') : null;

const savedTheme = localStorage.getItem('oraclerealty-theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    if (themeIcon) updateIcon(savedTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('oraclerealty-theme', next);
        if (themeIcon) updateIcon(next);
    });
}

function updateIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
}