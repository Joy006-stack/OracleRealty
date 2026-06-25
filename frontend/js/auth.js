// ============================================
// AUTH — Signup and Login form handling
// ============================================

const API_BASE = 'http://127.0.0.1:5000';

const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-message');
const successMsg = document.getElementById('success-message');

// ---- SIGNUP ----
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessages();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const btn = signupForm.querySelector('.btn-submit');
        const btnText = btn.querySelector('.btn-text');
        btn.disabled = true;
        btnText.textContent = 'Creating account...';

        try {
            const res = await fetch(`${API_BASE}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Could not create account. Please try again.');

            showSuccess('Account created! Taking you to log in...');
            setTimeout(() => { window.location.href = 'login.html'; }, 1600);

        } catch (err) {
            showError(err.message);
            btn.disabled = false;
            btnText.textContent = 'Create account';
        }
    });
}

// ---- LOGIN ----
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessages();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const btn = loginForm.querySelector('.btn-submit');
        const btnText = btn.querySelector('.btn-text');
        btn.disabled = true;
        btnText.textContent = 'Logging in...';

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Invalid email or password.');

            // Save user to localStorage
            localStorage.setItem('oraclerealty-user', JSON.stringify({
                user_id: data.user_id,
                name: data.name,
                email: data.email,
                role: data.role
            }));

            showSuccess(`Welcome back, ${data.name.split(' ')[0]}! Taking you to your dashboard...`);

            // If user was redirected here from a protected page, send them back there
            // Otherwise go to dashboard
            const params = new URLSearchParams(window.location.search);
            const next = params.get('next') || 'dashboard.html';

            setTimeout(() => { window.location.href = next; }, 1600);

        } catch (err) {
            showError(err.message);
            btn.disabled = false;
            btnText.textContent = 'Log in';
        }
    });
}

function showError(msg) {
    if (errorMsg) { errorMsg.textContent = msg; errorMsg.classList.remove('hidden'); }
}
function showSuccess(msg) {
    if (successMsg) { successMsg.textContent = msg; successMsg.classList.remove('hidden'); }
}
function hideMessages() {
    if (errorMsg) errorMsg.classList.add('hidden');
    if (successMsg) successMsg.classList.add('hidden');
}