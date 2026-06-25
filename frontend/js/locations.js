const API_BASE_URL = 'https://oraclerealty-api.onrender.com';
const locationSelect = document.getElementById('location');

async function loadLocations() {
    if (!locationSelect) return;
    try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        const data = await response.json();
        data.locations.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc;
            option.textContent = loc;
            locationSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Could not load locations. Is the Flask server running?', error);
    }
}

loadLocations();