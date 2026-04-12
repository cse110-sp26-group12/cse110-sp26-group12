const SYMBOLS = ['🤖', '💾', '⚡', '🧠', '🍄', '🚀'];
const SYMBOL_WEIGHTS = {
    '🤖': 10,  // AI
    '💾': 20,  // Data
    '⚡': 15,  // Compute
    '🧠': 5,   // Model
    '🍄': 30,  // Hallucination (High freq)
    '🚀': 2,   // Hype (Rare)
};

const PAYOUTS = {
    '🚀🚀🚀': 500,
    '🧠🧠🧠': 200,
    '🤖🤖🤖': 100,
    '⚡⚡⚡': 50,
    '💾💾💾': 30,
    '🍄🍄🍄': -50, // Massive Hallucination penalty
};

let credits = 100;
let isSpinning = false;

const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinBtn = document.getElementById('spin-btn');
const refillBtn = document.getElementById('refill-btn');
const creditsDisplay = document.getElementById('credits');
const lastWinDisplay = document.getElementById('last-win');
const statusDisplay = document.getElementById('status');
const logDisplay = document.getElementById('log');

function getRandomSymbol() {
    const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
        if (random < weight) return symbol;
        random -= weight;
    }
    return SYMBOLS[0];
}

function logAction(message, type = 'SYSTEM') {
    const entry = document.createElement('div');
    entry.textContent = `[${type}] ${message}`;
    logDisplay.appendChild(entry);
    logDisplay.scrollTop = logDisplay.scrollHeight;
}

async function spin() {
    if (isSpinning || credits < 10) return;

    isSpinning = true;
    credits -= 10;
    updateUI();
    
    logAction('Initializing Inference...', 'GPU');
    spinBtn.disabled = true;
    statusDisplay.textContent = 'PROCESSING...';
    statusDisplay.classList.remove('error');

    // Start animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Random spin durations
    const results = [];
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 400));
        const symbol = getRandomSymbol();
        results.push(symbol);
        reels[i].classList.remove('spinning');
        reels[i].textContent = symbol;
    }

    evaluate(results);
    isSpinning = false;
    spinBtn.disabled = credits < 10;
    checkGameOver();
}

function evaluate(results) {
    const combo = results.join('');
    let winAmount = 0;

    if (PAYOUTS[combo]) {
        winAmount = PAYOUTS[combo];
    } else {
        // Check for partials or specific "mock" conditions
        const mushrooms = results.filter(s => s === '🍄').length;
        if (mushrooms === 1) {
            logAction('Minor Hallucination detected. Output filtered.', 'WARP');
        } else if (mushrooms === 2) {
            logAction('Logic Error: Model convinced itself 2+2=5.', 'CRITICAL');
            winAmount = -20;
        }

        // 2 of a kind (non-mushrooms)
        const counts = {};
        results.forEach(s => counts[s] = (counts[s] || 0) + 1);
        for (const [symbol, count] of Object.entries(counts)) {
            if (count === 2 && symbol !== '🍄') {
                winAmount = 15;
                logAction(`Partial Match: ${symbol} recovery successful.`, 'SYSTEM');
            }
        }
    }

    if (winAmount > 0) {
        credits += winAmount;
        lastWinDisplay.textContent = winAmount;
        logAction(`Inference Success! Gained ${winAmount} credits.`, 'REWARD');
        statusDisplay.textContent = 'OPTIMAL';
    } else if (winAmount < 0) {
        credits += winAmount; // winAmount is negative
        logAction(`GPU Crash! Lost ${Math.abs(winAmount)} credits to cooling costs.`, 'FAIL');
        statusDisplay.textContent = 'GLITCH';
        statusDisplay.classList.add('error');
    } else {
        logAction('Tokens generated: Pure Gibberish. No value.', 'FAIL');
        statusDisplay.textContent = 'UNSTABLE';
    }

    updateUI();
}

function updateUI() {
    creditsDisplay.textContent = credits;
    if (credits < 10) {
        statusDisplay.textContent = 'LOW COMPUTE';
        statusDisplay.classList.add('error');
    }
}

function checkGameOver() {
    if (credits < 10) {
        logAction('FATAL: Out of compute credits. Inference halted.', 'SYS');
        refillBtn.classList.remove('hidden');
        spinBtn.classList.add('hidden');
    }
}

function refill() {
    logAction('Pitching to VCs... "AI but for Cats"...', 'HYPE');
    setTimeout(() => {
        logAction('Seed Round Closed! +100 Credits.', 'VC');
        credits += 100;
        refillBtn.classList.add('hidden');
        spinBtn.classList.remove('hidden');
        spinBtn.disabled = false;
        statusDisplay.textContent = 'FUNDED';
        statusDisplay.classList.remove('error');
        updateUI();
    }, 1500);
}

spinBtn.addEventListener('click', spin);
refillBtn.addEventListener('click', refill);
