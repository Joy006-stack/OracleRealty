// ============================================
// UPGRADE.JS — Payment form with per-field validation
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    const paymentForm = document.getElementById('payment-form');
    const paymentSuccess = document.getElementById('payment-success');
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    const cardholderInput = document.getElementById('cardholder');
    const billingEmailInput = document.getElementById('billing-email');
    const cardIcon = document.getElementById('card-icon');

    // ---- AUTO-FORMAT CARD NUMBER ----
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 16);
            const parts = value.match(/.{1,4}/g) || [];
            e.target.value = parts.join(' ');
            cardIcon.textContent = '💳';
            clearFieldError('card-number');
        });
    }

    // ---- AUTO-FORMAT EXPIRY ----
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 4);
            if (value.length >= 3) {
                e.target.value = `${value.substring(0, 2)} / ${value.substring(2)}`;
            } else {
                e.target.value = value;
            }
            clearFieldError('expiry');
        });
    }

    // ---- CVV: digits only ----
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
            clearFieldError('cvv');
        });
    }

    if (cardholderInput) {
        cardholderInput.addEventListener('input', () => clearFieldError('cardholder'));
    }
    if (billingEmailInput) {
        billingEmailInput.addEventListener('input', () => clearFieldError('billing-email'));
    }

    // ---- FORM SUBMISSION ----
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear all previous errors first
            ['cardholder', 'card-number', 'expiry', 'cvv', 'billing-email'].forEach(clearFieldError);

            const cardholder = cardholderInput.value.trim();
            const cardNumber = cardNumberInput.value.replace(/\s/g, '');
            const expiry = expiryInput.value;
            const cvv = cvvInput.value;
            const billingEmail = billingEmailInput.value.trim();

            let hasError = false;

            if (cardholder.length < 2) {
                setFieldError('cardholder');
                hasError = true;
            }
            if (cardNumber.length !== 16) {
                setFieldError('card-number');
                hasError = true;
            }
            if (!/^\d{2}\s\/\s\d{2}$/.test(expiry)) {
                setFieldError('expiry');
                hasError = true;
            } else {
                // Check expiry isn't in the past
                const [mm, yy] = expiry.split(' / ').map(Number);
                const now = new Date();
                const currentYY = now.getFullYear() % 100;
                const currentMM = now.getMonth() + 1;
                if (mm < 1 || mm > 12 || yy < currentYY || (yy === currentYY && mm < currentMM)) {
                    setFieldError('expiry');
                    hasError = true;
                }
            }
            if (cvv.length < 3) {
                setFieldError('cvv');
                hasError = true;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail)) {
                setFieldError('billing-email');
                hasError = true;
            }

            if (hasError) {
                // Scroll to the first error field
                const firstError = document.querySelector('.form-group.has-error');
                if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            const payBtn = document.getElementById('pay-btn');
            const btnText = payBtn.querySelector('.btn-text');
            payBtn.disabled = true;
            btnText.textContent = 'Processing...';

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1400));

            // Mark user as Pro
            const storedUser = localStorage.getItem('oraclerealty-user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                user.role = 'pro';
                user.trial_started = new Date().toISOString();
                localStorage.setItem('oraclerealty-user', JSON.stringify(user));
            }

            paymentForm.classList.add('hidden');
            if (paymentSuccess) paymentSuccess.classList.remove('hidden');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2200);
        });
    }

    function setFieldError(fieldId) {
        const group = document.getElementById(`group-${fieldId}`);
        if (group) group.classList.add('has-error');
    }

    function clearFieldError(fieldId) {
        const group = document.getElementById(`group-${fieldId}`);
        if (group) group.classList.remove('has-error');
    }
});