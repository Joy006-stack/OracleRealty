// ============================================
// NAVBAR — Show logged-in user + logout link + Pro badge
// ============================================

const navbarUser = document.getElementById('navbar-user');
const navbarLinks = document.querySelector('.navbar__links');

const storedUser = localStorage.getItem('oraclerealty-user');

if (storedUser && navbarUser && navbarLinks) {
    const user = JSON.parse(storedUser);
    const isPro = user.role === 'pro';

    // Hide Log In and Sign Up links
    const loginLink = navbarLinks.querySelector('a[href="login.html"]');
    const signupLink = navbarLinks.querySelector('a[href="signup.html"]');
    if (loginLink) loginLink.classList.add('hidden');
    if (signupLink) signupLink.classList.add('hidden');

    // Show first name, with Pro badge if applicable
    const firstName = user.name ? user.name.split(' ')[0] : 'You';
    navbarUser.innerHTML = isPro
        ? `Hi, ${firstName} <span class="navbar__pro-badge">PRO</span>`
        : `Hi, ${firstName}`;
    navbarUser.classList.remove('hidden');

    // Add logout link
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.textContent = 'Log out';
    logoutLink.className = 'navbar__logout';
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('oraclerealty-user');
        window.location.href = 'index.html';
    });
    navbarUser.insertAdjacentElement('afterend', logoutLink);
}