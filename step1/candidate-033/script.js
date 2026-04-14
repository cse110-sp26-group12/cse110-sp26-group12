const SYMBOLS = ['🦄', '🤖', '🧠', '📈', '💸', '🗑️'];
const PAYOUTS = {
    '🦄': 5000,
    '🤖': 1000,
    '🧠': 500,
    '📈': 250,
    '💸': 100
};
const SPIN_COST = 50;
const SYMBOL_HEIGHT = 100; // matching CSS .symbol height

const LOADING_MESSAGES = [
    "Training weights...",
    "Generating hallucinations...",
    "Aligning with human values...",
    "Optimizing GPU cluster...",
    "Scraping the open web...",
    "Pivoting to Blockchain...",
    "Reducing context window...",
    "Minimizing loss function...",
    "Increasing temperature...",
    "Disrupting traditional industries..."
];

const WIN_MESSAGES = [
    "Series A Secured!",
    "Unicorn Status Achieved!",
    "AGI Achieved internally!",
    "Acquired by Big Tech!",
    "Successfully pivoted!",
    "Hype cycle peak reached!"
];

const LOSS_MESSAGES = [
    "Model collapsed.",
    "GPUs overheated.",
    "Compute exhausted.",
    "Funding dried up.",
    "Token limit reached.",
    "Hallucination detected."
];

let tokens = 1000;
let valuation = 0;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const valuationDisplay = document.getElementById('valuation');
const statusDisplay = document.getElementById('status-text');
const spinBtn = document.getElementById('spin-btn');
const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];
const toastContainer = document.getElementById('toast-container');

// Initialize reels
function initReels() {
    reelStrips.forEach(strip => {
        // Create a long strip of symbols for the illusion of spinning
        for (let i = 0; i < 30; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'symbol';
            symbol.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            strip.appendChild(symbol);
        }
    });
}

function updateStats() {
    tokenDisplay.textContent = tokens;
    valuationDisplay.textContent = `$${valuation.toLocaleString()}`;
    
    if (tokens < SPIN_COST) {
        spinBtn.disabled = true;
        spinBtn.textContent = "Insolvent - Need Seed Funding";
    } else {
        spinBtn.disabled = false;
        spinBtn.textContent = `Deploy Model (${SPIN_COST} Tokens)`;
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function spin() {
    if (isSpinning || tokens < SPIN_COST) return;

    isSpinning = true;
    tokens -= SPIN_COST;
    updateStats();
    
    spinBtn.disabled = true;
    statusDisplay.textContent = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];

    const results = [];
    const spinPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
            results.push(SYMBOLS[randomIndex]);
            
            // The reel will land on the randomIndex-th symbol from the top
            // But we want it to spin a lot first. 
            // We'll reset the position instantly, then animate to a large offset.
            
            // Reset to top without transition
            strip.style.transition = 'none';
            strip.style.transform = 'translateY(0)';
            
            // Force reflow
            strip.offsetHeight;
            
            // Animate to target
            // We add 20 symbols of travel to make it look fast
            const travel = 20 + randomIndex;
            const finalOffset = -(travel * SYMBOL_HEIGHT);
            
            strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = `translateY(${finalOffset}px)`;
            
            // Update the last symbol of the travel to be our result so it looks right when it stops
            strip.children[travel].textContent = SYMBOLS[randomIndex];

            setTimeout(resolve, (2 + index * 0.5) * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    calculateWin(results);
    isSpinning = false;
    updateStats();
}

function calculateWin(results) {
    const [s1, s2, s3] = results;
    let winAmount = 0;
    let message = "";

    if (s1 === s2 && s2 === s3) {
        // 3 of a kind
        if (s1 === '🗑️') {
            message = "Total Hallucination. 0 Payout.";
        } else {
            winAmount = PAYOUTS[s1];
            message = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
            valuation += winAmount * 1000;
        }
    } else if (s1 !== '🗑️' && s2 !== '🗑️' && s3 !== '🗑️') {
        // Any 3 non-trash
        winAmount = 25;
        message = "Market Synergy Detected!";
        valuation += winAmount * 100;
    } else {
        message = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
    }

    if (winAmount > 0) {
        tokens += winAmount;
        showToast(`+${winAmount} Tokens! ${message}`);
        statusDisplay.textContent = `SUCCESS: ${message}`;
        statusDisplay.style.color = 'var(--accent)';
    } else {
        statusDisplay.textContent = message;
        statusDisplay.style.color = 'var(--text-light)';
    }
}

spinBtn.addEventListener('click', spin);

// Init
initReels();
updateStats();