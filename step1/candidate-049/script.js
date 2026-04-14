const SYMBOLS = [
    { char: '🤖', value: 5, weight: 10, name: 'Base Model' },
    { char: '⚡', value: 10, weight: 7, name: 'H100 GPU' },
    { char: '🍄', value: 15, weight: 5, name: 'Hallucination' },
    { char: '👁️', value: 50, weight: 2, name: 'The Visionary' },
    { char: '📉', value: 100, weight: 1, name: 'Venture Capital' }
];

const LOG_MESSAGES = [
    "Optimizing loss function...",
    "Scaling parameters to 1.7 Trillion...",
    "Injecting synthetic data...",
    "Realigning human values...",
    "Downloading more RAM...",
    "Ignoring safety protocols...",
    "Minimizing transparency...",
    "Successfully hallucinating a profit...",
    "Analyzing stakeholder vibes...",
    "Venture capital bridge round secured.",
    "Training on copyrighted material..."
];

let credits = 1000;
let currentBet = 10;
let isSpinning = false;

// DOM Elements
const creditsDisplay = document.getElementById('credits');
const lastWinDisplay = document.getElementById('last-win');
const betDisplay = document.getElementById('current-bet');
const spinBtn = document.getElementById('spin-btn');
const vcBtn = document.getElementById('vc-btn');
const betMinus = document.getElementById('bet-minus');
const betPlus = document.getElementById('bet-plus');
const consoleLog = document.getElementById('console-log');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Initialize
function init() {
    updateDisplay();
    addLog("Machine initialized. Weights randomized.");
}

function updateDisplay() {
    creditsDisplay.textContent = Math.floor(credits);
    betDisplay.textContent = currentBet;
    
    const canSpin = credits >= currentBet;
    spinBtn.disabled = isSpinning || !canSpin;
    
    // Show VC button if user is broke
    if (credits < 10 && !isSpinning) {
        vcBtn.style.display = 'block';
        spinBtn.style.display = 'none';
    } else {
        vcBtn.style.display = 'none';
        spinBtn.style.display = 'block';
    }
}

function addLog(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message}`;
    consoleLog.prepend(entry);
    
    // Keep only last 10 logs
    if (consoleLog.children.length > 10) {
        consoleLog.removeChild(consoleLog.lastChild);
    }
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[0];
}

async function spin() {
    if (isSpinning || credits < currentBet) return;

    isSpinning = true;
    credits -= currentBet;
    updateDisplay();
    lastWinDisplay.textContent = "0";

    addLog(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]);

    // Start animation
    reels.forEach(reel => reel.classList.add('spinning'));

    const results = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];

    // Artificial delay for "computation"
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Stop animation and set symbols
    reels.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.textContent = results[i].char;
    });

    calculateWin(results);
    isSpinning = false;
    updateDisplay();
}

function calculateWin(results) {
    let winAmount = 0;
    const [s1, s2, s3] = results;

    // Logic: 3 of a kind
    if (s1.char === s2.char && s2.char === s3.char) {
        winAmount = s1.value * (currentBet / 2);
        addLog(`JACKPOT: ${s1.name} Triple match! +${winAmount} tokens.`);
    } 
    // Logic: 2 of a kind (adjacent)
    else if (s1.char === s2.char || s2.char === s3.char) {
        const matchingSymbol = s1.char === s2.char ? s1 : s2;
        winAmount = matchingSymbol.value * (currentBet / 10);
        addLog(`SUCCESS: Found ${matchingSymbol.name} pattern. +${Math.floor(winAmount)} tokens.`);
    } else {
        addLog("FAILURE: Accuracy too low. Weights adjusted downwards.");
    }

    if (winAmount > 0) {
        credits += winAmount;
        lastWinDisplay.textContent = Math.floor(winAmount);
        lastWinDisplay.style.color = 'var(--accent-color)';
    } else {
        lastWinDisplay.style.color = 'var(--danger-color)';
    }
}

// Event Listeners
spinBtn.addEventListener('click', spin);

vcBtn.addEventListener('click', () => {
    credits = 1000;
    currentBet = 10;
    addLog("PIVOT SUCCESSFUL: Bridge round secured. Scaling back up.");
    updateDisplay();
});

betMinus.addEventListener('click', () => {
    if (currentBet > 10) {
        currentBet -= 10;
        updateDisplay();
    }
});

betPlus.addEventListener('click', () => {
    if (credits >= currentBet + 10) {
        currentBet += 10;
        updateDisplay();
    }
});

init();
