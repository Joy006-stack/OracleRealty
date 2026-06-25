
const INR_TO_KSH_RATE = 1.54;

// Convert a price in Lakhs (Indian unit, 1 Lakh = 100,000 INR) to KSh
// Returns a formatted string like "KSh 11,453,800"
function lakhsToKsh(lakhs) {
    const inr = lakhs * 100000;
    const ksh = inr * INR_TO_KSH_RATE;
    return formatKsh(ksh);
}

// Convert a plain INR amount (not in lakhs) to KSh
function inrToKsh(inr) {
    const ksh = inr * INR_TO_KSH_RATE;
    return formatKsh(ksh);
}

// Format a number as KSh with thousands separators
function formatKsh(amount) {
    return 'KSh ' + Math.round(amount).toLocaleString('en-KE');
}