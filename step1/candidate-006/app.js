/**
 * AI Hype Slot Machine - Core Logic
 */

const SYMBOLS = [
    { char: '💸', val: 50, label: 'VENTURE CAPITAL' },
    { char: '🚀', val: 20, label: 'HYPE TRAIN' },
    { char: '🤖', val: 10, label: 'LLM AGENT' },
    { char: '🧠', val: 5,  label: 'NEURAL NET' },
    { char: '📉', val: 0,  label: 'GPU SHORTAGE' },
    { char: '💩', val: 0,  label: 'HALLUCINATION' }
];

const LOGS = [
    "Raising Seed round based on a PowerPoint...",
    "Pivot to AI! Valuation triples instantly.",
    "Training model on reddit comments. Oh no.",
    "Hallucinating a sustainable business model...",
    "Venture Capitalists spotted in the lobby!",
    "GPU shortage: Training delayed by 6 months.",
    "Hiring 10 Prompt Engineers for $500k each.",
    "Synthetic data looks suspiciously like real trash.",
    "AGI achieved! (It's just a regex).",
    "Burning tokens to generate more tokens.",
    "Series B closed. We have 0 customers.",
    "Overfitting on yesterday's stock market.",
    "Adding '.ai' to the domain. +$100M valuation."
];

// State
let credits = 1000;
let valuation = 0;
let bet = 10;
let isSpinning = false;

// DOM Elements
const creditsEl = document.getElementById('credits-display');
const valuationEl = document.getElementById('valuation-display');
const betEl = document.getElementById('bet-display');
const spinBtn = document.getElementById('spin-btn');
const betUpBtn = document.getElementById('bet-up');
const resetBtn = document.getElementById('reset-btn');
const logContent = document.getElementById('log-content');
const reelStrips = [
    document.querySelector('#reel1 .reel-strip'),
    document.querySelector('#reel2 .reel-strip'),
    document.querySelector('#reel3 .reel-strip')
];

/**
 * Initialize reels with random symbols
 */
function initReels() {
    reelStrips.forEach(strip => {
        // Fill each strip with 20 random symbols for the initial look
        for (let i = 0; i < 20; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.char;
            strip.appendChild(div);
        }
    });
}

/**
 * Update the UI elements
 */
function updateUI() {
    creditsEl.textContent = credits;
    valuationEl.textContent = `$${valuation}M`;
    betEl.textContent = bet;
    
    if (credits < bet) {
        spinBtn.disabled = true;
        spinBtn.style.opacity = 0.5;
    } else {
        spinBtn.disabled = isSpinning;
        spinBtn.style.opacity = 1;
    }
}

/**
 * Add a message to the terminal
 */
function log(msg) {
    const div = document.createElement('div');
    div.textContent = `> ${msg}`;
    logContent.prepend(div);
    if (logContent.children.length > 20) {
        logContent.removeChild(logContent.lastChild);
    }
}

/**
 * Perform the spin
 */
async function spin() {
    if (isSpinning || credits < bet) return;

    isSpinning = true;
    credits -= bet;
    updateUI();
    log(`Burning ${bet} tokens for inference...`);

    const results = [];

    // Trigger animations for each reel
    const spinPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const randomSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
            const resultSymbol = SYMBOLS[randomSymbolIndex];
            results.push(resultSymbol);

            // Add the final symbol to the top of the strip visually
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = resultSymbol.char;
            strip.prepend(div);

            // Reset transform to 0 immediately (hidden)
            strip.style.transition = 'none';
            strip.style.transform = `translateY(-100px)`;
            
            // Force reflow
            strip.offsetHeight;

            // Animate to position 0
            strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.1, 0.5, 0.1, 1)`;
            strip.style.transform = 'translateY(0)';

            setTimeout(() => resolve(), (2 + index * 0.5) * 1000);
        });
    });

    await Promise.all(spinPromises);

    isSpinning = false;
    checkWin(results);
}

/**
 * Check if the user won
 */
function checkWin(results) {
    const [s1, s2, s3] = results;
    let winAmount = 0;
    let valBump = 0;

    // 3 of a kind
    if (s1.char === s2.char && s2.char === s3.char) {
        if (s1.val > 0) {
            winAmount = s1.val * bet;
            valBump = s1.val * 2;
            log(`JACKPOT! ${s1.label} matched. Valuation up!`);
            flashReels();
        } else {
            log(`TRIPLE ${s1.label}. Total model collapse.`);
        }
    } 
    // 2 of a kind
    else if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
        const match = (s1.char === s2.char) ? s1 : (s2.char === s3.char ? s2 : s1);
        if (match.val > 0) {
            winAmount = Math.floor(match.val * (bet / 2));
            valBump = match.val;
            log(`Synthetic profit: ${match.label} synergy.`);
        }
    } else {
        log(LOGS[Math.floor(Math.random() * LOGS.length)]);
    }

    if (winAmount > 0) {
        credits += winAmount;
        valuation += valBump;
    }

    updateUI();
}

function flashReels() {
    document.querySelector('.reels').classList.add('win-flash');
    setTimeout(() => {
        document.querySelector('.reels').classList.remove('win-flash');
    }, 1500);
}

// Event Listeners
spinBtn.addEventListener('click', spin);

betUpBtn.addEventListener('click', () => {
    if (isSpinning) return;
    bet = bet === 10 ? 50 : (bet === 50 ? 100 : 10);
    log(`Scaling compute to ${bet} tokens/spin.`);
    updateUI();
});

resetBtn.addEventListener('click', () => {
    if (confirm("Burn remaining valuation and start a new Series A?")) {
        credits = 1000;
        valuation = 0;
        bet = 10;
        logContent.innerHTML = '<div>> Series A Funding secured. 1000 tokens minted.</div>';
        updateUI();
    }
});

// Start
initReels();
updateUI();
