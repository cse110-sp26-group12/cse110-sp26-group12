/**
 * GPT-9 TOKEN BURNER - Core Logic
 */

// --- CONFIGURATION ---
const SYMBOLS = [
    { char: '🧠', weight: 5,  value: 100, label: 'AGI' },
    { char: '⚡', weight: 10, value: 50,  label: 'GPU Cluster' },
    { char: '🤖', weight: 15, value: 20,  label: 'LLM Agent' },
    { char: '🪙', weight: 20, value: 10,  label: 'Token' },
    { char: '☕', weight: 25, value: 5,   label: 'Coffee' },
    { char: '⚠️', weight: 15, value: 0,   label: 'Hallucination' },
    { char: '👾', weight: 10, value: 0,   label: 'Glitch' }
];

const LOG_MESSAGES = [
    "Scraping Reddit for training data...",
    "Overfitting on random noise...",
    "Adding .ai to the domain name. +$10M valuation.",
    "Hiring 500 prompt engineers.",
    "Scaling GPU cluster to 10k H100s.",
    "Synthetic data looks like garbage. Perfect.",
    "AGI achieved (it's just a 1000-line if statement).",
    "Raising Series B at a $4B valuation.",
    "Model is hallucinating about the moon.",
    "Burning tokens to generate more tokens.",
    "Found a local minimum. Stuck forever.",
    "User asked for a poem. Model gave a death threat.",
    "Sam Altman spotted in a trench coat."
];

// --- STATE ---
let credits = 10000;
let valuation = 0;
let temperature = 0.2;
let isSpinning = false;
let baseBet = 100;

// --- DOM ELEMENTS ---
const creditsEl = document.getElementById('credits');
const valuationEl = document.getElementById('valuation');
const tempSlider = document.getElementById('temp-slider');
const tempDisplay = document.getElementById('temp-display');
const betAmountEl = document.getElementById('bet-amount');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const logsContainer = document.getElementById('logs');
const strips = [
    document.querySelector('#reel-1 .strip'),
    document.querySelector('#reel-2 .strip'),
    document.querySelector('#reel-3 .strip')
];

// --- INITIALIZATION ---
function init() {
    // Fill strips with initial random symbols
    strips.forEach(strip => {
        for (let i = 0; i < 20; i++) {
            addSymbol(strip, getRandomSymbol());
        }
    });
    updateUI();
}

function getRandomSymbol() {
    // Adjust weights based on temperature (high temp = more glitched symbols)
    const tempFactor = temperature * 20;
    const adjustedSymbols = SYMBOLS.map(s => ({
        ...s,
        currentWeight: (s.value === 0) ? (s.weight + tempFactor) : s.weight
    }));

    const totalWeight = adjustedSymbols.reduce((sum, s) => sum + s.currentWeight, 0);
    let rand = Math.random() * totalWeight;
    
    for (const s of adjustedSymbols) {
        if (rand < s.currentWeight) return s;
        rand -= s.currentWeight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

function addSymbol(strip, symbol, atTop = false) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = symbol.char;
    div.dataset.value = symbol.value;
    div.dataset.label = symbol.label;
    
    if (atTop) {
        strip.prepend(div);
    } else {
        strip.appendChild(div);
    }
}

// --- CORE ACTIONS ---
async function spin() {
    const bet = Math.floor(baseBet * (1 + temperature * 5));
    if (isSpinning || credits < bet) return;

    isSpinning = true;
    credits -= bet;
    updateUI();
    log(`Burning ${bet} tokens for inference...`);

    const results = [];
    const spinPromises = strips.map((strip, index) => {
        return new Promise(resolve => {
            const targetSymbol = getRandomSymbol();
            results.push(targetSymbol);

            // Add the winning symbol to the top
            addSymbol(strip, targetSymbol, true);
            
            // Animation logic
            const duration = 2 + index * 0.5;
            strip.style.transition = 'none';
            strip.style.transform = 'translateY(-100px)';
            
            // Force reflow
            strip.offsetHeight;

            strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = 'translateY(0)';

            setTimeout(resolve, duration * 1000);
        });
    });

    await Promise.all(spinPromises);
    isSpinning = false;
    checkWin(results, bet);
}

function checkWin(results, bet) {
    const [s1, s2, s3] = results;
    let winMultiplier = 0;
    let message = "";

    // Win Logic
    if (s1.char === s2.char && s2.char === s3.char) {
        // 3 of a kind
        if (s1.value > 0) {
            winMultiplier = s1.value;
            message = `JACKPOT! ${s1.label} alignment achieved.`;
            flashReels();
        } else {
            message = `TOTAL COLLAPSE. Model ${s1.label}ed.`;
        }
    } else if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
        // 2 of a kind
        const match = (s1.char === s2.char) ? s1 : (s2.char === s3.char ? s2 : s1);
        if (match.value > 0) {
            winMultiplier = Math.floor(match.value / 2);
            message = `Synergy detected: ${match.label} integration.`;
        } else {
            message = `Partial hallucination in output.`;
        }
    } else {
        // No match - random log
        message = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
    }

    if (winMultiplier > 0) {
        const winAmount = bet * winMultiplier;
        credits += winAmount;
        valuation += winAmount * 10;
        log(`WIN: +${winAmount} tokens. ${message}`);
    } else {
        log(message);
    }

    updateUI();
}

// --- UI UPDATES ---
function updateUI() {
    creditsEl.textContent = credits.toLocaleString();
    valuationEl.textContent = `$${valuation.toLocaleString()}`;
    
    const bet = Math.floor(baseBet * (1 + temperature * 5));
    betAmountEl.textContent = bet;

    const tempVal = (temperature).toFixed(1);
    let status = "Stable";
    if (temperature > 0.4) status = "Creative";
    if (temperature > 0.7) status = "Hallucinating";
    if (temperature > 0.9) status = "CHAOS";
    tempDisplay.textContent = `${tempVal} / ${status}`;

    spinBtn.disabled = credits < bet || isSpinning;
}

function log(msg) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.textContent = `> ${msg}`;
    logsContainer.prepend(div);
    
    // Keep logs manageable
    if (logsContainer.children.length > 50) {
        logsContainer.removeChild(logsContainer.lastChild);
    }
}

function flashReels() {
    strips.forEach(s => s.classList.add('winning-strip'));
    setTimeout(() => {
        strips.forEach(s => s.classList.remove('winning-strip'));
    }, 2000);
}

// --- EVENT LISTENERS ---
spinBtn.addEventListener('click', spin);

tempSlider.addEventListener('input', (e) => {
    temperature = e.target.value / 100;
    updateUI();
});

resetBtn.addEventListener('click', () => {
    if (confirm("Execute pivot? This will reset valuation and credits.")) {
        credits = 10000;
        valuation = 0;
        temperature = 0.2;
        tempSlider.value = 20;
        logsContainer.innerHTML = '<div class="log-entry">> Series A Pivot complete. Tokens minted.</div>';
        updateUI();
    }
});

// START
init();
