
const predictForm = document.getElementById('predict-form');
const errorMessage = document.getElementById('error-message');
const resultDiv = document.getElementById('result');
const resultValue = document.getElementById('result-value');
const resultBar = document.getElementById('result-bar');
const emptyResult = document.getElementById('empty-result');
const resultLocation = document.getElementById('result-location');
const resultSize = document.getElementById('result-size');
const resultConfig = document.getElementById('result-config');
const resultPpsf = document.getElementById('result-ppsf');

if (predictForm) {
    predictForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (errorMessage) errorMessage.classList.add('hidden');
        if (resultDiv) resultDiv.classList.add('hidden');
        if (emptyResult) emptyResult.classList.add('hidden');
        if (resultBar) resultBar.classList.remove('animate');

        const location = document.getElementById('location').value;
        const sqft = document.getElementById('sqft').value;
        const bath = document.getElementById('bath').value;
        const bhk = document.getElementById('bhk').value;

        const submitBtn = predictForm.querySelector('.btn-submit');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Calculating...';

        try {
            const response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location, sqft, bath, bhk })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');

            const price = data.predicted_price;

            if (resultLocation) resultLocation.textContent = location;
            if (resultSize) resultSize.textContent = `${Number(sqft).toLocaleString()} sq ft`;
            if (resultConfig) resultConfig.textContent = `${bhk} BHK · ${bath} bath`;
            if (resultPpsf) {
                const ppsf = ((price * 100000) / sqft).toFixed(0);
                const ppsfKsh = inrToKsh(ppsf);
                resultPpsf.textContent = `₹${Number(ppsf).toLocaleString()} (${ppsfKsh}) / sqft`;
            }

            if (resultDiv) resultDiv.classList.remove('hidden');
            setTimeout(() => { if (resultBar) resultBar.classList.add('animate'); }, 60);
            animateNumber(price, resultValue);
            saveToHistory({ location, sqft, bath, bhk, price });

        } catch (error) {
            if (errorMessage) {
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('hidden');
            }
            if (emptyResult) emptyResult.classList.remove('hidden');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Get estimate';
        }
    });
}

// Tick-up number animation — shows both INR (Lakhs) and KSh
function animateNumber(target, element) {
    if (!element) return;
    const duration = 900;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = (target * eased);
        const kshValue = lakhsToKsh(current);
        element.innerHTML = `₹${current.toFixed(2)} Lakhs <span class="result-ksh">(${kshValue})</span>`;
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            const finalKsh = lakhsToKsh(target);
            element.innerHTML = `₹${target} Lakhs <span class="result-ksh">(${finalKsh})</span>`;
        }
    }

    requestAnimationFrame(tick);
}

// Save each estimate to localStorage for the history tab
function saveToHistory(entry) {
    const key = 'oraclerealty-history';
    const raw = localStorage.getItem(key);
    const history = raw ? JSON.parse(raw) : [];

    history.unshift({
        ...entry,
        timestamp: new Date().toISOString()
    });

    const trimmed = history.slice(0, 10);
    localStorage.setItem(key, JSON.stringify(trimmed));

    if (typeof renderHistory === 'function') renderHistory();
}